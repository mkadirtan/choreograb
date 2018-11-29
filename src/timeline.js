import {TimelineMax, TweenMax} from 'gsap';
import {slider} from './GUI2';
import {music} from './music';
/*
 * initializeTimeline returns an object with setParams method and timeline.
 * setParams assigns some routines to timeline object.
 * This approach is useful to adjust timeline according to changes.
 */

let timeControl = {
    timeline: new TimelineMax(),
    audioSyncSensitivity: 0.05,
    slider: slider,
    music: music
};

timeControl.timeline.eventCallback("onUpdate", function(){
    if(!this.timeline.paused()){
        this.slider.value = this.timeline.time();
    }
    if(this.music.playing() && Math.abs(this.music.seek()-self.timeline.time())>this.audioSyncSensitivity){
        this.music.seek(this.timeline.time());
    }
}, [], timeControl)
.eventCallback("onComplete", function(){
    this.music.pause();
    this.timeline.pause();
}, [], timeControl);

export {timeControl};