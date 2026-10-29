#!/bin/bash
# usage: src/gen-images.sh [job ...]   (no jobs = all; existing outputs are skipped, delete one to redo it)
# Free Google Flow images (nano2) for the website, all in the Flow project "Website".
# Needs `gflow auth status` signed in (profile brandcanvastc). Runs one job at a time: parallel runs hit the profile lock.
set -u
cd "$(dirname "$0")/.."
export GFLOW_CLI_UPDATE_CHECK=0
PROJECT=$(cat src/flow/PROJECT_ID)
PLATING=../Menu-repo/img/plating
# job|output|aspect|refs (comma separated, may be empty)
JOBS="
wood|assets/plates/hoarding-wood.png|16:9|src/flow/ref-wood.png
paper|assets/plates/poster-paper.png|1:1|
wok|assets/flow/wok-fire.jpg|4:3|$PLATING/cabinfever.jpg
steam|assets/flow/steamer-stack.jpg|3:4|$PLATING/siumai.jpg,$PLATING/crystal.jpg
tap|assets/flow/tap-pour.jpg|3:4|$PLATING/pitcher.jpg
garden|assets/flow/garden-dusk.jpg|16:9|
beach|assets/flow/beach.jpg|4:3|
rail|assets/plates/nav-rail.png|16:9|src/flow/ref-rail.png
calcutta|assets/flow/calcutta-lane.jpg|4:3|
cabin|assets/flow/cabin-booths.jpg|4:3|
cart|assets/flow/noodle-cart.jpg|4:3|
dimsum|assets/flow/dimsum-hands.jpg|3:4|
bao|assets/flow/bao-lift.jpg|4:3|
cocktails|assets/flow/cocktail-bar.jpg|4:3|
beers|assets/flow/beer-trio.jpg|4:3|
x-dimsum|assets/flow/x-dimsum.jpg|3:4|
x-bao|assets/flow/x-bao.jpg|3:4|
x-beer|assets/flow/x-beer.jpg|3:4|
hero-bao|assets/flow/hero-bao.jpg|16:9|
pour-start|assets/flow/pour-start.jpg|9:16|
x-dimsum-whole|assets/flow/x-dimsum-whole.jpg|3:4|
x-bao-whole|assets/flow/x-bao-whole.jpg|3:4|
x-beer-whole|assets/flow/x-beer-whole.jpg|3:4|
"
want=" $* "
echo "$JOBS" | while IFS='|' read -r job out asp refs; do
  [ -z "$job" ] && continue
  [ $# -gt 0 ] && [[ "$want" != *" $job "* ]] && continue
  [ -f "$out" ] && { echo "skip $job ($out exists)"; continue; }
  prompt=$(cat "src/flow/$job.txt")
  REF=(); for r in ${refs//,/ }; do REF+=(--ref "$r"); done
  d=$(mktemp -d); ok=0
  for try in 1 2 3; do
    if [ ${#REF[@]} -gt 0 ]; then gflow image i2i "$prompt" "${REF[@]}" --project "$PROJECT" --model nano2 --aspect "$asp" -n 1 --out "$d" >"$d/log" 2>&1
    else gflow image t2i "$prompt" --project "$PROJECT" --model nano2 --aspect "$asp" -n 1 --out "$d" >"$d/log" 2>&1; fi
    f=$(ls "$d"/*.png "$d"/*.jpg "$d"/*.jpeg "$d"/*.webp 2>/dev/null | head -1); [ -n "$f" ] && { ok=1; break; }
    echo "retry $job ($try)"; sleep 8
  done
  [ $ok = 0 ] && { echo "FAILED $job"; tail -3 "$d/log"; continue; }
  fmt=JPEG; [[ "$out" == *.png ]] && fmt=PNG
  python3 -c "from PIL import Image; Image.open('$f').convert('RGB').save('$out', '$fmt')"
  "$HOME/.claude/skills/impeccable/scripts/impeccable" embed-prompt "$out" --prompt-file "src/flow/$job.txt" >/dev/null 2>&1 || true
  echo "done $job -> $out"
done
