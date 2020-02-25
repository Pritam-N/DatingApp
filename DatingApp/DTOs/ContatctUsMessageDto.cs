using DatingApp.Utils;
using System;
using System.ComponentModel.DataAnnotations;
namespace DatingApp.DTOs
{
    public class ContatctUsMessageDto
    {
        
        public string SenderEmail { get; set; }

        public string Message { get; set; }
        [Required]
        public DateTime SendingTime { get; set; }
        public ContatctUsMessageDto()
        {
           SendingTime = CommonFunctions.GetDateTime();
        }
        
    }
}