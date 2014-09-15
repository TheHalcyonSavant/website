'use strict';

angular.module('clientApp')
  .directive('thsAutofocus', function ($timeout){
    return {
      restrict: 'A',
      scope: {
        // condition on when to autofocus
        thsAutofocus: '&'
      },
      link: function (scope, $elem){
        if (scope.thsAutofocus(scope) === false)
        {
          return;
        }
        
        $timeout(function (){
          $elem.focus();
        },500);
      }
    };
  });