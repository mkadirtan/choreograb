/**
 * ASSETS
 */
import playerModel from '../src/media/model/newPlayer.babylon';
import playerManifest from '../src/media/model/newPlayer.babylon.manifest';
/**
 * ASSETS
 */
/**
 * LIBRARY IMPORTS
 */
import { TimelineMax } from 'gsap';
import { Power0 } from "gsap";
import { SceneLoader, MeshBuilder,
    ActionManager, ExecuteCodeAction, PointerDragBehavior,
    Vector3 } from "@babylonjs/core/index";
/**
 * LIBRARY IMPORTS
 */
/**
 * LOCAL IMPORTS
 */
import {scene} from "./scene";
import {Motif, Motifs} from './motifs';
import {timeControl} from "./timeline";
import {selectionModeObservable, currentMode} from './GUI2';
import {settingsObservable} from "./utility";
import {HistoryAction, CreateID} from './history';
import {actionTakenObservable} from "./sceneControl";

/**
 * LOCAL IMPORTS
 */
export let Players = {
    players: [],
    clearAll(){
        this.players.forEach(player=>player.destroy())
    },
    add(player){
        if(this.getPlayerByPlayerID(player.PlayerID) === null)this.players.push(player);
    },
    remove(player){
        this.players.forEach((_player,i,a)=>{
            if(_player.PlayerID === player.PlayerID){
                a.splice(i,1);
            }
        })
    },
    getPlayerByPlayerID(PlayerID){
        let self = this;
        let returned = null;
        self.players.forEach(player=>{
            if(player.PlayerID === PlayerID){
                returned = player;
            }
        });
        return returned;
    },
    updatePlayers(players){
        let self = this;
        players.forEach(_player => {
            let player = self.getPlayerByPlayerID(_player.PlayerID);
            if(player !== null){
                player.updatePlayerStatus(_player);
            }
            else {
                new Player(_player)
            }
        });
        let playersToRemove = [];
        self.players.forEach((player,i,array)=>{
            let found = false;
            players.forEach(_player=>{
                if(player.PlayerID === _player.PlayerID) found = true;
            });
            if(!found){
                playersToRemove.push(i);
            }
        });
        playersToRemove.sort((a,b)=>{return b-a});
        playersToRemove.forEach(index=>{
            self.players[index].destroy();
        });
        //playersToRemove.forEach(index=>self.remove(self.players[index]));
    },
    updatePositionRotation(){
        let self = this;
        if(timeControl.checkOnMotif()){
            self.players.forEach(player=>{
                player.keys.forEach(key=>{
                    if(key.MotifID === Motifs.current.MotifID){
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
    },
    registerElements(){
        let elements = [];
        this.players.forEach(player=>{
            elements.push({
                PlayerID: JSON.parse(JSON.stringify(player.PlayerID)),
                personalInformation: JSON.parse(JSON.stringify(player.personalInformation)),
                position: player.collider.position.clone(),
                keys: JSON.parse(JSON.stringify(player.keys))
            })
        });
        return elements;
    },
};

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
    isPlayerLoaded = true;

    scene.beginAnimation(PlayerSkeleton, AbstractPlayer.ranges.idle.from, AbstractPlayer.ranges.idle.to, true);

    PlayerMesh.actionManager = new ActionManager(scene);
    PlayerMesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnLeftPickTrigger,
            function(evt){
            let newPlayer = new Player({isByEvent: evt});
            scene.stopAnimation(newPlayer.mesh.skeleton);
            newPlayer.mesh.skeleton.returnToRest();
            scene.beginAnimation(newPlayer.mesh.skeleton, walk.from+1, walk.to-1, true);
            }
        )
    );
});

export function Player(param){
    this.initializePlayer(param);
    this.updatePlayerStatus(param);
}

Player.prototype = {
    initializePlayer(param){
        this.initializePlayerParameters(param);
        this.initializePlayerBehavior(param);
    },
    updatePlayerStatus(param){
        this.updatePlayerParameters(param);
        this.updatePlayerBehavior(param);
    },
    initializePlayerParameters(param){
        let self = this;
        Object.assign(this,
            {
                type: "Player",
                PlayerID: param.PlayerID || CreateID('Player'),
                isActive: true,
                dummyRotator: MeshBuilder.CreatePlane("dummy", {size: 1}, scene),
                collider: AbstractPlayer.PlayerCollider.clone(),
                isByEvent: param.isByEvent,
                lastPosition: null,
                isSnapped: false,
                feetDrag: false,
                timeline: new TimelineMax(),
                keys: param.keys ||[],
                currentKey: 0,
                personalInformation: {
                    name: param.name || "New Player",
                    height: param.height || 170,
                    order: param.order || 0
                },
                attachedPosition: param.position || null
            });
    },
    initializePlayerBehavior(){
        this.dummyRotator.ID = "PlayerRotator";
        this.dummyRotator.isVisible = false;
        this.dummyRotator.ownerPlayer = this;
        this.collider.ID = "PlayerCollider";
        this.hideCollider();
        this.mesh = this.collider.getChildren()[0];
        this.mesh.skeleton = AbstractPlayer.PlayerSkeleton.clone();
        this.mesh.name = "Player";
        this.mesh.ID = "Player";
        Players.add(this);
        if(this.isByEvent){selectedPlayer = this}
        timeControl.add(this.timeline);
        this.addSelectionBehavior();
        this.attachMenu();
        this.addDragBehavior();
        this.checkEventData(this.attachedPosition);
    },
    updatePlayerParameters: function(param){
        let newParam = {};
        const allowedParams = ["keys", "currentKey", "personalInformation", "lastPosition", "isSnapped", "feetDrag", "isActive"];
        allowedParams.forEach(entry=>{
            if(param.hasOwnProperty(entry)){newParam[entry] = param[entry];}
        });
        Object.assign(this, newParam)
    },
    updatePlayerBehavior(){
        this.updateTimeline();
        this.updateAnimation();
    },
    key(){
        let self = this;
        if(timeControl.checkOnMotif()){self.addKey(self.generateKey())}
        this.updateTimeline();
        this.updateAnimation();
    },
    generateKey: function(){
        let self = this;
        let ease = Power0.easeNone;
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
        let ease = Power0.easeNone;
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

        self.dragCancelled = false;
        self.pointerDragBehavior.onDragStartObservable.add(function(eventData, eventState){
            self.lastPosition = self.collider.position.clone();
            self.collider.position = self.collider.position.clone();
            self.keyboardObservable = scene.onKeyboardObservable.add((event) => {
                //Cancel object dragging or creation
                if (event.event.code === "Space") {
                    if (this.isByEvent) {
                        this.pointerDragBehavior.releaseDrag();
                        this.destroy();
                    } else if (this.isByEvent === false){
                        this.dragCancelled = true;
                        this.pointerDragBehavior.releaseDrag();
                        this.collider.position = this.lastPosition;
                    }
                }
            }, -1, true, self);
            //When active camera is 'fps' drag players from their feet
            if(scene.activeCamera.name === "fps" && !self.feetDrag && !self.isByEvent) {
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
            scene.onKeyboardObservable.remove(self.keyboardObservable);
            //Apply snapping
            //self.checkSnap();
            //Player collision mechanics
            self.checkPlayerCollisions();
            //Keyframing algorithm
            if(!self.dragCancelled){
                self.key();
                actionTakenObservable.notifyObservers("player key action");
            }
            self.dragCancelled = false;
            //Removal by trash can
            self.checkTrash();
            //todo Reattaching canvas control, because sometimes it doesn't work.
            scene.activeCamera.attachControl(scene.getEngine().getRenderingCanvas(), true);
        });
    },
    isSelectable(status){
        if(status){
            this.mesh.isPickable = true;
            this.collider.isPickable = true;
        }
        else{
            this.mesh.isPickable = false;
            this.collider.isPickable = false;
        }
    },
    addSelectionBehavior(){
        selectionModeObservable.notifyObservers(currentMode);
        if(self.isByEvent){
            settingsObservable.notifyObservers({type: "player", attachedMesh: self.mesh});
        }
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
        if(self.isByEvent){
            self.mesh.visibility = 0.8;
            self.mesh.renderOutline = true;
            self.pointerDragBehavior.onDragEndObservable.addOnce(function(){
                if(self.isActive){
                    self.mesh.visibility = 1; self.mesh.renderOutline = false;
                    scene.stopAnimation(self.mesh.skeleton);
                    self.mesh.skeleton.returnToRest();
                    scene.beginAnimation(self.mesh.skeleton, AbstractPlayer.ranges.idle.from, AbstractPlayer.ranges.idle.to, true, 0.72);
                }
                self.isByEvent = false;
            });
            let pick = scene.pick(self.isByEvent.pointerX, self.isByEvent.pointerY, function(mesh){return mesh.name === "AbstractPlayer"});
            if(scene.activeCamera.name === "fps") self.pointerDragBehavior.startDrag(self.isByEvent.sourceEvent.pointerId);
            else self.pointerDragBehavior.startDrag(self.isByEvent.sourceEvent.pointerId, pick.ray, pick.pickedPoint);
        }
        else if(position){
            self.collider.position = new Vector3(position);
            //|| new Vector3(0, -self.collider.getBoundingInfo().minimum.y, 0);
            delete self.attachedPosition;
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
        Players.players.forEach((player)=>{
            if(player.PlayerID !== self.PlayerID && self.collider.intersectsMesh(player.collider, false)){
                //todo prevent collisions
            }
        });
    },
    hideCollider(){
        this.collider.isVisible = true;
        this.collider.visibility = 0;
    },
    checkTrash: function(){
        let self = this;
        if(self.collider.intersectsMesh(scene.getMeshByName("Trash"), false)){
            self.destroy();
        }
    },
    destroy: function(){
        const meshes = ["mesh", "collider", "dummyRotator", ];
        scene.onKeyboardObservable.remove(this.keyboardObservable);
        timeControl.timeline.remove(this.timeline);
        meshes.forEach(mesh=>{this[mesh].dispose();});
        delete this.keyboardObservable;
        delete this.selectionObservable;
        delete this.timeline;
        Players.remove(this);
        this.PlayerID += "deleted";
    }
};