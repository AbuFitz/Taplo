import sys
from PIL import Image
L=sys.argv[1].split(","); out=sys.argv[2]
ims=[Image.open(f'/tmp/claude-0/lay-{l}.png') for l in L]
s=Image.new('RGB',(len(ims)*396,700),'#888')
for i,im in enumerate(ims): s.paste(im,(i*396,0))
s.save(out)
