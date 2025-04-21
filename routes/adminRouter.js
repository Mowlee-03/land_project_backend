var express = require('express');
var router = express.Router();
var {authenticate} =require("../Middleware/middlware")
var adminController=require('../controller/adminController')


router.post("/login",adminController.loginAdmin)
router.post("/register",adminController.registerAdmin)
router.get("/getcategory",authenticate,adminController.getCategory)
router.get("/getdistrict",authenticate,adminController.getDistict)
router.get("/propety_in_category",authenticate,adminController.getcategorycountProperties)
router.get("/propety_in_district",authenticate,adminController.getDistrictcountProperties)
router.get("/propety_count",authenticate,adminController.getPropertiescount)

router.post("/addcategory/:adminId",authenticate,adminController.addCategory)
router.post("/addistrict/:adminId",authenticate,adminController.addDistrict)
router.post("/logout/:adminId",authenticate,adminController.logoutadmin)

module.exports = router;
