using System.Security.Claims;
using HairStylistAmar.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HairStylistAmar.Controllers.Bookings
{
    [ApiController]
    [Route("api/bookings/instructor")]
    public class BookingsInstructorController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsInstructorController(AppDbContext context)
        {
            _context = context;
        }

       


        [HttpGet("my")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> GetInstructorBookings()
        {
            var instructorUserId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)
            );

            var batches = await _context.Batches
                .Where(b => b.Instructor.UserId == instructorUserId)
                .Select(b => new
                {
                    batchId = b.BatchId,
                    batchName = b.BatchName,
                    startDate = b.StartDate,
                    bookings = b.Bookings
                        .Where(x => x.Status != "Cancelled")
                        .Select(x => new
                        {
                            bookingId = x.BookingId,
                            bookingDate = x.BookingDate,
                            status = x.Status,
                            mobileNumber = x.MobileNumber,
                            student = new
                            {
                                fullName = x.User.FullName,
                                email = x.User.Email
                            }
                        })
                })
                .ToListAsync();

            return Ok(batches);
        }


    }
}
