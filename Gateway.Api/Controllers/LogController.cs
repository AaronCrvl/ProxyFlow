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
        public async Task<ActionResult> GetLatestLogsByMethodAsync([FromQuery] string? method = null)
        {
            if (string.IsNullOrWhiteSpace(method))
                return BadRequest("method is required.");

            var result = await this.service.GetLatestLogsByMethod(method);
            return new OkObjectResult(result);
        }

        [HttpGet("getLatestByServiceOrigin")]
        public async Task<ActionResult> GetLatestByServiceOrigin([FromQuery] long originId)
        {
            if (originId is not (0 or 1))
                return BadRequest("originId must be 0 (WEBHOOK) or 1 (API).");

            var result = await this.service.GetLatestLogsByServiceOrigin(originId);
            return new OkObjectResult(result);
        }
        
        [HttpGet("getWebHookCalls")]
        public async Task<ActionResult> GetWebHookCallsByMethod([FromQuery] string? method = null)
        {
            var result = await this.service.GetWebHookCallsByMethod(method);
            return new OkObjectResult(result);
        }
    }
}