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

Choreograb.Scene.createScene();
let createScene = function(){

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
