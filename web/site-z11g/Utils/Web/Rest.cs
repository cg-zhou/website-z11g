using Newtonsoft.Json;
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
            return result;
        }
    }
}