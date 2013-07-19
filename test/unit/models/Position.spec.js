describe('Testing EarthJsModel.XyzPosition', function () {
	var container = new EarthJsHelper.Container();
	EarthJsHelper.Container.instance.register('appInstance',{cameraDistance:300, dataPointDistance:120});

	it('should calculate latitude and longitude correctly', function(){
		var xyzPosition = new EarthJsModel.XyzPosition(70,69,70,120);
		var latLongPosition = xyzPosition.calculateLatitudeLongitude();
		expect(Math.round(latLongPosition.latitude)).to.equal(35);
		expect(Math.round(latLongPosition.longitude)).to.equal(-45);
	});
});

describe('Testing Model.LatLongPosition', function () {
	it('should calculate cartesian coordinates correctly', function(){
		var latLongPosition = new EarthJsModel.LatLongPosition(35,-45,120);
		expect(Math.round(latLongPosition.x)).to.equal(70);
		expect(Math.round(latLongPosition.y)).to.equal(69);
		expect(Math.round(latLongPosition.z)).to.equal(70);
	});
});