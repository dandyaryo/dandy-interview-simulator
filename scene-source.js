import * as THREE from 'three';
import {SoftwareRenderer} from './software-renderer.js';
export class InterviewRoom {
 constructor(canvas,onSelect,onReady){
  this.canvas=canvas;this.onSelect=onSelect;this.started=false;this.mode='home';this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.sound=false;this.speaking=false;this.yaw=0;this.pitch=0;this.yawTarget=0;this.pitchTarget=0;this.time=0;
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#c6c6b2');this.scene.fog=new THREE.Fog('#8f9c87',15,40);
  this.camera=new THREE.PerspectiveCamera(54,innerWidth/innerHeight,.04,70);this.camera.position.set(-.2,1.8,4.4);this.camTarget=new THREE.Vector3(0,1.7,3.3);this.lookTarget=new THREE.Vector3(0,1.45,-1.5);this.currentLook=new THREE.Vector3(0,1.45,-1.5);
  try{this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});}catch{this.renderer=new SoftwareRenderer(canvas);}this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));this.renderer.setSize(innerWidth,innerHeight);this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.13;this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  this.pickables=[];this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();this.clock=new THREE.Clock();this.materials={};this.makeRoom();this.makeFurniture();this.makeDandy();this.makeViewer();this.makeHologram();this.setupInput();this.setScreen('THE INTERVIEW ROOM','Dandy Aryo Putra','AVIATION  /  ENGINEERING  /  HSSE  /  OPERATIONS');this.resize();requestAnimationFrame(()=>this.animate());onReady?.();
 }
 mat(c,metal=0,rough=.7){const key=c+','+metal+','+rough;return this.materials[key]??=(new THREE.MeshStandardMaterial({color:c,metalness:metal,roughness:rough}));}
 box(w,h,d,x,y,z,color,parent=this.scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d,Math.min(24,Math.ceil(w/.8)),Math.min(12,Math.ceil(h/.8)),Math.min(24,Math.ceil(d/.8))),typeof color==='string'?this.mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 sphere(rx,ry,rz,x,y,z,color,parent=this.scene){const m=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),typeof color==='string'?this.mat(color):color);m.scale.set(rx,ry,rz);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 cyl(rt,rb,h,x,y,z,color,parent=this.scene,n=20){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),typeof color==='string'?this.mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 rod(a,b,r,color,parent=this.scene){const v1=new THREE.Vector3(...a),v2=new THREE.Vector3(...b),delta=v2.clone().sub(v1);const o=this.cyl(r,r,delta.length(),...v1.clone().add(v2).multiplyScalar(.5).toArray(),color,parent,16);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return o;}
 texture(draw,w=1024,h=512){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy());return t;}
 planeTexture(tex,w,h,x,y,z,parent=this.scene){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h,Math.ceil(w/.8),Math.ceil(h/.8)),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));m.position.set(x,y,z);parent.add(m);return m;}
 textTexture(lines,bg='#e7e0cd',fg='#263c2c'){return this.texture((c,w,h)=>{c.fillStyle=bg;c.fillRect(0,0,w,h);c.fillStyle=fg;c.textAlign='center';lines.forEach((t,i)=>{c.font=(i===0?'500 38px':'26px')+' Georgia';c.fillText(t,w/2,100+i*80)});});}
 makeRoom(){
  const ambient=new THREE.HemisphereLight('#e2e8d3','#525a48',2.3);this.scene.add(ambient);
  const sun=new THREE.DirectionalLight('#fff0ce',3.1);sun.position.set(-7,9,1);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:.5,far:30});sun.shadow.bias=-.0004;this.scene.add(sun);
  const fill=new THREE.PointLight('#f3c58b',30,15,2);fill.position.set(2.8,3,-1);this.scene.add(fill);
  this.presentationLight=new THREE.PointLight('#cde7eb',0,12,2);this.presentationLight.position.set(2.3,2,-4.5);this.scene.add(this.presentationLight);
  const wood=this.texture((c,w,h)=>{c.fillStyle='#705443';c.fillRect(0,0,w,h);let s=7;for(let i=0;i<1200;i++){s=(s*16807)%2147483647;let p=s/2147483647;c.strokeStyle=`rgba(38,24,14,${p*.15})`;c.beginPath();c.moveTo(0,p*h);c.bezierCurveTo(w*.3,p*h+Math.sin(i)*4,w*.7,p*h-3,w,p*h);c.stroke();}},1024,1024);wood.wrapS=wood.wrapT=THREE.RepeatWrapping;wood.repeat.set(3,5);const floorMat=new THREE.MeshStandardMaterial({map:wood,roughness:.52});this.box(14,.15,17,0,-.1,0,floorMat);
  for(let i=-6;i<8;i++)this.box(.012,.004,17,i,.0,0,'#352f24');
  this.box(14,5.3,.25,0,2.55,-6.25,'#8c9480');this.box(.2,5.3,17,6.7,2.55,0,'#92947e');this.box(14,.15,17,0,5.15,0,'#d7d4bd');
  // Green wall, walnut joinery, and picture rail.
  for(let i=-6;i<=6;i++)this.box(.025,4.3,.06,i,2.6,-6.08,'#73816d');
  this.box(13.3,.08,.09,0,.3,-6.05,'#bfab83');
  // The tall left window opens onto a deliberately fictional skyline.
  this.box(.13,5.1,17,-6.7,2.5,0,'#c2c8b6');
  const sky=this.texture((c,w,h)=>{let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#a9c4be');g.addColorStop(.6,'#e6ddbb');g.addColorStop(1,'#8f9e8c');c.fillStyle=g;c.fillRect(0,0,w,h);for(let i=0;i<45;i++){const v=(Math.sin(i*17.4)+1)/2;c.fillStyle=i%2?'#a4b5a7':'#91a79a';c.fillRect(i*w/43,h*(.5+v*.22),w/35,h);for(let j=0;j<5;j++){c.fillStyle='#c9d0b8';c.fillRect(i*w/43+7,h*(.53+v*.22)+j*22,3,6)}}},2048,1024);
  const windowPlane=this.planeTexture(sky,12.5,4.45,-6.54,2.65,-.2);windowPlane.rotation.y=Math.PI/2;
  for(let z=-6;z<=6;z+=2.6)this.box(.14,4.9,.085,-6.48,2.6,z,'#424e40');this.box(.14,.1,13,-6.45,2.75,0,'#424e40');this.box(.14,.17,13,-6.45,.33,0,'#74795f');
  // Ceiling lighting.
  for(const x of [-3.2,3.2]){this.box(.04,.03,8,x,5.04,-.4,'#d7c7a1');const strip=new THREE.MeshBasicMaterial({color:'#fff0cb'});this.box(.025,.012,7.9,x,5.01,-.4,strip);}
  // Projection wall.
  this.box(4.5,2.8,.1,3.2,2.63,-6.03,'#343f34');this.box(4.15,2.4,.04,3.2,2.63,-5.96,'#e7e6d6');this.screenPlane=this.planeTexture(this.textTexture(['THE INTERVIEW ROOM','Dandy Aryo Putra']),4.06,2.3,3.2,2.63,-5.93);
  this.box(.55,.2,.35,2.4,4.65,-.9,'#cccbb9');this.sphere(.08,.07,.04,2.4,4.61,-1.085,'#9cb6ae');
  // Bookcase left of the screen.
  this.box(4.0,3.4,.55,-3.45,1.8,-5.8,'#594d3b');for(let y=.3;y<3.5;y+=.8){this.box(4.05,.07,.68,-3.45,y,-5.7,'#ad9271');for(let k=0;k<10;k++){const x=-5.3+k*.36;const bh=.28+(Math.sin(k*37+y*8)+1)*.11;this.box(.12+((k%3)*.03),bh,.22,x,y+.06+bh/2,-5.5,['#8f9c7c','#c6b38d','#6e8072','#cec8ae'][k%4]);}}
  for(let x=-5.5;x<-1.4;x+=1.35)this.box(.05,3.35,.65,x,1.82,-5.73,'#8e785a');
  // Gallery frame.
  const poster=this.textTexture(['PRECISION.','PERSPECTIVE.','PROGRESS.'],'#c8ccba','#4a5b47');this.box(1.65,1.9,.08,6.51,2.65,-2,'#776a4e').rotation.y=-Math.PI/2;const art=this.planeTexture(poster,1.5,1.75,6.45,2.65,-2);art.rotation.y=-Math.PI/2;
  this.makePlant(5.5,0,-4.6,1.7);this.makePlant(-5.4,0,1.6,1.2);
  // Leather sofa and side table.
  this.box(1.0,.45,3.1,5.65,.44,1.7,'#6c7560');this.box(.3,1.05,3.4,6.13,.7,1.7,'#596650');for(let z=.7;z<3.2;z+=1.05)this.box(.8,.19,.94,5.52,.73,z,'#7e876e');for(const z of [.05,3.35])this.box(1.15,.7,.2,5.6,.55,z,'#596650');
  this.cyl(.5,.5,.08,4.85,.7,-.45,'#a38a68');this.cyl(.05,.08,.65,4.85,.32,-.45,'#45513e');
 }
 makePlant(x,y,z,height){const group=new THREE.Group();group.position.set(x,y,z);this.scene.add(group);this.cyl(.22,.15,.4,0,.2,0,'#b3ae91',group);for(let i=0;i<12;i++){const a=i*2.4;const high=.5+height*(i%5)/6;const xx=Math.sin(a)*.32,zz=Math.cos(a)*.32;this.rod([0,.34,0],[xx,high,zz],.012,'#566945',group);const leaf=this.sphere(.1,.24,.035,xx,high,zz,['#5d7554','#768860','#8c9a70'][i%3],group);leaf.rotation.set(.4, a,.55*Math.sin(a));}return group;}
 makeChair(x,z,visitor=false){const g=new THREE.Group();g.position.set(x,0,z);this.scene.add(g);if(visitor)g.rotation.y=Math.PI;this.cyl(.07,.07,.47,0,.28,0,'#313c33',g);for(let a=0;a<Math.PI*2;a+=Math.PI/2.5)this.rod([0,.12,0],[Math.sin(a)*.46,.1,Math.cos(a)*.46],.028,'#4d5849',g);this.box(.7,.12,.7,0,.56,0,'#414d3f',g);this.box(.7,.8,.15,0,1,-.32,'#414d3f',g);this.sphere(.34,.2,.07,0,1.4,-.32,'#414d3f',g);for(const xx of [-.42,.42]){this.box(.08,.06,.46,xx,.86,.02,'#676f5d',g);this.rod([xx,.58,-.18],[xx,.84,-.18],.025,'#434e3e',g);}return g;}
 makeFurniture(){
  // Desk: broad oak surface, inset leather, bronzed framing.
  this.desk=new THREE.Group();this.scene.add(this.desk);
  const deskMap=this.texture((c,w,h)=>{c.fillStyle='#a18762';c.fillRect(0,0,w,h);for(let i=0;i<350;i++){let y=(i/350)*h;c.strokeStyle=`rgba(61,40,17,${.03+(i%5)*.012})`;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(w/3,y-7,w/2,y+5,w,y);c.stroke();}},1024,512);
  this.box(4.8,.13,2.9,0,.99,.12,new THREE.MeshStandardMaterial({map:deskMap,roughness:.44}),this.desk);this.box(4.76,.035,2.85,0,.91,.12,'#564d36',this.desk);
  for(const xx of [-2.05,2.05]){this.box(.16,.9,2.6,xx,.45,.12,'#59614b',this.desk);this.box(.17,.04,2.62,xx,.05,.12,'#b19a6c',this.desk);}
  this.box(1.6,.012,.82,0,1.066,1.02,'#3e5140',this.desk);
  this.makeChair(0,-1.92);
  // Dandy's folio, bound with a real paper block.
  this.book=new THREE.Group();this.book.position.set(-1.4,1.09,.15);this.book.rotation.y=.16;this.scene.add(this.book);this.box(.83,.07,1.05,0,.01,0,'#253e32',this.book);this.box(.77,.037,1.0,.014,.035,0,'#dfd9c6',this.book);this.box(.83,.018,1.05,0,.064,0,'#2a4939',this.book);const cover=this.planeTexture(this.textTexture(['DANDY ARYO PUTRA','PORTFOLIO','EXPERIENCE & CREDENTIALS'],'#2a4939','#d6be89'),.72,.9,0,.075,0,this.book);cover.rotation.x=-Math.PI/2;this.markPick(this.book,'book');
  // Career hologram dock.
  this.holoDock=this.cyl(.29,.33,.09,-.25,1.11,-.16,this.mat('#536c5a',.65,.3));this.markPick(this.holoDock,'career');const glowMat=new THREE.MeshBasicMaterial({color:'#9bddc0'});this.cyl(.255,.255,.012,-.25,1.16,-.16,glowMat);this.cyl(.055,.055,.024,-.25,1.17,-.16,'#c8e5cf');
  // Laptop screen faces Dandy, camera sees back, opens for presentation.
  this.laptop=new THREE.Group();this.laptop.position.set(1.3,1.08,-.35);this.laptop.rotation.y=-.24;this.scene.add(this.laptop);this.box(1.05,.035,.7,0,.015,0,this.mat('#7a8476',.65,.28),this.laptop);this.box(.89,.008,.3,0,.037,-.11,'#374b40',this.laptop);for(let i=0;i<4;i++)for(let j=0;j<11;j++)this.box(.062,.005,.044,-.39+j*.076,.045,-.22+i*.062,'#a6b39d',this.laptop);this.box(.24,.006,.13,0,.04,.18,'#969f8d',this.laptop);const lid=new THREE.Group();lid.position.set(0,.03,-.31);lid.rotation.x=-.18;this.laptop.add(lid);this.box(1.05,.68,.03,0,.34,0,'#6c796a',lid);this.planeTexture(this.textTexture(['DANDY','SYSTEMS & OPERATIONS'],'#16251e','#c9dbc2'),.98,.6,0,.34,.02,lid);this.markPick(this.laptop,'projects');
  // Contract laid at the visitor's right.
  this.contract=new THREE.Group();this.contract.position.set(1.35,1.075,1.02);this.contract.rotation.y=-.12;this.scene.add(this.contract);this.box(.56,.009,.77,0,0,0,'#eeeadc',this.contract);const paper=this.texture((c,w,h)=>{c.fillStyle='#ede9dc';c.fillRect(0,0,w,h);c.fillStyle='#52644f';c.font='38px Georgia';c.fillText('LET’S WORK',90,100);c.fillText('TOGETHER.',90,150);c.fillStyle='#999f88';for(let i=0;i<6;i++)c.fillRect(90,230+i*25,w-180-(i%3)*50,3);c.font='21px sans-serif';c.fillText('DANDY ARYO PUTRA',90,h-90);c.fillRect(90,h-60,w-180,2);},512,720);const page=this.planeTexture(paper,.54,.75,0,.007,0,this.contract);page.rotation.x=-Math.PI/2;this.markPick(this.contract,'contract');
  // Pen, coffee, and desk nameplate.
  this.rod([.52,1.095,.8],[.9,1.095,1.17],.012,'#baa16d');this.cyl(.105,.09,.16,-2,1.15,-.4,'#dfddc6');this.cyl(.089,.089,.003,-2,1.233,-.4,'#554333');const handle=new THREE.Mesh(new THREE.TorusGeometry(.059,.012,8,16),this.mat('#dfddc6'));handle.position.set(-2.12,1.16,-.4);this.scene.add(handle);
  this.box(.77,.12,.14,-.55,1.1,-1.0,'#61705a');const name=this.planeTexture(this.textTexture(['DANDY ARYO PUTRA'],'#61705a','#ebe1c3'),.74,.11,-.55,1.1,-.922);this.suitcase=this.box(.76,.45,.17,-.8,.25,-2.1,'#3f4c3c');
 }
 markPick(mesh,action){mesh.userData.action=action;this.pickables.push(mesh);}
 makeDandy(){
  this.avatar=new THREE.Group();this.avatar.position.set(0,.65,-1.92);this.scene.add(this.avatar);const g=this.avatar;const skin='#b88d6d',skinLight='#c69a78',hair='#242b25',suit='#344a3c',shirt='#d6d9c6';
  this.sphere(.29,.32,.17,0,.45,0,suit,g);this.box(.44,.48,.25,0,.38,0,suit,g);this.sphere(.17,.21,.04,0,.56,.155,shirt,g);
  const lapelL=this.box(.08,.4,.025,-.12,.56,.185,'#445c49',g);lapelL.rotation.z=.23;const lapelR=this.box(.08,.4,.025,.12,.56,.185,'#445c49',g);lapelR.rotation.z=-.23;
  this.cyl(.068,.075,.16,0,.84,.01,skin,g);this.box(.07,.08,.03,-.13,.68,.2,'#c9b580',g);
  this.head=new THREE.Group();this.head.position.set(0,1.04,0);g.add(this.head);const h=this.head;
  this.sphere(.155,.205,.147,0,0,0,skinLight,h);this.sphere(.13,.1,.125,0,-.12,.02,skin,h);for(const x of [-.155,.155])this.sphere(.026,.051,.028,x,-.012,0,skin,h);
  this.sphere(.158,.11,.149,0,.12,-.014,hair,h);this.sphere(.14,.08,.145,.015,.177,-.018,hair,h);this.sphere(.035,.1,.05,-.136,.07,0,hair,h);this.sphere(.028,.08,.048,.137,.08,-.005,hair,h);
  this.eyes=[];for(const x of [-.058,.058]){const e=this.sphere(.032,.012,.012,x,.022,.133,'#e2dfce',h);this.sphere(.01,.011,.005,x,.022,.144,'#303a2d',h);this.eyes.push(e);const eyebrow=this.box(.057,.011,.01,x,.059,.132,hair,h);eyebrow.rotation.z=x<0?.06:-.06;}
  this.sphere(.021,.047,.034,0,-.013,.143,skin,h);this.sphere(.029,.014,.021,0,-.041,.157,skin,h);
  this.mouth=this.sphere(.043,.006,.009,0,-.09,.139,'#855744',h);this.sphere(.05,.019,.012,0,-.112,.121,skin,h);
  this.leftArm=new THREE.Group();this.leftArm.position.set(-.29,.68,0);g.add(this.leftArm);this.rightArm=new THREE.Group();this.rightArm.position.set(.29,.68,0);g.add(this.rightArm);
  this.makeArm(this.leftArm,-1,skin,suit);this.makeArm(this.rightArm,1,skin,suit);
  this.legs=new THREE.Group();g.add(this.legs);for(const x of [-.14,.14]){this.rod([x,.17,.02],[x,-.05,.4],.105,'#3c4b3c',this.legs);this.rod([x,-.05,.4],[x,-.48,.45],.08,'#3c4b3c',this.legs);this.sphere(.09,.06,.18,x,-.53,.52,'#2e352b',this.legs);}
  this.standLegs=new THREE.Group();this.standLegs.visible=false;g.add(this.standLegs);for(const x of [-.13,.13]){this.rod([x,.16,0],[x,-.35,.02],.1,'#3c4b3c',this.standLegs);this.rod([x,-.35,.02],[x,-.8,.04],.077,'#3c4b3c',this.standLegs);this.sphere(.09,.065,.17,x,-.86,.14,'#2e352b',this.standLegs);}
  this.markPick(g,'talk');this.avatarTarget=new THREE.Vector3(0,.65,-1.92);
 }
 makeArm(group,side,skin,suit){this.sphere(.11,.13,.12,0,0,0,suit,group);this.rod([0,0,0],[side*.10,-.3,.12],.075,suit,group);this.rod([side*.1,-.3,.12],[side*.08,-.33,.4],.061,suit,group);this.cyl(.065,.065,.05,side*.08,-.33,.39,'#d6d9c6',group);const hand=this.sphere(.064,.035,.11,side*.08,-.31,.48,skin,group);for(let i=0;i<4;i++)this.sphere(.012,.018,.057,side*.08-.044+i*.026,-.313,.555,skin,group);this.sphere(.023,.025,.052,side*.08-side*.06,-.3,.46,skin,group);}
 makeViewer(){
  this.viewer=new THREE.Group();this.viewer.visible=false;this.scene.add(this.viewer);this.box(.48,.36,.27,0,.94,2.9,'#465446',this.viewer);for(const x of [-.2,.2]){this.rod([x,.7,2.86],[x,.54,2.26],.13,'#3e4b3e',this.viewer);this.rod([x,.54,2.26],[x,.13,2.22],.09,'#3e4b3e',this.viewer);this.sphere(.1,.075,.2,x,.10,2.1,'#33382d',this.viewer);}
  for(const side of [-1,1]){this.rod([side*.32,1.32,2.95],[side*.6,.95,2.42],.09,'#58624e',this.viewer);this.rod([side*.6,.95,2.42],[side*.72,1.10,1.75],.075,'#58624e',this.viewer);this.sphere(.075,.045,.13,side*.72,1.10,1.61,'#c09a77',this.viewer);for(let i=0;i<4;i++)this.sphere(.013,.02,.077,side*.72-.047+i*.029,1.105,1.51,'#c09a77',this.viewer);this.sphere(.026,.03,.07,side*.72-side*.07,1.1,1.62,'#c09a77',this.viewer);}
 }
 makeHologram(){this.hologram=new THREE.Group();this.hologram.position.set(-.25,1.18,-.16);this.scene.add(this.hologram);const holoMat=new THREE.MeshBasicMaterial({color:'#a8e1bd',transparent:true,opacity:.3,wireframe:true});for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.18+i*.055,.003,8,50),new THREE.MeshBasicMaterial({color:'#bce9c7',transparent:true,opacity:.65}));ring.rotation.x=Math.PI/2;ring.position.y=.05+i*.12;this.hologram.add(ring);}
  this.holoModel=new THREE.Group();this.holoModel.position.y=.36;this.hologram.add(this.holoModel);this.holoMaterial=holoMat;this.setEra(0);this.holoLight=new THREE.PointLight('#84e7ac',.7,2);this.holoLight.position.set(0,.3,0);this.hologram.add(this.holoLight);
 }
 setEra(index){this.era=index;while(this.holoModel.children.length){const m=this.holoModel.children[0];this.holoModel.remove(m);m.traverse(x=>{x.geometry?.dispose()});}const g=this.holoModel,mat=this.holoMaterial;
  if(index===0){const f=this.sphere(.055,.055,.3,0,0,0,mat,g);this.box(.6,.012,.09,0,-.01,-.01,mat,g);this.box(.2,.012,.06,0,.02,.22,mat,g);this.box(.012,.12,.09,0,.05,.23,mat,g);for(let x of [-.11,.11]){const e=this.cyl(.035,.035,.13,x,-.04,-.04,mat,g,16);e.rotation.x=Math.PI/2;}}
  else if(index===1){for(let x of [-.18,0,.18]){const h=x===0?.52:.34;this.box(.13,h,.16,x,h/2-.17,0,mat,g);}this.box(.65,.02,.4,0,-.18,0,mat,g);}
  else if(index===2){const ring=new THREE.Mesh(new THREE.TorusGeometry(.22,.025,10,6),mat);g.add(ring);this.box(.12,.15,.015,0,0,.03,mat,g);this.box(.05,.26,.015,0,0,.03,mat,g);this.box(.26,.05,.015,0,0,.03,mat,g);}
  else{for(let y=0;y<3;y++)for(let x=0;x<=y;x++){const xx=(x-y/2)*.25,yy=.22-y*.17;this.box(.16,.09,.06,xx,yy,0,mat,g);if(y>0)this.rod([0,.22,0],[xx,yy,0],.004,mat,g);}}
 }
 setScreen(title,subtitle,footer='DANDY ARYO PUTRA'){this.screenRequest=(this.screenRequest||0)+1;const tex=this.texture((c,w,h)=>{c.fillStyle='#17291f';c.fillRect(0,0,w,h);c.strokeStyle='#7e9971';c.lineWidth=1;c.strokeRect(35,35,w-70,h-70);c.textAlign='left';c.fillStyle='#b3c2a7';c.font='16px sans-serif';c.fillText('DANDY  /  THE INTERVIEW ROOM',70,85);c.fillStyle='#e6d6b3';c.font='42px Georgia';const words=String(title).split(' ');let line='',yy=210;for(const word of words){const next=line+word+' ';if(c.measureText(next).width>w-150&&line){c.fillText(line,70,yy);line=word+' ';yy+=50}else line=next;}c.fillText(line,70,yy);c.fillStyle='#b4c5a9';c.font='23px sans-serif';c.fillText(String(subtitle).slice(0,65),70,yy+60);c.fillStyle='#9eaf8f';c.font='13px sans-serif';c.fillText(footer.slice(0,95),70,h-60);},1024,576);if(this.screenPlane.material.map)this.screenPlane.material.map.dispose();this.screenPlane.material.map=tex;this.screenPlane.material.needsUpdate=true;}
 setSystemScreen(id){const request=++this.screenRequest;new THREE.TextureLoader().load(id+'.jpg',tex=>{if(request!==this.screenRequest){tex.dispose();return;}tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy());this.screenPlane.material.map?.dispose();this.screenPlane.material.map=tex;this.screenPlane.material.needsUpdate=true;},undefined,()=>{});}
 resetOffer(){this.contractTarget=null;this.contract.position.set(1.35,1.075,1.02);}
 focus(mode){this.mode=mode;this.yawTarget=this.pitchTarget=0;const compact=innerWidth<650;
  const views={home:[[0,1.72,3.3],[0,1.33,-1.5]],talk:[[0,1.72,2.4],[0,1.66,-1.92]],book:[[-.45,1.95,2.7],[-1.25,1.09,0]],career:[[-.12,1.72,2.65],[-.25,1.44,-.16]],projects:[[-1.35,1.9,2.5],[2.25,2,-5.8]],contract:[[0,1.85,3.05],[1.1,1.08,.75]]};const pair=views[mode]||views.home;this.camTarget.fromArray(pair[0]);this.lookTarget.fromArray(pair[1]);this.isPresenting=mode==='projects';this.avatarTarget.set(this.isPresenting?.75:0,this.isPresenting?.94:.65,this.isPresenting?-4.65:-1.92);this.legs.visible=!this.isPresenting;this.standLegs.visible=this.isPresenting;this.presentationLight.intensity=this.isPresenting?18:0;this.holoLight.intensity=mode==='career'?1.7:.6;
 }
 offerContract(){this.contractTarget=new THREE.Vector3(.25,1.08,-.85);this.reachTime=2.5;}
 enter(){this.started=true;this.viewer.visible=true;this.focus('home');}
 setupInput(){let down=false,startX=0,startY=0,moved=0,lastX=0,lastY=0;
  this.canvas.addEventListener('pointerdown',e=>{if(!this.started)return;down=true;startX=lastX=e.clientX;startY=lastY=e.clientY;moved=0;this.canvas.setPointerCapture(e.pointerId);});
  this.canvas.addEventListener('pointermove',e=>{if(!down||!this.started||this.panelOpen)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;moved+=Math.abs(dx)+Math.abs(dy);lastX=e.clientX;lastY=e.clientY;this.yawTarget=THREE.MathUtils.clamp(this.yawTarget-dx*.003,-.95,.95);this.pitchTarget=THREE.MathUtils.clamp(this.pitchTarget-dy*.003,-.7,.9);});
  this.canvas.addEventListener('pointerup',e=>{down=false;if(!this.started||this.panelOpen||moved>8)return;const r=this.canvas.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);this.raycaster.setFromCamera(this.pointer,this.camera);const hits=this.raycaster.intersectObjects(this.pickables,true);if(hits.length){let o=hits[0].object;while(o&&!o.userData.action)o=o.parent;if(o)this.onSelect(o.userData.action);}});
  this.canvas.addEventListener('pointercancel',()=>down=false);addEventListener('resize',()=>this.resize());addEventListener('keydown',e=>{if(!this.started||this.panelOpen||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;if(e.key==='ArrowLeft')this.yawTarget+=.12;if(e.key==='ArrowRight')this.yawTarget-=.12;if(e.key==='ArrowUp')this.pitchTarget-=.1;if(e.key==='ArrowDown')this.pitchTarget+=.1;this.yawTarget=THREE.MathUtils.clamp(this.yawTarget,-.95,.95);this.pitchTarget=THREE.MathUtils.clamp(this.pitchTarget,-.7,.9);});
 }
 resize(){this.camera.aspect=innerWidth/innerHeight;this.camera.fov=innerWidth<650?67:54;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight);}
 setQuality(low){this.renderer.setPixelRatio(Math.min(devicePixelRatio,low?1:1.6));this.renderer.shadowMap.enabled=!low;this.renderer.setSize(innerWidth,innerHeight);}
 projectPoint(vec){const p=new THREE.Vector3(...vec).project(this.camera);return{x:(p.x*.5+.5)*innerWidth,y:(-p.y*.5+.5)*innerHeight,visible:p.z<1&&p.x>-1&&p.x<1&&p.y>-1&&p.y<1};}
 animate(){requestAnimationFrame(()=>this.animate());const dt=Math.min(this.clock.getDelta(),.05);this.time+=dt;const t=this.time;const rate=this.reduced?1:1-Math.exp(-dt*4);
  if(!this.started){this.camTarget.set(-.5,1.95,4.4);this.lookTarget.set(.4,1.5,-1.5);}
  this.camera.position.lerp(this.camTarget,rate);this.currentLook.lerp(this.lookTarget,rate);this.yaw=THREE.MathUtils.lerp(this.yaw,this.yawTarget,rate);this.pitch=THREE.MathUtils.lerp(this.pitch,this.pitchTarget,rate);const direction=this.currentLook.clone().sub(this.camera.position);const sph=new THREE.Spherical().setFromVector3(direction);sph.theta+=this.yaw;sph.phi=THREE.MathUtils.clamp(sph.phi+this.pitch,.15,Math.PI-.1);direction.setFromSpherical(sph);this.camera.lookAt(this.camera.position.clone().add(direction));
  this.avatar.position.lerp(this.avatarTarget,rate*.7);this.avatar.rotation.y=THREE.MathUtils.lerp(this.avatar.rotation.y,this.isPresenting?-.22:0,rate);if(!this.reduced){this.head.rotation.y=Math.sin(t*.38)*.025;this.head.rotation.z=this.speaking?Math.sin(t*2.8)*.025:Math.sin(t*.4)*.012;this.head.position.y=1.04+Math.sin(t*1.7)*.003;const blink=t%5.4<.13?.08:1;this.eyes.forEach(e=>e.scale.y=.012*blink);this.mouth.scale.y=this.speaking?.006+Math.abs(Math.sin(t*13))*.014:.006;this.rightArm.rotation.x=this.isPresenting?-.42+(this.speaking?Math.sin(t*2)*.07:0):(this.speaking?Math.sin(t*2)*.035:0);this.leftArm.rotation.x=this.speaking?Math.sin(t*1.3)*.035:0;this.holoModel.rotation.y=t*.32;this.hologram.rotation.y=Math.sin(t*.3)*.1;}
  if(this.contractTarget)this.contract.position.lerp(this.contractTarget,rate*.5);if(this.reachTime>0){this.reachTime-=dt;this.rightArm.rotation.x=-.5*Math.sin((this.reachTime/2.5)*Math.PI);}
  if(!document.hidden){this.renderer.render(this.scene,this.camera);this.onFrame?.();}
 }
}
