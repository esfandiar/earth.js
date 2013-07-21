/**
 * @author Esfandiar Maghsoudi / http://esfandiarmaghsoudi.ca
 */

///<reference path='controllers/EarthController.ts'/>
///<reference path='models/RenderHook.ts'/>
///<reference path='helpers/Container.ts'/>

module EarthJsApp {
	declare var THREE;
	declare var TWEEN;
	declare var Detector;

	var _renderer, _scene, _camera, _mesh, _controls, _container, _projector, _mainObject;
	var lastRenderTime = new Date();
	var _width = 400, _height = 150;
	var _aspect = 2.7,
	_near = 120,
	_far = 600,
	_renderHooks = [];
	var _mouse = { x: 0, y: 0 };
	var _lastMouse = { x: 0, y: 0 };
	var _lastMouseMovement = { x: 0, y: 0 };
	var hoveredDataPoint: EarthJsModel.IDataPoint;

	function render() {
		for (var i = 0; i < _renderHooks.length; i++){
			if (_renderHooks[i].method != null && _renderHooks[i].caller != null)
				_renderHooks[i].method(_renderHooks[i].caller);
		}
		_renderer.render( _scene, _camera );
	}

	function animate(renderTime) {
		requestAnimationFrame( function(){animate(new Date());} );

		if ((renderTime - +lastRenderTime) > 33){
			TWEEN.update();
			_controls.update();
			render();
			lastRenderTime = renderTime;
		}
	}

	export interface IApp{
		cameraDistance: number;
		dataPointDistance: number;
		registerRenderHook(name: string, caller: any, method:(obj: any) => void);
		unregisterRenderHook(name: string, caller: any);
		detectEvent(): any;
		setDataPoints(dataPoints: EarthJsModel.IJsonDataPoint[]);
		setDataPointClickedCallback(dataPointClickedCallback: (dataPoint: EarthJsModel.IDataPoint) => void);
		findElementPosition(obj: any): any;
	}

	export class App implements IApp {
		earthManager: EarthJsController.IEarthController;
		cameraDistance: number;
		dataPointDistance: number;
		static instance: EarthJsApp.IApp;
		container: EarthJsHelper.IContainer;

		constructor(public htmlContainer: any){
			_container = htmlContainer;
			this.container = new EarthJsHelper.Container();
			EarthJsApp.App.instance = this;
			this.container.register('appInstance', EarthJsApp.App.instance);
			_mainObject = this;
			this.cameraDistance = 300;
			this.dataPointDistance = 120;
		}

		registerRenderHook(name: string, caller: any, method:(obj: any) => void){
			for (var i = 0; i < _renderHooks.length; i++){
				if (_renderHooks[i].name === name && _renderHooks[i].caller === caller){
					_renderHooks[i].caller = caller;
					_renderHooks[i].method = method;
					return;
				}
			}
			_renderHooks.push({name: name, caller: caller, method: method});
		}

		unregisterRenderHook(name: string, caller: any){
			for (var i = 0; i < _renderHooks.length; i++){
				if (_renderHooks[i].name === name && _renderHooks[i].caller === caller){
					_renderHooks[i].caller = null;
					_renderHooks[i].method = null;
					return;
				}
			}
		}

		public start(): void {
			this.init();
			animate(new Date());
		}

		public setDataPoints(dataPoints: EarthJsModel.IJsonDataPoint[]): void{
			var dataInstance = EarthJsHelper.Container.instance.dependencies['dataInstance'];
			dataInstance.loadDataPoints(dataPoints);
		}

		public removeDataPoints(): void{
			var dataInstance = EarthJsHelper.Container.instance.dependencies['dataInstance'];
			dataInstance.removeDataPoints();
		}

		public removeDataPointById(id: string): void{
			var dataInstance = EarthJsHelper.Container.instance.dependencies['dataInstance'];
			dataInstance.removeDataPointById(id);
		}

		public addDataPoint(dataPoint: EarthJsModel.IJsonDataPoint): void{
			var dataInstance = EarthJsHelper.Container.instance.dependencies['dataInstance'];
			dataInstance.addDataPoint(dataPoint);
		}

		public setDataPointClickedCallback(dataPointClickedCallback: (dataPoint: EarthJsModel.IDataPoint) => void){
			var dataInstance = EarthJsHelper.Container.instance.dependencies['dataInstance'];
			dataInstance.dataPointSelectedCallBack = dataPointClickedCallback;
		}

		public setEarthTexture(textureUrl: string): void{
			this.earthManager.setTexture(textureUrl);
		}

		public setAtmosphereTexture(textureUrl: string): void{
			this.earthManager.setAtmosphereTexture(textureUrl);
		}

		public setSize(width: number, height: number): void{
			_width = width;
			_height = height;
		}

