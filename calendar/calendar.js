(() => {
  const $ = id => document.getElementById(id);
  const exceptions = [1,2,3,4,5,6,7,8,9,10,14,20,24];
  const input = $('drill-input');
  let currentDay, locked = false, correct = 0, wrong = 0, streak = 0, drill = 0;
  const seen = new Set();
  const analytics = window.NihongoAnalytics?.create('calendar', () => ({mode: 'free', category: exceptions.includes(currentDay) ? 'irregular' : 'regular'}));
  function pool() {
    const ranges = [...document.querySelectorAll('input[name="day-range"]:checked')].map(el => el.value.split('-').map(Number));
    return Array.from({length:31}, (_,i) => i+1).filter(day => ranges.some(([a,b]) => day >= a && day <= b) && (!$('day-exceptions').checked || exceptions.includes(day)));
  }
  function updateStats() {
    const total = correct + wrong;
    $('stat-hits').textContent = correct;
    $('stat-misses').textContent = wrong;
    $('stat-total').textContent = `/ ${total}`;
    $('accuracy').textContent = total ? `${Math.round(correct / total * 100)}%` : '—';
    $('streak').textContent = streak;
    const eligible = pool();
    const count = eligible.filter(day => seen.has(day)).length;
    $('coverage').textContent = `${count} / ${eligible.length} dias`;
    $('coverage-fill').style.width = `${count / eligible.length * 100}%`;
  }
  function hint() {
    if (currentDay === 4) return 'よっか tem っ pequeno e som curto. Não confunda com ようか (dia 8), que tem vogal longa.';
    if (currentDay === 8) return 'ようか tem vogal longa. Não confunda com よっか (dia 4), que tem っ pequeno.';
    if (currentDay === 14 || currentDay === 24) return `Combine ${currentDay === 14 ? 'じゅう' : 'にじゅう'} com よっか.`;
    if (currentDay === 20) return 'O dia 20 usa a leitura especial はつか, sem にち.';
    if (exceptions.includes(currentDay)) return `Este dia tem leitura especial: ${daysData[currentDay].hiragana} (${daysData[currentDay].romaji[0]}).`;
    return `Use o número + にち. Leitura: ${daysData[currentDay].hiragana}. Atenção às leituras しち e く nos dias 17, 19, 27 e 29.`;
  }
  function nextQuestion() {
    const candidates = pool();
    const choices = candidates.filter(day => day !== currentDay);
    currentDay = choices[Math.floor(Math.random() * choices.length)] || candidates[0];
    locked = false; drill++;
    $('target-day').textContent = currentDay;
    $('day-caption').textContent = `Dia ${currentDay} do mês`;
    $('day-question').textContent = `Qual é a leitura japonesa correta do dia ${currentDay}?`;
    $('drill-label').textContent = `DRILL #${drill} · DIAS DO MÊS`;
    $('reading-kind').textContent = exceptions.includes(currentDay) ? 'Leitura Irregular Crítica' : 'Número + にち';
    $('day-note').textContent = exceptions.includes(currentDay) ? 'Atenção à leitura especial deste dia' : 'Regra geral: número + にち';
    $('hint-content').textContent = hint();
    $('hint-box').hidden = true;
    $('btn-show-hint').setAttribute('aria-expanded', 'false');
    $('feedback-success').hidden = true;
    input.value = ''; input.disabled = false; delete input.dataset.result;
    $('btn-verify').disabled = false;
    document.querySelectorAll('[data-day], [data-reference-day]').forEach(cell => {
      const selected = Number(cell.dataset.day || cell.dataset.referenceDay) === currentDay;
      cell.toggleAttribute('data-current', selected);
    });
    updateStats();
    input.focus({preventScroll:true});
  }
  input.addEventListener('input', () => { if (input.value.trim()) analytics?.start(); });
  function check() {
    if (locked) return;
    const raw = input.value.trim().toLowerCase().replace(/\s/g, '');
    if (!raw) { input.focus(); return; }
    const data = daysData[currentDay];
    const kana = window.wanakana ? window.wanakana.toHiragana(raw) : raw;
    const ok = kana === data.hiragana || data.romaji.includes(raw);
    analytics?.track('answer_submit', {result: ok ? 'correct' : 'incorrect'});
    locked = true; seen.add(currentDay);
    if (ok) { correct++; streak++; } else { wrong++; streak = 0; }
    updateStats();
    input.disabled = true; $('btn-verify').disabled = true;
    input.dataset.result = ok ? 'correct' : 'wrong';
    $('feedback-success').dataset.result = ok ? 'correct' : 'wrong';
    $('feedback-title').textContent = ok ? '✓ Correto! 正解です' : 'Resposta incorreta';
    $('feedback-seal').textContent = ok ? '◯' : '×';
    $('feedback-detail').textContent = `${currentDay}日 = ${data.hiragana} (${data.romaji[0]})`;
    $('feedback-success').hidden = false;
    $('btn-next-day').focus({preventScroll:true});
  }
  function toggleHint() {
    $('hint-box').hidden = !$('hint-box').hidden;
    $('btn-show-hint').setAttribute('aria-expanded', String(!$('hint-box').hidden));
    if (!$('hint-box').hidden) analytics?.track('hint_open', {hint_type: 'rule'});
  }
  // Keep raw romaji until validation so all existing long-vowel variants remain accepted.
  document.querySelectorAll('input[name="day-range"]').forEach(el => el.addEventListener('change', () => {
    if (!document.querySelector('input[name="day-range"]:checked')) el.checked = true;
    nextQuestion();
  }));
  $('day-exceptions').addEventListener('change', nextQuestion);
  $('btn-verify').addEventListener('click', check);
  $('btn-next-day').addEventListener('click', nextQuestion);
  $('btn-skip').addEventListener('click', () => { if (!locked) analytics?.track('question_skip'); nextQuestion(); });
  $('btn-show-hint').addEventListener('click', toggleHint);
  $('btn-reset-session').addEventListener('click', () => { correct = wrong = streak = drill = 0; seen.clear(); nextQuestion(); });
  const table = $('full-table');
  Object.entries(daysData).forEach(([day,data]) => {
    const row = document.createElement('p');
    row.textContent = `${day}日 — ${data.hiragana} (${data.romaji[0]})`;
    $('table-content').append(row);
  });
  $('btn-toggle-tabela').addEventListener('click', () => table.showModal());
  $('close-table').addEventListener('click', () => table.close());
  const navigation = $('calendar-navigation');
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
    if (help.open || table.open || event.repeat || event.isComposing || event.defaultPrevented) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'h') { event.preventDefault(); toggleHint(); return; }
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'Enter' && event.target === input) { event.preventDefault(); locked ? nextQuestion() : check(); }
    if (event.key === 'Escape') closeMenu();
    if (event.key === '?' && !event.target.closest('input, textarea, select')) { event.preventDefault(); help.showModal(); }
  });
  document.querySelectorAll('.material-symbols-outlined').forEach(icon => icon.setAttribute('aria-hidden', 'true'));
  nextQuestion();
})();
