namespace SiteZ11G.Utils.WechatUtils
{
    class WechatResponse
    {
        public int errcode { get; set; }
        public string errmsg { get; set; }
    }

    class WechatToken : WechatResponse
    {
        public string access_token { get; set; }
        public int expires_in { get; set; }
    }

    class WechatTicket : WechatResponse
    {
        public string ticket { get; set; }
        public int expires_in { get; set; }
    }
}