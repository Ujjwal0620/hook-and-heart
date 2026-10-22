'use client';
import {useEffect,useRef,useState} from 'react';

const ROOM=process.env.NEXT_PUBLIC_JITSI_ROOM||'hook-heart-live-7f3c9b2a';

export default function Home(){
 const[open,setOpen]=useState(false),[live,setLive]=useState(false);
 const close=()=>setLive(false);
 return <main className="page">
  <section className="hero"><div className="eyebrow">A LITTLE SURPRISE</div><h1>Some things are<br/><em>meant to be felt.</em></h1><p>A tiny digital letter made with a little more heart than usual.</p><button onClick={()=>document.getElementById('letter').scrollIntoView({behavior:'smooth'})}>Open your letter ♥</button></section>
  <section id="letter" className="section"><div className="card"><div className="eyebrow">TO SOMEONE SPECIAL</div><h2>There is something I want you to see…</h2><p>Take your time. The final surprise is completely optional.</p><div className="divider">♡</div><p className="soft">Your camera is never started automatically. If you choose to share it, your browser will show its normal camera permission prompt. You can stop sharing at any time.</p><button className="primary" onClick={()=>setOpen(true)}>Choose camera sharing</button></div></section>
  {open&&<div className="modal"><div className="modal-card">{!live?<><div className="heart">♥</div><div className="eyebrow">OPTIONAL LIVE MOMENT</div><h3>Share your camera live?</h3><p>Choose “Allow & Share Camera” to join the private live room. Your camera is shared only after you make this choice. This application does not record or save video.</p><div className="actions"><button className="ghost" onClick={()=>setOpen(false)}>No thanks</button><button className="primary" onClick={()=>setLive(true)}>Allow & Share Camera</button></div></>:<><div className="eyebrow">LIVE CAMERA SHARING</div><h3>Your camera is being shared</h3><p>Keep this window open while you want to share. Use “Stop sharing” to leave immediately.</p><JitsiRoom room={ROOM}/><button className="ghost full" onClick={close}>Stop sharing</button></>}</div></div>}
 </main>
}
function JitsiRoom({room}){
 const ref=useRef(null);
 useEffect(()=>{if(!ref.current)return;const iframe=document.createElement('iframe');iframe.src='https://meet.jit.si/'+encodeURIComponent(room);iframe.allow='camera; microphone; fullscreen; display-capture; autoplay';iframe.allowFullscreen=true;iframe.title='Live camera sharing';iframe.className='jitsi-frame';ref.current.replaceChildren(iframe);return()=>{iframe.src='about:blank';ref.current?.replaceChildren()}},[room]);
 return <div ref={ref} className="jitsi-wrap"/>;
}