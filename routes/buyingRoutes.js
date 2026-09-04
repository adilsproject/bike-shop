const express = require('express');
const buyingController = require('../controllers/buyingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:bikeId', buyingController.getCheckOutSession);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(buyingController.getAllBuying)
  .post(buyingController.createBuying);

router
  .route('/:id')
  .get(buyingController.getBuying)
  .patch(buyingController.updateBuying)
  .delete(buyingController.deleteBuying);

module.exports = router;
