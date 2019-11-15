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
import {scene} from "./SceneConstructor";
import {Motifs} from './motifs';
import {timeControl} from "./timeline";
import {notify} from './GUI2';
import {settingsObservable} from "./utility";
import {CreateID} from "./CreateID";
import {actionTakenObservable} from "./sceneControl";

/**
 * LOCAL IMPORTS
 */

export let selectedPlayer = null;

export let AbstractPlayer = {};
export let isPlayerLoaded = false;

SceneLoader.ImportMeshAsync("",playerModel, "", scene).then(result => {
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
                timeControl.checkOnMotif().then(()=>{
                    let newPlayer = new Player({isByEvent: evt});
                    scene.stopAnimation(newPlayer.mesh.skeleton);
                    newPlayer.mesh.skeleton.returnToRest();
                    scene.beginAnimation(newPlayer.mesh.skeleton, walk.from+1, walk.to-1, true);
                }).catch((error)=>{notify(error, 'error')});
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
        timeControl.add(this.timeline);
        this.attachMenu();
        this.addDragBehavior();
        this.checkEventData(this.attachedPosition);
    },
    updatePlayerParameters: function(param){
        let newParam = {};
        const allowedParams = ["keys", "currentKey", "personalInformation", "lastPosition", "feetDrag", "isActive"];
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
        timeControl.checkOnMotif().then(self.addKey(self.generateKey()));
        this.updateTimeline();
        this.updateAnimation();
    },
    generateKey: function(){
        let self = this;
        let ease = Power0.easeNone;
        return {
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

        let keys = [];
        self.keys.forEach((key)=>{
            let newKey = {};
            Object.assign(newKey, key);
            newKey.motif = Motifs.getMotifByMotifID(key.MotifID);
            console.log("really?:");
            console.log(newKey.motif);
            keys.push(newKey);
        });
        console.log("now, keys:");
        console.log(keys);

        self.timeline.kill({x: true, y: true, z: true}, position);
        self.timeline.kill({x: true, y: true, z: true}, rotation);
        self.timeline.kill({currentKey: true}, self);

        keys.sort((a,b)=>{
            return a.motif.start - b.motif.start
        });

        keys.forEach((key, i, keys)=>{
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
        keys.forEach((key, i, keys)=>{
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
        keys.forEach((key, i, keys)=>{
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
        self.collider.actionManager = new ActionManager(scene);
        self.collider.actionManager.registerAction(
            new ExecuteCodeAction({
                    trigger: ActionManager.OnLeftPickTrigger
                }, () => {
                        selectedPlayer = self;
                        settingsObservable.notifyObservers({type: "player", attachedMesh: self.mesh});
                },
            )
        )
    },
    checkEventData: function(position){
        let self = this;
        if(self.isByEvent){
            self.mesh.visibility = 0.8;
            self.mesh.renderOutline = true;
            self.pointerDragBehavior.onDragEndObservable.addOnce(function(){
                if(self.isActive){
                    selectedPlayer = this;
                    settingsObservable.notifyObservers({type: "player", attachedMesh: self.mesh});
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
        delete this.timeline;
        Players.remove(this);
        this.PlayerID += "deleted";
    }
};