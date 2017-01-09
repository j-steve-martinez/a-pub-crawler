'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    uid: String,
    name: String,
    list: [{key: String, value: Number}]
});

module.exports = mongoose.model('Poll', Poll);
