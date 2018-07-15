using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
using Futbol.Web.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Futbol.Web.Controllers
{
    [Route("api/unsubscribe")]
    [ApiController]
    public class UnsubscribeController : ControllerBase
    {
        private readonly FutbolContext _dbContext;

        private readonly ILogger<UnsubscribeController> _logger;

        public UnsubscribeController(
            FutbolContext dbContext,
            ILogger<UnsubscribeController> logger
        )
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] JObject body)
        {
            dynamic jsonObj = body;
            string pushEndpoint = (string)jsonObj.endpoint;

            if (string.IsNullOrWhiteSpace(pushEndpoint))
            {
                return BadRequest();
            }

            var subscription = await _dbContext.PushSubscriptions.FromSql(
                    @"SELECT * FROM ""PushSubscriptions"" WHERE (""Data""->>'endpoint')::TEXT = {0}",
                    pushEndpoint
                )
                .SingleOrDefaultAsync()
                .ConfigureAwait(false);

            if (subscription != null)
            {
                _dbContext.PushSubscriptions.Remove(subscription);
                await _dbContext.SaveChangesAsync()
                    .ConfigureAwait(false);
            }

            return Ok();
        }
    }
}
