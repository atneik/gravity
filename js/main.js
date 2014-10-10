"use strict";

var GRAVITY = window.GRAVITY || {};
var jsonDataURL = "https://dl.dropboxusercontent.com/u/23289062/gravity-project-video/data.json";

/*************************
* Add source links to video or audio elements. Iterates through all links in given 'links' 
* and appends source elements to given player (video or audio).
* 
* @param    links       object with multiple links 
* @param    player      video or audio element
* @param    kind        type of source, video or audio 
**************************/

var populateLinksToPlayerID = function(links, player, kind){
  for(var type in links){
    console.log( type );
    var newSrcChild = document.createElement('source');
    newSrcChild.setAttribute('type', kind + '/' + type);
    newSrcChild.setAttribute('src', links[type]);
    player.appendChild( newSrcChild );
  }
}

/*************************
* Fetches the JSON file; parses it; uses the data to populate source in video, audio,
* background and text. Then finally, call the init() function.
* 
* @param    url         url to the json file       
**************************/

GRAVITY.AJAX_JSON_Req = function( url ){
    var AJAX_req = new XMLHttpRequest();
    AJAX_req.open( "GET", url, true );
    AJAX_req.setRequestHeader( "Content-type", "application/json" );
    AJAX_req.onreadystatechange = function(){
        if( AJAX_req.readyState == 4 && AJAX_req.status == 200 ){
            var contentData = JSON.parse( AJAX_req.responseText );
            
            //Add video sources from the json data
            var videoLinks = contentData[0].videoURL[0];
            var videoPlayer = document.getElementById( "videoPlayer" );
            populateLinksToPlayerID( videoLinks, videoPlayer, "video" );

            //Add audio sources from the json data
            var audioLinks = contentData[0].audioURL[0];
            var audioPlayer = document.getElementById( "audioPlayer" );
            populateLinksToPlayerID( audioLinks, audioPlayer, "audio");
            
            //Add copy from the json data
            document.getElementById( "copyText" ).innerHTML = contentData[0].copyText;

            //Set the background image using url from the json data
            var backImageURLAttr = "background-image: url(" + contentData[0].backImageURL + ")";
            document.getElementById( "backImage" ).setAttribute('style', backImageURLAttr);
            
            //for defining button and other funtionality 
            GRAVITY.initInteractivity();
        }
    }
    AJAX_req.send();
}

/*************************
* Hide Video controls after timeout; show them upon mouse movement.
* Skip video button and listen audio funtionality.
*
**************************/

GRAVITY.initInteractivity  = function(){
  var backVideo = document.querySelector("#backVideo video");
  var skipButton = document.getElementById("skipButton");
  var videoControls = document.getElementById("videoControls");
  var backImage = document.getElementById("backImage");
  var backImageParent = backImage.parentNode;
  var audioPlayer = document.getElementById("audioPlayer");
  var audioPlayStopButton = document.getElementById("audioPlayStopButton");
  var content = document.querySelector(".content");
  
  var timeInterval = 3; //Time interval for in sec
  var timeMoved = timeInterval * 10;

  //
  // Hide the video controls after timeOut. Show upon mouse movement. 
  //
  setInterval( function(){
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

  //
  // Video funtionality button. 
  //
  backImageParent.removeChild(backImage);

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

  backVideo.addEventListener('ended', toggleToBackImage, false);

  skipButton.innerHTML = "Skip &nbsp; <i class='fa fa-step-forward'></i>";
  skipButton.addEventListener('click',function(){
    toggleToBackImage();
  }, false);

  //
  // Audio funtionality.
  //
  function audioPlay(){
    audioPlayer.play(); 
  }

  function audioPause(){
    audioPlayer.pause(); 
  }

  audioPlayStopButton.innerHTML = "Listen &nbsp; <i class='fa fa-headphones'></i>";
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

  audioPlayer.addEventListener('ended', audioPause, false);
}

/*************************
* Fullscreen
*
**************************/

  //Toggle full screen when Space is pressed
  document.addEventListener("keydown", function(e) {
  if (e.keyCode == 32) {
    toggleFullScreen();
    }
  }, false);

  function enterFullScreen(){
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  }

  function exitFullScreenMy() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
      enterFullScreen();
    } else {
      exitFullScreenMy();
    }
  }

/*************************
* INIT - by calling the AJAX_JSON_Req(..) funtion when DOM content is done loading.
*
**************************/

document.addEventListener("DOMContentLoaded", function(){
  GRAVITY.AJAX_JSON_Req(jsonDataURL);
  toggleFullScreen();
}, false);
