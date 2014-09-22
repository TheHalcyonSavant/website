'use strict';

describe('Controller: QATCtrl', function (){

  var isInitialized,
    modalMock,
    QnARepoMock,
    scope;

  beforeEach(function (){
    if (isInitialized) { return; }

    // load the controller's module
    module('clientApp');

    // load the mock modules
    angular.mock.module('modalMock');
    angular.mock.module('QnARepoMock');

    // Initialize the controller and a mock scope
    inject(function ($controller, _modalMock_, $rootScope, _QnARepoMock_){
      modalMock = _modalMock_;
      scope = $rootScope.$new();
      QnARepoMock = _QnARepoMock_;

      spyOn(QnARepoMock, 'initialize').and.callThrough();

      $controller('QATCtrl', {
        $modal: modalMock,
        $scope: scope,
        QnARepo: QnARepoMock
      });

      spyOn(scope, 'clearFilters').and.callThrough();

      scope.$digest();
    });

    isInitialized = true;
  });

  it('attch Questions, Answers and Tags to scope', function (){

    expect(QnARepoMock.initialize).toHaveBeenCalled();
    expect(scope.QnAs).toBeDefined();
    expect(scope.clearFilters).toHaveBeenCalled();
    expect(scope.allTags).toBeDefined();
    expect(scope.allTags.length).toBeGreaterThan(0);
    expect(_.last(scope.allTags)).toEqual({});
  });

  it('clear reset filterModel when clearFilters is called', function (){
    scope.filterModel = {
      Answer: 'Answer',
      Everything: 'Everything',
      NoTags: true,
      NotAnswered: true,
      Question: 'Question',
      Tags: [1, 2]
    };

    scope.clearFilters();

    expect(scope.filterModel).toEqual({
      Answer: '',
      Everything: '',
      NoTags: false,
      NotAnswered: false,
      Question: '',
      Tags: []
    });
  });

  it('fill filteredQnAs and adjust pager when filterQnA is called', function (){
    scope.filteredQnAs = [];
    scope.pager = {
      pageSize: 6
    };

    scope.filterQnA();

    expect(scope.filteredQnAs.length).toBeGreaterThan(0);
    expect(scope.pager.totalQnAs).toBeGreaterThan(0);
    expect(scope.pager.totalQnAs).toBe(scope.filteredQnAs.length);
    expect(scope.pager.noOfPages).toBeGreaterThan(0);
    expect(scope.pager.noOfPages).toBe(
      scope.filteredQnAs.length / scope.pager.pageSize
    );
  });

  // ...

});