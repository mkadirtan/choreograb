"use strict";
import {MeshBuilder} from "@babylonjs/core";

import { scene } from './SceneConstructor';

import { TimelineControl } from "./Controllers/TimelineControl";

import {AnimatableGroup} from "./Classes/AnimatableGroup";
import {Group} from "./Classes/Group";

import {PlayerMember} from "./Members/PlayerMember";
import {MotifMember} from "./Members/MotifMember";

import "./GUI/GUI"

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

TimelineControl.addGroupToTimeline(Players);

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
window.timeControl = TimelineControl;