import sys,glob,os
from PIL import Image
pattern=sys.argv[1]; out=sys.argv[2]; cols=int(sys.argv[3]) if len(sys.argv)>3 else 4
fs=sorted(glob.glob(pattern))
ims=[Image.open(f) for f in fs]
w=int(os.environ.get("W","300")); ims=[im.resize((w,int(im.height*w/im.width))) for im in ims]
h=max(im.height for im in ims)
rows=(len(ims)+cols-1)//cols
sheet=Image.new('RGB',(cols*(w+6),rows*(h+6)),'#888')
for i,im in enumerate(ims): sheet.paste(im,((i%cols)*(w+6),(i//cols)*(h+6)))
sheet.save(out); print([os.path.basename(f) for f in fs])
