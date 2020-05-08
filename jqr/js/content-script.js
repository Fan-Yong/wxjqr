var is_reg="0";
var self_id=0;
var current_con="  ";
var space="&nbsp;";
var space2="----------";
var ls=" ";
var rs=" ";
var prehtml="---";
var speeches=10;

/*
function getCSWXContent(){
	if(document.getElementsByClassName("box_bd chat_bd scrollbar-dynamic scroll-content")){
	 	var box=document.getElementsByClassName("box_bd chat_bd scrollbar-dynamic scroll-content")[0];
	 	
	 	if(box){
		 	current_con=box.innerText.replace(/\n/g,"`").replace(/```/g,' ').replace(/`/g,':');
	    //console.log(current_con); 
	  }     
  } 
	
}	*/

function getTalker(){
	var title=$('.title_name.ng-binding');
	if(title.length>0)  
		return title.text();
	else
		return "--"	
	
}

 function getTalkId(i){ 
 	var talkid="000";
 	var regExp =/msgId&quot;:&quot;(\d){2,}&quot/gi; 
 	if (res = regExp.exec(i)){
			talkid=res[0].replace("msgId&quot;:&quot;","").replace("&quot","");
	}
  return talkid;
} 




function getNewMsg(){
	var new_msg=$('.icon.web_wechat_reddot_middle.ng-binding.ng-scope');
  return new_msg.length;
	
}	
function getCSWXContent(){
	
	var All_Content=$(".box_bd.chat_bd.scrollbar-dynamic.scroll-content");
	if(prehtml==All_Content.html())  return;
	prehtml=All_Content.html();
	current_con=" ";
	//console.log(All_Content.length);
	var  talks=All_Content.find("div[ng-repeat='message in chatContent']");	
	var talk,talkhtml,talkid,img,say,bq,temp,temp1,temp2
	for (var i=0;i<talks.length;i++){	    
	    current_con+=ls;
	    talk=talks.eq(i);
	    talkhtml=talk.html();
	    talkid=getTalkId(talkhtml);
	    
	    sys=talk.find("p.message_system");
	    if(sys.length>0){
	        //系统消息
	        current_con+="系统:"+sys.text();
	    }
	    img=talk.find("img.avatar");    
	    if(img.length>0){
	        title=img.attr("title").replace(/<.*?>/ig,"");
	        current_con+=title+":";
	        say =talk.find("pre.js_message_plain.ng-binding");
	        if(say.length>0){
	            bq=say.find("img");
	            temp=say.html();
	            for(var b=0;b<bq.length;b++){
	            	if(typeof(bq.eq(b).attr("text"))!="undefined"){
		            	temp1=bq.eq(b).attr("text").length;
		            	if(temp1>4)
		            		temp=temp.replace(/<img.*?>/i,bq.eq(b).attr("text").slice(0,temp1-4));
		            	else
	            			temp=temp.replace(/<img.*?>/i,"[img]");	
		            }		
	            	else{
	            		temp=temp.replace(/<img.*?>/i,"[img]");	
	            	}	
	            }	
	            temp=temp.replace(/<br?>/ig,space);
	            current_con+=temp.replace(/<.*?>/ig,"")
	            
	            
	        } else{	
	        	  if (talk.find(".video").length>0)   {
	        	  	 current_con+="[视频]";
	        	  }else
	        	  {	
	        	  
							  if (talk.find(".picture").length>0){
							  	current_con+="[图片]";
							  }else{							    	  
	            		current_con+="["+talk.text().replace(/[\r\n]/g,'').replace(/\s+/g, ' ')+"]";
	            	}	
	            }	
	        }
	    }
	     current_con+=rs+"("+talkid+")"+space2;
	    
	}
	if(current_con==" ") current_con="暂无消息"
}	

function sendCSWXMessage(content){
	if(is_reg=="0" && speeches<1){
	 	return;
	}		
	
  var sendmessagediv=document.getElementById("sendmessagediv");
	sendmessagediv.innerText=content;
	sendmessagediv.click();
	
}	
function injectCustomJs()
{
    jsPath = 'js/inject.js';
    var sendmessagediv=document.createElement('div');
    sendmessagediv.innerText="----";
    sendmessagediv.id="sendmessagediv";
    document.head.appendChild(sendmessagediv);
    
    
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://lgbeijfmlakcfkhfnmkmlcfomhaeknfa/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    document.head.appendChild(temp);
}

injectCustomJs();

function  selfBackMsg(){
	  getCSWXContent();
		chrome.runtime.sendMessage({curcon:current_con,talker:getTalker(),newmsg:getNewMsg()}, function(response) {
		
	    setTimeout(selfBackMsg,2000);
	  });	
	
}	


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	is_reg=request.is_reg;
	speeches=request.speeches;
	sendCSWXMessage(request.msg);
	//console.log(request.msg);
}	)
selfBackMsg();


/////////////////////////增加///////////////////////////////


 
