import {AdvancedDynamicTexture, Button as babylonButton, Control, Grid, InputText, StackPanel} from "@babylonjs/gui";
import {scene} from "../SceneConstructor";

const controlBaseSize = 80;
const controlPadding = 1;
const fontBaseSize = 24;

const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene);
advancedTexture.idealWidth = 1920;

const leftGrid = new Grid();
leftGrid.width = (controlBaseSize + controlPadding) * 3 + "px";
leftGrid.height = "100%";
leftGrid.addColumnDefinition(1);
leftGrid.addRowDefinition(0.3);
leftGrid.addRowDefinition((controlPadding + controlBaseSize) * 3, true);
leftGrid.addRowDefinition(0.3);
leftGrid.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
advancedTexture.addControl(leftGrid);

const playerGrid = new Grid();
playerGrid.addRowDefinition(0.33);
playerGrid.addRowDefinition(0.34);
playerGrid.addRowDefinition(0.33);
playerGrid.addColumnDefinition(0.33);
playerGrid.addColumnDefinition(0.34);
playerGrid.addColumnDefinition(0.33);

leftGrid.addControl(playerGrid, 1, 0);
/*const leftPanel = new StackPanel("leftPanel");
leftPanel.width = controlBaseSize + "px";
leftPanel.height = 0.75;
leftPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
leftPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
leftPanel.isVertical = true;
*/
const input1 = Input({
    "name": "Player",
});

const input2 = Input({
    "name": "Player",
});

const input3 = Input({
    "name": "Player",
});

const input4 = Input({
    "name": "Player",
});

playerGrid.addControl(input1, 1, 0);
playerGrid.addControl(input2, 1, 2);
playerGrid.addControl(input3, 0, 1);
playerGrid.addControl(input4, 2, 1);
//advancedTexture.addControl(leftPanel);

function Button(param){
    let button = new babylonButton.CreateImageOnlyButton(param.name, param.image);
    button.width = param.width || controlBaseSize + "px";
    button.height = param.height || controlBaseSize + "px";
    button.cornerRadius = 7;
    button.paddingBottom = controlPadding + "px";
    button.paddingTop = controlPadding  + "px";
    button.paddingLeft = controlPadding + "px";
    button.paddingRight = controlPadding + "px";

    if(param.onClick)button.onPointerUpObservable.add(param.onClick);
    param.stack.addControl(button);
}

function Input(param){
    let input = new InputText(param.name, "");
    input.height = controlBaseSize + "px";
    input.width = controlBaseSize + "px";
    input.color = "#FFFFFF";
    return input;
}