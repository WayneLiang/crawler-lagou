/**
 * Created by wayne on 16/9/30.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IpSchema = new Schema({
  proxy: { type: String, required: true }
});

IpSchema.index({proxy: 1});

module.exports = mongoose.model('Ip', IpSchema);