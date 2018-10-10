import * as TimelineMax from 'TimelineMax';
let timelineDefault = new TimelineMax();
registerTimeline (mesh){
  timelineDefault.add(mesh.data.timeline)
}

function initTimeline (){
    let mainTimeline = {
        setVars: function(vars){
            if(vars.slider && vars.music){
                this.slider = vars.slider;
                this.music = vars.music;

                timeline.eventCallback("onUpdate", function(){
                    if(!tl.paused()){
                        slider.value = tl.time()
                    };
                    header.text = slider.value.toFixed(2);
                    if(music.playing() && Math.abs(music.seek()-tl.time())>audioSyncSensitivity){
                        music.seek(tl.time());
                    };
                }
            }
        },
        timeline: new TimelineMax()
    };
    return mainTimeline;
};
/*
tl.eventCallback("onUpdate", function(){
    if(!tl.paused()){
        slider.value = tl.time()};
    header.text = slider.value.toFixed(2) + " saniyedesiniz";
    if(lost.playing() && Math.abs(lost.seek()-tl.time())>audioSyncSensitivity){
        lost.seek(tl.time());
        console.log("Audio playback synchronized back!");
    };
});
tl.eventCallback("onComplete", function(){
    tl.pause(); lost.pause()});
    */
