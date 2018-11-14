/**
 * Every guide has properties for name, type etc. as below.
 * points: are used in creation of parametricShape and containerShape.
 * radius: is used for "circle" type only.
 * type: is used in creation of parametricShape, containerShape and snapPoints.
 * playerCount: is used for creation of snap Points.
 * snapPoints: are cyclinders, on which players are snapped by user.
 * parametricShape: is visible to user and is a BABYLON.LinesMesh
 * containerShape: is not visible to user and used for dragging operations.
 * color: is the color of parametricShape.
 * motif: is the motif to which guide is binded.
 */

import * as BABYLON from 'babylonjs';

export function CreateGuide(param){
    this.name = param.name;
    this._type = param.type;
    this._creationPoints = param.points || null;
    this._points = null;
    this._snaps = [];
    this._motif = param.motif;
    this._resolution = param.resolution || 128;
    this._playerCount = param.playerCount || 2;
    this._radius = param.radius || null;
    this._initialPosition = param.position || new BABYLON.Vector3(0,0,0);
    this._parametricShape = null;
    this._containerShape = null;
    this._snapPoints = [];
    this._snapShapeFunction = param.snapShapeFunction;
    this._scene = param.scene;
    this._color = param.color || new BABYLON.Color3(0.87,0.87,0.87);
    this._material = null || param.material;
    if(this._type == "closure"){
        this._creationPoints.push(this._creationPoints[0]);
    }
    else if(this._type== "circle"){
        let temporaryPoints = [];
        for (let i = 0; i < this._resolution; i++) {
            temporaryPoints[i] = new BABYLON.Vector3(this._radius * Math.cos(i * 2 * Math.PI / this._resolution), 0, this._radius * Math.sin(i * 2 * Math.PI / this._resolution))
        }
        this._creationPoints = temporaryPoints;
    }
    else if(this._type !== "linear") {
        console.log("Undefined guide type!")
    }
}

/**
 * Guide prototype contains complex 3D calculations for generating;
 * containerShape, snapPoints.
 * These calculations are explained above their respective methods.
 * show:
 *  Reveals parametricShape, containerShape and all snaps.
 * hide:
 *  Hides parametricShape, containerShape and all snaps.
 * generateParametricShape:
 *  Generates a LinesMesh using guide points.
 *  Note that it doesn't take type into account!
 * addPlayer:
 *  Increases playerCount.
 * removePlayer:
 *  Decreases playerCount.
 * getGuideLength:
 *  returns length of points array passed.
 *  If no points are passed, returns length of the guide.
 * getPointWithRequiredLength:
 *  Returns the point in between point A and point B,
 *  where length is the distance from point A to returned point.
 * Setters & Getters are defined at the bottom.
 */

/**
 * Update methods need to be put.
 * Don't allow playerCount below 2.
 */

