using System.Data.Entity;

namespace Server.DAL
{
    public class MainDbInitializer : CreateDatabaseIfNotExists<MainContext>
    {

        protected override void Seed(MainContext context)
        {
            SampleData.Seed(context);
        }

    }

    public class TestDbInitializer : DropCreateDatabaseAlways<TestContext>
    {

        protected override void Seed(TestContext context)
        {
            SampleData.Seed(context);
        }

    }
}