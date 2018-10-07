import * as TimelineMax from 'TimelineMax';
let timelineDefault = new TimelineMax();
registerTimeline (mesh){
  timelineDefault.add(mesh.data.timeline)
}
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
