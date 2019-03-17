import { Motif, Motifs } from "./motifs";
import {Player, Players } from "./players";
import { Guide , Guides } from "./guides";
import { timeControl } from "./timeline";

export let sceneControl = {
    self: this,
    load: function(scenesave){
        console.log(scenesave.Players.length);
        this.clear();
        scenesave.Motifs.forEach(motif=>{
            new Motif(motif);
        });
        scenesave.Guides.forEach(guide=>{
            new Guide(guide);
        });
        scenesave.Players.forEach(player=>{
            new Player(player);
        });
        timeControl.updateTimeline();
    },
    clear: function(){

    },
    register: function(){
        let sceneData = {};
        sceneData.Players = Players.registerElements() || [];
        sceneData.Guides = Guides.registerElements() || [];
        sceneData.Motifs = Motifs.registerElements() || [];
        console.log(JSON.stringify(sceneData));
    }
};