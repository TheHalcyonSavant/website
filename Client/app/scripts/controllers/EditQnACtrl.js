'use strict';

angular.module('clientApp')
  .controller('EditQnACtrl', function ($scope, $mainScope, $modalInstance, dataservice, cancelChanges){
    var isNew = _.isEmpty($mainScope.editedQnA);

    $scope.allTags = $mainScope.allTags;
    $scope.qna = dataservice[(isNew?'create':'edit')+'QnA']($mainScope.editedQnA);

		$scope.save = function (){
      if (this.qnaForm.$valid)
      {
        if (isNew)
        {
          $mainScope.QnAs.push($scope.qna);
        }
        else
        {
          var i = _.findIndex($mainScope.QnAs, { Id: $scope.qna.Id });
          $mainScope.QnAs[i] = $scope.qna;
        }
        $mainScope.qInit = dataservice.saveQnA($scope.qna, this.qnaForm.selectTags.$dirty);
        $modalInstance.close();
      }
    };

    $scope.cancel = function (){
      if (this.qnaForm.isEmpty())
      {
        $scope.qna.entityAspect.setDetached();
        dataservice.rejectChanges();
        $modalInstance.dismiss('cancel');
        return;
      }

      cancelChanges($modalInstance, function beforeRejectChanges(){
        $scope.qna.entityAspect.setDetached();
      });
    };
    
  })
  .config(function ($provide){

    // extending form directive with isEmpty() function
    $provide.decorator('formDirective', function ($delegate, $controller){
      var directive = $delegate[0];
      var controllerName = directive.controller;

      directive.controller = ['$element', '$attrs', '$scope', '$animate',
        function ($element, $attrs, $scope, $animate){
          var controller = $controller(controllerName, {
            $element: $element,
            $attrs: $attrs,
            $scope: $scope,
            $animate: $animate
          });

          controller.isEmpty = function (){
            if (this.$pristine)
            {
              return true;
            }

            var result = true;

            _($element[0]).each(function (control){
              var $c = $(control);

              if ($c.hasClass('select2-input') && $c.attr('id').match(/autogen/))
              {
                return;
              }

              if (!_.isEmpty($c.val()))
              {
                return (result = false);
              }
            });
            
            return result;
          };

          return controller;
        }
      ];
      
      return $delegate;
    });

  });