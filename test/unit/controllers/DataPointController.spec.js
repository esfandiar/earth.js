describe('Testing EarthJsController.DataPointController', function () {
	var dataPointController;
	var container = new EarthJsHelper.Container();
	container.register('appInstance',{});

	beforeEach(function(){
		jsonDataPoints = [];
		dataPointController = new EarthJsController.DataPointController();
	});

	it('should load data points', function(){
		dataPointController.loadDataPoints([getAJsonDataPointWithId('id')]);
		expect(dataPointController.dataPoints.length).to.equal(1);

		var dataPoint = dataPointController.dataPoints[0];
		expect(dataPoint.id).to.equal('id');
		expect(dataPoint.title).to.equal('title');
		expect(dataPoint.position.latitude).to.equal(20);
		expect(dataPoint.position.longitude).to.equal(30);
		expect(dataPoint.detail).to.equal('some detail');
		expect(dataPoint.annotationType).to.equal('dot');
		expect(dataPoint.annotationImage).to.equal('');
	});

	it('should add a new data point', function(){
		dataPointController.removeDataPoints();
		expect(dataPointController.dataPoints.length).to.equal(0);
		dataPointController.addDataPoint(getAJsonDataPointWithId('id1'));
		expect(dataPointController.dataPoints.length).to.equal(1);
		dataPointController.addDataPoint(getAJsonDataPointWithId('id2'));
		expect(dataPointController.dataPoints.length).to.equal(2);
		expect(dataPointController.dataPoints[0].id).to.equal('id1');
		expect(dataPointController.dataPoints[1].id).to.equal('id2');
	});

	it('should remove all data points', function(){
		dataPointController.loadDataPoints([getAJsonDataPointWithId('id')]);
		expect(dataPointController.dataPoints.length).to.equal(1);

		dataPointController.removeDataPoints();
		expect(dataPointController.dataPoints.length).to.equal(0);
	});

	it('should remove a data point by id', function(){
		dataPointController.loadDataPoints([
			getAJsonDataPointWithId('1'),
			getAJsonDataPointWithId('2')]);
		expect(dataPointController.dataPoints.length).to.equal(2);

		dataPointController.removeDataPointById('1');
		expect(dataPointController.dataPoints.length).to.equal(1);
		var dataPoint = dataPointController.dataPoints[0];
		expect(dataPoint.id).to.equal('2');
		expect(dataPoint.title).to.equal('title');
		expect(dataPoint.position.latitude).to.equal(20);
		expect(dataPoint.position.longitude).to.equal(30);
		expect(dataPoint.detail).to.equal('some detail');
		expect(dataPoint.annotationType).to.equal('dot');
		expect(dataPoint.annotationImage).to.equal('');
	});

	it('should select data point by and call callback and invoke earthManager dataPointClicked', function(done){
		var callbackCalled = false;
		var earthCallbackCalled = false;

		EarthJsHelper.Container.instance.register('earthInstance',{dataPointClicked: function(selectedDataPoint){
			expect(selectedDataPoint.id).to.equal('2');
			earthCallbackCalled = true;
			if (callbackCalled)
				done();
		}});

		dataPointController = new EarthJsController.DataPointController(function(selectedDataPoint){
			expect(selectedDataPoint.id).to.equal('2');
			callbackCalled = true;
			if (earthCallbackCalled)
				done();
		});

		dataPointController.loadDataPoints([
			getAJsonDataPointWithId('1'),
			getAJsonDataPointWithId('2')]);

		dataPointController.selectDataPointById('2');
	})
});