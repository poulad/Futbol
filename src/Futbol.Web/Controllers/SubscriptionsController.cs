using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;
using Futbol.Web.Options;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using WebPush;

namespace Futbol.Web.Controllers
{
    [Route("api/subscriptions")]
    [ApiController]
    public class SubscriptionsController : ControllerBase
    {
        private readonly VapidDetails _vapidDetails;

        public SubscriptionsController(IOptions<VAPID> vapidOptions)
        {
            _vapidDetails = new VapidDetails(
                vapidOptions.Value.Subject,
                vapidOptions.Value.PublicKey,
                vapidOptions.Value.PrivateKey
            );
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] JObject body)
        {
            dynamic json = body;
            string pushEndpoint = (string) json.endpoint;
            string p256dh = (string) json.keys?.p256dh;
            string auth = (string) json.keys?.auth;

            string payload = JsonConvert.SerializeObject(new
            {
                version = "v1",
                data = "Sample data",
            });

            var webPushClient = new WebPushClient();
            try
            {
                var subscription = new PushSubscription(pushEndpoint, p256dh, auth);

                await webPushClient.SendNotificationAsync(subscription, payload, _vapidDetails);
            }
            catch (WebPushException exception)
            {
                Console.WriteLine("Http STATUS code" + exception.StatusCode);
            }

            return Ok();
        }
    }
}
