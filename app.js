//jshint esversion:6
const md5=require("md5");
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema =new mongoose.Schema({
  email:String,
  password:String
});

const User=mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const username=req.body.username;
  const password=md5(req.body.password);

  const newUser=new User({
    email:username,
    password:password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  });
});

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=md5(req.body.password);
  User.findOne({email:username},function(err,result){
    if(err){
      console.log(err);
    }else{
      if(result){
        if(result.password===password){
          console.log(result.password);
          res.render("secrets");
        }else{
          res.send("Password does not match");
        }
      }else{
        res.send("No use found with this Username");
      }
    }
  });
});

app.listen(3000,function(){
  console.log("server is listening on port 3000");
});
