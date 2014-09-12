using Server.Models;
using System.Collections.Generic;
using System.Data.Entity;

namespace Server.DAL
{
    public class MainDbInitializer : CreateDatabaseIfNotExists<MainContext>
    {

        protected override void Seed(MainContext context)
        {
            context.Database.ExecuteSqlCommand(Properties.Resources.drop_sp1);
            context.Database.ExecuteSqlCommand(Properties.Resources.sp1_GHTables);
            context.Database.ExecuteSqlCommand(Properties.Resources.CreateUserLogin);

            var qnas = new List<QnA>();
            for (var i = 1; i <= 5; i++)
            {
                qnas.Add(new QnA
                {
                    Question = "Test Question " + i,
                    Answer = "Test answer " + i
                });
            }
            qnas.Add(new QnA
            {
                Question = "Empty Question ?",
                Answer = ""
            });
            context.QnAs.AddRange(qnas);

            var tags = new[]
            {
                new Tag { Name = "General" },
                new Tag { Name = "Introduction" },
                new Tag { Name = "Personal" },
                new Tag { Name = "Work" }
            };
            context.Tags.AddRange(tags);

            context.MapsQAT.AddRange(new[]
            {
                new MapQAT { QnA = qnas[0], Tag = tags[1] },
                new MapQAT { QnA = qnas[1], Tag = tags[2] },
                new MapQAT { QnA = qnas[3], Tag = tags[3] },
                new MapQAT { QnA = qnas[4], Tag = tags[0] },
                new MapQAT { QnA = qnas[4], Tag = tags[1] },
                new MapQAT { QnA = qnas[5], Tag = tags[0] },
                new MapQAT { QnA = qnas[5], Tag = tags[1] }
            });
        }

    }
}