using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


    public class Instructor
    {
        [Key]
        public Guid InstructorId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;


        [Required(ErrorMessage = "Name is required")]
        [StringLength(150, ErrorMessage = "Name cannot exceed 150 characters")]
        public string? Name { get; set; }

        [Required]
        [StringLength(15)]
        [Phone]
        public string ContactMobile { get; set; }


    [Required(ErrorMessage = "Specialization is required")]
        [StringLength(150, ErrorMessage = "Specialization cannot exceed 150 characters")]
        public string? Specialization { get; set; }

        [Url(ErrorMessage = "Invalid Photo URL format")]
        [StringLength(300, ErrorMessage = "Photo URL cannot exceed 300 characters")]
        public string? PhotoUrl { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        public ICollection<Batch> Batches { get; set; } = new List<Batch>();
    }

