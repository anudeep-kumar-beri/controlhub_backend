const mongoose = require('mongoose');

const FinanceRecordSchema = new mongoose.Schema({
  store: { type: String, required: true }, // investments | income | expenses | loans | loan_payments | accounts | overrides | audit
  id: { type: String, required: true },    // client-generated id
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  deleted: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

FinanceRecordSchema.index({ store: 1, id: 1 }, { unique: true });
FinanceRecordSchema.index({ updatedAt: 1 });

module.exports = mongoose.model('FinanceRecord', FinanceRecordSchema);
