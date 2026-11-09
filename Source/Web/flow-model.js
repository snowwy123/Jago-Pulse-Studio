// SPDX-License-Identifier: MIT
// Original Pulse feedback recipes and plain-data authoring model.
(function(root){'use strict';
const clamp=(v,a,b,f)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:f));
const recipes=[
 {name:'Current weave',field:'curl',persistence:.88,twist:.35,edge:.55,diffusion:.12,symmetry:1},
 {name:'Arc garden',field:'lattice',persistence:.92,twist:.5,edge:.8,diffusion:.06,symmetry:2},
 {name:'Ink bloom',field:'ripple',persistence:.94,twist:.2,edge:0,diffusion:.7,symmetry:1},
 {name:'Mirror tide',field:'vortex',persistence:.9,twist:.55,edge:.25,diffusion:.2,symmetry:6},
 {name:'Orbit loom',field:'weave',persistence:.93,twist:.25,edge:.35,diffusion:.12,symmetry:3},
 {name:'Signal etch',field:'lattice',persistence:.84,twist:.12,edge:1,diffusion:0,symmetry:4},
 {name:'Magnetic silk',field:'magnetic',persistence:.93,twist:.4,edge:.45,diffusion:.04,symmetry:1},
 {name:'Cellular tide',field:'cells',persistence:.92,twist:.2,edge:.6,diffusion:.1,symmetry:2},
 {name:'Voltage garden',field:'wiring',persistence:.87,twist:.18,edge:.75,diffusion:.03,symmetry:2,bassMotion:.35,beatPulse:1.5,trebleDetail:1.4,sourcePulse:.5,filament:.8},
 {name:'Living contours',field:'organism',persistence:.94,twist:.12,edge:.5,diffusion:.42,symmetry:1,bassMotion:.65,beatPulse:.25,trebleDetail:.3,sourcePulse:.3,filament:.18},
 {name:'Chromatic nautilus',field:'nautilus',emitters:[{x:.5,y:.5,radius:.085,strength:.3,motion:'still',shape:'ring',colour:0},{x:.4,y:.5,radius:.012,strength:.6,motion:'orbit',shape:'point',colour:1},{x:.6,y:.5,radius:.008,strength:.5,motion:'weave',shape:'point',colour:2}],persistence:.94,twist:.6,edge:.6,diffusion:.08,symmetry:5,beatPulse:1.3},
 {name:'Aurora ink',field:'aurora',emitters:[{x:.25,y:.45,radius:.014,strength:.65,motion:'weave',shape:'line',colour:0},{x:.5,y:.5,radius:.016,strength:.6,motion:'weave',shape:'line',colour:1},{x:.75,y:.55,radius:.014,strength:.6,motion:'weave',shape:'line',colour:2}],persistence:.96,twist:.12,edge:.3,diffusion:.3,symmetry:1,trebleDetail:1.2},
 {name:'Plasma lens',field:'lens',persistence:.91,twist:.4,edge:.85,diffusion:.06,symmetry:2,bassMotion:1.4},
 {name:'Mosaic eddies',field:'mosaic',persistence:.92,twist:.25,edge:.7,diffusion:.12,symmetry:1,beatPulse:1.4}
];
// Stable look IDs stay unchanged; these groups organise discovery, not renderer identity.
const groups=[{id:'currents',name:'Currents & silk',looks:[0,4,6,11]},{id:'organic',name:'Ink & organic',looks:[2,7,9]},{id:'mirrors',name:'Mirrors & spirals',looks:[3,10,12]},{id:'signals',name:'Geometry & signals',looks:[1,5,8,13]}];
// Source placement and tonal range are part of each look's art direction.

Object.assign(recipes[2],{exposure:2.9,input:.72});

Object.assign(recipes[3],{input:.35,exposure:3.6});
Object.assign(recipes[4],{input:.35,exposure:3.5});

