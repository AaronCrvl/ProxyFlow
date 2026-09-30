using Gateway.Api.Database.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using System.Linq;

namespace Gateway.Api.Controllers
{
    [Controller]
    [Route("api/[controller]")]
    [Authorize]
    public class MethodsController : ControllerBase
    {
        private readonly IApiDescriptionGroupCollectionProvider _apiExplorer;

        public MethodsController(IApiDescriptionGroupCollectionProvider apiExplorer)
        {
            _apiExplorer = apiExplorer;
        }

        [HttpGet("GetAvailableMethods")]
        public ActionResult GetAPIAvailableMethods()
        {
            var methods = _apiExplorer.ApiDescriptionGroups.Items
                .SelectMany(group => group.Items)
                .Select(description => new AvailableMethodDTO
                {
                    method = description.HttpMethod,
                    path = description.RelativePath,
                    groupName = description.GroupName
                });

            return Ok(methods);
        }
    }    
}