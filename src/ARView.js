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
            // grayscale version of current and previous frames
            const currentGrayFrame = new jsfeat.matrix_t(gl.drawingBufferWidth, gl.drawingBufferHeight, jsfeat.U8_t | jsfeat.C1_t);
            const prevGrayFrame = new jsfeat.matrix_t(gl.drawingBufferWidth, gl.drawingBufferHeight, jsfeat.U8_t | jsfeat.C1_t);
            jsfeat.imgproc.grayscale(currentFrame, gl.drawingBufferWidth, gl.drawingBufferHeight, currentGrayFrame, jsfeat.COLOR_RGBA2GRAY);
            jsfeat.imgproc.grayscale(this.prevFrame, gl.drawingBufferWidth, gl.drawingBufferHeight, prevGrayFrame, jsfeat.COLOR_RGBA2GRAY);

            // initialize and detect current and previous frame corners
            const currentCorners = [];
            const prevCorners = [];
            for (let i = 0; i < currentGrayFrame.data.length; i++) {
                currentCorners[i] = new jsfeat.keypoint_t();
                prevCorners[i] = new jsfeat.keypoint_t();
            }
            jsfeat.fast_corners.detect(currentGrayFrame, currentCorners, 3);
            jsfeat.fast_corners.detect(prevGrayFrame, prevCorners, 3);

            // grayscale frames in pyramid_t data type
            const currentPyramidT = new jsfeat.pyramid_t();
            const prevPyramidT = new jsfeat.pyramid_t();
            currentPyramidT.allocate(gl.drawingBufferWidth, gl.drawingBufferHeight, currentGrayFrame.type);
            prevPyramidT.allocate(gl.drawingBufferWidth, gl.drawingBufferHeight, currentGrayFrame.type);
            currentPyramidT.data[0] = currentGrayFrame;
            prevPyramidT.data[0] = prevGrayFrame;

            // klt tracker
            const status = [];
            jsfeat.optical_flow_lk.track(prevPyramidT, currentPyramidT,
            prevCorners, currentCorners, currentGrayFrame.data.length,
            20, 30, status, 0.01, 0.0001);
        }

        this.prevFrame = currentFrame;
    }
}
