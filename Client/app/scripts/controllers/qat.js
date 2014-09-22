'use strict';

angular.module('clientApp')
  .controller('QATCtrl', function ($filter, $modal, $scope, QnARepo){

    $scope.qInit = QnARepo.initialize().then(function (result){
      $scope.QnAs = result.QnAs;
      $scope.clearFilters();
      $scope.pager.totalQnAs = result.QnAs.length;

      $scope.allTags = result.AllTags;
      $scope.allTags.push({});
    });

    $scope.clearFilters = function (){
      $scope.filterModel = $.extend({}, {
        Answer: '',
        Everything: '',
        NoTags: false,
        NotAnswered: false,
        Question: '',
        Tags: []
      });
    };

    $scope.pager = {
      currentPage: 1,
      pageSize: 6
    };

    $scope.filterQnA = function (){
      $scope.filteredQnAs = $filter('qat')($scope.QnAs, $scope.filterModel);
      if ($scope.filteredQnAs)
      {
        $scope.pager.totalQnAs = $scope.filteredQnAs.length;
        $scope.pager.noOfPages = $scope.filteredQnAs.length / $scope.pager.pageSize;
      }
    };

    $scope.$watch('filterModel', function (){
      $scope.pager.currentPage = 1;
      $scope.filterQnA();
    }, true);

    $scope.showTagsDlg = function (){
      $modal.open({
        backdrop: 'static',
        controller: 'EditTagsCtrl',
        keyboard: false,
        resolve: {
          $qatScope: function (){
            return $scope;
          }
        },
        templateUrl: 'modals/editTags.html',
        windowClass: 'editTagsDlg'
      });
    };

    $scope.showQnADlg = function (qna){
      $scope.editedQnA = qna;
      $modal.open({
        backdrop: 'static',
        controller: 'EditQnACtrl',
        keyboard: false,
        resolve: {
          $qatScope: function (){
            return $scope;
          }
        },
        templateUrl: 'modals/editQnA.html'
      });
    };

    $scope.deleteQnA = function (qna, $index){
      $modal.open({
        controller: 'SimpleDlgCtrl',
        resolve: {
          bodyText: function (){
            return 'Are you sure ?';
          }
        },
        templateUrl: 'modals/SimpleDlg.html'
      }).result.then(function (){
        $scope.QnAs.splice($index, 1);
        $scope.qInit = QnARepo.delete(qna);
      });
    };

  });