using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class DatingRepository : IDatingRepository
    {
        public DataContext _context { get; }
        public DatingRepository(DataContext context)
        {
            _context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            return await _context.Users.Include(s => s.Photos).FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _context.Users.Include(s => s.Photos).ToListAsync();
        }

        public async Task<bool> SaveAll(User user)
        {
            _context.Update(user);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            return await _context.Photos.FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(s => s.UserId == userId).FirstOrDefaultAsync(s => s.IsMain);
        }
    }
}