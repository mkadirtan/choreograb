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
        let returned = execute(that);
        let newEntry = history[historyIndex].withMutations(map=>{
            map.
            setIn(returned.path, returned.data).
            set('actionPath', returned.path).
            set('action', this);
        });
        ActionManager.process(newEntry);
    };
    this.redo = function(data, path){
        redo(that, data, path);
    };
    this.undo = function(data, path){
        undo(that, data, path);
    };
}

let ActionManager = {
    process: function(newEntry){
        history.push(newEntry);
        historyIndex++;
    },
    undo: function(){
        let previous = history[historyIndex-1];

        let path = previous.get('actionPath');
        let data = previous.getIn(path);

        let action = previous.get('action');
        action.undo(data, path);

        historyIndex--;
    },
    redo: function(){
        let next = history[historyIndex+1];

        let path = next.get('actionPath');
        let data = next.getIn(path);

        let action = next.get('action');
        action.redo(data, path);

        historyIndex++;
    }
};