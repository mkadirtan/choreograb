function updateStateData(){
    Players.forEach(p=>{
        let updated = false;
        currentState.Players.forEach((oP, i)=>{
            if(oP!==p){
                state.Players.setIn([i], p);
            }
        });
        if(updated){
            p.update();
        }
    });

    currentState.merge(
        Players,
        Motifs,
        Background
    );
}


let operation = fn(data);

switch(operation.type){
    case 'Player':
        state.Players.updateTimeline();
        break;
    case 'Motif':
        state.Motifs.updateTimeline();
        break;
    default:
        state.update()
}

let history = [];
let hIndex = 0;

//This could better be observer
function onActionTakenObserver(keyAction){
    let newState = state.update();
    let newStack = {
        state: newState,
        action
    };
    history.push(newStack);
    hIndex++;
}

function undo(){
    history[hIndex].action.undo();
    //etc
}

function redo(){
    history[hIndex].action.redo();
}

let keyAction = {
    thisAction: this.keyAction,
    key: function(newKey){

    }
    execute: function(){
        //Etc
        key(newKey);
        //Notify observers thisAction:
    }
    ,
    undo: function(){
        //get last key
        key(lastKey)
    }

    ,
    redo: function(){
        //get new key
        key(newKey)
    }
};

let createPlayerAction = {
    operation: function(){
        Player(param);
        notify(thisAction)
    },
    undo: function(){
        let isFound;
        let index;
        let oldState = {}, newState = {};
        oldState.Players = [];
        oldState.Players = newState.Players;
        newState.Players.forEach((newPlayer,i)=>{
            isFound = false;
            newState.Players.forEach((oldPlayer)=>{
                if(oldPlayer.uniqueID === newPlayer.uniqueID) isFound = true;
            });
            if(!isFound) index = i;
        });
        let player = Players.getPlayer(newState.Players[index].uniqueID);
        removePlayer(player);
    },
    redo: function(){
        Player(param)
    }
};
function redo(){

}

function Action(operation, redo, undo){
    return {
        execute: function(){
            operation();

        },
        redo: function(){
            redo()
        }
    }
}