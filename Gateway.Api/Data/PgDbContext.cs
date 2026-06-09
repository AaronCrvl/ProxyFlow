using Gateway.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Gateway.Api.Data
{
    public class PgDbContext : DbContext
    {
        public DbSet<RequestLog> RequestLogs { get; set; }

        public PgDbContext(DbContextOptions<PgDbContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
                throw new Exception("Configure DB to start app.");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RequestLog>(entity =>
            {
                entity.ToTable("RequestLogs", "logschema"); 

                entity.Property(e => e.Id).HasColumnName("Id");
                entity.Property(e => e.Headers).HasColumnName("Headers");
                entity.Property(e => e.Body).HasColumnName("Body");
                entity.Property(e => e.Method).HasColumnName("Method");
                entity.Property(e => e.TimeStamp).HasColumnName("TimeStamp");
            });
        }
    }
}