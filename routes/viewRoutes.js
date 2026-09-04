const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const buyingController = require('../controllers/buyingController');

const router = express.Router();

router.get(
  '/',
  buyingController.createBuyingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview,
);
router.get('/bike/:slug', authController.isLoggedIn, viewsController.getBike);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-bikes', authController.protect, viewsController.getMyBikes);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData,
);

module.exports = router;
