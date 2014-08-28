using Octokit;
using Server.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using YamlDotNet.RepresentationModel;

namespace Server.DAL
{
    public interface IGitHub
    {
        ICollection<GHProject> getProjects();

        Task<IDictionary<GHProject, Stream>> getProjectsStreams(ICollection<GHProject> projects);

        IList<GHSkill> getSkillsFromStream(Stream stream);

        ICollection<MapSP> getMapSP(IDictionary<GHProject, IList<GHSkill>> projectsSkills);
    }

    public class GitHub : IGitHub
    {
        private IGitHubClient _gitHubClient;

        private IMyHttpClient _myHttpClient;

        // Real constructor
        public GitHub(IGitHubClient gitHubClient, IMyHttpClient httpClient)
        {
            _gitHubClient = gitHubClient;
            _myHttpClient = httpClient;
        }

        #region Test constructors

        public GitHub() { }

        public GitHub(IGitHubClient gitHubClient)
        {
            _gitHubClient = gitHubClient;
        }

        public GitHub(IMyHttpClient httpClient)
        {
            _myHttpClient = httpClient;
        }

        #endregion

        ICollection<GHProject> IGitHub.getProjects()
        {
            return _gitHubClient
                .Repository.GetAllForUser("TheHalcyonSavant").Result
                .Where(repo => !repo.Fork).Select(repo => new GHProject()
                {
                    Id = repo.Id,
                    Name = repo.Name,
                    Description = repo.Description
                }).ToList();
        }

        // should be changed from HttpClient to Octokit GetContents service
        // when it became available
        async Task<IDictionary<GHProject, Stream>> IGitHub.getProjectsStreams(ICollection<GHProject> projects)
        {
            IDictionary<GHProject, Stream> dict = new Dictionary<GHProject, Stream>();

            foreach (var p in projects)
            {
                var link = String.Format("https://raw.githubusercontent.com/TheHalcyonSavant/{0}/master/languages.yml", p.Name);
                var response = await _myHttpClient.GetAsync(link).ConfigureAwait(false);

                if (!response.IsSuccessStatusCode)
                    continue;

                var stream = await _myHttpClient.getStreamFromResponse(response);
                dict.Add(p, stream);
            }

            return dict;
        }

        // [System.Diagnostics.DebuggerStepThrough]
        IList<GHSkill> IGitHub.getSkillsFromStream(Stream stream)
        {
            List<GHSkill> skills = new List<GHSkill>();

            using (var reader = new StreamReader(stream))
            {
                YamlStream yaml = null;
                try
                {
                    yaml = new YamlStream();
                    yaml.Load(reader);
                }
                catch (Exception)
                {
                    throw new BadYamlException("Bad languages.yml. Check YamlText property.", reader);
                }

                if (yaml.Documents.Count == 1)
                {
                    var languages = (yaml.Documents[0].RootNode as YamlMappingNode).Children;
                    foreach (var lang in languages)
                    {
                        var skill = new GHSkill();
                        skill.Name = (lang.Key as YamlScalarNode).Value;
                        skill.SubSkills = new List<GHSkill>();
                        var valueNode = lang.Value as YamlMappingNode;
                        if (valueNode != null)
                        {
                            var frameworkNode = new YamlScalarNode("frameworks");
                            var seqNode = valueNode.Children[frameworkNode] as YamlSequenceNode;
                            var subLanguages = seqNode.Children;
                            foreach (var subLang in subLanguages)
                            {
                                var ss = new GHSkill();
                                ss.Name = (subLang as YamlScalarNode).Value;
                                ss.ParentSkill = skill;
                                skills.Add(ss);
                                skill.SubSkills.Add(ss);
                            }
                        }
                        skill.SubSkills = skill.SubSkills.OrderBy(s => s.Name).ToList();
                        skills.Add(skill);
                    }
                }
            }

            return skills;
        }

        ICollection<MapSP> IGitHub.getMapSP(IDictionary<GHProject, IList<GHSkill>> projectsSkills)
        {
            var maps = new List<MapSP>();
            var distinctSkills = projectsSkills.SelectMany(ps => ps.Value).Distinct();

            foreach (var kvp in projectsSkills)
            {
                foreach (var skill in kvp.Value)
                {
                    var s = distinctSkills.Single(x => x.Name == skill.Name);
                    if (skill.ParentSkill != null)
                    {
                        var parent = distinctSkills.Single(x => x.Name == skill.ParentSkill.Name);
                        s.ParentSkill = parent;
                        if (parent.SubSkills.SingleOrDefault(x => x.Name == s.Name) == null)
                            parent.SubSkills.Add(s);
                    }
                    s.Id = 0;
                    s.Maps = null;

                    var p = kvp.Key;
                    p.Maps = null;

                    maps.Add(new MapSP
                    {
                        Skill = s,
                        Project = p
                    });
                }
            }

            return maps;
        }

    }
}