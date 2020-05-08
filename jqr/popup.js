var wx_id="0";
var phpname="setlog.php";
var mulu="chromewx";
function op(e) { 
	chrome.storage.local.get(['regcode'], function(result) { 
		if (!result.regcode)
		{
		  chrome.tabs.create({url:"https://wx.qq.com",active:true}, function (tab){});
		   
		}else{
			var regcode=result.regcode;		
			var xhr = new XMLHttpRequest();
			
			xhr.open("GET", "http://www.datun.com.cn/soft/"+mulu+"/"+phpname+"?code=test", true);
			xhr.onreadystatechange = function() {	
				if (xhr.readyState == 4) {						
					chrome.tabs.create({url:"https://wx.qq.com",active:true}, function (tab){});
				}	
			}
			xhr.send();
		}			
	});      
}


function ohelp(e) {
 chrome.tabs.create(
      {url:"http://www.datun.com.cn/soft/"+mulu+"/index.php",active:true}, function (tab){ });	
}

 
function setWXStore(val){		
	chrome.storage.local.set({'wxid': val}, function() {
	   console.log('Value is set to ' + val);
	});		
}	


document.addEventListener('DOMContentLoaded', function () {
	var is_reg="0";
	var bgPage = chrome.extension.getBackgroundPage();
	is_reg=bgPage.getReg();
	bgPage.checkWxExist();	
	var wx_id=bgPage.getWxId();
	var chat_id=bgPage.getChatId();	
	var current_id="0";
	var current_url="";		
	
	
	if(is_reg=="0"){ 		
	 	var register=document.getElementById("register");	
	  var reg=document.getElementById("reg");	
		register.style.display="";
	 	register.addEventListener('click',function(){	 			
			reg.style.display="";
			register.style.display="none";	 				
		})
	 	
	 	var breg=document.getElementById("b_reg"); 	 
	 	breg.addEventListener('click',function(){
				var t_reg=document.getElementById("t_reg").value;	
				if(t_reg!=""){			
					chrome.storage.local.set({'regcode': t_reg}, function() {});
					chrome.runtime.sendMessage({notify:"reg"}, function(response) {});								
				}	
				document.getElementById("t_reg").value="";
				register.style.display="";
				reg.style.display="none";	
			})
 	}	
	
	
	var dhelp=document.getElementById("help");		
	dhelp.addEventListener('click',ohelp);
	
	
	chrome.tabs.getSelected(null, function (tab) {			
		current_id=tab['id'];		
		current_url=tab['url'];			
		if(wx_id=="0") {				
			var openwx=document.getElementById("owx");
			openwx.style.display="block";
  		openwx.addEventListener('click',op);			
		}	
		
		if(current_url.indexOf("wx.qq.com")!=-1 || current_url.indexOf("chrome")==0 || current_url.trim()==""){
			if(wx_id!=0){
				var tip=document.getElementById("tip");				
				tip.style.display="block";				
			}	
			return;
		}	
		
		if(chat_id==current_id){
			var removechat=document.getElementById("removechat");
			removechat.style.display="block";
			removechat.addEventListener('click',function(){ 			
				bgPage.resetChatId();
				chrome.tabs.executeScript(null,{code:"removeChat();"}); 
				window.close();  	
			})			
		}	
		
		
		
		if( (wx_id!=0) && (chat_id==0||chat_id!=current_id) ) {			
			var chat=document.getElementById("chat");
			chat.style.display="block";
			chat.addEventListener('click',function(){
				if(chat_id!=0){
					bgPage.resetChatId();
					chrome.tabs.executeScript(chat_id,{code:"removeChat();"}); 					
				}	
				chrome.tabs.executeScript(null, {file: "chat.js"});
			})
		}	
   });
});	