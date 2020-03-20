import React from 'react';
import { getDateTime, compare } from './utils.js';
import $ from 'jquery';

class StarredFriend extends React.Component {
    constructor(props) {
      super (props);
      this.createFriendList = this.createFriendList.bind(this);
    }
  
    createFriendList() {
      var i = 0;
      var starredFriends = [];
      for (var elem in this.props.friends) {
        if(this.props.friends[i].starredOrNot == "Y") {
          var element = <div className="starred_friends">{this.props.friends[i].name}</div>;
          starredFriends.push(element)
        }
        i++;
      }
      return starredFriends;
    }
  
    render() {
      
      return (
        <div id="starred_friends_container">
          <div className="starred_friends"><i>Starred Friends List</i></div>
          {this.createFriendList()}
        </div>
      );
    }
}

export default StarredFriend;