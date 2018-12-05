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

let startEndKeys = {
    time: 0
};

timeControl.timeline.to(startEndKeys, 50, {time: 40}, 0);

timeControl.timeline.eventCallback("onUpdate", function(){
    this.slider.value = this.timeline.time();
    if(this.music.playing() && Math.abs(this.music.seek()-self.timeline.time())>this.audioSyncSensitivity){
        this.music.seek(this.timeline.time());
    }
}, [], timeControl)
.eventCallback("onComplete", function(){
    this.music.pause();
    this.timeline.pause();
}, [], timeControl);

timeControl.timeline.seek(0).pause(0);

export {timeControl};