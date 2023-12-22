const socket = io();
const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const INIT_CONSTRAINTS = {
  audio: true,
  video: true,
};

let myStream; // stream = video + voice
let isMute = false;
let isCameraOff = false;

getMedia();

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", hadleCameraChange);

// navigator.mediaDevices 공식 문서 참고: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices
async function getMedia(deviceId) {
  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : INIT_CONSTRAINTS,
    );
    myFace.srcObject = myStream;

    if (!deviceId) {
      // 맨 처음에만 카메라 selection dropdown 생성한다.
      await createCamerasSelectList();
    }
  } catch (err) {
    console.log(err);
  }
}

function handleMuteClick() {
  const audioTracks = myStream.getAudioTracks();
  audioTracks.forEach((track) => {
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
  videoTracks.forEach((track) => {
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

async function getDevices() {
  try {
    return await navigator.mediaDevices.enumerateDevices();
  } catch (err) {
    console.log(err);
  }
}

async function getCameras() {
  try {
    const devices = await getDevices();
    return devices.filter((device) => device.kind === "videoinput");
  } catch (err) {
    console.log(err);
  }
}

async function createCamerasSelectList() {
  const currentCamera = myStream.getVideoTracks()[0];

  try {
    const cameras = await getCameras();

    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;

      if (currentCamera.label === camera.label) {
        option.selected = true;
      }

      camerasSelect.appendChild(option);
    });

    return cameras;
  } catch (err) {
    console.log(err);
  }
}

async function hadleCameraChange() {
  try {
    await getMedia(camerasSelect.value); // 지정한 카메라로 전환하기 위해 스트림을 다시 불러온다. 이때, constraint에 video를 지정해준다.

    // 카메라 변경시 스트림 초기화되면서 음소거 및 카메라 on/off 설정이 풀리므로 수동으로 설정해준다.
    if (isMute) {
      myStream.getAudioTracks().forEach((track) => (track.enabled = false));
    } else {
      myStream.getAudioTracks().forEach((track) => (track.enabled = true));
    }

    if (isCameraOff) {
      myStream.getVideoTracks().forEach((track) => (track.enabled = false));
    } else {
      myStream.getVideoTracks().forEach((track) => (track.enabled = true));
    }
  } catch (err) {
    console.log(err);
  }
}
