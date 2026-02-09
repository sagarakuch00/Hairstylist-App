public class CreateOrderDto
{
    public Guid BookingId { get; set; }
    public int Amount { get; set; } // INR ₹ (not paise)    
}
