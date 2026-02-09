using HairStylistAmar.Models.DTO;
using HairStylistAmar.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    private readonly AppDbContext _context;

    public SearchController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return Ok(new SearchResultDto());

        query = query.Trim().ToLower();

      
        var services = await _context.Services
            .Where(s => s.Name.ToLower().Contains(query))
            .Select(s => new ServiceSearchDto
            {
                ServiceId = s.ServiceId,
                Name = s.Name
            })
            .ToListAsync();

        var serviceIds = services.Select(s => s.ServiceId).ToList();

        
        var instructors = await _context.Instructors
            .Where(i =>
                i.Name.ToLower().Contains(query) ||
                i.Specialization.ToLower().Contains(query)
            )
            .Select(i => new InstructorSearchDto
            {
                InstructorId = i.InstructorId,
                Name = i.Name,
                Specialization = i.Specialization,
                PhotoUrl = i.PhotoUrl
            })
            .ToListAsync();

        var instructorIds = instructors.Select(i => i.InstructorId).ToList();

        
        var batches = await _context.Batches
            .Where(b =>
                b.BatchName.ToLower().Contains(query) ||
                serviceIds.Contains(b.ServiceId) ||
                instructorIds.Contains(b.InstructorId)
            )
            .Select(b => new BatchSearchDto
            {
                BatchId = b.BatchId,
                BatchName = b.BatchName,
                StartDate = b.StartDate,
                Price = b.Price
            })
            .ToListAsync();

        var result = new SearchResultDto
        {
            Services = services,
            Instructors = instructors,
            Batches = batches
        };

        return Ok(result);
    }
}
