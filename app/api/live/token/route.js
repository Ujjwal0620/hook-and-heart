import {NextResponse} from 'next/server';
import crypto from 'node:crypto';
import {AccessToken} from 'livekit-server-sdk';
export const dynamic='force-dynamic';
export const runtime='nodejs';
function validAdmin(cookie){
 if(!cookie)return false;
 const[value,sig]=cookie.split('.');
 if(value!=='authenticated'||!sig)return false;
 const expected=crypto.createHmac('sha256',process.env.ADMIN_PASSWORD||'').update(value).digest('hex');
 if(sig.length!==expected.length)return false;
 return crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected));
}
export async function POST(req){
 try{
  const body=await req.json();
  if(!['visitor','admin'].includes(body.role))return NextResponse.json({error:'Invalid role.'},{status:400,headers:{'Cache-Control':'no-store'}});
  if(body.role==='admin'&&!validAdmin(req.cookies.get('hh_admin')?.value))return NextResponse.json({error:'Admin session expired. Log in again.'},{status:401,headers:{'Cache-Control':'no-store'}});
  const{LIVEKIT_API_KEY:key,LIVEKIT_API_SECRET:secret,LIVEKIT_URL:url}=process.env;
  const missing=[!url&&'LIVEKIT_URL',!key&&'LIVEKIT_API_KEY',!secret&&'LIVEKIT_API_SECRET'].filter(Boolean);
  if(missing.length)return NextResponse.json({error:`LiveKit is not configured on this deployment. Missing: ${missing.join(', ')}. Add these to Vercel Environment Variables and redeploy.`},{status:500,headers:{'Cache-Control':'no-store'}});
  if(!/^wss?:\/\//.test(url))return NextResponse.json({error:'LIVEKIT_URL must start with wss:// (or ws:// for local testing). Do not use https://.'},{status:500,headers:{'Cache-Control':'no-store'}});
  const room=process.env.LIVEKIT_ROOM||'hook-heart-global';
  const identity=(body.role==='admin'?'admin-':'visitor-')+crypto.randomUUID();
  const at=new AccessToken(key,secret,{identity,name:identity,ttl:'2h'});
  at.addGrant({room,roomJoin:true,canPublish:body.role==='visitor',canSubscribe:true});
  const token=await at.toJwt();
  return NextResponse.json({token,url,room},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return NextResponse.json({error:`Token creation failed: ${e?.message||'unknown server error'}`},{status:500,headers:{'Cache-Control':'no-store'}})}
}