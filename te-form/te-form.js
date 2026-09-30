(() => {
  const $ = id => document.getElementById(id);
  const answer = $('verbInput');
  let current, previous, locked = false, correct = 0, wrong = 0, streak = 0, drill = 0;
  const analytics = window.NihongoAnalytics?.create('te-form', () => ({mode: 'free', category: current?.g, form: 'te'}));
  function updateStats() {
    const total = correct + wrong;
    $('correctCounter').textContent = correct;
    $('incorrectCounter').textContent = wrong;
    $('totalCount').textContent = total;
    $('streak').textContent = streak;
    $('accuracy').textContent = total ? `${Math.round(correct / total * 100)}%` : '—';
    $('goalLabel').textContent = `Meta do bloco (${total} / 25)`;
    const progress = Math.min(100, total / 25 * 100);
    $('goalPercent').textContent = `${Math.round(progress)}%`;
    $('goalFill').style.width = `${progress}%`;
  }
  function explanation() {
    return `${current.rule}. ${current.v === '行く' ? '行く é uma exceção: use 行って.' : current.g === 'godan' && current.kana.endsWith('く') ? 'Exceção desta família: 行く → 行って.' : ''} Exemplo: ${current.kana} → ${current.te}`;
  }
  function nextQuestion() {
    const groups = [...document.querySelectorAll('input[name="group"]:checked')].map(el => el.value);
    const base = VERBS.filter(verb => groups.includes(verb.g));
    const focus = $('focusSelect');
    let pool = base.filter(verb => focus.value === 'all' || (focus.value === 'sound' ? verb.g === 'godan' : verb.g === 'irregular' || verb.v === '行く'));
    if (!pool.length) { focus.value = 'all'; pool = base; }
    const choices = pool.filter(verb => verb !== previous);
    current = choices[Math.floor(Math.random() * choices.length)] || pool[0];
    previous = current;
    locked = false;
    drill++;
    const link = document.createElement('a');
    link.href = `https://jisho.hlorenzi.com/search/${encodeURIComponent(current.v)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.title = 'Consultar no dicionário';
    link.innerHTML = current.ruby || current.v;
    $('verbTarget').replaceChildren(link);
    const romaji = window.wanakana ? window.wanakana.toRomaji(current.kana) : current.kana;
    $('verbTranslation').textContent = `${romaji} · ${current.translation}`;
    $('verbGroup').textContent = `Grupo: ${ {godan: '五段動詞 (Godan)', ichidan: '一段動詞 (Ichidan)', irregular: 'Irregulares / exceções'}[current.g]}`;
    $('drill-label').textContent = `N5 · DRILL #${drill} · CONJUGAÇÃO VERBAL`;
    $('ruleTitle').textContent = `Regra: ${current.rule}`;
    $('ruleDescription').textContent = explanation();
    answer.value = '';
    answer.disabled = false;
    delete answer.dataset.result;
    $('verifyBtn').disabled = false;
    $('feedbackBanner').hidden = true;
    setHint($('toggleHint').checked);
    answer.focus({ preventScroll: true });
  }
  answer.addEventListener('input', () => { if (answer.value.trim()) analytics?.start(); });
  function check() {
    if (locked) return;
    const raw = answer.value.trim();
    if (!raw) { answer.focus(); return; }
    const normalized = window.wanakana ? window.wanakana.toHiragana(raw.toLowerCase()) : raw;
    const ok = normalized.replace(/\s/g, '') === current.te || raw === current.kanji;
    analytics?.track('answer_submit', {result: ok ? 'correct' : 'incorrect'});
    locked = true;
    if (ok) { correct++; streak++; } else { wrong++; streak = 0; }
    updateStats();
    answer.disabled = true;
    answer.dataset.result = ok ? 'correct' : 'wrong';
    $('verifyBtn').disabled = true;
    $('feedbackBanner').dataset.result = ok ? 'correct' : 'wrong';
    $('feedbackTitle').textContent = ok ? '✓ Correto! 正解です' : 'Resposta incorreta';
    $('feedbackSeal').textContent = ok ? '◯' : '×';
    $('feedbackDetail').textContent = `${current.v} → ${current.kanji} (${current.te})`;
    $('feedbackRule').textContent = explanation();
    $('feedbackBanner').hidden = false;
    $('nextVerbBtn').focus({ preventScroll: true });
  }
  function setHint(visible, userInitiated = false) {
    if (visible && userInitiated && $('ruleHintBox').hidden) analytics?.track('hint_open', {hint_type: 'rule'});
    $('toggleHint').checked = visible;
    $('ruleHintBox').hidden = !visible;
    $('toggleHintAction').setAttribute('aria-expanded', String(visible));
  }
  if (window.wanakana) window.wanakana.bind(answer, { IMEMode: 'toHiragana' });
  document.querySelectorAll('input[name="group"]').forEach(input => input.addEventListener('change', () => {
    if (!document.querySelector('input[name="group"]:checked')) input.checked = true;
    nextQuestion();
  }));
  $('focusSelect').addEventListener('change', nextQuestion);
  $('toggleHint').addEventListener('change', () => setHint($('toggleHint').checked, true));
  $('toggleHintAction').addEventListener('click', () => setHint(!$('toggleHint').checked, true));
  $('clearInputBtn').addEventListener('click', () => { if (!locked) { answer.value = ''; answer.focus(); } });
  $('verifyBtn').addEventListener('click', check);
  $('nextVerbBtn').addEventListener('click', nextQuestion);
  $('skipBtn').addEventListener('click', () => { if (!locked) analytics?.track('question_skip'); nextQuestion(); });
  $('reset').addEventListener('click', () => { correct = wrong = streak = drill = 0; previous = null; updateStats(); nextQuestion(); });
  $('furiganaBtn').addEventListener('click', () => {
    const hide = document.body.classList.toggle('hide-furigana');
    $('furiganaBtn').setAttribute('aria-pressed', String(!hide));
    $('furiganaBtn').textContent = `Furigana: ${hide ? 'desligado' : 'ligado'}`;
  });
  $('toggleGuideBtn').setAttribute('aria-expanded', 'true');
  $('toggleGuideBtn').addEventListener('click', () => {
    const guide = $('terminationsGuideSection');
    guide.hidden = !guide.hidden;
    $('toggleGuideBtn').setAttribute('aria-expanded', String(!guide.hidden));
    $('guideChevron').style.transform = guide.hidden ? 'rotate(180deg)' : '';
    if (!guide.hidden) guide.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });
  const navigation = $('te-navigation');
  function closeMenu() { navigation.removeAttribute('data-open'); $('menu-button').setAttribute('aria-expanded', 'false'); }
  $('menu-button').addEventListener('click', () => {
    const open = $('menu-button').getAttribute('aria-expanded') !== 'true';
    navigation.toggleAttribute('data-open', open);
    $('menu-button').setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', event => { if (!navigation.contains(event.target) && !$('menu-button').contains(event.target)) closeMenu(); });
  const help = $('keyboard-help');
  $('help-button').addEventListener('click', () => help.showModal());
  $('close-help').addEventListener('click', () => help.close());
  document.addEventListener('keydown', event => {
    if (help.open || event.repeat || event.isComposing || event.defaultPrevented) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'h') { event.preventDefault(); setHint(!$('toggleHint').checked, true); return; }
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'Enter' && event.target === answer) { event.preventDefault(); locked ? nextQuestion() : check(); }
    if (event.key === 'Escape') closeMenu();
    if (event.key === '?' && !event.target.closest('input, textarea, select')) { event.preventDefault(); help.showModal(); }
  });
  document.querySelectorAll('.material-symbols-outlined').forEach(icon => icon.setAttribute('aria-hidden', 'true'));
  updateStats();
  nextQuestion();
})();
