import * as BABYLON from 'babylonjs';
import {Engine, Scene, FreeCamera, HemisphericLight, PointLight, Vector3, Color3, MeshBuilder, Mesh, SceneLoader, AnimationGroup, PointerEventTypes } from 'babylonjs';
import * as path from 'path';
import * as GUI from 'babylonjs-gui';
import 'babylonjs-loaders';
import {Howl, Howler} from 'howler';
import {TweenLite, TimelineMax} from 'gsap/TweenMax';
import lostUrl from './media/audio/lost_compressed.mp3';
import modelUrl from './media/model/simpleMan.babylon';

let scene, tl, axisLocked = true, parentMesh, currentMode = "select";
let character, characterSkeleton;
//let eggman, eggmanSkeleton;
let slider, lastSelectedMesh, selectedMeshes = [];
let easing = Linear.easeNone;
let timelineSensitivity = 0.2; //seconds
let audioSyncSensitivity = 0.05;
let lost = new Howl({
    src: [lostUrl],
    autoplay: true,
    loop: false,
});

let createScene = function(){
    // BASIC SCENE ELEMENTS
    let canvas = document.getElementById("renderCanvas");

    //Allow edge rendering: stencil
    let engine = new BABYLON.Engine(canvas,  true, {stencil: true});

    scene = new BABYLON.Scene(engine);
    //Set background color
    scene.clearColor = new BABYLON.Color3(0,0.8,0.6);

    let camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(2,4,-3), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(2,-3,8), scene);
    let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(-2, 3, 8), scene);
    light1.intensity = 3;
    light2.intensity = 3;

    //Ground is not movable
    let ground = new BABYLON.MeshBuilder.CreateGround("ground", {width: 20, height: 20}, scene);
    ground.isPickable = false;

    parentMesh = new BABYLON.MeshBuilder.CreateBox("parentMesh", {size: 1}, scene);
    parentMesh.isPickable = false;
    parentMesh.visible = false;


    //Limit mesh movements within the ground.

    let restrictX_min = ground.getBoundingInfo().minimum.x;
    let restrictX_max = ground.getBoundingInfo().maximum.x;

    let restrictZ_min = ground.getBoundingInfo().minimum.z;
    let restrictZ_max = ground.getBoundingInfo().maximum.z;

    //Imaginary picking plane;
    //All movement, object grabbing events occur "on" the picking plane.
    //An invisible hero, I call.

    let pickingPlane = new BABYLON.MeshBuilder.CreatePlane("pickingPlane", {size: 120}, scene);
    pickingPlane.visibility = 0;
    pickingPlane.isPickable = false;

    //Starting render loop. Add any function that needs to be updated,
    //every call.


    engine.runRenderLoop(function(){
        scene.render();
    });




    //GUI INITIALIZATION
    let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    advancedTexture.name = "myGUI";

    let panel = new GUI.StackPanel();
    panel.width = 1;
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panel.isVertical = true;
    panel.top = 0;
    advancedTexture.addControl(panel);

    let header = new GUI.TextBlock();
    header.height = "30px";
    header.text = 0 + " saniyedesiniz!";
    header.color = "white";
    panel.addControl(header);

    slider = new GUI.Slider();
    slider.minimum = 0;
    slider.maximum = 40;
    slider.value = 0;
    slider.height = "50px";
    slider.width = 1;
    slider.onPointerDownObservable.add(function () {
        slider.onValueChangedObservable.add(function(){
            header.text = slider.value.toFixed(2) + " saniyedesiniz";
            if(slider.value <= tl.totalDuration()){
                tl.seek(slider.value, false);
            }
        });
    });
    slider.onPointerUpObservable.add(function(){
        slider.onValueChangedObservable.clear();
    });

    panel.addControl(slider);

    //TL INITIALIZATION
    tl = new TimelineMax();
    //CALLBACK EVENTS
    tl.eventCallback("onUpdate", function(){
        if(!tl.paused()){
            slider.value = tl.time()};
        header.text = slider.value.toFixed(2) + " saniyedesiniz";
        if(lost.playing() && Math.abs(lost.seek()-tl.time())>audioSyncSensitivity){
            lost.seek(tl.time());
            console.log("Audio playback synchronized back!");
        };
    });
    tl.eventCallback("onComplete", function(){
        tl.pause(); lost.pause()});

    tl.data = {"objects": []};
    console.log("TL initialized");

    //LOAD MODEL
    BABYLON.SceneLoader.ImportMeshAsync("", path.dirname(modelUrl), path.basename(modelUrl), scene).then(function(result){
        character = result.meshes[0];
        characterSkeleton = result.skeletons[0];
        character.name = "character";
        character.position = {x: 0, y: -character.getBoundingInfo().minimum.y, z: 0}
        //character.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
        let dataObj = addObjectTL(character.name, characterSkeleton.getAnimationRanges());
        for (let bone of characterSkeleton.bones) {
            let skelanims = bone.animations;
            for (let anims of skelanims){
                dataObj.animations["walkLikeMan"].animGroup.addTargetedAnimation(anims, bone);
            }
        };
        console.log("Model is initialized");
    });

    //GUI
    let controlPanel = new GUI.StackPanel();
    controlPanel.height = 1;
    controlPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    controlPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    controlPanel.top = 250;
    advancedTexture.addControl(controlPanel);

    let snapToGround = new GUI.Button.CreateSimpleButton("snapToGround", "Yere Hizala");
    snapToGround.width = "120px";
    snapToGround.height = "50px";
    snapToGround.color = "white";
    snapToGround.background = "green";
    snapToGround.onPointerUpObservable.add(
        function () {
            lastSelectedMesh.position.y = -lastSelectedMesh.getBoundingInfo().minimum.y;

        }
    );
    controlPanel.addControl(snapToGround);

    let lockAxis = new GUI.Button.CreateSimpleButton("lockAxis", "Lock Y Axis");
    lockAxis.width = "120px";
    lockAxis.height = "50px";
    lockAxis.color = "white";
    lockAxis.background = "green";
    lockAxis.onPointerUpObservable.add(
        function () {
            axisLocked?axisLocked=false:axisLocked=true;
        }
    );
    controlPanel.addControl(lockAxis);

    let input = new GUI.InputText();
    input.width = 0.2;
    input.maxWidth = 0.2;
    input.height = "40px";
    input.text = "1";
    input.color = "white";
    input.background = "green";
    input.onBeforeKeyAddObservable.add(
        function(){
            let key = input.currentKey;
            if (key < "0" || key > "9" || input.text.length > 1) {
                intput.addKey = false;
            }
        }
    );
    controlPanel.addControl(input);

    let buttons = new GUI.StackPanel();
    buttons.height = 1;
    buttons.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    buttons.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    buttons.top = 250;
    advancedTexture.addControl(buttons);

    let switchMode = new GUI.Button.CreateSimpleButton("switchMode", "Secim Modu");
    switchMode.width = "120px";
    switchMode.height = "50px";
    switchMode.color = "white";
    switchMode.background = "green";
    switchMode.onPointerUpObservable.add(function(){
        if(currentMode === "select"){
            currentMode = "move";
            this.text = "Hareket Modu";
        }
        else{
            currentMode = "select";
            this.text = "Secim Modu"
        }
    });
    buttons.addControl(switchMode);

    let addLoc = new GUI.Button.CreateSimpleButton("addLoc", "Location");
    addLoc.width = "120px";
    addLoc.height = "50px";
    addLoc.color = "white";
    addLoc.background = "green";
    addLoc.onPointerUpObservable.add(
        function () {

            let pos = {"x": lastSelectedMesh.position.x, "y": lastSelectedMesh.position.y, "z": lastSelectedMesh.position.z, "ease": easing};

            if(tl.data.objects[lastSelectedMesh.name]===undefined){
                addObjectTL(lastSelectedMesh.name);
            }

            let isDuplicate = false;
            let getIndex = 0;
            let aniObject = tl.data.objects[lastSelectedMesh.name];

            //LOCATIONS
            //pos objects property, loc recorded property
            let loc = aniObject.loc;

            loc.forEach(function(entry){
                if(Math.abs(entry.T - slider.value) <= timelineSensitivity){
                    isDuplicate = true;
                    getIndex = loc.indexOf(entry);
                }
            });


            if(!isDuplicate){
                loc.push(
                    {"T": slider.value, "position": pos, "stepCount": input.text}
                );
            }
            else{
                loc[getIndex] = {"T": slider.value, "position": pos, "stepCount": input.text};
            }

            updateTL(lastSelectedMesh.name);
        }
    );
    buttons.addControl(addLoc);
