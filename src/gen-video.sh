#!/bin/bash
# usage: src/gen-video.sh [job ...]  Flow image-to-video (Veo Lite, ~10 credits a clip), sequential, in the Flow project "Website".
# Raw clips land in /tmp/vids/<job>.mp4; encode with ffmpeg afterwards (see README). If Flow finishes but the CLI misses the
# download link, the clip is recovered with `gflow data download` (free).
set -u
cd "$(dirname "$0")/.."
export GFLOW_CLI_UPDATE_CHECK=0
PROJECT=$(cat src/flow/PROJECT_ID); mkdir -p /tmp/vids
# job|start frame|aspect
JOBS="
pour|assets/flow/pour-start.jpg|9:16
dimsum|assets/flow/dimsum-hands.jpg|9:16
bao|assets/flow/bao-lift.jpg|16:9
beers|assets/flow/beer-trio.jpg|16:9
garden|assets/flow/garden-dusk.jpg|16:9
cart|assets/flow/noodle-cart.jpg|16:9
herobao|assets/flow/hero-bao.jpg|16:9
pourwide|assets/flow/pour-wide.jpg|16:9
gardendecor|assets/flow/garden-decor.jpg|16:9
"
want=" $* "
echo "$JOBS" | while IFS='|' read -r job frame asp; do
  [ -z "$job" ] && continue
  [ $# -gt 0 ] && [[ "$want" != *" $job "* ]] && continue
  [ -f "/tmp/vids/$job.mp4" ] && { echo "skip $job"; continue; }
  prompt=$(cat "src/flow/v-$job.txt"); d=$(mktemp -d)
  gflow video i2v --initial-frame "$frame" "$prompt" --aspect "$asp" --model veo-lite --count 1 --project "$PROJECT" --out-dir "$d" --json >"$d/log" 2>&1
  f=$(ls "$d"/*.mp4 2>/dev/null | head -1)
  if [ -z "$f" ]; then
    id=$(grep -v '^{"event"' <(gflow data list videos 2>/dev/null) | PFX="${prompt:0:40}" python3 -c "
import sys,json,os
for l in sys.stdin:
    try: r=json.loads(l)
    except Exception: continue
    if r.get('prompt','').startswith(os.environ['PFX']) and not r.get('local_path'): print(r['media_id']); break")
    [ -n "$id" ] && gflow data download "$id" --out "$d" >/dev/null 2>&1; f=$(ls "$d"/*.mp4 2>/dev/null | head -1)
  fi
  if [ -n "$f" ]; then cp "$f" "/tmp/vids/$job.mp4"; echo "done $job"; else echo "FAILED $job"; tail -c 300 "$d/log"; fi
done
