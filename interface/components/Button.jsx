import React from "react";
import styles from '../styles';

const Button = props => {
    return (
        <button
            style={styles.button}
            className={
                props.type === "primary" ? "btn btn-primary" : "btn btn-secondary"
            }
            onClick={props.action}
        >
            {props.title}
        </button>
    );
};

export default Button;
