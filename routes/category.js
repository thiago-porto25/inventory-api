const express = require('express');
const router = express.Router();
const {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} = require('../controllers/categoryController');

router.get('/', getAllCategories);

router.get('/:name', getCategory);

router.post('/create', createCategory);

router.put('/:name/update', updateCategory);

router.delete('/:name/delete', deleteCategory);

module.exports = router;
