'use strict';

describe('Controller: MainCtrl', function (){

  var dataserviceMock,
    isInitialized,
    modalMock,
    scope;

  beforeEach(function (){
    if (isInitialized) { return; }

    // load the controller's module
    module('clientApp');

    // load the mocks module
    angular.mock.module('MainCtrlMocks');

    // Initialize the controller and a mock scope
    inject(function ($controller, $rootScope, _dataserviceMock_, _modalMock_){
      dataserviceMock = _dataserviceMock_;
      modalMock = _modalMock_;
      spyOn(dataserviceMock, 'initialize').and.callThrough();

      $controller('MainCtrl', {
        $scope: scope = $rootScope.$new(),
        dataservice: dataserviceMock,
        $modal: modalMock
      });
      scope.$stateParams = { id: 2 };
      scope.$digest();
    });

    isInitialized = true;
  });

  it('exist non-empty scope.skills', function (){
    expect(dataserviceMock.initialize).toHaveBeenCalled();
    expect(scope.skills).toBe(dataserviceMock.allSkills);
    expect(scope.skills.length).toBeGreaterThan(0);
  });

  it('not define scope.skill when $stateParams is empty', function (){
    var scope2;
    module('clientApp');

    inject(function ($controller, $rootScope){
      spyOn(dataserviceMock, 'getSkill').and.callThrough();
      $controller('MainCtrl', {
        $scope: scope2 = $rootScope.$new(),
        dataservice: dataserviceMock
      });
      scope2.$stateParams = { };
      scope2.$digest();
    });

    expect(dataserviceMock.getSkill).not.toHaveBeenCalled();
    expect(scope2.skill).toBeUndefined();
  });

  describe('scope.attachSkill():', function (){

    it('not raise exception when scope.skills are undefined', function (){
      var backup = scope.skills;
      scope.skills = scope.skill = undefined;

      expect(function (){
        scope.attachSkill();
      }).not.toThrow();

      scope.skills = backup;
    });

    it('exist scope.skill when scope.skills are filled', function (){
      scope.skills = dataserviceMock.allSkills;
      spyOn(dataserviceMock, 'getSkill').and.callThrough();
      spyOn(scope, 'setReadme');

      scope.attachSkill();

      expect(dataserviceMock.getSkill).toHaveBeenCalledWith(2);
      expect(scope.skill).toBe(dataserviceMock.allSkills[0]);
      expect(scope.setReadme).toHaveBeenCalled();
    });

  });

  describe('scope.getParentHeader():', function (){

    it('return empty string when skill is falsy', function (){
      scope.skill = null;

      expect(scope.getParentHeader()).toBe('');
    });

    describe('return readable string of parent\'s headers:', function (){

      it('C# (as parent)', function (){
        scope.skill = dataserviceMock.allSkills[0];
        expect(scope.getParentHeader()).toBe('C#:');
      });

      it('WinForms (as child)', function (){
        scope.skill = dataserviceMock.allSkills[0].SubSkills[1];
        expect(scope.getParentHeader()).toBe('C#:');
      });

      it('SQL Server (as empty parent)', function (){
        scope.skill = dataserviceMock.allSkills[1];
        expect(scope.getParentHeader()).toBe('SQL Server');
      });

    });

  });

  describe('scope.getChildrenHeader():', function (){

    it('return empty string when skill is falsy', function (){
      scope.skill = null;

      expect(scope.getChildrenHeader()).toBe('');
    });

    describe('return readable string of children\'s headers:', function (){

      it('C# (as parent)', function (){
        scope.skill = dataserviceMock.allSkills[0];
        expect(scope.getChildrenHeader())
          .toBe('PackedDotNet, WinForms, LINQ');
      });

      it('WinForms (as child)', function (){
        scope.skill = dataserviceMock.allSkills[0].SubSkills[1];
        expect(scope.getChildrenHeader()).toBe('WinForms');
      });

      it('SQL Server (as empty parent)', function (){
        scope.skill = dataserviceMock.allSkills[1];
        expect(scope.getChildrenHeader()).toBe('');
      });

    });

  });

  describe('scope.setReadme():', function (){

    it('create scope.readme from dataservice', function (){
      scope.readme = '';
      
      scope.setReadme(dataserviceMock.allSkills[0].Maps[0].Project);
      scope.$digest();

      expect(scope.readme).toBe('<h>Test Project README</h>');
    });

    /*it("refuse changing scope.readme on sequential same call", function (){
      
    });*/

  });


  describe('scope.isAdmin():', function (){

    it('return dataservice.IsAdministrator', function (){
      var isAdmin = scope.isAdmin();

      expect(isAdmin).toBe(dataserviceMock.IsAdministrator);
    });

  });

  describe('scope.initQnAs():', function (){
    
    it('attch QnAs to scope', function (){
      scope.QnAs = undefined;
      scope.allTags = undefined;

      scope.initQATs();
      scope.$digest();

      expect(scope.QnAs).toBeDefined();

      expect(scope.allTags).toBeDefined();
      expect(scope.allTags.length).toBeGreaterThan(0);

      expect(_.last(scope.allTags)).toEqual({});
    });

  });

  describe('scope.filterQAT():', function (){

    var IsInitialized2, QnAs;

    beforeEach(function (){
      if (IsInitialized2)  { return; }

      dataserviceMock.getQATs().then(function (result){
        QnAs = result.QnAs;
      });
      scope.$digest();

      IsInitialized2 = true;
    });
    
    it('return true when Question, Answer and Tags are empty', function (){
      scope.clearFilters();
      
      var result = scope.filterQAT(QnAs[0]);

      expect(result).toBe(true);
    });

    it('return true when only Question is contained', function (){
      scope.clearFilters();
      scope.filterModel.Question = 'question';
      
      var result = scope.filterQAT(QnAs[0]);

      expect(result).toBe(true);
    });

    it('return true when only Answer is contained', function (){
      scope.clearFilters();
      scope.filterModel.Answer = 'ring';
      
      var result = scope.filterQAT(QnAs[0]);

      expect(result).toBe(true);
    });

    it('return true when only Tags are present', function (){
      scope.clearFilters();
      scope.filterModel.Tags = ['1', '2'];
      
      var result = scope.filterQAT(QnAs[0]);

      expect(result).toBe(true);
    });

    it('return false when qna has tags and NoTags = true', function (){
      scope.clearFilters();
      scope.filterModel.NoTags = true;

      var result = scope.filterQAT(QnAs[0]);

      expect(result).toBe(false);
    });

    it('return true when qna has no tags and NoTags = true', function (){
      scope.clearFilters();
      scope.filterModel.NoTags = true;

      var result = scope.filterQAT(QnAs[2]);

      expect(result).toBe(true);
    });

    it('return false when qna has answer and NotAnswered = true', function (){
      scope.clearFilters();
      scope.filterModel.NotAnswered = true;

      var result = scope.filterQAT(QnAs[0]);

      expect(result).toBe(false);
    });

    it('return true when qna has no answer and NotAnswered = true', function (){
      scope.clearFilters();
      scope.filterModel.NotAnswered = true;

      var result = scope.filterQAT(QnAs[2]);

      expect(result).toBe(true);
    });

  });

  describe('scope.showRepopulateConfirmationDlg():', function (){

    it('display modal dialog then call dataservice.repopulate', function (){
      spyOn(modalMock, 'open').and.callThrough();
      spyOn(dataserviceMock, 'repopulate').and.callThrough();

      scope.showRepopulateConfirmationDlg();
      scope.$digest();

      expect(modalMock.open).toHaveBeenCalled();
      expect(dataserviceMock.repopulate).toHaveBeenCalled();
    });

  });

});
