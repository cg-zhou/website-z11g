using Microsoft.VisualStudio.TestTools.UnitTesting;
using SiteZ11G.Service.IndividualIncomeTax;
using SiteZ11G.Utils.WechatUtils;

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
            var appid = "";
            var secret = "";
            Wechat.Init(appid, secret);

            var destUrl = "";
            Wechat.GetSignature(destUrl);
        }
    }
}
