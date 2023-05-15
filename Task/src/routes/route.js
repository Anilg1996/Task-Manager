const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require("../controller/userController");
const { createTask, getallTask, updateTask, deleteTask, getTask, taskComplete, taskIncomplete,} = require("../controller/taskController");
const { authentication, authorization } = require("../middleware/auth");
module.exports = router

//----------------------------Handling Handled route-------------------

router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/createtask", createTask, authentication);
router.get("/", getallTask, authentication);
router.put("/updatetask/:taskId", updateTask, authentication, authorization);
router.delete("/deletetask/:taskId", deleteTask, authentication, authorization);
router.get("/gettask", getTask, authentication);
router.put("/task/complete/:taskId", taskComplete, authentication, authorization);
router.put("/task/incomplete/:taskId", taskIncomplete, authentication, authorization);

//-----------------------------Handling unhandled route-------------------

router.all("/*", function (req, res) {
    return res.status(400).send({ status: false, msg: "Path not found" })
});
