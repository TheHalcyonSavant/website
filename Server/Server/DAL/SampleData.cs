using Octokit;
using Server.Models;
using System.Collections.Generic;
using System.Linq;

namespace Server.DAL
{
    public static class SampleData
    {

        public static IReadOnlyList<Repository> Repos = new List<Repository>
        {
            new Repository { Id = 18041679, Name = "angular-app", Fork = true },
            new Repository
            {
                Id = 12700122,
                Name = "SoccerBase",
                Description = "Statistical predictions on soccer matches",
            }, new Repository
            {
                Id = 12082382,
                Name = "ConnStealing",
                Description = "Capturing of TCP Packets"
            }, new Repository
            {
                Id = 12764154,
                Name = "Delphi",
                Description = "My university projects on Delphi and Pascal"
            }, new Repository
            {
                Id = 12008638,
                Name = "VocabularyGame",
                Description = "Better your elocution"
            }
        };

        public static IList<GHProject> Projects = new List<GHProject>
        {
            new GHProject
            {
                Id = 12700122,
                Name = "SoccerBase",
                Description = "Statistical predictions on soccer matches"
            }, new GHProject
            {
                Id = 12082382,
                Name = "ConnStealing",
                Description = "Capturing of TCP Packets"
            }, new GHProject
            {
                Id = 12764154,
                Name = "Delphi",
                Description = "My university projects on Delphi and Pascal"
            }, new GHProject
            {
                Id = 12008638,
                Name = "VocabularyGame",
                Description = "Better your elocution"
            }
        };

        public static IList<IList<GHSkill>> SkillsOfSkills = new List<IList<GHSkill>>
        {
            new List<GHSkill>
            {
                new GHSkill { Name = "C#" },
                    new GHSkill { Name = "WinForms" },
                    new GHSkill { Name = "HtmlAgilityPack" },
                    new GHSkill { Name = "Interop.Excel.dll" },
                new GHSkill { Name = "SQL Server" }
            }, new List<GHSkill>
            {
                    new GHSkill { Name = "WinForms" },
                    new GHSkill { Name = "PacketDotNet" },
                new GHSkill { Name = "C#" }
            }, new List<GHSkill>
            {
                new GHSkill { Name = "Pascal" },
                    new GHSkill { Name = "Borland Delphi" }
            }, new List<GHSkill>
            {
                new GHSkill { Name = "C#" },
                    new GHSkill { Name = "WPF - Windows Presentaion Foundation" },
                    new GHSkill { Name = "LINQ" },
                    new GHSkill { Name = "Interop.Excel.dll" }
            }
        };

        public static IDictionary<GHProject, IList<GHSkill>> ProjectsSkills = Projects
            .Select((p, i) => new { Project = p, Index = i })
            .ToDictionary(
                x => x.Project, x => SkillsOfSkills[x.Index]
            );

        public static IList<QnA> QnAs = new List<QnA>
        {
            new QnA
            {
                Question = "Test Question 1 ?",
                Answer = "Test Answer 1."
            },
            new QnA
            {
                Question = "Test Question 2 ?",
                Answer = @"Test Answer 2."
            },
            new QnA
            {
                Question = "Test Question 3 ?",
                Answer = "Test Answer 3.",
                Order = 4
            },
            new QnA
            {
                Question = "Empty Question ?",
                Answer = null
            },
            new QnA
            {
                Question = "Another question !",
                Answer = "one, two, <h1>three</h1> ...",
                Order = 2
            }
        };

        public static IList<Tag> Tags = new List<Tag>
        {
            new Tag { Name = "General" },
            new Tag { Name = "JavaScript", Order = 3 },
            new Tag { Name = "My Introduction" , Order = 2 },
        };

        public static IList<MapQAT> QATs = new List<MapQAT>
        {
            new MapQAT { QnA = QnAs[0], Tag = Tags[0] },
            new MapQAT { QnA = QnAs[0], Tag = Tags[2] },
            new MapQAT { QnA = QnAs[1], Tag = Tags[0] },
            new MapQAT { QnA = QnAs[2], Tag = Tags[1] },
            new MapQAT { QnA = QnAs[3], Tag = Tags[0] },
            new MapQAT { QnA = QnAs[3], Tag = Tags[2] },
            new MapQAT { QnA = QnAs[4], Tag = Tags[1] }
        };

        static SampleData()
        {
            var s = SkillsOfSkills;

            // C#
            s[0][0].SubSkills = new List<GHSkill> { s[0][1], s[0][2], s[0][3] };
            s[0][1].ParentSkill = s[0][0];  // WinForms
            s[0][2].ParentSkill = s[0][0];  // HtmlAgilityPack
            s[0][3].ParentSkill = s[0][0];  // Interop.Excel.dll

            // C#
            s[1][2].SubSkills = new List<GHSkill> { s[1][0], s[1][1] };
            s[1][0].ParentSkill = s[1][2];  // WinForms
            s[1][1].ParentSkill = s[1][2];  // PacketDotNet

            // Pascal
            s[2][0].SubSkills = new List<GHSkill> { s[2][1] };
            s[2][1].ParentSkill = s[2][0];  // Borland Delphi

            // C#
            s[3][0].SubSkills = new List<GHSkill> { s[3][1], s[3][2], s[3][3] };
            s[3][1].ParentSkill = s[3][0];  // WPF - Windows Presentaion Foundation
            s[3][2].ParentSkill = s[3][0];  // LINQ
            s[3][3].ParentSkill = s[3][0];  // Interop.Excel.dll
        }

        public static void Seed(IMainContext context)
        {
            context.Database.ExecuteSqlCommand(Properties.Resources.CreateUserLogin);
            context.Database.ExecuteSqlCommand(Properties.Resources.drop_sp1);
            context.Database.ExecuteSqlCommand(Properties.Resources.sp1_GHTables);

            IGitHub gh = new GitHub();
            context.AddMaps(gh.getMapSP(ProjectsSkills));

            context.QnAs.AddRange(QnAs);
            context.Tags.AddRange(Tags);
            context.MapsQAT.AddRange(QATs);
        }

    }

}
