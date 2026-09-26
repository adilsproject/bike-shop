const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const bikeSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, 'A bike must have a brand'],
      trim: true,
      maxlength: [
        20,
        'A bike brand must have less or equal then 40 characters',
      ],
      minlength: [4, 'A bike brand must have at least 4 characters'],
    },
    model: {
      type: String,
      required: [true, 'A bike must have a model'],
      unique: true,
    },
    slug: String,
    price: {
      type: Number,
      required: [true, 'A bike must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    category: {
      type: String,
      required: [true, 'A bike must have a category'],
    },
    size: {
      type: String,
      required: [true, 'A bike must have a size'],
      enum: {
        values: ['S', 'M', 'L', 'XL'],
        message: 'Size is either: S, M, L, XL',
      },
    },
    color: {
      type: String,
      required: [true, 'A bike must have a color'],
    },
    weight: {
      type: Number,
      required: [true, 'A bike must have a weight'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    imagesCover: {
      type: String,
      required: [true, 'A bike must have a cover image'],
    },
    images: {
      type: [String],
    },
    description: {
      type: String,
      required: [true, 'A bike must have a description'],
    },
    createAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretBike: {
      type: Boolean,
      default: false,
    },
    shopLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    startLocation: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        quantity: Number,
      },
    ],
    sellers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

bikeSchema.index({ price: 1 });
bikeSchema.index({ slug: 1 });
bikeSchema.index({ startLocation: '2dsphere' });

bikeSchema.virtual('fullName').get(function () {
  return `${this.brand} ${this.model}`;
});

bikeSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'bike',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
bikeSchema.pre('save', function (next) {
  this.slug = slugify(`${this.brand} ${this.model}`, { lower: true });
});

//query middleware
bikeSchema.pre(/^find/, function (next) {
  this.find({ secretBike: { $ne: true } });

  this.start = Date.now();
});

bikeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'sellers',
    select: '-__v -passwordChangedAt',
  });
});

bikeSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);

  next();
});

const Bike = mongoose.model('Bike', bikeSchema);

module.exports = Bike;
