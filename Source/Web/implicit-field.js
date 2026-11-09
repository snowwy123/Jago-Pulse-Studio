// SPDX-License-Identifier: MIT
// Original implicit porcelain landscape: analytic surfaces, contact occlusion and soft lighting.
(function(root){'use strict';let state,unavailable=false;
const fragment=`precision highp float;
uniform vec2 resolution;
uniform vec3 colour0,colour1,colour2;
uniform float clock,seed,look,relief,opening,size,travel,morph,bass,beat,angle,elevation,lens,horizon,lightAngle,transparentStage,groundEnabled,bend,terrain,steps,shadowSteps;
float random(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7))+seed)*43758.5453);}
vec2 map(vec3 p){
 float floorHeight=.1*sin(p.x*.13)*sin(p.z*.12),best=groundEnabled>.5?p.y-floorHeight:100.;float material=0.;
 float spacing=3.2;vec2 grid=floor(p.xz/spacing+.5),local=p.xz-grid*spacing,stepSide=sign(local);
 for(int i=0;i<4;i++){
  vec2 cell=grid+vec2(mod(float(i),2.)*stepSide.x,floor(float(i)/2.)*stepSide.y),jitter=vec2(random(cell),random(cell+19.))-.5,center=cell*spacing+jitter*.7;
  float channel=sin(center.y*.13+seed)*(1.2+bend*3.);
  if(abs(center.x-channel)<.6+opening*2.4)continue;
  float r=random(cell+4.),h=(.8+pow(random(cell+7.),1.5)*3.8)*relief;if(look<.5)h=(.65+pow(.5+.5*sin(center.x*.23+center.y*.14+seed),2.)*(3.2+random(cell+7.)*1.3))*relief;
  h*=terrain>.5?(terrain>1.5?.65+pow(random(cell+11.),2.)*1.1:.65):1.;h*=1.+bass*.15*pow(.5+.5*sin(center.x*.5+center.y*.3),2.);
  vec3 q=p-vec3(center.x,.1*sin(center.x*.13)*sin(center.y*.12),center.y);
  float rotation=(r-.5)*1.4,co=cos(rotation),sn=sin(rotation);q.xz=mat2(co,-sn,sn,co)*q.xz;
  q.x+=sin(q.y*.65+center.y*.14+clock*morph*.06)*.3*clamp(q.y/max(.2,h),0.,1.);
  float d;
  if(look<.5&&r>.78){float arcRadius=(.8+h*.18)*size/.65;q.y-=.12;vec2 ring=vec2(length(q.xy)-arcRadius,q.z);d=length(ring)-.23*size/.65;}
  else if(look<.5){vec3 radii=vec3(.4+r*.23,max(.35,h*.65),1.05+r*.3)*vec3(size/ .65,1.,size/.65);q.y-=h*.43;d=length(q/radii)*(length(q/radii)-1.)/max(.0001,length(q/(radii*radii)));}
  else if(look<1.5){q.y-=h*.5;vec3 box=abs(q)-vec3(.5*size/.65,max(.15,h*.5-.12),.55*size/.65);d=length(max(box,0.))+min(max(box.x,max(box.y,box.z)),0.)-.14;}
  else{float radius=(.65+r*.5)*size/.65;vec3 radii=vec3(radius,max(.18,h*.23),radius*(.7+random(cell+3.)*.5));q.y-=radii.y*.65;d=length(q/radii)*(length(q/radii)-1.)/max(.0001,length(q/(radii*radii)));}
  if(d<best){best=d;material=1.+r;}
 }
 return vec2(best,material);
}
vec3 normal(vec3 p){vec2 e=vec2(.004,0.);return normalize(vec3(map(p+e.xyy).x-map(p-e.xyy).x,map(p+e.yxy).x-map(p-e.yxy).x,map(p+e.yyx).x-map(p-e.yyx).x));}
float shadow(vec3 p,vec3 light){float shade=1.,dist=.04;for(int i=0;i<22;i++){if(float(i)>=shadowSteps)break;float h=map(p+light*dist).x;shade=min(shade,10.*h/dist);dist+=clamp(h,.045,.7);if(dist>10.)break;}return clamp(shade,.12,1.);}
float occlusion(vec3 p,vec3 n){float sum=0.,weight=1.;for(int i=1;i<=4;i++){float d=float(i)*.16;sum+=(d-map(p+n*d).x)*weight;weight*=.55;}return clamp(1.-sum*1.6,.3,1.);}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*resolution)/resolution.y;uv.y+=(horizon-.37)*.7;
 float a=angle*.55;vec3 eye=vec3(sin(a)*13.,3.+elevation*6.,cos(a)*13.+clock*travel*.45),target=vec3(0.,.9,eye.z-18.);
 vec3 forward=normalize(target-eye),right=normalize(cross(forward,vec3(0.,1.,0.))),up=cross(right,forward),ray=normalize(forward*lens*1.35+right*uv.x+up*uv.y);
 vec3 sky=mix(vec3(.018,.025,.045),colour0*.11+.04,pow(max(0.,1.-abs(ray.y)),4.));
 float distance=0.;vec2 hit=vec2(100.,0.);for(int i=0;i<192;i++){if(float(i)>=steps)break;hit=map(eye+ray*distance);if(hit.x<.0025*max(1.,distance*.1)||distance>65.)break;distance+=max(.002,hit.x*.88);}
 if(distance>65.||hit.x>.0025*max(1.,distance*.1)){gl_FragColor=vec4(sky,1.-transparentStage);return;}
 vec3 pos=eye+ray*distance,n=normal(pos),light=normalize(vec3(-cos(lightAngle),1.65,sin(lightAngle))),view=-ray,halfway=normalize(light+view);
 float ao=occlusion(pos,n),visibility=shadow(pos+n*.018,light),diffuse=max(0.,dot(n,light)),fresnel=pow(1.-max(0.,dot(n,view)),4.);
 vec3 porcelain=mix(vec3(.88,.91,.88),colour0,.74),base=hit.y>.5?porcelain:mix(vec3(.08,.095,.11),colour0,.14);
 if(hit.y>1.77)base=mix(porcelain,colour1,.86);else if(hit.y>1.67)base=mix(porcelain,colour2,.86);
 float specular=pow(max(0.,dot(n,halfway)),48.)*(.35+.5*fresnel)*visibility;
 vec3 result=base*(.18*ao+diffuse*visibility*1.5)+vec3(1.,.95,.84)*specular+colour0*fresnel*.16*ao;
 // A distant cool fill separates the silhouettes without washing out contact shadows.
 result+=base*max(0.,dot(n,normalize(vec3(1.,.5,-1.))))*.17*ao;
 if(look>.5&&look<1.5&&hit.y>.5){float seam=pow(.5+.5*sin(pos.y*9.-clock*travel*3.),24.);result+=colour1*seam*(.08+beat*.35);}
 if(hit.y<.5){float river=abs(pos.x-sin(pos.z*.13+seed)*(1.2+bend*3.)),edge=.6+opening*2.4;float inlay=exp(-abs(river-edge)*55.);float pulse=.18+.8*pow(.5+.5*sin(pos.z*.6-clock*travel*3.),8.)*(.3+beat*.7);result+=colour2*inlay*pulse;}
 float fog=1.-exp(-distance*distance*.0009);result=mix(result,sky,fog);
 result=result/(result+vec3(.65));result=pow(result,vec3(.65));
 gl_FragColor=vec4(result,1.);
}`;
function setup(){if(unavailable)return null;if(state)return state;try{const canvas=document.createElement('canvas'),gl=canvas.getContext('webgl',{alpha:true,antialias:false,preserveDrawingBuffer:true});if(!gl){unavailable=true;return null;}const shader=(kind,src)=>{const s=gl.createShader(kind);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;},vs=shader(gl.VERTEX_SHADER,'attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}'),fs=shader(gl.FRAGMENT_SHADER,fragment),program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.deleteShader(vs);gl.deleteShader(fs);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);state={canvas,gl,program,buffer,uniforms:{},position:gl.getAttribLocation(program,'position')};canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();unavailable=true;state=null;});return state;}catch(error){unavailable=true;console.warn('Implicit scenery unavailable; using mesh scenery.',error.message);return null;}}
function render(g,p,t,s,E,m){const state=setup();if(!state)return false;const{canvas,gl,program}=state,edge=Math.min(s.quality||640,gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)),scale=Math.min(1,edge/Math.max(p.width,p.height)),width=Math.max(1,Math.round(p.width*scale)),height=Math.max(1,Math.round(p.height*scale));if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}gl.viewport(0,0,canvas.width,canvas.height);gl.useProgram(program);gl.disable(gl.DITHER);gl.bindBuffer(gl.ARRAY_BUFFER,state.buffer);gl.enableVertexAttribArray(state.position);gl.vertexAttribPointer(state.position,2,gl.FLOAT,false,0,0);const at=n=>state.uniforms[n]??(state.uniforms[n]=gl.getUniformLocation(program,n)),sig=E.signals(p,t,s),clock=E.travel(p,t,s);let seed=0;for(const c of m.seed)seed=(seed*31+c.charCodeAt(0))%997;gl.uniform2f(at('resolution'),canvas.width,canvas.height);E.colours(p,t,s).forEach((c,i)=>gl.uniform3f(at('colour'+i),... [1,3,5].map(k=>parseInt(c.slice(k,k+2),16)/255)));for(const[n,v]of Object.entries({...m,clock,seed,look:s.look,bass:sig.bass*s.reaction,beat:sig.beat*s.reaction,transparentStage:p.transparent?1:0,groundEnabled:m.ground?1:0,lightAngle:m.light,terrain:m.terrain==='spires'?2:m.terrain==='hills'?1:0,steps:128+m.detail*.8,shadowSteps:10+m.detail*.18}))if(typeof v==='number')gl.uniform1f(at(n),v);gl.drawArrays(gl.TRIANGLES,0,6);g.drawImage(canvas,0,0,p.width,p.height);return true;}
root.PulseImplicitField={render,diagnostics:()=>({contexts:state?1:0,width:state?.canvas.width||0,height:state?.canvas.height||0,fallback:unavailable})};})(globalThis);
