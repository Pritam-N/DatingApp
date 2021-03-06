using System;
using System.Collections;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Helpers;
using DatingApp.Models;
using DatingApp.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController: ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public MessagesController( IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet("{id}", Name="GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messageFromRepo = await _repo.GetMessage(id);

            if(messageFromRepo == null)
                return NotFound();

            return Ok(messageFromRepo);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId,
                            [FromQuery]MessageParams messageParams)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messageParams.UserId = userId;
            
            var messagesfromRepo = await _repo.GetMessagesForUser(messageParams);

            var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesfromRepo);

            Response.AddPagination(messagesfromRepo.CurrentPage, messagesfromRepo.PageSize,
                                    messagesfromRepo.TotalCount, messagesfromRepo.TotalPages);
            
            return Ok(messages);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messageFromRepo = await _repo.GetMessageThread(userId, recipientId);

            var messageThread = _mapper.Map<IEnumerable<MessageToReturnDto>>(messageFromRepo);

            return Ok(messageThread);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto messageForCreationDto)
        {
            var sender = await _repo.GetUser(userId);

            if(sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messageForCreationDto.SenderId = userId;

            var recipient = await _repo.GetUser(messageForCreationDto.recipientId);

            if(recipient == null)
                return BadRequest("Could not find user.");

            var message = _mapper.Map<Message>(messageForCreationDto);

            _repo.Add(message);

            var messageToreturn = _mapper.Map<MessageToReturnDto>(message);

            if(await _repo.SaveAll())
                return CreatedAtRoute("GetMessage", new { userId = userId, id = message.Id }, messageToreturn);

            throw new Exception("Failed to add message.");
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userId)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messageFromRepo = await _repo.GetMessage(id);

            if( messageFromRepo.SenderId == userId)
                messageFromRepo.SenderDeleted = true;

            if( messageFromRepo.RecipientId == userId)
                messageFromRepo.RecipientDeleted = true;

            if(messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted)
                _repo.Delete(messageFromRepo);

            if(await _repo.SaveAll())
                return NoContent();

            throw new Exception("Error deleting the message.");
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int userId, int id)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var message = await _repo.GetMessage(id);

            if(message.RecipientId != userId)
                return Unauthorized();
            
            message.IsRead = true;
            message.DateRead = CommonFunctions.GetDateTime();

            await _repo.SaveAll();
            return NoContent();
        }

        [HttpGet("UnreadMessages")]
        public async Task<IActionResult> GetUnreadMessagesForUser(int userId,
                            [FromQuery]MessageParams messageParams)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messageParams.UserId = userId;
            
            var messagesfromRepo = await _repo.GetUnreadMessagesForUser(messageParams);

            //var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesfromRepo);
            //Response.Body = messagesfromRepo;
            
            return Ok(messagesfromRepo);
        }
    }
}