const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  const { rows: [routine_activity] } = await client.query(
    `INSERT INTO routine_activities("routineId", "activityId", count, duration)
     VALUES ($1, $2, $3, $4) 
     ON CONFLICT ("routineId","activityId") DO NOTHING
     RETURNING *;`,
    [routineId, activityId, count, duration]
  );

  return routine_activity;
}

async function getRoutineActivityById(id) {}

async function getRoutineActivitiesByRoutine({ id }) {
  const { rows } = await client.query(
    `
    SELECT * 
    FROM routine_activities
    WHERE "routineId" = $1;
    `,[id]);
    console.log(rows, "THIS IS INSSIDE")
    return rows;
}



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
