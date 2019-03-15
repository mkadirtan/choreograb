/**
 * ASSETS
 */
import playerModel from './media/model/newPlayer.babylon';
import playerManifest from './media/model/newPlayer.babylon.manifest';
/**
 * ASSETS
 */
/**
 * LIBRARY IMPORTS
 */
import { Map } from 'immutable';
import { TimelineMax, TweenMax } from 'gsap';
import { SceneLoader, MeshBuilder,
    ActionManager, ExecuteCodeAction, PointerDragBehavior,
    Vector3 } from "@babylonjs/core";
import * as cloneDeep from 'clone-deep';
/**
 * LIBRARY IMPORTS
 */
/**
 * LOCAL IMPORTS
 */
import {scene} from "./scene";
import {Motifs} from './motifs';
import {timeControl} from "./timeline";
import {selectionModeObservable, currentMode} from './GUI2';
import {settingsObservable} from "./utility";
import {HistoryAction, CreateID} from './history';
/**
 * LOCAL IMPORTS
 */
export let Players = [];
Players.updatePositionRotation = function(){
    let self = this;
    if(timeControl.checkOnMotif()){
        self.forEach(player=>{
            player.keys.forEach(key=>{
                if(key.MotifID === Motifs.current.MotifID){
                    console.log("key - motif match!");
                    player.collider.position.x = key.position.x;
                    player.collider.position.y = key.position.y;
                    player.collider.position.z = key.position.z;

                    player.collider.rotation.x = key.rotation.x;
                    player.collider.rotation.y = key.rotation.y;
                    player.collider.rotation.z = key.rotation.z;
                }
            })
        })
    }
}
export let selectedPlayer = null;

export let AbstractPlayer = {};
export let isPlayerLoaded = false;

SceneLoader.ImportMeshAsync("",'./newPlayer.babylon', "", scene).then(result => {
    let PlayerMesh = result.meshes[0];
    let PlayerSkeleton = result.skeletons[0];

    let ground = scene.getMeshByName("ground");
    let playerBounding = PlayerMesh.getBoundingInfo();
    let PlayerCollider = MeshBuilder.CreateCylinder(
        "PlayerCollider",
        {
            height: (playerBounding.maximum.y-playerBounding.minimum.y),
            diameterTop: 0.45,
            diameterBottom: 0.6
        },
        scene);
    PlayerMesh.setParent(PlayerCollider);

    let height = 1.70;
    let ratio = height/(playerBounding.maximum.y-playerBounding.minimum.y);

    PlayerCollider.position.y += (playerBounding.maximum.y-playerBounding.minimum.y)/2;
    PlayerCollider.bakeCurrentTransformIntoVertices();
    PlayerCollider.isVisible = false;
    PlayerCollider.scaling = new Vector3(ratio, ratio, ratio);
    PlayerCollider.position = new Vector3
    (
        ground.getBoundingInfo().maximum.x + 1,
        -PlayerMesh.getBoundingInfo().minimum.y,
        ground.getBoundingInfo().maximum.z - 2
    );
    PlayerCollider.rotation.y += Math.PI;


    PlayerMesh.name = "AbstractPlayer";

    let idle = PlayerSkeleton.getAnimationRange("Idle");
    let walk = PlayerSkeleton.getAnimationRange("WalkCycle");

    Object.assign(AbstractPlayer, {PlayerMesh, PlayerSkeleton, PlayerCollider, ranges: {idle, walk}});
    /*AbstractPlayer.PlayerMesh = PlayerMesh;
    AbstractPlayer.PlayerSkeleton = PlayerSkeleton;
    AbstractPlayer.PlayerCollider = PlayerCollider;
    AbstractPlayer.ranges = {idle, walk};*/
    isPlayerLoaded = true;

    scene.beginAnimation(PlayerSkeleton, AbstractPlayer.ranges.idle.from, AbstractPlayer.ranges.idle.to, true);

    PlayerMesh.actionManager = new ActionManager(scene);
    PlayerMesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnLeftPickTrigger,
            function(evt){
            let collider = AbstractPlayer.PlayerCollider.clone();
            let mesh = collider.getChildren()[0];
            mesh.skeleton = AbstractPlayer.PlayerSkeleton.clone();
            let newPlayer = new Player({evt, collider, mesh});

            scene.stopAnimation(newPlayer.mesh.skeleton);
            newPlayer.mesh.skeleton.returnToRest();
            scene.beginAnimation(newPlayer.mesh.skeleton, walk.from+1, walk.to-1, true);

            }
        )
    );
});

