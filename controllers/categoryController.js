const Category = require('../models/category');

const { body, validationResult } = require('express-validator');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.find({ name: req.params.name }).populate(
      'items',
      { category: 0, __v: 0 }
    );
    res.json({ category });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = [
  (req, res, next) => {
    if (!(req.body.items instanceof Array)) {
      if (typeof req.body.items === 'undefined') req.body.items = [];
      else req.body.items = new Array(req.body.items);
    }
    next();
  },
  body('name')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Category name must be specified.')
    .isAlphanumeric()
    .withMessage('Category name has non-alphanumeric characters.'),
  body('description')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Category description must be specified.'),
  body('items.*').escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return next(errors.array());

    const category = new Category({
      name: req.body.name.toLowerCase(),
      description: req.body.description,
      items: typeof req.body.items === 'undefined' ? [] : req.body.items,
    });

    try {
      const createdCategory = await category.save();
      res.json({ createdCategory });
    } catch (error) {
      next(error);
    }
  },
];

exports.updateCategory = [
  (req, res, next) => {
    if (!(req.body.items instanceof Array)) {
      if (typeof req.body.items === 'undefined') req.body.items = [];
      else req.body.items = new Array(req.body.items);
    }
    next();
  },
  body('name')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Category name must be specified.')
    .isAlphanumeric()
    .withMessage('Category name has non-alphanumeric characters.'),
  body('description')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Category description must be specified.'),
  body('items.*').escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return next(errors.array());

    try {
      const [{ _id }] = await Category.find({ name: req.params.name }, '_id');

      const category = new Category({
        name: req.body.name.toLowerCase(),
        description: req.body.description,
        items: typeof req.body.items === 'undefined' ? [] : req.body.items,
        _id,
      });

      const updatedCategory = await Category.findByIdAndUpdate(
        { _id },
        category
      );

      res.json({ updatedCategory });
    } catch (error) {
      next(error);
    }
  },
];

exports.deleteCategory = async (req, res, next) => {
  try {
    const items = await Category.find({}, 'items');

    if (items.length) {
      return res
        .status(400)
        .send('You must delete all items in a Category before deleting it!');
    }

    await Category.deleteOne({ name: req.body.name });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
