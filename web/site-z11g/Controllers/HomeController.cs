using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Mvc;

namespace SiteZ11G.Controllers
{
    public class HomeController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            ViewBag.Message = "LALALA";
            return View();
        }

        public ActionResult TestGet()
        {
            return Json("abc", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult TestPost()
        {
            return Json("abc");
        }
    }
}