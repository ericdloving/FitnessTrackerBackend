const express = require("express");
const router = express.Router();
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getActivityById,
  updateActivity,
  getPublicRoutinesByActivity,
} = require("../db");
const { requireUser } = require("./utils");

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
  const activityId = req.params.activityId;
  const _activity = await getActivityById(activityId);
  try {
    if (!_activity) {
      next({
        name: "activityDoesNotExist",
        message: `Activity ${activityId} not found`,
      });
    }
    const routines = await getPublicRoutinesByActivity({ id: activityId });
    res.send(routines);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/activities
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const _activity = await getActivityByName(name);
    if (_activity) {
      next({
        name: "activityAlreadyExists",
        message: `An activity with name ${name} already exists`,
      });
    } else {
      const activity = await createActivity({ name, description });
      res.send(activity);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/activities/:activityId
router.patch("/:activityId", requireUser, async (req, res, next) => {
  const activityId = req.params.activityId;
  const { name, description } = req.body;
  let _activity = await getActivityById(activityId);
  try {
    if (!_activity) {
      next({
        name: "activityDoesNotExist",
        message: `Activity ${activityId} not found`,
      });
    }
    _activity = await getActivityByName(name);
    if (_activity) {
      next({
        name: "activityAlreadyExists",
        message: `An activity with name ${name} already exists`,
      });
    }

    const updatedActivity = await updateActivity({
      id: activityId,
      name,
      description,
    });
    res.send(updatedActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = router;
