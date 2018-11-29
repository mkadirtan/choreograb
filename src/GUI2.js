import {scene} from './scene';
import * as GUI from 'babylonjs-gui';
import {timeControl} from './timeline';
import * as BABYLON from "babylonjs";
import button1 from './media/textures/play.png';
import button2 from './media/textures/pause.png';
import button3 from './media/textures/stop.png';
import button4 from './media/textures/next.png';
import button5 from './media/textures/previous.png';
import button6 from './media/textures/fastForward.png';
import button7 from './media/textures/fastBackward.png';
import button8 from './media/textures/camera.png';

/**
 * advancedTexture is the GUI object of BABYLON.
 * There are 3 panels; leftPanel, rightPanel, bottomPanel.
 * All of which's size are determined via pixels and percentages, below.
 * CreateButton constructor
 */

export let advancedTexture = new BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene);
//new BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", scene);

let leftPanel = new BABYLON.GUI.StackPanel("leftPanel");
leftPanel.width = "120px";
leftPanel.height = 0.75;
leftPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
leftPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
leftPanel.isVertical = true;

let rightPanel = new BABYLON.GUI.StackPanel("rightPanel");
rightPanel.width = "120px";
rightPanel.height = 0.75;
rightPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
rightPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
rightPanel.isVertical = true;

let bottomPanel = new BABYLON.GUI.StackPanel("bottomPanel");
bottomPanel.width = 1;
bottomPanel.height = "72px";
bottomPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
bottomPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
bottomPanel.isVertical = false;

advancedTexture.addControl(leftPanel);
advancedTexture.addControl(rightPanel);
advancedTexture.addControl(bottomPanel);

let cameraButton = new CreateButton({name: "cameraButton", image: "./cameraButton.png", stack: rightPanel, onClick(){
    let canvas = scene.getEngine().getRenderingCanvas();
    let pers = scene.getCameraByName("pers");
    let ortho = scene.getCameraByName("ortho");
    let fps = scene.getCameraByName("fps");
    if(scene.activeCamera === pers) {
        pers.detachControl(canvas);
        scene.setActiveCameraByName("ortho");
        ortho.attachControl(canvas,true);
    }
    else if(scene.activeCamera === scene.getCameraByName("ortho")){
        ortho.detachControl(canvas);
        scene.setActiveCameraByName("fps");
        fps.attachControl(canvas, true);
    }
    else{
        fps.detachControl(canvas);
        scene.setActiveCameraByName("pers");
        pers.attachControl(canvas,true);
    }
}});


let playPanel = new BABYLON.GUI.StackPanel();
playPanel.isVertical = false;

let playButton = new CreateButton({name: "play", image: "./play.png", stack: playPanel, onClick(){timeControl.timeline.play()}});
let pauseButton = new CreateButton({name: "pause", image: "./pause.png", stack: playPanel, onClick(){timeControl.timeline.pause()}});
let stopButton = new CreateButton({name: "stop", image: "./stop.png", stack: playPanel, onClick(){timeControl.timeline.pause().seek(0)}});
let previousButton = new CreateButton({name: "previous", image: "./previous.png", stack: playPanel});
let nextButton = new CreateButton({name: "next", image: "./next.png", stack: playPanel});
bottomPanel.addControl(playPanel);

export let slider = new BABYLON.GUI.Slider("mainSlider");
slider.minimum = 0;
slider.maximum = 30;
slider.onValueChangedObservable.add(function(){
    timeControl.timeline.seek(slider.value);
});
//let mult = Math.round((slider.widthInPixels - 72*7)/slider.widthInPixels);
slider.width = 0.728;
slider.paddingRight = "5px";
slider.paddingLeft = "5px";
console.log(slider);
bottomPanel.addControl(slider);

let forwardPanel = new BABYLON.GUI.StackPanel();
forwardPanel.isVertical = false;
let fastBackward = new CreateButton({name: "fBackward", image: "./fastBackward.png", stack: forwardPanel});
let fastForward = new CreateButton({name: "fForward", image: "./fastForward.png", stack: forwardPanel});
bottomPanel.addControl(forwardPanel);

/**
 * CreateButton makes it easier to create and set parameters of a button.
 * It assigns name, image, width, size, onClick function of the button,
 * then returns the created BABYLON.GUI.Button object.
 */
export function CreateButton(param){
    let result = new BABYLON.GUI.Button.CreateImageOnlyButton(param.name, param.image);
    result.width = param.width || "72px";
    result.height = param.height || "72px";
    if(param.onClick)result.onPointerUpObservable.add(param.onClick);
    param.stack.addControl(result);
    return result;
}
/**
 * Default properties of generic buttons for undefined properties.
 */