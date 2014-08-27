'use strict';

describe('QnAs.html:', function (){

  var isInitialized;

  beforeEach(function (){
    if (isInitialized) { return; }

    browser.get('http://localhost:9000/#/qna');

    isInitialized = true;
  });

  function expectCleanFilters (){
    expect($$('.tagFilter li.select2-search-choice').count()).toBe(0);

    var tagFilter = element(by.model('filterModel.Tags'));
    expect(tagFilter.getAttribute('value')).toBe('');

    var qFilter = element(by.model('filterModel.Question'));
    expect(qFilter.getAttribute('value')).toBe('');

    var aFilter = element(by.model('filterModel.Answer'));
    expect(aFilter.getAttribute('value')).toBe('');
  }

  it('have clean filters on start', function (){
    expectCleanFilters();
  });

  it('exist enough questions and answers', function (){
    var qnas = element.all(by.repeater('qna in QnAs'));
    expect(qnas.count()).toBeGreaterThan(5);
  });

  it('not exist empty question', function (){
    $$('.question').each(function (question){
      expect(question.getText()).not.toBe('');
    });
  });

  it('exist enough tags in a question', function (){
    var tagsUL = $$('accordion ul.select2-choices');
    var tags = tagsUL.get(4).$$('li.select2-search-choice');
    expect(tags.count()).toBe(2);

    tags.then(function (tag){
      expect(tag[0].getText()).toBe('Introduction');
      expect(tag[1].getText()).toBe('General');
    });
  });

  it('contain tag options in tag`s filter', function (){
    var tagFilter = element(by.model('filterModel.Tags'));
    expect(tagFilter.$$('option').count()).toBeGreaterThan(3);
  });

  it('filter by tag', function (){
    element(by.model('filterModel.Tags')).sendKeys(
      'JavaScript', protractor.Key.ENTER
    );
    element(by.model('filterModel.Question')).sendKeys('');
    element(by.model('filterModel.Answer')).sendKeys('');

    var qnas = element.all(by.repeater('qna in QnAs'));

    expect(qnas.count()).toBeGreaterThan(0);
  });

  it('filter by question', function (){

  });

  it('filter by answer', function (){
    
  });

  it('filter by tag and question', function (){
    
  });

  it('fitler by tag and answer', function (){
    
  });

  it('filter by question and answer', function (){
    
  });

  it('filter by tag, question and answer', function (){

  });

  it('clear all filters when "Clear filters" is pressed', function (){
    $('#btnClearFilters').click();

    expectCleanFilters();
  });

});