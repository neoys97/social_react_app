import React, { Profiler } from 'react';
import { getDateTime, compare } from './utils.js';
import $ from 'jquery';

class Profile extends React.Component {
    constructor(props) {
      super(props);
      this.handleHomeNumber = this.handleHomeNumber.bind(this);
      this.handleMobileNumber = this.handleMobileNumber.bind(this);
      this.handleAddress = this.handleAddress.bind(this);
      this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
    }
  
    handleHomeNumber(e) {
      e.preventDefault(e);
      this.props.handleHomeNumber(e.target.value);
    }
  
    handleMobileNumber(e) {
      e.preventDefault(e);
      this.props.handleMobileNumber(e.target.value);
    }
  
    handleAddress(e) {
      e.preventDefault(e);
      this.props.handleAddress(e.target.value);
    }
  
    handleUpdateProfile(e) {
      e.preventDefault(e);
      this.props.handleUpdateProfile();
    }
  
    render() {
      return (
        <div id="profile_container">
          <div id="profile_top" onClick={this.goProfile}>
            <div id="profile_top_pic">
              <img src={this.props.icon}/>
            </div>
            <div id="profile_top_username">{this.props.username}</div>
            <div id="profile_info">
              <form>
                <div className="profile_input_option">Mobile Number:</div>
                <input className="profile_input_text"
                  type="text"
                  value={this.props.mobile_no}
                  onChange={this.handleMobileNumber}
                />
                <br/>
                
                <div className="profile_input_option">Home Number:</div>
                <input className="profile_input_text"
                  type="text"
                  value={this.props.home_no}
                  onChange={this.handleHomeNumber}
                />
                <br/>
  
                <div className="profile_input_option">Mailing address:</div>
                <input className="profile_input_text"
                  type="text"
                  value={this.props.address}
                  onChange={this.handleAddress}
                />
                <br/>
                <div className="profile_btn">
                  <button onClick={this.handleUpdateProfile}>Save</button>    
                </div>     
              </form>
            </div>
          </div>
        </div>
      )
    }
}

export default Profile;