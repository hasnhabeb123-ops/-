import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const COLS=10,ROWS=13;
const ROUTES=[[[0,1],[8,1],[8,4],[1,4],[1,7],[8,7],[8,10],[3,10],[3,12]],[[0,2],[2,2],[2,10],[4,10],[4,2],[6,2],[6,10],[8,10],[8,12]],[[0,6],[3,6],[3,1],[7,1],[7,9],[1,9],[1,12]],[[0,11],[5,11],[5,7],[1,7],[1,3],[8,3],[8,12]],[[0,4],[2,4],[2,10],[5,10],[5,2],[8,2],[8,12]],[[0,8],[5,8],[5,5],[2,5],[2,1],[7,1],[7,12]],[[0,1],[4,1],[4,6],[9,6],[9,10],[2,10],[2,12]],[[0,10],[2,10],[2,3],[6,3],[6,8],[9,8],[9,12]],[[0,6],[4,6],[4,2],[8,2],[8,9],[3,9],[3,12]],[[0,3],[6,3],[6,6],[1,6],[1,9],[5,9],[5,12]]];
const THEMES=['الغابة','الوادي','البركان','الجليد','الصحراء','المستنقع','القلعة','الخرائب','السماء','العالم المظلم'];
const STAGES=Array.from({length:100},(_,i)=>({n:'المستوى '+(i+1)+' · '+THEMES[Math.floor(i/5)%THEMES.length],level:i+1,waves:Math.min(20,8+Math.floor(i/8)),hp:1+i*.105,rw:1+i*.018,m:100+Math.floor(i/5)*12,wp:ROUTES[i%ROUTES.length]}));
const BONUS=Array.from({length:10},(_,k)=>({n:'مرحلة الوحش '+(k+1)+' · الوحوش',bonus:true,k,waves:2,hp:(1+((k+1)*10-1)*.105)*1.5,rw:1+((k+1)*10-1)*.018,wp:ROUTES[(k*3+1)%ROUTES.length]}));
const LEVEL_COLORS=[0x6cf0c4,0xffd166,0xff665f];
const TT=[
 {n:'برج الرماة',cost:50,r:2.8,rate:.52,dmg:10,icon:'🏹',color:0x55d6a6,kind:'archer'},
 {n:'مدفع ثقيل',cost:95,r:2.9,rate:1.25,dmg:27,icon:'💣',color:0xffc857,kind:'cannon'},
 {n:'برج القناص',cost:140,r:4.8,rate:2.45,dmg:82,icon:'🎯',color:0x66b8ff,kind:'sniper'},
 {n:'برج الصقيع',cost:115,r:2.65,rate:1.05,dmg:12,icon:'❄️',color:0x7be8ff,kind:'frost'},
 {n:'برج السم',cost:125,r:2.8,rate:.85,dmg:9,icon:'☠️',color:0x9be34c,kind:'poison'},
 {n:'برج البرق',cost:165,r:3.2,rate:1.05,dmg:24,icon:'⚡',color:0xd9a5ff,kind:'lightning'},
 {n:'برج اللهب',cost:150,r:2.45,rate:.32,dmg:8,icon:'🔥',color:0xff784f,kind:'flame'},
 {n:'برج البلور',cost:180,r:3.4,rate:1.35,dmg:35,icon:'💎',color:0x6cf0e2,kind:'crystal'},
 {n:'برج الحراس',cost:130,r:2.6,rate:.7,dmg:16,icon:'🛡️',color:0xe3c17b,kind:'guardian'},
 {n:'برج المدارات',cost:205,r:3.0,rate:.62,dmg:21,icon:'🌀',color:0xff7ec5,kind:'orbital'},
 {n:'برج التنين',cost:240,r:3.3,rate:1.45,dmg:56,icon:'🐉',color:0xff525f,kind:'dragon'},
 {n:'برج النبض',cost:190,r:3.5,rate:1.1,dmg:32,icon:'🟣',color:0xc56bff,kind:'pulse'}
];
const ET=[
 {n:'الوحل الصغير',hp:28,s:1.05,rew:7,color:0x65dc9a,r:.24,shape:'slime'},
 {n:'العدّاء',hp:22,s:2.05,rew:8,color:0xffb66e,r:.19,shape:'runner'},
 {n:'المدرّع',hp:95,s:.62,rew:14,color:0x8c9aa4,r:.31,shape:'tank',ability:'armor'},
 {n:'المعالج',hp:54,s:.78,rew:15,color:0x7dffdf,r:.25,shape:'healer',ability:'heal'},
 {n:'حامل الدرع',hp:70,s:.78,rew:14,color:0x64b8ff,r:.27,shape:'shield',ability:'shield'},
 {n:'المنقسم',hp:48,s:.9,rew:13,color:0xc8e86b,r:.26,shape:'split',ability:'split'},
 {n:'المتجدّد',hp:62,s:.7,rew:13,color:0x64bd5c,r:.26,shape:'regen',ability:'regen'},
 {n:'الخفّاش الطائر',hp:35,s:1.5,rew:12,color:0x9b83ff,r:.23,shape:'bat',ability:'evasive'},
 {n:'الشبح',hp:45,s:1.15,rew:14,color:0xb4c6ff,r:.25,shape:'ghost',ability:'stealth'},
 {n:'المفجّر',hp:58,s:1.0,rew:16,color:0xff6b48,r:.29,shape:'bomb',ability:'bomb'},
 {n:'جليدي',hp:80,s:.72,rew:17,color:0x7be8ff,r:.29,shape:'ice',ability:'frost'},
 {n:'قائد السرعة',hp:65,s:.82,rew:18,color:0xffdf69,r:.27,shape:'horn',ability:'haste'},
 {n:'سامّ',hp:68,s:.8,rew:18,color:0x9be34c,r:.28,shape:'poison',ability:'poison'},
 {n:'الومضة',hp:48,s:1.05,rew:18,color:0xffedbd,r:.22,shape:'blink',ability:'dash'},
 {n:'فارس الحديد',hp:155,s:.52,rew:23,color:0x8995a6,r:.34,shape:'knight',ability:'armor'},
 {n:'حارس الهالة',hp:100,s:.65,rew:22,color:0xe08cff,r:.3,shape:'aura',ability:'protect'},
 {n:'الطفيلي',hp:75,s:.9,rew:20,color:0xf58cbe,r:.28,shape:'leech',ability:'regen'},
 {n:'الحفّار',hp:88,s:.85,rew:21,color:0xb88962,r:.3,shape:'burrow',ability:'evasive'},
 {n:'البلّوري',hp:125,s:.62,rew:24,color:0x8bfff3,r:.32,shape:'crystal',ability:'shield'},
 {n:'اللص الذهبي',hp:42,s:1.7,rew:32,color:0xffd166,r:.22,shape:'gold'},
 {n:'التنين الصغير',hp:145,s:.78,rew:28,color:0xff795e,r:.33,shape:'dragon',ability:'fire'},
 {n:'مستحضر الظلال',hp:160,s:.58,rew:30,color:0x8d71c9,r:.34,shape:'necromancer',ability:'summon'},
 {n:'العملاق',hp:360,s:.38,rew:55,color:0xb98aff,r:.43,shape:'giant',ability:'armor'},
 {n:'ملك الوحوش',hp:650,s:.48,rew:100,color:0xff416a,r:.48,shape:'king',ability:'boss'}
];
const $=id=>document.getElementById(id),cv=$('c');
const renderer=new THREE.WebGLRenderer({canvas:cv,antialias:false,alpha:false,powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setClearColor(0x17251c,1);renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x17251c);
const camera=new THREE.OrthographicCamera(-4,4,5.5,-5.5,.1,100);camera.up.set(0,0,-1);camera.position.set(COLS/2,17,ROWS/2+10);camera.lookAt(COLS/2,0,ROWS/2);
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),groundPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
scene.add(new THREE.HemisphereLight(0xdaf8e4,0x33472d,2.1));const sun=new THREE.DirectionalLight(0xfff1d2,2.2);sun.position.set(-5,16,-6);scene.add(sun);
const ground=new THREE.Group();scene.add(ground);const towerGroup=new THREE.Group();scene.add(towerGroup);const enemyGroup=new THREE.Group();scene.add(enemyGroup);const shotGroup=new THREE.Group();scene.add(shotGroup);const fxGroup=new THREE.Group();scene.add(fxGroup);
const mat=(color,roughness=.9,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const mats={grass:[mat(0x28563a),mat(0x2d603e),mat(0x315b3a)],road:mat(0x806443),roadEdge:mat(0x604b35),tile:mat(0x416c45),leaf:mat(0x1f6a3b),leaf2:mat(0x2f8249),trunk:mat(0x795135),stone:mat(0x6d7b70),gold:mat(0xffd166),white:mat(0xf3f7e8),dark:mat(0x233127),hp:mat(0x60e08a),red:mat(0xff7185)};
const TERRAIN_PALETTES=[[0x28563a,0x2d603e,0x315b3a,0x806443,0x604b35,0x1f6a3b,0x2f8249],[0x48704a,0x557d50,0x648957,0xa58a60,0x806947,0x2b7040,0x4a9654],[0x4b352c,0x68402d,0x7b4a31,0x4e4140,0x342b2b,0x8b3929,0xc45b32],[0x8eb8bf,0x9fcbd0,0x6d9ca8,0xc0d1d0,0x718d98,0x427e8d,0x63a4b2],[0xb5a05b,0xc6ae69,0xd5bd7b,0x9b7950,0x745a3d,0x777c3a,0x9b9a43],[0x31564a,0x3c6652,0x4b7255,0x625a43,0x403b2d,0x23513d,0x39744b],[0x657c63,0x71866a,0x839477,0x8a8779,0x555d55,0x3d6b47,0x578352],[0x58576b,0x65627b,0x77718b,0x777078,0x494752,0x45476e,0x6268a0],[0x5a9da0,0x69afb0,0x82c1bd,0x9a997d,0x686c68,0x317b85,0x4a9aa2],[0x282c3e,0x33364b,0x3b3b55,0x4c414e,0x2b2834,0x302747,0x4d3768]];
const geo={box:new THREE.BoxGeometry(1,1,1),cyl:new THREE.CylinderGeometry(.36,.43,.18,8),sphere:new THREE.SphereGeometry(1,8,6),cone:new THREE.ConeGeometry(.42,.55,7),smallCone:new THREE.ConeGeometry(.25,.34,6),barrel:new THREE.CylinderGeometry(.09,.12,.72,7),rod:new THREE.CylinderGeometry(.035,.035,.62,5),ring:new THREE.TorusGeometry(.42,.035,5,14)};
let C=32,pts=[],cum=[],total=0,road=new Set(),stage=STAGES[0],si=0,prog=0;
try{prog=Number(localStorage.getItem('td-prog'))||0}catch{}
let modeProgress={survival:0,challenge:0,boss:0};try{modeProgress=Object.assign(modeProgress,JSON.parse(localStorage.getItem('td-mode-progress')||'{}'))}catch{}
const saveModeProgress=()=>{try{localStorage.setItem('td-mode-progress',JSON.stringify(modeProgress))}catch{}};
const modeRoute=(r,m)=>r.map(([x,y])=>m==='survival'?[9-x,y]:m==='challenge'?[x,12-y]:[9-x,12-y]);
const MODE_STAGES={survival:Array.from({length:30},(_,i)=>({...STAGES[i],n:'البقاء · المنطقة '+(i+1),waves:999,hp:1+i*.13,rw:1+i*.025,wp:modeRoute(ROUTES[i%ROUTES.length],'survival')})),challenge:Array.from({length:30},(_,i)=>({...STAGES[i],n:'التحدي · التحدي '+(i+1),waves:6+Math.floor(i/4),hp:1+i*.12,rw:1+i*.02,wp:modeRoute(ROUTES[i%ROUTES.length],'challenge')})),boss:Array.from({length:30},(_,i)=>({...STAGES[i],n:'الزعماء · الزعيم '+(i+1),waves:3+Math.floor(i/6),hp:1+i*.16,rw:1+i*.03,wp:modeRoute(ROUTES[i%ROUTES.length],'boss')}))};
let gems=0,abilityStock=[0,0,0,0],bonusDone=[];
try{gems=Number(localStorage.getItem('td-gems'))||0;abilityStock=JSON.parse(localStorage.getItem('td-abil')||'[0,0,0,0]');bonusDone=JSON.parse(localStorage.getItem('td-bonus')||'[]')}catch{}
if(!Array.isArray(abilityStock)||abilityStock.length!==4)abilityStock=[0,0,0,0];
if(!Array.isArray(bonusDone))bonusDone=[];
const saveMeta=()=>{try{localStorage.setItem('td-gems',String(gems));localStorage.setItem('td-abil',JSON.stringify(abilityStock));localStorage.setItem('td-bonus',JSON.stringify(bonusDone))}catch{}};
// v0.1.2 persistent progression systems (kept separate from the v0.0.9 save keys).
const readJSON=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
let extra=readJSON('js-extra-v1',{coins:0,units:{infantry:0,archer:0,swords:0},unitLv:1,perm:0,ach:{kills:0,wins:0,boss:0,clean:0},claimed:{},daily:''});
if(!extra||typeof extra!=='object')extra={coins:0,units:{infantry:0,archer:0,swords:0},unitLv:1,perm:0,ach:{kills:0,wins:0,boss:0,clean:0},claimed:{},daily:''};
extra.units=extra.units||{infantry:0,archer:0,swords:0};extra.ach=extra.ach||{kills:0,wins:0,boss:0,clean:0};extra.claimed=extra.claimed||{};
extra.unitPoints=Number.isFinite(extra.unitPoints)?extra.unitPoints:0;
extra.unitLevels=extra.unitLevels||{infantry:1,archer:1,swords:1};
const saveExtra=()=>{try{localStorage.setItem('js-extra-v1',JSON.stringify(extra))}catch{}};
let soldiers=[],soldierMeshes=[],unitBuild=null,gameMode='campaign',modeWave=0,bossRewarded=false,sessionKills=0,panelFromHome=false;
const UNIT={infantry:{name:'مشاة',icon:'🪖',cost:65,hp:95,range:1.55,dmg:13,rate:.8},archer:{name:'رامٍ',icon:'🏹',cost:85,hp:55,range:3.3,dmg:17,rate:1.15},swords:{name:'مبارز',icon:'⚔️',cost:75,hp:125,range:1.2,dmg:24,rate:1.05}};
for(const k of Object.keys(UNIT))extra.unitLevels[k]=Math.max(1,Math.min(5,Number(extra.unitLevels[k])||1));

const GEM_W=[32,26,20,12,7,3];
function gemRoll(){let r=Math.random()*100,a=0;for(let i=0;i<6;i++){a+=GEM_W[i];if(r<a)return i+1}return 1}
function toast(t){const el=$('gemToast');el.textContent=t;el.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>el.classList.remove('show'),2200)}
let towers=[],enemies=[],shots=[],money=150,lives=10,wave=0,leaderCooldown=0,spawnQ=[],spawnT=0,active=false,speed=1,build=null,sel=null,mv=null,over=false,last=0,tm=0,intermissionTimer=0;
let towerMeshes=new Map(),enemyMeshes=new Map(),shotMeshes=new Map(),tileMeshes=[],decor=[];
const v3=(x,y,z)=>new THREE.Vector3(x,y,z);
function setMap(WP){pts=[[-1,WP[0][1]],...WP,[WP[WP.length-1][0],ROWS]].map(p=>[p[0]+.5,p[1]+.5]);cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));total=cum.at(-1);road=new Set();for(let i=1;i<WP.length;i++){const[a,b]=WP[i-1],[x,y]=WP[i],dx=Math.sign(x-a),dy=Math.sign(y-b);let cx=a,cy=b;while(cx!==x||cy!==y){road.add(cx+','+cy);cx+=dx;cy+=dy}road.add(x+','+y)}}
function pos(d){let i=1;while(i<pts.length-1&&cum[i]<d)i++;const k=(d-cum[i-1])/(cum[i]-cum[i-1]);return[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*k,pts[i-1][1]+(pts[i][1]-pts[i-1][1])*k]}
function clearGroup(g){while(g.children.length){const o=g.children[g.children.length-1];g.remove(o);o.traverse?.(m=>{if(m.geometry && !Object.values(geo).includes(m.geometry))m.geometry.dispose()})}}
function addMesh(g,geometry,material,x,y,z,sx=1,sy=1,sz=1){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=false;m.receiveShadow=false;g.add(m);return m}
function makeTree(x,z,scale=1){const g=new THREE.Group();g.position.set(x,0,z);addMesh(g,geo.cyl,mats.trunk,0,.22*scale,0,.62*scale,2.6*scale,.62*scale);addMesh(g,geo.cone,mats.leaf,0,.65*scale,0,1.5*scale,1.5*scale,1.5*scale);addMesh(g,geo.cone,mats.leaf2,-.12*scale,.98*scale,.06*scale,1.1*scale,1.2*scale,1.1*scale);ground.add(g);decor.push(g)}
function buildWorld(){const pal=TERRAIN_PALETTES[Math.floor(si/5)%TERRAIN_PALETTES.length];mats.grass.forEach((m,i)=>m.color.setHex(pal[i]));mats.road.color.setHex(pal[3]);mats.roadEdge.color.setHex(pal[4]);mats.leaf.color.setHex(pal[5]);mats.leaf2.color.setHex(pal[6]);clearGroup(ground);clearGroup(towerGroup);clearGroup(enemyGroup);clearGroup(shotGroup);clearGroup(fxGroup);decor=[];towerMeshes.clear();enemyMeshes.clear();shotMeshes.clear();
 const floor=addMesh(ground,new THREE.BoxGeometry(COLS,.18,ROWS),mat(0x23452e),COLS/2,-.14,ROWS/2,COLS,1,ROWS);floor.visible=false;
 for(let x=0;x<COLS;x++)for(let z=0;z<ROWS;z++){const onRoad=road.has(x+','+z);const tile=addMesh(ground,geo.box,onRoad?mats.road:mats.grass[(x+z)%mats.grass.length],x+.5,-.06,z+.5,.97,.12,.97);if(onRoad){addMesh(ground,geo.box,mats.roadEdge,x+.5,-.125,z+.5,.98,.035,.98);if((x*3+z)%4===0)addMesh(ground,geo.box,mats.roadEdge,x+.5,-.045,z+.5,.18,.018,.18)}}
 // Forest decorations stay away from the path and buildable cells.
 for(let x=0;x<COLS;x++)for(let z=0;z<ROWS;z++){if(!road.has(x+','+z)&&((x*13+z*7+si*5)%11===0)){const near=road.has((x+1)+','+z)||road.has((x-1)+','+z)||road.has(x+','+(z+1))||road.has(x+','+(z-1));if(!near)makeTree(x+.5+(((x+z)%3)-1)*.16,z+.5+(((x*2+z)%3)-1)*.14,.45+((x+z)%3)*.08)}}
 // Landmark dressing: an ancient skull shrine, cascading water and mossy rock clusters.
 const skullGroup=new THREE.Group();skullGroup.position.set(COLS-.85,0,ROWS-.75);skullGroup.rotation.y=-.35;
 const bone=mat(0xb7c4a5),socket=mat(0x1c2925),mossRock=mat(0x46564b);
 addMesh(skullGroup,new THREE.SphereGeometry(.43,10,8),bone,0,.28,0,1.18,.82,.78);
 for(const x of [-.18,.18])addMesh(skullGroup,new THREE.SphereGeometry(.065,7,5),socket,x,.35,-.29);
 addMesh(skullGroup,new THREE.BoxGeometry(.2,.12,.08),bone,0,.12,-.34);
 for(let i=0;i<4;i++)addMesh(skullGroup,geo.cone,bone,-.24+i*.16,.04,-.33,.35,.55,.35);
 ground.add(skullGroup);decor.push(skullGroup);
 const water=new THREE.MeshStandardMaterial({color:0x63d8ef,roughness:.2,metalness:.12,transparent:true,opacity:.78});
 const waterfall=addMesh(ground,new THREE.BoxGeometry(.22,1.25,.06),water,.18,.58,ROWS-.9);waterfall.rotation.z=.12;
 for(let i=0;i<4;i++){const rock=addMesh(ground,geo.sphere,mossRock,.42+i*.18,.1,ROWS-1.2+(i%2)*.24,.34,.24,.3);rock.rotation.z=i*.4}
 // soft entrance and exit markers
 const start=pts[0],end=pts[pts.length-1];addMesh(ground,new THREE.CylinderGeometry(.27,.27,.08,12),mat(0x63e5a7),start[0],.02,start[1],1,1,1);addMesh(ground,new THREE.CylinderGeometry(.3,.3,.08,12),mat(0xff7185),end[0],.02,end[1],1,1,1);
 syncTowerMeshes();syncEnemyMeshes();syncShotMeshes();
}
function makeTower(t){
 const g=new THREE.Group();g.position.set(t.x+.5,0,t.y+.5);g.userData.tower=t;g.userData.level=t.l;
 const lv=t.l,accent=TT[t.k].color;
 if(lv>=4){addMesh(g,geo.ring,mat(0x8be9ff),0,.28,0,1.52,1,1.52)}
 if(lv>=5){addMesh(g,geo.ring,mat(0xffd166),0,.36,0,1.78,1,1.78);addMesh(g,geo.cone,mat(0xffd166),0,2.72,0,.42,.65,.42)}
 // Large, distinct silhouettes: archer watchtower, wheeled cannon, and tall sniper nest.
 if(t.k===0){
  addMesh(g,new THREE.CylinderGeometry(.48,.54,.18,8),mat(0x63452d),0,.1,0);
  addMesh(g,new THREE.CylinderGeometry(.34,.4,.58,7),mat(0x8a5b35),0,.43,0);
  for(const [x,z] of [[-.24,-.24],[.24,-.24],[-.24,.24],[.24,.24]]) addMesh(g,geo.box,mat(0xc99b58),x,.82,z,.075,.58,.075);
  addMesh(g,new THREE.BoxGeometry(.68,.11,.68),mat(0xd6b16b),0,1.12,0);
  addMesh(g,new THREE.CylinderGeometry(.18,.23,.28,7),mat(0x8f633f),0,1.32,0);
  addMesh(g,geo.sphere,mat(0xffd1a0),0,1.55,-.04,.22,.23,.22);
  addMesh(g,geo.cone,mat(0x238755),0,1.78,0,.88,.85,.88);
  const bow=addMesh(g,geo.rod,mat(0xf5d7a0),.2,1.42,-.17,.9,.65,.7);bow.rotation.z=.75;
  addMesh(g,geo.rod,mat(0x493222),.16,1.42,-.16,.08,.85,.08);
  if(lv>=2){addMesh(g,new THREE.BoxGeometry(.78,.12,.78),mat(0x55d6a6),0,1.96,0);addMesh(g,geo.cone,mat(0x3ebc88),0,2.2,0,1.1,.85,1.1)}
  if(lv>=3){addMesh(g,geo.cone,mat(0xffd166),0,2.48,0,.55,.8,.55);addMesh(g,geo.ring,mat(0xffd166),0,.22,0,1.3,1,1.3)}
 }else if(t.k===1){
  addMesh(g,new THREE.CylinderGeometry(.5,.56,.2,10),mat(0x554638),0,.12,0);
  addMesh(g,new THREE.BoxGeometry(.72,.3,.72),mat(0x76634b),0,.39,0);
  // wheels are visible from the overhead camera
  for(const x of [-.37,.37]){const wh=addMesh(g,new THREE.CylinderGeometry(.22,.22,.12,10),mat(0x292d2a),x,.42,0,1,1,1);wh.rotation.z=Math.PI/2;addMesh(g,new THREE.CylinderGeometry(.09,.09,.125,8),mat(0xc39b55),x,.42,0,1,1,1).rotation.z=Math.PI/2}
  addMesh(g,new THREE.CylinderGeometry(.25,.28,.28,9),mat(0x59625c),0,.66,0);
  const barrel=addMesh(g,new THREE.CylinderGeometry(.16,.2,.92,9),mat(0x303b38),0,.78,-.42);barrel.rotation.x=Math.PI/2;g.userData.barrel=barrel;
  addMesh(g,new THREE.TorusGeometry(.18,.055,6,12),mat(0xffc857),0,.78,-.84);
  addMesh(g,geo.sphere,mat(0xffc857),0,.99,.04,.17,.12,.17);
  if(lv>=2){addMesh(g,geo.box,mat(0xc98b37),0,.98,.12,.68,.12,.5);addMesh(g,geo.ring,mat(0xffdf80),0,.22,0,1.35,1,1.35)}
  if(lv>=3){addMesh(g,geo.cone,mat(0xff6b48),0,1.2,.1,.55,.75,.55);addMesh(g,geo.sphere,mat(0xff8c42),0,1.45,.1,.16,.16,.16)}
 }else if(t.k===2){
  addMesh(g,new THREE.CylinderGeometry(.43,.5,.2,8),mat(0x3c5b72),0,.12,0);
  addMesh(g,new THREE.CylinderGeometry(.31,.36,.85,7),mat(0x4d86a5),0,.61,0);
  for(const [x,z] of [[-.23,-.23],[.23,-.23],[-.23,.23],[.23,.23]])addMesh(g,geo.box,mat(0x8edbff),x,.65,z,.065,.9,.065);
  addMesh(g,new THREE.BoxGeometry(.64,.1,.64),mat(0x6ab8de),0,1.08,0);
  const scope=addMesh(g,new THREE.CylinderGeometry(.09,.12,1.08,7),mat(0x263c4d),0,1.35,-.43);scope.rotation.x=Math.PI/2;g.userData.barrel=scope;
  addMesh(g,geo.sphere,mat(0x7be8ff),0,1.62,-.04,.16,.16,.16);
  if(lv>=2){addMesh(g,geo.box,mat(0x6cf0c4),0,1.86,0,.82,.1,.82);addMesh(g,geo.cone,mat(0x66b8ff),0,2.1,0,.8,.7,.8)}
  if(lv>=3){addMesh(g,geo.cone,mat(0xffd166),0,2.42,0,.48,.75,.48);addMesh(g,geo.ring,mat(0x7be8ff),0,.22,0,1.35,1,1.35)}
 }else{
  const def=TT[t.k],base=mat(0x34463c),bright=mat(def.color),metal=mat(0x59665c);
  addMesh(g,new THREE.CylinderGeometry(.48,.58,.22,9),mat(0x6d7968),0,.12,0);
  if(t.k===3){addMesh(g,new THREE.CylinderGeometry(.34,.42,.6,7),base,0,.48,0);for(let i=0;i<3;i++){let q=addMesh(g,geo.cone,bright,Math.cos(i*2.094)*.19,.95,Math.sin(i*2.094)*.19,.62,1.35,.62);q.rotation.z=(i-1)*.24}}
  else if(t.k===4){addMesh(g,new THREE.CylinderGeometry(.34,.42,.55,8),base,0,.42,0);addMesh(g,new THREE.CylinderGeometry(.4,.4,.12,10),bright,0,.73,0);addMesh(g,geo.sphere,bright,0,.85,0,.32,.2,.32);for(let i=0;i<4;i++){let q=addMesh(g,geo.cone,bright,Math.cos(i*1.57)*.38,1.03,Math.sin(i*1.57)*.38,.45,.7,.45);q.rotation.z=Math.cos(i*1.57)*.5}}
  else if(t.k===5){addMesh(g,new THREE.CylinderGeometry(.28,.38,.8,7),metal,0,.5,0);addMesh(g,geo.sphere,bright,0,1.12,0,.25,.32,.25);for(let i=0;i<3;i++){let q=addMesh(g,geo.rod,bright,Math.cos(i*2.094)*.27,1.52,Math.sin(i*2.094)*.27,.8,1.6,.8);q.rotation.z=Math.cos(i*2.094)*.55}addMesh(g,geo.ring,bright,0,1.13,0,1.15,1,1.15)}
  else if(t.k===6){addMesh(g,new THREE.CylinderGeometry(.38,.48,.7,8),base,0,.48,0);addMesh(g,new THREE.CylinderGeometry(.27,.34,.18,8),bright,0,.91,0);addMesh(g,geo.cone,bright,0,1.24,0,.8,1.3,.8);addMesh(g,geo.sphere,mat(0xffd166),0,1.35,0,.16,.2,.16)}
  else if(t.k===7){addMesh(g,new THREE.CylinderGeometry(.35,.45,.55,6),metal,0,.4,0);for(let i=0;i<5;i++){let q=addMesh(g,geo.cone,bright,Math.cos(i*1.257)*.2,.98+(i%2)*.16,Math.sin(i*1.257)*.2,.56,.95+(i%2)*.25,.56);q.rotation.z=(i-2)*.11}}
  else if(t.k===8){addMesh(g,new THREE.BoxGeometry(.62,.85,.48),metal,0,.62,0);addMesh(g,geo.sphere,mat(0xffe8ad),0,1.2,-.04,.24,.23,.24);for(const x of [-.42,.42])addMesh(g,new THREE.BoxGeometry(.22,.75,.12),bright,x,.7,-.03);addMesh(g,geo.cone,bright,0,1.55,0,.6,.75,.6)}
  else if(t.k===9){addMesh(g,new THREE.CylinderGeometry(.3,.4,.45,8),base,0,.35,0);for(let i=0;i<3;i++){let q=addMesh(g,geo.ring,bright,0,.9+i*.22,0,1+i*.14,1,1+i*.14);q.rotation.set(i*.8,0,i*.55)}addMesh(g,geo.sphere,mat(0xfff0fa),0,1.25,0,.22,.22,.22)}
  else {addMesh(g,new THREE.CylinderGeometry(.36,.5,.55,7),base,0,.4,0);addMesh(g,geo.sphere,bright,0,.86,0,.38,.35,.4);addMesh(g,geo.cone,bright,-.2,1.15,-.1,.55,.8,.55);addMesh(g,geo.cone,bright,.2,1.15,-.1,.55,.8,.55);addMesh(g,geo.cone,mat(0xffd166),0,1.43,-.15,.32,.65,.32)}
  if(lv>=2){addMesh(g,new THREE.CylinderGeometry(.53,.53,.1,12),bright,0,.25,0);addMesh(g,geo.ring,bright,0,.2,0,1.35,1,1.35);addMesh(g,geo.cone,bright,0,1.65,0,.5,.65,.5)}
  if(lv>=3){addMesh(g,geo.ring,mat(0xffd166),0,1.05,0,1.55,1,1.55);addMesh(g,geo.cone,mat(0xffd166),0,2.05,0,.42,.8,.42);addMesh(g,geo.sphere,mat(0xffffff),0,1.8,0,.13,.13,.13)}
 }
 for(let i=0;i<lv;i++){const ring=addMesh(g,geo.ring,mat(LEVEL_COLORS[Math.min(lv-1,2)]),0,.22+i*.055,0,1+i*.13,1,1+i*.13);ring.rotation.x=Math.PI/2}
 const marker=addMesh(g,new THREE.TorusGeometry(.48,.055,6,20),mat(0x6cf0c4),0,.08,0,1,1,1);marker.rotation.x=Math.PI/2;marker.visible=false;g.userData.marker=marker;
 towerGroup.add(g);towerMeshes.set(t,g);return g}

