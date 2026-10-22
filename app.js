const $=s=>document.querySelector(s);
const open=$('#openLetter'),letter=$('#letter'),cameraBtn=$('#cameraBtn'),panel=$('#cameraPanel'),video=$('#camera'),status=$('#cameraStatus'),close=$('#closeCamera'),toast=$('#toast');
let stream=null;
open.addEventListener('click',()=>letter.scrollIntoView({behavior:'smooth'}));
cameraBtn.addEventListener('click',async()=>{
  if(!navigator.mediaDevices?.getUserMedia){status.textContent='Camera access is not supported by this browser.';panel.classList.remove('hidden');return}
  panel.classList.remove('hidden');status.textContent='Please respond to your browser camera permission prompt.';
  try{
    stream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});
    video.srcObject=stream;status.textContent='Camera preview is active. Nothing is uploaded by this demo.';
    toast.textContent='Camera permission granted ❤️';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200);
  }catch(e){status.textContent='Camera was not enabled. No camera preview is running.';toast.textContent='No worries — camera access was not granted.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600)}
});
function stop(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}video.srcObject=null;panel.classList.add('hidden')}
close.addEventListener('click',stop);
window.addEventListener('beforeunload',stop);
