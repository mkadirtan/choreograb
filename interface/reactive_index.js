import React, {Component} from 'react';
import { render } from 'react-dom';
import RegistrationForm from './containers/RegistrationForm';

class App extends Component {
    render(){
        return (
            <div>
                <h3> Registration Form </h3>
                <RegistrationForm />
            </div>
        )
    }
}

render(<App />, document.getElementById('root'));