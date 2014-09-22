'use strict';

angular.module('modalMock', ['ng']).provider({

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