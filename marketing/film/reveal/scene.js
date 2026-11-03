/** A single spatial product reveal. UI surfaces assemble, separate, and become a physical sharing object. */
import * as THREE from '/vendor/three.module.js'
const W=+document.body.dataset.width,H=+document.body.dataset.height,portrait=H>W,D=26
const renderer=new THREE.WebGLRenderer({canvas:document.querySelector('canvas'),alpha:true,antialias:true,preserveDrawingBuffer:true});renderer.setSize(W,H);renderer.setPixelRatio(1);renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,W/H,.1,100);scene.add(new THREE.HemisphereLight(0xffffff,0x505050,2.8))
for(const[intensity,x,y,z]of[[6,-5,8,8],[4,6,1,4],[3,-4,-3,-4]]){const l=new THREE.DirectionalLight(0xffffff,intensity);l.position.set(x,y,z);scene.add(l)}
const key=scene.children.find(x=>x.isDirectionalLight);key.castShadow=true;key.shadow.mapSize.set(512,512);key.shadow.camera.left=-10;key.shadow.camera.right=10;key.shadow.camera.top=10;key.shadow.camera.bottom=-10;key.shadow.bias=-.001
const group=new THREE.Group();scene.add(group);const main=new THREE.Group();group.add(main)
const rounded=(w,h,r)=>{const x=-w/2,y=-h/2,s=new THREE.Shape();s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s}
const loader=new THREE.TextureLoader(),metadata=await(await fetch('assets/assets.json')).json(),textures={}
await Promise.all(Object.entries(metadata).map(async([id,m])=>{const tex=await loader.loadAsync('assets/'+m.file);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textures[id]=tex}))
const surfaces=[]
function surface(id,w,h,parent=group,r=.18){const geometry=new THREE.ShapeGeometry(rounded(w,h,r),24),pos=geometry.attributes.position,uv=geometry.attributes.uv;for(let i=0;i<pos.count;i++)uv.setXY(i,(pos.getX(i)+w/2)/w,(pos.getY(i)+h/2)/h);const mat=new THREE.MeshBasicMaterial({map:textures[id],transparent:true,side:THREE.DoubleSide,depthWrite:false});const mesh=new THREE.Mesh(geometry,mat);mesh.castShadow=false;parent.add(mesh);surfaces.push(mesh);return mesh}
function body(w,h,parent=group){const geo=new THREE.ExtrudeGeometry(rounded(w,h,.23),{depth:.065,bevelEnabled:true,bevelThickness:.028,bevelSize:.028,bevelSegments:4,steps:1}),mat=new THREE.MeshPhysicalMaterial({color:0x222222,metalness:.65,roughness:.24,clearcoat:1,transparent:true});const m=new THREE.Mesh(geo,mat);m.position.z=-.1;m.castShadow=true;parent.add(m);return m}
const plate=body(3.3,8.55,main),profile=surface('profile',3.1,3.1*metadata.profile.height/metadata.profile.width,main),menu=surface('menu',3.1,3.1*metadata.menu.height/metadata.menu.width,main)
const time=surface('time',4.7,4.7*metadata.time.height/metadata.time.width),stock=surface('stock',3.3,3.3*metadata.stock.height/metadata.stock.width),cafe=surface('cafe',3.5,3.5*metadata.cafe.height/metadata.cafe.width)
const qr=surface('qr',2.25,2.25,main,.1),identity=surface('identity',1.7,.73,main,.05),page=surface('page',2.6,2.6*metadata.page.height/metadata.page.width),brand=surface('brand',2.5,.72)
qr.rotation.y=identity.rotation.y=Math.PI;qr.position.set(0,-.15,-.18);identity.position.set(0,1.45,-.18)
const shadow=new THREE.Mesh(new THREE.PlaneGeometry(50,50),new THREE.ShadowMaterial({opacity:0}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-5.1;shadow.receiveShadow=true;scene.add(shadow)
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)},mix=(a,b,p)=>a+(b-a)*p,gate=(t,a,b)=>smooth((t-a)/(b-a)),fade=(t,a,b,c,d)=>gate(t,a,b)*(1-gate(t,c,d))
function pose(object,t,keys){let a=keys[0],b=keys.at(-1);for(let i=0;i<keys.length-1;i++)if(t>=keys[i][0]&&t<=keys[i+1][0]){a=keys[i];b=keys[i+1];break}const p=smooth((t-a[0])/Math.max(.001,b[0]-a[0]));const v=a.slice(1).map((n,i)=>mix(n,b[i+1],p));object.position.set(v[0],v[1],v[2]);object.rotation.set(v[3],v[4],v[5]);object.scale.setScalar(v[6]??1)}
function opacity(mesh,n){mesh.visible=n>.001;mesh.material.opacity=n}
function renderAt(input){const t=Math.max(0,Math.min(D,input)),all=fade(t,0,.75,25,26)
 camera.position.set(Math.sin(t*.18)*.9,mix(.3,.05,gate(t,3,18)),portrait?17:17.5);camera.lookAt(0,0,0)
 group.scale.setScalar(portrait?1.16-.30*gate(t,5,8)-.08*gate(t,11,13)+.30*gate(t,16,20):1);group.position.set(0,0,0)
 pose(main,t,[[0,0,0,0,.02,1.35,0,1],[4,0,0,0,.02,-.22,-.025,1],[7,-1.6,0,-.4,.02,-.3,-.03,1],[11,-2.1,0,-.8,.02,-.38,-.05,.92],[15,-.8,0,0,.04,.4,-.04,.94],[19,-1.6,.1,0,-.06,3.02,.035,1],[23,-1.6,.15,0,-.05,3.1,.02,1],[26,0,0,0,.02,4.49,0,1]])
 pose(profile,t,[[0,-4.5,2.8,-2,.2,-.8,-.08,.8],[3.5,0,2.3,.03,0,0,0,1],[13,0,2.3,.03,0,0,0,1],[17,0,2.3,-1,.1,.3,0,.7],[26,0,2.3,-1,0,0,0,.7]])
 pose(menu,t,[[0,4,-2.2,1,.1,.7,.12,.8],[4.5,0,-1.78,.04,0,0,0,1],[7,.65,-1.45,1.35,-.04,.15,.025,1],[11,.65,-1.4,1.3,-.02,.15,.02,1],[15,0,-1.78,.04,0,0,0,1],[17,0,-1.5,-1,0,.5,0,.7],[26,0,-1.5,-1,0,0,0,.7]])
 const press=1-.025*Math.sin(Math.PI*gate(t,10.4,10.75))*(1-gate(t,10.75,11.1))
 pose(time,t,[[0,5,0,-4,0,-.5,0,.5],[5.8,4.5,.1,-2,.05,-.6,.04,.7],[8.5,1.2,.1,1.8,.02,-.18,.015,1],[11.4,1,.1,2,.01,-.1,0,1],[14,3.8,1,-2,.1,-.7,.06,.65],[18,5,1,-4,0,-1,0,.4],[26,5,1,-4,0,-1,0,.4]]);time.scale.multiplyScalar(press)
 pose(stock,t,[[0,7,.4,-4,0,-.6,0,.6],[10.5,6,.4,-4,0,-.6,0,.6],[13.5,3.5,.4,-.6,.03,-.35,.055,.8],[16,4.8,1.2,-2,.1,-.9,.06,.6],[26,7,1,-4,0,-1,0,.4]])
 pose(cafe,t,[[0,-7,.8,-4,0,.6,0,.6],[10.5,-6,.8,-4,0,.6,0,.6],[13.5,-3.6,.3,-.6,-.02,.3,-.055,.85],[16,-4.5,1,-2,.1,.9,-.06,.5],[26,-7,1,-4,0,1,0,.4]])
 pose(page,t,[[0,4,0,-5,0,-.5,0,.5],[16,4,0,-5,0,-.5,0,.5],[20,2,.1,.4,0,-.16,-.025,1],[23,2,.1,.4,0,-.13,-.02,1],[26,4,0,-4,0,-1,0,.5]])
 plate.scale.y=mix(1,.52,gate(t,15,18));plate.material.opacity=all;plate.visible=all>.001
 opacity(profile,all*(1-gate(t,15,16.7)));opacity(menu,all*(1-gate(t,15,16.7)));opacity(time,all*fade(t,5.7,7.4,13,15));opacity(stock,all*fade(t,11,12.5,15,16.8));opacity(cafe,all*fade(t,11,12.5,15,16.8));opacity(qr,all*gate(t,16,17.5));opacity(identity,all*gate(t,16,17.5));opacity(page,all*gate(t,17.5,20))
 brand.position.set(0,-4.25,.8);opacity(brand,all*gate(t,20,21.5));renderer.render(scene,camera)
}
window.__timelines={main:{seek:renderAt}};window.__revealReady=true;window.__revealDuration=D;renderAt(0)
