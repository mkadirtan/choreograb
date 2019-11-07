import {Group} from "./Group";

export class AnimatableGroup extends Group{
    constructor(param){
        super(param);
        this.intervalPipe = param.intervalPipe
    }
    getIntervalPipe(){
        return this.intervalPipe;
    }
}