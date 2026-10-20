using Gateway.Api.Helpers;
using Gateway.Api.Models.Entities;

namespace Gateway.Api.Tests;

public class UnitTest1
{
    [Fact]
    public void ToRequestLogDto_MapsRequestUrl()
    {
        var request = new RequestLog { Url = "/webhook" };

        var result = DTOHandle.ToRequestLogDto(request);

        Assert.Equal("/webhook", result.url);
    }
}