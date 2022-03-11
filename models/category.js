const { model, Schema } = require('mongoose');

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  items: [{ type: Schema.Types.ObjectId, ref: 'item' }],
});

categorySchema.virtual('url', function () {
  return `/category/${this.name}`;
});

module.exports = model('category', categorySchema, 'category');