//function hide(){
    /*let addRot = new GUI.Button.CreateSimpleButton("addRot", "Rotation");
    addRot.width = "120px";
    addRot.height = "50px";
    addRot.color = "white";
    addRot.background = "green";
    addRot.onPointerUpObservable.add(
        function () {
            let turn = {"x": lastSelectedMesh.rotation.x, "y": lastSelectedMesh.rotation.y, "z": lastSelectedMesh.rotation.z, "ease": easing};

            if(tl.data.objects[lastSelectedMesh.name]===undefined){
                addObjectTL(lastSelectedMesh.name);
            }

            let isDuplicate = false;
            let getIndex = 0;
            let aniObject = tl.data.objects[lastSelectedMesh.name];

            //ROTATIONS
            //turn objects property, rot recorded property
            let rot = aniObject.rot;
            rot.forEach(function(entry){
                if(Math.abs(entry.T - slider.value) <= timelineSensitivity){
                    isDuplicate = true;
                    getIndex = rot.indexOf(entry);
                }});

            if(!isDuplicate){
                rot.push(
                    {"T": slider.value, "rotation": turn}
                );
            }
            else{
                rot[getIndex] = {"T": slider.value, "rotation": turn};
            }

            updateTL(aniObject.name);
        }
    );
    buttons.addControl(addRot);

    let addLocRot = new GUI.Button.CreateSimpleButton("addLocRot", "Location & Rotation");
    addLocRot.width = "300px";
    addLocRot.height = "50px";
    addLocRot.color = "white";
    addLocRot.background = "green";
    addLocRot.onPointerUpObservable.add(
        function () {

            if(tl.data.objects[lastSelectedMesh.name]===undefined){
                addObjectTL(lastSelectedMesh.name);
            }

            let isDuplicateRot = false;
            let isDuplicateLoc = false;
            let getIndexRot = 0;
            let getIndexLoc = 0;
            let aniObject = tl.data.objects[lastSelectedMesh.name];

            //ROTATIONS
            //turn objects property, rot recorded property
            let rot = aniObject.rot;
            rot.forEach(function(entry){
                if(Math.abs(entry.T - slider.value) <= timelineSensitivity){
                    isDuplicateRot = true;
                    getIndexRot = rot.indexOf(entry);
                }});
            let turn = {"x": lastSelectedMesh.rotation.x, "y": lastSelectedMesh.rotation.y, "z": lastSelectedMesh.rotation.z, "ease": easing};
            if(!isDuplicateRot){
                rot.push(
                    {"T": slider.value, "rotation": turn}
                );
            }
            else{
                rot[getIndexRot] = {"T": slider.value, "rotation": turn};
            }

            //LOCATIONS
            //pos objects property, loc recorded property
            let loc = aniObject.loc;
            loc.forEach(function(entry){
                if(Math.abs(entry.T - slider.value) <= timelineSensitivity){
                    isDuplicateLoc = true;
                    getIndexLoc = loc.indexOf(entry);
                }});
            let pos = {"x": lastSelectedMesh.position.x, "y": lastSelectedMesh.position.y, "z": lastSelectedMesh.position.z, "ease": easing};
            if(!isDuplicateLoc){
                loc.push(
                    {"T": slider.value, "position": pos, "stepCount": input.text}
                );
            }
            else{
                loc[getIndexLoc] = {"T": slider.value, "position": pos, "stepCount": input.text};
            }

            updateTL(aniObject.name);
        }
    );
    buttons.addControl(addLocRot);*/
