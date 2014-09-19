'use strict';

angular.module('clientApp')
  .directive('thsZoomInput', function (){
    return {
      restrict: 'A',
      link: function (scope, $elem){
        var $inputs = $elem.find('input'),
          zoomHandler = function (event){
            var that = this;

            $inputs.each(function (){
              $(this).closest('[class^=col-md]')
                [(event.data.isFocus ? 'add' : 'remove') + 'Class'](
                  'anim-zoom-' + (this === that ? 'in' : 'out')
                );
            });
          };

        $inputs
          .focus({ isFocus: true }, zoomHandler)
          .blur({ isFocus: false}, zoomHandler);
      }
    };
  });