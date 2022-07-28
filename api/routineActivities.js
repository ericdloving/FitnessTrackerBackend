const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  destroyRoutineActivity,
} = require("../db");

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
  const routineActivityId = req.params.routineActivityId;
  let routineActivity = await getRoutineActivityById(routineActivityId);
  const routine = await getRoutineById(routineActivity.routineId);

  try {
    if (!routineActivity) {
      next({
        name: "routineActivityDoesNotExist",
        message: `Routine Activity ${routineActivityId} not found`,
      });
    }
    if (routine.creatorId !== req.user.id) {
      next({
        name: "Forbidden",
        message: `User ${req.user.username} is not allowed to update ${routine.name}`,
      });
    }
    const updatedRoutineActivity = await updateRoutineActivity({
      id: routineActivityId,
      ...req.body,
    });
    res.send(updatedRoutineActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
  const routineActivityId = req.params.routineActivityId;
  let routineActivity = await getRoutineActivityById(routineActivityId);
  const routine = await getRoutineById(routineActivity.routineId);
  try {
    if (!routineActivity) {
      next({
        name: "routineActivityDoesNotExist",
        message: `Routine Activity ${routineActivityId} not found`,
      });
    }
    if (routine.creatorId !== req.user.id) {
      next({
        name: "Forbidden",
        message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
      });
    }

    await destroyRoutineActivity(routineActivityId);
    let deletedRoutineActivity = await getRoutineActivityById(
      routineActivityId
    );
    if (!deletedRoutineActivity) {
      res.send({ success: true, ...routineActivity });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = router;
