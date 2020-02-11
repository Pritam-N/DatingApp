
using System.Collections.Generic;
using System.Linq;
using DatingApp.Models;
using Microsoft.EntityFrameworkCore;
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
            using(var transaction = context.Database.BeginTransaction()) {
                if(!context.Countries.Any()) {
                    var countrydata = System.IO.File.ReadAllText("Data/countries.json");
                    var country = JsonConvert.DeserializeObject<List<Country>>(countrydata);
                    context.Countries.AddRange(country);
                    context.Database.ExecuteSqlRaw(@"SET IDENTITY_INSERT [dbo].[Countries] ON");
                    
                    context.SaveChanges();
                    context.Database.ExecuteSqlRaw(@"SET IDENTITY_INSERT [dbo].[Countries] OFF");
                }
                transaction.Commit();
            }
            using(var transaction = context.Database.BeginTransaction()) {
                if(!context.States.Any()) {
                    var statesdata = System.IO.File.ReadAllText("Data/states.json");
                    var states = JsonConvert.DeserializeObject<List<State>>(statesdata);
                    
                    context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[States] ON");
                    context.States.AddRange(states);
                    context.SaveChanges();
                    context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[States] OFF");
                }
                transaction.Commit();
            }
            using(var transaction = context.Database.BeginTransaction()) {
                if(!context.Cities.Any()) {
                    var citiesdata = System.IO.File.ReadAllText("Data/cities.json");
                    var cities = JsonConvert.DeserializeObject<List<City>>(citiesdata);
                    
                    context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[Cities] ON");
                    context.Cities.AddRange(cities);
                    context.SaveChanges();
                    context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[Cities] OFF");
                }
                transaction.Commit();
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