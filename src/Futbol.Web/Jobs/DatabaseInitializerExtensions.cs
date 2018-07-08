using System;
using System.Threading;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Futbol.Web.Jobs
{
    public static class JobSchedulerExtensions
    {
        public static IApplicationBuilder App { get; private set; }

        public static void ScheduleJobs(this IApplicationBuilder app)
        {
            App = app;
            RecurringJob.AddOrUpdate(
                () => RunPushNotifications(),
                Cron.Minutely
            );
        }

        public static async Task RunPushNotifications()
        {
            using (var scope = App.ApplicationServices.CreateScope())
            {
                var job = scope.ServiceProvider.GetRequiredService<PushNotificationJob>();
                var tokenSource = new CancellationTokenSource(TimeSpan.FromSeconds(55));
                await job.RunAsync(tokenSource.Token)
                    .ConfigureAwait(false);
            }
        }
    }
}
