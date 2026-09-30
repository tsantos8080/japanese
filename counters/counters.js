(() => {
  const $ = id => document.getElementById(id);
  const input = $('input-resposta');
  let current, previous, locked = false, correct = 0, wrong = 0, streak = 0, drill = 0, deadline = 0, timer;
  const pick = values => values[Math.floor(Math.random()*values.length)];
  const mode = () => $('practice-mode').value;
  const selected = () => [...document.querySelectorAll('input[name="counter"]:checked')].map(el=>el.value);
  function updateStats() {
    const total = correct+wrong;
    $('correct-count').textContent = correct; $('wrong-count').textContent = wrong;
    $('accuracy').textContent = total ? Math.round(correct/total*100) : '—';
    $('streak').textContent = streak; $('total-label').textContent = `Drill ${total}/25`;
    $('goal-percent').textContent = `${Math.min(100,Math.round(total/25*100))}%`;
    $('goal-fill').style.width = `${Math.min(100,total/25*100)}%`;
    $('active-count').textContent = `${selected().length} ativos`;
  }
  function hint() {
    const c = current.counter;
    if (['hon','hiki','hai'].includes(c.id)) {
      const endings = {hon:['ほん','ぽん','ぼん'],hiki:['ひき','ぴき','びき'],hai:['はい','ぱい','ばい']}[c.id];
      const suffix = endings.find(ending=>current.answer.endsWith(ending));
      return `Observe o final ${suffix}: nesta quantidade, ${c.hira} ${suffix === c.hira ? 'mantém seu som' : `muda para ${suffix}`}. Leitura: ${current.answer}.`;
    }
    return `Contador ${c.kanji || c.hira} (${c.meaning}). Leitura de ${current.n}: ${current.answer}.`;
  }
  function setHint(visible) {
    $('toggle-rendaku').checked = visible; $('caixa-dica').hidden = !visible;
    $('btn-dica').setAttribute('aria-expanded',String(visible));
  }
  function nextQuestion() {
    const pool = counters.filter(c=>selected().includes(c.id));
    let counter = pick(pool), n = counter.min+Math.floor(Math.random()*(counter.max-counter.min+1));
    if (previous && pool.length===1 && n===previous.n && counter.id===previous.id) n = n===counter.max ? counter.min : n+1;
    current = {counter,n,answer:counter.reading(n)}; previous = {id:counter.id,n};
    locked = false; drill++;
    $('drill-label').textContent = `DRILL #${drill} · CONTADORES`;
    $('counter-description').textContent = `Contador: ${counter.kanji || counter.hira} (${counter.hira} · ${counter.meaning})`;
    $('quantity').textContent = n; $('counter-symbol').textContent = counter.kanji || counter.hira;
    $('expression').textContent = `${n}${counter.kanji || counter.hira}`;
    const noun = pick(counter.nouns);
    $('question').textContent = `Como se lê "${n} ${noun[n===1?0:1]}" em japonês?`;
    $('hint-text').textContent = hint(); setHint($('toggle-rendaku').checked);
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
  function check(choice) {
    if (locked || expired()) return;
    const raw = choice || input.value.trim().toLowerCase().replace(/\s/g,'');
    if(!raw)return;
    const normalized = window.wanakana ? window.wanakana.toHiragana(raw) : raw;
    const ok = normalized===current.answer;
    locked=true;if(ok){correct++;streak++;}else{wrong++;streak=0;}
    input.disabled=true;$('btn-verificar').disabled=true;
    $('choices').querySelectorAll('button').forEach(button=>button.disabled=true);
    input.dataset.result=ok?'correct':'wrong';
    $('feedback-acerto').dataset.result=ok?'correct':'wrong';
    $('feedback-title').textContent=ok?'Correto! 正解です':'Resposta incorreta';
    $('feedback-status').textContent=ok?'正解':'確認';$('feedback-seal').textContent=ok?'◯':'×';
    const romaji=window.wanakana?window.wanakana.toRomaji(current.answer):'';
    $('feedback-answer').textContent=`${current.n}${current.counter.kanji||current.counter.hira} = ${current.answer}${romaji?` (${romaji})`:''}`;
    $('feedback-detail').textContent=hint();$('feedback-acerto').hidden=false;updateStats();$('next').focus({preventScroll:true});
  }
  function reset() {
    clearInterval(timer);correct=wrong=streak=drill=0;deadline=0;
    $('timer-label').hidden=mode()!=='timed';
    if(mode()==='timed') {
      deadline=Date.now()+60000;
      timer=window.setInterval(()=>{
        const seconds=Math.max(0,Math.ceil((deadline-Date.now())/1000));$('timer-label').textContent=`Tempo restante: ${seconds}s`;
        if(!seconds){clearInterval(timer);locked=true;input.disabled=true;$('btn-verificar').disabled=true;$('choices').querySelectorAll('button').forEach(b=>b.disabled=true);$('timer-label').textContent=`Bloco encerrado: ${correct} acertos, ${wrong} erros. Reinicie para jogar novamente.`;}
      },250);
    }
    nextQuestion();
  }
  counters.filter(c=>!['hon','mai','hiki','satsu','hai','tsu'].includes(c.id)).forEach(c=>{
    const label=document.createElement('label');label.className='flex items-start gap-3 p-2.5 rounded-lg bg-surface-container-low/30 cursor-pointer';
    const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.name='counter';checkbox.value=c.id;checkbox.className='mt-1 w-4 h-4 accent-tertiary';
    const text=document.createElement('span');text.className='font-body-sm text-body-sm text-on-surface';text.textContent=`${c.kanji||c.hira} · ${c.hira} (${c.romaji}) — ${c.meaning}`;label.append(checkbox,text);$('extra-counters').append(label);
  });
  document.querySelectorAll('input[name="counter"]').forEach(el=>el.addEventListener('change',()=>{if(!selected().length)el.checked=true;if(!expired())nextQuestion();else updateStats();}));
  $('practice-mode').addEventListener('change',reset);
  $('reset').addEventListener('click',reset);
  $('btn-verificar').addEventListener('click',()=>check());
  $('next').addEventListener('click',()=>{if(!expired())nextQuestion();});
  $('skip').addEventListener('click',()=>{if(!expired())nextQuestion();});
  $('btn-dica').addEventListener('click',()=>setHint(!$('toggle-rendaku').checked));
  $('toggle-rendaku').addEventListener('change',()=>setHint($('toggle-rendaku').checked));
  $('btn-toggle-tabela').addEventListener('click',()=>$('secao-tabela').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}));
  counters.forEach(c=>{const section=document.createElement('section');const title=document.createElement('h3');title.textContent=`${c.kanji||c.hira} — ${c.meaning} (${c.min}–${c.max})`;section.append(title);for(let n=1;n<=Math.min(10,c.max);n++){const p=document.createElement('p');p.textContent=`${n}: ${c.reading(n)}`;section.append(p);}$('reference-content').append(section);});
  const reference=$('reference-dialog');$('all-reference').addEventListener('click',()=>reference.showModal());$('close-reference').addEventListener('click',()=>reference.close());
  const navigation = $('counter-navigation');
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
    if (help.open || reference.open || event.repeat || event.isComposing || event.defaultPrevented) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'h') { event.preventDefault(); setHint(!$('toggle-rendaku').checked); return; }
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (mode() === 'choice' && /^[1-4]$/.test(event.key) && !expired()) { const button = $('choices').children[Number(event.key)-1]; if(button) { event.preventDefault(); button.click(); } }
    if (event.key === 'Enter' && event.target === input) { event.preventDefault(); if (!expired()) locked ? nextQuestion() : check(); }
    if (event.key === 'Escape') closeMenu();
    if (event.key === '?' && !event.target.closest('input, textarea, select')) { event.preventDefault(); help.showModal(); }
  });
  document.querySelectorAll('.material-symbols-outlined').forEach(icon => icon.setAttribute('aria-hidden', 'true'));
  reset();
})();
