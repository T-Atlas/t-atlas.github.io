const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync('assets/js/site-theme.js', 'utf8');
function environment(saved, systemDark, storageBlocked = false) {
  const handlers = {}, listeners = {}, data = {}, style = {};
  const media = {matches: systemDark, addEventListener: (_, cb) => {handlers.system = cb;}};
  const storage = {
    getItem: () => {if (storageBlocked) throw Error('blocked'); return saved;},
    setItem: (_, value) => {if (storageBlocked) throw Error('blocked'); saved = value;},
    removeItem: () => {if (storageBlocked) throw Error('blocked'); saved = null;}
  };
  const document = {documentElement: {dataset: data, style, removeAttribute: () => delete data.theme},
    addEventListener: (name, cb) => (listeners[name] ??= []).push(cb),
    removeEventListener: (name, cb) => listeners[name] = listeners[name].filter(x => x !== cb),
    dispatchEvent: event => (listeners[event.type] || []).forEach(cb => cb(event))};
  const window = {matchMedia: () => media, addEventListener: (name, cb) => {handlers[name] = cb;}};
  vm.runInNewContext(code, {window, document, localStorage: storage, CustomEvent: class {constructor(type, options) {this.type = type; this.detail = options.detail;}}});
  return {api: window.SiteTheme, media, handlers, storage};
}
const auto = environment(null, true);
assert.equal(auto.api.getPreference(), 'system');
assert.equal(auto.api.get(), 'dark');
const seen = [];
const off = auto.api.subscribe((theme, preference) => seen.push([theme, preference]));
auto.api.set('light'); auto.handlers.system(); assert.equal(auto.api.get(), 'light');
auto.api.set('system'); assert.equal(auto.api.get(), 'dark');
auto.media.matches = false; auto.handlers.system(); assert.equal(auto.api.get(), 'light');
off(); auto.api.toggle();
assert.deepEqual(seen, [['dark','system'], ['light','light'], ['dark','system'], ['light','system']]);
assert.equal(environment('dark', false).api.getPreference(), 'dark');
assert.equal(environment('unexpected', false).api.getPreference(), 'system');
auto.storage.setItem('theme', 'light'); auto.handlers.storage({key:'theme'}); assert.equal(auto.api.get(), 'light');
auto.storage.removeItem('theme'); auto.media.matches = true; auto.handlers.storage({key:null}); assert.equal(auto.api.getPreference(), 'system');
const blocked = environment(null, true, true);
blocked.api.set('light'); blocked.handlers.system(); assert.equal(blocked.api.get(), 'light');
blocked.api.set('system'); assert.equal(blocked.api.get(), 'dark');
console.log('Theme tests passed: three preferences, subscriptions, system/storage changes, blocked storage.');
