import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import {TimelineMax, TweenMax} from 'gsap';
import {timeControl} from './timeline';
import {scene} from './scene';
import {players} from './players';
import {Motifs, Motif} from './motifs';
import {guides, Guide} from './guides';
import './GUI2';
import './GUI3';
import axios from 'axios';
import {Map, List} from 'immutable';
/**
 * Initialization step for;
 * scene, timeline, players, music, motif, guide, GUI objects.
 */

/**
 * Scene initialization steps:
 *  Get canvas element.
 *  Create and bind an engine to canvas element.
 *  Create and bind a scene to engine.
 *  Add a ground object.
 *  Add pickingPlane and parentMesh for mesh operations.
 *  Add environmental objects.
 */

//let scene = initializeScene();


/**
 * Timeline initialization steps:
 *  Create main timeline object: timeControl.timeline
 *  test
 */

//let timeControl = initializeTimeline();

/**
 * Players initialization steps:
 *  Create required amounts of players and add them to scene.
 *  Place them side by side on the scene, near the ground.
 *  Add timeline data to players and assign their timeline to timeControl.timeline.
 */

/**
 * Motif initialization steps:
 *  Create motifs control object.
 *  Load selected motif data and create motif objects.
 */

let motif1 = new Motif({name: "motif1", start: 0, end: 2});
let motif2 = new Motif({name: "motif2", start: 8, end: 10});
let motif3 = new Motif({name: "motif3", start: 16, end: 17});
let motif4 = new Motif({name: "motif4", start: 20, end: 25});
let motif5 = new Motif({name: "motif5", start: 32, end: 40});


/*export let getSceneDataToConsole = function(){
    axios.post('/sceneInfo', {
    }).then(response=>{
        console.log(response);
    })
};

let mymap = Map(
    {
        test: "mkt"
    }
);

axios.post('/updateSceneInformation', mymap.toJS()).then(response=>{
    console.log(response.data);
}).catch(error=>{
    console.log(error);
});

axios.post('/retrieveSceneInformation', {
    dbName: "SceneInformation",
    collection: "Generic",
    find: {}
}).then(response=>{
    console.log(response.data);
}).catch(error=>{
    console.log(error);
    throw error;
});*/

/**
 * Guide initialization steps:
 *  Load selected guide data.
 *  Create guide objects and bind them to motif.
 */

/**
 * GUI initialization steps:
 *  Create main GUI object called "UI".
 *  Create leftPanel, rightPanel and bottomPanel.
 *  Create main slider.
 *  Create buttons and bind them to panels.
 */

/**
 * Music initialization steps:
 *  Create music object.
 *  Add synchronization between timeline, slider and music.
 */

/**
 * Button creation process.
 * leftPanel buttons are;
 * rightPanel buttons are;
 * bottomPanel buttons are;
 */

/**
 * Event handlers initalization steps:
 *
 *
 */

/*let togglePlayButton = CreateButton({
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
*/