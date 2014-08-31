'use strict';

describe('Service: dataservice', function (){

  var $httpBackend,
    dataservice,
    isInitialized;

  var expectSkill = function (collection, name){
    var singleOrDefault = _.where(collection, { Name: name });
    expect(singleOrDefault.length).toBe(1);

    var skill = singleOrDefault[0];
    expect(skill).toBeDefined();
    expect(skill.Name).toBe(name);
    
    return skill;
  };

  var expectSubSkills = function (skill, childrenNames){
    var subSkills = skill.SubSkills;

    if (!childrenNames || childrenNames.length === 0)
    {
      expect(subSkills.length).toBe(0);
      return;
    }

    expect(subSkills.length).toBeGreaterThan(0);
    _.each(childrenNames, function (childName){
      var subSkill = expectSkill(subSkills, childName);
      expect(subSkill.SubSkills.length).toBe(0);
      expect(subSkill.ParentSkill).toBe(skill);
    });
  };

  var expectProjectsForSkill = function (skillName, projectNames){
    var skill = _.where(dataservice.allSkills, { Name: skillName })[0];
    var maps = skill.Maps;

    expect(maps).toBeDefined();
    expect(maps.length).toBeGreaterThan(0);

    _.each(projectNames, function (p){
      var skillProject = _.find(maps, function (m){
        return m.Project.Name === p;
      }).Project;
      
      expect(skillProject).toBeDefined();
      expect(skillProject.Name).toBe(p);
    });
  };

  beforeEach(function (){
    if (isInitialized) { return; }

    // load the service's module
    module('clientApp', function ($provide){
      $provide.value('$state', function(){ return {}; });
      $provide.value('$urlRouter', function(){ return {}; });
    });

    inject(function (_$httpBackend_, _dataservice_){
      $httpBackend = _$httpBackend_;
      dataservice = _dataservice_;
    });

    $httpBackend.expectGET('http://thehalcyonsavant.com/breeze/Main/IsAdministrator').respond('1');
    $httpBackend.expectGET('http://thehalcyonsavant.com/breeze/Main/Metadata').respond(
      {"schema":{"namespace":"Server.DAL","alias":"Self","annotation:UseStrongSpatialTypes":"false","xmlns:annotation":"http://schemas.microsoft.com/ado/2009/02/edm/annotation","xmlns:customannotation":"http://schemas.microsoft.com/ado/2013/11/edm/customannotation","xmlns":"http://schemas.microsoft.com/ado/2009/11/edm","cSpaceOSpaceMapping":"[[\"Server.DAL.MapQAT\",\"Server.Models.MapQAT\"],[\"Server.DAL.QnA\",\"Server.Models.QnA\"],[\"Server.DAL.Tag\",\"Server.Models.Tag\"],[\"Server.DAL.MapSP\",\"Server.Models.MapSP\"],[\"Server.DAL.GHProject\",\"Server.Models.GHProject\"],[\"Server.DAL.GHSkill\",\"Server.Models.GHSkill\"],[\"Server.DAL.Test\",\"Server.Models.Test\"]]","entityType":[{"name":"MapQAT","customannotation:ClrType":"Server.Models.MapQAT, Server, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","key":{"propertyRef":{"name":"Id"}},"property":[{"name":"Id","type":"Edm.Int32","nullable":"false","annotation:StoreGeneratedPattern":"Identity"},{"name":"QnAId","type":"Edm.Int32","nullable":"false"},{"name":"TagId","type":"Edm.Int32","nullable":"false"}],"navigationProperty":[{"name":"QnA","relationship":"Self.QnA_Maps","fromRole":"QnA_Maps_Target","toRole":"QnA_Maps_Source"},{"name":"Tag","relationship":"Self.Tag_Maps","fromRole":"Tag_Maps_Target","toRole":"Tag_Maps_Source"}]},{"name":"QnA","customannotation:ClrType":"Server.Models.QnA, Server, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","key":{"propertyRef":{"name":"Id"}},"property":[{"name":"Id","type":"Edm.Int32","nullable":"false","annotation:StoreGeneratedPattern":"Identity"},{"name":"Question","type":"Edm.String","maxLength":"Max","fixedLength":"false","unicode":"true","nullable":"false"},{"name":"Answer","type":"Edm.String","maxLength":"Max","fixedLength":"false","unicode":"true"},{"name":"Order","type":"Edm.Int32"}],"navigationProperty":{"name":"Maps","relationship":"Self.QnA_Maps","fromRole":"QnA_Maps_Source","toRole":"QnA_Maps_Target"}},{"name":"Tag","customannotation:ClrType":"Server.Models.Tag, Server, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","key":{"propertyRef":{"name":"Id"}},"property":[{"name":"Id","type":"Edm.Int32","nullable":"false","annotation:StoreGeneratedPattern":"Identity"},{"name":"Name","type":"Edm.String","maxLength":"100","fixedLength":"false","unicode":"true","nullable":"false"},{"name":"Order","type":"Edm.Int32"}],"navigationProperty":{"name":"Maps","relationship":"Self.Tag_Maps","fromRole":"Tag_Maps_Source","toRole":"Tag_Maps_Target"}},{"name":"MapSP","customannotation:ClrType":"Server.Models.MapSP, Server, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","key":{"propertyRef":{"name":"Id"}},"property":[{"name":"Id","type":"Edm.Int32","nullable":"false","annotation:StoreGeneratedPattern":"Identity"},{"name":"GHSkillId","type":"Edm.Int32","nullable":"false"},{"name":"GHProjectId","type":"Edm.Int32","nullable":"false"}],"navigationProperty":[{"name":"Project","relationship":"Self.GHProject_Maps","fromRole":"GHProject_Maps_Target","toRole":"GHProject_Maps_Source"},{"name":"Skill","relationship":"Self.GHSkill_Maps","fromRole":"GHSkill_Maps_Target","toRole":"GHSkill_Maps_Source"}]},{"name":"GHProject","customannotation:ClrType":"Server.Models.GHProject, Server, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","key":{"propertyRef":{"name":"Id"}},"property":[{"name":"Id","type":"Edm.Int32","nullable":"false","annotation:StoreGeneratedPattern":"None"},{"name":"Name","type":"Edm.String","maxLength":"Max","fixedLength":"false","unicode":"true"},{"name":"Description","type":"Edm.String","maxLength":"Max","fixedLength":"false","unicode":"true"}],"navigationProperty":{"name":"Maps","relationship":"Self.GHProject_Maps","fromRole":"GHProject_Maps_Source","toRole":"GHProject_Maps_Target"}},{"name":"GHSkill","customannotation:ClrType":"Server.Models.GHSkill, Server, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","key":{"propertyRef":{"name":"Id"}},"property":[{"name":"Id","type":"Edm.Int32","nullable":"false","annotation:StoreGeneratedPattern":"Identity"},{"name":"Name","type":"Edm.String","maxLength":"Max","fixedLength":"false","unicode":"true"},{"name":"ParentSkillId","type":"Edm.Int32"}],"navigationProperty":[{"name":"Maps","relationship":"Self.GHSkill_Maps","fromRole":"GHSkill_Maps_Source","toRole":"GHSkill_Maps_Target"},{"name":"ParentSkill","relationship":"Self.GHSkill_ParentSkill","fromRole":"GHSkill_ParentSkill_Source","toRole":"GHSkill_ParentSkill_Target"},{"name":"SubSkills","relationship":"Self.GHSkill_ParentSkill","fromRole":"GHSkill_ParentSkill_Target","toRole":"GHSkill_ParentSkill_Source"}]},{"name":"Test","customannotation:ClrType":"Server.Models.Test, Server, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","key":{"propertyRef":{"name":"Id"}},"property":[{"name":"Id","type":"Edm.Int32","nullable":"false","annotation:StoreGeneratedPattern":"None"},{"name":"Name","type":"Edm.String","maxLength":"Max","fixedLength":"false","unicode":"true"}]}],"association":[{"name":"QnA_Maps","end":[{"role":"QnA_Maps_Source","type":"Edm.Self.QnA","multiplicity":"1","onDelete":{"action":"Cascade"}},{"role":"QnA_Maps_Target","type":"Edm.Self.MapQAT","multiplicity":"*"}],"referentialConstraint":{"principal":{"role":"QnA_Maps_Source","propertyRef":{"name":"Id"}},"dependent":{"role":"QnA_Maps_Target","propertyRef":{"name":"QnAId"}}}},{"name":"Tag_Maps","end":[{"role":"Tag_Maps_Source","type":"Edm.Self.Tag","multiplicity":"1","onDelete":{"action":"Cascade"}},{"role":"Tag_Maps_Target","type":"Edm.Self.MapQAT","multiplicity":"*"}],"referentialConstraint":{"principal":{"role":"Tag_Maps_Source","propertyRef":{"name":"Id"}},"dependent":{"role":"Tag_Maps_Target","propertyRef":{"name":"TagId"}}}},{"name":"GHProject_Maps","end":[{"role":"GHProject_Maps_Source","type":"Edm.Self.GHProject","multiplicity":"1","onDelete":{"action":"Cascade"}},{"role":"GHProject_Maps_Target","type":"Edm.Self.MapSP","multiplicity":"*"}],"referentialConstraint":{"principal":{"role":"GHProject_Maps_Source","propertyRef":{"name":"Id"}},"dependent":{"role":"GHProject_Maps_Target","propertyRef":{"name":"GHProjectId"}}}},{"name":"GHSkill_Maps","end":[{"role":"GHSkill_Maps_Source","type":"Edm.Self.GHSkill","multiplicity":"1","onDelete":{"action":"Cascade"}},{"role":"GHSkill_Maps_Target","type":"Edm.Self.MapSP","multiplicity":"*"}],"referentialConstraint":{"principal":{"role":"GHSkill_Maps_Source","propertyRef":{"name":"Id"}},"dependent":{"role":"GHSkill_Maps_Target","propertyRef":{"name":"GHSkillId"}}}},{"name":"GHSkill_ParentSkill","end":[{"role":"GHSkill_ParentSkill_Source","type":"Edm.Self.GHSkill","multiplicity":"*"},{"role":"GHSkill_ParentSkill_Target","type":"Edm.Self.GHSkill","multiplicity":"0..1"}],"referentialConstraint":{"principal":{"role":"GHSkill_ParentSkill_Target","propertyRef":{"name":"Id"}},"dependent":{"role":"GHSkill_ParentSkill_Source","propertyRef":{"name":"ParentSkillId"}}}}],"entityContainer":{"name":"TestContext","customannotation:UseClrTypes":"true","entitySet":[{"name":"MapsQAT","entityType":"Self.MapQAT"},{"name":"QnAs","entityType":"Self.QnA"},{"name":"Tags","entityType":"Self.Tag"},{"name":"MapsSP","entityType":"Self.MapSP"},{"name":"Projects","entityType":"Self.GHProject"},{"name":"Skills","entityType":"Self.GHSkill"},{"name":"Tests","entityType":"Self.Test"}],"associationSet":[{"name":"QnA_Maps","association":"Self.QnA_Maps","end":[{"role":"QnA_Maps_Source","entitySet":"QnAs"},{"role":"QnA_Maps_Target","entitySet":"MapsQAT"}]},{"name":"Tag_Maps","association":"Self.Tag_Maps","end":[{"role":"Tag_Maps_Source","entitySet":"Tags"},{"role":"Tag_Maps_Target","entitySet":"MapsQAT"}]},{"name":"GHProject_Maps","association":"Self.GHProject_Maps","end":[{"role":"GHProject_Maps_Source","entitySet":"Projects"},{"role":"GHProject_Maps_Target","entitySet":"MapsSP"}]},{"name":"GHSkill_Maps","association":"Self.GHSkill_Maps","end":[{"role":"GHSkill_Maps_Source","entitySet":"Skills"},{"role":"GHSkill_Maps_Target","entitySet":"MapsSP"}]},{"name":"GHSkill_ParentSkill","association":"Self.GHSkill_ParentSkill","end":[{"role":"GHSkill_ParentSkill_Source","entitySet":"Skills"},{"role":"GHSkill_ParentSkill_Target","entitySet":"Skills"}]}]}}}
    );
    $httpBackend.expectGET('http://thehalcyonsavant.com/breeze/Main/Skills?').respond(
      [{"$id":"1","$type":"Server.Models.GHSkill, Server","Id":1,"Name":"Java","ParentSkillId":null,"ParentSkill":null,"SubSkills":[{"$id":"2","$type":"Server.Models.GHSkill, Server","Id":2,"Name":"Colt","ParentSkillId":1,"ParentSkill":{"$ref":"1"},"SubSkills":null,"Maps":[{"$id":"3","$type":"Server.Models.MapSP, Server","Id":1,"GHSkillId":2,"Skill":{"$ref":"2"},"GHProjectId":20219798,"Project":{"$id":"4","$type":"Server.Models.GHProject, Server","Id":20219798,"Name":"Colt-performance-example","Description":"Compare the performance between O(n) \"optimized\" algorithms and Colt functions","Maps":[{"$id":"5","$type":"Server.Models.MapSP, Server","Id":2,"GHSkillId":1,"Skill":{"$ref":"1"},"GHProjectId":20219798,"Project":{"$ref":"4"}},{"$ref":"3"}]}}]},{"$id":"6","$type":"Server.Models.GHSkill, Server","Id":13,"Name":"Lucene","ParentSkillId":1,"ParentSkill":{"$ref":"1"},"SubSkills":null,"Maps":[{"$id":"7","$type":"Server.Models.MapSP, Server","Id":13,"GHSkillId":13,"Skill":{"$ref":"6"},"GHProjectId":20218752,"Project":{"$id":"8","$type":"Server.Models.GHProject, Server","Id":20218752,"Name":"Lucene-quality-score-example","Description":"Get the best matched string of normalised set of strings by comparing their quality scores.","Maps":[{"$id":"9","$type":"Server.Models.MapSP, Server","Id":14,"GHSkillId":1,"Skill":{"$ref":"1"},"GHProjectId":20218752,"Project":{"$ref":"8"}},{"$ref":"7"}]}}]},{"$id":"10","$type":"Server.Models.GHSkill, Server","Id":14,"Name":"JFC Swing","ParentSkillId":1,"ParentSkill":{"$ref":"1"},"SubSkills":null,"Maps":[{"$id":"11","$type":"Server.Models.MapSP, Server","Id":15,"GHSkillId":14,"Skill":{"$ref":"10"},"GHProjectId":12889832,"Project":{"$id":"12","$type":"Server.Models.GHProject, Server","Id":12889832,"Name":"regex","Description":"Simple Regular Expression Checker","Maps":[{"$id":"13","$type":"Server.Models.MapSP, Server","Id":16,"GHSkillId":1,"Skill":{"$ref":"1"},"GHProjectId":12889832,"Project":{"$ref":"12"}},{"$ref":"11"}]}}]}],"Maps":[{"$ref":"5"},{"$ref":"9"},{"$ref":"13"}]},{"$ref":"2"},{"$id":"14","$type":"Server.Models.GHSkill, Server","Id":3,"Name":"C#","ParentSkillId":null,"ParentSkill":null,"SubSkills":[{"$id":"15","$type":"Server.Models.GHSkill, Server","Id":4,"Name":"WinForms","ParentSkillId":3,"ParentSkill":{"$ref":"14"},"SubSkills":null,"Maps":[{"$id":"16","$type":"Server.Models.MapSP, Server","Id":3,"GHSkillId":4,"Skill":{"$ref":"15"},"GHProjectId":12082382,"Project":{"$id":"17","$type":"Server.Models.GHProject, Server","Id":12082382,"Name":"ConnStealing","Description":"Capturing of TCP Packets","Maps":[{"$id":"18","$type":"Server.Models.MapSP, Server","Id":5,"GHSkillId":3,"Skill":{"$ref":"14"},"GHProjectId":12082382,"Project":{"$ref":"17"}},{"$ref":"16"},{"$id":"19","$type":"Server.Models.MapSP, Server","Id":4,"GHSkillId":6,"Skill":{"$id":"20","$type":"Server.Models.GHSkill, Server","Id":6,"Name":"PacketDotNet","ParentSkillId":3,"ParentSkill":{"$ref":"14"},"SubSkills":null,"Maps":[{"$ref":"19"}]},"GHProjectId":12082382,"Project":{"$ref":"17"}}]}},{"$id":"21","$type":"Server.Models.MapSP, Server","Id":17,"GHSkillId":4,"Skill":{"$ref":"15"},"GHProjectId":12700122,"Project":{"$id":"22","$type":"Server.Models.GHProject, Server","Id":12700122,"Name":"SoccerBase","Description":"Statistical predictions on soccer matches","Maps":[{"$id":"23","$type":"Server.Models.MapSP, Server","Id":20,"GHSkillId":3,"Skill":{"$ref":"14"},"GHProjectId":12700122,"Project":{"$ref":"22"}},{"$ref":"21"},{"$id":"24","$type":"Server.Models.MapSP, Server","Id":19,"GHSkillId":9,"Skill":{"$id":"25","$type":"Server.Models.GHSkill, Server","Id":9,"Name":"Interop.Excel.dll","ParentSkillId":5,"ParentSkill":{"$id":"26","$type":"Server.Models.GHSkill, Server","Id":5,"Name":"F#","ParentSkillId":null,"ParentSkill":null,"SubSkills":[{"$ref":"25"}],"Maps":[{"$id":"27","$type":"Server.Models.MapSP, Server","Id":9,"GHSkillId":5,"Skill":{"$ref":"26"},"GHProjectId":12078743,"Project":{"$id":"28","$type":"Server.Models.GHProject, Server","Id":12078743,"Name":"ExcelApp","Description":"Simpler Excel Interface","Maps":[{"$ref":"27"},{"$id":"29","$type":"Server.Models.MapSP, Server","Id":8,"GHSkillId":9,"Skill":{"$ref":"25"},"GHProjectId":12078743,"Project":{"$ref":"28"}}]}}]},"SubSkills":null,"Maps":[{"$ref":"29"},{"$ref":"24"},{"$id":"30","$type":"Server.Models.MapSP, Server","Id":26,"GHSkillId":9,"Skill":{"$ref":"25"},"GHProjectId":12008638,"Project":{"$id":"31","$type":"Server.Models.GHProject, Server","Id":12008638,"Name":"VocabularyGame","Description":"Better your elocution","Maps":[{"$id":"32","$type":"Server.Models.MapSP, Server","Id":27,"GHSkillId":3,"Skill":{"$ref":"14"},"GHProjectId":12008638,"Project":{"$ref":"31"}},{"$ref":"30"},{"$id":"33","$type":"Server.Models.MapSP, Server","Id":24,"GHSkillId":19,"Skill":{"$id":"34","$type":"Server.Models.GHSkill, Server","Id":19,"Name":"WPF - Windows Presentaion Foundation","ParentSkillId":3,"ParentSkill":{"$ref":"14"},"SubSkills":null,"Maps":[{"$ref":"33"}]},"GHProjectId":12008638,"Project":{"$ref":"31"}},{"$id":"35","$type":"Server.Models.MapSP, Server","Id":25,"GHSkillId":20,"Skill":{"$id":"36","$type":"Server.Models.GHSkill, Server","Id":20,"Name":"LINQ","ParentSkillId":3,"ParentSkill":{"$ref":"14"},"SubSkills":null,"Maps":[{"$ref":"35"}]},"GHProjectId":12008638,"Project":{"$ref":"31"}}]}}]},"GHProjectId":12700122,"Project":{"$ref":"22"}},{"$id":"37","$type":"Server.Models.MapSP, Server","Id":18,"GHSkillId":15,"Skill":{"$id":"38","$type":"Server.Models.GHSkill, Server","Id":15,"Name":"HtmlAgilityPack","ParentSkillId":3,"ParentSkill":{"$ref":"14"},"SubSkills":null,"Maps":[{"$ref":"37"}]},"GHProjectId":12700122,"Project":{"$ref":"22"}},{"$id":"39","$type":"Server.Models.MapSP, Server","Id":21,"GHSkillId":16,"Skill":{"$id":"40","$type":"Server.Models.GHSkill, Server","Id":16,"Name":"SQL Server","ParentSkillId":null,"ParentSkill":null,"SubSkills":null,"Maps":[{"$ref":"39"}]},"GHProjectId":12700122,"Project":{"$ref":"22"}}]}}]},{"$ref":"20"},{"$ref":"38"},{"$ref":"34"},{"$ref":"36"}],"Maps":[{"$ref":"18"},{"$ref":"23"},{"$ref":"32"}]},{"$ref":"15"},{"$ref":"26"},{"$ref":"20"},{"$id":"41","$type":"Server.Models.GHSkill, Server","Id":7,"Name":"Pascal","ParentSkillId":null,"ParentSkill":null,"SubSkills":[{"$id":"42","$type":"Server.Models.GHSkill, Server","Id":8,"Name":"Borland Delphi","ParentSkillId":7,"ParentSkill":{"$ref":"41"},"SubSkills":null,"Maps":[{"$id":"43","$type":"Server.Models.MapSP, Server","Id":6,"GHSkillId":8,"Skill":{"$ref":"42"},"GHProjectId":12764154,"Project":{"$id":"44","$type":"Server.Models.GHProject, Server","Id":12764154,"Name":"Delphi","Description":"My university projects on Delphi and Pascal","Maps":[{"$id":"45","$type":"Server.Models.MapSP, Server","Id":7,"GHSkillId":7,"Skill":{"$ref":"41"},"GHProjectId":12764154,"Project":{"$ref":"44"}},{"$ref":"43"}]}}]}],"Maps":[{"$ref":"45"}]},{"$ref":"42"},{"$ref":"25"},{"$id":"46","$type":"Server.Models.GHSkill, Server","Id":10,"Name":"C++","ParentSkillId":null,"ParentSkill":null,"SubSkills":[{"$id":"47","$type":"Server.Models.GHSkill, Server","Id":11,"Name":"WinApi","ParentSkillId":10,"ParentSkill":{"$ref":"46"},"SubSkills":null,"Maps":[{"$id":"48","$type":"Server.Models.MapSP, Server","Id":10,"GHSkillId":11,"Skill":{"$ref":"47"},"GHProjectId":12614104,"Project":{"$id":"49","$type":"Server.Models.GHProject, Server","Id":12614104,"Name":"FileHide","Description":"Hidding files from WinXP FileSystem","Maps":[{"$id":"50","$type":"Server.Models.MapSP, Server","Id":11,"GHSkillId":10,"Skill":{"$ref":"46"},"GHProjectId":12614104,"Project":{"$ref":"49"}},{"$ref":"48"}]}}]}],"Maps":[{"$ref":"50"}]},{"$ref":"47"},{"$id":"51","$type":"Server.Models.GHSkill, Server","Id":12,"Name":"VBA","ParentSkillId":null,"ParentSkill":null,"SubSkills":null,"Maps":[{"$id":"52","$type":"Server.Models.MapSP, Server","Id":12,"GHSkillId":12,"Skill":{"$ref":"51"},"GHProjectId":12809643,"Project":{"$id":"53","$type":"Server.Models.GHProject, Server","Id":12809643,"Name":"Invoices","Description":"Invoice management with VBA Excel ","Maps":[{"$ref":"52"}]}}]},{"$ref":"6"},{"$ref":"10"},{"$ref":"38"},{"$ref":"40"},{"$id":"54","$type":"Server.Models.GHSkill, Server","Id":17,"Name":"C","ParentSkillId":null,"ParentSkill":null,"SubSkills":[{"$id":"55","$type":"Server.Models.GHSkill, Server","Id":18,"Name":"WDK - Windows Driver Kit","ParentSkillId":17,"ParentSkill":{"$ref":"54"},"SubSkills":null,"Maps":[{"$id":"56","$type":"Server.Models.MapSP, Server","Id":22,"GHSkillId":18,"Skill":{"$ref":"55"},"GHProjectId":12612135,"Project":{"$id":"57","$type":"Server.Models.GHProject, Server","Id":12612135,"Name":"SSDT_Hook","Description":"WinXP SSDT hook driver","Maps":[{"$id":"58","$type":"Server.Models.MapSP, Server","Id":23,"GHSkillId":17,"Skill":{"$ref":"54"},"GHProjectId":12612135,"Project":{"$ref":"57"}},{"$ref":"56"}]}}]}],"Maps":[{"$ref":"58"}]},{"$ref":"55"},{"$ref":"34"},{"$ref":"36"}]
    );

    dataservice.initialize().catch(function (error){
      console.error(error);
    });

    $httpBackend.flush();
  });

  afterEach(function (){
    if (isInitialized) { return; }

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();

    isInitialized = true;
  });

  it('define IsAdministrator property', function (){
    expect(dataservice.IsAdministrator).toBe(1);
  });

  it('fill allSkills', function (){
    expect(dataservice.allSkills).toBeDefined();
    expect(dataservice.allSkills.length).toBeGreaterThan(3);
  });

  it('exist C# skill with projects', function (){
    expectSubSkills(
      expectSkill(dataservice.allSkills, 'C#'),
      ['LINQ', 'PacketDotNet']
    );
    expectProjectsForSkill('C#', ['VocabularyGame', 'ConnStealing']);
  });

  it('exist Java skill with projects', function (){
    expectSubSkills(
      expectSkill(dataservice.allSkills, 'Java'),
      ['Lucene']
    );
    expectProjectsForSkill('Java', ['Lucene-quality-score-example']);
  });

  it('exist SQL Server skill with projects', function (){
    expectSubSkills(expectSkill(dataservice.allSkills, 'SQL Server'));
    expectProjectsForSkill('SQL Server', ['SoccerBase']);
  });

  describe('dataservice.getParentSkills():', function (){

    it('throw if allSkills is empty', function (){
      var backup = dataservice.allSkills;
      dataservice.allSkills = [];

      spyOn(dataservice, 'getParentSkills').and.callThrough();
      
      expect(function() { dataservice.getParentSkills(); }).toThrow(
        new Error('allSkills = []; Click "Repopulate skills" first !')
      );
      dataservice.allSkills = backup;
    });

    it('contain only parent skills, not children', function (){
      var skills = dataservice.getParentSkills();

      expectSubSkills(expectSkill(skills, 'C'), ['WDK - Windows Driver Kit']);

      var singleOrDefault = _.where(skills, { Name: 'Lucene' });
      expect(singleOrDefault.length).toBe(0);
    });

  });

  describe('dataservice.getSkill():', function (){

    it('throw error on non-existant id', function (){
      expect(function (){
        dataservice.getSkill(999);
      }).toThrow(new Error('skill with id="999" doesn\'t exist'));
    });

    it('return valid skill on valid id', function (){
      var skill = dataservice.getSkill(7);

      expectSkill(skill, 'Pascal');
    });

  });

  describe("dataservice.getReadme():", function (){

    var readme;

    var prepareHttp = function (){
      $httpBackend.resetExpectations();
      $httpBackend.expectGET('https://api.github.com/repos/TheHalcyonSavant/VocabularyGame/readme').respond(
        '<div class="announce instapaper_body md" data-path="README.md" id="readme"><article class="markdown-body entry-content" itemprop="mainContentOfPage"><h2><a name="user-content-vocabularygame---better-your-elocution" class="anchor" href="#vocabularygame---better-your-elocution"><span class="octicon octicon-link"></span></a>VocabularyGame - Better your elocution</h2><p><em><a href="http://www.sciencedaily.com/releases/2012/10/121005123902.htm">Testing is the best learning tool</a></em></p><p>        This is a very simple test game that accumulates points based on your correctly guessed choices. The question is on the top of the window and you must choose only one from five random choices to proceed to the next question.<br>Testing is the best approach to gain any knowledge and with this game it can\'t be easier.</p><h3><a name="user-content-installation" class="anchor" href="#installation"><span class="octicon octicon-link"></span></a>Installation</h3><ol class="task-list"><li>Download <a href="dictionary.xlsm?raw=true">dictionary.xlsm</a> to some permanent location on your disk (like My Documents)</li><li>Download <a href="/VocabularyGame.msi?raw=true">VocabularyGame.msi</a>, install and run VocabularyGame from your desktop</li><li>When the open file dialog pops up, locate dictionary.xlsm</li><li>Enjoy, the game is started !</li></ol><h2><a name="user-content-game-rules" class="anchor" href="#game-rules"><span class="octicon octicon-link"></span></a>Game Rules</h2><p>        The game is simply played by choosing only one option from the five <em>Radio Buttons</em>. The choice you made should correspond to the question (the light-green text on the top of the window). If you choose correctly, you gain <strong>+5 points</strong>. But, if you are wrong, you <strong>loose all your points</strong> that you have accumulated so far. In meanwhile, if the <em>Countdown timer</em> is on and its time passes, then you loose <strong>-15 points</strong> instead of all of them.</p><p>When you click the sound icon (next to the question) you can hear and learn how to pronounce the phrase. These sounds are downloaded into the <em>sounds/</em> folder.</p><p>When you gain <strong>30 points</strong> for the first time, then you\'ve made the first record. To break it again you must pass the best record made so far. To see all records go to <em>File -&gt; Records</em>. The records are stored inside <em>dat/{dictionaryWithNoExt}_records.dat</em> file (e.g. <em>dat/dictionary_records.dat</em>) and saved upon leaving the application.</p><p>Right clicking the synonyms (the <strong>bold</strong> radio buttons) will bring up a <em>tooltip</em> with the corresponding Macedonian translation, if there is one. Every next right clicking on the same choice will cycle through the translations. Be careful right clicking the synonyms, after guessing the right answer you will loose <strong>-5 points</strong> instead of gaining.</p><h2><a name="user-content-dictionaryxlsm" class="anchor" href="#dictionaryxlsm"><span class="octicon octicon-link"></span></a>dictionary.xlsm</h2><p>        When you open the application for the first, an open dialog pops out and asks you to locate <em>dictionary.xlsm</em>. This is a Macro-Enabled Excel file that contains all the unique entries, important for this game to choose from. You must have installed <strong>Microsoft Office 2007</strong> or newer version to edit this file.<br>This excel file contains 4 columns:<br>         <strong>A</strong> : <strong>English</strong> - this is the key column. The question is randomly generated from this column. Contains single word (e.g. <em>affix</em>), phrases (e.g. <em>bundle up</em>), also words with additional explanation in parenthesis like <em>maiden (adjective)</em>;<br>         <strong>B</strong> : <em>Lexicon</em> - a meaningful explanations in English;<br>         <strong>C</strong> : <strong>Synonyms</strong> - words with same or similar meanings;<br>         <strong>D</strong> : Macedonian - direct Cyrillic translation.<br>         Columns <strong>B</strong>, <strong>C</strong> and <strong>D</strong> can have more then one meaning separated by semicolon and new line (e.g. see <em>calf</em>). Also, those columns can be empty if a translation or explanation is not necessary. The 5 random answers are generated from these 3 columns. </p><h2><a name="user-content-user-settings" class="anchor" href="#user-settings"><span class="octicon octicon-link"></span></a>User Settings</h2><h4><a name="user-content-answer-types" class="anchor" href="#answer-types"><span class="octicon octicon-link"></span></a>Answer Types</h4><p>corresponds to \'dictionary.xlsm\' columns: <em>Lexicon</em>, <strong>Synonyms</strong> and Macedonian. The 5 random choices are generated through limitation on these checked MenuItems (answer types). For example, if you check Lexicon and Synonyms, but uncheck Macedonian, then you will NOT see Macedonian (Cyrillic) words in the 5 random choices from the next question.</p><blockquote><p>If some random choice is Lexicon, then it\'s displayed in <em>Italic</em>. And if it\'s Synonym it is displayed in <strong>Bold</strong>.</p></blockquote><h4><a name="user-content-auto-pronounce-question" class="anchor" href="#auto-pronounce-question"><span class="octicon octicon-link"></span></a>Auto-Pronounce question</h4><p>Automatically pronounce the question on every new round.</p><h4><a name="user-content-countdown-timer" class="anchor" href="#countdown-timer"><span class="octicon octicon-link"></span></a>Countdown Timer</h4><p>When you check this setting, a "Timer" box is showed at the right of the answers and below the points. The time is set at 20 seconds and when the time is up you loose 15 points. The countdown starts from the next question.</p><h4><a name="user-content-dont-show-me-choices-i-guessed-more-then" class="anchor" href="#dont-show-me-choices-i-guessed-more-then"><span class="octicon octicon-link"></span></a>Don\'t show me choices I guessed more then</h4><p>This setting limits the repetition of displayed question-answer pairs. For example if you choose "Don\'t show me choices I guessed more then = 3 times" and if you have guessed question "virtue" with answer "merit" twice already, then this question with this particular answer will not be displayed again.<br>The repetitions history of these pairs are saved inside <em>dat/{dictionaryWithNoExt}_repeats.dat</em> file (e.g. <em>dat/dictionary_repeats.dat</em>).<br>This setting can be very handy if you want to filter very known words, but you want to avoid removing them from the excel file.</p><h3><a name="user-content-language" class="anchor" href="#language"><span class="octicon octicon-link"></span></a>Language</h3><p>User Interface localization language. Needs restart for this setting to take effect.</p><h3><a name="user-content-repeat-the-last-5-wrong-choices" class="anchor" href="#repeat-the-last-5-wrong-choices"><span class="octicon octicon-link"></span></a>Repeat the last 5 wrong choices</h3><p>Every time a wrong answer is chosen, the program accumulates them in <em>dat/{dictionaryWithNoExt}_wrongs.dat</em> (e.g. <em>dat/dictionary_records.dat</em>). After the fifth wrong choice VocabularyGame starts re-asking you with the same wrongfully answered questions, if this setting is checked.</p><h4><a name="user-content-reset-all-settings" class="anchor" href="#reset-all-settings"><span class="octicon octicon-link"></span></a>Reset All Settings</h4><p>Reset all settings in the main menu "Settings" to its default values. The default values can be edited inside <em>VocabularyGame.exe.config</em> file under <em>configuration &gt; userSettings</em> xml node.</p><h2><a name="user-content-application-settings" class="anchor" href="#application-settings"><span class="octicon octicon-link"></span></a>Application Settings</h2><p>The application settings can be edited inside <em>VocabularyGame.exe.config</em> file in the program\'s installation directory under <em>configuration &gt; applicationSettings</em> xml node:</p><ul class="task-list"><li><strong>CountdownSeconds</strong> (Default: 20)</li><li><strong>GStaticLink</strong> (google link needed for downloading word pronunciations)</li><li><strong>RecordsSuffix</strong> (Default: _records.dat)</li><li><strong>RepeatsSuffix</strong> (Default: _repeats.dat)</li><li><strong>WrongsLimit</strong> (The amount of wrong choices limit - see <em>Repeat the last 5 wrong choices</em> user setting. Default: 5)</li><li><strong>WrongsSuffix</strong> (Default: _wrongs.dat)</li></ul><h2><a name="user-content-thanx-to" class="anchor" href="#thanx-to"><span class="octicon octicon-link"></span></a>Thanx to</h2><p><a href="http://stackoverflow.com/a/1134340">Pavel Chuchuva</a> for GifImage.cs<br><a href="http://en.wikipedia.org/wiki/Google_Dictionary">Google Dictionary</a> for making this game "sounds" better</p><h6><a name="user-content-other-repositories" class="anchor" href="#other-repositories"><span class="octicon octicon-link"></span></a>Other repositories:</h6><p>        Use <a href="../../../ExcelApp">ExcelApp</a> library if you want to compile this code successfully</p></article></div>'
      );

      dataservice.getReadme('VocabularyGame').then(function (html){
        readme = html;
      });
    };

    var verifyHttp = function (){
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    };

    var executeHttp = function (){
      dataservice.clearCache();
      prepareHttp();
      $httpBackend.flush();
      verifyHttp();
    };

    it("refuse trip to the server on second request", function (){
      executeHttp();

      prepareHttp();

      // second time should be cached
      expect(function (){
        $httpBackend.flush();
      }).toThrow(new Error('No pending request to flush !'));
    });

    describe('README.html:', function (){
      var isInitialized2,
        jqReadme;

      beforeEach(function (){
        if (isInitialized2) { return; }

        readme = '';
        executeHttp();
        jqReadme = $($.parseHTML(readme));

        isInitialized2 = true;
      });

      it('contain header as html, not as markdown', function (){
        expect(readme).toMatch(
          /<h2>\bVocabularyGame \- Better your elocution\b<\/h2>/
        );
      });

      it('strips links with self pointing hash anchors', function (){
        expect(jqReadme.find('a.anchor').length).toBe(0);
      });

      it('replace relative links with github absolute links', function (){
        expect(jqReadme.find('a').filter(function () {
          return !$(this).attr('href').match(/^(https?\:)?\/\//);
        }).length).toBe(0);
      });

    });
    
  });

  describe("dataservice.getQATs():", function (){

    var isInitialized2,
      QnAs,
      allTags;

    beforeEach(function (){
      if (isInitialized2) { return; }

      $httpBackend.resetExpectations();
      $httpBackend.expectGET('http://thehalcyonsavant.com/breeze/Main/QnA?').respond(
        [{"$id":"1","$type":"Server.Models.QnA, Server","Id":1,"Question":"I would like to ask you some question ?","Answer":"You're free to ask me any question :)","Order":null,"Maps":[{"$id":"2","$type":"Server.Models.MapQAT, Server","Id":1,"QnAId":1,"QnA":{"$ref":"1"},"TagId":1,"Tag":{"$id":"3","$type":"Server.Models.Tag, Server","Id":1,"Name":"General","Order":null,"Maps":[{"$ref":"2"},{"$id":"4","$type":"Server.Models.MapQAT, Server","Id":2,"QnAId":2,"QnA":{"$id":"5","$type":"Server.Models.QnA, Server","Id":2,"Question":"What is your greatest strength ?","Answer":"I have many strengths compared to other developers, like designing simple software from complex\r\n                    problems, fixing its bugs in a very short timespan. I've more understanding then others of the software's\r\n\t                full potential and how to use this knowledge to maximize the consumers needs to their highest\r\n\t                possible limit. And I really enjoy this kind of challenge.","Order":null,"Maps":[{"$ref":"4"}]},"TagId":1,"Tag":{"$ref":"3"}},{"$id":"6","$type":"Server.Models.MapQAT, Server","Id":3,"QnAId":4,"QnA":{"$id":"7","$type":"Server.Models.QnA, Server","Id":4,"Question":"Bank advice ?","Answer":null,"Order":null,"Maps":[{"$ref":"6"},{"$id":"8","$type":"Server.Models.MapQAT, Server","Id":5,"QnAId":4,"QnA":{"$ref":"7"},"TagId":2,"Tag":{"$id":"9","$type":"Server.Models.Tag, Server","Id":2,"Name":"My Introduction","Order":2,"Maps":[{"$id":"10","$type":"Server.Models.MapQAT, Server","Id":4,"QnAId":1,"QnA":{"$ref":"1"},"TagId":2,"Tag":{"$ref":"9"}},{"$ref":"8"},{"$id":"11","$type":"Server.Models.MapQAT, Server","Id":6,"QnAId":6,"QnA":{"$id":"12","$type":"Server.Models.QnA, Server","Id":6,"Question":"test","Answer":"sdfsdf","Order":null,"Maps":[{"$ref":"11"},{"$id":"13","$type":"Server.Models.MapQAT, Server","Id":7,"QnAId":6,"QnA":{"$ref":"12"},"TagId":1,"Tag":{"$ref":"3"}}]},"TagId":2,"Tag":{"$ref":"9"}}]}}]},"TagId":1,"Tag":{"$ref":"3"}},{"$ref":"13"}]}},{"$ref":"10"}]},{"$ref":"5"},{"$id":"14","$type":"Server.Models.QnA, Server","Id":3,"Question":"What is a clousure ?","Answer":"A clousure in JS is ...","Order":4,"Maps":[]},{"$ref":"7"},{"$id":"15","$type":"Server.Models.QnA, Server","Id":5,"Question":"Describe JS pattern !","Answer":"one, two, <h1>three</h1> ...","Order":2,"Maps":[]},{"$ref":"12"}]
      );
      $httpBackend.expectGET('http://thehalcyonsavant.com/breeze/Main/Tags?').respond(
        [{"$id":"1","$type":"Server.Models.Tag, Server","Id":1,"Name":"General","Order":null,"Maps":null},{"$id":"2","$type":"Server.Models.Tag, Server","Id":2,"Name":"My Introduction","Order":2,"Maps":null},{"$id":"3","$type":"Server.Models.Tag, Server","Id":3,"Name":"JavaScript","Order":3,"Maps":null}]
      );

      dataservice.getQATs().then(function (result){
        QnAs = result.QnAs;
        allTags = result.AllTags;
      });

      $httpBackend.flush();
    });

    afterEach(function (){
      if (isInitialized2) { return; }

      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();

      isInitialized2 = true;
    });

    it('fill QnAs', function (){
      expect(QnAs).toBeDefined();
      expect(QnAs.length).toBeGreaterThan(5);
    });

    it("fetch Questions", function (){
      expect(QnAs[2].Question).toBe('What is a clousure ?');
      expect(QnAs[3].Question).toBe('Bank advice ?');
    });

    it("fetch Answers", function (){
      _.each(_.range(0, 2), function (i){
        expect(QnAs[i].Answer).toBeDefined();
        expect(QnAs[i].Answer.length).toBeGreaterThan(5);
      });
    });

    it('fetch all Tags', function (){
      expect(allTags).toBeDefined();
      expect(allTags.length).toBeGreaterThan(0);

      var tag = allTags[1];
      expect(tag.Id).toBeDefined();
      expect(tag.Name).toBeDefined();
    });

    it("fetch mapped Tags for some QnAs", function (){
      expect(QnAs[1].Maps).toBeDefined();
      expect(QnAs[1].Maps.length).toBeGreaterThan(0);

      expect(QnAs[1].Maps[0].Tag).toBeDefined();
      expect(QnAs[1].Maps[0].Tag.Id).toBe(1);
      expect(QnAs[1].Maps[0].Tag.Name).toBe('General');

      expect(QnAs[3].Maps.length).toBeGreaterThan(1);
    });

  });

  describe("dataservice.repopulate():", function (){

    it("call repopulate API and return promise", function() {
      $httpBackend.resetExpectations();
      $httpBackend.expectGET('http://thehalcyonsavant.com/breeze/Main/Repopulate').respond(200);

      var promise = dataservice.repopulate();

      expect(typeof(promise.then)).toBe('function');
    });

  });

});