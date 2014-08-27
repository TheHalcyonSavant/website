using FluentAssertions;
using Microsoft.Owin;
using Moq;
using Server.Test_Data;
using System.Net.Http;
using System.ServiceModel.Channels;
using Xunit;

namespace Server.Tests.Unit
{
    public class ExtensionsSpecs
    {
        private string _expectedIP = "10.11.12.13";

        [Fact]
        public void GetClientIpAddress_should_return_ip_when_webhosted()
        {
            // Arrange
            var request = Data.getMockedHttpRequest(_expectedIP);

            // Act
            string actualIP = request.GetClientIpAddress();

            // Assert
            actualIP.Should().Be(_expectedIP);
        }

        [Fact]
        public void GetClientIpAddress_should_return_ip_when_selfhosted()
        {
            // Arrange
            var request = new HttpRequestMessage();
            request.Properties[Extensions.REMOTE_ENDPOINT_MSG] = new RemoteEndpointMessageProperty(_expectedIP, 80);

            // Act
            string actualIP = request.GetClientIpAddress();

            // Assert
            actualIP.Should().Be(_expectedIP);
        }

        [Fact]
        public void GetClientIpAddress_should_return_ip_when_selfhosted_with_owin()
        {
            // Arrange
            var request = new HttpRequestMessage();
            request.Properties[Extensions.OWIN_CONTEXT] = Mock.Of<IOwinContext>(
                c => c.Request == Mock.Of<IOwinRequest>(r => r.RemoteIpAddress == _expectedIP)
            );

            // Act
            string actualIP = request.GetClientIpAddress();

            // Assert
            actualIP.Should().Be(_expectedIP);
        }
    }
}
