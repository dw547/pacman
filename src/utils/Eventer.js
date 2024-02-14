

class Eventer {
    constructor() {
        this._callbacks = [];
    }

    addCallback(theCallback) {
        this._callbacks.push(theCallback);
    }

    removeCallback(theCallback) {

        let theIndex = this._callbacks.indexOf(theCallback);
        if (theIndex >= 0) {
            this._callbacks.splice(theIndex, 1);
        }
    }

    removeAllCallbacks() {
        this._callbacks = [];
    }

    raiseEvent(data=null) {
        if (data === null) {
            data = {};
        }

        this._callbacks.forEach(function (theCallback) {
            try {
                theCallback(data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    get numCallbacks() {
        return this._callbacks.length;
    }
}

export default Eventer;