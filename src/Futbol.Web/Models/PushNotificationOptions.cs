using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Futbol.Web.Models
{
    [JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy), ItemNullValueHandling = NullValueHandling.Ignore)]
    public class PushNotificationOptions
    {
        public string Body { get; set; }

        public string Tag { get; set; }

        public string Icon { get; set; }

        public string Image { get; set; }

        public object Data { get; set; }

        public bool? RequireInteraction { get; set; }

        public PushNotificationAction[] Actions { get; set; }
    }
}
