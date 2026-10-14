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

let useCloud = true;
let db = null;
firebase.initializeApp(firebaseConfig);
db = firebase.firestore();

let productsData = [
  {id:1,name:"Slonchies",color:"Black",stock:5,price:150,image:"https://via.placeholder.com/400/000000/FFFFFF?text=Black"},
  {id:2,name:"Slonchies",color:"Blue",stock:3,price:150,image:"https://via.placeholder.com/400/0000FF/FFFFFF?text=Blue"},
  {id:3,name:"Slonchies",color:"Beige",stock:2,price:150,image:"https://via.placeholder.com/400/F5F5DC/000000?text=Beige"},
];
let cart = [];
let isAdminLogged = false;
let pendingImageBase64 = null;

db.collection("products").onSnapshot(snap=>{
  if(snap.empty){
    productsData.forEach(p=>db.collection("products").doc(String(p.id)).set(p));
  } else {
    productsData=snap.docs.map(d=>d.data()).sort((a,b)=>a.id-b.id);
    render();
    if(isAdminLogged) refreshAdminList();
  }
});

document.addEventListener('DOMContentLoaded',()=>{
  const fileInput=document.getElementById('newColorFile');
  if(fileInput){
    fileInput.addEventListener('change',e=>{
      const file=e.target.files[0]; if(!file) return;
      const reader=new FileReader();
      reader.onload=ev=>{
        const img=new Image();
        img.onload=()=>{
          const canvas=document.createElement('canvas');
          const maxW=700; let w=img.width, h=img.height;
          if(w>maxW){h=h*(maxW/w); w=maxW;}
          canvas.width=w; canvas.height=h;
          canvas.getContext('2d').drawImage(img,0,0,w,h);
          pendingImageBase64=canvas.toDataURL('image/jpeg',0.65);
          const prev=document.getElementById('previewImg');
          prev.src=pendingImageBase64; prev.style.display='block';
        }; img.src=ev.target.result;
      }; reader.readAsDataURL(file);
    });
  }
});

