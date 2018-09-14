﻿namespace SiteZ11G.Utils.WechatUtils
{
    class WechatToken
    {
        public string access_token { get; set; }
        public int expires_in { get; set; }
    }

    class WechatTicket
    {
        public int errcode { get; set; }
        public string errmsg { get; set; }
        public string ticket { get; set; }
        public int expires_in { get; set; }
    }

    class WechatSignature
    {
        public string noncestr { get; set; }
        public string jsapi_ticket { get; set; }
        public int timestamp { get; set; }
        public string url { get; set; }
    }
}