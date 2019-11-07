import {property} from "underscore";

export class Register{
    constructor(intervalPipe){
        this.pipeline = [];
        if(intervalPipe){
            this.addPipe(intervalPipe);
        }
        this.animatableProperties = [];
    }
    addAnimatableProperty(target, keys, value){
        this.animatableProperties.push({
            target: target,
            keys: keys,
            value: property(value)
        });
    }
    addPipe(pipe){
        this.pipeline.push(pipe)
    }
    pipe() {
        let register = {"position": 1};
        let registerPipe = this._piper.apply(this, this.pipeline);
        return registerPipe(register);
    }
}

Register.prototype._piper = (...fns) => (x) => fns.reduce((v, f) => f(v), x);