import {NextResponse} from 'next/server';
import crypto from 'node:crypto';
export const dynamic='force-dynamic';
function sign(value){return crypto.createHmac('sha256',process.env.ADMIN_PASSWORD||'').update(value).digest('hex')}
export async function POST(req){
 try{
  const{password}=await req.json();
  const expected=process.env.ADMIN_PASSWORD;
  if(!expected)return NextResponse.json({error:'ADMIN_PASSWORD is not configured on this deployment.'},{status:500,headers:{'Cache-Control':'no-store'}});
  if(typeof password!=='string'||password!==expected)return NextResponse.json({error:'Invalid admin password.'},{status:401,headers:{'Cache-Control':'no-store'}});
  const value='authenticated.'+sign('authenticated');
  const res=NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  res.cookies.set('hh_admin',value,{httpOnly:true,secure:true,sameSite:'strict',path:'/',maxAge:7200});
  return res;
 }catch{return NextResponse.json({error:'Invalid login request.'},{status:400,headers:{'Cache-Control':'no-store'}})}
}