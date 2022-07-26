const { getActivityById, attachActivitiesToRoutines } = require("./activities");
const client = require("./client");
const { getRoutineActivitiesByRoutine } = require("./routine_activities");


async function createRoutine({ creatorId, isPublic, name, goal }) {
  const {
    rows: [routine],
  } = await client.query(
    `
    INSERT INTO routines("creatorId", "isPublic", name, goal) 
    VALUES($1, $2, $3, $4) 
    ON CONFLICT (name) DO NOTHING 
    RETURNING *;
    `,
    [creatorId, isPublic, name, goal]
  );
  return routine;
}
async function getRoutineById(id) {
  const {rows: [routine]} = await client.query(
    `
    SELECT *
    FROM routines
    WHERE id = $1;
    `,
    [id]
  );
  return routine;
}

async function getRoutinesWithoutActivities() {
  const { rows } = await client.query(
    `
    SELECT * 
    FROM routines;
    `
  )
  return rows;
}

async function getAllRoutines() {
  //should include activities
  const { rows: routines} = await client.query(
    `
    SELECT * 
    FROM routines;
    `
  );

  // const completeRoutines = routines.map((routine) => {
  //   let routineActivities =  getRoutineActivitiesByRoutine(routine);
  //   console.log(routineActivities, "YYYYY")
  //   const activities = routineActivities.map((routineActivity)=> {
  //     getActivityById(routineActivity.activityId)
  //   })
  //   return {activities, ...routine}
  // })
  // console.log(completeRoutines, 'XXXX');
  return attachActivitiesToRoutines(routines);
  

}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