//        }

    let Play = new GUI.Button.CreateSimpleButton("Play", "P");
    Play.width = "30px";
    Play.height = "30px";
    Play.color = "white";
    Play.background = "green";
    Play.onPointerUpObservable.add(function(){
            tl.paused()?(tl.play(), lost.play()):(tl.pause(), lost.pause());
        }
    );
    buttons.addControl(Play);

    let Stop = new GUI.Button.CreateSimpleButton("Stop", "S");
    Stop.width = "30px";
    Stop.height = "30px";
    Stop.color = "white";
    Stop.background = "green";
    Stop.onPointerUpObservable.add(function(){
            tl.pause(); lost.pause();
            tl.seek(0); lost.seek(0);
        }
    );
    buttons.addControl(Stop);



    /*

    CHECK SCOPES OF EVENTS AND WHETHER OR NOT THEY SHOULD
    PROPAGATE, BUBBLE ETC?

    */
    //CANVAS EVENTS
    //POINTER

    //MODE: MOVE

    let startingPick;
    let startingParent;
    let deltaTransform;

    /*let getPivotPosition = function(type){
        pivotPosition = new BABYLON.Vector3.Zero();
        if(type === "center"){
            selectedMeshes.forEach(function(mesh){
                pivotPosition = pivotPosition.add(mesh.position);
            })
            pivotPosition = pivotPosition.scale(1/selectedMeshes.length)
        }
        else if(type === "last"){
            pivotPosition = lastSelectedMesh.position;
        }

        parentMesh.position = pivotPosition;

        selectedMeshes.forEach(function(mesh){
            mesh.setParent(parentMesh);
        });

        return pivotPosition;
    };*/

    let pDownMove = function(){
        let rayCast = scene.pick(scene.pointerX, scene.pointerY);
        if(rayCast.pickedMesh){
            pickingPlane.position = rayCast.pickedPoint;
            parentMesh.position = rayCast.pickedPoint;
            selectedMeshes.forEach(function(mesh){
                mesh.setParent(parentMesh);
            });

            if(axisLocked){
                pickingPlane.rotation = new BABYLON.Vector3(Math.PI/2,0,0);
            }
            else{
                pickingPlane.lookAt(scene.activeCamera.position);
            }
            pickingPlane.isPickable = true;
            scene.activeCamera.detachControl(canvas);
        }
    };

    let pMoveMove = function(){
        let pickPlanePos = scene.pick(scene.pointerX, scene.pointerY, function(mesh){
            return mesh.id === "pickingPlane";
        });
        //CHECK IF THERE IS SOMETHING LIKE, IS THIS POINT IN THIS RECTANGLE?
        if(pickPlanePos.pickedMesh){
            if(pickPlanePos.pickedPoint.x > restrictX_max){
                pickPlanePos.pickedPoint.x = restrictX_max;
            }
            if(pickPlanePos.pickedPoint.x < restrictX_min){
                pickPlanePos.pickedPoint.x = restrictX_min;
            }
            if(pickPlanePos.pickedPoint.z > restrictZ_max){
                pickPlanePos.pickedPoint.z = restrictZ_max;
            }
            if(pickPlanePos.pickedPoint.z < restrictZ_min){
                pickPlanePos.pickedPoint.z = restrictZ_min;
            }
            if(axisLocked){
                parentMesh.position.x = pickPlanePos.pickedPoint.x;
                parentMesh.position.z = pickPlanePos.pickedPoint.z;
            }
            else{
                parentMesh.position = pickPlanePos.pickedPoint;
                pickingPlane.position = pickPlanePos.pickedPoint;
            }
            pickPlanePos = null;
        }
    };

    //RE-ORGANIZE PARENT CHILD RELATIONS ACCORDING TO BIGGEST PARENT AND SMALLEST CHILD

    let pUpMove = function(){
        pickingPlane.isPickable = false;
        selectedMeshes.forEach(function(mesh){
            mesh.setParent(null);
        });
        scene.activeCamera.attachControl(canvas);
    };

    //MODE: SELECT
    let pTapSelect = function(pointerInfo){
        let rayCast = scene.pick(scene.pointerX, scene.pointerY);
        if(rayCast.pickedMesh){
            lastSelectedMesh = rayCast.pickedMesh;
            meshIndex = selectedMeshes.indexOf(lastSelectedMesh);
            if(meshIndex === -1){
                selectedMeshes.push(lastSelectedMesh);
                lastSelectedMesh.renderOutline = true;
            }
            if(pointerInfo.event.shiftKey) {

            }

            else if(pointerInfo.event.altKey && meshIndex !== -1) {
                selectedMeshes.splice(meshIndex,1);
                lastSelectedMesh.renderOutline = false;
                lastSelectedMesh = null;
            }

            else{
                selectedMeshes.forEach(function(mesh){
                    if(mesh!==lastSelectedMesh){
                        mesh.renderOutline = false;
                    }
                });
                selectedMeshes = [lastSelectedMesh];
            }
        }

        else{
            if(!pointerInfo.event.shiftKey && !pointerInfo.event.altKey){
                selectedMeshes.forEach(function(mesh){
                    mesh.renderOutline = false;
                });
                selectedMeshes = [];
                lastSelectedMesh = null;
            }
        }
    };

    //INITIAL MODE: SELECT
    scene.onPointerObservable.add((pointerInfo) => {
        switch (currentMode){
            case "move":
                if(selectedMeshes.length>=1){
                    switch (pointerInfo.type) {
                        case BABYLON.PointerEventTypes.POINTERDOWN:
                            pDownMove();
                            break;

                        case BABYLON.PointerEventTypes.POINTERMOVE:
                            if(pickingPlane.isPickable){pMoveMove();};
                            break;

                        case BABYLON.PointerEventTypes.POINTERUP:
                            pUpMove();
                            break;
                    }
                }
                break;

            case "select":
                switch (pointerInfo.type) {
                    case BABYLON.PointerEventTypes.POINTERTAP:
                        pTapSelect(pointerInfo);
                        break;
                }
                break;
        }
    });
    //CANVAS EVENTS
    //KEYBOARD
    canvas.addEventListener("keydown", function(evt){
        if(evt.key === "L" || evt.key === "l"){
            (axisLocked)?(axisLocked = null):(axisLocked = true);
        }
    }, false);

    //WINDOW EVENTS
    window.addEventListener("resize", function(){
        engine.resize();
    });
    window.addEventListener("onblur", function(){
        if(!tl.paused()){
            tl.pause();
            lost.pause();
            window.onfocus = function(){
                tl.play();
                lost.play();
            }
        }
        else{
            window.onfocus = null;
        }
    });
};

