'use client';
import {useState} from 'react';
import {LiveKitRoom,VideoTrack,useTracks} from '@livekit/components-react';
import {Track} from 'livekit-client';
import '@livekit/components-styles';

export default function Home(){
 const[open,setOpen]=useState(false),[token,setToken]=useState(null),[url,setUrl]=useState(null),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const start=async()=>{
  setBusy(true);setMessage('Preparing secure live connection…');
  try{
   const r=await fetch('/api/live/token',{method:'POST',headers:{'content-type':'application/json'},cache:'no-store',body:JSON.stringify({role:'visitor'})});
   const d=await r.json().catch(()=>({}));
   if(!r.ok)throw new Error(d.error||`Live room unavailable (HTTP ${r.status}). Check the LiveKit configuration in Vercel.`);
   if(!d.token||!d.url)throw new Error('Live room configuration is incomplete. Add LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET in Vercel, then redeploy.');
   setToken(d.token);setUrl(d.url);setMessage('Connection ready. Your browser will now request camera permission.');
  }catch(e){setMessage(e.message||'Unable to start camera sharing.');setBusy(false)}
 };
 const stop=()=>{setToken(null);setUrl(null);setOpen(false);setMessage('');setBusy(false)};
 return <main className="page">
  <section className="hero"><div className="eyebrow">A LITTLE SURPRISE</div><h1>Some things are<br/><em>meant to be felt.</em></h1><p>A tiny digital letter made with a little more heart than usual.</p><button onClick={()=>document.getElementById('letter').scrollIntoView({behavior:'smooth'})}>Open your letter ♥</button></section>
  <section id="letter" className="section"><div className="card"><div className="eyebrow">TO SOMEONE SPECIAL</div><h2>There is something I want you to see…</h2><p>Take your time. The final surprise is completely optional.</p><div className="divider">♡</div><p className="soft">Your camera is never started automatically. If you choose to share it, your browser will show its normal permission prompt and you can stop sharing whenever you want.</p><button className="primary" onClick={()=>setOpen(true)}>Choose camera sharing</button></div></section>
  {open&&<div className="modal"><div className="modal-card">{!token?<><div className="heart">♥</div><div className="eyebrow">OPTIONAL LIVE MOMENT</div><h3>Share your camera live?</h3><p>If you choose “Allow & Share Camera”, your live camera feed will be sent through the realtime room to the private creator dashboard. This application does not record or save the video.</p><div className="actions"><button className="ghost" onClick={()=>setOpen(false)}>No thanks</button><button className="primary" disabled={busy} onClick={start}>{busy?'Preparing…':'Allow & Share Camera'}</button></div><p className="status">{message}</p></>:<LiveRoom url={url} token={token} onClose={stop}/>}</div></div>}
 </main>
}
function LiveRoom({url,token,onClose}){return <div><div className="eyebrow">LIVE CAMERA SHARING</div><h3>Your camera is being shared</h3><p>The live connection is active. Close this window or use the button below to stop immediately.</p><LiveKitRoom serverUrl={url} token={token} connect={true} video={true} audio={false} onDisconnected={onClose} className="room"><VisitorVideo/></LiveKitRoom><button className="ghost full" onClick={onClose}>Stop sharing</button></div>}
function VisitorVideo(){const tracks=useTracks([{source:Track.Source.Camera,withPlaceholder:false}]);return <div className="preview">{tracks[0]?<VideoTrack trackRef={tracks[0]}/>:<div className="status">Starting camera…</div>}</div>}