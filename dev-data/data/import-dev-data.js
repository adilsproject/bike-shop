const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bike = require('./../../models/bikeModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB connection successfull!'));

const bikes = JSON.parse(
  fs.readFileSync(`${__dirname}/bikes-simple.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Bike.create(bikes);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Bike.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
