/**
 * ASSETS
 */
import guideButtonModel from './media/model/guideButton.babylon';
import guideButtonManifest from './media/model/guideButton.babylon.manifest';
/**
 * ASSETS
 */
/**
 * BABYLON IMPORTS
 */

/**
 * BABYLON IMPORTS
 */
/**
 * LOCAL IMPORTS
 */
import {scene} from './scene';
import {Guides, Guide} from './guides';
import {Motifs} from './motifs';
/**
 * LOCAL IMPORTS
 */
let bounding = scene.getMeshByName("ground").getBoundingInfo();

/*BABYLON.SceneLoader.ImportMeshAsync("",'./guideButton.babylon', "", scene).then(function(result){
    let ground = scene.getMeshByName("ground");
    let guideButton = result.meshes[0];
    guideButton.name = "guideButton";
    let buttonNames = ["circleButton", "linearButton", "closureButton"];
    let circleAction = function(){
        let guide = new Guide({
            type: "circle",
            motif: Motifs.current,
            playerCount: 12,
            radius: 3,
            position: new BABYLON.Vector3(5,0,0)
        });
    };
    let linearAction = function(){
        let guide = new Guide({
            type: "linear",
            motif: Motifs.current,
            playerCount: 8,
            points: [
                new BABYLON.Vector3(3,0,-2),
                new BABYLON.Vector3(2,0,1),
                new BABYLON.Vector3(-5,0,3),
                new BABYLON.Vector3(-3,0,7),
            ]
        });
    };
    let closureAction = function(){
        let guide = new Guide({
            type: "closure",
            motif: Motifs.current,
            playerCount: 6,
            points: [
                new BABYLON.Vector3(-6,0,-2),
                new BABYLON.Vector3(-6,0,2),
                new BABYLON.Vector3(6,0,2),
                new BABYLON.Vector3(6,0,-2),
            ]
        });
    };
    let buttonActions = [circleAction, linearAction, closureAction];
    let buttons = [];
    buttonNames.forEach((e,i)=>{
        console.log(i);
        let button = guideButton.clone(e, null);
        button.position.y += 1+i*1.75;
        button.position.z -= 1.2+i*0.4;
        button.rotation.x += Math.PI/3;
        button.actionManager = new BABYLON.ActionManager(scene);
        button.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnLeftPickTrigger,buttonActions[i]));
        button.isVisible = false;
        buttons.push(button);
    });

    let parentObject = new BABYLON.TransformNode("guidesAnchor");
    parentObject.position = guideButton.position;
    guideButton.setParent(parentObject);
    buttons.forEach(e=>{e.setParent(parentObject)});
    let buttonBounding = guideButton.getBoundingInfo();
    let scaling = 0.85;
    let padding = 0.6;
    parentObject.scaling = new BABYLON.Vector3(scaling,scaling,scaling);
    parentObject.position = new BABYLON.Vector3(
        bounding.maximum.x + scaling*buttonBounding.maximum.x + padding*scaling,
        0,
        bounding.maximum.z - scaling*buttonBounding.maximum.z - 4.5*scaling);


    guideButton.actionManager = new BABYLON.ActionManager(scene);
    guideButton.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger,
            function(){
            buttons.forEach(function(e){
                e.isVisible = !e.isVisible;
            })}
        )
    );
});*/