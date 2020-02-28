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
            if(userParams.getAllUsers){
                
                var users = _context.Users.Include(s => s.Photos).AsQueryable();
                
                users = users.Where(s => s.Id != userParams.UserId);
                
                users = users.Where(s => s.Gender == userParams.Gender);
                return await PagedList<User>.CreateAsync(users, 1, 9999);

            }
            else {
                var users = _context.Users.Include(s => s.Photos).OrderByDescending(s => s.LastActive)
                            .AsQueryable();

                users = users.Where(s => s.Id != userParams.UserId);

                users = users.Where(s => s.Gender == userParams.Gender);

                if(userParams.Likers)
                {
                    var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                    users = users.Where(s => userLikers.Contains(s.Id));
                }

                if (userParams.Likees)
                {
                    var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                    users = users.Where(s => userLikees.Contains(s.Id));
                }
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
        }

        public async Task<List<FeaturedUsers>> GetFeaturedUsers()
        {
            var users = _context.FeaturedUsers.OrderByDescending(s => s.LastActive).ToListAsync();
            return await users;
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers) 
        {
            var user = await _context.Users.Include(s => s.Likers).Include(s => s.Likees)
                        .FirstOrDefaultAsync(s => s.Id == id);

            if(likers)
            {
                return user.Likers.Where(s => s.LikeeId == id).Select(s => s.LikerId);
            }

            return user.Likees.Where(s => s.LikerId == id).Select(s => s.LikeeId);
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

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(s => 
                        s.LikerId == userId && s.LikeeId == recipientId);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
                                .Include(s => s.Sender).ThenInclude(s => s.Photos)
                                .Include(s => s.Recipient).ThenInclude(s => s.Photos)
                                .AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(s => s.RecipientId == messageParams.UserId && s.RecipientDeleted == false);
                    break;
                case "Outbox":
                    messages = messages.Where(s => s.SenderId == messageParams.UserId && s.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(s => s.RecipientId == messageParams.UserId && s.RecipientDeleted == false 
                                                && s.IsRead == false);
                    break;
            }

            messages = messages.OrderByDescending(s => s.MessageSent);

            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                                .Include(s => s.Sender).ThenInclude(s => s.Photos)
                                .Include(s => s.Recipient).ThenInclude(s => s.Photos)
                                .Where(s => s.RecipientId == userId && s.RecipientDeleted == false && s.SenderId == recipientId 
                                    || s.RecipientId == recipientId && s.SenderDeleted == false && s.SenderId == userId)
                              
                                .ToListAsync();
            return messages;
        }
    }
}