function Player(param){
    this.initParameters(param);
    this.initBehaviors(param);
    /**
     * mesh, collider, mesh.skeleton
     * keys[] = {motif, guide, snap, position, rotation}
     * isSnapped, snappedSnap, snappedGuide
     * feetDrag, lastPosition, evt, pointerDragBehavior
     * personalInformation, timeline
     */
}

Player.prototype = {
    initBehaviors: function(param){
        let self = this;
        self.collider.isVisible = true;
        self.collider.visibility = 0;
        //Register to players
        Players.push(self);
        selectedPlayer = self;
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
        //Initialize menu settings
        self.attachMenu();
        settingsObservable.notifyObservers({type: "player", attachedMesh: self.mesh});
        //Initialize dragBehavior
        self.addDragBehavior();
        //Check whether object was created by user interaction or loaded from data.
        if(param.position) self.checkEventData(param.position);
        else self.checkEventData();
        //Actions
        self.attachActions();
    },
    initParameters: function(param){
        let self = this;
        self.PlayerID = param.PlayerID || CreateID('Player');
        //Initialize variables and generic properties
        self.alive = true;
        self.currentKey = 0;
        self.dummyRotator = new MeshBuilder.CreatePlane("dummy", {size: 1}, scene);
        self.dummyRotator.isVisible = false;
        self.dummyRotator.ownerPlayer = self;
        self.keys = [];
        self.mesh = param.mesh;
        self.collider = param.collider;
        self.collider.ID = "PlayerCollider";
        self.collider.isVisible = false;
        self.evt = param.evt || false;
        self.mesh.name = "Player";
        self.mesh.ID = "Player";
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
    attachActions: function(){
        let self = this;
        let keyExecute = function(){
            if(timeControl.checkOnMotif()){
                let key = self.generateKey();
                let newKey = cloneDeep(key);
                let oldKey = null;
                self.keys.forEach(current=>{
                    if(current.MotifID === Motifs.current.MotifID){
                        oldKey = cloneDeep(current);
                    }
                });
                self.addKey(key);
                self.updateAnimation();
                self.updateTimeline();
                return {
                    oldKey,
                    newKey
                }
            }
            else {
                console.log("Can't assign key. No active motif found!")
            }
        };
        let keyUndo = function(stored){
            self.addKey(stored.oldKey);
            self.updateAnimation();
            self.updateTimeline();
        };
        let keyRedo = function(stored){
            self.addKey(stored.newKey);
            self.updateAnimation();
            self.updateTimeline();
        };
        self.key = new HistoryAction(keyExecute, keyUndo, keyRedo, self);
    },
    generateKey: function(){
        let self = this;
        let ease = Linear.easeNone;
        return {
            motif: Motifs.current,
            MotifID: Motifs.current.MotifID,
            position: {
                x: self.collider.position.x,
                y: self.collider.position.y,
                z: self.collider.position.z,
                ease: ease
            },
            rotation: {
                x: self.collider.rotation.x,
                y: self.collider.rotation.y,
                z: self.collider.rotation.z,
                ease: ease
            },
            stepCount: 3
        };
    },
    addKey: function(key){
        console.log("adding key...");
        console.log(key);
        let self = this;
        let exists;
        self.keys.forEach((_key, i)=>{
            if(_key.MotifID === key.MotifID){
                exists = true;
                self.keys[i] = key;
            }
        });
        if(!exists){
            self.keys.push(key);
        }
    },
    updateAnimation: function(){
        let self = this;
        scene.beginAnimation(
            self.mesh.skeleton,
            self.currentKey,
            self.currentKey
        );
    },
    updateTimeline: function(){
        let self = this;
        let ease = Linear.easeNone;
        let position = self.collider.position;
        let rotation = self.collider.rotation;

        self.timeline.kill({x: true, y: true, z: true}, position);
        self.timeline.kill({x: true, y: true, z: true}, rotation);
        self.timeline.kill({currentKey: true}, self);

        self.keys.sort((a,b)=>{
            return a.motif.start - b.motif.start
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
        self.keys.forEach((key, i, keys)=>{
            if(i>0){
                for(let step = 0; step<keys[i-1].stepCount; step++){
                    let singleStepDuration = (key.motif.start-keys[i-1].motif.end)/keys[i-1].stepCount;
                    self.timeline.fromTo(
                        self,
                        singleStepDuration,
                        {currentKey: AbstractPlayer.ranges.walk.from+2, ease: ease},
                        {currentKey: AbstractPlayer.ranges.walk.to-1, ease: ease},
                        keys[i-1].motif.end+singleStepDuration*step
                    );
                }
            }
        });
        timeControl.updateTimeline();
    },
    attachMenu: function(){
        let self = this;
        self.dummyRotator.position = self.collider.position.clone();
        self.dummyRotator.setParent(self.collider);
        self.mesh.actionManager = new ActionManager(scene);
        self.mesh.actionManager.registerAction(
            new ExecuteCodeAction({
                    trigger: ActionManager.OnLeftPickTrigger
                }, () => {
                        selectedPlayer = self;
                        settingsObservable.notifyObservers({type: "player", attachedMesh: self.mesh});
                },
            )
        )
    },
    addDragBehavior: function(){
        //todo rename all eventData, eventState's for clarity
        let self = this;
        self.pointerDragBehavior = new PointerDragBehavior({dragPlaneNormal: new Vector3(0,1,0)});
        self.pointerDragBehavior.dragDeltaRatio = 1;
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
            //self.checkSnap();
            //Player collision mechanics
            self.checkPlayerCollisions();
            //Keyframing algorithm
            if(!self.dragCancelled){
                self.key.execute();
                self.updateAnimation();
                self.updateTimeline();
            }
            self.dragCancelled = false;
            //Removal by trash can
            self.checkTrash();
            //todo Reattaching canvas control, because sometimes it doesn't work.
            scene.activeCamera.attachControl(scene.getEngine().getRenderingCanvas(), true);
        });
    },
    /*snap: function(guide, snap){
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
    },*/
    checkEventData: function(position){
        let self = this;
        if(self.evt){
            self.mesh.visibility = 0.8;
            self.mesh.renderOutline = true;
            self.pointerDragBehavior.onDragEndObservable.addOnce(function(){
                if(self.alive){
                    self.mesh.visibility = 1; self.mesh.renderOutline = false;
                    scene.stopAnimation(self.mesh.skeleton);
                    self.mesh.skeleton.returnToRest();
                    scene.beginAnimation(self.mesh.skeleton, AbstractPlayer.ranges.idle.from, AbstractPlayer.ranges.idle.to, true, 0.72);
                }
                self.evt = false;
            });
            let pick = scene.pick(self.evt.pointerX, self.evt.pointerY, function(mesh){return mesh.name === "AbstractPlayer"});
            if(scene.activeCamera.name === "fps") self.pointerDragBehavior.startDrag(self.evt.sourceEvent.pointerId);
            else self.pointerDragBehavior.startDrag(self.evt.sourceEvent.pointerId, pick.ray, pick.pickedPoint);
        }
        if(!self.evt){
            self.collider.position = position || new Vector3(0, -self.collider.getBoundingInfo().minimum.y, 0);
        }
    },
    /*checkSnap: function(){
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
    },*/
    checkPlayerCollisions: function(){
        let self = this;
        Players.forEach((player)=>{
            if(player.PlayerID !== self.PlayerID && self.collider.intersectsMesh(player.collider, false)){
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
        self.mesh.dispose();
        self.collider.dispose();
        timeControl.timeline.remove(self.timeline);
    }
};