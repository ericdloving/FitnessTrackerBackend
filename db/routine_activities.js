const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  const { rows: routine_activity } = await client.query(
    `INSERT INTO "routineActivities"("routineId", "activityId", count, duration)
     VALUES ($1, $2, $3, $4) 
     ON CONFLICT ("routineId","activityId") DO NOTHING
     RETURNING *;`,
    [routineId, activityId, count, duration]
  );

  return routine_activity;
}

async function getRoutineActivityById(id) {}

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
