using System.ComponentModel.DataAnnotations;

namespace HairStylistAmar.Models.DTO
{
    public class CreateBatchDto
    {
        [Required]
        [StringLength(150)]
        public string BatchName { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(1, 100000)]
        public decimal Price { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public Guid ServiceId { get; set; }

        [Required]
        [Range(1, 1000)]
        public int TotalSeats { get; set; }

        [Required]
        [StringLength(10)]
        public string MobileNumber { get; set; }

    }
}
