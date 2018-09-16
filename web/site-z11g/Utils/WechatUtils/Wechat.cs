using SiteZ11G.Utils.Web;
using System;
using System.Configuration;
using System.Threading;

namespace SiteZ11G.Utils.WechatUtils
{
    public static class Wechat
    {
        public static void Init()
        {
            m_appid = ConfigurationManager.AppSettings["wechat_appId"];
            m_secret = ConfigurationManager.AppSettings["wechat_secret"];

            m_wechatSite = "https://api.weixin.qq.com/cgi-bin/";

            FetchTicket();
            m_lastQueryTime = DateTime.Now;
#if !DEBUG
            m_thread = new Thread(Start);
            m_thread.Name = "thread_wechat";
            m_thread.IsBackground = true;
            m_thread.Start();
#endif
        }

        public static WechatSignature GetSignature(string url)
        {
            var noncestr = Alogrithm.RandomString();
            var jsapi_ticket = m_ticket.ticket;
            var timestamp = (int)(DateTime.Now.Ticks / 1000);

            var sourceString = string.Join("&",
                $"{nameof(jsapi_ticket)}={jsapi_ticket}",
                $"{nameof(noncestr)}={noncestr}",
                $"{nameof(timestamp)}={timestamp}",
                $"{nameof(url)}={url}");

            var signature = Alogrithm.Sha1(sourceString);
            var result = new WechatSignature()
            {
                AppId = m_appid,
                Url = url,
                Signature = signature,
                Timestamp = timestamp,
                Noncestr = noncestr,
            };
            return result;
        }

        private static void FetchTicket()
        {
            var url = m_wechatSite + $"token?grant_type=client_credential&appid={m_appid}&secret={m_secret}";
            var token = Rest.Get<WechatToken>(url);

            url = m_wechatSite + $"ticket/getticket?access_token={token.access_token}&type=jsapi";
            m_ticket = Rest.Get<WechatTicket>(url);
        }

        private static void Start()
        {
            while (true)
            {
                var now = DateTime.Now;
                if (!m_lastQueryTime.HasValue
                    || (now - m_lastQueryTime.Value).Hours > 0)
                {
                    FetchTicket();
                    m_lastQueryTime = now;
                }

                Thread.Sleep(5000);
            }
        }


        private static DateTime? m_lastQueryTime;

#if !DEBUG
        private static Thread m_thread;
#endif

        private static string m_appid;
        private static string m_secret;

        private static string m_wechatSite;

        private static WechatTicket m_ticket;
    }
}