using System.Security.Claims;
using HairStylistAmar.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HairStylistAmar.Controllers.Bookings
{
    [ApiController]
    [Authorize]
    [Route("api/bookings/user")]
    public class BookingsUserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsUserController(AppDbContext context)
        {
            _context = context;
        }

       
        [HttpGet("{userId:guid}")]
        public async Task<IActionResult> GetBookingsByUser(Guid userId)
        {
            var loggedInUserId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            if (loggedInUserId != userId)
                return Forbid();

            var bookings = await _context.Bookings
                .Where(b => b.UserId == userId)
                .Include(b => b.Batch)
                    .ThenInclude(b => b.Service)     
                .Include(b => b.Batch)
                    .ThenInclude(b => b.Instructor)
                .Select(b => new
                {
                    bookingId = b.BookingId,
                    status = b.Status,
                    bookingDate = b.BookingDate,

                    batch = new
                    {
                        batchId = b.Batch.BatchId,
                        batchName = b.Batch.BatchName,
                        startDate = b.Batch.StartDate,
                        price = b.Batch.Price,

                        service = new                
                        {
                            serviceId = b.Batch.Service.ServiceId,
                            name = b.Batch.Service.Name
                        },

                        instructor = new
                        {
                            name = b.Batch.Instructor.Name,
                            mobile = b.Batch.Instructor.ContactMobile
                        }
                    }
                })
                .OrderByDescending(b => b.bookingDate)
                .ToListAsync();

            return Ok(bookings);
        }

    }
}
