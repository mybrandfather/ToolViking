import base64
import hashlib
import hmac
import html
import json
import os
import re
import secrets
import time
from typing import Optional

import httpx
from cryptography.fernet import Fernet, InvalidToken
from fastapi import Cookie, FastAPI, HTTPException, Query, Request
from fastapi.responses import JSONResponse, RedirectResponse

app = FastAPI(title="ToolViking YouTube Captions API", docs_url=None, redoc_url=None)

VIDEO_ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")
SRT_TIME_RE = re.compile(
    r"(?P<sh>\d{2}):(?P<sm>\d{2}):(?P<ss>\d{2}),(?P<sms>\d{3})\s+-->\s+"
    r"(?P<eh>\d{2}):(?P<em>\d{2}):(?P<es>\d{2}),(?P<ems>\d{3})"
)
OAUTH_SCOPE = "https://www.googleapis.com/auth/youtube.force-ssl"
COOKIE_NAME = "tv_youtube_oauth"
AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
YOUTUBE_API = "https://www.googleapis.com/youtube/v3"


def env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise HTTPException(status_code=503, detail=f"Server setup is incomplete: {name} is not configured.")
    return value


def client_id() -> str:
    return env("GOOGLE_CLIENT_ID")


def client_secret() -> str:
    return env("GOOGLE_CLIENT_SECRET")


def redirect_uri() -> str:
    value = env("GOOGLE_OAUTH_REDIRECT_URI")
    if not value.startswith("https://") or not value.endswith("/api/youtube/callback"):
        raise HTTPException(status_code=503, detail="GOOGLE_OAUTH_REDIRECT_URI must be an HTTPS URL ending in /api/youtube/callback.")
    return value


def app_origin() -> str:
    return redirect_uri()[: -len("/api/youtube/callback")]


def cipher() -> Fernet:
    digest = hashlib.sha256(client_secret().encode("utf-8")).digest()
    return Fernet(base64.urlsafe_b64encode(digest))


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


def sign_state() -> str:
    payload = f"{int(time.time())}.{secrets.token_urlsafe(18)}"
    signature = hmac.new(client_secret().encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}.{signature}"


def verify_state(state: str) -> bool:
    try:
        timestamp, nonce, signature = state.split(".", 2)
        payload = f"{timestamp}.{nonce}"
        expected = hmac.new(client_secret().encode(), payload.encode(), hashlib.sha256).hexdigest()
        return hmac.compare_digest(signature, expected) and abs(time.time() - int(timestamp)) <= 600
    except (ValueError, TypeError):
        return False


def encode_tokens(data: dict) -> str:
    return cipher().encrypt(json.dumps(data, separators=(",", ":")).encode()).decode()


def decode_tokens(value: Optional[str]) -> dict:
    if not value:
        raise HTTPException(status_code=401, detail="Connect your YouTube account first.")
    try:
        return json.loads(cipher().decrypt(value.encode(), ttl=60 * 60 * 24 * 30).decode())
    except (InvalidToken, ValueError, json.JSONDecodeError):
        raise HTTPException(status_code=401, detail="Your YouTube connection expired. Connect again.")


def seconds_from_srt(h: str, m: str, s: str, ms: str) -> float:
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000


def clean_caption_text(value: str) -> str:
    value = re.sub(r"<[^>]+>", "", value or "")
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def parse_srt(srt: str) -> list[dict]:
    segments = []
    for block in re.split(r"\r?\n\s*\r?\n", srt.strip()):
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        if len(lines) < 2:
            continue
        time_index = 1 if lines[0].isdigit() else 0
        if time_index >= len(lines):
            continue
        match = SRT_TIME_RE.fullmatch(lines[time_index])
        if not match:
            continue
        start = seconds_from_srt(match["sh"], match["sm"], match["ss"], match["sms"])
        end = seconds_from_srt(match["eh"], match["em"], match["es"], match["ems"])
        text = clean_caption_text(" ".join(lines[time_index + 1 :]))
        if text:
            segments.append({"text": text, "start": round(start, 3), "duration": round(max(0, end - start), 3)})
    return segments


async def refresh_access_token(tokens: dict) -> tuple[dict, bool]:
    if tokens.get("access_token") and float(tokens.get("expires_at", 0)) > time.time() + 60:
        return tokens, False
    refresh_token = tokens.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Your Google session expired. Connect YouTube again.")
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(
            TOKEN_URL,
            data={
                "client_id": client_id(),
                "client_secret": client_secret(),
                "refresh_token": refresh_token,
                "grant_type": "refresh_token",
            },
        )
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Google could not refresh your YouTube connection. Connect again.")
    updated = response.json()
    tokens["access_token"] = updated["access_token"]
    tokens["expires_at"] = time.time() + int(updated.get("expires_in", 3600))
    return tokens, True


async def youtube_get(path: str, access_token: str, params: dict) -> httpx.Response:
    async with httpx.AsyncClient(timeout=30) as client:
        return await client.get(
            f"{YOUTUBE_API}/{path}",
            params=params,
            headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"},
        )


def google_error(response: httpx.Response, fallback: str) -> HTTPException:
    try:
        payload = response.json()
        message = payload.get("error", {}).get("message") or fallback
    except Exception:
        message = fallback
    if response.status_code in (401, 403):
        return HTTPException(status_code=response.status_code, detail=message)
    return HTTPException(status_code=502, detail=message)


