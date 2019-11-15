"use strict";
import {MeshBuilder} from "@babylonjs/core";
import { scene } from './SceneConstructor';

import "./GUI/GUIDecorator";
import "./GUI3/GUI3Decorator";
import {SceneControl, TimelineControl} from "./Controllers/ControllerDecorator";

const Motifs = SceneControl.getGroup("Motifs");
const Players = SceneControl.getGroup("Players");

Motifs.CreateNewMember({
    "name": "My Custom Motif",
    "interval": {start: 0, end: 2}
});
TimelineControl.addGroupToTimeline(Players);

Players.CreateNewMember({
    "name": "My Custom Player",
    "animatableObject": MeshBuilder.CreateBox("playerAnimatableObject", {size: 1}, scene)
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
window.SceneControl = SceneControl;