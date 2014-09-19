'use strict';

angular.module('clientApp')
  .controller('SimpleDlgCtrl', function ($scope, $modalInstance, bodyText){
    $scope.bodyText = bodyText;

    $scope.yes = function (){
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });