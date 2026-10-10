
class TransformObject {
    constructor() {
        this.settings = {}
        this.name = "Transform Object";
    }
    get transform() {
        return this.getTransform();
    }
    getTransform() {
        return null;
    }
}


export {
    TransformObject
}