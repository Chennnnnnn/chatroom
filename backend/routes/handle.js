var UserModel = require('../models/users');
var MessageModel = require('../models/messages');
var checkLogin = require('../middlewares/check').checkLogin;
var checkNotLogin = require('../middlewares/check').checkNotLogin;

module.exports = {

    register: function register(req,res){
        var account = req.body.account + '348';
        var password = req.body.password;
        // 判断账户是否是数字

        try{
            if(!account.length)
              throw new Error('账号不能为空');
            if(!password.length)
              throw new Error('密码不能为空');  
            if(/[a-zA-Z0-9]/.test(account))
              throw new Error('账号只能是数字或字母');
        }catch(e){
            res.json({error:e.message});
        }

        var user = {
           account: account,
            password:password
        };

        console.log(user);


        // 检查注册名称是否已经有
        UserModel.getUserByAccount(account)
          .then(function(result){ 
              if(result){           
                  res.json({error:'用户已存在'});
              }else{
                   // 将用户信息写入数据库
                    UserModel.create(user)
                    .then(function(user){    
                        // delete user.password; 
                        user.password = undefined;   
                        req.session.user = user;            
                        res.json(user);                     
                    })
                    .catch(function(e){
                        if(e.message.match('E11000 duplicate key')){
                            console.log(e);
                            console.log(e.message);
                            res.json({error:'注册失败'});
                        }
                        //   next(e);
                    })
                }
          });
       
    },

    login: function login(req,res){
        var account = req.body.account;
        var password = req.body.password ;

        // 查找是否有改用户，有则校对密码
        UserModel.getUserByAccount(account)
         .then(function(user){
             if(!user){
                 res.json({error:'用户不存在'});
             }
             if(password !== user.password){
                 res.json({error:'用户名或密码错误'});
             }
            //  delete user.password;
             user.password = undefined;
             user.status = 'success';
             req.session.user = user;
             res.json(user);          
         });
    },

    logout: function logout(req,res){
        // 删除session
        req.session.user = null;
        res.json({success:'注销成功'});
    },

    getUserById: function getUserById(req,res){
        
        var Id = req.query.id;
        UserModel.getUserById(Id)
          .then(function(result){
              console.log(result); 
              result.status = "success";             
              res.json(result);
          });
     
    },

    getList: function getList(req,res){
        if(req.session.user._id){
            UserModel.getUsers()
            .then(function(result){
                res.json(result);
            });
        }
        else res.json({error:'请先登录'});
    },

    updateUser: function updateUser(req,res){
        var userId = req.session.user._id;
        var account = req.body.account;
        // 查看账户是否已经存在
        var nickname = req.body.nickname; 
        var age = req.body.age; 
        var sex = req.body.sex;
        var email = req.body.email;
        var introduction = req.body.introduction;
        // console.log((age instanceof Number)); 
        // if(!(age instanceof Number)){
        if(/^[0-9]*$ /.test(age)){
              res.json({error:'年龄格式错误'});
              return;
         }
        if(!( sex == '男' || sex == '女')){
            res.json({error:'性别格式错误'});
            return;
        }
       
        var user = {
            nickname : nickname,
            age : age,
            sex : sex,
            email : email,
            introduction : introduction
        };
        // 将数据更新
        UserModel.updateUserById(userId,user)
         .then(function(result){
             console.log(result);  
             res.json({success:'修改成功'});          
         });

    },

    sendContent:function sendContent(req,res){
        var userId = req.session.user._id;
        var content = req.body.content;  
        var receiver = req.body.receiver; 
        // 新建一条消息
        var message = {         
            receiver : receiver,
            sender : userId,
            date : new Date(),
            content : content,
            status : 0
        };
        // 判断是否有人
        UserModel.getUserById(receiver)
          .then(function(receiver){
              if(!receiver)
                res.json({error:'接收者不存在'});
              else
                // 将信息存入
                MessageModel.create(message)
                .then(function(result){
                    // data.status = "success";
                    res.json({status:'success'});
                })
                .catch(function(e){
                    if(e.message.match('E11000 duplicate key')){
                        res.json({error:'存在错误'});
                    }
                    //   next(e);
                })
          });
    },

    getChatRecord: function getChatRecord(req,res){
        var sender = req.session.user._id;
        var receiver = req.query.id;
        console.log(sender);
        console.log(receiver);
        // 获取聊天记录
        MessageModel.getMessageById(sender,receiver)
          .then(function(result){
              res.json(result);
            //   res.send(result.slice(0,6));
          });
    },

    getUnreadChatRecord: function getUnreadChatRecord(req,res){
        var userId = req.session.user._id;
        // 获取新的消息
        MessageModel.getgetUnreadChatRecord(userId)
          .then(function(result){
              console.log(result);
              res.json(result);
          });        
    },
      // 检查登录
    checkslogin: function checkslogin(req,res){
      if(!req.session.user){
          res.json({error:'未登录'});
      }else{
          res.json({success:'已登录'}); 
      }
    }

}