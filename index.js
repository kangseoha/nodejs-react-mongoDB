const express = require('express');
const port = 3000;
const app = express();
const bodyParser = require('body-parser');
const config = require("./config/key");
const cookieParser = require('cookie-parser')

const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

// application/x-www-form-urlencoded의 형식으로 오는 데이터는 받아서 파싱함
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());

// application/json 형식의 파일을 받음
app.use(bodyParser.json())

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false
}).then(()=>console.log('mongoDB connected..'))
.catch(err=>console.log(err))

app.get('/',(req,res) => res.send('hello world 할룽베이베'))

app.post('/api/user/register',(req,res) =>{
    // 회원가입 시 필요한 정보를 데이터베이스에 저장
    const user = new User(req.body);
    
    user.save((err,doc) =>{

        if(err) return res.json({success : false , err})
        return res.status(200).json({
            success : true
        })
    })
});

app.post('/api/users/login',(req,res)=>{
    // console.log('login 진입')
    User.findOne({email : req.body.email },(err,user) =>{
        // console.log("findOne진입");
        // console.log(user)
        if(!user){
            return res.json({
                loginSuccess : false,
                message : "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        user.comparePassword(req.body.password,(err,isMatch)=>{
            // console.log("비밀번호 일치 여부 조회")
            if(!isMatch)
                return res.json({loginSuccess : false, message : "비밀번호가 일치하지 않습니다."})

            user.generateToken((err,user) => {
                if(err) return res.status(400).send(err);
                // 토큰을 쿠키나 로컬스토리지에 저장한다.
                res.cookie('x_auth',user.token).status(200).json({loginSuccess : true, userId : user._id})

            })
        })
    })
})


app.get('/api/users/auth', auth, (req,res) =>{
    // auth 미들웨어를 통과한 것은 auth가 성공했다는 이야기

    res.status(200).json({
        _id : req.user_id,
        isAdmin : req.user.role === 0 ? false : true,
        isAuth : true,
        email : req.user_email,
        name : req.user.name,
        lastname : req.user.lastname,
        image : req.user.image
    })
})

app.get('/api/users/logout',auth,(req,res) =>{
    console.log("로그아웃 진입")
    User.findOneAndUpdate({_id : req.user._id}, { token : "" }, 
    ( err,user ) => {
        console.log(err);
        if(err) return res.json({success : false, err});
        return res.status(200).send({success:true})
    })
})

app.listen(port,() => {
  console.log(`Example app listening on port ${port}!`);
});