const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// 10자리인 솔트를 만들어서 이것을 이용해 암호화함
const jwt = require('jsonwebtoken');


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
    password:{
        type : String,
        minlength : 5
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

// 유저스키마가 불려가 save하기 전 function의 동작을 실행함
userSchma.pre('save',function( next ){
    // 비밀번호 암호화시켜야함.
    
    var user = this;
    // 나의 평문 비밀번호를 불러오기 위한 호출
    
    if(user.isModified('password')){
        
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);
            // hash의 첫번째 인자는 평문 그대로의 비밀번호
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            });
        });
    }else{
        next()
    }
        
});


userSchma.methods.comparePassword = function(plainPassword,cb){
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){

        if(err){
            return cb(err)
        }else{
            return cb(null,isMatch)
        }
    })
}

userSchma.methods.generateToken = function(cb){
    
    var user = this;

    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)
    })

}

userSchma.statics.findByToken = function(token,cb){
    var user = this;
    // 토큰을 디코드 한다.

    jwt.verify(token, 'secretToken', function(err,decoded){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 토큰과 데이터베이스의 보관된 토큰이 일치하는지 확인

        user.findOne({"_id" : decoded,"token":token},function(err,user){
            if(err) {
                return cb(err);
            }else{
                cb(null,user);
            }
        })
    })

}

const User = mongoose.model('User',userSchma)
// 스키마를 모델로 감싸줌

module.exports ={User}
// 이 모델을 여러 파일에서도 사용할 수 있게 export
// index.js에서 require하여 경로지정, cont { user }로 스키마를 감쌋던 user를 사용 할 수 있다.
