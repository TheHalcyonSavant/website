using Breeze.WebApi2;
using Server.DAL;
using Server.Models;
using System.Linq;
using System.Web.Http;

namespace Server.Controllers
{

    [BreezeController]
    public class TestController : ApiController
    {
        private readonly ITestProvider _cxtProvider;

        private TestContext _context;

        public TestController()
        {
            _cxtProvider = new TestProvider();
            _context = _cxtProvider.Context;
        }

        // ~/breeze/Test/Metadata
        [HttpGet]
        public string Metadata()
        {
            return _cxtProvider.Metadata();
        }

        // ~/breeze/Test/Skills
        [HttpGet]
        public IQueryable<GHSkill> Skills()
        {
            return _context.getAllSkillsWithProjects();
        }

        // ~/breeze/Test/QnA
        [HttpGet]
        public IQueryable<QnA> QnA()
        {
            return _context.getAllQuestionsAnswersAndTags();
        }

        // ~/breeze/Test/Tags
        [HttpGet]
        public IQueryable<Tag> Tags()
        {
            return _context.Tags;
        }
    }
}
