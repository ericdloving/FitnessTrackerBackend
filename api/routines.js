const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
const { getAllPublicRoutines, createRoutine,getRoutineById,updateRoutine } = require("../db");

// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { isPublic, name, goal } = req.body;
    const creatorId = req.user.id;
    const routine = await createRoutine({ creatorId, isPublic, name, goal });
    res.send(routine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/routines/:routineId
router.patch("/:routineId",requireUser, async (req,res,next)=>{
    const routineId = req.params.routineId
    const {name, goal, isPublic} = req.body
    let _routine = await getRoutineById(routineId)
    try {
        if(!_routine){
            next({name: "routineDoesNotExist",
            message: `routine ${routineId} not found`})
        }
        if (_routine.creatorId !== req.user.id){
            next({name: "Forbidden",
            message: `User ${req.user.username} is not allowed to update ${_routine.name}`})
        }
        const updatedRoutine = await updateRoutine({id:routineId, name, goal, isPublic})
        res.send(updatedRoutine)
    } catch ({name,message}) {
        next({ name, message })
    }
})
// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
