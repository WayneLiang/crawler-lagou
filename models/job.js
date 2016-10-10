/**
 * Created by wayne on 16/9/27.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobSchema = new Schema({
  name: { type: String },
  code: { type: String},
  label: { type: String},
  companyId: { type: Number },
  positionName: { type: String },
  workYear: { type: String },
  education: { type: String },
  jobNature: { type: String },
  createTime: { type: String },
  companyShortName: { type: String },
  positionId: { type: Number , index: { unique: true }},
  salary: { type: String },
  approve: { type: Number },
  city: { type: String },
  positionAdvantage: { type: String },
  companyLogo: { type: String },
  industryField: { type: String },
  companyLabelList:{ type: Array },
  financeStage: { type: String },
  district: { type: String },
  score: { type: Number },
  companySize: { type: String },
  formatCreateTime: { type: String },
  businessZones: { type: String },
  imState: { type: String },
  companyFullName: { type: String },
  adWord: { type: Number },
  lastLogin: { type: Number},
  publisherId: { type: Number },
  explain: { type: String },
  plus: { type: String },
  pcShow: { type: Number },
  appShow: { type: Number },
  deliver: { type: Number },
  gradeDescription: { type: String },
  promotionScoreExplain: { type: String },
  position: { type: String},
  firstTag: { type: String},
  secondTag: { type: String},
  cityName: { type: String },
  avgsalary: { type: Number }

});

// JobSchema.index({positionId: 1});

module.exports = mongoose.model('Job', JobSchema);