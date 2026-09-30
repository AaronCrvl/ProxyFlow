using Gateway.Api.Database.Models.DTO;
using Gateway.Api.Models.Entities;
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
            return logs.Select(ToDto).ToList();
        }

        public async Task<IEnumerable<RequestLogDTO>> GetLatestLogsByServiceOrigin(long originId)
        {
            var logs = await repo.getLatestLogsByServiceOriginAsync(originId);
            return logs.Select(ToDto).ToList();
        }

        public async Task<IEnumerable<IGrouping<string, RequestLogDTO>>> GetWebHookCallsByMethod(string method)
        {
            var logs = await repo.getWebHookCallsAsync();
            var dtos = logs.Select(ToDto);

            if (!string.IsNullOrEmpty(method))            
                dtos = dtos.Where(d => d.method == method);
            
            return dtos
                .GroupBy(d => d.method)
                .ToList();
        }

        private static RequestLogDTO ToDto(RequestLog req) => new RequestLogDTO
        {
            id = req.Id,
            body = req.Body,
            headers = req.Headers,
            method = req.Method,
            timestamp = req.TimeStamp,
            clientIp = req.ClientIp,
            responseBody = req.ResponseBody,
            responseStatusCode = req.ResponseStatusCode,
            serviceOrigin = req.ServiceOrigin
        };
    }
}