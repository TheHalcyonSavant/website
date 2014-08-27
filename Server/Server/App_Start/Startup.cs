using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Practices.Unity;
using Octokit;
using Owin;
using Server.Controllers;
using Server.DAL;
using System.Threading.Tasks;
using System.Web.Cors;
using System.Web.Http;
using Unity.WebApi;

[assembly: OwinStartup(typeof(Server.App_Start.Startup))]

namespace Server.App_Start
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            /*HttpConfiguration config = new HttpConfiguration();

            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            app.UseWebApi(config);*/
            app.UseCors(new CorsOptions
            {
                PolicyProvider = new CorsPolicyProvider
                {
                    PolicyResolver = request => Task.FromResult(new CorsPolicy
                    {
                        AllowAnyHeader = true,
                        AllowAnyMethod = true,
                        Origins = {
                            "http://localhost",         // deployed server
                            "http://localhost:9000"     // grunt serve
                        }
                    })
                }
            });

            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(
                new UnityContainer()
                    .RegisterType<IGitHubClient, GitHubClient>(
                        new InjectionConstructor(new ProductHeaderValue("THS_Server"))
                    ).RegisterType<IMyHttpClient, MyHttpClient>(new PerResolveLifetimeManager())
                    .RegisterType<IGitHub, GitHub>(
                        new InjectionConstructor(typeof(IGitHubClient), typeof(IMyHttpClient))
                    ).RegisterType<MainController>(
                        new InjectionConstructor(typeof(IGitHub))
                    )

                // register all your components with the container here
                // it is NOT necessary to register your controllers
            );
        }
    }
}
