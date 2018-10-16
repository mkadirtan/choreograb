import * as BABYLON from 'babylonjs';

let initScene = function(){
    let canvas = document.getElementById("renderCanvas");
    let engine = new BABYLON.Engine(canvas,  true, {stencil: true}); //Stencil: Edge renderer
    let scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0,0.8,0.6); //Background color

    let camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(2,4,-3), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(2,-3,8), scene);
    let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(-2, 3, 8), scene);
    light1.intensity = 3;
    light2.intensity = 3;

    engine.runRenderLoop(function(){
        scene.render();
    });
    return scene;
  };

export let Scene = {
    initScene
};