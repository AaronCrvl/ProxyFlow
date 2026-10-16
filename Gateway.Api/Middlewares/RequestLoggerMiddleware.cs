using System.Diagnostics;
using System.Text;
using System.Text.Json;
using Gateway.Api.Data;
using Gateway.Api.Helpers;
using Gateway.Api.Hub;
using Gateway.Api.Models.Entities;
using Microsoft.AspNetCore.SignalR;

public class RequestLoggerMiddleware
{
    #region Private Variables
    private readonly IHubContext<LogHub> _logHub;
    private readonly ILogger<RequestLoggerMiddleware> _logger;
    private readonly RequestDelegate _next;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    #endregion

    #region Constructor
    public RequestLoggerMiddleware(
        RequestDelegate next,
        ILogger<RequestLoggerMiddleware> logger,
        IServiceScopeFactory serviceScopeFactory,
        IHubContext<LogHub> logHub)
    {
        _next = next;
        _logger = logger;
        _serviceScopeFactory = serviceScopeFactory;
        _logHub = logHub;
    }
    #endregion

    #region Public Functions
    public async Task InvokeAsync(HttpContext context)
    {
        var requestPath = context.Request.Path;
        if (requestPath.StartsWithSegments("/hubs/logs") ||
            requestPath.StartsWithSegments("/api/Auth") ||
            requestPath.StartsWithSegments("/api/Log") ||
            requestPath.StartsWithSegments("/api/Methods"))
        {
            await _next(context);
            return;
        }

        context.Request.EnableBuffering();

        string body;
        using (var reader = new StreamReader(
            context.Request.Body,
            Encoding.UTF8,
            detectEncodingFromByteOrderMarks: false,
            leaveOpen: true))
        {
            body = await reader.ReadToEndAsync();
        }
        context.Request.Body.Position = 0;

        var headers = context.Request.Headers
            .Where(header => !string.Equals(header.Key, "Authorization", StringComparison.OrdinalIgnoreCase) &&
                             !string.Equals(header.Key, "Cookie", StringComparison.OrdinalIgnoreCase))
            .ToDictionary(h => h.Key, h => h.Value.ToString());

        string header = JsonSerializer.Serialize(headers);
        string method = context.Request.Method;
        string path = requestPath.ToString();

        _logger.LogInformation("Headers: {Headers}", header);
        _logger.LogInformation("Body: {Body}", body);
        _logger.LogInformation("Method: {Method}", method);
        _logger.LogInformation("Path: {Path}", path);

        var originalResponseBody = context.Response.Body;
        await using var responseBuffer = new MemoryStream();
        context.Response.Body = responseBuffer;
        var timestamp = Stopwatch.StartNew();

        try
        {
            await _next(context);
            timestamp.Stop();

            responseBuffer.Position = 0;
            string responseBody = await new StreamReader(responseBuffer, leaveOpen: true).ReadToEndAsync();
            responseBuffer.Position = 0;
            await responseBuffer.CopyToAsync(originalResponseBody);

            using var scope = _serviceScopeFactory.CreateScope();
            var con = scope.ServiceProvider.GetRequiredService<PgDbContext>();
            var requestLog = new RequestLog
            {
                Headers = header,
                Body = body,
                Method = method,
                TimeStamp = timestamp.Elapsed.TotalSeconds.ToString(),
                Url = path,
                ResponseBody = responseBody,
                ResponseStatusCode = context.Response.StatusCode,
                ClientIp = context.Connection.RemoteIpAddress?.ToString() ?? "",
                ServiceOrigin = path.Contains("webhook", StringComparison.OrdinalIgnoreCase)
                    ? (long)eServiceOrigin.WEBHOOK
                    : (long)eServiceOrigin.API
            };

            con.RequestLogs.Add(requestLog);
            await con.SaveChangesAsync();
            await _logHub.Clients.All.SendAsync("LogUpdate", DTOHandle.ToRequestLogDto(requestLog));
        }
        finally
        {
            context.Response.Body = originalResponseBody;
        }
    }
    #endregion
}