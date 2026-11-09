(function(){
'use strict';
const $=(s,r)=>(r||document).querySelector(s);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let lang='fr';try{const s=localStorage.getItem('lang');if(s==='en'||s==='fr')lang=s}catch(e){}
const tr=v=>v==null?'':(typeof v==='string'?v:v[lang]);
const clamp=(x,a,b)=>Math.min(b==null?1:b,Math.max(a==null?0:a,x));
const ss=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
const ACC=[[14,165,233],[122,77,255],[47,107,255],[0,168,132],[226,152,0],[255,61,110],[232,80,42]];
const CHIPS=[];
const MAPS=[[-47.5,-72.0],[-53.0,-66.5],[-74.0,-59.5],[-87.5,-47.0],[-93.5,-35.0],[-93.5,-29.0],[-90.5,-22.0],[-99.0,-18.5],[-105.5,-8.0],[-105.5,13.0],[-92.5,40.0],[-80.5,54.0],[-78.5,60.0],[-72.0,66.5],[-60.0,72.5],[-55.0,77.5],[-41.0,82.5],[-31.0,80.5],[-21.0,81.5],[-15.0,78.5],[-1.0,77.5],[21.0,69.5],[29.0,63.5],[36.0,61.5],[58.5,42.0],[65.5,31.0],[72.5,14.0],[72.5,-10.0],[62.0,-27.5],[41.0,-32.5],[27.0,-30.5],[24.5,-41.0],[19.0,-46.5],[12.0,-47.5],[6.0,-51.5],[-7.0,-51.5],[-15.0,-43.5],[-18.0,-43.5],[-22.0,-48.5],[-29.5,-52.0],[-34.5,-63.0],[-42.5,-72.0]];
const ASSETS={"tuc1": "assets/img/tuc1.jpg", "tuc2": "assets/img/tuc2.jpg", "tuc3": "assets/img/tuc3.jpg", "nbw": "assets/img/nbw.png"};
function miniGraph(W,c,pw,ph){
 const n=W.n.length,out=[...Array(n)].map(()=>[]);W.e.forEach(e=>out[e[0]].push(e[1]));
 const st=new Uint8Array(n),back=new Set(),dfs=u=>{st[u]=1;out[u].forEach(v=>{if(st[v]===1)back.add(u+'-'+v);else if(!st[v])dfs(v)});st[u]=2};
 W.n.forEach((x,i)=>{if(x[1]==='t'&&!st[i])dfs(i)});W.n.forEach((x,i)=>{if(!st[i])dfs(i)});
 const E=W.e.filter(e=>!back.has(e[0]+'-'+e[1])),rk=new Array(n).fill(0),pre=new Array(n).fill(-1);
 for(let k=0;k<n;k++)E.forEach(e=>{if(rk[e[0]]+1>rk[e[1]]){rk[e[1]]=rk[e[0]]+1;pre[e[1]]=e[0]}});
 const Rk=Math.max(...rk,1),rows={};rk.forEach((r,i)=>(rows[r]=rows[r]||[]).push(i));
 const mx=16,xy=i=>{const r=rk[i],row=rows[r],k=row.indexOf(i),g=Math.min(30,(ph-34)/Math.max(1,row.length-1));return [mx+r/Rk*(pw-2*mx),ph/2+(k-(row.length-1)/2)*g]};
 const col=`rgb(${c})`,seg=(a,b)=>{const m=(a[0]+b[0])/2;return `C${m} ${a[1]} ${m} ${b[1]} ${b[0]} ${b[1]}`};
 const ed=E.map((e,i)=>{const a=xy(e[0]),b=xy(e[1]);return `<path class="e" pathLength="1" style="--i:${rk[e[0]]}" d="M${a[0]} ${a[1]}${seg(a,b)}" fill="none" stroke="${col}" stroke-opacity=".55" stroke-width="1.6"/>`}).join('');
 const no=W.n.map((x,i)=>{const p=xy(i),ai=x[1]==='a',tr=x[1]==='t';return `<circle class="n" style="--i:${rk[i]}" cx="${p[0]}" cy="${p[1]}" r="${ai?8:tr?6:4.4}" fill="${ai?col:tr?'#141a21':'#fff'}" stroke="${ai?col:tr?'#141a21':col}" stroke-width="1.6"/>`}).join('');
 let end=rk.indexOf(Rk),ch=[end];while(pre[end]>=0){end=pre[end];ch.unshift(end)}
 let d='';ch.forEach((v,i)=>{const p=xy(v);d+=i?seg(xy(ch[i-1]),p):`M${p[0]} ${p[1]}`});
 return `<svg viewBox="0 0 ${pw} ${ph}" aria-hidden="true">${ed}${no}<circle r="6" fill="${col}"><animateMotion dur="${Math.max(3,ch.length*.42)}s" repeatCount="indefinite" path="${d}"/></circle></svg>`;
}
/* Ce qui est accroché dans chaque pièce */
const ITEMS=[];
REGIONS.forEach((r,i)=>{ITEMS.push({room:i,kind:'title',r});if(r.text||r.contact)ITEMS.push({room:i,kind:'note',r});(r.timeline||[]).forEach((s,k)=>ITEMS.push({room:i,kind:'step',r,s,k}));(r.projects||[]).forEach(p=>ITEMS.push({room:i,kind:'project',r,p}))});
const spl=s=>{let n=0;return s.split(' ').map(w=>`<span class="wd">${[...w].map(c=>`<span class="ch" style="--i:${n++}">${c}</span>`).join('')}</span>`).join(' ')};
const spw=s=>s.split(' ').map((w,i)=>`<span class="w" style="--i:${i}">${w}</span>`).join(' ');
function curves(c){let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647,col=`rgb(${c})`;
 return `<svg class="curves" viewBox="0 0 640 170" aria-hidden="true" preserveAspectRatio="none">`+[0,1,2].map(k=>{let y=70+k*22,d='M0 '+y;for(let x=16;x<=640;x+=16){y+=(rnd()-.5)*26+(85-y)*.05;d+=`L${x} ${y.toFixed(1)}`}return `<path class="e" pathLength="1" style="--i:${k*7}" d="${d}" fill="none" stroke="${col}" stroke-opacity="${.9-k*.28}" stroke-width="2"/>`}).join('')+`</svg>`}
function itemHTML(it){
 const u=UI[lang],r=it.r,cc=ACC[it.room%ACC.length],c=cc.join(' '),st=`style="--c:${c}"`,cm=cc.join(',');
 if(it.kind==='title'){const lb=tr(r.label);return `<div class="item title" id="r-${r.id}" data-room="${it.room}" ${st}>${r.area?`<p class="tag">${r.area}</p>`:''}<h2 style="--fs:${Math.min(132,860/(lb.length*.74)).toFixed(0)}px;--len:${(lb.length*.74).toFixed(2)}">${spl(lb)}</h2>${r.skills?`<p class="skills">${spw(tr(r.skills))}</p>`:''}</div>`}
 if(it.kind==='note'){
  let h=`<div class="item note" data-room="${it.room}" ${st}><p class="txt">${spw(tr(r.text))}</p>`;
  if(r.facts)h+=`<dl class="facts">`+r.facts[lang].map(f=>`<div><dt>${f[0]}</dt><dd>${f[1]}</dd></div>`).join('')+`</dl>`;
  if(r.contact){const row=(k,v,x)=>`<div><dt>${k}</dt><dd>${v}</dd>${x?`<button class="copy" type="button" data-copy="${x}">${u.copy}</button>`:''}</div>`;
   h+=`<dl class="contact">`+row(u.mail,CONTACT.mail,CONTACT.mail)+row('LinkedIn',`<a href="${CONTACT.linkedin}" target="_blank" rel="noopener">/serge-folly-sanou ↗</a>`)+row(u.phone,CONTACT.phone,CONTACT.phone)+`</dl><button class="cf-open" type="button" data-cf>${u.write}</button><p class="credit">${u.foot}</p>`}
  return h+`</div>`;
 }
 if(it.kind==='step'){const s=it.s,n=r.timeline.length,col=`rgb(${cm})`,dots=[...Array(n)].map((_,j)=>{const x=20+j*(600/(n-1)),on=j<=it.k;return `<circle class="n" style="--i:${j*3}" cx="${x}" cy="30" r="${j===it.k?15:8}" fill="${on?col:'#fff'}" stroke="${col}" stroke-width="2"/>`}).join('');
  return `<article class="item step" data-room="${it.room}" ${st}><svg class="tl" viewBox="0 0 640 60" aria-hidden="true"><path class="e" pathLength="1" style="--i:0" d="M20 30H620" stroke="${col}" stroke-opacity=".45" stroke-width="2" fill="none"/>${dots}</svg><p class="step-t">${tr(s.type)}${s.when?` · ${tr(s.when)}`:''}</p><h3 class="big">${spl(tr(s.title))}</h3><p class="p-desc">${spw(tr(s.desc))}</p></article>`}
 const p=it.p,links=p.links.filter(l=>!l.wf).map(l=>`<a href="${l.url}" target="_blank" rel="noopener">${l.label?tr(l.label):u.site}</a>`).join('')+`<a href="projets/${slugOf(p)}.html">${u.proj}</a>`;
 const wl=p.links.find(x=>x.wf);let media='',fx='plain';
 if(p.img==='tuc'){fx='web';media=`<div class="scat">${['tuc1','tuc2','tuc3'].map((k,i)=>`<img class="s${i}" src="${ASSETS[k]}" alt="">`).join('')}</div>`}
 else if(p.img==='nbw'){fx='web';media=`<img class="logo-b" src="${ASSETS.nbw}" alt="">`}
 else if(p.brand){fx='web';media=`<div class="kel">${spl('kelthen.com')}</div>`}
 else if(p.chat){fx='ai';media=`<div class="chat"><p class="ex">${u.ex}</p>${p.chat[lang].map((m,i)=>`<p class="${m[0]}" style="--i:${i}">${m[1]}</p>`).join('')}</div>`}
 else if(r.id==='data'){fx='data';media=curves(cm)}
 else if(wl){fx='auto';media=`<div class="gr">${miniGraph(WORKFLOWS[wl.wf],cm,640,190)}</div>`}
 return `<article class="item proj fx-${fx}" data-room="${it.room}" ${st}>${media}<div class="p-txt"><h3 class="p-name">${spl(tr(p.name))}</h3><p class="p-status">${tr(p.status)}</p><p class="p-desc">${spw(tr(p.desc))}</p><p class="p-stack">${p.stack}</p><div class="p-links">${links}</div></div></article>`;
}
const slugOf=p=>(typeof p.name==='string'?p.name:p.name.fr).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const FLATUI=()=>innerWidth<1024||matchMedia('(pointer:coarse)').matches;
let world=null,flat=false,placed=[];
function render(){
 const u=UI[lang];document.documentElement.lang=lang;
 [['t-kicker','kicker'],['t-l1','l1'],['t-l1b','l1b'],['t-l1c','l1c'],['t-l2','l2'],['t-lead','lead'],['t-go','go'],['t-door','door'],['seuil','iris'],['cf-t','write'],['cf-ln','fname'],['cf-le','fmail'],['cf-lm','fmsg'],['cf-s','fsend'],['cf-x','close']].forEach(a=>$('#'+a[0]).textContent=u[a[1]]);
 $('#btn-fr').setAttribute('aria-pressed',lang==='fr');$('#btn-en').setAttribute('aria-pressed',lang==='en');
 $('#cam').innerHTML=ITEMS.map(itemHTML).join('');
 $('#nav-list').innerHTML=REGIONS.map(r=>`<li><a href="#r-${r.id}">${tr(r.label)}</a></li>`).join('');
 if(world)world.place();
 if(typeof cur!=='undefined'&&cur&&!$('#wf').hidden)openWf(cur);
}
function setLang(l){lang=l;if(typeof mapRoom!=='undefined')mapRoom=-9;try{localStorage.setItem('lang',l)}catch(e){}render();roomShown=-2}
$('#btn-fr').addEventListener('click',()=>setLang('fr'));$('#btn-en').addEventListener('click',()=>setLang('en'));


const nav=$('#nav'),menu=$('#menu-btn');
menu.addEventListener('click',()=>{const o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',o)});
document.addEventListener('click',e=>{
 const c=e.target.closest('[data-copy]');
 if(c){const done=()=>{c.textContent=UI[lang].copied;setTimeout(()=>c.textContent=UI[lang].copy,1600)};
  const sel=()=>{const g=getSelection(),n=document.createRange();n.selectNodeContents(c.previousElementSibling);g.removeAllRanges();g.addRange(n)};
  try{navigator.clipboard.writeText(c.dataset.copy).then(done).catch(sel)}catch(x){sel()}return}
 const w=e.target.closest('[data-wf]');if(w){e.preventDefault();try{location.hash=w.dataset.wf}catch(x){}openWf(w.dataset.wf);return}
 const a=e.target.closest('a[href^="#"]');
 if(a){e.preventDefault();const id=a.getAttribute('href').slice(1);let y=0;
  if(id!=='entree'){if(world){const i=REGIONS.findIndex(r=>'r-'+r.id===id);y=world.roomY(i)}else{const el=document.getElementById(id);y=el?el.getBoundingClientRect().top+scrollY-70:0}}
  scrollTo({top:y,behavior:reduce?'auto':'smooth'});nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}
});

/* ─── Le cerveau, la porte et la maison ─── */
function b64(s){const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer}
function buildWorld(){
 if(!window.THREE)return null;
 const canvas=$('#gl');let renderer;
 try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,stencil:true,powerPreference:'high-performance'})}catch(e){return null}
 renderer.setClearColor(0x121d36,1);renderer.autoClear=false;

 /* Extérieur : vrai cerveau, côté gauche tourné vers la caméra */
 const q=new Uint16Array(b64(BRAIN.p)),f=new Uint16Array(b64(BRAIN.f)),sh=new Uint8Array(b64(BRAIN.s)),nv=q.length/3;
 const P=new Float32Array(nv*3),Sh=new Float32Array(nv),lo=BRAIN.lo,hi=BRAIN.hi,C=[1.5,-16,8],K=74;
 const X0=.05,Y0=-.24;let zmax=-9;
 for(let i=0;i<nv;i++){
  const m=[0,1,2].map(k=>lo[k]+q[i*3+k]/65535*(hi[k]-lo[k]));
  const wx=(m[0]-C[0])/K,wy=(m[2]-C[2])/K,wz=-(m[1]-C[1])/K;
  const x=wz,y=wy,z=-wx;P[i*3]=x;P[i*3+1]=y;P[i*3+2]=z;Sh[i]=sh[i]/255;
  if(Math.abs(x-X0)<.24&&y>Y0-.02&&y<Y0+.6&&z>zmax)zmax=z;
 }
 const oz=zmax+.012;
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('aS',new THREE.BufferAttribute(Sh,1));g.setIndex(new THREE.BufferAttribute(f,1));g.computeVertexNormals();
 const uTime={value:0},uPxr={value:1};
 const brainMat=new THREE.ShaderMaterial({side:THREE.DoubleSide,transparent:true,depthWrite:false,uniforms:{uTime},
  vertexShader:`attribute float aS;varying float vS;varying vec3 vN;varying float vY;void main(){vS=aS;vY=position.y;vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform float uTime;varying float vS;varying vec3 vN;varying float vY;void main(){vec3 n=normalize(vN);if(n.z<0.)n=-n;float rim=pow(1.-n.z,2.4);float sul=1.-smoothstep(.1,.62,vS);vec3 H=normalize(normalize(vec3(-.4,.6,.7))+vec3(0.,0.,1.));float sp=pow(max(dot(n,H),0.),50.);float band=exp(-pow((vY-sin(uTime*.55)*1.2)*15.,2.));vec3 c=mix(vec3(.35,.6,1.),vec3(.72,.9,1.),rim);float a=.035+.62*rim+.16*sul+band*.42;c=mix(c,vec3(.75,.96,1.),band);c=mix(c,vec3(1.),sp);a=max(a,sp*.55);gl_FragColor=vec4(c,a);}`});
 const ext=new THREE.Scene();const brainShell=new THREE.Mesh(g,brainMat);ext.add(brainShell);
 brainShell.renderOrder=2;
 /* Fond, socle holographique, orbites et particules de l'accueil */
 const bgU={uTime,uC:{value:new THREE.Vector2(.66,.5)},uAsp:{value:1}};
 {const q=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.ShaderMaterial({depthTest:false,depthWrite:false,uniforms:bgU,
   vertexShader:`varying vec2 vU;void main(){vU=uv;gl_Position=vec4(position.xy,.9999,1.);}`,
   fragmentShader:`uniform vec2 uC;uniform float uAsp,uTime;varying vec2 vU;void main(){vec2 p=(vU-uC)*vec2(uAsp,1.);float r=length(p);vec3 c=mix(vec3(.13,.2,.34),vec3(.07,.115,.21),smoothstep(0.,1.2,r));c+=vec3(.05,.14,.3)*exp(-r*r*6.)*(1.+.1*sin(uTime*.6));vec2 g=fract(vU*vec2(uAsp,1.)*34.)-.5;gl_FragColor=vec4(c,1.);}`}));
  q.frustumCulled=false;q.renderOrder=-10;ext.add(q);}
 const holo=new THREE.Group();ext.add(holo);
 {const base=new THREE.Mesh(new THREE.PlaneGeometry(5.2,5.2),new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,extensions:{derivatives:true},uniforms:{uTime},
   vertexShader:`varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`uniform float uTime;varying vec2 vU;void main(){vec2 p=vU*2.-1.;float r=length(p),a=atan(p.y,p.x);float v=r*8.;float g=abs(fract(v-.5)-.5)/fwidth(v);float l=1.-min(g,1.);float tk=step(.70,r)*step(r,.735)*step(.55,fract(a*9.55+uTime*.22));float tk2=step(.44,r)*step(r,.46)*step(.7,fract(a*19.1-uTime*.3));float f=1.-smoothstep(.45,1.,r);float glow=exp(-r*r*7.)*.28;float rp=fract(uTime*.28);float rip=exp(-pow((r-rp)*26.,2.))*(1.-rp)*.9;float rq=fract(uTime*.28+.5);rip+=exp(-pow((r-rq)*26.,2.))*(1.-rq)*.9;vec3 c=vec3(.3,.68,1.);gl_FragColor=vec4(c,(.34*l*f+.55*tk+.5*tk2+glow+rip));}`}));
  base.rotation.x=-Math.PI/2;base.position.y=-1.3;holo.add(base);
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(1.15,.62,1.5,48,1,true),new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,uniforms:{uTime},
   vertexShader:`varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`uniform float uTime;varying vec2 vU;void main(){float s=.6+.4*sin(vU.x*62.+uTime*1.4)*sin(vU.x*23.-uTime*.8);gl_FragColor=vec4(.35,.72,1.,.14*s*(1.-smoothstep(.0,1.,vU.y)));}`}));beam.position.y=-.58;holo.add(beam);}
 const orbit=(r,col,tx,tz,dot)=>{const pts=[];for(let i=0;i<=128;i++){const a=i/128*6.2832;pts.push(new THREE.Vector3(Math.cos(a)*r,0,Math.sin(a)*r))}const g=new THREE.Group();g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:col,transparent:true,opacity:.42,blending:THREE.AdditiveBlending,depthWrite:false})));const o=new THREE.Mesh(new THREE.SphereGeometry(.026,12,12),new THREE.MeshBasicMaterial({color:dot}));o.position.x=r;g.add(o);const o2=o.clone();o2.position.x=-r;g.add(o2);const w=new THREE.Group();w.rotation.set(tx,0,tz);w.add(g);holo.add(w);return g};
 const orbA=orbit(1.72,0x5aa8ff,.28,.34,0xffffff),orbB=orbit(1.92,0x3fd8c8,-.2,-.46,0x9be8ff);
 {const n=280,p=[],k=[];for(let i=0;i<n;i++){const a=Math.random()*6.28,e=Math.acos(Math.random()*2-1),r=1.5+Math.random()*2.2;p.push(Math.cos(a)*Math.sin(e)*r,Math.cos(e)*r*.8,Math.sin(a)*Math.sin(e)*r-.3);k.push(Math.random())}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('aK',new THREE.Float32BufferAttribute(k,1));
  holo.add(new THREE.Points(g,new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uTime,uPxr},
   vertexShader:`attribute float aK;uniform float uTime,uPxr;varying float vA;void main(){vec3 q=position;q.y+=mod(uTime*.05*(.4+aK)+aK*4.,4.)-2.;vec4 mv=modelViewMatrix*vec4(q,1.);vA=(.35+.65*abs(sin(uTime*(.5+aK)+aK*20.)));gl_PointSize=clamp(uPxr*.013/(-mv.z),1.5,6.);gl_Position=projectionMatrix*mv;}`,
   fragmentShader:`varying float vA;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(.68,.87,1.,smoothstep(.5,.1,d)*vA);}`})));}
 /* Fibres neuronales : tracées dans le volume réel de la matière blanche */
 const uLW={value:1};
 {const n=TRACTS.n,m=TRACTS.m,tq=new Uint16Array(b64(TRACTS.p)),nvf=n*m*2;
  const pos=new Float32Array(nvf*3),dir=new Float32Array(nvf*3),col=new Float32Array(nvf*3),fa=new Float32Array(nvf*2),sd=new Float32Array(nvf),idx=new Uint32Array(n*(m-1)*6);
  const toW=a=>{const wx=(a[0]-C[0])/K,wy=(a[2]-C[2])/K,wz=-(a[1]-C[1])/K;return [wz,wy,-wx]};
  const tl=TRACTS.lo,th=TRACTS.hi,pt=(l,j)=>[0,1,2].map(k=>tl[k]+tq[(l*m+j)*3+k]/65535*(th[k]-tl[k]));
  let vi=0,ii=0;
  for(let l=0;l<n;l++){const s=Math.random();
   for(let j=0;j<m;j++){
    const a=pt(l,Math.max(j-1,0)),b=pt(l,Math.min(j+1,m-1)),c=pt(l,j),d=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],L=Math.hypot(d[0],d[1],d[2])||1;
    const w=[d[0]*d[0]/L/L,d[1]*d[1]/L/L,d[2]*d[2]/L/L];
    const r=w[0]*.66+w[1]*.05+w[2]*.12,gg=w[0]*.36+w[1]*.85+w[2]*.48,bb=w[0]*1.+w[1]*.76+w[2]*1.;
    const P0=toW(c),P1=toW([c[0]+d[0],c[1]+d[1],c[2]+d[2]]),D=[P1[0]-P0[0],P1[1]-P0[1],P1[2]-P0[2]];
    for(let e=-1;e<=1;e+=2){pos.set(P0,vi*3);dir.set(D,vi*3);col.set([r,gg,bb],vi*3);fa[vi*2]=e;fa[vi*2+1]=j/(m-1);sd[vi]=s;vi++}
    if(j<m-1){const o=(l*m+j)*2;idx.set([o,o+1,o+2,o+1,o+3,o+2],ii);ii+=6}
   }}
  const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.BufferAttribute(pos,3));fg.setAttribute('aD',new THREE.BufferAttribute(dir,3));fg.setAttribute('aC',new THREE.BufferAttribute(col,3));fg.setAttribute('aF',new THREE.BufferAttribute(fa,2));fg.setAttribute('aSeed',new THREE.BufferAttribute(sd,1));fg.setIndex(new THREE.BufferAttribute(idx,1));
  const fib=new THREE.Mesh(fg,new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,uniforms:{uTime,uPxr,uLW},
   vertexShader:`attribute vec3 aD;attribute vec3 aC;attribute vec2 aF;attribute float aSeed;uniform float uPxr,uLW;varying vec3 vC;varying float vT;varying float vS;varying float vE;varying float vX;void main(){vX=position.x;vec4 mv=modelViewMatrix*vec4(position,1.);vec3 d=normalize(normalMatrix*aD),v=normalize(mv.xyz),s=normalize(cross(v,d));mv.xyz+=s*aF.x*uLW*(-mv.z)/uPxr*.5;vC=aC;vT=aF.y;vS=aSeed;vE=aF.x;gl_Position=projectionMatrix*mv;}`,
   fragmentShader:`uniform float uTime;varying vec3 vC;varying float vT;varying float vS;varying float vE;varying float vX;void main(){float wv=exp(-pow((vX-sin(uTime*.42)*1.35)*2.6,2.));float f=fract(vT*1.15-uTime*.17+vS*11.);float p=smoothstep(.88,1.,f);float a=smoothstep(1.,.35,abs(vE));float tap=smoothstep(0.,.08,vT)*smoothstep(1.,.92,vT);vec3 c=mix(clamp(vC,0.,1.),vec3(1.),p*.7);gl_FragColor=vec4(c,(.17+.8*p+.3*wv)*a*tap);}`}));
  fib.renderOrder=1;fib.frustumCulled=false;ext.add(fib);}

 const SP=2.5,STAG=1.5,S=.25,W=6.2,H=3.4,T=.3,EYE=1.55,PX=.004,PITCH=2.65,DOORW=1.44,DOORH=2.2,ARCHW=2.3,ARCHH=2.8;
 const arch=(path,w,h)=>{path.lineTo(-w/2,h-w/2);path.absarc(0,h-w/2,w/2,Math.PI,0,true);path.lineTo(w/2,0)};
 /* Porte : cadre visible et masque qui laisse voir la maison à travers */
 const doorG=new THREE.Group();doorG.position.set(X0,Y0,oz);doorG.scale.setScalar(S);ext.add(doorG);
 {const o=.13,s=new THREE.Shape();s.moveTo(-DOORW/2-o,0);arch(s,DOORW+2*o,DOORH+o);s.lineTo(DOORW/2,0);
  s.absarc(0,DOORH-DOORW/2,DOORW/2,0,Math.PI,false);s.lineTo(-DOORW/2,0);s.closePath();
  /* le contour intérieur doit remonter le long du montant droit */
  const s2=new THREE.Shape();s2.moveTo(-DOORW/2-o,0);s2.lineTo(-DOORW/2-o,DOORH-DOORW/2);s2.absarc(0,DOORH-DOORW/2,DOORW/2+o,Math.PI,0,true);s2.lineTo(DOORW/2+o,0);s2.lineTo(DOORW/2,0);s2.lineTo(DOORW/2,DOORH-DOORW/2);s2.absarc(0,DOORH-DOORW/2,DOORW/2,0,Math.PI,false);s2.lineTo(-DOORW/2,0);s2.closePath();
  const fg=new THREE.ExtrudeGeometry(s2,{depth:.9,bevelEnabled:false,curveSegments:32});fg.translate(0,0,-.84);
  doorG.add(new THREE.Mesh(fg,new THREE.MeshBasicMaterial({color:0xeaf7ff})));
  const halo=new THREE.Mesh(new THREE.PlaneGeometry(7,7),new THREE.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uTime},
   vertexShader:`varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`uniform float uTime;varying vec2 vU;void main(){float r=length(vU*2.-1.);float a=pow(max(1.-r,0.),2.4);gl_FragColor=vec4(.48,.82,1.,a*(.62+.26*sin(uTime*1.7)));}`}));halo.position.set(0,1.05,.04);halo.renderOrder=3;doorG.add(halo);}
 const mask=new THREE.Scene(),maskG=doorG.clone(false);mask.add(maskG);
 {const s=new THREE.Shape();s.moveTo(-DOORW/2,0);arch(s,DOORW,DOORH);s.lineTo(-DOORW/2,0);
  const m=new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false,side:THREE.DoubleSide,stencilWrite:true,stencilRef:1,stencilFunc:THREE.AlwaysStencilFunc,stencilZPass:THREE.ReplaceStencilOp});
  const me=new THREE.Mesh(new THREE.ShapeGeometry(s,32),m);me.position.z=.02;maskG.add(me);}

 /* Intérieur */
 const inner=new THREE.Scene(),house=new THREE.Group();house.position.set(X0,Y0,oz);house.scale.setScalar(S);inner.add(house);
 const R=6.5,RT=2.2,allMats=[],sphMats=[],fireT=[];let lastFire=-1;
 const reg=m=>{m.stencilFunc=THREE.EqualStencilFunc;m.stencilRef=1;m.stencilZPass=THREE.KeepStencilOp;allMats.push(m);return m};
 let stencilOn=null;const setStencil=v=>{if(v!==stencilOn){stencilOn=v;allMats.forEach(m=>m.stencilWrite=v)}};
 const LIN=`float lin(float v,float w){float g=abs(fract(v-.5)-.5)/fwidth(v);return 1.-smoothstep(w-.5,w+.5,g);}`;
 /* Les neurones sont placés selon leur vraie région, le trajet avance toujours */
 const NC=[];{let zz=-9;REGIONS.forEach((r,i)=>{const m=r.mni;if(i>0)zz-=Math.max(27,Math.abs(REGIONS[i-1].mni[1]-m[1])*.42);NC.push(new THREE.Vector3((m[0]+36)*.38,(m[2]-22)*.13+EYE,zz))});}
 const pts=[new THREE.Vector3(0,EYE,0),new THREE.Vector3(0,EYE,-1.2)],idxC=[];
 NC.forEach((c,i)=>{idxC.push(pts.length);pts.push(c);if(i<NC.length-1){const m=c.clone().lerp(NC[i+1],.5);m.x+=i%2?8:-8;m.y+=i%2?-2.4:2.4;pts.push(m)}});
 const G=new THREE.CatmullRomCurve3(pts,false,'centripetal'),NP=pts.length-1,tC=idxC.map(i=>i/NP);
 const hole=(i,sg)=>{if(sg>0&&i===NC.length-1)return new THREE.Vector3();const c=NC[i];for(let q=1;q<500;q++){const t=clamp(tC[i]+sg*q*.0015,0,1),p=G.getPoint(t);if(p.distanceTo(c)>=R)return p.sub(c).normalize()}return new THREE.Vector3()};
 const exitDir=i=>{const e=hole(i,1);return e.lengthSq()>.5?e:hole(i,-1).negate()};
 const cosH=Math.cos(Math.asin(RT/R));
 const colOf=i=>ACC[i%ACC.length].map(v=>v/255);
 NC.forEach((c,i)=>{
  const ac=colOf(i),tn=exitDir(i),rt=new THREE.Vector3().crossVectors(tn,new THREE.Vector3(0,1,0)).normalize();
  const sm=reg(new THREE.ShaderMaterial({side:THREE.DoubleSide,extensions:{derivatives:true},uniforms:{uTime,uC:{value:new THREE.Vector3(...ac)},uHA:{value:hole(i,-1)},uHB:{value:hole(i,1)},uCH:{value:cosH},uR:{value:rt},uOpen:{value:0},uFire:{value:99},uF:{value:tn}},
   vertexShader:`varying vec3 vD;void main(){vD=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`uniform vec3 uC,uHA,uHB,uR,uF;uniform float uCH,uTime,uOpen,uFire;varying vec3 vD;${LIN}
   void main(){vec3 d=normalize(vD);float hA=dot(d,uHA),hB=dot(d,uHB),cB=mix(.9997,uCH,uOpen);if(hA>uCH||(uOpen>.01&&hB>cB))discard;float hh=uOpen>.01?max(hA-uCH,hB-cB):hA-uCH;
    float ax=abs(dot(d,uR));float q=sin(ax*6.+sin(d.y*5.)*1.4+1.3*sin(d.z*2.4))+.6*sin(d.y*7.+sin(ax*4.5)*1.2);
    vec3 col=mix(vec3(1.),uC,.05);col=mix(col,uC,lin(q*2.3,.6)*(.13+.2*uOpen));
    col=mix(col,uC,exp(-abs(d.y+.62)*26.)*.12+smoothstep(.005,.002,abs(d.y+.62))*.8);
    float r=smoothstep(-.05,-.012,hh);col=mix(col,uC,r*.28+smoothstep(-.012,-.004,hh));float ang=acos(clamp(dot(d,uF),-1.,1.));float wv=exp(-pow((ang-uFire*1.15)*5.,2.))*(1.-smoothstep(.8,2.6,uFire));col=mix(col,uC,wv*.6+(1.-smoothstep(0.,.8,uFire))*.16);
    col*=mix(.94,1.,smoothstep(-1.,.5,d.y));
    if(gl_FrontFacing){float mb=lin((d.x*5.+sin(d.y*6.+uTime*.4))*2.,.7);col=mix(mix(uC,vec3(1.),.62),uC,mb*.5);}
    gl_FragColor=vec4(col,1.);}`}));
  sphMats.push(sm);fireT.push(-99);const sp=new THREE.Mesh(new THREE.SphereGeometry(R,72,56),sm);sp.position.copy(c);house.add(sp);
  /* Disque lumineux sous le visiteur */
  const fm=reg(new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,extensions:{derivatives:true},uniforms:{uTime,uC:{value:new THREE.Vector3(...ac)}},
   vertexShader:`varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`uniform vec3 uC;uniform float uTime;varying vec2 vU;${LIN}void main(){vec2 p=vU*2.-1.;float r=length(p),a=atan(p.y,p.x);float l=lin(r*6.,.6)*(1.-smoothstep(.55,1.,r));float rp=fract(uTime*.2);float w=exp(-pow((r-rp)*22.,2.))*(1.-rp);gl_FragColor=vec4(uC,clamp(l*.5+w*.5,0.,1.));}`}));
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(11,11),fm);fl.rotation.x=-Math.PI/2;fl.position.set(c.x,c.y-2.2,c.z);house.add(fl);
  /* Petits points qui flottent dans la salle */
  {const pp=[],pk=[];for(let k=0;k<70;k++){const [x,y,z]=[Math.random()*2-1,Math.random()*2-1,Math.random()*2-1],m=Math.hypot(x,y,z)||1,rr=2.6+Math.random()*3;pp.push(c.x+x/m*rr,c.y+y/m*rr,c.z+z/m*rr);pk.push(Math.random())}
   const g2=new THREE.BufferGeometry();g2.setAttribute('position',new THREE.Float32BufferAttribute(pp,3));g2.setAttribute('aK',new THREE.Float32BufferAttribute(pk,1));
   const pm=reg(new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uTime,uPxr,uC:{value:new THREE.Vector3(...ac)}},
    vertexShader:`attribute float aK;uniform float uTime,uPxr;varying float vA;void main(){vec3 q=position;q.y+=sin(uTime*(.3+aK*.4)+aK*30.)*.35;vec4 mv=modelViewMatrix*vec4(q,1.);vA=.28+.5*abs(sin(uTime*(.5+aK)+aK*20.));gl_PointSize=clamp(uPxr*.018/(-mv.z),2.,20.);gl_Position=projectionMatrix*mv;}`,
    fragmentShader:`uniform vec3 uC;varying float vA;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(uC,smoothstep(.5,.15,d)*vA);}`}));
   house.add(new THREE.Points(g2,pm));}
  /* Axone qui arrive dans ce neurone */
  const ta=i===0?0:tC[i-1],tb=tC[i],leg=new THREE.Curve();leg.getPoint=(t,o)=>G.getPoint(ta+(tb-ta)*t,o||new THREE.Vector3());
  const c0=colOf(i===0?0:i-1),len=leg.getLength();
  const tm=reg(new THREE.ShaderMaterial({side:THREE.DoubleSide,transparent:true,depthWrite:false,extensions:{derivatives:true},uniforms:{uTime,uA:{value:new THREE.Vector3(...c0)},uB:{value:new THREE.Vector3(...ac)},uP0:{value:i===0?new THREE.Vector3(0,-999,0):NC[i-1]},uP1:{value:c},uR:{value:R-.04},uL:{value:len}},
   vertexShader:`varying vec3 vP;varying vec2 vU;void main(){vP=position;vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`uniform vec3 uA,uB,uP0,uP1;uniform float uR,uL,uTime;varying vec3 vP;varying vec2 vU;${LIN}
   void main(){if(distance(vP,uP0)<uR||distance(vP,uP1)<uR)discard;vec3 c=mix(uA,uB,vU.x);float s=vU.x*uL;
    vec3 col=mix(vec3(1.),c,.07);col=mix(col,c,lin(s/2.4,.7)*.55);
    float y=abs(fract(vU.y)-.5)*2.;col=mix(col,c,lin(y*10.,.5)*.14);
    float f=fract(s/15.-uTime*.34);float rg=lin(s/2.4,.7),pl=exp(-pow((f-.5)*18.,2.));col=mix(col,c,pl*.65);
    gl_FragColor=vec4(col,clamp(.07+rg*.75+pl*.5+step(.55,fract(s/5.))*.05,0.,1.));}`}));
  house.add(new THREE.Mesh(new THREE.TubeGeometry(leg,Math.max(60,Math.round(len*3)),RT,28,false),tm));
 });
 /* Intérieur réel du cerveau, vu à très grande échelle */
 {const P2=new Float32Array(nv*3);for(let i=0;i<nv;i++){const m=[0,1,2].map(k=>lo[k]+q[i*3+k]/65535*(hi[k]-lo[k]));P2[i*3]=m[0]*1.1+6;P2[i*3+1]=(m[2]-8)*.95+EYE;P2[i*3+2]=(m[1]-74)*1.1+14}
  const g2=new THREE.BufferGeometry();g2.setAttribute('position',new THREE.BufferAttribute(P2,3));g2.setAttribute('aS',new THREE.BufferAttribute(Sh,1));g2.setIndex(new THREE.BufferAttribute(f,1));
  {const sp=[];for(let i=0;i<=240;i++){const p=G.getPoint(i/240);sp.push(p.x,p.y,p.z)}const D2=new Float32Array(nv);for(let v=0;v<nv;v++){let b=1e12;for(let i=0;i<sp.length;i+=3){const a0=P2[v*3]-sp[i],a1=P2[v*3+1]-sp[i+1],a2=P2[v*3+2]-sp[i+2],d=a0*a0+a1*a1+a2*a2;if(d<b)b=d}D2[v]=Math.sqrt(b)}g2.setAttribute('aDist',new THREE.BufferAttribute(D2,1));}
  house.add(new THREE.Mesh(g2,reg(new THREE.ShaderMaterial({side:THREE.DoubleSide,extensions:{derivatives:true},uniforms:{uTime},
   vertexShader:`attribute float aS;attribute float aDist;varying float vS;varying float vD;varying vec3 vP;void main(){vS=aS;vD=aDist;vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`uniform float uTime;varying float vS;varying float vD;varying vec3 vP;${LIN}void main(){if(vD<25.)discard;float t=clamp(-vP.z/185.,0.,1.);vec3 a=mix(vec3(.55,.77,1.),vec3(.8,.66,1.),t);vec3 c=mix(a*.86,mix(vec3(1.),a,.22),smoothstep(.1,.8,vS));c=mix(c,a*.66,lin(vP.y/3.4,.7)*.42);float wv=exp(-pow(fract(t*2.-uTime*.07)-.5,2.)*80.);c=mix(c,vec3(1.),wv*.22);c=mix(vec3(.957,.969,.984),c,smoothstep(25.,42.,vD));gl_FragColor=vec4(c,1.);}`}))));}
 /* Faisceaux de fibres autour du trajet */
 {const NF=Math.min(innerWidth,innerHeight)<600?1000:1900,M=14,nvf=NF*M*2,pos=new Float32Array(nvf*3),dir=new Float32Array(nvf*3),col=new Float32Array(nvf*3),fa=new Float32Array(nvf*2),sd=new Float32Array(nvf),idx=new Uint32Array(NF*(M-1)*6);
  const up=new THREE.Vector3(0,1,0),U=new THREE.Vector3(),V=new THREE.Vector3(),P0=new THREE.Vector3();let vi=0,ii=0;
  for(let l=0;l<NF;l++){const t0=Math.random()*.92,span=.05+Math.random()*.09,ang=Math.random()*6.283,rad=3.8+Math.pow(Math.random(),1.5)*24,tw=(Math.random()-.5)*.5,sdv=Math.random();
   const ci=tC.findIndex(x=>x>t0+span/2),ac=colOf(Math.max(ci<0?NC.length-1:ci,0)),br=.72+Math.random()*.28;let prev=null;
   for(let j=0;j<M;j++){const t=Math.min(1,t0+span*j/(M-1)),tn=G.getTangent(t);G.getPoint(t,P0);U.crossVectors(tn,up).normalize();V.crossVectors(U,tn);const a=ang+tw*j,wob=Math.sin(j*.6+l)*.9;
    let x=P0.x+U.x*Math.cos(a)*rad+V.x*Math.sin(a)*rad*.8+wob,y=P0.y+U.y*Math.cos(a)*rad+V.y*Math.sin(a)*rad*.8,z=P0.z+U.z*Math.cos(a)*rad+V.z*Math.sin(a)*rad*.8;for(let h=0;h<NC.length;h++){const cc=NC[h],dx=x-cc.x,dy=y-cc.y,dz=z-cc.z,dl=Math.hypot(dx,dy,dz);if(dl<R+1.3){const k=(R+1.3)/dl;x=cc.x+dx*k;y=cc.y+dy*k;z=cc.z+dz*k}}
    const d=prev?[x-prev[0],y-prev[1],z-prev[2]]:[tn.x,tn.y,tn.z];prev=[x,y,z];
    for(let e=-1;e<=1;e+=2){pos.set([x,y,z],vi*3);dir.set(d,vi*3);col.set([ac[0]*br,ac[1]*br,ac[2]*br],vi*3);fa[vi*2]=e;fa[vi*2+1]=j/(M-1);sd[vi]=sdv;vi++}
    if(j<M-1){const o=(l*M+j)*2;idx.set([o,o+1,o+2,o+1,o+3,o+2],ii);ii+=6}}}
  const fg2=new THREE.BufferGeometry();fg2.setAttribute('position',new THREE.BufferAttribute(pos,3));fg2.setAttribute('aD',new THREE.BufferAttribute(dir,3));fg2.setAttribute('aC',new THREE.BufferAttribute(col,3));fg2.setAttribute('aF',new THREE.BufferAttribute(fa,2));fg2.setAttribute('aSeed',new THREE.BufferAttribute(sd,1));fg2.setIndex(new THREE.BufferAttribute(idx,1));
  const fb=new THREE.Mesh(fg2,reg(new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{uTime,uPxr,uLW},
   vertexShader:`attribute vec3 aD;attribute vec3 aC;attribute vec2 aF;attribute float aSeed;uniform float uPxr,uLW;varying vec3 vC;varying float vT;varying float vS;varying float vE;varying float vF;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vec3 d=normalize(normalMatrix*aD),v=normalize(mv.xyz),s=normalize(cross(v,d));float dd=-mv.z;vF=1.-smoothstep(5.,30.,dd);mv.xyz+=s*aF.x*uLW*1.5*dd/uPxr*.5;vC=aC;vT=aF.y;vS=aSeed;vE=aF.x;gl_Position=projectionMatrix*mv;}`,
   fragmentShader:`uniform float uTime;varying vec3 vC;varying float vT;varying float vS;varying float vE;varying float vF;void main(){float f=fract(vT*1.1-uTime*.3+vS*11.);float p=smoothstep(.84,1.,f);float a=smoothstep(1.,.3,abs(vE));float tap=smoothstep(0.,.1,vT)*smoothstep(1.,.9,vT);gl_FragColor=vec4(mix(vC,vec3(1.),p*.65),(.34+.66*p)*a*tap*vF);}`})));
  fb.frustumCulled=false;fb.renderOrder=3;house.add(fb);}
 /* Dendrites autour de chaque neurone et autres neurones au loin */
 {const dm=NC.map((c,i)=>reg(new THREE.ShaderMaterial({uniforms:{uTime,uC:{value:new THREE.Vector3(...colOf(i))}},
   vertexShader:`varying float vU;void main(){vU=uv.x;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`uniform vec3 uC;uniform float uTime;varying float vU;void main(){float f=fract(vU*2.-uTime*.5);float p=smoothstep(.8,1.,f);gl_FragColor=vec4(mix(mix(uC,vec3(1.),.35),vec3(1.),p*.8),1.);}`})));
  const v3=()=>{const a=Math.random()*6.283,y=Math.random()*2-1,r=Math.sqrt(1-y*y);return new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r)};
  NC.forEach((c,i)=>{const dHA=hole(i,-1),dHB=hole(i,1);let made=0,guard=0;while(made<18&&guard++<200){const dr=v3();if((dHA.lengthSq()>.5&&dr.dot(dHA)>.72)||(dHB.lengthSq()>.5&&dr.dot(dHB)>.72))continue;made++;
    const L0=9+Math.random()*16,pts=[c.clone().addScaledVector(dr,R+.05)];let dd=dr.clone();for(let k=1;k<=4;k++){dd.add(v3().multiplyScalar(.42)).normalize();pts.push(pts[k-1].clone().addScaledVector(dd,L0/4))}
    if(pts.some((pp,k)=>k>0&&NC.some((c2,h)=>pp.distanceTo(c2)<(h===i?R+.6:R+3)))){made--;continue}
    const cv=new THREE.CatmullRomCurve3(pts),seg=22,gt=new THREE.TubeGeometry(cv,seg,.34,8,false),pa=gt.attributes.position,C0=new THREE.Vector3(),Vt=new THREE.Vector3();
    for(let rg=0;rg<=seg;rg++){cv.getPointAt(rg/seg,C0);const tp=1-rg/seg*.9;for(let rd=0;rd<=8;rd++){const vi=rg*9+rd;Vt.fromBufferAttribute(pa,vi).sub(C0).multiplyScalar(tp).add(C0);pa.setXYZ(vi,Vt.x,Vt.y,Vt.z)}}
    house.add(new THREE.Mesh(gt,dm[i]))}});
  const bg=new THREE.SphereGeometry(1,14,10),bm=reg(new THREE.ShaderMaterial({uniforms:{uTime},vertexShader:`varying vec3 vN;varying vec3 vW;void main(){vN=normalize(normalMatrix*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,fragmentShader:`uniform float uTime;varying vec3 vN;varying vec3 vW;void main(){float r=pow(1.-abs(vN.z),1.4),p=.5+.5*sin(uTime*1.3+vW.x*.6+vW.z*.4);gl_FragColor=vec4(mix(vec3(.62,.74,1.),vec3(1.),.35+r*.55*p),1.);}`}));
  for(let k=0;k<70;k++){const t=Math.random(),p=G.getPoint(t),d=v3().multiplyScalar(13+Math.random()*34);d.y*=.7;const m=new THREE.Mesh(bg,bm);m.position.copy(p).add(d);if(NC.some(c=>c.distanceTo(m.position)<R+3.5))continue;m.scale.setScalar(.7+Math.random()*1.9);house.add(m)}}
 const SL=ITEMS.map((it,idx)=>({idx,room:it.room,kind:it.kind}));
 const LV=v=>L(v.x,v.y,v.z);
 const up0=new THREE.Vector3(0,1,0);
 const cam=new THREE.PerspectiveCamera(30,1,.008,160);
 const view=$('#walls'),camEl=$('#cam');
 const L=(x,y,z)=>new THREE.Vector3(X0+x*S,Y0+y*S,oz+z*S);
 let w=1,h=1,stops=[],curveP=null,quats=[],dw=[],keys=[],itemStops=[],roomKey=[];
 const eps=v=>Math.abs(v)<1e-10?0:v;
 const objCSS=m=>{const e=m.elements;return 'translate(-50%,-50%) matrix3d('+[e[0],e[1],e[2],e[3],-e[4],-e[5],-e[6],-e[7],e[8],e[9],e[10],e[11],e[12],e[13],e[14],e[15]].map(eps).join(',')+')'};
 const camCSS=m=>{const e=m.elements;return 'matrix3d('+[e[0],-e[1],e[2],e[3],e[4],-e[5],e[6],e[7],e[8],-e[9],e[10],e[11],e[12],-e[13],e[14],e[15]].map(eps).join(',')+')'};
 let cardD=3;
 function place(){
  const nodes=camEl.children,o=new THREE.Object3D(),M=new THREE.Matrix4();
  if(FLATUI()){[...nodes].forEach(n=>n.style.transform='');camEl.style.transform='';camEl.style.width='';camEl.style.height='';view.style.perspective='';view.style.perspectiveOrigin='';return}
  camEl.style.width=w+'px';camEl.style.height=h+'px';view.style.perspectiveOrigin=(w/2)+'px '+(h/2)+'px';
  SL.forEach((s,i)=>{if(!s.card)return;const w0=LV(s.card),e=LV(s.cam);o.position.copy(w0);o.quaternion.setFromRotationMatrix(M.lookAt(e,w0,up0));o.scale.setScalar(S*PX);o.updateMatrixWorld(true);nodes[i].style.transform=objCSS(o.matrixWorld)});
 }
 function build(){
  const b=canvas.getBoundingClientRect();w=Math.max(1,Math.round(b.width));h=Math.max(1,Math.round(b.height));
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<1024?1.5:2));document.body.classList.toggle('ui2d',FLATUI());renderer.setSize(w,h,false);cam.aspect=w/h;
  const wide=cam.aspect>=1,dk=Math.max(1,1.08/cam.aspect);
    const tanH=2*cam.aspect*Math.tan((wide?25:31)*Math.PI/180),cw=(w<900?380:640)*PX,fracC=w<900?.88:Math.min(.43,620/w);cardD=clamp(cw/(fracC*tanH),2.2,4.4);
  stops=[];
  const add=(p,l,dwell,extra)=>stops.push(Object.assign({p,l,dwell},extra||{}));
  add(new THREE.Vector3(.95*dk,.42*dk,oz+5.4*dk),new THREE.Vector3(0,-.02,0),true,{sx:wide?-.21:0,sy:wide?0:.19});
  add(L(0,EYE,5.2),L(0,EYE,0),false);
  add(L(0,EYE,0),L(0,EYE,-4),false);
  roomKey=[];
  stops.forEach(s=>{s.room=-1;s.rf=0});
  NC.forEach((c,i)=>{
   const ta=i===0?0:tC[i-1],tb=tC[i],nS=22;
   for(let q=1;q<nS;q++){const t=ta+(tb-ta)*q/nS,p=G.getPoint(t);if((i>0&&p.distanceTo(NC[i-1])<2.4)||p.distanceTo(c)<2.4)continue;add(LV(p),LV(G.getPoint(Math.min(t+.012,1))),false,{room:i,rf:Math.max(0,i-1+q/nS)})}
   const tn=exitDir(i),sl=SL.filter(s=>s.room===i),n=sl.length;
   sl.forEach((s,k)=>{if(k===0)roomKey[i]=stops.length;const p=c.clone().addScaledVector(tn,(k-(n-1)/2)*.45);s.cam=p;s.card=p.clone().addScaledVector(tn,cardD);add(LV(p),LV(p.clone().addScaledVector(tn,6)),true,{room:i,rf:i})});
  });
  curveP=new THREE.CatmullRomCurve3(stops.map(s=>s.p),false,'centripetal');
  const M=new THREE.Matrix4(),up=new THREE.Vector3(0,1,0);
  quats=stops.map(s=>new THREE.Quaternion().setFromRotationMatrix(M.lookAt(s.p,s.l,up)));
  dw=stops.map((s,i)=>s.dwell?i:-1).filter(i=>i>=0);
  const vh=innerHeight;keys=[];let y=0;
  dw.forEach((si,j)=>{if(j>0){const pr=dw[j]-dw[j-1]>2;y+=vh*(j===1?2.7:pr?1.35:.6)}const a=y;y+=j===0?0:vh*.42;keys.push({a,b:y,u:si})});
  $('#track').style.height=(y+vh)+'px';
  place();
 }
 build();
 const tmp2=new THREE.Vector3();let mx=0,my=0,mxs=0,mys=0;addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5}},{passive:true});
 const tmp=new THREE.Vector3(),fw=new THREE.Quaternion(),dp=new THREE.Vector3(X0,Y0+DOORH*S*.55,oz);
 return {place,build,
  itemY(i){const k=keys[i+1];return k?k.b:0},
  roomY(i){const si=roomKey[i],k=keys.find(k=>k.u===si);return k?k.b:0},
  uAt(y){for(let j=0;j<keys.length-1;j++){if(y<=keys[j].b)return keys[j].u;if(y<keys[j+1].a){const t=(y-keys[j].b)/(keys[j+1].a-keys[j].b),e=t*t*t*(t*(t*6-15)+10);return keys[j].u+(keys[j+1].u-keys[j].u)*e}}return keys[keys.length-1].u},
  draw(u,t){
   const n=stops.length,i=Math.min(Math.floor(u),n-2),fr=clamp(u-i);
   curveP.getPoint(u/(n-1),cam.position);fw.copy(quats[i]).slerp(quats[i+1],fr);cam.quaternion.copy(fw);
   const ent=ss(0,1,u);
   mxs+=(mx-mxs)*.05;mys+=(my-mys)*.05;if(u<1){cam.position.x+=(Math.sin(t*.3)*.22+mxs*.7)*(1-ent);cam.position.y+=(Math.sin(t*.22)*.07-mys*.35)*(1-ent)}
   const a=stops[i],b=stops[i+1],sx=(a.sx||0)*(1-fr)+(b.sx||0)*fr,sy=(a.sy||0)*(1-fr)+(b.sy||0)*fr;
   const zt=ss(oz+1.25,oz-.12,cam.position.z);const lf=(a.rf+(b.rf-a.rf)*fr)%1,kick=u>3?Math.sin(lf*Math.PI)*24:0;cam.fov=30+((cam.aspect>=1?50:62)-30)*zt+kick;
   cam.setViewOffset(w,h,sx*w,sy*h,w,h);cam.updateProjectionMatrix();if(u>3)cam.rotateZ(Math.sin(lf*6.283)*.07);cam.updateMatrixWorld(true);
   tmp.set(0,0,0).project(cam);bgU.uC.value.set(tmp.x*.5+.5,tmp.y*.5+.5);bgU.uAsp.value=w/h;holo.visible=u<1.5;orbA.rotation.y=t*.34;orbB.rotation.y=-t*.24;
   uTime.value=t;uPxr.value=h*renderer.getPixelRatio()/(2*Math.tan(cam.fov*Math.PI/360));uLW.value=1.2*renderer.getPixelRatio();
   const rf=a.rf+(b.rf-a.rf)*fr;if(u>2.9){const rr=Math.round(rf);if(Math.abs(rf-rr)<.004&&rr!==lastFire){fireT[rr]=t;lastFire=rr}sphMats.forEach((m,k)=>{m.uniforms.uOpen.value=ss(k+.02,k+.2,rf);m.uniforms.uFire.value=t-fireT[k]})}
   const passed=cam.position.z<oz+.03;renderer.setClearColor(passed?0xf4f7fb:0x121d36,1);renderer.clear(true,true,true);
   if(passed){setStencil(false);renderer.render(inner,cam)}
   else{renderer.render(ext,cam);renderer.render(mask,cam);renderer.clearDepth();setStencil(true);renderer.render(inner,cam)}
   const fovpx=cam.projectionMatrix.elements[5]*h/2;
   const lz=(cam.position.z-oz)/S;let ri=-1;
   if(u>=2.9)ri=stops[Math.round(u)].room;
   if(u>=3&&!FLATUI()){view.style.perspective=fovpx+'px';camEl.style.transform='translateZ('+fovpx+'px)'+camCSS(cam.matrixWorld.clone().invert())+'translate('+w/2+'px,'+h/2+'px)'}
      const chips=[];if(u<.9){const n=CHIPS.length;for(let c=0;c<n;c++){const a=t*.2+c/n*6.2832,zc=Math.sin(a)*1.1;tmp.set(.14+Math.cos(a)*1.4,Math.sin(a*1.5+c)*.62+.12,zc).project(cam);chips.push([(tmp.x*.5+.5)*w,(-tmp.y*.5+.5)*h,zc>0?1:.42,zc>0?1:.86])}}
   let dj=0;while(dj<dw.length-2&&u>=dw[dj+1])dj++;const tf=clamp((u-dw[dj])/(dw[dj+1]-dw[dj])),lg=dj>0&&dw[dj+1]-dw[dj]>2;
   return {ri,rf,chips,curC:dj-1,nxtC:dj,aCur:lg?1-ss(.012,.06,tf):1-ss(.1,.42,tf),aNxt:dj===0?ss(.9,1,tf):lg?ss(.955,1,tf):ss(.58,.9,tf),door:[(tmp2.copy(dp).project(cam).x*.5+.5)*w,(-tmp2.y*.5+.5)*h]};
  }};
}

/* ─── Démarrage ─── */
var roomShown=-2;
render();
world=(reduce||(navigator.deviceMemory&&navigator.deviceMemory<=2)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2))?null:buildWorld();
flat=!world;
if(flat)document.body.classList.add('flat');
const hero=$('#hero'),door=$('#door'),seuil=$('#seuil');
const mx0=y=>73.75-y,my0=z=>82.1-z,mapPts=REGIONS.map(r=>[mx0(r.mni[1]),my0(r.mni[2])]);
$('#map-svg').innerHTML=`<path d="M${MAPS.map(p=>mx0(p[0]).toFixed(1)+' '+my0(p[1]).toFixed(1)).join('L')}Z" fill="#eef2f7" stroke="#b8c2cf" stroke-width="1.5"/><polyline points="${mapPts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#c4cdd9" stroke-width="2"/><polyline id="map-p" fill="none" stroke="#2f6bff" stroke-width="3" stroke-linecap="round"/>${mapPts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="#fff" stroke="#8a97a8" stroke-width="1.5"/>`).join('')}<circle id="map-h" r="7" fill="#2f6bff" stroke="#fff" stroke-width="2.5"/>`;
let mapRoom=-9;
let t=0,last=performance.now(),uS=0,pmx=0,pmy=0,pmxT=0,pmyT=0;
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){pmxT=e.clientX/innerWidth-.5;pmyT=e.clientY/innerHeight-.5}},{passive:true});
const chipEls=CHIPS.map(c=>{const d=document.createElement('span');d.className='chip';d.textContent=c;$('#chips').appendChild(d);return d});
/* Mots qui s'écrivent dans l'accueil */
let tw=0,tc=0,tb=false;const typedEl=$('#typed');
(function ty(){const w=UI[lang].typed[tw%UI[lang].typed.length];tc+=tb?-1:1;typedEl.textContent=w.slice(0,Math.max(tc,0));let d=tb?34:68;if(!tb&&tc>=w.length){tb=true;d=1500}else if(tb&&tc<=0){tb=false;tw++;d=320}setTimeout(ty,reduce?2600:d)})();
function frame(now){
 requestAnimationFrame(frame);if(document.hidden||flat){last=now;return}
 const dtR=Math.min(.4,(now-last)/1000),dt=Math.min(.05,dtR);last=now;t+=dt;
 const y=scrollY,tu=world.uAt(y);uS+=(tu-uS)*(1-Math.exp(-dtR*6.5));
 const r=world.draw(uS,t);document.body.classList.toggle('in',uS>1.75);
 {const rf=clamp(r.rf,0,mapPts.length-1),i0=Math.min(Math.floor(rf),mapPts.length-2),f0=rf-i0,A0=mapPts[i0],B0=mapPts[i0+1],hx=A0[0]+(B0[0]-A0[0])*f0,hy=A0[1]+(B0[1]-A0[1])*f0;
  $('#map-h').setAttribute('cx',hx.toFixed(1));$('#map-h').setAttribute('cy',hy.toFixed(1));
  $('#map-p').setAttribute('points',mapPts.slice(0,i0+1).map(p=>p.join(',')).join(' ')+' '+hx.toFixed(1)+','+hy.toFixed(1));
  const rr=Math.round(rf);if(rr!==mapRoom){mapRoom=rr;$('#map-l').textContent=tr(REGIONS[rr].label)}}
 pmx+=(pmxT-pmx)*.06;pmy+=(pmyT-pmy)*.06;hero.style.transform=`translate(${(-pmx*14).toFixed(1)}px,${(-pmy*10).toFixed(1)}px)`;
 chipEls.forEach((el,i)=>{const c=r.chips[i];if(!c||uS>.6){el.style.opacity=0;return}el.style.opacity=(c[2]*(1-ss(.1,.55,uS))).toFixed(2);el.style.transform=`translate(-50%,-50%) translate(${c[0].toFixed(1)}px,${c[1].toFixed(1)}px) scale(${c[3]})`});
 const fade=1-ss(.02,.42,uS);hero.style.opacity=fade;hero.style.visibility=fade<.01?'hidden':'visible';
 const df=1-ss(.08,.5,uS);door.style.opacity=df;door.style.visibility=df<.01?'hidden':'visible';
 const m=innerWidth<900;door.style.transform=`translate(${(r.door[0]+(m?46:-210)).toFixed(1)}px,${(r.door[1]-11).toFixed(1)}px)`;
 seuil.style.opacity=ss(1.9,2.5,uS)*(1-ss(2.95,3.4,uS));
 [...$('#cam').children].forEach((n,i)=>{const o=i===r.curC?r.aCur:i===r.nxtC?r.aNxt:0;n.style.opacity=o.toFixed(3);n.style.visibility=o>.01?'visible':'hidden';n.style.pointerEvents=o>.6?'auto':'none';n.classList.toggle('on',o>.55)});
 document.querySelectorAll('#nav-list a').forEach((l,j)=>{const on=j===r.ri;l.classList.toggle('on',on);if(on)l.setAttribute('aria-current','true');else l.removeAttribute('aria-current')});
}
requestAnimationFrame(frame);
let lw=innerWidth;addEventListener('resize',()=>{if(world&&(innerWidth!==lw||!matchMedia('(pointer:coarse)').matches)){lw=innerWidth;world.build()}},{passive:true});
const goHash=()=>{const h=location.hash.slice(1);if(world&&h.indexOf('p-')===0){const i=ITEMS.findIndex(it=>it.p&&slugOf(it.p)===h.slice(2));if(i>=0){const y=world.itemY(i);scrollTo(0,y);uS=world.uAt(y)}}};
try{if(location.hash.indexOf('#p-')===0)history.scrollRestoration='manual'}catch(e){}
goHash();addEventListener('load',()=>{goHash();setTimeout(goHash,80)});
const cf=$('#cf'),cfR=$('#cf-r');
document.addEventListener('click',e=>{if(e.target.closest('[data-cf]')){cf.hidden=false;document.documentElement.style.overflow='hidden';$('#cf-name').focus()}});
const cfClose=()=>{cf.hidden=true;document.documentElement.style.overflow=''};
$('#cf-x').addEventListener('click',cfClose);addEventListener('keydown',e=>{if(e.key==='Escape'&&!cf.hidden)cfClose()});
$('#cf-f').addEventListener('submit',async e=>{e.preventDefault();const f=e.target,b=$('#cf-s');b.disabled=true;cfR.textContent='';try{const r=await fetch('https://api.web3forms.com/submit',{method:'POST',body:new FormData(f)}),j=await r.json();if(!j.success)throw 0;cfR.textContent=UI[lang].fsent;f.reset()}catch(x){cfR.textContent=UI[lang].ferr+CONTACT.mail}b.disabled=false});
})();
