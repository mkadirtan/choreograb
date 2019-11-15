import {InputText} from "@babylonjs/gui";
import {controlBaseSize, controlPadding, fontBaseSize} from "./GUI";

export function CreateInput(param){
    let input = new InputText(param.name, "");
    input.height = controlBaseSize + "px";
    input.width = controlBaseSize + "px";
    input.paddingBottom = controlPadding + "px";
    input.paddingTop = controlPadding + "px";
    input.paddingLeft = controlPadding + "px";
    input.paddingRight = controlPadding + "px";
    input.color = "#FFFFFF";
    if(param.callback)input.onBeforeKeyAddObservable.add(param.callback);
    input.fontSize = fontBaseSize;
    return input;
}
