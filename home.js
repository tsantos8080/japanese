(() => {
  const navigation = document.getElementById('home-navigation');
  const menu = document.querySelector('.menu-button');
  const updateMenuLabel = () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    const key = open ? 'nav.close' : 'nav.open';
    menu.setAttribute('data-i18n-aria-label', key);
    menu.setAttribute('aria-label', window.NihongoI18n?.t(key) || (open ? 'Fechar navegação' : 'Abrir navegação'));
  };
  document.addEventListener('nihongo:languagechange', updateMenuLabel);
  const closeMenu = () => {
    navigation.removeAttribute('data-open');
    menu.setAttribute('aria-expanded', 'false');
    updateMenuLabel();
  };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    navigation.toggleAttribute('data-open', open);
    menu.setAttribute('aria-expanded', String(open));
    updateMenuLabel();
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', event => {
    if (!navigation.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });
  document.querySelectorAll('[data-open]').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      document.getElementById(trigger.dataset.open).showModal();
    });
  });
  if (window.location.hash === '#kana-reference') window.location.replace('./kana/');
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
  });
  const modules = ['./adjectives/', './te-form/', './counters/', './calendar/', './speed-reader/'];
  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (document.querySelector('dialog[open]')) return;
    if (event.key === 'Escape') { closeMenu(); menu.focus(); }
    if (event.key === '?') {
      event.preventDefault();
      document.getElementById('help-reference').showModal();
    }
    if (/^[1-5]$/.test(event.key)) {
      event.preventDefault();
      window.location.assign(modules[Number(event.key) - 1]);
    }
  });
  document.querySelectorAll('.material-symbols-outlined').forEach(icon => icon.setAttribute('aria-hidden', 'true'));
})();
