namespace HairStylistAmar.Models.DTO
{
    public class InstructorBatchStatsDto
    {
        public Guid BatchId { get; set; }
        public string BatchName { get; set; }
        public DateTime StartDate { get; set; }
        public int StudentsEnrolled { get; set; }
        public decimal TotalEarnings { get; set; }
        public string Status { get; set; } // Upcoming / Ongoing / Completed
    }

}
