'use strict';

angular.module('MainCtrlMocks', ['ng']).provider({

  dataserviceMock: function (){

    this.$get = ['$q', function ($q){

      var _maps = [
        { Project: { Id: 12008638, Name: 'VocabularyGame' } },
        { Project: { Id: 12082382, Name: 'ConnStealing' } }
      ];

      var _skills = [
        {
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
        },
        {
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

      var _Tags = [
        { Id: 1, Name: 'General' },
        { Id: 2, Name: 'Introduction' },
        { Id: 3, Name: 'JavaScript' }
      ];

      var _QnAs = [
        {
          Question: 'Test question 1',
          Answer: 'aswering ...',
          Maps: [
            { Tag: _Tags[0] },
            { Tag: _Tags[1] }
          ]
        },
        {
          Question: 'I`m going to ask again !',
          Answer: 'I` don`t care',
          Maps: [
            { Tag: _Tags[0] },
            { Tag: _Tags[2] }
          ]
        },
        {
          Question: 'Some empty question',
          Answer: undefined,
          Maps: null
        }
      ];

      return {

        allSkills: _skills,

        IsAdministrator: 1,
        
        initialize: function (){
          var deferred = $q.defer();

          deferred.resolve(this.allSkills);

          return deferred.promise;
        },

        getSkill: function (id){
          return this.allSkills[0];
        },

        getReadme: function (projectName){
          var deferred = $q.defer();

          deferred.resolve('<h>Test Project README</h>');

          return deferred.promise;
        },

        getQATs: function (){
          var deferred = $q.defer();

          deferred.resolve({
            QnAs: _QnAs,
            AllTags: _Tags
          });

          return deferred.promise;
        },

        repopulate: function (){
          var deferred = $q.defer();

          return deferred.promise;
        }

      };

    }];

  },

  modalMock: function (){

    this.$get = ['$q', function ($q){

      var _deferred = $q.defer();

      return {

        open: function () {
          _deferred.resolve();

          return this;
        },

        result: _deferred.promise

      };

    }];

  }

});