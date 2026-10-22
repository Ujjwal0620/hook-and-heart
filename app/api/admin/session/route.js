import {NextResponse} from 'next/server';
import crypto from 'node:crypto';
function sign(value){return crypto.createHmac('sha256',process.env.ADMIN_PASSWORD||'').update(value).digest('hex')}
export async function POST(req){
 try{
  const{password}=await req.json();
  if(!process.env.ADMIN_PASSWORD||password!==process.env.ADMIN_PASSWORD)return NextResponse.json({error:'Unauthorized'},{status:401});
  const value='authenticated.'+sign('authenticated');
  const res=NextResponse.json({ok:true});
  res.cookies.set('hh_admin',value,{httpOnly:true,secure:true,sameSite:'strict',path:'/',maxAge:7200});
  return res;
 }catch{return NextResponse.json({error:'Invalid request.'},{status:400})}
}