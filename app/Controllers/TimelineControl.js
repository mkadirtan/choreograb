import {TimelineLite} from "gsap/TimelineLite";
import {SceneControl} from "./SceneControl";

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
    }
};

export {TimelineControl};