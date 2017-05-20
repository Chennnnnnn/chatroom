$(function(){

 $.ajaxSetup({ 
        xhrFields: { withCredentials: true }, 
        crossDomain: true,
        dataType:"json",      
    });

$("#statusBar").ajaxStart(function(){
                    $(this).html("正在登录...");
                });
$("#statusBar").ajaxStop(function(){
                    $(this).html("登录完成");
                });

// 登录按钮点击事件，点击后验证是否为空再发送请求,获取好友

$("#loginBtn").click(function(){
            var username = $("#name").val();
            var password = $("#password").val();
            baseUrl = "http://127.0.0.1:3000";
            if (username!=""&&password!="") {
                Userlogin(username,password);
                  //若账号密码不为空，则登录
            }
            else{
                if (username=="") {
                    alert("账号不能为空");
                    $("#name").focus();
                    return false;
                }else{
                    alert("密码不能为空");
                    $("#password").focus();
                    return false;
                }
            }            
        });

//回车登录

$(window).keydown(function(e) {
           var dis = $("#main").css("display");
            if (e.keyCode  == 13&&dis=="none") {
            $("#loginBtn").click();
            }
        });

$(window).keydown(function(ev) {
    var dis = $("#main").css("display");    
    var a = ev.keyCode || ev.which ;                                                                    
    if (ev.ctrlKey&&a==13&&dis=="inline-block")
    {
    var text = $("textarea").val() + "\n" ;  //  \r还是\n
    $("textarea").val(text);

    }
    else if (!ev.ctrlKey&&a==13&&dis=="inline-block") {
    $("#send").click();
    }
    });
    


$(".contacts").on("click",".friend",function(){
            var friendId = $(this).find("h5").text();
            var wantSendClass = $("#wantSend").attr("class");
            if (wantSendClass!=friendId) {
                    getInfo(friendId,getmyfriend);  
                    $(".friend").css("background-color","rgb(46,50,56)");
                    $(this).css("background-color","rgb(58,63,69)");
                    var friendRemark = $(this).find("span").text(); 
                    $("#friendinfo p,#friendinfo h5").remove();                                    
                    $("#wantSend").attr("class",friendId);  
                    $("#wantSend").after("<h5>"+friendRemark+"</h5>");//不将备注藏在h5中                   
            }
            $(".right").hide();

            $("#header h5").html("");
            $("#friendinfo").show();
  });


$(".contacts").on("change",".friend input",function(event){
                var friendRemark = $(this).val();
                var friendUserid = $(this).parent().find("h5").text(); 
                if (friendRemark!="") {
                setRemark(friendUserid,friendRemark); }
                else{
                    setRemark(friendUserid);
                    getInfo(friendUserid,setfriendnickname);
                    console.log("备注为空");
                }
                event.stopPropagation(); //停止事件冒泡
            }); 

//个人信息下拉菜单

$(".choose").click(function(){
    $(".more").toggle();
});


//点击页面其他位置，下拉菜单隐藏

 $("*").click(function (event) {
            if ($(this).attr("class")!="choose"){
                $(".more").hide();
            }
            event.stopPropagation();    //防止事件冒泡
        });

//修改个人信息点击事件

$(".more a:first").click(function(){
    getInfo(myId,getMyself);    
    $(".right").hide();
    $("#header h5").html("");
    $("#myself").show();
});


//退出登录点击事件

$(".more a:last").click(function(){
    clearInterval(t);
    $("#header h5").html("");
    logout();
});

//切换好友列表与聊天板块

$(".column:first,.column:first img").click(function(){
    $("#redDisc").hide();
    $(".chats").show();
    $(".contacts").hide();
    $(".column:first img").attr("src","images/chats_hover.png");
    $(".column:last img").attr("src","images/contacts.png");      
});
$(".column:last,.column:last img").click(function(){
    $(".chats").hide();
    $(".contacts").show();
    $(".column:first").children().attr("src","images/chats.png");
    $(".column:last").children().attr("src","images/contacts_hover.png");   
});


//点击确定，修改个人信息

$("#changemyinfos").click(function(){
    var myage = $("#myself input:eq(1)").val(),
        mysex = $("#myself input:eq(2)").val(),
        myemail = $("#myself input:eq(3)").val();
    if(checkschange(myemail,myage,mysex)){
        console.log("修改信息成功");
    changeinfo();
    }
    else{  getInfo(myId,getMyself); }
});

//点击取消，信息还原

$("#cancel").click(function(){
        getInfo(myId,getMyself); 
});


//点击发送信息，进入聊天窗口++++

$("#wantSend").click(function(){

    var friendId = $(this).attr("class");
    var friendNickname =  $("#wantSend+h5").text();
    var chatarray = new Array();    
    if ($("#"+friendId).length==0) {
        $(".chats").prepend("<div class=\"friendchats\" id=\""+friendId+"\">"       //+"<h5>"+friendId+"</h5>"
        +"<h4>"+friendNickname+"</h4><div class=\"redDisc\" ></div><span>X</span></div>");}
    else{       
        $(".chats").prepend($("#"+friendId));
    }
    //判断是否已生成相应的div
    $(".column:first").trigger("click");  //模拟点击
    getintochat(friendId,friendNickname);      //获取最近聊天记录
    $(".friendchats:first").click();
   
});

 //为聊天列表的div点击事件

$(".chats").on("click",".friendchats",function(){
    $(".friendchats").css("background-color","rgb(46,50,56)");
    $(this).css("background-color","rgb(58,63,69)");
    $(this).find(".redDisc").hide();
    $(this).find(".redDisc").text("");
    var friendId = $(this).attr("id");
    var friendNickname = $(this).find("h4").text();  
    if ($("#header h5").text()!=friendId) {
    getintochat(friendId,friendNickname);}

}); 


//删除X的出现

$(".chats").on("click","span",function(event){
    var friendId = $(this).parent().attr("id");
    if ($("#header h5").text()==friendId) {
    $("#header h5").text("");
    $(".right").hide();
     $("#nochoose").show(); 
    }
    
    $(this).parent().remove();
    event.stopPropagation(); 
});


//双击置顶聊天列表

$(".chats").on("dblclick",".friendchats",function(){
      $(".chats").prepend($(this));  
});

// 为“发送”添加点击事件

$("#send").on("click",function(){
    var friendId = $("#header h5").html();
    var content = $(".willSend").val();
     // getintochat(friendId,friendRemark);
    if (content!=""&&content!=" ") {
    sendTo(friendId,content);}
});  

//修改信息input宽度自适应

$("#myself").on("keyup","input",function(){
   // var input_size = $(this).val().length;
   var inputSize = $(this).val().replace(/[^\u0000-\u00ff]/g,"aa").length;
   this.size=inputSize;  
   });
});


