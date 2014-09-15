'use strict';

angular.module('clientApp')
  .controller('EditQnACtrl', function ($scope, $mainScope, $modalInstance, dataservice, cancelChanges){
    $scope.isNew = _.isEmpty($mainScope.editedQnA);
    $scope.allTags = $mainScope.allTags;
    $scope.qna = dataservice[($scope.isNew ? 'create' : 'edit') + 'QnA']($mainScope.editedQnA);

		$scope.save = function (){
      if (this.qnaForm.$valid)
      {
        if ($scope.isNew)
        {
          $mainScope.QnAs.push($scope.qna);
        }
        else
        {
          var i = _.findIndex($mainScope.QnAs, { Id: $scope.qna.Id });
          $mainScope.QnAs[i] = $scope.qna;
        }
        $mainScope.qInit = dataservice.saveQnA(
          this.qnaForm.selectTags.$dirty ? $scope.qna : null
        );
        $modalInstance.close();
      }
    };

    $scope.cancel = function (){
      if (this.qnaForm.$pristine)
      {
        $scope.qna.entityAspect.setDetached();
        dataservice.rejectChanges();
        $modalInstance.dismiss('cancel');
        return;
      }

      cancelChanges($modalInstance, function beforeRejectChanges(){
        $scope.qna.entityAspect.setDetached();
      });
    };
    
  });