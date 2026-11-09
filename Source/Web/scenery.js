// SPDX-License-Identifier: MIT
// Original analytic 3D scenery, projected onto Canvas. No external geometry or image assets.
(function(root){'use strict';
const C=(v,a,b,f)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:f)),T=Math.PI*2;
const families={filament:'Filament ravines',strata:'Sculpted strata',field:'Object topographies',canopy:'Woven passages'},looks={filament:['Mountain threads','Rolling dunes','Signal spires'],strata:['Layered peaks','Folded ridge','Terraced basin'],field:['Porcelain ridges','Resonant pillars','Pebble dunes'],canopy:['Braided passage','Billowing sails','Vault currents']};
function normalise(v={}){v=v&&typeof v==='object'?v:{};return{framing:v.framing==='specimen'?'specimen':'landscape',detail:Math.round(C(v.detail,18,60,38)),relief:C(v.relief,0,2,.85),opening:C(v.opening,0,1,.45),bend:C(v.bend,0,1,.45),horizon:C(v.horizon,.15,.7,.37),lens:C(v.lens,.55,1.6,1),travel:C(v.travel,-1,1,.32),morph:C(v.morph,0,1,.35),size:C(v.size,.2,1,.65),seed:String(v.seed||'first-light').slice(0,80),ground:v.ground!==false,points:C(v.points,0,1,.55),particles:C(v.particles,0,1,.25),terrain:['hills','ridges','spires'].includes(v.terrain)?v.terrain:'ridges',surface:['threads','points','both'].includes(v.surface)?v.surface:'both',angle:C(v.angle,-1.2,1.2,-.45),elevation:C(v.elevation,.25,1.2,.62),light:C(v.light,-Math.PI,Math.PI,.7)};}
function hash(text){let h=2166136261;for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0)/4294967296;}
const fract=x=>x-Math.floor(x),rnd=(x,z,k)=>fract(Math.sin(x*127.1+z*311.7+k*73.7)*43758.5453),mix=(a,b,t)=>a+(b-a)*t;
function noise(x,z,k){const a=Math.floor(x),b=Math.floor(z),u=fract(x),v=fract(z),sx=u*u*(3-2*u),sz=v*v*(3-2*v);return mix(mix(rnd(a,b,k),rnd(a+1,b,k),sx),mix(rnd(a,b+1,k),rnd(a+1,b+1,k),sx),sz);}
function height(x,z,t,m,look,signal=0){const k=hash(m.seed)*20,zv=z+t*m.travel*1.3,w=x+Math.sin(zv*.19+k)*m.bend*1.4;
 const n=noise(w*.19,zv*.19,k)*.58+noise(w*.43,zv*.43,k+1)*.28+noise(w*.91,zv*.91,k+2)*.14;
 let peaks=0;for(let i=0;i<6;i++){const px=(rnd(i,4,k)-.5)*22,pz=(rnd(i,5,k)-.5)*22,width=1.5+rnd(i,6,k)*3.5;peaks+=Math.exp(-((w-px)**2+(zv-pz)**2)/(width*width))*(2+rnd(i,7,k)*3);}
 let h=m.terrain==='hills'?peaks*.65+n*.55:m.terrain==='spires'?Math.pow(peaks*.55,1.8)+Math.pow(n,5)*1.2:peaks*(.7+n*.55)+Math.pow(1-Math.abs(n*2-1),3)*.45;
 if(look===1)h=peaks*.3+(.5+.5*Math.sin(w*.53+zv*.14+n))**2*(1.5+n*2);
 if(look===2)h*=.6+.5*Math.sin(zv*.24+w*.19+k)**2;
 if(look===2&&m.family==='strata'){const radius=Math.hypot(w*.85,zv*.85);h=Math.exp(-((radius-4.8)**2)/3.5)*(2.6+n*1.8)+n*.35;}else if(look===2){h=Math.pow(Math.max(0,h),1.25)*(1+.45*Math.sin(w*.47+zv*.2)**8);}const valley=1-m.opening*.85*Math.exp(-(w*w)/3.8),breathe=Math.sin(z*.6+x*.4-t*.65)*m.morph*.12;
 return Math.max(.025,(h*valley+breathe+signal*.28*(.5+.5*Math.sin(x*.45+z*.26)**2))*m.relief);
}
const sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],unit=v=>{const d=Math.hypot(...v)||1;return v.map(x=>x/d);};
function camera(W,H,m,passage=false,drift=0){const U=Math.min(W,H),a=m.angle+drift,eye=passage?[Math.sin(a)*2,2.4+m.elevation*1.3,13]:[Math.sin(a)*20,4+m.elevation*15,Math.cos(a)*20],target=passage?[0,3,-12]:[0,1,0],forward=unit(sub(target,eye)),right=unit(cross(forward,[0,1,0])),up=unit(cross(right,forward)),f=U*(passage?1.12:1.5)*m.lens;return{eye,project(v){const q=sub(v,eye),z=dot(q,forward);return z>.7?[W*.5+dot(q,right)*f/z,H*(.5+(m.horizon-.37)*.7)-dot(q,up)*f/z,z]:null;}};}
// A landscape is built in depth, rather than exposed as a rectangular mesh specimen.
function filamentLandscape(g,p,t,s,E,m){
 const W=p.width,H=p.height,U=Math.min(W,H),clock=E.travel(p,t,s),a=E.signals(p,t,s),bass=a.bass*s.reaction,hit=a.beat*s.reaction,air=a.treble*s.reaction,cs=E.colours(p,t,s),seed=hash(m.seed)*31,alpha=g.globalAlpha;
 const colours=cs.map(c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16))),colour=(role,v=1,fog=0)=>'rgb('+colours[role%3].map((c,i)=>Math.round(C(mix(c*v,[5,9,19][i],fog),0,255,0))).join(',')+')';
 const cam=camera(W,H,{...m,elevation:.25+m.elevation*.22,angle:m.angle*.25,lens:m.lens*.82,horizon:m.horizon+.08},false,s.drift*.05*Math.sin(clock*.13));
 const terrain=(x,z)=>{const zt=z+clock*m.travel*2.4,xx=x+Math.sin(zt*.065+seed)*m.bend*4,n=noise(xx*.12,zt*.105+clock*m.morph*.014,seed),fine=noise(xx*.27,zt*.22,seed+3),valley=Math.exp(-((xx-1.8*Math.sin(zt*.08))**2)/(3+m.opening*24));
  let y;if(s.look===1||m.terrain==='hills'){y=(.5+.5*Math.sin(xx*.29+Math.sin(zt*.09)*2+n*.8))**2*(3+fine*1.8);}
  else if(s.look===2||m.terrain==='spires'){const ridge=Math.pow(1-Math.abs(n*2-1),6);y=ridge*9+Math.pow(fine,5)*5;}
  else{y=Math.pow(1-Math.abs(n*2-1),2.7)*7+Math.pow(fine,3)*2.2;}
  return .2+(y*(1-valley*.83)+bass*.45*Math.sin(xx*.3+zt*.18)**4)*m.relief;
 };
 g.save();g.lineJoin='round';g.lineCap='round';
 if(!p.transparent){const bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#02050c');bg.addColorStop(.55,'#0d1525');bg.addColorStop(1,'#02040a');g.fillStyle=bg;g.fillRect(0,0,W,H);
  // Broad atmospheric light, subordinate to the landscape, never a wireframe sun.
  const mist=g.createRadialGradient(W*.58,H*.39,0,W*.58,H*.39,W*.55);mist.addColorStop(0,colour(0,.22));mist.addColorStop(1,'rgba(0,0,0,0)');g.globalAlpha=alpha*.55;g.fillStyle=mist;g.fillRect(0,0,W,H);g.globalAlpha=alpha;
 }
 const rows=Math.round(115+m.detail*1.9),cols=Math.round(160+m.detail*3.2),far=-65,near=13,extent=44,travel=clock*m.travel*2.4;
 for(let j=0;j<=rows;j++){
  const z=mix(far,near,j/rows),points=[],heights=[];for(let i=0;i<=cols;i++){const x=mix(-extent,extent,i/cols),y=terrain(x,z),q=cam.project([x,y,z]);if(q){points.push(q);heights.push({x,y});}}
  if(points.length<2)continue;const depth=points[Math.floor(points.length/2)][2],fog=C((depth-12)/70,0,.94,0);
  // Opaque silhouette strips hide the far side of each ridge; threads cannot show through mountains.
  g.globalAlpha=alpha;g.fillStyle=colour(0,.025+.035*(1-fog),fog*.45);g.beginPath();g.moveTo(points[0][0],H+5);for(let i=0;i<points.length-1;i++){const q=points[i],b=points[i+1];g.quadraticCurveTo(q[0],q[1],(q[0]+b[0])*.5,(q[1]+b[1])*.5);}g.lineTo(points.at(-1)[0],points.at(-1)[1]);g.lineTo(points.at(-1)[0],H+5);g.closePath();g.fill();
  if(m.surface!=='points'){
   g.beginPath();g.moveTo(points[0][0],points[0][1]);for(let i=0;i<points.length-1;i++){const q=points[i],b=points[i+1];g.quadraticCurveTo(q[0],q[1],(q[0]+b[0])*.5,(q[1]+b[1])*.5);}const pigment=g.createLinearGradient(0,0,W,H);pigment.addColorStop(0,colour(s.look===1?1:2,.8,fog));pigment.addColorStop(.38,colour(0,1.25,fog));pigment.addColorStop(.7,colour(s.look===1?1:0,1.3,fog));pigment.addColorStop(1,colour(2,.8,fog));g.strokeStyle=pigment;g.lineWidth=U/720*(.4+(1-fog)*.75);g.globalAlpha=alpha*(.36+(1-fog)*.58);g.stroke();
   // Small illuminated ridge fragments give fine structure without outlining every polygon.
   if(j%3===0){g.strokeStyle=colour(1,1.1,fog);g.lineWidth=U/720*(.7+hit*.9);g.globalAlpha=alpha*(.32+hit*.35)*(1-fog);g.beginPath();let drawing=false;for(let i=0;i<points.length;i++){const h=heights[i],crest=h.y>1.5&&i>0&&i<points.length-1&&h.y>heights[i-1].y&&h.y>=heights[i+1].y;if(crest){const from=points[Math.max(0,i-2)],to=points[Math.min(points.length-1,i+2)];g.moveTo(from[0],from[1]);g.lineTo(points[i][0],points[i][1]);g.lineTo(to[0],to[1]);drawing=true;}}if(drawing)g.stroke();}
  }
  if(m.surface!=='threads'&&m.points>0&&j%2===0){g.fillStyle=colour(2,1.15,fog);g.globalAlpha=alpha*(.6+air*.3)*(1-fog);for(let i=1;i<points.length-1;i++){if(rnd(i,j,seed)>m.points*.65)continue;const q=points[i],r=U/720*(.6+(1-fog)*.8);g.fillRect(q[0],q[1],r,r);}}
 }
 // World-space dust and valley markers share the same camera and move with the ground.
 const count=Math.round(m.particles*270);g.globalCompositeOperation='screen';
 for(let i=0;i<count;i++){const x=(rnd(i,1,seed)-.5)*65,z=far+fract(rnd(i,2,seed)-travel/78)*78,y=terrain(x,z)+.3+rnd(i,3,seed)*3.8,q=cam.project([x,y,z]);if(!q)continue;const fade=C(1-q[2]/85,0,1,0),r=U/720*(.5+fade*.8);g.globalAlpha=alpha*fade*(.25+air*.5);g.fillStyle=colour(i%3,1.2);g.beginPath();g.arc(q[0],q[1],r,0,T);g.fill();}
 g.restore();
}

