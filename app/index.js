import { scene } from './SceneConstructor';
import {AnimatableGroup} from "./Classes/AnimatableGroup";
import {Group} from "./Classes/Group";
import {MeshBuilder} from "@babylonjs/core";

import {PlayerMember} from "./Members/PlayerMember";
import {MotifMember} from "./Members/MotifMember";

let Motifs = new Group({
    "name": "Motifs",
    "memberClass": MotifMember
});

Motifs.getInterval = ()=>{return Motifs.activeMember.interval};

Motifs.CreateNewMember({
    "name": "My Custom Motif",
    "interval": {start: 0, end: 2}
});

let Players = new AnimatableGroup({
    "name": "Players",
    "memberClass": PlayerMember,
    "intervalPipe": register => {register.interval = Motifs.getInterval(); return register}
});

Players.CreateNewMember({
    "name": "My Custom Player",
    "animatableObject": new MeshBuilder.CreateBox("playerAnimatableObject", {size: 1}, scene)
});
let newMember = Players.activeMember;
newMember.addRegister();
Motifs.CreateNewMember({interval: {start: 10, end: 12}});
newMember.animatableObject.position.x += 5;
newMember.addRegister();
newMember.animate();



window.motifs = Motifs;
window.players = Players;