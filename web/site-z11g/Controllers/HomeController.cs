﻿using System.Web.Mvc;

namespace SiteZ11G.Controllers
{
    public class HomeController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult Minder()
        {
            return View();
        }
    }
}