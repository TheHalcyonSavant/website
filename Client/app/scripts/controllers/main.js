'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $modal, $filter, dataservice, QnARepo){

    $scope.qInit = dataservice.initialize().then(function (parentSkills){
      $scope.skills = parentSkills;

      if ($scope.$stateParams.id)
      {
        $scope.attachSkill();
      }

      return $scope.skills;
    });

    $scope.attachSkill = function (){
      if (!$scope.skills) { return; }

      $scope.skill = dataservice.getSkill($scope.$stateParams.id);
      $scope.setReadme($scope.skill.Maps[0].Project);
    };

    $scope.getParentHeader = function (){
      var parent = $scope.skill;

      if (!parent) { return ''; }

      if (!!parent.ParentSkill) { parent = parent.ParentSkill; }

      var header = parent.Name;

      if (!!parent.SubSkills && parent.SubSkills.length > 0)
      {
        header += ':';
      }

      return header;
    };

    $scope.getChildrenHeader = function (){
      var s = $scope.skill;

      if (!s) { return ''; }

      if (!s.ParentSkill && _.isArray(s.SubSkills))
      {
        return _.pluck(s.SubSkills, 'Name').join(', ');
      }

      return s.Name;
    };

    $scope.setReadme = function (project){
      $scope.qInit = dataservice.getReadme(project.Name)
        .then(function (html){
          $scope.readme = html;
        });
    };

    $scope.isAdmin = function (){
      return dataservice.IsAdministrator;
    };

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

    $scope.initQATs = function (){
      dataservice.getQATs().then(function (result){
        $scope.QnAs = result.QnAs;
        $scope.clearFilters();
        $scope.pager.totalQnAs = result.QnAs.length;

        $scope.allTags = result.AllTags;
        $scope.allTags.push({});
      });
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
          $mainScope: function (){
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
          $mainScope: function (){
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

    $scope.showRepopulateConfirmationDlg = function (){
      $modal.open({
        controller: 'SimpleDlgCtrl',
        resolve: {
          bodyText: function (){
            return 'Do you really want to repopulate the GitHub tables ?';
          }
        },
        templateUrl: 'modals/SimpleDlg.html'
      }).result.then(function (){
        $scope.qInit = dataservice.repopulate().then(function (){
          location.reload(true);
        });
      });
    };
    
  })
  .controller('SimpleDlgCtrl', ['$scope', '$modalInstance', 'bodyText',
    function ($scope, $modalInstance, bodyText){
      $scope.bodyText = bodyText;

      $scope.yes = function (){
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }
  ]);
