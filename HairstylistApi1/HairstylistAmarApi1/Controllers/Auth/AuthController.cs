using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HairStylistAmar.Models.Entities;
using System.Text.RegularExpressions;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext dbContext, IConfiguration config)
    {
        _dbContext = dbContext;
        _config = config;
    }

  
    public class GoogleLoginRequest
    {
        public string IdToken { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // User | Instructor
        public string? MobileNumber { get; set; }
    }

    
    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
     
        if (request == null || string.IsNullOrWhiteSpace(request.IdToken))
            return BadRequest("Missing Google token.");

        if (request.Role != UserRoles.User && request.Role != UserRoles.Instructor)
            return BadRequest("Role must be User or Instructor.");

       
        if (request.Role == UserRoles.Instructor)
        {
            if (string.IsNullOrWhiteSpace(request.MobileNumber))
                return BadRequest("Mobile number is required for instructor.");

            if (!Regex.IsMatch(request.MobileNumber, @"^[0-9]{10}$"))
                return BadRequest("Invalid mobile number format.");
        }

  
        GoogleJsonWebSignature.Payload payload;

        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(
                request.IdToken,
                new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _config["Google:ClientId"] }
                });
        }
        catch
        {
            return Unauthorized("Invalid Google token.");
        }

       
        var user = await _dbContext.Users.FirstOrDefaultAsync(x =>
            x.OAuthProvider == "Google" &&
            x.ProviderUserId == payload.Subject);

        
        if (user == null)
        {
            user = new User
            {
                UserId = Guid.NewGuid(),
                OAuthProvider = "Google",
                ProviderUserId = payload.Subject,
                FullName = payload.Name,
                Email = payload.Email,
                PhotoUrl = payload.Picture,
                Role = request.Role,                
                MobileNumber = request.Role == UserRoles.Instructor
                    ? request.MobileNumber
                    : null,
               
            };

            _dbContext.Users.Add(user);
        }

        await _dbContext.SaveChangesAsync();

      
        var token = JwtTokenHelper.GenerateToken(user, _config);

        return Ok(new
        {
            token,
            userId = user.UserId,
            role = user.Role,
            fullName = user.FullName,
            email = user.Email
        });
    }
}
