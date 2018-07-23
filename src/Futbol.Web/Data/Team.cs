using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Futbol.Web.Data
{
    [JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
    public class Team
    {
        public string Id { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