CreateGuide.prototype = {
    init: function(){
        this.generateParametricShape();
        let temporaryPoints = [];
        let vertexArray = this.parametricShape().getVerticesData(BABYLON.VertexBuffer.PositionKind);
        for(let i = 0; i<this._creationPoints.length; i++){
            temporaryPoints.push(new BABYLON.Vector3.FromArray(vertexArray,i*3));
        }
        console.log(temporaryPoints);
        this.points(temporaryPoints);
        this.generateContainer();
        this.updateSnaps();
        this.motif().update();
    },
    show: function(){
        this.parametricShape().isVisible = true;
        this.containerShape().isVisible = true;
        this.snaps().forEach(function(snap){
            snap.isVisible = true;
        })
    },
    hide: function() {
        this.parametricShape().isVisible = false;
        this.containerShape().isVisible = false;
        this.snaps().forEach(function(snap){
            snap.isVisible = false;
        })
    },
    generateParametricShape: function(){
        let self = this;
        let shape = BABYLON.MeshBuilder.CreateLines(this.name, {
            points: this._creationPoints
        }, self.scene());
        shape.color = this.color();
        //shape.alignWithNormal(new BABYLON.Vector3(0,1,0), new BABYLON.Vector3(0,-1,0));
        shape._edgesRenderer = new BABYLON.LineEdgesRenderer(shape);
        shape.edgesWidth = -3;
        shape.edgesColor = new BABYLON.Color4.FromColor3(shape.color);
        shape.position = this._initialPosition;
        this.parametricShape(shape);
    },
    addPlayer: function(){
        this._playerCount++;
    },
    removePlayer: function(){
        this._playerCount--;
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
        if(ratio>1){
            return -1;
        }
        else if(ratio===1){
            return pointB
        }
        return pointA.add(differenceVector.scale(ratio));
    },
    /**
     * Divides the path into equally spaced points on the path.
     * Every point is then pushed to snapPoints array.
     * Special cases arouse when type is "closure" or "circle"
     */
    generateSnapPoints: function() {
        let self = this;
        let divisionLength;
        if (self.type() == "linear") {
            divisionLength = self.getLength(self.points()) / (self.playerCount() - 1);
        }
        else if (self.type() == "closure" || self.type() == "circle") {
            divisionLength = self.getLength(self.points()) / self.playerCount();
        }
        // First point is always a snapPoint.
        self.snapPoints()[0] = self.points()[0];
        let j = 1;
        let totalLength = 0;
        let lastPoint = self.points()[0];
        let tailLength = 0;
        for(let i = 1; i<self.points().length; i++){
            tailLength = totalLength;
            lastPoint = self.points()[i-1];
            totalLength += self.getLength([lastPoint, self.points()[i]]);
            while(totalLength >= divisionLength){
                self.snapPoints()[j] = self.getPoint(divisionLength-tailLength, lastPoint, self.points()[i]);
                totalLength -= divisionLength;
                tailLength = 0;
                lastPoint = self.snapPoints()[j];
                j++;
            }
        }
        let extra = self.snapPoints().length - self.playerCount();
        self.snapPoints().splice(self.snapPoints().length-extra, extra);
    },
    /**
     * For every snapPoint, a cyclinderical snap is pushed to snaps array.
     */
    generateSnaps: function(){
        let self = this;
        this.snapPoints().forEach(function(e,i){
            let snapName = self.name + "Snap" + i;
            let shape = self.snapShapeFunction().apply(null,[snapName, {
                diameterTop: 0.13,
                diameterBottom: 0.13,
                height: 0.02
            }, self.scene()]);
            shape.material = self.material();
            shape.position = self.snapPoints()[i];
            self.snaps().push(shape);
        })
    },
    /**
     * snapPoints and snaps array are cleared out first,
     * then generation procedures are applied.
     */
    updateSnaps: function(){
        this.snapPoints([]);
        this.snaps([]);
        this.generateSnapPoints();
        this.generateSnaps();
    },
    /**
     * For types "closure" and "circle" a polygon covering the shape is produced.
     * For "linear" type, guide points are offseted in their binormal vectors to
     * obtain a polygon with thickness "size". Variable size needs to be adjusted
     * to experience and also it is possible to come across problems when the
     * parametricShape contains 'sharp' edges. Because offsetting process doesn't
     * clamp the vertices.
     */

    generateContainer: function(){
        let self = this;
        let name = self.name + "Container";
        let shape;
        if(this.type()=="closure" || this.type()=="circle") {
            shape = BABYLON.MeshBuilder.CreatePolygon(name, {
                shape: self.points()
            }, self.scene());
        }
        else if(this.type()=="linear"){
            let curve = new BABYLON.Path3D(self.points(), new BABYLON.Vector3(0,1,0));
            let binormals = curve.getBinormals();
            let points1 = [];
            let points2 = [];
            let size = 1;
            curve.getCurve().forEach(function(e,i){
                points1.push(e.clone().addInPlace(binormals[i].scale(size)));
                points2.push(e.clone().addInPlace(binormals[i].scale(-size)));
            });
            points2.reverse().concat(points1);
            shape = BABYLON.MeshBuilder.CreatePolygon(name,{
                shape: points2
            }, self.scene());
        }
        shape.visibility = 0;
        self.containerShape(shape);
    },
   /**
    * Setters & Getters are available for:
    *  parametricShape, containerShape, snaps, snapPoints,
    *  points, playerCount, type, motif, resolution, radius
    */
    parametricShape: function(parametricShape){
        if(!parametricShape){
            return this._parametricShape;
        }
        else{
            this._parametricShape = parametricShape;
        }
    },
    containerShape: function(containerShape){
        if(!containerShape){
            return this._containerShape;
        }
        else{
            this._containerShape = containerShape;
        }
    },
    material: function(material){
        if(!material){
            return this._material;
        }
        else{
            this._material = material;
        }
    },
    snapShapeFunction: function(snapShapeFunction){
        if(!snapShapeFunction){
            return this._snapShapeFunction;
        }
        else{
            this._snapShapeFunction = snapShapeFunction;
        }
    },
    snaps: function(snaps){
        if(!snaps){
            return this._snaps;
        }
        else{
            this._snaps = snaps;
        }
    },
    snapPoints: function(snapPoints){
        if(!snapPoints){
            return this._snapPoints;
        }
        else{
            this._snapPoints = snapPoints;
        }
    },
    points: function(points){
        if(!points){
            return this._points;
        }
        else{
            this._points = points;
        }
    },
    playerCount: function(playerCount){
        if(!playerCount){
            return this._playerCount;
        }
        else{
            this._playerCount = playerCount;
        }
    },
    type: function(type){
        if(!type){
            return this._type;
        }
        else{
            this._type = type;
        }
    },
    motif: function(motif){
        if(!motif){
            return this._motif;
        }
        else{
            this._motif = motif;
        }
    },
    resolution: function(resolution){
        if(!resolution){
            return this._resolution;
        }
        else{
            this._resolution = resolution;
        }
    },
    radius: function(radius){
        if(!radius){
            return this._radius;
        }
        else{
            this._radius = radius;
        }
    },
    color: function(color){
        if(!color){
            return this._color;
        }
        else{
            this._color = color;
        }
    },
    scene: function(scene){
        if(!scene){
            return this._scene;
        }
        else{
            this._scene = scene;
        }
    }
};