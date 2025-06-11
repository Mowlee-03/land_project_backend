var express = require('express');
var router = express.Router();
var {authenticate} =require("../Middleware/middlware");
const { getCommissionByPostId, createCommission, updateCommission, deleteCommission, getCommissionData } = require('../controller/CommissionController');

router.get('/post/:postId', authenticate,getCommissionByPostId);
router.post('/', authenticate,createCommission);
router.put('/:id', authenticate,updateCommission);
router.delete('/:id', authenticate,deleteCommission);
router.get('/data',authenticate,getCommissionData)
module.exports=router