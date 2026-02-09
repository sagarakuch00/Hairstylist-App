using HairStylistAmar.Models.DTO;
using HairStylistAmar.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace HairStylistAmar.Controllers.Users
{
    [ApiController]
    [Authorize]
    [Route("api/user/role")]
    public class UserRoleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserRoleController(AppDbContext context)
        {
            _context = context;
        }

      
        [HttpPost]
        public async Task<IActionResult> SetMyRole([FromBody] SetRoleDto dto)
        {
            
            if (dto == null ||
                (dto.Role != UserRoles.User && dto.Role != UserRoles.Instructor))
            {
                return BadRequest("Invalid role.");
            }

           
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            
            if (user.Role != null)
            {
                return BadRequest("Role has already been selected.");
            }

 
            if (dto.Role == UserRoles.Instructor)
            {
                if (string.IsNullOrWhiteSpace(dto.MobileNumber))
                {
                    return BadRequest("Mobile number is required for instructor.");
                }

                if (!Regex.IsMatch(dto.MobileNumber, @"^[0-9]{10}$"))
                {
                    return BadRequest("Invalid mobile number format.");
                }

                user.MobileNumber = dto.MobileNumber;
            }

            
            user.Role = dto.Role;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Role updated successfully",
                role = user.Role
            });
        }
    }
}
