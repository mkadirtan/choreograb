import {TimelineMax, TweenMax} from 'gsap';
import * as BABYLON from "babylonjs";
import playerModel from './media/model/newPlayer.babylon';
import playerManifest from './media/model/newPlayer.babylon.manifest';
import {scene} from "./scene";
import {Motifs} from './motifs';
import {timeControl} from "./timeline";
import {selectionModeObservable, currentMode} from './GUI2';
import {selection} from './selection';

export let players = [];

players.setKey = function(keyName, key){
    this[keyName] = key;
}

let incrementer = 0;
let getUniqueID = function(){
    incrementer++;
    return "Player" + incrementer;
};

BABYLON.SceneLoader.ImportMeshAsync("",'./newPlayer.babylon', "", scene).then(function(result){
    let ground = scene.getMeshByName("ground");
    let Player = result.meshes[0];
    let playerBounding = Player.getBoundingInfo();
    let collider = BABYLON.MeshBuilder.CreateCylinder("collider",{height: (playerBounding.maximum.y-playerBounding.minimum.y), diameterTop: 0.45, diameterBottom: 0.6}, scene);
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
    players.setKey("idle", idle);
    players.setKey("walk", walk);
    scene.beginAnimation(arm, idle.from, idle.to, true);
    let height = 1.70;
    let ratio = height/(playerBounding.maximum.y-playerBounding.minimum.y);
    collider.scaling = new BABYLON.Vector3(ratio, ratio, ratio);
    collider.position = new BABYLON.Vector3(ground.getBoundingInfo().maximum.x + 1,-Player.getBoundingInfo().minimum.y,ground.getBoundingInfo().maximum.z - 2);
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
                let newPlayer = new CreatePlayer({collider: newCollider, mesh: newCollider.getChildren()[0], arm: arm, evt: evt});
                scene.stopAnimation(newPlayer.skeleton);
                newPlayer.mesh.skeleton.returnToRest();
                scene.beginAnimation(newPlayer.mesh.skeleton, walk.from+1, walk.to-1, true);
            }
        )
    );
});

function CreatePlayer(param){
    let self = this;
    this.initParameters(param);
    this.initBehaviors(param);
    console.log(self);
    /**
     * mesh, collider, mesh.skeleton
     * keys[] = {motif, guide, snap, position, rotation}
     * isSnapped, snappedSnap, snappedGuide
     * feetDrag, lastPosition, evt, pointerDragBehavior
     * personalInformation, timeline
     */
}

