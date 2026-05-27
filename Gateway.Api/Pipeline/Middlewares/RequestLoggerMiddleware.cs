using System.Diagnostics;
using System.Text;

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

        _logger.LogInformation(context.Request.Headers.ToString(), "Headers");
        _logger.LogInformation(buffer.ToString(), "Body");
        _logger.LogInformation(context.Request.Method.ToString(), "Method");
        _logger.LogInformation(context.Request.Path.ToString(), "Path");

        var timestamp = new Stopwatch();
        timestamp.Start();

        await _next(context);

        timestamp.Stop();
        _logger.LogInformation(timestamp.Elapsed.TotalSeconds.ToString(), "Timestamp");

        Console.Write(_logger.ToString());
    }
    #endregion
}