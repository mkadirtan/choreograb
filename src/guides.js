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
import {Motifs} from './motifs';
import {currentMode, selectionModeObservable} from './GUI2';
import {settingsObservable} from "./utility";
import {CreateID} from "./history";
/**
 * LOCAL IMPORTS
 */

export let Guides = {
    guides: [],
    registerElements(){
        let elements = [];
        this.guides.forEach(guide=>{
            elements.push({
                type: guide.type,
                GuideID: guide.GuideID,
                playerCount: guide.playerCount,
                position: guide.position,
                MotifID: guide.motif.MotifID,
                points: guide.points,
                radius: guide.radius,
                color: guide.color,
                material: guide.material,
                isActive: guide.isActive
            });
        });
        return elements;
    },
};

export let selectedGuide = null;

let guideMaterial = new StandardMaterial("guideMaterial", scene);
guideMaterial.diffuseColor = new Color3.Yellow();

export function Guide(param){
    this.initParameters(param);
    this.initShapes();
    this.initBehaviors();
}

Guide.prototype = {
    initParameters: function(param){
        this.type = param.type;
        this.GuideID = param.GuideID || CreateID('Guide');
        Guides.guides.push(this);
        this.playerCount = param.playerCount || 2;
        this.position = param.position || Vector3.Zero();
        this.motif = param.motif || Motifs.current;
        this.motif.addGuide(this);
        this.points = param.points || null;
        this.radius = param.radius || null;
        this.color = param.color || new Color3(0.87,0.87,0.87);
        this.material = param.material || guideMaterial;
        this.resolution = 128; //todo dynamic resolution adjustment
        this.snaps = [];
        this.snapPoints = [];
        this.snapColliders = [];
        this.parametricShape = null;
        this.containerShape = null;
        this.isActive = param.isActive || true;
        if(this.type === "closure"){
            this.points.push(this.points[0]);
        }
        else if(this.type === "circle") {
            let temporaryPoints = [];
            for (let i = 0; i < this.resolution; i++) {
                temporaryPoints[i] = new Vector3(this.radius * Math.cos(i * 2 * Math.PI / this.resolution), 0, this.radius * Math.sin(i * 2 * Math.PI / this.resolution))
            }
            temporaryPoints.push(temporaryPoints[0]);
            this.points = temporaryPoints;
        }
    },
    initShapes: function(){
        this.generateParametricShape();
        this.generateContainer();
        this.updateSnaps();
        this.generateColliders();

        this.parametricShape.setParent(this.containerShape);
        this.snaps.forEach(e=>{e.setParent(this.containerShape)});
        this.snapColliders.forEach(e=>{e.setParent(this.containerShape)});

        this.containerShape.position = this.position;
        this.containerShape.position.y = scene.getMeshByName("ground").getBoundingInfo().maximum.y;

        this.containerShape.id = "guide";
        this.snapColliders.forEach(e=>{e.id = "guide"});
        this.snaps.forEach(e=>{e.id = "guide"});
        this.parametricShape.id = "guide";
    },
    initBehaviors: function(){
        let self = this;
        let pointerDragBehavior = new PointerDragBehavior({dragPlaneNormal: new Vector3(0,1,0)});
        this.containerShape.addBehavior(pointerDragBehavior);
        self.containerShape.actionManager = new ActionManager(scene);
        self.containerShape.actionManager.registerAction(
            new ExecuteCodeAction({
                    trigger: ActionManager.OnLeftPickTrigger
                }, () => {
                    selectedGuide = self;
                    settingsObservable.notifyObservers({type: "guide", attachedMesh: self.containerShape});
                },
            )
        );
        selectionModeObservable.add(mode=>{
            if(mode === "guides" && self.isActive){
                self.containerShape.isPickable = true;
                self.snapColliders.forEach(e=>e.isPickable=true);
                self.snaps.forEach(e=>e.isPickable=true);
                self.parametricShape.isPickable = true;
            }
            else if(mode === "players"){
                self.containerShape.isPickable = false;
                self.snapColliders.forEach(e=>e.isPickable=false);
                self.snaps.forEach(e=>e.isPickable = false);
                self.parametricShape.isPickable = false;
            }
        });
        selectionModeObservable.notifyObservers(currentMode);
    },
    show: function(){
        this.parametricShape.isVisible = true;
        this.snaps.forEach(function(snap){
            snap.isVisible = true;
        });
        this.isActive = true;
    },
    hide: function() {
        this.parametricShape.isVisible = false;
        this.snaps.forEach(function(snap){
            snap.isVisible = false;
        });
        this.isActive = false;
    },
    updateSnaps: function(){
        this.snapPoints = [];
        this.snaps = [];
        this.generateSnapPoints();
        this.generateSnaps();
    },
    getLength: function(pointArray){
        if(pointArray.length<2){
            return 0;
        }
        let length = 0;
        for(let i = 1; i<pointArray.length; i++){
            length += pointArray[i].subtract(pointArray[i-1]).length();
        }
        return length;
    },
    getPoint: function(length, pointA, pointB){
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
    generateSnapPoints: function() {
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
    generateParametricShape: function(){
        let self = this;
        let shape = MeshBuilder.CreateLines("parametricShape", {
            points: this.points
        }, scene);
        shape.color = this.color;
        this.parametricShape = shape;
    },
    generateColliders: function(){
        let self = this;
        this.snapPoints.forEach((e,i)=>{
            let shape = MeshBuilder.CreateBox("snapCollider", {
                size: 0.02,
                width: 0.36,
                depth: 0.36,
                updatable: false
            });
            //shape.isVisible = false;
            shape.position = e;
            shape.isVisible = 0;
            //self.snaps[i].position;
            self.snapColliders.push(shape);
        });

    },
    generateSnaps: function(){
        let self = this;
        this.snapPoints.forEach(e=>{
            let shape = MeshBuilder.CreateCylinder("snap", {
                diameterTop: 0.2,
                diameterBottom: 0.2,
                height: 0.02,
                updatable: false
            }, scene);
            shape.material = self.material;
            shape.position = e;
            shape.isPickable = false;
            self.snaps.push(shape);
        });
    },
    generateContainer: function(){
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