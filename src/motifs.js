import {timeControl} from './timeline';

export let Motifs = {
    current: null,
    next: null,
    previous: null,
    motifs: [],
    update(){
        let self = this;
        let currentTime = timeControl.timeline.time();
        if(!(self.current.start <= currentTime && currentTime <= self.current.end)){
            self.motifs.forEach((motif, index, array)=>{
                    if (motif.start <= currentTime && currentTime <= motif.end) {
                        if(array.length > 2){
                            if(index === array.length-1){
                                self.next = array[0];
                                self.previous = array[index-1];
                            }
                            else if(index === 0){
                                self.next = array[index+1];
                                self.previous = array[length-1];
                            }
                            else{
                                self.next = array[index+1];
                                self.previous = array[index-1];
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
        }
        self.motifs.forEach(motif=>{
            motif.update();
        });
    },
    addMotif(motif){
        this.motifs.push(motif);
    },
    removeMotif(motif) {
        this.motifs.forEach((e, i, a)=>{
            if (e === motif) {
                a.splice(i, 1);
            }
        });
    }
};

export function CreateMotif(param){
    this.name = param.name;
    this._isActive = true;
    this.start = param.start;
    this.end = param.end;
    this.guides = [];
    this.keys = [];
    Motifs.addMotif(this);
}

CreateMotif.prototype = {
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
    active: function(status){
        if(status === undefined){
            console.log("nostatus")
            return this._isActive;
        }
        else{
            this._isActive = status;
        }
        this.update();
    }
};
