'use strict';

describe('Controller: ProjectsCtrl', function (){

  var isInitialized,
    SkillsRepoMock,
    scope;

  beforeEach(function (){
    // load the controller's module
    module('clientApp');

    // load the mock modules
    angular.mock.module('SkillsRepoMock');

    // Initialize the controller and a mock scope
    inject(function ($controller, $rootScope, _SkillsRepoMock_){
      SkillsRepoMock = _SkillsRepoMock_;
      spyOn(SkillsRepoMock, 'getSkill').and.callThrough();

      $controller('ProjectsCtrl', {
        $scope: scope = $rootScope.$new(),
        SkillsRepo: SkillsRepoMock
      });
      scope.$stateParams = { id: 2 };
    });
  });

  it('not define scope.skill when SkillsRepo.allParentSkills is empty', function (){
    scope.skill = undefined;
    SkillsRepoMock.allParentSkills = [];

    scope.$digest();

    expect(SkillsRepoMock.getSkill).not.toHaveBeenCalled();
    expect(scope.skill).toBeUndefined();
  });

  /*it('not raise exception when scope.skills are undefined', function (){
    var backup = scope.skills;
    scope.skills = scope.skill = undefined;

    expect(function (){
      scope.attachSkill();
    }).not.toThrow();

    scope.skills = backup;
  });*/

  it('exist scope.skill when SkillsRepo.allParentSkills is filled', function (){
    spyOn(scope, 'setReadme');

    scope.$digest();

    expect(SkillsRepoMock.getSkill).toHaveBeenCalledWith(2);
    expect(scope.skill).toBe(SkillsRepoMock.allParentSkills[0]);
    expect(scope.setReadme).toHaveBeenCalled();
  });

  describe('scope.getChildrenHeader():', function (){

    it('return empty string when skill is falsy', function (){
      scope.skill = null;

      expect(scope.getChildrenHeader()).toBe('');
    });

    describe('return readable string of children\'s headers:', function (){

      it('C# (as parent)', function (){
        scope.skill = SkillsRepoMock.allParentSkills[0];
        expect(scope.getChildrenHeader()).toBe('PackedDotNet, WinForms, LINQ');
      });

      it('WinForms (as child)', function (){
        scope.skill = SkillsRepoMock.allParentSkills[0].SubSkills[1];
        expect(scope.getChildrenHeader()).toBe('WinForms');
      });

      it('SQL Server (as empty parent)', function (){
        scope.skill = SkillsRepoMock.allParentSkills[1];
        expect(scope.getChildrenHeader()).toBe('');
      });

    });

  });

  describe('scope.getParentHeader():', function (){

    it('return empty string when skill is falsy', function (){
      scope.skill = null;

      expect(scope.getParentHeader()).toBe('');
    });

    describe('return readable string from parent\'s headers:', function (){

      it('C# (as parent)', function (){
        scope.skill = SkillsRepoMock.allParentSkills[0];
        expect(scope.getParentHeader()).toBe('C#:');
      });

      it('WinForms (as child)', function (){
        scope.skill = SkillsRepoMock.allParentSkills[0].SubSkills[1];
        expect(scope.getParentHeader()).toBe('C#:');
      });

      it('SQL Server (as empty parent)', function (){
        scope.skill = SkillsRepoMock.allParentSkills[1];
        expect(scope.getParentHeader()).toBe('SQL Server');
      });

    });

  });

  describe('scope.setReadme():', function (){

    it('create scope.readme from SkillsRepo', function (){
      scope.readme = '';
      spyOn(SkillsRepoMock, 'getReadme').and.callThrough();
      
      scope.setReadme(SkillsRepoMock.allParentSkills[0].Maps[0].Project);
      scope.$digest();

      expect(scope.readme).toBe('<h>Test Project README</h>');
    });

    // this spec should be placed inside data_unit.js
    /*it("refuse changing scope.readme on sequential same call", function (){
      
    });*/

  });

});