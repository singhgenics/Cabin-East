# usage: python3 src/explode/key.py  -> assets/flow/x-*.png (keyed RGBA) and prints row bands
import numpy as np, sys
from PIL import Image
for n in ['dimsum','bao','beer']:
    a = np.asarray(Image.open(f'assets/flow/x-{n}.jpg').convert('RGB')).astype(float)
    r,g,b = a[...,0],a[...,1],a[...,2]
    dom = g - np.maximum(r,b)            # how green a pixel is beyond red/blue
    alpha = np.clip(1 - (dom - 25)/60, 0, 1)   # fully green -> 0, normal food -> 1
    alpha[dom < 25] = 1
    # despill: pull green down to the max of red/blue where partially keyed
    g2 = np.where(dom > 0, np.maximum(r,b) + np.minimum(dom,0), g)
    spill = np.clip(dom, 0, None)*0.85
    g2 = g - spill
    out = np.dstack([r,g2,b,alpha*255]).clip(0,255).astype('uint8')
    Image.fromarray(out,'RGBA').save(f'assets/flow/x-{n}.png')
    rows = (alpha > .5).sum(1) > 3
    bands=[];s=None
    for y,v in enumerate(rows):
        if v and s is None: s=y
        if not v and s is not None:
            if y-s>6: bands.append((s,y))
            s=None
    if s is not None: bands.append((s,len(rows)))
    print(n,bands)
