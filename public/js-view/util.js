class ObservableView {
    constructor() {
        this._callbacks = [];
    }

    addObserver(callback) {
        this._callbacks.push(callback);
    }

    removeObserver(callback) {
        this._callbacks.splice(callback);
    }

    removeAllObserver(){
        this._callbacks.forEach(callback => {
            this.removeObserver(callback);
        })
    }

    notifyObserver(state) {
        this._callbacks.forEach(callback => {
            callback(this, state);
        });
    }
}
