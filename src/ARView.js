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
        // var map = new THREE.TextureLoader().load( "./pulpitrock.jpg" );
        // var material = new THREE.SpriteMaterial({ map: map });

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
            // convert to radians
            let diffX = (e.beta - this.cameraOrientation.beta) * Math.PI / 180;
            let diffY = (e.gamma - this.cameraOrientation.gamma) * Math.PI / 180;

            this.sceneCamera.rotation.x += diffX;
            this.sceneCamera.rotation.y += diffY;
        }

        this.cameraOrientation = e;
    }

    // keep virtual world position in sync with real world
    handleMotion(e) {
        if(this.cameraMotion !== null) {
            this.camera.translateX(Math.round(e.acceleration.x) / 100);
            this.camera.translateY(Math.round(e.acceleration.y) / 100);
            this.camera.translateZ(Math.round(e.acceleration.z) / 100);
        }

        this.cameraMotion = e;
    }

    // Clear renderer before and after rendering camera
    update() {
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.renderer.clearDepth();
    }
}
