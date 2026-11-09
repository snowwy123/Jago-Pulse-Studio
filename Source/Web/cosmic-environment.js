// SPDX-License-Identifier: MIT
// Original direct-time cosmic/atmospheric shader. Stylised environments, not astronomy simulation.
(function(root){'use strict';const entries=new Map(),C=(v,a,b,f)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:f));let failure='';
function normalise(v={}){v=v&&typeof v==='object'?v:{};return{surface:['ocean','mineral'].includes(v.surface)?v.surface:'gas',planetTilt:C(v.planetTilt,-80,80,-22),planetSpin:C(v.planetSpin,-1,1,.22),lightAngle:C(v.lightAngle,-180,180,135),lightPhase:C(v.lightPhase,0,1,.55),ringOpacity:C(v.ringOpacity,0,1,.65),ringInner:C(v.ringInner,1.1,2.2,1.35),ringOuter:Math.max(C(v.ringInner,1.1,2.2,1.35)+.15,C(v.ringOuter,1.5,3.2,2.35)),ringDetail:C(v.ringDetail,0,1,.6),scale:C(v.scale,.4,2,1),detail:C(v.detail,.2,2,1),inclination:C(v.inclination,.15,1,.5),stars:C(v.stars,0,1,.6),cloud:C(v.cloud,0,1,.6),light:C(v.light,0,2,1),seed:String(v.seed||'deep-space').slice(0,80)};}
const vertex=`#version 300 es
in vec2 position;out vec2 uv;void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragment=`#version 300 es
precision highp float;in vec2 uv;out vec4 outColour;uniform vec2 resolution;uniform float time,seed,scale,detail,inclination,stars,cloud,light,beat,bass,high,glow,drift,transparent,planetTilt,planetSpin,lightAngle,lightPhase,ringOpacity,ringInner,ringOuter,ringDetail;uniform int family,look,surface;uniform vec3 palette[3];
float hash(vec3 p){p=fract(p*vec3(.1031,.11369,.13787));p+=dot(p,p.yxz+19.19+seed);return fract((p.x+p.y)*p.z);}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float n=0.,w=.5;for(int i=0;i<5;i++){n+=noise(p)*w;p=p*2.03+vec3(1.7,3.1,2.4);w*=.5;}return n;}
vec3 starfield(vec2 p){vec3 sum=vec3(0);for(int i=0;i<3;i++){float layer=float(i),grid=70.+layer*53.;vec2 q=p*grid+vec2(time*.13,0.)*(layer+1.)*drift,cell=floor(q),f=fract(q)-.5;float rnd=hash(vec3(cell,layer));f-=vec2(hash(vec3(cell,layer+3.)),hash(vec3(cell,layer+7.)))*.6-.3;float point=exp(-dot(f,f)*(900.+layer*500.))*step(.988-stars*.035,rnd);sum+=mix(vec3(.55,.64,.8),palette[i],.45)*point*(.65+.35*sin(time*.6+rnd*53.)+high*.6);}return sum*stars;}
float cloudDensity(vec3 pos){
 if(pos.y<-.6||pos.y>4.2)return 0.;
 vec3 q=pos*vec3(.65,1.1,.65)+vec3(time*.025,0.,time*.012);
 float broad=noise(vec3(q.x*.55,seed,q.z*.55)),top=(look==2?2.2:.75)+broad*(look==2?2.:2.5),bottom=look==2?.65:top-1.65;
 float envelope=smoothstep(bottom,bottom+.35,pos.y)*(1.-smoothstep(top-.65,top,pos.y));
 if(envelope<.005)return 0.;
 float n=fbm(q*detail+vec3(0.,seed,0.));
 float front=look==2?smoothstep(3.+noise(vec3(pos.x*.23,seed,1.))*2.,4.+noise(vec3(pos.x*.23,seed,1.))*2.,pos.z):1.;return smoothstep(.47-cloud*.08,.65,n)*envelope*front*(look==2?5.:4.5);
}
vec3 auroralVolume(vec2 screen){
 vec3 ray=normalize(vec3(screen.x,screen.y+.30,1.)),sum=vec3(0.);float phase=time*.035;
 for(int step=0;step<64;step++){
  float distance=1.+float(step)*.35;vec3 pos=ray*distance;
  if(pos.y<.7||pos.y>9.)continue;
  for(int layer=0;layer<2;layer++){
   float j=float(layer),x=pos.x+phase*(j*.3-.2),fold=8.+j*4.+sin(x*.55+phase+j*1.7)*3.+sin(x*1.35-phase*.4+j)*.65+(noise(vec3(x*.8,phase*.3,j+seed))-.5)*1.5;
   float across=pos.z-fold,width=.34+distance*.002;
   if(abs(across)>width*2.4)continue;
   float sheet=exp(-across*across/(width*width)*2.),base=1.1+j*.35+noise(vec3(x*.7,j,seed))*.65,y=pos.y-base;
   float upper=4.+noise(vec3(x*1.6,j+seed,2.))*3.,rx=x+sin(pos.y*.28+x*.3+phase)*.07;
   float fibres=noise(vec3(rx*(26.+detail*12.),j+seed,4.))*.7+noise(vec3(rx*83.,j,seed))*.3;
   float profile=smoothstep(-.1,.22,y)*exp(-max(0.,y)/(upper*.25))*(1.-smoothstep(upper*.7,upper,y));
   float auroraPatch=smoothstep(.24,.68,noise(vec3(x*.85+phase*.2,j+seed,3.)));float hem=exp(-pow(y/.16,2.))*.10;
   vec3 pigment=mix(palette[0],palette[2],smoothstep(.3,3.8,y)*.65);
   sum+=pigment*sheet*(profile*(.30+pow(fibres,3.)*.42)*(.08+auroraPatch*1.05)+hem*auroraPatch)*(.48+cloud*.55+bass*.12)*(1.-j*.22);
  }
 }
 return sum;
}
void main(){float aspect=resolution.x/resolution.y;float framing=family==0&&look>=1&&look<=4?min(1.,aspect)*(look==1?min(1.,.48/(.27*ringOuter)):1.):1.;vec2 p=(uv-.5)*vec2(aspect,1.)/(scale*framing);p+=vec2(sin(time*.035),cos(time*.027))*drift*.13;float r=length(p),ang=atan(p.y,p.x);vec3 col=vec3(.003,.005,.015),st=starfield(p);float tm=time*.12;
if(family==0){col+=st;
if(look==0||look==5){vec2 q=p*2.3;float a=fbm(vec3(q*detail+vec2(tm*.15,0.),seed)),warp=fbm(vec3(q*1.5+vec2(a*2.,-a),tm*.2));float n=fbm(vec3(q*2.+vec2(warp*2.,a*3.),tm*.3));float band=exp(-pow((p.y+.2*sin(p.x*3.+warp*2.))*(2.5-cloud*1.5),2.));float dust=pow(max(0.,n-.22),2.)*band*(1.+cloud*2.);col+=mix(palette[0],palette[1],smoothstep(.25,.7,warp))*dust*(1.3+bass*.6);col+=palette[2]*pow(max(0.,n-.46),3.)*8.*(1.+beat*.4);col*=.6+.4*fbm(vec3(q*3.,seed));if(look==5){col*=.45;vec2 grid=p*7.,cell=floor(grid),f=fract(grid);for(int i=0;i<2;i++){vec2 dir=i==0?vec2(1,0):vec2(0,1),a=vec2(hash(vec3(cell,1.)),hash(vec3(cell,2.)))*.6+.2,b=dir+vec2(hash(vec3(cell+dir,1.)),hash(vec3(cell+dir,2.)))*.6+.2,v=b-a;float d=length((f-a)-v*clamp(dot(f-a,v)/dot(v,v),0.,1.));float enabled=step(.48,hash(vec3(cell,8.+float(i))));col+=palette[1]*exp(-d*d*30000.)*enabled*.2*(1.+beat);col+=palette[2]*exp(-dot(f-a,f-a)*2400.)*.7;}}}
else if(look==1){
 const float radius=.27;vec2 q=p;float rr=length(q),tilt=planetTilt*.0174533;vec3 axis=normalize(vec3(sin(tilt)*sqrt(1.-inclination*inclination),cos(tilt)*sqrt(1.-inclination*inclination),inclination));float az=lightAngle*.0174533;vec3 L=normalize(vec3(cos(az),sin(az),-.4+lightPhase*1.6));
 float ringZ=-dot(axis.xy,q)/axis.z;vec3 ringPoint=vec3(q,ringZ);float ringR=length(ringPoint),unitR=ringR/radius;float edgeAA=max(fwidth(unitR),.003),ringMask=smoothstep(ringInner,ringInner+edgeAA*2.,unitR)*(1.-smoothstep(ringOuter-edgeAA*2.,ringOuter,unitR));
 float radial=noise(vec3(unitR*38.,seed,2.)),fine=noise(vec3(unitR*125.,seed,4.)),gap=1.-smoothstep(.012,.028,abs(unitR-(ringInner+(ringOuter-ringInner)*.6)));float density=(.18+.6*radial+.22*fine)*mix(1.,.28,gap);float angle=atan(q.y,q.x);float dust=noise(vec3(unitR*80.,cos(angle-time*planetSpin/pow(max(unitR,1.),1.5))*4.,sin(angle-time*planetSpin/pow(max(unitR,1.),1.5))*4.));density*=mix(1.,.7+dust*.5,ringDetail);
 float shadowT=max(0.,-dot(ringPoint,L)),shadowD=length(ringPoint+L*shadowT),ringShadow=shadowT>0.?smoothstep(radius*.92,radius*1.08,shadowD):1.;vec3 ringColour=mix(mix(palette[1],palette[2],.2+radial*.45),vec3(.79,.73,.63),.28)*(.2+.6*abs(dot(axis,L)))*mix(.12,1.,ringShadow)*(1.+bass*.08);float ringAlpha=ringMask*density*ringOpacity;
 float sphereZ=rr<radius?sqrt(max(0.,radius*radius-rr*rr)):-10.;bool onSphere=rr<radius;bool ringInFront=ringZ>sphereZ;
 if(!ringInFront)col=mix(col,ringColour,ringAlpha);
 if(onSphere){vec3 N=vec3(q,sphereZ)/radius,east=normalize(cross(vec3(0,0,1),axis)+vec3(.00001,0,0)),forward=normalize(cross(east,axis));float lat=dot(N,axis),lon=atan(dot(N,forward),dot(N,east))+time*planetSpin;float latitudeRadius=sqrt(max(0.,1.-lat*lat));float jetLon=lon+(surface==0?sin(lat*8.)*time*planetSpin*.15:0.);float weatherLat=lat,weatherLon=jetLon;if(surface==0){vec2 storm=vec2(atan(sin(lon-.9),cos(lon-.9))*max(.25,latitudeRadius),(lat+.24)*2.2),originalStorm=storm;float twist=exp(-dot(storm,storm)*10.)*4.;storm=mat2(cos(twist),-sin(twist),sin(twist),cos(twist))*storm;weatherLat=clamp(lat+(storm.y-originalStorm.y)*.45,-.999,.999);weatherLon+=(storm.x-originalStorm.x)*1.3;weatherLat+=sin(weatherLon*9.+lat*21.+time*planetSpin*.2)*.007;}float weatherRadius=sqrt(max(0.,1.-weatherLat*weatherLat));vec3 globe=vec3(cos(weatherLon)*weatherRadius,weatherLat,sin(weatherLon)*weatherRadius);float n=fbm(globe*(4.+detail*3.)+vec3(seed,0.,0.)),fineCloud=fbm(globe*(15.+detail*5.)+vec3(n*2.,seed,0.));float jetWarp=(fbm(globe*vec3(7.,18.,7.)+vec3(seed,time*planetSpin*.08,0.))-.5);float bands=.5+.5*sin(weatherLat*23.+jetWarp*3.5+(n-.5)*2.+sin(weatherLat*57.)*.24);vec3 base=mix(palette[0],palette[1],smoothstep(.17,.85,bands));
 if(surface==0){base*=.72+fineCloud*.48;base=mix(base,mix(palette[1],vec3(.9,.9,.85),.45),smoothstep(.61,.79,fineCloud)*.28);vec2 stormPoint=vec2(sin(lon-.9)*.8,(lat+.24)*2.2);float storm=exp(-dot(stormPoint,stormPoint)*85.);base=mix(base,palette[2]*(.55+fineCloud*.45),storm*.8);}
 else if(surface==1){float terrain=fbm(globe*2.5+vec3(seed,2.,0.)),land=smoothstep(.44,.54,terrain);base=mix(palette[0]*.65,palette[1],land);float clouds=smoothstep(.55,.72,fineCloud+cloud*.14);base=mix(base,palette[2],clouds*.65);}
 else{float mountains=pow(max(0.,n-.35),.7);base=mix(palette[0]*.3,palette[1],mountains);base*=.65+fineCloud*.5;}
 float diffuse=max(0.,dot(N,L)),shade=.025+.9*pow(diffuse,.85);float crossPlane=dot(L,axis);if(abs(crossPlane)>.001){float hit=-dot(N*radius,axis)/crossPlane;if(hit>0.){float shadowR=length(N*radius+L*hit)/radius;float shadowRing=smoothstep(ringInner,ringInner+.04,shadowR)*(1.-smoothstep(ringOuter-.04,ringOuter,shadowR));shade*=1.-shadowRing*ringOpacity*.6;}}
 float rim=pow(1.-N.z,3.)*pow(max(0.,dot(N,L)+.3),1.5);vec3 body=base*shade+palette[2]*rim*.16*(1.+bass*.12);body+=palette[2]*pow(max(0.,dot(reflect(-L,N),vec3(0,0,1))),32.)*.035;col=mix(col,body,1.-smoothstep(radius-max(fwidth(rr),.0007),radius,rr));
 }
 if(ringInFront)col=mix(col,ringColour,ringAlpha);float atmosphere=exp(-abs(rr-radius)*180.)*.035;col+=palette[1]*atmosphere*(.4+bass*.12);
}
else if(look==2){
 vec2 q=vec2(p.x,p.y/inclination)/(1.+bass*.025);float rr=length(q),theta=atan(q.y,q.x),warp=fbm(vec3(q*8.,seed)),phase=theta-log(rr+.055)*(2.3+detail*.4)+time*.015;
 float arms=pow(.5+.5*cos(phase*3.+(warp-.5)*1.8+sin(rr*31.+theta*2.)*.12),3.8),radial=exp(-rr*3.6)*smoothstep(.018,.11,rr),clumps=fbm(vec3(q*26.,seed+2.));
 float lanes=pow(.5+.5*cos(phase*3.+.58+(warp-.5)),14.)*smoothstep(.07,.2,rr),dust=exp(-lanes*(1.8+cloud*2.));
 vec3 disk=mix(palette[0],palette[2],clumps*.55)*arms*radial*(.28+clumps*1.25)*dust;
 vec3 core=mix(palette[1],vec3(1.,.94,.82),.42)*exp(-dot(p*vec2(1.,1.7),p*vec2(1.,1.7))*80.)*.75;
 col+=disk*1.35+core+palette[1]*exp(-rr*rr*11.)*.018;
 for(int layer=0;layer<2;layer++){float grid=210.+float(layer)*170.;vec2 cell=floor(q*grid),f=fract(q*grid)-.5;float starRandom=hash(vec3(cell,float(layer)));vec2 offset=vec2(hash(vec3(cell,4.)),hash(vec3(cell,7.)))*.6-.3;float point=exp(-dot(f-offset,f-offset)*(190.+float(layer)*80.));float probability=sqrt(arms)*exp(-rr*2.8)*.34;float enabled=step(1.-probability,starRandom);col+=mix(vec3(.82,.9,1.),palette[2],.32)*point*enabled*(1.45+high*.65)*dust;}
 col+=palette[1]*exp(-r*r*550.)*.65;
}
else if(look==3){
 // Art-directed disk and far-side lens image; not a relativistic simulation.
 float tilt=max(.16,inclination),shadow=.135,aa=max(fwidth(r),.0008);vec2 diskPoint=vec2(p.x,p.y/tilt);float diskR=length(diskPoint),theta=atan(diskPoint.y,diskPoint.x),orbit=theta-time*.16/pow(max(diskR,.16),1.1);
 float turbulence=fbm(vec3(cos(orbit)*2.5,sin(orbit)*2.5,diskR*30.+seed));float threads=.35+.65*pow(.5+.5*sin(diskR*260.+turbulence*8.),2.);
 float diskMask=smoothstep(.155,.19,diskR)*(1.-smoothstep(.30,.52,diskR)),heat=exp(-(diskR-.16)*6.);float approach=.5+.5*cos(theta-.3);vec3 hot=mix(palette[0],mix(palette[1],vec3(1.,.91,.73),.42),heat);vec3 diskLight=hot*diskMask*threads*(.4+approach*1.4)*(1.+bass*.16);
 // The near disk obscures the lower shadow edge; distant emission wraps over it.
 if(p.y>0.)diskLight*=smoothstep(shadow-aa,shadow+aa,r);
 float lensR=length(vec2(p.x,p.y*1.08)),lens=exp(-pow((lensR-.162)*115.,2.))*smoothstep(-.07,.06,p.y);float lensThread=.45+.55*noise(vec3(ang*23.-time*.3,lensR*170.,seed));
 col*=smoothstep(shadow-aa,shadow+aa,r);col+=diskLight+mix(palette[1],palette[2],.35)*lens*lensThread*.7;
 float photon=exp(-abs(r-shadow)*650.)*(.4+.6*smoothstep(-.1,.1,p.x));col+=mix(palette[1],vec3(1.,.94,.82),.5)*photon*(.55+beat*.10);col+=hot*exp(-abs(diskR-.22)*25.)*.025*smoothstep(shadow,shadow+.02,r);
}
else{float core=exp(-r*r*1600.),beam=exp(-pow(p.x*55.,2.))*exp(-abs(p.y)*3.),echo=pow(.5+.5*cos(r*48.-time*2.),18.)*exp(-r*5.);col+=palette[2]*core*(2.+beat)+palette[0]*beam*(.2+beat*.65)+palette[1]*echo*.3;}}
else{if(look==0){
 col+=st*.8+vec3(.001,.003,.009);col+=auroralVolume(p);
 if(transparent<.5){float ridge=-.295+noise(vec3(p.x*4.,seed,0.))*.035+noise(vec3(p.x*18.,seed,3.))*.009;if(p.y<ridge)col=vec3(.004,.009,.016);if(p.y<-.335){vec2 reflected=vec2(p.x+sin(p.y*170.+time*.08)*.006,-p.y-.60);col=vec3(.004,.009,.016)+auroralVolume(reflected)*.10*(.6+.4*noise(vec3(p.x*80.,p.y*700.,seed)));}}
}
else{
 bool storm=look==2,solar=look==3;float sky=smoothstep(-.35,.4,p.y);vec3 background=mix(palette[0]*.09+vec3(.035,.055,.08),vec3(.008,.018,.035),sky);
 if(solar)background=mix(palette[1]*.32+vec3(.05,.03,.015),palette[0]*.035,smoothstep(-.25,.5,p.y));vec2 sun=p-vec2(solar?-.35:-.5,solar?.18:.25);background+=mix(palette[1],vec3(.85,.91,1.),.65)*exp(-dot(sun,sun)*6.)*(storm?.12:solar?.65:.3);if(solar)background+=mix(palette[1],vec3(1.,.94,.8),.7)*exp(-dot(sun,sun)*2200.)*2.;
 vec3 ro=storm?vec3(0.,.35,-2.):solar?vec3(0.,1.1,-2.):vec3(0.,3.15,-2.),rd=normalize(vec3(p.x*.95,p.y*.85+(storm?.19:solar?.025:-.22),1.)),sunDir=normalize(vec3(-.65,.75,.3));
 float trans=1.;vec3 volume=vec3(0.);float offset=hash(vec3(gl_FragCoord.xy,3.))*.025;
 for(int i=0;i<64;i++){
  float distance=.4+float(i)*.28+offset;vec3 pos=ro+rd*distance;float density=cloudDensity(pos)*(solar?.32:1.);if(density<.005)continue;
  float forward=cloudDensity(pos+sunDir*.42),farther=cloudDensity(pos+sunDir*.95),visibility=exp(-(forward*.85+farther*.65)*1.6),edge=clamp((density-forward)*1.7,0.,1.);
  vec3 shadow=mix(vec3(.035,.045,.065),palette[0]*.19,.5),lit=mix(vec3(.78,.84,.86),palette[1],.3),c=mix(shadow,lit,visibility*.7+edge*.3);
  if(storm)c*=.6+edge*.35;else c+=palette[2]*edge*.09;
  float opacity=1.-exp(-density*.28);volume+=c*opacity*trans;trans*=1.-opacity;if(trans<.018)break;
 }
 col=background*trans+volume;
 if(storm){float shaft=exp(-pow((p.x+.18)*18.,2.))*exp(-abs(p.y+.05)*4.);col+=palette[2]*shaft*beat*.055;}

}}
col=1.-exp(-max(vec3(0),col)*(.8+light*.7+glow*.5));float alpha=transparent>.5?clamp(max(col.r,max(col.g,col.b))*3.,0.,1.):1.;outColour=vec4(col,alpha);}`;
function dispose(key){const s=entries.get(key);if(!s)return;for(const item of s.programs.values())s.gl.deleteProgram(item.program);s.gl.deleteBuffer(s.buffer);s.gl.getExtension('WEBGL_lose_context')?.loseContext();entries.delete(key);}
function create(owner){while(entries.size>=6)dispose(entries.keys().next().value);const canvas=document.createElement('canvas'),gl=canvas.getContext('webgl2',{alpha:true,premultipliedAlpha:false,antialias:false});if(!gl)throw Error('Space and atmosphere need WebGL 2. Try a ribbon or optical look on this device.');const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const entry={canvas,gl,buffer,programs:new Map(),lost:false};canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();entry.lost=true;});entries.set(owner,entry);return entry;}
function selectProgram(entry,family,look){const key=family+':'+look;let item=entry.programs.get(key);if(!item){const gl=entry.gl,shaders=[],program=gl.createProgram();try{const source=fragment.replace('uniform int family,look,surface;','const int family='+family+';const int look='+look+';uniform int surface;');for(const [kind,code]of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,source]]){const shader=gl.createShader(kind);shaders.push(shader);gl.shaderSource(shader,code);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));gl.attachShader(program,shader);}gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));item={program,locations:new Map()};entry.programs.set(key,item);}catch(error){gl.deleteProgram(program);throw error;}finally{for(const shader of shaders)gl.deleteShader(shader);}}entry.program=item.program;entry.locations=item.locations;}
function render(g,p,t,s,E){try{let entry=entries.get('shared');if(entry?.lost){dispose('shared');entry=null;}entry=entry||create('shared');selectProgram(entry,s.engine==='space'?0:1,s.look);const gl=entry.gl,m=normalise(s.cosmos),edge=Math.min(s.quality||640,gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));const w=Math.max(32,Math.round(p.width*Math.min(1,edge/Math.max(p.width,p.height)))),h=Math.max(32,Math.round(p.height*Math.min(1,edge/Math.max(p.width,p.height))));if(entry.canvas.width!==w||entry.canvas.height!==h){entry.canvas.width=w;entry.canvas.height=h;}gl.useProgram(entry.program);gl.bindBuffer(gl.ARRAY_BUFFER,entry.buffer);const position=gl.getAttribLocation(entry.program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);gl.viewport(0,0,entry.canvas.width,entry.canvas.height);const set=(key,type,...values)=>{if(!entry.locations.has(key))entry.locations.set(key,gl.getUniformLocation(entry.program,key));gl[type](entry.locations.get(key),...values);};const a=E.signals(p,t,s);let seed=0;for(const c of String(p.seed)+m.seed)seed=(Math.imul(seed,31)+c.charCodeAt(0))>>>0;
set('resolution','uniform2f',entry.canvas.width,entry.canvas.height);set('family','uniform1i',s.engine==='space'?0:1);set('look','uniform1i',s.look);set('surface','uniform1i',['gas','ocean','mineral'].indexOf(m.surface));for(const [k,v]of Object.entries({...m,seed:(seed%10000)/1000,time:E.travel(p,t,s),beat:a.beat*s.reaction,bass:a.bass*s.reaction,high:a.treble*s.reaction,glow:s.glow,drift:s.drift,transparent:p.transparent?1:0}))if(typeof v==='number')set(k,'uniform1f',v);set('palette[0]','uniform3fv',new Float32Array(E.colours(p,t,s).flatMap(c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)/255))));gl.drawArrays(gl.TRIANGLES,0,6);g.drawImage(entry.canvas,0,0,p.width,p.height);failure='';return true;}catch(e){failure=e.message;throw e;}}
const api={normalise,render,release:dispose,reset(){for(const key of [...entries.keys()])dispose(key);},diagnostics:()=>({contexts:entries.size,error:failure,width:entries.get('shared')?.canvas.width||0,height:entries.get('shared')?.canvas.height||0})};if(typeof module!=='undefined')module.exports=api;else{root.PulseCosmicEnvironment=api;window.addEventListener('pagehide',api.reset);}
})(typeof globalThis!=='undefined'?globalThis:this);
