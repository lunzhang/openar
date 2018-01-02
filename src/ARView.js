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
        this.prevFrame = null;

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1);
        this.camera.position.z = 1;

        this.init();
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

        this.screen = new THREE.Sprite(material);
        this.screen.scale.set(2, 2);
        this.scene.add(this.screen);
    }

    // Clear renderer before and after rendering camera
    update() {
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.renderer.clearDepth();
        this.processFrame();
    }

    // Keeps real and virtual world in sync
    processFrame() {
        const gl = renderer.context;
        const currentFrame = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);

        // Read image data from gl
        gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, currentFrame);

        if (this.prevFrame !== null) {
            this.pose = motionEstimation(this.prevFrame, currentFrame, gl.drawingBufferWidth, gl.drawingBufferHeight);
            this.sceneCamera.rotation.x += pose.rotation.x;
            this.sceneCamera.rotation.y += pose.rotation.y;
            this.sceneCamera.rotation.z += pose.rotation.z;
            this.sceneCamera.translation.x += pose.translation.x;
            this.sceneCamera.translation.y += pose.translation.y;
            this.sceneCamera.translation.z += pose.translation.z;
        }

        this.prevFrame = currentFrame;
    }
}
