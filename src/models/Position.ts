/**
 * @author Esfandiar Maghsoudi / http://esfandiarmaghsoudi.ca
 */

///<reference path='../helpers/Container.ts'/>

module EarthJsModel {
	export interface IPosition{
		x: number;
		y: number;
		z: number;
		latitude: number;
		longitude: number;
		earthRadius: number;
	}

	export class XyzPosition implements IPosition {
		earthRadius: number;
		latitude: number;
		longitude: number;
		
		constructor(public x: number, public y: number, public z: number, earthRadius?: any){
			if (earthRadius != null && earthRadius != undefined)
				this.earthRadius = earthRadius;
			else
				this.earthRadius = Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2));
		}

		calculateLatitudeLongitude(): IPosition {
			var x = this.x;
			var z = this.y;
			var y = -this.z;

			var radiusScale = 6378137 / this.earthRadius;

			x = x * radiusScale;
			y = y * radiusScale;
			z = z * radiusScale;

			var b, ep, p, th, lon, lat, n, alt;
			
			/* Constants (WGS ellipsoid) */
			var a = 6378137;
			var e = 8.1819190842622e-2;
			var pi = 3.141592653589793;
			
			/* Calculation */
			b = Math.sqrt(Math.pow(a,2)*(1-Math.pow(e,2)));
			ep = Math.sqrt((Math.pow(a,2)-Math.pow(b,2))/Math.pow(b,2));
			p = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
			th = Math.atan2(a*z, b*p);
			lon = Math.atan2(y, x);
			lat = Math.atan2((z+ep*ep*b*Math.pow(Math.sin(th),3)), (p-e*e*a*Math.pow(Math.cos(th),3)));
			n = a/Math.sqrt(1-e*e*Math.pow(Math.sin(lat),2));
			alt = p/Math.cos(lat)-n;	
			lat = (lat*180)/pi;
			lon = (lon*180)/pi;

			var latLong = new LatLongPosition(lat, lon);

			return latLong;
		}
	}

	export class LatLongPosition{
		x: number;
		y: number;
		z: number;
		earthRadius: number;

		constructor(public latitude: number, public longitude: number, earthRadius?: any){
			if (earthRadius != null && earthRadius != undefined)
				this.earthRadius = earthRadius;
			else
				this.earthRadius = EarthJsHelper.Container.instance.dependencies['appInstance'].dataPointDistance;

			this.calculateCartesianCoordinates();
		}

		calculateCartesianCoordinates(): void {
			var originalLatitude = this.latitude;
			var originalLongitude = this.longitude;
			
			this.latitude = this.latitude * Math.PI / 180;
			this.longitude = this.longitude * Math.PI / 180;

			this.x = this.getX();
			this.y = this.getY();
			this.z = this.getZ();

			this.latitude = originalLatitude;
			this.longitude = originalLongitude;
		}
		
		getX():number{
			var x = this.earthRadius * Math.cos(this.longitude) * Math.cos(this.latitude);
			return x;
		}

		getY():number{
			var y = this.earthRadius * Math.sin(this.latitude);
			return y;
		}

		getZ():number{
			var z = this.earthRadius * Math.cos(this.latitude) * Math.sin(this.longitude) * -1;
			return z;
		}
	}
}