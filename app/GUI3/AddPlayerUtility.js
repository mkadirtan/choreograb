import {ActionManager, ExecuteCodeAction, MeshBuilder} from "@babylonjs/core";
import {scene} from "../SceneConstructor";
import {Players} from '../Groups/Players';

export const addPlayerButton = MeshBuilder.CreateBox("addPlayerButton", {size: 1}, scene);

addPlayerButton.position.x = scene.getMeshByName("ground").getBoundingInfo().maximum.x + 1;
addPlayerButton.position.z = scene.getMeshByName("ground").getBoundingInfo().maximum.z;
console.log(scene.getMeshByName("ground").getBoundingInfo().maximum);
addPlayerButton.actionManager = new ActionManager(scene);
addPlayerButton.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnLeftPickTrigger,
        function(event){
            const newPlayer = Players.CreateNewMember({"name": "Unnamed Player", "animatableObject": addPlayerButton.clone("animatableObject")});
            //Might need later on
            //const pick = scene.pick(event.pointerX, event.pointerY, mesh=>mesh.name === "animatableObject");
            newPlayer.pointerDragBehavior.startDrag(event.sourceEvent.pointerId);
        }
    )
);