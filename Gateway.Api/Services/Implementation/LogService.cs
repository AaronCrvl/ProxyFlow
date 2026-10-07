using Gateway.Api.Database.Models.DTO;
using Gateway.Api.Helpers;
using Gateway.Api.Repositories.Interfaces;
using Gateway.Api.Services.Interfaces;

namespace Gateway.Api.Services.Implementation
{
    public class LogService : ILogService
    {
        private readonly ILogRepository repo;

        public LogService(ILogRepository _repo)
        {
            this.repo = _repo;
        }

        public async Task<IEnumerable<RequestLogDTO>> GetLatestLogs()
        {
            var logs = await repo.getLatestLogsAsync();
            return logs.Select(DTOHandle.ToRequestLogDto).ToList();
        }

        public async Task<IEnumerable<RequestLogDTO>> GetLatestLogsByServiceOrigin(long originId)
        {
            var logs = await repo.getLatestLogsByServiceOriginAsync(originId);
            return logs.Select(DTOHandle.ToRequestLogDto).ToList();
        }

        public async Task<IEnumerable<IGrouping<string, RequestLogDTO>>> GetWebHookCallsByMethod(string method)
        {
            var logs = await repo.getWebHookCallsAsync();
            var dtos = logs.Select(DTOHandle.ToRequestLogDto);

            if (!string.IsNullOrEmpty(method))            
                dtos = dtos.Where(d => d.method == method);
            
            return dtos
                .GroupBy(d => d.method)
                .ToList();
        }    
    }
}