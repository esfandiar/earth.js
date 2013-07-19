/**
 * @author Esfandiar Maghsoudi / http://esfandiarmaghsoudi.ca
 */

angular
.module('earthModule', [])
.directive('earth', function ($compile) {
    return {
        restrict:'E',
        link:function ($scope, element, attrs) {
            var earthDiv = angular.element('<div></div>');
            element.append(earthDiv);
            $compile(earthDiv)($scope);
            
            var appInstance = new EarthJsApp.App(earthDiv[0]);

            $scope.$watch('dataPoints', function (newValue) {
                var dataPoints = newValue;
                var jsonDataPoints = [];

                for(var i = 0; i < dataPoints.length; i++){
                    jsonDataPoints.push({
                        id: dataPoints[i].id,
                        title: dataPoints[i].title,
                        latitude: dataPoints[i].latitude,
                        longitude: dataPoints[i].longitude,
                        detail: dataPoints[i].detail,
                        annotationType: 'dot',
                        annotationImage: dataPoints[i].annotationImage
                    });
                }

                appInstance.setDataPoints(jsonDataPoints);
            }, true);

            $scope.$watch('earthTexture', function (newValue) {
                var earthTexture = newValue;
                appInstance.setEarthTexture(earthTexture);
            });

            var width = 0;
            var height = 0;

            if (attrs.width === 'fullScreen'){
                width = 0;
            }
            //else if (attrs.width.indexOf('%') > 0){
                //earthDiv.style.width = attrs.width;
                //width = earthDiv.offsetWidth;
            //}
            else {
                width = parseInt(attrs.width);
            }

            if (attrs.height === 'fullScreen'){
                height = 0;
            }
            //else if (attrs.height.indexOf('%') > 0){
                //earthDiv.style.height = attrs.height;
                //height = earthDiv.offsetHeight;
            //}
            else {
                height = parseInt(attrs.height);
                //earthDiv.style.height = height + 'px';
            }

            appInstance.setSize(width, height);

            appInstance.start();

            if (attrs.datapointclickedcallback != null && attrs.datapointclickedcallback != undefined){
                appInstance.setDataPointClickedCallback(function(dataPoint){
                    $scope[attrs.datapointclickedcallback](dataPoint);
                });
            }
        }
    };
});