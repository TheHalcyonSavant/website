'use strict';

angular.module('clientApp')
  .controller('EditTagsCtrl', function ($scope, $modalInstance, dataservice, $modal, allTags, cancelChanges){

    $scope.tagsData = allTags;

    $scope.tagsGridOptions = {
      columnDefs: [
        { field: 'Id', width: 40, cellFilter: 'IdCell' },
        { field: 'Name', enableCellEdit: true },
        {
          field: '',
          cellTemplate: 'gridBtnDeleteCell.html',
          width: 35
        }
      ],
      data: 'tagsData',
      enableRowSelection: false
    };

    $scope.$on('ngGridEventEndCellEdit', function (evt){
      var tag = evt.targetScope.row.entity;

      // empty Name case
      // revert Name when is empty
      if ($.trim(tag.Name) === '')
      {
        if (tag.entityAspect)
        {
          tag.entityAspect.rejectChanges();
        }

        return;
      }

      // new Tag case
      // ensure the existance of an empty row at the end
      var lastEntity = _.last(allTags);
      if (lastEntity.Name)
      {
        lastEntity = dataservice.createTag(lastEntity.Name);
        allTags[allTags.length - 1] = lastEntity;

        allTags.push({});

        return;
      }

      // edit Tag Name case
      // refresh disabled tags in QnAs
      tag.renderQnAs();
    });

    $scope.deleteTag = function (){
      var i = this.row.rowIndex;
      allTags[i].entityAspect.setDeleted();
      allTags.splice(i, 1);
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