"""Original flat illustrations and marks for the newer showcase businesses. Run: python3 scripts/gen-scenes.py"""
import math,os
OUT="public/showcase/scenes";MK="public/showcase/marks"
W,H=1440,960
def svg(body,defs=""):return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img">{"<defs>"+defs+"</defs>" if defs else ""}{body}</svg>'
def lg(i,a,b,x2=0,y2=1):return f'<linearGradient id="{i}" x1="0" y1="0" x2="{x2}" y2="{y2}"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient>'
def wave(y,amp,per,col,ph=0):
    pts=[f"{x},{y+amp*math.sin((x/per)*2*math.pi+ph):.1f}" for x in range(0,W+20,20)]
    return f'<polygon points="0,{H} '+" ".join(pts)+f' {W},{H}" fill="{col}"/>'
S={}
# 1 street food truck at dusk
b=f'<rect width="{W}" height="{H}" fill="url(#g)"/><circle cx="1130" cy="230" r="120" fill="#ffd9a0" opacity=".9"/>'
b+=f'<rect y="700" width="{W}" height="260" fill="#2a1a33"/>'
b+=''.join(f'<circle cx="{120+i*105}" cy="{210+30*math.sin(i*.9)}" r="9" fill="#ffe08a"/>' for i in range(13))
b+='<path d="M60 190 Q700 330 1380 190" stroke="#3b2342" stroke-width="3" fill="none"/>'
b+='<rect x="250" y="400" width="880" height="330" rx="34" fill="#1fa39a"/><rect x="250" y="620" width="880" height="110" rx="0" fill="#168a82"/>'
b+='<rect x="330" y="470" width="470" height="150" rx="12" fill="#2a1a33"/>'
b+=''.join(f'<rect x="{300+i*80}" y="395" width="40" height="80" fill="{"#ff5a5f" if i%2==0 else "#fff3dc"}"/>' for i in range(8))
b+='<path d="M280 475 h560 l-30 40 h-500z" fill="#ff5a5f"/>'
b+='<rect x="860" y="470" width="190" height="150" rx="14" fill="#fff3dc"/><rect x="880" y="490" width="150" height="110" rx="8" fill="#2a1a33"/>'
for cx in (400,520,640,760):b+=f'<circle cx="{cx}" cy="560" r="28" fill="#ffb84d"/>'
b+='<circle cx="400" cy="760" r="58" fill="#14101a"/><circle cx="400" cy="760" r="26" fill="#9a8fa5"/><circle cx="980" cy="760" r="58" fill="#14101a"/><circle cx="980" cy="760" r="26" fill="#9a8fa5"/>'
S["taco"]=svg(b,lg("g","#4b2a6e","#ff8a4c"))
# 2 dog groomer
b=f'<rect width="{W}" height="{H}" fill="#dff3ea"/><circle cx="1180" cy="200" r="260" fill="#c4e8d8"/><circle cx="200" cy="780" r="320" fill="#cdeee0"/>'
b+='<rect x="330" y="520" width="780" height="300" rx="150" fill="#ffffff"/><rect x="330" y="520" width="780" height="80" rx="40" fill="#e9f7f1"/>'
b+='<ellipse cx="720" cy="470" rx="190" ry="130" fill="#c98c52"/><circle cx="800" cy="330" r="105" fill="#d9a066"/><ellipse cx="700" cy="300" rx="42" ry="95" fill="#8b5a2b" transform="rotate(-18 700 300)"/><ellipse cx="900" cy="300" rx="42" ry="95" fill="#8b5a2b" transform="rotate(18 900 300)"/>'
b+='<circle cx="768" cy="320" r="11" fill="#2a1d14"/><circle cx="836" cy="320" r="11" fill="#2a1d14"/><ellipse cx="802" cy="365" rx="26" ry="18" fill="#2a1d14"/>'
b+=''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff" stroke="#bfe6d6" stroke-width="3"/>' for x,y,r in [(500,420,40),(560,350,26),(980,430,46),(930,360,22),(430,330,18),(1040,320,30),(640,250,20)])
b+='<rect x="1120" y="640" width="140" height="180" rx="14" fill="#ff9a8b"/><rect x="1120" y="690" width="140" height="22" fill="#ffd2c9"/><rect x="170" y="700" width="120" height="120" rx="60" fill="#8fd6c0"/>'
S["groom"]=svg(b)
# 3 surf
b=f'<rect width="{W}" height="{H}" fill="url(#g)"/><circle cx="1010" cy="330" r="150" fill="#fff1c4"/>'
b+=wave(560,26,420,"#8fd3e8",0)+wave(640,34,520,"#38a9c9",1.4)+wave(740,40,620,"#1d7fa6",2.6)+wave(840,30,480,"#0f5f86",4)
b+='<g transform="rotate(-24 560 380)"><rect x="380" y="270" width="360" height="104" rx="52" fill="#ff6b4a"/><rect x="380" y="316" width="360" height="12" fill="#fff3d6"/></g>'
b+='<path d="M180 160 q35-40 70 0 q35-40 70 0" stroke="#fff" stroke-width="6" fill="none"/><path d="M1180 120 q25-30 50 0 q25-30 50 0" stroke="#fff" stroke-width="5" fill="none"/>'
S["surf"]=svg(b,lg("g","#ffd29d","#ff8f70"))
# 4 bookshop
b=f'<rect width="{W}" height="{H}" fill="#3b2a20"/>'
cols=["#c0392b","#e8b84b","#2f5d62","#e9dcc3","#6b4a8c","#d97a3a","#274c77","#8aa86b","#b25b6e"]
import random;random.seed(5)
for r in range(4):
    y=120+r*210;b+=f'<rect x="0" y="{y+160}" width="{W}" height="26" fill="#6a4630"/>'
    x=40
    while x<W-60:
        w=random.randint(34,70);h=random.randint(110,158);b+=f'<rect x="{x}" y="{y+160-h}" width="{w}" height="{h}" rx="4" fill="{random.choice(cols)}"/><rect x="{x+6}" y="{y+160-h+18}" width="{w-12}" height="6" fill="#ffffff55"/>';x+=w+random.randint(2,8)