CreatePlayer.prototype = {
    initBehaviors: function(param){
        let self = this;
        //Register to players
        players.push(self);
        //Register to timeControl
        timeControl.timeline.add(self.timeline,0);
        //Initialize selectionModeObservable
        selectionModeObservable.add(mode=>{
            if(mode === "players" && self.alive){
                self.mesh.isPickable = true;
                self.collider.isPickable = true;
            }
            else if(mode === "guides" && self.alive){
                self.mesh.isPickable = false;
                self.collider.isPickable = false;
            }
        });
        selectionModeObservable.notifyObservers(currentMode);
        //Initialize dragBehavior
        self.addDragBehavior();
        //Check whether object was created by user interaction or loaded from data.
        if(param.position) self.checkEventData(param.position);
        else self.checkEventData();
    },
    initParameters: function(param){
        let self = this;
        //Initialize variables and generic properties
        self.alive = true;
        self.keys = [];
        self.mesh = param.mesh;
        self.uniqueID = getUniqueID();
        self.collider = param.collider;
        self.collider.ID = "PlayerCollider";
        self.collider.isVisible = false;
        self.evt = param.evt || false;
        self.mesh.ID = "Player";
        self.mesh.skeleton = param.arm.clone();
        self.lastPosition = null;
        self.isSnapped = false;
        self.feetDrag = false;
        self.timeline = new TimelineMax();
        self.personalInformation = {
            name: param.name || "New Player",
            height: param.height || 170,
            order: param.order || 0
        };
    },
    key: function(){
        let self = this;
        if(timeControl.slider.value <= Motifs.current.end+0.01 && timeControl.slider.value+0.01 >= Motifs.current.start && timeControl.timeline.paused()){
            let exists = false;
            let index = 0;
            let key = {
                motif: Motifs.current,
                position: {
                    x: self.collider.position.x,
                    y: self.collider.position.y,
                    z: self.collider.position.z
                },
                rotation: {
                    x: self.collider.rotation.x,
                    y: self.collider.rotation.y,
                    z: self.collider.rotation.z
                }
            };
            self.keys.forEach((e,i)=>{
                if(e.motif.name === Motifs.current.name){
                    exists = true;
                    index = i;
                }
            });
            if(exists){
                self.keys[index] = key;
            }
            else{
                self.keys.push(key);
            }
            return key;
        }
        return false;
    },
    updateTimeline: function(){
        let self = this;
        let position = self.collider.position;
        let rotation = self.collider.rotation;

        self.timeline.kill({x: true, y: true, z: true}, position);

        self.keys.sort((a,b)=>{
            return a.motif.start - b.motif.start;
        });
        self.keys.forEach((key, i, keys)=>{
            if(i>0){
                self.timeline.fromTo(
                    position,
                    key.motif.start-keys[i-1].motif.end,
                    keys[i-1].position,
                    key.position,
                    keys[i-1].motif.end
                );
            }
        });
        self.keys.forEach((key, i, keys)=>{
            if(i>0){
                self.timeline.fromTo(
                    rotation,
                    key.motif.start-keys[i-1].motif.end,
                    keys[i-1].rotation,
                    key.rotation,
                    keys[i-1].motif.end
                );
            }
        });
        console.log(self.timeline.duration());
    },
    addDragBehavior: function(){
        //todo rename all eventData, eventState's for clarity
        let self = this;
        self.pointerDragBehavior = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0,1,0)});
        self.pointerDragBehavior.useObjectOrienationForDragging = false;
        self.pointerDragBehavior.updateDragPlane = false;
        self.collider.addBehavior(self.pointerDragBehavior);
        
        let reference; //Required for deletion of keyboard observable
        self.dragCancelled = false;
        self.pointerDragBehavior.onDragStartObservable.add(function(eventData, eventState){
            self.lastPosition = self.collider.position.clone();
            self.collider.position = self.collider.position.clone();
            reference = scene.onKeyboardObservable.add((event) => {
                //Cancel object dragging or creation
                if (event.event.code === "Space") {
                    if (self.evt) {
                        self.pointerDragBehavior.releaseDrag();
                        self.destroy();
                    } else if (self.evt === false){
                        self.dragCancelled = true;
                        self.pointerDragBehavior.releaseDrag();
                        self.collider.position = self.lastPosition;
                    }
                }
            }, -1, true, self);
            //When active camera is 'fps' drag players from their feet
            if(scene.activeCamera.name === "fps" && !self.feetDrag && !self.evt) {
                self.feetDrag = true;
                setTimeout(function(){
                    self.pointerDragBehavior.startDrag(eventData.pointerId);
                    self.feetDrag = false;
                },0);
                self.pointerDragBehavior.releaseDrag();
            }
        });
        self.pointerDragBehavior.onDragEndObservable.add(function(){
            //Remove keyboard observable
            scene.onKeyboardObservable.remove(reference);
            //Apply snapping
            self.checkSnap();
            //Player collision mechanics
            self.checkPlayerCollisions();
            //Keyframing algorithm
            if(!self.dragCancelled){
                self.collider.rotation.y += Math.PI/2;
                let newKey = self.key();
                self.updateTimeline();
                if(newKey) timeControl.shake(newKey.motif);
                else{timeControl.updateTimeline()}
            }
            self.dragCancelled = false;
            //Removal by trash can
            self.checkTrash();
            //todo Reattaching canvas control, because sometimes it doesn't work.
            scene.activeCamera.attachControl(scene.getEngine().getRenderingCanvas(), true);
        });
    },
    snap: function(guide, snap){
        let self = this;
        self.collider.position = snap.absolutePosition;
        self.isSnapped = true;
        self.snappedGuide = guide;
        self.snappedSnap = snap;
    },
    desnap: function(){
        let self = this;
        self.snappedGuide = false;
        self.snappedSnap = false;
    },
    checkEventData: function(position){
        let self = this;
        if(self.evt){
            self.mesh.visibility = 0.8;
            self.mesh.renderOutline = true;
            self.pointerDragBehavior.onDragEndObservable.addOnce(function(){
                if(self.mesh){
                    self.mesh.visibility = 1; self.mesh.renderOutline = false;
                    scene.stopAnimation(self.mesh.skeleton);
                    self.mesh.skeleton.returnToRest();
                    scene.beginAnimation(self.mesh.skeleton, players.idle.from, players.idle.to, true, 0.72);
                }
                self.evt = false;
            });
            let pick = scene.pick(self.evt.pointerX, self.evt.pointerY, function(mesh){return mesh.name === "Player"});
            if(scene.activeCamera.name === "fps") self.pointerDragBehavior.startDrag(self.evt.sourceEvent.pointerId);
            else self.pointerDragBehavior.startDrag(self.evt.sourceEvent.pointerId, pick.ray, pick.pickedPoint);
        }
        if(!self.evt){
            self.collider.position = position || new BABYLON.Vector3(0, -self.collider.getBoundingInfo().minimum.y, 0);
        }
    },
    checkSnap: function(){
        let self = this;
        Motifs.current.guides.forEach(guide=>{
                self.isSnapped = false;
                if(guide.isActive)guide.snapColliders.forEach(snap=>{
                    if(snap.intersectsMesh(self.collider, false)){
                        self.snap(guide, snap)
                    }
                })
            });
        if(self.isSnapped === false){
            self.desnap();         
        }
    },
    checkPlayerCollisions: function(){
        let self = this;
        players.forEach((player,i)=>{
            if(player.uniqueID !== self.uniqueID && self.collider.intersectsMesh(player.collider, false)){
                //todo prevent collisions
            }
        });
    },
    checkTrash: function(){
        let self = this;
        if(self.collider.intersectsMesh(scene.getMeshByName("Trash"), false)){
            self.destroy();
        }
    },
    destroy: function(){
        let self = this;
        self.alive = false;
        players.forEach((p,i,a)=>{
            if(p.uniqueID === self.uniqueID){
                a.splice(i,1);
            }
        });
        self.mesh.dispose();
        delete self.mesh;
        delete self.personalInformation;
        timeControl.timeline.remove(self.timeline);
        delete self.timeline;
        delete self.walk;
        delete self.idle;
        self.collider.dispose();
        delete self.collider;
        delete self.lastPosition;
    }
};