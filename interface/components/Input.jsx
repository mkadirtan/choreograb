import React from "react";
import styles from '../styles';

const Input = props => {
    return (
        <div className="form-group">
            <label htmlFor={props.name} className="form-label" style={styles.label}>
                {props.title}
            </label>
            <input
                className="form-control"
                id={props.name}
                name={props.name}
                type={props.inputtype}
                value={props.value}
                onChange={props.handlechange}
                placeholder={props.placeholder}
                style = {styles.input}
                {...props}
            />
        </div>
    );
};

export default Input;