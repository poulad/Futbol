using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Polly;

namespace Futbol.Web.Data
{
    public class DatabaseInitializer
    {
        private readonly FutbolContext _dbContext;

        private readonly ILogger<DatabaseInitializer> _logger;

        public DatabaseInitializer(FutbolContext dbContext, ILogger<DatabaseInitializer> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task InitializeAsync()
        {
            try
            {
                await _dbContext.Database.OpenConnectionAsync()
                    .ConfigureAwait(false);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Unable to connect to database.");
                throw;
            }

            await _dbContext.Database.MigrateAsync()
                .ConfigureAwait(false);
        }

        public async Task SeeDataAsync()
        {
            var teams = await Policy
                .Handle<Exception>()
                .WaitAndRetryAsync(2,
                    i => TimeSpan.FromSeconds(i * 5 + 5),
                    (e, t) =>
                    {
                        _logger.LogError(e, "Unable to get teams from API. Retrying after {0} seconds.", t.Seconds);
                    }
                )
                .ExecuteAsync(GetTeamsAsync)
                .ConfigureAwait(false);

            string[] teamsInDb = await _dbContext.Teams
                .Select(t => t.Id)
                .ToArrayAsync()
                .ConfigureAwait(false);

            string[] newTeams = FindTeamsToAddToDb(teams, teamsInDb);

            foreach (var team in teams)
            {
                if (!newTeams.Contains(team.Id, StringComparer.OrdinalIgnoreCase))
                    continue;

                await _dbContext.Teams.AddAsync(team)
                    .ConfigureAwait(false);
            }

            await _dbContext.SaveChangesAsync();
        }

        private async Task<Team[]> GetTeamsAsync()
        {
            var http = new HttpClient {BaseAddress = new Uri("https://api.football-data.org/v2/")};
            http.DefaultRequestHeaders.Add("X-Auth-Token", "53b8cdf71c054628a6a57be9a927178c");

            var response = await http.GetAsync("competitions/2000/teams")
                .ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            string json = await response.Content.ReadAsStringAsync()
                .ConfigureAwait(false);

            var respObj = JsonConvert.DeserializeObject<JObject>(json);
            var teams = respObj["teams"].ToObject<Team[]>();
            return teams;
        }

        private string[] FindTeamsToAddToDb(Team[] teamsFromApi, string[] fromDb)
        {
            return teamsFromApi
                .Select(t => t.Id)
                .Except(fromDb, StringComparer.OrdinalIgnoreCase)
                .ToArray();
        }
    }
}
