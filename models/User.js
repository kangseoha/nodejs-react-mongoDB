const mongoose = require('mongoose');

const userSchma = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true,
        unique : 1
    },
    lastname:{
        type : String,
        maxlength : 50
    },
    role : {
        type:Number,
        default : 0
    },
    image : String,
    token:{
        type:String
    },
    tokenExp:{
        type : Number
    }
})

const User = mongoose.model('User',userSchma)
// 스키마를 모델로 감싸줌

module.exports ={User}
// 이 모델을 여러 파일에서도 사용할 수 있게 export
// index.js에서 require하여 경로지정, cont { user }로 스키마를 감쌋던 user를 사용 할 수 있다.
