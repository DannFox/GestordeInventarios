using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace Inventario.Application.Utils
{
    public static class PasswordHasher
    {
        public static string GenerateSalt()
        {
            var saltBytes = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            return Convert.ToBase64String(saltBytes);
        }
        public static string HashPassword(string password, string salt)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(password);

                var hash = sha256.ComputeHash(bytes);

                var stringBuilder = new StringBuilder();
                foreach (var c in hash)
                {
                    stringBuilder.Append(c.ToString("x2"));
                }

                return stringBuilder.ToString();
            }
        }
    }
}
