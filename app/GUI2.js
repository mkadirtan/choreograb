/**
 * ASSETS
 */
import i_play from './media/textures/play.png';
import i_pause from './media/textures/pause.png';
import i_stop from './media/textures/stop.png';
import i_next from './media/textures/next.png';
import i_previous from './media/textures/previous.png';
import i_forward from './media/textures/fastForward.png';
import i_backward from './media/textures/fastBackward.png';
import i_camera from './media/textures/camera.png';
import i_save from './media/textures/save.png';
import i_load from './media/textures/load.png';
import i_redo from './media/textures/redo.png';
import i_undo from './media/textures/undo.png';
import i_newMotif from './media/textures/newMotif.png';

/**
 * BABYLON IMPORTS
 */
import {AdvancedDynamicTexture, StackPanel, Control, Slider, TextBlock, InputText, Button as babylonButton} from "@babylonjs/gui";
*
let notificationPanel = new StackPanel("notificationPanel");
notificationPanel.width = 1920 - 2.5*controlBaseSize + "px";
notificationPanel.height = 1.5*fontBaseSize + "px";
notificationPanel.top = -controlBaseSize + "px";
notificationPanel.paddingLeft = 1920/2 + "px";
notificationPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
notificationPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
notificationPanel.isVertical = false;

const notificationText = new TextBlock();
notificationText.fontSize = 1.5*fontBaseSize + "px";
notificationText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;

notificationPanel.addControl(notificationText);
const fader = new TimelineMax();

export function notify(message, type){
    let bgColor = "";
    switch(type){
        case "error":
            bgColor = "red";
            notificationText.color = "white";
            break;
        case "system":
            bgColor = "blue";
            notificationText.color = "white";
            break;
        default:
            bgColor = "grey";
            notificationText.color = "black";
    }
    fader.kill({alpha: true});
    fader.to(notificationPanel, 1, {alpha: 1}, 0).to(notificationPanel, 1, {alpha: 0}, 5);
    notificationText.text = String(message);
    notificationPanel.background = bgColor;
}
*/
export let timePrint = new TextBlock();

timePrint.color = "white";
timePrint.text = "0.00 sn";
timePrint.fontSize = fontBaseSize + "px";
timePrint.height = controlBaseSize + "px";
timePrint.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
timePrint.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
rightPanel.addControl(timePrint);

/**
 * CreateButton makes it easier to create and set parameters of a button.
 * It assigns name, image, width, size, onClick function of the button,
 * then returns the created babylonButton object.
 */

/**
 * Default properties of generic buttons for undefined properties.
 */

