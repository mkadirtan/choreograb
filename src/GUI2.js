import {scene} from './scene';
import * as GUI from 'babylonjs-gui';
/**
 * advancedTexture is the GUI object of BABYLON.
 * There are 3 panels; leftPanel, rightPanel, bottomPanel.
 * All of which's size are determined via pixels and percentages, below.
 * CreateButton constructor
 */

let advancedTexture = new BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", scene);

export let leftPanel = new BABYLON.GUI.StackPanel("leftPanel");
leftPanel.width = "120px";
leftPanel.height = 0.75;
leftPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
leftPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
leftPanel.isVertical = true;

export let rightPanel = new BABYLON.GUI.StackPanel("rightPanel");
rightPanel.width = "120px";
rightPanel.height = 0.75;
rightPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
rightPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
rightPanel.isVertical = true;

export let bottomPanel = new BABYLON.GUI.StackPanel("bottomPanel");
bottomPanel.width = 1;
bottomPanel.height = "120px";
bottomPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
bottomPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
bottomPanel.isVertical = false;

advancedTexture.addControl(leftPanel);
advancedTexture.addControl(rightPanel);
advancedTexture.addControl(bottomPanel);

/**
 * CreateButton makes it easier to create and set parameters of a button.
 * It assigns name, image, width, size, onClick function of the button,
 * then returns the created BABYLON.GUI.Button object.
 */
/*export function CreateButton(param){
    let result = new BABYLON.GUI.Button.CreateImageOnlyButton(param.name, param.image);
    result.width = param.width || "60px";
    result.height = param.height || "60px";
    result.onPointerUpObservable.add(param.onClick());
    param.stack.addControl(result);
    return result;
}*/
/**
 * Default properties of generic buttons for undefined properties.
 */