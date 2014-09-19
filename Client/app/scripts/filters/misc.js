'use strict';

angular.module('clientApp')
  .filter('IdCell', function (){
    return function (input){
      return input < 1 ? 'new' : input;
    };
  });