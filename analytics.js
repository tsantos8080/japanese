(() => {
  const events = new Set(['practice_start', 'answer_submit', 'hint_open', 'question_skip', 'phrase_complete', 'kana_audio_click']);
  const parameters = new Set(['module', 'mode', 'category', 'form', 'result', 'hint_type', 'source', 'audio_support', 'duration_seconds', 'character_count', 'error_count', 'accuracy']);

  // Explicit allowlist: typed answers, search terms and vocabulary never enter analytics.
  function send(event, values) {
    if (typeof window.gtag !== 'function') return;
    const params = {};
    for (const [key, value] of Object.entries(values)) {
      if (!parameters.has(key)) continue;
      if (typeof value === 'string' && value.length <= 100 || typeof value === 'number' && Number.isFinite(value)) params[key] = value;
    }
    try { window.gtag('event', event, params); } catch { /* Tracking must never interrupt practice. */ }
  }

  window.NihongoAnalytics = {
    create(module, context = () => ({})) {
      let started = false;
      function start() {
        if (started) return;
        started = true;
        send('practice_start', {...context(), module});
      }
      return {
        start,
        track(event, params = {}) {
          if (!events.has(event) || event === 'practice_start') return;
          start();
          send(event, {...context(), ...params, module});
        }
      };
    }
  };
})();
