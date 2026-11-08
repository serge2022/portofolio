(function(){'use strict';
const ACC=[[14,165,233],[122,77,255],[47,107,255],[0,168,132],[226,152,0],[255,61,110],[232,80,42]];
const slug=document.body.dataset.slug,slugOf=p=>(typeof p.name==='string'?p.name:p.name.fr).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
let lang='fr';try{const s=localStorage.getItem('lang');if(s==='en'||s==='fr')lang=s}catch(e){}
const tr=v=>v==null?'':(typeof v==='string'?v:v[lang]);
let reg=null,pro=null,ri=0;REGIONS.forEach((r,i)=>(r.projects||[]).forEach(p=>{if(slugOf(p)===slug){reg=r;pro=p;ri=i}}));
if(!pro)return;
const IMG={tuc1:'../assets/img/tuc1.jpg',tuc2:'../assets/img/tuc2.jpg',tuc3:'../assets/img/tuc3.jpg',nbw:'../assets/img/nbw.png'};
const KD={fr:{t:'Ce qui lance le workflow : un message reçu, un courriel ou une heure fixe.',c:'Prépare ou transforme les informations avec des règles écrites en code.',h:'Appelle un service externe pour lire ou envoyer des informations.',d:'Lit ou enregistre des informations dans une base de données.',i:'Choisit le chemin à suivre selon une condition.',a:'Fait travailler un modèle d’IA sur cette tâche.',m:'Envoie un message, une alerte ou une demande de validation.'},en:{t:'What starts the workflow: an incoming message, an email or a set time.',c:'Prepares or transforms information with rules written in code.',h:'Calls an external service to read or send information.',d:'Reads or stores information in a database.',i:'Chooses which path to follow based on a condition.',a:'Puts an AI model to work on this task.',m:'Sends a message, an alert or an approval request.'}};
const col=ACC[ri%ACC.length].join(',');
document.documentElement.style.setProperty('--c',col);
const wid=(pro.links.find(l=>l.wf)||{}).wf;
function graph(W){
 const n=W.n.length,out=[...Array(n)].map(()=>[]);W.e.forEach(e=>out[e[0]].push(e[1]));
 const st=new Uint8Array(n),back=new Set(),dfs=u=>{st[u]=1;out[u].forEach(v=>{if(st[v]===1)back.add(u+'-'+v);else if(!st[v])dfs(v)});st[u]=2};
 W.n.forEach((x,i)=>{if(x[1]==='t'&&!st[i])dfs(i)});W.n.forEach((x,i)=>{if(!st[i])dfs(i)});
 const E=W.e.filter(e=>!back.has(e[0]+'-'+e[1])),rank=new Array(n).fill(0);for(let k=0;k<n;k++)E.forEach(e=>{rank[e[1]]=Math.max(rank[e[1]],rank[e[0]]+1)});
 const rows=[];rank.forEach((r,i)=>(rows[r]=rows[r]||[]).push(i));const pos=new Array(n).fill(0);
 for(let p=0;p<4;p++)rows.forEach(row=>{if(p===0)row.forEach((i,k)=>pos[i]=k);const bc={};row.forEach(i=>{const q=E.filter(e=>e[1]===i).map(e=>pos[e[0]]);bc[i]=q.length?q.reduce((a,b)=>a+b,0)/q.length:pos[i]});row.sort((a,b)=>bc[a]-bc[b]);row.forEach((i,k)=>pos[i]=k-(row.length-1)/2)});
 const nw=innerWidth<620?150:188,nh=56,gx=14,gy=34,pad=20,mb=Math.max(...rows.map(r=>r.length)),w=Math.max(mb*(nw+gx)-gx+pad*2,nw+pad*2),h=rows.length*(nh+gy)-gy+pad*2,xy=i=>[w/2+pos[i]*(nw+gx)-nw/2,pad+rank[i]*(nh+gy)];
 const paths=W.e.map(e=>{const a=xy(e[0]),b=xy(e[1]);if(back.has(e[0]+'-'+e[1])){const x1=a[0]+nw,y1=a[1]+nh/2,x2=b[0]+nw,y2=b[1]+nh/2,m=Math.max(x1,x2)+30;return `<path class="b" d="M${x1} ${y1}C${m} ${y1} ${m} ${y2} ${x2} ${y2}"/>`}const x1=a[0]+nw/2,y1=a[1]+nh,x2=b[0]+nw/2,y2=b[1],m=(y1+y2)/2;return `<path d="M${x1} ${y1}C${x1} ${m} ${x2} ${m} ${x2} ${y2}"/>`}).join('');
 const nodes=W.n.map((x,i)=>{const p=xy(i);return `<button type="button" class="nd k-${x[1]}" data-n="${i}" style="left:${p[0]}px;top:${p[1]}px;width:${nw}px;height:${nh}px"><b>${x[0]}</b><span>${KIND[lang][x[1]]}</span></button>`}).join('');
 return `<div class="stage" style="width:${w}px;height:${h}px"><svg viewBox="0 0 ${w} ${h}" aria-hidden="true">${paths}</svg>${nodes}</div>`;
}
function render(){
 const u=UI[lang];document.documentElement.lang=lang;
 const links=pro.links.filter(l=>!l.wf).map(l=>`<a class="ext" href="${l.url}" target="_blank" rel="noopener">${l.label?tr(l.label):u.site}</a>`).join('');
 let media='';
 if(pro.img==='tuc')media=`<div class="ph3"><img src="${IMG.tuc1}" alt=""><img src="${IMG.tuc2}" alt=""><img src="${IMG.tuc3}" alt=""></div>`;
 if(pro.img==='nbw')media=`<img class="lg" src="${IMG.nbw}" alt="">`;
 if(pro.brand)media=`<p class="kl">kelthen.com</p>`;
 let chat='';if(pro.chat)chat=`<section><h2>${u.ex}</h2><div class="chat">${pro.chat[lang].map(m=>`<p class="${m[0]}">${m[1]}</p>`).join('')}</div></section>`;
 let wfh='';if(wid){const W=WORKFLOWS[wid];wfh=`<section><h2>${u.steps2}</h2><p class="sub">${tr(W.sub)}</p><p class="note">${u.wfNote} ${u.tap}</p><div class="scroll">${graph(W)}</div><div id="nd" aria-live="polite"></div></section>`}
 document.getElementById('pj').innerHTML=`<header><a class="bk" href="../index.html#p-${slug}">← ${u.back}</a><div class="lg-t"><button id="fr" aria-pressed="${lang==='fr'}">FR</button><button id="en" aria-pressed="${lang==='en'}">EN</button></div></header><article><p class="st">${tr(reg.label)} · ${tr(pro.status)}</p><h1>${tr(pro.name)}</h1>${media}<p class="desc">${tr(pro.desc)}</p><p class="stack">${pro.stack}</p>${links?`<div class="lk">${links}</div>`:''}${chat}${wfh}</article>`;
 document.getElementById('fr').onclick=()=>setL('fr');document.getElementById('en').onclick=()=>setL('en');
 document.querySelectorAll('.nd').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.nd.on').forEach(x=>x.classList.remove('on'));b.classList.add('on');const x=WORKFLOWS[wid].n[+b.dataset.n];document.getElementById('nd').innerHTML=`<b>${x[0]}</b><span>${KD[lang][x[1]]}</span>`}));
}
function setL(l){lang=l;try{localStorage.setItem('lang',l)}catch(e){}render()}
render();
})();
