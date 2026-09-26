const mongoose = require('mongoose');

const buyingSchema = new mongoose.Schema({
  bike: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bike',
    required: [true, 'Buying must belong to a Bike'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Buying must belong to a User'],
  },
  price: {
    type: Number,
    required: [true, 'Buying must have a price'],
  },
  createAt: {
    type: Date,
    defalut: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

buyingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'bike',
    select: 'fullName',
  });
});

const Buying = mongoose.model('Buying', buyingSchema);

module.exports = Buying;