b+='<circle cx="720" cy="480" r="300" fill="#ffd27a" opacity=".13"/><circle cx="720" cy="480" r="170" fill="#ffd27a" opacity=".16"/><rect x="560" y="400" width="320" height="200" rx="10" fill="#f4e8cf"/><rect x="580" y="420" width="130" height="160" fill="#c0392b"/><rect x="730" y="420" width="130" height="160" fill="#2f5d62"/>'
S["books"]=svg(b)
# 5 tattoo flash sheet
b=f'<rect width="{W}" height="{H}" fill="#f1e6d0"/>'
b+=''.join(f'<rect x="{x}" y="{y}" width="340" height="340" rx="10" fill="none" stroke="#1a1a1a" stroke-width="4"/>' for x in (130,550,970) for y in (120,520))
def heart(cx,cy,s,f):return f'<path d="M{cx} {cy+s*.9} C{cx-s*1.5} {cy-s*.2} {cx-s*.6} {cy-s*1.1} {cx} {cy-s*.3} C{cx+s*.6} {cy-s*1.1} {cx+s*1.5} {cy-s*.2} {cx} {cy+s*.9}Z" fill="{f}" stroke="#1a1a1a" stroke-width="5"/>'
b+=heart(300,290,100,"#d6372b")+'<path d="M255 190 l45-60 l45 60" stroke="#1a1a1a" stroke-width="5" fill="none"/>'
b+='<path d="M720 160 v230 M690 200 h60 M720 390 l-26 40 h52z" stroke="#1a1a1a" stroke-width="9" fill="#e8b84b"/>'
b+='<path d="M720 160 l20 14 -20 12 -20-12z" fill="#1a1a1a"/>'
b+='<circle cx="1140" cy="290" r="95" fill="#1a1a1a"/><circle cx="1180" cy="270" r="84" fill="#f1e6d0"/>'+''.join(f'<path d="M{1060+i*30} {170+(i%2)*20} l6 14 l14 3 l-10 10 l3 14 l-13-7 l-13 7 l3-14 l-10-10 l14-3z" fill="#d6372b"/>' for i in range(3))
b+='<circle cx="300" cy="690" r="95" fill="#2f6f6a" stroke="#1a1a1a" stroke-width="5"/><circle cx="300" cy="690" r="55" fill="#e8b84b" stroke="#1a1a1a" stroke-width="5"/><circle cx="300" cy="690" r="20" fill="#d6372b"/>'
b+='<path d="M630 620 q90-120 180 0 q-90 80-180 0z" fill="#d6372b" stroke="#1a1a1a" stroke-width="5"/><path d="M630 700 l180 0" stroke="#1a1a1a" stroke-width="5"/><path d="M660 740 q60 40 120 0" stroke="#1a1a1a" stroke-width="5" fill="none"/>'
b+='<path d="M1060 740 l80-190 l80 190z" fill="#e8b84b" stroke="#1a1a1a" stroke-width="5"/><circle cx="1140" cy="680" r="26" fill="#1a1a1a"/>'
S["tattoo"]=svg(b)
# 6 driving
b=f'<rect width="{W}" height="{H}" fill="url(#g)"/><polygon points="0,560 {W},560 {W},{H} 0,{H}" fill="#55a35d"/><polygon points="560,560 880,560 1240,{H} 200,{H}" fill="#3a3f4a"/>'
b+=''.join(f'<polygon points="{715-i*3},{580+i*70} {725+i*3},{580+i*70} {730+i*5},{620+i*70} {710-i*5},{620+i*70}" fill="#f4f1e6"/>' for i in range(5))
b+='<rect x="250" y="130" width="130" height="130" rx="10" fill="#fff"/><rect x="280" y="160" width="14" height="70" fill="#d6372b"/><rect x="280" y="216" width="56" height="14" fill="#d6372b"/>'
b+='<rect x="590" y="690" width="260" height="110" rx="26" fill="#ff7a2f"/><rect x="630" y="650" width="180" height="70" rx="22" fill="#ffa15e"/><rect x="650" y="662" width="140" height="44" rx="12" fill="#2b3340"/><circle cx="632" cy="805" r="26" fill="#14161a"/><circle cx="808" cy="805" r="26" fill="#14161a"/>'
b+='<circle cx="1160" cy="190" r="95" fill="#ffe6a8"/>'
S["driving"]=svg(b,lg("g","#7ec8f0","#d7efff"))
# 7 guest house
b=f'<rect width="{W}" height="{H}" fill="url(#g)"/><rect y="760" width="{W}" height="200" fill="#2f7da1"/>'+wave(800,10,300,"#3c92b8",0)
cl=["#f6c85f","#e76f51","#6bb5a6","#f4a6a6","#8fa3d6"]
for i in range(5):
    x=60+i*270;h=380+(i%2)*60;b+=f'<rect x="{x}" y="{760-h}" width="250" height="{h}" fill="{cl[i]}"/><polygon points="{x-10},{760-h} {x+125},{760-h-90} {x+260},{760-h}" fill="#3a3340"/>'
    for r in range(2):
        for c in range(2):b+=f'<rect x="{x+38+c*98}" y="{760-h+50+r*130}" width="68" height="90" rx="6" fill="#fff6e0"/><rect x="{x+38+c*98}" y="{760-h+50+r*130+44}" width="68" height="4" fill="#3a3340"/>'
    b+=f'<rect x="{x+90}" y="{760-120}" width="70" height="120" rx="8" fill="#3a3340"/>'
