const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = vm.createContext({window: {}});
for (const file of ['vendor/i18next-23.16.8.min.js', 'locales/pt-BR.js', 'locales/en.js', 'locales/modules.pt-BR.js', 'locales/modules.en.js']) vm.runInContext(read(file), context);
const {en, 'pt-BR': pt} = context.window.NihongoLocales;
assert.deepEqual(Object.keys(en).sort(), Object.keys(pt).sort());
for (const [key, value] of Object.entries(en)) {
  const tokens = text => [...text.matchAll(/{{(\w+)}}/g)].map(match => match[1]).sort();
  assert.deepEqual(tokens(value), tokens(pt[key]), `Interpolation: ${key}`);
}
const engine = context.i18next.createInstance();
engine.init({lng: 'en', initImmediate: false, keySeparator: false, nsSeparator: false, interpolation: {escapeValue: false}, resources: {en: {translation: en}}});
assert.equal(engine.t('Dica gramatical:'), 'Grammar hint:');
assert.equal(engine.t('Dia {{v0}} do mês', {v0: 12}), 'Day 12 of the month');
for (const module of ['adjectives', 'te-form', 'counters', 'calendar', 'speed-reader', 'kana']) {
  const html = read(`${module}/index.html`);
  assert.equal([...html.matchAll(/id="language-select"/g)].length, 1, module);
  for (const match of html.matchAll(/data-i18n(?:-(?:aria-label|content|placeholder|title|alt))?="([^"]*)"/g)) {
    const key = match[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'");
    assert(key in pt && key in en, `${module}: missing ${key}`);
  }
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    if (!/^(?:https?:|data:|mailto:)/.test(match[1])) assert(fs.existsSync(path.resolve(root, module, match[1])), `${module}: ${match[1]}`);
  }
  assert(html.indexOf('../i18n.js') < html.indexOf('../analytics.js'), module);
}
// Verify dynamic bindings update in place and replace stale static hooks.
const attrs = {'data-i18n': 'old'};
const node = {textContent: '', removeAttribute: key => delete attrs[key], setAttribute: (key, value) => {attrs[key] = value;}};
context.window.i18next = context.i18next;
context.window.navigator = {languages: ['pt-BR']};
context.window.localStorage = {getItem() {}, setItem() {}};
context.document = {documentElement: {}, getElementById() {return null;}, querySelectorAll(selector) {return selector === '[data-i18n-dynamic]' && 'data-i18n-dynamic' in attrs ? [node] : [];}, dispatchEvent() {}};
context.CustomEvent = function() {};
vm.runInContext(read('i18n.js'), context);
const api = context.window.NihongoI18n;
api.bindText(node, () => api.text('Dia {{v0}} do mês', {v0: 12}));
assert.equal(node.textContent, 'Dia 12 do mês');
assert(!('data-i18n' in attrs));
api.setLanguage('en');
assert.equal(node.textContent, 'Day 12 of the month');
api.setLanguage('pt-BR');
assert.equal(node.textContent, 'Dia 12 do mês');
console.log('Module i18n: resource parity, interpolation, page hooks, local assets and dynamic bindings passed.');
