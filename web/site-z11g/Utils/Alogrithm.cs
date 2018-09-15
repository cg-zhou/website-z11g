using System;
using System.Security.Cryptography;
using System.Text;

namespace SiteZ11G.Utils
{
    public static class Alogrithm
    {
        public static string RandomString(int length = 16)
        {
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < length; i++)
            {
                builder.Append((char)('a' + m_random.Next(0, 25)));
            }
            return builder.ToString();
        }

        public static string Sha1(string sourceString)
        {
            var bytes = m_sha1Encoding.GetBytes(sourceString);
            var hashBytes = m_sha1.ComputeHash(bytes);

            StringBuilder sb = new StringBuilder();
            foreach (byte b in hashBytes)
            {
                sb.Append(b.ToString("x2"));
            }

            return sb.ToString();
        }

        private static SHA1 m_sha1 = new SHA1CryptoServiceProvider();
        private static Encoding m_sha1Encoding = Encoding.ASCII;

        private static readonly Random m_random = new Random();
    }
}