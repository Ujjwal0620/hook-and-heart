const securityHeaders=[
 {key:'X-Content-Type-Options',value:'nosniff'},
 {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
 {key:'X-Frame-Options',value:'DENY'},
 {key:'Permissions-Policy',value:'camera=(self "https://meet.jit.si"), microphone=()'}
];
const nextConfig={reactStrictMode:true,async headers(){return[{source:'/:path*',headers:securityHeaders}]}};export default nextConfig;