function syncTowerMeshes(){for(const [t,g] of towerMeshes){if(!towers.includes(t)){towerGroup.remove(g);towerMeshes.delete(t)}}for(const t of towers){const old=towerMeshes.get(t);if(!old||old.userData.level!==t.l){if(old){towerGroup.remove(old);towerMeshes.delete(t)}makeTower(t)}}for(const [t,g] of towerMeshes){g.position.set(t.x+.5,0,t.y+.5);g.userData.marker.visible=t===sel||t===mv;g.userData.marker.material.color.setHex(mv===t?0xffd166:0x6cf0c4);}}
function makeEnemy(e){
 const g=new THREE.Group(),cfg=ET[e.k],body=mat(cfg.color),dark=mat(0x26313b),eye=mat(0xfff3bd),accent=mat(0xffffff);
 const orb=(x,y,z,r,m=body,sx=1,sy=1,sz=1)=>addMesh(g,new THREE.SphereGeometry(r,8,6),m,x,y,z,sx,sy,sz);
 const horn=(x,z,sc=1)=>{const h=addMesh(g,geo.cone,mat(0xeee0bf),x,.58,z,.55*sc,.8*sc,.55*sc);h.rotation.z=x<0?.25:-.25};
 const eyes=()=>{orb(-.09,.39,-.17,.045,eye);orb(.09,.39,-.17,.045,eye);orb(-.09,.39,-.205,.022,dark);orb(.09,.39,-.205,.022,dark)};
 switch(cfg.shape){
 case 'slime':orb(0,.22,0,cfg.r,body,1.15,.82,1.05);eyes();orb(0,.12,-.1,.07,accent,.8,.3,.5);break;
 case 'runner':orb(0,.24,0,cfg.r,body,.72,1.25,.7);eyes();for(let z of [-.13,.13])addMesh(g,geo.cone,body,0,.04,z,.45,.8,.45);break;
 case 'tank':case 'knight':case 'giant':case 'king':orb(0,.34,0,cfg.r,body,1.1,1.15,1);addMesh(g,geo.box,cfg.shape==='king'?mat(0x65233c):dark,0,.37,-.02,.72,.62,.7);eyes();for(let x of [-.26,.26])addMesh(g,geo.box,mat(0x65717d),x,.22,.02,.22,.55,.24);horn(-.18,.02,1.1);horn(.18,.02,1.1);if(cfg.shape==='king'){addMesh(g,geo.cone,mat(0xffd166),-.2,.85,0,.55,.85,.55);addMesh(g,geo.cone,mat(0xffd166),0,.95,0,.55,1,.55);addMesh(g,geo.cone,mat(0xffd166),.2,.85,0,.55,.85,.55)}break;
 case 'healer':orb(0,.3,0,cfg.r,body,1,1.2,1);eyes();addMesh(g,geo.box,mat(0xf4fff9),0,.42,-.26,.11,.55,.09);addMesh(g,geo.box,mat(0xf4fff9),0,.42,-.26,.4,.12,.09);addMesh(g,geo.ring,mat(0x7dffdf),0,.75,0,1.15,1,1.15).rotation.x=Math.PI/2;break;
 case 'shield':orb(0,.3,0,cfg.r,body);eyes();addMesh(g,new THREE.CylinderGeometry(.28,.34,.12,7),mat(0x376a9b),-.2,.32,-.16,.9,1.2,.3);addMesh(g,geo.ring,mat(0x9be7ff),0,.35,0,1.35,1,1.35).rotation.x=Math.PI/2;break;
 case 'split':orb(0,.25,0,cfg.r,body,1.2,.8,1);for(let x of [-.18,.18]){orb(x,.42,-.06,.1,body);orb(x,.44,-.14,.035,eye)}break;
 case 'regen':orb(0,.3,0,cfg.r,body,1,1.15,1);eyes();for(let a=0;a<5;a++)addMesh(g,geo.cone,mat(0xb6ff75),Math.cos(a*1.25)*.24,.48,Math.sin(a*1.25)*.24,.4,.5,.4);break;
 case 'bat':orb(0,.28,0,cfg.r,body,.8,1,.8);for(let x of [-1,1])addMesh(g,geo.cone,body,x*.25,.3,0,1.5,.55,.3).rotation.z=x*.4;eyes();horn(-.1,-.04,.5);horn(.1,-.04,.5);break;
 case 'ghost':orb(0,.35,0,cfg.r,body,.9,1.2,.9);orb(-.09,.4,-.17,.06,eye);orb(.09,.4,-.17,.06,eye);for(let x of [-.16,0,.16])addMesh(g,geo.cone,body,x,.06,.02,.5,.55,.5);break;
 case 'bomb':orb(0,.29,0,cfg.r,body);addMesh(g,geo.cyl,mat(0x323b36),0,.53,0,.5,.65,.5);addMesh(g,geo.cone,mat(0xffd166),.08,.73,0,.3,.5,.3);eyes();break;
 case 'ice':orb(0,.3,0,cfg.r,body,.9,1.1,.9);for(let a=0;a<6;a++){const h=addMesh(g,geo.cone,mat(0xd9fbff),Math.cos(a*Math.PI/3)*.22,.52,Math.sin(a*Math.PI/3)*.22,.45,.7,.45);h.rotation.z=Math.cos(a*Math.PI/3)*.4}eyes();break;
 case 'horn':orb(0,.32,0,cfg.r,body);eyes();horn(-.18,0,1.1);horn(.18,0,1.1);addMesh(g,geo.ring,mat(0xfff0a3),0,.32,0,1.4,1,1.4).rotation.x=Math.PI/2;break;
 case 'poison':orb(0,.28,0,cfg.r,body,1.1,1,1);eyes();for(let x of [-.2,0,.2])orb(x,.56,0,.1,mat(0xd4ff59));break;
 case 'blink':orb(0,.28,0,cfg.r,body,.75,1.3,.75);eyes();addMesh(g,geo.cone,mat(0xfff2bf),0,.62,0,.8,.65,.8);break;
 case 'aura':orb(0,.3,0,cfg.r,body);eyes();for(let r of [1.05,1.35])addMesh(g,geo.ring,mat(0xf1a8ff),0,.22,0,r,1,r).rotation.x=Math.PI/2;break;
 case 'leech':orb(0,.3,0,cfg.r,body,.8,1.25,.8);for(let x of [-.15,0,.15])addMesh(g,geo.cone,mat(0xffd0e8),x,.55,0,.45,.75,.45);eyes();break;
 case 'burrow':orb(0,.22,0,cfg.r,body,1.2,.65,1.2);addMesh(g,geo.cone,mat(0x795135),0,.45,0,.7,.8,.7);eyes();break;
 case 'crystal':orb(0,.3,0,cfg.r,body,.9,1.1,.9);for(let a=0;a<5;a++){const c=addMesh(g,geo.cone,mat(0xd7ffff),Math.cos(a*1.26)*.2,.55,Math.sin(a*1.26)*.2,.5,.95,.5);c.rotation.z=Math.cos(a*1.26)*.35}break;
 case 'gold':orb(0,.3,0,cfg.r,body,.9,1.05,.9);addMesh(g,geo.cone,mat(0xfff1a0),0,.57,0,.9,.8,.9);eyes();break;
 case 'dragon':orb(0,.3,0,cfg.r,body,1.15,1,1);horn(-.18,-.08,.7);horn(.18,-.08,.7);for(let x of [-1,1])addMesh(g,geo.cone,mat(0xffb15b),x*.3,.38,.05,1.4,.7,.45).rotation.z=x*.5;eyes();break;
 case 'necromancer':orb(0,.32,0,cfg.r,body,.9,1.15,.9);addMesh(g,geo.cone,mat(0x33264f),0,.73,0,1.3,1.2,1.3);addMesh(g,geo.rod,mat(0xd4a6ff),.33,.5,.02,.7,1.2,.7);orb(.33,.9,.02,.1,mat(0xd4a6ff));eyes();break;
 default:orb(0,.35,0,cfg.r,body,1.1,1.2,1.1);eyes();horn(-.2,0);horn(.2,0);
 }
 if(e.isBoss){const bossColors=[0xff416a,0x66d9ff,0xb58cff,0xffa64d,0x70e0a0,0xf26eae,0xe8e8f0,0xd9c35b,0x8ed7d0,0xff765e];const bc=mat(bossColors[e.bossVariant||0]);addMesh(g,geo.ring,bc,0,.82,0,1.18,.12,1.18);addMesh(g,geo.cone,bc,-.34,.9,0,.65,1.2,.65);addMesh(g,geo.cone,bc,.34,.9,0,.65,1.2,.65);if((e.bossVariant||0)%2===1)addMesh(g,geo.box,bc,0,.48,.28,1.25,.18,.18)}const hpBg=addMesh(g,geo.box,mat(0x17251c),0,1.08,0,.68,.065,.1);const hp=addMesh(g,geo.box,mats.hp,0,1.09,-.005,.66,.07,.08);g.userData.hp=hp;g.userData.hpBg=hpBg;
 g.scale.setScalar(1.28);enemyGroup.add(g);enemyMeshes.set(e,g);return g}

