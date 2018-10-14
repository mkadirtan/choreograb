import * as BABYLON from 'babylonjs';
import {TweenLite, TimelineMax} from 'gsap/TweenMax';


//Adjust size declarations to variables in the next version.
function initMeshes(scene){
	let ground = {
		mesh: CreateNonAnimatableMesh(BABYLON.MeshBuilder.CreateGround("ground", {width: 20, height: 20}, scene)),
		restrict: function(x,y){
			x>this._xmax?x=this._xmax:x<this._xmin?x=this._xmin:null;
			z>this._ymax?z=this._zmax:z<this._ymin?z=this._zmin:null;
			return {x, z}
		},
		updateCoordinates: function(){
			this._xmin = ground.getBoundingInfo().minimum.x;
			this._xmax = ground.getBoundingInfo().maximum.x;
			this._zmin = ground.getBoundingInfo().minimum.z;
			this._zmax = ground.getBoundingInfo().maximum.z;
		}
		//_xmin: 10, _xmax: 10, _zmin: 10, _zmax: 10 //Check if this line is deletable!
	};
	ground.updateCoordinates();
	let parentMesh = CreateNonAnimatableMesh(BABYLON.MeshBuilder.CreateBox("parentMesh", {size: 1}, scene), {visible: false});
	let pickingPlane = CreateNonAnimatableMesh(BABYLON.MeshBuilder.CreatePlane("pickingPlane", {size: 120}, scene), {visibility: 0});
	return {ground, parentMesh, pickingPlane};
}

//Define modelUrl!

let characterLoadFunction = function(modelUrl){
    BABYLON.SceneLoader.ImportMeshAsync("", path.dirname(modelUrl), path.basename(modelUrl)).then(function(result){
        let loadedMesh = result.meshes[0];
        loadedMesh.name = "character";
        loadedMesh.position = {x: 0, y: -character.getBoundingInfo().minimum.y, z: 0};
        return character;
    })
};

function CreateAnimatableMesh(MeshCreator, isImport){
	if(isImport === undefined){isImport = false}
	isImport?(this.mesh = MeshCreator):(this.mesh = new MeshCreator);
	Object.defineProperty(this, "data", {
		value: {
			"name": this.mesh.name,
			"pos": [],
			"rot": [],
			//"anim": [],
			//"ranges": this.mesh.skeleton.getAnimationRanges(),
			//"currentFrame": 0,
			"animationGroup": new BABYLON.AnimationGroup(this.mesh.name),
			"timeline": new TimelineMax()
		},
		enumerable: true,
		configurable: true,
		writeable: true
	});
	Choreograb.Timeline.registerTimeline(this);
	scene.add(this.mesh);
	//Add all the animations to animationGroup.
	//Animation differentiations are based on ranges
	//Ex: walk animation is in range of frames 0-9

	/*for(let bone of this.mesh.skeleton.bones){
		let anims = bone.animations;
		for(let anim of anims){
			this.data.animationGroup.addTargetedAnimation(anim, bone)
		}
	};*/
}

CreateAnimatableMesh.prototype = {
	addKey: function(aniObj){

		//animateSth is a boolean to whether or not add key frame for Sth.

		if(aniObj.animatePos){
			pushKeys(aniObj.positionPush, this.data.position, "pos")
		}

		if(aniObj.animateRot){
			pushKeys(aniObj.rotationPush, this.data.rotation, "rot");
		}

		//Interchangable function to add new keyframes to "current".
		//push is an object with T and the values to be added.
		//type decides which data of timeline is to be updated.

		function pushKeys(push, current, type){
			let isDuplicate = false;
			current.forEach(
				function(entry, index, array){
					if(Math.abs(entry.T - aniObj.T) <= aniObj.keyframeSensitivity){
						array[index] = push;
						isDuplicate = true;
						console.log("Notification: A keyframe duplicate was found, replacing old keyframe entry!")
					}
				}
			);

			if(!isDuplicate){
				current.push(push)
			}
			updateTimeline(type);
		}
		return this;
	},
	//Updates the timeline of selected data type.
	updateTimeline: function(type){
		//current -> keyframe data of the object
		//property -> property to be updated in the timeline
		//killObject -> data structure to be erased
		let data = this.data;
		let current;
		let property;
		let killObject;

		switch(type){
			case "pos":
			current = this.data.pos;
			property = this.mesh.position;
			killObject = {x: true, y:true, z: true};
			break;
			case "rot":
			current = this.data.rot;
			property = this.mesh.rotation;
			killObject = {x: true, y: true, z: true};
			break;
		}

		//Sort current keys

		if(current.length > 1){
			current.sort(function(a,b){
				return a.T- b.T;
			});
		}

		//Erase previous timeline data

		data.timeline.kill(killObject, property);

		//Add new keys

		current.forEach(function(entry, index, array){
			//Starting from index=1
			if(index !== 0){
				//Duration of every tween is the time difference between subsequent keys.
				let deltaTime = entry.T-array[index-1].T;
				//entry = array[index], therefore index-1 obtains element just before;
				timeline.fromTo(property, deltaTime, array[index-1].value, entry.value, array[index-1].T);
			}
		});

    	data.timeline.seek(data.timeline.totalDuration()/2).seek(slider.value);
			return this;
	},
	getAniObj: function(animationSettings){
		return {
			"T": slider.T,
			"positionPush": {"T": slider.T, "value": this.mesh.position},
			"rotationPush": {"T": slider.T, "value": this.mesh.rotation},
			"animatePosition": animationSettings.animatePosition,
			"animateRotation": animationSettings.animateRotation,
			"keyframeSensitivity": animationSettings.keyframeSensitivity
		};
	}
};

function CreateNonAnimatableMesh(MeshCreator, vars){
	let result = new MeshCreator;
	result.isPickable = vars.isPickable || false;
	result.visible = vars.visible || true;
	result.visibility = vars.visibility || 1;
	return result;
};

export let Mesh = {
	initMeshes,
	characterLoadFunction,
	CreateAnimatableMesh,
	CreateNonAnimatableMesh
}


