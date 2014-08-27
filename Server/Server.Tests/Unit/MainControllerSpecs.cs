using FluentAssertions;
using Moq;
using Server.Controllers;
using Server.DAL;
using Server.Models;
using Server.Test_Data;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Hosting;
using System.Web.Http.Results;
using System.Web.Script.Serialization;
using Xunit;

namespace Server.Tests.Unit
{
    public class MainControllerSpecs
    {
        private string _ipLocal = "127.0.0.1";

        private string _ipPublic = "95.180.185.22";

        private string _ipForeign = "64.233.160.50";

        private MainController getControllerWithIp(string ip)
        {
            return new MainController()
            {
                Request = Data.getMockedHttpRequest(ip)
            };
        }

        [Fact]
        public void IsAdministrator_should_return_1_for_local_admin_ip()
        {
            // Arrange
            using (var c = getControllerWithIp(_ipLocal))
            {
                // Act
                int isAdmin = c.IsAdministrator();

                // Assert
                isAdmin.Should().Be(1);
            }
        }

        [Fact]
        public void IsAdministrator_should_return_1_for_public_admin_ip()
        {
            // Arrange
            using (var c = getControllerWithIp(_ipPublic))
            {
                // Act
                int isAdmin = c.IsAdministrator();

                // Assert
                isAdmin.Should().Be(1);
            }
        }

        [Fact]
        public void IsAdministrator_should_return_0_for_foreign_ip()
        {
            // Arrange
            using (var c = getControllerWithIp(_ipForeign))
            {
                // Act
                int isAdmin = c.IsAdministrator();

                // Assert
                isAdmin.Should().Be(0);
            }
        }

        [Fact]
        public void Recreate_should_not_be_run_by_outsiders()
        {
            // Arrange
            using (var c = getControllerWithIp(_ipForeign))
            {
                // Act
                var actualResult = c.Recreate() as StatusCodeResult;

                // Assert
                actualResult.StatusCode.Should().Be(HttpStatusCode.Forbidden);
            }
        }

        [Fact]
        public void Recreate_should_return_reason_when_BadYamlException_is_thrown()
        {
            // Arrange
            var mockGitHub = new Mock<IGitHub>();
            var mockGHContext = new Mock<IMainContext>();
            var badYamlPath = @"Test_Data\bad_languages.yml";
            Stream fsYaml = File.OpenRead(badYamlPath);
            var reader = new StreamReader(fsYaml);
            IDictionary<GHProject, Stream> mockedProjectsStreams = Data.Projects.ToDictionary(
                p => p, p => fsYaml
            );
            BadYamlException exception = new BadYamlException("Bad languages.yml. Check YamlText property.", reader);
            HttpRequestMessage request = Data.getMockedHttpRequest(_ipPublic);

            request.Properties.Add(HttpPropertyKeys.HttpConfigurationKey, new HttpConfiguration());
            mockGitHub.Setup(m => m.getProjectsStreams(It.IsAny<ICollection<GHProject>>()))
                .Returns(Task.FromResult(mockedProjectsStreams));
            mockGitHub.Setup(m => m.getSkillsFromStream(fsYaml)).Throws(exception);

            using (var c = new MainController(mockGHContext.Object, mockGitHub.Object) { Request = request })
            {
                // Act
                var actualResult = c.Recreate() as ResponseMessageResult;

                // Assert
                actualResult.Should().NotBeNull();
                actualResult.Response.Should().NotBeNull();
                actualResult.Response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);

                var content = actualResult.Response.Content;
                content.Should().NotBeNull();
                content.Headers.Should().NotBeNullOrEmpty();
                content.Headers.ContentType.Should().NotBeNull();
                content.Headers.ContentType.MediaType.Should().Be("text/html");
                content.ReadAsStringAsync().Result.Should().Be(
                    exception.Message + "<br/>SoccerBase:<br/>" +
                    new JavaScriptSerializer().Serialize(File.ReadAllText(badYamlPath))
                );
            }
            reader.Close();
            fsYaml.Close();
        }

        [Fact]
        public void Recreate_should_repopulate_context()
        {
            // Arrange
            var mockGitHub = new Mock<IGitHub>();
            var mockGHContext = new Mock<IMainContext>();
            IDictionary<GHProject, Stream> mockedProjectsStreams = Data.Projects.ToDictionary(
                p => p, p => Mock.Of<Stream>()
            );

            mockGitHub.Setup(m => m.getProjectsStreams(It.IsAny<ICollection<GHProject>>()))
                .Returns(Task.FromResult(mockedProjectsStreams));

            using (var c = new MainController(mockGHContext.Object, mockGitHub.Object)
            {
                Request = Data.getMockedHttpRequest(_ipLocal)
            })
            {
                // Act
                var actualResult = c.Recreate() as StatusCodeResult;

                // Assert
                actualResult.StatusCode.Should().NotBe(HttpStatusCode.Forbidden);
                mockGHContext.Verify(x => x.DropGHTables(), Times.Once);
                mockGitHub.Verify(h => h.getProjects(), Times.Once);
                mockGitHub.Verify(h => h.getProjectsStreams(It.IsAny<ICollection<GHProject>>()), Times.Once);
                mockGitHub.Verify(h => h.getSkillsFromStream(It.IsAny<Stream>()), Times.Exactly(Data.Projects.Count));
                mockGitHub.Verify(h => h.getMapSP(It.IsAny<IDictionary<GHProject, IList<GHSkill>>>()), Times.Once);
                mockGHContext.Verify(x => x.AddMaps(It.IsAny<ICollection<MapSP>>()), Times.Once);
                mockGHContext.Verify(x => x.SaveChanges(), Times.Once);
                actualResult.StatusCode.Should().Be(HttpStatusCode.OK);
            }
        }

        [Fact]
        public void Skills_should_return_all_skills_mapped_with_projects()
        {
            var mockGHContext = new Mock<IMainContext>();
            using (var c = new MainController(mockGHContext.Object)
            {
                Request = Data.getMockedHttpRequest(_ipForeign)
            })
            {
                // Act
                var skills = c.Skills();

                // Assert
                mockGHContext.Verify(m => m.getAllSkillsWithProjects(), Times.Once);
            }
        }

        [Fact]
        public void QnA_should_return_all_Questions_Answers_with_Tags()
        {
            var mockGHContext = new Mock<IMainContext>();
            using (var c = new MainController(mockGHContext.Object)
            {
                Request = Data.getMockedHttpRequest(_ipPublic)
            })
            {
                // Act
                var qna = c.QnA();

                // Assert
                mockGHContext.Verify(m => m.getAllQuestionsAnswersAndTags(), Times.Once);
            }
        }

    }
}
