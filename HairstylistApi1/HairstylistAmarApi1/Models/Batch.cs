using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Batch
{
    [Key]
    public Guid BatchId { get; set; }

    [Required]
    public Guid InstructorId { get; set; }

    [Required]
    public Guid ServiceId { get; set; }

    [ForeignKey(nameof(ServiceId))]
    public Service? Service { get; set; }    // nullable navigation

    [Required]
    [MaxLength(100)]
    public string BatchName { get; set; }

    [Required]
    [StringLength(500)]
    public string Description { get; set; }

    [Required]
    [Range(1, 100000)]
    public decimal Price { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    [Required]
    [Range(1, 1000)]
    public int TotalSeats { get; set; }

    [Required]
    [Range(0, 1000)]
    public int AvailableSeats { get; set; }


    [ForeignKey(nameof(InstructorId))]
    public Instructor? Instructor { get; set; }  // nullable navigation

    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
