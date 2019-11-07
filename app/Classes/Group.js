import {Observable} from "@babylonjs/core";

export class Group{
    constructor(param){
        this.name = param.name;
        this.members = [];
        this.memberClass = param.memberClass;
        this.activeMember = undefined;
        this.onMemberCreateObservable = new Observable();
        this.onMemberCreateObservable.add(newMember=>this.activeMember=newMember);
        if(param.intervalPipe){
            this.intervalPipe = param.intervalPipe;
        }
    }
    /*
    merhabaa, muhammed hazırladı, ıtır çiziktirdi :)....
     */

    CreateNewMember(param){
        let newMember = new this.memberClass(this, param);
        this.members.push(newMember);
        this.onMemberCreateObservable.notifyObservers(newMember);
    }

    getMemberByID(id){
        return this.members.find(member=>member.id===id);
    }

    getMembers(){return this.members};
    generateID() {
        let newID = 0;
        while (this.getMemberByID(newID)) {
            newID++;
        }
        return newID;
    }
    register(){
        this.members.forEach(member=>{
            member.addRegister();
        })
    }

    save(){

    }
    load(){

    }
}