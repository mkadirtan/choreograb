import {AdvancedDynamicTexture, Button as babylonButton, Control, Grid, InputText, StackPanel} from "@babylonjs/gui";
import {scene} from "../SceneConstructor";

export const controlBaseSize = 80;
export const controlPadding = 1;
export const fontBaseSize = 24;

const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene);
advancedTexture.idealWidth = 1920;
//Left Grid
const leftGrid = new Grid();
leftGrid.width = (controlBaseSize + controlPadding) * 3 + "px";
//leftGrid.height = "100%";
leftGrid.addColumnDefinition(1);
leftGrid.addRowDefinition((controlBaseSize + controlPadding)*3, true);
leftGrid.addRowDefinition((controlPadding + controlBaseSize) * 3, true);
leftGrid.addRowDefinition(controlPadding + controlBaseSize, true);
leftGrid.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
leftGrid.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
advancedTexture.addControl(leftGrid);
//Position Grid
const positionGrid = new Grid();
positionGrid.addRowDefinition(0.33);
positionGrid.addRowDefinition(0.34);
positionGrid.addRowDefinition(0.33);
positionGrid.addColumnDefinition(0.33);
positionGrid.addColumnDefinition(0.34);
positionGrid.addColumnDefinition(0.33);
leftGrid.addControl(positionGrid, 1, 0);
//Right Grid
const rightGrid = new Grid();
rightGrid.width = (controlBaseSize + controlPadding) * 3 + "px";
rightGrid.height = "100%";
rightGrid.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
rightGrid.addColumnDefinition(1);
rightGrid.addRowDefinition(0.3);
rightGrid.addRowDefinition(0.3);
rightGrid.addRowDefinition(0.4);
advancedTexture.addControl(rightGrid);
//Bottom Grid
const bottomGrid = new Grid();
bottomGrid.width = "100%";
bottomGrid.height = (controlBaseSize + controlPadding) + "px";
bottomGrid.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
bottomGrid.addRowDefinition(1);
bottomGrid.addColumnDefinition(controlBaseSize + controlPadding, true);
bottomGrid.addColumnDefinition(controlBaseSize + controlPadding, true);
bottomGrid.addColumnDefinition(controlBaseSize + controlPadding, true);
bottomGrid.addColumnDefinition(1);
bottomGrid.addColumnDefinition(controlBaseSize + controlPadding, true);
advancedTexture.addControl(bottomGrid);
//Attacher Functions
export function attachPositionInputBoxes(boxL, boxR, boxU, boxD){
    positionGrid.addControl(boxL, 1, 0);
    positionGrid.addControl(boxR, 1, 2);
    positionGrid.addControl(boxU, 0, 1);
    positionGrid.addControl(boxD, 2, 1);
}

export function attachToRightGrid(GUIElement, row, column){
    rightGrid.addControl(GUIElement, row, column);
}

export function attachToLeftGrid(GUIElement, row, column){
    leftGrid.addControl(GUIElement, row, column)
}

export function attachToBottomGrid(GUIElement, row, column){
    bottomGrid.addControl(GUIElement, row, column)
}
/*const leftPanel = new StackPanel("leftPanel");
leftPanel.width = controlBaseSize + "px";
leftPanel.height = 0.75;
leftPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
leftPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
leftPanel.isVertical = true;
*/



//advancedTexture.addControl(leftPanel);

