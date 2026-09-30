(() => {
  const t = (text, params) => window.NihongoI18n?.text(text, params) ?? (typeof text === 'string' ? text.replace(/{{(\w+)}}/g, (_, key) => params?.[key] ?? '') : text);
  const ui = (element, render, attribute = 'textContent') => { if (window.NihongoI18n) window.NihongoI18n.bindText(element, render, attribute); else element[attribute] = render(); };
  const $ = id => document.getElementById(id);
  const entries = new Map(KANA.map(entry => [entry.hira, entry]));
  const cards = [...document.querySelectorAll('.kana-card')].map(element => ({
    element, entry: entries.get(element.dataset.kana),
    glyph: element.querySelector('.main-kana'),
    label: element.querySelector('.romaji-label'),
    strokes: element.querySelector('.stroke-badge')
  }));
  const modes = ['hiragana', 'katakana', 'comparative'];
  let script = 'hiragana', group = 'all', selected = KANA[0], autoVoice = true;
  const tabBase = 'px-4 py-2 rounded text-body-sm font-body-sm font-medium transition-all ';
  const groupBase = 'group-btn px-3 py-1 rounded text-label-md font-label-md font-medium whitespace-nowrap ';
  const help = $('keyboard-help');
  const navigation = $('kana-navigation');

  const analytics = window.NihongoAnalytics?.create('kana', () => ({mode: script, category: selected.group}));
  function renderStrokeSketch(entry) {
    const sketch = $('stroke-sketch');
    sketch.replaceChildren();
    if (entry.hira !== 'あ' || script === 'katakana') {
      const note = document.createElement('span');
      note.className = 'font-body-sm text-body-sm text-[#6e685c]';
      ui(note, () => t('Diagrama de ordem de traços ainda não cadastrado para este caractere.'));
      sketch.append(note);
      return;
    }
    [['一', 'Horizontal'], ['十', 'Vertical'], ['あ', 'Loop final']].forEach(([glyph, label], i) => {
      if (i) {
        const arrow = document.createElement('span');
        arrow.className = 'text-[#ded3be]';
        arrow.textContent = '→';
        sketch.append(arrow);
      }
      const step = document.createElement('div');
      step.className = 'flex flex-col items-center';
      const number = document.createElement('span');
      number.className = 'w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center mb-1 ' +
        (i === 2 ? 'bg-[#b3392c] text-white shadow-xs' : 'bg-[#ded3be] text-[#1f2430]');
      number.textContent = i + 1;
      const shape = document.createElement('span');
      shape.className = 'font-serif text-lg text-[#1f2430] ' + ['opacity-60', 'opacity-80', 'font-bold'][i];
      shape.textContent = glyph;
      const caption = document.createElement('span');
      caption.className = 'text-[10px] font-mono mt-0.5 ' + (i === 2 ? 'text-[#b3392c] font-bold' : 'text-[#6e685c]');
      ui(caption, () => t(label));
      step.append(number, shape, caption);
      sketch.append(step);
    });
  }

  function inspect(entry, initial = false) {
    selected = entry;
    $('inspectMainKana').textContent = script === 'katakana' ? entry.kata : entry.hira;
    $('inspectKataKana').textContent = script === 'katakana' ? entry.hira : entry.kata;
    $('inspectRomaji').textContent = entry.romaji;
    ui($('inspectGroupBadge'), () => t(initial ? t('Vogal Pura • JLPT N5') : t(entry.badge)));
    ui($('inspectDescription'), () => t(entry.note));
    ui($('inspectStrokeCount'), () => t(entry.strokes
      ? entry.strokes + (entry.strokes === 1 ? t(' traço único') : t(' traços ordenados')) + (script === 'katakana' ? ' (hiragana)' : '')
      : t('Traços: referência pendente')));
    for (let i = 1; i <= 2; i++) {
      const word = entry.examples?.[(i - 1) * 2] || '';
      $('inspectEx' + i).textContent = word;
      ui($('inspectEx' + i + 'Trans'), () => t(entry.examples?.[(i - 1) * 2 + 1] || ''));
      $('example-' + i).hidden = !word;
    }
    renderStrokeSketch(entry);
  }

  function refresh() {
    const term = $('kanaSearchInput').value.trim().toLowerCase().normalize('NFKC');
    let count = 0;
    cards.forEach(({element, entry, glyph, label, strokes}) => {
      if (script === 'comparative') {
        const hira = document.createElement('span');
        hira.className = 'text-2xl';
        hira.textContent = entry.hira;
        const slash = document.createElement('span');
        slash.className = 'text-base text-gray-500 mx-1';
        slash.textContent = '/';
        const kata = document.createElement('span');
        kata.className = 'text-xl opacity-90';
        kata.textContent = entry.kata;
        glyph.replaceChildren(hira, slash, kata);
      } else {
        glyph.textContent = script === 'katakana' ? entry.kata : entry.hira;
      }
      label.hidden = !$('toggleRomaji').checked;
      if (strokes) strokes.hidden = !$('toggleStrokes').checked;
      const match = (!term || [entry.hira, entry.kata, entry.romaji, label.textContent].some(value => value.toLowerCase().normalize('NFKC').includes(term))) &&
        (group === 'all' || entry.group === group);
      element.hidden = !match;
      element.setAttribute('aria-pressed', String(entry === selected));
      if (match) count++;
    });
    ['gojuon', 'dakuon', 'youon'].forEach(key => {
      $('section-' + key).hidden = !cards.some(card => card.entry.group === key && !card.element.hidden);
    });
    const specials = $('section-specials');
    specials.hidden = !(group === 'all' || group === 'specials') ||
      (!!term && !specials.textContent.toLowerCase().normalize('NFKC').includes(term));
    $('search-status').hidden = count > 0 || !specials.hidden;
    ui($('search-status'), () => t('Nenhum kana encontrado. Tente outro som ou bloco.'));
    $('clearSearchBtn').hidden = !term;
    document.body.classList.toggle('searching', !!term);
    document.querySelectorAll('[data-script]').forEach(button => {
      const active = button.dataset.script === script;
      button.setAttribute('aria-pressed', String(active));
      button.className = tabBase + (active ? 'bg-surface-container-high text-on-surface shadow-sm'
        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60');
    });
    document.querySelectorAll('[data-group]').forEach(button => {
      const active = button.dataset.group === group;
      button.setAttribute('aria-pressed', String(active));
      button.className = groupBase + (active ? 'active bg-surface-variant text-primary-fixed transition-all'
        : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface transition-all');
    });
  }

  // Receive the clicked entry directly: selection updates never determine another card's audio.
  function play(entry, source) {
    analytics?.track('kana_audio_click', {source, audio_support: window.speechSynthesis && typeof window.SpeechSynthesisUtterance === 'function' ? 'available' : 'unavailable'});
    const synth = window.speechSynthesis;
    if (!synth || typeof window.SpeechSynthesisUtterance !== 'function') {
      ui($('audio-status'), () => t('Síntese de voz indisponível neste navegador.'));
      return;
    }
    try {
      synth.cancel();
      const text = entry.hira === 'を' ? 'お' : script === 'katakana' ? entry.kata : entry.hira;
      const utterance = new window.SpeechSynthesisUtterance(text);
      const voice = synth.getVoices().find(item => /^ja(?:-|_|$)/i.test(item.lang));
      if (voice) utterance.voice = voice;
      // getVoices() may be empty before voiceschanged. Request Japanese on this first click too.
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;
      utterance.onerror = event => {
        if (event.error !== 'canceled' && event.error !== 'interrupted')
          ui($('audio-status'), () => t('Não foi possível reproduzir a voz japonesa.'));
      };
      synth.speak(utterance);
      ui($('audio-status'), () => t('Voz japonesa sintetizada'));
    } catch {
      ui($('audio-status'), () => t('Não foi possível reproduzir a voz japonesa.'));
    }
  }

  cards.forEach(({element, entry}) => {
    function select() {
      inspect(entry);
      refresh();
      analytics?.start();
      if (autoVoice) play(entry, 'card');
    }
    element.addEventListener('click', select);
    element.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        select();
      }
    });
    element.querySelector('.material-symbols-outlined').addEventListener('click', event => {
      event.stopPropagation();
      inspect(entry);
      refresh();
      play(entry, 'icon');
    });
  });
  function setScript(mode) { script = mode; inspect(selected); refresh(); }
  document.querySelectorAll('[data-script]').forEach(button =>
    button.addEventListener('click', () => setScript(button.dataset.script)));
  document.querySelectorAll('[data-group]').forEach(button =>
    button.addEventListener('click', () => { group = button.dataset.group; refresh(); }));
  $('kanaSearchInput').addEventListener('input', refresh);
  $('toggleRomaji').addEventListener('change', refresh);
  $('toggleStrokes').addEventListener('change', refresh);
  $('clearSearchBtn').addEventListener('click', () => {
    $('kanaSearchInput').value = '';
    refresh();
    $('kanaSearchInput').focus();
  });
  function toggleAudio() {
    autoVoice = !autoVoice;
    $('audioGlobalToggle').setAttribute('aria-pressed', String(autoVoice));
    $('header-audio-toggle').setAttribute('aria-pressed', String(autoVoice));
    ui($('audioToggleLabel'), () => t(autoVoice ? t('Voz Ativa') : t('Voz Silenciada')));
    $('audioToggleIcon').textContent = autoVoice ? 'volume_up' : 'volume_off';
    $('header-audio-toggle').querySelector('span').textContent = autoVoice ? 'volume_up' : 'volume_off';
    if (!autoVoice) window.speechSynthesis?.cancel();
  }
  $('audioGlobalToggle').addEventListener('click', toggleAudio);
  $('header-audio-toggle').addEventListener('click', toggleAudio);
  $('play-inspector').addEventListener('click', () => play(selected, 'inspector'));
  for (let i = 1; i <= 2; i++) $('example-' + i).addEventListener('click', () => {
    const word = selected.examples?.[(i - 1) * 2] || '';
    const reading = (word.match(/\(([^)]+)\)/)?.[1] || word).split('/')[0].trim();
    if (reading) play({hira: reading, kata: reading}, 'example');
  });
  $('help-button').addEventListener('click', () => help.showModal());
  $('close-help').addEventListener('click', () => help.close());
  $('menu-button').addEventListener('click', () => {
    const open = $('menu-button').getAttribute('aria-expanded') !== 'true';
    navigation.toggleAttribute('data-open', open);
    $('menu-button').setAttribute('aria-expanded', String(open)); ui($('menu-button'), () => t($('menu-button').getAttribute('aria-expanded') === 'true' ? 'Fechar navegação' : 'Abrir navegação'), 'aria-label');
  });
  document.addEventListener('keydown', event => {
    if (help.open || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.isComposing ||
      event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    if (event.key === '/') { event.preventDefault(); $('kanaSearchInput').focus(); }
    if (event.key.toLowerCase() === 'r') { event.preventDefault(); $('toggleRomaji').checked = !$('toggleRomaji').checked; refresh(); }
    if (event.key.toLowerCase() === 't') { event.preventDefault(); setScript(modes[(modes.indexOf(script) + 1) % modes.length]); }
    if (event.key === ' ' && !event.target.closest('button,a,[role="button"]')) { event.preventDefault(); play(selected, 'keyboard'); }
    if (event.key === '?') { event.preventDefault(); help.showModal(); }
  });
  inspect(selected, true);
  refresh();
})();
