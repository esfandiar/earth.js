describe('Testing EarthJsView.EarthTextureAnnotation', function () {
	it('should get the right type',function(){
		var earthTextureAnnotation = new EarthJsView.EarthTextureAnnotation(null);
		expect(earthTextureAnnotation.getType()).to.equal('earthTexture');
	});
});