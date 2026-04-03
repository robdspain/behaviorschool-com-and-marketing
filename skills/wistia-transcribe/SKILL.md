---
name: wistia-transcribe
description: >
  Transcribe Wistia-hosted videos to VTT, SRT, or Markdown using Deepgram or
  OpenAI Whisper. Use when given a Wistia video URL, m3u8 stream URL, or video ID
  and asked to generate a transcript, captions, or searchable text from course
  video content.
---

# Wistia Transcribe Skill

Use this skill to transcribe Wistia-hosted video/audio into VTT, SRT, or plain
Markdown. Designed for Behavior School's Authority Accelerator 3.0 course (~80
lessons, ~33 hours total) but works for any Wistia-hosted content.

## Prerequisites

Install these once per machine:

```bash
brew install yt-dlp ffmpeg
```

You also need one of:
- `OPENAI_API_KEY` (for Whisper API) — cheapest at $0.006/min (~$12 for 33 hrs)
- `DEEPGRAM_API_KEY` (for Deepgram Nova-2) — $0.0043/min (~$8.50 for 33 hrs)

> **Cost note (CFO):** For bulk runs (>10 hours), prefer Deepgram Nova-2 — it's
> ~30% cheaper than OpenAI Whisper and returns results in the same request.
> For one-off videos, OpenAI Whisper is fine and already integrated.

---

## Step 1 — Get the video's m3u8 URL

Wistia embeds expose an m3u8 HLS stream. Three ways to obtain it:

### Option A: Direct m3u8 URL already provided
Skip to Step 2.

### Option B: From a Wistia video ID
```bash
# Replace VIDEO_ID with the 10-char Wistia hash (e.g. abc123xyz0)
VIDEO_ID="abc123xyz0"
curl -s "https://fast.wistia.com/embed/medias/${VIDEO_ID}.json" \
  | python3 -c "
import sys, json
data = json.load(sys.stdin)
assets = data['media']['assets']
# Find the mp4 or m3u8 source — prefer mp4 for local whisper
for a in assets:
    if a.get('type') == 'original' or 'mp4' in a.get('url',''):
        print(a['url'])
        break
"
```

### Option C: From a Thinkific/course page URL
1. Open the lesson URL in a browser (or agent-browser)
2. Open DevTools → Network tab → filter by `m3u8`
3. Copy the `.m3u8` URL that appears when the video loads
4. Alternatively: right-click video → Inspect → find `data-wistia-id` attribute

---

## Step 2 — Download audio only

Using yt-dlp (handles HLS streams automatically):

```bash
VIDEO_URL="https://embed-cloudfront.wistia.com/deliveries/HASH.m3u8"
OUTPUT_FILE="lesson_01.mp3"

yt-dlp \
  --extract-audio \
  --audio-format mp3 \
  --audio-quality 0 \
  --output "${OUTPUT_FILE%.mp3}.%(ext)s" \
  "$VIDEO_URL"
```

If yt-dlp can't resolve the stream directly, use ffmpeg:

```bash
ffmpeg -i "$VIDEO_URL" -vn -acodec mp3 -q:a 2 "$OUTPUT_FILE" -y
```

> **Tip:** For bulk batch runs, write a loop over a list of URLs. Store all audio
> files to a temp folder before transcribing — don't transcribe inline or you'll
> hit API rate limits.

---

## Step 3 — Transcribe

### Option A: OpenAI Whisper API (simple, $0.006/min)

```bash
AUDIO_FILE="lesson_01.mp3"
OUTPUT_FORMAT="vtt"   # or: srt | text | json | verbose_json

curl -s https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "file=@${AUDIO_FILE}" \
  -F "model=whisper-1" \
  -F "response_format=${OUTPUT_FORMAT}" \
  -F "language=en" \
  > "lesson_01.${OUTPUT_FORMAT}"
```

> **File size limit:** Whisper API rejects files >25 MB. Split long audio first:
> ```bash
> ffmpeg -i lesson_01.mp3 -f segment -segment_time 1200 -c copy segment_%03d.mp3
> # Then transcribe each segment and concatenate results
> ```

### Option B: Deepgram Nova-2 (cheapest bulk option, $0.0043/min)

