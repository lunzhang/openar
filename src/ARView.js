import jsfeat from 'jsfeat';

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

        jsfeat.fast_corners.set_threshold(20);

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
        // const map = new THREE.TextureLoader().load("./pulpitrock.jpg", () => {
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
            // allocate data structure for tracker
            const currentPyramidT = new jsfeat.pyramid_t(1);
            const prevPyramidT = new jsfeat.pyramid_t(1);
            currentPyramidT.allocate(gl.drawingBufferWidth, gl.drawingBufferHeight, jsfeat.U8_t | jsfeat.C1_t);
            prevPyramidT.allocate(gl.drawingBufferWidth, gl.drawingBufferHeight, jsfeat.U8_t | jsfeat.C1_t);

            // get greyscale version of previous and current frame
            jsfeat.imgproc.grayscale(currentFrame, gl.drawingBufferWidth, gl.drawingBufferHeight, currentPyramidT.data[0], jsfeat.COLOR_RGBA2GRAY);
            jsfeat.imgproc.grayscale(this.prevFrame, gl.drawingBufferWidth, gl.drawingBufferHeight, prevPyramidT.data[0], jsfeat.COLOR_RGBA2GRAY);

            // initialize previous and current frame features
            // detect features for previous frame only using fast algorithm
            const currentCorners = [];
            const prevCorners = [];
            for (let i = 0; i < gl.drawingBufferWidth * gl.drawingBufferHeight; i++) {
                prevCorners[i] = new jsfeat.keypoint_t();
            }
            const featuresCount = jsfeat.fast_corners.detect(prevPyramidT.data[0], prevCorners, 3);

            // convert detected frames to array format
            const prevCornersArray = [];
            for (let i = 0; i < featuresCount; i++) {
                prevCornersArray.push(prevCorners[i].x);
                prevCornersArray.push(prevCorners[i].y);
            }

            // klt tracker - tracks features in previous img and maps them to current
            const status = [];
            jsfeat.optical_flow_lk.track(prevPyramidT, currentPyramidT,
            prevCornersArray, currentCorners, featuresCount,
            20, 30, status, 0.01, 0.0001);
        }

        this.prevFrame = currentFrame;
    }
}
