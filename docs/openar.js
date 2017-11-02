(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ARView = __webpack_require__(2);

var _ARView2 = _interopRequireDefault(_ARView);

var _ARDebugger = __webpack_require__(3);

var _ARDebugger2 = _interopRequireDefault(_ARDebugger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.ARView = _ARView2.default;
global.ARDebugger = _ARDebugger2.default;

exports.default = {
    ARView: _ARView2.default,
    ARDebugger: _ARDebugger2.default
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Renders camera onto canvas
* Gets camera using video element
* Add camera view to scene as a sprite
**/
var ARView = function () {
    function ARView(renderer, camera) {
        _classCallCheck(this, ARView);

        this.renderer = renderer;
        this.renderer.autoClear = false;

        this.sceneCamera = camera;
        this.cameraOrientation = null;
        this.cameraMotion = null;

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1);
        this.camera.position.z = 1;

        this.init();
        this.initListeners();
    }

    /**
    * Get user camera using video
    * Add video texture to scene
    **/


    _createClass(ARView, [{
        key: 'init',
        value: function init() {
            var _this = this;

            this.video = document.createElement('video');

            // get user camera and attach to video element
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
                    _this.video.src = window.URL.createObjectURL(stream);
                });
            }

            this.videoTexture = new THREE.VideoTexture(this.video);
            this.videoTexture.minFilter = THREE.LinearFilter;
            this.videoTexture.magFilter = THREE.LinearFilter;

            var material = new THREE.SpriteMaterial({ map: this.videoTexture });

            // testing without webcam
            // var map = new THREE.TextureLoader().load( "./pulpitrock.jpg" );
            // var material = new THREE.SpriteMaterial({ map: map });

            this.screen = new THREE.Sprite(material);
            this.screen.scale.set(2, 2);
            this.scene.add(this.screen);
        }
    }, {
        key: 'initListeners',
        value: function initListeners() {
            window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
            window.addEventListener('devicemotion', this.handleMotion.bind(this));
        }

        // keep virutal world rotation in sync with real world

    }, {
        key: 'handleOrientation',
        value: function handleOrientation(e) {
            if (this.cameraOrientation !== null) {
                // convert value from degree to radians
                var beta = e.beta * Math.PI / 180;
                var gamma = e.gamma * Math.PI / 180;

                // get difference in orientation since last update
                var diffX = beta - this.cameraOrientation.beta;
                var diffY = gamma - this.cameraOrientation.gamma;

                this.sceneCamera.rotation.x += diffX;
                this.sceneCamera.rotation.y += diffY;
            }

            this.cameraOrientation = e;
        }

        // keep virtual world position in sync with real world

    }, {
        key: 'handleMotion',
        value: function handleMotion(e) {
            if (this.cameraMotion !== null) {
                this.camera.translateX(e.acceleration.x);
                this.camera.translateY(e.acceleration.y);
                this.camera.translateZ(e.acceleration.z);
            }

            this.cameraMotion = e;
        }

        // Clear renderer before and after rendering camera

    }, {
        key: 'update',
        value: function update() {
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);
            this.renderer.clearDepth();
        }
    }]);

    return ARView;
}();

exports.default = ARView;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ARDebugger = function () {
    function ARDebugger(arView) {
        _classCallCheck(this, ARDebugger);

        this.arView = arView;
        this.init();
    }

    _createClass(ARDebugger, [{
        key: 'init',
        value: function init() {
            this.debugWindow = document.createElement('div');
            this.debugWindow.id = 'debug-window';
            this.debugWindow.style.position = 'fixed';
            this.debugWindow.style.bottom = '0px';
            this.debugWindow.style.left = '0px';
            this.debugWindow.style.color = 'white';
            this.debugWindow.style.backgroundColor = 'black';
            this.debugWindow.style.whiteSpace = 'pre';
            this.debugWindow.style.padding = '10px';
            document.body.append(this.debugWindow);
        }
    }, {
        key: 'update',
        value: function update() {
            this.debugWindow.innerHTML = 'alpha: ' + this.arView.cameraOrientation.alpha + '\n';
            this.debugWindow.innerHTML += 'beta: ' + this.arView.cameraOrientation.beta + '\n';
            this.debugWindow.innerHTML += 'gamma: ' + this.arView.cameraOrientation.gamma + '\n';
            this.debugWindow.innerHTML += 'acceleration.x: ' + this.arView.cameraMotion.acceleration.x + '\n';
            this.debugWindow.innerHTML += 'acceleration.y: ' + this.arView.cameraMotion.acceleration.y + '\n';
            this.debugWindow.innerHTML += 'acceleration.z: ' + this.arView.cameraMotion.acceleration.z + '\n';
        }
    }]);

    return ARDebugger;
}();

exports.default = ARDebugger;

/***/ })
/******/ ]);
});