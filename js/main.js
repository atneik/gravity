"use strict";

var jsonDataURL = "https://dl.dropboxusercontent.com/u/23289062/gravity-project-video/data.json";

document.addEventListener("DOMContentLoaded", function(){
  AJAX_JSON_Req(jsonDataURL);
}, false);

function populateLinksToPlayerID(videoLinks, videoPlayer){
  for(var type in videoLinks){
    //console.log( type );
    var newSrcChild = document.createElement('source');
    newSrcChild.setAttribute('type', 'video/'+type);
    newSrcChild.setAttribute('src',videoLinks[type]);
    videoPlayer.appendChild(newSrcChild);
  }
}

function AJAX_JSON_Req(url){
    var AJAX_req = new XMLHttpRequest();
    AJAX_req.open( "GET", url, true );
    AJAX_req.setRequestHeader("Content-type", "application/json");
    AJAX_req.onreadystatechange = function(){
        if( AJAX_req.readyState == 4 && AJAX_req.status == 200 ){
            var contentData = JSON.parse( AJAX_req.responseText );
            
            var videoLinks = contentData[0].videoURL[0];
            var videoPlayer = document.getElementById("videoPlayer");
            populateLinksToPlayerID( videoLinks, videoPlayer);

            var audioLinks = contentData[0].audioURL[0];
            var audioPlayer = document.getElementById("audioPlayer");
            populateLinksToPlayerID( audioLinks, audioPlayer);
            
            document.getElementById("copyText").innerHTML = contentData[0].copyText;

            var backImageURLAttr = "background-image: url(" + contentData[0].backImageURL + ")";
            document.getElementById("backImage").setAttribute('style', backImageURLAttr);
            
            init();
        }
    }
    AJAX_req.send();
}

function init(){
  var backVideo = document.querySelector("#backVideo video");
  var skipButton = document.getElementById("skipButton");
  var videoControls = document.getElementById("videoControls");
  var backImage = document.getElementById("backImage");
  var backImageParent = backImage.parentNode;
  var audioPlayer = document.getElementById("audioPlayer");
  var audioPlayStopButton = document.getElementById("audioPlayStopButton");
  var content = document.querySelector(".content");
  
  var timeInterval = 3; //in sec
  var timeMoved = 0;//timeInterval * 10;

  function toggleToBackImage(){
    videoControls.parentNode.removeChild(videoControls);
    backVideo.parentNode.removeChild(backVideo);
    backImageParent.appendChild(backImage);
    setTimeout(function(){
      backImage.style.opacity = 1.0;
      setTimeout(function(){
        content.style.opacity = 1.0;
      }, 5000);
    }, 0);
  }

  backVideo.onended = function() {
    toggleToBackImage();
  };

  backVideo.onloadstart = function() {
   
  };

  backImageParent.removeChild(backImage);

  setInterval(function(){
    timeMoved++;
    if(timeMoved > (timeInterval * 10)){
      videoControls.style.display = "none";
      backVideo.style.cursor = "none";
    }else{
      videoControls.style.display = "block";
      backVideo.style.cursor = "default";
    }
  }, 100);

  document.addEventListener('mousemove', function(){
    timeMoved = 0;
  }, false);

  skipButton.addEventListener('click',function(){
    toggleToBackImage();
  }, false);

  function audioPlay(){
    audioPlayer.play(); 
  }

  function audioPause(){
    audioPlayer.pause(); 
  }

  audioPlayStopButton.addEventListener('click',function(){
    if (audioPlayer.paused){
        audioPlay();
        audioPlayStopButton.innerHTML = "Pause &nbsp; <i style='color:red' class='fa fa-pause'></i>";
      }
    else {
        audioPause();
        audioPlayStopButton.innerHTML = "Listen &nbsp; <i class='fa fa-headphones'></i>";
      }
  }, false);

  audioPlayer.onended = function() {
    audioPause();
  };
}
