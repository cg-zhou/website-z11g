using SiteZ11G.Utils.Web;
using System;
using System.Threading;

namespace SiteZ11G.Utils.WechatUtils
{
    public static class Wechat
    {
        public static void Init(string appid, string secret)
        {
            m_appid = appid;
            m_secret = secret;

            m_wechatSite = "https://api.weixin.qq.com/cgi-bin/";

            m_thread = new Thread(Start);
            m_thread.Name = "thread_wechat";
            m_thread.IsBackground = true;
            m_thread.Start();
        }

        public static Signature GetSignature(string url)
        {
            var signature = new WechatSignature();
            signature.noncestr = DateTime.Now.ToString("yyyyMMddHHmmss");
            signature.jsapi_ticket = m_ticket.ticket;
            signature.timestamp = (int)(DateTime.Now.Ticks / 1000);
            signature.url = url;

            var sourceString = string.Join("&",
                $"{nameof(signature.noncestr)}={signature.noncestr}",
                $"{nameof(signature.jsapi_ticket)}={signature.jsapi_ticket}",
                $"{nameof(signature.timestamp)}={signature.timestamp}",
                $"{nameof(signature.url)}={signature.url}");

            var signatureSha1 = Alogrithm.Sha1(sourceString);
            var result = new Signature()
            {
                Url = url,
                Sha1 = signatureSha1,
                Timestamp = signature.timestamp,
                Noncestr = signature.noncestr,
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
        private static Thread m_thread;

        private static string m_appid;
        private static string m_secret;

        private static string m_wechatSite;

        private static WechatTicket m_ticket;
    }
}