const socket = io();
const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const constraints = {
  audio: true,
  video: true,
};

let myStream; // stream = video + voice
let isMute = false;
let isCameraOff = false;

getMedia();

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);


// 공식 문서 참고: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia(constraints);
    myFace.srcObject = myStream;
  } catch (err) {
    console.log(err);
  }
}

function handleMuteClick() {
  const audioTracks = myStream.getAudioTracks();
  audioTracks.forEach(track => {
    track.enabled = !track.enabled;
  });

  if (isMute) {
    muteBtn.innerText = "Mute";
    isMute = false;
  } else {
    muteBtn.innerText = "Unmute";
    isMute = true;
  }
}

function handleCameraClick() {
  const videoTracks = myStream.getVideoTracks();
  videoTracks.forEach(track => {
    track.enabled = !track.enabled;
  });
  
  if (isCameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    isCameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    isCameraOff = true;
  }
}
