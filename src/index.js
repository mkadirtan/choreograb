import * as Choreograb from 'choreograb';
let musicUrl = "./lost_compressed.mp3";
let modelUrl = "./simpleMan.babylon";

let animationSettings = {
    animatePosition: false,
    animateRotation: false,
    keyframeSensitivity: 0.2,
    audioSyncSensitivity: 0.05,
};
//Load music asynchronously!
let musicController = new Howl({
    src: [musicUrl],
    autoplay: true,
    loop: false,
});

let scene = Choreograb.Scene.initScene();
let guiElements = Choreograb.GUI.initGUI(scene);
let mainTimeline = Choreograb.Timeline.initTimeline();
guiElements.setTimeline(mainTimeline.timeline);
mainTimeline.setVars({
    music: musicController,
    slider: guiElements.slider,
    audioSyncSensitivity: animationSettings.audioSyncSensitivity
});
let meshElements = Choreograb.Mesh.initMeshes(scene);
let defaultCharacter = Choreograb.Mesh.CreateAnimatableMesh(characterLoadFunction(modelUrl), true);