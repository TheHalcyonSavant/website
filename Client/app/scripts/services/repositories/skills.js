'use strict';

angular.module('clientApp')
  .factory('SkillsRepo', function ($q, breeze, Data){

  	var _manager = Data.manager;

    return {

      allParentSkills: [],

      getParentSkills: function (allSkills){
        if (allSkills.length === 0)
        {
          throw new Error('allParentSkills = []; Click "Repopulate skills" first !');
        }

        var query = breeze.EntityQuery
          .fromEntities(allSkills)
          .where('ParentSkillId', '==', null)
          .orderBy('Name');

        return _manager.executeQueryLocally(query);
      },

      getReadme: function (projectName){
        return Data.getGitHubHTML(projectName + '/readme')
          .then(function (jqHtml){
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

      getSkill: function (id){
        var skill = _manager.getEntityByKey('GHSkill', id);

        if (!skill)
        {
          throw new Error('skill with id="' + id + '" doesn\'t exist');
        }

        return skill;
      },

      initialize: function() {
        var that = this;

        return breeze.EntityQuery
          .from('Skills')
          .using(_manager)
          .execute()
          .catch(function (error){
            console.error(error);
          }).then(function (data){
            return (that.allParentSkills = that.getParentSkills(data.results));
          });
      }

    };
  });