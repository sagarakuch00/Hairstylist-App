using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HairStylistAmar.Models.Entities;
using HairStylistAmar.Models.DTO;
using HairStylistAmar.Helpers;

namespace HairStylistAmar.Controllers.Instructors
{
    [ApiController]
    [Route("api/instructors")]
    public class InstructorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InstructorsController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<IActionResult> GetInstructors()
        {
            var instructors = await _context.Instructors
                .Include(i => i.User)
                .Select(i => new
                {
                    i.InstructorId,
                    i.Name,
                    i.Specialization,
                    i.PhotoUrl,
                    i.Description,
                    i.IsActive,
                    ContactMobile = MobileMaskHelper.MaskMobile(i.ContactMobile),
                    User = new
                    {
                        i.User.UserId,
                        i.User.FullName,
                        i.User.Email
                    }
                })
                .ToListAsync();

            return Ok(instructors);
        }

        
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetInstructor(Guid id)
        {
            var instructor = await _context.Instructors
                .Include(i => i.User)
                .Where(i => i.InstructorId == id)
                .Select(i => new
                {
                    i.InstructorId,
                    i.Name,
                    i.Specialization,
                    i.PhotoUrl,
                    i.Description,
                    i.IsActive,
                    ContactMobile = MobileMaskHelper.MaskMobile(i.ContactMobile),
                    User = new
                    {
                        i.User.UserId,
                        i.User.FullName,
                        i.User.Email
                    }
                })
                .FirstOrDefaultAsync();

            if (instructor == null)
                return NotFound();

            return Ok(instructor);
        }

        
        [HttpPost("create")]
        public async Task<IActionResult> CreateInstructor([FromBody] CreateInstructorRequest request)
        {
            if (request == null || request.UserId == Guid.Empty)
                return BadRequest("Invalid request. UserId is required.");

            if (string.IsNullOrWhiteSpace(request.ContactMobile))
                return BadRequest("Instructor contact mobile is required.");

            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
                return BadRequest("User not found.");

            var existingInstructor = await _context.Instructors
                .FirstOrDefaultAsync(i => i.UserId == request.UserId);

            if (existingInstructor != null)
            {
                if (user.Role != UserRoles.Instructor)
                {
                    user.Role = UserRoles.Instructor;
                    await _context.SaveChangesAsync();
                }

                return Ok(new
                {
                    instructorId = existingInstructor.InstructorId,
                    userId = existingInstructor.UserId
                });
            }

            var instructor = new Instructor
            {
                InstructorId = Guid.NewGuid(),
                UserId = request.UserId,
                Name = user.FullName,
                Specialization = "Not Set Yet",
                PhotoUrl = user.PhotoUrl,
                Description = null,
                IsActive = true,
                ContactMobile = request.ContactMobile
            };

            _context.Instructors.Add(instructor);
            user.Role = UserRoles.Instructor;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                instructorId = instructor.InstructorId,
                userId = instructor.UserId
            });
        }

        
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateInstructor(Guid id, Instructor updated)
        {
            if (id != updated.InstructorId)
                return BadRequest("InstructorId mismatch.");

            var existing = await _context.Instructors
                .FirstOrDefaultAsync(i => i.InstructorId == id);

            if (existing == null)
                return NotFound();

            var user = await _context.Users.FindAsync(existing.UserId);
            if (user == null)
                return BadRequest("Linked user not found.");

            if (user.Role != UserRoles.Instructor)
                return BadRequest("Linked user must have role 'Instructor'.");

            existing.Name = updated.Name;
            existing.Specialization = updated.Specialization;
            existing.PhotoUrl = updated.PhotoUrl;
            existing.Description = updated.Description;
            existing.IsActive = updated.IsActive;
            existing.ContactMobile = updated.ContactMobile;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteInstructor(Guid id)
        {
            var instructor = await _context.Instructors.FindAsync(id);
            if (instructor == null)
                return NotFound();

            _context.Instructors.Remove(instructor);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
