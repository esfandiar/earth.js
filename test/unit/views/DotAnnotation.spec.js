describe('Testing EarthJsView.DotAnnotation', function () {
	it('should get the right type',function(){
		var dotAnnotation = new EarthJsView.DotAnnotation(null);
		expect(dotAnnotation.getType()).to.equal('dot');
	});
});