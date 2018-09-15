namespace SiteZ11G.Utils.WechatUtils
{
    public class WechatSignature
    {
        public string AppId { get; set; }
        public string Url { get; set; }
        public string Signature { get; set; }
        public int Timestamp { get; set; }
        public string Noncestr { get; set; }
    }
}