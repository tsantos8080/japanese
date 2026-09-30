(() => {
  const t = (text, params) => window.NihongoI18n?.text(text, params) ?? (typeof text === 'string' ? text.replace(/{{(\w+)}}/g, (_, key) => params?.[key] ?? '') : text);
  const ui = (element, render, attribute = 'textContent') => { if (window.NihongoI18n) window.NihongoI18n.bindText(element, render, attribute); else element[attribute] = render(); };
  const $ = id => document.getElementById(id);
  const input = $('typing-input');
  let mode = 'all', phrase, chunks, index = 0, pending = '', keys = 0, errors = 0, started = 0, finished = false, elapsed = 0;
  let sessionPhrases = 0, sessionKana = 0, sessionKeys = 0, sessionErrors = 0, showRomaji = false, lastEntry = 0, intervals = [];
  const analytics = window.NihongoAnalytics?.create('speed-reader', () => ({mode, category: phrase?.type}));
  function updateMetrics() {
    const seconds = started ? (finished ? elapsed : performance.now() - started) / 1000 : 0;
    const kana = chunks.slice(0,index).reduce((sum,c) => sum + c.kana.length,0);
    const cpm = seconds > 0 ? Math.round(kana / seconds * 60) : 0;
    $('metric-cpm').textContent = cpm;
    $('metric-wpm').textContent = `${Math.round(cpm / 5)} WPM`;
    $('metric-accuracy').textContent = keys ? Math.round((keys-errors)/keys*100) : '—';
    $('metric-time').textContent = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
    ui($('character-count'), () => t("{{v0}} / {{v1}} caracteres", {v0: t(kana), v1: t(phrase.kana.length)}));
    $('phrase-fill').style.width = `${kana/phrase.kana.length*100}%`;
  }
  function render() {
    $('character-stream').replaceChildren();
    chunks.forEach((chunk,i) => {
      const span = document.createElement('span');
      span.className = i < index ? 'text-[#1F2430] bg-[#D7E3D3] px-1 rounded' : i === index ? 'px-1 bg-[#F5EED9] text-[#1F2430] font-bold rounded' : 'text-[#968F7E] opacity-75';
      span.textContent = chunk.kana;
      if (showRomaji) { const guide = document.createElement('small'); guide.className = 'romaji-guide'; guide.textContent = chunk.romaji[0]; span.append(guide); }
      $('character-stream').append(span);
    });
    const active = chunks[index], next = chunks[index+1];
    ui($('matrix-label'), () => t(finished ? t('Frase concluída') : t('Próximo trecho')));
    ui($('active-keys'), () => t(active ? t("TECLA ATIVA: {{v0}}", {v0: t(active.romaji[0].toUpperCase())}) : t('CONCLUÍDO')));
    $('active-kana').textContent = active ? `${active.kana} (${active.romaji[0]})` : '✓';
    ui($('next-keys'), () => t(next ? t("PRÓXIMO: {{v0}}", {v0: t(next.romaji[0].toUpperCase())}) : t('FIM')));
    $('next-kana').textContent = next ? next.kana : '—';
    updateMetrics();
  }
  function load(nextPhrase) {
    phrase = nextPhrase; chunks = parseKanaSentence(phrase.kana); index = 0; pending = ''; keys = errors = started = elapsed = lastEntry = 0; finished = false; intervals = [];
    input.value = ''; input.disabled = false;
    $('model-phrase').textContent = phrase.kana;
    ui($('phrase-meaning'), () => t(phrase.meaning));
    const phraseNumber = sessionPhrases + 1;
    ui($('phrase-progress'), () => t("Frase {{v0}}", {v0: t(phraseNumber)}));
    $('latency-path').setAttribute('d',''); ui($('latency-summary'), () => t('— ms / entrada'));
    render(); input.focus({preventScroll:true});
  }
  function nextQuestion() {
    const pool = PHRASES.filter(p => mode === 'all' || p.type === mode);
    const choices = pool.filter(p => p !== phrase);
    load(choices[Math.floor(Math.random()*choices.length)] || pool[0]);
  }
  function complete() {
    finished = true; elapsed = performance.now()-started;
    analytics?.track('phrase_complete', {duration_seconds: Math.round(elapsed / 1000), character_count: phrase.kana.length, error_count: errors, accuracy: Math.round((keys-errors)/keys*100)});
    sessionPhrases++; sessionKana += phrase.kana.length; sessionKeys += keys; sessionErrors += errors;
    ui($('session-phrases'), () => t("{{v0}} Frases Concluídas", {v0: t(sessionPhrases)}));
    $('session-kana').textContent = sessionKana;
    $('session-errors').textContent = sessionErrors;
    $('session-accuracy').textContent = `${Math.round((sessionKeys-sessionErrors)/sessionKeys*100)}%`;
    input.disabled = true; $('next').focus({preventScroll:true});
  }
  function accept(char) {
    if (finished || !char) return;
    analytics?.start();
    const now = performance.now(); if (!started) started = now;
    if (lastEntry) {
      intervals.push(now-lastEntry); intervals = intervals.slice(-50);
      const max = Math.max(1,...intervals);
      $('latency-path').setAttribute('d',intervals.map((v,i)=>`${i?'L':'M'} ${i*500/Math.max(1,intervals.length-1)} ${55-v/max*50}`).join(' '));
      ui($('latency-summary'), () => t("{{v0}} ms / entrada", {v0: t(Math.round(intervals.reduce((a,b)=>a+b,0)/intervals.length))}));
    }
    lastEntry = now; keys++;
    const chunk = chunks[index];
    const candidate = pending + char.toLowerCase();
    if (chunk.romaji.some(option => option.startsWith(candidate)) || chunk.kana.startsWith(candidate)) {
      pending = candidate;
      if (chunk.romaji.includes(candidate) || chunk.kana === candidate) { pending = ''; index++; if(index === chunks.length) complete(); }
    } else { errors++; }
    input.value = pending;
    render();
  }
  input.addEventListener('input', event => {
    if (event.isComposing) return;
    if (event.inputType && event.inputType.startsWith('delete')) { pending = ''; input.value = ''; return; }
    const inserted = event.data || input.value.slice(pending.length);
    for (const char of inserted) accept(char);
  });
  input.addEventListener('compositionend', event => { for (const char of event.data || '') accept(char); input.value = pending; });
  input.addEventListener('paste', event => { event.preventDefault(); for(const char of event.clipboardData.getData('text')) accept(char); });
  $('restart').addEventListener('click',()=>load(phrase));
  function advance() { if (!finished) analytics?.track('question_skip'); nextQuestion(); }
  $('next').addEventListener('click',advance);
  $('toggle-romaji').setAttribute('aria-pressed','false');
  $('toggle-romaji').addEventListener('click',()=>{showRomaji=!showRomaji;if(showRomaji)analytics?.track('hint_open', {hint_type: 'romaji'});$('toggle-romaji').setAttribute('aria-pressed',String(showRomaji));render();});
  document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.mode;document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));nextQuestion();}));
  const help = $('keyboard-help');
  $('typing-guide-button').addEventListener('click',()=>help.showModal());
  $('help-button').addEventListener('click',()=>help.showModal());
  $('close-help').addEventListener('click',()=>help.close());
  const navigation = $('reader-navigation');
  function closeMenu(){navigation.removeAttribute('data-open');$('menu-button').setAttribute('aria-expanded','false'); ui($('menu-button'), () => t($('menu-button').getAttribute('aria-expanded') === 'true' ? 'Fechar navegação' : 'Abrir navegação'), 'aria-label');}
  $('menu-button').addEventListener('click',()=>{const open=$('menu-button').getAttribute('aria-expanded')!=='true';navigation.toggleAttribute('data-open',open);$('menu-button').setAttribute('aria-expanded',String(open)); ui($('menu-button'), () => t($('menu-button').getAttribute('aria-expanded') === 'true' ? 'Fechar navegação' : 'Abrir navegação'), 'aria-label');});
  document.addEventListener('click',event=>{if(!navigation.contains(event.target)&&!$('menu-button').contains(event.target))closeMenu();});
  document.addEventListener('keydown',event=>{
    if(help.open||event.repeat||event.isComposing||event.ctrlKey||event.metaKey||event.altKey)return;
    if(event.key==='Escape'){closeMenu();if(event.target===input){event.preventDefault();load(phrase);}}
    if(event.key==='Enter'&&event.target===input){event.preventDefault();advance();}
    if(event.key==='?'&&!event.target.closest('input, textarea, select')){event.preventDefault();help.showModal();}
  });
  document.querySelectorAll('.material-symbols-outlined').forEach(icon=>icon.setAttribute('aria-hidden','true'));
  nextQuestion();
  window.setInterval(()=>{if(started&&!finished)updateMetrics();},250);
})();
