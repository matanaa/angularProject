var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

//
// var SettingsSchema = new Schema({
//   collectionName : {
//     type : String, required: true, trim: true, default: 'Users'
//   },
//   nextSeqNumber: {
//     type: Number, default: 1
//   }
// });


var imagesSchema = new Schema({
    products : {
        type : Array, trim: true
    }
});


var ProductSchema = new Schema({
  Name : {
    type : String, required: true, trim: true
  },
  price : {
    type : Number, required: true, trim: true
  },
  type : {
    type : String, required: true, trim: true
  },
  stock : {
    type : Number, required: true, trim: true
  },
  producer : {
    type : String, required: true, trim: true
  },
  images: [imagesSchema],
});

//CustomerSchema.index({ id: 1, type: 1 }); // schema level

// I make sure this is the last pre-save middleware (just in case)
//var Settings = mongoose.model('settings', SettingsSchema);

exports.Product = ProductSchema;
module.exports = mongoose.model('Products', ProductSchema);
