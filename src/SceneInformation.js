import { Map, List} from 'immutable';
import {Actions} from './Actions';

let history = new List();
let historyIndex = 0;

let onActionObservable = new BABYLON.Observable();

let newAction =
{
    name: 'playerKeyAction',
    data: {
        path: [
            uuid, keys, motif
        ]
        x: 1,
        y: 1,
        z: 1
    }
};

let counterAction =
    {
        name: 'playerKeyAction',
        data:
    }


onActionObservable.add((action, counterAction)=>{
    //Delete redo history
    history = history.slice(0, historyIndex + 1);

    //Get current state
    let state = history[historyIndex];

    //Get operation
    let operation = Actions.getActionByName(action.name);

    //Create new state
    let newScene = operation(state, action.data);

    //Push new state
    history.push(new Immutable.Map({
        scene: newScene,
        action,
        counterAction
    }));

    //Update objects
    updateScene(action);
});

function undo(){
    //Get current state
    let state = history[historyIndex];

    //Get previous state
    let previousState = history[historyIndex-1];

    //Get operation
    let operation = Actions.getCounterActionByState(state);

    //Apply operation
    let oldState = operation(previousState)

}