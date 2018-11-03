import * as TimelineMax from 'TimelineMax';
import * as BABYLON from 'babylonjs';
import * as BGUI from 'babylonjs-gui';
import {Howl, Howler} from 'howler';

let activeMusic = null;
let timeline = new TimelineMax();

let advancedTexture = new BGUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", scene);

let leftPanel = new BGUI.StackPanel("leftPanel");
leftPanel.width = "120px";
leftPanel.height = 0.75;
leftPanel.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
leftPanel.verticalAlignment = BGUI.Control.VERTICAL_ALIGNMENT_TOP;
leftPanel.isVertical = true;

let rightPanel = new BGUI.StackPanel("rightPanel");
rightPanel.width = "120px";
rightPanel.height = 0.75;
rightPanel.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
rightPanel.verticalAlignment = BGUI.Control.VERTICAL_ALIGNMENT_TOP;
rightPanel.isVertical = true;

let bottomPanel = new BGUI.StackPanel("bottomPanel");
bottomPanel.width = 1;
bottomPanel.height = "120px";
bottomPanel.horizontalAlignment = BGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
bottomPanel.verticalAlignment = BGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
bottomPanel.isVertical = false;

advancedTexture.addControl(leftPanel);
advancedTexture.addControl(rightPanel);
advancedTexture.addControl(bottomPanel);
/**
 * param contain:
 * stack, name, image, width, height, onClick
 * stacks: leftPanel, rightPanel, bottomPanel
 * Generic button constructor.
 */
function CreateButton(param){
    let result = new BGUI.Button.CreateImageOnlyButton(param.name, param.image);
    result.width = param.width || defaults.width;
    result.height = param.height || defaults.height;
    result.onPointerUpObservable.add(param.onClick);
    param.stack.addControl(result);
    return result;
}
/**
 * Default properties of generic buttons for undefined properties.
 */
CreateButton.prototype = {
    defaults: {
        width: "60px",
        height: "60px",
    }
};

let togglePlayButton = CreateButton({
    stack: bottomPanel,
    name: "togglePlayButton",
    image,
    onClick: function(){
        if(activeMusic){
            if (timeline.paused()) {
                timeline.paused(false); Howl.play(activeMusic);
            } else {
                timeline.paused(true); Howl.pause(activeMusic);
            }
        }
        else{
            timeline.paused(!timeline.paused());
        }
    }
});

let stopButton = CreateButton({
    stack: bottomPanel,
    name: "stopButton",
    image,
    onClick: function(){
        timeline.pause(0);
        Howl.stop(activeMusic);
        motifs.update();
    }
});

let nextMotifButton = CreateButton({
    stack: bottomPanel,
    name: "nextMotifButton",
    image,
    onClick: function(){
        motifs.goForward();
    }
});

let previousMotifButton = CreateButton({
    stack: bottomPanel,
    name: "previousMotifButton",
    image,
    onClick: function(){
        motifs.goBackward();
    }
});

let addGuideLineButton = CreateButton({
    stack: leftPanel,
    name: "addGuideLineButton",
    image,
    onClick: function(){
        motifs.current().addNewGuide("linear")
    }
});

let addGuideCircleButton = CreateButton({
    stac: leftPanel,
    name: "addGuideCircleButton",
    image,
    onClick: function(){
        motifs.current().addNewGuide("circle")
    }
});

export let GUI = {
    initGUI,
    CreateButton
};
