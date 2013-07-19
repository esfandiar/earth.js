/**
 * @author Esfandiar Maghsoudi / http://esfandiarmaghsoudi.ca
 */

///<reference path='IAnnotation.ts'/>
///<reference path='../models/Position.ts'/>
///<reference path='../helpers/Container.ts'/>

module EarthJsView {
	declare var THREE;
	
	export class DotAnnotation implements EarthJsView.IAnnotation {
		mesh: any;
		hasHoveredOver: bool;
		hasHoveredOut: bool;
		currentSize: number;
		earthManager: any;
		app: any;

		constructor(public dataPoint: EarthJsModel.IDataPoint){
			this.currentSize = 1;
			this.earthManager = EarthJsHelper.Container.instance.dependencies['earthInstance'];
		    this.app = EarthJsHelper.Container.instance.dependencies['appInstance'];
		}

		getType(): string {
			return 'dot';
		}

		applyToEarth(): void {
			// If there is not earth manager, we cannot apply the annotation
			if (this.earthManager === null || this.earthManager === undefined || 
				this.earthManager.earthMesh === null || this.earthManager.earthMesh === undefined)
				return;

			// Create the map for the main mesh
			var map = new THREE.ImageUtils.loadTexture(this.dataPoint.annotationImage);
	        var material = new THREE.MeshBasicMaterial( { map: map } );
	        material.transparent = true;
	        material.opacity = 0;
	        material.depthWrite = false;

	        // Create the map for the label mesh
	        var labelMaterial = new THREE.MeshBasicMaterial();
	        labelMaterial.transparent = true;
	        labelMaterial.opacity = 0;
	        labelMaterial.depthWrite = false;

	        var self = this;

	        if (map.image != null && map.image != undefined){
		        map.image.onload = function() {
		        	self.mesh = new THREE.Object3D();
		        	self.mesh.overdraw = true;

		        	// Add main mesh
		        	var width = 10;
		        	var height = 10;
		        	var objectMesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
					self.mesh.add(objectMesh);

					// Add label mesh
					if (self.dataPoint.title != null && self.dataPoint.title != undefined && self.dataPoint.title != ''){
				        var labelShape = THREE.FontUtils.generateShapes( self.dataPoint.title, {
						  font: 'helvetiker',
						  weight: 'bold',
						  size: 3
						} );
						var labelGeometry = new THREE.ShapeGeometry( labelShape );
						var labelMesh = new THREE.Mesh( labelGeometry, labelMaterial );
						self.mesh.add(labelMesh);
						var labelMeshHalfSize = labelMesh.geometry.boundingSphere.radius / 2;
						labelMesh.position.y = -height;
						labelMesh.position.x = -labelMeshHalfSize;
					}
					
					// Setup the grouping mesh
					self.mesh.position.x = self.dataPoint.position.x;
			        self.mesh.position.y = self.dataPoint.position.y;
			        self.mesh.position.z = self.dataPoint.position.z;
					self.mesh.dataPoint = self.dataPoint;
					self.mesh.lookAt(self.earthManager.camera.position);
					self.earthManager.earthMesh.add(self.mesh);
					self.app.registerRenderHook('dotAnnotation', self, self.onRender);		        
				};
			}

			// Fade in the material of the meshes
			var opacityTimer = setInterval(function(){
				if (material.opacity <= 0.99){
					material.opacity += 0.01;
	        		labelMaterial.opacity += 0.01;
	        	}
	        	else{
	        		material.opacity = 1;
	        		labelMaterial.opacity = 1;
	        		clearInterval(opacityTimer);
	        	}
			},10);
		}

		removeFromEarth(): void {
			// If there is not earth manager, we cannot apply the annotation
			if (this.earthManager === null || this.earthManager === undefined || 
				this.earthManager.earthMesh === null || this.earthManager.earthMesh === undefined)
				return;
				
			var opacity = 1;
			var self = this;
			var opacityTimer = setInterval(function(){
				if (opacity >= 0.01){
					for (var i = 0; i < self.mesh.children.length; i++){
						opacity -= 0.01;
						self.mesh.children[i].material.opacity = opacity;
	        		}
	        	}
	        	else{
	        		clearInterval(opacityTimer);
	        		self.earthManager.earthMesh.remove(this.mesh);
	        	}
			},10);
			
			this.app.unregisterRenderHook('dotAnnotation', this);
		}

		hoveredOver():void {
			this.hasHoveredOver = true;
			this.hasHoveredOut = false;
		}

		hoveredOut(): void {
			this.hasHoveredOver = false;
			this.hasHoveredOut = true;
		}

		onRender(caller: any): void{
			var earthManager = EarthJsHelper.Container.instance.dependencies['earthInstance'];
			caller.mesh.lookAt(earthManager.camera.position);
			var meshes = caller.mesh.children;
			
			if (caller.hasHoveredOver){
				if (caller.currentSize < 1.5){
					caller.mesh.scale.set(caller.currentSize,caller.currentSize,1);
					caller.currentSize += 0.1;
				}
				else
					caller.hasHoveredOver = false;
			}
			else if (caller.hasHoveredOut){
				if (caller.currentSize > 1){
					caller.mesh.scale.set(caller.currentSize,caller.currentSize,1);
					caller.currentSize -= 0.1;
				}
				else
					caller.hasHoveredOut = false;
			}
			
		}
	}
}