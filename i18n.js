(() => {
  if (!window.i18next || !window.NihongoLocales) return;
  const storageKey = 'nihongo-drills-language';
  const supported = ['pt-BR', 'en'];
  const engine = window.i18next.createInstance();
  const selector = document.getElementById('language-select');
  let saved;
  try { saved = window.localStorage.getItem(storageKey); } catch { /* Storage can be disabled. */ }
  const browserLanguage = (window.navigator.languages || [window.navigator.language])
    .map(language => /^en(?:-|$)/i.test(language || '') ? 'en' : /^pt(?:-|$)/i.test(language || '') ? 'pt-BR' : null)
    .find(Boolean);

  engine.init({
    lng: supported.includes(saved) ? saved : browserLanguage || 'pt-BR',
    supportedLngs: supported,
    fallbackLng: 'pt-BR',
    load: 'currentOnly',
    initImmediate: false,
    keySeparator: false,
    resources: Object.fromEntries(supported.map(language => [language, {translation: window.NihongoLocales[language]}]))
  });

  function render() {
    document.documentElement.lang = engine.language;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = engine.t(element.dataset.i18n);
    });
    for (const attribute of ['aria-label', 'content']) {
      document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
        element.setAttribute(attribute, engine.t(element.getAttribute(`data-i18n-${attribute}`)));
      });
    }
    if (selector) selector.value = engine.language;
    document.dispatchEvent(new CustomEvent('nihongo:languagechange', {detail: {language: engine.language}}));
  }

  window.NihongoI18n = {
    t: key => engine.t(key),
    setLanguage(language) {
      if (!supported.includes(language)) return;
      engine.changeLanguage(language);
      try { window.localStorage.setItem(storageKey, language); } catch { /* Switching still works without persistence. */ }
      render();
    }
  };
  render();
  if (selector) {
    selector.hidden = false;
    selector.addEventListener('change', () => window.NihongoI18n.setLanguage(selector.value));
  }
})();
