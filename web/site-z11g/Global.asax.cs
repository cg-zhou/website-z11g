using System;
using System.Web;
using System.Web.Optimization;
using System.Web.Routing;

namespace SiteZ11G
{
    public class Global : HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            AuthConfig.RegisterOpenAuth();
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            //Visual studio bundles does not support variable in css
            //https://stackoverflow.com/questions/46203895/vs-mvc-project-css-minification-fails-when-using-css-variables
            //BundleTable.Bundles.Add(new StyleBundle("~/bundles/style").Include(
            //    "~/content/css/site.min.css",
            //    "~/Content/3rdPartyLibs/element-ui/index.css"));

            BundleTable.EnableOptimizations = true;
            BundleTable.Bundles.Add(new ScriptBundle("~/bundles/script").Include(
                "~/Content/3rdPartyLibs/vue/vue.js",
                "~/Content/3rdPartyLibs/element-ui/index.js",
                "~/Content/3rdPartyLibs/axios/axios.min.js",
                "~/Content/3rdPartyLibs/bluebird/bluebird.min.js"
                ));
        }

        void Application_End(object sender, EventArgs e)
        {
        }

        void Application_Error(object sender, EventArgs e)
        {
        }
    }
}
