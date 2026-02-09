namespace HairStylistAmar.Models.DTO
{
    public class SearchResultDto
    {
        public List<ServiceSearchDto> Services { get; set; } = new();
        public List<InstructorSearchDto> Instructors { get; set; } = new();
        public List<BatchSearchDto> Batches { get; set; } = new();
    }

    public class ServiceSearchDto
    {
        public Guid ServiceId { get; set; }
        public string Name { get; set; }
    }

    public class InstructorSearchDto
    {
        public Guid InstructorId { get; set; }
        public string Name { get; set; }
        public string Specialization { get; set; }
        public string PhotoUrl { get; set; }
    }

    public class BatchSearchDto
    {
        public Guid BatchId { get; set; }
        public string BatchName { get; set; }
        public DateTime StartDate { get; set; }
        public decimal Price { get; set; }
    }

}
