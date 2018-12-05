import {TimelineMax, TweenMax} from 'gsap';
import * as BABYLON from "babylonjs";
import playerModel from './media/model/newPlayer.babylon';
import playerManifest from './media/model/newPlayer.babylon.manifest';
import {scene} from "./scene";
import {Motifs} from './motifs';
import {timeControl} from "./timeline";
import {selectionModeObservable, currentMode} from './GUI2';

export let players = [];
players.setKey = function(keyName, key){
    this[keyName] = key;
}

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

export let keyChangeObservable = new BABYLON.Observable();

function CreatePlayer(param){
    let self = this;
    this.init(param);
    /**
     * mesh, collider, mesh.skeleton
     * keys[] = {motif, guide, snap, position, rotation}
     * isSnapped, snappedSnap, snappedGuide
     * feetDrag, lastPosition, evt, pointerDragBehavior
     * personalInformation, timeline
     */
}

CreatePlayer.prototype = {
    init: function(param){
        let self = this;
        //Initialize variables and generic properties
        self.mesh = param.mesh;
        self.collider = param.collider;
        console.log("realone", self.collider);
        self.collider.isVisible = false;
        self.evt = param.evt || false;
        self.mesh.ID = "Player";
        self.mesh.skeleton = param.arm.clone();
        self.lastPosition = null;
        self.isSnapped = false;
        self.feetDrag = false;
        self.keys = [];
        self.timeline = new TimelineMax();
        timeControl.timeline.add(self.timeline, 0);
        self.personalInformation = {
            name: param.name || "New Player",
            height: param.height || 170,
            order: param.order || 0
        };
        //Register to players
        players.push(self);
        //Initialize keys
        Motifs.motifs.forEach(motif=>self.addMotifKey(motif, false));
        //Initialize selectionModeObservable
        //todo remove need for && self.mesh
        selectionModeObservable.add(mode=>{
            if(mode === "players" && self.mesh){
                self.mesh.isPickable = true;
                self.collider.isPickable = true;
            }
            else if(mode === "guides" && self.mesh){
                self.mesh.isPickable = false;
                self.collider.isPickable = false;
            }
        });
        selectionModeObservable.notifyObservers(currentMode);
        //Initialize keyChangeObservable
        //todo Unique ID please...
        keyChangeObservable.add(data=>{
            console.log("I'm notified!");
            if(self.mesh === data.mesh){
                self.updateKey(data.newKey);
                console.log(self.mesh, "is Updated with", data.newKey);
            }
        });
        //Initialize dragBehavior
        self.addDragBehavior();
        //Check whether object was created by user interaction or loaded from data.
        if(param.position) self.checkEventData(param.position);
        else self.checkEventData();
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
            //Update key
            if(!self.dragCancelled){
                console.log("notify!");
                keyChangeObservable.notifyObservers({mesh: self.mesh, newKey:{
                motif: Motifs.current,
                guide: self.snappedGuide,
                snap: self.snappedSnap,
                position: self.collider.position,
                rotation: self.collider.rotation
                }});
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
        console.log("snapped");
    },
    desnap: function(){
        let self = this;
        self.snappedGuide = false;
        self.snappedSnap = false;
        console.log("desnapped");   
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
            //todo instead of comparing meshes, compare unique IDs.
            if(player.mesh !== self.mesh && self.collider.intersectsMesh(player.collider, false)){
                //todo prevent collisions
                console.log("hit another player!");
            }
        });
    },
    checkTrash: function(){
        let self = this;
        if(self.collider.intersectsMesh(scene.getMeshByName("Trash"), false)){
            console.log(self);
            //self.destroy();
        }
    },
    addMotifKey: function(newMotif, isNew){
        let self = this;
        let pos = false;
        let rot = false;
        if(isNew){
            pos = self.keys[self.keys.length-1].position;
            rot = self.keys[self.keys.length-1].rotation
        }
        self.keys.push({
            motif: newMotif,
            guide: false,
            snap: false,
            position: pos,
            rotation: rot
        });
    },
    removeMotifKey: function(oldMotif){
        let self = this;
        self.keys.forEach((key, index, array)=>{
            if(key.motif === oldMotif){
                array.splice(index,1);
                updateTimeline();
            }
        });
    },
    updateKey: function(newKey){
        let self = this;
        self.keys.forEach(key=>{
            if(key.motif.name === newKey.motif.name){
                key.guide = newKey.guide;
                key.snap = newKey.snap;
                key.position = newKey.position;
                key.rotation = newKey.rotation;
            }
        });
        console.log(self.keys);
    },
    updateTimeline: function(){
        let self = this;
        //Sorting        
        self.keys.sort((a,b)=>{
            return a.motif.start - b.motif.start;
        })
        //Referencing
        let pos = self.collider.position;
        let rot = self.collider.rotation;
        //Cleaning existing keys
        console.log("OK1");
        self.timeline.kill({x: true, y: true, z: true}, pos);
        self.timeline.kill({x: true, y: true, z: true}, rot);
        console.log("OK2");
        //Adding new keys
        self.keys.forEach((key, index, array)=>{
            if(index > 1){
                console.log("OK4");
                //Transition
                self.timeline.to(
                    pos,
                    key.motif.start-array[index-1].motif.end,
                    {x: key.position.x,
                     y: key.position.y,
                     z: key.position.z},
                    array[index-1].motif.end);
                //Immobilization
                self.timeline.to(
                    pos,
                    key.motif.end-key.motif.start,
                    {
                        x: key.position.x,
                        y: key.position.y,
                        z: key.position.z
                    },
                    key.motif.start);
            }
            //Initialization
            else{
                console.log("OK3");
                if(key.motif.start !== 0){
                    self.timeline.to(
                        pos,
                        key.motif.start,
                        {
                            x: key.position.x,
                            y: key.position.y,
                            z: key.position.z
                        },
                        0);
                }
                self.timeline.to(
                    pos,
                    key.motif.end-key.motif.start,
                    {
                        x: key.position.x,
                        y: key.position.y,
                        z: key.position.z
                    },
                    key.motif.start)
            }
            console.log("OK5");
        })
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
            //delete self.evt;
            console.log("Player destroyed: ", self);
        }
    }
};