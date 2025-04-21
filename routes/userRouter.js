var express=require("express")
var router=express.Router()
var {signup,signinuser, Get_All_User}=require("../controller/userController")
var {authenticate}=require("../Middleware/middlware")

router.post("/signup",signup)
router.post("/login",signinuser)
router.get('/auth',authenticate,(req,res)=>{res.status(200).json({message:"Authenticated", user: req.user})})
router.get("/get_all_users",authenticate,Get_All_User)
module.exports=router