b+='<circle cx="1230" cy="150" r="80" fill="#fff3c4"/>'
S["bnb"]=svg(b,lg("g","#9ed8f2","#fdeccd"))
# 8 DJ
b=f'<rect width="{W}" height="{H}" fill="#0e0a1a"/>'
for x,c in [(260,"#ff3ea5"),(560,"#4ad7ff"),(880,"#a66bff"),(1180,"#ffd23e")]:b+=f'<polygon points="{x},0 {x-170},760 {x+170},760" fill="{c}" opacity=".18"/>'
b+='<circle cx="720" cy="170" r="84" fill="#cdd3ff"/>'+''.join(f'<path d="M{720-84} {170+i*24-72} h168" stroke="#7d86d6" stroke-width="3"/>' for i in range(7))+'<path d="M720 86 v168" stroke="#7d86d6" stroke-width="3"/><rect x="714" y="0" width="12" height="86" fill="#7d86d6"/>'
b+='<rect x="190" y="620" width="1060" height="190" rx="22" fill="#1d1730"/>'
for cx,c in [(430,"#ff3ea5"),(1010,"#4ad7ff")]:b+=f'<circle cx="{cx}" cy="560" r="150" fill="#13101f" stroke="{c}" stroke-width="6"/><circle cx="{cx}" cy="560" r="120" fill="none" stroke="#2a2342" stroke-width="3"/><circle cx="{cx}" cy="560" r="44" fill="{c}"/><circle cx="{cx}" cy="560" r="8" fill="#0e0a1a"/>'
b+='<rect x="660" y="640" width="120" height="70" rx="10" fill="#2a2342"/><rect x="680" y="660" width="80" height="8" fill="#ffd23e"/>'
S["dj"]=svg(b)
# 9 cakes
b=f'<rect width="{W}" height="{H}" fill="#ffe3ea"/><circle cx="220" cy="200" r="190" fill="#ffd0dc"/><circle cx="1250" cy="760" r="260" fill="#ffd0dc"/>'
b+='<ellipse cx="720" cy="810" rx="400" ry="38" fill="#e9b8c6"/>'
for i,(w,y,c) in enumerate([(520,620,"#fff5e8"),(400,470,"#ffc2d1"),(280,340,"#fff5e8")]):
    ic="#ff8fab" if c=="#fff5e8" else "#fff5e8"
    b+=f'<rect x="{720-w/2}" y="{y}" width="{w}" height="160" rx="22" fill="{c}"/><rect x="{720-w/2}" y="{y}" width="{w}" height="40" rx="20" fill="{ic}"/>'+''.join(f'<circle cx="{720-w/2+(k+.5)*w/8}" cy="{y+38}" r="{w/16}" fill="{ic}"/>' for k in range(8))
