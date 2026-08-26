using System.ComponentModel.DataAnnotations.Schema;

namespace Gateway.Api.Models.Entities
{
    [Table("RequestLogs", Schema = "logschema")]
    public class RequestLog
    {
        [Column("Id")]
        public long Id { get; set; }

        [Column("Headers")]
        public string Headers { get; set; } = "";

        [Column("Body")]
        public string Body { get; set; } = "";

        [Column("Method")]
        public string Method { get; set; } = "";

        [Column("TimeStamp")]
        public string TimeStamp { get; set; } = "";

        [Column("ResponseStatusCode")]
        public long ResponseStatusCode { get; set; } = 0;

        [Column("ResponseBody")]
        public string ResponseBody { get; set; } = "";

        [Column("Url")]
        public string Url { get; set; } = "";

        [Column("ClientIp")]
        public string ClientIp { get; set; } = "";

        [Column("ServiceOrigin")]
        public long ServiceOrigin { get; set; } = (long)eServiceOrigin.API;
    }
}