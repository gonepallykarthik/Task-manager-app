const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const token_secret = process.env.TOKEN_SECRET;
const Task = require("./Task");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: [6, "Password must be greater than 6 characters"],
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw new Error("password cannot be password");
      },
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, "email required"],
      validate(value) {
        let isValid = validator.isEmail(value);
        if (isValid == false) throw new Error("Invalid email");
      },
    },
    age: {
      type: Number,
      validate(value) {
        if (value <= 0) throw new Error("age must greater than 1");
      },
      required: [true, "you need to enter your age"],
    },
    avatar: {
      type: Buffer,
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "author",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

//static methods
userSchema.statics.findByCredentials = async (email, pass) => {
  if (email.length == 0 || pass.length == 0)
    throw new Error("please enter email and password");
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("unable to login");
  }

  const isMatch = await bcrypt.compare(pass, user.password);
  if (!isMatch) {
    throw new Error("unable to login");
  }
  return user;
};

// Instance methods
userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, token_secret);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// hash the password before saving
// pre means before saving the user
userSchema.pre("save", async function (next) {
  // This -> refers to user schema
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  next();
});

// delete user tasks when user is removed
userSchema.pre("save", async function (next) {
  const user = this;
  await Task.deleteMany({ id: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
