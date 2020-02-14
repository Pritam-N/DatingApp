using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.Helpers;
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

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(s => s.Photos).OrderByDescending(s => s.LastActive)
                            .AsQueryable();

            users = users.Where(s => s.Id != userParams.UsrId);

            users = users.Where(s => s.Gender == userParams.Gender);

            // if(userParams.MinAge != 14 || userParams.MaxAge != 40) 
            // {
            //     var minDOB = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            //     var maxDOB = DateTime.Today.AddYears(-userParams.MinAge);

            //     users = users.Where(s => s.DOB >= minDOB && s.DOB <= maxDOB);
            // }

            if(userParams.MaxAge > 100)
            {
                userParams.MaxAge = 100;
            }

            var minDOB = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDOB = DateTime.Today.AddYears(-userParams.MinAge);

            users = users.Where(s => s.DOB >= minDOB && s.DOB <= maxDOB);

            if(!string.IsNullOrEmpty(userParams.Orderby))
            {
                switch (userParams.Orderby)
                {
                    case "created":
                        users = users.OrderByDescending(s => s.Created);
                        break;
                    default:
                        users = users.OrderByDescending(s => s.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
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