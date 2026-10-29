# Cut the Flow exploded-view pictures (flat green background) into transparent layers.
# usage: python3 src/explode/slice.py   -> assets/explode/<name>-<i>.webp + src/explode/<name>.json
import json, numpy as np, os
from PIL import Image, ImageFilter
os.makedirs('assets/explode', exist_ok=True)
for n in ['dimsum', 'bao', 'beer']:
    im = Image.open(f'assets/flow/x-{n}.jpg').convert('RGB')
    a = np.asarray(im).astype(float); H, W = a.shape[:2]
    corner = np.concatenate([a[:40, :40].reshape(-1, 3), a[:40, -40:].reshape(-1, 3), a[-40:, :40].reshape(-1, 3), a[-40:, -40:].reshape(-1, 3)])
    bg = np.median(corner, 0)
    dist = np.sqrt(((a - bg) ** 2).sum(2))
    alpha = np.clip((dist - 40) / 45, 0, 1)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    if n == 'beer':   # the empty top of the glass shows pale green through it: key it out (rows of the glass only, hops stay)
        dom = g - np.maximum(r, b); rr = np.zeros_like(alpha, bool); rr[int(H * .40):int(H * .69)] = True
        alpha = np.where(rr & (dom > 10), alpha * np.clip(1 - (dom - 10) / 14, 0, 1), alpha)
    A = Image.fromarray((alpha * 255).astype('uint8'))
    core = np.asarray(A.filter(ImageFilter.MinFilter(3))).astype(float) / 255      # pull the edge in 1px
    band = (np.asarray(A.filter(ImageFilter.MinFilter(9))) < 250) & (alpha > 0)    # a few px around every edge
    g2 = np.where(band, np.minimum(g, np.maximum(r, b)), g)                        # despill only near edges
    alpha = np.minimum(alpha, core)
    rgba = np.dstack([r, g2, b, alpha * 255]).clip(0, 255).astype('uint8')
    rows = (alpha > .5).sum(1) > 3
    bands, s = [], None
    for y, v in enumerate(rows):
        if v and s is None: s = y
        if not v and s is not None:
            if y - s > 12: bands.append((s, y))
            s = None
    if s is not None: bands.append((s, H))
    assert len(bands) == 5, (n, bands)
    layers = []
    for i, (t, bt) in enumerate(bands):
        t, bt = max(0, t - 4), min(H, bt + 4)
        sub = rgba[t:bt]; cols = np.where((sub[..., 3] > 10).sum(0) > 0)[0]
        x0, x1 = max(0, cols[0] - 2), min(W, cols[-1] + 3)
        Image.fromarray(sub[:, x0:x1]).save(f'assets/explode/{n}-{i}.webp', quality=88, method=6)
        layers.append(dict(x=x0 / W, y=t / H, w=(x1 - x0) / W, h=(bt - t) / H))
    ovs = [0.085] * 4
    if n == 'beer': ovs[0] = -0.03          # the tap stays above the foam, as if pouring
    tot = sum(l['h'] for l in layers) - sum(ovs)
    cen = (layers[0]['y'] + layers[-1]['y'] + layers[-1]['h']) / 2
    y = cen - tot / 2
    for l in layers:
        l['dy'] = y - l['y']; y += l['h'] - (ovs.pop(0) if ovs else 0)
    json.dump(dict(ratio=W / H, layers=layers), open(f'src/explode/{n}.json', 'w'))
    print(n, [(round(l['y'], 2), round(l['h'], 2), round(l['dy'], 2)) for l in layers])
