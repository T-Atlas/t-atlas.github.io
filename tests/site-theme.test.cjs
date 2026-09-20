const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync('assets/js/site-theme.js','utf8');
function environment(saved, systemDark, storageBlocked = false) {
  const handlers = {}, listeners = {}, data = {}, style = {};
  const media = {matches:systemDark,addEventListener:(name,cb)=>{handlers.system=cb;}};
  const storage = {getItem:()=>{if(storageBlocked)throw Error('blocked');return saved;},setItem:(_,v)=>{saved=v;},removeItem:()=>{saved=null;}};
  const document = {documentElement:{dataset:data,style,removeAttribute:()=>delete data.theme},
    addEventListener:(name,cb)=>(listeners[name]??=[]).push(cb),
    removeEventListener:(name,cb)=>listeners[name]=listeners[name].filter(x=>x!==cb),
    dispatchEvent:event=>(listeners[event.type]||[]).forEach(cb=>cb(event))};
  const window = {matchMedia:()=>media,addEventListener:(name,cb)=>{handlers[name]=cb;}};
  vm.runInNewContext(code,{window,document,localStorage:storage,CustomEvent:class {constructor(type,options){this.type=type;this.detail=options.detail;}}});
  return {api:window.SiteTheme,media,handlers};
}
const auto=environment(null,true);assert.equal(auto.api.get(),'dark');
const seen=[];const off=auto.api.subscribe(theme=>seen.push(theme));
auto.api.set('light');auto.media.matches=true;auto.handlers.system();assert.equal(auto.api.get(),'light');
auto.api.set('system');assert.equal(auto.api.get(),'dark');
auto.media.matches=false;auto.handlers.system();assert.equal(auto.api.get(),'light');
off();auto.api.toggle();assert.deepEqual(seen,['dark','light','dark','light']);
assert.equal(environment('dark',false).api.get(),'dark');
const blocked=environment(null,true,true);assert.equal(blocked.api.get(),'dark');blocked.api.toggle();assert.equal(blocked.api.get(),'light');
console.log('Theme tests passed: stored preference, system changes, subscribers, blocked storage.');
