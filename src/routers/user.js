const express = require("express");
const User = require("../models/User");
const { ObjectId } = require("mongodb");
const router = new express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const { notify, cancellation } = require("../mail/index");

const uploads = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb("Please upload a image! ");
    }

    cb(undefined, true);
  },
  limits: {
    fileSize: 2000000,
  },
});

// GET get user profile
router.get("/api.task-manager/v1/users/me", auth, async (req, res) => {
  res.status(200).send(req.user);
});

// POST user avatar
router.post(
  "/api.task-manager/v1/users/me/avatar",
  auth,
  uploads.single("upload"),
  async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.status(200).send("success");
  },
  (error, req, res, next) => {
    res.status(400).send(error.message);
  }
);

router.delete("/api.task-manager/v1/users/me/avatar", async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send();
});

// POST user login
router.post("/api.task-manager/v1/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// POST user logout
router.post("/api.task-manager/v1/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send("success");
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST user logoutAll
router.post("/api.task-manager/v1/user/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("successfully logged out of all devices");
  } catch (error) {
    res.status(500).send();
  }
});

// POST create user
router.post("/api.task-manager/v1/users", async (req, res) => {
  const user = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    age: req.body.age,
  });
  try {
    await user.save();
    // notify user with email (welcome message)
    notify(user.email, user.name);
    const token = await user.generateToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// PATCH update the user by their id
router.patch("/api.task-manager/v1/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed_updates = ["name", "password", "email", "age"];
  const isValidUpdate = updates.every((update) =>
    allowed_updates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send("Invalid updates");
  }

  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send();
  }
});

// DELETE delete a User
router.delete("/api.task-manager/v1/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // res.status(200).send(user);
    cancellation(req.user.email, req.user.name);
    await req.user.remove();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
