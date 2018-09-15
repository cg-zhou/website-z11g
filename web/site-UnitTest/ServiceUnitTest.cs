using Microsoft.VisualStudio.TestTools.UnitTesting;
using SiteZ11G.Service.IndividualIncomeTax;
using SiteZ11G.Utils.WechatUtils;
using System.Threading;

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

        [TestMethod]
        public void TestWeixin()
        {
            var appid = "wx17b7607bdbe75a64";
            var secret = "";
            Wechat.Init(appid, secret);

            var destUrl = "http://www.cg-zhou.top";
            var signature = Wechat.GetSignature(destUrl);

            Thread.Sleep(1000000);
        }
    }
}