function syncEnemyMeshes(){for(const [e,g] of enemyMeshes){if(!enemies.includes(e)){enemyGroup.remove(g);enemyMeshes.delete(e)}}for(const e of enemies)if(!enemyMeshes.has(e))makeEnemy(e)}
function makeShot(b){const g=new THREE.Group(),color=mat(b.c),size=.09+.025*b.l,k=b.k||0;if(k===0){addMesh(g,new THREE.CylinderGeometry(.025,.045,.42,5),color,0,0,0);g.rotation.x=Math.PI/2}else if(k===1){addMesh(g,new THREE.SphereGeometry(size*1.45,8,6),color,0,0,0);const glow=addMesh(g,new THREE.SphereGeometry(size*2.1,6,4),mat(0xffa64d),0,0,0);glow.material.transparent=true;glow.material.opacity=.28}else if(k===3){addMesh(g,geo.cone,color,0,0,0,.65,1.6,.65);g.rotation.x=Math.PI/2}else if(k===5||k===8){addMesh(g,geo.cone,color,0,0,0,.55,1.8,.55);g.rotation.z=Math.PI/2}else if(k===6||k===10){addMesh(g,new THREE.SphereGeometry(size*1.6,7,5),color,0,0,0);addMesh(g,geo.cone,mat(0xffd166),0,.06,0,.55,1.5,.55)}else if(k===11){addMesh(g,new THREE.SphereGeometry(size*2.2,9,7),color,0,0,0);const ring=addMesh(g,geo.ring,mat(0xffffff),0,0,0,1.4,1,1.4);ring.rotation.x=Math.PI/2}else if(k===9){addMesh(g,geo.ring,color,0,0,0,.55,1,.55);g.rotation.x=Math.PI/2}else{addMesh(g,geo.sphere,color,0,0,0,size*1.2,size*1.2,size*1.2);if(b.l>=2){const halo=addMesh(g,geo.ring,mat(0xffffff),0,0,0,.75,1,.75);halo.rotation.x=Math.PI/2}}shotGroup.add(g);shotMeshes.set(b,g);return g}
function syncShotMeshes(){for(const [b,g] of shotMeshes){if(!shots.includes(b)){shotGroup.remove(g);shotMeshes.delete(b)}}for(const b of shots)if(!shotMeshes.has(b))makeShot(b)}
function fit(){
 const landscape=innerWidth>innerHeight;document.body.classList.toggle('landscape',landscape);
 const availW=Math.max(220,innerWidth-14);const ids=['hud','waveControls','bar','soldierDeck','abilityBar','intermission','sel'];
 if(landscape){
  const w=Math.floor(Math.min(innerWidth*.55,innerHeight*.91*ROWS/COLS));const h=Math.floor(w*COLS/ROWS);
  $('wrap').style.width=w+'px';$('wrap').style.height=h+'px';cv.style.width=w+'px';cv.style.height=h+'px';renderer.setSize(w,h,false);
  camera.left=-ROWS/2;camera.right=ROWS/2;camera.top=COLS/2;camera.bottom=-COLS/2;camera.updateProjectionMatrix();camera.position.set(COLS/2+18,17,ROWS/2);camera.lookAt(COLS/2,0,ROWS/2);
  for(const id of ids)$(id).style.width='100%';
 }else{
  let used=0;for(const id of ids){const el=$(id);if(el&&getComputedStyle(el).display!=='none')used+=el.getBoundingClientRect().height}
  const gap=Math.max(0,ids.length-1)*5;const safe=(parseFloat(getComputedStyle(document.body).paddingTop)||0)+(parseFloat(getComputedStyle(document.body).paddingBottom)||0);
  const availH=Math.max(180,innerHeight-used-gap-safe-10);const h=Math.floor(Math.min(availH,availW*ROWS/COLS));const w=Math.floor(h*COLS/ROWS);
  $('wrap').style.width=w+'px';$('wrap').style.height=h+'px';cv.style.width=w+'px';cv.style.height=h+'px';renderer.setSize(w,h,false);
  camera.left=-COLS/2;camera.right=COLS/2;camera.top=ROWS/2;camera.bottom=-ROWS/2;camera.updateProjectionMatrix();camera.position.set(COLS/2,17,ROWS/2+10);camera.lookAt(COLS/2,0,ROWS/2);
  for(const id of ids)$(id).style.width=Math.min(availW,760)+'px';
 }
}
window.addEventListener('resize',fit);
function reset(){towers=[];enemies=[];shots=[];soldiers=[];soldierMeshes.forEach(m=>{enemyGroup.remove(m);m.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()})});soldierMeshes=[];unitBuild=null;bossRewarded=false;sessionKills=0;money=stage.bonus?300:150;lives=10;wave=0;leaderCooldown=0;spawnQ=[];spawnT=0;active=false;intermissionTimer=0;$('intermission').style.display='none';speed=1;build=null;sel=null;mv=null;over=false;$('ov').style.display='none';$('nw').classList.remove('speed-mode');$('nw').textContent='▶ بدء الموجة 1';buildWorld();ui()}
function startWave(){if(active||over)return;intermissionTimer=0;$('intermission').style.display='none';fit();wave++;spawnQ=[];if(stage.bonus){const n=9+wave*5;for(let i=0;i<n;i++)spawnQ.push(10+Math.floor(Math.random()*13));spawnQ.push(23);if(wave===stage.waves)spawnQ.push(23,22,22);active=true;spawnT=0;ui();return}const unlocked=Math.min(ET.length,4+Math.floor((si+1)/2));const count=7+wave*2+Math.floor(si/4);for(let i=0;i<count;i++){let k;if(i===count-1&&(wave%3===0||wave===stage.waves))k=Math.min(23,Math.floor(si/2)+5);else if(i%7===6)k=Math.floor(Math.random()*Math.min(unlocked,16));else k=Math.floor(Math.random()*unlocked);spawnQ.push(k)}if(wave===stage.waves){spawnQ.push(Math.min(23,Math.floor(si/2)+5));if(si>=15)spawnQ.push(23);if((si+1)%10===0)spawnQ.push(23)}if(gameMode==='boss')spawnQ.push(23);active=true;spawnT=0;ui()}
function end(win){if(gameMode==='challenge'&&win&&lives<9)win=false;over=true;saveMeta();if(win){extra.ach.wins=(extra.ach.wins||0)+1;if(lives===10)extra.ach.clean=(extra.ach.clean||0)+1;extra.coins+=25+Math.floor((si+1)/5)*5;extra.unitPoints=(extra.unitPoints||0)+((stage.bonus||gameMode==='boss')?3:1);saveExtra();saveMeta();refreshHomeProfile();toast((stage.bonus||gameMode==='boss')?'🏆 +3 نقاط تطوير للجنود':'🏆 +1 نقطة تطوير للجنود')}const next=$('next');
 if(gameMode==='survival'){extra.coins+=Math.max(10,wave*4);saveExtra();$('t').textContent='انتهى طور البقاء';$('s').textContent='صمدت '+wave+' موجة · مكافأتك '+Math.max(10,wave*4)+' عملة إضافية';$('next').style.display='none';$('ov').style.display='flex';ui();return}if(gameMode!=='campaign'){if(win&&Number(modeProgress[gameMode]||0)<si+1){modeProgress[gameMode]=si+1;saveModeProgress()}const max=MODE_STAGES[gameMode].length-1;$('t').textContent=win?'انتصار في '+stage.n+'!':'انتهت المحاولة';$('s').textContent=win?(si<max?'انفتح التحدي التالي ضمن هذا الطور.':'أنهيت جميع مراحل هذا الطور!'):'وصلت للموجة '+wave+'؛ جرّب توزيعاً أفضل ثم أعد المحاولة.';$('next').style.display=win&&si<max?'block':'none';$('next').onclick=()=>playMode(Math.min(si+1,max));$('gm').textContent='خريطة '+({challenge:'التحدي',boss:'الزعماء'}[gameMode]||'البقاء');$('ov').style.display='flex';ui();return}if(stage.bonus){let reward=0;if(win&&!bonusDone.includes(stage.k)){reward=30+Math.floor(Math.random()*41);gems+=reward;bonusDone.push(stage.k);saveMeta()}
  $('t').textContent=win?'هزمت الوحوش! 👹':'انتهت المحاولة';
  $('s').textContent=win?(reward?'جائزتك: +'+reward+' 💎':'سبق أن أنهيتها؛ الجائزة تُمنح مرة واحدة فقط.'):'الوحوش كانت أقوى. يمكنك المحاولة مرة أخرى أو متابعة المستويات.';
  const nx=(stage.k+1)*10;next.style.display=win&&nx<STAGES.length?'block':'none';next.onclick=()=>play(Math.min(nx,STAGES.length-1));$('ov').style.display='flex';ui();return}
 $('t').textContent=win?'فزت بالمستوى '+(si+1)+'! 🎉':'انتهت المحاولة';
 if(win&&prog<si+1){prog=Math.min(si+1,STAGES.length);try{localStorage.setItem('td-prog',String(prog))}catch{}}
 if(win){try{const relics=Number(localStorage.getItem('td-relics')||0)+Math.max(1,Math.floor((si+1)/5)+1);localStorage.setItem('td-relics',String(relics));}catch{}}
 const last=si>=STAGES.length-1;next.style.display=win&&!last?'block':'none';next.onclick=()=>play(Math.min(si+1,STAGES.length-1));
 $('s').textContent=win?(last?'أسطورة! أنهيت كل المستويات!':'انفتح المستوى '+(si+2)+'!'+((si+1)%10===0?' وانفتحت مرحلة وحش اختيارية 👹 على الخريطة.':'')):'وصلت للموجة '+wave+'. غيّر توزيع الأبراج وطوّرها وحاول من جديد.';
 $('ov').style.display='flex'}
