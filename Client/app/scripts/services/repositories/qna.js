'use strict';

angular.module('clientApp')
  .factory('QnARepo', function ($q, breeze, Data){

    var _manager = Data.manager,
      _clonedQnA,
      _originalQnA,
      _originalTagIds;

    return {

      cancel: function (){
        _clonedQnA.entityAspect.setDetached();
        if (_originalQnA)
        {
          _manager.attachEntity(_originalQnA);
          _originalQnA._setTagIds(_originalTagIds);
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

        //return _manager.acceptChanges();
        return _manager.saveChanges();
      },

      edit: function (qna){
        var maps = qna.Maps.slice();

        _originalQnA = qna;
        _originalTagIds = _originalQnA.TagIds.slice();
        _originalQnA.entityAspect.setDetached();
        _clonedQnA = _manager.createEntity('QnA', {
          Id: qna.Id,
          Question: qna.Question,
          Answer: qna.Answer,
          Maps: maps
        }, breeze.EntityState.Unchanged);
        _clonedQnA._setTagIds(_originalTagIds);

        return _clonedQnA;
      },

      initialize: function (){
        var qQnA = breeze.EntityQuery
          .from('QnA')
          .using(_manager)
          .execute();
        var qTags = breeze.EntityQuery
          .from('Tags')
          .using(_manager)
          .execute();

        return $q.all([qQnA, qTags]).then(function (data){
            var _QnAs = data[0].results;

            _(_QnAs).each(function (qna){
              qna._setTagIds(_.pluck(_.pluck(qna.Maps, 'Tag'), 'Id').sort());
            });

            return {
              QnAs: _QnAs,
              AllTags: data[1].results
            };
          }).catch(function (error){
            console.error(error);
          });
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
          _(forRemoval).each(function (m){
            m.entityAspect.setDeleted();
          });
        }

        //return _manager.acceptChanges();
        return _manager.saveChanges();
      }

    };
  });