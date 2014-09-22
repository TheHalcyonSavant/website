'use strict';

describe('Service (Repository): SkillsRepo', function (){
  var $httpBackend,
    Assert,
    isInitialized,
    SkillsRepo;

  beforeEach(function (){
    if (isInitialized) { return; }

    // load the service's module
    module('clientApp', function ($provide){
      $provide.value('$state', function(){ return {}; });
      $provide.value('$urlRouter', function(){ return {}; });
    });

    inject(function (_$httpBackend_, _Assert_, _SkillsRepo_){
      $httpBackend = _$httpBackend_;
      Assert = _Assert_;
      SkillsRepo = _SkillsRepo_;
    });

    $httpBackend.resetExpectations();
    $httpBackend.expectGET('http://thehalcyonsavant.com/breeze/Main/Skills?').respond(
      [{"$id":"1","$type":"Server.Models.GHSkill, Server","Id":1,"Name":"C#","ParentSkillId":null,"ParentSkill":null,"SubSkills":[{"$id":"2","$type":"Server.Models.GHSkill, Server","Id":2,"Name":"WinForms","ParentSkillId":1,"ParentSkill":{"$ref":"1"},"SubSkills":null,"Maps":[{"$id":"3","$type":"Server.Models.MapSP, Server","Id":2,"GHSkillId":2,"Skill":{"$ref":"2"},"GHProjectId":12700122,"Project":{"$id":"4","$type":"Server.Models.GHProject, Server","Id":12700122,"Name":"SoccerBase","Description":"Statistical predictions on soccer matches","Maps":[{"$id":"5","$type":"Server.Models.MapSP, Server","Id":1,"GHSkillId":1,"Skill":{"$ref":"1"},"GHProjectId":12700122,"Project":{"$ref":"4"}},{"$ref":"3"},{"$id":"6","$type":"Server.Models.MapSP, Server","Id":3,"GHSkillId":3,"Skill":{"$id":"7","$type":"Server.Models.GHSkill, Server","Id":3,"Name":"HtmlAgilityPack","ParentSkillId":1,"ParentSkill":{"$ref":"1"},"SubSkills":null,"Maps":[{"$ref":"6"}]},"GHProjectId":12700122,"Project":{"$ref":"4"}},{"$id":"8","$type":"Server.Models.MapSP, Server","Id":4,"GHSkillId":4,"Skill":{"$id":"9","$type":"Server.Models.GHSkill, Server","Id":4,"Name":"Interop.Excel.dll","ParentSkillId":1,"ParentSkill":{"$ref":"1"},"SubSkills":null,"Maps":[{"$ref":"8"},{"$id":"10","$type":"Server.Models.MapSP, Server","Id":14,"GHSkillId":4,"Skill":{"$ref":"9"},"GHProjectId":12008638,"Project":{"$id":"11","$type":"Server.Models.GHProject, Server","Id":12008638,"Name":"VocabularyGame","Description":"Better your elocution","Maps":[{"$id":"12","$type":"Server.Models.MapSP, Server","Id":11,"GHSkillId":1,"Skill":{"$ref":"1"},"GHProjectId":12008638,"Project":{"$ref":"11"}},{"$ref":"10"},{"$id":"13","$type":"Server.Models.MapSP, Server","Id":12,"GHSkillId":9,"Skill":{"$id":"14","$type":"Server.Models.GHSkill, Server","Id":9,"Name":"WPF - Windows Presentaion Foundation","ParentSkillId":1,"ParentSkill":{"$ref":"1"},"SubSkills":null,"Maps":[{"$ref":"13"}]},"GHProjectId":12008638,"Project":{"$ref":"11"}},{"$id":"15","$type":"Server.Models.MapSP, Server","Id":13,"GHSkillId":10,"Skill":{"$id":"16","$type":"Server.Models.GHSkill, Server","Id":10,"Name":"LINQ","ParentSkillId":1,"ParentSkill":{"$ref":"1"},"SubSkills":null,"Maps":[{"$ref":"15"}]},"GHProjectId":12008638,"Project":{"$ref":"11"}}]}}]},"GHProjectId":12700122,"Project":{"$ref":"4"}},{"$id":"17","$type":"Server.Models.MapSP, Server","Id":5,"GHSkillId":5,"Skill":{"$id":"18","$type":"Server.Models.GHSkill, Server","Id":5,"Name":"SQL Server","ParentSkillId":null,"ParentSkill":null,"SubSkills":null,"Maps":[{"$ref":"17"}]},"GHProjectId":12700122,"Project":{"$ref":"4"}}]}},{"$id":"19","$type":"Server.Models.MapSP, Server","Id":6,"GHSkillId":2,"Skill":{"$ref":"2"},"GHProjectId":12082382,"Project":{"$id":"20","$type":"Server.Models.GHProject, Server","Id":12082382,"Name":"ConnStealing","Description":"Capturing of TCP Packets","Maps":[{"$id":"21","$type":"Server.Models.MapSP, Server","Id":8,"GHSkillId":1,"Skill":{"$ref":"1"},"GHProjectId":12082382,"Project":{"$ref":"20"}},{"$ref":"19"},{"$id":"22","$type":"Server.Models.MapSP, Server","Id":7,"GHSkillId":6,"Skill":{"$id":"23","$type":"Server.Models.GHSkill, Server","Id":6,"Name":"PacketDotNet","ParentSkillId":1,"ParentSkill":{"$ref":"1"},"SubSkills":null,"Maps":[{"$ref":"22"}]},"GHProjectId":12082382,"Project":{"$ref":"20"}}]}}]},{"$ref":"7"},{"$ref":"9"},{"$ref":"23"},{"$ref":"14"},{"$ref":"16"}],"Maps":[{"$ref":"5"},{"$ref":"21"},{"$ref":"12"}]},{"$ref":"2"},{"$ref":"7"},{"$ref":"9"},{"$ref":"18"},{"$ref":"23"},{"$id":"24","$type":"Server.Models.GHSkill, Server","Id":7,"Name":"Pascal","ParentSkillId":null,"ParentSkill":null,"SubSkills":[{"$id":"25","$type":"Server.Models.GHSkill, Server","Id":8,"Name":"Borland Delphi","ParentSkillId":7,"ParentSkill":{"$ref":"24"},"SubSkills":null,"Maps":[{"$id":"26","$type":"Server.Models.MapSP, Server","Id":10,"GHSkillId":8,"Skill":{"$ref":"25"},"GHProjectId":12764154,"Project":{"$id":"27","$type":"Server.Models.GHProject, Server","Id":12764154,"Name":"Delphi","Description":"My university projects on Delphi and Pascal","Maps":[{"$id":"28","$type":"Server.Models.MapSP, Server","Id":9,"GHSkillId":7,"Skill":{"$ref":"24"},"GHProjectId":12764154,"Project":{"$ref":"27"}},{"$ref":"26"}]}}]}],"Maps":[{"$ref":"28"}]},{"$ref":"25"},{"$ref":"14"},{"$ref":"16"}]
    );

    SkillsRepo.initialize().catch(function (error){
      console.error(error);
    }).then(function (result){
      Assert.allSkills = result;
    })

    $httpBackend.flush();
  });

  afterEach(function (){
    if (isInitialized) { return; }

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();

    isInitialized = true;
  });

  describe('SkillsRepo.initialize():', function (){

    it('fill allParentSkills', function (){
      expect(SkillsRepo.allParentSkills).toBeDefined();
      expect(SkillsRepo.allParentSkills.length).toBe(3);
    });

    it('contain only parent skills, not children', function (){
      Assert.expectSubSkills(
        Assert.expectSkill('Pascal'),
        ['Borland Delphi']
      );

      var singleOrDefault = _.where(SkillsRepo.allParentSkills, { Name: 'Lucene' });
      expect(singleOrDefault.length).toBe(0);
    });

    it('exist C# skill with projects', function (){
      Assert.expectSubSkills(
        Assert.expectSkill('C#'), ['LINQ', 'PacketDotNet']
      );
      Assert.expectProjectsForSkill('C#', ['VocabularyGame', 'ConnStealing']);
    });

    it('exist SQL Server skill with projects', function (){
      Assert.expectSubSkills(
        Assert.expectSkill('SQL Server')
      );
      Assert.expectProjectsForSkill('SQL Server', ['SoccerBase']);
    });

  });

  describe('SkillsRepo.getParentSkills():', function (){

    it('throw if allParentSkills is empty', function (){
      expect(function() {
        SkillsRepo.getParentSkills([]);
      }).toThrow(
        new Error('allParentSkills = []; Click "Repopulate skills" first !')
      );
    });

  });

  describe('SkillsRepo.getSkill():', function (){

    it('throw error on non-existant id', function (){
      expect(function (){
        SkillsRepo.getSkill(999);
      }).toThrow(new Error('skill with id="999" doesn\'t exist'));
    });

    it('return valid skill on valid id', function (){
      var skill = SkillsRepo.getSkill(4);

      expect(skill).toBeDefined();
      expect(skill.Name).toBe('Interop.Excel.dll');
    });

  });

  describe("SkillsRepo.getReadme():", function (){

    var DataMock,
      jqReadme,
      readme;

    beforeEach(function (){
      var scope;

      module('clientApp');
      module('DataMock');

      inject(function ($rootScope, _Data_, _SkillsRepo_){
        scope = $rootScope.$new();
        DataMock = _Data_;
        SkillsRepo = _SkillsRepo_;
        spyOn(DataMock, 'getGitHubHTML').and.callThrough();
      });

      SkillsRepo.getReadme('VocabularyGame').then(function (result){
        readme = result;
        jqReadme = $($.parseHTML(readme));
      });
      scope.$digest();
    });

    it('fetch non-empty readme html', function (){
      expect(DataMock.getGitHubHTML).toHaveBeenCalledWith('VocabularyGame/readme');
      expect(readme).toBeDefined();
      expect(readme.length).toBeGreaterThan(7000);
    });

    it('strips links with self pointing hash anchors', function (){
      expect(jqReadme.find('a.anchor').length).toBe(0);
    });

    it('replace relative links with github absolute links', function (){
      expect(jqReadme.find('a').filter(function () {
        return !$(this).attr('href').match(/^(https?\:)?\/\//);
      }).length).toBe(0);
    });

    it('have links that open in new tabs only', function (){
      expect(jqReadme.find('a').filter(function () {
        return $(this).attr('target') !== '_blank'
      }).length).toBe(0);
    });

  });

});