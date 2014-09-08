'use strict';

angular.module('clientApp')
  .controller('EditTagsCtrl', function ($scope, $modalInstance, dataservice, $modal, allTags, cancelChanges){

    $scope.tagsData = allTags;

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
      data: 'tagsData',
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
        var lastEntity = _.last(allTags);
        if (lastEntity.Name)
        {
          lastEntity = dataservice.createTag(lastEntity.Name);
          allTags[allTags.length - 1] = lastEntity;
          allTags.push({});
          $scope.$apply();

          return;
        }

        // edit Tag Name case
        // refresh disabled tags in QnAs
        if (rowEntity.renderQnAs)
        {
          rowEntity.renderQnAs();
        }
      });
    };

    $scope.tagsGridScope = {
      deleteTag: function (i){
        allTags[i].entityAspect.setDeleted();
        allTags.splice(i, 1);
      }
    };

    $scope.save = function (){
      $modalInstance.close();
    };

    $scope.cancel = function (){
      cancelChanges($modalInstance);
    };
 
  })
  .filter('IdCell', function (){
    return function (input){
      return input < 1 ? 'new' : input;
    };
  })
  .factory('cancelChanges', function ($modal, dataservice){
    return function ($modalInstance){
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
        dataservice.rejectChanges();
        $modalInstance.dismiss('cancel');
      });
    };
  });