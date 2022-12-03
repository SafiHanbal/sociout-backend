const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('../../models/user-model');
const Post = require('../../models/post-model');

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
const postData = JSON.parse(fs.readFileSync(`./public/dev-data/post.json`));

const deleteDataFromDB = async () => {
  try {
    await User.deleteMany();
    await Post.deleteMany();
    console.log('User data deleted successfully!');
    console.log('Post data deleted successfully!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const importDataToDB = async () => {
  try {
    const users = await User.create(userData, { validateBeforeSave: false });
    const posts = await Post.create(postData);
    if (users) console.log('Users data imported successfully!');
    if (posts) console.log('Posts data imported successfully!');
    if (users && posts) process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') importDataToDB();
if (process.argv[2] === '--delete') deleteDataFromDB();
