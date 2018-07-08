using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Futbol.Web.Models
{
    [JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy), ItemNullValueHandling = NullValueHandling.Ignore)]
    public class PushNotification
    {
        public string Title { get; set; }

        public PushNotificationOptions Options { get; set; }
    }
}
