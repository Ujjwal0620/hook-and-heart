'use client';
import {useState} from 'react';
import {JitsiMeeting} from '@jitsi/react-sdk';

const ROOM='hook-heart-live-7f3c9b2a-91e4-4b7d-a2c6-8d4f19e2b671';

export default function Admin(){
 const[password,setPassword]=useState(''),[authed,setAuthed]=useState(false),[error,setError]=useState(''),[loading,setLoading]=useState(false);
 const login=async()=>{setLoading(true);setError('');try{const r=await fetch('/api/admin/session',{method:'POST',headers:{'content-type':'application/json'},cache:'no-store',body:JSON.stringify({password})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Admin login failed.');setAuthed(true)}catch(e){setError(e.message||'Admin login failed.')}finally{setLoading(false)}};
 const logout=async()=>{await fetch('/api/admin/logout',{method:'POST',cache:'no-store'});setAuthed(false);setPassword('')};
 if(!authed)return <main className="admin-page"><div className="admin-login card"><div className="eyebrow">PRIVATE CREATOR DASHBOARD</div><h1>Hook & Heart</h1><p>Only visitors who explicitly choose camera sharing can appear in this realtime room.</p><input autoFocus type="password" placeholder="Admin password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}/><button className="primary full" disabled={loading||!password} onClick={login}>{loading?'Checking…':'Enter dashboard'}</button>{error&&<p className="status">{error}</p>}</div></main>;
 return <main className="admin-page"><header><div><div className="eyebrow">REALTIME ONLY • JITSI MEET</div><h1>Live Monitor</h1><p>Active consenting visitors appear in this live room. No application database or recording is used.</p></div><button className="ghost" onClick={logout}>Log out</button></header><section className="admin-live card"><div className="participant-head"><strong>LIVE ROOM</strong><span>● ACTIVE</span></div><div className="jitsi-wrap admin-jitsi"><JitsiMeeting domain="meet.jit.si" roomName={ROOM} configOverwrite={{prejoinConfig:{enabled:false},startWithAudioMuted:true,startWithVideoMuted:true,disableInviteFunctions:true,disableSelfView:false,enableLobbyMode:false}} interfaceConfigOverwrite={{TOOLBAR_BUTTONS:['tileview','fullscreen','hangup'],MOBILE_APP_PROMO:false,TILE_VIEW_MAX_COLUMNS:4}} userInfo={{displayName:'Admin Monitor'}} getIFrameRef={node=>{node.style.height='100%'}}/></div></section></main>
}