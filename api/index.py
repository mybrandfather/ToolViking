import re
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    CouldNotRetrieveTranscript,
    NoTranscriptFound,
    RequestBlocked,
    TranscriptsDisabled,
    VideoUnavailable,
)

app = FastAPI(title="ToolViking Transcript API", docs_url=None, redoc_url=None)

VIDEO_ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")
AUTO_LANGS = {"", "auto", "any"}


def extract_video_id(value: str) -> Optional[str]:
    value = (value or "").strip()
    if VIDEO_ID_RE.fullmatch(value):
        return value

    patterns = (
        r"(?:youtube\.com/watch\?(?:[^#\s]*&)?v=)([A-Za-z0-9_-]{11})",
        r"(?:youtu\.be/)([A-Za-z0-9_-]{11})",
        r"(?:youtube\.com/(?:shorts|embed|live)/)([A-Za-z0-9_-]{11})",
    )
    for pattern in patterns:
        match = re.search(pattern, value, re.IGNORECASE)
        if match:
            return match.group(1)
    return None


def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def choose_transcript(transcript_list, requested_language: str):
    transcripts = list(transcript_list)
    if not transcripts:
        raise NoTranscriptFound("No transcript tracks are available.")

    if requested_language in AUTO_LANGS:
        manual = [item for item in transcripts if not item.is_generated]
        return (manual or transcripts)[0], None

    try:
        return transcript_list.find_transcript([requested_language]), None
    except NoTranscriptFound:
        pass

    # If the requested track does not exist, ask YouTube to translate an
    # available track when that translation is supported for the video.
    for source in transcripts:
        if not getattr(source, "is_translatable", False):
            continue
        try:
            translated = source.translate(requested_language)
            return translated, source.language_code
        except Exception:
            continue

    raise NoTranscriptFound("Requested language is not available or translatable.")


@app.get("/api/health")
def health():
    return {"ok": True, "service": "youtube-transcript"}


@app.get("/api/transcript")
def transcript(
    url: str = Query(..., min_length=1, max_length=500),
    lang: str = Query("auto", min_length=2, max_length=12),
):
    video_id = extract_video_id(url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Enter a valid YouTube video URL or 11-character video ID.")

    language = lang.strip().lower()
    try:
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)
        transcripts = list(transcript_list)

        available = [
            {
                "language": item.language,
                "languageCode": item.language_code,
                "generated": item.is_generated,
                "translatable": getattr(item, "is_translatable", False),
            }
            for item in transcripts
        ]

        transcript_obj, translated_from = choose_transcript(transcript_list, language)
        fetched = transcript_obj.fetch()
        raw = fetched.to_raw_data()
        segments = [
            {
                "text": clean_text(item.get("text", "")),
                "start": round(float(item.get("start", 0)), 3),
                "duration": round(float(item.get("duration", 0)), 3),
            }
            for item in raw
            if clean_text(item.get("text", ""))
        ]

        if not segments:
            raise HTTPException(status_code=404, detail="A transcript track exists, but it contains no readable text.")

        return JSONResponse(
            {
                "ok": True,
                "videoId": video_id,
                "language": transcript_obj.language,
                "languageCode": transcript_obj.language_code,
                "generated": transcript_obj.is_generated,
                "translatedFrom": translated_from,
                "segments": segments,
                "available": available,
            },
            headers={"Cache-Control": "private, max-age=300"},
        )
    except TranscriptsDisabled:
        raise HTTPException(status_code=404, detail="Transcripts are disabled for this video.")
    except NoTranscriptFound:
        raise HTTPException(status_code=404, detail="No matching transcript was found. Choose Auto, Urdu, Hindi, or another language that YouTube provides for this video.")
    except VideoUnavailable:
        raise HTTPException(status_code=404, detail="This video is unavailable or cannot be accessed.")
    except RequestBlocked:
        raise HTTPException(status_code=503, detail="YouTube temporarily blocked the transcript request from this server. Try again later.")
    except CouldNotRetrieveTranscript as exc:
        raise HTTPException(status_code=502, detail=f"YouTube did not return a transcript for this video: {exc.__class__.__name__}.")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="The transcript could not be retrieved right now.")
