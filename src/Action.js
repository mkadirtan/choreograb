import {List, Map} from 'immutable';
import {Players} from './players';
import {Motifs} from './motifs';
import {Guides} from './guides';


let history = [];
let historyIndex = -1;

/**
 * @return {string}
 */
export function CreateID(type){
    return type + '_' + Date.now().toString(36) + Math.random().toString(36).substr(2,5);
}

function initState(){
    historyIndex = 0;
    let newItem = Map({
        Players : List(Players),
        Motifs  : List(Motifs.motifs),
        Guides  : List(Guides),
        action  : null,
        returned: null
    });
    history.push(newItem);
}

export function Action(execute, undo, redo, that){
    this.execute = function(){
        if(historyIndex === -1) initState();
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

export let ActionManager = {
    process: function(newEntry){
        history.push(newEntry);
        historyIndex++;
    },
    undo: function(){
        let previous = history[historyIndex-1];
        console.log(previous);
        let current = history[historyIndex];
        console.log(current);
        let path = current.get('returned').path;
        console.log(path);
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