// SPDX-License-Identifier: MIT
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PulsePreview=api;})(globalThis,()=>{
 const modes={economy:{edge:320,lab:240,quality:320,density:.22,geometry:12,fps:15},light:{edge:480,lab:320,quality:320,density:.35,geometry:18,fps:20},balanced:{edge:960,lab:640,quality:640,density:.7,geometry:30,fps:30},detailed:{edge:1920,lab:960,quality:960,density:1,geometry:60,fps:60}};let mode='balanced';
 function settings(s,b){if(!s)return s;return{...s,quality:Math.min(s.quality||640,b.quality),density:Math.min(s.density??.6,b.density),...(['filament','strata','field','canopy'].includes(s.engine)||s.scenery?{scenery:{...(s.scenery||{}),detail:Math.min(s.scenery?.detail||38,b.geometry)}}:{}),...(s.stack?{stack:{...s.stack,layers:s.stack.layers.map(l=>({...l,settings:settings(l.settings,b)}))}}:{})};}
 function overlays(list,b){return list?.map(v=>({...v,count:Math.max(1,Math.ceil(v.count*b.density))}));}
 function project(p,lab=false){const b=modes[mode],k=Math.min(1,(lab?b.lab:b.edge)/Math.max(p.width,p.height));return{...p,overlays:overlays(p.overlays,b),width:Math.max(1,Math.round(p.width*k)),height:Math.max(1,Math.round(p.height*k)),scenes:p.scenes.map(s=>({...s,overlays:overlays(s.overlays,b),...(s.experimental?{experimental:settings(s.experimental,b)}:{})}))};}
 return{modes,project,setMode(value){mode=Object.hasOwn(modes,value)?value:'balanced';return mode;},get mode(){return mode;},get interval(){return 1000/modes[mode].fps;}};
});
