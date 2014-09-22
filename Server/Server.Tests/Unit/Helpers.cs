using Moq;
using System.Net.Http;
using System.Web;

namespace Server.Tests.Unit
{
    public class Helpers
    {
        public static HttpRequestMessage getMockedHttpRequest(string testIp)
        {
            var httpRequest = new HttpRequestMessage();

            httpRequest.Properties[Extensions.HTTP_CONTEXT] = Mock.Of<HttpContextBase>(
                c => c.Request == Mock.Of<HttpRequestBase>(r => r.UserHostAddress == testIp)
            );

            return httpRequest;
        }

    }
}