b+=''.join(f'<circle cx="{720-110+i*110}" cy="{325}" r="18" fill="#d6284f"/>' for i in range(3))+''.join(f'<rect x="{708+i*0}" y="250" width="0" height="0"/>' for i in range(1))
b+='<rect x="712" y="240" width="16" height="70" rx="8" fill="#6ec1d6"/><path d="M720 200 q-18 24 0 36 q18-12 0-36z" fill="#ffb347"/>'
b+=''.join(f'<circle cx="{x}" cy="{y}" r="9" fill="{c}"/>' for x,y,c in [(380,420,"#6ec1d6"),(1040,520,"#ffb347"),(450,640,"#ff8fab"),(1000,330,"#6ec1d6"),(300,560,"#ffb347"),(1120,640,"#6ec1d6")])
S["cakes"]=svg(b)
# 10 bike
b=f'<rect width="{W}" height="{H}" fill="#2c3a44"/>'+''.join(f'<circle cx="{40+x*60}" cy="{50+y*60}" r="5" fill="#3d4e5a"/>' for x in range(24) for y in range(10))
b+='<rect y="720" width="1440" height="240" fill="#1b252c"/>'
for cx in (420,1010):b+=f'<circle cx="{cx}" cy="600" r="190" fill="none" stroke="#f2f2f0" stroke-width="16"/><circle cx="{cx}" cy="600" r="190" fill="none" stroke="#e9503f" stroke-width="3" stroke-dasharray="6 14"/><circle cx="{cx}" cy="600" r="16" fill="#e9503f"/>'+''.join(f'<path d="M{cx} 600 L{cx+170*math.cos(a*math.pi/9):.0f} {600+170*math.sin(a*math.pi/9):.0f}" stroke="#aeb8bd" stroke-width="2"/>' for a in range(18))
b+='<path d="M420 600 L640 360 L880 360 L1010 600 M640 360 L760 600 L420 600 M760 600 L880 360" stroke="#e9503f" stroke-width="18" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M600 340 h110 M850 330 l-24 30 M860 330 h80" stroke="#f2f2f0" stroke-width="14" stroke-linecap="round"/>'
b+='<rect x="80" y="110" width="220" height="12" fill="#8a9aa3"/><path d="M110 122 v60 M170 122 l20 70 M230 122 v60" stroke="#e8b84b" stroke-width="10" stroke-linecap="round"/><circle cx="1230" cy="200" r="90" fill="none" stroke="#e8b84b" stroke-width="12"/><path d="M1230 110 v180 M1140 200 h180" stroke="#e8b84b" stroke-width="6"/>'
S["bike"]=svg(b)
# 11 counselling
b=f'<rect width="{W}" height="{H}" fill="#eef0ea"/>'
b+='<path d="M200 760 V360 a160 160 0 0 1 320 0 V760z" fill="#cfe0d6"/><path d="M560 760 V300 a200 200 0 0 1 400 0 V760z" fill="#bcd3c7"/><path d="M1000 760 V400 a140 140 0 0 1 280 0 V760z" fill="#d9e6dd"/>'
b+='<circle cx="360" cy="420" r="70" fill="#f7dfb8"/><circle cx="760" cy="360" r="90" fill="#f7dfb8"/>'
b+='<rect y="760" width="1440" height="200" fill="#d5c6b0"/>'
b+='<path d="M1120 760 q-80-190 20-320 q60 130-20 320z" fill="#5f8a6b"/><path d="M1120 760 q70-170 150-250 q-10 150-150 250z" fill="#79a384"/><path d="M1120 760 q-150-80-190-190 q130 20 190 190z" fill="#4f7b5c"/><rect x="1088" y="740" width="64" height="70" rx="10" fill="#c97b57"/>'
b+='<rect x="300" y="610" width="230" height="150" rx="30" fill="#8aa6c7"/><rect x="620" y="610" width="230" height="150" rx="30" fill="#e7b9a6"/><rect x="340" y="560" width="150" height="80" rx="24" fill="#a8bfdc"/><rect x="660" y="560" width="150" height="80" rx="24" fill="#f0cdbf"/>'
S["calm"]=svg(b)
# 12 garden
b=f'<rect width="{W}" height="{H}" fill="url(#g)"/><circle cx="1130" cy="190" r="100" fill="#fff7c9"/>'
b+='<path d="M0 520 q360-160 720-40 t720 -40 v520 h-1440z" fill="#9ccf82"/><path d="M0 640 q420-140 820-20 t620-40 v380 h-1440z" fill="#6bb36a"/><path d="M0 780 q500-100 900 0 t540-30 v210 h-1440z" fill="#3f9457"/>'
for x,y,r in [(240,520,95),(430,560,70),(1120,500,110),(1290,560,80),(860,520,60)]:b+=f'<rect x="{x-8}" y="{y}" width="16" height="{120}" fill="#6a4a32"/><circle cx="{x}" cy="{y}" r="{r}" fill="#2f8a4f"/><circle cx="{x-r*.3}" cy="{y-r*.3}" r="{r*.55}" fill="#4aa664"/>'
b+='<path d="M560 960 q60-200 150-260 q60-40 130-30" stroke="#e8d9b5" stroke-width="60" fill="none" stroke-linecap="round"/>'
b+=''.join(f'<circle cx="{x}" cy="{y}" r="11" fill="{c}"/>' for x,y,c in [(120,860,"#ff6b8b"),(180,900,"#ffd24d"),(1180,860,"#ff6b8b"),(1260,900,"#fff"),(1330,850,"#ffd24d"),(980,900,"#ff8a4c"),(300,820,"#fff")])
S["garden"]=svg(b,lg("g","#bfe8ff","#f1fbe8"))
os.makedirs(OUT,exist_ok=True)
for k,v in S.items():open(f"{OUT}/{k}.svg","w").write(v)
# marks
def mark(id,icon,name,sub,col,font="Georgia,serif"):
    name=name.replace('&','&amp;');sub=sub.replace('&','&amp;')
    n=len(name.replace('&amp;','&'))
    tl=min(212,round(n*19.5))
    s=f'<svg xmlns="http://www.w3.org/2000/svg" width="360" height="128" viewBox="0 0 360 128" fill="{col}" color="{col}" role="img" aria-label="{name} original mark"><g transform="translate(8 4)">{icon}</g><text x="138" y="70" font-family="{font}" font-size="34" font-weight="700" letter-spacing="-1" textLength="{tl}" lengthAdjust="spacingAndGlyphs">{name}</text><text x="139" y="96" font-family="Arial,sans-serif" font-size="11" letter-spacing="2" textLength="{min(212,round(len(sub)*8.2))}" lengthAdjust="spacing">{sub}</text></svg>'
    open(f"{MK}/{id}.svg","w").write(s)