//函数


//获取好友id，remark，获取最近，聊天记录，
function getintochat(friendId,friendNickname){
    // getUnreadByUserId(friendId,setword);   
     getRecentByUserId(friendId); 
    $("#header h5").html(friendId);
    $("#header span").html(friendNickname);
    $(".right").hide();
    $("#chatting").show();     
}


//登录后获取个人信息++++

function getMyself(infos){
    $("form").remove(); 
    $("#myinforma").append("<form><p>昵称：<input type=\"text\" value="+infos.nickName+
        " /></p><p>年龄：<input type=\"text\" value="+infos.age+
        " /></p><p>性别：<input type=\"text\" value="+infos.sex+
        " /></p><p>电子邮件：<input type=\"text\" value="+infos.email+
        " /></p><p>个性签名：<input type=\"text\" value="+infos.introduction+
        " /></p></form>");
    $("form input").each(function(i){  
   var inputSize = $(this).val().replace(/[^\u0000-\u00ff]/g,"aa").length;  
   this.size=inputSize;  
});  
}


//将未读消息的联系人加载到聊天列表中
function setchatdiv(friendinfos){
    $(".chats").prepend("<div class=\"friendchats\" id=\""+friendinfos.userid+"\">"  //+"<h5>"+friendinfos.userid+"</h5>"
        +"<h4>"+friendinfos.nickName+"</h4><div class=\"redDisc\" ></div><span>X</span></div>");
    getUnreadByUserId(friendinfos.userid,messagenumber);
    
}



