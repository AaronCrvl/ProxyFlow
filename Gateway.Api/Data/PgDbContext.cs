using Gateway.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Gateway.Api.Data
{
    public class PgDbContext : DbContext
    {
        public DbSet<RequestLog> RequestLogs { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            string connectionString = "";
            options.UseNpgsql(connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RequestLog>().ToTable("RequestLogs", "logschema");
            base.OnModelCreating(modelBuilder);
        }
    }
}