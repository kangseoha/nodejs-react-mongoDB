const express = require('express');
const port = 3000;
const app = express();
const bodyParser = require('body-parser');
const  { User } = require("./models/User");
const config = require("./config/key");

// application/x-www-form-urlencoded의 형식으로 오는 데이터는 받아서 파싱함
app.use(bodyParser.urlencoded({extended:true}))

// application/json 형식의 파일을 받음
app.use(bodyParser.json())

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false
}).then(()=>console.log('mongoDB connected..'))
.catch(err=>console.log(err))

app.get('/',(req,res) => res.send('hello world 할룽베이베'))
app.post('/register',(req,res) =>{
    // 회원가입 시 필요한 정보를 데이터베이스에 저장
    const user = new User(req.body);
    user.save((err,doc) =>{
        if(err) return res.json({success : false , err})
        return res.status(200).json({
            success : true
        })
    })
});

app.listen(port,() => {
  console.log(`Example app listening on port ${port}!`);
});