using Gateway.Api.Database.Models.DTO;
using Gateway.Api.Models.Entities;

namespace Gateway.Api.Helpers
{
    public static class DTOHandle
    {
        public static RequestLogDTO ToRequestLogDto(RequestLog req) => new RequestLogDTO
        {
            id = req.Id,
            body = req.Body,
            headers = req.Headers,
            method = req.Method,
            timestamp = req.TimeStamp,
            url = req.Url,
            clientIp = req.ClientIp,
            responseBody = req.ResponseBody,
            responseStatusCode = req.ResponseStatusCode,
            serviceOrigin = req.ServiceOrigin
        };
    }
}