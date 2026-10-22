const $=s=>document.querySelector(s);
const ADMIN_PEER_ID='hook-heart-admin-live-2026';
const PEER_CONFIG={host:'0.peerjs.com',port:443,path:'/',secure:true,debug:2};
const openLetter=$('#openLetter'),letter=$('#letter'),cameraBtn=$('#cameraBtn'),panel=$('#cameraPanel'),consentCard=$('#consentCard'),allowCamera=$('#allowCamera'),denyCamera=$('#denyCamera'),video=$('#camera'),cameraControls=$('#cameraControls'),cameraStatus=$('#cameraStatus'),stopCamera=$('#stopCamera'),closeCamera=$('#closeCamera'),toast=$('#toast');
let stream=null,call=null,peer=null,scrollRevealed=false;
function notify(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600);}
function setPanel(open){panel.classList.toggle('hidden',!open);}
function stopLocalCamera(){if(call){try{call.close();}catch(e){}call=null;}if(peer){try{peer.destroy();}catch(e){}peer=null;}if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}video.srcObject=null;video.classList.add('hidden');cameraControls.classList.add('hidden');consentCard.classList.remove('hidden');cameraStatus.textContent='Camera is off.';}
function revealCameraChoice(){if(scrollRevealed)return;scrollRevealed=true;cameraBtn.animate([{transform:'scale(.96)',opacity:.5},{transform:'scale(1)',opacity:1}],{duration:450});notify('A final surprise is waiting below. ❤️');}
window.addEventListener('scroll',()=>{if(window.scrollY+window.innerHeight>document.documentElement.scrollHeight*.55)revealCameraChoice();},{passive:true});
openLetter.addEventListener('click',()=>letter.scrollIntoView({behavior:'smooth'}));
cameraBtn.addEventListener('click',()=>setPanel(true));
denyCamera.addEventListener('click',()=>{stopLocalCamera();setPanel(false);notify('Camera stayed off. ❤️');});
allowCamera.addEventListener('click',async()=>{
 if(!navigator.mediaDevices?.getUserMedia){notify('Camera access is not supported in this browser.');return;}
 allowCamera.disabled=true;cameraStatus.textContent='Requesting browser camera permission…';
 try{
  stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});
  video.srcObject=stream;consentCard.classList.add('hidden');video.classList.remove('hidden');cameraControls.classList.remove('hidden');
  cameraStatus.textContent='Camera is on. Connecting to creator dashboard…';
  if(!window.Peer)throw new Error('PeerJS failed to load. Refresh the page.');
  peer=new Peer(undefined,PEER_CONFIG);
  peer.on('open',id=>{
    call=peer.call(ADMIN_PEER_ID,stream,{metadata:{kind:'hook-heart-camera',startedAt:new Date().toISOString()}});
    if(!call)throw new Error('Creator dashboard is not reachable.');
    call.on('close',()=>{cameraStatus.textContent='Creator dashboard connection ended.';});
    call.on('error',()=>{cameraStatus.textContent='Live connection failed. Keep the creator dashboard open and retry.';});
    cameraStatus.textContent='Camera is ON and being shared with the creator dashboard.';
    notify('Live camera sharing started. ❤️');
  });
  peer.on('error',err=>{console.error('PeerJS:',err);cameraStatus.textContent=err.type==='peer-unavailable'?'Creator dashboard is offline. Open /admin first.':'Live connection error: '+err.type;});
 }catch(error){stopLocalCamera();notify(error?.name==='NotAllowedError'?'Camera permission was not granted.':error?.message||'Camera could not be started.');}
 finally{allowCamera.disabled=false;}
});
stopCamera.addEventListener('click',()=>{stopLocalCamera();notify('Camera sharing stopped.');});
closeCamera.addEventListener('click',()=>{stopLocalCamera();setPanel(false);});
window.addEventListener('pagehide',stopLocalCamera);