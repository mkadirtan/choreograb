import {timeControl} from "./timeline";
import {Motifs} from "./motifs";
import {uuidv4} from 'uuid/v4'

let history = [];
let historyIndex = 0;

/**
 * @return {string}
 */
export function CreateID(type){
    return type.substr(0,3) + Date.now().toString(36) + Math.random().toString(36).substr(2,5);
}

export function Action(execute, undo, redo, that){
    this.execute = function(){
        let currentState = history[historyIndex];
        let returned = execute(that, currentState);
        let newEntry = currentState.withMutations(map=>{
            map.
            set('action', this).
            set('returned', returned).
            setIn(returned.path, returned.value);
        });
        ActionManager.process(newEntry);
    };
    this.redo = function(value){
        redo(that, value);
    };
    this.undo = function(value){
        undo(that, value);
    };
}

let ActionManager = {
    process: function(newEntry){
        history.push(newEntry);
        historyIndex++;
    },
    undo: function(){
        let previous = history[historyIndex-1];
        let current = history[historyIndex];

        let path = current.get('returned').path;
        let value = previous.getIn(path);

        let action = current.get('action');
        action.undo(value);

        historyIndex--;
    },
    redo: function(){
        let next = history[historyIndex+1];

        let value = next.get('returned').value;

        let action = next.get('action');
        action.redo(value);

        historyIndex++;
    }
};