const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require("../models/Product");

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

router.post('/',(req,res)=>{
    //받아온 정보들을 DB 저장함
    const product = new Product(req.body);
    product.save((err)=>{
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    })
})

router.post("/products",(req,res)=>{
  //콜렉션에 들어있는 상품정보 가져오기
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  //필터 적용하기 req.body.filters
  let findArgs = {};

  for(let key in req.body.filters){
    //key => continents or price
    if(req.body.filters[key].length > 0){//각 필터가 있을때
      findArgs[key] = req.body.filters[key];
    }
  }
  //모든 정보 찾아옴
  Product.find(findArgs)
  .populate("writer")
  .skip(skip) //가져올 인덱스 전달
  .limit(limit)// 몽고디비에 가져올 숫자를 던져줌
  .exec((err,productsInfo)=>{
    if(err) return res.status(400).json({success:false,err})
    //돌아오는 값에 컬렉션 갯수를 추가해줌(postSize)
    res.status(200).json({success:true,productsInfo,postSize : productsInfo.length})
  })

})

module.exports = router;
