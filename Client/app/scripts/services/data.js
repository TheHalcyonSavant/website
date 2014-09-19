'use strict';

angular.module('clientApp')
  .factory('data', function ($cacheFactory, $http, breeze){
    var _ghAPI = 'https://api.github.com/repos/TheHalcyonSavant/';

    var _serviceLink = 'http://thehalcyonsavant.com/breeze/Main';

    var _manager = new breeze.EntityManager(_serviceLink);

    // extending QnA entity with TagIds model
    _manager.metadataStore.registerEntityTypeCtor('QnA', null, function (qna){
      var _tagIds = [];

      qna._setTagIds = function (newIds){
        // newIds can be array of strings
        // this guarantees newIds will be an array of integers
        if (newIds && newIds.length > 0)
        {
          newIds = newIds.map(function (n){ return +n; });
        }
        _tagIds = newIds;
      };

      Object.defineProperty(qna, 'TagIds', {
        get : function (){
          return _tagIds;
        },
        set : function (newIds){
          if (!_.isEqual(newIds, _tagIds) && this.entityAspect.entityState.isUnchanged())
          {
            this.entityAspect.originalValues.TagIds = _tagIds;
            this.entityAspect.setModified();
          }

          this._setTagIds(newIds);
        },
        enumerable : true,
        configurable : true
      });

    });

    // Public API here
    return {

      checkIsAdministrator: function (){
        return $http.get(_serviceLink + '/IsAdministrator')
          .catch(function (error){
            console.error(error);
          }).then(function (response){
            return parseInt(response.data);
          });
      },

      // only for testing purposes
      clearCache: function (){
        $cacheFactory.get('$http').removeAll();
      },

      getGitHubHTML: function (path){
        return $http.get(_ghAPI + path, {
          headers: {
            Accept: 'application/vnd.github.v3.html'
          },
          cache: true
        }).catch(function (error){
          console.error(error);
        }).then(function (response){
          return $($.parseHTML(response.data));
        });
      },

      hasChanges: function (){
        /*
        // don't use _manager.hasChanges, it has a bug
        // sometimes returns true, sometimes false for the same results
        // or returns always false/true in the following case:
        test: function (){
          var t = _manager.getEntityByKey('Tag', 1);
          t.entityAspect.setDeleted();
          _manager.acceptChanges();
          console.log('Tag', _manager.hasChanges());

          var m = _manager.getEntityByKey('MapQAT', 1);
          m.entityAspect.setDeleted();
          _manager.acceptChanges();
          console.log('MapQAT', _manager.hasChanges());
        },
        */
        //return _manager.hasChanges();

        return _manager.getChanges().length > 0;
      },

      manager: _manager,

      rejectChanges: function (){
        return _manager.rejectChanges();
      },

      repopulate: function (){
        return $http.get(_serviceLink + '/Recreate')
          .catch(function (error){
            console.error(error);
          });
      }

    };
    
  });
