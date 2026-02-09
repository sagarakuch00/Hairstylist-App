namespace HairStylistAmar.Helpers
{
    public static class MobileMaskHelper
    {
        public static string MaskMobile(string mobile)
        {
            if (string.IsNullOrWhiteSpace(mobile) || mobile.Length < 4)
                return "********";

            return mobile.Substring(0, 2) + "******" + mobile.Substring(mobile.Length - 2);
        }
    }
}
