'use strict';

describe('projects.html:', function (){

  var prepare = function (path){
    var isInitialized;

    beforeEach(function (){
      if (isInitialized) { return; }

      browser.get('http://localhost:9000/#/' + path);

      isInitialized = true;
    });
  };

  var expectProjectsMoreThan = function (gtCount){

    it('exist correct projects', function (){
      var projects = element.all(by.repeater('m in skill.Maps'));
      expect(projects.count()).toBeGreaterThan(gtCount);
    });

    it('fill project name and description', function (){
      $$('.projectName,.projectDescription').each(function (el){
        expect(el.getText()).not.toBe('');
      });
    });

    it('contain links to GitHub for every project', function (){
      var links = element.all(by.linkText('See on GitHub'));
      expect(links.count()).toBeGreaterThan(gtCount);
      links.each(function (el){
        expect(el.getAttribute('href')).toMatch(
          /^https\:\/\/github\.com\/TheHalcyonSavant\/\w+/
        );
      });
    });

    it('display README of the first project', function (){
      expect(element(by.binding('readme')).getText()).not.toBe('');
    });

  };

  var expectReadmeLinks = function (){
    function getLinks (){
      return element(by.binding('readme')).all(by.tagName('a'));
    }

    it('not exist relative links in README', function (){
      getLinks().each(function (link){
        expect(link.getAttribute('href')).toMatch(/^(https?\:)?\/\//);
      });
    });

    it('have target = _open for all links in README', function (){
      getLinks().each(function (link){
        expect(link.getAttribute('target')).toBe('_blank');
      });
    });
  };

  describe('test projects from parent skill "C#":', function (){

    prepare('skill/3');

    it('exist correct header', function (){
      var header = $('main h2.skillHeader').getText();
      expect(header).toMatch(/^C#\: /);
      expect(header).toMatch(/PacketDotNet/);
      expect(header).toMatch(/HtmlAgilityPack/);
      expect(header).toMatch(/WinForms/);
      expect(header).toMatch(/WPF/);
    });

    expectProjectsMoreThan(2);

    it('change README section when different project is chosen', function (){
      var oldReadme = element(by.binding('readme')).getText();

      element.all(by.repeater('m in skill.Maps')).get(2).click();

      var newReadme = element(by.binding('readme')).getText();
      expect(newReadme).not.toBe('');
      expect(newReadme).not.toBe(oldReadme);
    });

    expectReadmeLinks();

  });

  describe('test projects from single parent skill "SQL Server":', function (){

    prepare('skill/16');

    it('exist correct header', function (){
      expect($('main h2.skillHeader').getText())
        .toBe('SQL Server');
    });

    expectProjectsMoreThan(0);

    expectReadmeLinks();

  });

  describe('test projects from child skill "Lucene":', function (){

    prepare('skill/13');

    it('exist correct header', function (){
      expect($('main h2.skillHeader').getText())
        .toBe('Java: Lucene');
    });

    expectProjectsMoreThan(0);

    expectReadmeLinks();

  });

});