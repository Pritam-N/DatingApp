using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Helpers;
using DatingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
namespace DatingApp.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CommonController: ControllerBase
    { 

        private readonly IMapper _mapper;
        private readonly ICommonRepository _repository;
        public CommonController(ICommonRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        [Route("countryList")]
        [HttpGet]
        public async Task<IActionResult> GetCountries()
        {
            var countries = await _repository.GetCountry();
            return Ok(countries);
        }
        [Route("cityList/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetCities(string id)
        {
            var cities = await _repository.GetCities(id);
            return Ok(cities);
        }
        [Route("stateList/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetStates(string id)
        {
            var states = await _repository.GetStates(id);
            return Ok(states);
        }

        [HttpPost("contactMessage")]
        public async Task<IActionResult> SendMessage(ContatctUsMessageDto contatctUsMessageDto)
        {
             var addContactMessage = _mapper.Map<ContactUs>(contatctUsMessageDto);
             await  _repository.AddContactMessage(addContactMessage);
             return Ok();
        }
    }
}