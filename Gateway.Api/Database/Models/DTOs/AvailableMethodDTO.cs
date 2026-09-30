using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gateway.Api.Database.Models.DTOs
{
    public class AvailableMethodDTO
    {
        public string method { get; set; }
        public string path { get; set; }
        public string groupName { get; set; }

    }
}