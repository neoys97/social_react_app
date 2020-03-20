import React from 'react';
import { getDateTime, compare } from './utils.js';
import $ from 'jquery';

class Header extends React.Component {
    constructor(props) {
      super (props);
      this.goProfile = this.goProfile.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
    }
  
    goProfile(e) {
      e.preventDefault(e);
      this.props.goProfile();
    }
  
    handleLogout(e) {
      e.preventDefault(e);
      this.props.handleLogout();
    }
  
    render() {
      return (
        <div id="header">
          <div id="profile" onClick={this.goProfile}>
            <div id="profile_pic">
              <img src={this.props.icon}/>
            </div>
            <div id="username">{this.props.username}</div>
          </div>
          <div id="sign_out_btn">
            <button type="sign_out_btn" onClick={this.handleLogout}>log out</button>
          </div>
        </div>
      );
    }
}

export default Header;