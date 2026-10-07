using Gateway.Api.Database.Models.DTO;
using Microsoft.AspNetCore.SignalR;

namespace Gateway.Api.Hub
{
    public class LogHub : Microsoft.AspNetCore.SignalR.Hub
    {
        public async Task SendLogListUpdate(RequestLogDTO logs)
        {
            await Clients.All.SendAsync("LogUpdate", logs);
        } 
    }
}