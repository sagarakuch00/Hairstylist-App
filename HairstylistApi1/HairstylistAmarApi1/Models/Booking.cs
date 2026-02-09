using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//using HairStylistApp.API.Models.Batch;



public class Booking
{
    [Key]
    public Guid BookingId { get; set; }


    [Required]
    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    [Required]
    [ForeignKey(nameof(Batch))]
    public Guid BatchId { get; set; }

    public Batch Batch { get; set; } = null!;

    [Required]
    public DateTime BookingDate { get; set; }


    [Required]
    [StringLength(15)]
    [Phone]
    public string MobileNumber { get; set; }



    [MaxLength(50)]
    public string? Status { get; set; } = "Pending";

    public Payment? Payment { get; set; }

}
