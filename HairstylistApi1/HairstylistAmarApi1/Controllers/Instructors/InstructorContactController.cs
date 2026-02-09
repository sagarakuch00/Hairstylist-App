using HairStylistAmar.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HairStylistAmar.Controllers.Instructors
{
    [ApiController]
    [Route("api/instructor-contact")]
    public class InstructorContactController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InstructorContactController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{instructorId:guid}")]
        public async Task<IActionResult> GetInstructorContactAfterBooking(
            Guid instructorId,
            [FromQuery] Guid userId,
            [FromQuery] Guid batchId)
        {
            var hasBooking = await _context.Bookings.AnyAsync(b =>
                b.UserId == userId &&
                b.BatchId == batchId &&
                b.Batch.InstructorId == instructorId &&
                b.Status == "Confirmed");

            if (!hasBooking)
                return Forbid();

            var instructor = await _context.Instructors
                .Where(i => i.InstructorId == instructorId)
                .Select(i => new
                {
                    i.InstructorId,
                    i.Name,
                    i.ContactMobile
                })
                .FirstOrDefaultAsync();

            if (instructor == null)
                return NotFound();

            return Ok(instructor);
        }
    }
}
