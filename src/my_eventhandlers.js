//Need access to these variables.

let {
  axisLocked,
  pickingPlane,
  parentMesh,
  selectedMeshes,
  scene,
  restrictedArea,
  currentMode //pointerModes.Translate || pointerModes.Select etc.
};
/**
 * Define updating methods to update properties such as:
 * renderOutline, If list goes long do it!
 */

let pointerModes = {
  Translate: {
    BABYLON.PointerEventTypes.POINTERDOWN: function(){
        let rayCast = scene.pick(scene.pointerX, scene.pointerY);
        if(rayCast.pickedMesh){
          pickingPlane.position = rayCast.pickedPoint;
          parentMesh.position = rayCast.pickedPoint;
          selectedMeshes.forEach(function(mesh){
              mesh.setParent(parentMesh);
          });

          if(axisLocked){
              pickingPlane.rotation = new BABYLON.Vector3(Math.PI/2,0,0);
          }
          else{
              pickingPlane.lookAt(scene.activeCamera.position);
          }
          pickingPlane.isPickable = true;
          scene.activeCamera.detachControl(canvas);
        }
    },
    BABYLON.PointerEventTypes.POINTERMOVE: function(){
      let pickPlanePos = scene.pick(scene.pointerX, scene.pointerY, function(mesh){
          return mesh.id === "pickingPlane";
      });
      if(pickPlanePos.pickedMesh){
        let {x, z} = {
          pickPlanePos.pickedPoint.x,
          pickPlanePos.pickedPoint.z
        }
        restrictedArea.restrict(x,y)
        if(axisLocked){
          parentMesh.position.x = pickPlanePos.pickedPoint.x; //reduce this code
          parentMesh.position.z = pickPlanePos.pickedPoint.z;
          pickingPlane.position.x = pickPlanePos.pickedPoint.x;
          pickingPlane.position.z = pickPlanePos.pickedPoint.z;
        }
        else{
          parentMesh.position = pickPlanePos.pickedPoint;
          pickingPlane.position = pickPlanePos.pickedPoint;
        }
          pickPlanePos = null;
      }
    },
    BABYLON.PointerEventTypes.POINTERUP: function(){
      pickingPlane.isPickable = false;
      selectedMeshes.forEach(function(mesh){
          mesh.setParent(null);
      });
      scene.activeCamera.attachControl(canvas, true);
    }
  },
  Rotate: {

  },
  Select: {
    BABYLON.PointerEventTypes.POINTERTAP: function(pointerInfo){
      let rayCast = scene.pick(scene.pointerX, scene.pointerY);
      if(rayCast.pickedMesh){
        let meshIndex = selectedMeshes.indexOf(lastSelectedMesh);
        lastSelectedMesh = rayCast.pickedMesh;
        if(pointerInfo.event.shiftKey) {
            lastSelectedMesh.renderOutline = true;
            (meshIndex===-1)?(selectedMeshes.push(lastSelectedMesh));
          }
        else if(pointerInfo.event.altKey && meshIndex !== -1) {
          selectedMeshes.splice(meshIndex,1);
          lastSelectedMesh.renderOutline = false;
          lastSelectedMesh = null;
        }
        else{
          selectedMeshes.forEach(function(mesh){
            if(mesh!==lastSelectedMesh){
              mesh.renderOutline = false;
            }
          });
          selectedMeshes = [lastSelectedMesh];
        };
      }
      else{
        if(!pointerInfo.event.shiftKey && !pointerInfo.event.altKey){
          selectedMeshes.forEach(function(mesh){
            mesh.renderOutline = false;
          });
          selectedMeshes = [];
          lastSelectedMesh = null;
        }
      }
    }
  }
};

scene.onPointerObservable.add((pointerInfo) => {
  currentMode[pointerInfo.type] //Initial mode is select
});

window.addEventListener("resize", function(){
  engine.resize();
});

window.addEventListener("onblur", function(){
  if(!tl.paused()){
    tl.pause();
    lost.pause();
    window.onfocus = function(){
      tl.play();
      lost.play();
      window.onfocus = null;
    };
  }
});
