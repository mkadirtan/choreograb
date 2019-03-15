let history = [];
let historyIndex = -1;

/**
 * @return {string}
 */
export function CreateID(type){
    return type + '_' + Date.now().toString(36) + Math.random().toString(36).substr(2,5);
}

export let HistoryManager = {
    process: function(returned, action){
        history.push({returned, action});
        historyIndex++;
        console.log("Action processed!")
    },
    undo: function(){
        if( historyIndex > -1 ){
            let value = history[historyIndex].returned;
            if(value){
                let action = history[historyIndex].action;
                action.undo(value);
                historyIndex--;
                console.log("Undo successfull!")
            }
            else{
                console.log("Undo has no effect!");
                historyIndex--;
            }
        }
        else{
            console.log("No more undo available!")
        }
    },
    redo: function(){
        console.log(history);
        if( historyIndex < history.length - 1 ){
            let value = history[historyIndex+1].returned;
            if(value){
                let action = history[historyIndex+1].action;
                action.redo(value);
                historyIndex++;
                console.log("Redo successfull!")
            }
            else{
                console.log("Redo has no effect!");
                historyIndex++;
            }
        }
        else{
            console.log("No more redo available!")
        }
    }
};

export function HistoryAction(execute, undo, redo, that){
    let self = this;
    self.execute = function(){
        HistoryManager.process(execute(that), self);
    };
    self.redo = function(value){
        redo(value, that);
    };
    self.undo = function(value){
        console.log("Attempting undo");
        undo(value, that);
    };
}