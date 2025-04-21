var express = require('express');
var router = express.Router();
var {authenticate} =require("../Middleware/middlware");
var postController=require("../controller/postController");



router.get("/viewallpost",postController.viewAllpost)
router.get("/property_count",postController.Propertycounts)
router.get("/:postId",postController.viewOnepost)



router.post("/create/:adminId",authenticate,postController.createPost)
router.put('/updatepost/:postId',authenticate,postController.updatePost)
router.delete('/delete/:postId',authenticate,postController.deletePost)
router.post("/soldtoggle",authenticate,postController.soldPropertytoggle)



module.exports = router;