@app.get("/api/health")
def health():
    configured = all(os.getenv(key) for key in ("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_OAUTH_REDIRECT_URI"))
    return {"ok": True, "service": "youtube-captions-oauth", "oauthConfigured": configured}


@app.get("/api/youtube/auth-status")
def auth_status(tv_youtube_oauth: Optional[str] = Cookie(default=None, alias=COOKIE_NAME)):
    configured = all(os.getenv(key) for key in ("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_OAUTH_REDIRECT_URI"))
    if not configured:
        return {"configured": False, "connected": False}
    try:
        tokens = decode_tokens(tv_youtube_oauth)
        return {"configured": True, "connected": bool(tokens.get("access_token") or tokens.get("refresh_token"))}
    except HTTPException:
        return {"configured": True, "connected": False}


@app.get("/api/youtube/connect")
def youtube_connect():
    state = sign_state()
    params = httpx.QueryParams(
        {
            "client_id": client_id(),
            "redirect_uri": redirect_uri(),
            "response_type": "code",
            "scope": OAUTH_SCOPE,
            "access_type": "offline",
            "include_granted_scopes": "true",
            "prompt": "consent",
            "state": state,
        }
    )
    return RedirectResponse(f"{AUTH_URL}?{params}", status_code=302)


@app.get("/api/youtube/callback")
async def youtube_callback(code: str = "", state: str = "", error: str = ""):
    target = f"{app_origin()}/tools/youtube-transcript-extractor/"
    if error:
        return RedirectResponse(f"{target}?oauth=denied", status_code=302)
    if not code or not verify_state(state):
        return RedirectResponse(f"{target}?oauth=invalid", status_code=302)

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(
            TOKEN_URL,
            data={
                "code": code,
                "client_id": client_id(),
                "client_secret": client_secret(),
                "redirect_uri": redirect_uri(),
                "grant_type": "authorization_code",
            },
        )
    if response.status_code != 200:
        return RedirectResponse(f"{target}?oauth=failed", status_code=302)

    token_data = response.json()
    tokens = {
        "access_token": token_data.get("access_token"),
        "refresh_token": token_data.get("refresh_token"),
        "expires_at": time.time() + int(token_data.get("expires_in", 3600)),
        "scope": token_data.get("scope", ""),
    }
    result = RedirectResponse(f"{target}?oauth=connected", status_code=302)
    result.set_cookie(
        COOKIE_NAME,
        encode_tokens(tokens),
        max_age=60 * 60 * 24 * 30,
        httponly=True,
        secure=True,
        samesite="lax",
        path="/",
    )
    return result


@app.post("/api/youtube/disconnect")
def youtube_disconnect():
    response = JSONResponse({"ok": True})
    response.delete_cookie(COOKIE_NAME, path="/")
    return response


@app.get("/api/transcript")
async def transcript(
    url: str = Query(..., min_length=1, max_length=500),
    lang: str = Query("auto", min_length=2, max_length=12),
    tv_youtube_oauth: Optional[str] = Cookie(default=None, alias=COOKIE_NAME),
):
    video_id = extract_video_id(url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Enter a valid YouTube video URL or 11-character video ID.")

    tokens = decode_tokens(tv_youtube_oauth)
    tokens, refreshed = await refresh_access_token(tokens)
    access_token = tokens["access_token"]

    tracks_response = await youtube_get(
        "captions",
        access_token,
        {"part": "id,snippet", "videoId": video_id},
    )
    if tracks_response.status_code != 200:
        raise google_error(tracks_response, "Google could not list caption tracks for this video.")

    tracks = tracks_response.json().get("items", [])
    if not tracks:
        raise HTTPException(status_code=404, detail="No caption tracks are available for this video in your YouTube account.")

    requested = (lang or "auto").strip().lower()
    exact = [item for item in tracks if item.get("snippet", {}).get("language", "").lower() == requested]
    standard = [item for item in tracks if item.get("snippet", {}).get("trackKind") != "ASR"]
    selected = (exact or standard or tracks)[0]
    selected_language = selected.get("snippet", {}).get("language", "")
    download_params = {"tfmt": "srt"}
    translated = requested not in ("auto", "any") and requested != selected_language.lower()
    if translated:
        download_params["tlang"] = requested

    download_response = await youtube_get(f"captions/{selected['id']}", access_token, download_params)
    if download_response.status_code != 200:
        raise google_error(download_response, "Google could not download this caption track. Make sure you own or can manage the video.")

    segments = parse_srt(download_response.text)
    if not segments:
        raise HTTPException(status_code=502, detail="Google returned the caption file, but no readable transcript lines were found.")

    snippet = selected.get("snippet", {})
    response = JSONResponse(
        {
            "ok": True,
            "videoId": video_id,
            "language": requested if translated else snippet.get("language", selected_language),
            "languageCode": requested if translated else selected_language,
            "generated": snippet.get("trackKind") == "ASR",
            "translatedFrom": selected_language if translated else None,
            "segments": segments,
            "available": [
                {
                    "id": item.get("id"),
                    "language": item.get("snippet", {}).get("name") or item.get("snippet", {}).get("language"),
                    "languageCode": item.get("snippet", {}).get("language"),
                    "generated": item.get("snippet", {}).get("trackKind") == "ASR",
                }
                for item in tracks
            ],
        },
        headers={"Cache-Control": "no-store"},
    )
    if refreshed:
        response.set_cookie(
            COOKIE_NAME,
            encode_tokens(tokens),
            max_age=60 * 60 * 24 * 30,
            httponly=True,
            secure=True,
            samesite="lax",
            path="/",
        )
    return response
