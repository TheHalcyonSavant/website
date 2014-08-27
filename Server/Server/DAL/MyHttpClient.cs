using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace Server.DAL
{
    public interface IMyHttpClient : IDisposable
    {
        Task<HttpResponseMessage> GetAsync(string link);

        Task<Stream> getStreamFromResponse(HttpResponseMessage response);
    }

    public class MyHttpClient : HttpClient, IMyHttpClient
    {
        async Task<Stream> IMyHttpClient.getStreamFromResponse(HttpResponseMessage response)
        {
            return await response.Content.ReadAsStreamAsync().ConfigureAwait(false);
        }
    }

}
