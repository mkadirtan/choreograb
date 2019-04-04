/**
 * LOCAL IMPORTS
 */
import {timeControl} from './timeline';
import {CreateID} from "./history";
/**
 * LOCAL IMPORTS
 */
export let Motifs = {
    checkSpace(param){
        if(this.motifs.length>0){
            let collision = false;
            this.motifs.forEach(motif=>{
                if(param.start<=motif.end && param.start>=motif.start){
                    collision = true;
                }
                else if(param.end<=motif.end && param.end>=motif.start){
                    collision = true;
                }
            });
            return !collision;
        }
        else return true;
    },
    clearAll(){
        this.motifs.forEach(motif=>motif.destroy());
    },
    getMotifByMotifID: function(MotifID){
        let self = this;
        self.motifs.forEach(motif=>{
            if(motif.MotifID === MotifID){
                return motif;
            }
        });
        return null;
    },
    updateMotifs(motifs){
        let self = this;
        motifs.forEach(_motif => {
            let motif = self.getMotifByMotifID(_motif.MotifID);
            if(motif !== null)motif.updateMotifStatus(_motif);
            else new Motif(_motif)
        });
        self.motifs.forEach(motif=>{
            let found = false;
            let index = -1;
            motifs.forEach((_motif, i)=>{
                if(motif.MotifID === _motif.MotifID)found=true;
                index = i;
            });
            if(!found && index!==-1)self.motifs[index].destroy()
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
                if(array.length === 1){
                    self.next = motif;
                    self.current = motif;
                    self.previous = motif
                }
                else if (motif.start <= currentTime && currentTime <= motif.end) {
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
                    else if(array.length === 2){
                        if(index === 1){
                            self.previous = array[0];
                            self.next = array[1];
                        }
                        else{
                            self.next = array[1];
                            self.previous = array[0]
                        }
                    }
                    self.current = motif;
                    motif.isActive(true);
                }
                else{
                    motif.isActive(false);
                }
            }
        );
        self.motifs.forEach(motif=>{
            motif.correctVisibility();
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
        return new Promise((resolve, reject)=>{
            if(this.next){
                let motif = this.next;
                timeControl.shake(motif);
                this.update();
                resolve(motif.name);
            }
            else{
                reject(new Error("Unable to find motif!"));
            }
        })
    },
    previousMotif(){
        return new Promise((resolve, reject)=>{
            if(this.previous){
                let motif = this.previous;
                timeControl.shake(motif);
                this.update();
                resolve(motif.name);
            }
            else{
                reject(new Error("Unable to find motif!"));
            }
        })
    },
    registerElements(){
        let elements = [];
        this.motifs.forEach(motif=>{
            elements.push({
                MotifID: JSON.parse(JSON.stringify(motif.MotifID)),
                name: JSON.parse(JSON.stringify(motif.name)),
                start: JSON.parse(JSON.stringify(motif.start)),
                end: JSON.parse(JSON.stringify(motif.end))
            });
        });
        return elements;
    }
};

export function Motif(param){
    return new Promise((resolve, reject)=>{
        if(isNaN(param.start+param.end))reject(new Error("Insert valid numbers!"));
        let bool = Motifs.checkSpace(param);
        if(!bool){
            reject(new Error("There is already a motif on that timespan!"))
        }
        else{
            this.initializeMotif(param);
            this.updateMotifStatus(param);
            resolve(this);
        }
    });
}

Motif.prototype = {
    initializeMotif(param){
        this.initializeMotifParameters(param);
        this.initializeMotifBehavior();
    },
    updateMotifStatus(param){
        this.updateMotifParameters(param);
        this.updateMotifBehavior(param);
    },
    initializeMotifParameters(param){
        Object.assign(this, {
            MotifID: param.MotifID || CreateID('Motif'),
            name: param.name,
            _isActive: true,
            start: param.start,
            end: param.end,
            guides: [],
        });
    },
    initializeMotifBehavior(){
        Motifs.addMotif(this);
    },
    updateMotifParameters(param){
        const allowedParams = ["start", "end", "_isActive", "guides", ];
        let newParam = {};
        allowedParams.forEach(entry=>{
            if(param.hasOwnProperty(entry)){newParam[entry] = param[entry];}
        });
        Object.assign(this, newParam)
    },
    updateMotifBehavior(){

    },
    show(){
        this.guides.forEach(e=>e.show());
    },
    hide(){
        this.guides.forEach(e=>e.hide());
    },
    correctVisibility(){
        this.isActive()?this.show():this.hide();
    },
    addGuide(guide){
        let isDuplicate = false;
        this.guides.forEach(_guide=>{
            if(_guide.GuideID === guide.GuideID){isDuplicate = true;}
        });
        this.guides.push(guide);
    },
    removeGuide: function(guide){
        this.guides.forEach(function(_guide, i, guides){
            if(_guide === guide){
                guides.splice(i, 1);
            }
        })
    },
    isActive(status){
        if(status === undefined){
            return this._isActive;
        }
        else{
            this._isActive = status;
        }
        this.correctVisibility();
    },
    destroy(){
        Motifs.removeMotif(this);
        this.guides.forEach(guide=>guide.destroy());
        this.MotifID += "deleted";
    }
};
