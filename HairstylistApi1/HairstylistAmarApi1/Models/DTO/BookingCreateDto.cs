using System.ComponentModel.DataAnnotations;

namespace HairStylistAmar.Models.DTO
{
    public class BookingCreateDto
    {
        public Guid UserId { get; set; }
        public Guid BatchId { get; set; }
        public DateTime BookingDate { get; set; }

        [Required]
        [StringLength(15)]
        [Phone]
        public string StudentMobile { get; set; }
    }

}
