using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using HairStylistAmar.Models.Entities;
using HairStylistAmar.Models.DTO;
using System.Security.Claims;

namespace HairStylistAmar.Controllers.Bookings
{
    [ApiController]
    [Authorize] 
    [Route("api/bookings")]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsController(AppDbContext context)
        {
            _context = context;
        }

       
        [Authorize]
        [HttpGet("details/{id:guid}")]
        public async Task<IActionResult> GetBookingDetails(Guid id)
        {
            var booking = await _context.Bookings
                .Include(b => b.Batch)
                    .ThenInclude(b => b.Instructor)
                        .ThenInclude(i => i.User)
                .FirstOrDefaultAsync(b =>
                    b.BookingId == id &&
                    b.Status != "Cancelled"   
                );

            if (booking == null)
                return BadRequest("Invalid booking");

            return Ok(new
            {
                bookingId = booking.BookingId,
                amount = booking.Batch.Price,
                batchName = booking.Batch.BatchName,
                instructorName = booking.Batch.Instructor.User.FullName,
                startDate = booking.Batch.StartDate,
                status = booking.Status
            });
        }


        
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingCreateDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid booking data.");

            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null)
                return BadRequest("Invalid UserId.");

            if (string.IsNullOrWhiteSpace(dto.StudentMobile))
                return BadRequest("Student mobile number is required.");

            var batch = await _context.Batches.FindAsync(dto.BatchId);
            if (batch == null)
                return BadRequest("Invalid BatchId.");

            if (batch.AvailableSeats <= 0)
                return BadRequest("No seats available.");

            bool exists = await _context.Bookings.AnyAsync(b =>
                b.UserId == dto.UserId && b.BatchId == dto.BatchId);

            if (exists)
                return BadRequest("You have already booked this batch.");

           
            batch.AvailableSeats -= 1;

            var booking = new Booking
            {
                BookingId = Guid.NewGuid(),
                UserId = dto.UserId,
                BatchId = dto.BatchId,
                MobileNumber = dto.StudentMobile,
                BookingDate = DateTime.UtcNow,
                Status = "Pending"
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

           
            return Ok(new
            {
                bookingId = booking.BookingId,
                status = booking.Status,
                batchId = batch.BatchId,
                remainingSeats = batch.AvailableSeats
            });
        }

       
        [HttpDelete("cancel/{bookingId:guid}")]
        public async Task<IActionResult> CancelBooking(Guid bookingId)
        {
            var booking = await _context.Bookings
                .Include(b => b.Batch)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);

            if (booking == null)
                return NotFound("Booking not found.");

            if (booking.Status != "Pending")
                return BadRequest("Only pending bookings can be cancelled.");

            
            booking.Batch.AvailableSeats += 1;

            
            _context.Bookings.Remove(booking);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking cancelled successfully" });
        }

    }
}
