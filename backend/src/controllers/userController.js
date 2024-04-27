const Register=require('../../models/login');
const Employee=require('../../models/employee');
const Workdone=require('../../models/workdone');
const AdminLogin=require('../../models/adminlogin')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');
var nodemailer = require('nodemailer');
const AddAdminLogin=async (req,res,next)=>{
     const {username,email,password}=req.body;
     const salt=await bcrypt.genSalt(10);
     const hashedPassword=await bcrypt.hash(password,salt)
     try{
      const admin1=new AdminLogin({
        username,email,password:hashedPassword
      })
      admin1.save();
      return res.send("admin added successful");
     }
     catch(err){
      console.log("exception at storig the admin1\n"+err);
     }
}
const AddUserData=async(req,res,next)=>{
   const {email,password}=req.body;
   const reg1=new Register({
    email,
    password
   })
   reg1.save();
   return res.send("basic Done");
}
const AddEmployee=async(req,res,next)=>{
    const {username,email,password,fullname,phone,address,role,image}=req.body;
    //console.log(req.body);
   const salt=await bcrypt.genSalt(10);
   const hashedPassword=await bcrypt.hash(password,salt);
   //console.log(hashedPassword);
    const newEmp=new Employee({
        username,
        email,
        password:hashedPassword,
        fullname,
        phone,
        address,
        role,
        image
    })
    try{
        newEmp.save();
    }
    catch(err){
        console.log("exception occured at saving new emplooye");
        return res.status(400).send("exception occured at saving new emplooye");
    }
    return res.status(200).json({msg:"added successfully"});
}
 const EmpLogin=async(req,res,next)=>{
        const {username,password}=await req.body;
       console.log(password);
     let data=await Employee.findOne({username});
     console.log(data);
     let verifyPassword= await bcrypt.compare(password,data.password)
     console.log(verifyPassword);
     const payload={
      user:{
        id:data.id
      }
     }
        if(data&&verifyPassword)
        {
          const token= jwt.sign(payload,"jwtSecret",{expiresIn:5*100});
         // console.log(token);
            return res.status(200).json(token);}
        return res.status(200).json(null);
   
 }
 const AdminLoginForm=async(req,res)=>{
  const {username,password}=req.body;
   //  console.log(username+" "+password);
  let data=await AdminLogin.findOne({username});
  let verifyPassword= await bcrypt.compare(password,data.password)
     if(data&&verifyPassword){
    const payload={
      user:{
        id:data.id
      }
     }
     const token= jwt.sign(payload,"jwtSecret",{expiresIn:5*100});     
     return res.status(200).json(token);
    //  return res.status(200).json("true");
     }
     return res.status(200).json(null);
}
const Addwork=async (req,res)=>{
    try{
    const {date,username,content}=req.body;
   // console.log(req.body.date)
   const addwork=new Workdone({
    date,
    username,
    content
    })
    //console.log(addwork.date)
    addwork.save();
   return res.status(200).json(addwork);
     }
   catch(err){
      console.log("error at saving the workdata\n"+err);
   }
  
}
const Getinfo = async (req, res) => {
    try {
      const username = req.params.id;
     // console.log(username);
      const [gotData] = await Employee.find({username:username});
    // console.log(gotData);
      return res.status(200).json(gotData); // Return the found object as JSON
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  const Savechanges=async(req,res)=>{
    //const _id=req.params.id;

    const id = req.params.id;
   
   const {phone,address,role,fullname}=req.body;
//    console.log(id+" "+address+" "+role+" "+fullname);
 //console.log(req.body);
 const image=req.file.filename;
 console.log(image);

    let emp;
    try{
        emp=await Employee.findByIdAndUpdate(id,{
            role,
           phone,
            address,
            fullname,
            image
        }) 
    
    return res.send("saved successful")
    }
   catch(err){console.log(err)}
 // return res.send("mood");
  }
  
  const GetEmployeeData=async(req,res,next)=>{
        try{
        const employee=await Employee.find();
       // console.log(employee);
        return res.send(employee)
        }
        catch(err){
         console.log(err)
        }
  }
  const GetSubmissions=async(req,res,next)=>{
       const data=req.params.id;
       console.log(data);
       const result=await Workdone.find({username:data});
       
       return res.send(result);
  }

  const DeleteEmployee=async (req,res)=>{
    const {username}=await req.body;
    const {id}=await Employee.findOne({username});
    try{
      if(id){
    await Employee.findByIdAndDelete(id);
    res.json("user deleted successfully");}
      else
      res.json("user not found");
   }
    catch(err){
      console.log(err);
    }
  }
  const ForgotPassword=async (req,res)=>{
     const {email}=await req.body;
     try{
       const user=await Employee.findOne({email})||await AdminLogin.findOne({email});
      
       if(!user) return res.json({status:"email_doesnt_exist"})
       var nodemailer = require('nodemailer');
        const token=jwt.sign({id:user.id},'jwtSecret',{expiresIn:'1d'})
       var transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
           user: 'baluseendripu123@gmail.com',
           pass: 'zmob eyjg jvuz wbla'
         }
       });
       
       var mailOptions = {
         from: 'baluseendripu123@gmail.com',
         to: user.email,
         subject: 'Forgot password',
         text: `http://localhost:3000/forgot_password/${user.id}/${token}`
       };
       
       transporter.sendMail(mailOptions, function(error, info){
         if (error) {
           console.log(error);
         } else {
           console.log('Email sent: ' + info.response);
           return res.json({status:"verified"})
         }
       });
    // return res.json({status:"verified"})
     }
     catch(err){
      console.log(err);
     }
    
  }
  const ResetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.params;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
  
    try {
      const { id } = jwt.verify(token, 'jwtSecret');
  
      let updated = await Employee.findByIdAndUpdate(id, {
        password: hashedPassword
      });
  
      if (!updated) {
        updated = await AdminLogin.findByIdAndUpdate(id, {
          password: hashedPassword
        });
      }
  
      if (!updated) {
        throw new Error('User not found');
      }
  
      return res.json({ status: 'success' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
  };
  
exports.AddAdminLogin=AddAdminLogin;
exports.AddUserData = AddUserData;
exports.AddEmployee=AddEmployee;
exports.EmpLogin=EmpLogin;
exports.Addwork=Addwork;
exports.Getinfo=Getinfo;
exports.Savechanges=Savechanges;
exports.AdminLoginForm=AdminLoginForm;
exports.GetEmployeeData=GetEmployeeData;
exports.GetSubmissions=GetSubmissions;
exports.DeleteEmployee=DeleteEmployee;
exports.ForgotPassword=ForgotPassword;
exports.ResetPassword=ResetPassword;