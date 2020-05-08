alert("请到页面左侧查看聊天窗口")
var is_reg="0";
var speeches=10;
var talker="";//当前聊天对象
var wxDiv="";
var wxContent=""
var wxButton="";
var preMsg="";
var tipText="To"  //提示信息
function addElement () {
	
	wxDiv = document.createElement("div"); 
	wxDiv.style.width='400px';
	wxDiv.style.fontSize='8px';	
	wxDiv.style.color='#000000'
	wxDiv.style.position='absolute';
	wxDiv.setAttribute("draggable", "true");
	//wxDiv.style.backgroundColor='white'
	wxContent = document.createElement("div"); 
	wxContent.style.width='400px';
	wxDiv.appendChild(wxContent); 
	wxContent.innerText="还没有收到消息...";
	wxContent.id="wx_content";
	
	
	var wxContent_2 = document.createElement("div");
	wxContent_2.style.display='' 
	wxContent_2.style.width='400px';
	var wxInput = document.createElement("input");
	wxContent_2.appendChild(wxInput);	
	wxInput.id="wx_input";
	wxInput.style.width='300px';	
	wxInput.style.border='solid 1px #cc66cc' ;
	 
	wxButton = document.createElement("div"); 
	
	wxContent_2.appendChild(wxButton);
	wxButton.innerText="..."
	wxButton.id="wx_button";
	
	
	wxDiv.appendChild(wxContent_2); 	
	document.body.appendChild(wxDiv);
	
	wxContent.addEventListener('click',function(){ 
			if(wxInput.style.display=='')
				wxInput.style.display='none'
			else
				wxInput.style.display=''	
	})
	
	wxButton.addEventListener('click',function(){ 
			if(wxContent.style.display==''){
				wxContent.style.display='none'
				wxInput.style.display='none'
				
			}	
			else{
				wxContent.style.display=''	;
				wxInput.style.display='';				
			}	
		
	});	
	wxInput.addEventListener('keypress',onKeyPress);
}

function onKeyPress(e)    {
        var keyCode = null; 
        if(e.which)
            keyCode = e.which;
        else if(e.keyCode) 
            keyCode = e.keyCode;            
        if(keyCode == 13) 
        {
            sendMsg();
            return false;
        }
        return true;
    }

function sendMsg(){
	var wxInput=document.getElementById("wx_input");
	if(is_reg=="0" && speeches<1){
		wxInput.value="超出使用限制,在菜单中点击help获取注册码(regcode)";
	 	return;
	}	
	
	if (talker=="") return;
			
	if(wxInput.value.trim()=="") return;		
	chrome.runtime.sendMessage({chat: wxInput.value.trim()}, function(response) {});		
	wxInput.value ="";
}	

function doStuff(request, sender, sendResponse){	
	  //当聊天内容隐藏的时候，新消息提示
	  is_reg=request.is_reg;
	  speeches=request.speeches;	
		if(wxContent.style.display=='none'){
		
			if(preMsg!=request.msg){
					wxButton.style.color='#FF69B4'
			}
			
		}	else{
			preMsg=request.msg;
			wxButton.style.color='#000000';
		}		
		
		document.getElementById("wx_content").innerHTML=request.msg	;
	
		
		tipText="To";
		
		if(request.talker){
			talker=request.talker;
			tipText=" To: "+ request.talker;
		}	else{
			talker="";			
		}	
		if(request.newmsg!=0){
			tipText=" ("+request.newmsg+") "+tipText;
		}	
		document.getElementById("wx_button").innerText=tipText;
		
	
}	


function removeChat(){	
	chrome.runtime.onMessage.removeListener(doStuff);	
	wxDiv.parentElement.removeChild(wxDiv);	
}	

(function init(){
	if(wxDiv) {
		wxDiv.style.display="";
		return;
	}	
	
	addElement ();
	wxDiv.style.left='20px';
	wxDiv.style.top= "300px"
	
	chrome.runtime.sendMessage({chat:"first-msg"}, function(response) {});
	chrome.runtime.onMessage.addListener(doStuff);
	
	
////////////////拖动开始/////////////////////////////
  var drag_area=document.body;
  wxDiv.ondragstart=function(evt){       
      var evt=evt || window.event;       
      evt.dataTransfer.setData("text",(evt.clientX-this.offsetLeft)+";"+(evt.clientY-this.offsetTop));
  }
  drag_area.ondragover=function(evt){   
      if(typeof evt.preventDefault=="function"){
          evt.preventDefault();
      }else{
          evt.returnValue=false;
      }
  }
  drag_area.ondragenter=function(evt){  
      if(typeof evt.preventDefault=="function"){
          evt.preventDefault();
      }else{
          evt.returnValue=false;
      }
  }
  drag_area.ondrop=function(evt){
      var evt=evt || window.event;
      var drag_data=evt.dataTransfer.getData("Text").split(";");
      var offset_x=drag_data[0],
              offset_y=drag_data[1];
      if(typeof evt.preventDefault=="function"){ 
          evt.preventDefault();
      }else{
          evt.returnValue=false;
      }
     wxDiv.style.left=(evt.clientX-offset_x)+"px";
     wxDiv.style.top=(evt.clientY-offset_y)+"px";
  }
//////////////////////////////////拖动结束/////////////////////////////////		
	
})();

/*
function selfBackMsg(){	
	var wxInputBat=document.getElementById("wx_input_bat");	
	if(!wxInputBat) return;
	var msg=wxInputBat.value.trim()
	if(msg=="") {	
		msg="-";
	}		
	chrome.runtime.sendMessage({chat: msg}, function(response) {
		if(response && response!='-') { document.getElementById("wx_content").innerText=response;}
    //console.log('收到来自后台的回复：' + response);
    wxInputBat.value="";
    setTimeout(selfBackMsg,500);
  });

}
selfBackMsg();
*/