function render(g,p,t,s,E){if(s.engine==='field'&&normalise(s.scenery).framing==='landscape'&&root.PulseImplicitField?.render(g,p,t,s,E,normalise(s.scenery)))return;if(s.engine==='filament'&&normalise(s.scenery).framing==='landscape')return filamentLandscape(g,p,t,s,E,normalise(s.scenery));const m={...normalise(s.scenery),family:s.engine},landscape=m.framing==='landscape',W=p.width,H=p.height,U=Math.min(W,H),clock=E.travel(p,t,s),sig=E.signals(p,t,s),bass=sig.bass*s.reaction,beat=sig.beat*s.reaction,high=sig.treble*s.reaction,cs=E.colours(p,t,s),rgb=cs.map(c=>[1,3,5].map(k=>parseInt(c.slice(k,k+2),16))),k=hash(m.seed)*20,cam=camera(W,H,m,s.engine==='canopy',s.drift*.13*Math.sin(clock*.13)),light=unit([Math.cos(m.light),1.4,Math.sin(m.light)]),queue=[],base=g.globalAlpha;
 const tint=(role,intensity=1,fog=0,spec=0)=>{const phase=(role%3+3)%3,index=Math.floor(phase),colour=rgb[index].map((v,i)=>mix(v,rgb[(index+1)%3][i],fract(phase)));return 'rgb('+colour.map((v,i)=>Math.round(C(mix(v*intensity+spec*130,[7,13,25][i],fog),0,255,0))).join(',')+')';};
 const face=(v,role,shine=.1,alpha=1,normal=null,normalEnd=null,cornerNormals=null)=>{const q=v.map(cam.project);if(q.some(v=>!v))return;let n=normalEnd?unit(normal.map((v,i)=>v+normalEnd[i])):normal||unit(cross(sub(v[1],v[0]),sub(v[2],v[0])));const center=v[0].map((_,i)=>v.reduce((sum,a)=>sum+a[i],0)/v.length),view=unit(sub(cam.eye,center));if(normal&&dot(n,view)<0)return;if(dot(n,view)<0)n=n.map(x=>-x);const diffuse=Math.max(0,dot(n,light)),half=unit(view.map((x,i)=>x+light[i])),spec=Math.pow(Math.max(0,dot(n,half)),24)*shine,depth=q.reduce((n,v)=>n+v[2],0)/q.length;const shadeEnds=normalEnd?[normal,normalEnd].map(n=>({shade:.23+Math.max(0,dot(n,light))*.79,spec:Math.pow(Math.max(0,dot(n,half)),24)*shine})):null;queue.push({type:'face',q,d:depth,role,shade:.23+diffuse*.79,spec,alpha,shadeEnds,cornerShades:cornerNormals?.map(n=>({shade:.23+Math.max(0,dot(n,light))*.79,spec:Math.pow(Math.max(0,dot(n,half)),24)*shine}))});};
 const line=(v,role,width=1,alpha=1)=>{const q=v.map(cam.project);if(q.some(v=>!v))return;queue.push({type:'line',q,d:q.reduce((n,v)=>n+v[2],0)/q.length,role,width,alpha});};
 const h=(x,z)=>height(x,z,clock,m,s.look,bass)*(landscape&&s.engine==='filament'?1.55:1),extent=landscape?(s.engine==='filament'?22:s.engine==='field'?15:19):(s.engine==='filament'?13:7.7),n=s.engine==='strata'?Math.round(m.detail*1.15):m.detail;
 g.save();g.lineJoin='round';g.lineCap='round';if(!p.transparent){const bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#111827');bg.addColorStop(.6,'#070d19');bg.addColorStop(1,'#030711');g.fillStyle=bg;g.fillRect(0,0,W,H);}
 if(s.engine==='strata'){
  // Continuous contour shelves, vertical cut faces and fine mineral seams.
  // Unlike a quantised height-grid, every terrace has a genuinely flat top.
  const levels=Math.min(32,Math.round(14+m.detail*.4)),segments=Math.round(48+m.detail*1.9),step=.21*m.relief*(1+bass*.045);
  const contour=(level,inner=false)=>{const u=level/levels,base=s.look===2?(inner?.5+m.opening*2+u*3.4:10.2-u*4.6):11.8*(1-Math.pow(u,m.terrain==='spires'?.65:m.terrain==='hills'?1.5:1)*.91),pts=[];
   for(let i=0;i<=segments;i++){const a=i/segments*T+clock*m.travel*.025,fold=Math.sin(a*3+k+u*2+clock*m.morph*.08)*(.2+m.bend)+Math.sin(a*5-k+u)*.32+Math.cos(a*2+.6)*.5,warp=1+fold*(s.look===1?.28:.22),r=base*warp,shift=s.look===1?Math.sin(u*5+k)*1.8:u*u*1.1;
    pts.push([Math.cos(a)*r*(s.look===1?.66:1.15)+shift,level*step+.18,Math.sin(a)*r*(s.look===1?1.45:.85)]);
   }return pts;
  };
  const rings=Array.from({length:levels+1},(_,i)=>contour(i)),inners=s.look===2?Array.from({length:levels+1},(_,i)=>contour(i,true)):null;
  for(let level=0;level<levels;level++){
   const lo=rings[level],hi=rings[level+1],y=lo[0][1],role=.06+level/levels*.32;
   for(let i=0;i<segments;i++){
    const a=lo[i],b=lo[i+1],c=hi[i+1],d=hi[i],c0=[c[0],y,c[2]],d0=[d[0],y,d[2]];
    face([a,b,c0,d0],role,.2);face([d0,c0,c,d],level%9===0?1:level%13===0?2:role,.3);
    if(inners){const il=inners[level],ih=inners[level+1],a=il[i],b=il[i+1],c=ih[i+1],d=ih[i],c0=[c[0],y,c[2]],d0=[d[0],y,d[2]];face([b,a,d0,c0],role,.18);face([c0,d0,d,c],role,.22);}
   }
   if(level%3===0){line(hi,level%9===0?1:0,.5,level%9===0?.75:.28);if(inners)line(inners[level+1],1,.4,.35);}
  }
  const top=rings[levels];if(inners){const inside=inners[levels];for(let i=0;i<segments;i++)face([top[i],top[i+1],inside[i+1],inside[i]],.4,.35);}else face(top,.4,.35);
 }else if(s.engine==='filament'){
  // A multi-scale terrain, drawn with contour threads, sampled points and suspended motes.
  if(m.surface!=='points')for(let j=0;j<=n*2;j++){const z=-extent+j*extent/n,pts=[];for(let i=0;i<=n*3;i++){const x=-extent+i*extent*2/(n*3);pts.push([x,h(x,z),z]);}line(pts,j%14===0?1:(j/(n*2))*1.8,1.35+high*.5,j%14===0?.95:.7);}
  if(m.surface!=='threads'&&m.points>0)for(let j=0;j<=n;j++)for(let i=0;i<=n*2;i++){if(rnd(i,j,k)>m.points)continue;const x=-extent+i*extent/n,z=-extent+j*extent*2/n,v=[x,h(x,z)+.035,z],q=cam.project(v);if(q)queue.push({type:'dot',q,d:q[2],role:(h(x,z)*.22+1)%3,r:(1+high*.7)*U/300,alpha:.65+.35*rnd(i,j,k+2)});}
  for(let i=0;i<Math.round(m.particles*220);i++){const x=(rnd(i,1,k)-.5)*extent*2,z=(rnd(i,2,k)-.5)*extent*2,y=h(x,z)+.4+2*fract(rnd(i,3,k)+clock*m.morph*.025),q=cam.project([x,y,z]);if(q)queue.push({type:'dot',q,d:q[2],role:i%3,r:(.9+beat*.8)*U/300,alpha:.15+.5*rnd(i,4,k)});}
 }else if(s.engine==='field'){
  const cells=Math.max(6,Math.min(12,Math.round(m.detail*.21))),step=extent*2/cells,ground=(x,z)=>h(x,z)*.24,groundSteps=Math.min(34,m.detail),gs=extent*2/groundSteps,groundNormal=(x,z)=>unit([-(ground(x+.05,z)-ground(x-.05,z))/.1,1,-(ground(x,z+.05)-ground(x,z-.05))/.1]),contact=(x,z)=>{const i=Math.floor((x+extent)/gs),j=Math.floor((z+extent)/gs),a=-extent+i*gs,b=-extent+j*gs,u=(x-a)/gs,v=(z-b)/gs;return u>=v?ground(a,b)*(1-u)+ground(a+gs,b)*(u-v)+ground(a+gs,b+gs)*v:ground(a,b)*(1-v)+ground(a+gs,b+gs)*u+ground(a,b+gs)*(v-u);};
  if(m.ground){for(let j=0;j<groundSteps;j++)for(let i=0;i<groundSteps;i++){const x=-extent+i*gs,z=-extent+j*gs;face([[x,ground(x,z)-.13,z],[x+gs,ground(x+gs,z)-.13,z],[x+gs,ground(x+gs,z+gs)-.13,z+gs],[x,ground(x,z+gs)-.13,z+gs]],0,.04,1,groundNormal(x,z),groundNormal(x+gs,z),[groundNormal(x,z),groundNormal(x+gs,z),groundNormal(x+gs,z+gs),groundNormal(x,z+gs)]);}}
  for(let j=0;j<cells;j++)for(let i=0;i<cells;i++){const jitter=s.look===2?1.3:.85,x=-extent+(i+.5+(j%2)*.25+(rnd(i,j,k)-.5)*jitter)*step,z=-extent+(j+.5+(rnd(i,j,k+1)-.5)*jitter)*step,y=contact(x,z)-.15,v=h(x,z)*(1+beat*.1*Math.sin(x*.4+z*.3)**2),r=step*(.35+.4*rnd(i,j,k+2))*m.size,role=(v*.09+(s.look===1?1.1:.08))%3;if(Math.abs(x-Math.sin(z*.19+k)*2.5)<step*(.42+m.opening*.7))continue;
   if(s.look===1){const top=y+.8+v*1.4+beat*.35*Math.max(0,Math.sin(x*.6+z*.3)),sz=step*m.size*.38;face([[x-sz,y,z-sz],[x+sz,y,z-sz],[x+sz,top,z-sz],[x-sz,top,z-sz]],role,.3);face([[x+sz,y,z-sz],[x+sz,y,z+sz],[x+sz,top,z+sz],[x+sz,top,z-sz]],role,.3);face([[x+sz,y,z+sz],[x-sz,y,z+sz],[x-sz,top,z+sz],[x+sz,top,z+sz]],role,.3);face([[x-sz,y,z+sz],[x-sz,y,z-sz],[x-sz,top,z-sz],[x-sz,top,z+sz]],role,.3);face([[x-sz,top,z-sz],[x+sz,top,z-sz],[x+sz,top,z+sz],[x-sz,top,z+sz]],2,.65);line([[x-sz,top+.01,z-sz],[x+sz,top+.01,z-sz]],2,1+beat,1);}
   else{const tall=s.look===0?1.2+v*.85:r*(.6+.65*rnd(i,j,k+3)),profile=Array.from({length:18},(_,q)=>[Math.sin(.23*Math.PI+q/17*.77*Math.PI)**(s.look===0?.55:1)*r,(Math.cos(.23*Math.PI)-Math.cos(.23*Math.PI+q/17*.77*Math.PI))/(1+Math.cos(.23*Math.PI))*tall]),segments=24;
    if(m.ground){const q=cam.project([x,contact(x,z)+.035,z]);if(q)queue.push({type:'shadow',q,d:q[2]+.02,r:r*U*1.5*m.lens/q[2],alpha:.45,role:0});}
    for(let row=0;row<profile.length-1;row++){const [ra,ya]=profile[row],[rb,yb]=profile[row+1],dy=yb-ya,dr=rb-ra;
     for(let side=0;side<segments;side++){const a=side/segments*T,b=(side+1)/segments*T,at=(a+b)/2,vertex=(radius,yy,theta)=>[x+Math.cos(theta)*radius*(s.look===0?.48:1),y+yy,z+Math.sin(theta)*radius*(s.look===0?1.45:1)],normal=unit([Math.cos(a)*dy/(s.look===0?.48:1),-dr,Math.sin(a)*dy/(s.look===0?1.45:1)]),normalEnd=unit([Math.cos(b)*dy/(s.look===0?.48:1),-dr,Math.sin(b)*dy/(s.look===0?1.45:1)]);const normalAt=(row,theta)=>{const a=profile[Math.max(0,row-1)],b=profile[Math.min(profile.length-1,row+1)],dy=b[1]-a[1],dr=b[0]-a[0];return unit([Math.cos(theta)*dy/(s.look===0?.48:1),-dr,Math.sin(theta)*dy/(s.look===0?1.45:1)]);};face([vertex(ra,ya,a),vertex(ra,ya,b),vertex(rb,yb,b),vertex(rb,yb,a)],role,.5,1,normal,normalEnd,[normalAt(row,a),normalAt(row,b),normalAt(row+1,b),normalAt(row+1,a)]);}
    }
   }
  }
 }else{
  // A woven light architecture: volumetric conduits, inset seams and a receding stage.
  const bands=s.look===0?6:s.look===1?8:14,segments=Math.round(18+m.detail*1.4),sides=m.detail<24?6:m.detail<40?8:12,length=54;
  const path=(band,z)=>{const theta=band/bands*T,zz=z+clock*m.travel*1.4,twist=zz*(s.look===0?.12:s.look===1?.035:.075),a=theta+twist*m.bend*2,rad=3.7+m.opening*2+Math.sin(zz*.18+band*.8)*.45+bass*.24;
   if(s.look===1)return [(band%2?1:-1)*(3.8+Math.sin(zz*.14+Math.floor(band/2))*.8),-.2+Math.floor(band/2)*2.1+Math.cos(zz*.16+band)*.65,z];
   return [Math.cos(a)*rad+Math.sin(zz*.11+theta)*.55,3.4+Math.sin(a)*rad*.72+Math.cos(zz*.14+theta)*m.morph*.45,z];
  };
  for(let band=0;band<bands;band++)for(let strand=0;strand<(s.look===0?3:1);strand++){
   const rings=[],normals=[],role=band%3;
   for(let j=0;j<=segments;j++){const z=10-j/segments*length,c=path(band,z),tangent=unit(sub(path(band,z-.05),path(band,z+.05))),right=unit(cross(tangent,[0,1,0])),up=unit(cross(right,tangent)),angle=z*.08+band*.7,rx=(s.look===1?.85:s.look===2?.13:.095)*m.size,ry=(s.look===1?.12:rx),ring=[],ns=[];if(s.look===0){const braid=z*.95+strand/3*T,offset=.25*m.size;for(let i=0;i<3;i++)c[i]+=right[i]*Math.cos(braid)*offset+up[i]*Math.sin(braid)*offset;}
    for(let side=0;side<=sides;side++){const a=side/sides*T+angle,dx=Math.cos(a)*rx,dy=Math.sin(a)*ry;ring.push(c.map((v,i)=>v+right[i]*dx+up[i]*dy));ns.push(unit(right.map((v,i)=>v*Math.cos(a)/rx+up[i]*Math.sin(a)/ry)));}rings.push(ring);normals.push(ns);
   }
   for(let j=0;j<segments;j++)for(let side=0;side<sides;side++){face([rings[j][side],rings[j][side+1],rings[j+1][side+1],rings[j+1][side]],role,.85,1,normals[j][side],normals[j][side+1]);}
   // Longitudinal inlays and short travelling highlights reveal the curvature.
   for(const side of (s.look===1?Array.from({length:sides},(_,i)=>i):[0,Math.floor(sides/3),Math.floor(sides*2/3)])){line(rings.map(r=>r[side]),role,.6,.4);for(let j=0;j<segments;j++){const z=10-j/segments*length,pulse=Math.exp(-Math.pow((fract((z+clock*m.travel*5)/15)-.5)*7,2));if(pulse>.4)line([rings[j][side],rings[j+1][side]],(role+1)%3,1.4,.35+pulse*(.45+beat*.3));}}
  }
  // Cross-lacing establishes scale and makes the passage read as built structure.
  for(let j=0;j<20;j++){const z=8-j*2.6,pts=[];for(let band=0;band<=bands;band++){const v=path(band%bands,z);pts.push(v);}line(pts,s.look===2?1:0,.65,.18+high*.12);}
  if(m.ground){for(let lane=-3;lane<=3;lane++){const pts=[];for(let j=0;j<=65;j++){const z=10-j*.9;pts.push([lane*1.1,-1.2,z]);}line(pts,0,.5,.12);}for(let j=0;j<14;j++){const z=10-fract(j/14+clock*m.travel*.014)*54;line([[-4,-1.2,z],[4,-1.2,z]],1,.6,.12);}}
 }
 if(['strata','canopy','field'].includes(s.engine)&&root.PulseScenerySurface?.render(g,W,H,queue,tint)){g.restore();return;}
 queue.sort((a,b)=>b.d-a.d);for(const item of queue){const fog=C((item.d-18)/26,0,1,0);g.globalAlpha=base*(item.alpha??1);
  if(item.type==='face'){g.fillStyle=tint(item.role,item.shade,fog,item.spec);if(item.shadeEnds&&(Math.abs(item.shadeEnds[0].shade-item.shadeEnds[1].shade)+Math.abs(item.shadeEnds[0].spec-item.shadeEnds[1].spec)>.055)&&Math.hypot(item.q[0][0]-item.q[1][0],item.q[0][1]-item.q[1][1])>.01){const gradient=g.createLinearGradient(item.q[0][0],item.q[0][1],item.q[1][0],item.q[1][1]);item.shadeEnds.forEach((v,i)=>gradient.addColorStop(i,tint(item.role,v.shade,fog,v.spec)));g.fillStyle=gradient;}g.beginPath();item.q.forEach((v,i)=>i?g.lineTo(v[0],v[1]):g.moveTo(v[0],v[1]));g.closePath();g.fill();g.strokeStyle=g.fillStyle;g.lineWidth=.65*U/540;g.stroke();}
  else if(item.type==='line'){g.strokeStyle=tint(item.role,1,fog);g.lineWidth=item.width*U/540;g.beginPath();item.q.forEach((v,i)=>i?g.lineTo(v[0],v[1]):g.moveTo(v[0],v[1]));if(s.engine==='filament'&&s.glow>0){g.globalAlpha=base*item.alpha*s.glow*.12;g.lineWidth=item.width*U/540*3.5;g.stroke();g.globalAlpha=base*item.alpha;g.lineWidth=item.width*U/540;}g.stroke();}
  else if(item.type==='dot'){g.fillStyle=tint(item.role,1.25,fog);g.beginPath();g.arc(item.q[0],item.q[1],Math.max(.2,item.r),0,T);g.fill();}
  else if(item.type==='shadow'){g.fillStyle='#01040a';g.beginPath();g.ellipse(item.q[0],item.q[1],item.r*1.15,item.r*.45,0,0,T);g.fill();}

 }
 g.restore();
}
const api={families,looks,normalise,height,camera,render};if(typeof module!=='undefined')module.exports=api;else root.PulseScenery=api;
})(typeof globalThis!=='undefined'?globalThis:this);
