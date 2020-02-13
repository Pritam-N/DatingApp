using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
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
        public IMapper _mapper { get; }

        public AuthController(IAuthRepository auth, IConfiguration configuration, JWTTokenGenerator jwt, IMapper mapper)
        {
            _configuration = configuration;
            _jwt = jwt;
            _mapper = mapper;
            _auth = auth;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            userForRegisterDto.UserName = userForRegisterDto.UserName.ToLower();

            if (await _auth.UserExists(userForRegisterDto.UserName))
                return BadRequest("Username already exists.");
            
            var userToCreate = _mapper.Map<User>(userForRegisterDto);

            var createdUser = await _auth.Register(userToCreate, userForRegisterDto.Password);

            var userToReturn = _mapper.Map<UserForDetailedDto>(createdUser);

            return CreatedAtRoute("GetUser", new { controller = "Users", id = createdUser.Id }, userToReturn);
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
            await _auth.SaveAll();
            
            var user = _mapper.Map<UserForListDto>(userFromRepo);
            return Ok(new 
            {
                token = _jwt.GenerateToken(userFromRepo.Id,userFromRepo.UserName),
                user = user
            });
        }
    }
}
