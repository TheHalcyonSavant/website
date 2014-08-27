using System.Net.Http;

namespace Server
{
    /// <summary>
    /// References required:
    ///     HttpContextWrapper - System.Web.dll
    ///     RemoteEndpointMessageProperty - System.ServiceModel.dll
    ///     OwinContext - Microsoft.Owin.dll (you will have it already if you use Owin package)
    /// </summary>
    public static class Extensions
    {
        public const string HTTP_CONTEXT = "MS_HttpContext";
        public const string REMOTE_ENDPOINT_MSG =
            "System.ServiceModel.Channels.RemoteEndpointMessageProperty";
        public const string OWIN_CONTEXT = "MS_OwinContext";

        public static string GetClientIpAddress(this HttpRequestMessage request)
        {
            // Web-hosting. Needs reference to System.Web.dll
            if (request.Properties.ContainsKey(HTTP_CONTEXT))
            {
                dynamic ctx = request.Properties[HTTP_CONTEXT];
                if (ctx != null)
                {
                    return ctx.Request.UserHostAddress;
                }
            }

            // Self-hosting. Needs reference to System.ServiceModel.dll. 
            if (request.Properties.ContainsKey(REMOTE_ENDPOINT_MSG))
            {
                dynamic remoteEndpoint = request.Properties[REMOTE_ENDPOINT_MSG];
                if (remoteEndpoint != null)
                {
                    return remoteEndpoint.Address;
                }
            }

            // Self-hosting using Owin. Needs reference to Microsoft.Owin.dll. 
            if (request.Properties.ContainsKey(OWIN_CONTEXT))
            {
                dynamic owinContext = request.Properties[OWIN_CONTEXT];
                if (owinContext != null)
                {
                    return owinContext.Request.RemoteIpAddress;
                }
            }

            return null;
        }
    }

}