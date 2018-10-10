import * as GUI from 'babylon-gui';

//Width, height etc pointing to an object in the prototype,
//Therefore hoping to change all buttons properties at the
//same time and change it 'dynamically'

function initGUI(scene){
	let advancedTexture = new BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", scene);

	let leftPanel = new BABYLON.GUI.StackPanel("leftPanel");
	leftPanel.width = "140px";
	leftPanel.height = 0.75
	leftPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	leftPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	leftPanel.isVertical = true;

	let rightPanel = new BABYLON.GUI.StackPanel("rightPanel");
	rightPanel.width = "140px";
	rightPanel.height = 0.75
	rightPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	rightPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	rightPanel.isVertical = true;

	let slider = new BABYLON.GUI.Slider("slider");
	slider.minimum = 0;
	slider.maximum = 100;
	slider.value = 0;
	slider.height = 0.25;
	slider.width = 1;
	slider.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
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
	let guiElements = {
		setTimeline: function(timeline){
			this.timeline = vars.timeline
			slider.onPointerDownObservable.add(function(){
				slider.onValueChangedObservable.add(function(){
					if(this.slider.value <= this.timeline.totalDuration()){
						timeline.seek(this.slider.value, false);
					}
				})
			});
			slider.onPointerUpObservable.add(function(){
				slider.onValueChangedObservable.clear();
			});
		},
		timeline: null,
		advancedTexture,
		leftPanel,
		rightPanel,
		slider
	};
	return guiElements;
}
/**
 * vars contain:
 * stack, name, width, height, color, background, func
 *
 * Generic button constructor.
 *
 */
function CreateButton(vars){
	if(!vars.stack){
		console.log("Error: CreateButton needs a stack to append the button to!");
		return;
	}
	let result = new BABYLON.GUI.Button.CreateSimpleButton(vars.name);
	result.width = vars.width || defaults.width;
	result.height = vars.height || defaults.height;
	result.color = vars.color || defaults.color;
	result.background = vars.background || defaults.background;
	if(vars.func){
		result.onPointerUpObservable.add(vars.func);
	}
	vars.stack.addControl(result);
	return result;
};

/**
 * Default properties of generic buttons for undefined properties.
 */

CreateButton.prototype = {
	defaults: {
		width: "120px",
		height: "50px",
		color: "white",
		background: "green"
	}
};

GIU={
	
}