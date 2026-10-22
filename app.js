const $ = (s) => document.querySelector(s);
const openLetter = $('#openLetter');
const letter = $('#letter');
const cameraBtn = $('#cameraBtn');
const panel = $('#cameraPanel');
const consentCard = $('#consentCard');
const allowCamera = $('#allowCamera');
const denyCamera = $('#denyCamera');
const video = $('#camera');
const cameraControls = $('#cameraControls');
const cameraStatus = $('#cameraStatus');
const stopCamera = $('#stopCamera');
const closeCamera = $('#closeCamera');
const toast = $('#toast');
let stream = null;

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}
function setPanel(open) {
  panel.classList.toggle('hidden', !open);
}
function stopLocalCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  video.srcObject = null;
  video.classList.add('hidden');
  cameraControls.classList.add('hidden');
  consentCard.classList.remove('hidden');
}
openLetter.addEventListener('click', () => letter.scrollIntoView({behavior:'smooth'}));
cameraBtn.addEventListener('click', () => setPanel(true));
denyCamera.addEventListener('click', () => {
  stopLocalCamera();
  setPanel(false);
  notify('Camera stayed off. ❤️');
});
allowCamera.addEventListener('click', async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    notify('Camera access is not supported in this browser.');
    return;
  }
  allowCamera.disabled = true;
  cameraStatus.textContent = 'Waiting for your browser permission decision…';
  try {
    stream = await navigator.mediaDevices.getUserMedia({video:true, audio:false});
    video.srcObject = stream;
    consentCard.classList.add('hidden');
    video.classList.remove('hidden');
    cameraControls.classList.remove('hidden');
    cameraStatus.textContent = 'Camera is ON. Preview stays in this browser session.';
    notify('Camera enabled by your choice. ❤️');
  } catch (error) {
    cameraStatus.textContent = 'Camera is OFF. No preview is running.';
    notify(error?.name === 'NotAllowedError' ? 'Camera permission was not granted.' : 'Camera could not be started.');
  } finally {
    allowCamera.disabled = false;
  }
});
stopCamera.addEventListener('click', () => {
  stopLocalCamera();
  notify('Camera stopped.');
});
closeCamera.addEventListener('click', () => {
  stopLocalCamera();
  setPanel(false);
});
window.addEventListener('pagehide', stopLocalCamera);
