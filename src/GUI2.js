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
import {HistoryManager} from './history';
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
leftPanel.width = "96px";
leftPanel.height = 0.75;
leftPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
leftPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
leftPanel.isVertical = true;

let rightPanel = new StackPanel("rightPanel");
rightPanel.width = "96px";
rightPanel.height = 0.75;
rightPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
rightPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
rightPanel.isVertical = true;

let bottomPanel = new StackPanel("bottomPanel");
bottomPanel.width = "1920px";
bottomPanel.height = "96px";
bottomPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
bottomPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
bottomPanel.isVertical = false;

advancedTexture.addControl(leftPanel);
advancedTexture.addControl(rightPanel);
advancedTexture.addControl(bottomPanel);

let cameraButton = new Button({name: "cameraButton", image: "./camera.png", stack: rightPanel, onClick(){
        switchCamera();
    }
});

let playButton = new Button({name: "play", image: "./play.png", stack: bottomPanel,  onClick(){
        timeControl.play();
    }
});
let pauseButton = new Button({name: "pause", image: "./pause.png", stack: bottomPanel, onClick(){
        timeControl.timeline.pause();
    }
});
let stopButton = new Button({name: "stop", image: "./stop.png", stack: bottomPanel, onClick(){
        timeControl.stop();
        Motifs.update();
    }
});
let previousButton = new Button({name: "previous", image: "./previous.png", stack: bottomPanel, onClick(){
        sceneControl.register();
    }
});
let nextButton = new Button({name: "next", image: "./next.png", stack: bottomPanel, onClick(){
        sceneControl.load(scenesave);
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
slider.width = 1920-7*96 + "px";
slider.height = "96px";
slider.paddingRight = "5px";
slider.paddingLeft = "5px";
slider.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
slider.value = 0;
bottomPanel.addControl(slider);

export let timePrint = new TextBlock();
timePrint.color = "white";
timePrint.text = "0.00 sn";
leftPanel.addControl(timePrint);

let fastBackward = new Button({name: "fBackward", image: "./fastBackward.png", stack: bottomPanel, onClick(){
        HistoryManager.undo();
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
    result.width = param.width || "96px";
    result.height = param.height || "96px";
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
export let currentMode = "players";

scene.onKeyboardObservable.add((eventData, eventState)=>{
    if(eventData.event.altKey === true && eventData.event.code === "AltLeft" && eventData.type === 1 && eventState.mask === 1){
        selectionModeObservable.notifyObservers("guides");
    }
    else{selectionModeObservable.notifyObservers("players")}
});