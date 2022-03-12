const Item = require('../models/item');
const Category = require('../models/category');

const { body, validationResult } = require('express-validator');

exports.getItem = async (req, res, next) => {
  try {
    const id = req.params.id;
    const item = await Item.findById(id).populate(
      'category',
      'name _id description'
    );
    res.json({ item });
  } catch (error) {
    next(error);
  }
};

exports.createItem = [
  body('name')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Item name must be specified!'),
  body('description')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Item description must be specified!'),
  body('category', 'The item must be part of a category').isMongoId(),
  body('price', 'Price must be a number and bigger than 0!')
    .isNumeric()
    .isInt({ min: 1 }),
  body('number_in_stock', 'Number in stock must be a number!').isNumeric(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors.array()[0].msg);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    });

    try {
      const createdItem = await item.save();
      await Category.findByIdAndUpdate(req.body.category, {
        $push: { items: item._id },
      });

      res.json({ createdItem });
    } catch (error) {
      next(error);
    }
  },
];

exports.updateItem = [
  body('name')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Item name must be specified!'),
  body('description')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Item description must be specified!'),
  body('category', 'The item must be part of a category').isMongoId(),
  body('price', 'Price must be a number and bigger than 0!')
    .isNumeric()
    .isInt({ min: 1 }),
  body('number_in_stock', 'Number in stock must be a number!').isNumeric(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors.array()[0].msg);

    const item = new Item({
      _id: req.params.id,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    });

    try {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item);

      if (updatedItem.category !== item.category) {
        await Category.findByIdAndUpdate(updatedItem.category, {
          $pull: { items: item._id },
        });
        await Category.findByIdAndUpdate(item.category, {
          $push: { items: item._id },
        });
      }

      res.json({ updatedItem });
    } catch (error) {
      next(error);
    }
  },
];

exports.deleteItem = async (req, res, next) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.body.id);
    await Category.findByIdAndUpdate(deletedItem.category, {
      $pull: { items: req.body.id },
    });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
