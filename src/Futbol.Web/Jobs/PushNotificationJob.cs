using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Futbol.Web.Data;
using Futbol.Web.Models;
using Futbol.Web.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using WebPush;

namespace Futbol.Web.Jobs
{
    public class PushNotificationJob
    {
        private readonly FutbolContext _dbContext;

        private readonly ILogger<PushNotificationJob> _logger;

        private readonly VapidDetails _vapidDetails;

        public PushNotificationJob(
            IOptions<VAPID> vapidOptions,
            FutbolContext dbContext,
            ILogger<PushNotificationJob> logger
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

        public async Task RunAsync(CancellationToken cancellationToken = default)
        {
            var subscriptions = await _dbContext.PushSubscriptions
                .ToArrayAsync(cancellationToken)
                .ConfigureAwait(false);

            var teams = await _dbContext.Teams
                .ToArrayAsync(cancellationToken)
                .ConfigureAwait(false);

            var webPushClient = new WebPushClient();
            foreach (var sub in subscriptions)
            {
                if (string.IsNullOrWhiteSpace(sub.Data))
                {
                    continue;
                }

                dynamic jsonObj = JsonConvert.DeserializeObject(sub.Data);
                string pushEndpoint = (string)jsonObj.endpoint;
                string p256Dh = (string)jsonObj.keys?.p256dh;
                string auth = (string)jsonObj.keys?.auth;

                if (string.IsNullOrWhiteSpace(auth))
                {
                    continue;
                }

                string payload = CreatePayload(teams);
                try
                {
                    var subscription = new WebPush.PushSubscription(pushEndpoint, p256Dh, auth);
                    await webPushClient.SendNotificationAsync(subscription, payload, _vapidDetails);
                }
                catch (WebPushException e)
                    when (e.Message.Contains("no longer valid", StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogWarning(e, "Remvoing invalid subscription.");
                    await RemoveSubscription(sub, cancellationToken)
                        .ConfigureAwait(false);
                }
                catch (WebPushException e)
                {
                    _logger.LogError(e, "Unable to push notfications");
                }
            }
        }

        private async Task RemoveSubscription(Data.PushSubscription subscription,
            CancellationToken cancellationToken = default)
        {
            var sub = await _dbContext.PushSubscriptions
                .SingleAsync(s => s.Id == subscription.Id, cancellationToken)
                .ConfigureAwait(false);

            _dbContext.Remove(sub);
            await _dbContext.SaveChangesAsync(cancellationToken)
                .ConfigureAwait(false);
        }

        private string CreatePayload(Team[] teams)
        {
            var rnd = new Random(DateTime.UtcNow.Millisecond);
            var selectedTeams = Enumerable
                .Range(0, 3)
                .Select(_ => rnd.Next(teams.Length))
                .Select(i => teams[i])
                .Distinct()
                .ToArray();

            var actions = selectedTeams
                .Select(t => new PushNotificationAction
                {
                    Title = t.Name,
                    Icon = "assets/images/wc.png",
                    Action = $"TEAM:{t.Name}"
                })
                .ToArray();

            string payload = JsonConvert.SerializeObject(new PushNotification
            {
                Title = "Teams",
                Options = new PushNotificationOptions
                {
                    Body = "Checkout teams in the World Cup ⚽",
                    Icon = "assets/images/wc.png",
                    Actions = actions,
                    Tag = "TEAMS",
                }
            });

            return payload;
        }
    }
}
