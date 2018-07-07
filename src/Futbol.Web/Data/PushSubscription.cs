using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Futbol.Web.Data
{
    public class PushSubscription
    {
        public string Id { get; set; }

        [Column(TypeName = "JSON")] public string Agents { get; set; }

        [Required] [Column(TypeName = "JSON")] public string Data { get; set; }
    }
}
