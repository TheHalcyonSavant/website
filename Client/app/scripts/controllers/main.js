'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($scope, dataservice, $modal){

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

    $scope.initQATs = function (){
      dataservice.getQATs().then(function (result){
        $scope.QnAs = result.QnAs;
        $scope.allTags = result.AllTags;
        $scope.allTags.push({});
      });
    };

    $scope.clearFilters = function (){
      $scope.filterModel = $.extend({}, {
        Question: '',
        Answer: '',
        Tags: [],
        NoTags: false,
        NotAnswered: false
      });
    };

    $scope.clearFilters();

    $scope.filterQAT = function (qna){
      if ($scope.filterModel.NoTags && !_.isEmpty(qna.Maps))
      {
        return false;
      }

      if ($scope.filterModel.NotAnswered && !_.isEmpty(qna.Answer))
      {
        return false;
      }

      var q = $scope.filterModel.Question;
      var a = $scope.filterModel.Answer;
      var t = $scope.filterModel.Tags;

      if (q.length > 0 && !_.contains(qna.Question.toLowerCase(), q))
      {
        return false;
      }

      if (a.length > 0 && !_.contains(qna.Answer.toLowerCase(), a))
      {
        return false;
      }

      if (t.length > 0)
      {
        var hasTags = true;

        _(t).each(function (tagId){
          if (!_.find(qna.Maps, function (m){
            return m.Tag.Id.toString() === tagId;
          }))
          {
            return (hasTags = false);
          }
        });

        return hasTags;
      }

      return true;
    };

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
        $scope.qInit = dataservice.deleteQnA(qna);
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
