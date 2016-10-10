var City = require('./city');
var Position = require('./position');
var Job = require('./job');
var Ip = require('./ip');
var JobTotal = require('./jobTotal');

module.exports = {
  get $City () {
    return City;
  },
  get $Position () {
    return Position;
  },
  get $Job () {
    return Job;
  },
  get $Ip () {
    return Ip;
  },
  get $JobTotal () {
    return JobTotal;
  }
};