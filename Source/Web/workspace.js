// SPDX-License-Identifier: MIT
window.JagoSuite=window.JagoSuite||{};window.JagoSuite.adapter={studio:'pulse'};
window.JagoSession={
 async capture(){if(exporting||window.pulseExactBusy)throw Error('Finish or cancel the export before saving the workspace.');return {studio:'pulse',document:structuredClone(project)};},
 async restore(data){await PulseApp.replace(data);history=[];future=[];dirty=false;},
 status(){return {name:project.name||'Untitled composition',dirty,revision:window.pulseWorkspaceRevision||0,pending:!!(exporting||window.pulseExactBusy),idleFor:Date.now()-(window.pulseWorkspaceEdit||0)};},
 focus(active){if(!active)pause();}
};
window.JagoWorkspaceShortcut=(key,shift)=>{let target=document.activeElement;if(target&&(target.matches('input,textarea,select')||target.isContentEditable)){if(key==='z'||key==='y')document.execCommand(key==='y'||shift?'redo':'undo');return;}if(key==='z'||key==='y')undo(key==='y'||shift);else if(key==='s')document.getElementById('save').click();};

window.JagoSharedThemes={apply(name){const chosen=String(name).toLowerCase()==='paper'?'Sketchbook':Object.keys(themes).find(k=>k.toLowerCase()===String(name).toLowerCase());if(!chosen)return false;$('theme').value=chosen;$('theme').onchange();return true;}};
