using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gateway.Api.Services.Interfaces
{
    public interface ILogService
    {
        Task<IEnumerable<Database.Models.DTO.RequestLogDTO>> GetLatestLogs();        
    }
}