/**
 * BABYLON IMPORTS
 */
import {Color3, Vector3,
    PointerDragBehavior,
    ActionManager, ExecuteCodeAction,
    StandardMaterial,
    MeshBuilder,
    Path3D} from "@babylonjs/core";
/**
 * BABYLON IMPORTS
 */
/**
 * LOCAL IMPORTS
 */
import {scene} from './scene';
import {Motif, Motifs} from './motifs';
import {currentMode, selectionModeObservable} from './GUI2';
import {settingsObservable} from "./utility";
import {CreateID} from "./history";
/**
 * LOCAL IMPORTS
 */

export let Guides = {
    guides: [],
    clearAll(){
        this.guides.forEach(guide=>guide.destroy())
    },
    getGuideByGuideID(GuideID){
        let self = this;
        self.guides.forEach(guide=>{
            if(guide.GuideID === GuideID){
                return guide;
            }
        });
        return null;
    },
    updateGuides(guides){
        let self = this;
        guides.forEach(_guide => {
            let guide = self.getGuideByGuideID(_guide.GuideID);
            if(guide !== null)guide.updateGuideStatus(_guide);
            else new Guide(_guide)
        });
        self.guides.forEach(guide=>{
            let found = false;
            let index = -1;
            guides.forEach((_guide, i)=>{
                if(guide.GuideID === _guide.GuideID)found=true;
                index = i;
            });
            if(!found && index!==-1)self.guides[index].destroy()
        })
    },
    add(guide){
        this.guides.push(guide);//todo
    },
    remove(guide){
        this.guides.forEach((_guide,i,a)=>{
            if(_guide.GuideID === guide.GuideID){
                a.splice(i,1);
            }
        })
    },
    registerElements(){
        let elements = [];
        this.guides.forEach(guide=>{
            elements.push({
                type: JSON.parse(JSON.stringify(guide.type)),
                GuideID: JSON.parse(JSON.stringify(guide.GuideID)),
                playerCount: JSON.parse(JSON.stringify(guide.playerCount)),
                position: JSON.parse(JSON.stringify(guide.position)),
                MotifID: JSON.parse(JSON.stringify(guide.motif.MotifID)),
                points: JSON.parse(JSON.stringify(guide.points)),
                radius: JSON.parse(JSON.stringify(guide.radius)),
                color: JSON.parse(JSON.stringify(guide.color)),
                material: JSON.parse(JSON.stringify(guide.material)),
                isActive: JSON.parse(JSON.stringify(guide.isActive))
            });
        });
        return elements;
    },
};

export let selectedGuide = null;

let defaultGuideMaterial = new StandardMaterial("guideMaterial", scene);
defaultGuideMaterial.diffuseColor = new Color3.Yellow();

export function Guide(param){
    this.initializeGuide(param);
    this.updateGuideStatus(param);
}

