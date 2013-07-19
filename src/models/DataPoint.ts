/**
 * @author Esfandiar Maghsoudi / http://esfandiarmaghsoudi.ca
 */

///<reference path='Position.ts'/>
///<reference path='JsonDataPoint.ts'/>
///<reference path='../views/IAnnotation.ts'/>
///<reference path='../views/DotAnnotation.ts'/>
///<reference path='../views/EarthTextureAnnotation.ts'/>

module EarthJsModel {
	export interface IDataPoint{
		id: string;
		title: string;
		position: EarthJsModel.IPosition;
		detail: string;
		annotationType: string;
		annotationImage: string;
		annotation: EarthJsView.IAnnotation;
	}

	export class DataPoint implements IDataPoint {
		public annotation: EarthJsView.IAnnotation;
		constructor(
			public id: string,
			public title: string,
			public position: EarthJsModel.IPosition,
			public detail: string,
			public annotationType: string,
			public annotationImage: string)
		{
			if (this.annotationType === 'dot'){
				this.annotation = new EarthJsView.DotAnnotation(this);
			}
			else if (this.annotationType === 'earthTexture'){
				this.annotation = new EarthJsView.EarthTextureAnnotation(this);
			}
		}

		static createDataPointFromJsonDataPoint(jsonDataPoint: EarthJsModel.IJsonDataPoint): EarthJsModel.IDataPoint{
			var dataPoint = new EarthJsModel.DataPoint(jsonDataPoint.id, 
							jsonDataPoint.title === null || jsonDataPoint.title === undefined ? '' : jsonDataPoint.title, 
							new EarthJsModel.LatLongPosition(
								jsonDataPoint.latitude === null || jsonDataPoint.latitude === undefined ? 0 : jsonDataPoint.latitude, 
								jsonDataPoint.longitude === null || jsonDataPoint.longitude === undefined ? 0 : jsonDataPoint.longitude), 
							jsonDataPoint.detail === null || jsonDataPoint.detail === undefined ? '' : jsonDataPoint.detail, 
							jsonDataPoint.annotationType === null || jsonDataPoint.annotationType === undefined ? 'dot' : jsonDataPoint.annotationType,
							jsonDataPoint.annotationImage === null || jsonDataPoint.annotationImage === undefined ? '' : jsonDataPoint.annotationImage
							);
			return dataPoint;
		}
	}
}