var express = require('express');
var checkLogin = require('../middlewares/check').checkLogin;
var checkNotLogin = require('../middlewares/check').checkNotLogin;

module.exports = function(app){
   
    // 测试主页
    app.get('/',function(req,res){
        // res.send('dsf');
        console.log('dsfsg');
        res.sendfile('wechat.html');
        // res.render('test.html');
    });
    //注册
    app.post('/register',checkNotLogin,require('./handle').register);

    // 登录
    app.post('/login',require('./handle').login);

    // 登出
    app.get('/logout',checkLogin,require('./handle').logout);
    
    // 获去用户信息
    app.get('/getUserInfor',checkLogin,require('./handle').getUserById);

    // 获取好友列表
    app.get('/getList',checkLogin,require('./handle').getList);

    // 修改个人资料
    app.post('/updateUserInfor',checkLogin,require('./handle').updateUser);

    // 发送信息给好友
    app.post('/sendContent',checkLogin,require('./handle').sendContent);

    //获取与某个好友的聊天记录
    app.get('/getChatRecord',checkLogin,require('./handle').getChatRecord);

    // 查看是否有新的消息
    app.get('/getUnreadChatRecord',checkLogin,require('./handle').getUnreadChatRecord);
    
    //检查是否处于登录状态
    app.get('/checkslogin',checkLogin,require('./handle').checkslogin);

}