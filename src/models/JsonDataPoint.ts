/**
 * @author Esfandiar Maghsoudi / http://esfandiarmaghsoudi.ca
 */

module EarthJsModel {
	export interface IJsonDataPoint{
		id: string;
		title: string;
		latitude: number;
		longitude: number;
		detail: string;
		annotationType: string;
		annotationImage: string;
	}

	export class JsonDataPoint implements IJsonDataPoint {
		constructor(
			public id: string,
			public title: string, 
			public latitude: number,
			public longitude: number,
			public detail: string,
			public annotationType: string,
			public annotationImage: string
			)
		{ }
	}
}