/**
 * LOCAL IMPORTS
 */
import {timeControl} from './timeline';
import {CreateID} from "./history";
/**
 * LOCAL IMPORTS
 */
export let Motifs = {
    getMotifByMotifID: function(MotifID){
        let self = this;
        self.motifs.forEach(motif=>{
            if(motif.MotifID === MotifID){
                return motif;
            }
        });
    },
    current: null,
    next: null,
    previous: null,
    motifs: [],
    update(){
        this.sort();
        this.adjust();
    },
    sort(){
        let self = this;
        self.motifs.sort(function(a,b){
            return a.start - b.start;
        })
    },
    adjust(){
        let self = this;
        let currentTime = timeControl.slider.value;
        self.motifs.forEach((motif, index, array)=>{
                if (motif.start <= currentTime && currentTime <= motif.end) {
                    //En az 3 motif varsa previous ve next atamasını yap.
                    if(array.length > 2){
                        if(index === array.length-1){
                            self.next = array[0];
                            self.previous = array[index-1];
                        }
                        else if(index === 0){
                            self.next = array[index+1];
                            self.previous = array[array.length-1];
                        }
                        else{
                            self.next = array[index+1];
                            self.previous = array[index-1];
                        }
                    }
                    //Eğer motif sayısı 2 ise previous veya next ataması yap
                    else if(array.length === 2){
                        if(index === 1){
                            self.previous = array[0];
                        }
                        else{
                            self.next = array[1];
                        }
                    }
                    self.current = motif;
                    motif.active(true);
                }
                else{
                    motif.active(false);
                }
            }
        );
        self.motifs.forEach(motif=>{
            motif.update();
        });
    },
    addMotif(motif){
        this.motifs.push(motif);
        this.update();
    },
    removeMotif(motif) {
        this.motifs.forEach((e, i, a)=>{
            if (e === motif) {
                a.splice(i, 1);
            }
        });
        this.update();
    },
    nextMotif(){
        timeControl.shake(this.next);
        this.update();
    },
    previousMotif(){
        timeControl.shake(this.previous);
        this.update();
    },
    registerElements(){
        let elements = [];
        this.motifs.forEach(motif=>{
            elements.push({
                MotifID: motif.MotifID,
                name: motif.name,
                start: motif.start,
                end: motif.end,
            });
        });
        return elements;
    }
};

export function Motif(param){
    this.MotifID = param.MotifID || CreateID('Motif');
    this.name = param.name;
    this._isActive = true;
    this.start = param.start;
    this.end = param.end;
    this.guides = [];
    Motifs.addMotif(this);
}

Motif.prototype = {
    show: function(){
        this.guides.forEach(e=>e.show());
    },
    hide: function(){
        this.guides.forEach(e=>e.hide());
    },
    update: function(){
        this.active()?this.show():this.hide();
    },
    addGuide: function(guide){
        this.guides.push(guide);
    },
    removeGuide: function(guide){
        guide.hide();
        this.guides.forEach(function(e, i, a){
            if(e === guide){
                a.splice(i, 1);
            }
        })
    },
    registerElement: function(){

    },
    active: function(status){
        if(status === undefined){
            return this._isActive;
        }
        else{
            this._isActive = status;
        }
        this.update();
    }
};
