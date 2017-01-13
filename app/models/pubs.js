'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Pub = new Schema({
    uid: String,
    pubId: String,
});

module.exports = mongoose.model('Pub', Pub);
