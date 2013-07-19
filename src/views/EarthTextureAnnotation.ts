/**
 * @author Esfandiar Maghsoudi / http://esfandiarmaghsoudi.ca
 */

///<reference path='IAnnotation.ts'/>
///<reference path='../helpers/Container.ts'/>

module EarthJsView {
	declare var THREE;

	export class EarthTextureAnnotation implements IAnnotation {
		earthManager: any;

		constructor(public dataPoint: EarthJsModel.IDataPoint){
			this.earthManager = EarthJsHelper.Container.instance.dependencies['earthInstance'];
		}

		getType(): string {
			return 'earthTexture';
		}

		applyToEarth(): void {
			// If there is not earth manager, we cannot apply the annotation
			if (this.earthManager === null || this.earthManager === undefined || 
				this.earthManager.earthMesh === null || this.earthManager.earthMesh === undefined)
				return;
				
	        var map = THREE.ImageUtils.loadTexture(this.dataPoint.annotationImage);
	        this.earthManager.earthMesh.material.map = map;
		}

		removeFromEarth(): void {
			// If there is not earth manager, we cannot apply the annotation
			if (this.earthManager === null || this.earthManager === undefined || 
				this.earthManager.earthMesh === null || this.earthManager.earthMesh === undefined)
				return;
		}

		hoveredOver():void{}

		hoveredOut(): void{}
	}
}