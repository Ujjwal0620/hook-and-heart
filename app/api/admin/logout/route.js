import {NextResponse} from 'next/server';
export const dynamic='force-dynamic';
export async function POST(){
 const res=NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
 res.cookies.set('hh_admin','',{httpOnly:true,secure:true,sameSite:'strict',path:'/',maxAge:0});
 return res;
}