using Microsoft.VisualStudio.TestTools.UnitTesting;
using SiteZ11G.Service.IndividualIncomeTax;
using SiteZ11G.Utils;
using SiteZ11G.Utils.Web;
using System;

namespace site_UnitTest
{
    [TestClass]
    public class ServiceUnitTest
    {
        [TestMethod]
        public void CalcIndividualIncomeTax()
        {
            var calculatorBefore2018 = Calculator.Create(SiteZ11G.Service.TaxType.Before2018);
            var resultBefore2018 = calculatorBefore2018.Calculate(8000, 1760);
            Assert.AreEqual(resultBefore2018.SumTax, 169m);

            var calculatorAfter2018 = Calculator.Create(SiteZ11G.Service.TaxType.After2018);
            var resultAfter2018 = calculatorAfter2018.Calculate(8000, 1760);
            Assert.AreEqual(resultAfter2018.SumTax, 37.2m);
        }

        class WechatToken
        {
            public string access_token { get; set; }
            public int expires_in { get; set; }
        }

        class WechatTicket
        {
            public int errcode { get; set; }
            public string errmsg { get; set; }
            public string ticket { get; set; }
            public int expires_in { get; set; }
        }

        class WechatSignature
        {
            public string noncestr { get; set; }
            public string jsapi_ticket { get; set; }
            public int timestamp { get; set; }
            public string url { get; set; }
        }

        [TestMethod]
        public void TestWeixin()
        {
            var appid = "";
            var secret = "";
            var url = $"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={appid}&secret={secret}";
            var token = Rest.Get<WechatToken>(url);

            url = $"https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token={token.access_token}&type=jsapi";
            var ticket = Rest.Get<WechatTicket>(url);

            var destUrl = string.Empty;

            var signature = new WechatSignature();
            signature.noncestr = DateTime.Now.ToString("yyyyMMddHHmmss");
            signature.jsapi_ticket = ticket.ticket;
            signature.timestamp = (int)(DateTime.Now.Ticks / 1000);
            signature.url = destUrl;

            var sourceString = string.Join("&",
                $"{nameof(signature.noncestr)}={signature.noncestr}",
                $"{nameof(signature.jsapi_ticket)}={signature.jsapi_ticket}",
                $"{nameof(signature.timestamp)}={signature.timestamp}",
                $"{nameof(signature.url)}={signature.url}");
            var signatureSha1 = Alogrithm.Sha1(sourceString);
        }
    }
}