//获取未读消息显示条数

function messagenumber(contents){   
    var friendid = contents[0].fromUserId;
    var baseCount = $("#"+friendid).find(".redDisc").text();
    var  count;
    if (baseCount!="") {count = contents.length + parseInt(baseCount);}
    else { count = contents.length; } 
    $("#"+friendid).find(".redDisc").text(count);
}



//将聊天记录加载到聊天版中+++++
function setword(data){
    var testImg = /^<img(.*?)>$/;
    var testlabel = /<(.*?)>/;


    for (var i = 0; i < data.length; i++) {
        var flag1 = testImg.test(data[i].content);   
        var flag2 = testlabel.test(data[i].content);  
                if(data[i].sender == myId){     
                  if(flag1){
                    $("#clear").before("<h6 class=\"time\">"+data[i].date+"</h6>"+"<img src=\"images/wechat2.png\" class=\"profilePhoto\"><div class=myMessage >"+data[i].content+"</div>");
                    
                  }
                  else if (!flag1&&flag2) {
                    $("#clear").before("<h6 class=\"time\">"+data[i].date+"</h6>"+"<img src=\"images/wechat2.png\" class=\"profilePhoto\"><div class=myMessage ><xmp>"+data[i].content+"</xmp></div>")
                }
                  else{
                    $("#clear").before("<h6 class=\"time\">"+data[i].date+"</h6>"+"<img src=\"images/wechat2.png\" class=\"profilePhoto\"><div class=myMessage ><pre>"+data[i].content+"</pre></div>");
                  
                  }     
                }
                else {
                    if(flag1){
                    $("#clear").before("<h6 class=\"time\">"+data[i].date+"</h6>"+"<img src=\"images/wechat2.png\" class=\"hisPhoto\"><div class=taMessage >"+data[i].content+"</div>");
                    
                  } 
                  else if (!flag1&&flag2) {
                    $("#clear").before("<h6 class=\"time\">"+data[i].date+"</h6>"+"<img src=\"images/wechat2.png\" class=\"hisPhoto\"><div class=taMessage ><xmp>"+data[i].content+"</xmp></div>");
                }
                  else{
                    $("#clear").before("<h6 class=\"time\">"+data[i].date+"</h6>"+"<img src=\"images/wechat2.png\" class=\"hisPhoto\"><div class=taMessage ><pre>"+data[i].content+"</pre></div>");
                  }     
                }
            }
    $("#chatboard").scrollTop($("#readHeight").height()); //滚动条定位
}



//加载好友列表++++

function getmyfriend(friendinfos){
         $("#fInfo").append("<p>昵称:<span>"+friendinfos.nickName+"</span></p><p>年龄："+
                        friendinfos.age+"</p><p>电子邮件："+friendinfos.email+"</p><p>个性签名："
                        +friendinfos.introduction+
                    "<p>性别："+friendinfos.sex+"</p>");
}



//将好友昵称加载到列表中
function setFriendnickname(friendinfo){
    $(".contacts").append("<div class=\"friend\" id=\""+friendinfo.userid+"1\"><h5>"+
               friendinfo.userid+"</h5>"+"<span>"+
               friendinfo.nickName+" </span>"+"</div>");
}

