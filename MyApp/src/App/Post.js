import React from 'react';
import { getDateTime, compare } from './utils.js';
import $ from 'jquery';

class Post extends React.Component {
    constructor(props) {
      super (props);
      this.createPost = this.createPost.bind(this);
      this.createComment = this.createComment.bind(this);
      this.updateStar = this.updateStar.bind(this);
      this.postComment = this.postComment.bind(this);
      this.deleteComment = this.deleteComment.bind(this);
    }
  
    deleteComment(e) {
      e.preventDefault(e);
      this.props.deleteComment(e.currentTarget .getAttribute('comment_id'));
    }
  
    postComment(e) {
      e.preventDefault(e);
      if (e.key === "Enter") {
        var commentcontent = e.target.value;
        
        this.props.postComment(e.target.getAttribute('post_id'), commentcontent);
        e.target.value = "";
      }else{
        e.target.value += e.key;
      }
    }
  
    updateStar(e) {
      e.preventDefault(e);
      this.props.updateStar(e.currentTarget.getAttribute("data"));
    }
  
    createComment() {
      var comments = [];
      var i = 0;
      var commentList = this.props.comments;
      commentList.sort(compare);
      var doubleClick = null;
      for (var elem in this.props.comments) {
        if (commentList[i].postId === this.props.post_id) {
          var name = "";
          var comment_class = "comment_row";
          if (commentList[i].name === this.props.user_Id) {
            name = "You";
            comment_class = "comment_row_user";
            doubleClick = this.deleteComment;
          }
          else {
            var j = 0;
            for (var elem in this.props.friends) {
              if(this.props.friends[j]._id === commentList[i].name) {
                name = this.props.friends[j].name;
                doubleClick = null;
                break;
              }
              j++;
            }
          }
          comments.push(
            <div className={comment_class} comment_id={commentList[i]._id.toString()} onDoubleClick={doubleClick}>
              <div className="post_comment_time">{commentList[i].time}</div>
              <div className="post_comment"><span className="comment_user">{name}</span> said: <span className="comment_content">{commentList[i].content}</span></div>
            </div>
          )
        }
        i++;
      }
      return comments;
    }
  
    createPost() {
      var image = <img src={this.props.post_image}/>;
      var i = 0;
      var username = "";
      var star = "";
      for (var elem in this.props.friends) {
        if (this.props.user_Id === this.props.post_userId) {
          username = "You";
        }
        else {
          if(this.props.friends[i]._id === this.props.post_userId) {
            username=this.props.friends[i].name;
            if (this.props.friends[i].starredOrNot === "Y") {
              star = <div className="y_star" data={this.props.friends[i]._id} onClick={this.updateStar}>&#9733;</div>
            }
            else {
              star = <div className="n_star" data={this.props.friends[i]._id} onClick={this.updateStar}>&#9734;</div>
            }
            break;
          }
        }
        i++;
      }
      
      var post = (
        <div className="post">
          <div className="post_top">
            <div className="post_top_info">
              <div className="post_uns">
                <div className="post_username">{username}</div>
                <div className="post_star">{star}</div>
              </div>
              <div className="post_tloc">
                <div className="post_time">{this.props.post_time}</div>
                <div className="post_location">{this.props.post_location}</div>
              </div>
              <div className="post_content">{this.props.post_content}</div>
            </div>
            <div className="post_image">{image}</div>
          </div>
          <div className="post_bottom">
            {this.createComment()}
            <div className="post_comment_input">
              <form>
                <input className="comment_input_text"
                  type="text"
                  placeholder="write your comment here..."
                  post_id={this.props.post_id}
                  onKeyPress={this.postComment}
                />       
              </form>
            </div>
          </div>
        </div>
      )
      return post;
    }
  
    render() {
      return (
        <>
          {this.createPost()}
        </>
      )
    }
}

export default Post;