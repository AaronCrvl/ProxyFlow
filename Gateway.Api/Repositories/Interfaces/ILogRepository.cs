using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gateway.Api.Models.Entities;

namespace Gateway.Api.Repositories.Interfaces
{
    public interface ILogRepository
    {
        Task<IEnumerable<RequestLog>> getLatestLogsAsync();
        Task<IEnumerable<RequestLog>> getLatestLogsByServiceOriginAsync(long originId);
    }
}