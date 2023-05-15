const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const { isValidEmail, isVaildPass } = require("../validator/validator");


//----------------------------------SignUp User----------------------------------

const createUser = async function (req, res) {
    try {
      const data = req.body;
      const { username, email, password ,phone } = data;
         if (Object.keys(data).length == 0) return res.status(400).send("Please Provide the Credential");
  
  // -----------------------Name validation--------------------------------------
        if (!(username)) return res.status(400).send("Name is mandatory");
  
  //--------------------------Phone Validation------------------------------------
        if (!(phone)) return res.status(400).send("Phone is required")
        let uniquePhone = await userModel.findOne({ phone: phone })
        if (uniquePhone) return res.status(400).send({ status: false, message: "Phone is already exist" })
  
  // -----------------------Email validation-------------------------------------
       if (!(email)) return res.status(400).send("Email is mandatory")
       if (!isValidEmail(email.trim())) return res.status(400).send({ status: false, msg: "Please provide a valid Email-Id" })
      let uniqueEmail = await userModel.findOne({ email: email })
       if (uniqueEmail) return res.status(400).send({ status: false, message: "Email is already exist" })
  
  // -----------------------Password validation----------------------------------
      if (!(password)) return res.status(400).send("Password is required")
      if (!isVaildPass(password.trim())) return res.status(400).send({ status: false, msg: "Please provide a valid Password with min 8 to 15 char with Capatial & special char" })
  
  // ------------------------Create User Data-------------------------------------
      let saveData = await userModel.create(data);
      return res.status(201).send({ status: true, msg: saveData });
  
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };

  // --------------------------------Login User------------------------------------
  
  let loginUser = async function(req,res){
      try{
          let data = req.body
          const { email, password } = data;
        if(Object.keys(data).length===0) { return res.status(400).send({status:false,message:"Please Provide the Credential"})}
        
  // -----------------------Email validation---------------------------------------
       if(!(email)) {
          return res.status(400).send({status:false,message:"Email is mandatory"})}
  
  // -----------------------password validation-------------------------------------
       if(!(password)) { 
          return res.status(400).send({status:false,message:"Password is mandatory"})}
    
        let userPresent= await userModel.findOne({email:email,password:password})
    
        if(!(userPresent)) {
           return res.status(400).send({status:false,message:"Email or Password is incorrect"})
          }
  // -----------------------Token create------------------------------------------
        let token=jwt.sign({
            userId:userPresent._id.toString(),
        
        },"anil",{expiresIn:"2hr"},)
    
        res.setHeader("x-api-key",token)
        res.status(200).send({status:true,token:token})
    
      }
      catch(err){
        res.status(500).send({status:false,messege:err.message})
      }
    };


//-----------------------------exports module------------------------------------   
module.exports={ createUser, loginUser }