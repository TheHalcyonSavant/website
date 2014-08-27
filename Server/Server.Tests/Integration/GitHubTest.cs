using FluentAssertions;
using Server.DAL;
using Server.Test_Data;
using System.IO;
using System.Linq;
using Xunit;

namespace Server.Tests.Integration
{
    public class GitHubTest
    {
        [Fact]
        public void getProjectsStreams_should_return_dictionary_of_projects_and_streams_from_projects()
        {
            // Arrange
            IGitHub gh = new GitHub(new MyHttpClient());

            // Act
            var projects = Data.Projects;
            var projectsStreams = gh.getProjectsStreams(projects).Result;

            // Assert
            projectsStreams.Should().NotBeEmpty();
            projectsStreams.Should().HaveCount(4);
            var kvp = projectsStreams.Last();
            kvp.Key.Should().Be(Data.Projects.Last());
            kvp.Value.Should().NotBeNull();
            kvp.Value.Should().BeOfType<MemoryStream>();
            MemoryStream ms = kvp.Value as MemoryStream;
            ms.CanRead.Should().Be(true);
            ms.Length.Should().BeGreaterThan(0);
        }
    }
}
