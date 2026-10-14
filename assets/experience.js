/**
 * Westgate scroll journey. Procedural geometry built with Three.js r160.
 * Works without a bundler on GitHub Pages. If WebGL or CDN access is unavailable,
 * the accessible HTML and locally hosted SVG scene remain fully usable.
 */
const canvas = document.getElementById('worldCanvas');
const world = document.getElementById('world');
const track = document.getElementById('progressLine');
const header = document.getElementById('siteHeader');
const dots = [...document.querySelectorAll('.chapter-dot')];
const chapters = [...document.querySelectorAll('.chapter[data-scene]')];
const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let scrollProgress = 0;
let active = true;
let ticking = false;

function updateScroll() {
  const doc = document.documentElement;
  scrollProgress = Math.max(0, Math.min(1, window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight)));
  if (track) track.style.width = `${(100 * scrollProgress).toFixed(2)}%`;
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 40);
  const marker = window.innerHeight * .48;
  let current = 0;
  chapters.forEach((el, index) => { if (el.getBoundingClientRect().top <= marker) current = index; });
  dots.forEach((dot, index) => dot.classList.toggle('is-active', index === current));
  ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); } }, { passive:true });
window.addEventListener('resize', updateScroll, { passive:true });
window.addEventListener('pageshow', updateScroll);
updateScroll();
if (canvas && world && motion) initThree();

