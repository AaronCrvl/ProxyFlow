using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Gateway.Api.Controllers
{
    [Controller]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IOptionsMonitor<BearerTokenOptions> bearerTokenOptions;

        public AuthController(IOptionsMonitor<BearerTokenOptions> _bearerTokenOptions)
        {
            bearerTokenOptions = _bearerTokenOptions;
        }

        [HttpPost("GetToken")]
        public ActionResult<string> GetToken()
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Role, "Dev")
            };

            var identity = new ClaimsIdentity(claims, "Bearer");
            var principal = new ClaimsPrincipal(identity);

            return SignIn(principal, "Bearer");    
        }
    }
}