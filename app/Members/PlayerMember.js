import {pick} from "underscore";
import {AnimatableMember} from "../Classes/AnimatableMember";
import {PointerDragBehavior, Vector3} from "@babylonjs/core";

export class PlayerMember extends AnimatableMember {
    constructor(group, param) {
        super(group, param);
        this.register.addAnimatableProperty(["animatableObject","position"], {"x": true, "y": true, "z": true}, "position");
        this.register.addPipe(register=>{register["position"] = this.getPosition(); return register});
        attachDragBehavior(this);
    }
    getPosition() {
        let current_position = this.animatableObject.position;
        return pick(current_position, 'x', 'y', 'z');
    }
}

function attachDragBehavior(member) {
    let pointerDragBehavior = new PointerDragBehavior({dragPlaneNormal: new Vector3(0, 1, 0)});
    pointerDragBehavior.dragDeltaRatio = 1;
    pointerDragBehavior.useObjectOrienationForDragging = false;
    pointerDragBehavior.updateDragPlane = false;
    member.animatableObject.addBehavior(pointerDragBehavior);

    pointerDragBehavior.onDragEndObservable.add(() => {
        member.addRegister();
        //todo actionTakenObservable.notifyObservers();
        //todo Reattaching canvas control, because sometimes it doesn't work.
        //scene.activeCamera.attachControl(scene.getEngine().getRenderingCanvas(), true);
    });
}


