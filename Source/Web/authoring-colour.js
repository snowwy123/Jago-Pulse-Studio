// SPDX-License-Identifier: MIT
// Explicit colour roles, sampled directly from time for preview, export and wallpaper.
(function(root){'use strict';
const keys=['primary','secondary','highlight'];
function normalise(v={}){return{roles:Array.isArray(v.roles)&&v.roles.length===3?v.roles.map(Boolean):[false,true,true],motion:['flow','beats','passages','off'].includes(v.motion)?v.motion:'flow',period:Math.max(4,Math.min(120,Number(v.period)||24)),range:Math.max(0,Math.min(360,Number.isFinite(v.range)?v.range:220))};}
function colour(hex,p,time,policy,role){const c=normalise(policy),i=keys.indexOf(role);if(i<0||!c.roles[i]||c.motion==='off'||p.paletteLocks?.[role]||!/^#[0-9a-f]{6}$/i.test(hex))return hex;let pos=Math.max(0,time-(p.audioStart||0))/c.period;
 if(c.motion==='beats'){const t=time,beats=p.analysis?.beats;if(!p.manualTempo&&beats?.length){let lo=0,hi=beats.length;while(lo<hi){let m=(lo+hi)>>1;if(beats[m].time<=t)lo=m+1;else hi=m;}pos=Math.floor(Math.max(0,lo-1)/Math.max(1,p.beatGroup||4))*.17;}else pos=Math.floor(Math.max(0,time-(p.audioStart||0)-(p.beatOffset||0))*p.bpm/60/Math.max(1,p.beatGroup||4))*.17;}
 if(c.motion==='passages'){const ranges=p.musicControls?.sections?.length?p.musicControls.sections:p.passages?.length?p.passages:p.analysis?.sections||[];const local=!!(p.musicControls?.sections?.length||p.passages?.length),at=Number.isFinite(p._colourSectionTime)&&local?p._colourSectionTime:time-(local?p.audioStart||0:0);pos=Math.max(0,ranges.findLastIndex(v=>(v.start??v.time)<=at))*.23;}
 const Z=typeof module!=='undefined'?require('./musical-style.js'):root.PulseMusicalStyle;return Z.rotate(hex,c.range*(.5-.5*Math.cos(pos*Math.PI*2)));
}
function apply(p,input,scope){const policy=normalise(input);p.generationColourPolicy=structuredClone(policy);let count=0;for(const s of p.scenes){if(s.locked||scope&&!scope.includes(s.id))continue;s.colourPolicy=structuredClone(policy);const e=s.experimental;if(e){if(e.stack){for(const l of e.stack.layers)if(!l.locked)l.settings.colourPolicy=structuredClone(policy);}else e.colourPolicy=structuredClone(policy);}count++;}return count;}
const api={normalise,colour,apply};if(typeof module!=='undefined')module.exports=api;else root.PulseAuthoringColour=api;
})(typeof globalThis!=='undefined'?globalThis:this);
