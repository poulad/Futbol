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
    [Route("api/subscription-key")]
    [ApiController]
    public class SubscriptionKeyController : ControllerBase
    {
        private readonly string _vapidPublicKey;

        public SubscriptionKeyController(IOptions<VAPID> vapidOptions)
        {
            _vapidPublicKey = vapidOptions.Value.PublicKey;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new {publicKey = _vapidPublicKey});
        }
    }
}
