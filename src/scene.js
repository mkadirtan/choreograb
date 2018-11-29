import * as BABYLON from "babylonjs";
import surroundingModel from './media/model/surrounding.babylon';
import surroundingManifest from './media/model/surrounding.babylon.manifest';


let initializeScene = function(){
    let canvas = document.getElementById("renderCanvas");
    let engine = new BABYLON.Engine(canvas,  true, {stencil: true}); //Stencil: Edge renderer
    let scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.75,0.75,0.75, 1); //Background color

    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

    let camera3 = new BABYLON.ArcRotateCamera("pers", Math.PI/2, Math.PI/3, 16, new BABYLON.Vector3(0,0,0), scene);
    camera3.speed = 0.4;

    let camera = new BABYLON.UniversalCamera("fps", new BABYLON.Vector3(0,1.85,15), scene);
    camera.setTarget(new BABYLON.Vector3(0,1.70,0));
    camera.attachControl(canvas, true);
    camera.ellipsoid = new BABYLON.Vector3(0.85,1.85/2,0.85);
    camera.applyGravity = true;
    scene.collisionsEnabled = true;
    camera.checkCollisions = true;
    camera.fov = 0.85;
    camera.speed = 0.18;
    scene.setActiveCameraByName("fps");

    let camera2 = new BABYLON.ArcRotateCamera("ortho", Math.PI/2, 0, 15, new BABYLON.Vector3(0,0,0), scene);
    camera2.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    let orthoScale = 12;
    let ratio = window.innerWidth/window.innerHeight;
    camera2.orthoTop = orthoScale;
    camera2.orthoBottom = -orthoScale;
    camera2.orthoLeft = -orthoScale*ratio;
    camera2.orthoRight = orthoScale*ratio;

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

export let scene = initializeScene();

