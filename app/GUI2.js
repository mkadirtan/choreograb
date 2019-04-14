/**
 * ASSETS
 */
import i_play from './media/textures/play.png';
import i_pause from './media/textures/pause.png';
import i_stop from './media/textures/stop.png';
import i_next from './media/textures/next.png';
import i_previous from './media/textures/previous.png';
import i_forward from './media/textures/fastForward.png';
import i_backward from './media/textures/fastBackward.png';
import i_camera from './media/textures/camera.png';
import i_save from './media/textures/save.png';
import i_load from './media/textures/load.png';
import i_redo from './media/textures/redo.png';
import i_undo from './media/textures/undo.png';
import i_newMotif from './media/textures/newMotif.png';

/**
 * ASSETS
 */
/**
 * BABYLON IMPORTS
 */
import {AdvancedDynamicTexture, StackPanel, Control, Slider, TextBlock, InputText, Button as babylonButton} from "@babylonjs/gui";
import {Vector3} from "@babylonjs/core";
import {Observable} from "@babylonjs/core";
import {TimelineMax} from "gsap/TimelineMax";
import * as axios from 'axios';
/**
 * BABYLON IMPORTS
 */
/**
 * LOCAL IMPORTS
 */
import {scene, switchCamera} from './scene';
import {timeControl} from './timeline';
import {Motifs, Motif} from './motifs';
import {Guides, Guide} from "./guides";
import {Players} from "./players";
import {actionTakenObservable, sceneControl} from "./sceneControl";
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

let controlBaseSize = 80;
let controlPadding = 1;
let fontBaseSize = 24;

export let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene);
advancedTexture.idealWidth = 1920;

let leftPanel = new StackPanel("leftPanel");
leftPanel.width = controlBaseSize + "px";
leftPanel.height = 0.75;
leftPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
leftPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
leftPanel.isVertical = true;

let rightPanel = new StackPanel("rightPanel");
rightPanel.width = controlBaseSize + "px";
rightPanel.height = 0.75;
rightPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
rightPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
rightPanel.isVertical = true;

let bottomPanel = new StackPanel("bottomPanel");
bottomPanel.width = "1920px";
bottomPanel.height = controlBaseSize + "px";
bottomPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
bottomPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
bottomPanel.isVertical = false;

let notificationPanel = new StackPanel("notificationPanel");
notificationPanel.width = 1920 - 2.5*controlBaseSize + "px";
notificationPanel.height = 1.5*fontBaseSize + "px";
notificationPanel.top = -controlBaseSize + "px";
notificationPanel.paddingLeft = 1920/2 + "px";
notificationPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
notificationPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
notificationPanel.isVertical = false;

let notificationText = new TextBlock();
notificationText.fontSize = 1.5*fontBaseSize + "px";
notificationText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;

notificationPanel.addControl(notificationText);
let fader = new TimelineMax();

export function notify(message, type){
    let bgColor = "";
    switch(type){
        case "error":
            bgColor = "red";
            notificationText.color = "white";
            break;
        case "system":
            bgColor = "blue";
            notificationText.color = "white";
            break;
        default:
            bgColor = "grey";
            notificationText.color = "black";
    }
    fader.kill({alpha: true});
    fader.to(notificationPanel, 1, {alpha: 1}, 0).to(notificationPanel, 1, {alpha: 0}, 5);
    notificationText.text = String(message);
    notificationPanel.background = bgColor;
}

advancedTexture.addControl(bottomPanel);
advancedTexture.addControl(leftPanel);
advancedTexture.addControl(rightPanel);
advancedTexture.addControl(notificationPanel);

let cameraButton = new Button({name: "cameraButton", image: i_camera, stack: rightPanel, onClick(){
        switchCamera();
    }
});

