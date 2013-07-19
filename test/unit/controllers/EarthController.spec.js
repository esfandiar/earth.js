describe('Testing EarthJsController.EarthController', function () {
	var scene, camera, htmlContainer, controls, earthController, dataPointController;

	beforeEach(function(){
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(55, 2.7, 120, 400);
		htmlContainer = document.createElement('div');
    	document.body.appendChild(htmlContainer);
		controls = new THREE.TrackballControls(camera, htmlContainer);
		earthController = new EarthJsController.EarthController(scene, camera, controls);
		dataPointController = new EarthJsController.DataPointController();
		new EarthJsHelper.Container();
		EarthJsHelper.Container.instance.register('appInstance', {});
		EarthJsHelper.Container.instance.register('dataInstance', dataPointController);
		EarthJsHelper.Container.instance.register('earthInstance', earthController);
	});

	it('should trigger dataPointClicked event when dataPoint is clicked', function(done){
		dataPointController.loadDataPoints([getAJsonDataPointWithId('id')]);
		var dataPoint = dataPointController.dataPoints[0];
		
		earthController.dataPointClicked = function(selectedDataPoint){
			expect(selectedDataPoint.id).to.equal('id');
			done();
		};

		earthController.clickDataPoint(dataPoint);
	})
});