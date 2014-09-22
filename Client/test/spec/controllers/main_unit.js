'use strict';

describe('Controller: MainCtrl', function (){

  var DataMock,
    isInitialized,
    modalMock,
    scope,
    SkillsRepoMock;

  beforeEach(function (){
    if (isInitialized) { return; }

    // load the controller's module
    module('clientApp');

    // load the mock modules
    module('DataMock');
    angular.mock.module('modalMock');
    angular.mock.module('SkillsRepoMock');

    // Initialize the controller and a mock scope
    inject(function ($controller, $rootScope, _Data_, _modalMock_, _SkillsRepoMock_){
      DataMock = _Data_;
      modalMock = _modalMock_
      SkillsRepoMock = _SkillsRepoMock_;

      spyOn(modalMock, 'open').and.callThrough();

      $controller('MainCtrl', {
        $modal: modalMock,
        $scope: scope = $rootScope.$new(),
        SkillsRepo: SkillsRepoMock
      });
      scope.$digest();
    });

    isInitialized = true;
  });

  it('check for privileges on startup', function (){
    expect(scope.isAdmin).toBe(1);
  });

  it('initialize non-empty scope.skills on startup', function (){
    expect(scope.skills).toBe(SkillsRepoMock.allParentSkills);
    expect(scope.skills.length).toBeGreaterThan(0);
  });

  it('display modal dialog when showRepopulateConfirmationDlg is called', function (){
    DataMock.repopulateIsCalled = false;

    scope.showRepopulateConfirmationDlg();
    scope.$digest();

    expect(DataMock.repopulateIsCalled).toBe(true);
  });

});