//Basically starts everything :)

createScene();

//Scopes of these functions may need to be updated,
//as well as their adoptation to new meshes.

//Recreates timeline everytime a new key is pushed or replaced.

let updateTL = function(v){

    let aniObject = tl.data.objects[v];

    if(aniObject.rot.length > 1){

        console.log("Object: " + v + " rotation keyframes are updating...");

        tl.kill({x: true, y: true, z: true}, scene.getMeshByName(v).rotation);

        for(let i = 1; i<aniObject.rot.length; i++){

            let deltaT = aniObject.rot[i].T-aniObject.rot[i-1].T;
            tl.fromTo(scene.getMeshByName(v).rotation, deltaT, aniObject.rot[i-1].rotation, aniObject.rot[i].rotation, aniObject.rot[i-1].T);

        }
    }

    if(aniObject.loc.length > 1){

        console.log("Object: " + v + " location keyframes are updating...");

        aniObject.loc.sort(function(a, b){
            return a.T - b.T;
        });

        tl.kill({x: true, y: true, z: true}, scene.getMeshByName(v).position);


        for(let i = 1; i<aniObject.loc.length; i++){

            let deltaT = aniObject.loc[i].T-aniObject.loc[i-1].T;

            tl.fromTo(scene.getMeshByName(v).position, deltaT, aniObject.loc[i-1].position, aniObject.loc[i].position, aniObject.loc[i-1].T);

            let aniObj = aniObject.animations["walkLikeMan"];
            let stepCount = aniObject.loc[i-1].stepCount;
            if(stepCount<1 || stepCount==null){
                stepCount=1
            }

            let walk = new TimelineMax().fromTo(aniObj, aniObj.to-aniObj.from, {current: aniObj.from}, {current: aniObj.to}).repeat(stepCount-1)
                .totalDuration(deltaT);

            walk.data = {"aniObject": aniObject};

            walk.eventCallback("onUpdate",
                function(aniObject){
                    this.data.aniObject.animations["walkLikeMan"].animGroup.play();
                    this.data.aniObject.animations["walkLikeMan"].animGroup
                        .goToFrame(Math.round(this.data.aniObject.animations["walkLikeMan"].current));
                    this.data.aniObject.animations["walkLikeMan"].animGroup.pause();}
                , false)

            tl.add(walk, aniObject.loc[i-1].T);
        }
    }

    tl.seek(tl.totalDuration()/2).seek(slider.value-0.001);

};

//Initializes timeline.data object for new meshes.

let addObjectTL = function(meshName, animRanges){
    if(tl.data.objects[meshName]===undefined){
        tl.data.objects[meshName] = {"name": meshName, "loc": [], "rot": [], "animations": []}
        for(let animation of animRanges){
            tl.data.objects[meshName].animations[animation.name] = {
                "name": animation.name,
                "from": animation.from,
                "to": animation.to,
                "current": 0,
                "animGroup": new BABYLON.AnimationGroup(animation.name, scene),
            }
        }
    }
    return tl.data.objects[meshName];
};