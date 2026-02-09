using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using HairStylistAmar.Models.Entities;

namespace HairStylistAmar.Controllers.Services
{
    [ApiController]
    [Authorize(Roles = "Instructor")]
    [Route("api/services/manage")]
    public class ServicesManagementController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServicesManagementController(AppDbContext context)
        {
            _context = context;
        }

       
        [HttpPost]
        public async Task<ActionResult<Service>> CreateService(Service service)
        {
            if (service.ServiceId == Guid.Empty)
                service.ServiceId = Guid.NewGuid();

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetServiceById),
                new { id = service.ServiceId },
                service
            );
        }

       
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateService(Guid id, Service updated)
        {
            if (id != updated.ServiceId)
                return BadRequest("ServiceId mismatch.");

            var existing = await _context.Services.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.Name = updated.Name;
            existing.Description = updated.Description;
            existing.Price = updated.Price;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteService(Guid id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
                return NotFound();

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        
        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Service>> GetServiceById(Guid id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
                return NotFound();

            return service;
        }
    }
}
