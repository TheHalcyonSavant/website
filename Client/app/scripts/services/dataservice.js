'use strict';

angular.module('clientApp')
  .factory('dataservice', function (breeze, $http, $cacheFactory, $q, $timeout){

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
          throw new Error('allSkills = []; Click "Repopulate skills" first !');
        }

        var query = breeze.EntityQuery
          .fromEntities(this.allSkills)
          .where('ParentSkillId', '==', null)
          .orderBy('Name');

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

      // only for testing purposes
      getChanges: function (){
        return _manager.getChanges();
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

      rejectChanges: function (){
        return _manager.rejectChanges();
      },

      createTag: function (name){
        return _manager.createEntity('Tag', { Name: name });
      },

      saveTags: function (){
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
      },

      createQnA: function (){
        return _manager.createEntity('QnA');
      },

      editQnA: function (qna){
        var tagIds = qna.TagIds.slice(),
          maps = qna.Maps.slice();

        qna.entityAspect.setDetached();
        var clonedQnA = _manager.createEntity('QnA', {
          Id: qna.Id,
          Question: qna.Question,
          Answer: qna.Answer,
          Maps: maps
        }, breeze.EntityState.Unchanged);
        clonedQnA._setTagIds(tagIds);

        return clonedQnA;
      },

      saveQnA: function (qna){
        if (qna)
        {
          var forRemoval = [];
          _(qna.Maps).each(function (m){
            forRemoval.push(m);
          });
          _(qna.TagIds).each(function (tagId){
            var i = _.findIndex(forRemoval, { TagId: tagId });
            if (i > -1)
            {
              forRemoval.splice(i, 1);
            }
            else
            {
              _manager.createEntity('MapQAT', {
                QnA: qna,
                Tag: _manager.getEntityByKey('Tag', tagId)
              });
            }
          });
          _(qna.forRemoval).each(function (m){
            m.entityAspect.setDeleted();
          });
        }

        return _manager.saveChanges();
      },

      deleteQnA: function (qna){
        _(qna.Maps.slice()).each(function (m){
          m.entityAspect.setDeleted();
        });
        qna.entityAspect.setDeleted();

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
