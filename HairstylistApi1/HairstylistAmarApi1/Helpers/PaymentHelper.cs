using System.Security.Cryptography;
using System.Text;

public static class PaymentHelper
{
    public static string GenerateHmacSHA256(string message, string secret)
    {
        byte[] keyBytes = Encoding.UTF8.GetBytes(secret);
        byte[] messageBytes = Encoding.UTF8.GetBytes(message);

        using var hmac = new HMACSHA256(keyBytes);
        byte[] hash = hmac.ComputeHash(messageBytes);

        return BitConverter.ToString(hash).Replace("-", "").ToLower();
    }

    public static bool VerifySignature(string orderId, string paymentId, string signature, string secret)
    {
        string payload = $"{orderId}|{paymentId}";
        string expected = GenerateHmacSHA256(payload, secret);

        return expected == signature;
    }

    public static bool VerifyWebhook(string payload, string receivedSignature, string secret)
    {
        string expected = GenerateHmacSHA256(payload, secret);
        return expected == receivedSignature;
    }
}
