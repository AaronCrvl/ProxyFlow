using Gateway.Api.Data;
using Gateway.Api.Models.Entities;
using Gateway.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Gateway.Api.Repositories.Implementations
{
    public class LogRepository : ILogRepository
    {
        private readonly PgDbContext con;
        public LogRepository(PgDbContext _con)
        {
            this.con = _con;
        }

        public async Task<IEnumerable<RequestLog>> getLatestLogsAsync() => 
            await con.RequestLogs.ToListAsync();

        public async Task<IEnumerable<RequestLog>> getLatestLogsByServiceOriginAsync(long originId) =>
            await con.RequestLogs.Where(req => req.ServiceOrigin == originId).ToListAsync();
    }
}