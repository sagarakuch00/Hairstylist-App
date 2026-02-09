using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HairStylistAmar.Models.Entities;
using Microsoft.AspNetCore.Authorization;

namespace HairStylistAmar.Controllers.Users
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        
        [Authorize(Roles = "Instructor")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

       
        [Authorize]
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<User>> GetUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            return user;
        }

      
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            if (user.UserId == Guid.Empty)
                user.UserId = Guid.NewGuid();

            if (user.Role != UserRoles.User && user.Role != UserRoles.Instructor)
                return BadRequest("Role must be 'User' or 'Instructor'.");

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, user);
        }

        
        [Authorize]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateUser(Guid id, User updatedUser)
        {
            if (id != updatedUser.UserId)
                return BadRequest("User ID mismatch.");

            if (updatedUser.Role != UserRoles.User && updatedUser.Role != UserRoles.Instructor)
                return BadRequest("Role must be 'User' or 'Instructor'.");

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
                return NotFound();

            existingUser.FullName = updatedUser.FullName;
            existingUser.Email = updatedUser.Email;
            existingUser.PhotoUrl = updatedUser.PhotoUrl;
            existingUser.Role = updatedUser.Role;

            await _context.SaveChangesAsync();
            return NoContent();
        }

     
        [Authorize]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
