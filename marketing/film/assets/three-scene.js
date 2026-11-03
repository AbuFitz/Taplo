/* Authored 3D stage: extruded device bodies, photographed UI textures, lit materials and deterministic camera choreography. */
import * as THREE from '/vendor/three.module.js'
const W = Number(document.body.dataset.width), H = Number(document.body.dataset.height), D = Number(document.body.dataset.duration)
const portrait = document.body.classList.contains('portrait'), square = document.body.classList.contains('square'), feed = document.body.classList.contains('feed')
const vertical = portrait || square || feed
const scene = new THREE.Scene()
scene.background = new THREE.Color('#080808')
const camera = new THREE.PerspectiveCamera(35, W/H, .1, 100)
camera.position.set(0, 0, vertical ? 16 : 12)
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas'), antialias: true, preserveDrawingBuffer: true })
renderer.setSize(W,H); renderer.setPixelRatio(1); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap
scene.add(new THREE.HemisphereLight(0xffffff, 0x141414, 2.5))
function light(colour, intensity, x,y,z) { const l = new THREE.DirectionalLight(colour,intensity); l.position.set(x,y,z); scene.add(l); return l }
const key = light(0xffffff, 5, -5,8,6); key.castShadow = true; key.shadow.mapSize.set(1024,1024); key.shadow.camera.left=-12;key.shadow.camera.right=12;key.shadow.camera.top=12;key.shadow.camera.bottom=-12;key.shadow.bias=-.001
light(0xffffff, 4, 6,3,-3); light(0xbcbcbc, 3, -6,-2,-1)
const stage = new THREE.Group(); scene.add(stage)
function rounded(w,h,r) { const x=-w/2,y=-h/2,s=new THREE.Shape(); s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s }
const metal = new THREE.MeshPhysicalMaterial({ color:0x333333, metalness:.85, roughness:.24, clearcoat:1, clearcoatRoughness:.2 })
const dark = new THREE.MeshStandardMaterial({ color:0x080808, roughness:.28, metalness:.6 })
const loader = new THREE.TextureLoader()
const textures = await Promise.all(['station','detailer','dealer','desktop','booking'].map(async id => { const t=await loader.loadAsync(`assets/three/${id}.webp`);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t }))
function screen(w,h,r,tex) { const g=new THREE.ShapeGeometry(rounded(w,h,r),32);const p=g.attributes.position,uv=g.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,(p.getX(i)+w/2)/w,(p.getY(i)+h/2)/h);return new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:tex})) }
function phone(tex) {
  const g=new THREE.Group(), body = new THREE.Mesh(new THREE.ExtrudeGeometry(rounded(2.86,6.03,.36),{depth:.14,bevelEnabled:true,bevelThickness:.055,bevelSize:.055,bevelSegments:5,steps:1}),metal)
  body.castShadow=true;g.add(body)
  const bezel=screen(2.8,5.97,.34,new THREE.DataTexture(new Uint8Array([8,8,8,255]),1,1));bezel.material.map.needsUpdate=true;bezel.position.z=.2;g.add(bezel)
  const display=screen(2.66,5.75,.25,tex);display.position.z=.211;g.add(display)
  const notch=new THREE.Mesh(new THREE.ShapeGeometry(rounded(.72,.13,.065)),dark);notch.position.set(0,2.75,.224);g.add(notch)
  for(const [x,y,h] of [[-1.48,.9,.4],[-1.48,.2,.4],[1.48,.45,.7]]) {const b=new THREE.Mesh(new THREE.BoxGeometry(.04,h,.08),metal);b.position.set(x,y,.04);g.add(b)}
  stage.add(g);return {group:g, display}
}
const devices=textures.slice(0,3).map(phone)
const monitor=new THREE.Group();const monitorBody=new THREE.Mesh(new THREE.ExtrudeGeometry(rounded(7.8,5.5,.2),{depth:.12,bevelEnabled:true,bevelThickness:.04,bevelSize:.04,bevelSegments:3}),metal);monitorBody.castShadow=true;monitor.add(monitorBody)
const monitorScreen=screen(7.6,5.25,.14,textures[3]);monitorScreen.position.z=.17;monitor.add(monitorScreen);stage.add(monitor)
const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.MeshStandardMaterial({color:0x080808,roughness:.5,metalness:.1}));floor.rotation.x=-Math.PI/2;floor.position.y=-5.4;floor.receiveShadow=true;scene.add(floor)
const words=document.querySelector('#words'), headline=words.querySelector('h1'), eyebrow=document.querySelector('#eyebrow'), line=document.querySelector('#line')
const beats=[
  ['Business pages by Taplo','Your work.\nOpen for business.','Services, prices and bookings on one page.'],
  ['Online appointments','Choose a service.\nBook a time.','Let customers book from your business page.'],
  ['Design examples','Your photos.\nYour colours.','Choose a design and make it work for your business.'],
  ['Vehicle stock','Show the car.\nArrange a viewing.','Photos, prices and specifications. Ready for an enquiry.'],
  ['Taplo','Build your\nbusiness page.','Start free. Add your services or stock.'],
]
const clamp=x=>Math.max(0,Math.min(1,x)), ease=x=>{x=clamp(x);return 1-Math.pow(1-x,3)}, mix=(a,b,t)=>a+(b-a)*t
function renderAt(input) {
  const t=input*18/D, part=t<3?0:t<6?1:t<10?2:t<14?3:4, start=[0,3,6,10,14][part], end=[3,6,10,14,18][part], p=ease((t-start)/(end-start))
  const [e,h,l]=beats[part];eyebrow.textContent=e;headline.textContent=h;line.textContent=l
  words.style.opacity=String(Math.min(clamp((t-start)/.35),clamp((end-t)/.25)));words.style.transform=`translateY(${(1-clamp((t-start)/.5))*20}px)`
  stage.position.set(vertical?0:3.15,vertical?(portrait?-1.3:-1.8):0,0)
  const scale=vertical?(portrait?.92: .78):1;stage.scale.setScalar(scale)
  devices[1].display.material.map=part===1?textures[4]:textures[1]
  monitor.visible=part===3
  devices.forEach(({group:g},i)=>{g.visible=part!==3;g.position.set(0,0,0);g.rotation.set(0,0,0);g.scale.setScalar(1)})
  if(part===0) {
    devices[0].group.rotation.set(mix(.1,-.02,p),mix(-1.12,-.28,p),mix(.14,.04,p));devices[0].group.position.z=mix(-2,.4,p)
    devices[1].group.visible=false;devices[2].group.visible=false
  } else if(part===1) {
    const a=devices[0].group,b=devices[1].group;a.position.set(mix(0,-.85,p),.1,.4);a.rotation.set(-.04,mix(-.28,.16,p),-.06)
    b.position.set(mix(.1,1.25,p),mix(-.6,-.25,p),mix(-2,-.45,p));b.rotation.set(.08,-.38,.08);b.scale.setScalar(.88);devices[2].group.visible=false
  } else if(part===2||part===4) {
    const spread=vertical?1.2:1.65
    devices.forEach(({group:g},i)=>{g.position.set((i-1)*spread,mix((i===1?.25:-.1)-.4,i===1?.25:-.1,p),i===1?.6:-.55);g.rotation.set(.025,(i-1)*-.3 + Math.sin(t*.3)*.06,(i-1)*-.045);g.scale.setScalar(vertical?.78:.82)})
    if(part===4) {stage.rotation.y=mix(.12,-.1,p);stage.position.z=mix(-.4,.1,p)}
  } else {
    monitor.rotation.set(mix(.12,.02,p),mix(-.4,-.12,p),-.035);monitor.position.set(0,vertical?.25:0,mix(-1,.35,p));monitor.scale.setScalar(vertical?.66:.88)
  }
  if(part!==4)stage.rotation.y=0
  camera.position.z=(vertical?16:12)+Math.sin(t*.32)*.35
  camera.lookAt(0,0,0);renderer.render(scene,camera)
}
await document.fonts.ready
window.__timelines={main:{seek:renderAt}}
window.__threeReady=true
renderAt(0)
