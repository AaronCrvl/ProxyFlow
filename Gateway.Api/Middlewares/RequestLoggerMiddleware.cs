using System.Diagnostics;
using System.Text;
using Gateway.Api.Data;

public class RequestLoggerMiddleware
{
    #region  Private Variables
    private ILogger<RequestLoggerMiddleware> _logger;
    private RequestDelegate _next;
    #endregion

    #region Constructor
    public RequestLoggerMiddleware(RequestDelegate next, ILogger<RequestLoggerMiddleware> logger)
    {
        this._next = next;
        this._logger = logger;
    }
    #endregion

    #region Public Functions
    public async Task InvokeAsync(HttpContext context)
    {
        // Habilitar re-releitura da requisição
        context.Request.EnableBuffering();

        var buffer = new Memory<char>();
        var reader = new StreamReader(context.Request.Body);
        await reader.ReadAsync(buffer, CancellationToken.None);

        string header = context.Request.Headers.ToString() == null ? "" : context.Request.Headers.ToString()!,
                body = buffer.ToString(),
                method = context.Request.Method.ToString(),
                path = context.Request.Path.ToString(),
                reqTimestamp = string.Empty;

        _logger.LogInformation(header, "Headers");
        _logger.LogInformation(body, "Body");
        _logger.LogInformation(method, "Method");
        _logger.LogInformation(path, "Path");

        var timestamp = new Stopwatch();
        timestamp.Start();

        await _next(context);

        timestamp.Stop();
        reqTimestamp = timestamp.Elapsed.TotalSeconds.ToString();

        using (var con = new PgDbContext())
        {
            con.Database.EnsureCreated();

            con.RequestLogs.Add(new Gateway.Api.Models.Entities.RequestLog { Headers = header, Body = body });
            con.SaveChanges();
        }
    }
    #endregion
}