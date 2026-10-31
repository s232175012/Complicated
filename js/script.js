*{margin:0;padding:0;box-sizing:border-box;font-family:'Inter',sans-serif}
body{background:#faf6f1;color:#111;-webkit-tap-highlight-color:transparent}
header{padding:12px 4%;display:flex;justify-content:space-between;align-items:center;background:#fff7ed;border-bottom:2.5px solid #111;position:sticky;top:0;z-index:20}
.logo{letter-spacing:2px;font-weight:800;font-size:18px}
.header-right{display:flex;gap:8px;align-items:center}
.admin-pill{background:#111;color:#fff;border:none;padding:8px 14px;border-radius:20px;font-weight:800;font-size:12px}
.cart-btn{border:2.5px solid #111;padding:6px 12px;border-radius:20px;font-weight:800;background:#FFD93D}
.hero{text-align:center;padding:20px 4% 8px}
.hero h1{font-size:28px;font-weight:800;line-height:1}
.hero h2{font-size:22px;font-weight:800;color:#FF5C93}
.hero p{font-size:13px;margin-top:8px;color:#444}
.shop-section{padding:12px 4% 30px}
.products{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;max-width:1000px;margin:0 auto}
@media(min-width:700px){.products{grid-template-columns:repeat(3,1fr);gap:16px}}
.card{background:#fff;border:2.5px solid #111;border-radius:14px;overflow:hidden;box-shadow:4px 4px 0 #111;padding-bottom:10px;text-align:center;position:relative}
.card img{width:100%;height:160px;object-fit:cover;background:#eee}
@media(min-width:700px){.card img{height:240px}}
.card h4{margin:8px 0 2px;font-size:14px}
.stock{font-size:10px;padding:3px 7px;border-radius:12px;display:inline-block;margin:4px 0;font-weight:700;border:1px solid #111}
.in{background:#d1ffcf}.low{background:#fff2c9}.out{background:#ffdede}
.btn{width:100%;padding:12px;background:#111;color:#fff;border:none;border-radius:10px;margin-top:10px;font-weight:800;font-size:14px}
.btn-outline{width:100%;padding:10px;background:#fff;color:#111;border:2.5px solid #111;border-radius:10px;margin-top:8px;font-weight:800}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;justify-content:center;align-items:flex-end;z-index:50}
@media(min-width:600px){.modal{align-items:center}}
.hidden{display:none!important}
.modal-content{background:#fff;width:100%;max-width:440px;border-radius:20px 20px 0 0;padding:18px;max-height:92vh;overflow:auto;border:2.5px solid #111;box-shadow:8px 8px 0 #111;position:relative}
@media(min-width:600px){.modal-content{border-radius:16px}}
.modal-content.large{max-width:500px}
.close{position:absolute;top:10px;right:14px;font-size:22px;font-weight:800;cursor:pointer;background:#111;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:10}
.price{font-weight:800}
label{font-size:11px;font-weight:800;margin-top:10px;display:block;text-transform:uppercase}
input,select,textarea{width:100%;padding:11px;border:2.5px solid #111;border-radius:10px;margin-top:4px;font-size:14px}
input[type=file]{padding:8px;background:#fff7ed}
textarea{height:60px}
.error{color:red;font-size:12px;margin-top:4px}
.total{font-weight:800;margin:10px 0}
.cart-item{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;font-size:13px}
footer{display:flex;justify-content:space-between;padding:14px 4%;background:#111;color:#e8d5b7;font-size:11px}
footer img{height:16px;background:#fff;padding:2px;vertical-align:middle}
.small{font-size:11px;color:#666;margin:4px 0}
input[type=file]{padding:8px;background:#fff7ed;border:2.5px dashed #111;cursor:pointer}
.admin-pill:active{transform:scale(.95)}
.btn:active{transform:scale(.97)}
input,select,textarea{font-size:16px!important}
@media(min-width:700px){input,select,textarea{font-size:14px!important}}

/* WELCOME CARD */
.welcome-card{background:#fff7ed;text-align:center;border:3px solid #111}
.welcome-card h1{font-size:22px;font-weight:800}
.welcome-text{margin:10px 0;font-size:14px;line-height:1.4}
.welcome-badge{display:inline-block;background:#FFD93D;border:2px solid #111;padding:6px 12px;border-radius:20px;font-weight:800;font-size:12px;margin:8px 0}

/* GALLERY - CLIENT VIEW */
.gallery-wrap{position:relative;border:2.5px solid #111;border-radius:14px;overflow:hidden;background:#eee}
.m-img{width:100%;height:280px;object-fit:cover;display:block;touch-action:pan-y}
.gallery-arrow{position:absolute;top:50%;transform:translateY(-50%);background:#111;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:none;font-weight:800;cursor:pointer}
.gallery-arrow.left{left:8px}
.gallery-arrow.right{right:8px}
.gallery-dots{display:flex;justify-content:center;gap:6px;margin:10px 0}
.gallery-dots span{width:7px;height:7px;border-radius:50%;background:#ddd;border:1.5px solid #111}
.gallery-dots span.active{background:#FF5C93}
.thumbs{display:flex;gap:6px;margin:8px 0;overflow:auto;padding-bottom:4px}
.thumbs img{width:54px;height:54px;object-fit:cover;border-radius:10px;border:2px solid #111;cursor:pointer;flex-shrink:0;opacity:0.7}
.thumbs img.active{border:2.5px solid #FF5C93;opacity:1;transform:scale(1.05)}
.counter{position:absolute;top:8px;right:8px;background:#111;color:#fff;font-size:11px;font-weight:800;padding:4px 8px;border-radius:12px}
