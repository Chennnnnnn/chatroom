// var config = require('config-lite'); //读取配置文件
var config = require('../config/default');
var Mongoose = require('mongoose');
var mongoose = new Mongoose.Mongoose();
mongoose.connect(config.mongodb);


// 用户表
var UserSchema = new mongoose.Schema({
    account: { type:String, unique: true },     //账号
    nickname: String,                   //昵称
    password: String,                           //密码
    age : Number,                               //年龄
    sex : {type :'string', enum:['男','女'] },  //性别
    email : String,                             //邮箱
    introduction : String,                      //自我介绍
    // remark : String                          //备注
},{
  versionKey: false
});

// UserSchema.index({account:1},{unique:true});
// UserSchema.index({account:1});
exports.User = mongoose.model('User',UserSchema);


// 消息表
var MessageSchema = new mongoose.Schema({
    sender : String,
    receiver : String,
    content : String ,
    date : String,
    status: { type:'number',enum:[0,1] } //0代表未读，1代表已读
},{
  versionKey: false
});

MessageSchema.index({date:-1});
exports.Message = mongoose.model('Message',MessageSchema);














