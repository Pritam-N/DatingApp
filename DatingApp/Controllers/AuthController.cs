using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Helpers;
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
        public JWTTokenGenerator _jwt { get; }

        public IDatingRepository _dateRepo { get; }

        public AuthController(IAuthRepository auth, IConfiguration configuration, JWTTokenGenerator jwt, IDatingRepository dateRepo)
        {
            _configuration = configuration;
            _jwt = jwt;
            _auth = auth;
            _dateRepo = dateRepo;
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

            return Ok(new 
            { 
                token = _jwt.GenerateToken(createdUser.Id,createdUser.UserName)
            });

            //return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto login)
        {
            var userFromRepo = await _auth.Login(login.Username, login.Password);

            if (userFromRepo == null)
            {
                return Unauthorized();
            }

            userFromRepo.LastActive = DateTime.Now;

            await _dateRepo.SaveAll(userFromRepo);

            return Ok(new 
            { 
                token = _jwt.GenerateToken(userFromRepo.Id,userFromRepo.UserName)
            });
        }
    }
}