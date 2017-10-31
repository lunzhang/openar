/**
* Renders camera onto canvas
* Gets camera using video element
* Add camera view to scene as a sprite
**/
export default class OpenAR {
  constructor(renderer, camera) {
    this.renderer = renderer;
    this.renderer.autoClear = false;

    this.sceneCamera = camera;

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
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
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
    window.addEventListener('deviceorientation', this.handleOrientation);
  }

  // keep virutal world camera sync with real world
  handleOrientation(e) {
    // convert value from degree to radians
    let beta = e.beta * Math.PI / 180;
    let gamma = e.gamma * Math.PI / 180;
    let alpha = e.alpha * Math.PI / 180;

    this.sceneCamera.rotation.x = beta;
    this.sceneCamera.rotation.y = gamma;
    this.sceneCamera.rotation.z = alpha;
  }

  // Clear renderer before and after rendering camera
  update() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.clearDepth();
  }
}

global.OpenAR = OpenAR;