const stat=t=>({dmg:TT[t.k].dmg*(1+.62*(t.l-1))*(1+(extra.perm||0)*.08),r:TT[t.k].r+.22*(t.l-1)});const upCost=t=>Math.round(TT[t.k].cost*(.72+.28*t.l));
function useLeaderSkill(){
 if(over||$('lm').style.display==='flex'||leaderCooldown>0)return;
 const targets=enemies.filter(e=>!e.dead);
 if(!targets.length){$('hint').textContent='لا يوجد أعداء حالياً؛ احتفظ بقدرة القائد للموجة القادمة';return}
 for(const e of targets){e.hp-=Math.max(24,ET[e.k].hp*.42);e.heroSlow=2.2;if(e.hp<=0)e.dead=true}
 const defeated=targets.filter(e=>e.dead).length;
 money+=defeated*4;
 leaderCooldown=22;
 $('hint').textContent='⚔️ ضربة القائد! أصابت '+targets.length+' أعداء وأبطأتهم';
 ui();draw3d();
}
$('leaderSkill').onclick=useLeaderSkill;
function update(dt){
 if(intermissionTimer>0&&!active&&!over){intermissionTimer=Math.max(0,intermissionTimer-dt/Math.max(speed,1));updateIntermission();if(intermissionTimer<=0)startWave()}
 if(leaderCooldown>0)leaderCooldown=Math.max(0,leaderCooldown-dt);
 if(spawnQ.length){spawnT-=dt;if(spawnT<=0){const k=spawnQ.shift(),cfg=ET[k],isBoss=k===23&&(stage.bonus||(si+1)%10===0),bossScale=isBoss?1.8+Math.floor(si/10)*.22:1,hp=cfg.hp*(1+.24*(wave-1))*stage.hp*bossScale;enemies.push({k,d:0,hp,max:hp,x:0,y:0,id:Math.random(),t:0,healT:0,shieldHp:(cfg.ability==='shield'||isBoss)?hp*.3:0,splitDone:false,isBoss,bossVariant:Math.floor(si/10)%10,bossHeal:0});spawnT=Math.max(.22,.62-si*.004)}}
 for(const e of enemies){const cfg=ET[e.k];e.t+=dt;let move=cfg.s;
 if(e.heroSlow>0){move*=.28;e.heroSlow=Math.max(0,e.heroSlow-dt)}
 if(cfg.ability==='dash'&&Math.floor(e.t/2)%2===1)move*=2.2;if(cfg.ability==='haste')move*=1.05;
 [e.x,e.y]=pos(Math.min(e.d,total));
 // Enemies stop on the path to attack nearby soldiers; soldiers can be defeated.
 let blocker=null,blockDist=.78;
 for(const u of soldiers){if(u.dead)continue;const d=Math.hypot(e.x-(u.x+.5),e.y-(u.y+.5));if(d<blockDist){blocker=u;blockDist=d}}
 if(blocker){e.attackCd=(e.attackCd||0)-dt;if(e.attackCd<=0){const damage=(cfg.ability==='bomb'?22:cfg.ability==='giant'?32:cfg.ability==='king'?42:12)*(e.isBoss?1.8:1);blocker.hp-=damage;e.attackCd=e.isBoss?.65:.9;if(blocker.hp<=0){blocker.dead=true;toast('💥 سقط '+UNIT[blocker.type].name+' في المعركة');if(blocker.mesh){enemyGroup.remove(blocker.mesh);blocker.mesh.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()})}}} }
 else e.d+=move*dt;
 [e.x,e.y]=pos(Math.min(e.d,total));
 if((cfg.ability==='regen'||e.isBoss)&&e.hp<e.max){const healRate=e.isBoss?.018:.035;e.hp=Math.min(e.max,e.hp+e.max*healRate*dt)}
 if(e.isBoss&&e.shieldHp<=0&&e.t-(e.bossHeal||0)>14){e.bossHeal=e.t;e.shieldHp=e.max*.08}
 if(cfg.ability==='heal'&&e.t-(e.healT||0)>1.2){e.healT=e.t;for(const other of enemies)if(other!==e&&!other.dead&&Math.hypot(other.x-e.x,other.y-e.y)<1.8)other.hp=Math.min(other.max,other.hp+other.max*.08)}
 if(e.d>=total&&!e.dead){e.dead=true;lives-=cfg.ability==='bomb'?2:1;ui();if(lives<=0){end(false);return}}
 }
 soldiers=soldiers.filter(u=>!u.dead);
 soldierMeshes=soldiers.map(u=>u.mesh).filter(Boolean);
 for(const t of towers){let slow=1;for(const e of enemies){const a=ET[e.k].ability,dist=Math.hypot(e.x-t.x-.5,e.y-t.y-.5);if((a==='frost'||a==='poison')&&dist<1.55)slow=Math.min(slow,.58);if(a==='haste'&&dist<1.8)slow=Math.max(slow,1.15)}t.cd-=dt*slow;let best=null;const st=stat(t);for(const e of enemies){if(e.dead)continue;const cfg=ET[e.k];if(cfg.ability==='stealth'&&e.t%4>2.2)continue;if(Math.hypot(e.x-t.x-.5,e.y-t.y-.5)<=st.r&&(!best||e.d>best.d))best=e}if(best){t.aim=Math.atan2(-(best.x-(t.x+.5)),-(best.y-(t.y+.5)));if(t.cd<=0){shots.push({x:t.x+.5,y:t.y+.5,e:best,dmg:st.dmg,spl:t.k===1||t.k===6||t.k===11,c:TT[t.k].color,l:t.l,k:t.k});t.cd=TT[t.k].rate}}}
 // Soldiers fight back: melee units engage at close range; archers shoot from farther away.
 for(const u of soldiers){const cfg=UNIT[u.type],lv=extra.unitLevels[u.type]||1;u.cd-=dt;let target=null,bd=999;
 for(const e of enemies){if(e.dead)continue;const d=Math.hypot(e.x-u.x-.5,e.y-u.y-.5);if(d<=cfg.range&&d<bd){bd=d;target=e}}
 if(target&&u.cd<=0){shots.push({x:u.x+.5,y:u.y+.5,e:target,dmg:cfg.dmg*(1+(lv-1)*.22),spl:false,c:u.type==='archer'?0xffd166:0x9ce6b3,l:lv,k:99});u.cd=cfg.rate/(1+(lv-1)*.1)}
 }
 for(const b of shots){if(b.e.dead){b.gone=true;continue}const dx=b.e.x-b.x,dy=b.e.y-b.y,d=Math.hypot(dx,dy),m=9*dt;if(d<=m){const hit=b.spl?enemies.filter(e=>!e.dead&&Math.hypot(e.x-b.e.x,e.y-b.e.y)<=(b.k===11?1.65:1.25)):[b.e];for(const e of hit){let damage=b.dmg,cfg=ET[e.k];if(cfg.ability==='armor')damage*=.58;if(cfg.ability==='evasive')damage*=.78;if(cfg.ability==='shield'&&e.shieldHp>0){const blocked=Math.min(e.shieldHp,damage*.65);e.shieldHp-=blocked;damage-=blocked}if(enemies.some(o=>o!==e&&!o.dead&&ET[o.k].ability==='protect'&&Math.hypot(o.x-e.x,o.y-e.y)<1.65))damage*=.68;e.hp-=damage;if(e.hp<=0&&!e.dead){e.dead=true;money+=Math.round(cfg.rew*stage.rw);sessionKills++;extra.ach.kills=(extra.ach.kills||0)+1;if(e.isBoss&&!bossRewarded){bossRewarded=true;gems+=25;money+=100;extra.ach.boss=(extra.ach.boss||0)+1;toast('👑 هزمت الزعيم! +25 💎 +100 🪙');saveMeta();saveExtra()}if(cfg.ability==='split'&&!e.splitDone){e.splitDone=true;for(let j=0;j<2;j++)enemies.push({k:j,d:Math.max(0,e.d-.12),hp:ET[j].hp*.65,max:ET[j].hp*.65,x:e.x,y:e.y,t:0,healT:0,shieldHp:0,splitDone:true})}if(cfg.ability==='summon'){for(let j=0;j<2;j++)enemies.push({k:1,d:Math.max(0,e.d-.18),hp:ET[1].hp,max:ET[1].hp,x:e.x,y:e.y,t:0,healT:0,shieldHp:0,splitDone:true})}if(cfg.ability==='gold')money+=15;ui()}}b.gone=true}else{b.x+=dx/d*m;b.y+=dy/d*m}}
 enemies=enemies.filter(e=>!e.dead);shots=shots.filter(b=>!b.gone);if(active&&!spawnQ.length&&!enemies.length){active=false;money+=25+wave*6;const gg=gemRoll();gems+=gg;saveMeta();toast('🎉 الموجة '+wave+' خلصت · +'+gg+' 💎');if(wave>=stage.waves){$('intermission').style.display='none';end(true)}else{intermissionTimer=15;$('intermission').style.display='flex';renderSoldierDeck();updateIntermission();fit()}ui()}
}
function draw3d(){syncTowerMeshes();syncEnemyMeshes();syncShotMeshes();soldiers.forEach((u,i)=>{if(soldierMeshes[i]){soldierMeshes[i].position.x=u.x+.5;soldierMeshes[i].position.z=u.y+.5;soldierMeshes[i].rotation.y=Math.sin(tm*3+i)*.08;const ratio=Math.max(0,Math.min(1,u.hp/u.max));if(u.hpBarFill){u.hpBarFill.scale.x=.52*ratio;u.hpBarFill.position.x=-(.52*(1-ratio))/2;u.hpBarFill.material.color.setHex(ratio>.5?0x37d8f4:ratio>.22?0x6cbcff:0x987bff)}}});for(const [t,g] of towerMeshes){g.rotation.y=(t.aim||0);const marker=g.userData.marker;marker.visible=t===sel||t===mv;if(t===sel){marker.material.color.setHex(0x6cf0c4);marker.scale.setScalar(1.03+Math.sin(tm*4)*.025)}else if(t===mv){marker.material.color.setHex(0xffd166)}}for(const [e,g] of enemyMeshes){g.position.set(e.x,0,e.y);g.rotation.y=Math.sin(tm*3+e.d)*.12;if(ET[e.k].ability==='stealth')g.visible=e.t%4<2.2;else g.visible=true;if(ET[e.k].ability==='shield')g.scale.setScalar(e.shieldHp>0?1.04:1);if(e.isBoss){g.scale.setScalar(1.48);g.rotation.y=Math.sin(tm*1.7)*.2;}const ratio=Math.max(0,e.hp/e.max);g.userData.hp.scale.x=Math.max(.01,.56*ratio);g.userData.hp.position.x=-(.56*(1-ratio))/2;g.userData.hp.material.color.setHex(ratio>.5?0x60e08a:ratio>.25?0xffd166:0xff7185)}for(const [b,g] of shotMeshes){g.position.set(b.x,.48,b.y);g.position.y=.42+Math.sin(tm*15+b.x)*.04}renderer.render(scene,camera)}
function ui(){renderSoldierDeck();const skill=$('leaderSkill');if(skill){skill.disabled=leaderCooldown>0;skill.textContent=leaderCooldown>0?'⚔️ القائد '+Math.ceil(leaderCooldown)+'ث':'⚔️ ضربة القائد'}$('lv').textContent=lives;$('wv').textContent=wave+'/'+stage.waves;$('mn').textContent=Math.floor(money);$('gemCount').textContent=gems;if($('homeGems'))$('homeGems').textContent=gems;TT.forEach((t,i)=>{const b=$('tower-'+i);if(b){b.classList.toggle('on',build===i);b.disabled=money<t.cost&&build!==i;if(window.__jungleChosenTowers)b.classList.toggle('tower-hidden',!window.__jungleChosenTowers.includes(i));}});$('nw').style.display=active?'none':'block';$('nw').textContent=intermissionTimer>0?'▶ بدء الموجة التالية':'▶ بدء الموجة '+(wave+1);$('nw').title=stage.bonus?'مرحلة الوحش':stage.n;const speeds=$('speedChoices');if(speeds){speeds.style.display=active?'flex':'none';speeds.querySelectorAll('[data-speed]').forEach(b=>{b.classList.toggle('selected',Number(b.dataset.speed)===speed)})}$('hint').textContent=active?'الموجة شغّالة — يمكنك بناء الدفاعات وتطويرها أثناء الهجوم':'اختر دفاعًا ثم اضغط على خانة أرض فاضية بجانب الطريق';$('nw').disabled=over;const s=$('sel');if(mv){s.innerHTML='<span>اضغط على خانة أرض فاضية لنقل البرج</span><button id="cx">إلغاء</button>';$('cx').onclick=()=>{mv=null;ui();draw3d()}}else if(sel){const c=upCost(sel),max=sel.l>=5;s.innerHTML='<span>'+TT[sel.k].n+' · المستوى '+sel.l+'</span><button class="upgrade" id="up" '+(max||money<c?'disabled':'')+'>'+(max?'أعلى مستوى':'ترقية '+c+' 🪙')+'</button><button class="move" id="mv">نقل</button><button class="sell" id="sl">بيع +'+Math.floor(sel.inv/2)+' 🪙</button>';$('up').onclick=()=>{if(sel&&sel.l<5&&money>=c){money-=c;sel.inv+=c;sel.l++;syncTowerMeshes();ui();draw3d()}};$('mv').onclick=()=>{mv=sel;build=null;ui();draw3d()};$('sl').onclick=()=>{money+=Math.floor(sel.inv/2);towers=towers.filter(q=>q!==sel);sel=null;syncTowerMeshes();ui();draw3d()}}else s.innerHTML='<span>'+(build!==null?'اضغط على خانة فاضية لبناء '+TT[build].n:'الدفاعات بالأعلى · الجنود على المسار · طوّر الأبراج بالذهب حتى المستوى الخامس')+'</span>';syncTowerMeshes()}
function cellFromEvent(ev){const r=cv.getBoundingClientRect();pointer.x=((ev.clientX-r.left)/r.width)*2-1;pointer.y=-(((ev.clientY-r.top)/r.height)*2-1);raycaster.setFromCamera(pointer,camera);const hit=new THREE.Vector3();if(!raycaster.ray.intersectPlane(groundPlane,hit))return{x:-1,y:-1};return{x:Math.floor(hit.x),y:Math.floor(hit.z)}}
cv.addEventListener('pointerdown',ev=>{if(over||$('lm').style.display==='flex')return;const {x,y}=cellFromEvent(ev);if(x<0||x>=COLS||y<0||y>=ROWS)return;if(unitBuild){if(road.has(x+','+y)&&!towers.some(q=>q.x===x&&q.y===y)&&!soldiers.some(q=>q.x===x&&q.y===y))placeUnit(unitBuild,x,y);return}const t=towers.find(t=>t.x===x&&t.y===y);if(mv){if(!t&&!road.has(x+','+y)){mv.x=x;mv.y=y;mv.pop=1}sel=mv;mv=null;ui();draw3d();return}if(t){sel=t;build=null}else if(build!==null&&!road.has(x+','+y)&&money>=TT[build].cost){money-=TT[build].cost;const n={x,y,k:build,l:1,cd:0,inv:TT[build].cost,aim:0};towers.push(n);sel=null;build=null;syncTowerMeshes();draw3d()}else sel=null;ui();draw3d()});
const towerDeck=$('towerDeck');TT.forEach((t,i)=>{const b=document.createElement('button');b.id='tower-'+i;b.innerHTML='<span class="ico">'+t.icon+'</span><span>'+t.n+'</span><span class="sub">'+t.cost+' 🪙</span>';b.onclick=()=>{build=build===i?null:i;sel=null;mv=null;ui();draw3d()};towerDeck.appendChild(b)});$('nw').onclick=()=>{if(over||active)return;startWave()};document.querySelectorAll('#speedChoices [data-speed]').forEach(b=>b.onclick=()=>{speed=Math.max(1,Math.min(5,Number(b.dataset.speed)||1));ui()});$('go').onclick=()=>stage.bonus?playBonus(stage.k):play(si);$('mb').onclick=openMap;$('closeMap').onclick=closeMapScreen;$('gm').onclick=openMap;
let inGame=false;
function closeMapScreen(){$('lm').style.display='none';if(!inGame){refreshHomeProfile();$('splash').style.display='flex'}}
function openMap(){
 const list=$('stageList');list.innerHTML='';$('mapGems').textContent=gems;
 if(gameMode==='campaign'){
  $('lm').querySelector('h2').textContent='🗺️ خريطة المستويات';$('lm').querySelector('p').innerHTML='تقدمك في الحملة · 💎 <b id="mapGems">'+gems+'</b>';
  STAGES.forEach((st,i)=>{const ok=i<=prog,b=document.createElement('button');b.className='stage '+(i<prog?'done':'')+(ok?'':' lock');b.disabled=!ok;b.innerHTML='<b>'+(ok?(i<prog?'✅ ':'🌿 '):'🔒 ')+'المستوى '+(i+1)+'</b><small>'+st.n.split(' · ')[1]+' · '+st.waves+' موجات</small>';b.onclick=()=>play(i);list.appendChild(b);
   if((i+1)%10===0&&(i+1)/10<=BONUS.length){const k=(i+1)/10-1,ok2=prog>=i+1,done=bonusDone.includes(k),bb=document.createElement('button');bb.className='stage bonus'+(done?' done':'')+(ok2?'':' lock');bb.disabled=!ok2;bb.innerHTML='<b>'+(ok2?'👹 ':'🔒 ')+'مرحلة الوحش '+(k+1)+' (اختيارية)</b><small>شوطان · تبدأ بـ 300 🪙 · '+(done?'✅ تم استلام الجائزة':'جائزة 30–70 💎')+'</small>';bb.onclick=()=>playBonus(k);list.appendChild(bb)}});
 }else{
  const names={survival:'🌊 خريطة البقاء',challenge:'🎯 خريطة التحدي',boss:'👑 خريطة الزعماء'};const p=Number(modeProgress[gameMode]||0);$('lm').querySelector('h2').textContent=names[gameMode]||'خريطة الطور';$('lm').querySelector('p').innerHTML='تقدم مستقل لهذا الطور · لا يفتح مراحل الحملة';
  MODE_STAGES[gameMode].forEach((st,i)=>{const ok=i<=p,b=document.createElement('button');b.className='stage '+(i<p?'done':'')+(ok?'':' lock');b.disabled=!ok;b.innerHTML='<b>'+(i<p?'✅ ':ok?'🌿 ':'🔒 ')+st.n+'</b><small>'+st.waves+' موجات · خريطة خاصة</small>';b.onclick=()=>playMode(i);list.appendChild(b)});
 }
 $('lm').style.display='flex';const cur=list.querySelector('.stage:not(.lock):not(.done)');if(cur)cur.scrollIntoView({block:'center'});
}
let chosenTowers=new Set(), boughtAbilities=new Set();
const abilityCosts=[5,6,4,5], abilityNames=['❄️ جليد','☄️ نيزك','💚 علاج','⚡ صاعقة'];
function useAbility(i){
 if(over||!abilityStock[i]||$('lm').style.display==='flex')return;
 const kill=e=>{if(!e.dead){e.dead=true;money+=Math.round(ET[e.k].rew*stage.rw)}};
 const hurt=d=>enemies.forEach(e=>{if(e.dead)return;e.hp-=d;if(e.hp<=0)kill(e)});
 if(i===0){if(!enemies.length)return;enemies.forEach(e=>{e.heroSlow=4.5})}
 else if(i===1){if(!enemies.length)return;hurt(80)}
 else if(i===2){if(lives>=10)return;lives=Math.min(10,lives+3)}
 else{if(!enemies.length)return;hurt(45)}
 abilityStock[i]--;saveMeta();renderAbilityBar();ui();draw3d()}