async function initThree() {
  let T;
  try { T = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'); }
  catch (e) {
    try { T = await import('https://unpkg.com/three@0.160.0/build/three.module.js'); }
    catch (error) { console.info('Using the Westgate illustrated fallback. 3D library not available.'); return; }
  }
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference:'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.35 : 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.24;
  } catch (error) { console.info('WebGL unavailable. Keeping the illustrated scene.'); return; }

  const scene = new T.Scene();
  scene.fog = new T.FogExp2(0x102b3c, .017);
  const camera = new T.PerspectiveCamera(61, window.innerWidth/window.innerHeight, .1, 210);
  const hemi = new T.HemisphereLight(0xb9dbef, 0x0e1c26, 2.6);
  scene.add(hemi);
  const mainLight = new T.DirectionalLight(0xffc7a0, 2.8); mainLight.position.set(-13, 19, -18); scene.add(mainLight);
  const coolLight = new T.DirectionalLight(0x6794b9, 1.4); coolLight.position.set(10, 13, 11); scene.add(coolLight);
  const M = (color, roughness = .88, metalness=0) => new T.MeshStandardMaterial({color,roughness,metalness});
  const red = M(0xb4333d,.68), darkRed=M(0x691e2a,.85), highlight=M(0xce5a55,.58),
        charcoal=M(0x172c35), ground=M(0x1a3337), moss=M(0x304d42),
        stone=[M(0x9c9d93),M(0x808f8c),M(0x687e7a)],
        timber=M(0x263e41), roof=M(0x253845), trunk=M(0x3a3a36),
        blossom=[M(0xa97979),M(0xbf8e91),M(0x9b757e)], leaf=[M(0x486354),M(0x5c7763)],
        lanternGlow=new T.MeshStandardMaterial({color:0xffb986,emissive:0xdd8350,emissiveIntensity:2.4,roughness:.6});
  const box = new T.BoxGeometry(1,1,1);
  const cylinder = new T.CylinderGeometry(1,1,1,9);
  const sphere = new T.IcosahedronGeometry(1,1);
  function cube(parent, material, x,y,z, sx,sy,sz, rot=0) {
    const ob = new T.Mesh(box, material); ob.position.set(x,y,z); ob.scale.set(sx,sy,sz); ob.rotation.z=rot; parent.add(ob); return ob;
  }
  function pole(parent, material, x,y,z,radius,height){
    const obj=new T.Mesh(cylinder,material); obj.position.set(x,y,z);obj.scale.set(radius,height,radius);parent.add(obj);return obj;
  }
  function blob(parent,material,x,y,z,sx,sy,sz){
    const obj=new T.Mesh(sphere,material);obj.position.set(x,y,z);obj.scale.set(sx,sy,sz);parent.add(obj);return obj;
  }
  function torii(x,z,s=1){
    const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(s);
    for(const side of [-1,1]){
      pole(g,red,side*3,2.7,0,.185,5.4);
      cube(g,darkRed,side*3,.32,0,.7,.44,.85);
      cube(g,red,side*3,5.15,0,.37,.5,.55);
    }
    cube(g,highlight,0,5.55,0,7.65,.32,.8);
    // Upturned beam ends, a roof-like silhouette
    cube(g,darkRed,-3.89,5.68,0,1.05,.31,.86,-.18);
    cube(g,darkRed,3.89,5.68,0,1.05,.31,.86,.18);
    cube(g,red,0,4.65,0,6.9,.19,.62);
    cube(g,darkRed,0,5.06,.08,1.15,.53,.46);
    cube(g,highlight,0,5.16,.38,.8,.26,.08);
    scene.add(g);return g;
  }
  function lantern(x,z,h=2.4){
    const grp=new T.Group();grp.position.set(x,0,z);
    cube(grp,stone[2],0,.33,0,.48,.66,.47);
    pole(grp,stone[0],0,1.3,0,.14,1.55);
    cube(grp,stone[0],0,2.08,0,.76,.13,.76);
    const paper=cube(grp,lanternGlow,0,2.42,0,.51,.63,.51);
    paper.material=lanternGlow;
    cube(grp,roof,0,2.8,0,.82,.15,.82);
    scene.add(grp);
  }
  // Distant landscape, paved ceremonial path
  const floor=new T.Mesh(new T.PlaneGeometry(260,260),ground);floor.rotation.x=-Math.PI/2;floor.position.set(0,-.12,-62);scene.add(floor);
  const road=new T.Mesh(new T.PlaneGeometry(5,162),timber);road.rotation.x=-Math.PI/2;road.position.set(0,-.055,-62);scene.add(road);
  for(let i=0;i<125;i++){
    const z=10-i*1.14;
    const wav=Math.sin(z*.047)*.08;
    const slab=cube(scene,stone[i%stone.length],wav,.013,z,4.6,.09,1.02);
    slab.rotation.y=Math.sin(i*1.37)*.008;
    if(i%3===0){cube(scene,moss,-3.1,.015,z,1.35,.13,1.9);cube(scene,moss,3.1,.015,z,1.35,.13,1.9);}
  }
  const gates=[];
  [7,-6,-19,-32,-45,-58,-71,-84].forEach((z,i)=>gates.push(torii(Math.sin(i*.7)*.23,z,i===0?1.17:1)));
  for(let i=0;i<28;i++){
    const z=6-i*3.6;
    lantern(-5.5,z);lantern(5.5,z-1.1);
  }
  const mobile=window.innerWidth<740;
  const rng=(n)=>{let v=Math.sin(n*128.287+78.233)*43758.5453;return v-Math.floor(v)};
  const trees=mobile?28:52;
  for(let i=0;i<trees;i++){
    const z=9-i*(112/trees);
    for(const side of [-1,1]){
      const shift=rng(i*9+side)*3;
      const x=side*(8.8+shift);
      const height=5+rng(i*27)*4;
      pole(scene,trunk,x,height*.36,z,.15,height*.72);
      const mat=(i%4===0)?leaf[i%2]:blossom[i%3];
      blob(scene,mat,x,height*.75,z,1.7+rng(i*11),2.3+rng(i*47),1.75+rng(i*13));
      blob(scene,mat,x+side*.85,height*.61,z-.8,1.45,1.5,1.35);
      if(i%4===0){blob(scene,leaf[i%2],x-side*2.5,1.1,z,2.6,1.5,2.8);}
    }
  }
  // Ceremonial learning hall at the end of the route
  const hall=new T.Group();hall.position.z=-111;
  cube(hall,stone[2],0,.25,0,16,.48,12);
  cube(hall,stone[1],0,.49,0,14,.25,10);
  cube(hall,red,0,3,-2.4,13.6,4.6,.38);
  cube(hall,timber,0,3,2.4,13.6,4.6,.35);
  for(const x of [-6,-3,0,3,6]){pole(hall,red,x,2.8,3,.22,4.8);pole(hall,red,x,2.8,-3,.22,4.8);}
  cube(hall,roof,0,5.8,0,18,1,13);
  cube(hall,darkRed,0,6.36,0,19,.18,13.6);
  cube(hall,roof,0,7.1,0,14,.8,9);
  cube(hall,darkRed,0,7.56,0,15,.19,9.7);
  cube(hall,lanternGlow,0,2.6,3.31,1.4,2.9,.09);
  scene.add(hall);
  // Landscape fireflies and drifting petals: one points drawcall.
  const particles=mobile?175:450;
  const positions=new Float32Array(particles*3);
  for(let i=0;i<particles;i++){
    positions[i*3]=(rng(i*43)-.5)*34;
    positions[i*3+1]=1+rng(i*13+8)*13;
    positions[i*3+2]=13-rng(i*29+3)*138;
  }
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(positions,3));
  const dots3d=new T.Points(geo,new T.PointsMaterial({color:0xffd7bb,size:mobile?.075:.10,transparent:true,opacity:.73,sizeAttenuation:true,depthWrite:false}));scene.add(dots3d);
  // Low-contrast atmospheric mountains.
  const mountainMat=M(0x1b3440);
  for(let i=0;i<13;i++){
    const z=-22-i*11;
    for(const side of [-1,1]){
      const ob=new T.Mesh(new T.ConeGeometry(10+(i%3)*5,18+(i%4)*5,5),mountainMat);
      ob.position.set(side*(33+(i%3)*8),4,z);scene.add(ob);
    }
  }
  camera.position.set(3.3,3.45,15);
  camera.lookAt(0,2,-2);
  world.classList.add('three-ready');
  let last=performance.now();
  const clock=new T.Clock();
  const smooth=(a,b,t)=>a+(b-a)*t;
  let visualProgress=0;
  function resize() {
    const w=window.innerWidth,h=window.innerHeight;
    camera.aspect=w/h;
    camera.fov=w<680?76:61;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,w<700?1.25:1.75));
    renderer.setSize(w,h);
  }
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',()=>{active=!document.hidden; if(active){last=performance.now();requestAnimationFrame(draw);}});
  let running=false;
  function draw(now) {
    if (!active) {running=false;return;}
    running=true;
    const dt=Math.min((now-last)/1000,.05);last=now;
    visualProgress=smooth(visualProgress,scrollProgress,1-Math.exp(-dt*2.7));
    // Distances are interpolated through the scene as each full-page chapter scrolls by.
    const z=15-visualProgress*119;
    const x=(window.innerWidth<680?1.5:3.2)*Math.cos(visualProgress*1.15)+Math.sin(visualProgress*6.2)*.45;
    const y=3.35+Math.sin(visualProgress*7.5)*.36;
    camera.position.set(x,y,z);
    camera.lookAt(Math.sin(visualProgress*3.8)*.45,2.1,z-19);
    dots3d.rotation.y=Math.sin(clock.elapsedTime*.065)*.003;
    renderer.render(scene,camera);
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}