//返回好友昵称，加载到input中
function setfriendnickname(friendinfo){
    $("#"+friendinfo.userid+"1 input").val(friendinfo.nickName);
    if ($("#header h5").text()==friendinfo.userid) {$("#header span").text(friendinfo.nickName);}
            if ($("#"+friendinfo.userid).length>0) {$("#"+friendinfo.userid).find("h4").text(friendinfo.nickName);}
            if ($("#wantSend").attr("class")==friendinfo.userid) {$("#wantSend+h5").text(friendinfo.nickName)}       

}
//循环回调函数，检查登录状态，是否有新信息

function check(){
    t = setInterval(function(){
        checkslogin();
        // getUnreadUserId();
    },5000);
}


//修改信息表单验证
function checkschange(email,age,sex){
    console.log('fghjfhgfdhj');
    var testEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+.([a-zA-Z0-9_-])+/;
    var testAge = /^\+?[1-9][0-9]*$/;//正则表达式
    if(testEmail.test(email)==false){
        $("#myself h6").html("× 邮箱格式错误！").show(200).delay(2000).hide(200);
        // alert("× 邮箱格式错误！");
        return false;
    }
    else if (sex!="男"&&sex!="女") {
        $("#myself h6").html("× 性别格式错误！").show(200).delay(2000).hide(200);
        // alert("× 性别格式错误！");
        return false;
    }
    else if(testAge.test(age)==false) {
        $("#myself h6").html("× 年龄格式错误！").show(200).delay(2000).hide(200);
        // alert("× 年龄格式错误！");
        return false;
    }
    else {return true;}

}






//判断有无新信息
function getUnreadUserId(){
    $.ajax({
        url: baseUrl + '/getUnreadChatRecord',
        success:function(data){
            for (var i = 0; i < data.length; i++) {
                if ($("#header h5").html()==data[i]&&$("#"+data[i]).length!=0) {
                    $(".chats").prepend($("#"+data[i]));
                    getUnreadByUserId(data[i],setword); 
                }
                else if ($("#"+data[i]).length!=0&&$("#header h5").html()!=data[i]) {
                    $(".chats").prepend($("#"+data[i]));
                    $("#"+data[i]).find(".redDisc").show();
                    getUnreadByUserId(data[i],messagenumber);
                    if($("#chatBtn img").attr("src")=="images/chats.png"){
                         $("#redDisc").show();
                    }
                }
                else {     
                     if($("#chatBtn img").attr("src")=="images/chats.png"){
                         $("#redDisc").show();
                    }               
                    getInfo(data[i],setchatdiv);
                    
                }               
            }
        }
    });
}

//用户登录,页面跳转，获取好友列表，清空chats，

function Userlogin(username,password){
    $.ajax({
                url: baseUrl + '/login',
                type:'post',
                data: {
                    account:username,
                    password:password
                },               
                success:function(data){
                    if (!data.error) {
                    myId = data._id;
                            //获取用户信息
                    $(".myname").empty();
                    $(".myname").append(username);
                    $("#login").hide();
                    $(".right").hide();
                    $("#nochoose").show();        //显示未选择聊天
                    $("#main").css("display","inline-block");
                    $("#chatBtn").click();
                    console.log('dhfgyutsdfyutsd');
                    getFriend();                 //获取好友列表
                    check();
                 } 
                    else{
                        alert(data.error);
                    }       //循环回调，检查是否登录
    
                },
                error:function(){
                    alert("连接超时！");
                }
            });

}

//发送信息
function sendTo(friendid,contents){
    var userid = friendid;
    var content = contents;
    $.ajax({
        url:baseUrl + '/sendContent',
        type:'post',
        data:{
            receiver:userid, //字符串，表示你要给哪个好友发送消息 
            content:content
        },
        success:function(data){
           if (data.status=="success") {    
            var time = new Date();
            var before1 = (time.getMonth()<10?"-0":"-");
            var before2 = (time.getDate()<10?"-0":"-");
            var after1 = (time.getMinutes()<10?":0":":");
            var after2 = (time.getSeconds()<10?":0":":");
            var sendTime = time.getFullYear()+before1+time.getMonth()+before2+time.getDate()+" "+
            time.getHours()+after1+time.getMinutes()+after2+ time.getSeconds(); 
            var mySend = [{
                sender : myId,
                content :content,
                date : sendTime
            }]; 
            setword(mySend);  
            $("textarea").val("");
            }
        },
        
    });
}




