const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password can not contain "password"');
        }
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
);

//* virtual property is not actual data, it's a relationship between two entities, not stored in database
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
});

//====================================================================
//* methods are accessible on the instances of the model
//! get public profile data
// this method gets called automatically when we send this object with the response (res.send)
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject(); // raw data than can be manipulated.
  // to not send password and token amongs the data sent to the user.
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};
//! generate token
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET); //* toString() to convert object id into a standard string for jwt to understand it.
  user.tokens = user.tokens.concat({ token });
  return token;
};
//====================================================================
//* statics are accessible on the model
//! custom find user
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("not logged");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("not logged");
  }
  return user;
};
//====================================================================

//! hashing plain-text password middleware before save
userSchema.pre("save", async function(next) {
  const user = this; //* for readability
  //* to check when user data get updated
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
//====================================================================
//! delete user's tasks when user is removed
userSchema.pre("remove", async function(next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
