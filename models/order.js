const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    glamping: {
      type: ObjectId,
      ref: "Glamping",
    },
    session: {},
    orderedBy: { type: ObjectId, ref: 'User' },
  },
  {timestamp: true}
);

module.exports = mongoose.model('Order', orderSchema);


