(() => {
  const form = document.querySelector('#transcript-form');
  if (!form) return;

  const urlInput = document.querySelector('#youtube-url');
  const langInput = document.querySelector('#language');
  const submit = document.querySelector('#get-transcript');
  const status = document.querySelector('#transcript-status');
  const result = document.querySelector('#transcript-result');
  const output = document.querySelector('#transcript-output');
  const meta = document.querySelector('#transcript-meta');
  const timestampToggle = document.querySelector('#show-timestamps');
  const copyBtn = document.querySelector('#copy-transcript');
  const txtBtn = document.querySelector('#download-txt');
  const srtBtn = document.querySelector('#download-srt');
  const searchInput = document.querySelector('#transcript-search');
  const authDot = document.querySelector('#auth-dot');
  const authTitle = document.querySelector('#auth-title');
  const authDetail = document.querySelector('#auth-detail');
  const connectBtn = document.querySelector('#connect-youtube');
  const disconnectBtn = document.querySelector('#disconnect-youtube');

  let segments = [];
  let currentVideoId = '';
  let connected = false;

  const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const formatClock = (seconds) => {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${m}:${String(s).padStart(2, '0')}`;
  };

  const formatSrtTime = (seconds) => {
    const ms = Math.max(0, Math.round((Number(seconds) || 0) * 1000));
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const milli = ms % 1000;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(milli).padStart(3, '0')}`;
  };

  const cleanText = () => segments.map((item) => item.text).join(' ').replace(/\s+/g, ' ').trim();

  const render = () => {
    const query = searchInput.value.trim().toLowerCase();
    const showTimes = timestampToggle.checked;
    const filtered = query
      ? segments.filter((item) => item.text.toLowerCase().includes(query))
      : segments;

    output.innerHTML = filtered.length
      ? filtered.map((item) => `
          <p class="transcript-line">
            ${showTimes ? `<button class="time-chip" type="button" data-time="${item.start}" title="Timestamp ${formatClock(item.start)}">${formatClock(item.start)}</button>` : ''}
            <span>${escapeHtml(item.text)}</span>
          </p>`).join('')
      : '<p class="empty-state">No transcript lines match your search.</p>';
  };

  const setStatus = (message, type = 'neutral') => {
    status.textContent = message;
    status.dataset.type = type;
  };

  const setAuthUI = ({ configured, connected: isConnected }) => {
    connected = Boolean(configured && isConnected);
    authDot.classList.toggle('connected', connected);
    submit.disabled = !connected;
    connectBtn.hidden = connected || !configured;
    disconnectBtn.hidden = !connected;

    if (!configured) {
      authTitle.textContent = 'Google OAuth setup required';
      authDetail.textContent = 'Add the Google OAuth credentials to this Vercel Preview before connecting YouTube.';
      setStatus('This preview is waiting for Google OAuth environment variables.', 'error');
      return;
    }

    if (connected) {
      authTitle.textContent = 'YouTube connected';
      authDetail.textContent = 'Official caption access is ready for videos this Google account can manage.';
      setStatus('Connected. Paste one of your own YouTube video links.', 'success');
    } else {
      authTitle.textContent = 'Connect your YouTube account';
      authDetail.textContent = 'Google authorization is required before ToolViking can download your caption tracks.';
      setStatus('Connect YouTube first, then paste your video URL.');
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/youtube/auth-status', { headers: { Accept: 'application/json' } });
      const data = await response.json();
      setAuthUI(data);
    } catch {
      setAuthUI({ configured: false, connected: false });
    }
  };

  const download = (filename, content, mime = 'text/plain;charset=utf-8') => {
    const blob = new Blob([content], { type: mime });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  disconnectBtn.addEventListener('click', async () => {
    disconnectBtn.disabled = true;
    try {
      await fetch('/api/youtube/disconnect', { method: 'POST' });
      result.hidden = true;
      segments = [];
      await checkAuth();
    } finally {
      disconnectBtn.disabled = false;
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!connected) {
      setStatus('Connect your YouTube account first.', 'error');
      return;
    }

    const url = urlInput.value.trim();
    const lang = langInput.value.trim() || 'auto';
    if (!url) {
      setStatus('Paste a YouTube URL first.', 'error');
      urlInput.focus();
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Getting transcript…';
    setStatus('Requesting the caption track from the official YouTube Data API…', 'loading');
    result.hidden = true;

    try {
      const response = await fetch(`/api/transcript?url=${encodeURIComponent(url)}&lang=${encodeURIComponent(lang)}`, {
        headers: { Accept: 'application/json' },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401) await checkAuth();
        throw new Error(data.detail || 'The transcript could not be retrieved.');
      }

      segments = Array.isArray(data.segments) ? data.segments : [];
      currentVideoId = data.videoId || 'youtube-video';
      if (!segments.length) throw new Error('No readable transcript text was returned.');

      const words = cleanText().split(/\s+/).filter(Boolean).length;
      const duration = segments.length ? segments[segments.length - 1].start + segments[segments.length - 1].duration : 0;
      const translated = data.translatedFrom ? ` · translated from ${data.translatedFrom}` : '';
      meta.textContent = `${words.toLocaleString()} words · ${formatClock(duration)} · ${data.language || data.languageCode || lang}${data.generated ? ' · auto-generated' : ''}${translated}`;
      searchInput.value = '';
      result.hidden = false;
      render();
      setStatus('Transcript ready. Nothing is saved in a ToolViking transcript database.', 'success');
    } catch (error) {
      segments = [];
      setStatus(error.message || 'The transcript could not be retrieved.', 'error');
    } finally {
      submit.disabled = !connected;
      submit.textContent = 'Get Transcript';
    }
  });

  timestampToggle.addEventListener('change', render);
  searchInput.addEventListener('input', render);

  copyBtn.addEventListener('click', async () => {
    if (!segments.length) return;
    const text = timestampToggle.checked
      ? segments.map((item) => `[${formatClock(item.start)}] ${item.text}`).join('\n')
      : cleanText();
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Transcript copied to clipboard.', 'success');
    } catch {
      setStatus('Copy was blocked by your browser. Use Download TXT instead.', 'error');
    }
  });

  txtBtn.addEventListener('click', () => {
    if (!segments.length) return;
    const text = timestampToggle.checked
      ? segments.map((item) => `[${formatClock(item.start)}] ${item.text}`).join('\n')
      : cleanText();
    download(`${currentVideoId}-transcript.txt`, text);
  });

  srtBtn.addEventListener('click', () => {
    if (!segments.length) return;
    const srt = segments.map((item, index) => {
      const start = formatSrtTime(item.start);
      const end = formatSrtTime(item.start + Math.max(item.duration, 0.5));
      return `${index + 1}\n${start} --> ${end}\n${item.text}\n`;
    }).join('\n');
    download(`${currentVideoId}-transcript.srt`, srt);
  });

  const oauthResult = new URLSearchParams(window.location.search).get('oauth');
  if (oauthResult) {
    history.replaceState({}, '', window.location.pathname);
  }
  checkAuth();
})();
