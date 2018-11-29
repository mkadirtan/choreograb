import {TimelineMax, TweenMax} from 'gsap';
import * as BABYLON from "babylonjs";
import playerModel from './media/model/newPlayer.babylon';
import playerManifest from './media/model/newPlayer.babylon.manifest';
import {scene} from "./scene";
import {Motifs} from './motifs';
import {timeControl} from "./timeline";

export let players = [];

BABYLON.SceneLoader.ImportMeshAsync("",'./newPlayer.babylon', "", scene).then(function(result){
    let ground = scene.getMeshByName("ground");
    let Player = result.meshes[0];
    let playerBounding = Player.getBoundingInfo();
    let collider = BABYLON.MeshBuilder.CreateCylinder("collider",{height: (playerBounding.maximum.y-playerBounding.minimum.y), diameterTop: 0.35, diameterBottom: 0.5}, scene);
    collider.position.y += (playerBounding.maximum.y-playerBounding.minimum.y)/2;
    collider.bakeCurrentTransformIntoVertices();
    collider.isVisible = false;
    Player.setParent(collider);
    let material = new BABYLON.StandardMaterial("playerMaterial", scene);
    material.diffuseColor = BABYLON.Color3.Blue();
    Player.name = "Player";
    let arm = result.skeletons[0];
    let idle = arm.getAnimationRange("Idle");
    let walk = arm.getAnimationRange("WalkCycle");
    scene.beginAnimation(arm, idle.from, idle.to, true);
    let height = 1.70;
    let ratio = height/(playerBounding.maximum.y-playerBounding.minimum.y);
    collider.scaling = new BABYLON.Vector3(ratio, ratio, ratio);
    collider.position = new BABYLON.Vector3(ground.getBoundingInfo().maximum.x + 1,-Player.getBoundingInfo().minimum.y,ground.getBoundingInfo().maximum.z - 1);
    collider.rotation.y += Math.PI;
    //todo Loaded data should appear here to create predefined players.
    //new CreatePlayer({mesh: Player.clone("NewPlayer",null)});
    Player.actionManager = new BABYLON.ActionManager(scene);
    Player.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger,
            function(evt){
                let newCollider = collider.clone("collider", null);
                newCollider.isVisible = true;
                newCollider.visibility = 0;
                let newPlayer = new CreatePlayer({collider: newCollider, mesh: newCollider.getChildren()[0], idle: idle, walk: walk, arm: arm, evt: evt});
                scene.stopAnimation(newPlayer.skeleton);
                newPlayer.mesh.skeleton.returnToRest();
                scene.beginAnimation(newPlayer.mesh.skeleton, walk.from+1, walk.to-1, true);
            }
        )
    );
});

function CreatePlayer(param){
    let self = this;
    this.mesh = param.mesh;
    this.collider = param.collider;
    this.evt = param.evt || false;
    //param.mesh.ellipsoid = new BABYLON.Vector3(0.5,0.85,0.5);
    //param.mesh.ellipsoidOffset = new BABYLON.Vector3(0,1,0);
    //param.mesh.checkCollisions = true;
    param.mesh.ID = "Player";
    param.mesh.skeleton = param.arm.clone();
    this.walk = param.walk;
    this.idle = param.idle;
    this.lastPosition = null;
    let pointerDragBehavior = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0,1,0)});
    this.collider.addBehavior(pointerDragBehavior);
    let reference;
    pointerDragBehavior.onDragStartObservable.add(function(){
        self.lastPosition = self.collider.position.clone();
        let positionObserver = scene.onKeyboardObservable.add((event) => {
            if (event.event.code === "Space") {
                if (self.evt) {
                    self.destroy();
                } else if (self.evt === false){
                    self.collider.position = self.lastPosition;
                    pointerDragBehavior.releaseDrag();
                }
            }
        }, -1, true, self);
        reference = positionObserver;
    });
    pointerDragBehavior.onDragObservable.add(function(){
    });
    pointerDragBehavior.onDragEndObservable.add(function(){
        scene.onKeyboardObservable.remove(reference);
        Motifs.current.guides.forEach(e=>{
            if(e.isActive)e.snaps.forEach(s=>{
                if(s.intersectsMesh(self.collider, false)){
                    self.collider.position.x = s.absolutePosition.x;
                    self.collider.position.z = s.absolutePosition.z;
                }
            })
        });
        players.forEach((e,i)=>{
            if(e.mesh !== param.mesh && self.collider.intersectsMesh(e.collider, false)){
                //todo prevent collisions
                console.log("hit another player!");
            }
        });
        if(self.collider.intersectsMesh(scene.getMeshByName("Trash"), false)){
            self.destroy();
        }
    });
    self.collider.addBehavior(pointerDragBehavior);
    if(self.evt){
        param.mesh.visibility = 0.8;
        param.mesh.renderOutline = true;
        pointerDragBehavior.onDragEndObservable.addOnce(function(){
            if(self.mesh){
                param.mesh.visibility = 1; param.mesh.renderOutline = false;
                scene.stopAnimation(param.mesh.skeleton);
                param.mesh.skeleton.returnToRest();
                scene.beginAnimation(param.mesh.skeleton, self.idle.from, self.idle.to, true, 0.72);
            }
            self.evt = false;
        });
        let pick = scene.pick(self.evt.pointerX, self.evt.pointerY, function(mesh){return mesh.name === "Player"});
        pointerDragBehavior.startDrag(self.evt.sourceEvent.pointerId, pick.ray, pick.pickedPoint);
    }
    if(!self.evt){
        self.collider.position = param.position || new BABYLON.Vector3(0, -self.collider.getBoundingInfo().minimum.y, 0);
    }
    this.personalInformation = {
        name: param.name || "New Player",
        height: param.height || 170,
        order: param.order || 0
    };
    this.keys = [];
    this.timeline = new TimelineMax();
    players.push(this);
}

CreatePlayer.prototype = {
    addKey: function(param){
        let self = this;
        self.keys.push({
            motifName: param.motifName,
            position: param.position,
            rotation: param.rotation
        });
        return self;
    },
    updateAnimation: function(motifs){
        let self = this;
        /*
         * !Erase previous timeline data here for rotation and position!
         */
        self.timeline.kill({x: true, y: true, z: true});

        /*
         * !If first motif's start time is not equal to T = 0!
         */

        motifs.forEach(function(motif, motifIndex, motifs){
            let motifFound = false;
            self.keys.forEach(function(key, keyIndex, keys){
                if(key.motifName === motif.name){
                    /*
                     * !Add animation here!
                     */
                    self.timeline.to();
                    motifFound = true;
                }
            });
            if(!motifFound){
                /*
                 * !Player doesn't change rotation or position for
                 * not keyed motifs.!
                 */
                self.timeline.to();
            }
        });
        return self;
    },
    destroy: function(){
        let self = this;
        if(self.mesh){
            players.forEach((p,i,a)=>{
                if(p.mesh===self.mesh){
                    a.splice(i,1);
                }
            });
            self.mesh.dispose();
            delete self.mesh;

            delete self.personalInformation;
            delete self.keys;

            timeControl.timeline.remove(self.timeline);
            delete self.timeline;
            delete self.walk;
            delete self.idle;
            self.collider.dispose();
            delete self.collider;
            delete self.lastPosition;
            delete self.evt;
            console.log("Player destroyed: ", self);
        }
    }
};