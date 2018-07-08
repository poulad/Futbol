using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Futbol.Web.Data
{
    public static class DatabaseInitializerExtensions
    {
        public static void InitializeDatabase(this IApplicationBuilder app)
        {
            InitAsync(app).GetAwaiter().GetResult();
        }

        private static async Task InitAsync(IApplicationBuilder app)
        {
            using (var scope = app.ApplicationServices.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<FutbolContext>();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<DatabaseInitializer>>();
                var databaseInitializer = new DatabaseInitializer(dbContext, logger);

                await databaseInitializer.InitializeAsync()
                    .ConfigureAwait(false);

                await databaseInitializer.SeeDataAsync()
                    .ConfigureAwait(false);
            }
        }
    }
}
