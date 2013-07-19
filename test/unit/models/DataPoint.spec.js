describe('Testing EarthJsModel.DataPoint', function () {
	beforeEach(function(){
		new EarthJsHelper.Container();
		EarthJsHelper.Container.instance.register('appInstance', {});
	});

	it('should create the right annotation type', function() {
		var dataPoint = new EarthJsModel.DataPoint('', '', null, '', 'dot', '');
		expect(dataPoint.annotation.getType()).to.equal('dot');
	});

	it('should create the right data point from json data point', function() {
		var jsonDataPoint = getAJsonDataPointWithId('id');
		var dataPoint = EarthJsModel.DataPoint.createDataPointFromJsonDataPoint(jsonDataPoint);
		expect(dataPoint.id).to.equal(jsonDataPoint.id);
		expect(dataPoint.title).to.equal(jsonDataPoint.title);
		expect(dataPoint.position.latitude).to.equal(jsonDataPoint.latitude);
		expect(dataPoint.position.longitude).to.equal(jsonDataPoint.longitude);
		expect(dataPoint.detail).to.equal(jsonDataPoint.detail);
		expect(dataPoint.annotation.getType()).to.equal(jsonDataPoint.annotationType);
		expect(dataPoint.annotationImage).to.equal(jsonDataPoint.annotationImage);
	});
});