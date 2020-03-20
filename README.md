# Social App (React App)

Simple social web application built using React.js (coursework)

## Getting Started
### Setup
Set up a mongodb server and insert databse entries with the following format:
```
db.userList:
{ "_id" : ObjectId("5cc93714a724e533e99833c6"), "name" : "Jenny", "password" : "123456", "icon" : "icons/jenny.png", "mobileNumber" : "00000000", "homeNumber" : "66674545", "address" : "My House", "friends" : [ { "friendId" : "5cc9376ea724e533e99833c9", "starredOrNot" : "Y" }, { "friendId" : "5cc93b9ba724e533e99833ca", "starredOrNot" : "Y" } ], "lastCommentRetrievalTime" : "12:10:26 Sat May 04 2019" }

db.commentList:
{ "_id" : ObjectId("5cc93df1a724e533e99833ce"), "postId" : "5cc93d5aa724e533e99833cb", "userId" : "5cc93b9ba724e533e99833ca", "postTime" : "11:49:09 Thu May 02 2019", "comment" : "Andy comments on Louise", "deleteTime" : "00:16:43 Sat May 04 2019" }

db.postList:
{ "_id" : ObjectId("5cc93d5aa724e533e99833cb"), "userId" : "5cc93714a724e533e99833c6", "time" : "20:32:01 Sat Apr 14 2019", "location" : "Hong Kong", "content" : "post content from Louise", "image" : "images/post2.jpg" }
```
Installing dependencies: Run the following command in both MyApp and SocialService
```
npm install
```
Change the database path in SocialService/app.js accordingly
### Running the app
Launch mongodb database
In SocialService, run:
```
node app.js
```
In MyApp, run:
```
npm start
```

## Basic Functionalities
* Simple user login and logout
* Change user information
* Comment on other user's post
* Real time comment update