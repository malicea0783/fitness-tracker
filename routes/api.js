const router = require("express").Router();
const Workout = require("../models/Workout.js");

router.get("/api/workouts", (req, res) => {
  Workout.find({}, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.json(data);
    }
  });
});

router.post("/api/workouts", (req, res) => {
  Workout.create({}, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.json(data);
    }
  });
});

router.get("/api/workouts/range", (req, res) => {
  Workout.aggregate([
    { $addFields: { totalDuration: { $sum: `$exercises.duration` } } },
  ])
    .sort({ _id: -1 })
    .limit(7)
    .then((workouts) => {
      res.json(workouts);
    })
    .catch((err) => res.json(err));
});

router.put("/api/workouts/:id", ({ body, params }, res) => {
  Workout.findByIdAndUpdate(
    params.id,
    { $push: { exercises: body } },
    // "runValidators" will ensure new exercises meet our schema requirements
    { new: true, runValidators: true }
  )
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;

