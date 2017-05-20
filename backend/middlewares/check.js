module.exports = {
    checkLogin: function checkLogin(req,res,next){
        if(!req.session.user){
            res.json({error:'未登录'});
        }
        next();
    },

    checkNotLogin: function checkNotLogin(req,res,next){
        if(req.session.user){
            res.json({error:'已登录'});
        }
        next();
    }
}