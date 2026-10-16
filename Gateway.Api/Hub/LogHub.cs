using Gateway.Api.Database.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Gateway.Api.Hub
{
    [Authorize]
    public class LogHub : Microsoft.AspNetCore.SignalR.Hub
    {
        public async Task SendLogListUpdate(RequestLogDTO logs)
        {
            await Clients.All.SendAsync("LogUpdate", logs);
        } 
    }
}