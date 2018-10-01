import * as GUI from 'babylon-gui';


//Width, height etc pointing to an object in the prototype,
//Therefore hoping to change all buttons properties at the
//same time and change it 'dynamically'

export let defaults_button = {
	width: "120px",
	height: "50px",
	color: "white",
	background: "green"
};

export default function CreateButton(name, text, stack, func){
	if(!stack){
		console.log("Error: CreateButton needs a stack to append the button to!");
		return;
	}
	let result = new GUI.Button.CreateSimpleButton(name, text);
	result.width = defaults_button.width;
	result.height = defaults_button.height;
	result.color = defaults_button.color;
	result.background = defaults_button.background;
	if(func){
		result.onPointerUpObservable.add(func);
	}
	stack.addControl(result);
	return result;
};

