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
        if(!this.arView.pose) return;
        for (let i = 0; i < this.arView.transform.data.length; i++) {
            this.debugWindow.innerHTML = 'Rotation X: ' + this.arView.pose.rotation.x + '\n';
            this.debugWindow.innerHTML += 'Rotation Y: ' + this.arView.pose.rotation.y + '\n';
            this.debugWindow.innerHTML += 'Rotation Z: ' + this.arView.pose.rotation.z + '\n';
            this.debugWindow.innerHTML += 'Translation X: ' + this.arView.pose.translation.x + '\n';
            this.debugWindow.innerHTML += 'Translation Y: ' + this.arView.pose.translation.y + '\n';
            this.debugWindow.innerHTML += 'Translation Z: ' + this.arView.pose.translation.z + '\n';
        }
    }
}
