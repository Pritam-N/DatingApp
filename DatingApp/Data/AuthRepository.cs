using System;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == username);
            if(user == null)
            {
                return null;
            }

            if(!VerifyPassword(password, user.PassowrdHash, user.PasswordSalt))
            {
                return null;
            }
            return user;
        }

        private bool VerifyPassword(string password, byte[] passowrdHash, byte[] passwordSalt)
        {
            using(var sha = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return passowrdHash.SequenceEqual(computedHash);
            }
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            (passwordHash, passwordSalt) = CreatepasswordHash(password);

            user.PassowrdHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private (byte[], byte[]) CreatepasswordHash(string password)
        {
            using(var sha = new System.Security.Cryptography.HMACSHA512())
            {
                var passwordSalt = sha.Key;
                var passwordHash = sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return (passwordHash, passwordSalt);
            }
        }

        public async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username);
        }
    }
}