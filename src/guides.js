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

export function CreateGuide(param){
    this.self = this;
    this.name = param.name;
    this._type = param.type;
    this._points = param.points || null;
    this._snaps = [];
    this._motif = param.motif;
    param.motif.addGuide(this);
    this._resolution = param.resolution || 32;
    this._playerCount = param.playerCount || 2;
    this._radius = param.radius || null;
    this._parametricShape = null;
    this._containerShape = null;
    this._snapPoints = [];
    let temporaryPoints = [];
    switch(param._type){
        case "linear":
            this._parametricShape = BABYLON.MeshBuilder.CreateLines(this.name, {points: this.points, updatable: true}, scene);
            break;
        case "closure":
            temporaryPoints = this.points.push(this.points[0]);
            this._parametricShape = BABYLON.MeshBuilder.CreateLines(this.name, {points: temporaryPoints, updatable: true}, scene);
            temporaryPoints = [];
            break;
        case "circle":
            for(let i = 0; i<this._resolution; i++){
                temporaryPoints[i] = new BABYLON.Vector3(this._radius*Math.cos(i*2*Math.PI/this._resolution),0,this._radius*Math.sin(i*2*Math.PI/this._resolution));
            }
            this._parametricShape = BABYLON.MeshBuilder.CreateLines(this.name, {points: temporaryPoints, updatable: true}, scene);
            temporaryPoints = [];
            break;
    }
    this._parametricShape.color = param.color || new BABYLON.Color3(1,0,0);
    this.hide();
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
    show: function(){
        self._parametricShape.isVisible = true;
        self._containerShape.isVisible = true;
        self._snaps.forEach(function(snap){
            snap.isVisible = true;
        })
    },
    hide: function() {
        self._parametricShape.isVisible = false;
        self._containerShape.isVisible = false;
        self._snaps.forEach(function(snap){
            snap.isVisible = false;
        })
    },
    generateParametricShape(){
        self.parametricShape(BABYLON.MeshBuilder.CreateLines(self.name, {
            points: self.points()
        }, scene));
    },
    addPlayer(){
        self._playerCount++;
    },
    removePlayer(){
        self._playerCount--;
    },
    getGuideLength(points){
        if(!points){
            points = self.points();
        }
        let length = 0;
        for(let i = 1; i<points.length; i++){
            length += points[i].subtract(points[i-1]).length();
        }
        return length;
    },
    getPointWithRequiredLength(length, pointA, pointB){
        let differenceVector = pointB.subtract(pointA);
        let ratio = length/differenceVector.length();
        if(ratio>1){
            return -1;
        }
        else if(ratio===1){
            return pointB
        }
        return pointB.add(differenceVector.scale(ratio));
    },
    /**
     * Divides the path into equally spaced points on the path.
     * Every point is then pushed to snapPoints array.
     * Special cases arouse when type is "closure" or "circle"
     */
    generateSnapPoints(){
        let divisionLength;
        let isLastPointOccupied = false;
        switch(self.type()) {
            case "linear":
                divisionLength = self.getGuideLength(self.points()) / (self.playerCount() - 1);
                isLastPointOccupied = true;
                break;
            case "closure" || "circle":
                divisionLength = self.getGuideLength(self.points()) / self.playerCount();
                break;
        }
        // First point is always a snapPoint.
        self.snapPoints()[0] = self.points()[0];
        let length = 0;
        let i = 1;
        let isLastMan = false;
        for(let j = 1; j<self.points().length+1; j++){
            length += self.getGuideLength([self.points()[j], self.points()[j-1]]);
            let dif = length - divisionLength;
            if(dif===0){
                self.snapPoints()[i] = self.points()[j];
                length = 0;
                i++;
                if(i === self.playerCount()-1) isLastMan = true;
                if(isLastMan) break;
            }
            else if(dif>0){
                self.snapPoints()[i] = self.getPointWithRequiredLength(dif, self.points()[j-1], self.points()[j]);
                i++;
                if(i === self.playerCount()-1) isLastMan = true;
                if(isLastMan) break;
                let remainder = self.getGuideLength([self.snapPoints()[i], self.points()[j]]);
                length = remainder;
                while(remainder>divisionLength){
                    self.snapPoints()[i] = self.getPointWithRequiredLength(divisionLength, self.snapPoints()[i-1], self.points()[j]);
                    i++;
                    if(i === self.playerCount()-1) isLastMan = true;
                    if(isLastMan) break;
                    remainder -= divisionLength;
                    length = remainder;
                }
                if(isLastMan) break;
            }
            if(isLastMan) break;
        }
        // Last point is a snap point if type is "linear"
        if(isLastMan && isLastPointOccupied) self.snapPoints().push(self.points()[self.points().length-1]);
    },
    /**
     * For every snapPoint, a cyclinderical snap is pushed to snaps array.
     */
    generateSnaps(){
        self.snapPoints().forEach(function(e,i){
            let snapName = self.name + "Snap" + i;
            self.snaps().push(BABYLON.MeshBuilder.CreateCyclinder(snapName, {
                diameterTop: 0.2,
                diameterBottom: 0.2,
                height: 0.2
            }, scene));
        })
    },
    /**
     * snapPoints and snaps array are cleared out first,
     * then generation procedures are applied.
     */
    updateSnaps(){
        self.snapPoints([]);
        self.snaps([]);
        self.generateSnapPoints();
        self.generateSnaps();
    },
    /**
     * For types "closure" and "circle" a polygon covering the shape is produced.
     * For "linear" type, guide points are offseted in their binormal vectors to
     * obtain a polygon with thickness "size". Variable size needs to be adjusted
     * to experience and also it is possible to come across problems when the
     * parametricShape contains 'sharp' edges. Because offsetting process doesn't
     * clamp the vertices.
     */
    generateContainer(){
        switch(self.type()){
            case "closure" || "circle":
                self.container(BABYLON.MeshBuilder.CreatePolygon(self.name + "container",{
                    shape: self.points()
                }, scene));
                break;
            case "linear":
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
                self.container(BABYLON.MeshBuilder.CreatePolygon(self.name + "container",{
                    shape: points2
                }, scene));
        }
    },
   /**
    * Setters & Getters are available for:
    *  parametricShape, containerShape, snaps, snapPoints,
    *  points, playerCount, type, motif, resolution, radius
    */
    get parametricShape(){return self._parametricShape;},
    set parametricShape(parametricShape){self._parametricShape = parametricShape;},
    get containerShape(){return self._containerShape;},
    set containerShape(containerShape){self._containerShape = containerShape;},
    get snaps(){return self._snaps;},
    set snaps(snaps){self._snapPoints = snaps;},
    get snapPoints(){return self._snapPoints;},
    set snapPoints(snapPoints){self._snapPoints = snapPoints;},
    get points(){return self._points;},
    set points(points){self._points = points;},
    get playerCount(){return self._playerCount;},
    set playerCount(count){self._playerCount = count;},
    get type(){return self._type;},
    set type(type){self._type = type;},
    set motif(motif){self._motif = motif;},
    get motif(){return self._motif;},
    get resolution(){return self._resolution;},
    set resolution(resolution){self._resolution = resolution;},
    set radius(radius){self._radius = radius;},
    get radius(){return self._radius;}
};