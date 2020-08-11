//jshint esversion:6
//requiring express, bodyparser, ejs
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");


//setting constants to use in other pages
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//setting constant express
const app = express();

//setting view enjine to ejs
app.set('view engine', 'ejs');

//using bodyparser and express
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/blogDB");

//post schema to be used for model below
const postSchema = {
 title: String,
 content: String
};

//model/collection called post
const Post = mongoose.model("Post", postSchema);

//rendering the home page and inserting constant homeStartingContent into the variable declared above and used in ejs on home.ejs
app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });

});

//rendering the compose.ejs page
app.get("/compose", function(req, res){
  res.render("compose");
});

//using the post method to post whats been input on compose.ejs throught the name given to the input there which is postTitle
//and then using body parser to request by using "body" through req.body.postTitle & req.body.postBody
app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  //save post into DB and redirect to home only if no errors
  post.save(function(err){
   if (!err){
     res.redirect("/");
   }
 });
});

//route parameter grabbing postid from home.ejs
app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

// Post.deleteMany(  //to delete any posts in the future uncomment and subsitute post id
//   {
//     _id:
//       [
//         "5f32f5a61ee29b093c00176d",
//         "5f32f6517254d60eec52e256"
//       ]}
//     , function(err){
//   if (err){
//     console.log(err);
//   }
//   else {
//     console.log("Succesfully updated the document.");
//   }
// });

//rendering the about page and inserting constant aboutContent into the variable declared above and used in ejs on about.ejs
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
})

//rendering the contact page and inserting constant contactContent into the variable declared above and used in ejs on contact.ejs
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