Object.assign(recipes[7],{input:.65,exposure:3.5});
Object.assign(recipes[13],{pattern:1.,exposure:6.,flow:.35,persistence:.95,filament:.06});
const fields=['curl','vortex','ripple','weave','lattice','magnetic','cells','petal','wiring','organism','nautilus','aurora','lens','mosaic'];
function emitter(e={},i=0){e=e&&typeof e==='object'?e:{};return{id:'emitter-'+i,name:String(e.name||'Source '+(i+1)).slice(0,60),enabled:e.enabled!==false,x:clamp(e.x,0,1,.5),y:clamp(e.y,0,1,.5),radius:clamp(e.radius,.003,.2,.025),strength:clamp(e.strength,0,2,.7),motion:['still','orbit','weave','sweep'].includes(e.motion)?e.motion:'orbit',shape:['point','ring','line'].includes(e.shape)?e.shape:'point',colour:Math.round(clamp(e.colour,0,2,i%3))};}
function normalise(v={},look=0){if(!v||typeof v!=='object')v={};const r=recipes[Math.max(0,Math.min(recipes.length-1,Math.floor(look)||0))];let s={seed:String(v.seed||'pulse-flow').slice(0,80),field:fields.includes(v.field)?v.field:r.field,persistence:clamp(v.persistence,0,1,r.persistence),pattern:clamp(v.pattern,0,1,r.pattern??(look>=10?.7:0)),input:clamp(v.input,0,2,r.input??(look>=10?.4:1)),exposure:clamp(v.exposure,.5,8,r.exposure??(look>=10?4:4.5)),flow:clamp(v.flow,0,2,r.flow??.7),twist:clamp(v.twist,0,1,r.twist),edge:clamp(v.edge,0,1,r.edge),diffusion:clamp(v.diffusion,0,1,r.diffusion),symmetry:Math.round(clamp(v.symmetry,1,12,r.symmetry)),zoom:clamp(v.zoom,-1,1,.12),panX:clamp(v.panX,-1,1,0),panY:clamp(v.panY,-1,1,0),rotation:clamp(v.rotation,-1,1,0),bassMotion:clamp(v.bassMotion,0,2,r.bassMotion??.85),beatPulse:clamp(v.beatPulse,0,2,r.beatPulse??1),trebleDetail:clamp(v.trebleDetail,0,2,r.trebleDetail??.65),colourPulse:clamp(v.colourPulse,0,1,.2),sourcePulse:clamp(v.sourcePulse,0,2,r.sourcePulse??.8),filament:clamp(v.filament,0,1,r.filament??(look>=10?.15:look===2?.1:look===5?.85:.5)),echo:clamp(v.echo,0,.8,look===3?.2:0),echoScale:clamp(v.echoScale,.7,1.3,1.05),chromatic:clamp(v.chromatic,0,1,look===1?.3:0),tone:['light','ink','contour'].includes(v.tone)?v.tone:look===2?'ink':look===5?'contour':'light',audioShape:['none','waveform','spectrum'].includes(v.audioShape)?v.audioShape:'none',audioStrength:clamp(v.audioStrength,0,1,.4),seedPattern:['scattered','stripes'].includes(v.seedPattern)?v.seedPattern:v.seedPattern==='sources'?'sources':look===9?'scattered':'sources',sourceMotion:clamp(v.sourceMotion,0,2,r.sourceMotion??1),sourceRate:clamp(v.sourceRate,.05,3,r.sourceRate??.5),trailResponse:clamp(v.trailResponse,0,1,0),growth:clamp(v.growth,0,1,.55),wireWidth:clamp(v.wireWidth,.1,2,.65),wrap:v.wrap===true,source:['none','text','asset'].includes(v.source)?v.source:'none',sourceText:String(v.sourceText??'PULSE').slice(0,120),sourceAsset:String(v.sourceAsset||'').slice(0,160),sourceCols:Math.round(clamp(v.sourceCols,1,16,1)),sourceRows:Math.round(clamp(v.sourceRows,1,16,1)),sourceFrames:Math.round(clamp(v.sourceFrames,1,256,1)),sourceFps:clamp(v.sourceFps,1,60,12),sourceSize:clamp(v.sourceSize,.05,.9,.45),sourceStrength:clamp(v.sourceStrength,0,1,.35),emitters:[]};const defaults=Array.from({length:4},(_,i)=>({x:.3+(i%2)*.4,y:.35+Math.floor(i/2)*.3,radius:look===9?.035:look===8?.004:look===2?.045:.008+i*.003,strength:look===8?.18:.7,motion:look===9?'still':look===5?'sweep':'orbit',shape:look===8?'line':look===4?'ring':'point',colour:i%3}));s.emitters=(Array.isArray(v.emitters)&&v.emitters.length?v.emitters:r.emitters||defaults).slice(0,8).map(emitter);return s;}
function seed(s){let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0)/4294967296;}
function frame(t){return Math.max(0,Math.min(18000,Math.floor((Number.isFinite(t)?t:0)*30+1e-6)));}
function sources(config,t,speed=1){const phase=seed(config.seed)*Math.PI*2;return config.emitters.filter(e=>e.enabled).map((e,i)=>{let x=e.x,y=e.y,q=t*speed*config.sourceRate+phase+i*1.71;if(e.motion==='orbit'){x+=Math.cos(q)*.15*config.sourceMotion;y+=Math.sin(q*.81)*.15*config.sourceMotion;}if(e.motion==='weave'){x+=Math.sin(q*.7)*.22*config.sourceMotion;y+=Math.sin(q*1.31)*.18*config.sourceMotion;}if(e.motion==='sweep'){x=((e.x+t*speed*config.sourceRate*.14*config.sourceMotion+i*.19)%1+1)%1;y+=Math.sin(q)*.08*config.sourceMotion;}return{...e,x,y};});}
function response(m,signal,amount=1){return{bass:(signal.bass||0)*amount*m.bassMotion,beat:(signal.beat||0)*amount*m.beatPulse,treble:(signal.treble||0)*amount*m.trebleDetail,energy:(signal.energy||0)*amount};}
const api={groups,response,recipes,fields,normalise,emitter,seed,frame,sources};if(typeof module!=='undefined')module.exports=api;else root.PulseFlowModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
