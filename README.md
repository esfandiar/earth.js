earth.js
========

The purpose of this project is to provide a 3D model of Earth using WebGL, which can be annotated easily. The end-result is packaged as a jQuery plugin and an AngularJS directives.

This project makes use of [Three.js library](https://github.com/mrdoob/three.js/), and as a result has dependency on that library. The core earth.js does not depend on jQuery or AngularJS, however, if you choose to use the plugin or the directive you need to include the appropriate library/framework in your html.

The source code is written in [Typescript](http://www.typescriptlang.org/) which is compiled into Javascript.

### Usage ###

Download the [the main minified file](https://github.com/esfandiar/earth.js/tree/master/build/earth.min.js) and include it in your html. You can use this single file to setup earth.js.

If you haven't included Three.js library in your HTML, then you also need to download [this file](https://github.com/esfandiar/earth.js/tree/master/libs/threejsLibs.js).

If you have included Three.js library already, just make sure that you also include these files from Three.js (please note that right now Three.js r59 is not yet compatible with this version of Earth.js):
- 'threejs/build/three.min.js'
- 'threejs/examples/js/Detector.js'
- 'threejs/examples/js/controls/TrackballControls.js'
- 'threejs/examples/js/libs/tween.min.js'
- 'threejs/examples/fonts/helvetiker_bold.typeface.js'
- 'threejs/examples/fonts/helvetiker_regular.typeface.js

Note: threejsLibs.js file, which is inside the libs folder, is the concatenated version of all these files.

```html
<script src="js/threejsLibs.js"></script>
<script src="js/earth.min.js"></script>
```

To make it easier to work with earth.js you can either download the jQuery plugin or the AngularJS directive which act as wrappers and setup earth.js for you:

#### AngularJS Directive ####
For AngularJS directive download the [file](https://github.com/esfandiar/earth.js/tree/master/build/angular.earth.js) and include it in your html (along with the other necessary files that have been mentioned before).

```html
<script src="js/threejsLibs.js"></script>
<script src="js/earth.min.js"></script>
<script src="js/angular.earth.js"></script>

<!-- This is only an example. The only thing that you really need to include is the earth directive -->
<body ng-app="myApp">
	<div ng-controller="myController">
		<earth dataPoints="{{dataPoints}}" earthTexture="{{earthTexture}}" dataPointClickedCallback="dataPointClicked" width="600" height="600" />
	</div>
</body>
```

Here's a full [example](https://github.com/esfandiar/earth.js/tree/master/examples/angularjs/index.html) using AngularJS directive.

Directive attributes:
- dataPoints: An array of JSON objects which represent the data points on the earth model. Each data point should have the following format:
```
{id:'unique_id', 
title:'some title', 
latitude:0, 
longitude:0, 
detail:'some detail', 
annotationImage: 'URL of the image for the data point'}
```
- earthTexture: the URL of the image for earth's texture.
- dataPointClickedCallback: the callback function that will be called when a data point is clicked on the earth model (if you are updating the $scope, remember to wrap it in $scope.$apply in here since the function is called externally on a seperate run).
- width: the width of the directive. The possible values are "fullScreen" or a static value in pixels, such as "600".
- height: the height of the directive. The possible values are "fullScreen" or a static value in pixels, such as "600".

#### jQuery Plugin ####

For jQuery plugin download the [file](https://github.com/esfandiar/earth.js/tree/master/build/jquery.earth.js) and include it in your html (along with the other necessary files that have been mentioned before).

```html
<script src="js/threejsLibs.js"></script>
<script src="js/earth.min.js"></script>
<script src="js/jquery.earth.js"></script>

<body>
	<div id="earth"></div>
</body>
```

Here's a full [example](https://github.com/esfandiar/earth.js/tree/master/examples/jquery/index.html) using jQuery plugin.

Setup:
```
$('#earth').earth({'width':'600','height':'600','dataPointClickedCallback':dataPointClickedCallback});
```
- width: the width of the plugin. The possible values are "fullScreen" or a static value in pixels, such as "600".
- height: the height of the plugin. The possible values are "fullScreen" or a static value in pixels, such as "600".
- dataPointClickedCallback: the callback function that will be called when a data point is clicked on the earth model.

Available functions for the plugin:
- setDataPoints(dataPoints): Set the data points on the earth model. The data points are an array of JSON objects. Each data point should have the following format:
```
{id:'unique_id', 
title:'some title', 
latitude:0, 
longitude:0, 
detail:'some detail', 
annotationImage: 'URL of the image for the data point'}
```
- setEarthTexture(textureUrl): the URL of the image for earth's texture.
- addDataPoint(dataPoint): add a new data point to the earth model (the JSON format is the same as above).
- removeDataPointById(dataPointId): remove a data point from the earth model using its id.


### How to contribute ###

The core of the code is written in Typescript 0.9.0. However, the jQuery plugin, AngularJS directive, and the tests are written in pure Javascript.

The only thing you need to have installed before contributing to this project is Node.js and some Git client. After that start by cloning the repository, and installing the rest of the dependencies by entering the following in the shell:

```
git clone git://github.com/esfandiar/earth.js.git
cd earth.js
npm install
grunt dev
```

##### How to run the tests #####
```
grunt test
```

### How to build ###
```
grunt build
```

### How to run the examples ###
```
grunt server
```
Then open your browser and go to:

For AngularJS directive example: localhost:8000/examples/angularjs/index.html
For jQuery plugin example: localhost:8000/examples/jquery/index.html
