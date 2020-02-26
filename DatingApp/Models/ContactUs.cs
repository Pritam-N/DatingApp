using System;

namespace DatingApp.Models
{
    public class ContactUs
    {
        public int Id { get; set; }
        public string SenderEmail { get; set; }
        public string Message { get; set; }
        public DateTime SendingTime { get; set; }
    }
}