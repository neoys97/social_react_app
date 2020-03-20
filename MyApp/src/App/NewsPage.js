import React from 'react';
import Header from './Header';
import StarredFriend from './StarredFriend';
import PostList from './PostList';
import Profile from './Profile';
import { getDateTime, compare } from './utils.js';
import $ from 'jquery';

class NewsPage extends React.Component {
    constructor(props) {
      super (props);
    }
  
    render() {
      return (
        <div id="content">
          <Header
            username={this.props.json.name}
            icon={this.props.json.icon}
            goProfile={this.props.goProfile}
            handleLogout={this.props.handleLogout}
          />
            <div id="bottom_content">
              <div id="left_panel">
                <StarredFriend
                  friends={this.props.json.friends}
                />
              </div>
              <div id="right_panel">
                { this.props.profile ? 
                  <Profile
                    username={this.props.json.name}
                    icon={this.props.json.icon}
                    home_no={this.props.home_no}
                    mobile_no={this.props.mobile_no}
                    address={this.props.address}
                    handleHomeNumber={this.props.handleHomeNumber}
                    handleMobileNumber={this.props.handleMobileNumber}
                    handleAddress={this.props.handleAddress}
                    handleUpdateProfile={this.props.handleUpdateProfile}
                  />
                  :
                  <PostList
                    userId={this.props.json._id}
                    post={this.props.json.post}
                    comment={this.props.json.comment}
                    friends={this.props.json.friends}
                    updateStar={this.props.updateStar}
                    postComment={this.props.postComment}
                    deleteComment={this.props.deleteComment}
                  />
                }
              </div>
            </div>
        </div>
      );
    }
}

export default NewsPage;