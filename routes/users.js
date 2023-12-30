const mongoose = require('mongoose');
const plm=require('passport-local-mongoose') //this is used to make the authentication process easy
mongoose.connect("mongodb://127.0.0.1:27017/pinverse")
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  dp: {
    type: String,
    default: 'default-profile.jpg'
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    required: true
  },
  posts: [
{
  type:mongoose.Schema.Types.ObjectId,//here we will be just storing the id of the post which the user has created
  ref:'Post'
}
  ]
  // You can add more fields as needed
});

userSchema.plugin(plm)//this is used to make the authentication process easy
const User = mongoose.model('User', userSchema);

module.exports = User;
