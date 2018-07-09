using Microsoft.AspNetCore.Mvc;
using Futbol.Web.Options;
using Microsoft.Extensions.Options;

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
