const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Device = new Schema({
  device_name: {
    type: String
  },
  pwr_action: {
    type: Boolean
  }
});

module.exports = mongoose.model('Device', Device);