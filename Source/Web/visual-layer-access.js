// SPDX-License-Identifier: MIT
// Shared references for editing authored visual parts without flattening a visual stack.
(function(root){'use strict';
function visuals(scene){const e=scene?.experimental;if(!e)return[];const shared=(typeof module!=='undefined'?require('./shared-visuals.js'):root.PulseSharedVisuals).editing(scene);return [...(e.stack?.layers||[{id:'scene-visual',name:'Scene visual',settings:e,get hidden(){return e.enabled===false;},set hidden(value){e.enabled=!value;},locked:false}]),...shared];}
function find(scene,visualId,partId){const visual=visuals(scene).find(v=>v.id===visualId),part=visual?.settings.design?.parts.find(p=>p.id===partId);return{visual,part};}
function targets(project,sceneId,visualId,partId,all=false,linked=true){const origin=project.scenes.find(s=>s.id===sceneId),source=find(origin,visualId,partId).part;if(!source)return[];const result=[],seen=new Set();function add(part){if(part&&!seen.has(part)){seen.add(part);result.push(part);}}
 for(const scene of project.scenes){if(scene.locked||!all&&scene.id!==sceneId)continue;const {visual,part}=find(scene,visualId,partId);if(!part||part.type!==source.type||source.asset&&part.asset!==source.asset)continue;add(part);if(!linked)continue;
 const masks=visuals(scene).filter(v=>v.maskOnly&&v.settings.design?.parts.some(p=>p.id===part.id&&p.type===part.type&&p.asset===part.asset));for(const mask of masks){for(const p of mask.settings.design.parts)if(p.id===part.id)add(p);for(const dependent of visuals(scene).filter(v=>v.maskId===mask.id))for(const p of dependent.settings.design.parts)add(p);}
 }return result;}
function move(project,sceneId,visualId,partId,x,y,all=false,linked=true){const part=find(project.scenes.find(s=>s.id===sceneId),visualId,partId).part;if(!part)return 0;const dx=x-part.x,dy=y-part.y,list=targets(project,sceneId,visualId,partId,all,linked);for(const p of list){p.x+=dx;p.y+=dy;}return list.length;}
const api={visuals,find,targets,move};if(typeof module!=='undefined')module.exports=api;else root.PulseVisualAccess=api;
})(typeof globalThis!=='undefined'?globalThis:this);
