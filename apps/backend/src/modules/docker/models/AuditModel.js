const mongoose = require('mongoose');



const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const AuditSchema = new Schema({

 user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: false, index: false},
 action: {type: String, enum: ['RESTART','UPDATE','REMOVE','CREATE'], required: true, index: false},
 target: {type: String, required: true, unique: false, index: false}


}, { timestamps: true });




AuditSchema.plugin(mongoosePaginate);
AuditSchema.plugin(uniqueValidator, {message: 'validation.unique'});

const Audit = mongoose.model('Audit', AuditSchema);

module.exports = Audit;
