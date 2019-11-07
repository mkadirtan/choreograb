import {Member} from "../Classes/Member";

export class MotifMember extends Member{
    constructor(group, param){
        super(group, param);
        this.interval = param.interval;
    }
}