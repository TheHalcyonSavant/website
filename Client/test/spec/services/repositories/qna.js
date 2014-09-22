'use strict';

describe('Service (Repository): QnARepo', function (){
  var $httpBackend,
    AllTags,
    isInitialized,
    QnARepo,
    QnAs;

  beforeEach(function (){
    if (isInitialized) { return; }

    // load the service's module
    module('clientApp', function ($provide){
      $provide.value('$state', function(){ return {}; });
      $provide.value('$urlRouter', function(){ return {}; });
    });

    inject(function (_$httpBackend_, _QnARepo_){
      $httpBackend = _$httpBackend_;
      QnARepo = _QnARepo_;
    });

    $httpBackend.resetExpectations();
    $httpBackend.expectGET('http://thehalcyonsavant.com/breeze/Main/QnA?').respond(
      [{"$id":"1","$type":"Server.Models.QnA, Server","Id":1,"Question":"Test Question 1 ?","Answer":"Test Answer 1.","Order":null,"Maps":[{"$id":"2","$type":"Server.Models.MapQAT, Server","Id":1,"QnAId":1,"QnA":{"$ref":"1"},"TagId":1,"Tag":{"$id":"3","$type":"Server.Models.Tag, Server","Id":1,"Name":"General","Order":null,"Maps":[{"$ref":"2"},{"$id":"4","$type":"Server.Models.MapQAT, Server","Id":2,"QnAId":2,"QnA":{"$id":"5","$type":"Server.Models.QnA, Server","Id":2,"Question":"Test Question 2 ?","Answer":"Test Answer 2.","Order":null,"Maps":[{"$ref":"4"}]},"TagId":1,"Tag":{"$ref":"3"}},{"$id":"6","$type":"Server.Models.MapQAT, Server","Id":3,"QnAId":4,"QnA":{"$id":"7","$type":"Server.Models.QnA, Server","Id":4,"Question":"Empty Question ?","Answer":null,"Order":null,"Maps":[{"$ref":"6"},{"$id":"8","$type":"Server.Models.MapQAT, Server","Id":5,"QnAId":4,"QnA":{"$ref":"7"},"TagId":2,"Tag":{"$id":"9","$type":"Server.Models.Tag, Server","Id":2,"Name":"My Introduction","Order":2,"Maps":[{"$id":"10","$type":"Server.Models.MapQAT, Server","Id":4,"QnAId":1,"QnA":{"$ref":"1"},"TagId":2,"Tag":{"$ref":"9"}},{"$ref":"8"}]}}]},"TagId":1,"Tag":{"$ref":"3"}}]}},{"$ref":"10"}]},{"$ref":"5"},{"$id":"11","$type":"Server.Models.QnA, Server","Id":3,"Question":"Test Question 3 ?","Answer":"Test Answer 3.","Order":4,"Maps":[{"$id":"12","$type":"Server.Models.MapQAT, Server","Id":6,"QnAId":3,"QnA":{"$ref":"11"},"TagId":3,"Tag":{"$id":"13","$type":"Server.Models.Tag, Server","Id":3,"Name":"JavaScript","Order":3,"Maps":[{"$ref":"12"},{"$id":"14","$type":"Server.Models.MapQAT, Server","Id":7,"QnAId":5,"QnA":{"$id":"15","$type":"Server.Models.QnA, Server","Id":5,"Question":"Another question !","Answer":"one, two, <h1>three</h1> ...","Order":2,"Maps":[{"$ref":"14"}]},"TagId":3,"Tag":{"$ref":"13"}}]}}]},{"$ref":"7"},{"$ref":"15"}]
    );
    $httpBackend.expectGET('http://thehalcyonsavant.com/breeze/Main/Tags?').respond(
      [{"$id":"1","$type":"Server.Models.Tag, Server","Id":1,"Name":"General","Order":null,"Maps":null},{"$id":"2","$type":"Server.Models.Tag, Server","Id":2,"Name":"My Introduction","Order":2,"Maps":null},{"$id":"3","$type":"Server.Models.Tag, Server","Id":3,"Name":"JavaScript","Order":3,"Maps":null}]
    );

    QnARepo.initialize().catch(function (error){
      console.error(error);
    }).then(function (result){
      QnAs = result.QnAs;
      AllTags = result.AllTags;
    });

    $httpBackend.flush();
  });

  afterEach(function (){
    if (isInitialized) { return; }

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();

    isInitialized = true;
  });

  it('fetch QnAs', function (){
    expect(QnAs).toBeDefined();
    expect(QnAs.length).toBeGreaterThan(3);
  });

  it('fill Questions', function (){
    _.each(_.range(0, 2), function (i){
      expect(QnAs[i].Question).toBe('Test Question ' + (i + 1) + ' ?');
    });
  });

  it('fill Answers', function (){
    _.each(_.range(0, 2), function (i){
      expect(QnAs[i].Answer).toBe('Test Answer ' + (i + 1) + '.');
    });
  });

  it('fetch all Tags', function (){
    expect(AllTags).toBeDefined();
    expect(AllTags.length).toBeGreaterThan(0);

    var tag = AllTags[1];
    expect(tag.Id).toBeDefined();
    expect(tag.Name).toBeDefined();
  });

  it('fill mapped Tags for QnAs', function (){
    expect(QnAs[1].Maps).toBeDefined();
    expect(QnAs[1].Maps.length).toBeGreaterThan(0);

    expect(QnAs[1].Maps[0].Tag).toBeDefined();
    expect(QnAs[1].Maps[0].Tag.Id).toBe(1);
    expect(QnAs[1].Maps[0].Tag.Name).toBe('General');

    expect(QnAs[3].Maps.length).toBeGreaterThan(1);
  });

  it('fill TagIds for QnAs', function (){
    expect(QnAs[1].TagIds).toBeDefined();
    expect(QnAs[1].TagIds).toEqual([1]);

    expect(QnAs[3].TagIds).toBeDefined();
    expect(QnAs[3].TagIds).toEqual([1,2]);
  });
  
});