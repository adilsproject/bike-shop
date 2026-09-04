const Bike = require('../models/bikeModel');
const User = require('../models/userModel');
const Buying = require('../models/buyingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get bike data from collection
  const bikes = await Bike.find();

  // 2) Build template

  // 3) Render that template
  res.status(200).render('overview', {
    title: 'All Bikes',
    bikes,
  });
});

exports.getBike = catchAsync(async (req, res, next) => {
  console.log('SLUG:', req.params.slug);
  //1) get the data, for the requested tour
  const bike = await Bike.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!bike) {
    return next(new AppError('There is no bike with that name.', 404));
  }
  //2) Build template
  //3) Render template usint data from 1

  res.status(200).render('bike', {
    title: `${bike.fullName} Bike`,
    bike,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyBikes = catchAsync(async (req, res, next) => {
  // 1) Find all buyings
  const buyings = await Buying.find({ user: req.user.id });

  // 2) FInd bikes the returned IDs
  const bikeIDs = buyings.map((el) => el.bike);
  const bikes = await Bike.find({ _id: { $in: bikeIDs } });

  res.status(200).render('overview', {
    title: 'My bikes',
    bikes,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
