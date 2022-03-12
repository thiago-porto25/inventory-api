const { model, Schema } = require('mongoose');

const itemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true },
});

itemSchema.virtual('url', function () {
  return `/item/${this._id}`;
});

module.exports = model('item', itemSchema, 'item');
