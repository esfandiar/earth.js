/**
 * @author Esfandiar Maghsoudi / http://esfandiarmaghsoudi.ca
 */

///<reference path='../models/Position.ts'/>
///<reference path='Container.ts'/>

declare var TWEEN;

module EarthJsHelper {
	export interface ICameraHelper{
		controls: any;
		moveCameraToLatLongCoordinates(position: EarthJsModel.IPosition): void;
	}

	export class CameraHelper implements ICameraHelper {
		tween1: any;
		tween2: any;
		cameraIncrementStep: number;
		app: any;

		constructor(public controls: any){
			this.cameraIncrementStep = 0.2;
			this.app = EarthJsHelper.Container.instance.dependencies['appInstance'];
		}

		getIncrementBasedOnCameraPosition(cameraPosition: number, destinationPosition: number): number{
			var increment: number;

			if ((cameraPosition * destinationPosition) > 0){
				if (cameraPosition < destinationPosition)
					increment = this.cameraIncrementStep;
				else if (cameraPosition > destinationPosition)
					increment = -this.cameraIncrementStep;
				else
					increment = 0;
			}
			else if (cameraPosition < destinationPosition)
				increment = this.cameraIncrementStep;
			else
				increment = -this.cameraIncrementStep;

			return increment;
		}

		moveCameraToLatLongCoordinates(position: EarthJsModel.IPosition): void{
			var latitude = position.latitude;
			var longitude = position.longitude;
			var currentCameraXYZ = new EarthJsModel.XyzPosition(this.controls.object.position.x, this.controls.object.position.y, this.controls.object.position.z, 1000);
			var currentCameraLatLong = currentCameraXYZ.calculateLatitudeLongitude();
			var points = [];
			var currentLatitude: number;
			var currentLongitude: number;
			var latitudeIncrement: number;
			var longitudeIncrement: number;

			currentLatitude = currentCameraLatLong.latitude;
			currentLongitude = currentCameraLatLong.longitude;

			latitudeIncrement = this.getIncrementBasedOnCameraPosition(currentLatitude, latitude);
			longitudeIncrement = this.getIncrementBasedOnCameraPosition(currentLongitude, longitude);

			// First normalize the increments
			var latitudeDifference = Math.abs(Math.abs(currentLatitude) - Math.abs(latitude));
			var longitudeDifference = Math.abs(Math.abs(currentLongitude) - Math.abs(longitude));

			if (latitudeDifference > longitudeDifference)
				longitudeIncrement = longitudeIncrement / Math.abs(latitudeDifference / longitudeDifference);
			else
				latitudeIncrement = latitudeIncrement / Math.abs(longitudeDifference / latitudeDifference);
			
			while((Math.abs(currentLatitude - latitude) > this.cameraIncrementStep) || (Math.abs(currentLongitude - longitude) > this.cameraIncrementStep)){
				var cameraDistance = this.app.cameraDistance === null || this.app.cameraDistance === undefined ? 1000 : this.app.cameraDistance;
				var point = new EarthJsModel.LatLongPosition(currentLatitude, currentLongitude, cameraDistance);
				points.push(point);
				if (Math.abs(currentLatitude - latitude) > this.cameraIncrementStep)
					currentLatitude = currentLatitude + latitudeIncrement;
				if (Math.abs(currentLongitude - longitude) > this.cameraIncrementStep)
					currentLongitude = currentLongitude + longitudeIncrement;
			}
			
			var index = 0;
			var self = this;
			if (points.length > 0){
				var timer = setInterval(function(){
					self.controls.object.position.x = points[index].x;
					self.controls.object.position.y = points[index].y;
					self.controls.object.position.z = points[index].z;
					index = index + 1;
					if (index === points.length) {
						window.clearInterval(timer);
						points = null;
					}
				},5);
			}
		}

		moveCamera(destinationPosition: any, duration: number): void {
			var currentHeadXCoordinate = this.controls.object.position.x;
			var currentHeadYCoordinate = this.controls.object.position.y;
			var currentHeadZCoordinate = this.controls.object.position.z;
		
			var currentTargetXCoordinate = this.controls.target.x;
			var currentTargetYCoordinate = this.controls.target.y;
			var currentTargetZCoordinate = this.controls.target.z;
		
			var position1 = { x : currentHeadXCoordinate, y: currentHeadYCoordinate, z: currentHeadZCoordinate };
			var target1 = { x : destinationPosition.head.x, y: destinationPosition.head.y, z: destinationPosition.head.z };
		
			var position2 = { x : currentTargetXCoordinate, y: currentTargetYCoordinate, z: currentTargetZCoordinate};
			var target2 = { x : destinationPosition.target.x, y: destinationPosition.target.y, z: destinationPosition.target.z };

			var self = this;

			this.tween1 = new TWEEN.Tween({x:position1.x,y:position1.y,z:position1.z})
			.to(target1, duration * 1000)
			.easing(TWEEN.Easing.Cubic.InOut)
			.onUpdate(function(){
			    self.controls.object.position.x = this.x;
			    self.controls.object.position.y = this.y;
			    self.controls.object.position.z = this.z;
			})
			.start();
	    
			this.tween2 = new TWEEN.Tween({x:position2.x,y:position2.y,z:position2.z})
			.to(target2, duration * 1000)
			.easing(TWEEN.Easing.Cubic.InOut)
			.onUpdate(function(){
			    self.controls.target.x = this.x;
			    self.controls.target.y = this.y;
			    self.controls.target.z = this.z;
			})
			.start();
		}
	}
}