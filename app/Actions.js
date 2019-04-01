export let Actions = {
    actions: [],
    setAction: function(name, action, affects){
        this.actions.push({name, action, affects})
    },
    removeAction: function(name){
        this.actions.forEach((a,index, list)=>{
            if(a.name === name){
                list.slice(index,1);
            }
        })
    },
    getActionByName: function(name){
        this.actions.forEach(a=>{
            if(a.name === name){
                return a;
            }
        })
    },
    getActionByHistory: function(history){
        let name = history.action.name;
        this.actions.forEach(a=>{
            if(a.name === name){
                return a;
            }
        })
    },
    getCounterActionByHistory: function(history){
        let name = history.counterAction.name;
        this.actions.forEach(a=>{
            if(a.name === name){
                return a;
            }
        })
    },
};

Actions.setAction('playerKeyAction', playerKeyAction, 'Players');

function playerKeyAction(state, data){
    state.Players.forEach(p=>{
        if(p.uuid === data.uuid){
            p.Key(data)
        }
    })
}
