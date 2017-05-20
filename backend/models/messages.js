var Message = require('../lib/mongoose').Message;
var  User = require('../lib/mongoose').User;
module.exports = {
    // 添加一条留言
    create: function create(message){
        return Message.create(message);
    },
    // 通过Id获取与好友的信息
    getMessageById:function getMessageById(Id,friendId){
        Message.update({sender:friendId,receiver:Id},{$set:{status:1}},{multi: true});
        return Message
          .find({"$or":[{sender:Id,receiver:friendId},{sender:friendId,receiver:Id}]},['content','receiver','sender','date'])
          sort({date:1});
    },
    // 通过Id获取未读信息
    getgetUnreadChatRecord: function getUnreadChatRecord(Id){
        var  message = Message
                        .find({receiver:Id,status:0},['content','receiver','sender','date'])
                        .sort({date:1});

        Message.update({receiver:Id,status:0},{$set:{status:1}},{multi: true});
        return message;
    }
}


// 此处可使用中间件
// Shema.post('find',function(){ 
//   将未读状态置为1.
// }); 
















