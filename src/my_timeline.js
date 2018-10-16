import {TimelineMax} from 'gsap';

let registerTimeline = function(mesh, mainTimeline){
  mainTimeline.add(mesh.data.timeline, 0)
};

function initTimeline (){
    return {
        setVars: function(vars){
            if(vars.slider && vars.music){
                this.slider = vars.slider;
                this.music = vars.music;

                this.timeline.eventCallback("onUpdate", function(){
                    if(!this.timeline.paused()){
                        this.slider.value = this.timeline.time()
                    };
                    //If you want to display current time, code goes here.
                    //ex: console.log(this.slider.value);
                    if(this.music.playing() && Math.abs(this.music.seek()-this.timeline.time())>this.audioSyncSensitivity){
                        this.music.seek(this.timeline.time());
                    };
                });

                timeline.eventCallback("onComplete", function(){
                    this.music.pause();
                    this.timeline.pause();
                });
            }
            if(vars.audioSyncSensitivity){
                this.audioSyncSensitivity = vars.audioSyncSensitivity;
            }
        },
        timeline: new TimelineMax()
    };
}

export let Timeline = {
    initTimeline,
    registerTimeline
};