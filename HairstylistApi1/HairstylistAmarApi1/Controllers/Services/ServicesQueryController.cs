using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HairStylistAmar.Models.Entities;

namespace HairStylistAmar.Controllers.Services
{
    [ApiController]
    [Route("api/services")]
    public class ServicesQueryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServicesQueryController(AppDbContext context)
        {
            _context = context;
        }

       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> GetServices()
        {
            return await _context.Services.ToListAsync();
        }

        
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Service>> GetService(Guid id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
                return NotFound();

            return service;
        }
    }
}
