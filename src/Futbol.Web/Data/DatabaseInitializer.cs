using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Futbol.Web.Data
{
    public class DatabaseInitializer
    {
        private readonly FutbolContext _dbContext;

        public DatabaseInitializer(FutbolContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task InitializeAsync()
        {
            await _dbContext.Database.EnsureCreatedAsync();
        }
    }
}
