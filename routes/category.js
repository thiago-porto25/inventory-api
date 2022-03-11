const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAllCategories);

router.get('/:name', categoryController.getCategory);

router.post('/create', categoryController.createCategory);

router.put('/:name/update', categoryController.updateCategory);

router.delete('/:name/delete', categoryController.deleteCategory);

module.exports = router;
