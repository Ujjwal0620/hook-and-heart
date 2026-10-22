'use client';

import {useEffect,useRef,useState} from 'react';
import {Peer} from 'peerjs';

const ADMIN_PEER_ID='hook-heart-control-7f3c9b2a';

export default function Admin(){
 const[online,setOnline]=useState(false),[error,setError]=useState(''),[visitors,setVisitors]=useState([]);
 const peerRef=useRef(null),videoRefs=useRef(new Map()),callsRef=useRef(new Map());

 useEffect(()=>{
  const peer=new Peer(ADMIN_PEER_ID,{debug:0});
  peerRef.current=peer;
  peer.on('open',()=>setOnline(true));
  peer.on('call',call=>{
   call.answer();
   const id=call.peer;
   callsRef.current.set(id,call);
   call.on('stream',stream=>{
    setVisitors(prev=>prev.some(v=>v.id===id)?prev.map(v=>v.id===id?{...v,stream}:v):[...prev,{id,stream}]);
   });
   const remove=()=>{
    callsRef.current.delete(id);
    setVisitors(prev=>prev.filter(v=>v.id!==id));
   };
   call.on('close',remove);
   call.on('error',remove);
  });
  peer.on('error',err=>{
   if(err.type==='unavailable-id')setError('The monitor is already open in another tab.');
   else setError('Realtime monitor could not start. Please refresh and try again.');
  });
  return()=>{callsRef.current.forEach(c=>c.close());callsRef.current.clear();peer.destroy();peerRef.current=null};
 },[]);

 useEffect(()=>{
  visitors.forEach(v=>{
   const node=videoRefs.current.get(v.id);
   if(node&&node.srcObject!==v.stream){node.srcObject=v.stream;node.play().catch(()=>{})}
  });
 },[visitors]);

 return <main className="admin-page"><header><div><div className="eyebrow">PRIVATE MONITOR • WEBRTC</div><h1>Live Monitor</h1><p>No login, no database, no Jitsi and no recording. Visitors appear here only after they explicitly allow camera sharing.</p></div><div className="monitor-state"><span className={online?'dot live':'dot'}></span>{online?'MONITOR ONLINE':'CONNECTING…'}</div></header><section className="admin-live card"><div className="participant-head"><strong>LIVE VISITORS</strong><span>{visitors.length} ACTIVE</span></div>{error&&<p className="status">{error}</p>}{!visitors.length?<div className="empty-monitor"><div className="empty-heart">♡</div><h2>Waiting for a visitor</h2><p>Keep this page open. When someone explicitly chooses “Allow & Share Camera”, their live video will appear here.</p></div>:<div className="visitor-grid">{visitors.map(v=><article className="visitor-tile" key={v.id}><div className="visitor-label"><span>● LIVE</span><small>Visitor</small></div><video ref={node=>{if(node)videoRefs.current.set(v.id,node)}} autoPlay playsInline muted/></article>)}</div>}</section></main>
}