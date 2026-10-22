import {NextResponse} from 'next/server';
import crypto from 'node:crypto';
import {AccessToken} from 'livekit-server-sdk';
function validAdmin(cookie){
 if(!cookie)return false;
 const[value,sig]=cookie.split('.');
 if(value!=='authenticated'||!sig)return false;
 const expected=crypto.createHmac('sha256',process.env.ADMIN_PASSWORD||'').update(value).digest('hex');
 return crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected));
}
export async function POST(req){
 try{
  const body=await req.json();
  if(!['visitor','admin'].includes(body.role))return NextResponse.json({error:'Invalid role.'},{status:400});
  if(body.role==='admin'&&!validAdmin(req.cookies.get('hh_admin')?.value))return NextResponse.json({error:'Unauthorized'},{status:401});
  const{LIVEKIT_API_KEY:key,LIVEKIT_API_SECRET:secret,LIVEKIT_URL:url}=process.env;
  if(!key||!secret||!url)return NextResponse.json({error:'LiveKit environment variables are missing.'},{status:500});
  const room=process.env.LIVEKIT_ROOM||'hook-heart-global';
  const identity=(body.role==='admin'?'admin-':'visitor-')+crypto.randomUUID();
  const at=new AccessToken(key,secret,{identity,name:identity,ttl:'2h'});
  at.addGrant({room,roomJoin:true,canPublish:body.role==='visitor',canSubscribe:true});
  return NextResponse.json({token:await at.toJwt(),url});
 }catch{return NextResponse.json({error:'Token creation failed.'},{status:500})}
}