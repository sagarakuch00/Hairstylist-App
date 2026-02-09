using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using HairStylistAmar.Models;

namespace HairStylistAmar.Services
{
    public class EmailService
    {
        private readonly EmailSettings _email;

        public EmailService(IOptions<EmailSettings> emailOptions)
        {
            _email = emailOptions.Value;
        }

        public async Task SendPaymentSuccessEmail(
            string toEmail,
            string userName,
            string batchName,
            decimal amount
        )
        {
            using var smtpClient = new SmtpClient(_email.Host)
            {
                Port = _email.Port,
                Credentials = new NetworkCredential(
                    _email.Username,
                    _email.Password
                ),
                EnableSsl = true
            };

            using var mail = new MailMessage
            {
                From = new MailAddress(_email.From),
                Subject = "Payment Successful – Hairvona",
                Body = $@"
                            Hi {userName},

                            🎉 Your payment was successful!

                            Batch: {batchName}
                            Amount Paid: ₹{amount}

                            Thank you for choosing Hairvona 💜

                            Regards,
                            Hairvona Team
                            ",
                IsBodyHtml = false
            };

            mail.To.Add(toEmail);

            await smtpClient.SendMailAsync(mail);
        }
    }
}
