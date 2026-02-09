using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HairStylistAmar.Models.DTO;
using System.Security.Claims;
using HairStylistAmar.Models.Entities;

namespace HairStylistAmar.Controllers.Instructors
{
    [ApiController]
    [Authorize(Roles = "Instructor")]
    [Route("api/instructor/dashboard")]
    public class InstructorDashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InstructorDashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var instructorId = await _context.Instructors
                .Where(i => i.UserId == userId)
                .Select(i => i.InstructorId)
                .FirstOrDefaultAsync();

            if (instructorId == Guid.Empty)
            {
                return Ok(new InstructorDashboardSummaryDto());
            }

            var totalBatches = await _context.Batches.CountAsync(b => b.InstructorId == instructorId);
            var totalStudents = await _context.Bookings.CountAsync(b =>
                b.Batch.InstructorId == instructorId && b.Status != "Cancelled");

            var totalEarnings = await _context.Payments
                .Where(p => p.Status == "Success" &&
                            p.Booking.Batch.InstructorId == instructorId)
                .SumAsync(p => (decimal?)p.Amount) ?? 0;

            var upcomingBatches = await _context.Batches
                .CountAsync(b => b.InstructorId == instructorId && b.StartDate > DateTime.Today);

            return Ok(new InstructorDashboardSummaryDto
            {
                TotalBatches = totalBatches,
                TotalStudents = totalStudents,
                TotalEarnings = totalEarnings,
                UpcomingBatches = upcomingBatches
            });
        }
        [HttpGet("batchwise")]
        public async Task<IActionResult> GetDashboardBatchWise()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var instructorId = await _context.Instructors
                .Where(i => i.UserId == userId)
                .Select(i => i.InstructorId)
                .FirstOrDefaultAsync();

            if (instructorId == Guid.Empty)
                return Ok(new List<InstructorBatchStatsDto>());

            var result = await _context.Batches
                .Where(b => b.InstructorId == instructorId)
                .Select(b => new InstructorBatchStatsDto
                {
                    BatchId = b.BatchId,
                    BatchName = b.BatchName,
                    StartDate = b.StartDate,

                   
                    StudentsEnrolled = b.Bookings.Count(x =>
                        x.Status == "Booked" &&
                        x.Payment != null &&
                        x.Payment.Status == "Success"
                    ),

                    TotalEarnings = b.Bookings
                        .Where(x =>
                            x.Status == "Booked" &&
                            x.Payment != null &&
                            x.Payment.Status == "Success"
                        )
                        .Select(x => (decimal?)x.Payment.Amount)
                        .Sum() ?? 0,

                    Status =
                        b.StartDate > DateTime.Today ? "Upcoming" :
                        b.EndDate < DateTime.Today ? "Completed" :
                        "Ongoing"
                })
                .OrderByDescending(b => b.StartDate)
                .ToListAsync();

            return Ok(result);
        }


    }
}
