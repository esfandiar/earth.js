/**
 * @author Esfandiar Maghsoudi / http://esfandiarmaghsoudi.ca
 */

///<reference path='../models/DataPoint.ts'/>
///<reference path='../models/Position.ts'/>
///<reference path='../models/JsonDataPoint.ts'/>
///<reference path='../helpers/Container.ts'/>

module EarthJsController{
	export interface IDataPointController{
		selectDataPointById(dataPointId: string): void;
		dataPointSelected(dataPoint: EarthJsModel.IDataPoint): void;
		dataPointsLoaded(dataPoints: EarthJsModel.IDataPoint[]):void;
		loadDataPoints(jsonDataPoints: EarthJsModel.IJsonDataPoint[]): void;
		addDataPoint(jsonDataPoint: EarthJsModel.IJsonDataPoint): void;
		removeDataPoints(): void;
		removeDataPointById(id:string):void;
		dataPoints: EarthJsModel.IDataPoint[];
	}

	export class DataPointController implements IDataPointController{
		dataPoints: EarthJsModel.IDataPoint[];
		static instance: EarthJsController.IDataPointController;

		constructor(public dataPointSelectedCallBack: (dataPoint: EarthJsModel.IDataPoint) => void){
			EarthJsController.DataPointController.instance = this;
			this.dataPoints = [];
		}

		loadDataPoints(jsonDataPoints: EarthJsModel.IJsonDataPoint[]): void{
			this.removeDataPoints();
			var dataPoints = [];
			for (var i = 0; i < jsonDataPoints.length; i++){
				var jsonDataPoint = jsonDataPoints[i];
				dataPoints.push(EarthJsModel.DataPoint.createDataPointFromJsonDataPoint(jsonDataPoint));
			}
			EarthJsController.DataPointController.instance.dataPointsLoaded(dataPoints);
		}

		selectDataPointById(dataPointId: string): void{
			for (var i = 0; i < this.dataPoints.length; i++){
				if (this.dataPoints[i].id === dataPointId){
					this.dataPointSelected(this.dataPoints[i]);
				}
			}
		}

		addDataPoint(jsonDataPoint: EarthJsModel.IJsonDataPoint): void{
			var newDataPoint = EarthJsModel.DataPoint.createDataPointFromJsonDataPoint(jsonDataPoint);
			this.dataPoints.push(newDataPoint);
			newDataPoint.annotation.applyToEarth();
		}

		removeDataPoints(): void{
			if (this.dataPoints === null || this.dataPoints === undefined)
				return;
			for (var i = 0; i < this.dataPoints.length; i++){
				if (this.dataPoints[i].annotation.getType() !== 'earthTexture')
					this.dataPoints[i].annotation.removeFromEarth();
			}
			EarthJsController.DataPointController.instance.dataPointsLoaded([]);
		}

		removeDataPointById(id:string):void{
			var deletingIndex = -1;
			for (var i = 0; i < this.dataPoints.length; i++){
				if (this.dataPoints[i].id === id){
					this.dataPoints[i].annotation.removeFromEarth();
					deletingIndex = i;
					break;
				}
			}

			if (deletingIndex != -1)
			this.dataPoints.splice(deletingIndex,1);
		}

		dataPointSelected(dataPoint: EarthJsModel.IDataPoint): void{
			var earthManager = EarthJsHelper.Container.instance.dependencies['earthInstance'];
			earthManager.dataPointClicked(dataPoint);
			if (this.dataPointSelectedCallBack != null && this.dataPointSelectedCallBack != undefined)
				this.dataPointSelectedCallBack(dataPoint);
		}

		dataPointsLoaded(dataPoints: EarthJsModel.IDataPoint[]):void {
			EarthJsController.DataPointController.instance.dataPoints = dataPoints;

			for (var i = 0; i < this.dataPoints.length; i++)
				this.dataPoints[i].annotation.applyToEarth();
		}
	}
}