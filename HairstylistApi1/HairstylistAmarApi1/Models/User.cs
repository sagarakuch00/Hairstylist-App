using System.ComponentModel.DataAnnotations;

public class User
{
    [Key]
    public Guid UserId { get; set; }

    [Required]
    [StringLength(50)]
    public string OAuthProvider { get; set; }   // Google, Facebook, etc.

    [Required]
    [StringLength(200)]
    public string ProviderUserId { get; set; }  // Google Sub ID

    [Required]
    [StringLength(150)]
    public string FullName { get; set; }

    [Required]
    [StringLength(200)]
    [EmailAddress]
    public string Email { get; set; }

    [StringLength(300)]
    public string PhotoUrl { get; set; }

    [Required]
    [StringLength(20)]
    public string? Role { get; set; } 

    [StringLength(10)]
    public string? MobileNumber { get; set; }   
    public DateTime? UpdatedAt { get; set; }    
}
