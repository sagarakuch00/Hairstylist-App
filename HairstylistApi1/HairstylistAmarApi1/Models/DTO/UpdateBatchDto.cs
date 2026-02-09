namespace HairStylistAmar.Models.DTO
{
    using System.ComponentModel.DataAnnotations;

    public class UpdateBatchDto
    {
        [Required]
        public string BatchName { get; set; }

        public string? Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public Guid ServiceId { get; set; }

        public int TotalSeats { get; set; }
    }

}
