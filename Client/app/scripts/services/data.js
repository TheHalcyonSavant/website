'use strict';

angular.module('clientApp')
  .factory('Data', function ($cacheFactory, $http, breeze){
    var _ghAPI = 'https://api.github.com/repos/TheHalcyonSavant/';

    var _serviceLink = 'http://thehalcyonsavant.com/breeze/Main';

    var _metadataStore = new breeze.MetadataStore();
    _metadataStore.importMetadata(JSON.stringify(
      {"schema":{"namespace":"Server.DAL","alias":"Self","annotation:UseStrongSpatialTypes":"false","xmlns:annotation":"http://schemas.microsoft.com/ado/2009/02/edm/annotation","xmlns:customannotation":"http://schemas.microsoft.com/ado/2013/11/edm/customannotation","xmlns":"http://schemas.microsoft.com/ado/2009/11/edm","cSpaceOSpaceMapping":"[[\"Server.DAL.MapQAT\",\"Server.Models.MapQAT\"],[\"Server.DAL.QnA\",\"Server.Models.QnA\"],[\"Server.DAL.Tag\",\"Server.Models.Tag\"],[\"Server.DAL.MapSP\",\"Server.Models.MapSP\"],[\"Server.DAL.GHProject\",\"Server.Models.GHProject\"],[\"Server.DAL.GHSkill\",\"Server.Models.GHSkill\"],[\"Server.DAL.Test\",\"Server.Models.Test\"]]","entityType":[{"name":"MapQAT","customannotation:ClrType":"Server.Models.MapQAT, Server, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","key":{"propertyRef":{"name":"Id"}},"property":[{"name":"Id","type":"Edm.Int32","nullable":"false","annotation:StoreGeneratedPattern":"Identity"},{"name":"QnAId","type":"Edm.Int32","nullable":"false"},{"name":"TagId","type":"Edm.Int32","nullable":"false"}],"navigationProperty":[{"name":"QnA","relationship":"Self.QnA_Maps","fromRole":"QnA_Maps_Target","toRole":"QnA_Maps_Source"},{"name":"Tag","relationship":"Self.Tag_Maps","fromRole":"Tag_Maps_Target","toRole":"Tag_Maps_Source"}]},{"name":"QnA","customannotation:ClrType":"Server.Models.QnA, Server, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","key":{"propertyRef":{"name":"Id"}},"property":[{"name":"Id","type":"Edm.Int32","nullable":"false","annotation:StoreGeneratedPattern":"Identity"},{"name":"Question","type":"Edm.String","maxLength":"Max","fixedLength":"false","unicode":"true","nullable":"false"},{"name":"Answer","type":"Edm.String","maxLength":"Max","fixedLength":"false","unicode":"true"},{"name":"Order","type":"Edm.Int32"}],"navigationProperty":{"name":"Maps","relationship":"Self.QnA_Maps","fromRole":"QnA_Maps_Source","toRole":"QnA_Maps_Target"}},{"name":"Tag","customannotation:ClrType":"Server.Models.Tag, Server, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","key":{"propertyRef":{"name":"Id"}},"property":[{"name":"Id","type":"Edm.Int32","nullable":"false","annotation:StoreGeneratedPattern":"Identity"},{"name":"Name","type":"Edm.String","maxLength":"100","fixedLength":"false","unicode":"true","nullable":"false"},{"name":"Order","type":"Edm.Int32"}],"navigationProperty":{"name":"Maps","relationship":"Self.Tag_Maps","fromRole":"Tag_Maps_Source","toRole":"Tag_Maps_Target"}},{"name":"MapSP","customannotation:ClrType":"Server.Models.MapSP, Server, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","key":{"propertyRef":{"name":"Id"}},"property":[{"name":"Id","type":"Edm.Int32","nullable":"false","annotation:StoreGeneratedPattern":"Identity"},{"name":"GHSkillId","type":"Edm.Int32","nullable":"false"},{"name":"GHProjectId","type":"Edm.Int32","nullable":"false"}],"navigationProperty":[{"name":"Project","relationship":"Self.GHProject_Maps","fromRole":"GHProject_Maps_Target","toRole":"GHProject_Maps_Source"},{"name":"Skill","relationship":"Self.GHSkill_Maps","fromRole":"GHSkill_Maps_Target","toRole":"GHSkill_Maps_Source"}]},{"name":"GHProject","customannotation:ClrType":"Server.Models.GHProject, Server, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","key":{"propertyRef":{"name":"Id"}},"property":[{"name":"Id","type":"Edm.Int32","nullable":"false","annotation:StoreGeneratedPattern":"None"},{"name":"Name","type":"Edm.String","maxLength":"Max","fixedLength":"false","unicode":"true"},{"name":"Description","type":"Edm.String","maxLength":"Max","fixedLength":"false","unicode":"true"}],"navigationProperty":{"name":"Maps","relationship":"Self.GHProject_Maps","fromRole":"GHProject_Maps_Source","toRole":"GHProject_Maps_Target"}},{"name":"GHSkill","customannotation:ClrType":"Server.Models.GHSkill, Server, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","key":{"propertyRef":{"name":"Id"}},"property":[{"name":"Id","type":"Edm.Int32","nullable":"false","annotation:StoreGeneratedPattern":"Identity"},{"name":"Name","type":"Edm.String","maxLength":"Max","fixedLength":"false","unicode":"true"},{"name":"ParentSkillId","type":"Edm.Int32"}],"navigationProperty":[{"name":"Maps","relationship":"Self.GHSkill_Maps","fromRole":"GHSkill_Maps_Source","toRole":"GHSkill_Maps_Target"},{"name":"ParentSkill","relationship":"Self.GHSkill_ParentSkill","fromRole":"GHSkill_ParentSkill_Source","toRole":"GHSkill_ParentSkill_Target"},{"name":"SubSkills","relationship":"Self.GHSkill_ParentSkill","fromRole":"GHSkill_ParentSkill_Target","toRole":"GHSkill_ParentSkill_Source"}]},{"name":"Test","customannotation:ClrType":"Server.Models.Test, Server, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","key":{"propertyRef":{"name":"Id"}},"property":[{"name":"Id","type":"Edm.Int32","nullable":"false","annotation:StoreGeneratedPattern":"None"},{"name":"Name","type":"Edm.String","maxLength":"Max","fixedLength":"false","unicode":"true"}]}],"association":[{"name":"QnA_Maps","end":[{"role":"QnA_Maps_Source","type":"Edm.Self.QnA","multiplicity":"1","onDelete":{"action":"Cascade"}},{"role":"QnA_Maps_Target","type":"Edm.Self.MapQAT","multiplicity":"*"}],"referentialConstraint":{"principal":{"role":"QnA_Maps_Source","propertyRef":{"name":"Id"}},"dependent":{"role":"QnA_Maps_Target","propertyRef":{"name":"QnAId"}}}},{"name":"Tag_Maps","end":[{"role":"Tag_Maps_Source","type":"Edm.Self.Tag","multiplicity":"1","onDelete":{"action":"Cascade"}},{"role":"Tag_Maps_Target","type":"Edm.Self.MapQAT","multiplicity":"*"}],"referentialConstraint":{"principal":{"role":"Tag_Maps_Source","propertyRef":{"name":"Id"}},"dependent":{"role":"Tag_Maps_Target","propertyRef":{"name":"TagId"}}}},{"name":"GHProject_Maps","end":[{"role":"GHProject_Maps_Source","type":"Edm.Self.GHProject","multiplicity":"1","onDelete":{"action":"Cascade"}},{"role":"GHProject_Maps_Target","type":"Edm.Self.MapSP","multiplicity":"*"}],"referentialConstraint":{"principal":{"role":"GHProject_Maps_Source","propertyRef":{"name":"Id"}},"dependent":{"role":"GHProject_Maps_Target","propertyRef":{"name":"GHProjectId"}}}},{"name":"GHSkill_Maps","end":[{"role":"GHSkill_Maps_Source","type":"Edm.Self.GHSkill","multiplicity":"1","onDelete":{"action":"Cascade"}},{"role":"GHSkill_Maps_Target","type":"Edm.Self.MapSP","multiplicity":"*"}],"referentialConstraint":{"principal":{"role":"GHSkill_Maps_Source","propertyRef":{"name":"Id"}},"dependent":{"role":"GHSkill_Maps_Target","propertyRef":{"name":"GHSkillId"}}}},{"name":"GHSkill_ParentSkill","end":[{"role":"GHSkill_ParentSkill_Source","type":"Edm.Self.GHSkill","multiplicity":"*"},{"role":"GHSkill_ParentSkill_Target","type":"Edm.Self.GHSkill","multiplicity":"0..1"}],"referentialConstraint":{"principal":{"role":"GHSkill_ParentSkill_Target","propertyRef":{"name":"Id"}},"dependent":{"role":"GHSkill_ParentSkill_Source","propertyRef":{"name":"ParentSkillId"}}}}],"entityContainer":{"name":"TestContext","customannotation:UseClrTypes":"true","entitySet":[{"name":"MapsQAT","entityType":"Self.MapQAT"},{"name":"QnAs","entityType":"Self.QnA"},{"name":"Tags","entityType":"Self.Tag"},{"name":"MapsSP","entityType":"Self.MapSP"},{"name":"Projects","entityType":"Self.GHProject"},{"name":"Skills","entityType":"Self.GHSkill"},{"name":"Tests","entityType":"Self.Test"}],"associationSet":[{"name":"QnA_Maps","association":"Self.QnA_Maps","end":[{"role":"QnA_Maps_Source","entitySet":"QnAs"},{"role":"QnA_Maps_Target","entitySet":"MapsQAT"}]},{"name":"Tag_Maps","association":"Self.Tag_Maps","end":[{"role":"Tag_Maps_Source","entitySet":"Tags"},{"role":"Tag_Maps_Target","entitySet":"MapsQAT"}]},{"name":"GHProject_Maps","association":"Self.GHProject_Maps","end":[{"role":"GHProject_Maps_Source","entitySet":"Projects"},{"role":"GHProject_Maps_Target","entitySet":"MapsSP"}]},{"name":"GHSkill_Maps","association":"Self.GHSkill_Maps","end":[{"role":"GHSkill_Maps_Source","entitySet":"Skills"},{"role":"GHSkill_Maps_Target","entitySet":"MapsSP"}]},{"name":"GHSkill_ParentSkill","association":"Self.GHSkill_ParentSkill","end":[{"role":"GHSkill_ParentSkill_Source","entitySet":"Skills"},{"role":"GHSkill_ParentSkill_Target","entitySet":"Skills"}]}]}}}
    ));

    var _manager = new breeze.EntityManager({
      dataService: new breeze.DataService({
        serviceName: _serviceLink,
        hasServerMetadata: false
      }),
      metadataStore: _metadataStore
    });

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