		private init(): void{
			this.setupScene();
			this.setupCamera();
			this.setupEvents();

			var dataPointsManager = new EarthJsController.DataPointController(null);
			this.container.register('dataInstance', dataPointsManager);

			this.earthManager = new EarthJsController.EarthController(_scene, _camera, _controls);
			this.container.register('earthInstance', this.earthManager);

			var earthTexture = new EarthJsModel.JsonDataPoint('0','EarthTexture', 0,0,'','earthTexture','/examples/images/EarthTexture.jpg');
			dataPointsManager.loadDataPoints([earthTexture]);
		}

		private setupScene(): void {
			_scene = new THREE.Scene();
			_projector = new THREE.Projector();
			_renderer = Detector.webgl? new THREE.WebGLRenderer(): new THREE.CanvasRenderer();
			_renderer.setSize( _width, _height );
			_container.appendChild(_renderer.domElement);
		}

		private setupCamera(): void{
			_camera = new THREE.PerspectiveCamera( 55, _aspect, _near, _far );
			_camera.position.x = this.cameraDistance;

			_controls = new THREE.TrackballControls( _camera, _container );

			_controls.rotateSpeed = 1.0;
			_controls.zoomSpeed = 0.05;
			_controls.panSpeed = 0.2;

			_controls.noZoom = false;
			_controls.noPan = false;

			_controls.staticMoving = false;
			_controls.dynamicDampingFactor = 0.3;
			_controls.minDistance = 250;
			_controls.maxDistance = 350;

			_controls.keys = [ 65, 83, 68 ];
		}

		private setupEvents(): void {
			window.addEventListener( 'resize', this.onWindowResize, false );
			_container.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
			_container.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
			_container.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
			this.onWindowResize(null);
		}

		public detectEvent(): void{
			var vector = new THREE.Vector3( _mouse.x, _mouse.y, 0.5 );
			_projector.unprojectVector( vector, _camera );
			var raycaster = new THREE.Raycaster( _camera.position, vector.sub( _camera.position ).normalize() );

			var intersects = raycaster.intersectObjects(_mainObject.earthManager.earthMesh.children, true);
			if ( intersects.length > 0 ){
				var selectedModel = intersects[ 0 ].object.parent;
				if (hoveredDataPoint != selectedModel.dataPoint){
					hoveredDataPoint = selectedModel.dataPoint;
					if (hoveredDataPoint != null && hoveredDataPoint != undefined){
						hoveredDataPoint.annotation.hoveredOver();
					}
				}
			}
			else {
				this.hoveredOut();
			}

			_lastMouseMovement.x = _mouse.x;
			_lastMouseMovement.y = _mouse.y;
		}

		private hoveredOut(): void{
			if (hoveredDataPoint != null)
				hoveredDataPoint.annotation.hoveredOut();
			hoveredDataPoint = null;
		}

		private onDocumentMouseMove(event): void{
      		var containerPos = EarthJsApp.App.instance.findElementPosition(_container);
      		if (event.clientX > (containerPos.x + _width) || event.clientY > (containerPos.y + _height))
      			return;

      		var positionInContainer  = { x:event.clientX - containerPos.x, y:event.clientY - containerPos.y };
      		_mouse.x = ( positionInContainer.x / _width ) * 2 - 1;
			_mouse.y = - ( positionInContainer.y / _height ) * 2 + 1;

			if (Math.abs(_lastMouseMovement.x - _mouse.x) > 0.01 || Math.abs(_lastMouseMovement.y - _mouse.y) > 0.01){
				EarthJsApp.App.instance.detectEvent();
			}
		}

		public findElementPosition(obj: any): any {
			var curleft: number;
			var curtop: number;
			curleft = 0;
			curtop = 0;
			if (obj.offsetParent) {
				do {
					curleft += obj.offsetLeft;
					curtop += obj.offsetTop;
				} while (obj = obj.offsetParent);
			}
			return {x:curleft,y:curtop};
		}

		private onDocumentMouseUp(event): void {
			event.preventDefault();

			_mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			_mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			var delta = {x:0, y:0};
			delta.x = Math.abs(_mouse.x - _lastMouse.x);
			delta.y = Math.abs(_mouse.y - _lastMouse.y);

			if (delta.x < 0.001 && delta.y < 0.001){
				if (hoveredDataPoint != null && hoveredDataPoint != undefined)
					_mainObject.earthManager.clickDataPoint(hoveredDataPoint);
			}
		}

		private onDocumentMouseDown(event): void {
			_lastMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			_lastMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		}

		private onWindowResize(event): void {
			var width = _width === 0 ? window.innerWidth : _width;
			var height = _height === 0 ? window.innerHeight : _height;

			_camera.aspect = width / height;
			_camera.updateProjectionMatrix();

			_renderer.setSize( width, height );
			_renderer.domElement.style.width = width + 'px';
			_renderer.domElement.style.height = height + 'px';
		}
	}
}