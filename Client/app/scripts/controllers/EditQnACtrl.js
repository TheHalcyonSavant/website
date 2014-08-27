'use strict';

angular.module('clientApp')
  .controller('EditQnACtrl', function ($scope, $modalInstance, dataservice, allTags, qna, cancelChanges){

    var isNew = _.isEmpty(qna);

    $scope.allTags = allTags;
    $scope.qna = qna || dataservice.createQnA();

    $scope.setFocus = function (element){
      if (isNew && this.qnaForm.isEmpty())
      {
        $(element).focus();
      }
    };

		$scope.save = function (){
      if (this.qnaForm.$valid)
      {
        $modalInstance.close(isNew ? $scope.qna : null);
      }
    };

    $scope.cancel = function (){
      if (this.qnaForm.isEmpty())
      {
        dataservice.rejectChanges();
        $modalInstance.dismiss('cancel');
        return;
      }

      cancelChanges($modalInstance);
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