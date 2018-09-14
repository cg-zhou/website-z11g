using System.Security.Cryptography;
using System.Text;

namespace SiteZ11G.Utils
{
    public static class Alogrithm
    {
        public static string Sha1(string sourceString)
        {
            var bytes = m_sha1Encoding.GetBytes(sourceString);
            var hashBytes = m_sha1.ComputeHash(bytes);
            var hashString = m_sha1Encoding.GetString(hashBytes);
            return hashString;
        }

        private static SHA1 m_sha1 = new SHA1CryptoServiceProvider();
        private static Encoding m_sha1Encoding = Encoding.ASCII;
    }
}