function render(){
  const c=document.getElementById('products');
  if(!c) return;
  c.innerHTML="";
  productsData.forEach(p=>{
    const cls=p.stock==0?'out':p.stock<=2?'low':'in';
    const txt=p.stock>0?`${p.stock} left`:'Out of stock';
    c.innerHTML+=`<div class="card"><img src="${p.image}"><h4>${p.color}</h4><div>R${p.price}</div><span class="stock ${cls}">${txt}</span><br><button class="btn" ${p.stock==0?'disabled':''} onclick="openProduct(${p.id})">${p.stock==0?'Out':'Order'}</button></div>`;
  });
  document.getElementById('cartCount').innerText=cart.reduce((s,i)=>s+i.qty,0);
}
function openProduct(id){
  const p=productsData.find(x=>x.id==id);
  document.getElementById('mImage').src=p.image;
  document.getElementById('mName').innerText=p.name+" - "+p.color;
  document.getElementById('mPrice').innerText="R"+p.price;
  const sel=document.getElementById('mColor'); sel.innerHTML="";
  productsData.forEach(prod=>{sel.innerHTML+=`<option value="${prod.id}" ${prod.stock==0?'disabled':''}>${prod.color} - ${prod.stock} left</option>`});
  sel.value=id; updateStockInModal();
  document.getElementById('productModal').classList.remove('hidden');
}
function updateStockInModal(){
  const prod=productsData.find(p=>p.id==parseInt(document.getElementById('mColor').value));
  if(!prod) return;
  document.getElementById('mStock').innerText=prod.color+": "+prod.stock+" left";
  document.getElementById('mQty').max=prod.stock;
}
function addToCart(){
  const prodId=parseInt(document.getElementById('mColor').value);
  const qty=parseInt(document.getElementById('mQty').value);
  const prod=productsData.find(p=>p.id==prodId);
  if(qty>prod.stock){document.getElementById('mQtyError').innerText="Only "+prod.stock+" left!";return;}
  const ex=cart.find(c=>c.id==prodId);
  if(ex) ex.qty+=qty; else cart.push({id:prodId,color:prod.color,name:prod.name,price:prod.price,qty});
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
  e.preventDefault();
  const name=document.getElementById('custName').value;
  const phone=document.getElementById('custPhone').value;
  const campus=document.getElementById('custCampus').value;
  const addr=document.getElementById('custAddress').value;
  const note=document.getElementById('custNote').value;
  let list="";let total=0;
  for(const c of cart){
    const p=productsData.find(x=>x.id==c.id);
    await db.collection("products").doc(String(c.id)).update({stock:p.stock-c.qty});
    list+=`• ${c.color} x${c.qty} = R${c.price*c.qty}\n`; total+=c.price*c.qty;
  }
  const msg=`🔥 COMPLICATED ORDER 🔥\n${list}\nTotal R${total}\nName: ${name}\nPhone: ${phone}\nDelivery: ${campus}\nAddr: ${addr}\nNote: ${note}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
  cart=[];render();closeModal('cartModal');e.target.reset();
}
function openAdminLogin(){
  if(isAdminLogged){document.getElementById('adminModal').classList.remove('hidden');return;}
  document.getElementById('adminLoginModal').classList.remove('hidden');
}
function doAdminLogin(){
  const u=document.getElementById('adminUser').value.trim();
  const p=document.getElementById('adminPass').value.trim();
  if(u===ADMIN_USERNAME && p===ADMIN_PASSWORD){
    isAdminLogged=true; closeModal('adminLoginModal');
    document.getElementById('adminWelcome').innerText=" — Welcome "+u;
    openAdminPanel();
  } else {document.getElementById('loginError').innerText="Wrong username or password!!";}
}
function openAdminPanel(){refreshAdminList(); document.getElementById('adminModal').classList.remove('hidden');}
function refreshAdminList(){
  const div=document.getElementById('adminList');
  if(!div) return;
  div.innerHTML=productsData.map(p=>`
    <div style="display:flex;gap:8px;align-items:center;border:2px solid #111;padding:8px;border-radius:10px;margin:6px 0">
      <img src="${p.image}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;border:1.5px solid #111">
      <div style="flex:1"><b>${p.color}</b><br><small>${p.stock} left - R${p.price}</small></div>
      <button onclick="updateStock(${p.id},-1)" style="padding:6px 10px;border:2px solid #111;border-radius:8px">-</button>
      <button onclick="updateStock(${p.id},1)" style="padding:6px 10px;border:2px solid #111;border-radius:8px">+</button>
      <button onclick="deleteProduct(${p.id})" style="color:red;border:none;background:none">🗑️</button>
    </div>`).join('');
}
async function updateStock(id,d){
  const p=productsData.find(x=>x.id==id);
  const newStock=Math.max(0,p.stock+d);
  await db.collection("products").doc(String(id)).update({stock:newStock});
}
async function addNewProduct(){
  const color=document.getElementById('newColorName').value.trim();
  const stock=parseInt(document.getElementById('newColorStock').value);
  const price=parseInt(document.getElementById('newColorPrice').value)||150;
  if(!color||isNaN(stock)){alert("Fill color and stock");return;}
  if(!pendingImageBase64){alert("Upload pic from phone first");return;}
  const id=Date.now();
  const newProd={id,name:"Slonchies",color,stock,price,image:pendingImageBase64};
  await db.collection("products").doc(String(id)).set(newProd);
  document.getElementById('newColorName').value=""; document.getElementById('newColorStock').value=""; document.getElementById('newColorFile').value=""; document.getElementById('previewImg').style.display="none"; pendingImageBase64=null;
  alert("Saved! All phones see it now 🔥");
}
async function deleteProduct(id){
  if(!confirm("Delete?")) return;
  await db.collection("products").doc(String(id)).delete();
}
function adminLogout(){isAdminLogged=false;closeModal('adminModal');}