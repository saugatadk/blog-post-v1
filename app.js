const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');
const content = require(__dirname + "/content.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB");

const postSchema = new mongoose.Schema({
  title: String,
  body: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({})
  .then((posts)=>{
    res.render("home", {homeContent: content.homeStartingContent(), posts: posts});
  })
  .catch((err)=>{
    console.log(err);
  })
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: content.aboutContent()});
});

app.get("/contact", (req, res) =>{
  res.render("contact", {contactContent: content.contactContent});
});

app.get("/compose", (req, res) =>{
  res.render("compose");
});

app.post("/compose", (req, res)=>{
  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  });

  async function saveAndRedirect(){
    try{
      await post.save();
      res.redirect("/");
    }
    catch(err){
      console.log("ERROR: " + err);
    }
    finally{
      mongoose.connection.close();
    }
  }
  saveAndRedirect();
})

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId})
  .then((post)=>{
    res.render("post", {heading: post.title, paragraph: post.body});
  })
  .catch((err)=>{
    console.log(err);
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
