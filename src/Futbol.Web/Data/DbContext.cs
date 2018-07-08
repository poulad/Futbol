using Microsoft.EntityFrameworkCore;

namespace Futbol.Web.Data
{
    public class FutbolContext : DbContext
    {
        public DbSet<PushSubscription> PushSubscriptions { get; set; }

        public DbSet<Team> Teams { get; set; }

        public FutbolContext(DbContextOptions<FutbolContext> options)
            : base(options)
        {
        }
    }
}
