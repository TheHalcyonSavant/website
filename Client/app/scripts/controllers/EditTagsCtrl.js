'use strict';

angular.module('clientApp')
  .controller('EditTagsCtrl', function ($scope, $modalInstance, $mainScope, $modal, dataservice, cancelChanges){
    // slice <==> clone
    var _originalAllTags = $mainScope.allTags.slice();
    _originalAllTags[_originalAllTags.length - 1] = {};

    $scope.tagsGridOptions = {
      columnDefs: [
        { field: 'Id', width: 45, cellFilter: 'IdCell', enableCellEdit: false },
        { field: 'Name' },
        {
          field: 'delete',
          displayName: '',
          cellTemplate: 'gridBtnDeleteCell.html',
          width: 55,
          enableSorting: false,
          enableCellEdit: false
        }
      ],
      data: $mainScope.allTags,
      enableRowSelection: false
    };

    $scope.tagsGridOptions.onRegisterApi = function (gridApi){
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function (rowEntity){
        // empty Name case
        // revert Name when is empty
        if ($.trim(rowEntity.Name) === '')
        {
          if (rowEntity.entityAspect)
          {
            rowEntity.entityAspect.rejectChanges();
          }
          return;
        }
        // new Tag case
        // ensure the existence of an empty row at the end
        var lastEntity = _.last($mainScope.allTags);
        if (lastEntity.Name)
        {
          lastEntity = dataservice.createTag(lastEntity.Name);
          $mainScope.allTags[$mainScope.allTags.length - 1] = lastEntity;
          $mainScope.allTags.push({});
          $scope.$apply();
        }
      });
    };

    $scope.tagsGridScope = {
      deleteTag: function (id){
        var i = _.findIndex($mainScope.allTags, { Id: id });
        $mainScope.allTags[i].entityAspect.setDeleted();
        $mainScope.allTags.splice(i, 1);
      }
    };

    $scope.save = function (){
      if (dataservice.hasChanges())
      {
        _originalAllTags = $mainScope.allTags.slice();
        $mainScope.qInit = dataservice.saveTags();
      }
      $modalInstance.close();
    };

    $scope.cancel = function (){
      cancelChanges($modalInstance, function beforeRejectChanges(){
        $mainScope.allTags = _originalAllTags.slice();
      });
    };
 
  })
  .filter('IdCell', function (){
    return function (input){
      return input < 1 ? 'new' : input;
    };
  })
  .factory('cancelChanges', function ($modal, dataservice){
    return function ($modalInstance, cb){
      if (!dataservice.hasChanges())
      {
        $modalInstance.dismiss('cancel');
        return;
      }

      $modal.open({
        controller: 'SimpleDlgCtrl',
        templateUrl: 'modals/SimpleDlg.html',
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
        dataservice.rejectChanges();
        $modalInstance.dismiss('cancel');
      });
    };
  });