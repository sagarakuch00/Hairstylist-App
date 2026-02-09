using System.ComponentModel.DataAnnotations;

namespace HairStylistAmar.Models.DTO
{
    public class CreateInstructorRequest
    {
        public Guid UserId { get; set; }

        [Required]
        [StringLength(15)]
        [Phone]
        public string ContactMobile { get; set; }
    }
}
