import React from 'react';
import Post from './Post';
import { getDateTime, compare } from './utils.js';
import $ from 'jquery';

class PostList extends React.Component {
    constructor(props) {
      super (props);
      this.createPostList = this.createPostList.bind(this);
    }
  
    createPostList() {
      var i = 0;
      var postList = [];
      var posts = this.props.post;
      posts.sort(compare);
      for (var elem in this.props.post) {
        postList.push(<Post
          user_Id={this.props.userId}
          post_id={posts[i]._id}
          post_content={posts[i].content}
          post_time={posts[i].time}
          post_location={posts[i].location}
          post_image={posts[i].image}
          post_userId={posts[i].userId}
          friends={this.props.friends}
          comments={this.props.comment}
          updateStar={this.props.updateStar}
          postComment={this.props.postComment}
          deleteComment={this.props.deleteComment}
        />)
        i++;
      }
      return postList;
    }
  
    render() {
      return (
        <div id="post_container">
  
          {this.createPostList()}
        
        </div>
      )
    }
}

export default PostList;