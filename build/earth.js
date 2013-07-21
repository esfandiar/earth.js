var EarthJsHelper;
(function (EarthJsHelper) {
    var Container = (function () {
        function Container() {
            EarthJsHelper.Container.instance = this;
            this.dependencies = {};
        }
        Container.prototype.register = function (name, dependency) {
            this.dependencies[name] = dependency;
        };
        return Container;
    })();
    EarthJsHelper.Container = Container;
})(EarthJsHelper || (EarthJsHelper = {}));
var EarthJsModel;
(function (EarthJsModel) {
    var XyzPosition = (function () {
        function XyzPosition(x, y, z, earthRadius) {
            this.x = x;
            this.y = y;
            this.z = z;
            if (earthRadius != null && earthRadius != undefined)
                this.earthRadius = earthRadius; else
                this.earthRadius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
        }
        XyzPosition.prototype.calculateLatitudeLongitude = function () {
            var x = this.x;
            var z = this.y;
            var y = -this.z;

            var radiusScale = 6378137 / this.earthRadius;

            x = x * radiusScale;
            y = y * radiusScale;
            z = z * radiusScale;

            var b, ep, p, th, lon, lat, n, alt;

            var a = 6378137;
            var e = 8.1819190842622e-2;
            var pi = 3.141592653589793;

            b = Math.sqrt(Math.pow(a, 2) * (1 - Math.pow(e, 2)));
            ep = Math.sqrt((Math.pow(a, 2) - Math.pow(b, 2)) / Math.pow(b, 2));
            p = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            th = Math.atan2(a * z, b * p);
            lon = Math.atan2(y, x);
            lat = Math.atan2((z + ep * ep * b * Math.pow(Math.sin(th), 3)), (p - e * e * a * Math.pow(Math.cos(th), 3)));
            n = a / Math.sqrt(1 - e * e * Math.pow(Math.sin(lat), 2));
            alt = p / Math.cos(lat) - n;
            lat = (lat * 180) / pi;
            lon = (lon * 180) / pi;

            var latLong = new LatLongPosition(lat, lon);

            return latLong;
        };
        return XyzPosition;
    })();
    EarthJsModel.XyzPosition = XyzPosition;

    var LatLongPosition = (function () {
        function LatLongPosition(latitude, longitude, earthRadius) {
            this.latitude = latitude;
            this.longitude = longitude;
            if (earthRadius != null && earthRadius != undefined)
                this.earthRadius = earthRadius; else
                this.earthRadius = EarthJsHelper.Container.instance.dependencies['appInstance'].dataPointDistance;

            this.calculateCartesianCoordinates();
        }
        LatLongPosition.prototype.calculateCartesianCoordinates = function () {
            var originalLatitude = this.latitude;
            var originalLongitude = this.longitude;

            this.latitude = this.latitude * Math.PI / 180;
            this.longitude = this.longitude * Math.PI / 180;

            this.x = this.getX();
            this.y = this.getY();
            this.z = this.getZ();

            this.latitude = originalLatitude;
            this.longitude = originalLongitude;
        };

        LatLongPosition.prototype.getX = function () {
            var x = this.earthRadius * Math.cos(this.longitude) * Math.cos(this.latitude);
            return x;
        };

        LatLongPosition.prototype.getY = function () {
            var y = this.earthRadius * Math.sin(this.latitude);
            return y;
        };

        LatLongPosition.prototype.getZ = function () {
            var z = this.earthRadius * Math.cos(this.latitude) * Math.sin(this.longitude) * -1;
            return z;
        };
        return LatLongPosition;
    })();
    EarthJsModel.LatLongPosition = LatLongPosition;
})(EarthJsModel || (EarthJsModel = {}));
var EarthJsModel;
(function (EarthJsModel) {
    var JsonDataPoint = (function () {
        function JsonDataPoint(id, title, latitude, longitude, detail, annotationType, annotationImage) {
            this.id = id;
            this.title = title;
            this.latitude = latitude;
            this.longitude = longitude;
            this.detail = detail;
            this.annotationType = annotationType;
            this.annotationImage = annotationImage;
        }
        return JsonDataPoint;
    })();
    EarthJsModel.JsonDataPoint = JsonDataPoint;
})(EarthJsModel || (EarthJsModel = {}));
var EarthJsView;
(function (EarthJsView) {
    var DotAnnotation = (function () {
        function DotAnnotation(dataPoint) {
            this.dataPoint = dataPoint;
            this.currentSize = 1;
            this.earthManager = EarthJsHelper.Container.instance.dependencies['earthInstance'];
            this.app = EarthJsHelper.Container.instance.dependencies['appInstance'];
        }
        DotAnnotation.prototype.getType = function () {
            return 'dot';
        };

        DotAnnotation.prototype.applyToEarth = function () {
            if (this.earthManager === null || this.earthManager === undefined || this.earthManager.earthMesh === null || this.earthManager.earthMesh === undefined)
                return;

            var map = new THREE.ImageUtils.loadTexture(this.dataPoint.annotationImage);
            var material = new THREE.MeshBasicMaterial({ map: map });
            material.transparent = true;
            material.opacity = 0;
            material.depthWrite = false;

            var labelMaterial = new THREE.MeshBasicMaterial();
            labelMaterial.transparent = true;
            labelMaterial.opacity = 0;
            labelMaterial.depthWrite = false;

            var self = this;

            if (map.image != null && map.image != undefined) {
                map.image.onload = function () {
                    self.mesh = new THREE.Object3D();
                    self.mesh.overdraw = true;

                    var width = 10;
                    var height = 10;
                    var objectMesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
                    self.mesh.add(objectMesh);

                    if (self.dataPoint.title != null && self.dataPoint.title != undefined && self.dataPoint.title != '') {
                        var labelShape = THREE.FontUtils.generateShapes(self.dataPoint.title, {
                            font: 'helvetiker',
                            weight: 'bold',
                            size: 3
                        });
                        var labelGeometry = new THREE.ShapeGeometry(labelShape);
                        var labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
                        self.mesh.add(labelMesh);
                        var labelMeshHalfSize = labelMesh.geometry.boundingSphere.radius / 2;
                        labelMesh.position.y = -height;
                        labelMesh.position.x = -labelMeshHalfSize;
                    }

                    self.mesh.position.x = self.dataPoint.position.x;
                    self.mesh.position.y = self.dataPoint.position.y;
                    self.mesh.position.z = self.dataPoint.position.z;
                    self.mesh.dataPoint = self.dataPoint;
                    self.mesh.lookAt(self.earthManager.camera.position);
                    self.earthManager.earthMesh.add(self.mesh);
                    self.app.registerRenderHook('dotAnnotation', self, self.onRender);
                };
            }

            var opacityTimer = setInterval(function () {
                if (material.opacity <= 0.99) {
                    material.opacity += 0.01;
                    labelMaterial.opacity += 0.01;
                } else {
                    material.opacity = 1;
                    labelMaterial.opacity = 1;
                    clearInterval(opacityTimer);
                }
            }, 10);
        };

        DotAnnotation.prototype.removeFromEarth = function () {
            if (this.earthManager === null || this.earthManager === undefined || this.earthManager.earthMesh === null || this.earthManager.earthMesh === undefined)
                return;

            var opacity = 1;
            var self = this;
            var opacityTimer = setInterval(function () {
                if (opacity >= 0.01) {
                    for (var i = 0; i < self.mesh.children.length; i++) {
                        opacity -= 0.01;
                        self.mesh.children[i].material.opacity = opacity;
                    }
                } else {
                    clearInterval(opacityTimer);
                    self.earthManager.earthMesh.remove(this.mesh);
                }
            }, 10);

            this.app.unregisterRenderHook('dotAnnotation', this);
        };

        DotAnnotation.prototype.hoveredOver = function () {
            this.hasHoveredOver = true;
            this.hasHoveredOut = false;
        };

        DotAnnotation.prototype.hoveredOut = function () {
            this.hasHoveredOver = false;
            this.hasHoveredOut = true;
        };

        DotAnnotation.prototype.onRender = function (caller) {
            var earthManager = EarthJsHelper.Container.instance.dependencies['earthInstance'];
            caller.mesh.lookAt(earthManager.camera.position);
            var meshes = caller.mesh.children;

            if (caller.hasHoveredOver) {
                if (caller.currentSize < 1.5) {
                    caller.mesh.scale.set(caller.currentSize, caller.currentSize, 1);
                    caller.currentSize += 0.1;
                } else
                    caller.hasHoveredOver = false;
            } else if (caller.hasHoveredOut) {
                if (caller.currentSize > 1) {
                    caller.mesh.scale.set(caller.currentSize, caller.currentSize, 1);
                    caller.currentSize -= 0.1;
                } else
                    caller.hasHoveredOut = false;
            }
        };
        return DotAnnotation;
    })();
    EarthJsView.DotAnnotation = DotAnnotation;
})(EarthJsView || (EarthJsView = {}));
var EarthJsView;
(function (EarthJsView) {
    var EarthTextureAnnotation = (function () {
        function EarthTextureAnnotation(dataPoint) {
            this.dataPoint = dataPoint;
            this.earthManager = EarthJsHelper.Container.instance.dependencies['earthInstance'];
        }
        EarthTextureAnnotation.prototype.getType = function () {
            return 'earthTexture';
        };

        EarthTextureAnnotation.prototype.applyToEarth = function () {
            if (this.earthManager === null || this.earthManager === undefined || this.earthManager.earthMesh === null || this.earthManager.earthMesh === undefined)
                return;

            var map = THREE.ImageUtils.loadTexture(this.dataPoint.annotationImage);
            this.earthManager.earthMesh.material.map = map;
        };

        EarthTextureAnnotation.prototype.removeFromEarth = function () {
            if (this.earthManager === null || this.earthManager === undefined || this.earthManager.earthMesh === null || this.earthManager.earthMesh === undefined)
                return;
        };

        EarthTextureAnnotation.prototype.hoveredOver = function () {
        };

        EarthTextureAnnotation.prototype.hoveredOut = function () {
        };
        return EarthTextureAnnotation;
    })();
    EarthJsView.EarthTextureAnnotation = EarthTextureAnnotation;
})(EarthJsView || (EarthJsView = {}));
var EarthJsModel;
(function (EarthJsModel) {
    var DataPoint = (function () {
        function DataPoint(id, title, position, detail, annotationType, annotationImage) {
            this.id = id;
            this.title = title;
            this.position = position;
            this.detail = detail;
            this.annotationType = annotationType;
            this.annotationImage = annotationImage;
            if (this.annotationType === 'dot') {
                this.annotation = new EarthJsView.DotAnnotation(this);
            } else if (this.annotationType === 'earthTexture') {
                this.annotation = new EarthJsView.EarthTextureAnnotation(this);
            }
        }
        DataPoint.createDataPointFromJsonDataPoint = function (jsonDataPoint) {
            var dataPoint = new EarthJsModel.DataPoint(jsonDataPoint.id, jsonDataPoint.title === null || jsonDataPoint.title === undefined ? '' : jsonDataPoint.title, new EarthJsModel.LatLongPosition(jsonDataPoint.latitude === null || jsonDataPoint.latitude === undefined ? 0 : jsonDataPoint.latitude, jsonDataPoint.longitude === null || jsonDataPoint.longitude === undefined ? 0 : jsonDataPoint.longitude), jsonDataPoint.detail === null || jsonDataPoint.detail === undefined ? '' : jsonDataPoint.detail, jsonDataPoint.annotationType === null || jsonDataPoint.annotationType === undefined ? 'dot' : jsonDataPoint.annotationType, jsonDataPoint.annotationImage === null || jsonDataPoint.annotationImage === undefined ? '' : jsonDataPoint.annotationImage);
            return dataPoint;
        };
        return DataPoint;
    })();
    EarthJsModel.DataPoint = DataPoint;
})(EarthJsModel || (EarthJsModel = {}));
var EarthJsController;
(function (EarthJsController) {
    var DataPointController = (function () {
        function DataPointController(dataPointSelectedCallBack) {
            this.dataPointSelectedCallBack = dataPointSelectedCallBack;
            EarthJsController.DataPointController.instance = this;
            this.dataPoints = [];
        }
        DataPointController.prototype.loadDataPoints = function (jsonDataPoints) {
            this.removeDataPoints();
            var dataPoints = [];
            for (var i = 0; i < jsonDataPoints.length; i++) {
                var jsonDataPoint = jsonDataPoints[i];
                dataPoints.push(EarthJsModel.DataPoint.createDataPointFromJsonDataPoint(jsonDataPoint));
            }
            EarthJsController.DataPointController.instance.dataPointsLoaded(dataPoints);
        };

        DataPointController.prototype.selectDataPointById = function (dataPointId) {
            for (var i = 0; i < this.dataPoints.length; i++) {
                if (this.dataPoints[i].id === dataPointId) {
                    this.dataPointSelected(this.dataPoints[i]);
                }
            }
        };

        DataPointController.prototype.addDataPoint = function (jsonDataPoint) {
            var newDataPoint = EarthJsModel.DataPoint.createDataPointFromJsonDataPoint(jsonDataPoint);
            this.dataPoints.push(newDataPoint);
            newDataPoint.annotation.applyToEarth();
        };

        DataPointController.prototype.removeDataPoints = function () {
            if (this.dataPoints === null || this.dataPoints === undefined)
                return;
            for (var i = 0; i < this.dataPoints.length; i++) {
                if (this.dataPoints[i].annotation.getType() !== 'earthTexture')
                    this.dataPoints[i].annotation.removeFromEarth();
            }
            EarthJsController.DataPointController.instance.dataPointsLoaded([]);
        };

        DataPointController.prototype.removeDataPointById = function (id) {
            var deletingIndex = -1;
            for (var i = 0; i < this.dataPoints.length; i++) {
                if (this.dataPoints[i].id === id) {
                    this.dataPoints[i].annotation.removeFromEarth();
                    deletingIndex = i;
                    break;
                }
            }

            if (deletingIndex != -1)
                this.dataPoints.splice(deletingIndex, 1);
        };

        DataPointController.prototype.dataPointSelected = function (dataPoint) {
            var earthManager = EarthJsHelper.Container.instance.dependencies['earthInstance'];
            earthManager.dataPointClicked(dataPoint);
            if (this.dataPointSelectedCallBack != null && this.dataPointSelectedCallBack != undefined)
                this.dataPointSelectedCallBack(dataPoint);
        };

        DataPointController.prototype.dataPointsLoaded = function (dataPoints) {
            EarthJsController.DataPointController.instance.dataPoints = dataPoints;

            for (var i = 0; i < this.dataPoints.length; i++)
                this.dataPoints[i].annotation.applyToEarth();
        };
        return DataPointController;
    })();
    EarthJsController.DataPointController = DataPointController;
})(EarthJsController || (EarthJsController = {}));
var EarthJsHelper;
(function (EarthJsHelper) {
    var CameraHelper = (function () {
        function CameraHelper(controls) {
            this.controls = controls;
            this.cameraIncrementStep = 0.2;
            this.app = EarthJsHelper.Container.instance.dependencies['appInstance'];
        }
        CameraHelper.prototype.getIncrementBasedOnCameraPosition = function (cameraPosition, destinationPosition) {
            var increment;

            if ((cameraPosition * destinationPosition) > 0) {
                if (cameraPosition < destinationPosition)
                    increment = this.cameraIncrementStep; else if (cameraPosition > destinationPosition)
                    increment = -this.cameraIncrementStep; else
                    increment = 0;
            } else if (cameraPosition < destinationPosition)
                increment = this.cameraIncrementStep; else
                increment = -this.cameraIncrementStep;

            return increment;
        };

        CameraHelper.prototype.moveCameraToLatLongCoordinates = function (position) {
            var latitude = position.latitude;
            var longitude = position.longitude;
            var currentCameraXYZ = new EarthJsModel.XyzPosition(this.controls.object.position.x, this.controls.object.position.y, this.controls.object.position.z, 1000);
            var currentCameraLatLong = currentCameraXYZ.calculateLatitudeLongitude();
            var points = [];
            var currentLatitude;
            var currentLongitude;
            var latitudeIncrement;
            var longitudeIncrement;

            currentLatitude = currentCameraLatLong.latitude;
            currentLongitude = currentCameraLatLong.longitude;

            latitudeIncrement = this.getIncrementBasedOnCameraPosition(currentLatitude, latitude);
            longitudeIncrement = this.getIncrementBasedOnCameraPosition(currentLongitude, longitude);

            var latitudeDifference = Math.abs(Math.abs(currentLatitude) - Math.abs(latitude));
            var longitudeDifference = Math.abs(Math.abs(currentLongitude) - Math.abs(longitude));

            if (latitudeDifference > longitudeDifference)
                longitudeIncrement = longitudeIncrement / Math.abs(latitudeDifference / longitudeDifference); else
                latitudeIncrement = latitudeIncrement / Math.abs(longitudeDifference / latitudeDifference);

            while ((Math.abs(currentLatitude - latitude) > this.cameraIncrementStep) || (Math.abs(currentLongitude - longitude) > this.cameraIncrementStep)) {
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
            if (points.length > 0) {
                var timer = setInterval(function () {
                    self.controls.object.position.x = points[index].x;
                    self.controls.object.position.y = points[index].y;
                    self.controls.object.position.z = points[index].z;
                    index = index + 1;
                    if (index === points.length) {
                        window.clearInterval(timer);
                        points = null;
                    }
                }, 5);
            }
        };

        CameraHelper.prototype.moveCamera = function (destinationPosition, duration) {
            var currentHeadXCoordinate = this.controls.object.position.x;
            var currentHeadYCoordinate = this.controls.object.position.y;
            var currentHeadZCoordinate = this.controls.object.position.z;

            var currentTargetXCoordinate = this.controls.target.x;
            var currentTargetYCoordinate = this.controls.target.y;
            var currentTargetZCoordinate = this.controls.target.z;

            var position1 = { x: currentHeadXCoordinate, y: currentHeadYCoordinate, z: currentHeadZCoordinate };
            var target1 = { x: destinationPosition.head.x, y: destinationPosition.head.y, z: destinationPosition.head.z };

            var position2 = { x: currentTargetXCoordinate, y: currentTargetYCoordinate, z: currentTargetZCoordinate };
            var target2 = { x: destinationPosition.target.x, y: destinationPosition.target.y, z: destinationPosition.target.z };

            var self = this;

            this.tween1 = new TWEEN.Tween({ x: position1.x, y: position1.y, z: position1.z }).to(target1, duration * 1000).easing(TWEEN.Easing.Cubic.InOut).onUpdate(function () {
                self.controls.object.position.x = this.x;
                self.controls.object.position.y = this.y;
                self.controls.object.position.z = this.z;
            }).start();

            this.tween2 = new TWEEN.Tween({ x: position2.x, y: position2.y, z: position2.z }).to(target2, duration * 1000).easing(TWEEN.Easing.Cubic.InOut).onUpdate(function () {
                self.controls.target.x = this.x;
                self.controls.target.y = this.y;
                self.controls.target.z = this.z;
            }).start();
        };
        return CameraHelper;
    })();
    EarthJsHelper.CameraHelper = CameraHelper;
})(EarthJsHelper || (EarthJsHelper = {}));
var EarthJsController;
(function (EarthJsController) {
    var EarthController = (function () {
        function EarthController(scene, camera, controls) {
            this.scene = scene;
            this.camera = camera;
            this.controls = controls;

            this.cameraHelper = new EarthJsHelper.CameraHelper(controls);

            var geometry = new THREE.SphereGeometry(100, 20, 20);
            var material = new THREE.MeshBasicMaterial({ color: 0xffffff });

            this.earthMesh = new THREE.Mesh(geometry, material);

            var spriteMap = THREE.ImageUtils.loadTexture('');
            var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, useScreenCoordinates: false, blending: THREE.AdditiveBlending });
            this.atmosphereMesh = new THREE.Sprite(spriteMaterial);
            this.atmosphereMesh.position.x = 0;
            this.atmosphereMesh.position.y = 0;
            this.atmosphereMesh.position.z = 0;
            this.atmosphereMesh.scale = new THREE.Vector3(270, 270, 270);

            this.earthMesh.add(this.atmosphereMesh);

            scene.add(this.earthMesh);
        }
        EarthController.prototype.clickDataPoint = function (dataPoint) {
            if (dataPoint != null && dataPoint != undefined) {
                var dataPointsManager = EarthJsHelper.Container.instance.dependencies['dataInstance'];
                dataPointsManager.dataPointSelected(dataPoint);
            }
        };

        EarthController.prototype.dataPointClicked = function (dataPoint) {
            this.cameraHelper.moveCameraToLatLongCoordinates(dataPoint.position);
        };

        EarthController.prototype.setTexture = function (textureUrl) {
            var map = THREE.ImageUtils.loadTexture(textureUrl);
            this.earthMesh.material.map = map;
        };

        EarthController.prototype.setAtmosphereTexture = function (textureUrl) {
            var map = THREE.ImageUtils.loadTexture(textureUrl);
            this.atmosphereMesh.material.map = map;
        };
        return EarthController;
    })();
    EarthJsController.EarthController = EarthController;
})(EarthJsController || (EarthJsController = {}));
var EarthJsModel;
(function (EarthJsModel) {
    var RenderHook = (function () {
        function RenderHook(name, method) {
            this.name = name;
            this.method = method;
        }
        return RenderHook;
    })();
    EarthJsModel.RenderHook = RenderHook;
})(EarthJsModel || (EarthJsModel = {}));
var EarthJsApp;
(function (EarthJsApp) {
    var _renderer, _scene, _camera, _mesh, _controls, _container, _projector, _mainObject;
    var lastRenderTime = new Date();
    var _width = 400, _height = 150;
    var _aspect = 2.7, _near = 120, _far = 600, _renderHooks = [];
    var _mouse = { x: 0, y: 0 };
    var _lastMouse = { x: 0, y: 0 };
    var _lastMouseMovement = { x: 0, y: 0 };
    var hoveredDataPoint;

    function render() {
        for (var i = 0; i < _renderHooks.length; i++) {
            if (_renderHooks[i].method != null && _renderHooks[i].caller != null)
                _renderHooks[i].method(_renderHooks[i].caller);
        }
        _renderer.render(_scene, _camera);
    }

    function animate(renderTime) {
        requestAnimationFrame(function () {
            animate(new Date());
        });

        if ((renderTime - +lastRenderTime) > 33) {
            TWEEN.update();
            _controls.update();
            render();
            lastRenderTime = renderTime;
        }
    }

    var App = (function () {
        function App(htmlContainer) {
            this.htmlContainer = htmlContainer;
            _container = htmlContainer;
            this.container = new EarthJsHelper.Container();
            EarthJsApp.App.instance = this;
            this.container.register('appInstance', EarthJsApp.App.instance);
            _mainObject = this;
            this.cameraDistance = 300;
            this.dataPointDistance = 120;
        }
        App.prototype.registerRenderHook = function (name, caller, method) {
            for (var i = 0; i < _renderHooks.length; i++) {
                if (_renderHooks[i].name === name && _renderHooks[i].caller === caller) {
                    _renderHooks[i].caller = caller;
                    _renderHooks[i].method = method;
                    return;
                }
            }
            _renderHooks.push({ name: name, caller: caller, method: method });
        };

        App.prototype.unregisterRenderHook = function (name, caller) {
            for (var i = 0; i < _renderHooks.length; i++) {
                if (_renderHooks[i].name === name && _renderHooks[i].caller === caller) {
                    _renderHooks[i].caller = null;
                    _renderHooks[i].method = null;
                    return;
                }
            }
        };

        App.prototype.start = function () {
            this.init();
            animate(new Date());
        };

        App.prototype.setDataPoints = function (dataPoints) {
            var dataInstance = EarthJsHelper.Container.instance.dependencies['dataInstance'];
            dataInstance.loadDataPoints(dataPoints);
        };

        App.prototype.removeDataPoints = function () {
            var dataInstance = EarthJsHelper.Container.instance.dependencies['dataInstance'];
            dataInstance.removeDataPoints();
        };

        App.prototype.removeDataPointById = function (id) {
            var dataInstance = EarthJsHelper.Container.instance.dependencies['dataInstance'];
            dataInstance.removeDataPointById(id);
        };

        App.prototype.addDataPoint = function (dataPoint) {
            var dataInstance = EarthJsHelper.Container.instance.dependencies['dataInstance'];
            dataInstance.addDataPoint(dataPoint);
        };

        App.prototype.setDataPointClickedCallback = function (dataPointClickedCallback) {
            var dataInstance = EarthJsHelper.Container.instance.dependencies['dataInstance'];
            dataInstance.dataPointSelectedCallBack = dataPointClickedCallback;
        };

        App.prototype.setEarthTexture = function (textureUrl) {
            this.earthManager.setTexture(textureUrl);
        };

        App.prototype.setAtmosphereTexture = function (textureUrl) {
            this.earthManager.setAtmosphereTexture(textureUrl);
        };

        App.prototype.setSize = function (width, height) {
            _width = width;
            _height = height;
        };

        App.prototype.init = function () {
            this.setupScene();
            this.setupCamera();
            this.setupEvents();

            var dataPointsManager = new EarthJsController.DataPointController(null);
            this.container.register('dataInstance', dataPointsManager);

            this.earthManager = new EarthJsController.EarthController(_scene, _camera, _controls);
            this.container.register('earthInstance', this.earthManager);

            var earthTexture = new EarthJsModel.JsonDataPoint('0', 'EarthTexture', 0, 0, '', 'earthTexture', '/examples/images/EarthTexture.jpg');
            dataPointsManager.loadDataPoints([earthTexture]);
        };

        App.prototype.setupScene = function () {
            _scene = new THREE.Scene();
            _projector = new THREE.Projector();
            _renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
            _renderer.setSize(_width, _height);
            _container.appendChild(_renderer.domElement);
        };

        App.prototype.setupCamera = function () {
            _camera = new THREE.PerspectiveCamera(55, _aspect, _near, _far);
            _camera.position.x = this.cameraDistance;

            _controls = new THREE.TrackballControls(_camera, _container);

            _controls.rotateSpeed = 1.0;
            _controls.zoomSpeed = 0.05;
            _controls.panSpeed = 0.2;

            _controls.noZoom = false;
            _controls.noPan = false;

            _controls.staticMoving = false;
            _controls.dynamicDampingFactor = 0.3;
            _controls.minDistance = 250;
            _controls.maxDistance = 350;

            _controls.keys = [65, 83, 68];
        };

        App.prototype.setupEvents = function () {
            window.addEventListener('resize', this.onWindowResize, false);
            _container.addEventListener('mouseup', this.onDocumentMouseUp, false);
            _container.addEventListener('mousedown', this.onDocumentMouseDown, false);
            _container.addEventListener('mousemove', this.onDocumentMouseMove, false);
            this.onWindowResize(null);
        };

        App.prototype.detectEvent = function () {
            var vector = new THREE.Vector3(_mouse.x, _mouse.y, 0.5);
            _projector.unprojectVector(vector, _camera);
            var raycaster = new THREE.Raycaster(_camera.position, vector.sub(_camera.position).normalize());

            var intersects = raycaster.intersectObjects(_mainObject.earthManager.earthMesh.children, true);
            if (intersects.length > 0) {
                var selectedModel = intersects[0].object.parent;
                if (hoveredDataPoint != selectedModel.dataPoint) {
                    hoveredDataPoint = selectedModel.dataPoint;
                    if (hoveredDataPoint != null && hoveredDataPoint != undefined) {
                        hoveredDataPoint.annotation.hoveredOver();
                    }
                }
            } else {
                this.hoveredOut();
            }

            _lastMouseMovement.x = _mouse.x;
            _lastMouseMovement.y = _mouse.y;
        };

        App.prototype.hoveredOut = function () {
            if (hoveredDataPoint != null)
                hoveredDataPoint.annotation.hoveredOut();
            hoveredDataPoint = null;
        };

        App.prototype.onDocumentMouseMove = function (event) {
            var containerPos = EarthJsApp.App.instance.findElementPosition(_container);
            if (event.clientX > (containerPos.x + _width) || event.clientY > (containerPos.y + _height))
                return;

            var positionInContainer = { x: event.clientX - containerPos.x, y: event.clientY - containerPos.y };
            _mouse.x = (positionInContainer.x / _width) * 2 - 1;
            _mouse.y = -(positionInContainer.y / _height) * 2 + 1;

            if (Math.abs(_lastMouseMovement.x - _mouse.x) > 0.01 || Math.abs(_lastMouseMovement.y - _mouse.y) > 0.01) {
                EarthJsApp.App.instance.detectEvent();
            }
        };

        App.prototype.findElementPosition = function (obj) {
            var curleft;
            var curtop;
            curleft = 0;
            curtop = 0;
            if (obj.offsetParent) {
                do {
                    curleft += obj.offsetLeft;
                    curtop += obj.offsetTop;
                } while(obj = obj.offsetParent);
            }
            return { x: curleft, y: curtop };
        };

        App.prototype.onDocumentMouseUp = function (event) {
            event.preventDefault();

            _mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            _mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            var delta = { x: 0, y: 0 };
            delta.x = Math.abs(_mouse.x - _lastMouse.x);
            delta.y = Math.abs(_mouse.y - _lastMouse.y);

            if (delta.x < 0.001 && delta.y < 0.001) {
                if (hoveredDataPoint != null && hoveredDataPoint != undefined)
                    _mainObject.earthManager.clickDataPoint(hoveredDataPoint);
            }
        };

        App.prototype.onDocumentMouseDown = function (event) {
            _lastMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            _lastMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        App.prototype.onWindowResize = function (event) {
            var width = _width === 0 ? window.innerWidth : _width;
            var height = _height === 0 ? window.innerHeight : _height;

            _camera.aspect = width / height;
            _camera.updateProjectionMatrix();

            _renderer.setSize(width, height);
            _renderer.domElement.style.width = width + 'px';
            _renderer.domElement.style.height = height + 'px';
        };
        return App;
    })();
    EarthJsApp.App = App;
})(EarthJsApp || (EarthJsApp = {}));
