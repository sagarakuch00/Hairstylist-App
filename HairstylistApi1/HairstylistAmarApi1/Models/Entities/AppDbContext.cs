using Microsoft.EntityFrameworkCore;

namespace HairStylistAmar.Models.Entities
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
           : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Instructor> Instructors { get; set; }
        public DbSet<Batch> Batches { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // USER → INSTRUCTOR (1:1)
            modelBuilder.Entity<Instructor>()
                .HasOne(i => i.User)
                .WithMany()
                .HasForeignKey(i => i.UserId)
                .OnDelete(DeleteBehavior.Restrict);  

            // USER → BOOKINGS (1:M)
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);  

            // USER → PAYMENTS (1:M)
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);  

            // SERVICE → BATCHES (1:M)
            modelBuilder.Entity<Batch>()
                .HasOne(b => b.Service)
                .WithMany()
                .HasForeignKey(b => b.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);  

            // INSTRUCTOR → BATCHES (1:M)
            modelBuilder.Entity<Batch>()
                .HasOne(b => b.Instructor)
                .WithMany(i => i.Batches)
                .HasForeignKey(b => b.InstructorId)
                .OnDelete(DeleteBehavior.Restrict);  

            // BATCH → BOOKINGS (1:M)
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Batch)
                .WithMany(bc => bc.Bookings)
                .HasForeignKey(b => b.BatchId)
                .OnDelete(DeleteBehavior.Restrict);  

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Booking)
                .WithOne(b => b.Payment)
                .HasForeignKey<Payment>(p => p.BookingId);

        }


    }
}
