using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public IAuthRepository _auth { get; }
        public IConfiguration _configuration { get; }
        public AuthController(IAuthRepository auth, IConfiguration configuration)
        {
            _configuration = configuration;
            _auth = auth;

        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto dto)
        {
            dto.UserName = dto.UserName.ToLower();

            if (await _auth.UserExists(dto.UserName))
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

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto login)
        {
            var userFromRepo = await _auth.Login(login.Username, login.Password);

            if (userFromRepo == null)
            {
                return Unauthorized();
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.UserName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new 
            { 
                token = tokenHandler.WriteToken(token)
            });
        }
    }
}