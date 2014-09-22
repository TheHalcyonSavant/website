'use strict';

angular.module('clientApp')
  .factory('cancelChanges', function ($modal, Data){
    return function ($modalInstance, cb){
      if (!Data.hasChanges())
      {
        $modalInstance.dismiss('cancel');
        return;
      }

      $modal.open({
        controller: 'SimpleDlgCtrl',
        templateUrl: 'views/simpledlg.html',
        resolve: {
          bodyText: function (){
            return 'The changes will be discarded. Are you sure ?';
          }
        }
      }).result.then(function (){
        if (_.isFunction(cb))
        {
          cb();
        }
        Data.rejectChanges();
        $modalInstance.dismiss('cancel');
      });
    };
  });