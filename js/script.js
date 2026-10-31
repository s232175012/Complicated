const WHATSAPP_NUMBER = "27782836043";
const ADMIN_USERNAME = "ComplicatedS";
const ADMIN_PASSWORD = "TeoCode#26";
const firebaseConfig = {
  apiKey: "AIzaSyClJ0ov7uK_DUvz2iiOwZk4t4uLf58wfg8",
  authDomain: "complicated-41f0a.firebaseapp.com",
  projectId: "complicated-41f0a",
  storageBucket: "complicated-41f0a.firebasestorage.app",
  messagingSenderId: "708397354616",
  appId: "1:708397354616:web:8187acce98d9cea4d0678d"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
let productsData = [
  {id:1,name:"Slonchies",color:"Black",stock:5,price:150,images:["https://via.placeholder.com/400/000000/FFFFFF?text=Black"]},
  {id:2,name:"Slonchies",color:"Blue",stock:3,price:150,images:["https://via.placeholder.com/400/0000FF/FFFFFF?text=Blue"]},
  {id:3,name:"Slonchies",color:"Beige",stock:2,price:150,images:["https://via.placeholder.com/400/F5F5DC/000000?text=Beige"]},
];
let cart = []; let isAdminLogged = false; let pendingImagesBase64 = [];
let currentGallery = []; let currentIndex = 0; let startX = 0;

db.collection("products").onSnapshot(snap=>{
  if(snap.empty){ productsData.forEach(p=>db.collection("products").doc(String(p.id)).set(p)); }
  else {
    productsData=snap.docs.map(d=>{ let data=d.data(); if(data.image && !data.images) data.images=[data.image]; return data; }).sort((a,b)=>a.id-b.id);
    render(); if(isAdminLogged) refreshAdminList();
  }
});

document.addEventListener('DOMContentLoaded',()=>{
  const last = localStorage.getItem('welcomed_time');
  const now = Date.now();
  const oneDay = 0.5 * 60 * 60 * 1000;
  if(!last || (now - parseInt(last)) > oneDay){
    setTimeout(()=>{ document.getElementById('welcomeModal')?.classList.remove('hidden'); localStorage.setItem('welcomed_time', String(now)); }, 800);
  }

  const fileInput=document.getElementById('newColorFile');
  if(fileInput){
    fileInput.addEventListener('change', async e=>{
      const files = Array.from(e.target.files).slice(0,5);
      pendingImagesBase64=[]; const wrap=document.getElementById('previewWrap'); wrap.innerHTML="";
      for(let file of files){
        const base64 = await compressImage(file, 700, 0.65);
        pendingImagesBase64.push(base64);
        wrap.innerHTML+=`<div style="position:relative"><img src="${base64}" style="width:70px;height:70px;object-fit:cover;border-radius:10px;border:2px solid #111"><div style="position:absolute;top:-6px;right:-6px;background:#111;color:#fff;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:10px">${pendingImagesBase64.length}</div></div>`;
      }
    });
  }
});

function compressImage(file, maxW, quality){
  return new Promise(res=>{
    const reader=new FileReader();
    reader.onload=ev=>{
      const img=new Image();
      img.onload=()=>{
        const canvas=document.createElement('canvas'); let w=img.width, h=img.height;
        if(w>maxW){h=h*(maxW/w); w=maxW;} canvas.width=w; canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        res(canvas.toDataURL('image/jpeg',quality));
      }; img.src=ev.target.result;
    }; reader.readAsDataURL(file);
  });
}

function render(){
  const c=document.getElementById('products'); if(!c) return; c.innerHTML="";
  productsData.forEach(p=>{
    const imgs = p.images || [p.image]; const cls=p.stock==0?'out':p.stock<=2?'low':'in';
    const txt=p.stock>0?`${p.stock} left`:'Out of stock';
    const badge = imgs.length>1 ? `<span style="position:absolute;top:6px;left:6px;background:#111;color:#fff;padding:2px 6px;border-radius:10px;font-size:10px;font-weight:800">+${imgs.length}</span>` : '';
    c.innerHTML+=`<div class="card">${badge}<img src="${imgs[0]}"><h4>${p.color}</h4><div>R${p.price}</div><span class="stock ${cls}">${txt}</span><br><button class="btn" ${p.stock==0?'disabled':''} onclick="openProduct(${p.id})">${p.stock==0?'Out':'Order'}</button></div>`;
  });
  document.getElementById('cartCount').innerText=cart.reduce((s,i)=>s+i.qty,0);
}

function openProduct(id){
  const p=productsData.find(x=>x.id==id);
  currentGallery = p.images || [p.image]; currentIndex=0;
  showGallery();
  document.getElementById('mName').innerText=p.name+" - "+p.color;
  document.getElementById('mPrice').innerText="R"+p.price;
  const sel=document.getElementById('mColor'); sel.innerHTML="";
  productsData.forEach(prod=>{sel.innerHTML+=`<option value="${prod.id}" ${prod.stock==0?'disabled':''}>${prod.color} - ${prod.stock} left</option>`});
  sel.value=id; updateStockInModal();
  document.getElementById('productModal').classList.remove('hidden');
}

function showGallery(){
  const imgEl=document.getElementById('mImage');
  imgEl.src=currentGallery[currentIndex];
  const counter=document.getElementById('mCounter'); if(counter) counter.innerText=`${currentIndex+1}/${currentGallery.length}`;
  const dots=document.getElementById('mDots'); if(dots) dots.innerHTML=currentGallery.map((_,i)=>`<span class="${i==currentIndex?'active':''}"></span>`).join('');
  const thumbs=document.getElementById('mThumbs'); if(thumbs) thumbs.innerHTML=currentGallery.map((im,i)=>`<img src="${im}" class="${i==currentIndex?'active':''}" onclick="goToImg(${i})">`).join('');
  imgEl.ontouchstart=e=>{ startX=e.touches[0].clientX; };
  imgEl.ontouchend=e=>{ let endX=e.changedTouches[0].clientX; if(startX-endX>40) nextImg(); if(endX-startX>40) prevImg(); };
}
function nextImg(){ currentIndex=(currentIndex+1)%currentGallery.length; showGallery(); }
function prevImg(){ currentIndex=(currentIndex-1+currentGallery.length)%currentGallery.length; showGallery(); }
function goToImg(i){ currentIndex=i; showGallery(); }

function updateStockInModal(){
  const prod=productsData.find(p=>p.id==parseInt(document.getElementById('mColor').value)); if(!prod) return;
  document.getElementById('mStock').innerText=prod.color+": "+prod.stock+" left";
  document.getElementById('mQty').max=prod.stock;
}
function addToCart(){
  const prodId=parseInt(document.getElementById('mColor').value); const qty=parseInt(document.getElementById('mQty').value);
  const prod=productsData.find(p=>p.id==prodId);
  if(qty>prod.stock){document.getElementById('mQtyError').innerText="Only "+prod.stock+" left!";return;}
  const ex=cart.find(c=>c.id==prodId); if(ex) ex.qty+=qty; else cart.push({id:prodId,color:prod.color,name:prod.name,price:prod.price,qty});
  closeModal('productModal'); render(); openCart();
}
function openCart(){
  if(cart.length==0){alert("Cart empty");return}
  let html="";let total=0;
  cart.forEach((c,i)=>{total+=c.price*c.qty; html+=`<div class="cart-item"><span>${c.color} x${c.qty}</span><span>R${c.price*c.qty} <a href="#" onclick="removeItem(${i});return false" style="color:red">x</a></span></div>`});
  document.getElementById('cartItems').innerHTML=html;
  document.getElementById('cartTotal').innerText="Total: R"+total;
  document.getElementById('cartModal').classList.remove('hidden');
}
function removeItem(i){cart.splice(i,1);render();if(cart.length==0)closeModal('cartModal');else openCart();}
function closeModal(id){document.getElementById(id).classList.add('hidden'); const e=document.getElementById('mQtyError'); if(e) e.innerText="";}
async function submitOrder(e){
  e.preventDefault(); const name=document.getElementById('custName').value; const phone=document.getElementById('custPhone').value;
  const campus=document.getElementById('custCampus').value; const addr=document.getElementById('custAddress').value; const note=document.getElementById('custNote').value;
  let list="";let total=0;
  for(const c of cart){
    const p=productsData.find(x=>x.id==c.id);
    await db.collection("products").doc(String(c.id)).update({stock:p.stock-c.qty});
    list+=`• ${c.color} x${c.qty} = R${c.price*c.qty}\n`; total+=c.price*c.qty;
  }
  const msg=`🔥 COMPLICATED ORDER 🔥\n${list}\nTotal: R${total}\nName: ${name}\nPhone: ${phone}\nDelivery: ${campus}\nAddr: ${addr}\nNote: ${note}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
  cart=[];render();closeModal('cartModal');e.target.reset();
}
function openAdminLogin(){ if(isAdminLogged){document.getElementById('adminModal').classList.remove('hidden');return;} document.getElementById('adminLoginModal').classList.remove('hidden'); }
function doAdminLogin(){
  const u=document.getElementById('adminUser').value.trim(); const p=document.getElementById('adminPass').value.trim();
  if(u===ADMIN_USERNAME && p===ADMIN_PASSWORD){ isAdminLogged=true; closeModal('adminLoginModal'); document.getElementById('adminWelcome').innerText=" — Welcome "+u; openAdminPanel(); }
  else {document.getElementById('loginError').innerText="Wrong username or password!!";}
}
function openAdminPanel(){refreshAdminList(); document.getElementById('adminModal').classList.remove('hidden');}
function refreshAdminList(){
  const div=document.getElementById('adminList'); if(!div) return;
  div.innerHTML=productsData.map(p=>{
    const imgs = p.images || [p.image];
    return `<div style="display:flex;gap:8px;align-items:center;border:2px solid #111;padding:8px;border-radius:10px;margin:6px 0">
      <div style="display:flex;align-items:center;gap:2px"><img src="${imgs[0]}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;border:1.5px solid #111"><small>+${imgs.length}</small></div>
      <div style="flex:1"><b>${p.color}</b><br><small>${p.stock} left - R${p.price} • ${imgs.length} pics</small></div>
      <button onclick="updateStock(${p.id},-1)" style="padding:6px 10px;border:2px solid #111;border-radius:8px">-</button>
      <button onclick="updateStock(${p.id},1)" style="padding:6px 10px;border:2px solid #111;border-radius:8px">+</button>
      <button onclick="deleteProduct(${p.id})" style="color:red;border:none;background:none">🗑️</button>
    </div>`}).join('');
}
async function updateStock(id,d){ const p=productsData.find(x=>x.id==id); const newStock=Math.max(0,p.stock+d); await db.collection("products").doc(String(id)).update({stock:newStock}); }
async function addNewProduct(){
  const color=document.getElementById('newColorName').value.trim(); const stock=parseInt(document.getElementById('newColorStock').value); const price=parseInt(document.getElementById('newColorPrice').value)||150;
  if(!color||isNaN(stock)){alert("Fill color and stock");return;}
  if(pendingImagesBase64.length==0){alert("Upload 1 to 5 pics first");return;}
  if(pendingImagesBase64.length>5){alert("Max 5");return;}
  const id=Date.now(); const newProd={id,name:"Slonchies",color,stock,price,images:pendingImagesBase64};
  await db.collection("products").doc(String(id)).set(newProd);
  document.getElementById('newColorName').value=""; document.getElementById('newColorStock').value=""; document.getElementById('newColorFile').value=""; document.getElementById('previewWrap').innerHTML=""; pendingImagesBase64=[];
  alert(`Saved! ${newProd.images.length} pics added 🔥`);
}
async function deleteProduct(id){ if(!confirm("Delete?")) return; await db.collection("products").doc(String(id)).delete(); }
function adminLogout(){isAdminLogged=false;closeModal('adminModal');}
