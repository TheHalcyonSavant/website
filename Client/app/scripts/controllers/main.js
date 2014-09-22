'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($modal, $scope, Data, SkillsRepo){

    Data.checkIsAdministrator().then(function (isAdmin){
      $scope.isAdmin = isAdmin;
    });

    $scope.qInit = SkillsRepo.initialize().then(function (parentSkills){
      $scope.skills = parentSkills;
    });

    $scope.showRepopulateConfirmationDlg = function (){
      $modal.open({
        controller: 'SimpleDlgCtrl',
        resolve: {
          bodyText: function (){
            return 'Do you really want to repopulate the GitHub tables ?';
          }
        },
        templateUrl: 'views/simpledlg.html'
      }).result.then(function (){
        $scope.qInit = Data.repopulate().then(function (){
          location.reload(true);
        });
      });
    };
    
  });
