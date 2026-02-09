using System.ComponentModel.DataAnnotations;

namespace HairStylistAmar.Models.DTO
{
    public class GoogleLoginDto
    {
        [Required]
        public string IdToken { get; set; }
    }
}
