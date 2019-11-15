import {AnimatableGroup} from "../Classes/AnimatableGroup";
import {PlayerMember} from "../Members/PlayerMember";
import {Motifs} from "./Motifs";

export const Players = new AnimatableGroup({
    "name": "Players",
    "memberClass": PlayerMember,
    "intervalPipe": register => {register.interval = Motifs.getInterval(); return register}
});