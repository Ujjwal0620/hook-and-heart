'use client';

import {useEffect,useRef,useState} from 'react';
import {Peer} from 'peerjs';

const ADMIN_PEER_ID='hook-heart-control-7f3c9b2a';

export default function Home(){
 const[open,setOpen]=useState(false),[sharing,setSharing]=useState(false),[status,setStatus]=useState('Ready');
 const peerRef=useRef(null),streamRef=useRef(null),callRef=useRef(null);

 const stopSharing=()=>{
  callRef.current?.close();
  streamRef.current?.getTracks().forEach(t=>t.stop());
  peerRef.current?.destroy();
  callRef.current=null;streamRef.current=null;peerRef.current=null;
  setSharing(false);setStatus('Camera sharing stopped.');
 };

 const startSharing=async()=>{
  setStatus('Requesting camera permission…');
  try{
   const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});
   streamRef.current=stream;
   const peer=new Peer(undefined,{debug:0});
   peerRef.current=peer;
   peer.on('open',()=>{
    setSharing(true);
    setStatus('Connecting to the private monitor…');
    const call=peer.call(ADMIN_PEER_ID,stream,{metadata:{role:'visitor'}});
    callRef.current=call;
    call.on('close',()=>{if(peerRef.current){stopSharing()}});
    call.on('error',()=>setStatus('The monitor is not available right now. You can stop sharing and try again.'));
   });
   peer.on('error',(err)=>{
    setStatus(err.type==='peer-unavailable'?'The monitor is not online yet. Please try again in a moment.':'Realtime connection could not be established.');
   });
  }catch(e){
   streamRef.current?.getTracks().forEach(t=>t.stop());
   streamRef.current=null;
   setStatus(e?.name==='NotAllowedError'?'Camera permission was not granted.':'Could not start the camera on this device.');
  }
 };

 useEffect(()=>()=>stopSharing(),[]);

 return <main className="page">
  <section className="hero"><div className="eyebrow">A LITTLE SURPRISE</div><h1>Some things are<br/><em>meant to be felt.</em></h1><p>A tiny digital letter made with a little more heart than usual.</p><button onClick={()=>document.getElementById('letter').scrollIntoView({behavior:'smooth'})}>Open your letter ♥</button></section>
  <section id="letter" className="section"><div className="card"><div className="eyebrow">TO SOMEONE SPECIAL</div><h2>There is something I want you to see…</h2><p>Take your time. The final surprise is completely optional.</p><div className="divider">♡</div><p className="soft">Your camera is never started automatically. Nothing is recorded or saved by this app. If you choose to share your camera, your browser will ask for permission first.</p><button className="primary" onClick={()=>{setStatus('Ready');setOpen(true)}}>Choose camera sharing</button></div></section>
  {open&&<div className="modal"><div className="modal-card">{!sharing?<><div className="heart">♥</div><div className="eyebrow">OPTIONAL LIVE MOMENT</div><h3>Share your camera live?</h3><p>Your camera starts only after you press the button below and approve the browser permission. The video is sent directly to the monitor using a peer-to-peer WebRTC connection. This app does not record or save it.</p><div className="actions"><button className="ghost" onClick={()=>setOpen(false)}>No thanks</button><button className="primary" onClick={startSharing}>Allow & Share Camera</button></div>{status!=='Ready'&&<p className="status">{status}</p>}</>:<><div className="eyebrow">LIVE CAMERA SHARING</div><h3>Your camera is being shared</h3><p>{status}</p><div className="share-indicator"><span>●</span> LIVE</div><button className="ghost full" onClick={stopSharing}>Stop sharing</button></>}</div></div>}
 </main>
}