const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart : req.user.cart, //장바구니 정보
        history: req.user.history,//결재 이력 정보
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/addToCart", auth, (req, res) => {

    // 먼저 USER Collection에 해당 유저의 정보를 가져옴
    // auth 에서 쿠키 정보를 넣어뒀기 때문에 유저정보 추출 가능
    User.findOne({_id:req.user._id}, (err, userInfo)=>{
        // 가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어있는지 확인
        let duplicate = false;
        userInfo.cart.forEach((item,i)=>{
            if(item.id === req.body.productId){
                duplicate=true;
            }
        })
        
        if(duplicate){
            //상품이 이미 있을때 상품 갯수 +1
            //유저를 찾고 그안에 담긴 cart에서 상품 1개를 찾아줘야 하기 때문에 id를 또 던져 줘야함
            User.findOneAndUpdate(
                {_id : req.user._id,"cart.id":req.body.productId},
                //cart의 quantity를 올려줌
                // $inc --> increment
                {$inc:{"cart.$.quantity":1}},
                //리턴값을 업데이트 된 유저정보로 받기 위에서 new : true 옵션이 들어감
                {new : true},
                (err,userInfo)=>{
                    if(err) return res.status(200).json({success:false,err})
                    //카트정보만 돌려보냄
                    res.status(200).json(userInfo.cart)
                }
            )
        }
        else{
            //상품이 없을때 상품 id, 갯수, 날짜정보까지 다 넣어줌
            User.findOneAndUpdate(
                {_id : req.user._id},
                //데이터 신규 삽입 cart에 넣을거임
                {
                    $push :{
                        cart:{
                            id : req.body.productId,
                            quantity : 1,
                            date : Date.now()
                        }
                    }
                },
                //업데이트된 데이터 받자
                {new : true},
                (err,userInfo)=>{
                    if(err) return res.status(200).json({success:false,err})
                    //카트정보만 돌려보냄
                    res.status(200).json(userInfo.cart)
                }
            )

        }

    })
});

module.exports = router;
