const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");

// POST create Task!
router.post("/api.task-manager/v1/task", auth, async (req, res) => {
  const t1 = new Task({
    ...req.body,
    author: req.user._id,
  });
  try {
    await t1.save();
    res.status(201).send(t1);
  } catch (error) {
    res.status(400).send();
  }
});

// GET all tasks!
// also set filter query ? completed is True or false
// queries for limit, skip and sort are also supported
// for sort query -> use sortBY = completed:desc or completed:asc note:remember ':' is important if you want to sort by specific order

router.get("/api.task-manager/v1/tasks", auth, async (req, res) => {
  const PAGE_SIZE = parseInt(req.query.limit) || 10; // documents to be fetched
  const page = parseInt(req.query.page) || 1; // current page number and default is 1
  const sortQuery = {};

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sortQuery[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  if (req.query.completed) {
    const match = req.query.completed;
    const tasks = await Task.find({ author: req.user._id, completed: match })
      .sort(sortQuery)
      .limit(PAGE_SIZE)
      .skip((page - 1) * PAGE_SIZE);
    res.status(200).send(tasks);
  } else {
    const all_tasks = await Task.find({ author: req.user._id })
      .sort(sortQuery)
      .limit(PAGE_SIZE)
      .skip((page - 1) * PAGE_SIZE);
    if (!all_tasks) return res.status(500).send();
    res.status(200).send(all_tasks);
  }
});

// GET task get ID
router.get("/api.task-manager/v1/tasks/:id", auth, async (req, res) => {
  const _id = req.params;

  try {
    const task = Task.findOne({ _id, author: req.user._id });
    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

// PATCH update the task by its ID
router.patch("/api.task-manager/v1/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed_updates = ["description", "completed"];
  const isValidUpdate = updates.every((update) =>
    allowed_updates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send("Invalid updates");
  }

  try {
    const updated_task = await Task.findOne({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!updated_task) res.status(404).send();

    updates.forEach((update) => {
      updated_task[update] = req.body[update];
    });
    await updated_task.save();
    res.status(200).send(updated_task);
  } catch (error) {
    res.status(400).send();
  }
});

// DELETE delete a task by their id
router.delete("/api.task-manager/v1/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = Task.findOneAndDelete({ _id, author: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