//定义获取用户信息的函数

function getInfo(userid,func){
    $.ajax({
        url : baseUrl + '/getUserInfor',
        type:'get',
        data:{
            id: userid
        },
        success:function(data){
            func(data);
        },
    });
};

//根据id号获取未读信息

function getUnreadByUserId(userid,func){
    $.ajax({
        url:baseUrl + 'getUnreadChatRecord',
        type:'get',
        success:function(data){         
            func(data);
             //显示到聊天版中
        }
    });
}

//获取最近聊天记录，一个好友

function getRecentByUserId(friendId){
    $("textarea").val("");
    $.ajax({
        url : baseUrl +'/getChatRecord',
        type:'get',
        data:{
            id:friendId
        },
        success:function(data){
            $(".myMessage,.taMessage,h6,h6+img").remove();
             setword(data);
        },
    });

}


//获取好友列表 ，修改好友备注

function getFriend(){   
    $.ajax({        
        url : baseUrl + '/getList',
        type:'get',
        success:function(data){  
            console.log(data);       
            for (var i = 0; i < data.length; i++) { 
                $(".contacts").append("<div class=\"friend\" id=\""+ data[i]._id+"1\"><h5>"+
               data[i]._id+"</h5>"+"<span>"+
               data[i].account+"</span>"+"</div>"); 
           }                       
        },
    });
}

//检查登录状态
function checkslogin(){
    $.ajax({
        url : baseUrl + '/checkslogin',
        type:'get',
        success:function(data){
            
            if(data.error){
                clearInterval(t);
                $("#login").show();
                $(".chats").empty();
                $(".contacts").empty();
                $("#main").css("display","none");
                alert("请重新登录！");
            }
        },
    });
}



//退出登录函数
function logout(){
    $.ajax({
        url : baseUrl + '/logout',
        success:function(){
            $("#login").show();
            $(".chats").empty();
            $(".contacts").empty();
            $("#main").css("display","none");//待添加 
            myId="";   
            $("#name").val("");
            $("#password").val("");
        },
        error:function(){
            alert("退出登录失败！");
             //待添加
        }
    });
}



//修改用户信息
function changeinfo(){
var     nickname = $("#myself input:eq(0)").val(),
        age = $("#myself input:eq(1)").val(),
        sex = $("#myself input:eq(2)").val(),
        email = $("#myself input:eq(3)").val(),
        introduction = $("#myself input:eq(4)").val();
      $.ajax({
        url : baseUrl + '/updateUserInfor',
        type:'post',
        data:{
             nickname,//字符串，用户的昵称 
             age, //整型，用户的年龄 
             sex,  //单个字符，用户的性别用“男”“女”表示 
             introduction, //字符串，用户的自我介绍 
             email, //字符串，用户的email
        },
        success:function(data){
            if (data.statue=="success") {
                $("#myself h6").html("修改成功！").show(200).delay(2000).hide(200);
                console.log(email);
           }
        },
        error:function(){console.log("error");}
    });        
}



//修改好友备注
function setRemark(friendUserid,friendRemark){
    var userid = friendUserid;
    var remark = friendRemark;
    $.ajax({
        url : baseUrl + '?action=Friend&method=setRemark',
        data : {
            userid:userid,
            remark:remark
        },
        success:function(data){
            if ($("#header h5").text()==userid) {$("#header span").text(remark);}
            if ($("#"+userid).length>0) {$("#"+userid).find("h4").text(remark);}
            if ($("#wantSend").attr("class")==userid) {$("#wantSend+h5").text(remark)}           
        },
    });
}


















