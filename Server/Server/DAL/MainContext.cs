using Server.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;

namespace Server.DAL
{
    public interface IMainContext : IDisposable
    {
        Database Database { get; }

        DbSet<GHSkill> Skills { get; set; }

        DbSet<MapSP> MapsSP { get; set; }

        DbSet<GHProject> Projects { get; set; }

        DbSet<QnA> QnAs { get; set; }

        DbSet<MapQAT> MapsQAT { get; set; }

        DbSet<Tag> Tags { get; set; }

        IQueryable<GHSkill> getAllSkillsWithProjects();

        IQueryable<QnA> getAllQuestionsAnswersAndTags();

        void AddMaps(ICollection<MapSP> maps);

        void DropGHTables();

        void SaveChanges();
    }

    public abstract class AMainContext : DbContext, IMainContext
    {
        public virtual DbSet<GHSkill> Skills { get; set; }

        public virtual DbSet<MapSP> MapsSP { get; set; }

        public virtual DbSet<GHProject> Projects { get; set; }

        public virtual DbSet<QnA> QnAs { get; set; }

        public virtual DbSet<MapQAT> MapsQAT { get; set; }

        public virtual DbSet<Tag> Tags { get; set; }

        public AMainContext() : base("SQLServer")
        {
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;
        }

        public AMainContext(string connection) : base(connection)
        {
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;
        }

        public IQueryable<GHSkill> getAllSkillsWithProjects()
        {
            return Skills.Include(s => s.Maps.Select(m => m.Project));
        }

        public IQueryable<QnA> getAllQuestionsAnswersAndTags()
        {
            return QnAs.Include(qna => qna.Maps.Select(m => m.Tag));
        }

        public void AddMaps(ICollection<MapSP> maps)
        {
            MapsSP.AddRange(maps);
        }

        void IMainContext.SaveChanges()
        {
            SaveChanges();
        }

        public void DropGHTables()
        {
            Database.ExecuteSqlCommand("dbo.DropCreateGHTables");
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }

    public class MainContext : AMainContext
    {
        static MainContext()
        {
            //Database.SetInitializer(new MainDbInitializer());
        }
    }

}
