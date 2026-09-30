const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const code = fs.readFileSync(path.join(__dirname, '../analytics.js'), 'utf8');
const calls = [];
const window = {gtag: (...args) => calls.push(args)};
vm.runInNewContext(code, {window});
let mode = 'free';
const analytics = window.NihongoAnalytics.create('counters', () => ({mode, category: 'hon'}));
assert.equal(calls.length, 0, 'Page loading must not count as practice');
analytics.start();
analytics.start();
analytics.track('answer_submit', {result: 'correct', answer: 'private input', accuracy: NaN});
assert.deepEqual(calls.map(call => call[1]), ['practice_start', 'answer_submit']);
assert.equal(calls[1][2].result, 'correct');
assert.equal(calls[1][2].module, 'counters');
assert.equal(calls[1][2].answer, undefined);
assert.equal(calls[1][2].accuracy, undefined);
mode = 'choice';
analytics.track('question_skip');
assert.equal(calls.at(-1)[2].mode, 'choice', 'Context must reflect the current mode');
analytics.track('arbitrary_event');
assert.equal(calls.length, 3);

const reader = window.NihongoAnalytics.create('speed-reader');
reader.track('hint_open', {hint_type: 'romaji'});
assert.deepEqual(calls.slice(-2).map(call => call[1]), ['practice_start', 'hint_open']);
reader.track('phrase_complete', {duration_seconds: 20, character_count: 12, error_count: 2, accuracy: 90});
assert.equal(calls.at(-1)[2].character_count, 12);
assert.equal(calls.filter(call => call[1] === 'practice_start').length, 2);

for (const gtag of [undefined, () => { throw Error('Blocked'); }]) {
  window.gtag = gtag;
  assert.doesNotThrow(() => {
    const drill = window.NihongoAnalytics.create('calendar');
    drill.start();
    drill.track('answer_submit', {result: 'incorrect'});
  });
}
console.log('Analytics: start deduplication, current context, parameter allowlist and unavailable/blocked tag passed.');
