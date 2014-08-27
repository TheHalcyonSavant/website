﻿using Breeze.WebApi2;
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
            // EFContextProvider doesn't work well with Unity 3 Dependency Injection
            // when SaveChanges is called it uses old cached connection and outputs wierd EF exception
            // this problem was very hard to debug
            _cxtProvider = new TestProvider();
            _context = _cxtProvider.Context;
        }

        // ~/breeze/Test/Metadata
        [HttpGet]
        public string Metadata()
        {
            return _cxtProvider.Metadata();
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
