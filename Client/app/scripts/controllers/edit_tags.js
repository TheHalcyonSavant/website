'use strict';

angular.module('clientApp')
  .controller('EditTagsCtrl', function ($modal, $modalInstance, $qatScope, $scope, cancelChanges, TagsRepo){
    // slice <==> clone
    var _originalAllTags = $qatScope.allTags.slice();
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
      data: $qatScope.allTags,
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
        var lastEntity = _.last($qatScope.allTags);
        if (lastEntity.Name)
        {
          lastEntity = TagsRepo.createTag(lastEntity.Name);
          $qatScope.allTags[$qatScope.allTags.length - 1] = lastEntity;
          $qatScope.allTags.push({});
          $scope.$apply();
        }
      });
    };

    $scope.tagsGridScope = {
      deleteTag: function (id){
        var i = _.findIndex($qatScope.allTags, { Id: id });
        $qatScope.allTags[i].entityAspect.setDeleted();
        $qatScope.allTags.splice(i, 1);
      }
    };

    $scope.save = function (){
      _originalAllTags = $qatScope.allTags.slice();
      $qatScope.qInit = TagsRepo.saveTags();
      $modalInstance.close();
    };

    $scope.cancel = function (){
      cancelChanges($modalInstance, function beforeRejectChanges(){
        $qatScope.allTags = _originalAllTags.slice();
      });
    };
 
  });