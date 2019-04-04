/**
 * ASSETS
 */

/**
 * ASSETS
 */
/**
 * BABYLON IMPORTS
 */
import {TimelineMax, TweenMax} from 'gsap';
/**
 * BABYLON IMPORTS
 */
/**
 * LOCAL IMPORTS
 */
import {slider, timePrint} from './GUI2';
import {music} from './music';
import {Motifs} from './motifs';
import {Players} from './players';
/**
 * LOCAL IMPORTS
 */
/**
 * initializeTimeline returns an object with setParams method and timeline.
 * setParams assigns some routines to timeline object.
 * This approach is useful to adjust timeline according to changes.
 */

let timeControl = {
    timeline: new TimelineMax(),
    audioSyncSensitivity: 0.05,
    slider: slider,
    music: music,
    add(tl){
        this.timeline.add(tl, 0);
    },
    speed(direction){
        return new Promise((resolve, reject)=>{
            if(direction === "increase"){
                let tScale = this.timeline.timeScale();
                if(tScale<8){
                    this.timeline.timeScale(tScale*2);
                    resolve(this.timeline.timeScale());
                }
                else{
                    reject(new Error("Highest speed is reached!"));
                }
            }
            else if(direction === "decrease"){
                let tScale = this.timeline.timeScale();
                if(tScale>1/4){
                    this.timeline.timeScale(tScale/2);
                    resolve(this.timeline.timeScale());
                }
                else{
                    reject(new Error("Lowest speed is reached!"))
                }
            }
            else{
                reject(new Error("Undefined time scale parameter!"))
            }
        });
    },
    shake: function(motif){
        this.timeline.progress(1).progress(0);
        this.timeline.seek(motif.start, false);
        this.slider.value = motif.start;
        timePrint.text = this.slider.value.toFixed(2) + " sn";
        Players.updatePositionRotation();
        Motifs.update();
    },
    stop: function(){
        return new Promise((res, rej)=>{
            this.slider.value = 0;
            this.timeline.pause();
            this.timeline.seek(0);
            timePrint.text = "0.00 sn";
            Motifs.update();
            if(this.slider.value === 0 && this.timeline.paused() && this.timeline.seek() === 0) res();
            else rej(new Error("Couldn't stop!"));
        })
    },
    pause(){
        return new Promise((res, rej)=>{
            this.timeline.pause();
            if(this.timeline.paused()) res();
            else rej(new Error("Couldn't pause!"));
        })
    },
    play: function(){
        return new Promise((resolve, reject)=>{
            this.timeline.play();
            if(this.timeline.paused()){
                reject(new Error("Couldn't play!"))
            }
            else{
                resolve();
            }
        });
    },
    updateTimeline: function(){
        let time = this.slider.value;
        this.timeline.seek(0,false).seek(time,false);
        Players.updatePositionRotation();
        Motifs.update();
    },
    checkOnMotif: function(){
        let margin = 0.01;
        Motifs.update();
        return ((this.slider.value - margin) <= Motifs.current.end)
            &&
            ((this.slider.value + margin) >= Motifs.current.start);
    },
    clearAll(){
        this.timeline = new TimelineMax();
    },
};

/*let fuckthisshit = {
    time: 0
};
timeControl.timeline.to(fuckthisshit, 50, {time: 50}, 0);*/

timeControl.timeline.eventCallback("onUpdate", function(){
    timePrint.text = this.timeline.time().toFixed(2) + " sn";
    if(!this.timeline.paused() && this.slider.maximum >= this.timeline.duration()) this.slider.value = this.timeline.time();
    if(this.music.playing() && Math.abs(this.music.seek()-self.timeline.time())>this.audioSyncSensitivity){
        this.music.seek(this.timeline.time());
    }
    Players.players.forEach(e=>e.updateAnimation());
    Motifs.update();
}, [], timeControl)
.eventCallback("onComplete", function(){
    this.music.pause();
    this.timeline.pause();
}, [], timeControl);

timeControl.timeline.seek(0).pause(0);

export {timeControl};