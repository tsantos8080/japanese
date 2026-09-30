(() => {
  const t = (text, params) => window.NihongoI18n?.text(text, params) ?? (typeof text === 'string' ? text.replace(/{{(\w+)}}/g, (_, key) => params?.[key] ?? '') : text);
  const ui = (element, render, attribute = 'textContent') => { if (window.NihongoI18n) window.NihongoI18n.bindText(element, render, attribute); else element[attribute] = render(); };
  const $ = id => document.getElementById(id);
  const input = $('input-resposta');
  let current, previous, locked = false, correct = 0, wrong = 0, streak = 0, drill = 0, deadline = 0, timer;
  const pick = values => values[Math.floor(Math.random()*values.length)];
  const mode = () => $('practice-mode').value;
  const selected = () => [...document.querySelectorAll('input[name="counter"]:checked')].map(el=>el.value);
  const analytics = window.NihongoAnalytics?.create('counters', () => ({mode: mode(), category: current?.counter.id}));
  function updateStats() {
    const total = correct+wrong;
    $('correct-count').textContent = correct; $('wrong-count').textContent = wrong;
    $('accuracy').textContent = total ? Math.round(correct/total*100) : '—';
    $('streak').textContent = streak; $('total-label').textContent = `Drill ${total}/25`;
    $('goal-percent').textContent = `${Math.min(100,Math.round(total/25*100))}%`;
    $('goal-fill').style.width = `${Math.min(100,total/25*100)}%`;
    ui($('active-count'), () => t("{{v0}} ativos", {v0: t(selected().length)}));
  }
  function hint() {
    const c = current.counter;
    if (['hon','hiki','hai'].includes(c.id)) {
      const endings = {hon:['ほん','ぽん','ぼん'],hiki:['ひき','ぴき','びき'],hai:['はい','ぱい','ばい']}[c.id];
      const suffix = endings.find(ending=>current.answer.endsWith(ending));
      return t("Observe o final {{v0}}: nesta quantidade, {{v1}} {{v2}}. Leitura: {{v3}}.", {v0: t(suffix), v1: t(c.hira), v2: t(suffix === c.hira ? t('mantém seu som') : t("muda para {{v0}}", {v0: t(suffix)})), v3: t(current.answer)});
    }
    return t("Contador {{v0}} ({{v1}}). Leitura de {{v2}}: {{v3}}.", {v0: t(c.kanji || c.hira), v1: t(c.meaning), v2: t(current.n), v3: t(current.answer)});
  }
  function setHint(visible, userInitiated = false) {
    if (visible && userInitiated && $('caixa-dica').hidden) analytics?.track('hint_open', {hint_type: 'rule'});
    $('toggle-rendaku').checked = visible; $('caixa-dica').hidden = !visible;
    $('btn-dica').setAttribute('aria-expanded',String(visible));
  }
  function nextQuestion() {
    const pool = counters.filter(c=>selected().includes(c.id));
    let counter = pick(pool), n = counter.min+Math.floor(Math.random()*(counter.max-counter.min+1));
    if (previous && pool.length===1 && n===previous.n && counter.id===previous.id) n = n===counter.max ? counter.min : n+1;
    current = {counter,n,answer:counter.reading(n)}; previous = {id:counter.id,n};
    locked = false; drill++;
    ui($('drill-label'), () => t("DRILL #{{v0}} · CONTADORES", {v0: t(drill)}));
    ui($('counter-description'), () => t("Contador: {{v0}} ({{v1}} · {{v2}})", {v0: t(counter.kanji || counter.hira), v1: t(counter.hira), v2: t(counter.meaning)}));
    $('quantity').textContent = n; $('counter-symbol').textContent = counter.kanji || counter.hira;
    $('expression').textContent = `${n}${counter.kanji || counter.hira}`;
    const noun = pick(counter.nouns);
    ui($('question'), () => t("Como se lê \"{{v0}} {{v1}}\" em japonês?", {v0: t(n), v1: t(noun[n===1?0:1])}));
    ui($('hint-text'), () => t(hint())); setHint($('toggle-rendaku').checked);
    input.value = ''; input.disabled = false; delete input.dataset.result;
    $('feedback-acerto').hidden = true; $('btn-verificar').disabled = false;
    const objects = $('objects'); objects.replaceChildren(); objects.hidden = counter.id!=='hon'||n>10;
    if (!objects.hidden) for(let i=1;i<=n;i++) {
      const item=document.createElement('div');item.className='flex flex-col items-center';
      const stick=document.createElement('div');stick.className='w-3.5 h-16 rounded-full bg-gradient-to-b from-[#2c344d] via-[#1f2430] to-[#b3392c] shadow-sm';
      const label=document.createElement('span');label.className='font-label-sm text-[10px] text-[#4b463a] mt-1';label.textContent=i;item.append(stick,label);objects.append(item);
    }
    const choices = $('choices'); choices.replaceChildren(); choices.hidden = mode()!=='choice'; input.hidden=mode()==='choice'; $('btn-verificar').hidden=mode()==='choice';
    $('kana-indicator').hidden = mode()==='choice';
    if (!choices.hidden) {
      const options = new Set([current.answer]);
      for(let i=counter.min;i<=counter.max&&options.size<4;i++) options.add(counter.reading(i));
      const shuffled=[...options];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
      shuffled.forEach((value,i)=>{const button=document.createElement('button');button.type='button';button.className='p-3 rounded bg-[#ded3be] text-[#1f2430]';button.textContent=`${i+1}. ${value}`;button.addEventListener('click',()=>check(value));choices.append(button);});
    }
    updateStats(); if(mode()!=='choice')input.focus({preventScroll:true});
  }
  function expired() { return mode()==='timed' && deadline && Date.now()>=deadline; }
  input.addEventListener('input', () => { if (input.value.trim()) analytics?.start(); });
  function check(choice) {
    if (locked || expired()) return;
    const raw = choice || input.value.trim().toLowerCase().replace(/\s/g,'');
    if(!raw)return;
    const normalized = window.wanakana ? window.wanakana.toHiragana(raw) : raw;
    const ok = normalized===current.answer;
    analytics?.track('answer_submit', {result: ok ? 'correct' : 'incorrect'});
    locked=true;if(ok){correct++;streak++;}else{wrong++;streak=0;}
    input.disabled=true;$('btn-verificar').disabled=true;
    $('choices').querySelectorAll('button').forEach(button=>button.disabled=true);
    input.dataset.result=ok?'correct':'wrong';
    $('feedback-acerto').dataset.result=ok?'correct':'wrong';
    ui($('feedback-title'), () => t(ok?t('Correto! 正解です'):t('Resposta incorreta')));
    $('feedback-status').textContent=ok?'正解':'確認';$('feedback-seal').textContent=ok?'◯':'×';
    const romaji=window.wanakana?window.wanakana.toRomaji(current.answer):'';
    $('feedback-answer').textContent=`${current.n}${current.counter.kanji||current.counter.hira} = ${current.answer}${romaji?` (${romaji})`:''}`;
    ui($('feedback-detail'), () => t(hint()));$('feedback-acerto').hidden=false;updateStats();$('next').focus({preventScroll:true});
  }
  function reset() {
    clearInterval(timer);correct=wrong=streak=drill=0;deadline=0;
    $('timer-label').hidden=mode()!=='timed';
    if(mode()==='timed') {
      deadline=Date.now()+60000;
      timer=window.setInterval(()=>{
        const seconds=Math.max(0,Math.ceil((deadline-Date.now())/1000));ui($('timer-label'), () => t("Tempo restante: {{v0}}s", {v0: t(seconds)}));
        if(!seconds){clearInterval(timer);locked=true;input.disabled=true;$('btn-verificar').disabled=true;$('choices').querySelectorAll('button').forEach(b=>b.disabled=true);ui($('timer-label'), () => t("Bloco encerrado: {{v0}} acertos, {{v1}} erros. Reinicie para jogar novamente.", {v0: t(correct), v1: t(wrong)}));}
      },250);
    }
    nextQuestion();
  }
  counters.filter(c=>!['hon','mai','hiki','satsu','hai','tsu'].includes(c.id)).forEach(c=>{
    const label=document.createElement('label');label.className='flex items-start gap-3 p-2.5 rounded-lg bg-surface-container-low/30 cursor-pointer';
    const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.name='counter';checkbox.value=c.id;checkbox.className='mt-1 w-4 h-4 accent-tertiary';
    const text=document.createElement('span');text.className='font-body-sm text-body-sm text-on-surface';ui(text, () => t(`${c.kanji||c.hira} · ${c.hira} (${c.romaji}) — ${t(c.meaning)}`));label.append(checkbox,text);$('extra-counters').append(label);
  });
  document.querySelectorAll('input[name="counter"]').forEach(el=>el.addEventListener('change',()=>{if(!selected().length)el.checked=true;if(!expired())nextQuestion();else updateStats();}));
  $('practice-mode').addEventListener('change',reset);
  $('reset').addEventListener('click',reset);
  $('btn-verificar').addEventListener('click',()=>check());
  $('next').addEventListener('click',()=>{if(!expired())nextQuestion();});
  $('skip').addEventListener('click',()=>{if(!expired()){if(!locked)analytics?.track('question_skip');nextQuestion();}});
  $('btn-dica').addEventListener('click',()=>setHint(!$('toggle-rendaku').checked, true));
  $('toggle-rendaku').addEventListener('change',()=>setHint($('toggle-rendaku').checked, true));
  $('btn-toggle-tabela').addEventListener('click',()=>$('secao-tabela').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}));
  counters.forEach(c=>{const section=document.createElement('section');const title=document.createElement('h3');ui(title, () => t(`${c.kanji||c.hira} — ${t(c.meaning)} (${c.min}–${c.max})`));section.append(title);for(let n=1;n<=Math.min(10,c.max);n++){const p=document.createElement('p');p.textContent=`${n}: ${c.reading(n)}`;section.append(p);}$('reference-content').append(section);});
  const reference=$('reference-dialog');$('all-reference').addEventListener('click',()=>reference.showModal());$('close-reference').addEventListener('click',()=>reference.close());
  const navigation = $('counter-navigation');
  function closeMenu() { navigation.removeAttribute('data-open'); $('menu-button').setAttribute('aria-expanded', 'false'); ui($('menu-button'), () => t($('menu-button').getAttribute('aria-expanded') === 'true' ? 'Fechar navegação' : 'Abrir navegação'), 'aria-label'); }
  $('menu-button').addEventListener('click', () => {
    const open = $('menu-button').getAttribute('aria-expanded') !== 'true';
    navigation.toggleAttribute('data-open', open);
    $('menu-button').setAttribute('aria-expanded', String(open)); ui($('menu-button'), () => t($('menu-button').getAttribute('aria-expanded') === 'true' ? 'Fechar navegação' : 'Abrir navegação'), 'aria-label');
  });
  document.addEventListener('click', event => { if (!navigation.contains(event.target) && !$('menu-button').contains(event.target)) closeMenu(); });
  const help = $('keyboard-help');
  $('help-button').addEventListener('click', () => help.showModal());
  $('close-help').addEventListener('click', () => help.close());
  document.addEventListener('keydown', event => {
    if (help.open || reference.open || event.repeat || event.isComposing || event.defaultPrevented) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'h') { event.preventDefault(); setHint(!$('toggle-rendaku').checked, true); return; }
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (mode() === 'choice' && /^[1-4]$/.test(event.key) && !expired()) { const button = $('choices').children[Number(event.key)-1]; if(button) { event.preventDefault(); button.click(); } }
    if (event.key === 'Enter' && event.target === input) { event.preventDefault(); if (!expired()) locked ? nextQuestion() : check(); }
    if (event.key === 'Escape') closeMenu();
    if (event.key === '?' && !event.target.closest('input, textarea, select')) { event.preventDefault(); help.showModal(); }
  });
  document.querySelectorAll('.material-symbols-outlined').forEach(icon => icon.setAttribute('aria-hidden', 'true'));
  reset();
})();
