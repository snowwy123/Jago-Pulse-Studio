// SPDX-License-Identifier: MIT
// Original perspective road: world-anchored segments, independent surface waves and camera travel.
(function(root){'use strict';const C=(v,a,b,f)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:f));
function normalise(v={}){return{bend:C(v.bend,0,1,.45),hills:C(v.hills,0,1,.35),waves:C(v.waves,0,1,.15),waveSpeed:C(v.waveSpeed,-2,2,.6),cameraHeight:C(v.cameraHeight,.6,4,1.45),bank:C(v.bank,0,1,.3),pulseSpeed:C(v.pulseSpeed,-3,3,1),pulseSpacing:C(v.pulseSpacing,8,60,24),lanes:Math.round(C(v.lanes,2,6,4)),travel:['drive','hover','still'].includes(v.travel)?v.travel:'drive',scenery:v.scenery!==false,perspective:['follow','fixed','wander'].includes(v.perspective)?v.perspective:'follow',horizon:C(v.horizon,.22,.65,.4),viewWidth:C(v.viewWidth,.5,1.6,1),sceneryDensity:C(v.sceneryDensity,0,1,.6),pulseStrength:C(v.pulseStrength,0,2,1),stars:v.stars!==false};}
function centre(z,r){return(Math.sin(z*.011)*12+Math.sin(z*.0047+1)*19)*r.bend;}
function height(z,t,r){return(Math.sin(z*.017)*4+Math.sin(z*.0061)*7)*r.hills+Math.sin(z*.15-t*r.waveSpeed*2)*r.waves*.8;}
function render(g,p,t,s,E){const audioTime=t;t=E.motionTime(p,t,s);const r=normalise(s.road),W=p.width,H=p.height,a=E.signals(p,audioTime,s),cs=E.colours(p,audioTime,s),distance=r.travel==='still'?0:E.travel(p,audioTime,s)*14,camZ=distance,camX=centre(camZ,r),camY=height(camZ,t,r)+r.cameraHeight,yaw=Math.atan((centre(camZ+1,r)-centre(camZ-1,r))*.5),slope=(height(camZ+2,t,r)-height(camZ-2,t,r))*.25,roll=-(centre(camZ+8,r)-2*centre(camZ,r)+centre(camZ-8,r))*.05*r.bank,travelSway=r.travel==='hover'?Math.sin(t*.4)*.22:0,cx=W*(.5+(r.perspective==='fixed'?0:Math.sin(t*.15)*s.drift*(r.perspective==='wander'?.16:.06))),cy=H*(r.horizon+(r.perspective==='fixed'?0:Math.sin(t*.11)*s.drift*.035)),f=Math.min(W*.9,H*1.25)/r.viewWidth,half=r.lanes*.72;
const project=(x,y,z)=>{const dx=x-camX-travelSway,dz=z-camZ,X=Math.cos(yaw)*dx-Math.sin(yaw)*dz,Z=Math.max(.8,Math.sin(yaw)*dx+Math.cos(yaw)*dz),Y=camY-y+slope*dz;return[cx+(X*Math.cos(roll)-Y*Math.sin(roll))*f/Z,cy+(X*Math.sin(roll)+Y*Math.cos(roll))*f/Z];};
const point=(u,z,up=0)=>project(centre(z,r)+u,height(z,t,r)+up,z),alpha=g.globalAlpha??1,line=(pts,c,w=1,fade=1)=>{g.globalAlpha=alpha*fade;g.strokeStyle=c;g.lineWidth=w;g.beginPath();pts.forEach((v,i)=>i?g.lineTo(...v):g.moveTo(...v));g.stroke();},poly=(pts,c,fade=1)=>{g.globalAlpha=alpha*fade;g.fillStyle=c;g.beginPath();pts.forEach((v,i)=>i?g.lineTo(...v):g.moveTo(...v));g.closePath?.();g.fill?.();};g.save();
if(!p.transparent){const bg=g.createLinearGradient?.(0,0,0,H);if(bg){bg.addColorStop(0,s.look===2?'#110927':'#030614');bg.addColorStop(.65,s.look===2?'#67205d':'#10172f');bg.addColorStop(1,'#02030a');}g.fillStyle=bg||'#080b20';g.fillRect(0,0,W,H);}
if(r.scenery&&s.look===2){g.save();g.globalAlpha=alpha*.9;const radius=Math.min(W,H)*.16,sunY=H*.28;g.beginPath();g.arc?.(W*.5,sunY,radius,0,Math.PI*2);g.clip?.();const sun=g.createLinearGradient?.(0,sunY-radius,0,sunY+radius);if(sun){sun.addColorStop(0,'#ffd275');sun.addColorStop(1,'#f328b0');}g.fillStyle=sun||cs[1];g.fillRect(W*.5-radius,sunY-radius,radius*2,radius*2);g.fillStyle='#421346';for(let i=0;i<7;i++)g.fillRect(W*.5-radius,sunY+i*radius*.14,radius*2,2+i);g.restore();}

if(r.scenery&&s.look===2){
 // A quiet sky and coast establish depth before road geometry and near silhouettes.
 g.save();g.shadowBlur=0;const hash=n=>{let q=Math.sin(n*127.17+31.4)*43758.54;return q-Math.floor(q);};
 for(let i=0;i<(r.stars?65:0);i++){const x=hash(i+7)*W,y=hash(i+311)*H*.31;if(Math.hypot(x-W*.5,y-H*.28)<Math.min(W,H)*.19)continue;g.globalAlpha=alpha*(.15+hash(i+18)*.45);g.fillStyle=i%4? '#ac9bdb':'#d9caef';g.fillRect(x,y,hash(i+7)>.8?1.4:.8,.8);}
 const horizon=H*.43;g.globalAlpha=alpha;const ocean=g.createLinearGradient?.(0,horizon,0,H);if(ocean){ocean.addColorStop(0,'#57234f');ocean.addColorStop(.35,'#18102d');ocean.addColorStop(1,'#080715');}g.fillStyle=ocean||'#18102d';g.fillRect(0,horizon,W,H-horizon);
 for(let i=0;i<14;i++){let y=horizon+Math.pow(i/13,2)*H*.18;line([[0,y],[W,y]],cs[1],.5,.035+(1-i/14)*.06);}
 const ridge=[];for(let i=0;i<=30;i++){let x=i/30*W,peak=(.5+.5*Math.sin(i*.62+1))*(.5+.5*Math.sin(i*1.13));ridge.push([x,horizon-peak*H*.08]);}poly([[0,horizon+5],...ridge,[W,horizon+5]],'#21102e',.7);
 // Distant shore is asymmetric so scenery does not read as a mirrored tunnel.
 poly([[W*.66,horizon],[W*.8,horizon-H*.07],[W*.9,horizon-H*.045],[W,horizon-H*.12],[W,H],[W*.8,H]],'#160d26',.75);
 g.restore();
}

if(r.scenery&&s.look!==2&&!p.transparent){g.save();g.shadowBlur=0;
 if(s.look===1){const moon=[W*.73,H*.17],rad=Math.min(W,H)*.045;g.globalAlpha=alpha*.6;g.fillStyle='#bac9e0';g.beginPath();g.arc?.(...moon,rad,0,Math.PI*2);g.fill?.();for(let i=0;i<36;i++){const x=i/35*W,y=H*.44,h=H*(.035+((i*19)%23)/120);poly([[x,y],[x,y-h],[x+W*.023,y-h],[x+W*.023,y]],i%2?'#111b32':'#152039',.85);}}
 else if(s.look===3){for(let ridge=4;ridge>=0;ridge--){const pts=[];for(let i=0;i<=70;i++)pts.push([i/70*W,H*(.4+ridge*.035)+Math.sin(i*.09+ridge+t*s.speed*.03)*H*.06]);poly([[0,H],...pts,[W,H]],['#142b3b','#17283b','#1d243e','#21203a','#27203c'][ridge],.7);line(pts,cs[ridge%3],1,.12);}}
 else{for(let k=0;k<18;k++){const x=k/17*W,shift=Math.sin(k*17.1)*H*.02;line([[x,H*.45],[x,H*.35+shift]],cs[k%3],1,.15);}}
 g.restore();
}
g.shadowColor=cs[0];g.shadowBlur=s.glow*Math.min(W,H)*.016;
function palm(x,z,index,side,fade){
 const hash=n=>{let q=Math.sin(n*93.13+index*71.7+side*7)*18217.13;return q-Math.floor(q);},h=4.3+hash(9)*3.1,lean=(hash(4)-.5)*1.5,wind=Math.sin(t*.65+index)*.07,base=point(x,z),top=point(x+lean,z,h),screenH=Math.max(1,Math.hypot(base[0]-top[0],base[1]-top[1]));
 g.save();g.shadowBlur=0;const trunk=[];for(let k=0;k<=10;k++){let u=k/10;trunk.push(point(x+lean*u*u-.105*(1-u*.72),z,h*u));}for(let k=10;k>=0;k--){let u=k/10;trunk.push(point(x+lean*u*u+.105*(1-u*.72),z,h*u));}poly(trunk,'#0a0717',fade);
 // Thin reflected light on one trunk edge, not a neon outline around the tree.
 const edge=[];for(let k=0;k<=10;k++){let u=k/10;edge.push(point(x+lean*u*u+.1*(1-u*.72),z,h*u));}line(edge,cs[1],Math.max(.45,screenH*.004),fade*.25);
 for(let j=0;j<9;j++){const angle=j/9*Math.PI*2+hash(20)*.5,dx=Math.cos(angle),dz=Math.sin(angle)*.6,len=1.65+hash(j+37)*1.3,rise=.75+hash(j+60)*.6,curve=u=>point(x+lean+dx*len*u,z+dz*len*u,h+Math.sin(u*Math.PI*.9)*rise-u*u*(.8+hash(j+80)) +wind*u),points=[];for(let k=0;k<=12;k++)points.push(curve(k/12));line(points,'#0a0717',Math.max(.7,screenH*.018),fade);
  if(screenH>18)for(let k=2;k<11;k++){const u=k/12,q=curve(u),tip=point(x+lean+dx*(len*u+.15),z+dz*len*u,h+Math.sin(u*Math.PI*.9)*rise-u*u*(.8+hash(j+80))-.18-Math.sin(u*Math.PI)*.35);line([q,tip],'#0a0717',Math.max(.55,screenH*.008),fade);}
  if(j%3===0)line(points,cs[1],Math.max(.4,screenH*.004),fade*.25);
 }g.restore();
}

function building(x,z,index,side,fade){
 const rnd=n=>{let q=Math.sin(index*73.71+side*19.2+n*127.1)*43758.5453;return q-Math.floor(q);},kind=Math.floor(rnd(1)*6),high=kind===5?2.5+rnd(2)*3:5+rnd(2)*13,wide=.7+rnd(3)*1.1,deep=1.5+rnd(4)*3,angle=(rnd(5)-.5)*.65,c=Math.cos(angle),sn=Math.sin(angle),at=(u,v,h)=>point(x+c*u+sn*v,z-sn*u+c*v,h),inner=side===1?-1:1;
 const block=(width,depth,bottom,top,slope=0)=>{const corners=[at(-width,0,bottom),at(width,0,bottom),at(width,0,top+slope),at(-width,0,top-slope)],sideFace=[at(inner*width,0,bottom),at(inner*width,depth,bottom),at(inner*width,depth,top+inner*slope),at(inner*width,0,top+inner*slope)];poly(sideFace,'#15253b',fade);poly(corners,kind===5?'#1a2334':'#0c172b',fade);poly([at(-width,0,top-slope),at(width,0,top+slope),at(width,depth,top+slope),at(-width,depth,top-slope)],'#26334a',fade);line(corners.concat([corners[0]]),cs[kind%3],.75,fade*.32);
  const columns=kind===0?5:3;for(let floor=1;floor<(top-bottom)/1.05;floor++){let h=bottom+floor*1.05;for(let col=0;col<columns;col++){if(rnd(floor*37+col*7)<.32)continue;const u=-width*.8+col*(width*1.6/columns);line([at(u,0,h),at(u+width*1.1/columns,0,h)],kind===0?cs[0]:floor%4===0?cs[1]:'#b8c3ae',kind===0?.75:1.5,fade*(.25+rnd(floor+col)*.4));}if(kind===0)line([at(-width,0,h),at(width,0,h)],'#46708a',.6,fade*.3);}
 };
 g.save();g.shadowBlur=0;
 if(kind===1){block(wide*1.2,deep,0,high*.43);block(wide*.83,deep*.8,high*.43,high*.75);block(wide*.52,deep*.6,high*.75,high);}
 else if(kind===2)block(wide,deep,0,high,high*.13);
 else if(kind===3){block(wide*1.25,deep,0,2);for(const offset of [-wide*.6,wide*.6]){const corners=[at(offset-wide*.37,0,2),at(offset+wide*.37,0,2),at(offset+wide*.37,0,high),at(offset-wide*.37,0,high)];poly(corners,'#14263a',fade);line(corners.concat([corners[0]]),cs[0],1,fade*.5);for(let h=3;h<high;h+=1.1)line([at(offset-wide*.23,0,h),at(offset+wide*.23,0,h)],cs[2],1,fade*.4);}line([at(-wide*.6,0,high*.6),at(wide*.6,0,high*.6)],cs[1],2,fade*.5);}
 else{block(wide,deep,0,high);if(kind===4){poly([at(-wide*.7,deep*.4,high),at(wide*.7,deep*.4,high),at(0,deep*.4,high+2.7)],'#34415a',fade);line([at(0,deep*.4,high+2.5),at(0,deep*.4,high+4)],cs[1],1,fade*.6);}}
 if(kind===5){line([at(-wide*.8,0,high*.55),at(wide*.8,0,high*.55)],cs[1],3,fade*.65);for(let k=0;k<3;k++)line([at(-wide*.6+k*wide*.5,0,.2),at(-wide*.6+k*wide*.5,0,1.5)],'#819095',1.5,fade*.4);}
 g.restore();
}

const segment=3,total=Math.round(46+s.density*30),first=Math.floor((camZ+2)/segment),pulseHead=E.travel(p,t,{...s,speed:1})*r.pulseSpeed*18;
for(let j=total;j>=0;j--){const index=first+j,z=index*segment,z2=z+segment;if(z2-camZ<2)continue;const fade=Math.min(1,Math.max(.03,1-(z-camZ)/240)),phase=((z-pulseHead)%r.pulseSpacing+r.pulseSpacing)%r.pulseSpacing/r.pulseSpacing,pulse=Math.exp(-Math.pow(Math.min(phase,1-phase)*12,2))*r.pulseStrength,boost=.2+s.reaction*(a.beat*.5+a.bass*.5),roadColour=s.look===2?'#160d26':'#070e1c';

if(r.scenery&&s.look!==2){g.shadowBlur=0;
 for(const side of [-1,1]){
 const outside=side*(half+26),near=side*half,raised=side*(half+9),lift=s.look===3?1.3+Math.sin(z*.075)*1.1:.06;
 poly([point(near,z),point(outside,z,lift),point(outside,z2,lift),point(near,z2)],s.look===1?'#0b1020':s.look===3?'#152335':'#081721',fade);
 if(s.look===0){poly([point(side*(half+.6),z),point(side*(half+.6),z,1),point(side*(half+.6),z2,1),point(side*(half+.6),z2)],'#0b2330',fade);line([point(side*(half+.6),z,1),point(side*(half+.6),z2,1)],cs[0],1.5,fade*.7);if(index%2===0)line([point(side*(half+.6),z,.15),point(side*(half+.6),z,.85)],cs[index%3],2,fade*.7);}
 if(s.look===3){line([point(near,z),point(raised,z,lift*.5),point(outside,z,lift)],cs[index%3],.8,fade*.28);line([point(raised,z,lift*.5),point(raised,z2,lift*.5)],cs[0],1,fade*.3);}
 if(s.look===1){line([point(side*(half+1.2),z,.12),point(side*(half+1.2),z2,.12)],'#3d4961',1,fade*.7);if(index%12<2)for(let k=0;k<5;k++)line([point(side*(half+1.5+k*.5),z,.15),point(side*(half+1.5+k*.5),z2,.15)],'#7c93a3',1,fade*.3);}
 }g.shadowBlur=s.glow*Math.min(W,H)*.016;
}
if(r.scenery&&s.look===2){
 // Ground shares the road's world coordinates: palms now stand on passing land.
 const shore=q=>-half-9-Math.sin(q*.025)*2.5,ground=(u,q)=>point(u,q,u<0?Math.max(-1,(u+half)*.075):u>half+7?(u-half-7)*(.12+.1*Math.sin(q*.035)):.02),edge=shore(z),edge2=shore(z2);
 g.shadowBlur=0;
 poly([ground(-half,z),ground(edge,z),ground(edge2,z2),ground(-half,z2)],'#613351',fade);
 poly([ground(-half,z),ground(-half-1.1,z),ground(-half-1.1,z2),ground(-half,z2)],'#38213c',fade);
 poly([ground(edge,z),ground(edge-70,z),ground(edge2-70,z2),ground(edge2,z2)],'#182b43',fade);
 // Bright foam follows the actual coastline, with a second broken offshore crest.
 line([ground(edge,z),ground(edge2,z2)],'#b073a4',1.1,fade*.6);
 if(index%4<2)line([ground(edge-1.8,z),ground(edge2-1.8,z2)],'#699eb4',.8,fade*.45);
 if(index%7===0)line([ground(edge-6,z),ground(edge2-16,z2)],'#995583',1,fade*.3);
 const bands=[half,half+1.1,half+7,half+15,half+30,half+60],tones=['#38213c','#55304f','#422345','#301a3b','#20132e'];
 for(let k=0;k<bands.length-1;k++)poly([ground(bands[k],z),ground(bands[k+1],z),ground(bands[k+1],z2),ground(bands[k],z2)],tones[k],fade);
 if(index%3===0)line([ground(half+7,z),ground(half+15,z),ground(half+30,z),ground(half+60,z)],'#934968',.65,fade*.22);
 // Small roadside lights and shoulder seams reinforce travel without filling the scene with a grid.
 for(const side of [-1,1]){line([point(side*(half+.65),z,.04),point(side*(half+.65),z2,.04)],'#9d527a',.7,fade*.5);if(index%5===1){const q=point(side*(half+.65),z,.05);g.globalAlpha=alpha*fade*.8;g.fillStyle=cs[2];g.fillRect(q[0]-1,q[1]-1,2,2);}}
 g.shadowBlur=s.glow*Math.min(W,H)*.016;
}
poly([point(-half,z),point(half,z),point(half,z2),point(-half,z2)],roadColour,fade);if(pulse>.15)poly([point(-half,z),point(half,z),point(half,z2),point(-half,z2)],cs[1],fade*pulse*(.08+boost*.22));for(let lane=0;lane<=r.lanes;lane++){let u=-half+lane*half*2/r.lanes;const edge=lane===0||lane===r.lanes;if(edge||index%3!==0)line([point(u,z),point(u,z2)],cs[edge?0:2],edge?2:1,fade*(edge?.85:.35));}if(index%(s.look===2?4:2)===0)line([point(-half,z),point(half,z)],cs[1],1+pulse*2,fade*((s.look===2?.035:.18)+pulse*.35));
if(r.scenery&&r.sceneryDensity>0&&(index%Math.max(2,Math.round(10-r.sceneryDensity*8))===0||s.look===1&&index%7===0))for(const side of [-1,1]){if(s.look===1&&(side===-1?index%5!==0:index%7!==0))continue;const x=side*(half+1.8+(index%3)*.6),base=point(x,z),top=point(x,z,5+Math.sin(index)*.7);if(s.look===2){const jitter=Math.sin(index*17.31+side)*2.4;palm(x+side*Math.abs(jitter)*.3,z+jitter,index,side,fade);}else if(s.look===1){building(x+side*Math.abs(Math.sin(index*1.7))*1.7,z,index,side,fade);if(index%3===0)building(x+side*5,z+2,index+17,side,fade*.7);}else{line([base,top],cs[0],2,fade*.6);line([top,point(x-side*.6,z,5)],cs[1],2,fade);}}
if(r.scenery&&index%8===0){for(const side of [-1,1]){const x=side*(half+.3);line([point(x,z,.05),point(x,z,.65)],'#738b9d',1,fade*.5);line([point(x,z,.65),point(x,z,.8)],cs[2],2,fade*.85);}}
if(r.scenery&&s.look===0&&index%24===0){for(const side of [-1,1])line([point(side*(half+1),z),point(side*(half+1),z,4.2)],cs[0],2,fade*.7);line([point(-half-1,z,4.2),point(half+1,z,4.2)],cs[1],2,fade*.7);for(let k=-2;k<=2;k++)line([point(k*.6,z,4.2),point(k*.6,z,3.85)],cs[2],2,fade*.8);}
}g.restore();}
const presets=[{bend:.4,hills:.2,waves:.05,bank:.35},{bend:.22,hills:.12,waves:0,bank:.12},{bend:.3,hills:.15,waves:.05,bank:.15},{bend:.55,hills:.55,waves:.75,waveSpeed:.8,bank:.5}];const api={normalise,centre,height,render,presets};if(typeof module!=='undefined')module.exports=api;else root.PulseRoad=api;
})(typeof globalThis!=='undefined'?globalThis:this);
