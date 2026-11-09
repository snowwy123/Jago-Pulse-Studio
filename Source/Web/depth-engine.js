// SPDX-License-Identifier: MIT
// Original world-anchored depth families. Coordinates are sampled directly from the composition clock.
(function(root){'use strict';
const mix=(a,b,t)=>'#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');
const TAU=Math.PI*2,mod=(a,b)=>(a%b+b)%b,hash=n=>{const q=Math.sin(n*127.13+9.7)*43758.5453;return q-Math.floor(q);};
function render(g,p,t,s,E){const W=p.width,H=p.height,cs=E.colours(p,t,s),a=E.signals(p,t,s),clock=E.travel(p,t,s),beat=s.reaction*(a.bass*.65+a.beat*.35),seed=String(p.seed||'pulse').split('').reduce((n,c)=>n+c.charCodeAt(0),0),alpha=g.globalAlpha??1;
g.save();g.lineJoin='round';g.lineCap='round';if(!p.transparent){const bg=g.createLinearGradient?.(0,0,0,H);if(bg){bg.addColorStop(0,'#030613');bg.addColorStop(.55,s.engine==='terrain'?'#17213c':'#0c1024');bg.addColorStop(1,'#02050c');}g.fillStyle=bg||'#040810';g.fillRect(0,0,W,H);}
const ink=c=>mix(c,'#02030a',.975),shade=(c,v)=>mix(ink(c),c,v);
const cx=W*(.5+Math.sin(clock*.12)*s.drift*.12),cy=H*(s.engine==='terrain'?.37:.5)+Math.cos(clock*.09)*H*s.drift*.07,f=Math.min(W*.9,H*1.12),project=(x,y,z)=>[cx+x*f/Math.max(.65,z),cy+y*f/Math.max(.65,z)],line=(pts,c,w=1,fade=1)=>{g.globalAlpha=alpha*Math.max(0,Math.min(1,fade));g.strokeStyle=c;g.lineWidth=w;g.beginPath();pts.forEach((v,i)=>i?g.lineTo(...v):g.moveTo(...v));g.stroke();},poly=(pts,c,fade=1)=>{const blur=g.shadowBlur;g.shadowBlur=0;g.globalAlpha=alpha*Math.max(0,Math.min(1,fade));g.fillStyle=c;g.beginPath();pts.forEach((v,i)=>i?g.lineTo(...v):g.moveTo(...v));g.closePath?.();g.fill?.();g.shadowBlur=blur;};g.shadowColor=cs[0];g.shadowBlur=s.glow*Math.min(W,H)*.012;
if(s.engine==='tunnel'){
 const distance=clock*7,spacing=1.8,first=Math.floor(distance/spacing),count=Math.round(24+s.density*24),sides=s.look===1?6:64;
 const centre=z=>[Math.sin(z*.045)*s.distortion*1.5,Math.cos(z*.031)*s.distortion*.8],camera=centre(distance),shape=(theta,z)=>{const depth=z-distance,c=centre(z),r=2.2+Math.sin(z*.17-clock*.22)*s.distortion*.25+Math.sin(z*.33-t*1.5)*beat*.12,twist=s.distortion*Math.sin(z*.035)*.45;return project(c[0]-camera[0]+Math.cos(theta+twist)*r,c[1]-camera[1]+Math.sin(theta+twist)*r,depth);};
 // Rails connect ribs and make forward motion read as an inhabited structure.
 for(let k=0;k<(s.look===1?6:12);k++){const pts=[];for(let j=2;j<=75;j+=1.2)pts.push(shape(k/(s.look===1?6:12)*TAU,distance+j));line(pts,cs[k%3],s.look===1?1.5:.7,s.look===2?.13:.26);}
 for(let j=count;j>=1;j--){const index=first+j,z=index*spacing,d=z-distance;if(d<.8)continue;const fade=Math.min(1,d/2)*Math.exp(-d/48),pulse=Math.exp(-Math.pow(mod(index-clock*.8,9)-4.5,2)*.7),radiusWidth=Math.min(5,Math.max(.65,9/d));
  if(s.look!==2){const panels=s.look===1?6:12;for(let k=0;k<panels;k++){const theta=k/panels*TAU,next=(k+1)/panels*TAU;if(s.look===1||index%4!==0)poly([shape(theta,z),shape(next,z),shape(next,z+spacing),shape(theta,z+spacing)],shade(cs[k%3],.01+.012*(.5+.5*Math.cos(k/panels*TAU-.7))),fade*(s.surface==='wire'?.12:.5));if((k+index)%3===0){const inset=.07,barZ=z+.25;line([shape(theta+inset,barZ),shape(next-inset,barZ)],cs[1],Math.max(.4,2.8/d),fade*(.2+pulse*.4));}if(d<22&&index%2===0){line([shape(theta+.035,z+.18),shape(theta+.035,z+spacing-.18)],shade(cs[k%3],.28),Math.max(.35,2/d),fade*.28);}}}
  if(s.look===2){for(let band=0;band<3;band++){const pts=[];for(let k=0;k<=40;k++){const angle=k/40*TAU,shift=Math.sin(angle*3+index*.15-clock*.12)*.1;pts.push(shape(angle,z+band*.15+shift));}line(pts,cs[(index+band)%3],radiusWidth*(band===1?2:1),fade*(.12+pulse*.28));}}
  else{const pts=[];for(let k=0;k<=sides;k++)pts.push(shape(k/sides*TAU,z));line(pts,cs[index%3],radiusWidth*(1+beat*.35),fade*(.7+pulse*.3));if(index%4===0){for(let k=0;k<(s.look===1?6:8);k++){const angle=k/(s.look===1?6:8)*TAU,pt=shape(angle,z),next=shape(angle,z+.55);line([pt,next],cs[2],Math.min(4,8/d),fade*.8);}}}
 }
}else if(s.engine==='terrain'){
 const distance=clock*4,step=1.25,first=Math.floor(distance/step),rows=Math.round(27+s.density*22),cols=40;
 const elevation=(x,z)=>{const valley=Math.exp(-x*x*.08),rough=Math.sin(x*.53+z*.17)*Math.cos(x*.27-z*.083)+.45*Math.sin(x*1.1+z*.31),wave=Math.sin(z*.4-t*1.4+x*.15)*beat*.35;let h=(1-valley)*2.5+rough*(.45+s.distortion*1.8)+wave;return s.look===2?Math.round(h*3)/3:h;},pt=(k,z)=>{const x=k*.6;return project(x,3.6-elevation(x,z),z-distance);};
 // Filled, shaded surfaces provide depth; contours remain crisp above them.
 for(let j=rows;j>=1;j--){const z=(first+j)*step,d=z-distance;if(d<1)continue;const pts=[];for(let k=-cols;k<=cols;k++)pts.push(pt(k,z));const fade=Math.exp(-d/62)*Math.min(1,d/2);
  if(s.look===1){poly([[0,H],...pts,[W,H]],shade(cs[1],.04+.035*Math.sin(z*.15)),fade*.95);line(pts,cs[j%3],1.2,fade*(.35+beat*.2));}
  else{if(s.surface==='wire'){for(let k=-cols;k<cols;k++)poly([pt(k,z),pt(k+1,z),pt(k+1,z+step),pt(k,z+step)],shade(cs[0],.025),fade);}else{const back=[];for(let k=cols;k>=-cols;k--)back.push(pt(k,z+step));const light=g.createLinearGradient?.(0,0,W,0)||shade(cs[0],.2);if(light.addColorStop){light.addColorStop(0,shade(cs[0],.28));light.addColorStop(.38,shade(cs[1],.12));light.addColorStop(.7,shade(cs[0],.18));light.addColorStop(1,shade(cs[2],.24));}poly([...pts,...back],light,fade);}line(pts,cs[j%3],s.look===2?1:.75,fade*(s.surface==='wire'?.5:.26));if((s.surface==='wire'||s.look===2)&&j%3===0)for(let k=-cols;k<=cols;k+=4)line([pt(k,z),pt(k,z+step)],cs[0],.65,fade*.16);}
 }
 if(s.look===1){g.shadowBlur=0;for(let curtain=0;curtain<4;curtain++){const pts=[];for(let k=0;k<=100;k++){let x=k/100*W,y=H*(.14+curtain*.045)+Math.sin(k*.07+clock*.12+curtain)*H*.045+Math.sin(k*.17-clock*.08)*H*.012;pts.push([x,y]);}line(pts,cs[curtain%3],2+curtain*2,.045+s.glow*.05);}}
}else{
 if(!p.transparent){g.save();g.shadowBlur=0;for(let cloud=0;cloud<4;cloud++){const x=W*(.15+cloud*.24)+Math.sin(clock*.025+cloud)*W*.045,y=H*(.28+.13*Math.sin(cloud*2+seed)),r=Math.min(W,H)*(.4+cloud*.12),q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,cs[cloud%3]);q.addColorStop(1,'transparent');g.fillStyle=q;g.globalAlpha=alpha*(s.look===1?.035:.045);g.fillRect(x-r,y-r,r*2,r*2);}g.restore();}
 const distance=clock*9,spacing=.24,first=Math.floor(distance/spacing),count=Math.round(160+s.density*400),depth=spacing*count;
 // Cell indices determine placement; the camera travels through a stable seeded volume.
 for(let j=count;j>=0;j--)for(let slot=0;slot<(s.look===1?5:4);slot++){const index=(first+j)*7+slot,z=(first+j)*spacing+hash(index+97)*spacing,d=z-distance;if(d<.8)continue;const q=hash(index+seed),angle=hash(index*3+seed)*TAU,r=1+Math.sqrt(hash(index*11+seed))*17,turn=s.look===2?z*.085+Math.sin(t*.2)*s.distortion:0;
 let x=Math.cos(angle+turn)*r,y=Math.sin(angle+turn)*r;x+=Math.sin(z*.11)*s.distortion*.8;y+=Math.cos(z*.09)*s.distortion*.6;if(s.look===1){x=(q-.5)*50;y=(hash(index*7+seed)-.5)*35+mod(t*.8+q*3,3)-1.5;}if(s.look===2){const strand=index%4,theta=strand*TAU/4+z*.12+clock*.16;x=Math.cos(theta)*(2.3+Math.sin(z*.2)*.7);y=Math.sin(theta)*(2.3+Math.sin(z*.2)*.7);}
 const pt=project(x,y,d),fade=Math.min(1,d/2)*Math.min(1,(depth-d)/12)*Math.exp(-d/100),size=Math.max(.45,Math.min(6,f/d*(.008+hash(index*13)*.023))),tail=project(x,y,d+.2+s.trails*(s.look===2?1.3:2.6)),colour=cs[index%3];
 if(s.look===1){line([[pt[0],pt[1]-size*2.5],pt],colour,Math.max(.7,size*.4),fade*.8);if(q>.8)line([[pt[0]-size,pt[1]],[pt[0]+size,pt[1]]],colour,.7,fade*.5);}
 else{line([tail,pt],colour,Math.max(.7,size*.4),fade*(.5+beat*.3));if(q>.87||s.look===2)poly([[pt[0],pt[1]-size],[pt[0]+size,pt[1]],[pt[0],pt[1]+size],[pt[0]-size,pt[1]]],colour,fade*.8);}
 }
}g.restore();}
const api={render,hash};if(typeof module!=='undefined')module.exports=api;else root.PulseDepth=api;
})(typeof globalThis!=='undefined'?globalThis:this);
