import * as BABYLON from 'babylonjs';
//import * as GUI from 'babylonjs-gui';
import {TimelineMax, TweenMax} from 'gsap';
import {initializeScene} from './scene';
import {players, CreatePlayer, generatePlayers} from './players';
import {Motifs, CreateMotif} from './motifs';
import {CreateGuide} from './guides';
import {initializeTimeline} from './timeline';
//import {advancedTexture, leftPanel, rightPanel, bottomPanel, CreateButton} from './GUI';

/**
 * Initialization step for;
 * scene, timeline, players, music, motif, guide, GUI objects.
 */

/**
 * Scene initialization steps:
 *  Get canvas element.
 *  Create and bind an engine to canvas element.
 *  Create and bind a scene to engine.
 *  !Scene background color and lights may need to be adjusted!
 *  Add a ground object.
 *  Add pickingPlane and parentMesh for mesh operations.
 *  Add environmental objects.
 */

//todo remove the need for picking plane!

let scene = initializeScene();
let Player = BABYLON.MeshBuilder.CreateCylinder("Player",{
    diameterTop: 0.2,
        diameterBottom: 0.2,
    height: 0.2
}, scene);
Player.position = new BABYLON.Vector3(100,0,0);

/**
 * Timeline initialization steps:
 *  Create main timeline object: timeControl.timeline
 */

let timeControl = initializeTimeline();

/**
 * Players initialization steps:
 *  Create required amounts of players and add them to scene.
 *  Place them side by side on the scene, near the ground.
 *  Add timeline data to players and assign their timeline to timeControl.timeline.
 */

let playerCount = 12;
generatePlayers(playerCount, new TimelineMax(), timeControl, Player);

/**
 * Motif initialization steps:
 *  Create motifs control object.
 *  Load selected motif data and create motif objects.
 */

let testMotif = new CreateMotif("testMotif", scene);

/**
 * Guide initialization steps:
 *  Load selected guide data.
 *  Create guide objects and bind them to motif.
 */

let material = new BABYLON.StandardMaterial("guideMaterial", scene);
material.diffuseColor = new BABYLON.Color3(1,0,0);
material.specularColor = new BABYLON.Color3(0,0,0);

let testPoints = [
    new BABYLON.Vector3(1,0,1),
    new BABYLON.Vector3(1,0,-1),
    new BABYLON.Vector3(-1,0,-1),
    new BABYLON.Vector3(-1,0,1)
];

let points2 = [
    new BABYLON.Vector3(2,0,2),
    new BABYLON.Vector3(2,0,9)
];

let testGuide3 = new CreateGuide({
    name: "testGuide3",
    type: "linear",
    motif: testMotif,
    material: material,
    points: points2,
    scene: scene,
    playerCount: 5,
    snapShapeFunction: BABYLON.MeshBuilder.CreateCylinder
});

let testGuide2 = new CreateGuide({
    name: "testGuide2",
    type: "closure",
    motif: testMotif,
    points: testPoints,
    material: material,
    scene: scene,
    playerCount: 4,
    snapShapeFunction: BABYLON.MeshBuilder.CreateCylinder
});

let testGuide4 = new CreateGuide({
    name: "testGuide4",
    type: "circle",
    radius: 1,
    scene: scene,
    material: material,
    playerCount: 7,
    motif: testMotif,
    snapShapeFunction: BABYLON.MeshBuilder.CreateCylinder,
    position: new BABYLON.Vector3(0.5,0,0)
});

let testGuide = new CreateGuide({
    name: "testGuide",
    type: "circle",
    radius: 1,
    scene: scene,
    material: material,
    playerCount: 7,
    motif: testMotif,
    snapShapeFunction: BABYLON.MeshBuilder.CreateCylinder,
    position: new BABYLON.Vector3(3.5,0,0)
});

testGuide.updateSnaps();
testGuide.init();
testGuide2.init();
testGuide3.init();
testGuide4.init();

testGuide.show();
testGuide2.hide();
testGuide3.show();
testGuide4.show();

console.log(testGuide);
console.log(testGuide2);
console.log(testGuide3);
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