function renderAbilityBar(){const bar=$('abilityBar');bar.innerHTML='';abilityNames.forEach((n,i)=>{const b=document.createElement('button');b.textContent=n+' ×'+abilityStock[i];b.disabled=!abilityStock[i];b.onclick=()=>useAbility(i);bar.appendChild(b)});bar.style.display=abilityStock.some(n=>n>0)?'flex':'none'}
function renderPrep(){const grid=$('prepTowers');grid.innerHTML='';TT.forEach((t,i)=>{const b=document.createElement('button');b.className=chosenTowers.has(i)?'chosen':'';b.innerHTML=`<span style="font-size:21px">${t.icon}</span><br>${t.n}<br><small>${t.cost} 🪙</small>`;b.onclick=()=>{if(chosenTowers.has(i))chosenTowers.delete(i);else if(chosenTowers.size<4)chosenTowers.add(i);else{$('prepCount').textContent='اختر 4 فقط؛ شيل واحد أولًا';return}renderPrep()};grid.appendChild(b)});$('prepCount').textContent=`الدفاعات المختارة: ${chosenTowers.size} / 4`;$('prepMoney').textContent='💎 جواهرك: '+gems;document.querySelectorAll('#prepAbilities button').forEach((b,i)=>{b.innerHTML=abilityNames[i]+'<br><small>'+abilityCosts[i]+' 💎 · عندك '+abilityStock[i]+'</small>';b.classList.toggle('bought',abilityStock[i]>0)})}
function showPrep(){chosenTowers=new Set([0,1,2,3]);document.querySelector('#prep p').textContent=stage.bonus?'👹 مرحلة الوحش: اختر 4 دفاعات، وتبدأ بـ 300 ذهبية.':'اختر 4 دفاعات فقط. تبدأ كل مباراة بـ 150 ذهبية.';renderPrep();$('prep').style.display='block'}
document.querySelectorAll('#prepAbilities button').forEach((b)=>{b.onclick=()=>{const i=Number(b.dataset.a);if(gems<abilityCosts[i]){$('prepMoney').textContent='جواهرك ما بتكفي 💎 ('+gems+')';return}gems-=abilityCosts[i];abilityStock[i]++;saveMeta();renderPrep()}});
$('prepStart').onclick=()=>{if(chosenTowers.size!==4){$('prepCount').textContent='لازم تختار 4 دفاعات بالضبط';return}$('prep').style.display='none';window.__jungleChosenTowers=[...chosenTowers];reset();money=stage.bonus?300:150;TT.forEach((t,i)=>{const b=$('tower-'+i);if(b){b.classList.toggle('tower-hidden',!chosenTowers.has(i));b.style.display='';}});renderAbilityBar();ui()};
$('prepCancel').onclick=()=>{$('prep').style.display='none';openMap()};
function playBonus(k){inGame=true;si=(k+1)*10-1;stage=BONUS[k];setMap(stage.wp);$('lm').style.display='none';reset();fit();showPrep()}
function play(i){inGame=true;si=i;stage=STAGES[i];setMap(stage.wp);$('lm').style.display='none';reset();fit();showPrep()}
function playMode(i){inGame=true;si=i;stage=MODE_STAGES[gameMode][i];setMap(stage.wp);$('lm').style.display='none';reset();fit();showPrep()}


