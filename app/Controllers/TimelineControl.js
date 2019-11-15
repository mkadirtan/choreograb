import {TimelineLite} from "gsap/TimelineLite";
import {slider} from "../GUI/Slider";

let TimelineControl = {
    timeline: new TimelineLite(),
    groups: [],
    addGroupToTimeline: function(group){
        let members = group.getMembers();
        let timeline = this.timeline;
        //Associate existing members
        members.forEach(member=>{
            timeline.add(member.timeline, 0)
        });
        //Associate future members
        group.onMemberCreateObservable.add(member=>{timeline.add(member.timeline)});
        this.groups.push(group.name)
    },
    update(time){
        this.timeline.seek(time);
    }
};

TimelineControl.timeline.eventCallback("onComplete", function(timeline){
    timeline.pause();
},["{self}"]);

TimelineControl.timeline.eventCallback("onUpdate", function(timeline) {
    slider.value = timeline.time()
}, ["{self}"]);

export {TimelineControl};