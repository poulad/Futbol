using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Futbol.Web.Models
{
    [JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy), ItemNullValueHandling = NullValueHandling.Ignore)]
    public class PushNotificationAction
    {
        public string Action { get; set; }

        public string Title { get; set; }

        public string Icon { get; set; }
    }
}
