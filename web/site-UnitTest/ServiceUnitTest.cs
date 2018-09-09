using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using SiteZ11G.Service.IndividualIncomeTax;
using System.IO;
using System.Net;

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

        [TestMethod]
        public void TestWeixin()
        {
            var appid = "";
            var secret = "";
            var url = $"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={appid}&secret={secret}";
            var request = WebRequest.Create(url);
            request.Method = "GET";
            request.Timeout = 10000;
            request.ContentType = "application/json";

            var response = request.GetResponse();
            StreamReader streamReader = new StreamReader(response.GetResponseStream());
            string responseContent = streamReader.ReadToEnd();
            response.Close();
            streamReader.Close();

            var token = JsonConvert.DeserializeObject<WechatToken>(responseContent);
        }
    }
}
