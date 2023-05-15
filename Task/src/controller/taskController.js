const taskModel = require("../model/taskModel");
const Validation = require("../validator/validator");
const { isValidObjectId } = require("mongoose")

//--------------------------Create Task-------------------------------//

const createTask = async function (req, res) {
    try {
        const data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please Provide the Task Input" });
        const { userId, taskname, description, dueDate, priorityLevel, category } = data

// -------------------- Here check the userId for createing task------------------ 
        if (!userId) return res.status(400).send({ status: false, message: "Please Enter UserId" })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "user Id is not valid" })
        if (userId != req.decodedToken.userId) 
        return res.status(403).send({ status: false, msg: "you do not have authorized to this " });

//  -------------------------------Task Validation -----------------------
        if (!taskname) return res.status(400).send({ status: false, message: "Please Enter Task Name" })
        if (!Validation.isValid(taskname)) return res.status(400).send({ status: false, message: "please inter valid Task Name" })
        let findTask = await taskModel.findOne({ taskname: taskname })
        if (findTask) return res.status(400).send({ status: false, message: "Task allready exist. " })

// ------------------------ description Validation--------------------------
        if (!description) return res.status(400).send({ status: false, message: "Please enter description for this task" })
        if (!Validation.isValid(description)) return res.status(400).send({ status: false, message: "please inter valid description" })

//  -------------------------------DueDate Validation-----------------------
        if (!dueDate) return res.status(400).send({ status: false, message: "Please enter Date for this task" })
        if (!Validation.IsValidDate(dueDate)) return res.status(400).send({ status: false, message: "please inter valid date in format: YYYY-MM-DD" })

// ---------------------priorityLevel Validation----------------------------
        if (!priorityLevel) return res.status(400).send({ status: false, message: "Please enter priorityLevel" })

//-----------------------Category Validation--------------------------------
        if (!category) return res.status(400).send({ status: false, message: "Please enter category" })
        if (!Validation.isValidStr(category.trim())) return res.status(400).send({ status: false, message: "please inter valid Category for this Task" })
        
// ------------------------Create Task Data-------------------------------------
        const taskData = await taskModel.create(data)
        res.status(201).send({ status: true, msg: "Task Created Successfull", data: taskData })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

//------------------------ View All Task------------------------------------

const getallTask = async function (req, res) {
    try {
        const getdata = await taskModel.find({});
        res.status(200).send({ status: true, data: getdata })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
};

//------------------------ Update Task Using Path Params----------------------------

const updateTask = async function (req, res) {
    try {
        const taskId = req.params.taskId
        const data = req.body
        const { taskname, description } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Add fields to update" });

//-------------------------Task Name Validation----------------------------
        if (taskname) {
            if (!Validation.isValid(taskname)) return res.status(400).send({ status: false, message: "please inter valid Taskname" })
            let findTask = await taskModel.findOne({ taskname: taskname })
            if (findTask) return res.status(400).send({ status: false, message: "Task is allready exist " })
        }

//----------------------------Description Validation-----------------------
        if (description) {
            if (!Validation.isValidStr(description.trim())) return res.status(400).send({ status: false, message: "please inter valid Description" })
            let checkDes = await taskModel.findOne({ description: description })
            if (checkDes) return res.status(400).send({ status: false, message: "Description is allready exist" })
        }

//--------------------------Finally Update Task ----------------------------------
        let updatedTask = await taskModel.findOneAndUpdate({ _id: taskId }, {
            $set: { taskname: taskname, description: description }
        }, { new: true, upsert: true })
        return res.status(200).send({ status: true, msg: "Task updated successfully", data: updatedTask })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
};


//------------------Delete Task Using Path Params-----------------------

const deleteTask = async (req, res) => {
    try {
        let taskId = req.params.taskId
        const delatedtaskId = await taskModel.findOneAndUpdate({ _id: taskId }, { $set: { isDeleted: true, deletedAt: new Date(Date.now()) }, }, { new: true });

//------------------------Deleteing book here--------------------------
        if (delatedtaskId) {
            await taskModel.updateMany({ taskId: delatedtaskId._id }, { $set: { isDeleted: true } });
            return res.status(200).send({ status: true, msg: "Task is deleated successfully", data: delatedbookId })
        } else {
            return res.status(404).send({ status: false, msg: "No Task found for this Id" })
        }
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }
};

//------------------Fetch Task using taskname or dueDate by query params------------

const getTask = async function (req, res) {
    try {
        if (req.query) {
            let {  taskname, dueDate } = req.query
            let obj = {}
            if (taskname) {obj.taskname = taskname}
            if (dueDate) {obj.dueDate = dueDate}
            obj.isDeleted = false

            const taskDetial = await taskModel.find(obj).select({ taskname: 1, dueDate: 1})
            if (taskDetial.length == 0) {
                return res.status(404).send({ status: false, msg: "No Task found for given Data" })
            }
        } else {
            const allTask = await taskModel.find({ isDeleted: false })
            return res.status(200).send({ status: true, message: 'Success', data: allTask })
        }} catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
};


//---------------------Mark a task as complete-------------------------------------
const taskComplete = async function (req, res) {
    try {
      const taskId = req.params.taskId;
      const findTask = await taskModel.findById({taskId: taskId})
     if (findTask) return res.status(404).send({ status: false, message: "This Task Id not found" })
      if (findTask !== -1) {
        tasks[findTask].completed = true;
        res.status(200).send(`Task ${taskId} marked as complete`);
  }} catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
    }
};


//----------------------Mark a task as Incomplete----------------------------
const taskIncomplete = async function (req, res) {
    try {
        const taskId = req.params.taskId;
        const findTask = await taskModel.findById({taskId: taskId})
       if (findTask) return res.status(404).send({ status: false, message: "This Task Id not found" })
        if (findTask !== -1) {
          tasks[findTask].completed = false;
          res.status(200).send(`Task ${taskId} marked as Incomplete`);
  }} catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
    }
};

module.exports = { createTask, getallTask, updateTask, deleteTask, getTask, taskComplete, taskIncomplete}