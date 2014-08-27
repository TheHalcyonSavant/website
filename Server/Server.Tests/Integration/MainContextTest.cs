using FluentAssertions;
using Server.DAL;
using Server.Test_Data;
using System.Data.Entity;
using Xunit;

namespace Server.Tests.Integration
{

    public class CustomDropCreateDatabaseAlways : DropCreateDatabaseAlways<TestContext>
    {
        protected override void Seed(TestContext context)
        {
            base.Seed(context);
            context.Database.ExecuteSqlCommand(Properties.Resources.sp_GHTables);
        }
    }

    public class MainContextTest
    {
        public MainContextTest()
        {
            Database.SetInitializer<TestContext>(new CustomDropCreateDatabaseAlways());
        }

        private void fillGHTables()
        {
            using (IMainContext context = new TestContext())
            {
                IGitHub gh = new GitHub();
                var maps = gh.getMapSP(Data.ProjectsSkills);
                context.AddMaps(maps);
                context.SaveChanges();
            }
        }

        private void dropGHTables()
        {
            using (IMainContext context = new TestContext())
            {
                context.DropGHTables();
            }
        }

        [Fact]
        public void DropGHTables_should_clean_the_GitHub_tables()
        {
            // Arrange
            dropGHTables();
            fillGHTables();

            // Act
            dropGHTables();

            // Assert
            using (IMainContext context = new TestContext())
            {
                context.MapsSP.Should().BeEmpty();
                context.Projects.Should().BeEmpty();
                context.Skills.Should().BeEmpty();

                context.Database.SqlQuery<decimal>("select IDENT_CURRENT('dbo.GHSkill')")
                    .FirstAsync().Result.Should().Be(1);
                context.Database.SqlQuery<decimal>("select IDENT_CURRENT('dbo.MapSP')")
                    .FirstAsync().Result.Should().Be(1);
            }
        }

        [Fact]
        public void Recreate_should_populate_Skills_Projects_and_Map_them()
        {
            // Arrange
            dropGHTables();

            // Act
            fillGHTables();

            // Assert
            using (IMainContext context = new TestContext())
            {
                context.MapsSP.Should().HaveCount(14);
                context.Projects.Should().HaveCount(4);
                context.Skills.Should().HaveCount(10);  // 14 - 4 duplicates = 10

                var parentSkill = context.Skills.SingleOrDefaultAsync(s => s.Name == "C#").Result;
                parentSkill.Should().NotBeNull();
                parentSkill.Id.Should().Be(1);
                parentSkill.SubSkills.Should().NotBeNullOrEmpty();
                parentSkill.SubSkills.Should().HaveCount(6);    // 3 + 1 + 2 = 6 subskills

                var childSkill = context.Skills.SingleOrDefaultAsync(s => s.Name == "PacketDotNet").Result;
                childSkill.Should().NotBeNull();

                parentSkill.SubSkills.Should().Contain(childSkill);

                var project = context.Projects.SingleOrDefaultAsync(p => p.Name == "VocabularyGame").Result;
                project.Should().NotBeNull();
                project.Id.Should().Be(12008638);
            }
        }

        [Fact]
        public void QnA_should_return_Questions_Answers_with_Tags_from_DB()
        {
            using (IMainContext context = new TestContext())
            {
                context.MapsQAT.AddRange(Data.QATs);
                context.SaveChanges();
            }

            using (IMainContext context = new TestContext())
            {
                context.MapsQAT.Should().HaveCount(7);
                context.QnAs.Should().HaveCount(5);
                context.Tags.Should().HaveCount(3);
            }
        }

    }

}
