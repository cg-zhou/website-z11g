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
            ViewBag.Title = "小黄鸭帮你算个税";
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
                taxBefore2018 = resultBefore2018.SumTax.ToString("0.00"),
                taxAfter2018 = resultAfter2018.SumTax.ToString("0.00"),
                differencePerMonth = (resultBefore2018.SumTax - resultAfter2018.SumTax).ToString("0.00"),
                differencePerYear = ((resultBefore2018.SumTax - resultAfter2018.SumTax) * 12).ToString("0.00"),
                netIncomePerMonthAfter2018 = resultAfter2018.NetIncomePerMonth.ToString("0.00"),
                netIncomePerMonthBefore2018 = resultBefore2018.NetIncomePerMonth.ToString("0.00"),
            });
        }
    }
}