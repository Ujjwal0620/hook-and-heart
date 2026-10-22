import {NextResponse} from 'next/server';
export async function POST(req){
 try{
  const{password}=await req.json();
  if(!process.env.ADMIN_PASSWORD||password!==process.env.ADMIN_PASSWORD)return NextResponse.json({error:'Unauthorized'},{status:401});
  const res=NextResponse.json({ok:true});
  res.cookies.set('hh_admin','authenticated',{httpOnly:true,secure:true,sameSite:'strict',path:'/',maxAge:7200});
  return res;
 }catch{return NextResponse.json({error:'Invalid request.'},{status:400})}
}