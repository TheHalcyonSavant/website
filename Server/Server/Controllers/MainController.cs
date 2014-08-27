using Breeze.ContextProvider;
using Breeze.WebApi2;
using Newtonsoft.Json.Linq;
using Server.DAL;
using Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace Server.Controllers
{
    [BreezeController]
    public class MainController : ApiController
    {
        private readonly IMainProvider _cxtProvider;

        private IMainContext _context;

        private IGitHub _gitHub;

        // Real constructor
        public MainController(IGitHub gitHub)
        {
            // EFContextProvider doesn't work well with Unity 3 Dependency Injection
            // when SaveChanges is called it uses old cached connection and outputs wierd EF exception
            // this problem was very hard to debug
            _cxtProvider = new MainProvider();
            _context = _cxtProvider.Context;
            _gitHub = gitHub;
        }

        #region Test constructors

        public MainController() { }

        public MainController(IMainContext context)
        {
            _context = context;
        }

        public MainController(IMainContext context, IGitHub gitHub)
        {
            _context = context;
            _gitHub = gitHub;
        }

        #endregion

        [HttpGet]
        public int IsAdministrator()
        {
            var ip = Request.GetClientIpAddress();

            // private for testing and public for deployment
            return ip == "127.0.0.1" || ip == "95.180.185.22" ? 1 : 0;
        }

        // ~/breeze/Main/Metadata
        [HttpGet]
        public string Metadata()
        {
            return _cxtProvider.Metadata();
        }

        // ~/breeze/Main/Recreate
        [HttpGet]
        public IHttpActionResult Recreate()
        {
            if (IsAdministrator() == 0)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            _context.DropGHTables();
            var projects = _gitHub.getProjects();
            var projectsStreams = _gitHub.getProjectsStreams(projects).Result;
            IDictionary<GHProject, IList<GHSkill>> projectsSkills = null;
            GHProject project = null;
            try
            {
                projectsSkills = projectsStreams.ToDictionary(kvp =>
                    {
                        project = kvp.Key;
                        return project;
                    }, kvp => _gitHub.getSkillsFromStream(kvp.Value)
                );
            }
            catch (BadYamlException ex)
            {
                var response = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                response.Content = new StringContent(
                    ex.Message + "<br/>" + project.Name + ":<br/>" +
                    new JavaScriptSerializer().Serialize(ex.YamlText),
                    Encoding.UTF8, "text/html"
                );

                return ResponseMessage(response);
            }
            var maps = _gitHub.getMapSP(projectsSkills);
            _context.AddMaps(maps);
            _context.SaveChanges();

            return StatusCode(HttpStatusCode.OK);
        }

        // ~/breeze/Main/Skills
        [HttpGet]
        public IQueryable<GHSkill> Skills()
        {
            return _context.getAllSkillsWithProjects();
        }

        // ~/breeze/Main/QnA
        [HttpGet]
        public IQueryable<QnA> QnA()
        {
            if (IsAdministrator() == 0)
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }

            return _context.getAllQuestionsAnswersAndTags();
        }

        // ~/breeze/Main/Tags
        [HttpGet]
        public IQueryable<Tag> Tags()
        {
            if (IsAdministrator() == 0)
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }

            return _context.Tags;
        }

        // ~/breeze/Main/SaveChanges
        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            if (IsAdministrator() == 0)
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }

            return _cxtProvider.SaveChanges(saveBundle);
        }

    }
}
