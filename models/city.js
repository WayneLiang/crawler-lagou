/**
 * Created by wayne on 16/9/27.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CitySchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true},
  label: { type: String, required: true}
});

// CitySchema.index({name: 1});

module.exports = mongoose.model('City', CitySchema);