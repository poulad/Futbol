using System;
using Futbol.Web.Data;
using Futbol.Web.Jobs;
using Futbol.Web.Options;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Futbol.Web
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        private const string NgSpaPathProduction = "ClientApp/";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var connectionString = Configuration.GetConnectionString("FutbolContext");
            services.AddEntityFrameworkNpgsql()
                .AddDbContext<FutbolContext>(options =>
                    options.UseNpgsql(connectionString)
                );

            services.AddHangfire(config => { config.UsePostgreSqlStorage(connectionString); });
            services.AddTransient<PushNotificationJob>();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(config => { config.RootPath = NgSpaPathProduction; });

            services.Configure<VAPID>(Configuration.GetSection(nameof(VAPID)));
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHttpsRedirection();
                app.UseHsts();
            }

            app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod());

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseMvc();

            app.UseSpa(spa =>
            {
                if (env.IsDevelopment())
                {
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
                else
                {
                    spa.Options.SourcePath = NgSpaPathProduction;
                }
            });

            app.UseHangfireServer();
            app.ScheduleJobs();

            try
            {
                app.InitializeDatabase();
            }
            catch (Exception e)
            {
                logger.LogError(e, "Failed to initialize database.");
                throw;
            }
        }
    }
}
