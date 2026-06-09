using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gateway.Api.Services;
using Gateway.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;

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
    }
}