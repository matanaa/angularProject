var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var productSettingsSchema = new Schema({
    collectionName : {
        type : String, required: true, trim: true, default: 'Products'
    },
    nextSeqNumber: {
        type: Number, default: 1
    }
});


var imagesSchema = new Schema({
    products : {
        type : Array, trim: true
    }
});


var ProductSchema = new Schema({
  Name : {
    type : String, required: true, trim: true
  },
    id : {
        type : Number, required: true, unique: true
    },  price : {
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

ProductSchema.index({ id: 1, type: 1 }); // schema level

// I make sure this is the last pre-save middleware (just in case)
var Settings = mongoose.model('Settings', productSettingsSchema);

ProductSchema.pre('validate', function(next) {
    var doc = this;
    // Calculate the next id on new Customers only.
    if (this.isNew) {
        Settings.findOneAndUpdate( {"collectionName": "Products"}, { $inc: { nextSeqNumber: 1 } }, function (err, settings) {
            if (err) next(err);
            doc.id = settings.nextSeqNumber - 1; // substract 1 because I need the 'current' sequence number, not the next
            next();
        });
    } else {
        next();
    }
});

exports.Product = ProductSchema;
module.exports = mongoose.model('Products', ProductSchema);
