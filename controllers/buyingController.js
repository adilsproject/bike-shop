const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Bike = require('../models/bikeModel');
const Buying = require('../models/buyingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getCheckOutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently bought bike
  const bike = await Bike.findById(req.params.bikeId);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?bike=${req.params.bikeId}&user=${req.user.id}&price=${bike.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/bike/${bike.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.bikeId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: bike.price * 100,
          product_data: {
            name: `${bike.fullName} Bike`,
            description: bike.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/bikes/${bike.imageCover}`,
            ],
          },
        },
      },
    ],
  });

  console.log('SESSION ID:', session.id);
  console.log('SESSION URL:', session.url);
  console.log('LIVEMODE:', session.livemode);

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBuyingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, unsecury
  const { bike, user, price } = req.query;

  if (!bike && !user && !price) return next();
  await Buying.create({ bike, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBuying = factory.createOne(Buying);
exports.getBuying = factory.getOne(Buying);
exports.getAllBuying = factory.getAll(Buying);
exports.updateBuying = factory.updateOne(Buying);
exports.deleteBuying = factory.deleteOne(Buying);
