'use strict';

describe('main.html:', function (){

  describe('navigation:', function (){

    // initialize skills only once for all specs
    // this is better than using additional patch like jasmine-before-all
    var isInitialized, isAdmin;

    beforeEach(function (){
      if (isInitialized) { return; }

      browser.get('http://localhost:9000/');

      isAdmin = true;
      isInitialized = true;
    });

    it('contains nav and home link', function (){
      expect($('nav').isPresent()).toBe(true);

      var aHome = element(by.linkText('Home'));
      expect(aHome.isDisplayed()).toBe(true);
      expect(aHome.getAttribute('ui-sref')).toBe('home');
      expect(aHome.getAttribute('class')).toMatch('active');
    });

    it('exist enough parent skills', function (){
      expect($$('li.parentSkill > a').count()).toBeGreaterThan(3);
    });

    it('exist parent skill "C#"" and is visible', function (){
      var a = element(by.linkText('C#'));

      expect(a.isPresent()).toBe(true);
      expect(a.isDisplayed()).toBe(true);
    });

    it('open dropdown when parent skill is clicked', function (){
      var a = element(by.linkText('C#'));

      a.click();

      a = element(by.linkText('C#'));
      expect(a.element(by.xpath('../ul')).isDisplayed()).toBe(true);
      expect(element(by.linkText('Home')).getAttribute('class')).not.toMatch('active');
      expect(a.element(by.xpath('parent::li')).getAttribute('class')).toMatch('active');
    });

    it('exist child skill "Lucene" and is hidden', function (){
      var a = element(by.cssContainingText('li.parentSkill li', 'Lucene'));

      expect(a.isPresent()).toBe(true);
      expect(a.isDisplayed()).toBe(false);
    });

    // now use Java instead of C# to test multiple links simultaneously
    it('remain open dropdown when child skill clicked', function (){
      // click parent link
      var aParentSkill = element(by.linkText('Java'));
      aParentSkill.click();

      // expect parent link to be open and active
      var clsParentSkill = aParentSkill.element(by.xpath('parent::li')).getAttribute('class');
      expect(clsParentSkill).toMatch('active');
      expect(clsParentSkill).toMatch('open');

      // click child link
      var aChildSkill = element(by.cssContainingText('li.childSkill', 'Colt'));
      expect(aChildSkill.isDisplayed()).toBe(true);
      aChildSkill.click();

      // expect parent link to be open, but not active
      clsParentSkill = aParentSkill.element(by.xpath('parent::li')).getAttribute('class');
      expect(clsParentSkill).toMatch('open');
      expect(clsParentSkill).not.toMatch('active');

      // expect child link to be visible and active
      aChildSkill = element(by.cssContainingText('li.childSkill', 'Colt'));
      expect(aChildSkill.isDisplayed()).toBe(true);
      expect(aChildSkill.getAttribute('class')).toMatch('active');  
    });

    it('exist Q & A link only for administrator', function (){
      expect(element(by.linkText('Q & A')).isDisplayed()).toBe(isAdmin);
    });

    describe('Repopulate Skills:', function (){

      it('exist link only for administrator', function (){
        expect(element(by.linkText('Repopulate Skills')).isDisplayed()).toBe(isAdmin);
      });

      it('open modal confirmation onclick', function (){
        element(by.linkText('Repopulate Skills')).click();

        expect($('.modal-backdrop').isDisplayed()).toBe(true);
        expect($('.modal-dialog').isDisplayed()).toBe(true);
        expect($('.modal-body').getText()).not.toBe('');

        $('.btn-warning').click();
      });

    });

  });

});