// Dedicated soldier row: select a unit, then place it on an unoccupied path tile.
function renderSoldierDeck(){
 const deck=$('soldierDeck');if(!deck)return;deck.innerHTML='';
 Object.entries(UNIT).forEach(([k,v])=>{const b=document.createElement('button');b.innerHTML=`<span class="ico">${v.icon}</span>${v.name}<small>${v.cost} 🪙 · Lv.${extra.unitLevels[k]||1}</small>`;b.disabled=active||over||money<v.cost;b.classList.toggle('on',unitBuild===k);b.onclick=()=>{if(active)return toast('انتظر فترة التجهيز بين الموجات');unitBuild=unitBuild===k?null:k;build=null;sel=null;ui();toast(unitBuild?'حدد خانة من مسار الأعداء لنشر '+v.name:'تم إلغاء اختيار الجندي')};deck.appendChild(b)})
}
function updateIntermission(){const el=$('intermissionText');if(el)el.textContent='⏳ الموجة التالية خلال '+Math.ceil(intermissionTimer)+' ثانية — جهّز جنودك';}
$('earlyWave').onclick=()=>{if(intermissionTimer>0&&!active){startWave()}};

// Unit placement and progression UI. Placement uses the same map pointer as towers.
function placeUnit(type,x,y){
 if(active){toast('انتظر بين الموجات لنشر الجنود');unitBuild=null;return false}
 const cfg=UNIT[type],cost=cfg.cost;
 if(money<cost){toast('الذهب لا يكفي لشراء الجندي');return false}
 if(!road.has(x+','+y)){toast('الجنود يجب أن يتمركزوا على مسار الأعداء');return false}
 if(towers.some(q=>q.x===x&&q.y===y)||soldiers.some(q=>q.x===x&&q.y===y)){toast('هذا المكان مشغول');return false}
 money-=cost;
 const lv=extra.unitLevels[type]||1,scale=1+(lv-1)*.22;
 const unit={type,x,y,cd:0,hp:cfg.hp*scale,max:cfg.hp*scale,level:lv,dead:false};
 soldiers.push(unit);
 const g=new THREE.Group();
 const bodyMat=mat(type==='archer'?0xd9a64a:type==='swords'?0xcbd3df:0x5da982,.65,.12);
 const armorMat=mat(type==='archer'?0x78502c:type==='swords'?0x65758c:0x345d49,.55,.35);
 addMesh(g,geo.sphere,bodyMat,0,.34,0,.22,.28,.2);
 addMesh(g,geo.box,armorMat,0,.32,-.02,.34,.3,.22);
 addMesh(g,geo.sphere,mat(0xe4b68b),0,.63,-.015,.16,.16,.16);
 if(type==='archer'){addMesh(g,geo.rod,mat(0x8b572e),.25,.45,0,.6,.65,.6);addMesh(g,geo.rod,mat(0xd8c08a),.25,.45,0,.12,.8,.12)}
 else {addMesh(g,geo.rod,mat(0xbac7d4),.28,.48,-.08,.18,1.35,.18);addMesh(g,geo.box,armorMat,-.22,.34,-.04,.18,.35,.12)}
 const hpBack=addMesh(g,geo.box,mat(0x101b25,.5,.15),0,1.02,0,.58,.055,.045);const hpFill=addMesh(g,geo.box,mat(0x37d8f4,.35,.12),0,1.035,0,.52,.065,.05);unit.hpBarBack=hpBack;unit.hpBarFill=hpFill;g.position.set(x+.5,0,y+.5);enemyGroup.add(g);unit.mesh=g;soldierMeshes.push(g);
 unitBuild=null;ui();toast(cfg.icon+' تم نشر '+cfg.name+' على المسار');return true
}
function showPanel(title,html){$('extraTitle').textContent=title;$('extraBody').innerHTML=html;$('extraPanel').classList.add('open')}
function shopPanel(){showPanel('🛒 متجر الجواهر التجريبي',`<p class="extraNote">رصيدك الحالي: <b>${gems} 💎</b><br>المتجر تجريبي بالكامل؛ الضغط على شراء يضيف الجواهر للتجربة فقط ولا يسحب أي أموال.</p><div class="extraRow"><span>💎 80 جوهرة <small>حزمة المستكشف</small></span><button data-demo-gem="80">$0.99 · شراء تجريبي</button></div><div class="extraRow"><span>💎 450 جوهرة <small>حزمة المغامر</small></span><button data-demo-gem="450">$4.99 · شراء تجريبي</button></div><div class="extraRow"><span>💎 1,000 جوهرة <small>حزمة المحارب</small></span><button data-demo-gem="1000">$9.99 · شراء تجريبي</button></div><div class="extraRow"><span>💎 2,500 جوهرة <small>حزمة الملك</small></span><button data-demo-gem="2500">$19.99 · شراء تجريبي</button></div><p class="extraNote">لا توجد بوابة دفع حقيقية أو عملية مالية. هذه المحاكاة لا تخصم أي مبلغ.</p>`);$('extraBody').querySelectorAll('[data-demo-gem]').forEach(b=>b.onclick=()=>{const amount=Number(b.dataset.demoGem)||0;if(!amount)return;gems+=amount;saveMeta();shopPanel();toast('💎 تمت إضافة '+amount+' جوهرة تجريبياً')})}
function unitsPanel(){showPanel('🪖 قيادة الجنود',`<p class="extraNote">اختر نوع الجندي ثم اضغط على خانة من مسار الأعداء نفسه. الجنود يقاتلون الوحوش ويمكن أن يموتوا أثناء المعركة.</p><div class="extraGrid">${Object.entries(UNIT).map(([k,v])=>`<button data-unit="${k}">${v.icon} ${v.name}<br>${v.cost} 🪙 · ${soldiers.filter(u=>u.type===k).length} منشور</button>`).join('')}</div><div class="extraRow"><span>نقاط التطوير الدائمة: ${extra.unitPoints}</span><button id="unitUpgradeOpen">تطوير الجنود</button></div><div class="extraRow"><span>إزالة آخر جندي منشور</span><button id="unitRemove">إزالة</button></div>`);$('extraBody').querySelectorAll('[data-unit]').forEach(b=>b.onclick=()=>{unitBuild=b.dataset.unit;$('extraPanel').classList.remove('open');toast('حدد خانة على مسار الأعداء لنشر '+UNIT[unitBuild].name)});$('unitUpgradeOpen').onclick=()=>unitUpgradePanel();$('unitRemove').onclick=()=>{if(!soldiers.length)return toast('لا يوجد جنود');const u=soldiers.pop();if(u.mesh){enemyGroup.remove(u.mesh);u.mesh.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()})}soldierMeshes=soldiers.map(u=>u.mesh).filter(Boolean);unitsPanel()}}
function unitUpgradePanel(){
 let chosen=window.__jsChosenUnit||'infantry';
 const render=()=>{
  const cfg=UNIT[chosen],lv=Math.max(1,Math.min(5,Number(extra.unitLevels[chosen])||1)),next=lv<5,can=next&&extra.unitPoints>=1;
  const benefits=['مقاتل يدافع عن المسارات','زيادة الصحة','زيادة الضرر','زيادة سرعة الهجوم','تحسينات إضافية'];
  showPanel('🪖 تطوير الجنود',`<div class="unitUpgradeHero"><div class="unitHeroArt">${cfg.icon}</div><div class="unitHeroText"><strong>${cfg.name}</strong><small>جنود ${cfg.name} يقاتلون على المسار ويتصدون للأعداء.</small></div></div><div class="unitPointsCard"><span>⭐ نقاط التطوير المتاحة</span><strong>${extra.unitPoints}</strong></div><div class="unitUpgradeCards">${Object.entries(UNIT).map(([k,v])=>{const n=Math.max(1,Math.min(5,Number(extra.unitLevels[k])||1));return `<button class="unitUpgradeChoice ${k===chosen?'active':''}" data-choice="${k}"><span class="unitChoiceIcon">${v.icon}</span><b>${v.name}</b><small>المستوى ${n}/5</small>${n>=5?'<em>MAX</em>':''}</button>`}).join('')}</div><div class="unitLevelTrack">${[1,2,3,4,5].map(n=>`<div class="unitLevelCard ${n<=lv?'reached':''} ${n===lv?'current':''}"><div class="unitLevelIcon">${cfg.icon}</div><b>المستوى ${n}</b><small>${n===lv?'(حالي)':n<lv?'مكتمل':'+'+(n-lv)+' ترقية'}</small></div>`).join('')}</div><div class="unitUpgradeInfo"><b>تطوير ${cfg.name}</b><p>${next?'كل ترقية تزيد من قوة الجندي (الصحة والضرر وسرعة الهجوم).':'وصل هذا الجندي إلى أقصى مستوى.'}</p><small>المستوى ${lv} من 5</small></div><button id="unitUpgradeBuy" class="unitUpgradeBuy" ${can?'':'disabled'}>${lv>=5?'🏆 المستوى الأقصى':can?'⬆ ترقية إلى المستوى '+(lv+1)+' · (1 ⭐)':'⭐ تحتاج نقطة تطوير'}</button><p class="extraNote unitUpgradeFoot">التطوير دائم ويعمل في جميع أطوار اللعب. تحصل على نقطة عند الفوز بالمراحل و3 نقاط عند الفوز بمرحلة الوحش.</p>`);
  $('extraBody').querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{chosen=b.dataset.choice;window.__jsChosenUnit=chosen;render()});
  const buy=$('unitUpgradeBuy');if(buy)buy.onclick=()=>{if(lv>=5||extra.unitPoints<1)return;extra.unitPoints--;extra.unitLevels[chosen]=lv+1;saveExtra();render();toast('⭐ تم تطوير '+cfg.name+' إلى المستوى '+(lv+1))};
 };
 window.__jsChosenUnit=chosen;render();
}

