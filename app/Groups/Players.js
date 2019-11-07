import {MeshBuilder} from "@babylonjs/core";
import {pick, property} from "underscore";
import {PlayerMember} from '../Members/PlayerMember';

export const PlayerGroupDefinition = {
    "name": "Players",
    "memberClass": PlayerMember,
    "registerHandler": registerHandler,
    "updateHandler": loadHandler,
    "autoUpdateActiveMember": true
};