import * as BABYLON from 'babylonjs';

//this.mesh.name için bi bakmak lazım.
export default function CreateAnimatableMesh(MeshCreator){
	this.mesh = new MeshCreator;
	Object.defineProperty(this, "timeline_data", {
		value: {
			"name": this.mesh.name,
			"loc": [],
			"rot": [],
			"timeline": undefined,
			"animations": []
		}
		enumerable: true;
		configurable: true;
		writeable: true;
	})
};

CreateAnimatableMesh.prototype.addKey = function(aniObj){
	/*aniObj = {
		"T": time,
		"loc": loc,
		"rot": rot,
		"animateLoc": true,
		"animateRot": false
		"characterAnimation": {
			"type": "walkLikeMan",
			"repeat": stepCount,
			"timeline": 
		}
		"slider": slider,
		"sensitivity": sensitivity
	}*/

	let isDuplicate = false;

	if(aniObj.animateLoc){
		
		//pos objects property, loc recorded property
		let pos = aniObj.loc;
	    let loc = thisinstance?.timeline_data.loc;

	    loc.forEach(
	    	function(entry){
	    		if(Math.abs(entry.T - slider.value) <= sensitivity){
	            loc[loc.indexOf(entry)] = {"T": aniObj.T, "position": pos};
	            isDuplicate = true;
	            console.log("Notification: A keyframe duplicate was found, replacing old keyframe entry!")}});

	    if(!isDuplicate){
	        loc.push({"T": aniObj.T, "position": pos})}
	    updateTL(thisinstance?.timeline_data.timeline, "loc")}
	
	if(aniObj.animateRot){
		isDuplicate = false;

		//turn objects property, rot recorded property
		let turn = aniObj.rot;
	    let rot = thisinstance?.timeline_data.rot;

	    rot.forEach(
	    	function(entry){
	    		if(Math.abs(entry.T - slider.value) <= sensitivity){
	            rot[rot.indexOf(entry)] = {"T": aniObj.T, "rotation": rot};
	            isDuplicate = true;
	        	console.log("Notification: A keyframe duplicate was found, replacing old keyframe entry!")}});

	    if(!isDuplicate){rot.push({"T": aniObj.T, "rotation": rot})}
	    updateTL(thisinstance?.timeline_data.timeline, "rot")}
}

export default function CreateNonAnimatableMesh(MeshCreator){
	let result = new MeshCreator;
	result.isPickable = false;
	return result;
};

