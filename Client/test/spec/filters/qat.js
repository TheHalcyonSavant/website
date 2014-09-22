'use strict';

describe('Filter: qat', function (){

  var isInitialized,
    model,
    qatFilter,
    QnAs;

  beforeEach(function (){
    model = {
      Answer: '',
      Everything: '',
      NoTags: false,
      NotAnswered: false,
      Question: '',
      Tags: []
    };

    if (isInitialized) { return; }

    module('clientApp');
    angular.mock.module('QnARepoMock');

    inject(function ($filter, $rootScope, QnARepoMock){
      QnARepoMock.initialize().then(function (result){
        QnAs = result.QnAs;
      });
      $rootScope.$new().$digest();
      qatFilter = $filter('qat');
    });

    isInitialized = true;
  });

  describe('Everything filter:', function (){

    it('return 1 Q&A when Everything = "some"', function (){
      model.Everything = 'some';

      var result = qatFilter(QnAs, model);

      expect(result.length).toBe(1);
      expect(result).toEqual( [ QnAs[2] ] );
    });

    it('return 2 Q&As when Everything = "answer"', function (){
      model.Everything = 'answer';

      var result = qatFilter(QnAs, model);

      expect(result.length).toBe(2);
      expect(result).toEqual( [ QnAs[0], QnAs[1] ] );
    });

    it('return 2 Q&As when Everything = "general"', function (){
      model.Everything = 'general';

      var result = qatFilter(QnAs, model);

      expect(result.length).toBe(2);
      expect(result).toEqual( [ QnAs[0], QnAs[1] ] );
    });

    it('return empty array when Everything = "non existant"', function (){
      model.Everything = 'non existant';

      var result = qatFilter(QnAs, model);

      expect(result.length).toBe(0);
    });

  });

  it('return all Q&As when the entire model filter is empty', function (){
    var result = qatFilter(QnAs, model);

    expect(result.length).toBe(3);
    expect(result).toEqual(QnAs);
  });

  it('return all Q&As when only case-insensitive Question is contained', function (){
    model.Question = 'question';
    
    var result = qatFilter(QnAs, model);

    expect(result.length).toBe(3);
    expect(result).toEqual(QnAs);
  });

  it('return 2 Q&As when only Answer is contained', function (){
    model.Answer = 'answer';
    
    var result = qatFilter(QnAs, model);

    expect(result.length).toBe(2);
    expect(result).toEqual( [ QnAs[0], QnAs[1] ] );
  });

  it('return 1 Q&A when only Tags with id 1 and 2 are present', function (){
    model.Tags = ['1', '2'];
    
    var result = qatFilter(QnAs, model);

    expect(result.length).toBe(1);
    expect(result).toEqual( [ QnAs[0] ] );
  });

  it('return 1 Q&A when only NoTags = true', function (){
    model.NoTags = true;

    var result = qatFilter(QnAs, model);

    expect(result.length).toBe(1);
    expect(result).toEqual( [ QnAs[2] ] );
  });

  it('return 1 Q&A when only NotAnswered = true', function (){
    model.NotAnswered = true;

    var result = qatFilter(QnAs, model);

    expect(result.length).toBe(1);
    expect(result).toEqual( [ QnAs[2] ] );
  });

});