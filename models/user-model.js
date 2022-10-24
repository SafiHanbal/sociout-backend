const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email!'],
      unique: [
        true,
        'This email already exist! Please login or use another email.',
      ],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    name: String,
    userName: {
      type: String,
      required: [true, 'Please provide a username!'],
      unique: [true, 'This username is already taken. Please try another!'],
    },
    displayPicture: {
      type: String,
      default: 'http://127.0.0.1:8000/images/user/default.jpg',
    },
    banner: {
      type: String,
    },
    bio: String,
    interests: [String],
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: 'Please specify your gender!',
      },
    },
    followers: {
      type: [mongoose.Schema.ObjectId],
      default: [],
    },
    postCount: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      min: [8, 'Password should be atleash 8 characters!'],
      required: [true, 'Please provide a password!'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please re-enter the password'],
      validate: {
        message: 'Password do not match!',
        validator: function (value) {
          return value === this.password;
        },
      },
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
