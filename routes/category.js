const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// CRUD Category
router.get('/', categoryController.index);
router.get('/add', categoryController.showForm);
router.post('/add', categoryController.create);
router.get('/edit/:id', categoryController.showForm);
router.post('/edit/:id', categoryController.update);
router.post('/delete/:id', categoryController.delete);

module.exports = router;
