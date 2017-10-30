export default class OpenAR {
  constructor(renderer) {
    this.renderer = renderer;
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
    // video element
    this.video = document.createElement('video');

    // get user camera and attach to video element
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.video.src = window.URL.createObjectURL(stream);
      });
    }

    // this.videoTexture = new THREE.VideoTexture(this.video);
    // this.videoTexture.minFilter = THREE.LinearFilter;
    // this.videoTexture.magFilter = THREE.LinearFilter;
    //
    // const material = new THREE.SpriteMaterial({ map: this.videoTexture });

    // testing without webcam
    var map = new THREE.TextureLoader().load( "./pulpitrock.jpg" );
    var material = new THREE.SpriteMaterial({ map: map });

    this.screen = new THREE.Sprite(material);
    this.screen.scale.set(2, 2);
    this.scene.add(this.screen);
  }

  update() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}

global.OpenAR = OpenAR;
