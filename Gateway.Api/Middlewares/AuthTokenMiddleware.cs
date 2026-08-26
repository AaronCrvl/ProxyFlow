using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Server.HttpSys;

namespace Gateway.Api.Middlewares
{
    public class AuthTokenMiddleware
    {
        private readonly ILogger<RequestLoggerMiddleware> logger;
        private readonly RequestDelegate next;

        public AuthTokenMiddleware(ILogger<RequestLoggerMiddleware> _logger, RequestDelegate _next)
        {
            this.logger = _logger;
            this.next = _next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var headers = context.Request.Headers.ToList();
            var host = context.Request.Host.ToString();
            bool authPath = context.Request.Path.Value?.Contains("Auth") ?? false;    
            bool containsAuthHeader = headers.FirstOrDefault(h => h.Key == "Authorization").Value.ToString().Length <= 0;                

            if (containsAuthHeader && !authPath)
                throw new Exception("No auth header identified.");

            await next(context);
        }
    }
}