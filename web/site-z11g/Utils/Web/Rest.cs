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
            StreamReader streamReader = new StreamReader(response.GetResponseStream());
            string responseContent = streamReader.ReadToEnd();
            response.Close();
            streamReader.Close();

            var result = JsonConvert.DeserializeObject<T>(responseContent);
            return result;
        }
    }
}