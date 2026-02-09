using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Razorpay.Api;
using HairStylistAmar.Models.DTO;
using HairStylistAmar.Models.Entities;
using HairStylistAmar.Services;

namespace HairStylistAmar.Controllers.Payments
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;

        public PaymentsController(
            IConfiguration config,
            AppDbContext context,
            EmailService emailService
        )
        {
            _config = config;
            _context = context;
            _emailService = emailService;
        }

        
        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Batch)
                .FirstOrDefaultAsync(b => b.BookingId == dto.BookingId);

            if (booking == null)
                return BadRequest("Invalid Booking ID");

            var keyId = _config["Razorpay:KeyId"];
            var keySecret = _config["Razorpay:KeySecret"];

            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            int amountInPaise = dto.Amount * 100;

            Dictionary<string, object> options = new()
            {
                { "amount", amountInPaise },
                { "currency", "INR" },
                { "receipt", dto.BookingId.ToString() }
            };

            Order order = client.Order.Create(options);

            return Ok(new
            {
                orderId = order["id"].ToString(),
                amount = amountInPaise,
                currency = "INR",
                key = keyId
            });
        }


        
        [HttpPost("verify")]
        public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentDto dto)
        {
            string secret = _config["Razorpay:KeySecret"];

            bool isValid = PaymentHelper.VerifySignature(
                dto.RazorpayOrderId,
                dto.RazorpayPaymentId,
                dto.RazorpaySignature,
                secret
            );

            if (!isValid)
                return BadRequest("Invalid payment signature!");

            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Batch)
                .FirstOrDefaultAsync(b => b.BookingId == dto.BookingId);

            if (booking == null)
                return BadRequest("Booking not found!");

            if (booking.Status == "Booked")
                return BadRequest("Booking already confirmed.");

            
            var payment = new Payment
            {
                PaymentId = Guid.NewGuid(),
                BookingId = dto.BookingId,
                UserId = booking.UserId,
                Amount = booking.Batch.Price,
                PaymentDate = DateTime.UtcNow,
                TransactionId = dto.RazorpayPaymentId,
                PaymentMethod = "Razorpay",
                Status = "Success"
            };

            _context.Payments.Add(payment);
            booking.Status = "Booked";

            await _context.SaveChangesAsync();

            
            _ = Task.Run(async () =>
            {
                try
                {
                    await _emailService.SendPaymentSuccessEmail(
                        booking.User.Email,
                        booking.User.FullName,
                        booking.Batch.BatchName,
                        booking.Batch.Price
                    );
                }
                catch (Exception ex)
                {
                    
                    Console.WriteLine("Email failed: " + ex.Message);
                }
            });

            
            return Ok(new
            {
                message = "Payment verified & booking confirmed"
            });
        }


       
        [HttpPost("webhook")]
        public async Task<IActionResult> RazorpayWebhook()
        {
            string webhookSecret = _config["Razorpay:WebhookSecret"];
            string receivedSignature = Request.Headers["X-Razorpay-Signature"];

            using var reader = new StreamReader(Request.Body);
            string payload = await reader.ReadToEndAsync();

            bool isValid = PaymentHelper.VerifyWebhook(
                payload,
                receivedSignature,
                webhookSecret
            );

            if (!isValid)
                return BadRequest("Invalid webhook signature.");

            return Ok();
        }
    }
}
