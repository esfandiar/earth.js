describe('Testing EarthJsHelper.Container', function () {
    it('should be able to register object and retrieve it later', function () {
        var container = new EarthJsHelper.Container();
        var objToBeRegistered = {'field1':1,'field2':2};
        container.register('obj1',objToBeRegistered);
        expect(container.dependencies['obj1']).to.deep.equal({'field1':1,'field2':2});
    });
});