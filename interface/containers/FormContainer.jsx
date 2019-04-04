import React, { Component } from 'react';

/* Import Components */
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

class RegistrationForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            newUser: {
                name: "",
                email: "",
                username: "",
                password: ""
            },
        };
        this.handleTextArea = this.handleTextArea.bind(this);
        this.handleFullName = this.handleFullName.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }
    handleFullName(e){
        let value = e.target.value;
        this.setState(
            prevState=>({
                newUser: {
                    ...prevState.newUser,
                    name: value
                }
            })
        )
    }
    handleInput(e){
        let value = e.target.value;
        let name = e.target.name;
        this.setState(
            prevState => ({
                newUser: {
                    ...prevState.newUser,
                    [name]: value
                }
            })
        );
    }
    handleTextArea(e) {
        let value = e.target.value;
        this.setState(
            prevState => ({
                newUser: {
                    ...prevState.newUser,
                    about: value
                }
            })
        );
    }

    handleFormSubmit(e) {
        e.preventDefault();
        let userData = this.state.newUser;
        console.log(userData);

        fetch("/register", {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then(response => {
            response.json().then(data => {
                console.log("Successful" + data);
            });
        });
    }

    handleClearForm(e) {
        e.preventDefault();
        this.setState({
            newUser: {
                name: "",
                age: "",
                gender: "",
                skills: [],
                about: ""
            }
        });
    }
    render() {
        return (
            <form className="container-fluid" onSubmit={this.handleFormSubmit}>
                <Input
                    inputtype={"text"}
                    title={"Full Name"}
                    name={"name"}
                    value={this.state.newUser.name}
                    placeholder={"Enter your name"}
                    handlechange={this.handleInput}
                />{" "}
                {/* Name of the user */}
                <Input
                    inputtype={"text"}
                    title={"Username"}
                    name={"username"}
                    value={this.state.newUser.username}
                    placeholder={"Enter a username"}
                    handlechange={this.handleInput}
                />{" "}
                {/* Username of the user */}
                <Input
                    inputtype={"text"}
                    title={"Password"}
                    name={"password"}
                    value={this.state.newUser.password}
                    placeholder={"Enter a password"}
                    handlechange={this.handleInput}
                />{" "}
                {/* Password of the user */}
                <Input
                    inputtype={"text"}
                    title={"Re-enter password"}
                    name={"password2"}
                    value={this.state.newUser.password2}
                    placeholder={"Enter password again"}
                    handlechange={this.handleInput}
                />{" "}
                {/* Retype password of the user */}
                <Input
                    inputtype={"text"}
                    title={"E-mail"}
                    name={"email"}
                    value={this.state.newUser.email}
                    placeholder={"Enter your email"}
                    handlechange={this.handleInput}
                />{" "}
                {/* Email of the user */}
                <Button
                    action={this.handleFormSubmit}
                    type={"primary"}
                    title={"Submit"}
                    style={buttonStyle}
                />{" "}
                {/*Submit */}
                <Button
                    action={this.handleClearForm}
                    type={"secondary"}
                    title={"Clear"}
                    style={buttonStyle}
                />{" "}
                {/* Clear the form */}
            </form>
        );
    }
}

const buttonStyle = {
    margin: "10px 10px 10px 10px"
};

export default FormContainer;