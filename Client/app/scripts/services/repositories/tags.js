'use strict';

angular.module('clientApp')
  .factory('TagsRepo', function ($q, $timeout, breeze, Data){
    var _manager = Data.manager;

    return {
      
      createTag: function (name){
        return _manager.createEntity('Tag', { Name: name });
      },

      saveTags: function (){
        if (!Data.hasChanges()) { return; }

        _(_manager.getChanges()).each(function (e){
          // is Tag deleted
          if (e.entityType.shortName === 'MapQAT')
          {
            var newTagIds = e.QnA.TagIds.slice();
            newTagIds.splice(
              newTagIds.indexOf(e.entityAspect.originalValues.TagId), 1
            );
            e.QnA._setTagIds(newTagIds);
            e.entityAspect.setDeleted();
          }
        });

        var renamedObj = [];
        _(_manager.getChanges()).each(function (e){
          // is Tag renamed
          if (e.entityType.shortName === 'Tag' && e.entityAspect.entityState.isModified())
          {
            _(e.Maps).each(function (mapQAT){
              if (!_.find(renamedObj, { 'id': mapQAT.QnA.Id }))
              {
                renamedObj.push({
                  id: mapQAT.QnA.Id,
                  qna: mapQAT.QnA,
                  origTagIds: mapQAT.QnA.TagIds.slice()
                });
                // if TagIds is not nulled first, the DOM stays unnotified
                mapQAT.QnA._setTagIds(null);
              }
            });
          }
        });
        $timeout(function (){
          _(renamedObj).each(function (o){
            o.qna._setTagIds(o.origTagIds);
          });
        }, 500);  // enough time to wait for undoing changes

        return _manager.saveChanges();
      }

    };
  });