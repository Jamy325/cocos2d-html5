//发消息
function aSendMsg(toUser, content){
	var af = angular.element(document.body).injector().get('accountFactory')
	var cf = angular.element(document.body).injector().get('chatFactory')
	var c = angular.element(document.body).injector().get('confFactory')
	var l = cf;
	l.setCurrentUserName(toUser);
	
	var e = l.createMessage({
	MsgType: c.MSGTYPE_TEXT,
	Content: content
	});
	
	l.appendMessage(e);
	l.sendMessage(e);
}

//修改备注名
function aModifyMark(toUser, name){
var v = angular.element(document.body).injector().get('mmHttp');
var f = angular.element(document.body).injector().get('confFactory');
var s = angular.element(document.body).injector().get('accountFactory')
v({
                                method: "POST",
                                url: f.API_webwxoplog,
                                data: angular.extend({
                                    UserName: toUser,
                                    CmdId: f.oplogCmdId.MODREMARKNAME,
                                    RemarkName: name
                                }, s.getBaseRequest()),
                                MMRetry: {
                                    count: 3,
                                    timeout: 1e4,
                                    serial: !0
                                }
                            }).success(function(t) {
                               console.log("aModifyMark", t);
                            }).error(function(e) {})
}

setTimeout(function(){
//监听聊天消息
var rs = angular.element(document.body).injector().get('$rootScope')
rs.$on("message:add:success", function(event, arg){ 
	var content = arg.Content;
	var user = arg.FromUserName;
	var MsgType = arg.MsgType;
	var Status = arg.Status;
	if (MsgType == 10000 && Status == 4){//10000为系统消息
		if(content .indexOf("verifycontact") != -1){
			console.log(arg);
			var u = window._contacts[user];
			if (!u) return;
			
			if (u.RemarkName.indexOf("del_") == 0){
				console.log(user,"已被标记为删除")
				return;
			}
			
			//确定被删除了
			setTimeout(function(){
				aModifyMark(user, "del_"+u.NickName);
			}, 1000)
		}
	}
 })
}, 3000);
