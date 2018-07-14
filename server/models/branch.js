var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;


var SettingsSchema = new Schema({
    collectionName : {
        type : String, required: true, trim: true, default: 'Branches'
    },
    nextSeqNumber: {
        type: Number, default: 1
    }
});

var BranchSchema = new Schema({
    name : {
        type : String, required: true, trim: true
    },
    phone : {
        type : String, required: true, trim: true
    },
    openingHours : {
        type : String, required: true, trim: true
    },
    longitude : {
        type : Number, required: true, trim: true
    },
    latitude : {
        type : String, required: true, trim: true
    },
});

BranchSchema.index({ id: 1, type: 1 }); // schema level

// I make sure this is the last pre-save middleware (just in case)
var Settings = mongoose.model('settings', SettingsSchema);

BranchSchema.pre('save', function(next) {
    var doc = this;
    // Calculate the next id on new branches only.
    if (this.isNew) {
        Settings.findOneAndUpdate( {"collectionName": "Branch"}, { $inc: { nextSeqNumber: 1 } }, function (err, settings) {
            if (err) next(err);
            doc.id = settings.nextSeqNumber - 1; // substract 1 because I need the 'current' sequence number, not the next
            next();
        });
    } else {
        next();
    }
});

exports.Branch = BranchSchema;
module.exports = mongoose.model('Branches', BranchSchema);
