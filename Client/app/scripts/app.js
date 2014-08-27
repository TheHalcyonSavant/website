'use strict';

angular
  .module('clientApp', [
    'ngSanitize',
    'ngAnimate',
    'breeze.angular',
    'cgBusy',
    'ui.router',
    'ui.select2',
    'ngGrid',
    'angular-inview',
    // load separated ui.bootstrap modules, because of bug inside ui.bootstrap
    // for some reason the navbar dropdown links aren't responding always on click event
    'ui.bootstrap.tabs', 'template/tabs/tab.html', 'template/tabs/tabset.html',
    'ui.bootstrap.modal', 'template/modal/backdrop.html', 'template/modal/window.html',
    'ui.bootstrap.accordion', 'template/accordion/accordion-group.html', 'template/accordion/accordion.html'
  ]).run(function ($rootScope, $state, $stateParams, $log){

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$log = $log;

  }).config(function ($stateProvider, $urlRouterProvider){

    $urlRouterProvider
      .otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html'
      })
      .state('skill', {
        url: '/skill/:id',
        templateUrl: 'views/projects.html'
      })
      .state('qna', {
        url: '/qna',
        templateUrl: 'views/qna.html'
      });
    
  });
