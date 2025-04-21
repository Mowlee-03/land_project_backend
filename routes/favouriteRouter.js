var express=require("express")
var router=express.Router()
var {addFavourite,getUserFavourites,removeFavourite}=require("../controller/favouriteController")
var {authenticate}=require("../Middleware/middlware")


router.use(authenticate)
router.post("/addfavourite",addFavourite)
router.get("/getfavourite/:userId",getUserFavourites)
router.delete("/deletefavourite",removeFavourite)



module.exports=router

