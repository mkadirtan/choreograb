import * as TimelineMax from 'TimelineMax';
import * as BABYLON from 'babylonjs';
import * as BGUI from 'babylonjs-gui';
import {Howl, Howler} from 'howler';

let activeMusic = null;
let timeline = new TimelineMax();
let motifs = {
    self: this,
    _current,
    _next,
    _previous,
    _motifs,
    //Hide or show motif guides according to time.
    update: function(){
        let currentTime = timeline.time();
        let temporaryCurrent = self._current;
        if(temporaryCurrent !== self.current()){
            temporaryCurrent.hideGuides();
        }
        if(self._current.start <= currentTime && currentTime <= self._current.end) {
            self._current.showGuides();
        }
        else{
            self._current.hideGuides();
        }
        return self;
    },
    //Check if _current is actually the current, if not replace it.
    //If there are at least 3 motifs, set previous and next motifs.
    current: function(){
        let currentTime = timeline.time();
        if(!(self._current.start <= currentTime && currentTime <= self._current.end)){
            self._motifs.forEach(
                function(motif, index, array){
                    if (motif.start <= currentTime && currentTime <= motif.end) {
                        if(array.length > 2){
                            if(index === array.length-1){
                                self._next = array[0];
                                self._previous = array[index-1];
                            }
                            else if(index === 0){
                                self._next = array[index+1];
                                self._previous = array[length-1];
                            }
                            else{
                                self._next = array[index+1];
                                self._previous = array[index-1];
                            }
                            self._next = array[index+1];
                            self._previous = array[index-1];
                        }
                        self._current = motif;
                        return self._current;
                    }
                }
            );
        }
        return self._current;
    },
};

function CreateGuide(param){
    this.name = param.name;
    this._type = param.type;
    this._points = param.points || null;
    this._motif = param.motif;
    this._resolution = 32;
    this._radius = param.radius || null;
    let temporaryPoints = [];
    switch(this._type){
        case "linear":
            this._parametricShape = BABYLON.MeshBuilder.CreateLines(this.name, {points: this.points, updatable: true}, scene);
            break;
        case "closure":
            temporaryPoints = this.points.push(this.points[0]);
            this._parametricShape = BABYLON.MeshBuilder.CreateLines(this.name, {points: temporaryPoints, updatable: true}, scene);
            temporaryPoints = [];
            break;
        case "circle":
            let temporaryPoints = [];
            for(let i = 0; i<this._resolution; i++){
                temporaryPoints[i] = new BABYLON.Vector3(this._radius*Math.cos(i*2*Math.PI/this._resolution),0,this._radius*Math.sin(i*2*Math.PI/this._resolution));
            }
            this._parametricShape = BABYLON.MeshBuilder.CreateLines(this.name, {points: temporaryPoints, updatable: true}, scene);
            temporaryPoints = [];
            break;
    }
    this._parametricShape.color = param.color || new BABYLON.Color3(1,0,0);
    this.hide();
}

CreateGuide.prototype = {
    show: function(){
        this._parametricShape.isVisible = true;
        this._containerShape.isVisible = true;
        this._snaps.forEach(function(snap){
            snap.isVisible = true;
        })
    },
    hide: function() {
        this._parametricShape.isVisible = false;
        this._containerShape.isVisible = false;
        this._snaps.forEach(function(snap){
            snap.isVisible = false;
        })
    },
};
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
