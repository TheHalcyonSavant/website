'use strict';

angular.module('clientApp')
  .factory('promise', function ($q){
    
    return function (result){
      var deferred = $q.defer();

      deferred.resolve(result);

      return deferred.promise;
    };
  })
  .factory('Assert', function (){
    
    return {

      allSkills: [],

      expectSkill: function (name, collection){
        var singleOrDefault = _.where(collection || this.allSkills, { Name: name });
        expect(singleOrDefault.length).toBe(1);

        var skill = singleOrDefault[0];
        expect(skill).toBeDefined();
        expect(skill.Name).toBe(name);
        
        return skill;
      },

      expectSubSkills: function (skill, childrenNames){
        var subSkills = skill.SubSkills,
          that = this;

        if (!childrenNames || childrenNames.length === 0)
        {
          expect(subSkills.length).toBe(0);
          return;
        }

        expect(subSkills.length).toBeGreaterThan(0);
        _.each(childrenNames, function (childName){
          var subSkill = that.expectSkill(childName, subSkills);
          expect(subSkill.SubSkills.length).toBe(0);
          expect(subSkill.ParentSkill).toBe(skill);
        });
      },

      expectProjectsForSkill: function (skillName, projectNames){
        var skill = _.where(this.allSkills, { Name: skillName })[0];
        var maps = skill.Maps;

        expect(maps).toBeDefined();
        expect(maps.length).toBeGreaterThan(0);

        _.each(projectNames, function (p){
          var skillProject = _.find(maps, function (m){
            return m.Project.Name === p;
          }).Project;
          
          expect(skillProject).toBeDefined();
          expect(skillProject.Name).toBe(p);
        });
      }

    };
  });