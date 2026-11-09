(function(){'use strict';
const ACC=[[14,165,233],[122,77,255],[47,107,255],[0,168,132],[226,152,0],[255,61,110],[232,80,42]];
const slug=document.body.dataset.slug,slugOf=p=>(typeof p.name==='string'?p.name:p.name.fr).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
let lang='fr';try{const s=localStorage.getItem('lang');if(s==='en'||s==='fr')lang=s}catch(e){}
const tr=v=>v==null?'':(typeof v==='string'?v:v[lang]);
let reg=null,pro=null,ri=0;REGIONS.forEach((r,i)=>(r.projects||[]).forEach(p=>{if(slugOf(p)===slug){reg=r;pro=p;ri=i}}));
if(!pro)return;
const IMG={tuc1:'../assets/img/tuc1.jpg',tuc2:'../assets/img/tuc2.jpg',tuc3:'../assets/img/tuc3.jpg',nbw:'../assets/img/nbw.png'};
const col=ACC[ri%ACC.length].join(',');
document.documentElement.style.setProperty('--c',col);
function render(){
 const u=UI[lang];document.documentElement.lang=lang;
 const links=pro.links.map(l=>`<a class="ext" href="${l.url}" target="_blank" rel="noopener">${l.label?tr(l.label):u.site}</a>`).join('');
 let media='';
 if(pro.img==='tuc')media=`<div class="ph3"><img src="${IMG.tuc1}" alt=""><img src="${IMG.tuc2}" alt=""><img src="${IMG.tuc3}" alt=""></div>`;
 if(pro.img==='nbw')media=`<img class="lg" src="${IMG.nbw}" alt="">`;
 if(pro.brand)media=`<p class="kl">kelthen.com</p>`;
 let chat='';if(pro.chat)chat=`<section><h2>${u.ex}</h2><div class="chat">${pro.chat[lang].map(m=>`<p class="${m[0]}">${m[1]}</p>`).join('')}</div></section>`;
 document.getElementById('pj').innerHTML=`<header><a class="bk" href="../index.html#p-${slug}">← ${u.back}</a><div class="lg-t"><button id="fr" aria-pressed="${lang==='fr'}">FR</button><button id="en" aria-pressed="${lang==='en'}">EN</button></div></header><article><p class="st">${tr(reg.label)} · ${tr(pro.status)}</p><h1>${tr(pro.name)}</h1>${media}<p class="desc">${tr(pro.desc)}</p><p class="stack">${pro.stack}</p>${links?`<div class="lk">${links}</div>`:''}${chat}</article>`;
 document.getElementById('fr').onclick=()=>setL('fr');document.getElementById('en').onclick=()=>setL('en');
}
function setL(l){lang=l;try{localStorage.setItem('lang',l)}catch(e){}render()}
render();
})();
