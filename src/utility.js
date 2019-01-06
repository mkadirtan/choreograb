import * as BABYLON from 'babylonjs';
import {scene} from './scene';
import {players, selectedPlayer} from "./players";
import {buttonModels} from './media/model/buttons.babylon';
import {guideButtonModels} from './media/model/guideButtons.babylon';

//Settings observable
export let settingsObservable = new BABYLON.Observable();

//Utility layer
let utilLayer = new BABYLON.UtilityLayerRenderer(scene);
let utilityLight = new BABYLON.DirectionalLight("utilityLight", new BABYLON.Vector3(-0.5, -0.5, -0.5), utilLayer.utilityLayerScene);

//Gizmo creation
export let gizmo = new BABYLON.PlaneRotationGizmo(new BABYLON.Vector3(0,1,0), BABYLON.Color3.Green(), utilLayer);
{
    gizmo.snapDistance = Math.PI / 4;
    gizmo.scaleRatio = 1;
    gizmo.updateGizmoRotationToMatchAttachedMesh = false;
    let gizmoPoints = [];
    for (let i = 0; i <= 48; i++) {
        gizmoPoints[i] = new BABYLON.Vector3(0.6 * Math.cos(i * 2 * Math.PI / 48), 0, 0.6 * Math.sin(i * 2 * Math.PI / 48));
    }
    let gizmoCircle = new BABYLON.Path3D(gizmoPoints, new BABYLON.Vector3(0, 1, 0));
    let binormals = gizmoCircle.getBinormals();
    let points1 = [];
    let points2 = [];
    let size = 0.15;
    gizmoCircle.getCurve().forEach(function (e, i) {
        points1.push(e.clone().addInPlace(binormals[i].scale(size)));
        points2.push(e.clone().addInPlace(binormals[i].scale(-size)));
    });
    let customGizmo = BABYLON.MeshBuilder.CreatePolygon("container", {
        shape: points2, holes: [points1]
    }, gizmo.gizmoLayer.utilityLayerScene);
    customGizmo.position.y = 0.9;
    customGizmo.visibility = 0;
    let circularGizmo = BABYLON.MeshBuilder.CreateLines("gizmoCircle", {
        points: gizmoPoints,
        updatable: false
    }, gizmo.gizmoLayer.utilityLayerScene);
    circularGizmo.color = BABYLON.Color3.Green();
    circularGizmo.parent = customGizmo;
    gizmo.setCustomMesh(customGizmo);
    gizmo.onSnapObservable.add((evt) => {
        let angle = gizmo.attachedMesh.rotationQuaternion.toEulerAngles().clone();
        angle.y = Math.round(angle.y/gizmo.snapDistance)*gizmo.snapDistance; //To avoid accumulation of floating numbers
        gizmo.attachedMesh.parent.rotation = angle;
        gizmo.attachedMesh.ownerPlayer.key();
    });
    gizmo._updateScale = false;
}

//Player options
let settings = new BABYLON.TransformNode("settings", utilLayer.utilityLayerScene);
let playerButtons = [];
let guideButtons = [];

BABYLON.SceneLoader.ImportMesh("",'./buttons.babylon', "", utilLayer.utilityLayerScene, function(meshes){
    meshes.forEach(e=>{
        e.convertToFlatShadedMesh();
        e.position.y = 0;
        e.isVisible = false;
        e.isPickable = false;
        e.parent = settings;
        e.material.specularColor = BABYLON.Color3.Black();
    });
    playerButtons = [...meshes];
});
BABYLON.SceneLoader.ImportMesh("",'./guideButtons.babylon', "", utilLayer.utilityLayerScene, function(meshes){
    meshes.forEach(e=>{
        e.convertToFlatShadedMesh();
        e.position.y = 0;
        e.isVisible = false;
        e.isPickable = false;
        e.parent = settings;
        e.material.specularColor = BABYLON.Color3.Black();
    });
    guideButtons = [...meshes];
});
settings.position.y = 2.2;

settingsObservable.add(info=>{
    if(info.type === "player"){
        settings.parent = info.attachedMesh;
        settings.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        gizmo.attachedMesh?gizmo.attachedMesh=selectedPlayer.dummyRotator:gizmo.attachedMesh=null;
        playerButtons.forEach(e=>{
            e.isVisible = true;
            e.isPickable = true;
        });
        guideButtons.forEach(e=>{
            e.isVisible = false;
            e.isPickable = false;
        })
    }
    else if(info.type === "guide"){
        settings.parent = info.attachedMesh;
        settings.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        gizmo.attachedMesh=null;
        guideButtons.forEach(e=>{
            e.isVisible = true;
            e.isPickable = true;
        });
        playerButtons.forEach(e=>{
            e.isVisible = false;
            e.isPickable = false;
        });
    }
});

utilLayer.utilityLayerScene.onPointerObservable.add((evt,state)=>{
    if(evt.type === 2 && evt.pickInfo.pickedMesh === playerButtons[1]){
        gizmo.attachedMesh?gizmo.attachedMesh=null:gizmo.attachedMesh=selectedPlayer.dummyRotator;
    }
});