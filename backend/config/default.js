module.exports = {
  port: 3000, //端口3000
  session: {                   //express-session的配置信息
    secret: 'wechat', 
    key: 'wechat',
    maxAge: 10*60*1000
  },
  mongodb: 'mongodb://127.0.0.1:27017/wechatt'      //mongodb的地址
};