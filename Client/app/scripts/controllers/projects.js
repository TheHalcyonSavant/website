'use strict';

angular.module('clientApp')
  .controller('ProjectsCtrl', function ($scope, SkillsRepo){
    
    $scope.SkillsRepo = SkillsRepo;
    $scope.$watch('SkillsRepo.allParentSkills', function (newVal){
      if (_.isEmpty(newVal)) { return; }

      $scope.skill = SkillsRepo.getSkill($scope.$stateParams.id);
      $scope.setReadme($scope.skill.Maps[0].Project);
    });

    $scope.getChildrenHeader = function (){
      var s = $scope.skill;

      if (!s) { return ''; }

      if (!s.ParentSkill && _.isArray(s.SubSkills))
      {
        return _.pluck(s.SubSkills, 'Name').join(', ');
      }

      return s.Name;
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

    $scope.setReadme = function (project){
      $scope.qInit = SkillsRepo.getReadme(project.Name)
        .then(function (html){
          $scope.readme = html;
        });
    };

  });