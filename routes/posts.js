const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  image:{type: String,
  required : true},
  postText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Array,
    default: []
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,//here we will be just storing the id of the user who created the post
    ref:'User'//ref stands for reference and here we are just referencing the user model
  }
  // You can add more fields as needed
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
