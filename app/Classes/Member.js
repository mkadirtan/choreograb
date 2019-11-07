import {Register} from "./Register";

export class Member {
    constructor(group, param) {
        this.group = group;
        this.groupName = group.name;
        this.name = param.name || "Unnamed Member";
        this.id = group.generateID(this);
    }
}

