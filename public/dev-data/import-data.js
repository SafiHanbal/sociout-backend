const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('../../models/user-model');

dotenv.config({
  path: 'config.env',
});

const DB = process.env.DATABASE_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, { useNewUrlParser: true })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.log(err.message));

const userData = JSON.parse(fs.readFileSync(`./public/dev-data/user.json`));

const deleteDataFromDB = async () => {
  try {
    await User.deleteMany();
    console.log('User data deleted successfully!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const importDataToDB = async () => {
  try {
    const users = await User.create(userData, { validateBeforeSave: false });
    if (users) console.log('Users data imported successfully!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') importDataToDB();
if (process.argv[2] === '--delete') deleteDataFromDB();
