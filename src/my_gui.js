import * as GUI from 'babylon-gui';


//Width, height etc pointing to an object in the prototype,
//Therefore hoping to change all buttons properties at the
//same time and change it 'dynamically'
let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");
let defaults = {
	width: "120px",
	height: "50px",
	color: "white",
	background: "green"
};

function createStacks(){
	let leftPanel = new BABYLON.GUI.StackPanel("leftPanel");
	leftPanel.width = "140px";
	leftPanel.height = 0.75
	leftPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	leftPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
	leftPanel.isVertical = true;

	let rightPanel = new BABYLON.GUI.StackPanel("rightPanel");
	rightPanel.width = "140px";
	rightPanel.height = 0.75
	rightPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	rightPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
	rightPanel.isVertical = true;

	let slider = new BABYLON.GUI.Slider("slider");
	slider.minimum = 0;
	slider.maximum = 100;
	slider.value = 0;
	slider.height = 0.25;
	slider.width = 1;
	slider.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
	/*
	slider.onPointerDownObservable.add(function () {
			slider.onValueChangedObservable.add(function(){
					header.text = slider.value.toFixed(2) + " saniyedesiniz";
					if(slider.value <= tl.totalDuration()){
							tl.seek(slider.value, false);
					}
			});
	});
	slider.onPointerUpObservable.add(function(){
			slider.onValueChangedObservable.clear();
	});
	*/
	/*
	Play.onPointerUpObservable.add(function(){
					tl.paused()?(tl.play(), lost.play()):(tl.pause(), lost.pause());
			}
	);
	*/
	/*
	Stop.onPointerUpObservable.add(function(){
					tl.pause(); lost.pause();
					tl.seek(0); lost.seek(0);
			}
	);
	*/

	advancedTexture.addControl(leftPanel);
	advancedTexture.addControl(rightPanel);
	advancedTexture.addControl(slider);

}

function CreateButton(defaults){
	if(!defaults.stack){
		console.log("Error: CreateButton needs a stack to append the button to!");
		return;
	}
	let result = new BABYLON.GUI.Button.CreateSimpleButton(defaults.name);
	result.width = defaults.width;
	result.height = defaults.height;
	result.color = defaults.color;
	result.background = defaults.background;
	if(defaults.func){
		result.onPointerUpObservable.add(defaults.func);
	}
	defaults.stack.addControl(result);
	return result;
};
