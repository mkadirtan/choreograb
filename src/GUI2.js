/**
 * ASSETS
 */
import button1 from './media/textures/play.png';
import button2 from './media/textures/pause.png';
import button3 from './media/textures/stop.png';
import button4 from './media/textures/next.png';
import button5 from './media/textures/previous.png';
import button6 from './media/textures/fastForward.png';
import button7 from './media/textures/fastBackward.png';
import button8 from './media/textures/camera.png';
/**
 * ASSETS
 */
/**
 * BABYLON IMPORTS
 */
import {AdvancedDynamicTexture, StackPanel, Control, Slider, TextBlock, Button as babylonButton} from "@babylonjs/gui";
import {Observable} from "@babylonjs/core";
/**
 * BABYLON IMPORTS
 */
/**
 * LOCAL IMPORTS
 */
import {scene, switchCamera} from './scene';
import {timeControl} from './timeline';
import {Motifs} from './motifs';
import {Guides} from "./guides";
import {Players} from "./players";
import {sceneControl} from "./sceneControl";
import scenesave from  "./scenesave";
/**
 * LOCAL IMPORTS
 */
/**
 * advancedTexture is the GUI object of BABYLON.
 * Sizes are determined relative to idealWidth.
 * There are 3 panels; leftPanel, rightPanel, bottomPanel.
 * All of which's size are determined via pixels and percentages, below.
 */
export let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene);
advancedTexture.idealWidth = 1920;

let leftPanel = new StackPanel("leftPanel");
leftPanel.width = "160px";
leftPanel.height = 0.75;
leftPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
leftPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
leftPanel.isVertical = true;

let rightPanel = new StackPanel("rightPanel");
rightPanel.width = "120px";
rightPanel.height = 0.75;
rightPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
rightPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
rightPanel.isVertical = true;

let bottomPanel = new StackPanel("bottomPanel");
bottomPanel.width = "1920px";
bottomPanel.height = "120px";
bottomPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
bottomPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
bottomPanel.isVertical = false;

advancedTexture.addControl(leftPanel);
advancedTexture.addControl(rightPanel);
advancedTexture.addControl(bottomPanel);

let cameraButton = new Button({name: "cameraButton", image: "./camera.png", stack: rightPanel, onClick(){
        console.log(scene.meshes);
        console.log("getting by ID..");
        //todo not working, submit PG!
        console.log(scene.getMeshesByID("Player"));
    }
});

let playButton = new Button({name: "play", image: "./play.png", stack: bottomPanel,  onClick(){
        timeControl.play();
    }
});
let pauseButton = new Button({name: "pause", image: "./pause.png", stack: bottomPanel, onClick(){
        //timeControl.timeline.pause();
        sceneControl.load(scenesave);
    }
});
let stopButton = new Button({name: "stop", image: "./stop.png", stack: bottomPanel, onClick(){
        timeControl.stop();
        Motifs.update();
    }
});
let previousButton = new Button({name: "previous", image: "./previous.png", stack: bottomPanel, onClick(){
        sceneControl.undo();
    }
});
let nextButton = new Button({name: "next", image: "./next.png", stack: bottomPanel, onClick(){
        sceneControl.redo();
    }
});
//bottomPanel.addControl(playPanel);

export let slider = new Slider("mainSlider");
slider.minimum = 0;
slider.maximum = 50;
slider.onPointerDownObservable.add(function(){
    slider.onValueChangedObservable.add(value => {
        timePrint.text = value.toFixed(2) + " sn";
        timeControl.updateTimeline();
        /*if(value <= timeControl.timeline.totalDuration()){
            timeControl.timeline.seek(value, false);
        }*/
    });
});
slider.onPointerUpObservable.add(function(){
    slider.onValueChangedObservable.clear();
});
slider.width = 1920-7*120 + "px";
slider.height = "120px";
slider.paddingRight = "8px";
slider.paddingLeft = "8px";
slider.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
slider.value = 0;
bottomPanel.addControl(slider);

export let timePrint = new TextBlock();

timePrint.color = "white";
timePrint.text = "0.00 sn";
timePrint.fontSize = "24px";
leftPanel.addControl(timePrint);

let fastBackward = new Button({name: "fBackward", image: "./fastBackward.png", stack: bottomPanel, onClick(){
        Motifs.previousMotif();
    }
});
let fastForward = new Button({name: "fForward", image: "./fastForward.png", stack: bottomPanel, onClick(){
        Motifs.nextMotif();
    }
});

/**
 * CreateButton makes it easier to create and set parameters of a button.
 * It assigns name, image, width, size, onClick function of the button,
 * then returns the created babylonButton object.
 */
export function Button(param){
    let result = new babylonButton.CreateImageOnlyButton(param.name, param.image);
    result.width = param.width || "120px";
    result.height = param.height || "120px";
    result.cornerRadius = 3.5;
    if(param.onClick)result.onPointerUpObservable.add(param.onClick);
    if(param.stack === leftPanel){
        result.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    }
    else if(param.stack === rightPanel){
        result.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    }
    else if(param.stack === bottomPanel){
        result.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    }
    param.stack.addControl(result);
    return result;
}
/**
 * Default properties of generic buttons for undefined properties.
 */

export let selectionModeObservable = new Observable();
selectionModeObservable.add(mode=>{
    Guides.guides.forEach(guide=>guide.isSelectable(mode==="guides"));
    Players.players.forEach(player=>{player.isSelectable(mode==="players")});
});
export let currentMode = "players";

scene.onKeyboardObservable.add((eventData, eventState)=>{
    if(eventData.event.altKey === true && eventData.event.code === "AltLeft" && eventData.type === 1 && eventState.mask === 1){
        selectionModeObservable.notifyObservers("guides");
    }
    else{selectionModeObservable.notifyObservers("players")}
});