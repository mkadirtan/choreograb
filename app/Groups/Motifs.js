import {Group} from "../Classes/Group";
import {MotifMember} from "../Members/MotifMember";
import {SceneControl} from "../Controllers/SceneControl";

export const Motifs = new Group({
    "name": "Motifs",
    "memberClass": MotifMember
});

Motifs.getInterval = ()=>{return Motifs.activeMember.interval};