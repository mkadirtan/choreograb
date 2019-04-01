import React, {Component} from 'react';
import { render } from 'react-dom';
import FormContainer from './containers/FormContainer';

class App extends Component {
    render(){
        return (
            <div>
                <h3> Registration Form </h3>
                <FormContainer />
            </div>
        )
    }
}

render(<App />, document.getElementById('root'));