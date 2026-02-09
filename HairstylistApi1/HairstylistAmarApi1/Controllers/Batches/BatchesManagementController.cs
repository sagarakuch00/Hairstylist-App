using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using HairStylistAmar.Models.Entities;
using HairStylistAmar.Models.DTO;

namespace HairStylistAmar.Controllers.Batches
{
    [ApiController]
    [Route("api/batches/manage")]
    [Authorize(Roles = UserRoles.Instructor)]
    public class BatchesManagementController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BatchesManagementController(AppDbContext context)
        {
            _context = context;
        }

    
        [HttpPost]
        public async Task<IActionResult> CreateBatch([FromBody] CreateBatchDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var instructor = await _context.Instructors
                .FirstOrDefaultAsync(i => i.UserId == userId);

            if (instructor == null)
                return BadRequest("Instructor profile not found.");

            var service = await _context.Services.FindAsync(dto.ServiceId);
            if (service == null)
                return BadRequest("Invalid ServiceId.");

            var batch = new Batch
            {
                BatchId = Guid.NewGuid(),
                InstructorId = instructor.InstructorId,
                ServiceId = dto.ServiceId,
                BatchName = dto.BatchName,
                Description = dto.Description,
                Price = dto.Price,
                StartDate = dto.StartDate,
                TotalSeats = dto.TotalSeats,
                AvailableSeats = dto.TotalSeats,
                
            };

            _context.Batches.Add(batch);
            await _context.SaveChangesAsync();

            return Ok(new { batchId = batch.BatchId });
        }

      
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateBatch(Guid id, [FromBody] UpdateBatchDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            var userId = Guid.Parse(userIdClaim);

            var instructor = await _context.Instructors
                .FirstOrDefaultAsync(i => i.UserId == userId);

            if (instructor == null)
                return Unauthorized();

            var batch = await _context.Batches
                .FirstOrDefaultAsync(b =>
                    b.BatchId == id &&
                    b.InstructorId == instructor.InstructorId);

            if (batch == null)
                return NotFound("Batch not found or access denied.");

            var service = await _context.Services.FindAsync(dto.ServiceId);
            if (service == null)
                return BadRequest("Invalid ServiceId.");

            if (dto.TotalSeats < batch.TotalSeats - batch.AvailableSeats)
            {
                return BadRequest(
                    "Total seats cannot be less than already booked seats."
                );
            }

            int bookedSeats = batch.TotalSeats - batch.AvailableSeats;

            batch.TotalSeats = dto.TotalSeats;
            batch.AvailableSeats = dto.TotalSeats - bookedSeats;

            batch.BatchName = dto.BatchName;
            batch.Description = dto.Description;
            batch.Price = dto.Price;
            batch.StartDate = dto.StartDate;
            batch.ServiceId = dto.ServiceId;

            await _context.SaveChangesAsync();
            return Ok();
        }


   
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteBatch(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var instructor = await _context.Instructors
                .FirstOrDefaultAsync(i => i.UserId == userId);

            if (instructor == null)
                return Unauthorized();

            var batch = await _context.Batches
                .FirstOrDefaultAsync(b =>
                    b.BatchId == id &&
                    b.InstructorId == instructor.InstructorId);

            if (batch == null)
                return NotFound("Batch not found or access denied.");

            _context.Batches.Remove(batch);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
