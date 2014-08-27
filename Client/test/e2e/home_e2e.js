'use strict';

describe('home.html:', function (){

  var isInitialized,
    getLink = function (linkTxt){
      return $('main').element(by.linkText(linkTxt));
    },
    getLinkHref = function (linkTxt){
      return $('main').element(by.linkText(linkTxt)).getAttribute('href');
    };

  beforeEach(function (){
    if (isInitialized) { return; }

    browser.get('http://localhost:9000/');

    isInitialized = true;
  });

  it('default to home state onload', function (){
    expect(browser.driver.getCurrentUrl()).toBe('http://localhost:9000/#/');
  });

  it('change state when visit "Home"', function (){
    browser.get('http://localhost:9000/#/s?1');
    
    browser.waitForAngular();
    element(by.linkText('Home')).click();

    expect(browser.driver.getCurrentUrl()).toBe('http://localhost:9000/#/');
  });

  it('not have selfpoint absolute links', function (){
    $$('a[href^=http]').each(function (link){
      expect(link.getAttribute('target')).toBe('_blank');
    });
  });

  it('exist link to the GitHub account', function (){
    expect(getLinkHref('GitHub account')).toMatch(/github.com/);
    expect(getLink('GitHub account').getAttribute('target')).toBe('_blank');
  });

  it('exist link to the CV pdf', function (){
    expect(getLinkHref('CV')).toMatch(/cv_.*\.pdf/);
  });

  it('exist link for sending an E-Mail', function (){
    expect(getLinkHref('TheHalcyonSavant@gmail.com')).toMatch(/^mailto\:/);
  });

});