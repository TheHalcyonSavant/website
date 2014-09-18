'use strict';

angular.module('clientApp')
  .factory('QnARepo', function (dataservice, breeze){

    var _manager = dataservice.manager,
      _clonedQnA,
      _modifiedQnA;

    return {

      cancel: function (){
        _clonedQnA.entityAspect.setDetached();
        if (_modifiedQnA)
        {
          _manager.attachEntity(_modifiedQnA);
          _modifiedQnA._setTagIds(_clonedQnA.TagIds.slice());
        }
        _manager.rejectChanges();
      },

      create: function (){
        _clonedQnA = _manager.createEntity('QnA');

        return _clonedQnA;
      },

      delete: function (qna){
        _(qna.Maps.slice()).each(function (m){
          m.entityAspect.setDeleted();
        });
        qna.entityAspect.setDeleted();

        return _manager.saveChanges();
      },

      edit: function (qna){
        var tagIds = qna.TagIds.slice(),
          maps = qna.Maps.slice();

        _modifiedQnA = qna;
        _modifiedQnA.entityAspect.setDetached();
        _clonedQnA = _manager.createEntity('QnA', {
          Id: qna.Id,
          Question: qna.Question,
          Answer: qna.Answer,
          Maps: maps
        }, breeze.EntityState.Unchanged);
        _clonedQnA._setTagIds(tagIds);

        return _clonedQnA;
      },

      save: function (isTagsChanged){
        if (isTagsChanged)
        {
          var forRemoval = [];
          _(_clonedQnA.Maps).each(function (m){
            forRemoval.push(m);
          });
          _(_clonedQnA.TagIds).each(function (tagId){
            var i = _.findIndex(forRemoval, { TagId: tagId });
            if (i > -1)
            {
              forRemoval.splice(i, 1);
            }
            else
            {
              _manager.createEntity('MapQAT', {
                QnA: _clonedQnA,
                Tag: _manager.getEntityByKey('Tag', tagId)
              });
            }
          });
          _(_clonedQnA.forRemoval).each(function (m){
            m.entityAspect.setDeleted();
          });
        }

        return _manager.saveChanges();
      }

    };
  });