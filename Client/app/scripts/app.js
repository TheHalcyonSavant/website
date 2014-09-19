'use strict';

angular
  .module('clientApp', [
    'breeze.angular',
    'cgBusy',
    'ngSanitize',
    // load separated ui.bootstrap modules, because of bug inside ui.bootstrap
    // for some reason the navbar dropdown links aren't responding always on click event
    'ui.bootstrap.tabs', 'template/tabs/tab.html', 'template/tabs/tabset.html',
    'ui.bootstrap.modal', 'template/modal/backdrop.html', 'template/modal/window.html',
    'ui.bootstrap.accordion', 'template/accordion/accordion-group.html', 'template/accordion/accordion.html',
    'ui.bootstrap.pagination', 'template/pagination/pager.html', 'template/pagination/pagination.html',
    'ui.grid',
    'ui.grid.edit',
    'ui.router',
    'ui.select2'
  ]).run(function ($log, $rootScope, $state, $stateParams){

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$log = $log;

  }).config(function ($stateProvider, $urlRouterProvider){

    $urlRouterProvider
      .otherwise('/');

    $stateProvider
      .state('main', {
        controller: 'MainCtrl',
        templateUrl: 'views/main.html'
      })
      .state('main.home', {
        templateUrl: 'views/home.html',
        url: '/'
      })
      .state('main.skill', {
        controller: 'ProjectsCtrl',
        templateUrl: 'views/projects.html',
        url: '/skill/:id'
      })
      .state('main.qat', {
        controller: 'QATCtrl',
        templateUrl: 'views/qat.html',
        url: '/qat'
      });
    
  });
