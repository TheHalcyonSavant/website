'use strict';

angular.module('QnARepoMock', ['ng']).provider({

  QnARepoMock: function (){

    this.$get = ['promise', function (promise){
      var _AllTags = [
        { Id: 1, Name: 'General' },
        { Id: 2, Name: 'Introduction' },
        { Id: 3, Name: 'JavaScript' }
      ];

      var _QnAs = [
        {
          Question: 'Test question 1',
          Answer: 'answering ...',
          Maps: [
            { Tag: _AllTags[0] },
            { Tag: _AllTags[1] }
          ]
        },
        {
          Question: 'Another question ?',
          Answer: 'with new lines\nLong answer.\n',
          Maps: [
            { Tag: _AllTags[0] },
            { Tag: _AllTags[2] }
          ]
        },
        {
          Question: 'Some empty Question',
          Answer: null,
          Maps: null
        }
      ];

      return {

        initialize: function (){
          return promise({
              QnAs: _QnAs,
              AllTags: _AllTags
            });
        }

      };

    }];

  }
  
})