import {Group} from "../Classes/Group";

export const SceneControl = {
    name: "SceneControl",
    Groups: [],
    CreateGroup(groupDefinition){
        if(typeof groupDefinition.name !== "string"){
            //must be string
            return;
        }
        if(groupDefinition.name.length > 20){
            //must be 20 at max
            return;
        }
        if(this.getGroup(groupDefinition.name) !== undefined){
            //Group name exists
            return;
        }
        let newGroup = new Group(groupDefinition);
        this.Groups.push(newGroup);
    },
    getGroup(name){
        return this.Groups.find(function(group, index, groups){
            return group.name === name;
        })
    },
};