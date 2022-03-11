const express = require('express');
const router = express.Router();
const {
  createItem,
  deleteItem,
  getItem,
  updateItem,
} = require('../controllers/ItemController');

/* GET users listing. */
router.get('/:id', getItem);

router.post('/create', createItem);

router.put('/:id/update', updateItem);

router.delete('/:id/delete', deleteItem);

module.exports = router;
