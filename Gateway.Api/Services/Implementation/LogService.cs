using Gateway.Api.Database.Models.DTO;
using Gateway.Api.Models.Entities;
using Gateway.Api.Repositories.Implementations;
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
            var dtoList = new List<RequestLogDTO>();
            IEnumerable<RequestLog> rawDatabaseList = await repo.getLatestLogsAsync();

            rawDatabaseList.ToList().ForEach(req =>
                dtoList.Add(
                    new RequestLogDTO
                    {
                        id = req.Id,
                        body = req.Body,
                        headers = req.Headers,
                        method = req.Method,
                        timestamp = req.TimeStamp                        
                    }
                )
            );

            return dtoList;
        }
    }
}