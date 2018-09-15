using Newtonsoft.Json;
using SiteZ11G.Utils.WechatUtils;
using System;
using System.IO;
using System.Net;

namespace SiteZ11G.Utils.Web
{
    public static class Rest
    {
        public static T Get<T>(string url)
        {
            var request = WebRequest.Create(url);
            request.Method = "GET";
            request.Timeout = 10000;
            request.ContentType = "application/json";

            var response = request.GetResponse();
            var content = string.Empty;
            using (var streamReader = new StreamReader(response.GetResponseStream()))
            {
                content = streamReader.ReadToEnd();
            }
            response.Close();

            var result = JsonConvert.DeserializeObject<T>(content);

            if (typeof(T).BaseType == typeof(WechatResponse))
            {
                var wechatBase = result as WechatResponse;
                if (wechatBase.errcode > 0)
                {
                    throw new ApplicationException(wechatBase.errmsg);
                }
            }
            return result;
        }
    }
}