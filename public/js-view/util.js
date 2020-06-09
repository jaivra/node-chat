class ObservableView {
    constructor() {
        this._callbacks = new Map();
    }

    addObserver(event, callback) {
        if (!this._callbacks.has(event))
            this._callbacks[event] = [];

        this._callbacks[event].push(callback);
    }

    removeObserver(callback) {
        this._callbacks.splice(callback);
    }

    removeAllObserver() {
        this._callbacks.forEach(callback => {
            this.removeObserver(callback);
        })
    }

    notifyObserver(event, state) {
        const interestedCallbacks = this._callbacks[event];
        interestedCallbacks.forEach(callback => {
            callback(this, state);
        });
    }

}
