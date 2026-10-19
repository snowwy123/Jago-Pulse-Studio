// SPDX-License-Identifier: MIT
(function(root){'use strict';
const groups=['Light & atmosphere','Optical & geometric','Organic & flowing','Rhythm & signal','Pattern & print','Type & composition'];
const families=[];
function add(name,group,shape,looks,tags,legacy=false,type=false){families.push({name,group:groups[group],shape,tags:tags.split(' '),legacy,type,looks:looks.map((name,i)=>({id:['soft','structured','layered'][i],name,style:['round','angular','woven'][i],density:[.35,.6,.75][i],detail:[.45,.7,.6][i],depth:[.45,.75,.65][i],flow:[.55,1,.75][i],turbulence:[.25,.65,.8][i]}))});}
add('Light trails',0,'trails',['Silk','Electric threads','Braided current'],'flow ribbons luminous',true);
add('Photon filaments',0,'filaments',['Northern threads','Arc discharge','Filament loom'],'light strands vertical');
add('Aurora curtains',0,'aurora',['Veil','Solar folds','Polar ribbons'],'light curtains soft');
add('Light leaks',0,'leaks',['Warm exposure','Prism leak','Double exposure'],'film light atmosphere');
add('Drifting haze',0,'haze',['Low cloud','Smoke sheets','Colour mist'],'soft fog atmospheric');
add('Soft light',0,'bokeh',['Defocused lights','Glass planes','Luminous rings'],'soft bokeh light',true);
add('Prismatic beams',0,'beams',['Stage fan','Searchlight','Interlaced rays'],'rays stage light',true);
add('Optical tunnel',1,'tunnel',['Circular descent','Endless frames','Offset portals'],'depth geometry perspective',true);
add('Moiré interference',1,'moire',['Circular interference','Crossed screens','Woven interference'],'optical lines print');
add('Log spirals',1,'spirals',['Nautilus','Spiral spokes','Double helix'],'spiral optical curved');
add('Kaleidoscope',1,'kaleidoscope',['Petal glass','Prism facets','Mandala spokes'],'radial mirrored geometry');
add('Tessellated prisms',1,'prisms',['Honeycomb rise','Isometric city','Crystal mosaic'],'tiles isometric geometry');
add('Orbit studies',1,'rings',['Satellite','Mechanical orbit','Orbital choir'],'orbit rings shape',true);
add('Curl streams',2,'curl',['River threads','Turbulent currents','Curling eddies'],'flow organic streams');
add('Branching growth',2,'branches',['Sapling','Lightning tree','Coral canopy'],'growth branches organic');
add('Ripple pools',2,'ripples',['Still water','Polygon echoes','Intersecting pools'],'ripples rings water');
add('Ink blooms',2,'ink',['Watercolour bloom','Cut-paper bloom','Ink marbling'],'ink organic layered');
add('Cellular forms',2,'cells',['Soft cells','Living mosaic','Membrane network'],'cells organic tessellation');
add('Paper garden',2,'flower',['Eight-petal garden','Wild meadow','Layered rosette'],'flowers botanical paper',true);
add('Spectral landscape',3,'spectrum',['Frequency dunes','Ridge terrain','Spectral waterfall'],'audio spectrum terrain');
add('Oscilloscope forms',3,'scope',['Lissajous','Signal steps','Phase braid'],'audio scope curves');
add('Resonant bars',3,'bars',['Floating columns','Equaliser wall','Mirrored reeds'],'audio bars rhythm');
add('Radial pulses',3,'radial',['Orbit pulse','Radial ticks','Burst rings'],'audio radial beats');
add('Waveform ribbons',3,'waveform',['Amplitude silk','Peak folds','Braided envelope'],'audio waveform ribbons');
add('Signal field',3,'waves',['Sine field','Digital field','Interference field'],'signal waves grid',true);
add('Contour terrain',3,'contours',['Soft elevation','Angular strata','Woven topography'],'contour lines terrain',true);
add('Contour horizon',3,'horizon',['Distant hills','Mountain ridges','Layered horizon'],'terrain horizon perspective',true);
add('Particle ribbons',3,'particles',['Star drift','Orbital sparks','Particle braid'],'particles trails flow',true);
add('Living tiles',4,'tiles',['Blinking eyes','Turning blocks','Quarter-circle dance'],'tiles eyes repeat',true);
add('Woven ribbons',4,'weave',['Warp & weft','Paper weave','Shifting overpass'],'weave pattern print');
add('Halftone drift',4,'halftone',['Dot tide','Diamond screen','Interference dots'],'halftone print dots');
add('Rotating repeats',4,'rotating',['Petal turns','Diamond clockwork','Offset wheels'],'repeat rotation tiles');
add('Staggered motifs',4,'motifs',['Crescent tide','Star cascade','Bloom sequence'],'motif repeat stagger');
add('Kinetic type',5,'kinetic',['Headline reveal','Elastic pulse','Editorial rhythm'],'type headline poster',true,true);
add('Cascading words',5,'type-cascade',['Word rain','Stepped phrases','Ribbon of words'],'type cascading words',false,true);
add('Orbiting letters',5,'type-orbit',['Letter halo','Elliptical orbit','Spinning wheel'],'type letters circular',false,true);
add('Elastic headlines',5,'type-elastic',['Breathing words','Spring letters','Travelling ripple'],'type elastic headline',false,true);
add('Masked type',5,'type-mask',['Curtain reveal','Word shutters','Sliding bands'],'type masked reveal',false,true);
add('Editorial motion',5,'type-editorial',['Opening issue','Moving margins','Column rhythm'],'type editorial layout',false,true);
add('Orbital lattice',1,'lattice',['Wire satellites','Elliptic grid','Chord network'],'orbit lattice geometry');
add('Ribbon helix',2,'helix',['Double ribbon','Crossed strands','Braided helix'],'ribbon organic flow');
add('Interference discs',1,'discs',['Twin circles','Square interference','Four-point field'],'optical interference concentric');
add('Cubic corridor',1,'corridor',['Endless room','Tilted passage','Turning corridor'],'perspective tunnel depth');
add('Chromatic blobs',2,'blobs',['Soft islands','Living cutouts','Translucent pools'],'organic blobs colour');
add('Falling sparks',0,'sparks',['Firefly fall','Slanted rain','Ember drift'],'light particles sparks');
add('Concentric fans',4,'fans',['Arc rhythm','Quarter turns','Interwoven fans'],'pattern print arcs');
add('Typographic blocks',5,'type-blocks',['Type stack','Sliding columns','Layered headlines'],'type block poster',false,true);
const byName=Object.fromEntries(families.map(f=>[f.name,f]));
function hash(s){let n=2166136261;for(const c of String(s))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
function look(f,id,seed=''){return f.looks.find(v=>v.id===id)||f.looks[hash(seed)%f.looks.length];}
function build(name,i,colours,layer){let f=byName[name],visual=layer(`s${i}-visual`,f.type?'text':'shape',{name:f.type?'Headline':name,family:name,shape:f.shape,typeFx:f.type?f.shape:null,text:['LET IDEAS\nTAKE SHAPE','FOLLOW YOUR\nOWN RHYTHM','MAKE ROOM\nFOR WONDER'][i%3],size:f.type?.12:1,x:.5,y:.5,w:.86,h:.75,color:colours[3],coverage:f.type?'object':'frame',motion:'still',react:'energy',reactTarget:'speed',reactAmount:.5});return{recipe:name,background:colours[0],layers:[visual,...(f.type?[]:[layer(`s${i}-title`,'text',{name:'Headline',text:['A LITTLE\nWONDER','FIND YOUR\nRHYTHM','KEEP\nEXPLORING'][i%3],size:.115,color:colours[1],motion:'rise'})]),layer(`s${i}-label`,'text',{name:'Edition label',text:'JAGO PULSE / '+name.toUpperCase(),x:.5,y:.9,size:.022,color:colours[2],motion:'still'})]};}
function decorate(p,old){let strength=Math.max(0,Math.min(1,p.variationStrength??.5));for(let [i,s] of p.scenes.entries()){if(old?.[i]?.locked)continue;let f=byName[s.recipe];if(!f)continue;let v=look(f,p.familyVariant,p.seed+'-'+i);s.familyVariant=v.id;s.lookName=v.name;for(let [j,l] of s.layers.entries()){if(l.locked)continue;l.family=f.name;l.familyVariant=v.id;l.paletteRole=l.type==='text'?(l.size<.04?'highlight':'primary'):j%2?'highlight':'secondary';l.phaseOffset=(j%4)*.18*strength;l.evolution=p.evolution||'none';l.evolutionAmount=p.evolutionAmount??.35;if(l.type==='shape'){for(let key of ['density','detail','depth','flow','turbulence'])l[key]=Math.max(.05,Math.min(key==='flow'?2:1,v[key]+((hash(p.seed+l.id+key)%1000)/1000-.5)*strength*.35));l.substyle=v.style;l.petals=[8,6,12][f.looks.indexOf(v)];l.ringCount=[5,8,3][f.looks.indexOf(v)];}if(l.type==='text'&&f.type&&(l.size>.04)){if(!f.legacy)l.typeFx=f.shape;else if(v.id!=='soft')l.typeFx=v.id==='structured'?'type-elastic':'type-editorial';l.typeStyle=v.style;}l.secondaryMotion=p.secondaryMotion||'none';l.secondaryAmount=p.secondaryAmount??.2;}}return p;}
const api={groups,families,byName,hash,look,build,decorate};if(typeof module!=='undefined')module.exports=api;else root.PulseCatalogue=api;
})(typeof globalThis!=='undefined'?globalThis:this);
