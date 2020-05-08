var sendmessagediv=document.getElementById("sendmessagediv");
sendmessagediv.addEventListener('click',function(){sendWXMessage()});

function sendWXMessage(){
//jQuery('#editArea').html('hii');
//jQuery('#editArea').trigger(jQuery.Event('keydown', { keyCode: 13,ctrlKey: true}));
//jQuery('#editArea').html('hii');
//document.getElementsByClassName("btn btn_send")[0].click();
angular.element('pre:last').scope().editAreaCtn = sendmessagediv.innerText;
angular.element('pre:last').scope().sendTextMessage();
}	

  

