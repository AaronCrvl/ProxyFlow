using System.Diagnostics;
using System.Text;
using Gateway.Api.Data;
using Gateway.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

public class RequestLoggerMiddleware
{
    #region Private Variables
    private readonly ILogger<RequestLoggerMiddleware> _logger;
    private readonly RequestDelegate _next;
    private readonly IServiceScopeFactory _serviceScopeFactory; //TODO: LogService CRUD
    #endregion

    #region Constructor
    public RequestLoggerMiddleware(RequestDelegate next, ILogger<RequestLoggerMiddleware> logger, IServiceScopeFactory serviceScopeFactory)
    {
        _next = next;
        _logger = logger;
        _serviceScopeFactory = serviceScopeFactory;
    }
    #endregion

    #region Public Functions
    public async Task InvokeAsync(HttpContext context)
    {    
        context.Request.EnableBuffering();

        var body = await new StreamReader(context.Request.Body).ReadToEndAsync();
        context.Request.Body.Position = 0; 

        string header = context.Request.Headers.ToString() ?? "";
        string method = context.Request.Method;
        string path = context.Request.Path.ToString();

        _logger.LogInformation("Headers: {Headers}", header);
        _logger.LogInformation("Body: {Body}", body);
        _logger.LogInformation("Method: {Method}", method);
        _logger.LogInformation("Path: {Path}", path);

        var timestamp = new Stopwatch();
        timestamp.Start();

        await _next(context);

        timestamp.Stop();
        string reqTimestamp = timestamp.Elapsed.TotalSeconds.ToString();
        
        using (var scope = _serviceScopeFactory.CreateScope())
        {
            var con = scope.ServiceProvider.GetRequiredService<PgDbContext>();
            
            con.RequestLogs.Add(new RequestLog 
            { 
                Headers = header, 
                Body = body,     
                Method = method,
                TimeStamp = reqTimestamp           
            });
            
            await con.SaveChangesAsync();
        }
    }
    #endregion
}