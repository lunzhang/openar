export default class ARDebugger {
    constructor(arView) {
        this.arView = arView;
        this.init();
    }

    init() {
        this.debugWindow = document.createElement('div');
        this.debugWindow.id = 'debug-window';
        this.debugWindow.style.position = 'fixed';
        this.debugWindow.style.bottom = '0px';
        this.debugWindow.style.left = '0px';
        this.debugWindow.style.color = 'white';
        this.debugWindow.style.backgroundColor = 'transparent';
        this.debugWindow.style.whiteSpace = 'pre';
        this.debugWindow.style.padding = '10px';
        document.body.append(this.debugWindow);
    }

    update() {
        if(this.arView.cameraOrientation === null || this.arView.cameraMotion === null) return;
        this.debugWindow.innerHTML = 'alpha: ' + this.arView.cameraOrientation.alpha + '\n';
        this.debugWindow.innerHTML += 'beta: ' + this.arView.cameraOrientation.beta + '\n';
        this.debugWindow.innerHTML += 'gamma: ' + this.arView.cameraOrientation.gamma + '\n';
        this.debugWindow.innerHTML += 'acceleration.x: ' + this.arView.cameraMotion.acceleration.x + '\n';
        this.debugWindow.innerHTML += 'acceleration.y: ' + this.arView.cameraMotion.acceleration.y + '\n';
        this.debugWindow.innerHTML += 'acceleration.z: ' + this.arView.cameraMotion.acceleration.z + '\n';
    }
}
