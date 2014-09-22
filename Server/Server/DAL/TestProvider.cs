using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Newtonsoft.Json.Linq;
using Server.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Server.DAL
{
    public class TestContext : AMainContext
    {
        public DbSet<Test> Tests { get; set; }
        static TestContext()
        {
            Database.SetInitializer(new TestDbInitializer());
        }

        public TestContext() : base("TestSQLServer") { }
    }

    public interface ITestProvider
    {
        TestContext Context { get; }

        string Metadata();

        SaveResult SaveChanges(JObject saveBundle, TransactionSettings transactionSettings = null);
    }

    public class TestProvider : EFContextProvider<TestContext>, ITestProvider { }
}