describe('Testing EarthJsHelper.Container', function () {
	var container = new EarthJsHelper.Container();
	container.register('appInstance',{});
	var cameraHelper;

    it('should get correct increment if camera position is less than destination position', function () {
        cameraHelper = new EarthJsHelper.CameraHelper();
        var cameraPosition = 20;
        var destinationPosition = 30;
        var increment = cameraHelper.getIncrementBasedOnCameraPosition(cameraPosition,destinationPosition);
        expect(increment).to.equal(cameraHelper.cameraIncrementStep);
        cameraPosition = -20;
        destinationPosition = -10;
        increment = cameraHelper.getIncrementBasedOnCameraPosition(cameraPosition,destinationPosition);
        expect(increment).to.equal(cameraHelper.cameraIncrementStep);
    });

    it('should get correct increment if camera position is more than destination position', function () {
        cameraHelper = new EarthJsHelper.CameraHelper();
        var cameraPosition = 30;
        var destinationPosition = 20;
        var increment = cameraHelper.getIncrementBasedOnCameraPosition(cameraPosition,destinationPosition);
        expect(increment).to.equal(-cameraHelper.cameraIncrementStep);
        var cameraPosition = -10;
        var destinationPosition = -20;
        increment = cameraHelper.getIncrementBasedOnCameraPosition(cameraPosition,destinationPosition);
        expect(increment).to.equal(-cameraHelper.cameraIncrementStep);
    });

    it('should get correct increment if camera position is same as destination position', function () {
        cameraHelper = new EarthJsHelper.CameraHelper();
        var cameraPosition = 30;
        var destinationPosition = 30;
        var increment = cameraHelper.getIncrementBasedOnCameraPosition(cameraPosition,destinationPosition);
        expect(increment).to.equal(0);
        cameraPosition = -30;
        destinationPosition = -30;
        increment = cameraHelper.getIncrementBasedOnCameraPosition(cameraPosition,destinationPosition);
        expect(increment).to.equal(0);
    });

    it('should move camera to right latitude and longitude - 1', function(done){
    	var htmlContainer = document.createElement('div');
    	document.body.appendChild(htmlContainer);
    	var camera = new THREE.PerspectiveCamera( 55, 2.7, 120, 400 );
        camera.position.x = 300;
        var controls = new THREE.TrackballControls( camera, htmlContainer );
        cameraHelper = new EarthJsHelper.CameraHelper(controls);

        var latitude = 20;
        var longitude = 30;

        var destinationPosition = new EarthJsModel.LatLongPosition(latitude,longitude);
        cameraHelper.moveCameraToLatLongCoordinates(destinationPosition);

        setTimeout(function(){
        	 var newPosition = (new EarthJsModel.XyzPosition(camera.position.x, camera.position.y, camera.position.z)).calculateLatitudeLongitude();
        	 expect(Math.round(newPosition.latitude)).to.equal(latitude);
        	 expect(Math.round(newPosition.longitude)).to.equal(longitude);
        	 done();
        }, 4000);
    });

    it('should move camera to right latitude and longitude - 2', function(done){
        var htmlContainer = document.createElement('div');
        document.body.appendChild(htmlContainer);
        var camera = new THREE.PerspectiveCamera( 55, 2.7, 120, 400 );
        camera.position.x = 300;
        var controls = new THREE.TrackballControls( camera, htmlContainer );
        cameraHelper = new EarthJsHelper.CameraHelper(controls);

        var latitude = 48.85661;
        var longitude = 2.35222;

        var destinationPosition = new EarthJsModel.LatLongPosition(latitude,longitude);
        cameraHelper.moveCameraToLatLongCoordinates(destinationPosition);

        setTimeout(function(){
             var newPosition = (new EarthJsModel.XyzPosition(camera.position.x, camera.position.y, camera.position.z)).calculateLatitudeLongitude();
             expect(Math.round(newPosition.latitude)).to.equal(Math.round(latitude));
             expect(Math.round(newPosition.longitude)).to.equal(Math.round(longitude));
             done();
        }, 4000);
    });
});