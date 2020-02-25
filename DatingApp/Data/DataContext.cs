using DatingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}

        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }

        public DbSet<ContactUs> ContactUs { get; set; }

        public DbSet<FeaturedUsers> FeaturedUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder){
            builder.Entity<Like>()
                .HasKey(s => new {s.LikerId, s.LikeeId});
            
            builder.Entity<Like>()
                .HasOne(s => s.Likee)
                .WithMany(s => s.Likers)
                .HasForeignKey(s => s.LikeeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Like>()
                .HasOne(s => s.Liker)
                .WithMany(s => s.Likees)
                .HasForeignKey(s => s.LikerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(s => s.Sender)
                .WithMany(s => s.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(s => s.Recipient)
                .WithMany(s => s.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}