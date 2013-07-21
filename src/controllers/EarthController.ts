/**
 * @author Esfandiar Maghsoudi / http://esfandiarmaghsoudi.ca
 */

///<reference path='DataPointController.ts'/>
///<reference path='../helpers/Camera.ts'/>
///<reference path='../helpers/Container.ts'/>

module EarthJsController{
	declare var THREE;

	export interface IEarthController{
		earthMesh: any;
		atmosphereMesh: any;
		camera: any;
		dataPointClicked(dataPoint: EarthJsModel.IDataPoint): void;
		clickDataPoint(dataPoint: EarthJsModel.IDataPoint): void;
		setTexture(textureUrl: string): void;
		setAtmosphereTexture(textureUrl: string): void;
	}

	export class EarthController implements IEarthController {
		earthMesh: any;
		atmosphereMesh: any;
		cameraHelper: EarthJsHelper.ICameraHelper;
		camera: any;
		scene: any;
		controls: any;

		constructor(scene: any, camera: any, controls: any){
			this.scene = scene;
			this.camera = camera;
			this.controls = controls;

			this.cameraHelper = new EarthJsHelper.CameraHelper(controls);
	        
	        var geometry =  new THREE.SphereGeometry(100, 20,20);
	        var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );

	       	this.earthMesh = new THREE.Mesh( geometry, material );

	       	var spriteMap = THREE.ImageUtils.loadTexture('');
		    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, useScreenCoordinates: false, blending: THREE.AdditiveBlending } );
			this.atmosphereMesh = new THREE.Sprite(spriteMaterial);
			this.atmosphereMesh.position.x = 0;
		    this.atmosphereMesh.position.y = 0;
		    this.atmosphereMesh.position.z = 0;
			this.atmosphereMesh.scale = new THREE.Vector3( 270, 270, 270 );
		    
		    this.earthMesh.add(this.atmosphereMesh);

	        scene.add( this.earthMesh );
		}

		clickDataPoint(dataPoint: EarthJsModel.IDataPoint): void{
			if (dataPoint != null && dataPoint != undefined){
				var dataPointsManager = EarthJsHelper.Container.instance.dependencies['dataInstance'];
				dataPointsManager.dataPointSelected(dataPoint);
			}
		}

		dataPointClicked(dataPoint: EarthJsModel.IDataPoint): void{
			this.cameraHelper.moveCameraToLatLongCoordinates(dataPoint.position);
		}

		// This method overrides the earth texture
		setTexture(textureUrl: string): void{
			var map = THREE.ImageUtils.loadTexture(textureUrl);
			this.earthMesh.material.map = map;
		}

		setAtmosphereTexture(textureUrl: string): void{
			var map = THREE.ImageUtils.loadTexture(textureUrl);
			this.atmosphereMesh.material.map = map;
		}
	}
}