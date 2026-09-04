const multer = require('multer');
const sharp = require('sharp');
const Bike = require('../models/bikeModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadBikeImages = upload.fields([
  { name: 'imagesCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeBikeImages = catchAsync(async (req, res, next) => {
  if (!req.files.imagesCover || !req.files.images) return next();

  // 1 Cover Image
  req.body.imagesCover = `bike-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imagesCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imagesCover}`);

  // 2 Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `bike-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    }),
  );

  next();
});

exports.getAllBikes = factory.getAll(Bike);
exports.getBike = factory.getOne(Bike, { path: 'reviews' });

exports.createBike = factory.createOne(Bike);
exports.updateBike = factory.updateOne(Bike);
exports.deleteBike = factory.deleteOne(Bike);

exports.getTopCheapBikes = catchAsync(async (req, res, next) => {
  const bikes = await Bike.find().sort('price').limit(5).select('name price');

  res.status(200).json({
    status: 'success',
    results: bikes.length,
    data: {
      bikes,
    },
  });
});

exports.getBikeStats = catchAsync(async (req, res, next) => {
  const stats = await Bike.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$brand' },
        numBikes: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// exports.getBikesWithin = catchAsync(async (req, res, next) => {
//   const { distance, latlng, unit } = req.params;
//   const [lat, lng] = latlng.split(',');

//   const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

//   if (!lat || !lng) {
//     return next(
//       new AppError(
//         'Please provide latitutr and longitude in the format lar,lng',
//         400,
//       ),
//     );
//   }

//   const bikes = await Bike.find({
//     startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
//   });

//   res.status(200).json({
//     status: 'success',
//     results: bikes.length,
//     data: {
//       data: bikes,
//     },
//   });
// });

exports.getBikesWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;

  const [lat, lng] = latlng.split(',').map(Number);

  const radius =
    unit === 'mi' ? Number(distance) / 3963.2 : Number(distance) / 6378.1;

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400,
      ),
    );
  }

  const bikes = await Bike.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });

  res.status(200).json({
    status: 'success',
    results: bikes.length,
    data: {
      data: bikes,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;

  const [lat, lng] = latlng.split(',').map(Number);

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400,
      ),
    );
  }

  const distances = await Bike.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lng * 1, lat * 1] },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        brand: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      distances,
    },
  });
});
