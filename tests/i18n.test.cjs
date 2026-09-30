const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index.html');

function setup({saved, languages = ['pt-BR'], blocked = false, missingKey, library = true} = {}) {
  const nodes = [...html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)].map(match => {
    const attrs = Object.fromEntries([...match[2].matchAll(/([\w-]+)="([^"]*)"/g)].map(attr => [attr[1], attr[2]]));
    const events = {};
    return {
      tag: match[1], attrs, hidden: /\bhidden(?:\s|$)/.test(match[2]), value: '', textContent: '',
      dataset: {i18n: attrs['data-i18n'], open: attrs['data-open']},
      getAttribute: key => attrs[key], setAttribute: (key, value) => { attrs[key] = value; },
      removeAttribute: key => { delete attrs[key]; },
      toggleAttribute(key, on) { if (on) attrs[key] = ''; else delete attrs[key]; },
      addEventListener: (key, callback) => { events[key] = callback; },
      fire(key) { events[key]({target: this}); },
      contains: () => false, focus() {},
      querySelector: () => ({addEventListener() {}}),
      closest: () => null, showModal() {}, close() {}
    };
  });
  const events = {};
  const document = {
    documentElement: {lang: 'pt-BR'},
    getElementById: id => nodes.find(node => node.attrs.id === id),
    querySelector: selector => selector === '.menu-button' ? nodes.find(node => node.attrs.class?.includes('menu-button')) : null,
    querySelectorAll: selector => {
      if (selector.startsWith('[data-')) return nodes.filter(node => selector.slice(1, -1) in node.attrs);
      if (selector === 'dialog') return nodes.filter(node => node.tag === 'dialog');
      if (selector === '.material-symbols-outlined') return nodes.filter(node => node.attrs.class?.includes('material-symbols-outlined'));
      return [];
    },
    addEventListener: (key, callback) => { events[key] = callback; },
    dispatchEvent: event => events[event.type]?.(event)
  };
  const window = {
    navigator: {languages}, location: {hash: ''}, addEventListener() {},
    localStorage: {
      getItem() { if (blocked) throw Error('Blocked'); return saved; },
      setItem(key, value) { if (blocked) throw Error('Blocked'); saved = value; }
    }
  };
  const context = vm.createContext({window, document, CustomEvent: function(type, options) { this.type = type; this.detail = options.detail; }});
  for (const file of ['vendor/i18next-23.16.8.min.js', 'locales/pt-BR.js', 'locales/en.js']) vm.runInContext(read(file), context);
  if (library) window.i18next = context.i18next;
  if (missingKey) delete window.NihongoLocales.en[missingKey];
  vm.runInContext(read('i18n.js'), context);
  vm.runInContext(read('home.js'), context);
  return {window, document, nodes, saved: () => saved};
}

const home = setup();
const {window, document} = home;
assert.equal(document.documentElement.lang, 'pt-BR');
assert.equal(document.getElementById('language-select').hidden, false);
assert.equal(home.nodes.find(node => node.tag === 'title').textContent, 'Nihongo Drills — Pratique Japonês');
const pt = window.NihongoLocales['pt-BR'];
const en = window.NihongoLocales.en;
assert.deepEqual(Object.keys(pt).sort(), Object.keys(en).sort());
for (const node of home.nodes) for (const attr of ['data-i18n', 'data-i18n-aria-label', 'data-i18n-content']) {
  if (node.attrs[attr]) assert(node.attrs[attr] in pt && node.attrs[attr] in en, node.attrs[attr]);
}
const selector = document.getElementById('language-select');
selector.value = 'en';
selector.fire('change');
assert.equal(document.documentElement.lang, 'en');
assert.equal(home.saved(), 'en');
assert.equal(home.nodes.find(node => node.tag === 'title').textContent, 'Nihongo Drills — Practice Japanese');
assert.equal(home.nodes.find(node => node.attrs.name === 'description').attrs.content, en['meta.description']);
assert.equal(document.getElementById('modules').textContent, en['modules.title']);
const menu = document.querySelector('.menu-button');
menu.fire('click');
assert.equal(menu.attrs['aria-label'], 'Close navigation');
window.NihongoI18n.setLanguage('pt-BR');
assert.equal(menu.attrs['aria-label'], 'Fechar navegação');
menu.fire('click');
assert.equal(menu.attrs['aria-label'], 'Abrir navegação');
assert.equal(document.getElementById('help-title').textContent, 'Atalhos de teclado');
window.NihongoI18n.setLanguage('fr');
assert.equal(document.documentElement.lang, 'pt-BR');
assert.equal(setup({saved: 'en', languages: ['pt-BR']}).document.documentElement.lang, 'en');
assert.equal(setup({languages: ['en-US']}).document.documentElement.lang, 'en');
assert.equal(setup({languages: ['pt-PT']}).document.documentElement.lang, 'pt-BR');
assert.equal(setup({saved: 'fr', languages: ['fr-FR']}).document.documentElement.lang, 'pt-BR');
const blocked = setup({blocked: true, languages: ['en-GB']});
blocked.window.NihongoI18n.setLanguage('pt-BR');
assert.equal(blocked.document.documentElement.lang, 'pt-BR');
const fallback = setup({languages: ['en'], missingKey: 'hero.welcome'});
assert.equal(fallback.window.NihongoI18n.t('hero.welcome'), pt['hero.welcome']);
assert.equal(setup({library: false}).document.getElementById('language-select').hidden, true);
assert.equal(home.nodes.filter(node => node.attrs.href === './kana/').length, 2);
console.log('Home i18n: locale coverage, switching, persistence, detection, fallback, metadata, menu labels and blocked storage passed.');
