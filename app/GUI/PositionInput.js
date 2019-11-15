import {CreateButton} from "./CreateButton";
import {CreateInput} from "./CreateInput";
import {controlBaseSize, controlPadding, fontBaseSize} from "./GUI";
import {SceneControl} from "../Controllers/SceneControl";

function inputChangeCallback(button){
    //todo there is a bug when entering new text
    if (isNaN(button.currentKey) && button.currentKey !== "."){
        button.addKey = false;
    }
    else{
        button.addKey = true;
        switch(button.name){
            case "boxL":
                boxR.text = "";
                break;
            case "boxR":
                boxL.text = "";
                break;
            case "boxU":
                boxD.text = "";
                break;
            case "boxD":
                boxU.text = "";
                break;
            case "default":
                break;
        }
    }
}

function applyPositionCallback(event){
    console.log("button Pressed!")
    if(boxL.text !== ""){
        SceneControl.getGroup("Players").activeMember.animatableObject.position.x = parseFloat(boxL.text);
    }
    else if(boxR.text !==""){
        SceneControl.getGroup("Players").activeMember.animatableObject.position.x = -parseFloat(boxR.text);
    }
    if(boxU.text !== ""){
        SceneControl.getGroup("Players").activeMember.animatableObject.position.z = -parseFloat(boxU.text);
    }
    else if(boxD.text !==""){
        SceneControl.getGroup("Players").activeMember.animatableObject.position.z = parseFloat(boxD.text);
    }
}



export const boxL = CreateInput({name: "boxL", callback: inputChangeCallback});
export const boxR = CreateInput({name: "boxR", callback: inputChangeCallback});
export const boxU = CreateInput({name: "boxU", callback: inputChangeCallback});
export const boxD = CreateInput({name: "boxD", callback: inputChangeCallback});
export const applyPosition = CreateButton({name: "applyPosition", text: "Apply Position!", width: controlBaseSize * 3, callback: applyPositionCallback});
export const simpleInput = CreateInput({name: "simpleInput"});
