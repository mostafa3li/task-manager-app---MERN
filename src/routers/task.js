const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = express.Router();

//! create task
router.post("/tasks", auth, async (req, res) => {
  const { user } = req;
  const task = new Task({
    ...req.body,
    owner: user._id
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//! get all tasks
// GET /tasks?completed=true    (filter)
// GET /tasks?limit=10&skip=0   (pagination)
// GET /tasks?sortBy=createdAt_asc
// ?sortBy=createdAt:asc&completed=true&limit=1&skip=1
router.get("/tasks", auth, async (req, res) => {
  const { user } = req;
  const match = {};
  const sort = {};
  if (req.query.completed) {
    //* converting a string to a boolean
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    //* also valid
    // const tasks = await Task.find({ owner: user._id });
    // res.send(tasks);
    // await user.populate("tasks").execPopulate();
    //*
    await user
      .populate({
        path: "tasks",
        match,
        options: {
          //* pagination
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    res.send(user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

//! get task (user's task)
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send("Task not found or you're not authenticated");
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(err);
  }
});

//! update task
router.patch("/tasks/:id", auth, async (req, res) => {
  //*
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send("ERROR: invalid operation");
  }
  //*

  const _id = req.params.id;
  try {
    //* this logic for future use of middleware on updating tasks
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send("task not found or You're not authenticated");
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    //*
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

//! delete task
router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
      res.status(404).send("Task not founded or You're not authenticated");
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
