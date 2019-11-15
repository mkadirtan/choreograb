import {Button as babylonButton, Control} from "@babylonjs/gui";
import {controlBaseSize, controlPadding} from "./GUI";

export function CreateButton(param){
    let button = new babylonButton.CreateSimpleButton(param.name, param.text);
    button.width = param.width || controlBaseSize + "px";
    button.height = param.height || controlBaseSize + "px";
    button.cornerRadius = 7;
    button.paddingBottom = controlPadding + "px";
    button.paddingTop = controlPadding  + "px";
    button.paddingLeft = controlPadding + "px";
    button.paddingRight = controlPadding + "px";
    if(param.callback)button.onPointerUpObservable.add(param.callback);
    return button;
}