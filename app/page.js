'use client';
import {useMemo,useState} from 'react';

const menu=[
 {id:1,name:'Chicken Biryani',category:'Biryani',price:180,desc:'Fragrant rice, tender chicken and house spices.',emoji:'🍗'},
 {id:2,name:'Egg Biryani',category:'Biryani',price:130,desc:'Classic biryani with egg and aromatic masala.',emoji:'🥚'},
 {id:3,name:'Chicken Roll',category:'Rolls',price:90,desc:'Fresh paratha, chicken filling and crunchy salad.',emoji:'🌯'},
 {id:4,name:'Paneer Roll',category:'Rolls',price:80,desc:'Soft paneer, vegetables and signature sauce.',emoji:'🥙'},
 {id:5,name:'Chicken Chowmein',category:'Chinese',price:120,desc:'Wok-tossed noodles with chicken and vegetables.',emoji:'🍜'},
 {id:6,name:'Veg Fried Rice',category:'Chinese',price:100,desc:'Fluffy rice tossed with fresh vegetables.',emoji:'🍚'},
 {id:7,name:'Chicken Curry',category:'Main Course',price:160,desc:'Homestyle chicken curry with rich gravy.',emoji:'🍛'},
 {id:8,name:'Cold Drink',category:'Drinks',price:40,desc:'Chilled refreshment.',emoji:'🥤'}
];

export default function Home(){
 const[category,setCategory]=useState('All'),[cart,setCart]=useState({}),[cartOpen,setCartOpen]=useState(false);
 const[name,setName]=useState(''),[phone,setPhone]=useState(''),[orderType,setOrderType]=useState('Takeaway'),[address,setAddress]=useState('');
 const cats=['All',...new Set(menu.map(x=>x.category))];
 const visible=category==='All'?menu:menu.filter(x=>x.category===category);
 const items=useMemo(()=>menu.filter(x=>cart[x.id]).map(x=>({...x,qty:cart[x.id]})),[cart]);
 const total=items.reduce((s,x)=>s+x.price*x.qty,0);
 const count=items.reduce((s,x)=>s+x.qty,0);
 const add=id=>setCart(c=>({...c,[id]:(c[id]||0)+1}));
 const change=(id,d)=>setCart(c=>{const n=(c[id]||0)+d;const copy={...c};if(n<=0)delete copy[id];else copy[id]=n;return copy});
 const whatsapp=()=>{
  if(!items.length)return alert('Please add food to your order.');
  if(!name.trim()||!phone.trim())return alert('Please enter your name and mobile number.');
  const lines=items.map(x=>`• ${x.name} × ${x.qty} = ₹${x.price*x.qty}`).join('\n');
  const text=`Hello, I want to place an order.\n\nCustomer: ${name}\nMobile: ${phone}\nOrder type: ${orderType}${address?'\nAddress: '+address:''}\n\n${lines}\n\nTotal: ₹${total}\n\nPlease confirm my order.`;
  window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener,noreferrer');
 };
 return <main>
  <nav className="nav"><a className="brand" href="#"><span>FH</span><b>FoodHub</b></a><div className="links"><a href="#menu">Menu</a><a href="#how">How it works</a><a href="#contact">Contact</a></div><button className="cartBtn" onClick={()=>setCartOpen(true)}>Cart <strong>{count}</strong></button></nav>
  <section className="hero"><div><div className="pill">● FRESH • FAST • LOCAL</div><h1>Good food.<br/><em>Zero waiting.</em></h1><p>Scan, choose your favourites and send your order directly on WhatsApp. Simple ordering for your neighbourhood food spot.</p><div className="heroActions"><a className="primary" href="#menu">Order food</a><button className="secondary" onClick={()=>setCartOpen(true)}>View cart</button></div><div className="trust"><span>✓ Freshly prepared</span><span>✓ Easy WhatsApp order</span><span>✓ Quick billing</span></div></div><div className="heroCard"><div className="plate">🍲</div><div className="floating f1"><b>Easy ordering</b><small>No app needed</small></div><div className="floating f2"><b>WhatsApp</b><small>Instant confirmation</small></div></div></section>
  <section id="menu" className="menuSection"><div className="sectionHead"><div><span className="kicker">OUR MENU</span><h2>What are you craving?</h2></div><p>Choose an item, add it to your cart and place the order through WhatsApp.</p></div><div className="categories">{cats.map(c=><button key={c} className={c===category?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="grid">{visible.map(x=><article className="foodCard" key={x.id}><div className="foodImage">{x.emoji}<span>{x.category}</span></div><div className="foodBody"><h3>{x.name}</h3><p>{x.desc}</p><div className="foodFoot"><strong>₹{x.price}</strong><button onClick={()=>add(x.id)}>+ Add</button></div></div></article>)}</div></section>
  <section id="how" className="how"><span className="kicker">ORDER IN 3 STEPS</span><h2>From menu to WhatsApp</h2><div className="steps"><div><b>01</b><h3>Scan or visit</h3><p>Open the digital menu from your shop QR code.</p></div><div><b>02</b><h3>Build your order</h3><p>Select food and enter basic customer details.</p></div><div><b>03</b><h3>Send on WhatsApp</h3><p>Your formatted order is ready to send for confirmation.</p></div></div></section>
  <footer id="contact"><div className="brand"><span>FH</span><b>FoodHub</b></div><p>Your shop name, address and WhatsApp number will be added here.</p><small>© 2026 FoodHub. All rights reserved.</small></footer>
  {cartOpen&&<div className="drawerBack" onClick={()=>setCartOpen(false)}><aside className="drawer" onClick={e=>e.stopPropagation()}><div className="drawerHead"><div><small>YOUR ORDER</small><h2>Cart</h2></div><button onClick={()=>setCartOpen(false)}>×</button></div>{!items.length?<div className="empty"><span>🛍️</span><h3>Your cart is empty</h3><p>Add something delicious from the menu.</p></div>:<><div className="cartItems">{items.map(x=><div className="cartItem" key={x.id}><div><b>{x.name}</b><small>₹{x.price} each</small></div><div className="qty"><button onClick={()=>change(x.id,-1)}>−</button><span>{x.qty}</span><button onClick={()=>change(x.id,1)}>+</button></div><strong>₹{x.price*x.qty}</strong></div>)}</div><div className="total"><span>Total</span><b>₹{total}</b></div><div className="customer"><h3>Order details</h3><input placeholder="Customer name" value={name} onChange={e=>setName(e.target.value)}/><input placeholder="Mobile / WhatsApp number" inputMode="tel" value={phone} onChange={e=>setPhone(e.target.value)}/><select value={orderType} onChange={e=>setOrderType(e.target.value)}><option>Takeaway</option><option>Delivery</option><option>Dine-in</option></select>{orderType==='Delivery'&&<textarea placeholder="Delivery address" value={address} onChange={e=>setAddress(e.target.value)}/>}<button className="whatsapp" onClick={whatsapp}>Send order on WhatsApp →</button><p className="note">The shop WhatsApp number will be connected when you provide it.</p></div></>}</aside></div>}
 </main>
}