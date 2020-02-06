
using System.Collections.Generic;
using System.Linq;
using DatingApp.Models;
using Newtonsoft.Json;

namespace DatingApp.Data
{
    public class Seed
    {
        public static void Seeddata(DataContext context)
        {
            if(!context.Users.Any()) {
                var usersdata = System.IO.File.ReadAllText("Data/UserSeed.json");
                var users = JsonConvert.DeserializeObject<List<User>>(usersdata);
                foreach(var user in users){
                    byte[] passwordHash, passwordSalt;
                    (passwordHash, passwordSalt) = CreatepasswordHash("password");
                    user.PassowrdHash = passwordHash;
                    user.PasswordSalt = passwordSalt;
                    user.UserName = user.UserName.ToLower();
                    context.Users.Add(user);
                }
                context.SaveChanges();
            }
        }

        private static (byte[], byte[]) CreatepasswordHash(string password)
        {
            using(var sha = new System.Security.Cryptography.HMACSHA512())
            {
                var passwordSalt = sha.Key;
                var passwordHash = sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return (passwordHash, passwordSalt);
            }
        }
    }
}