```bash
AUDIO_FILE="lesson_01.mp3"

curl -s -X POST "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&paragraphs=true&utterances=true&language=en" \
  -H "Authorization: Token $DEEPGRAM_API_KEY" \
  -H "Content-Type: audio/mpeg" \
  --data-binary @"$AUDIO_FILE" \
  | python3 -c "
import sys, json
data = json.load(sys.stdin)
words = data['results']['channels'][0]['alternatives'][0].get('words', [])
transcript = data['results']['channels'][0]['alternatives'][0]['transcript']
print(transcript)
" > "lesson_01.txt"
```

For VTT output from Deepgram, request `?format=vtt` or convert from `utterances`:

```python
# convert_to_vtt.py
import sys, json

data = json.load(sys.stdin)
utterances = data['results']['utterances']

print('WEBVTT\n')
for u in utterances:
    start = u['start']
    end = u['end']
    text = u['transcript']
    def fmt(t):
        h, r = divmod(t, 3600)
        m, s = divmod(r, 60)
        ms = int((s % 1) * 1000)
        return f"{int(h):02d}:{int(m):02d}:{int(s):02d}.{ms:03d}"
    print(f"{fmt(start)} --> {fmt(end)}")
    print(text)
    print()
```

### Option C: Local Whisper (free, slower, requires GPU or patience)

```bash
pip install openai-whisper
whisper lesson_01.mp3 --model medium --output_format vtt --language en
```

---

## Step 4 — Save output

Save transcripts to `docs/transcripts/` in the project, or upload to R2:

```bash
# Local save
mkdir -p docs/transcripts
cp lesson_01.vtt docs/transcripts/

# R2 upload (if wrangler configured)
wrangler r2 object put research-corpus/transcripts/lesson_01.vtt \
  --file lesson_01.vtt \
  --content-type text/vtt
```

Name files consistently: `lesson_{NN}_{slug}.vtt` (e.g. `lesson_03_abc-basics.vtt`).

---

## Bulk Batch Script

For all 80 lessons, pass a TSV file `lessons.tsv` with columns: `number`, `slug`, `wistia_url`:

```bash
#!/usr/bin/env bash
# transcribe_all.sh — bulk Wistia → Whisper → VTT
set -euo pipefail

INPUT_FILE="${1:-lessons.tsv}"
OUT_DIR="docs/transcripts"
mkdir -p "$OUT_DIR" /tmp/audio

while IFS=$'\t' read -r num slug url; do
  AUDIO="/tmp/audio/lesson_${num}.mp3"
  VTT="${OUT_DIR}/lesson_${num}_${slug}.vtt"

  [[ -f "$VTT" ]] && { echo "skip $num (exists)"; continue; }

  echo "downloading $num ($slug)..."
  yt-dlp --extract-audio --audio-format mp3 --audio-quality 0 \
    -o "${AUDIO%.mp3}.%(ext)s" "$url"

  echo "transcribing $num..."
  curl -s https://api.openai.com/v1/audio/transcriptions \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F "file=@${AUDIO}" \
    -F "model=whisper-1" \
    -F "response_format=vtt" \
    -F "language=en" > "$VTT"

  echo "done: $VTT"
  sleep 1   # gentle rate-limit buffer
done < "$INPUT_FILE"

echo "all done."
```

Run it: `bash transcribe_all.sh lessons.tsv`

---

## Output Formats

| Format | Best for |
|--------|----------|
| `vtt` | Browser captions, Thinkific upload |
| `srt` | Video editing software |
| `text` | Content indexing / RAG ingestion |
| `json` | Word-level timestamps for search |

For the content pipeline / RAG ingestion, save both `.vtt` (for captions) and
`.txt` (for search indexing).

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| yt-dlp 403 on HLS stream | Try `--add-headers "Referer: https://fast.wistia.net"` |
| Whisper API 413 (file too large) | Split with ffmpeg at 20-min segments |
| Whisper returns garbled text | Audio quality issue — use `--audio-quality 0` in yt-dlp |
| Deepgram returns empty transcript | Check Content-Type header matches actual file format |
| m3u8 URL not found | Use agent-browser to inspect the lesson page network tab |
