using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;
using Futbol.Web.Data;
using Futbol.Web.Models;
using Futbol.Web.Options;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using WebPush;
using PushSubscription = WebPush.PushSubscription;

namespace Futbol.Web.Controllers
{
    [Route("api/subscriptions")]
    [ApiController]
    public class SubscriptionsController : ControllerBase
    {
        private readonly FutbolContext _dbContext;

        private readonly VapidDetails _vapidDetails;

        public SubscriptionsController(IOptions<VAPID> vapidOptions, FutbolContext dbContext)
        {
            _vapidDetails = new VapidDetails(
                vapidOptions.Value.Subject,
                vapidOptions.Value.PublicKey,
                vapidOptions.Value.PrivateKey
            );
            _dbContext = dbContext;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] JObject body)
        {
            dynamic jsonObj = body;
            string pushEndpoint = (string) jsonObj.endpoint;
            string p256dh = (string) jsonObj.keys?.p256dh;
            string auth = (string) jsonObj.keys?.auth;

            string payload = JsonConvert.SerializeObject(new PushNotification
            {
                Title = "Nice! You are subscribed for push notifications.",
                Options = new PushNotificationOptions
                {
                    Icon = "favicon.ico",
                }
            });

            string json = body.ToString();

            await _dbContext.PushSubscriptions.AddAsync(new Data.PushSubscription
            {
                Data = json,
            });

            await _dbContext.SaveChangesAsync();

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
