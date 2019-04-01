import { Motifs } from "./motifs";
import { Players } from "./players";
import { Guides } from "./guides";
import { timeControl } from "./timeline";
import { Observable } from "@babylonjs/core/index";
import { scene } from "./scene";

let sceneHistory = [];
let historyIndex = -1;

export let actionTakenObservable = new Observable();
actionTakenObservable.add(()=>{
    sceneControl.save();
});

export let sceneControl = {
    self: this,
    updateAll(scenesave){
        Motifs.updateMotifs(scenesave.Motifs);
        Guides.updateGuides(scenesave.Guides);
        Players.updatePlayers(scenesave.Players);
        timeControl.updateTimeline();
    },
    load(scenesave){
        this.clearAll();
        this.updateAll(scenesave);
    },
    clearAll: function(){
        Motifs.clearAll();
        Guides.clearAll();
        Players.clearAll();
    },
    save: function(){
        let sceneData = {};
        sceneData.Players = Players.registerElements();
        sceneData.Guides = Guides.registerElements();
        sceneData.Motifs = Motifs.registerElements();

        historyIndex++;
        sceneHistory[historyIndex] = sceneData;
        console.log("action taken!");
        //console.log(sceneData);

        console.log(JSON.stringify(sceneData));//todo mongodb
    },
    undo(){
        if(historyIndex >= 1){
            this.updateAll(sceneHistory[historyIndex-1]);
            console.log(sceneHistory[historyIndex-1]);
            historyIndex--;
            console.log("undone!")
        }
        else if(historyIndex === 1){
            this.clearAll();
        }
        else console.log("couldn't undone!")
    },
    redo(){
        if(sceneHistory.length>historyIndex+1){
            this.updateAll(sceneHistory[historyIndex+1]);
            console.log(sceneHistory[historyIndex+1]);
            historyIndex++;
            console.log("redone!")
        }
        else console.log("couldn't redone!")
    }
};