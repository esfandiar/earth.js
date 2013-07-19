/**
 * @author Esfandiar Maghsoudi / http://esfandiarmaghsoudi.ca
 */

///<reference path='../models/DataPoint.ts'/>

module EarthJsView {
	export interface IAnnotation{
		dataPoint: EarthJsModel.IDataPoint;
		getType():string;
		applyToEarth(): void;
		removeFromEarth(): void;
		hoveredOver():void;
		hoveredOut(): void;
	}
}