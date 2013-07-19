/**
 * @author Esfandiar Maghsoudi / http://esfandiarmaghsoudi.ca
 */

(function($) {
    $.fn.earth = function(options) {
    	var appInstances = [];

    	var settings = $.extend({
		    dataPointClickedCallback:null,
		    width:0,
		    height:0
		}, options);

    	var plugin = this.each( function() {
    		var appInstance = new EarthJsApp.App(this);

    		var widht = 0;
            var height = 0;

            if (settings.width === 'fullScreen'){
                width = 0;
            }
            //else if (settings.width.indexOf('%') > 0){
                //this.style.width = settings.width;
                //width = this.offsetWidth;
            //}
            else{
                width = parseInt(settings.width);
            }

            if (settings.height === 'fullScreen'){
                height = 0;
            }
            //else if (settings.height.indexOf('%') > 0){
                //this.style.height = settings.height;
                //height = this.offsetHeight;
            //}
            else{
                height = parseInt(settings.height);
            }

            appInstance.setSize(width, height);
            
    		appInstance.start();
    		appInstances.push(appInstance);
		    if ( $.isFunction( settings.dataPointClickedCallback ) ) {
		    	appInstance.setDataPointClickedCallback(settings.dataPointClickedCallback);
		    }
		});

		plugin.setDataPoints = function(dataPoints){
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

			for (var i = 0; i < appInstances.length; i++){
				appInstances[i].setDataPoints(jsonDataPoints);
			}
		};

		plugin.setEarthTexture = function(textureUrl){
			for (var i = 0; i < appInstances.length; i++){
				appInstances[i].setEarthTexture(textureUrl);
			}
		}

		plugin.addDataPoint = function(dataPoint){
			for (var i = 0; i < appInstances.length; i++){
				appInstances[i].addDataPoint({
					id: dataPoint.id,
					title: dataPoint.title,
					latitude: dataPoint.latitude,
					longitude: dataPoint.longitude,
					detail: dataPoint.detail,
					annotationType: 'dot',
					annotationImage: dataPoint.annotationImage
				});
			}
		}

		plugin.removeDataPointById = function(dataPointId){
			for (var i = 0; i < appInstances.length; i++){
				appInstances[i].removeDataPointById(dataPointId);
			}
		}

		return plugin;
    }
}(jQuery));