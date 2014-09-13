'use strict';

angular.module('clientApp')
  .directive('thsAutofocus', function ($timeout){
    return {
      restrict: 'A',
      link: function (scope, iElement){
        $timeout(function (){
          console.log(iElement);
          $(iElement).focus();
        },500);
      }
    };
  });