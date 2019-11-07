import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import {
    Color3,
    Vector3,
    DirectionalLight,
    MeshBuilder,
    ArcRotateCamera,
    Animation,
    Tools}
                        from '@babylonjs/core/index';
import {GridMaterial} from "@babylonjs/materials/index";

//General BabylonJS Settings
Animation.AllowMatricesInterpolation = true;
Tools.LogLevels = Tools.NoneLogLevel;

//Scene initialization
const canvas = document.getElementById("renderCanvas");
let engine = new Engine(canvas, true, {stencil: true}); //Stencil: Edge renderer
let scene = new Scene(engine);

//Lights
const directionalLight = new DirectionalLight("directionalLight", new Vector3(2,-3,8), scene);
directionalLight.diffuse = Color3.White();
directionalLight.specular = new Color3.White();
directionalLight.intensity = 1.2;

const directionalLight2 = new DirectionalLight("directionalLight2", new Vector3(-2,-3,-8), scene);
directionalLight.diffuse = Color3.White();
directionalLight.specular = new Color3.White();
directionalLight2.intensity = 0.85;

//Ground
const groundMaterial = new GridMaterial("groundMaterial", scene);
groundMaterial.mainColor = Color3.White();
groundMaterial.lineColor = Color3.Black();
groundMaterial.gridRatio = 0.5;
groundMaterial.majorUnitFrequency = 2;

const ground = MeshBuilder.CreateBox("ground", {depth: 8, width: 12, height: 0.02}, scene);
ground.material = groundMaterial;
ground.position.y -= 0.01;

//Engine settings
engine.runRenderLoop(function(){
    scene.render();
});

window.addEventListener("resize", function(){
    engine.resize();
});

const pers = new ArcRotateCamera("pers", Math.PI/2, Math.PI/3, 16, new Vector3(0,0,0), scene);
pers.speed = 0.4;
pers.angularSensibilityX = 2000;
pers.angularSensibilityY = 2000;
pers.attachControl(canvas, true);

scene.setActiveCameraByName("pers");

export { scene };