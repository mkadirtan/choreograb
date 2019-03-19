import { Motif, Motifs } from "./motifs";
import {Player, Players } from "./players";
import { Guide , Guides } from "./guides";
import { timeControl } from "./timeline";
import { scene } from "./scene";

export let sceneControl = {
    self: this,
    load: function(scenesave){
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
    save: function(){
        let sceneData = {};
        sceneData.Players = Players.registerElements() || [];
        sceneData.Guides = Guides.registerElements() || [];
        sceneData.Motifs = Motifs.registerElements() || [];
        console.log(JSON.stringify(sceneData));
    }
};