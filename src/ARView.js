import { motionEstimation } from './utils/index';

/**
* Renders camera onto canvas
* Gets camera using video element
* Add camera view to scene as a sprite
**/
export default class ARView {
    constructor(renderer, camera) {
        this.renderer = renderer;
        this.renderer.autoClear = false;

        this.sceneCamera = camera;
        this.cameraOrientation = null;
        this.cameraMotion = null;
        this.prevFrame = null;

        this.scene = new THREE.Scene();
        this.loaded = false;
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1);
        this.camera.position.z = 1;

        this.init();
        this.initListeners();
    }

    /**
    * Get user camera using video
    * Add video texture to scene
    **/
    init() {
        this.video = document.createElement('video');

        // get user camera and attach to video element
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: { facingMode: "environment" } }).then((stream) => {
                this.video.src = window.URL.createObjectURL(stream);
            });
        }

        this.videoTexture = new THREE.VideoTexture(this.video);
        this.videoTexture.minFilter = THREE.LinearFilter;
        this.videoTexture.magFilter = THREE.LinearFilter;

        const material = new THREE.SpriteMaterial({ map: this.videoTexture });

        // testing without webcam
        // const map = new THREE.TextureLoader().load("../res/pulpitrock.jpg", () => {
        //     this.loaded = true;
        // });
        // const material = new THREE.SpriteMaterial({ map: map });

        this.screen = new THREE.Sprite(material);
        this.screen.scale.set(2, 2);
        this.scene.add(this.screen);
    }

    initListeners() {
        window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
        window.addEventListener('devicemotion', this.handleMotion.bind(this));
    }

    // keep virutal world rotation in sync with real world
    handleOrientation(e) {
        if(this.cameraOrientation !== null) {
            // get difference in orientation since last update
            // rotate around
            let diffZ = (e.alpha - this.cameraOrientation.alpha);
            // rotate up/down
            let diffX = (e.beta - this.cameraOrientation.beta);
            // rotate left/right
            let diffY = (e.gamma - this.cameraOrientation.gamma);

            let rotationX = Math.cos(diffZ) * diffX + Math.sin(diffZ) * diffY;
            let rotationY = Math.sin(diffZ) * diffX + Math.cos(diffZ) * diffY;

            this.sceneCamera.rotation.x += rotationX;
            this.sceneCamera.rotation.y += rotationY;
        }

        this.cameraOrientation = e;
    }

    // keep virtual world position in sync with real world
    handleMotion(e) {
        // if(this.cameraMotion !== null) {
        //     this.camera.translateX(e.acceleration.x * 100);
        //     this.camera.translateY(e.acceleration.y * 100);
        //     this.camera.translateZ(e.acceleration.z * 100);
        // }

        this.cameraMotion = e;
    }

    // Clear renderer before and after rendering camera
    update() {
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.renderer.clearDepth();
        if (this.loaded) this.processFrame();
    }

    processFrame() {
        const gl = renderer.context;
        const currentFrame = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
        // read image data from gl
        gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, currentFrame);

        if (this.prevFrame !== null) {
            this.transform = motionEstimation(this.prevFrame, currentFrame, gl.drawingBufferWidth, gl.drawingBufferHeight);
        }

        this.prevFrame = currentFrame;
    }
}
