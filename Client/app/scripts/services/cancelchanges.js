'use strict';

angular.module('clientApp')
  .factory('cancelChanges', function ($modal, data){
    return function ($modalInstance, cb){
      if (!data.hasChanges())
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
        data.rejectChanges();
        $modalInstance.dismiss('cancel');
      });
    };
  });