ic=lambda p,fill="none":f'<path d="{p}" fill="{fill}" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>'
mark("taco",ic("M24 78 a40 40 0 0 1 80 0z","currentColor"),"Taco Lorry","STREET FOOD · HACKNEY WICK","#d94f2b","Arial Black,Arial,sans-serif")
mark("groom",ic("M64 94c-26-14-34-40-14-52 12-6 20 4 14 12 6-8 18-18 28-10 14 12 6 40-28 50z"),"Pawfect Wash","MOBILE DOG GROOMING","#2b8f78","Trebuchet MS,Arial,sans-serif")
mark("surf",ic("M18 76 q23-30 46 0 t46 0 M18 94 q23-30 46 0 t46 0"),"Driftwood","SURF SCHOOL · NEWQUAY","#0f6e94","Arial,sans-serif")
mark("books",ic("M30 90 V40 h30 v50z M62 90 V30 h28 v60z M92 90 V46 h20 v44z"),"Wren & Quill","BOOKSELLERS · HAY-ON-WYE","#7a3b24")
mark("tattoo",ic("M64 92 L30 52 a20 20 0 0 1 34-14 a20 20 0 0 1 34 14z","currentColor"),"Saint Ink","TATTOO · LEEDS","#1a1a1a","Impact,Arial Black,sans-serif")
mark("driving",ic("M24 52 h80 v40 h-80z M34 52 l10-16 h40 l10 16"),"Greenway","DRIVING SCHOOL · READING","#1f7a4a","Arial,sans-serif")
mark("bnb",ic("M22 92 V56 L64 28 L106 56 V92z M54 92 V70 h20 v22"),"Hollybank","GUEST HOUSE · WHITBY","#2a5d7a")
mark("dj",ic("M64 94 a30 30 0 1 0 0-60 a30 30 0 0 0 0 60z M64 34 v60 M34 64 h60"),"Velvet Hour","WEDDINGS & EVENTS · GLASGOW","#a23fd1","Arial Black,Arial,sans-serif")
mark("cakes",ic("M36 90 h56 v-26 h-56z M44 64 v-22 h40 v22"),"Tiny Crumb","CAKES · CARDIFF","#c2335e","Trebuchet MS,Arial,sans-serif")
mark("bike",ic("M30 92a22 22 0 1 0 0.1 0z M96 92a22 22 0 1 0 0.1 0z M30 92 L56 48 H84 L96 92 M56 48 L68 92"),"Rook & Raven","BIKE WORKS · EDINBURGH","#e9503f","Arial Black,Arial,sans-serif")
mark("calm",ic("M30 92 V56 a34 34 0 0 1 68 0 V92z"),"Amara Lewis","COUNSELLING · MANCHESTER","#4d7a64")
mark("garden",ic("M64 94 V54 M64 70 q-28 0-34-26 q28 0 34 26 M64 62 q28 0 34-26 q-28 0-34 26"),"Fernhill","GARDENS · SURREY","#2f7a46")
print("ok",len(S))
