'use strict';

angular.module('clientApp')
  .filter('qat', function (filterFilter){
    var _filterModel;
    var _comparator = function (qna){
      var e = _filterModel.Everything.toLowerCase();

      if (!_.isEmpty(e))
      {
        if (_.contains(qna.Question.toLowerCase(), e))
        {
          return true;
        }

        if (_.contains(qna.Answer.toLowerCase(), e))
        {
          return true;
        }

        var result = false;

        _(qna.Maps).each(function (m){
          if (_.contains(m.Tag.Name.toLowerCase(), e))
          {
            return !(result = true);
          }
        });

        return result;
      }

      if (_filterModel.NoTags && !_.isEmpty(qna.Maps))
      {
        return false;
      }

      if (_filterModel.NotAnswered && !_.isEmpty(qna.Answer))
      {
        return false;
      }

      var q = _filterModel.Question.toLowerCase();
      var a = _filterModel.Answer.toLowerCase();
      var t = _filterModel.Tags;

      if (q.length > 0 && !_.contains(qna.Question.toLowerCase(), q))
      {
        return false;
      }

      if (a.length > 0 && !_.contains(qna.Answer.toLowerCase(), a))
      {
        return false;
      }

      if (t.length > 0)
      {
        var hasTags = true;

        _(t).each(function (tagId){
          if (!_.find(qna.Maps, function (m){
            return m.Tag.Id.toString() === tagId;
          }))
          {
            return (hasTags = false);
          }
        });

        return hasTags;
      }

      return true;
    };

    return function (QnAs, model){
      _filterModel = model;
      
      return filterFilter(QnAs, _comparator);
    };
  });