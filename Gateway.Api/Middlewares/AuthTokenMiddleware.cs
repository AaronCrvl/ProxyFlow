namespace Gateway.Api.Middlewares
{
    public class AuthTokenMiddleware
    {
        private readonly RequestDelegate next;

        public AuthTokenMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (HttpMethods.IsOptions(context.Request.Method))
            {
                await next(context);
                return;
            }

            var isAuthEndpoint = context.Request.Path.StartsWithSegments("/api/Auth");
            var isLogHub = context.Request.Path.StartsWithSegments("/hubs/logs");

            if (isAuthEndpoint)
            {
                await next(context);
                return;
            }

            if (isLogHub &&
                !context.Request.Headers.ContainsKey("Authorization") &&
                context.Request.Query.TryGetValue("access_token", out var accessToken) &&
                !string.IsNullOrWhiteSpace(accessToken))
            {
                context.Request.Headers.Authorization = $"Bearer {accessToken}";
            }

            // if (!context.Request.Headers.ContainsKey("Authorization"))
            // {
            //     context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            //     return;
            // }

            await next(context);
        }
    }
}