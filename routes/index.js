var express = require('express');
var router = express.Router();
const usersModel = require('./users')
const postsModel=require('./posts')
const passport = require('passport')
const upload = require('./multer')
const localStrategy = require("passport-local")
passport.use(new localStrategy(usersModel.authenticate()))//this is used to make the authentication process easy and here we are just telling the passport that we are using the local strategy for authentication and we are just using the authenticate method of the users model
  /* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile',isLoggedin, async function(req,res){
  let user= await usersModel.findOne({username:req.session.passport.user}).populate('posts')//here we are just finding the user with the username req.session.passport.user and then we are populating the posts array of that user with the posts data, popullating here means that we have id of the posts in the posts array of the user and we want to get the data of the posts so we are populating the posts array with the data of the posts

  res.render("profile",{user});
})
router.get('/login',function(req,res){
  res.render("login",{error:req.flash("error")})
})

router.get('/feeds',function(req,res){
  res.render('feeds')
})

router.post('/upload',isLoggedin,upload.single('file'), async function(req,res){
  if(!req.file){
    return res.status(404).send('file not uploaded')
  }
  const user = await usersModel.findOne({username: req.session.passport.user})//here we are just finding the user with the username req.session.passport.user and then we are creating the post with the data of the user
  const post = await postsModel.create({
postText : req.body.filecaption,
user: user._id,
image: req.file.filename
  })
  user.posts.push(post._id)//here we are just pushing the post id in the posts array of the user
  await user.save()
  res.send('done')
})

router.post('/register', function(req,res){
  let userData = new usersModel({
    username: req.body.username,
    email:req.body.email,
    fullname: req.body.fullname,
    
  })

  usersModel.register(userData, req.body.password).then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })
})

router.post('/login', passport.authenticate("local",{//this is a middleware which will be executed before the callback function of the route and here we are just telling the passport that we are using the local strategy for authentication and we are just using the authenticate method of the users model
  successRedirect : "/profile",//on successful login we will be redirected to the profile page
  failureRedirect : "/login",//on unsuccessful login we will be redirected to the home page
failureFlash:true//this is used to flash the error message if the login is unsuccessful and here we are just telling the passport to flash the error message if the login is unsuccessful
}), function(req,res){

})

router.get('/logout',function(req,res,next){
  req.logout(function(err) {//
    if (err) { return next(err); }
    res.redirect('/');
  });
})


function isLoggedin(req,res,next){
  if(req.isAuthenticated()){
     return next();
    } 
  res.redirect('/login');
}

//this is data modelling and data association into action which will be used in the project, here usersModel save postid in array format and postModel saves userid to identify which user has created the post
// router.get('/createuser',async function(req,res,next){
//  let createduser= await usersModel.create({
//     username:'admin2',
//     password:'admin',
//     email:'yoyo2@gmail.com',
//     fullname:'yoyo2',
//     posts:[]
// })

// res.send(createduser)
// })

// router.get('/getallpost', async function(req,res,next){
//   let singleuser=await usersModel.findOne({_id:"658145bcca940175ad8df801"}).populate('posts')//here we are just finding the user with id 658145bcca940175ad8df801 and then we are populating the posts array of that user with the posts data, popullating here means that we have id of the posts in the posts array of the user and we want to get the data of the posts so we are populating the posts array with the data of the posts
// res.send(singleuser)
// })

// router.get('/createpost', async function(req,res,next){
//   let createdpost=await postsModel.create({
//     postText: "Hello world kaise ho saare",
//     user:"658145bcca940175ad8df801"
//   })
//   let finded = await usersModel.findOne({_id:"658145bcca940175ad8df801"})//here we are just findin the user with id 658145bcca940175ad8df801 and then we are pushing the post id in the posts array of that user and then we are saving it
//   finded.posts.push(createdpost._id)
//   await finded.save()
//   res.send("completed")
  
// })

module.exports = router;
 