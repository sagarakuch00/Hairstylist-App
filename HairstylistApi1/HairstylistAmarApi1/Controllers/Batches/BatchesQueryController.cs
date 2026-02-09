using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HairStylistAmar.Helpers;
using HairStylistAmar.Models.Entities;

namespace HairStylistAmar.Controllers.Batches
{
    [ApiController]
    [Route("api/batches")]
    public class BatchesQueryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BatchesQueryController(AppDbContext context)
        {
            _context = context;
        }

     
        [HttpGet("instructor/{instructorId:guid}")]
        public async Task<IActionResult> GetBatchesByInstructor(Guid instructorId)
        {
            var batches = await _context.Batches
                .Where(b => b.InstructorId == instructorId)
                .Include(b => b.Service)
                .Include(b => b.Instructor)
                    .ThenInclude(i => i.User)
                .Select(b => new
                {
                    b.BatchId,
                    b.BatchName,
                    b.Description,
                    b.Price,
                    b.StartDate,
                    b.TotalSeats,
                    b.AvailableSeats,

                    
                    Service = new
                    {
                        b.Service.ServiceId,
                        b.Service.Name,
                        b.Service.Description
                    },

                   
                    Instructor = new
                    {
                        b.Instructor.InstructorId,
                        b.Instructor.Name,
                        PhotoUrl = b.Instructor.PhotoUrl,
                        ContactMobile = MobileMaskHelper.MaskMobile(
                            b.Instructor.ContactMobile
                        )
                    }
                })
                .ToListAsync();

            return Ok(batches);
        }

   
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetBatch(Guid id)
        {
            var batch = await _context.Batches
                .Include(b => b.Service)
                .Include(b => b.Instructor)
                    .ThenInclude(i => i.User)
                .Where(b => b.BatchId == id)
                .Select(b => new
                {
                    b.BatchId,
                    b.BatchName,
                    b.Description,
                    b.Price,
                    b.StartDate,
                    b.TotalSeats,
                    b.AvailableSeats,

                    Service = new
                    {
                        b.Service.ServiceId,
                        b.Service.Name,
                        b.Service.Description
                    },

                    Instructor = new
                    {
                        b.Instructor.InstructorId,
                        b.Instructor.Name,
                        PhotoUrl = b.Instructor.PhotoUrl,
                        ContactMobile = MobileMaskHelper.MaskMobile(
                            b.Instructor.ContactMobile
                        )
                    }
                })
                .FirstOrDefaultAsync();

            if (batch == null)
                return NotFound();

            return Ok(batch);
        }

        [HttpGet("service/{serviceId:guid}")]
        public async Task<IActionResult> GetBatchesByService(Guid serviceId)
        {
            var batches = await _context.Batches
                .Where(b => b.ServiceId == serviceId)
                .Include(b => b.Service)
                .Include(b => b.Instructor)
                    .ThenInclude(i => i.User)
                .Select(b => new
                {
                    b.BatchId,
                    b.BatchName,
                    b.Description,
                    b.Price,
                    b.StartDate,
                    b.TotalSeats,
                    b.AvailableSeats,

                    Service = new
                    {
                        b.Service.ServiceId,
                        b.Service.Name,
                        b.Service.Description
                    },

                    Instructor = new
                    {
                        b.Instructor.InstructorId,
                        b.Instructor.Name,
                        PhotoUrl = b.Instructor.PhotoUrl,
                        ContactMobile = MobileMaskHelper.MaskMobile(
                            b.Instructor.ContactMobile
                        )
                    }
                })
                .ToListAsync();

            return Ok(batches);
        }
    }
}
