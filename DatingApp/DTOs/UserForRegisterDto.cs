using System.ComponentModel.DataAnnotations;

namespace DatingApp.DTOs
{
    public class UserForRegisterDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]  
        [StringLength(8, MinimumLength=4,ErrorMessage="Passowrd should be between 4 to 8 characters.")]
        public string Password { get; set; }
    }
}