// import her şey

let animationSettings = {
    animatePosition: false,
    animateRotation: false,
    keyframeSensitivity: 0.2,
    audoioSyncSensitivity: 0.05,
};
//Load music asynchronously!
let musicController = new Howl({
    src: [musicUrl],
    autoplay: true,
    loop: false,
});

let scene = Choreograb.Scene.initScene();
let guiElements = Choreograb.GUI.initGUI(scene);
mainTimeline = Choreograb.Timeline.initTimeline();
guiElements.setTimeline(mainTimeline.timeline);
mainTimeline.setVars({
    music: musicController,
    slider: guiElements.slider
});
let meshElements = Choreograb.Mesh.initMeshes(scene);
let defaultCharacter = Choreograb.Mesh.CreateAnimatableMesh(characterLoadFunction(modelUrl), true);