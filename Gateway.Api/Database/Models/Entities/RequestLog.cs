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
    }
}