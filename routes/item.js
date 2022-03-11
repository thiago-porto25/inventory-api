const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/ItemController');

/* GET users listing. */
router.get('/:id', ItemController.getItem);

router.post('/create', ItemController.createItem);

router.put('/:id/update', ItemController.updateItem);

router.delete('/:id/delete', ItemController.deleteItem);

module.exports = router;
