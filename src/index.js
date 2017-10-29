export default class OpenAR {
  constructor(scene) {
    this.scene = scene;
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

    this.videoTexture = new THREE.VideoTexture(this.video);
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;

    const material = new THREE.SpriteMaterial({ map: this.videoTexture });

    // testing without webcam
    // var map = new THREE.TextureLoader().load( "./pulpitrock.jpg" );
    // var material = new THREE.SpriteMaterial({ map: map });

    this.screen = new THREE.Sprite(material);
    this.scene.add(this.screen);
  }
}

global.OpenAR = OpenAR;
