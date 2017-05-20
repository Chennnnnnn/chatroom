var express = require('express');
var path = require('path');
var session = require('express-session');
// var config = require('config-lite');
var routes = require('./routes');
var config = require('./config/default');
var bodyParser  =  require("body-parser");  
var app = express();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// session中间件
app.use(session({
  name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  // store: new MongoStore({// 将 session 存储到 mongodb
  //   url: config.mongodb// mongodb 地址
  // })
}));

 app.use(bodyParser.urlencoded({ extended: false })); 
//  设置跨域请求
 app.use(bodyParser.json());   
  app.all('*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", null);
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
      res.header("X-Powered-By",' 3.2.1');
      res.header("Content-Type", "application/json;charset=utf-8");
      res.header("Access-Control-Allow-Credentials", "true");
      next();
  });

// 路由
routes(app);
console.log(config.session);
// 监听端口，启动程序
app.listen(config.port, function () {
  console.log(`listening on port ${config.port}`);
});


// npm i express express-session config-lite mongoose