function modesPanel(){showPanel('🎮 أوضاع اللعب الأخرى',`<p class="extraNote">اختر طوراً مستقلاً عن خريطة المستويات.</p><div class="extraRow"><span>🌊 البقاء <small>موجات لا نهائية؛ تنتهي عند نفاد القلعة</small></span><button data-mode="survival">اختيار</button></div><div class="extraRow"><span>🎯 التحدي <small>إنهاء المرحلة دون خسارة أكثر من حياة واحدة</small></span><button data-mode="challenge">اختيار</button></div><div class="extraRow"><span>👑 الزعماء <small>مواجهة زعيم في نهاية كل موجة</small></span><button data-mode="boss">اختيار</button></div><p class="extraNote">الطور المحدد حالياً: ${{survival:'البقاء',challenge:'التحدي',boss:'الزعماء',campaign:'وضع المستويات'}[gameMode]}</p>`);$('extraBody').querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{gameMode=b.dataset.mode;$('extraPanel').classList.remove('open');toast('تم اختيار طور '+({survival:'البقاء',challenge:'التحدي',boss:'الزعماء'}[gameMode]));if(gameMode==='boss')stage.waves=Math.max(3,stage.waves);panelFromHome=false;openMap()})}

function achHub(){showPanel('🏆 الإنجازات',`<button class="hubBtn" id="hubBig"><i>🏆</i><span>الإنجازات الكبرى<small>القتل والانتصارات والزعماء</small></span></button><button class="hubBtn" id="hubDaily"><i>📅</i><span>الإنجازات اليومية<small>مكافأة الدخول اليومية</small></span></button>`);$('hubBig').onclick=achBig;$('hubDaily').onclick=achDaily}
function achBig(){showPanel('🏆 الإنجازات الكبرى',`<p class="extraNote">القتل: ${extra.ach.kills||0} · الانتصارات: ${extra.ach.wins||0} · الزعماء: ${extra.ach.boss||0} · انتصارات بلا خسارة: ${extra.ach.clean||0}</p><div class="extraRow"><span>⚔️ اقتل 100 عدو <small>${Math.min(100,extra.ach.kills||0)}/100</small></span><button data-ach="kills" ${extra.claimed.kills?'disabled':''}>${extra.claimed.kills?'تم الاستلام':'استلام 100 🪙'}</button></div><div class="extraRow"><span>🏰 اربح 5 مراحل <small>${Math.min(5,extra.ach.wins||0)}/5</small></span><button data-ach="wins" ${extra.claimed.wins?'disabled':''}>${extra.claimed.wins?'تم الاستلام':'استلام 8 💎'}</button></div><div class="extraRow"><span>👑 اهزم 3 زعماء <small>${Math.min(3,extra.ach.boss||0)}/3</small></span><button data-ach="boss" ${extra.claimed.boss?'disabled':''}>${extra.claimed.boss?'تم الاستلام':'استلام 15 💎'}</button></div><div class="extraRow"><span></span><button id="achBack">رجوع</button></div>`);$('extraBody').querySelectorAll('[data-ach]').forEach(b=>b.onclick=()=>{const k=b.dataset.ach,need={kills:100,wins:5,boss:3}[k];if((extra.ach[k]||0)<need)return toast('لم يكتمل الإنجاز بعد');if(extra.claimed[k])return;extra.claimed[k]=true;if(k==='kills')extra.coins+=100;else gems+=k==='wins'?8:15;saveExtra();saveMeta();refreshHomeProfile();achBig()});$('achBack').onclick=achHub}
function achDaily(){const today=new Date().toISOString().slice(0,10),daily=extra.daily===today;showPanel('📅 الإنجازات اليومية',`<div class="extraRow"><span>📅 مكافأة الدخول اليومية <small>${daily?'تم استلامها اليوم':'متاحة الآن'}</small></span><button id="dailyClaim" ${daily?'disabled':''}>استلام 20 🪙 + 3 💎</button></div><div class="extraRow"><span></span><button id="achBack">رجوع</button></div>`);$('dailyClaim').onclick=()=>{if(extra.daily===today)return;extra.daily=today;extra.coins+=20;gems+=3;saveExtra();saveMeta();refreshHomeProfile();achDaily()};$('achBack').onclick=achHub}
$('openShop').onclick=shopPanel;$('openUnits').onclick=unitsPanel;$('openModes').onclick=modesPanel;$('openTasks').onclick=achHub;
function loop(ts){requestAnimationFrame(loop);const dt=Math.min(.05,(ts-last)/1000||0)*speed;last=ts;tm=ts/1000;if(!over&&$('lm').style.display!=='flex')update(dt);draw3d()}
addEventListener('resize',()=>{fit();draw3d()});
function refreshHomeProfile(){const wins=Math.max(0,Number(extra.ach.wins)||0),playerLevel=1+Math.floor(wins/5),xp=wins%5;const h=$('homeLevel'),f=$('homeXPFill'),t=$('homeXPText'),g=$('homeGems');if(h)h.textContent=playerLevel;if(f)f.style.width=(xp/5*100)+'%';if(t)t.textContent=xp+' / 5 انتصارات';if(g)g.textContent=Number(gems)||0;}
try{setMap(stage.wp);fit();reset();refreshHomeProfile();$('lm').style.display='none';$('loading').style.display='none';$('homeLevels').onclick=()=>{panelFromHome=false;$('splash').style.display='none';gameMode='campaign';openMap()};
 $('homeModes').onclick=()=>{panelFromHome=true;$('splash').style.display='none';modesPanel()};
 $('homeUnits').onclick=()=>{panelFromHome=true;$('splash').style.display='none';unitUpgradePanel()};
 $('homeShop').onclick=()=>{panelFromHome=true;$('splash').style.display='none';shopPanel()};
 $('homeAch').onclick=()=>{panelFromHome=true;$('splash').style.display='none';achHub()};
 $('homeGemPlus').onclick=()=>{panelFromHome=true;$('splash').style.display='none';shopPanel()};
 $('homeExit').onclick=()=>{try{window.close()}catch(e){}toast('يمكنك إغلاق التطبيق من جهازك')};
 $('homeModes').onkeydown=e=>{if(e.key==='Enter')$('homeModes').click()};
 document.querySelectorAll('.jp-hs[data-m]').forEach(b=>b.onclick=e=>{e.stopPropagation();panelFromHome=true;$('splash').style.display='none';modesPanel()});
 $('homeSettings').onclick=()=>{panelFromHome=true;$('splash').style.display='none';showPanel('⚙️ الإعدادات',`<p class="extraNote">JUNGLE SIEGE v0.1.10</p><div class="extraRow"><span>اتجاه اللعب المفضل</span><b>أفقي عند تدوير الهاتف</b></div><div class="extraRow"><span>بيانات التقدم</span><b>محفوظة على هذا الجهاز</b></div>`)};
 $('extraClose').onclick=()=>{$('extraPanel').classList.remove('open');if(panelFromHome){refreshHomeProfile();$('splash').style.display='flex';panelFromHome=false}};
 requestAnimationFrame(loop)}catch(err){console.error(err);$('loading').innerHTML='<b>تعذّر تشغيل عالم 3D</b><small>افتح الملف مع اتصال بالإنترنت ومتصفح حديث يدعم WebGL.</small>';}