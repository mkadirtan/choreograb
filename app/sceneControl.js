import { Motifs } from "./motifs";
import { Players } from "./players";
import { timeControl } from "./timeline";
import { notify } from "./GUI2";
import { Observable } from "@babylonjs/core";

let sceneHistory = [];
let historyIndex = -1;

export const actionTakenObservable = new Observable();
actionTakenObservable.add(notification=>{
    sceneControl.save();
    notify(notification)
});

export const sceneControl = {
    updateAll(loaded){
        Motifs.updateMotifs(loaded.Motifs);
        Players.updatePlayers(loaded.Players);
        timeControl.updateTimeline();
    },
    load(loaded){
        this.clearAll();
        this.updateAll(loaded);
    },
    clearAll: function(){
        Motifs.clearAll();
        Players.clearAll();
    },
    save: function(){
        let sceneData = {};
        sceneData.Players = Players.registerElements();
        sceneData.Motifs = Motifs.registerElements();

        historyIndex++;
        sceneHistory[historyIndex] = sceneData;
        console.log(JSON.stringify(sceneData));
    }
};

window.onurLoad = function(loaded){
    sceneControl.load(loaded);
};
