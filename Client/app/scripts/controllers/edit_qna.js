'use strict';

angular.module('clientApp')
  .controller('EditQnACtrl', function ($modalInstance, $qatScope, $scope, cancelChanges, QnARepo){
    $scope.isNew = _.isEmpty($qatScope.editedQnA);
    $scope.allTags = $qatScope.allTags;
    $scope.qna = QnARepo[($scope.isNew ? 'create' : 'edit')]($qatScope.editedQnA);

		$scope.save = function (){
      if (!this.qnaForm.$valid)
      {
        return;
      }
      
      if ($scope.isNew)
      {
        $qatScope.QnAs.push($scope.qna);
      }
      else
      {
        var i = _.findIndex($qatScope.QnAs, { Id: $scope.qna.Id });
        $qatScope.QnAs[i] = $scope.qna;
      }
      $qatScope.filterQnA();
      $qatScope.qInit = QnARepo.save(this.qnaForm.selectTags.$dirty);
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