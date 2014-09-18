'use strict';

angular.module('clientApp')
  .controller('EditQnACtrl', function ($scope, $mainScope, $modalInstance, QnARepo, cancelChanges){
    $scope.isNew = _.isEmpty($mainScope.editedQnA);
    $scope.allTags = $mainScope.allTags;
    $scope.qna = QnARepo[($scope.isNew ? 'create' : 'edit')]($mainScope.editedQnA);

		$scope.save = function (){
      if (!this.qnaForm.$valid)
      {
        return;
      }
      
      if ($scope.isNew)
      {
        $mainScope.QnAs.push($scope.qna);
      }
      else
      {
        var i = _.findIndex($mainScope.QnAs, { Id: $scope.qna.Id });
        $mainScope.QnAs[i] = $scope.qna;
      }
      $mainScope.filterQnA();
      $mainScope.qInit = QnARepo.save(this.qnaForm.selectTags.$dirty);
      $modalInstance.close();
    };

    $scope.cancel = function (){
      if (this.qnaForm.$pristine)
      {
        QnARepo.cancel();
        $modalInstance.dismiss('cancel');
        return;
      }

      cancelChanges($modalInstance, function beforeRejectChanges(){
        QnARepo.cancel();
      });
    };
    
  });