'use strict';

angular.module('clientApp')
  .filter('pageCrop', function (limitToFilter){
    return function (input, pager){
      if (_.isEmpty(input) || _.isEmpty(pager))
      {
        return [];
      }

      return limitToFilter(
      	input.slice((pager.currentPage - 1) * pager.pageSize),
      	pager.pageSize
      );
    };
  });