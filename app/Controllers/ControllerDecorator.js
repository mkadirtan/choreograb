import {SceneControl} from "./SceneControl";
import {TimelineControl} from "./TimelineControl";
import {Motifs} from "../Groups/Motifs";
import {Players} from "../Groups/Players";

SceneControl.addGroup(Motifs);
SceneControl.addGroup(Players);
SceneControl.TimelineControl = TimelineControl;
TimelineControl.addGroupToTimeline(Players);

export {SceneControl, TimelineControl}