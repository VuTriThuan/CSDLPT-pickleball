const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true,
    enum: ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ'] // Demo branches
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
