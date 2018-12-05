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
import {players} from './players';
import {guides} from './guides';
import {Motifs} from './motifs';
/**
 * advancedTexture is the GUI object of BABYLON.
 * There are 3 panels; leftPanel, rightPanel, bottomPanel.
 * All of which's size are determined via pixels and percentages, below.
 * CreateButton constructor
 */

export let advancedTexture = new BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene);
advancedTexture.idealWidth = 1920;
//new BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", scene);

let leftPanel = new BABYLON.GUI.StackPanel("leftPanel");
leftPanel.width = "96px";
leftPanel.height = 0.75;
leftPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
leftPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
leftPanel.isVertical = true;

let rightPanel = new BABYLON.GUI.StackPanel("rightPanel");
rightPanel.width = "96px";
rightPanel.height = 0.75;
rightPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
rightPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
rightPanel.isVertical = true;

let bottomPanel = new BABYLON.GUI.StackPanel("bottomPanel");
bottomPanel.width = "1920px";
bottomPanel.height = "96px";
bottomPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
bottomPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
bottomPanel.isVertical = false;

advancedTexture.addControl(leftPanel);
advancedTexture.addControl(rightPanel);
advancedTexture.addControl(bottomPanel);

let cameraButton = new CreateButton({name: "cameraButton", image: "./stop.png", stack: rightPanel, onClick(){
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

export let motifChangeObservable = new BABYLON.Observable();

export let selectionModeObservable = new BABYLON.Observable();
export let currentMode = "players";

scene.onKeyboardObservable.add((eventData, eventState)=>{
    if(eventData.event.altKey === true && eventData.event.code === "AltLeft" && eventData.type === 1 && eventState.mask === 1){
        selectionModeObservable.notifyObservers("guides");
    }
    else{selectionModeObservable.notifyObservers("players")}
});

let playButton = new CreateButton({name: "play", image: "./play.png", stack: bottomPanel,  
    onClick(){
        players.forEach(player=>player.updateTimeline());
        timeControl.timeline.play()
    }
});
let pauseButton = new CreateButton({name: "pause", image: "./pause.png", stack: bottomPanel, onClick(){timeControl.timeline.pause()}});
let stopButton = new CreateButton({name: "stop", image: "./stop.png", stack: bottomPanel, onClick(){timeControl.timeline.seek(0)}});
let previousButton = new CreateButton({name: "previous", image: "./previous.png", stack: bottomPanel, onClick(){
    Motifs.previousMotif();
    console.log(Motifs.previous, Motifs.current, Motifs.next)
}});
let nextButton = new CreateButton({name: "next", image: "./next.png", stack: bottomPanel, onClick(){
    Motifs.nextMotif();
    console.log(Motifs.previous, Motifs.current, Motifs.next)
}});
//bottomPanel.addControl(playPanel);

export let slider = new BABYLON.GUI.Slider("mainSlider");
slider.minimum = 0;
slider.maximum = 50;
slider.onValueChangedObservable.add(function(){
    if(timeControl.timeline.paused()) timeControl.timeline.seek(slider.value);
});
slider.width = 1920-7*96 + "px";
slider.height = "96px"
slider.paddingRight = "5px";
slider.paddingLeft = "5px";
slider.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
bottomPanel.addControl(slider);

let fastBackward = new CreateButton({name: "fBackward", image: "./fastBackward.png", stack: bottomPanel});
let fastForward = new CreateButton({name: "fForward", image: "./fastForward.png", stack: bottomPanel});

/**
 * CreateButton makes it easier to create and set parameters of a button.
 * It assigns name, image, width, size, onClick function of the button,
 * then returns the created BABYLON.GUI.Button object.
 */
export function CreateButton(param){
    let result = new BABYLON.GUI.Button.CreateImageOnlyButton(param.name, param.image);
    result.width = param.width || "96px";
    result.height = param.height || "96px";
    result.cornerRadius = 3.5;
    if(param.onClick)result.onPointerUpObservable.add(param.onClick);
    param.stack.addControl(result);
    if(param.stack === leftPanel){
        result.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    }
    else if(param.stack === rightPanel){
        result.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    }
    else if(param.stack === bottomPanel){
        result.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    }
    return result;
}
/**
 * Default properties of generic buttons for undefined properties.
 */