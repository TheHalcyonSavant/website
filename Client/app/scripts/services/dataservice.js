'use strict';

angular.module('clientApp')
  .factory('dataservice', function (breeze, $http, $cacheFactory, $q, $timeout){

    var _serviceLink = 'http://thehalcyonsavant.com/breeze/Main';

    var _manager = new breeze.EntityManager(_serviceLink);

    var _trackTagIdsChanges = true;

    // extending QnA entity with TagIds model
    _manager.metadataStore.registerEntityTypeCtor('QnA', null, function (qna){
      var _tagIds = [];

      Object.defineProperty(qna, 'TagIds', {

        get : function (){
          return _tagIds;
        },

        set : function (newIds){

          // newIds can be array of strings
          // this guarantees newIds will be an array of integers
          if (newIds && newIds.length > 0)
          {
            newIds = newIds.map(function (n){ return +n; });
          }

          if (_trackTagIdsChanges && !_.isEqual(newIds, _tagIds))
          {
            // exoect only one change for now
            var removeId = _.difference(_tagIds, newIds)[0];
            if (angular.isDefined(removeId))
            {
              _(this.Maps).each(function (map){
                if (map && map.Tag.Id === removeId)
                {
                  map.entityAspect.setDeleted();
                  return;
                }
              });
            }

            var addId = _.difference(newIds, _tagIds)[0];
            if (angular.isDefined(addId))
            {
              _manager.createEntity('MapQAT', {
                QnA: this,
                Tag: _manager.getEntityByKey('Tag', addId)
              });
            }
            
            if (this.entityAspect.entityState.isUnchanged())
            {
              this.entityAspect.originalValues.TagIds = _tagIds;
              this.entityAspect.setModified();
            }
          }

          _tagIds = newIds;

        },

        enumerable : true,
        configurable : true
      });

      qna.entityAspect.setDeleted = function (){
        qna.entityAspect.constructor.prototype.setDeleted.call(qna.entityAspect);

        _(qna.Maps).each(function (m){
          m.entityAspect.setDeleted();
        });
      };
    });

    // extending Tag entity with renderQnAs method
    _manager.metadataStore.registerEntityTypeCtor('Tag', function Tag(){

      // refresh DOM dependant on TagIds
      this.renderQnAs = function (){
        var tempIds = [], _that = this;

        // null all currently edited TagIds
        _trackTagIdsChanges = false;
        _(this.Maps).each(function (m, i){
          // slice() <==> clone
          // if the array is not clonned first, the DOM is unnotified
          tempIds[i] = m.QnA.TagIds.slice();
          m.QnA.TagIds = null;
        });

        $timeout(function (){
          // restore all currently edited TagIds
          _(_that.Maps).each(function (m, i){ 
            m.QnA.TagIds = tempIds[i];
          });
          _trackTagIdsChanges = true;
        }, 500);  // enough time to wait for undoing changes
      };
    },

    // extending Tag entityAspect
    function (tag){
      var aspect = tag.entityAspect;

      // on every Tag's rejectChanges call refresh its QnA TagIds
      aspect.rejectChanges = function (){
        // calling super method
        aspect.constructor.prototype.rejectChanges.call(aspect);
        tag.renderQnAs();
      };

      // on every Tag's setDeleted modify QnA's TagIds
      aspect.setDeleted = function (){
        aspect.constructor.prototype.setDeleted.call(aspect);

        _trackTagIdsChanges = false;
        _(_manager.getEntities('QnA')).each(function (qna){
          var tagIds = qna.TagIds.slice();
          var i = tagIds.indexOf(tag.Id);

          if (i > -1)
          {
            tagIds.splice(i, 1);
            qna.TagIds = tagIds;
            _(qna.Maps).find(function (m){
              // Tag should be removed by now from the base setDeleted call
              return m.Tag === null;
            }).entityAspect.setDeleted();
          }
        });
        _trackTagIdsChanges = true;

        tag.renderQnAs();
      };
    });

    // Public API here
    return {

      allSkills: [],

      IsAdministrator: undefined,

      initialize: function() {
        var that = this;

        $http.get(_serviceLink + '/IsAdministrator')
          .catch(function (error){
            console.error(error);
          }).then(function (response){
            that.IsAdministrator = parseInt(response.data);
          });

        return breeze.EntityQuery
          .from('Skills')
          .using(_manager)
          .execute().then(function (data){
            that.allSkills = data.results;
            return that.getParentSkills();
          }).catch(function (error){
            console.error(error);
          });
      },

      getParentSkills: function (){
        if (this.allSkills.length === 0)
        {
          throw new Error('allSkills = []; Call dataservice.initialize() first !');
        }

        var query = breeze.EntityQuery
          .fromEntities(this.allSkills)
          .where('ParentSkillId', '==', null);

        return _manager.executeQueryLocally(query);
      },

      getSkill: function (id){
        var skill = _manager.getEntityByKey('GHSkill', id);

        if (!skill)
        {
          throw new Error('skill with id="' + id + '" doesn\'t exist');
        }

        return skill;
      },

      // only for testing purposes
      clearCache: function (){
        $cacheFactory.get('$http').removeAll();
      },

      getReadme: function (projectName){
        return $http.get(
          'https://api.github.com/repos/TheHalcyonSavant/' +
          projectName + '/readme',
          {
            headers: {
              Accept: 'application/vnd.github.v3.html'
            },
            cache: true
          }
        ).catch(function (error){
          console.error(error);
        }).then(function (response){
          var jqHtml = $($.parseHTML(response.data));
          jqHtml.find('a.anchor').remove();
          jqHtml.find('a').each(function () {
            var $this = $(this);
            if (!$this.attr('href').match(/^(https?\:)?\/\//))
            {
              $this.attr('href','https://github.com/TheHalcyonSavant/' +
                projectName + '/blob/master/' + $this.attr('href')
              );
            }
            $this.attr('target', '_blank');
          });

          return jqHtml.html();
        });
      },

      getQATs: function (){
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

            _trackTagIdsChanges = false;
            _(_QnAs).each(function (qna){
              qna.TagIds = _.pluck(_.pluck(qna.Maps, 'Tag'), 'Id').sort();
            });
            _trackTagIdsChanges = true;

            return {
              QnAs: _QnAs,
              AllTags: data[1].results
            };
          }).catch(function (error){
            console.error(error);
          });
      },

      createTag: function (name){
        return _manager.createEntity('Tag', { Name: name });
      },

      createQnA: function (){
        return _manager.createEntity('QnA');
      },

      // only for testing purposes
      getChanges: function (){
        return _manager.getChanges();
      },

      hasChanges: function (){
        return _manager.hasChanges();
      },

      rejectChanges: function (){
        return _manager.rejectChanges();
      },

      saveChanges: function (){
        return _manager.saveChanges();
      },

      repopulate: function (){
        return $http.get(_serviceLink + '/Recreate')
          .catch(function (error){
            console.error(error);
          });
      }

    };
    
  });
