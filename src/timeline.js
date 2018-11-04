import {TimelineMax} from 'gsap';
/*
 * initializeTimeline returns an object with setParams method and timeline.
 * setParams assigns some routines to timeline object.
 * This approach is useful to adjust timeline according to changes.
 */
export function initializeTimeline(){
    return {
        self: this,
        setParams(param){
            if(param.audioSyncSensitivity){
                self.audioSyncSensitivity = param.audioSyncSensitivity;
            }
            if(param.slider && param.music && self.audioSyncSensitivity){
                self.slider = param.slider;
                self.music = param.music;

                self.timeline.eventCallback("onUpdate", function(){
                    if(!self.timeline.paused()){
                        self.slider.value = self.timeline.time()
                    }
                    //If you want to display current time, code goes here.
                    //ex: console.log(self.slider.value);
                    if(self.music.playing() && Math.abs(self.music.seek()-self.timeline.time())>self.audioSyncSensitivity){
                        self.music.seek(self.timeline.time());
                    }
                });

                timeline.eventCallback("onComplete", function(){
                    self.music.pause();
                    self.timeline.pause();
                });
            }
        },
        timeline: new TimelineMax()
    };
}