var  User = require('../lib/mongoose').User;

module.exports = {
    // 注册一个用户
    create : function create(user){
        return User.create(user);
    },

    // 用于登录
    getUserByAccount: function getUserByAccount(account) {
        return User
          .findOne({ account: account });
   },

    //通过userId获取用户信息
    getUserById : function getUserById(Id){
        return User
          .findOne({_id:Id},['account','age','email','sex','introduction']);
    },

    // 获取所用用户信息
    getUsers : function getUsers(){
        return User
           .find({},['account']);
    },

    // 修改用户信息
    updateUserById: function updateUserById(Id,data){
        return User
          .update({_id:Id},{$set:data});
    }


}