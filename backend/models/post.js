const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {type: String, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true} // giving a reference of which ID it is
});
module.exports = mongoose.model('Post', postSchema);