let playButton = new Button({name: "play", image: i_play, stack: bottomPanel,  onClick(){
        timeControl.play().
        then(()=>{notify("Scene is playing. Please pause before taking action!", "system")}).
        catch((error)=>notify(error, "error"));
    }
});
let pauseButton = new Button({name: "pause", image: i_pause, stack: bottomPanel, onClick(){
        timeControl.pause().
        then(()=>notify("Scene is paused. You can continue editing!", "system")).
        catch((error)=>notify(error, "error"));
    }
});
let stopButton = new Button({name: "stop", image: i_stop, stack: bottomPanel, onClick(){
        timeControl.stop().
        then(()=>notify("Scene is stopped. You can continue editing!", "system")).
        catch((error)=>notify(error, "error"));
    }
});
let previousButton = new Button({name: "previous", image: i_previous, stack: bottomPanel, onClick(){
        Motifs.previousMotif().
        then(e=>{notify("You are currently editing " + e + ".", "system")}).
        catch(e=>notify(e,"error"));
    }
});
let nextButton = new Button({name: "next", image: i_next, stack: bottomPanel, onClick(){
        Motifs.nextMotif().
        then(e=>{notify("You are currently editing " + e + ".", "system")}).
        catch(e=>notify(e,"error"));
    }
});

let saveButton = new Button({name: "save", image: i_save, stack: rightPanel, onClick(){
        sceneControl.save();
    }
});

let loadButton = new Button({name: "load", image: i_load, stack: rightPanel, onClick(){
        sceneControl.load();
    }
});

let undoButton = new Button({name: "undo", image: i_undo, stack: leftPanel, onClick(){
        sceneControl.undo();
    }
});

let redoButton = new Button({name: "redo", image: i_redo, stack: leftPanel, onClick(){
        sceneControl.redo();
    }
});

let newMotifButton = new Button({name: "newMotif", image: i_newMotif, stack: leftPanel, onClick(){
    let start = parseInt(leftPanel.getChildByName("motifStart").text);
    let end = start + parseInt(leftPanel.getChildByName("motifDuration").text);
    new Motif({name: "generated", start, end}).
    then(()=>actionTakenObservable.notifyObservers("New motif created!")).
    catch((error)=>{notify(error.message, "error")});
    }
});

let newCircleGuideButton = new Button({name: "newCircleGuide", image: i_next, stack: leftPanel, onClick(){
        Guides.create.CircleGuide();
    }
});

let motifStartInput = new InputText("motifStart", "start");
motifStartInput.height = controlBaseSize + "px";
motifStartInput.width = controlBaseSize + "px";
motifStartInput.color = "#FFFFFF";
let motifDurationInput = new InputText("motifDuration", "duration");
motifDurationInput.height = controlBaseSize + "px";
motifDurationInput.width = controlBaseSize + "px";
motifDurationInput.color = "#FFFFFF";
leftPanel.addControl(motifStartInput);
leftPanel.addControl(motifDurationInput);

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
slider.width = 1920-7*(controlBaseSize) + "px";
slider.height = controlBaseSize + "px";
slider.paddingRight = 2*controlPadding + "px";
slider.paddingLeft = 2*controlPadding + "px";
slider.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
slider.value = 0;
bottomPanel.addControl(slider);

export let timePrint = new TextBlock();

timePrint.color = "white";
timePrint.text = "0.00 sn";
timePrint.fontSize = fontBaseSize + "px";
timePrint.height = controlBaseSize + "px";
timePrint.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
timePrint.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
rightPanel.addControl(timePrint);

let fastBackward = new Button({name: "fBackward", image: i_backward, stack: bottomPanel, onClick(){
        timeControl.speed("decrease").
        then(speed=>notify("Speed is set to: x" + speed, "system")).
        catch(e=>notify(e, "error"));
    }
});
let fastForward = new Button({name: "fForward", image: i_forward, stack: bottomPanel, onClick(){
        timeControl.speed("increase").
        then(speed=>notify("Speed is set to: x" + speed, "system")).
        catch(e=>notify(e, "error"));
    }
});

/**
 * CreateButton makes it easier to create and set parameters of a button.
 * It assigns name, image, width, size, onClick function of the button,
 * then returns the created babylonButton object.
 */
export function Button(param){
    let result = new babylonButton.CreateImageOnlyButton(param.name, param.image);
    result.width = param.width || controlBaseSize + "px";
    result.height = param.height || controlBaseSize + "px";
    result.cornerRadius = 7;
    result.paddingBottom = controlPadding + "px";
    result.paddingTop = controlPadding + "px";
    result.paddingLeft = controlPadding + "px";
    result.paddingRight = controlPadding + "px";

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