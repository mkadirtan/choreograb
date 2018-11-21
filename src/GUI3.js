import * as GUI from 'babylonjs-gui';
import {scene, anchor} from './scene';

let manager = new BABYLON.GUI.GUI3DManager(scene);

let newGuideButton = new BABYLON.GUI.Button3D("newGuideButton");
//newGuideButton.linkToTransformNode(anchor);
let text = new BABYLON.GUI.TextBlock(undefined, "Click to Add Guide");
text.color = "white";
text.fontSize = 96;
newGuideButton.content = text;
manager.addControl(newGuideButton);