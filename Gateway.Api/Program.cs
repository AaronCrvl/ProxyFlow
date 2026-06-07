using Gateway.Api.Data;
using Gateway.Api.Repositories.Implementations;
using Gateway.Api.Repositories.Interfaces;
using Gateway.Api.Services.Implementation;
using Gateway.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Gateway.Api.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddAuthentication("Bearer").AddBearerToken("Bearer", opt =>
{
    opt.BearerTokenExpiration = new TimeSpan(1,0,0); // Token padrão expira em horas
    opt.RefreshTokenExpiration = new TimeSpan(3,0,0,0); // Refresh token expira em dias
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "SpecificOrigins", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); 
    });
});

builder.Services.AddDbContext<PgDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ILogRepository, LogRepository>();
builder.Services.AddScoped<ILogService, LogService>();

builder.Services.AddControllers();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("SpecificOrigins");

app.UseHttpsRedirection();
app.UseForwardedHeaders();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<AuthTokenMiddleware>();
app.UseMiddleware<RequestLoggerMiddleware>();

app.MapReverseProxy();
app.MapControllers();

app.Run();