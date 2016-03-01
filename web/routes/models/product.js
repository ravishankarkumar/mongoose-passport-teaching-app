var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
      name : {type: String, default: 'Stylish T-shirt'},
      price : {type: Number, default : 499}
});
module.exports = mongoose.model('Product', schema);
