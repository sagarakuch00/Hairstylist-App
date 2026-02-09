using System;
using System.ComponentModel.DataAnnotations;
public class Service
{
    [Key]
    public Guid ServiceId { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "Service name cannot exceed 100 characters.")]
    public string Name { get; set; }

    [Required]
    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
    public string Description { get; set; }

    [Required]
    [Range(0, 100000, ErrorMessage = "Price must be a positive value.")]
    public decimal Price { get; set; }

    [Required]
    [Range(1, 30, ErrorMessage = "Duration must be between 1 and 30 days.")]
    public int DurationDays { get; set; } = 10;  
}
