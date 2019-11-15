import {attachToBottomGrid, attachToRightGrid, attachToLeftGrid, attachPositionInputBoxes} from "./GUI";
import {boxD, boxL, boxR, boxU, simpleInput, applyPosition} from "./PositionInput";
import {slider} from "./Slider";

attachPositionInputBoxes(boxL, boxR, boxU, boxD);
attachToBottomGrid(slider, 0, 3);
attachToRightGrid(simpleInput, 0,0);
attachToLeftGrid(applyPosition, 2, 0);