using Microsoft.VisualStudio.TestTools.UnitTesting;
using SiteZ11G.Service.IndividualIncomeTax;

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
    }
}
