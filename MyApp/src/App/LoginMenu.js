import React from 'react';
import { getDateTime, compare } from './utils.js';
import $ from 'jquery';

class LoginMenu extends React.Component {
    constructor(props) {
        super(props);
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleUsername(e) {
        e.preventDefault(e);
        this.props.handleUsername(e.target.value);
    }

    handlePassword(e) {
        e.preventDefault(e);
        this.props.handlePassword(e.target.value);
    }

    handleLogin(e) {
        e.preventDefault(e);
        this.props.handleLogin(e);
    }

    render() {
        return (
        <div id="content">
            <div id="login">
            <form>
                <div className="login_input_option">Username</div>
                <input className="input_text"
                type="text"
                value={this.props.username}
                onChange={this.handleUsername}
                />
                <br/>
                
                <div className="login_input_option">Password</div>
                <input className="input_text"
                type="password"
                value={this.props.password}
                onChange={this.handlePassword}
                />
                <br/>

                <button className="login_btn" onClick={this.handleLogin}>Sign in</button>         
            </form>
            </div>
        </div>
        );
    }
}

export default LoginMenu;