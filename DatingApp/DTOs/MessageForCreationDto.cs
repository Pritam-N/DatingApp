using System;
using DatingApp.Utils;

namespace DatingApp.DTOs
{
    public class MessageForCreationDto
    {
        public int SenderId { get; set; }
        public int recipientId { get; set; }
        public DateTime MessageSent { get; set; }
        public string Content { get; set; }

        public MessageForCreationDto()
        {
            MessageSent = CommonFunctions.GetDateTime();
        }
    }
}