'use client';
import {useState} from 'react';

const ROOM=process.env.NEXT_PUBLIC_JITSI_ROOM||'hook-heart-live-7f3c9b2a';

export default function Admin(){
 const[password,setPassword]=useState(''),[authed,setAuthed]=useState(false),[error,setError]=useState(''),[loading,setLoading]=useState(false);
 const login=async()=>{setLoading(true);setError('');try{const r=await fetch('/api/admin/session',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({password})});if(!r.ok)throw new Error('Invalid admin password.');setAuthed(true)}catch(e){setError(e.message)}finally{setLoading(false)}};
 const logout=async()=>{await fetch('/api/admin/logout',{method:'POST'});setAuthed(false)};
 if(!authed)return <main className="admin-page"><div className="admin-login card"><div className="eyebrow">PRIVATE CREATOR DASHBOARD</div><h1>Hook & Heart</h1><p>Only visitors who explicitly choose camera sharing can appear in this realtime room.</p><input autoFocus type="password" placeholder="Admin password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}/><button className="primary full" disabled={loading||!password} onClick={login}>{loading?'Checking…':'Enter dashboard'}</button><p className="status">{error}</p></div></main>;
 return <main className="admin-page"><header><div><div className="eyebrow">REALTIME ONLY • JITSI MEET</div><h1>Live Monitor</h1><p>Consenting visitors appear here while they are connected. No application database or recording is used.</p></div><button className="ghost" onClick={logout}>Log out</button></header><section className="admin-live card"><div className="participant-head"><strong>LIVE ROOM</strong><span>● ACTIVE</span></div><JitsiRoom room={ROOM}/></section></main>
}
function JitsiRoom({room}){
 return <div className="jitsi-wrap admin-jitsi"><iframe src={'https://meet.jit.si/'+encodeURIComponent(room)} allow="camera; microphone; fullscreen; display-capture; autoplay" allowFullScreen title="Hook & Heart live monitor" className="jitsi-frame"/></div>;
}