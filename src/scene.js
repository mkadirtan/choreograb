import * as GUI from 'babylonjs-gui';

let initializeScene = function(){
    let canvas = document.getElementById("renderCanvas");
    let engine = new BABYLON.Engine(canvas,  true, {stencil: true}); //Stencil: Edge renderer
    let scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.75,0.75,0.75); //Background color

    let camera = new BABYLON.ArcRotateCamera("Camera", Math.PI/2, Math.PI/3, 32, new BABYLON.Vector3(0,0,0), scene);
    camera.attachControl(canvas, true);

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
    let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 20, height: 20}, scene);
    ground.material = groundMaterial;
    ground.receiveShadows = true;
    ground.isVisible = false;

    let Trash = BABYLON.MeshBuilder.CreateBox("Trash", {depth: 2, width: 2, height: 0.2}, scene);
    Trash.position.x = ground.getBoundingInfo().minimum.x -1;
    Trash.position.y = 0.1;
    Trash.position.z = ground.getBoundingInfo().maximum.z -1;
    let trashMaterial = new BABYLON.StandardMaterial("trashMaterial", scene);
    trashMaterial.diffuseColor = BABYLON.Color3.Red();
    Trash.material = trashMaterial;

    let Player = BABYLON.MeshBuilder.CreateCylinder("Player",{
        diameterTop: 0.6,
        diameterBottom: 0.6,
        height: 1
    }, scene);
    Player.position.x = ground.getBoundingInfo().maximum.x + 1;
    Player.position.y = 0.5;
    Player.position.z = ground.getBoundingInfo().maximum.z - 1;
    Player.actionManager = new BABYLON.ActionManager(scene);
    var i = 1;
    var playerMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
    playerMaterial.diffuseColor = BABYLON.Color3.Blue();
    Player.material=playerMaterial;
    Player.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger,
            function(evt){
                console.log(evt);
                let duplicate = evt.meshUnderPointer.clone("Player No: "+i);
                let pointerDragBehavior = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0,1,0)});
                duplicate.visibility = 0.8;
                duplicate.renderOutline = true;
                pointerDragBehavior.onDragEndObservable.add(function(){
                    if(duplicate.intersectsMesh(Trash,false)){
                        duplicate.dispose();
                    }
                });
                pointerDragBehavior.onDragEndObservable.addOnce(function(){
                    duplicate.visibility = 1;
                    duplicate.renderOutline = false;
                    console.log("once?")
                });
                duplicate.addBehavior(pointerDragBehavior);
                pointerDragBehavior.startDrag(evt.sourceEvent.pointerId);
                i++;
            }
        )
    );

    engine.runRenderLoop(function(){
        scene.render();
    });

    window.addEventListener("resize", function(){
        engine.resize();
    });
    return scene;
};

export let scene = initializeScene();
export let anchor = new BABYLON.AbstractMesh("anchor", scene);
