using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


    public class Payment
    {
        [Key]
        public Guid PaymentId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;

        [Required]
        public Guid BookingId { get; set; }

        [ForeignKey(nameof(BookingId))]
        public Booking Booking { get; set; } = null!;

        [Required]
        [Range(1, 200000, ErrorMessage = "Amount must be greater than 0.")]
        public decimal Amount { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }

        [Required]
        [StringLength(100)]
        public string TransactionId { get; set; }  // Razorpay / Stripe / UPI ref

        [Required]
        [StringLength(30)]
        public string PaymentMethod { get; set; }  // UPI, Card, Wallet, NetBanking, etc.

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Success";
    }

