using FluentAssertions;
using Moq;
using Octokit;
using Server.DAL;
using Server.Test_Data;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace Server.Tests.Unit
{
    public class GitHubSpecs
    {
        [Fact]
        public void getProjects_should_return_projects_from_GitHub_repositories()
        {
            // Arrange
            IGitHub gh = new GitHub(Mock.Of<IGitHubClient>(
                m => m.Repository == Mock.Of<IRepositoriesClient>(
                    m2 => m2.GetAllForUser("TheHalcyonSavant") == Task.FromResult(Data.Repos)
                )
            ));

            // Act
            var projects = gh.getProjects();

            // Assert
            projects.Should().NotBeNullOrEmpty();
            projects.Should().NotContain(p => p.Name == "angular-app");
            projects.Should().HaveCount(4);

            var project = projects.SingleOrDefault(p => p.Name == "VocabularyGame");
            project.Should().NotBeNull();
            project.Id.Should().Be(12008638);
            project.Description.Should().Be("Better your elocution");
        }

        [Fact]
        public void getProjectsStreams_should_return_dictionary_of_projects_and_streams_from_projects()
        {
            // Arrange
            Stream stream = new MemoryStream();
            var response = new HttpResponseMessage();
            var mockMyHttpClient = new Mock<IMyHttpClient>();
            mockMyHttpClient.Setup(m => m.GetAsync(It.IsAny<string>()))
                .Returns(Task.FromResult(response));
            mockMyHttpClient.Setup(m => m.getStreamFromResponse(response))
                .Returns(Task.FromResult(stream));
            IGitHub gh = new GitHub(mockMyHttpClient.Object);

            // Act
            var projectsStreams = gh.getProjectsStreams(Data.Projects).Result;

            // Assert
            projectsStreams.Should().NotBeEmpty();
            projectsStreams.Should().HaveCount(4);
            var kvp = projectsStreams.Last();
            kvp.Key.Should().Be(Data.Projects.Last());
            kvp.Value.Should().NotBeNull();
            kvp.Value.Should().Be(stream);
        }

        [Fact]
        public void getSkillsFromStrem_should_return_empty_array_from_empty_stream()
        {
            // Arrange
            IGitHub gh = new GitHub();

            // Act
            var skills = gh.getSkillsFromStream(Stream.Null);

            // Assert
            skills.Should().BeEmpty();
        }

        [Fact]
        public void getSkillsFromStream_should_throw_exception_on_bad_yaml()
        {
            using (Stream fsYaml = File.OpenRead(@"Test_Data\bad_languages.yml"))
            {
                // Arrange
                IGitHub gh = new GitHub();

                // Act
                gh.Invoking(x => x.getSkillsFromStream(fsYaml))

                // Assert
                    .ShouldThrow<BadYamlException>()
                    .WithMessage("Bad languages.yml. Check YamlText property.");
            }
        }

        [Fact]
        public void getSkillsFromStream_should_return_array_of_GHSkill()
        {
            using (Stream fsYaml = File.OpenRead(@"Test_Data\languages.yml"))
            {
                // Arrange
                IGitHub gh = new GitHub();

                // Act
                var skills = gh.getSkillsFromStream(fsYaml);

                // Assert
                skills.Should().NotBeNullOrEmpty();
                skills.Should().HaveCount(6);

                var skill = skills.SingleOrDefault(s => s.Name == "C#");
                skill.Should().NotBeNull();
                skill.SubSkills.Should().HaveCount(2);

                var subSkill = skill.SubSkills.Last();
                subSkill.Should().NotBeNull();
                subSkill.Name.Should().Be("LINQ");
                subSkill.ParentSkill.Should().Be(skill);

                skill = skills.SingleOrDefault(s => s.Name == "Java");
                skill.Should().NotBeNull();
                skill.ParentSkill.Should().BeNull();

                subSkill = skill.SubSkills.First();
                subSkill.Should().NotBeNull();
                subSkill.Name.Should().Be("Lucene");

                skill = skills.Last();
                skill.Should().NotBeNull();
                skill.Name.Should().Be("AutoIt");
                skill.SubSkills.Should().BeEmpty();
            }
        }

        [Fact]
        public void getMapSP_should_retrun_GitHub_skills_with_the_corresponding_projects()
        {
            // Arrange
            IGitHub gh = new GitHub();

            // Act
            var maps = gh.getMapSP(Data.ProjectsSkills);

            // Assert
            maps.Should().NotBeNullOrEmpty();
            maps.Should().HaveCount(14);

            var skillsMap = maps.Where(m => m.Skill.Name == "C#");
            skillsMap.Should().NotBeNullOrEmpty();
            skillsMap.Should().HaveCount(3);   // for 3 projects

            var parentSkill = skillsMap.First().Skill;
            parentSkill.Should().NotBeNull();
            parentSkill.SubSkills.Should().NotBeNullOrEmpty();
            parentSkill.SubSkills.Should().HaveCount(6);    // 3 + 1 + 2 = 6 subskills

            var skill = parentSkill.SubSkills.SingleOrDefault(s => s.Name == "WinForms");
            skill.Should().NotBeNull();
            skill.SubSkills.Should().BeNullOrEmpty();
            skill.ParentSkill.Should().Be(parentSkill);

            var projectsMap = maps.Where(m => m.Project.Name == "SoccerBase");
            projectsMap.Should().NotBeNullOrEmpty();
            projectsMap.Should().HaveCount(5);   // for 5 skills

            var project = projectsMap.Last().Project;
            project.Should().NotBeNull();

            project.Should().Be(skillsMap.First().Project);

            maps.Should().Contain(m => m.Project.Name == "ConnStealing");
        }

    }
}
