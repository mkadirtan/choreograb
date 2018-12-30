import {TimelineMax, TweenMax} from 'gsap';
import {slider, timePrint} from './GUI2';
import {music} from './music';
import {Motifs} from './motifs';

/*
 * initializeTimeline returns an object with setParams method and timeline.
 * setParams assigns some routines to timeline object.
 * This approach is useful to adjust timeline according to changes.
 */

let timeControl = {
    timeline: new TimelineMax(),
    audioSyncSensitivity: 0.05,
    slider: slider,
    music: music,
    shake: function(motif){
        this.timeline.progress(1).progress(0);
        this.timeline.seek(motif.start, false);
        this.slider.value = motif.start;
        timePrint.text = this.slider.value.toFixed(2) + " sn";
        Motifs.update();
    },
    stop: function(){
        this.slider.value = 0;
        this.timeline.pause();
        this.timeline.seek(0);
        timePrint.text = "0.00 sn";
        Motifs.update();
    },
    play: function(){
        this.timeline.play();
    },
    updateTimeline: function(){
        let time = this.slider.value;
        this.timeline.seek(0,false).seek(time,false);
        Motifs.update();
    }
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
    Motifs.update();
}, [], timeControl)
.eventCallback("onComplete", function(){
    this.music.pause();
    this.timeline.pause();
}, [], timeControl);

timeControl.timeline.seek(0).pause(0);

export {timeControl};