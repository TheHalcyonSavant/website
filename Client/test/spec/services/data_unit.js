'use strict';

describe('Service: Data', function (){

  var $httpBackend,
    Data,
    isInitialized;

  beforeEach(function (){
    if (isInitialized) { return; }

    // load the service's module
    module('clientApp', function ($provide){
      $provide.value('$state', function(){ return {}; });
      $provide.value('$urlRouter', function(){ return {}; });
    });

    inject(function (_$httpBackend_, _Data_){
      $httpBackend = _$httpBackend_;
      Data = _Data_;
    });

  });

  it('return 1 for administrator when checkIsAdministrator is called', function (){
    var isAdmin;
    $httpBackend.resetExpectations();
    $httpBackend.expectGET('http://thehalcyonsavant.com/breeze/Main/IsAdministrator').respond('1');

    Data.checkIsAdministrator().then(function (result){
      isAdmin = result;
    });
    $httpBackend.flush();

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    expect(isAdmin).toBe(1);
  });

  it('fetch jQuery html when getGitHubHTML is called', function (){
    var jqHTML;
    Data.clearCache();
    $httpBackend.resetExpectations();
    $httpBackend.expectGET('https://api.github.com/repos/TheHalcyonSavant/VocabularyGame/readme').respond(
      '<h2>VocabularyGame - Better your elocution</h2>'
    );

    Data.getGitHubHTML('VocabularyGame/readme').then(function (result){
      jqHTML = result;
    });
    $httpBackend.flush();

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    expect(jqHTML).toBeDefined();
    expect(jqHTML.length).toBe(1);
    expect(jqHTML.jquery.length).toBeGreaterThan(1);
  });

  it("call Recreate API and return promise when repopulate is called", function() {
    $httpBackend.resetExpectations();
    $httpBackend.expectGET('http://thehalcyonsavant.com/breeze/Main/Repopulate').respond(200);

    var promise = Data.repopulate();

    expect(typeof(promise.then)).toBe('function');
  });

});