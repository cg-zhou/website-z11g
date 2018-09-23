using System.Web.Mvc;

namespace SiteZ11G.Controllers
{
    public class HomeController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            ViewBag.Title = "周春光的个人主页";
            return View();
        }

        [AllowAnonymous]
        public ActionResult Minder()
        {
            return View();
        }
    }
}