export class Motif{
    constructor(param){
        this.name = param.name;
    }
    setInterval(interval){
        this.interval = interval;
    }
}

function registerHandler(members){
    let registers = [];
    members.forEach(member=>{
        registers.push({
            name: member.name,
            ID: member.ID,
            interval: member.interval
        })
    });
    return registers;
}

function updateHandler(registers){
    registers.forEach(register=>{
        let member = this.getMemberByID(register.ID);
        member.setInterval(register.interval);
    })
}

export const MotifGroupDefinition = {
    "name": "Motifs",
    "memberClass": Motif,
    "registerHandler": registerHandler,
    "updateHandler": updateHandler,
    "autoUpdateActiveMember": true
};