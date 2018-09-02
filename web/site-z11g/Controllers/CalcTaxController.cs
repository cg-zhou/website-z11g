using SiteZ11G.Service;
using SiteZ11G.Service.IndividualIncomeTax;
using System.Web.Mvc;

namespace SiteZ11G.Controllers
{
    public class CalcTaxController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public ActionResult Run(decimal income, decimal incomeWithoutTax)
        {
            var calculatorBefore2018 = Calculator.Create(TaxType.Before2018);
            var resultBefore2018 = calculatorBefore2018.Calculate(income, incomeWithoutTax);

            var calculatorAfter2018 = Calculator.Create(TaxType.After2018);
            var resultAfter2018 = calculatorAfter2018.Calculate(income, incomeWithoutTax);
            return Json(new
            {
                resultBefore2018,
                resultAfter2018,
                difference = resultBefore2018.SumTax - resultAfter2018.SumTax,
                differenceTotalYear = (resultBefore2018.SumTax - resultAfter2018.SumTax) * 12
            });
        }
    }
}