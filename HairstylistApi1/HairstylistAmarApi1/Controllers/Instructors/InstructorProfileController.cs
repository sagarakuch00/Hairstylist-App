using HairStylistAmar.Models.DTO;
using HairStylistAmar.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HairStylistAmar.Controllers.Instructors
{
    [ApiController]
    [Authorize(Roles = "Instructor")]
    [Route("api/instructor/profile")]
    public class InstructorProfileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InstructorProfileController(AppDbContext context)
        {
            _context = context;
        }

     
        [HttpGet("me")]
        public async Task<IActionResult> GetMyInstructorProfile()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var instructor = await _context.Instructors
                .Where(i => i.UserId == userId)
                .Select(i => new
                {
                    i.InstructorId,
                    FullName = i.User.FullName,
                    Email = i.User.Email,
                    Mobile = i.ContactMobile,
                    i.Name,
                    i.Specialization,
                    i.PhotoUrl,
                    i.Description,
                    i.IsActive
                })
                .FirstOrDefaultAsync();

            if (instructor == null)
                return NotFound("Instructor profile not found");

            return Ok(instructor);
        }

       
        [HttpPost("upload-photo")]
        public async Task<IActionResult> UploadProfilePhoto(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var instructor = await _context.Instructors
                .FirstOrDefaultAsync(i => i.UserId == userId);

            if (instructor == null)
                return NotFound();

            var uploads = Path.Combine(
                Directory.GetCurrentDirectory(),"wwwroot/uploads/instructors" );

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploads, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

           
            instructor.PhotoUrl = $"/uploads/instructors/{fileName}";
            await _context.SaveChangesAsync();

            return Ok(new { photoUrl = instructor.PhotoUrl });
        }

        
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile(
            [FromBody] UpdateInstructorProfileDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
                return BadRequest("Full name is required");

            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var instructor = await _context.Instructors
                .Include(i => i.User)
                .FirstOrDefaultAsync(i => i.UserId == userId);

            if (instructor == null)
                return NotFound();

            
            instructor.User.FullName = dto.FullName;
            instructor.ContactMobile = dto.Mobile;

           
            instructor.Name = dto.Name;
            instructor.Specialization = dto.Specialization;
            instructor.Description = dto.Description;

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
