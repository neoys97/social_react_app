import React from 'react';
import LoginMenu from './LoginMenu';
import NewsPage from './NewsPage';
import { getDateTime, compare } from './utils.js';
import '../App.css';
import $ from 'jquery';

class MainPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		_id: '',
		username: '',
		password: '',
		mobile_no: '',
		home_no: '',
		address: '',
		cookieSet: '',
		jsonData: '',
		profile: '',
		loginFail: false,
		};
		this.handleLogin = this.handleLogin.bind(this);
		this.handleUsername = this.handleUsername.bind(this);
		this.handlePassword = this.handlePassword.bind(this);
		this.handleHomeNumber = this.handleHomeNumber.bind(this);
		this.handleMobileNumber = this.handleMobileNumber.bind(this);
		this.handleAddress = this.handleAddress.bind(this);
		this.handleAddress = this.handleAddress.bind(this);
		this.goProfile = this.goProfile.bind(this);
		this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.updateStar = this.updateStar.bind(this);
		this.postComment = this.postComment.bind(this);
		this.deleteComment = this.deleteComment.bind(this);
		this.updateComment = this.updateComment.bind(this);
		// this.handleComment = this.handleComment.bind(this);
		this.checkCookie = this.checkCookie.bind(this);
	}

	handleUsername(un) {
		this.setState({username : un});
	}

	handlePassword(pw) {
		this.setState({password : pw});
	}

	handleHomeNumber(hn) {
		this.setState({home_no : hn});
	}

	handleMobileNumber(mn) {
		this.setState({mobile_no : mn});
	}

	handleAddress(ad) {
		this.setState({address : ad});
	}

	setProfile(mn, hn, ad) {
		this.setState({mobile_no : mn});
		this.setState({home_no : hn});
		this.setState({address : ad});
	}

	goProfile() {
		$.ajax({
		url: "http://localhost:3001/getuserprofile",
		type: "GET",
		xhrFields:{
			withCredentials: true
		},
		success: function(data) {
			if (data) {
			var json = JSON.parse(data);    
			this.setProfile(json.mobileNumber, json.homeNumber, json.address);
			}
		}.bind(this),
		error: function (xhr, ajaxOptions, thrownError) {
			alert(thrownError);
		}.bind(this)
		});
		this.setState({profile : '1'});
	}

	handleUpdateProfile() {
		$.ajax({
		url: "http://localhost:3001/saveuserprofile",
		type: "PUT",
		xhrFields:{
			withCredentials: true
		},
		data: { 
			"userId" : this.state._id, 
			"mobileNumber" : this.state.mobile_no,
			"homeNumber" : this.state.home_no, 
			"address" : this.state.address 
		},
		success: function(data) {
		}.bind(this),
		error: function (xhr, ajaxOptions, thrownError) {
			alert(thrownError);
		}.bind(this)
		});
		this.setState({profile : ''});
	}

	handleLogout() {
		this.setState({cookieSet : ""});
		$.ajax({
		url: "http://localhost:3001/logout",
		type: "GET",
		xhrFields:{
			withCredentials: true
		},
		success: function(data) {
		}.bind(this),
		error: function (xhr, ajaxOptions, thrownError) {
		}.bind(this)
		});
	}

	handleLogin(e) {
		e.preventDefault(e);
		$.ajax({
		url: "http://localhost:3001/signin",
		type: "POST",
		xhrFields:{
			withCredentials: true
		},
		data: { 
			"username" : this.state.username, 
			"password" : this.state.password 
		},
		success: function(data) {      
			if (data) {
			var json = JSON.parse(data);  
			this.setState ({jsonData : json});
			this.setState ({cookieSet : "1"});
			this.setState({_id : json._id});
			this.setState ({loginFail : false});
			}
			else {
			this.setState ({loginFail : true});
			}
		}.bind(this),
		error: function (xhr, ajaxOptions, thrownError) {
			alert(thrownError);
		}.bind(this)
		});
	}

	updateStar(ID) {
		var link = "http://localhost:3001/updatestar/" + ID;
		$.ajax({
		url: link,
		type: "GET",
		xhrFields:{
			withCredentials: true
		},
		success: function(data) {
			var i = 0;
			var json = this.state.jsonData;
			for (var elem in json.friends) {
			if (json.friends[i]._id == ID) {
				json.friends[i].starredOrNot = (json.friends[i].starredOrNot == "Y") ? "N" : "Y";
				break;
			}
			i++;
			}
			this.setState ({jsonData : json});
		}.bind(this),
		error: function (xhr, ajaxOptions, thrownError) {
			alert(thrownError);
		}.bind(this)
		});
	}

	postComment(postID, newComment) {

		var link = "http://localhost:3001/postcomment/" + postID;
		$.ajax({
		url: link,
		type: "POST",
		xhrFields:{
			withCredentials: true
		},
		data: { 
			"comment" : newComment
		},
		success: function(data) {
		}.bind(this),
		error: function (xhr, ajaxOptions, thrownError) {
			alert(thrownError);
		}.bind(this)
		});
	}

	deleteComment(commentID) {

		var proceed = window.confirm("Delete this message?");
		if (proceed) {
		var link = "http://localhost:3001/deletecomment/" + commentID;
		$.ajax({
			url: link,
			type: "DELETE",
			xhrFields:{
			withCredentials: true
			},
			success: function(data) {
			this.checkCookie();
			}.bind(this),
			error: function (xhr, ajaxOptions, thrownError) {
			alert(thrownError);
			}.bind(this)
		});
		}
	}

	updateComment() {
		var test = this.state.jsonData.comment;
		$.ajax({
		url: "http://localhost:3001/loadcommentupdates",
		type: "GET",
		xhrFields:{
			withCredentials: true
		},
		success: function(data) {
			if (data) {
			var incomingJson = JSON.parse(data);  
			var newJson = this.state.jsonData;
			var i = 0;
			for (var elem in incomingJson.comments) {
				var j = 0;
				var duplicate = false;
				for (var elem1 in newJson.comment) {
				if (incomingJson.comments[i]._id == newJson.comment[j]._id) {
					duplicate = true;
					break;
				}
				j ++;
				}
				if(! duplicate)
				newJson.comment.push(incomingJson.comments[i]);
				i++;
			}
			i = 0;
			for (var elem in incomingJson.delcomments) {
				var j = 0;
				for (var elem1 in newJson.comment) {
				if (incomingJson.delcomments[i] == newJson.comment[j]._id) {
					newJson.comment.splice(j,1);
					break;
				}
				j ++;
				}
				i++;
			}
			this.setState({jsonData:newJson});
			}
		}.bind(this),
		error: function (xhr, ajaxOptions, thrownError) {
			alert(thrownError);
		}.bind(this)
		});
	}

	checkCookie() {
		$.ajax({
		url: "http://localhost:3001/checkcookie",
		type: "GET",
		xhrFields:{
			withCredentials: true
		},
		success: function(data) {
			if (data) {
			var json = JSON.parse(data);    
			this.setState({jsonData : json});
			this.setState({cookieSet : "1"});
			this.setState({_id : json._id});
			this.updateComment()
			}
		}.bind(this),
		error: function (xhr, ajaxOptions, thrownError) {
			alert(thrownError);
		}.bind(this)
		});
	}

	componentDidMount() {
		this.checkCookie();
		this.timeID = setInterval(this.updateComment, 500);
	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	render() {

		return (
		<div id="wrapper">
			{ this.state.loginFail ? <div id="login_fail_message"><h3>Login Failure</h3></div> : <></>}
			<div id="app_title"><h1>A++ Social App</h1></div>
			
			{ this.state.cookieSet ? 
			<NewsPage
				json={this.state.jsonData}
				goProfile={this.goProfile}
				profile={this.state.profile}
				home_no={this.state.home_no}
				mobile_no={this.state.mobile_no}
				address={this.state.address}
				handleHomeNumber={this.handleHomeNumber}
				handleMobileNumber={this.handleMobileNumber}
				handleAddress={this.handleAddress}
				handleUpdateProfile={this.handleUpdateProfile}
				handleLogout={this.handleLogout}
				updateStar={this.updateStar}
				postComment={this.postComment}
				deleteComment={this.deleteComment}
			/>
			:
			<LoginMenu 
				username={this.state.username}
				password={this.state.password}
				profile={this.state.profile}
				handleUsername={this.handleUsername}
				handlePassword={this.handlePassword}
				handleLogin={this.handleLogin}
			/>
			}
		</div>
		);
	}
}

export default MainPage;