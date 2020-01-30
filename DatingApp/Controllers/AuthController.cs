using System.Threading.Tasks;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public IAuthRepository _auth { get; }
        public AuthController(IAuthRepository auth)
        {
            _auth = auth;

        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto dto)
        {
            dto.UserName = dto.UserName.ToLower();

            if(await _auth.UserExists(dto.UserName))
            {
                return BadRequest("Username already exists.");
            }

            var user = new User
            {
                UserName = dto.UserName
            };

            var createdUser = await _auth.Register(user, dto.Password);
            return StatusCode(201);
        }
    }
}