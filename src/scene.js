import * as BABYLON from "babylonjs";
import surroundingModel from './media/model/surrounding.babylon';
import surroundingManifest from './media/model/surrounding.babylon.manifest';


let initializeScene = function(){
    let canvas = document.getElementById("renderCanvas");
    let engine = new BABYLON.Engine(canvas,  true, {stencil: true}); //Stencil: Edge renderer
    let scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.75,0.75,0.75, 1); //Background color

    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

    let directionalLight = new BABYLON.DirectionalLight("directionalLight", new BABYLON.Vector3(2,-3,8), scene);
    directionalLight.diffuse = new BABYLON.Color3(1,1,1);
    directionalLight.specular = new BABYLON.Color3(1,1,1);
    directionalLight.intensity = 1.2;

    let directionalLight2 = new BABYLON.DirectionalLight("directionalLight2", new BABYLON.Vector3(-2,-3,-8), scene);
    directionalLight2.diffuse = new BABYLON.Color3(1,1,1);
    directionalLight2.specular = new BABYLON.Color3(1,1,1);
    directionalLight2.intensity = 0.85;

    let shadowGenerator = new BABYLON.ShadowGenerator(1024, directionalLight);

    let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.15, 0.2, 0.35);
    groundMaterial.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    let ground = BABYLON.MeshBuilder.CreateBox("ground", {depth: 8, width: 12, height: 0.02}, scene);
    ground.material = groundMaterial;
    ground.receiveShadows = true;
    ground.isVisible = true;
    ground.position.y -= 0.01;

    BABYLON.SceneLoader.ImportMeshAsync("",'./surrounding.babylon', "", scene).then(function(result){
        let surrounding = result.meshes[0];
        surrounding.position.z = ground.getBoundingInfo().minimum.z;
        surrounding.position.y -= 0.01;
        surrounding.checkCollisions = true;
    });

    let Trash = BABYLON.MeshBuilder.CreateBox("Trash", {depth: 2, width: 2, height: 0.2}, scene);
    Trash.position.x = ground.getBoundingInfo().minimum.x -1;
    Trash.position.y = 0.1;
    Trash.position.z = ground.getBoundingInfo().maximum.z -1;
    let trashMaterial = new BABYLON.StandardMaterial("trashMaterial", scene);
    trashMaterial.diffuseColor = BABYLON.Color3.Red();
    Trash.material = trashMaterial;

    engine.runRenderLoop(function(){
        scene.render();
    });

    window.addEventListener("resize", function(){
        engine.resize();
    });
    return scene;
};

let scene = initializeScene();
let canvas = scene.getEngine().getRenderingCanvas();

let fps = new BABYLON.UniversalCamera("fps", new BABYLON.Vector3(0,1.85,15), scene);
    fps.setTarget(new BABYLON.Vector3(0,1.70,0));
    fps.ellipsoid = new BABYLON.Vector3(0.85,1.85/2,0.85);
    fps.applyGravity = true;
    scene.collisionsEnabled = true;
    fps.checkCollisions = true;
    fps.fov = 0.85;
    fps.speed = 0.18;
    fps.angularSensibility = 4000;

let ortho = new BABYLON.ArcRotateCamera("ortho", Math.PI/2, 0, 15, new BABYLON.Vector3(0,0,0), scene);
    ortho.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    let orthoScale = 12;
    let ratio = window.innerWidth/window.innerHeight;
    ortho.orthoTop = orthoScale;
    ortho.orthoBottom = -orthoScale;
    ortho.orthoLeft = -orthoScale*ratio;
    ortho.orthoRight = orthoScale*ratio;
    ortho.angularSensibilityX = 2000;
    ortho.angularSensibilityY = 2000;

let pers = new BABYLON.ArcRotateCamera("pers", Math.PI/2, Math.PI/3, 16, new BABYLON.Vector3(0,0,0), scene);
    pers.speed = 0.4;
    pers.angularSensibilityX = 2000;
    pers.angularSensibilityY = 2000;
    pers.attachControl(canvas, true);
    scene.setActiveCameraByName("pers");

let switchCamera = function(){
    if(scene.activeCamera === pers) {
        pers.detachControl(canvas);
        scene.setActiveCameraByName("ortho");
        ortho.attachControl(canvas,true);
    }
    else if(scene.activeCamera === ortho){
        ortho.detachControl(canvas);
        scene.setActiveCameraByName("fps");
        fps.attachControl(canvas, true);
    }
    else{
        fps.detachControl(canvas);
        scene.setActiveCameraByName("pers");
        pers.attachControl(canvas,true);
    }
};

export {scene, switchCamera};

