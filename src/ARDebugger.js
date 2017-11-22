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
        if(!this.arView.transform) return;
        for (let i = 0; i < this.arView.transform.data.length; i++) {
            this.debugWindow.innerHTML = this.arView.transform.data[i] + '\n';
        }
    }
}
