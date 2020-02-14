using System;
using System.ComponentModel.DataAnnotations;
using DatingApp.Controllers;

namespace DatingApp.DTOs
{
    public class UserForRegisterDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]  
        [StringLength(8, MinimumLength=4,ErrorMessage="Passowrd should be between 4 to 8 characters.")]
        public string Password { get; set; }
        [Required] 
        public string Gender { get; set; }
        [Required] 
        public string CommonName { get; set; }
        [Required] 
        public DateTime DOB { get; set; }
        [Required] 
        public string City { get; set; }
        [Required] 
        public string State { get; set; }
        [Required] 
        public string Country { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }

        public UserForRegisterDto()
        {
            Created = CommonFunctions.GetDateTime();
            LastActive = CommonFunctions.GetDateTime();
        }
    }
}