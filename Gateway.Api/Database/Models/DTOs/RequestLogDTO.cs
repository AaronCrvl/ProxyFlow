using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Gateway.Api.Database.Models.DTO
{    
    public class RequestLogDTO
    {        
        public long id { get; set; }
        public string headers { get; set; } = "";        
        public string body { get; set; } = "";
        public string method { get; set; } = "";
        public string timestamp { get; set; } = "";
        public long responseStatusCode { get; set; } = 0;
        public string responseBody { get; set; } = "";
        public string url { get; set; } = "";
        public string clientIp { get; set; } = "";
        public long serviceOrigin { get; set; } = (long)eServiceOrigin.API;
    }
}