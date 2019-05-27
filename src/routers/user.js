const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");
const router = express.Router();

//! create user (Sign up)
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken(); //* generate token
    //* 201 user created
    res.status(201).send({ user, token });
  } catch (error) {
    //* bad request
    res.status(400).send(error);
  }
});

//! find user to (Log in)
router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password); //* find user
    const token = await user.generateAuthToken(); //* generate token
    await user.save();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send("Unable to login");
  }
});

//! user (Log out - single session)
router.post("/users/logout", auth, async (req, res) => {
  try {
    const { user } = req;
    user.tokens = user.tokens.filter(token => token.token !== req.token);
    await user.save();
    res.send("Successfully logged out");
  } catch (error) {
    res.status(500).send();
  }
});

//! user (Log out - single session)
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    const { user } = req;
    user.tokens = [];
    await user.save();
    res.status(200).send("Successfully logged out from all devices");
  } catch (error) {
    res.status(500).send();
  }
});

//! user profile
router.get("/users/me", auth, async (req, res) => {
  const { user } = req;
  res.send(user);
});

//! get user
router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      //* user not exists
      return res.status(404).send("user not found");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//! update user
router.patch("/users/me", auth, async (req, res) => {
  //* if user updates a property that doesn't exist
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send("ERROR: Invalid Operation");
  }
  //*

  try {
    //* this change to able the hashing middleware to run (on save) on password if updated
    const { user } = req;
    updates.forEach(update => (user[update] = req.body[update]));
    await user.save();
    //*
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

//! delete user
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    req.status(404).send();
  }
});

//! upload user image
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    //* (req.file.buffer) contains a buffer of all of the binary data for that file.
    //* sharp is async, it takes image and deal with it and we return it back as a buffer again.
    if (!req.file) {
      return res.status(404).send("Please Provide an Image");
    }
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send("Your Image uploaded Successfully");
  },
  (error, req, res, next) => {
    //* must provide these four args so express can understand that it's to handle errors
    res.status(400).send({ error: error.message });
  }
);

//! delete user image
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send("Image deleted Successfully");
});

//! get user image
router.get("/users/:id/avatar", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png"); //* can be neglected, express do it automatically
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send("User or image is not found");
  }
});

module.exports = router;
