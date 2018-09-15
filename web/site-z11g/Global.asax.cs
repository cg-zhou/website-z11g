using SiteZ11G.Utils.WechatUtils;
using System;
using System.Configuration;
using System.Web;
using System.Web.Routing;

namespace SiteZ11G
{
    public class Global : HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            AuthConfig.RegisterOpenAuth();
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            Wechat.Init();
        }

        void Application_End(object sender, EventArgs e)
        {
        }

        void Application_Error(object sender, EventArgs e)
        {
        }
    }
}
