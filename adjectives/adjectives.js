(() => {
  const $ = id => document.getElementById(id);
  const forms = ['Presente Afirmativo', 'Presente Negativo', 'Passado Afirmativo', 'Passado Negativo'];
  let current, previous, formIndex, locked = false, correct = 0, wrong = 0, streak = 0, drill = 0;
  const answer = $('drill-input');
  const analytics = window.NihongoAnalytics?.create('adjectives', () => ({mode: 'free', category: current?.type, form: ['present_affirmative', 'present_negative', 'past_affirmative', 'past_negative'][formIndex]}));
  function conjugate(adj, index) {
    if (adj.type === 'na') return adj.kana + ['です', 'じゃないです', 'でした', 'じゃなかったです'][index];
    const stem = adj.exception ? 'よ' : adj.kana.slice(0, -1);
    return [adj.kana + 'です', stem + 'くないです', stem + 'かったです', stem + 'くなかったです'][index];
  }
  function updateStats() {
    const total = correct + wrong;
    $('correctCount').textContent = correct;
    $('wrongCount').textContent = wrong;
    $('totalCount').textContent = total;
    $('accuracy').textContent = total ? `${Math.round(correct / total * 100)}%` : '—';
    $('streak').textContent = `Sequência: ${streak}`;
    $('accuracy-fill').style.width = total ? `${correct / total * 100}%` : '0%';
    $('error-fill').style.width = total ? `${wrong / total * 100}%` : '0%';
  }
  function renderHint() {
    const content = $('hint-content');
    content.replaceChildren();
    const title = document.createElement('span');
    title.className = 'font-semibold text-[#1f2430]';
    title.textContent = 'Dica gramatical:';
    const explanation = document.createElement('span');
    if (current.type === 'na') {
      explanation.textContent = `Mantenha ${current.kana} e acrescente ${['です', 'じゃないです', 'でした', 'じゃなかったです'][formIndex]}.`;
    } else if (formIndex === 0) {
      explanation.textContent = `No presente afirmativo polido, mantenha ${current.kana} e acrescente です.`;
    } else {
      explanation.textContent = `${current.exception ? 'Este adjetivo é uma exceção: use a raiz よ.' : 'Retire o い final.'} Acrescente ${['', 'くないです', 'かったです', 'くなかったです'][formIndex]}.`;
    }
    content.append(title, explanation);
  }
  function nextQuestion() {
    const types = [...document.querySelectorAll('input[name="adjective-type"]:checked')].map(el => el.value);
    const pool = ADJECTIVES.filter(adj => types.includes(adj.type));
    const choices = pool.filter(adj => adj !== previous);
    current = choices[Math.floor(Math.random() * choices.length)] || pool[0];
    previous = current;
    const focus = document.querySelector('input[name="adjective-focus"]:checked').value;
    const indices = focus === 'negative' ? [1, 3] : focus === 'past' ? [2, 3] : [0, 1, 2, 3];
    formIndex = indices[Math.floor(Math.random() * indices.length)];
    locked = false;
    drill++;
    $('targetWord').textContent = current.word;
    $('targetKana').textContent = current.kana;
    $('translation').textContent = current.meaning;
    $('prompt').textContent = `${forms[formIndex]} (Polido)`;
    $('drill-label').textContent = `Drill #${drill} • Adjetivos`;
    $('classHintValue').textContent = current.type === 'i' ? 'い-Keiyoushi' : 'な-Keiyoushi';
    $('class-hint-badge').hidden = !$('toggle-hint-class').checked;
    answer.value = '';
    answer.disabled = false;
    delete answer.dataset.result;
    $('feedback').hidden = true;
    $('hint-box').hidden = true;
    $('toggle-hint-btn').setAttribute('aria-expanded', 'false');
    $('submit').disabled = false;
    renderHint();
    answer.focus({ preventScroll: true });
  }
  answer.addEventListener('input', () => { if (answer.value.trim()) analytics?.start(); });
  function check() {
    if (locked) return;
    const raw = answer.value.trim();
    if (!raw) { answer.focus(); return; }
    const normalized = window.wanakana ? window.wanakana.toHiragana(raw) : raw;
    const expected = conjugate(current, formIndex);
    const ok = normalized.replace(/\s/g, '') === expected;
    analytics?.track('answer_submit', {result: ok ? 'correct' : 'incorrect'});
    locked = true;
    if (ok) { correct++; streak++; } else { wrong++; streak = 0; }
    updateStats();
    answer.dataset.result = ok ? 'correct' : 'wrong';
    answer.disabled = true;
    $('submit').disabled = true;
    $('feedback').dataset.result = ok ? 'correct' : 'wrong';
    $('feedback-title').textContent = ok ? '✓ Correto! 正解です' : 'Resposta incorreta';
    $('feedback-seal').textContent = ok ? '◯' : '×';
    const romaji = window.wanakana ? ` (${window.wanakana.toRomaji(expected)})` : '';
    $('feedback-detail').textContent = `${current.word} → ${expected}${romaji}`;
    $('feedback').hidden = false;
    $('next').focus({ preventScroll: true });
  }
  function toggleHint() {
    $('hint-box').hidden = !$('hint-box').hidden;
    $('toggle-hint-btn').setAttribute('aria-expanded', String(!$('hint-box').hidden));
    if (!$('hint-box').hidden) analytics?.track('hint_open', {hint_type: 'rule'});
  }
  if (window.wanakana) window.wanakana.bind(answer, { IMEMode: 'toHiragana' });
  document.querySelectorAll('input[name="adjective-type"], input[name="adjective-focus"]').forEach(input => {
    input.addEventListener('change', () => {
      if (!document.querySelector('input[name="adjective-type"]:checked')) input.checked = true;
      nextQuestion();
    });
  });
  $('toggle-hint-class').addEventListener('change', event => { $('class-hint-badge').hidden = !event.target.checked; if (event.target.checked) analytics?.track('hint_open', {hint_type: 'class'}); });
  $('submit').addEventListener('click', check);
  $('skip').addEventListener('click', () => { if (!locked) analytics?.track('question_skip'); nextQuestion(); });
  $('next').addEventListener('click', nextQuestion);
  $('toggle-hint-btn').setAttribute('aria-controls', 'hint-box');
  $('toggle-hint-btn').addEventListener('click', toggleHint);
  $('reset').addEventListener('click', () => { correct = wrong = streak = drill = 0; previous = null; updateStats(); nextQuestion(); });
  $('toggle-guide-btn').addEventListener('click', () => {
    const guide = $('study-guide-drawer');
    guide.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    guide.classList.add('ring-2', 'ring-tertiary');
    window.setTimeout(() => guide.classList.remove('ring-2', 'ring-tertiary'), 1200);
  });
  const navigation = $('adjective-navigation');
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
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'h') { event.preventDefault(); toggleHint(); return; }
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'Enter' && event.target === answer) { event.preventDefault(); locked ? nextQuestion() : check(); }
    if (event.key === 'Escape') closeMenu();
    if (event.key === '?' && !event.target.closest('input, textarea, select')) { event.preventDefault(); help.showModal(); }
  });
  document.querySelectorAll('.material-symbols-outlined').forEach(icon => icon.setAttribute('aria-hidden', 'true'));
  updateStats();
  nextQuestion();
})();
