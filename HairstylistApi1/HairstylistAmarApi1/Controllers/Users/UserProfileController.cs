using HairStylistAmar.Models.DTO;
using HairStylistAmar.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HairStylistAmar.Controllers.Users
{
    [ApiController]
    [Authorize]
    [Route("api/user/profile")]
    public class UserProfileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserProfileController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<IActionResult> GetUserProfile()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized();

            var userId = Guid.Parse(userIdClaim);

            var user = await _context.Users
                .Where(u => u.UserId == userId)
                .Select(u => new
                {
                    u.UserId,
                    u.FullName,
                    u.Email,
                    u.PhotoUrl,
                    u.MobileNumber
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound("User profile not found");

            var mobile = await _context.Bookings
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.BookingDate)
                .Select(b => b.MobileNumber)
                .FirstOrDefaultAsync();

            return Ok(new
            {
                user.UserId,
                user.FullName,
                user.Email,
                user.PhotoUrl,   
                user.MobileNumber
            });

        }

        [HttpPost("photo")]
        public async Task<IActionResult> UploadProfilePhoto(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized();

            var userId = Guid.Parse(userIdClaim);

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("User not found");

           
            var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/users");
            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

           
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadFolder, fileName);

          
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            
            user.PhotoUrl = "/uploads/users/" + fileName;
            await _context.SaveChangesAsync();

            return Ok(new { photoUrl = user.PhotoUrl });

        }

        
        [HttpPut]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateUserProfileDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
                return BadRequest("Full name is required");

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized();

            var userId = Guid.Parse(userIdClaim);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
                return NotFound("User not found");

            user.FullName = dto.FullName;
            user.MobileNumber = dto.Mobile;

            // optional: store mobile if you keep it somewhere else
            // user.Mobile = dto.Mobile;

            await _context.SaveChangesAsync();
            return Ok();
        }



    }
}
