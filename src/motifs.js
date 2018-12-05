import {timeControl} from './timeline';

export let Motifs = {
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
        console.log("sort", self.motifs);
        console.log("sort Current", self.current);
        self.motifs.sort(function(a,b){
            return a.start - b.start;
        })
    },
    adjust(){
        let self = this;
        let currentTime = timeControl.timeline.time();
        console.log("time: ", currentTime);
        self.motifs.forEach((motif, index, array)=>{
                if (motif.start <= currentTime && currentTime <= motif.end) {
                    console.log("found!");
                    //En az 3 motif varsa previous ve next atamasını yap.
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
                    //Eğer motif sayısı 2 ise previous veya next ataması yap
                    else if(array.length === 2){
                        console.log("MOTIFS LENGTH IS 2");
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
        timeControl.timeline.seek(Motifs.next.start+0.001);
        this.update();
    },
    previousMotif(){
        timeControl.timeline.seek(Motifs.previous.start+0.001);
        this.update();
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
    console.log(Motifs);
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
    },
    nextMotif: function(){

    }
};
