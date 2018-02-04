var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
  user_id : {type: String, unique: true},
  user_name: String,
  created_at: {
    type: Date,
    default: new Date()
  },
  voted: {
    type: String,
    default: 'experiment'
  }
});
module.exports = mongoose.model('Vote', schema);
