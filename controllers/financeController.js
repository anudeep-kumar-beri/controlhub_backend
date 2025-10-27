const FinanceRecord = require('../models/financeRecord');

// POST /api/finance/push
// Body: { records: [ { store, id, data, updatedAt?, deleted? } ] }
exports.pushRecords = async (req, res) => {
  try {
    const { records } = req.body || {};
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: 'records array required' });
    }

    const ops = records.map(r => ({
      updateOne: {
        filter: { store: r.store, id: r.id },
        update: {
          $set: {
            store: r.store,
            id: r.id,
            data: r.data,
            deleted: !!r.deleted,
            // If client provided updatedAt, use it; else use server time via timestamps option
            ...(r.updatedAt ? { updatedAt: new Date(r.updatedAt) } : {})
          }
        },
        upsert: true
      }
    }));

    if (ops.length) {
      await FinanceRecord.bulkWrite(ops, { ordered: false });
    }

    res.json({ ok: true, upserted: ops.length });
  } catch (err) {
    console.error('pushRecords error', err);
    res.status(500).json({ error: 'internal_error' });
  }
};

// GET /api/finance/pull?since=ISO_DATE
exports.pullChanges = async (req, res) => {
  try {
    const { since } = req.query;
    const sinceDate = since ? new Date(since) : null;
    const q = sinceDate && !isNaN(sinceDate) ? { updatedAt: { $gt: sinceDate } } : {};
    const docs = await FinanceRecord.find(q).lean().exec();
    res.json({ records: docs });
  } catch (err) {
    console.error('pullChanges error', err);
    res.status(500).json({ error: 'internal_error' });
  }
};
