export const SceneControl = {
    name: "SceneControl",
    groups: [],
    TimelineControl: undefined,
    addGroup(group){
        group.controller = this;
        this.groups.push(group);
    },
    getGroup(name){
        return this.groups.find(function(group, index, groups){
            return group.name === name;
        })
    },
};