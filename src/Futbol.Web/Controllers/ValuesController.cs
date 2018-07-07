using System;
using System.Threading.Tasks;
using Futbol.Web.Data;
using Futbol.Web.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using WebPush;

namespace Futbol.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly FutbolContext _dbContext;

        private readonly ILogger<ValuesController> _logger;

        private readonly VapidDetails _vapidDetails;

        public ValuesController(
            IOptions<VAPID> vapidOptions,
            FutbolContext dbContext,
            ILogger<ValuesController> logger
        )
        {
            _dbContext = dbContext;
            _logger = logger;
            _vapidDetails = new VapidDetails(
                vapidOptions.Value.Subject,
                vapidOptions.Value.PublicKey,
                vapidOptions.Value.PrivateKey
            );
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var subscriptions = await _dbContext.PushSubscriptions.ToArrayAsync();

            var webPushClient = new WebPushClient();
            string payload = JsonConvert.SerializeObject(new
            {
                version = "v1",
                data = "Sample data",
            });
            foreach (var sub in subscriptions)
            {
                if (string.IsNullOrWhiteSpace(sub.Data))
                {
                    continue;
                }

                dynamic jsonObj = JsonConvert.DeserializeObject(sub.Data);
                string pushEndpoint = (string) jsonObj.endpoint;
                string p256dh = (string) jsonObj.keys?.p256dh;
                string auth = (string) jsonObj.keys?.auth;

                if (string.IsNullOrWhiteSpace(auth))
                {
                    continue;
                }

                try
                {
                    var subscription = new WebPush.PushSubscription(pushEndpoint, p256dh, auth);

                    await webPushClient.SendNotificationAsync(subscription, payload, _vapidDetails);
                }
                catch (WebPushException exception)
                {
                    Console.WriteLine("Http STATUS code" + exception.StatusCode);
                }
            }

            return Ok();
        }
    }
}
