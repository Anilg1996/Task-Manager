const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose");
const taskModel = require("../model/taskModel");

//-------------------------------Authentication User--------------------------------

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "token must be present in header" })

//-----------------------------verify the token-----------------------------------
        jwt.verify(token, 'anil', function (err, decodedToken) {
            if (err)  return res.status(401).send({ status: false, msg: "invalid Token " }) 
            req.decodedToken = decodedToken
            next()
        })
    } catch (err) {
        return res.status(500).send({status:false,messege:err.message})
    }}

//----------------------------Authorisation User-----------------------------------
const authorization = async function (req, res, next) {
    try {
        let gettaskId = req.params.taskId;
//---------------------- Task Id Validation---------------------------
        if (!isValidObjectId(gettaskId)) return res.status(400).send({ status: false, msg: "Enter a valid Task Id" })

        let task = await taskModel.findOne({ _id: gettaskId })
        if (!task) return res.status(404).send({ status: false, msg: "Task not found !" })
        if (task.isDeleted) return res.status(400).send({ status: false, msg: "Task is already been deleted" })

//--------------------------User Id validation--------------------------------
        let userId = task.userId
        if (userId != req.decodedToken.userId) return res.status(403).send({ status: false, msg: "you do not have authorization to this " });
        next()
    }
    catch (err) {
        res.status(500).send({status:false,messege:err.message})
    }}

module.exports = { authentication, authorization }