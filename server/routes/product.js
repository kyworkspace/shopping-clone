const express = require('express');
const router = express.Router();
const multer = require('multer');
//const { Product } = require("../models/Product");

//=================================
//             Product
//=================================

 //가져온 이미지를 저장 해주면 됨
 var storage = multer.diskStorage({
     //파일이 저장되는 물리적인 경로
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
   
  var upload = multer({ storage: storage }).single("file");

router.post('/image',(req,res)=>{
    upload(req,res,(err) =>{
        //실패했을때
        if(err) return res.json({success:false, err});
        //성공했을때 경로와 파일을 전달해줌
        return res.json({success:true, filePath : res.req.file.path, fileName : res.req.file.filename})
    })
})

module.exports = router;
