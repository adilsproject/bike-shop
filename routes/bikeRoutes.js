const express = require('express');
const bikeController = require('../controllers/bikeController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:bikeId/reviews', reviewRouter);

router.route('/top-5-cheap').get(bikeController.getTopCheapBikes);
router
  .route('/bike-stats')
  .get(
    authController.protect,
    authController.restrictTo('moder', 'admin'),
    bikeController.getBikeStats,
  );

router
  .route('/bikes-within/:distance/center/:latlng/unit/:unit')
  .get(bikeController.getBikesWithin);

router.route('/distances/:latlng/unit/:unit').get(bikeController.getDistances);

router
  .route('/')
  .get(bikeController.getAllBikes)
  .post(
    authController.protect,
    authController.restrictTo('moder', 'admin'),
    bikeController.createBike,
  );

router
  .route('/:id')
  .get(bikeController.getBike)
  .patch(
    authController.protect,
    authController.restrictTo('moder', 'admin'),
    bikeController.uploadBikeImages,
    bikeController.resizeBikeImages,
    bikeController.updateBike,
  )
  .delete(
    authController.protect,
    authController.restrictTo('moder', 'admin'),
    bikeController.deleteBike,
  );

module.exports = router;
