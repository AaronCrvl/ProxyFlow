namespace Gateway.Api.Models.Entities
{
    public class RequestLog
    {        
        public long Id { get; set; }
        
        public string Headers { get; set; } = "";
        
        public string Body { get; set; } = "";      
    }
}