Guide.prototype = {
    destroy(){
        this.clearMeshes();
        Guides.remove(this);
        this.motif.removeGuide(this);
        this.GuideID += "deleted";
    },
    initializeGuide(param){
        this.initializeGuideParameters(param);
        this.initializeGuideBehavior(param);
    },
    updateGuideStatus(param){
        this.updateGuideParameters(param);
        this.updateGuideBehavior(param);
    },
    initializeGuideParameters(param){
        Object.assign(this, {
            type: param.type,
            GuideID: param.GuideID || CreateID('Guide'),
            playerCount: param.playerCount,
            position: param.position || Vector3.Zero(),
            motif: Motifs.getMotifByMotifID(param.MotifID)|| Motifs.current,
            points: param.points || null,
            radius: param.radius || null,
            color: param.color || new Color3(0.87, 0.87, 0.87),
            material: param.material || defaultGuideMaterial,
            resolution: 128, //todo dynamic resolution adjustment
            snaps: [],
            snapPoints: [],
            snapColliders: [],
            parametricShape: null,
            containerShape: null,
            isActive: true
        })
    },
    initializeGuideBehavior(param){
        Guides.add(this);
        this.motif.addGuide(this);
        if(this.type === "closure"){this.points.push(this.points[0]);}
        else if(this.type === "circle") {
            let temporaryPoints = [];
            for (let i = 0; i < this.resolution; i++) {
                temporaryPoints[i] = new Vector3(this.radius * Math.cos(i * 2 * Math.PI / this.resolution), 0, this.radius * Math.sin(i * 2 * Math.PI / this.resolution))
            }
            temporaryPoints.push(temporaryPoints[0]);
            this.points = temporaryPoints;
        }
    },
    updateGuideParameters(param){
        const allowedParams = ["playerCount", "position", "color", "material", "isActive"];
        let newParam = {};
        allowedParams.forEach(entry=>{
            if(param.hasOwnProperty(entry)){newParam[entry] = param[entry];}
        });
        Object.assign(this, newParam)
    },
    updateGuideBehavior(param){
        //this.clearMeshes();
        this.generateParametricShape();
        this.generateContainer();
        this.updateSnaps();
        this.generateColliders();
        //todo investigate this structure reason why!
        this.parametricShape.setParent(this.containerShape);
        this.snaps.forEach(e=>{e.setParent(this.containerShape)});
        this.snapColliders.forEach(e=>{e.setParent(this.containerShape)});

        this.containerShape.position = this.position;
        this.containerShape.position.y = scene.getMeshByName("ground").getBoundingInfo().maximum.y;

        this.containerShape.id = "guide";
        this.snapColliders.forEach(e=>{e.id = "guide"});
        this.snaps.forEach(e=>{e.id = "guide"});
        this.parametricShape.id = "guide";

        this.addPointerDragBehavior();
        this.addSettingsBehavior();
        selectionModeObservable.notifyObservers(currentMode);
    },
    clearMeshes(){
        this.snapColliders.forEach(e=>e.dispose());
        this.snaps.forEach(e=>e.dispose());
        this.parametricShape.dispose();
        this.containerShape.dispose();
    },
    addPointerDragBehavior(){
        this.pointerDragBehavior = new PointerDragBehavior({dragPlaneNormal: new Vector3(0,1,0)});
        this.containerShape.addBehavior(pointerDragBehavior);
    },
    addSettingsBehavior(){
        let self = this;
        self.containerShape.actionManager = new ActionManager(scene);
        self.containerShape.actionManager.registerAction(
            new ExecuteCodeAction({
                trigger: ActionManager.OnLeftPickTrigger
            }, () => {
                selectedGuide = self;
                settingsObservable.notifyObservers({type: "guide", attachedMesh: self.containerShape})
            })
        );
    },
    isSelectable(status){
        this.status = status;
        if(this.status){
            this.containerShape.isPickable = true;
            this.snapColliders.forEach(e=>e.isPickable = true);
            this.snaps.forEach(e=>e.isPickable = true);
            this.parametricShape.isPickable = true;
        }
        else if(this.status === false){
            this.containerShape.isPickable = false;
            this.snapColliders.forEach(e=>e.isPickable = false);
            this.snaps.forEach(e=>e.isPickable = false);
            this.parametricShape.isPickable = false;
        }
    },
    show(){
        this.parametricShape.isVisible = true;
        this.snaps.forEach(function(snap){
            snap.isVisible = true;
        });
        this.isActive = true;
    },
    hide() {
        this.parametricShape.isVisible = false;
        this.snaps.forEach(function(snap){
            snap.isVisible = false;
        });
        this.isActive = false;
    },
    updateSnaps(){
        this.snapPoints = [];
        this.snaps = [];
        this.generateSnapPoints();
        this.generateSnaps();
    },
    getLength(pointArray){
        if(pointArray.length<2){
            return 0;
        }
        let length = 0;
        for(let i = 1; i<pointArray.length; i++){
            length += pointArray[i].subtract(pointArray[i-1]).length();
        }
        return length;
    },
    getPoint(length, pointA, pointB){
        let differenceVector = pointB.subtract(pointA);
        let ratio = length/differenceVector.length();
        if(ratio>1.001){
            return -1;
        }
        else if(ratio-1>0.001){
            return pointB
        }
        return pointA.add(differenceVector.scale(ratio));
    },
    generateSnapPoints() {
        let self = this;
        let divisionLength;
        if (self.type === "linear") {
            divisionLength = self.getLength(self.points) / (self.playerCount - 1);
        }
        else if (self.type === "closure" || self.type === "circle") {
            divisionLength = self.getLength(self.points) / self.playerCount;
        }
        // First point is always a snapPoint.
        self.snapPoints[0] = self.points[0];
        let j = 1;
        let totalLength = 0;
        let lastPoint = self.points[0];
        let tailLength = 0;
        for(let i = 1; i<self.points.length; i++){
            tailLength = totalLength;
            lastPoint = self.points[i-1];
            totalLength += self.getLength([lastPoint, self.points[i]]);
            while(totalLength >= divisionLength){
                self.snapPoints[j] = self.getPoint(divisionLength-tailLength, lastPoint, self.points[i]);
                totalLength -= divisionLength;
                tailLength = 0;
                lastPoint = self.snapPoints[j];
                j++;
            }
        }
        let extra = self.snapPoints.length - self.playerCount;
        if(extra > 0)self.snapPoints.splice(self.snapPoints.length-extra, extra);
    },
    generateParametricShape(){
        let shape = MeshBuilder.CreateLines("parametricShape", {
            points: this.points
        }, scene);
        shape.color = this.color;
        this.parametricShape = shape;
    },
    generateColliders: function(){
        this.snapPoints.forEach((e,i)=>{
            let shape = MeshBuilder.CreateBox("snapCollider", {
                size: 0.02,
                width: 0.36,
                depth: 0.36,
                updatable: false
            });
            //shape.isVisible = false;
            this.position = e;
            this.isVisible = 0;
            //self.snaps[i].position;
            this.snapColliders.push(shape);
        });

    },
    generateSnaps(){
        this.snapPoints.forEach(e=>{
            let shape = MeshBuilder.CreateCylinder("snap", {
                diameterTop: 0.2,
                diameterBottom: 0.2,
                height: 0.02,
                updatable: false
            }, scene);
            shape.material = this.material;
            shape.position = e;
            shape.isPickable = false;
            this.snaps.push(shape);
        });
    },
    generateContainer(){
        let self = this;
        let shape;
        let depth = 0.02;
        if(this.type==="closure" || this.type==="circle") {
            shape = MeshBuilder.ExtrudePolygon("container", {
                shape: self.points, depth: depth
            }, scene);
        }
        else if(this.type==="linear"){
            let curve = new Path3D(self.points, new Vector3(0,1,0));
            let binormals = curve.getBinormals();
            let points1 = [];
            let points2 = [];
            let size = 1;
            curve.getCurve().forEach(function(e,i){
                points1.push(e.clone().addInPlace(binormals[i].scale(size)));
                points2.push(e.clone().addInPlace(binormals[i].scale(-size)));
            });
            points2.reverse().concat(points1);
            shape = MeshBuilder.ExtrudePolygon("container",{
                shape: points2, depth: depth
            }, scene);
        }
        shape.visibility = 0;
        this.containerShape = shape;
    }
};