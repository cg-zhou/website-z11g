using System.Security.Cryptography;
using System.Text;

namespace SiteZ11G.Utils
{
    public static class Alogrithm
    {
        public static string Sha1(string sourceString)
        {
            var bytes = _sha1Encoding.GetBytes(sourceString);
            var hashBytes = _sha1.ComputeHash(bytes);
            var hashString = _sha1Encoding.GetString(hashBytes);
            return hashString;
        }

        private static SHA1 _sha1 = new SHA1CryptoServiceProvider();
        private static Encoding _sha1Encoding = Encoding.ASCII;
    }
}