import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import {
    Color3,
    Color4,
    Vector3,
    DirectionalLight,
    ShadowGenerator,
    MeshBuilder,
    StandardMaterial,
    UniversalCamera,
    ArcRotateCamera,
    Camera,
    Animation,
    Tools}
                        from '@babylonjs/core';
import {GridMaterial} from "@babylonjs/materials";

import surroundingModel from './media/model/surrounding.babylon';
import surroundingManifest from './media/model/surrounding.babylon.manifest';

Animation.AllowMatricesInterpolation = true;
Tools.LogLevels = Tools.NoneLogLevel;
let initializeScene = function(){
    let canvas = document.getElementById("renderCanvas");
    let engine = new Engine(canvas,  true, {stencil: true}); //Stencil: Edge renderer
    let scene = new Scene(engine);
    scene.clearColor = new Color4(0.75,0.75,0.75, 1); //Background color
    setTimeout(()=>console.log(a), 10000);
    scene.gravity = new Vector3(0, -9.81, 0);

    let directionalLight = new DirectionalLight("directionalLight", new Vector3(2,-3,8), scene);
    directionalLight.diffuse = new Color3(1,1,1);
    directionalLight.specular = new Color3(1,1,1);
    directionalLight.intensity = 1.2;

    let directionalLight2 = new DirectionalLight("directionalLight2", new Vector3(-2,-3,-8), scene);
    directionalLight2.diffuse = new Color3(1,1,1);
    directionalLight2.specular = new Color3(1,1,1);
    directionalLight2.intensity = 0.85;

    let shadowGenerator = new ShadowGenerator(1024, directionalLight);

    let groundMaterial = new GridMaterial("groundMaterial", scene);
    groundMaterial.mainColor = Color3.White();
    groundMaterial.lineColor = Color3.Black();
    groundMaterial.gridRatio = 0.5;
    groundMaterial.majorUnitFrequency = 2;
    /*groundMaterial.diffuseColor = new Color3(0.15, 0.2, 0.35);
    groundMaterial.specularColor = new Color3(0.05, 0.05, 0.05);*/
    let ground = MeshBuilder.CreateBox("ground", {depth: 8, width: 12, height: 0.02}, scene);
    ground.material = groundMaterial;
    ground.receiveShadows = true;
    ground.isVisible = true;
    ground.position.y -= 0.01;

    /*SceneLoader.ImportMeshAsync("",'./surrounding.babylon', "", scene).then(function(result){
        let surrounding = result.meshes[0];
        surrounding.position.z = ground.getBoundingInfo().minimum.z;
        surrounding.position.y -= 0.01;
        surrounding.checkCollisions = true;
    });*/

    let Trash = MeshBuilder.CreateBox("Trash", {depth: 2, width: 2, height: 0.2}, scene);
    Trash.position.x = ground.getBoundingInfo().minimum.x -1;
    Trash.position.y = 0.1;
    Trash.position.z = ground.getBoundingInfo().maximum.z -1;
    let trashMaterial = new StandardMaterial("trashMaterial", scene);
    trashMaterial.diffuseColor = Color3.Red();
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

let fps = new UniversalCamera("fps", new Vector3(0,1.85,15), scene);
    fps.setTarget(new Vector3(0,1.70,0));
    fps.ellipsoid = new Vector3(0.85,1.85/2,0.85);
    fps.applyGravity = true;
    scene.collisionsEnabled = true;
    fps.checkCollisions = true;
    fps.fov = 0.85;
    fps.speed = 0.18;
    fps.angularSensibility = 4000;

let ortho = new ArcRotateCamera("ortho", Math.PI/2, 0, 15, new Vector3(0,0,0), scene);
    ortho.mode = Camera.ORTHOGRAPHIC_CAMERA;
    let orthoScale = 12;
    let ratio = window.innerWidth/window.innerHeight;
    ortho.orthoTop = orthoScale;
    ortho.orthoBottom = -orthoScale;
    ortho.orthoLeft = -orthoScale*ratio;
    ortho.orthoRight = orthoScale*ratio;
    ortho.angularSensibilityX = 2000;
    ortho.angularSensibilityY = 2000;

let pers = new ArcRotateCamera("pers", Math.PI/2, Math.PI/3, 16, new Vector3(0,0,0), scene);
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

