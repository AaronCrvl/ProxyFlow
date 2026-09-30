using Gateway.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gateway.Api.Controllers
{
    [Controller]
    [Route("api/[controller]")]
    [Authorize]
    public class LogController : ControllerBase
    {
        private readonly ILogService service;

        public LogController(ILogService _sevice)
        {
            this.service = _sevice;
        }

        [HttpGet("getLatest")]
        public async Task<ActionResult> GetLatestLogsAsync()
        {
            var result = await this.service.GetLatestLogs();
            return new OkObjectResult(result);
        }

        [HttpGet("getLatestByMethod")]
        public async Task<ActionResult> GetLatestLogsByMethodAsync()
        {
            var result = await this.service.GetLatestLogs();
            return new OkObjectResult(result);
        }

        [HttpGet("getLatestByServiceOrigin/originId={originId}")]
        public async Task<ActionResult> GetLatestByServiceOrigin(long originId)
        {
            var result = await this.service.GetLatestLogsByServiceOrigin(originId);
            return new OkObjectResult(result);
        }
        
        [HttpGet("getWebHookCalls")]
        public async Task<ActionResult> GetWebHookCallsByMEthod(string method)
        {
            var result = await this.service.GetWebHookCallsByMethod(method);
            return new OkObjectResult(result);
        }
    }
}