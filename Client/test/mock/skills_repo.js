'use strict';

angular.module('SkillsRepoMock', ['ng']).provider({

  SkillsRepoMock: function (){

    this.$get = ['promise', function (promise){
      var _maps = [
        { Project: { Id: 12008638, Name: 'VocabularyGame' } },
        { Project: { Id: 12082382, Name: 'ConnStealing' } }
      ];

      var _skills = [{
          Id: 2,
          Name: 'C#',
          SubSkills: [
            {
              Id: 5,
              Name: 'PackedDotNet',
              Maps: _maps
            }, {
              Id: 10,
              Name: 'WinForms',
              Maps: _maps
            }, {
              Id: 15,
              Name: 'LINQ',
              Maps: _maps
            }
          ],
          Maps: _maps
        }, {
          Id: 1,
          Name: 'SQL Server',
          SubSkills: [],
          Maps: [{
            Project: { Id: 12700122, Name: 'SoccerBase' }
          }]
        }
      ];

      _skills[0].SubSkills[0].ParentSkill = _skills[0];
      _skills[0].SubSkills[1].ParentSkill = _skills[0];
      _skills[0].SubSkills[2].ParentSkill = _skills[0];

      return {

        allParentSkills: _skills,

        getReadme: function (projectName){
          return promise('<h>Test Project README</h>');
        },

        getSkill: function (id){
          return this.allParentSkills[0];
        },

        initialize: function (){
          return promise(this.allParentSkills);
        }

      };

    }];
  }

});