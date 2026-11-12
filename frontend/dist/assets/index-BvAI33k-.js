const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HomeView-p2vs1VZZ.js","assets/TagList-jvGzSmiV.js","assets/StateBlock-Cbi4YDNN.js","assets/HomeView-kBiMTS6h.css","assets/PostsView-c_ogPb-R.js","assets/PostsView-BP7WVy5F.css","assets/PostView-D2H0wV_Z.js","assets/PostView-BULfeOgS.css","assets/AboutView-C-OPXN8_.js","assets/AboutView-BEwsnVbJ.css","assets/AdminLoginView-D_GmHV3J.js","assets/AdminLoginView-CP5cUlzS.css","assets/AdminPostsView-2XwC5FfJ.js","assets/AdminLayout-DHBAnwm9.js","assets/AdminLayout-HvKaJJo9.css","assets/AdminPostsView-CJBeCIBe.css","assets/AdminEditorView-lKc05Zbq.js","assets/AdminEditorView-CrqXaYAa.css","assets/AdminSettingsView-CVyZZOcZ.js","assets/AdminSettingsView-Cnhsyjen.css","assets/NotFoundView-ByGOleCG.js","assets/NotFoundView-Cg7IkIIV.css"])))=>i.map(i=>d[i]);
true              &&(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
}());

/**
* vue v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/var e,t;let n,l,r,i,o,s,a,f,d,p;function h$1(e){let t=Object.create(null);for(let n of e.split(","))t[n]=1;return e=>e in t}let g$1={},v$1=[],m$1=()=>{},_$1=()=>false,y$1=e=>111===e.charCodeAt(0)&&110===e.charCodeAt(1)&&(e.charCodeAt(2)>122||97>e.charCodeAt(2)),b$1=e=>e.startsWith("onUpdate:"),S$1=Object.assign,C$1=(e,t)=>{let n=e.indexOf(t);n>-1&&e.splice(n,1);},x$1=Object.prototype.hasOwnProperty,w$1=(e,t)=>x$1.call(e,t),k$1=Array.isArray,T$1=e=>"function"==typeof e,E$1=e=>"string"==typeof e,A$1=e=>"symbol"==typeof e,R$1=e=>null!==e&&"object"==typeof e,O$1=e=>(R$1(e)||T$1(e))&&T$1(e.then)&&T$1(e.catch),N$1=Object.prototype.toString,P$1=e=>E$1(e)&&"NaN"!==e&&"-"!==e[0]&&""+parseInt(e,10)===e,M$1=h$1(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),I$1=e=>{let t=Object.create(null);return n=>t[n]||(t[n]=e(n))},L$1=/-\w/g,F$1=I$1(e=>e.replace(L$1,e=>e.slice(1).toUpperCase())),j$1=/\B([A-Z])/g,V$1=I$1(e=>e.replace(j$1,"-$1").toLowerCase()),D$1=I$1(e=>e.charAt(0).toUpperCase()+e.slice(1)),U$1=I$1(e=>e?`on${D$1(e)}`:""),B$1=(e,t)=>!Object.is(e,t),$$1=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t);},H$1=(e,t,n,l=false)=>{Object.defineProperty(e,t,{configurable:true,enumerable:false,writable:l,value:n});},W$1=e=>{let t=parseFloat(e);return isNaN(t)?e:t},K$1=e=>{let t=E$1(e)?Number(e):0/0;return isNaN(t)?e:t},z$1=()=>n||(n="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:"u">typeof global?global:{}),q$1=h$1("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol");function G$1(e){if(k$1(e)){let t={};for(let n=0;n<e.length;n++){let l=e[n],r=E$1(l)?function(e){let t={};return e.replace(Z$1,e=>e.startsWith("/*")?"":e).split(X$1).forEach(e=>{if(e){let n=e.split(J$1);n.length>1&&(t[n[0].trim()]=n[1].trim());}}),t}(l):G$1(l);if(r)for(let e in r)t[e]=r[e];}return t}if(E$1(e)||R$1(e))return e}let X$1=/;(?![^(]*\))/g,J$1=/:([^]+)/,Z$1=/"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;function Y$1(e){let t="";if(E$1(e))t=e;else if(k$1(e))for(let n=0;n<e.length;n++){let l=Y$1(e[n]);l&&(t+=l+" ");}else if(R$1(e))for(let n in e)e[n]&&(t+=n+" ");return t.trim()}let ee=h$1("itemscope,allowfullscreen,disablepictureinpicture,disableremoteplayback,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");function et$1(e,t,n){if(e.length!==t.length)return  false;let l=true;for(let r=0;l&&r<e.length;r++)l=ei(e[r],t[r],n);return l}function en(e,t,n){if(e.size!==t.size)return  false;let l=Array.from(t),r=new Uint8Array(l.length);for(let t of e){let e=-1;for(let i=0;i<l.length;i++)if(!r[i]&&ei(t,l[i],n)){e=i;break}if(e<0)return  false;r[e]=1;}return  true}function el(e,t,n){let l,r,i,o,s="[object Map]"===(l=e,N$1.call(l)),a="[object Map]"===(r=t,N$1.call(r));if(s||a)return !!s&&!!a&&en(e,t,n);s="[object Set]"===(i=e,N$1.call(i));if(a="[object Set]"===(o=t,N$1.call(o)),s||a)return !!s&&!!a&&en(e,t,n);if(Object.keys(e).length!==Object.keys(t).length)return  false;for(let l in e){let r=e.hasOwnProperty(l),i=t.hasOwnProperty(l);if(r&&!i||!r&&i||!ei(e[l],t[l],n))return  false}return String(e)===String(t)}function er(e,t,n,l){n||(n=[new Map,new Map]);let[r,i]=n;if(r.has(e)||i.has(t))return r.get(e)===t&&i.get(t)===e;r.set(e,t),i.set(t,e);let o=l(e,t,n);return r.delete(e),i.delete(t),o}function ei(e,t,n){let l,r;if(e===t)return  true;let i="[object Date]"===(l=e,N$1.call(l)),o="[object Date]"===(r=t,N$1.call(r));return i||o?!!i&&!!o&&e.getTime()===t.getTime():(i=A$1(e),o=A$1(t),i||o)?e===t:(i=k$1(e),o=k$1(t),i||o)?!!i&&!!o&&er(e,t,n,et$1):(i=R$1(e),o=R$1(t),i||o)?!!i&&!!o&&er(e,t,n,el):String(e)===String(t)}function eo(e,t){return e.findIndex(e=>ei(e,t))}let es=e=>!!(e&&true===e.__v_isRef),ea=e=>E$1(e)?e:null==e?"":k$1(e)||R$1(e)&&(e.toString===N$1||!T$1(e.toString))?es(e)?ea(e.value):JSON.stringify(e,eu,2):String(e),eu=(e,t)=>{let n;if(es(t))return eu(e,t.value);if("[object Map]"===(n=t,N$1.call(n)))return {[`Map(${t.size})`]:[...t.entries()].reduce((e,[t,n],l)=>(e[ec(t,l)+" =>"]=n,e),{})};{let e;if("[object Set]"===(e=t,N$1.call(e)))return {[`Set(${t.size})`]:[...t.values()].map(e=>ec(e))};else {if(A$1(t))return ec(t);let e;if(R$1(t)&&!k$1(t)&&"[object Object]"!==(e=t,N$1.call(e)))return String(t)}}return t},ec=(e,t="")=>{var n;return A$1(e)?`Symbol(${null!=(n=e.description)?n:t})`:e};class ef{constructor(e=false){this.detached=e,this._active=true,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=false,this._warnOnRun=true,this.__v_skip=true,!e&&l&&(l.active?(this.parent=l,this.index=(l.scopes||(l.scopes=[])).push(this)-1):(this._active=false,this._warnOnRun=false));}get active(){return this._active}pause(){if(this._active){let e,t;if(this._isPaused=true,this.scopes){let n=this.scopes.slice();for(e=0,t=n.length;e<t;e++)n[e].pause();}for(e=0,t=this.effects.length;e<t;e++)this.effects[e].pause();}}resume(){if(this._active&&this._isPaused){let e,t;if(this._isPaused=false,this.scopes){let n=this.scopes.slice();for(e=0,t=n.length;e<t;e++)n[e].resume();}let n=this.effects.slice();for(e=0,t=n.length;e<t;e++)n[e].resume();}}run(e){if(this._active){let t=l;try{return l=this,e()}finally{l=t;}}}on(){1==++this._on&&(this.prevScope=l,l=this);}off(){if(this._on>0&&0==--this._on){if(l===this)l=this.prevScope;else {let e=l;for(;e;){if(e.prevScope===this){e.prevScope=this.prevScope;break}e=e.prevScope;}}this.prevScope=void 0;}}stop(e){if(this._active){let t,n;for(this._active=false,t=0,n=this.effects.length;t<n;t++)this.effects[t].stop();for(this.effects.length=0,t=0,n=this.cleanups.length;t<n;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){let e=this.scopes.slice();for(t=0,n=e.length;t<n;t++)e[t].stop(true);this.scopes.length=0;}if(!this.detached&&this.parent&&!e){let e=this.parent.scopes.pop();e&&e!==this&&(this.parent.scopes[this.index]=e,e.index=this.index);}this.parent=void 0;}}}function ep(){return l}let eg=new WeakSet;class ev{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,l&&(l.active?l.effects.push(this):this.flags&=-2);}pause(){this.flags|=64;}resume(){64&this.flags&&(this.flags&=-65,eg.has(this)&&(eg.delete(this),this.trigger()));}notify(){(!(2&this.flags)||32&this.flags)&&(8&this.flags||e_(this));}run(){if(!(1&this.flags))return this.fn();this.flags|=2,eN(this),eb(this);let e=r,t=eE;r=this,eE=true;try{return this.fn()}finally{eS(this),r=e,eE=t,this.flags&=-3;}}stop(){if(1&this.flags){for(let e=this.deps;e;e=e.nextDep)ew(e);this.deps=this.depsTail=void 0,eN(this),this.onStop&&this.onStop(),this.flags&=-2;}}trigger(){64&this.flags?eg.add(this):this.scheduler?this.scheduler():this.runIfDirty();}runIfDirty(){eC(this)&&this.run();}get dirty(){return eC(this)}}let em=0;function e_(e,t=false){if(e.flags|=8,t){e.next=o,o=e;return}e.next=i,i=e;}function ey(){let e;if(!(--em>0)){if(o){let e=o;for(o=void 0;e;){let t=e.next;e.next=void 0,e.flags&=-9,e=t;}}for(;i;){let t=i;for(i=void 0;t;){let n=t.next;if(t.next=void 0,t.flags&=-9,1&t.flags)try{t.trigger();}catch(t){e||(e=t);}t=n;}}if(e)throw e}}function eb(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t;}function eS(e){let t,n=e.depsTail,l=n;for(;l;){let e=l.prevDep;-1===l.version?(l===n&&(n=e),ew(l),function(e){let{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0);}(l)):t=l,l.dep.activeLink=l.prevActiveLink,l.prevActiveLink=void 0,l=e;}e.deps=t,e.depsTail=n;}function eC(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(ex(t.dep.computed)||t.dep.version!==t.version))return  true;return !!e._dirty}function ex(e){if(4&e.flags&&!(16&e.flags)||(e.flags&=-17,e.globalVersion===eP)||(e.globalVersion=eP,!e.isSSR&&128&e.flags&&(!e.deps&&!e._dirty||!eC(e))))return;e.flags|=2;let t=e.dep,n=r,l=eE;r=e,eE=true;try{eb(e);let n=e.fn(e._value);(0===t.version||B$1(n,e._value))&&(e.flags|=128,e._value=n,t.version++);}catch(e){throw t.version++,e}finally{r=n,eE=l,eS(e),e.flags&=-3;}}function ew(e,t=false){let{dep:n,prevSub:l,nextSub:r}=e;if(l&&(l.nextSub=r,e.prevSub=void 0),r&&(r.prevSub=l,e.nextSub=void 0),n.subs===e&&(n.subs=l,!l&&n.computed)){n.computed.flags&=-5;for(let e=n.computed.deps;e;e=e.nextDep)ew(e,true);}t||--n.sc||!n.map||n.map.delete(n.key);}let eE=true,eA=[];function eR(){eA.push(eE),eE=false;}function eO(){let e=eA.pop();eE=void 0===e||e;}function eN(e){let{cleanup:t}=e;if(e.cleanup=void 0,t){let e=r;r=void 0;try{t();}finally{r=e;}}}let eP=0;class eM{constructor(e,t){this.sub=e,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0;}}class eI{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=true;}track(e){if(!r||!eE||r===this.computed)return;let t=this.activeLink;if(void 0===t||t.sub!==r)t=this.activeLink=new eM(r,this),r.deps?(t.prevDep=r.depsTail,r.depsTail.nextDep=t,r.depsTail=t):r.deps=r.depsTail=t,function e(t){if(t.dep.sc++,4&t.sub.flags){let n=t.dep.computed;if(n&&!t.dep.subs){n.flags|=20;for(let t=n.deps;t;t=t.nextDep)e(t);}let l=t.dep.subs;l!==t&&(t.prevSub=l,l&&(l.nextSub=t)),t.dep.subs=t;}}(t);else if(-1===t.version&&(t.version=this.version,t.nextDep)){let e=t.nextDep;e.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=e),t.prevDep=r.depsTail,t.nextDep=void 0,r.depsTail.nextDep=t,r.depsTail=t,r.deps===t&&(r.deps=e);}return t}trigger(e){this.version++,eP++,this.notify(e);}notify(e){em++;try{for(let e=this.subs;e;e=e.prevSub)e.sub.notify()&&e.sub.dep.notify();}finally{ey();}}}let eL=new WeakMap,eF=Symbol(""),ej=Symbol(""),eV=Symbol("");function eD(e,t,n){if(eE&&r){let t=eL.get(e);t||eL.set(e,t=new Map);let l=t.get(n);l||(t.set(n,l=new eI),l.map=t,l.key=n),l.track();}}function eU(e,t,n,l,r,i){let o=eL.get(e);if(!o)return void eP++;let s=e=>{e&&e.trigger();};if(em++,"clear"===t)o.forEach(s);else {let r=k$1(e),i=r&&P$1(n);if(r&&"length"===n){let e=Number(l);o.forEach((t,n)=>{("length"===n||n===eV||!A$1(n)&&n>=e)&&s(t);});}else switch((void 0!==n||o.has(void 0))&&s(o.get(n)),i&&s(o.get(eV)),t){case "add":if(r)i&&s(o.get("length"));else {let t;s(o.get(eF));"[object Map]"===(t=e,N$1.call(t))&&s(o.get(ej));}break;case "delete":if(!r){let t;s(o.get(eF));"[object Map]"===(t=e,N$1.call(t))&&s(o.get(ej));}break;case "set":let a;"[object Map]"===(a=e,N$1.call(a))&&s(o.get(eF));}}ey();}function eB(e){let t=t_(e);return t===e||(eD(t,"iterate",eV),tv(e))?t:tg(e)?th(e)?t.map(e=>tS(tb(e))):t.map(tS):t.map(tb)}function e$(e){return eD(e=t_(e),"iterate",eV),e}function eH(e,t){return tg(e)?th(e)?tS(tb(t)):tS(t):tb(t)}let eW={__proto__:null,[Symbol.iterator](){return eK(this,Symbol.iterator,e=>eH(this,e))},concat(...e){return eB(this).concat(...e.map(e=>k$1(e)?eB(e):e))},entries(){return eK(this,"entries",e=>(e[1]=eH(this,e[1]),e))},every(e,t){return eG(this,"every",e,t,void 0,arguments)},filter(e,t){return eG(this,"filter",e,t,e=>e.map(e=>eH(this,e)),arguments)},find(e,t){return eG(this,"find",e,t,e=>eH(this,e),arguments)},findIndex(e,t){return eG(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return eG(this,"findLast",e,t,e=>eH(this,e),arguments)},findLastIndex(e,t){return eG(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return eG(this,"forEach",e,t,void 0,arguments)},includes(...e){return eJ(this,"includes",e)},indexOf(...e){return eJ(this,"indexOf",e)},join(e){return eB(this).join(e)},lastIndexOf(...e){return eJ(this,"lastIndexOf",e)},map(e,t){return eG(this,"map",e,t,void 0,arguments)},pop(){return eZ(this,"pop")},push(...e){return eZ(this,"push",e)},reduce(e,...t){return eX(this,"reduce",e,t)},reduceRight(e,...t){return eX(this,"reduceRight",e,t)},shift(){return eZ(this,"shift")},some(e,t){return eG(this,"some",e,t,void 0,arguments)},splice(...e){return eZ(this,"splice",e)},toReversed(){return eB(this).toReversed()},toSorted(e){return eB(this).toSorted(e)},toSpliced(...e){return eB(this).toSpliced(...e)},unshift(...e){return eZ(this,"unshift",e)},values(){return eK(this,"values",e=>eH(this,e))}};function eK(e,t,n){let l=e$(e),r=l[t],i=r.call(l);if(l!==e&&!tv(e)){if("Array Iterator"===i[Symbol.toStringTag]){let e=Object.create(Object.getPrototypeOf(i));return e.next=()=>ez(i.next(),n),r!==eq[t]&&Object.defineProperties(e,{return:{get(){let e=i.return;return "function"==typeof e?e.bind(i):e}},throw:{get(){let e=i.throw;return "function"==typeof e?e.bind(i):e}}}),e}i._next=i.next,i.next=()=>ez(i._next(),n);}return i}function ez(e,t){return e.done||(e.value=t(e.value)),e}let eq=Array.prototype;function eG(e,t,n,l,r,i){let o=e$(e),s=o!==e&&!tv(e),a=o[t];if(a!==eq[t]){let t=a.apply(e,i);return s?tb(t):t}let u=n;o!==e&&(s?u=function(t,l){return n.call(this,eH(e,t),l,e)}:n.length>2&&(u=function(t,l){return n.call(this,t,l,e)}));let c=a.call(o,u,l);return s&&r?r(c):c}function eX(e,t,n,l){let r=e$(e),i=r!==e&&!tv(e),o=n,s=false;r!==e&&(i?(s=0===l.length,o=function(t,l,r){return s&&(s=false,t=eH(e,t)),n.call(this,t,eH(e,l),r,e)}):n.length>3&&(o=function(t,l,r){return n.call(this,t,l,r,e)}));let a=r[t](o,...l);return s?eH(e,a):a}function eJ(e,t,n){let l=t_(e);eD(l,"iterate",eV);let r=l[t](...n);return (-1===r||false===r)&&tm(n[0])?(n[0]=t_(n[0]),l[t](...n)):r}function eZ(e,t,n=[]){eR(),em++;let l=t_(e)[t].apply(e,n);return ey(),eO(),l}let eY=h$1("__proto__,__v_isRef,__isVue"),eQ=new Set((((Object.getOwnPropertyNames(Symbol)).filter(e=>"arguments"!==e&&"caller"!==e)).map(e=>Symbol[e])).filter(A$1));function e0(e){A$1(e)||(e=String(e));let t=t_(this);return eD(t,"has",e),t.hasOwnProperty(e)}class e1{constructor(e=false,t=false){this._isReadonly=e,this._isShallow=t;}get(e,t,n){if("__v_skip"===t)return e.__v_skip;let l=this._isReadonly,r=this._isShallow;if("__v_isReactive"===t)return !l;if("__v_isReadonly"===t)return l;if("__v_isShallow"===t)return r;if("__v_raw"===t)return n===(l?r?ta:ts:r?to:ti).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(n)?e:void 0;let i=k$1(e);if(!l){let e;if(i&&(e=eW[t]))return e;if("hasOwnProperty"===t)return e0}let o=Reflect.get(e,t,tC(e)?e:n);if((A$1(t)?eQ.has(t):eY(t))||(l||eD(e,"get",t),r))return o;if(tC(o)){let e=i&&P$1(t)?o:o.value;return l&&R$1(e)?tf(e):e}return R$1(o)?l?tf(o):tu(o):o}}class e2 extends e1{constructor(e=false){super(false,e);}set(e,t,n,l){let r=e[t],i=k$1(e)&&P$1(t);if(!this._isShallow){let e=tg(r);if(tv(n)||tg(n)||(r=t_(r),n=t_(n)),!i&&tC(r)&&!tC(n))if(e)return  true;else return r.value=n,true}let o=i?Number(t)<e.length:w$1(e,t),s=Reflect.set(e,t,n,tC(e)?e:l);return e===t_(l)&&s&&(o?B$1(n,r)&&eU(e,"set",t,n):eU(e,"add",t,n)),s}deleteProperty(e,t){let n=w$1(e,t);e[t];let l=Reflect.deleteProperty(e,t);return l&&n&&eU(e,"delete",t,void 0),l}has(e,t){let n=Reflect.has(e,t);return A$1(t)&&eQ.has(t)||eD(e,"has",t),n}ownKeys(e){return eD(e,"iterate",k$1(e)?"length":eF),Reflect.ownKeys(e)}}class e6 extends e1{constructor(e=false){super(true,e);}set(e,t){return  true}deleteProperty(e,t){return  true}}let e8=new e2,e4=new e6,e3=new e2(true);new e6(true);let e9=e=>e;function e7(e){return function(){return "delete"!==e&&("clear"===e?void 0:this)}}function te$1(e,t){let n,l=(S$1(n={get(n){let l=this.__v_raw,r=t_(l),i=t_(n);e||(B$1(n,i)&&eD(r,"get",n),eD(r,"get",i));let{has:o}=Reflect.getPrototypeOf(r),s=t?e9:e?tS:tb;return o.call(r,n)?s(l.get(n)):o.call(r,i)?s(l.get(i)):void(l!==r&&l.get(n))},get size(){let t=this.__v_raw;return e||eD(t_(t),"iterate",eF),t.size},has(t){let n=this.__v_raw,l=t_(n),r=t_(t);return e||(B$1(t,r)&&eD(l,"has",t),eD(l,"has",r)),t===r?n.has(t):n.has(t)||n.has(r)},forEach(n,l){let r=this,i=r.__v_raw,o=t_(i),s=t?e9:e?tS:tb;return e||eD(o,"iterate",eF),i.forEach((e,t)=>n.call(l,s(e),s(t),r))}},e?{add:e7("add"),set:e7("set"),delete:e7("delete"),clear:e7("clear")}:{add(e){let n=t_(this),l=Reflect.getPrototypeOf(n),r=t_(e),i=t||tv(e)||tg(e)?e:r;return l.has.call(n,i)||B$1(e,i)&&l.has.call(n,e)||B$1(r,i)&&l.has.call(n,r)||(n.add(i),eU(n,"add",i,i)),this},set(e,n){t||tv(n)||tg(n)||(n=t_(n));let l=t_(this),{has:r,get:i}=Reflect.getPrototypeOf(l),o=r.call(l,e);o||(e=t_(e),o=r.call(l,e));let s=i.call(l,e);return l.set(e,n),o?B$1(n,s)&&eU(l,"set",e,n):eU(l,"add",e,n),this},delete(e){let t=t_(this),{has:n,get:l}=Reflect.getPrototypeOf(t),r=n.call(t,e);r||(e=t_(e),r=n.call(t,e)),l&&l.call(t,e);let i=t.delete(e);return r&&eU(t,"delete",e,void 0),i},clear(){let e=t_(this),t=0!==e.size,n=e.clear();return t&&eU(e,"clear",void 0,void 0),n}}),["keys","values","entries",Symbol.iterator].forEach(l=>{n[l]=function(...n){let r,i=this.__v_raw,o=t_(i),s="[object Map]"===(r=o,N$1.call(r)),a="entries"===l||l===Symbol.iterator&&s,u=i[l](...n),c=t?e9:e?tS:tb;return e||eD(o,"iterate","keys"===l&&s?ej:eF),S$1(Object.create(u),{next(){let{value:e,done:t}=u.next();return t?{value:e,done:t}:{value:a?[c(e[0]),c(e[1])]:c(e),done:t}}})};}),n);return (n,r,i)=>"__v_isReactive"===r?!e:"__v_isReadonly"===r?e:"__v_isShallow"===r?t:"__v_raw"===r?n:Reflect.get(w$1(l,r)&&r in n?l:n,r,i)}let tt$1={get:te$1(false,false)},tn={get:te$1(false,true)},tl={get:te$1(true,false)};({get:te$1(true,true)});let ti=new WeakMap,to=new WeakMap,ts=new WeakMap,ta=new WeakMap;function tu(e){return tg(e)?e:tp(e,false,e8,tt$1,ti)}function tc(e){return tp(e,false,e3,tn,to)}function tf(e){return tp(e,true,e4,tl,ts)}function tp(e,t,n,l,r){let i;if(!R$1(e)||e.__v_raw&&!(t&&e.__v_isReactive)||e.__v_skip||!Object.isExtensible(e))return e;let o=r.get(e);if(o)return o;let s=function(e){switch(e){case "Object":case "Array":return 1;case "Map":case "Set":case "WeakMap":case "WeakSet":return 2;default:return 0}}((i=e,N$1.call(i)).slice(8,-1));if(0===s)return e;let a=new Proxy(e,2===s?l:n);return r.set(e,a),a}function th(e){return tg(e)?th(e.__v_raw):!!(e&&e.__v_isReactive)}function tg(e){return !!(e&&e.__v_isReadonly)}function tv(e){return !!(e&&e.__v_isShallow)}function tm(e){return !!e&&!!e.__v_raw}function t_(e){let t=e&&e.__v_raw;return t?t_(t):e}function ty(e){return !w$1(e,"__v_skip")&&Object.isExtensible(e)&&H$1(e,"__v_skip",true),e}let tb=e=>R$1(e)?tu(e):e,tS=e=>R$1(e)?tf(e):e;function tC(e){return !!e&&true===e.__v_isRef}function tx(e){return tk(e,false)}function tw(e){return tk(e,true)}function tk(e,t){return tC(e)?e:new tT(e,t)}class tT{constructor(e,t){this.dep=new eI,this.__v_isRef=true,this.__v_isShallow=false,this._rawValue=t?e:t_(e),this._value=t?e:tb(e),this.__v_isShallow=t;}get value(){return this.dep.track(),this._value}set value(e){let t=this._rawValue,n=this.__v_isShallow||tv(e)||tg(e);B$1(e=n?e:t_(e),t)&&(this._rawValue=e,this._value=n?e:tb(e),this.dep.trigger());}}function tA(e){return tC(e)?e.value:e}let tO={get:(e,t,n)=>"__v_raw"===t?e:tA(Reflect.get(e,t,n)),set:(e,t,n,l)=>{let r=e[t];return tC(r)&&!tC(n)?(r.value=n,true):Reflect.set(e,t,n,l)}};function tN(e){return th(e)?e:new Proxy(e,tO)}class tV{constructor(e,t,n){this.fn=e,this.setter=t,this._value=void 0,this.dep=new eI(this),this.__v_isRef=true,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=eP-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=n;}notify(){if(this.flags|=16,!(8&this.flags)&&r!==this)return e_(this,true),true}get value(){let e=this.dep.track();return ex(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e);}}let tB={},t$=new WeakMap;function tW(e,t=false,n=d){if(n){let t=t$.get(n);t||t$.set(n,t=[]),t.push(e);}}function tK(e,t=1/0,n){if(t<=0||!R$1(e)||e.__v_skip||((n=n||new Map).get(e)||0)>=t)return e;if(n.set(e,t),t--,tC(e))tK(e.value,t,n);else if(k$1(e))for(let l=0;l<e.length;l++)tK(e[l],t,n);else {let l,r;if("[object Set]"===(l=e,N$1.call(l))||"[object Map]"===(r=e,N$1.call(r)))e.forEach(e=>{tK(e,t,n);});else {let l;if("[object Object]"===(l=e,N$1.call(l))){for(let l in e)tK(e[l],t,n);for(let l of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,l)&&tK(e[l],t,n);}}}return e}function tG(e,t,n,l){try{return l?e(...l):e()}catch(e){tJ(e,t,n);}}function tX(e,t,n,l){if(T$1(e)){let r=tG(e,t,n,l);return r&&O$1(r)&&r.catch(e=>{tJ(e,t,n,void 0,true);}),r}if(k$1(e)){let r=[];for(let i=0;i<e.length;i++)r.push(tX(e[i],t,n,l));return r}}function tJ(e,t,n,l=true,r=false){t?t.vnode:null;let {errorHandler:o,throwUnhandledErrorInProduction:s}=t&&t.appContext.config||g$1;if(t){let l=t.parent,i=t.proxy,s=`https://vuejs.org/error-reference/#runtime-${n}`;for(;l;){let t=l.ec;if(t&&!l.isUnmounted&&(!r||l.scope.active)){for(let n=0;n<t.length;n++)if(false===t[n](e,i,s))return}l=l.parent;}if(o){eR(),tG(o,null,10,[e,i,s]),eO();return}}!function(e,t=true,n=false){if(n)throw e;console.error(e);}(e,l,s);}let tZ=[],tY=-1,tQ=[],t0=null,t1=0,t2=Promise.resolve(),t6=null;function t8(e){let t=t6||t2;return e?t.then(this?e.bind(this):e):t}function t4(e){if(!(1&e.flags)){let t=nt$1(e),n=tZ[tZ.length-1];!n||!(2&e.flags)&&t>=nt$1(n)?tZ.push(e):tZ.splice(function(e){let t=tY+1,n=tZ.length;for(;t<n;){let l=t+n>>>1,r=tZ[l],i=nt$1(r);i<e||i===e&&2&r.flags?t=l+1:n=l;}return t}(t),0,e),e.flags|=1,t3();}}function t3(){t6||(t6=t2.then(function e(t){try{for(tY=0;tY<tZ.length;tY++){let e=tZ[tY];e&&!(8&e.flags)&&(4&e.flags&&(e.flags&=-2),tG(e,e.i,e.i?15:14),4&e.flags||(e.flags&=-2));}}finally{for(;tY<tZ.length;tY++){let e=tZ[tY];e&&(e.flags&=-2);}tY=-1,tZ.length=0,t7(),t6=null,(tZ.length||tQ.length)&&e();}}));}function t5(e){if(k$1(e))for(let t=0;t<e.length;t++)tQ.push(e[t]);else t0&&-1===e.id?t0.splice(t1+1,0,e):1&e.flags||(tQ.push(e),e.flags|=1);t3();}function t9(e,t,n,l=tY+1){for(;l<tZ.length;l++){let n=tZ[l];if(n&&2&n.flags){if(e&&n.id!==e.uid||void 0!==t&&!(n.id>=t))continue;tZ.splice(l,1),l=e?l-1:tY,4&n.flags&&(n.flags&=-2),n(),4&n.flags||(n.flags&=-2);}}}function t7(e,t,n=0){if(tQ.length){let e=tQ,l=0;if(t){e=[];for(let r=0;r<tQ.length;r++){let i=tQ[r];(void 0!==i.i?!i.i||i.i.uid<n:t.has(i))?tQ[l++]=i:e.push(i);}}let r=[...new Set(e)].sort((e,t)=>nt$1(e)-nt$1(t));if(tQ.length=l,t0){for(let e=0;e<r.length;e++)t0.push(r[e]);return}for(t0=r,t1=0;t1<t0.length;t1++){let e=t0[t1];4&e.flags&&(e.flags&=-2),8&e.flags||e(),e.flags&=-2;}t0=null,t1=0;}}let ne$1=false,nt$1=e=>null==e.id?2&e.flags?-1:1/0:e.id,nn=null,nl=null;function nr(e){let t=nn;return nn=e,nl=e&&e.type.__scopeId||null,t}function na(e,t=nn,n){if(!t||e._n)return e;let l=(...n)=>{let r;l._d&&it$1(-1);let i=nr(t),o=r3.length;try{r=e(...n);}finally{for(let e=r3.length;e>o;e--)r7();nr(i),l._d&&it$1(1);}return r};return l._n=true,l._c=true,l._d=true,l}function nu(e,t){if(null===nn)return e;let n=iB(nn),l=e.dirs||(e.dirs=[]);for(let e=0;e<t.length;e++){let[r,i,o,s=g$1]=t[e];r&&(T$1(r)&&(r={mounted:r,updated:r}),r.deep&&tK(i),l.push({dir:r,instance:n,value:i,oldValue:void 0,arg:o,modifiers:s}));}return e}function nc(e,t,n,l){let r=e;if("beforeMount"===l)e._mount=e;else if("beforeUpdate"===l){let n=t&&t._mount;n&&(n._latest=e,e._mount=n);}else if("mounted"===l){let t=e._latest;e._mount=e._latest=void 0,t&&(r=t,t._mount=void 0);}let i=r.dirs,o=t&&t.dirs;for(let s=0;s<i.length;s++){let a=i[s];o?a.oldValue=o[s].value:"mounted"===l&&void 0!==a.oldValue&&(a=S$1({},a,{oldValue:void 0}));let u=a.dir[l];u&&(eR(),tX(u,n,8,[e.el,a,r,t]),eO());}}function nf(e,t){if(iE){let n=iE.provides,l=iE.parent&&iE.parent.provides;l===n&&(n=iE.provides=Object.create(l)),n[e]=t;}}function nd(e,t,n=false){let l=iA();if(l||rc){let r=rc?rc._context.provides:l?null==l.parent||l.ce?l.vnode.appContext&&l.vnode.appContext.provides:l.parent.provides:void 0;if(r&&e in r)return r[e];if(arguments.length>1)return n&&T$1(t)?t.call(l&&l.proxy):t}}let nh=Symbol.for("v-scx"),ng=()=>nd(nh);function ny(e,t,n){return nb(e,t,n)}function nb(e,t,n=g$1){let l,{immediate:r,flush:i}=n,o=S$1({},n),s=t&&r||!t&&"post"!==i;if(iP){if("sync"===i){let e=ng();l=e.__watcherHandles||(e.__watcherHandles=[]);}else if(!s){let e=()=>{};return e.stop=m$1,e.resume=m$1,e.pause=m$1,e}}let a=iE;o.call=(e,t,n)=>tX(e,a,t,n);let u=false;"post"===i?o.scheduler=e=>{e.i=a,rL(e,a&&a.suspense);}:"sync"!==i&&(u=true,o.scheduler=(e,t)=>{t?e():t4(e);}),o.augmentJob=e=>{t&&(e.flags|=4),u&&(e.flags|=2,a&&(e.id=a.uid,e.i=a));};let c=function(e,t,n=g$1){let l,r,i,o,{immediate:s,deep:a,once:u,scheduler:c,augmentJob:f,call:p}=n,h=e=>a?e:tv(e)||false===a||0===a?tK(e,1):tK(e),v=false,_=false;if(tC(e)?(r=()=>e.value,v=tv(e)):th(e)?(r=()=>h(e),v=true):k$1(e)?(_=true,v=e.some(e=>th(e)||tv(e)),r=()=>e.map(e=>tC(e)?e.value:th(e)?h(e):T$1(e)?p?p(e,2):e():void 0)):r=T$1(e)?t?p?()=>p(e,2):e:()=>{if(i){eR();try{i();}finally{eO();}}let t=d;d=l;try{return p?p(e,3,[o]):e(o)}finally{d=t;}}:m$1,t&&a){let e=r,t=true===a?1/0:a;r=()=>tK(e(),t);}let y=ep(),b=()=>{l.stop(),y&&y.active&&C$1(y.effects,l);};if(u&&t){let e=t;t=(...t)=>{try{return e(...t)}finally{b();}};}let S=_?Array(e.length).fill(tB):tB,x=e=>{if(1&l.flags&&(l.dirty||e))if(t){let n=l.run();if(e||a||v||(_?n.some((e,t)=>B$1(e,S[t])):B$1(n,S))){let e=d;eR();try{i&&i(),d=l;let e=[n,S===tB?void 0:_&&S[0]===tB?[]:S,o];S=n,p?p(t,3,e):t(...e);}finally{d=e,eO();}}}else l.run();};return f&&f(x),(l=new ev(r)).scheduler=c?()=>c(x,false):x,o=e=>tW(e,false,l),i=l.onStop=()=>{let e=t$.get(l);if(e){if(p)p(e,4);else for(let t of e)t();t$.delete(l);}},t?s?x(true):S=l.run():c?c(x.bind(null,true),true):l.run(),b.pause=l.pause.bind(l),b.resume=l.resume.bind(l),b.stop=b,b}(e,t,o);return iP&&(l?l.push(c):s&&c()),c}function nS(e,t,n){let l,r=this.proxy,i=E$1(e)?e.includes(".")?nC(r,e):()=>r[e]:e.bind(r,r);T$1(t)?l=t:(l=t.handler,n=t);let o=iR(this),s=nb(i,l.bind(r),n);return o(),s}function nC(e,t){let n=t.split(".");return ()=>{let t=e;for(let e=0;e<n.length&&t;e++)t=t[n[e]];return t}}let nw=Symbol("_vte");let nM=Symbol("_leaveCb"),nI=Symbol("_enterCb");function nL(){let e={isMounted:false,isLeaving:false,isUnmounting:false,leavingVNodes:new Map};return lS(()=>{e.isMounted=true;}),lw(()=>{e.isUnmounting=true;}),e}let nF=[Function,Array],nj={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:nF,onEnter:nF,onAfterEnter:nF,onEnterCancelled:nF,onBeforeLeave:nF,onLeave:nF,onAfterLeave:nF,onLeaveCancelled:nF,onBeforeAppear:nF,onAppear:nF,onAfterAppear:nF,onAppearCancelled:nF};function nV(e){let t=e[0];if(e.length>1){for(let n of e)if(n.type!==r8){t=n;break}}return t}let nD={name:"BaseTransition",props:nj,setup(e,{slots:t}){let n=iA(),l=nL();return ()=>{let r=t.default&&nK(t.default(),true),i=r&&r.length?nV(r):n.subTree?i_():void 0;if(!i)return;let o=t_(e),{mode:s}=o;if(l.isLeaving)return n$(i);let a=nH(i);if(!a)return n$(i);let u=nB(a,o,l,n);a.type!==r8&&nW(a,u);let c=n.subTree&&nH(n.subTree);if(c&&c.type!==r8&&!is(c,a)&&nz(n.subTree)){let e=nB(c,o,l,n);if(nW(c,e),"out-in"===s&&a.type!==r8)return l.isLeaving=true,e.afterLeave=()=>{if(l.isLeaving=false,!(8&n.job.flags))if(2&n.effect.flags){let e=()=>{8&n.job.flags||n.update();};e.i=n,t4(e);}else n.update();delete e.afterLeave,c=void 0;},n$(i);"in-out"===s&&a.type!==r8?e.delayLeave=(e,t,n)=>{nU(l,c)[String(c.key)]=c,e[nM]=()=>{t(),e[nM]=void 0,delete u.delayedLeave,c=void 0;},u.delayedLeave=()=>{n(),delete u.delayedLeave,c=void 0;};}:c=void 0;}else c&&(c=void 0);return i}}};function nU(e,t){let{leavingVNodes:n}=e,l=n.get(t.type);return l||(l=Object.create(null),n.set(t.type,l)),l}function nB(e,t,n,l){let{appear:r,mode:i,persisted:o=false,onBeforeEnter:s,onEnter:a,onAfterEnter:u,onEnterCancelled:c,onBeforeLeave:f,onLeave:d,onAfterLeave:p,onLeaveCancelled:h,onBeforeAppear:g,onAppear:v,onAfterAppear:m,onAppearCancelled:_}=t,y=String(e.key),b=nU(n,e),S=(e,t)=>{e&&tX(e,l,9,t);},C=(e,t)=>{let n=t[1];S(e,t),k$1(e)?e.every(e=>e.length<=1)&&n():e.length<=1&&n();},x={mode:i,persisted:o,beforeEnter(t){let l=s;if(!n.isMounted)if(!r)return;else l=g||s;t[nM]&&t[nM](true);let i=b[y];if(i&&is(e,i)){let e=i.el[nM];if(!e){let t=nz(i);e=t&&t.el[nM];}e&&e();}S(l,[t]);},enter(t){if(b[y]===e)return;let l=a,i=u,o=c;if(!n.isMounted)if(!r)return;else l=v||a,i=m||u,o=_||c;let s=false;t[nI]=e=>{s||(s=true,e?S(o,[t]):S(i,[t]),x.delayedLeave&&x.delayedLeave(),t[nI]=void 0);};let f=t[nI].bind(null,false);l?C(l,[t,f]):f();},leave(t,l){let r=String(e.key);if(t[nI]&&t[nI](true),n.isUnmounting)return l();S(f,[t]);let i=false;t[nM]=n=>{i||(i=true,l(),n?S(h,[t]):S(p,[t]),t[nM]=void 0,b[r]===e&&delete b[r]);};let o=t[nM].bind(null,false);b[r]=e,d?C(d,[t,o]):o();},clone(e){let r=nB(e,t,n,l);return r.afterLeave=()=>{x.afterLeave&&x.afterLeave();},r.delayLeave=(e,t,n)=>{x.delayLeave?x.delayLeave(e,t,n):n();},r.delayedLeave=()=>{x.delayedLeave&&x.delayedLeave();},r}};return x}function n$(e){if(lc(e))return (e=ig(e)).children=null,e}function nH(e){if(!lc(e))return e.type.__isTeleport&&e.children?nV(e.children):e;if(e.component)return e.component.subTree;let{shapeFlag:t,children:n}=e;if(n){if(16&t)return n[0];if(32&t&&T$1(n.default))return n.default()}}function nW(e,t){if(6&e.shapeFlag&&e.component){e.transition=t;let n=e.component.subTree;nW(n.type.__isTeleport&&nH(n)||n,t);}else if(128&e.shapeFlag){let n=e.suspense;if(n){let e=n.isHydrating?n.pendingBranch:n.activeBranch;e&&nW(e,t.clone(e));}else e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback);}else if(e.transition=t,e.type===r2&&k$1(e.children)){let n=rm(e.children,false);n&&nW(n,t);}}function nK(e,t=false,n){let l=[],r=0;for(let i=0;i<e.length;i++){let o=e[i],s=null==n?o.key:String(n)+String(null!=o.key?o.key:i);o.type===r2?(128&o.patchFlag&&r++,l=l.concat(nK(o.children,t,s))):(t||o.type!==r8)&&l.push(null!=s?ig(o,{key:s}):o);}if(r>1)for(let e=0;e<l.length;e++)l[e].patchFlag=-2;return l}function nz(e){if(e.component)return nz(e.component.subTree);if(e.type===r2){let t=k$1(e.children)&&rm(e.children,false);return t?nz(t):void 0}if(e.type!==r8)return e}function nq(e,t){return T$1(e)?S$1({name:e.name},t,{setup:e}):e}function nX(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0];}function nZ(e,t){let n;return !!((n=Object.getOwnPropertyDescriptor(e,t))&&!n.configurable)}let nY=new WeakMap;function nQ(e,t,n,l,r=false){if(k$1(e))return void e.forEach((e,i)=>nQ(e,t&&(k$1(t)?t[i]:t),n,l,r));if(ls(l)&&!r){512&l.shapeFlag&&l.type.__asyncResolved&&l.component.subTree.component&&nQ(e,t,n,l.component.subTree);return}let i=4&l.shapeFlag?iB(l.component):l.el,o=r?null:i,{i:s,r:a}=e,u=t&&t.r,c=s.refs===g$1?s.refs={}:s.refs,f=s.setupState,d=t_(f),p=f===g$1?_$1:e=>!nZ(c,e)&&w$1(d,e),h=(e,t)=>!(t&&nZ(c,t));if(null!=u&&u!==a&&(n0(t),E$1(u)?(c[u]=null,p(u)&&(f[u]=null)):tC(u)&&(h(u,t.k)&&(u.value=null),t.k&&(c[t.k]=null))),T$1(a))tG(a,s,12,[o,c]);else {let t=E$1(a),l=tC(a);if(t||l){let s=()=>{if(e.f){let n=t?p(a)?f[a]:c[a]:h()||!e.k?a.value:c[e.k];if(r)k$1(n)&&C$1(n,i);else if(k$1(n))n.includes(i)||n.push(i);else if(t)c[a]=[i],p(a)&&(f[a]=c[a]);else {let t=[i];h(a,e.k)&&(a.value=t),e.k&&(c[e.k]=t);}}else t?(c[a]=o,p(a)&&(f[a]=o)):l&&(h(a,e.k)&&(a.value=o),e.k&&(c[e.k]=o));};if(o){let t=()=>{s(),nY.delete(e);};t.id=-1,nY.set(e,t),rL(t,n);}else n0(e),s();}}}function n0(e){let t=nY.get(e);t&&(t.flags|=8,nY.delete(e));}z$1().requestIdleCallback||(e=>setTimeout(e,1));z$1().cancelIdleCallback||(e=>clearTimeout(e));let ls=e=>!!e.type.__asyncLoader;let lc=e=>e.type.__isKeepAlive;function lp(e,t){lg(e,"a",t);}function lh(e,t){lg(e,"da",t);}function lg(e,t,n=iE){let l=e.__wdc||(e.__wdc=()=>{let t=n;for(;t;){if(t.isDeactivated)return;t=t.parent;}return e()});if(l_(t,l,n),n){let e=n.parent;for(;e&&e.parent;)lc(e.parent.vnode)&&function(e,t,n,l){let r=l_(t,e,l,true);l_("um",()=>C$1(l[t],r),n).flags=16;}(l,t,n,e),e=e.parent;}}function l_(e,t,n=iE,l=false){if(n){let r=n[e]||(n[e]=[]),i=t.__weh||(t.__weh=(...l)=>{eR();let r=iR(n),i=tX(t,n,e,l);return r(),eO(),i});return l?r.unshift(i):r.push(i),i}}let ly=e=>(t,n=iE)=>{iP&&"sp"!==e||l_(e,(...e)=>t(...e),n);},lb=ly("bm"),lS=ly("m"),lC=ly("bu"),lx=ly("u"),lw=ly("bum"),lk=ly("um"),lT=ly("sp"),lE=ly("rtg"),lA=ly("rtc");function lR(e,t=iE){l_("ec",e,t);}let lO="components";function lN(e,t){return lL(lO,e,true,t)||e}let lP=Symbol.for("v-ndc");function lL(e,t,n=true,l=false){let r=nn||iE;if(r){let n=r.type;{let e=i$(n,false);if(e&&(e===t||e===F$1(t)||e===D$1(F$1(t))))return n}let i=lF(r[e]||n[e],t)||lF(r.appContext[e],t);return !i&&l?n:i}}function lF(e,t){return e&&(e[t]||e[F$1(t)]||e[D$1(F$1(t))])}function lj(e,t,n,l){let r,i=n,o=k$1(e);if(o||E$1(e)){let n=o&&th(e),l=false,s=false;n&&(l=!tv(e),s=tg(e),e=e$(e)),r=Array(e.length);for(let n=0,o=e.length;n<o;n++)r[n]=t(l?s?tS(tb(e[n])):tb(e[n]):e[n],n,void 0,i);}else if("number"==typeof e)if(!Number.isInteger(e)||e<0)r=[];else {r=Array(e);for(let n=0;n<e;n++)r[n]=t(n+1,n,void 0,i);}else if(R$1(e))if(e[Symbol.iterator])r=Array.from(e,(e,n)=>t(e,n,void 0,i));else {let n=Object.keys(e);r=Array(n.length);for(let l=0,o=n.length;l<o;l++){let o=n[l];r[l]=t(e[o],o,l,i);}}else r=[];return r}function lD(e,t,n,l,r,i){let o;if(null==n&&(n={}),nn.ce||nn.parent&&ls(nn.parent)&&nn.parent.ce){let e=n,r=Object.keys(e).length>0;return r9(),ii(r2,null,[ip("slot",e,l)],r?-2:64)}let s=e[t];s&&s._c&&(s._d=false);let a=r3.length;r9();try{let r=s&&lU(s(n)),a=n.key||i||r&&r.key;o=ii(r2,{key:(a&&!A$1(a)?a:`_${t}`)+(!r&&l?"_fb":"")},r||(l?l():[]),r&&1===e._?64:-2);}catch(e){for(let e=r3.length;e>a;e--)r7();throw e}finally{s&&s._c&&(s._d=true);}return !r&&o.scopeId&&(o.slotScopeIds=[o.scopeId+"-s"]),o}function lU(e){return e.some(e=>!io(e)||e.type!==r8&&(e.type!==r2||!!lU(e.children)))?e:null}let l$=e=>e?iN(e)?iB(e):l$(e.parent):null,lH=S$1(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>l$(e.parent),$root:e=>l$(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>re$1(e),$forceUpdate:e=>e.f||(e.f=()=>{t4(e.update);}),$nextTick:e=>e.n||(e.n=t8.bind(e.proxy)),$watch:e=>nS.bind(e)}),lW=(e,t)=>e!==g$1&&!e.__isScriptSetup&&w$1(e,t),lK={get({_:e},t){let n,l;if("__v_skip"===t)return  true;let{ctx:r,setupState:i,data:o,props:s,accessCache:a,type:u,appContext:c}=e;if("$"!==t[0]){let e=a[t];if(void 0!==e)switch(e){case 1:return i[t];case 2:return o[t];case 4:return r[t];case 3:return s[t]}else {if(lW(i,t))return a[t]=1,i[t];if(o!==g$1&&w$1(o,t))return a[t]=2,o[t];if(w$1(s,t))return a[t]=3,s[t];if(r!==g$1&&w$1(r,t))return a[t]=4,r[t];l9&&(a[t]=0);}}let f=lH[t];return f?("$attrs"===t&&eD(e.attrs,"get",""),f(e)):(n=u.__cssModules)&&(n=n[t])?n:r!==g$1&&w$1(r,t)?(a[t]=4,r[t]):w$1(l=c.config.globalProperties,t)?l[t]:void 0},set({_:e},t,n){let{data:l,setupState:r,ctx:i}=e;return lW(r,t)?(r[t]=n,true):l!==g$1&&w$1(l,t)?(l[t]=n,true):!w$1(e.props,t)&&!("$"===t[0]&&t.slice(1)in e)&&(i[t]=n,true)},has({_:{data:e,setupState:t,accessCache:n,ctx:l,appContext:r,props:i,type:o}},s){let a;return !!(n[s]||e!==g$1&&"$"!==s[0]&&w$1(e,s)||lW(t,s)||w$1(i,s)||w$1(l,s)||w$1(lH,s)||w$1(r.config.globalProperties,s)||(a=o.__cssModules)&&a[s])},defineProperty(e,t,n){return null!=n.get?e._.accessCache[t]=0:w$1(n,"value")&&this.set(e,t,n.value,null),Reflect.defineProperty(e,t,n)}};S$1({},lK,{get(e,t){if(t!==Symbol.unscopables)return lK.get(e,t,e)},has:(e,t)=>"_"!==t[0]&&!q$1(t)});function l6(e){return k$1(e)?e.reduce((e,t)=>(e[t]=null,e),{}):e}let l9=true;function l7(e,t,n){tX(k$1(e)?e.map(e=>e.bind(t.proxy)):e.bind(t.proxy),t,n);}function re$1(e){let t,n=e.type,{mixins:l,extends:r}=n,{mixins:i,optionsCache:o,config:{optionMergeStrategies:s}}=e.appContext,a=o.get(n);return a?t=a:i.length||l||r?(t={},i.length&&i.forEach(e=>rt$1(t,e,s,true)),rt$1(t,n,s)):t=n,R$1(n)&&o.set(n,t),t}function rt$1(e,t,n,l=false){let{mixins:r,extends:i}=t;for(let o in i&&rt$1(e,i,n,true),r&&r.forEach(t=>rt$1(e,t,n,true)),t)if(l&&"expose"===o);else {let l=rn[o]||n&&n[o];e[o]=l?l(e[o],t[o]):t[o];}return e}let rn={data:rl,props:rs,emits:rs,methods:ro,computed:ro,beforeCreate:ri,created:ri,beforeMount:ri,mounted:ri,beforeUpdate:ri,updated:ri,beforeDestroy:ri,beforeUnmount:ri,destroyed:ri,unmounted:ri,activated:ri,deactivated:ri,errorCaptured:ri,serverPrefetch:ri,components:ro,directives:ro,watch:function(e,t){if(!e)return t;if(!t)return e;let n=S$1(Object.create(null),e);for(let l in t)n[l]=ri(e[l],t[l]);return n},provide:rl,inject:function(e,t){return ro(rr(e),rr(t))}};function rl(e,t){return t?e?function(){return S$1(T$1(e)?e.call(this,this):e,T$1(t)?t.call(this,this):t)}:t:e}function rr(e){if(k$1(e)){let t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function ri(e,t){return e?[...new Set([].concat(e,t))]:t}function ro(e,t){return e?S$1(Object.create(null),e,t):t}function rs(e,t){return e?k$1(e)&&k$1(t)?[...new Set([...e,...t])]:S$1(Object.create(null),l6(e),l6(null!=t?t:{})):t}function ra(){return {app:null,config:{isNativeTag:_$1,performance:false,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let ru=0,rc=null;let rd=(e,t)=>"modelValue"===t||"model-value"===t?e.modelModifiers:e[`${t}Modifiers`]||e[`${F$1(t)}Modifiers`]||e[`${V$1(t)}Modifiers`];function rp(e,t,...n){let l;if(e.isUnmounted)return;let r=e.vnode.props||g$1,i=n,o=t.startsWith("update:"),s=o&&rd(r,t.slice(7));s&&(s.trim&&(i=n.map(e=>E$1(e)?e.trim():e)),s.number&&(i=i.map(W$1)));let a=r[l=U$1(t)]||r[l=U$1(F$1(t))];!a&&o&&(a=r[l=U$1(V$1(t))]),a&&tX(a,e,6,i);let u=r[l+"Once"];if(u){if(e.emitted){if(e.emitted[l])return}else e.emitted={};e.emitted[l]=true,tX(u,e,6,i);}}let rh=new WeakMap;function rg(e,t){return !!e&&!!y$1(t)&&(w$1(e,(t="Once"===(t=t.slice(2))?t:t.replace(/Once$/,""))[0].toLowerCase()+t.slice(1))||w$1(e,V$1(t))||w$1(e,t))}function rv(e){let t,n,{type:l,vnode:r,proxy:i,withProxy:o,propsOptions:[s],slots:a,attrs:u,emit:c,render:f,renderCache:d,props:p,data:h,setupState:g,ctx:v,inheritAttrs:m}=e,_=nr(e);try{if(4&r.shapeFlag){let e=o||i;t=iy(f.call(e,e,d,p,g,h,v)),n=u;}else t=iy(l.length>1?l(p,{attrs:u,slots:a,emit:c}):l(p,null)),n=l.props?u:r_(u);}catch(n){r3.length=0,tJ(n,e,1),t=ip(r8);}let y=t;if(n&&false!==m){let e=Object.keys(n),{shapeFlag:t}=y;e.length&&7&t&&(s&&e.some(b$1)&&(n=ry(n,s)),y=ig(y,n,false,true));}return r.dirs&&((y=ig(y,null,false,true)).dirs=y.dirs?y.dirs.concat(r.dirs):r.dirs),r.transition&&nW(y.type.__isTeleport&&nH(y)||y,r.transition),t=y,nr(_),t}function rm(e,t=true){let n;for(let t=0;t<e.length;t++){let l=e[t];if(!io(l))return;if(l.type!==r8||"v-if"===l.children)if(n)return;else n=l;}return n}let r_=e=>{let t;for(let n in e)("class"===n||"style"===n||y$1(n))&&((t||(t={}))[n]=e[n]);return t},ry=(e,t)=>{let n={};for(let l in e)b$1(l)&&l.slice(9)in t||(n[l]=e[l]);return n};function rb(e,t,n){let l=Object.keys(t);if(l.length!==Object.keys(e).length)return  true;for(let r=0;r<l.length;r++){let i=l[r];if(!w$1(e,i)||rS(t,e,i)&&!rg(n,i))return  true}return  false}function rS(e,t,n){let l=e[n],r=t[n];return "style"===n&&R$1(l)&&R$1(r)?!ei(l,r):l!==r}function rC({vnode:e,parent:t,suspense:n},l){for(;t;){let n=t.subTree;if(n.suspense&&n.suspense.activeBranch===e&&(n.suspense.vnode.el=n.el=l,e=n),n===e)(e=t.vnode).el=l,t=t.parent;else break}n&&n.activeBranch===e&&(n.vnode.el=l);}let rx={},rw=e=>Object.getPrototypeOf(e)===rx;function rk(e,t,n,l){let r,[i,o]=e.propsOptions,s=false;if(t)for(let a in t){let u;if(M$1(a))continue;let c=t[a];i&&w$1(i,u=F$1(a))?o&&o.includes(u)?(r||(r={}))[u]=c:n[u]=c:rg(e.emitsOptions,a)||a in l&&c===l[a]||(l[a]=c,s=true);}if(o){let t=t_(n),l=r||g$1;for(let r=0;r<o.length;r++){let s=o[r];n[s]=rT(i,t,s,l[s],e,!w$1(l,s));}}return s}function rT(e,t,n,l,r,i){let o=e[n];if(null!=o){let e=w$1(o,"default");if(e&&void 0===l){let e=o.default;if(o.type!==Function&&!o.skipFactory&&T$1(e)){let{propsDefaults:i}=r;if(n in i)l=i[n];else {let o=iR(r);l=i[n]=e.call(null,t),o();}}else l=e;r.ce&&r.ce._setProp(n,l);}o[0]&&(i&&!e?l=false:o[1]&&(""===l||l===V$1(n))&&(l=true));}return l}let rE=new WeakMap;function rA(e){return !("$"===e[0]||M$1(e))}let rR=e=>"_"===e||"_ctx"===e||"$stable"===e,rO=e=>k$1(e)?e.map(iy):[iy(e)],rN=(e,t,n)=>{if(t._n)return t;let l=na((...e)=>rO(t(...e)),n);return l._c=false,l},rP=(e,t,n)=>{let l=e._ctx;for(let n in e){if(rR(n))continue;let r=e[n];if(T$1(r))t[n]=rN(n,r,l);else if(null!=r){let e=rO(r);t[n]=()=>e;}}},rM=(e,t)=>{let n=rO(t);e.slots.default=()=>n;},rI=(e,t,n)=>{for(let l in t)(n||!rR(l))&&(e[l]=t[l]);},rL=r0;function rF(e){return rV(e)}function rV(e,t){var n;let l,r;z$1().__VUE__=true;let{insert:i,remove:o,patchProp:s,createElement:a,createText:u,createComment:c,setText:f,setElementText:d,parentNode:p,nextSibling:h,setScopeId:_=m$1,insertStaticContent:y}=e,b=(e,t,n,l=null,r=null,i=null,o,s=null,a=!!t.dynamicChildren)=>{if(e===t)return;e&&!is(e,t)&&(l=et(e),J(e,r,i,true),e=null),-2===t.patchFlag&&(a=false,t.dynamicChildren=null),t.dynamicChildren&&e&&e.dynamicChildren&&e.dynamicChildren.hasOnce&&(t.dynamicChildren===v$1&&(t.dynamicChildren=[]),t.dynamicChildren.hasOnce=true);let{type:u,ref:c,shapeFlag:f}=t;switch(u){case r6:C(e,t,n,l);break;case r8:x(e,t,n,l);break;case r4:null==e&&k(t,n,l,o);break;case r2:j(e,t,n,l,r,i,o,s,a);break;default:1&f?E(e,t,n,l,r,i,o,s,a):6&f?D(e,t,n,l,r,i,o,s,a):64&f?u.process(e,t,n,l,r,i,o,s,a,el):128&f&&u.process(e,t,n,l,r,i,o,s,a,el);}null!=c&&r?nQ(c,e&&e.ref,i,t||e,!t):null==c&&e&&null!=e.ref&&nQ(e.ref,null,i,e,true);},C=(e,t,n,l)=>{if(null==e)i(t.el=u(t.children),n,l);else {let n=t.el=e.el;t.children!==e.children&&f(n,t.children);}},x=(e,t,n,l)=>{null==e?i(t.el=c(t.children||""),n,l):t.el=e.el;},k=(e,t,n,l)=>{[e.el,e.anchor]=y(e.children,t,n,l,e.el,e.anchor);},E=(e,t,n,l,r,i,o,s,a)=>{if("svg"===t.type?o="svg":"math"===t.type&&(o="mathml"),null==e)A(t,n,l,r,i,o,s,a);else {let n=e.el&&e.el._isVueCE?e.el:null;try{n&&n._beginPatch(),P(e,t,r,i,o,s,a);}finally{n&&n._endPatch();}}},A=(e,t,n,l,r,o,u,c)=>{let f,p,{props:h,shapeFlag:g,transition:v,dirs:m}=e;if(f=e.el=a(e.type,o,h&&h.is,h),8&g?d(f,e.children):16&g&&N(e.children,f,null,l,r,rD(e,o),u,c),m&&nc(e,null,l,"created"),O(f,e,e.scopeId,u,l),h){for(let e in h)"value"===e||M$1(e)||s(f,e,null,h[e],o,l);"value"in h&&s(f,"value",null,h.value,o),(p=h.onVnodeBeforeMount)&&ix(p,l,e);}m&&nc(e,null,l,"beforeMount");let _=rB(r,v);_?v.beforeEnter(f):v&&!v.persisted&&(f[rq]=true),i(f,t,n),((p=h&&h.onVnodeMounted)||_||m)&&rL(()=>{p&&ix(p,l,e),_&&v.enter(f),m&&nc(e,null,l,"mounted");},r);},O=(e,t,n,l,r)=>{if(n&&_(e,n),l)for(let t=0;t<l.length;t++)_(e,l[t]);if(r){let n=r.subTree;if(t===n||rK(n.type)&&(n.ssContent===t||n.ssFallback===t)){let t=r.vnode;O(e,t,t.scopeId,t.slotScopeIds,r.parent);}}},N=(e,t,n,l,r,i,o,s,a=0)=>{for(let u=a;u<e.length;u++)b(null,e[u]=s?ib(e[u]):iy(e[u]),t,n,l,r,i,o,s);},P=(e,t,n,l,r,i,o)=>{let a,u=t.el=e.el,{patchFlag:c,dynamicChildren:f,dirs:p}=t;c|=16&e.patchFlag;let h=e.props||g$1,v=t.props||g$1;if(n&&rU(n,false),(a=v.onVnodeBeforeUpdate)&&ix(a,n,t,e),p&&nc(t,e,n,"beforeUpdate"),n&&rU(n,true),f&&(!e.dynamicChildren||e.dynamicChildren.length!==f.length)&&(c=0,o=false,f=null),(h.innerHTML&&null==v.innerHTML||h.textContent&&null==v.textContent)&&d(u,""),f?I(e.dynamicChildren,f,u,n,l,rD(t,r),i):o||K(e,t,u,null,n,l,rD(t,r),i,false),c>0){if(16&c)L(u,h,v,n,r);else if(2&c&&h.class!==v.class&&s(u,"class",null,v.class,r),4&c&&s(u,"style",h.style,v.style,r),8&c){let e=t.dynamicProps;for(let t=0;t<e.length;t++){let l=e[t],i=h[l],o=v[l];(o!==i||"value"===l)&&s(u,l,i,o,r,n);}}1&c&&e.children!==t.children&&d(u,t.children);}else o||null!=f||L(u,h,v,n,r);((a=v.onVnodeUpdated)||p)&&rL(()=>{a&&ix(a,n,t,e),p&&nc(t,e,n,"updated");},l);},I=(e,t,n,l,r,i,o)=>{for(let s=0;s<t.length;s++){let a=e[s],u=t[s],c=a.el||rW(a),f=c&&(a.type===r2||!is(a,u)||198&a.shapeFlag)?p(c):n;b(a,u,f,null,l,r,i,o,true);}},L=(e,t,n,l,r)=>{if(t!==n){if(t!==g$1)for(let i in t)M$1(i)||i in n||s(e,i,t[i],null,r,l);for(let i in n){if(M$1(i))continue;let o=n[i],a=t[i];o!==a&&"value"!==i&&s(e,i,a,o,r,l);}"value"in n&&s(e,"value",t.value,n.value,r);}},j=(e,t,n,l,r,o,s,a,c)=>{let f=t.el=e?e.el:u(""),d=t.anchor=e?e.anchor:u(""),{patchFlag:p,dynamicChildren:h,slotScopeIds:g}=t;g&&(a=a?a.concat(g):g),null==e?(i(f,n,l),i(d,n,l),N(t.children||[],n,d,r,o,s,a,c)):p>0&&64&p&&h&&e.dynamicChildren&&e.dynamicChildren.length===h.length?(I(e.dynamicChildren,h,n,r,o,s,a),(null!=t.key||r&&t===r.subTree)&&r$(e,t,true)):K(e,t,n,d,r,o,s,a,c);},D=(e,t,n,l,r,i,o,s,a)=>{t.slotScopeIds=s,null==e?512&t.shapeFlag?r.ctx.activate(t,n,l,o,a):U(t,n,l,r,i,o,a):B(e,t,a);},U=(e,t,n,l,r,i,o)=>{let s=e.component=iT(e,l,r);if(lc(e)&&(s.ctx.renderer=el),iM(s,false,o),s.asyncDep){if(r&&r.registerDep(s,H,o,i),!e.el){let l=s.subTree=ip(r8);x(null,l,t,n),e.placeholder=l.el;}}else H(s,e,t,n,r,i,o);},B=(e,t,n)=>{let l=t.component=e.component;if(function(e,t,n){let{props:l,children:r,component:i}=e,{props:o,children:s,patchFlag:a}=t,u=i.emitsOptions;if(t.dirs||t.transition)return  true;if(!n||!(a>=0))return (!!r||!!s)&&(!s||!s.$stable)||l!==o&&(l?!o||rb(l,o,u):!!o);if(1024&a)return  true;if(16&a)return l?rb(l,o,u):!!o;if(8&a){let e=t.dynamicProps;for(let t=0;t<e.length;t++){let n=e[t];if(rS(o,l,n)&&!rg(u,n))return  true}}return  false}(e,t,n))if(l.asyncDep&&!l.asyncResolved){t.el=e.el,t.placeholder=e.placeholder,W(l,t,n);return}else l.next=t,l.update();else t.el=e.el,t.placeholder=e.placeholder,l.vnode=t;},H=(e,t,n,l,i,o,s)=>{e.scope.on();let a=e.effect=new ev(()=>{if(e.isMounted){let t,{next:n,bu:l,u:r,parent:a,vnode:c}=e;{let t=function e(t){let n=t.subTree.component;if(n)if(n.asyncDep&&!n.asyncResolved)return n;else return e(n)}(e);if(t){n&&(n.el=c.el,W(e,n,s)),t.asyncDep.then(()=>{let t=()=>{8&e.job.flags||(i&&i.pendingBranch?rL(t,i):u());};t.flags=48,rL(t,i);});return}}let f=n;rU(e,false),n?(n.el=c.el,W(e,n,s)):n=c,l&&$$1(l),(t=n.props&&n.props.onVnodeBeforeUpdate)&&ix(t,a,n,c),rU(e,true);let d=rv(e),h=e.subTree;e.subTree=d,b(h,d,p(h.el||rW(h)),et(h),e,i,o),n.el=d.el,null===f&&rC(e,d.el),r&&rL(r,i),(t=n.props&&n.props.onVnodeUpdated)&&rL(()=>ix(t,a,n,c),i);}else {let s,{el:a,props:u}=t,{bm:c,m:f,parent:d,root:p,type:h}=e,g=ls(t);if(rU(e,false),c&&$$1(c),!g&&(s=u&&u.onVnodeBeforeMount)&&ix(s,d,t),rU(e,true),a&&r);else {p.ce&&p.ce._hasShadowRoot()&&p.ce._injectChildStyle(h,e.parent?e.parent.type:void 0);let r=e.subTree=rv(e);b(null,r,n,l,e,i,o),t.el=r.el;}if(f&&rL(f,i),!g&&(s=u&&u.onVnodeMounted)){let e=t;rL(()=>ix(s,d,e),i);}(256&t.shapeFlag||d&&ls(d.vnode)&&256&d.vnode.shapeFlag)&&e.a&&rL(e.a,i),e.isMounted=true,t=n=l=null;}});e.scope.off();let u=e.update=a.run.bind(a),c=e.job=a.runIfDirty.bind(a);c.i=e,c.id=e.uid,a.scheduler=()=>t4(c),rU(e,true),u();},W=(e,t,n)=>{t.component=e;let l=e.vnode.props;e.vnode=t,e.next=null,function(e,t,n,l){let{props:r,attrs:i,vnode:{patchFlag:o}}=e,s=t_(r),[a]=e.propsOptions,u=false;if((l||o>0)&&!(16&o)){if(8&o){let n=e.vnode.dynamicProps;for(let l=0;l<n.length;l++){let o=n[l];if(rg(e.emitsOptions,o))continue;let c=t[o];if(a)if(w$1(i,o))c!==i[o]&&(i[o]=c,u=true);else {let t=F$1(o);r[t]=rT(a,s,t,c,e,false);}else c!==i[o]&&(i[o]=c,u=true);}}}else {let l;for(let o in rk(e,t,r,i)&&(u=true),s)t&&(w$1(t,o)||(l=V$1(o))!==o&&w$1(t,l))||(a?n&&(void 0!==n[o]||void 0!==n[l])&&(r[o]=rT(a,s,o,void 0,e,true)):delete r[o]);if(i!==s)for(let e in i)t&&w$1(t,e)||(delete i[e],u=true);}u&&eU(e.attrs,"set","");}(e,t.props,l,n),((e,t,n)=>{let{vnode:l,slots:r}=e,i=true,o=g$1;if(32&l.shapeFlag){let e=t._;e?n&&1===e?i=false:rI(r,t,n):(i=!t.$stable,rP(t,r)),o=t;}else t&&(rM(e,t),o={default:1});if(i)for(let e in r)rR(e)||null!=o[e]||delete r[e];})(e,t.children,n),eR(),t9(e),eO();},K=(e,t,n,l,r,i,o,s,a=false)=>{let u=e&&e.children,c=e?e.shapeFlag:0,f=t.children,{patchFlag:p,shapeFlag:h}=t;if(p>0){if(128&p)return void G(u,f,n,l,r,i,o,s,a);else if(256&p)return void q(u,f,n,l,r,i,o,s,a)}8&h?(16&c&&ee(u,r,i),f!==u&&d(n,f)):16&c?16&h?G(u,f,n,l,r,i,o,s,a):ee(u,r,i,true):(8&c&&d(n,""),16&h&&N(f,n,l,r,i,o,s,a));},q=(e,t,n,l,r,i,o,s,a)=>{let u;e=e||v$1,t=t||v$1;let c=e.length,f=t.length,d=Math.min(c,f);for(u=0;u<d;u++){let l=t[u]=a?ib(t[u]):iy(t[u]);b(e[u],l,n,null,r,i,o,s,a);}c>f?ee(e,r,i,true,false,d):N(t,n,l,r,i,o,s,a,d);},G=(e,t,n,l,r,i,o,s,a)=>{let u=0,c=t.length,f=e.length-1,d=c-1;for(;u<=f&&u<=d;){let l=e[u],c=t[u]=a?ib(t[u]):iy(t[u]);if(is(l,c))b(l,c,n,null,r,i,o,s,a);else break;u++;}for(;u<=f&&u<=d;){let l=e[f],u=t[d]=a?ib(t[d]):iy(t[d]);if(is(l,u))b(l,u,n,null,r,i,o,s,a);else break;f--,d--;}if(u>f){if(u<=d){let e=d+1,f=e<c?t[e].el:l;for(;u<=d;)b(null,t[u]=a?ib(t[u]):iy(t[u]),n,f,r,i,o,s,a),u++;}}else if(u>d)for(;u<=f;)J(e[u],r,i,true),u++;else {let p,h=u,g=u,m=new Map;for(u=g;u<=d;u++){let e=t[u]=a?ib(t[u]):iy(t[u]);null!=e.key&&m.set(e.key,u);}let _=0,y=d-g+1,S=false,C=0,x=Array(y);for(u=0;u<y;u++)x[u]=0;for(u=h;u<=f;u++){let l,c=e[u];if(_>=y){J(c,r,i,true);continue}if(null!=c.key)l=m.get(c.key);else for(p=g;p<=d;p++)if(0===x[p-g]&&is(c,t[p])){l=p;break} void 0===l?J(c,r,i,true):(x[l-g]=u+1,l>=C?C=l:S=true,b(c,t[l],n,null,r,i,o,s,a),_++);}let w=S?function(e){let t,n,l,r,i,o=e.slice(),s=[0],a=e.length;for(t=0;t<a;t++){let a=e[t];if(0!==a){if(e[n=s[s.length-1]]<a){o[t]=n,s.push(t);continue}for(l=0,r=s.length-1;l<r;)e[s[i=l+r>>1]]<a?l=i+1:r=i;a<e[s[l]]&&(l>0&&(o[t]=s[l-1]),s[l]=t);}}for(l=s.length,r=s[l-1];l-- >0;)s[l]=r,r=o[r];return s}(x):v$1;for(p=w.length-1,u=y-1;u>=0;u--){let e=g+u,f=t[e],d=t[e+1],h=e+1<c?d.el||rW(d):l;0===x[u]?b(null,f,n,h,r,i,o,s,a):S&&(p<0||u!==w[p]?X(f,n,h,2):p--);}}},X=(e,t,n,l,r=null)=>{let{el:s,type:a,transition:u,children:c,shapeFlag:f}=e;if(6&f)return void X(e.component.subTree,t,n,l);if(128&f)return void e.suspense.move(t,n,l);if(64&f)return void a.move(e,t,n,el);if(a===r2){i(s,t,n);for(let e=0;e<c.length;e++)X(c[e],t,n,l);i(e.anchor,t,n);return}if(a===r4)return void(({el:e,anchor:t},n,l)=>{let r;for(;e&&e!==t;)r=h(e),i(e,n,l),e=r;i(t,n,l);})(e,t,n);if(2!==l&&1&f&&u)if(0===l)u.persisted&&!s[nM]?i(s,t,n):(u.beforeEnter(s),i(s,t,n),rL(()=>u.enter(s),r));else {let{leave:l,delayLeave:r,afterLeave:a}=u,c=()=>{e.ctx.isUnmounted?o(s):i(s,t,n);},f=()=>{let e=s._isLeaving||!!s[nM];s._isLeaving&&s[nM](true),u.persisted&&!e?c():l(s,()=>{c(),a&&a();});};r?r(s,c,f):f();}else i(s,t,n);},J=(e,t,n,l=false,r=false)=>{let i,{type:o,props:s,ref:a,children:u,dynamicChildren:c,shapeFlag:f,patchFlag:d,dirs:p,cacheIndex:h,memo:g}=e;if((-2===d||c&&c.hasOnce)&&(r=false),null!=a&&(eR(),nQ(a,null,n,e,true),eO()),null==h||e.ctx&&e.ctx!==t||(t.renderCache[h]=void 0),256&f&&t.ctx.deactivate(e))return;let v=1&f&&p,m=!ls(e);if(m&&(i=s&&s.onVnodeBeforeUnmount)&&ix(i,t,e),6&f)Q(e.component,n,l);else {if(128&f)return void e.suspense.unmount(n,l);v&&nc(e,null,t,"beforeUnmount"),64&f?e.type.remove(e,t,n,el,l):c&&!c.hasOnce&&(o!==r2||d>0&&64&d)?ee(c,t,n,false,true):(o===r2&&384&d||!r&&16&f)&&ee(u,t,n),l&&Z(e);}let _=null!=g&&null==h;(m&&(i=s&&s.onVnodeUnmounted)||v||_)&&rL(()=>{i&&ix(i,t,e),v&&nc(e,null,t,"unmounted"),_&&(e.el=null);},n);},Z=e=>{let{type:t,el:n,anchor:l,transition:r}=e,i=t===r2;if(i&&!r)return void Y(n,l);if(t===r4){(({el:e,anchor:t})=>{let n;for(;e&&e!==t;)n=h(e),o(e),e=n;o(t);})(e),r&&!r.persisted&&r.afterLeave&&r.afterLeave();return}let s=i?nz(e):e,a=()=>{i?p(n)&&Y(n,l):o(n),r&&!r.persisted&&r.afterLeave&&r.afterLeave();};if(s&&1&s.shapeFlag&&r&&!r.persisted){let{leave:e,delayLeave:t}=r,n=s.el,l=()=>e(n,a);t?t(n,a,l):l();}else a();},Y=(e,t)=>{let n;for(;e!==t;)n=h(e),o(e),e=n;o(t);},Q=(e,t,n)=>{let{bum:l,scope:r,job:i,subTree:o,um:s,m:a,a:u}=e;rH(a),rH(u),l&&$$1(l),r.stop(),i?(i.flags|=8,J(o,e,t,n)):o&&(o.transition=e.vnode.transition,J(o,e,t,n)),s&&rL(s,t);let c=()=>{e.isUnmounted=true;};c.flags=16,rL(c,t);},ee=(e,t,n,l=false,r=false,i=0)=>{for(let o=i;o<e.length;o++)J(e[o],t,n,l,r);},et=e=>{if(6&e.shapeFlag)return et(e.component.subTree);if(128&e.shapeFlag)return e.suspense.next();let t=h(e.anchor||e.el),n=t&&t[nw];return n?h(n):t},en=(e,t,n)=>{!function(e,t){if(ne$1)return e();let n=void 0===t?void 0:new Set(tQ);e(),ne$1=true;try{t9(void 0,t),t7(void 0,n,t);}finally{ne$1=false;}}(()=>{null==e?t._vnode&&J(t._vnode,null,null,true):b(t._vnode||null,e,t,null,null,null,n),t._vnode=e;},e&&t._vnode?void 0:e&&e.component?e.component.uid:ik);},el={p:b,um:J,m:X,r:Z,mt:U,mc:N,pc:K,pbc:I,n:et,o:e};return {render:en,hydrate:l,createApp:(n=l,function(e,t=null){T$1(e)||(e=S$1({},e)),null==t||R$1(t)||(t=null);let l=ra(),r=new WeakSet,i=[],o=false,s=l.app={_uid:ru++,_component:e,_props:t,_container:null,_context:l,_instance:null,version:iG,get config(){return l.config},set config(e){},use:(e,...t)=>(r.has(e)||(e&&T$1(e.install)?(r.add(e),e.install(s,...t)):T$1(e)&&(r.add(e),e(s,...t))),s),mixin:e=>(l.mixins.includes(e)||l.mixins.push(e),s),component:(e,t)=>t?(l.components[e]=t,s):l.components[e],directive:(e,t)=>t?(l.directives[e]=t,s):l.directives[e],mount(r,i,a){if(!o){let u=s._ceVNode||ip(e,t);return u.appContext=l,true===a?a="svg":false===a&&(a=void 0),i&&n?n(u,r):en(u,r,a),o=true,s._container=r,r.__vue_app__=s,iB(u.component)}},onUnmount(e){i.push(e);},unmount(){o&&(tX(i,s._instance,16),en(null,s._container),delete s._container.__vue_app__);},provide:(e,t)=>(l.provides[e]=t,s),runWithContext(e){let t=rc;rc=s;try{return e()}finally{rc=t;}}};return s})}}function rD({type:e,props:t},n){return "svg"===n&&"foreignObject"===e||"mathml"===n&&"annotation-xml"===e&&t&&t.encoding&&t.encoding.includes("html")?void 0:n}function rU({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5);}function rB(e,t){return (!e||e&&!e.pendingBranch)&&t&&!t.persisted}function r$(e,t,n=false){let l=e.children,r=t.children;if(k$1(l)&&k$1(r))for(let e=0;e<l.length;e++){let t=l[e],i=r[e];1&i.shapeFlag&&!i.dynamicChildren&&((i.patchFlag<=0||32===i.patchFlag)&&((i=r[e]=ib(r[e])).el=t.el),n||-2===i.patchFlag||r$(t,i)),i.type===r6&&(-1===i.patchFlag&&(i=r[e]=ib(i)),i.el=t.el),i.type!==r8||i.el||(i.el=t.el);}}function rH(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8;}function rW(e){if(e.placeholder)return e.placeholder;let t=e.component;if(t)return rW(t.subTree);let n=e.suspense;return n&&n.activeBranch?rW(n.activeBranch):null}let rK=e=>e.__isSuspense,rq=Symbol("_deferredEnter");function r0(e,t){t&&t.pendingBranch?k$1(e)?t.effects.push(...e):t.effects.push(e):t5(e);}let r2=Symbol.for("v-fgt"),r6=Symbol.for("v-txt"),r8=Symbol.for("v-cmt"),r4=Symbol.for("v-stc"),r3=[],r5=null;function r9(e=false){r3.push(r5=e?null:[]);}function r7(){r3.pop(),r5=r3[r3.length-1]||null;}let ie$1=1;function it$1(e,t=false){ie$1+=e,e<0&&r5&&t&&(r5.hasOnce=true);}function il(e){return e.dynamicChildren=ie$1>0?r5||v$1:null,r7(),ie$1>0&&r5&&r5.push(e),e}function ir(e,t,n,l,r,i){return il(id(e,t,n,l,r,i,true))}function ii(e,t,n,l,r){return il(ip(e,t,n,l,r,true))}function io(e){return !!e&&true===e.__v_isVNode}function is(e,t){return e.type===t.type&&e.key===t.key}let iu=({key:e})=>null!=e?e:null,ic=({ref:e,ref_key:t,ref_for:n})=>("number"==typeof e&&(e=""+e),null!=e?E$1(e)||tC(e)||T$1(e)?{i:nn,r:e,k:t,f:!!n}:e:null);function id(e,t=null,n=null,l=0,r=null,i=+(e!==r2),o=false,s=false){let a={__v_isVNode:true,__v_skip:true,type:e,props:t,key:t&&iu(t),ref:t&&ic(t),scopeId:nl,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:i,patchFlag:l,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:nn};return s?(iS(a,n),128&i&&e.normalize(a)):n&&(a.shapeFlag|=E$1(n)?8:16),ie$1>0&&!o&&r5&&(a.patchFlag>0||6&i)&&32!==a.patchFlag&&r5.push(a),a}let ip=function(e,t=null,n=null,l=0,r=null,i=false){var o;if(e&&e!==lP||(e=r8),io(e)){let l=ig(e,t,true);return n&&iS(l,n),ie$1>0&&!i&&r5&&(6&l.shapeFlag?r5[r5.indexOf(e)]=l:r5.push(l)),l.patchFlag=-2,l}if(T$1(o=e)&&"__vccOpts"in o&&(e=e.__vccOpts),t){let{class:e,style:n}=t=ih(t);e&&!E$1(e)&&(t.class=Y$1(e)),R$1(n)&&(tm(n)&&!k$1(n)&&(n=S$1({},n)),t.style=G$1(n));}let s=E$1(e)?1:rK(e)?128:e.__isTeleport?64:R$1(e)?4:2*!!T$1(e);return id(e,t,n,l,r,s,i,true)};function ih(e){return e?tm(e)?S$1({},e):rw(e)?S$1({},e[iV]||e):e:null}function ig(e,t,n=false,l=false){let{props:r,ref:i,patchFlag:o,children:s,transition:a}=e,u=t?iC(r||{},t):r,c={__v_isVNode:true,__v_skip:true,type:e.type,props:u,key:u&&iu(u),ref:t&&t.ref?n&&i?k$1(i)?i.concat(ic(t)):[i,ic(t)]:ic(t):i,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:s,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==r2?-1===o?16:16|o:o,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:a,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&ig(e.ssContent),ssFallback:e.ssFallback&&ig(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce,cacheIndex:e.cacheIndex};return a&&l&&nW(c,a.clone(c)),c}function iv(e=" ",t=0){return ip(r6,null,e,t)}function im(e,t){let n=ip(r4,null,e);return n.staticCount=t,n}function i_(e="",t=false){return t?(r9(),ii(r8,null,e)):ip(r8,null,e)}function iy(e){return null==e||"boolean"==typeof e?ip(r8):k$1(e)?ip(r2,null,e.slice()):io(e)?ib(e):ip(r6,null,String(e))}function ib(e){return null===e.el&&-1!==e.patchFlag||e.memo?e:ig(e)}function iS(e,t){let n=0,{shapeFlag:l}=e;if(null==t)t=null;else if(k$1(t))n=16;else if("object"==typeof t)if(65&l){let n=t.default;n&&(n._c&&(n._d=false),iS(e,n()),n._c&&(n._d=true));return}else {n=32;let l=t._;l||rw(t)?3===l&&nn&&(1===nn.slots._?t._=1:(t._=2,e.patchFlag|=1024)):t._ctx=nn;}else if(T$1(t)){if(65&l)return void iS(e,{default:t});t={default:t,_ctx:nn},n=32;}else t=String(t),64&l?(n=16,t=[iv(t)]):n=8;e.children=t,e.shapeFlag|=n;}function iC(...e){let t={};for(let n=0;n<e.length;n++){let l=e[n];for(let e in l)if("class"===e)t.class!==l.class&&(t.class=Y$1([t.class,l.class]));else if("style"===e)t.style=G$1([t.style,l.style]);else if(y$1(e)){let n=t[e],r=l[e];r&&n!==r&&!(k$1(n)&&n.includes(r))?t[e]=n?[].concat(n,r):r:null!=r||null!=n||b$1(e)||(t[e]=r);}else ""!==e&&(t[e]=l[e]);}return t}function ix(e,t,n,l=null){tX(e,t,7,[n,l]);}let iw=ra(),ik=0;function iT(e,t,n){let l=e.type,r=(t?t.appContext:e.appContext)||iw,i={uid:ik++,vnode:e,type:l,parent:t,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new ef(true),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(r.provides),ids:t?t.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:function e(t,n,l=false){let r=l?rE:n.propsCache,i=r.get(t);if(i)return i;let o=t.props,s={},a=[],u=false;if(!T$1(t)){let r=t=>{u=true;let[l,r]=e(t,n,true);S$1(s,l),r&&a.push(...r);};!l&&n.mixins.length&&n.mixins.forEach(r),t.extends&&r(t.extends),t.mixins&&t.mixins.forEach(r);}if(!o&&!u)return R$1(t)&&r.set(t,v$1),v$1;if(k$1(o))for(let e=0;e<o.length;e++){let t=F$1(o[e]);rA(t)&&(s[t]=g$1);}else if(o)for(let e in o){let t=F$1(e);if(rA(t)){let n=o[e],l=s[t]=k$1(n)||T$1(n)?{type:n}:S$1({},n),r=l.type,i=false,u=true;if(k$1(r))for(let e=0;e<r.length;++e){let t=r[e],n=T$1(t)&&t.name;if("Boolean"===n){i=true;break}"String"===n&&(u=false);}else i=T$1(r)&&"Boolean"===r.name;l[0]=i,l[1]=u,(i||w$1(l,"default"))&&a.push(t);}}let c=[s,a];return R$1(t)&&r.set(t,c),c}(l,r),emitsOptions:function e(t,n,l=false){let r=l?rh:n.emitsCache,i=r.get(t);if(void 0!==i)return i;let o=t.emits,s={},a=false;if(!T$1(t)){let r=t=>{let l=e(t,n,true);l&&(a=true,S$1(s,l));};!l&&n.mixins.length&&n.mixins.forEach(r),t.extends&&r(t.extends),t.mixins&&t.mixins.forEach(r);}return o||a?(k$1(o)?o.forEach(e=>s[e]=null):S$1(s,o),R$1(t)&&r.set(t,s),s):(R$1(t)&&r.set(t,null),null)}(l,r),emit:null,emitted:null,propsDefaults:g$1,inheritAttrs:l.inheritAttrs,ctx:g$1,data:g$1,props:g$1,attrs:g$1,slots:g$1,refs:g$1,setupState:g$1,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:false,isMounted:false,isUnmounted:false,isDeactivated:false,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return i.ctx={_:i},i.root=t?t.root:i,i.emit=rp.bind(null,i),e.ce&&e.ce(i),i}let iE=null,iA=()=>iE||nn;{let e=z$1(),t=(t,n)=>{let l;return (l=e[t])||(l=e[t]=[]),l.push(n),e=>{l.length>1?l.forEach(t=>t(e)):l[0](e);}};s=t("__VUE_INSTANCE_SETTERS__",e=>iE=e),a=t("__VUE_SSR_SETTERS__",e=>iP=e);}let iR=e=>{let t=iE;return s(e),e.scope.on(),()=>{e.scope.off(),s(t);}},iO=()=>{iE&&iE.scope.off(),s(null);};function iN(e){return 4&e.vnode.shapeFlag}let iP=false;function iM(e,t=false,n=false){t&&a(t);let{props:l,children:r}=e.vnode,i=iN(e);!function(e,t,n,l=false){let r={},i=Object.create(rx);for(let n in e.propsDefaults=Object.create(null),rk(e,t,r,i),e.propsOptions[0])n in r||(r[n]=void 0);n?e.props=l?r:tc(r):e.type.props?e.props=r:e.props=i,e.attrs=i;}(e,l,i,t);var o=n||t;let s=e.slots=Object.create(rx);if(32&e.vnode.shapeFlag){let e=r._;e?(rI(s,r,o),o&&H$1(s,"_",e,true)):rP(r,s);}else r&&rM(e,r);let u=i?function(e,t){let n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,lK);let{setup:l}=n;if(l){eR();let n=e.setupContext=l.length>1?iU(e):null,r=iR(e),i=tG(l,e,0,[e.props,n]),o=O$1(i);if(eO(),r(),(o||e.sp)&&!ls(e)&&nX(e),o){if(i.then(iO,iO),t)return i.then(n=>{a(true);try{iI(e,n,t);}finally{a(false);}}).catch(t=>{tJ(t,e,0,void 0,true),e.ssrRender=(e,t)=>t("\x3c!----\x3e");});e.asyncDep=i;}else iI(e,i);}else ij(e);}(e,t):void 0;return t&&a(false),u}function iI(e,t,n){T$1(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:R$1(t)&&(e.setupState=tN(t)),ij(e);}function ij(e,t,n){let l=e.type;if(!e.render){e.render=l.render||m$1;}{let t=iR(e);eR();try{!function(e){let t=re$1(e),n=e.proxy,l=e.ctx;l9=!1,t.beforeCreate&&l7(t.beforeCreate,e,"bc");let{data:r,computed:i,methods:o,watch:s,provide:a,inject:u,created:c,beforeMount:f,mounted:d,beforeUpdate:p,updated:h,activated:g,deactivated:v,beforeUnmount:_,unmounted:y,render:b,renderTracked:S,renderTriggered:C,errorCaptured:x,serverPrefetch:w,expose:A,inheritAttrs:O,components:N,directives:P}=t;if(u&&function(e,t){for(let n in k$1(e)&&(e=rr(e)),e){let l,r=e[n];tC(l=R$1(r)?"default"in r?nd(r.from||n,r.default,!0):nd(r.from||n):nd(r))?Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:()=>l.value,set:e=>l.value=e}):t[n]=l;}}(u,l),o)for(let e in o){let t=o[e];T$1(t)&&(l[e]=t.bind(n));}if(r){let t=r.call(n,n);R$1(t)&&(e.data=tu(t));}if(l9=!0,i)for(let e in i){let t=i[e],r=T$1(t)?t.bind(n,n):T$1(t.get)?t.get.bind(n,n):m$1,o=iH({get:r,set:!T$1(t)&&T$1(t.set)?t.set.bind(n):m$1});Object.defineProperty(l,e,{enumerable:!0,configurable:!0,get:()=>o.value,set:e=>o.value=e});}if(s)for(let e in s)!function e(t,n,l,r){let i=r.includes(".")?nC(l,r):()=>l[r];if(E$1(t)){let e=n[t];T$1(e)&&ny(i,e);}else if(T$1(t))ny(i,t.bind(l));else if(R$1(t))if(k$1(t))t.forEach(t=>e(t,n,l,r));else {let e=T$1(t.handler)?t.handler.bind(l):n[t.handler];T$1(e)&&ny(i,e,t);}}(s[e],l,n,e);if(a){let e=T$1(a)?a.call(n):a;Reflect.ownKeys(e).forEach(t=>{nf(t,e[t]);});}function M(e,t){k$1(t)?t.forEach(t=>e(t.bind(n))):t&&e(t.bind(n));}if(c&&l7(c,e,"c"),M(lb,f),M(lS,d),M(lC,p),M(lx,h),M(lp,g),M(lh,v),M(lR,x),M(lA,S),M(lE,C),M(lw,_),M(lk,y),M(lT,w),k$1(A))if(A.length){let t=e.exposed||(e.exposed={});A.forEach(e=>{Object.defineProperty(t,e,{get:()=>n[e],set:t=>n[e]=t,enumerable:!0});});}else e.exposed||(e.exposed={});b&&e.render===m$1&&(e.render=b),null!=O&&(e.inheritAttrs=O),N&&(e.components=N),P&&(e.directives=P),w&&nX(e);}(e);}finally{eO(),t();}}}let iV=Symbol(),iD={get:(e,t)=>(eD(e,"get",""),t===iV?e:e[t])};function iU(e){return {attrs:new Proxy(e.attrs,iD),slots:e.slots,emit:e.emit,expose:t=>{e.exposed=t||{};}}}function iB(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(tN(ty(e.exposed)),{get:(t,n)=>n in t?t[n]:n in lH?lH[n](e):void 0,has:(e,t)=>t in e||t in lH})):e.proxy}function i$(e,t=true){return T$1(e)?e.displayName||e.name:e.name||t&&e.__name}let iH=(e,t)=>(function(e,t=false){let n,l;return T$1(e)?n=e:(n=e.get,l=e.set),new tV(n,l,t)})(e,iP);function iW(e,t,n){try{it$1(-1);let l=arguments.length;if(2!==l)return l>3?n=Array.prototype.slice.call(arguments,2):3===l&&io(n)&&(n=[n]),ip(e,t,n);if(!R$1(t)||k$1(t))return ip(e,null,t);if(io(t))return ip(e,null,[t]);return ip(e,t)}finally{it$1(1);}}let iG="3.5.45",i6="u">typeof window&&window.trustedTypes;if(i6)try{p=i6.createPolicy("vue",{createHTML:e=>e});}catch(e){}let i8=p?e=>p.createHTML(e):e=>e,i4="u">typeof document?document:null,i3=i4&&i4.createElement("template"),i5={insert:(e,t,n)=>{t.insertBefore(e,n||null);},remove:e=>{let t=e.parentNode;t&&t.removeChild(e);},createElement:(e,t,n,l)=>{let r="svg"===t?i4.createElementNS("http://www.w3.org/2000/svg",e):"mathml"===t?i4.createElementNS("http://www.w3.org/1998/Math/MathML",e):n?i4.createElement(e,{is:n}):i4.createElement(e);return "select"===e&&l&&null!=l.multiple&&r.setAttribute("multiple",l.multiple),r},createText:e=>i4.createTextNode(e),createComment:e=>i4.createComment(e),setText:(e,t)=>{e.nodeValue=t;},setElementText:(e,t)=>{e.textContent=t;},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>i4.querySelector(e),setScopeId(e,t){e.setAttribute(t,"");},insertStaticContent(e,t,n,l,r,i){let o=n?n.previousSibling:t.lastChild;if(r&&(r===i||r.nextSibling))for(;t.insertBefore(r.cloneNode(true),n),r!==i&&(r=r.nextSibling););else {i3.innerHTML=i8("svg"===l?`<svg>${e}</svg>`:"mathml"===l?`<math>${e}</math>`:e);let r=i3.content;if("svg"===l||"mathml"===l){let e=r.firstChild;for(;e.firstChild;)r.appendChild(e.firstChild);r.removeChild(e);}t.insertBefore(r,n);}return [o?o.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},i9="transition",i7="animation",oe$1=Symbol("_vtc"),ot$1={name:String,type:String,css:{type:Boolean,default:true},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String},on=S$1({},nj,ot$1);((e=(e,{slots:t})=>iW(nD,oo(e),t)).displayName="Transition",e.props=on,e);let or=(e,t=[])=>{k$1(e)?e.forEach(e=>e(...t)):e&&e(...t);},oi=e=>!!e&&(k$1(e)?e.some(e=>e.length>1):e.length>1);function oo(e){let t={};for(let n in e)n in ot$1||(t[n]=e[n]);if(false===e.css)return t;let{name:n="v",type:l,duration:r,enterFromClass:i=`${n}-enter-from`,enterActiveClass:o=`${n}-enter-active`,enterToClass:s=`${n}-enter-to`,appearFromClass:a=i,appearActiveClass:u=o,appearToClass:c=s,leaveFromClass:f=`${n}-leave-from`,leaveActiveClass:d=`${n}-leave-active`,leaveToClass:p=`${n}-leave-to`}=e,h=function(e){if(null==e)return null;{if(R$1(e))return [function(e){return K$1(e)}(e.enter),function(e){return K$1(e)}(e.leave)];let t=function(e){return K$1(e)}(e);return [t,t]}}(r),g=h&&h[0],v=h&&h[1],{onBeforeEnter:m,onEnter:_,onEnterCancelled:y,onLeave:b,onLeaveCancelled:C,onBeforeAppear:x=m,onAppear:w=_,onAppearCancelled:k=y}=t,T=(e,t,n,l)=>{e._enterCancelled=l,oa(e,t?c:s),oa(e,t?u:o),n&&n();},E=(e,t)=>{e._isLeaving=false,oa(e,f),oa(e,p),oa(e,d),t&&t();},A=e=>(t,n)=>{let r=e?w:_,o=()=>T(t,e,n);or(r,[t,o]),ou(()=>{oa(t,e?a:i),os(t,e?c:s),oi(r)||of(t,l,g,o);});};return S$1(t,{onBeforeEnter(e){or(m,[e]),os(e,i),os(e,o);},onBeforeAppear(e){or(x,[e]),os(e,a),os(e,u);},onEnter:A(false),onAppear:A(true),onLeave(e,t){e._isLeaving=true;let n=()=>E(e,t);os(e,f),e._enterCancelled?(os(e,d),og(e)):(og(e),os(e,d)),ou(()=>{e._isLeaving&&(oa(e,f),os(e,p),oi(b)||of(e,l,v,n));}),or(b,[e,n]);},onEnterCancelled(e){T(e,false,void 0,true),or(y,[e]);},onAppearCancelled(e){T(e,true,void 0,true),or(k,[e]);},onLeaveCancelled(e){E(e),or(C,[e]);}})}function os(e,t){t.split(/\s+/).forEach(t=>t&&e.classList.add(t)),(e[oe$1]||(e[oe$1]=new Set)).add(t);}function oa(e,t){t.split(/\s+/).forEach(t=>t&&e.classList.remove(t));let n=e[oe$1];n&&(n.delete(t),n.size||(e[oe$1]=void 0));}function ou(e){requestAnimationFrame(()=>{requestAnimationFrame(e);});}let oc=0;function of(e,t,n,l){let r=e._endId=++oc,i=()=>{r===e._endId&&l();};if(null!=n)return setTimeout(i,n);let{type:o,timeout:s,propCount:a}=od(e,t);if(!o)return l();let u=o+"end",c=0,f=()=>{e.removeEventListener(u,d),i();},d=t=>{t.target===e&&++c>=a&&f();};setTimeout(()=>{c<a&&f();},s+1),e.addEventListener(u,d);}function od(e,t){let n=window.getComputedStyle(e),l=e=>(n[e]||"").split(", "),r=l(`${i9}Delay`),i=l(`${i9}Duration`),o=op(r,i),s=l(`${i7}Delay`),a=l(`${i7}Duration`),u=op(s,a),c=null,f=0,d=0;t===i9?o>0&&(c=i9,f=o,d=i.length):t===i7?u>0&&(c=i7,f=u,d=a.length):d=(c=(f=Math.max(o,u))>0?o>u?i9:i7:null)?c===i9?i.length:a.length:0;let p=c===i9&&/\b(?:transform|all)(?:,|$)/.test(l(`${i9}Property`).toString());return {type:c,timeout:f,propCount:d,hasTransform:p}}function op(e,t){for(;e.length<t.length;)e=e.concat(e);return Math.max(...t.map((t,n)=>oh(t)+oh(e[n])))}function oh(e){return "auto"===e?0:1e3*Number(e.slice(0,-1).replace(",","."))}function og(e){return (e?e.ownerDocument:document).body.offsetHeight}let ov=Symbol("_vod"),om=Symbol("_vsh");let ob=Symbol("");let ox=/(?:^|;)\s*display\s*:/,ow=/\s*!important$/;function ok(e,t,n){if(k$1(n))n.forEach(n=>ok(e,t,n));else if(null==n&&(n=""),t.startsWith("--"))ow.test(n)?e.setProperty(t,n.replace(ow,""),"important"):e.setProperty(t,n);else {let l=function(e,t){let n=oE[t];if(n)return n;let l=F$1(t);if("filter"!==l&&l in e)return oE[t]=l;l=D$1(l);for(let n=0;n<oT.length;n++){let r=oT[n]+l;if(r in e)return oE[t]=r}return t}(e,t);ow.test(n)?e.setProperty(V$1(l),n.replace(ow,""),"important"):e[l]=n;}}let oT=["Webkit","Moz","ms"],oE={},oA="http://www.w3.org/1999/xlink";function oR(e,t,n,l,r,i=ee(t)){if(l&&t.startsWith("xlink:"))null==n?e.removeAttributeNS(oA,t.slice(6,t.length)):e.setAttributeNS(oA,t,n);else null==n||i&&!(n||""===n)?e.removeAttribute(t):e.setAttribute(t,i?"":A$1(n)?String(n):n);}function oO(e,t,n,l,r){if("innerHTML"===t||"textContent"===t){null!=n&&(e[t]="innerHTML"===t?i8(n):n);return}let i=e.tagName;if("value"===t&&"PROGRESS"!==i&&!i.includes("-")){let l="OPTION"===i?e.getAttribute("value")||"":e.value,r=null==n?"checkbox"===e.type?"on":"":String(n);l===r&&"_value"in e||(e.value=r),null==n&&e.removeAttribute(t),e._value=n;return}let o=false;if(""===n||null==n){let l=typeof e[t];if("boolean"===l){var s;n=!!(s=n)||""===s;}else null==n&&"string"===l?(n="",o=true):"number"===l&&(n=0,o=true);}try{e[t]=n;}catch(e){}o&&e.removeAttribute(r||t);}function oN(e,t,n,l){e.addEventListener(t,n,l);}let oP=Symbol("_vei"),oM=/(Once|Passive|Capture)$/,oI=/^on:?(?:Once|Passive|Capture)$/,oL=0,oF=Promise.resolve(),oj=e=>111===e.charCodeAt(0)&&110===e.charCodeAt(1)&&e.charCodeAt(2)>96&&123>e.charCodeAt(2),oV=(e,t,n,l,r,i)=>{let o="svg"===r;if("class"===t){var s;let t;s=l,(t=e[oe$1])&&(s=(s?[s,...t]:[...t]).join(" ")),null==s?e.removeAttribute("class"):o?e.setAttribute("class",s):e.className=s;}else "style"===t?function(e,t,n){let l=e.style,r=E$1(n),i=false;if(n&&!r){if(t)if(E$1(t))for(let e of t.split(";")){let t=e.slice(0,e.indexOf(":")).trim();null==n[t]&&ok(l,t,"");}else for(let e in t)null==n[e]&&ok(l,e,"");for(let r in n){var o,s,a,u;"display"===r&&(i=true);let c=n[r];null!=c?(o=e,s=r,a=!E$1(t)&&t?t[r]:void 0,u=c,"TEXTAREA"===o.tagName&&("width"===s||"height"===s)&&E$1(u)&&a===u||ok(l,r,c)):ok(l,r,"");}}else if(r){if(t!==n){let e=l[ob];e&&(n+=";"+e),l.cssText=n,i=ox.test(n);}}else t&&e.removeAttribute("style");ov in e&&(r&&t===n||(e[ov]=i?l.display:""),e[om]&&(l.display="none"));}(e,n,l):y$1(t)?b$1(t)||function(e,t,n,l=null){let r=e[oP]||(e[oP]={}),i=r[t];if(n&&i)i.value=n;else {let[a,u]=function(e){let t,n;for(;(n=e.match(oM))&&!oI.test(e);)t||(t={}),e=e.slice(0,e.length-n[1].length),t[n[1].toLowerCase()]=true;return [":"===e[2]?e.slice(3):V$1(e.slice(2)),t]}(t);if(n){var o,s;let i;oN(e,a,r[t]=(o=n,s=l,(i=e=>{if(e._vts){if(e._vts<=i.attached)return}else e._vts=Date.now();let t=i.value;if(k$1(t)){let n=e.stopImmediatePropagation;e.stopImmediatePropagation=()=>{n.call(e),e._stopped=true;};let l=t.slice(),r=[e];for(let t=0;t<l.length&&!e._stopped;t++){let e=l[t];e&&tX(e,s,5,r);}}else tX(t,s,5,[e]);}).value=o,i.attached=oL||(oF.then(()=>oL=0),oL=Date.now()),i),u);}else i&&(e.removeEventListener(a,i,u),r[t]=void 0);}}(e,t,l,i):("."===t[0]?(t=t.slice(1),0):"^"===t[0]?(t=t.slice(1),1):!function(e,t,n,l){if(l)return !!("innerHTML"===t||"textContent"===t||t in e&&oj(t)&&T$1(n));if("spellcheck"===t||"draggable"===t||"translate"===t||"autocorrect"===t||"sandbox"===t&&"IFRAME"===e.tagName||"form"===t||"list"===t&&"INPUT"===e.tagName||"type"===t&&"TEXTAREA"===e.tagName)return  false;if("width"===t||"height"===t){let t=e.tagName;if("IMG"===t||"VIDEO"===t||"CANVAS"===t||"SOURCE"===t)return  false}return !(oj(t)&&E$1(n))&&t in e}(e,t,l,o))?e._isVueCE&&(function(e,t){let n=e._def.props;if(!n)return  false;let l=F$1(t);return Array.isArray(n)?n.some(e=>F$1(e)===l):Object.keys(n).some(e=>F$1(e)===l)}(e,t)||e._def.__asyncLoader&&(/[A-Z]/.test(t)||!E$1(l)))?oO(e,F$1(t),l,i,t):("true-value"===t?e._trueValue=l:"false-value"===t&&(e._falseValue=l),oR(e,t,l,o)):(oO(e,t,l),e.tagName.includes("-")||"value"!==t&&"checked"!==t&&"selected"!==t||oR(e,t,l,o,i,"value"!==t));};let oq=new WeakMap,oG=new WeakMap,oX=Symbol("_moveCb"),oJ=Symbol("_enterCb"),oZ=new WeakMap;(t={name:"TransitionGroup",props:S$1({},on,{tag:String,moveClass:String}),setup(e,{slots:t}){let n,l,r,i,o=iA(),s=nL(),a=()=>(void 0===i&&(i=n.length>0&&function(e,t,n){let l=e.cloneNode(),r=e[oe$1];r&&r.forEach(e=>{e.split(/\s+/).forEach(e=>e&&l.classList.remove(e));}),n.split(/\s+/).forEach(e=>e&&l.classList.add(e)),l.style.display="none";let i=1===t.nodeType?t:t.parentNode;i.appendChild(l);let{hasTransform:o}=od(l);return i.removeChild(l),o}(n[0].el,o.vnode.el,o0(e))),i);return lx(()=>{var t,l;let i;if(oZ.delete(o),!a()){n=[],r=void 0;return}let s=o0(e);n.forEach(oQ);let u=r&&(t=r,l=o.vnode.el,(i=t.find(e=>e.willMove()&&e.item.contains(l)))&&o2(i.item,i));r=void 0,n.forEach(e=>{var t,n;return t=e,n=u,void oG.set(t,o2(t.el,n))});let c=n.filter(o1);og(o.vnode.el),c.forEach(e=>{let t=e.el,n=t.style;os(t,s),n.transform=n.webkitTransform=n.transitionDuration="";let l=t[oX]=e=>{(!e||e.target===t)&&(!e||e.propertyName.endsWith("transform"))&&(t.removeEventListener("transitionend",l),t[oX]=null,oa(t,s));};t.addEventListener("transitionend",l);}),n=[];}),()=>{let u=t_(e),c=oo(u),f=u.tag||r2;if(n=[],i=void 0,l)for(let e=0;e<l.length;e++){let t=l[e];t.el&&t.el instanceof Element&&!t.el[om]&&(n.push(t),nW(t,nB(t,c,s,o)),oq.set(t,o2(t.el)));}l=t.default?nK(t.default()):[];for(let e=0;e<l.length;e++){let t=l[e];null!=t.key&&nW(t,nB(t,c,s,o));}return n.length&&(r=function(e){let t;for(let n=e.parent;n;n=n.parent){let l=oZ.get(n);if(l){let r=function(e,t){let n=1===e.nodeType?e:e.parentNode;for(;t&&t.parentNode!==n;)t=t.parentNode;if(t&&1===t.nodeType)return t}(n.vnode.el,e.vnode.el);r&&(t||(t=[])).push(S$1(o2(r),{item:r,willMove:l}));}}return t}(o),oZ.set(o,a)),ip(f,null,l)}}},delete t.props.mode,t);function oQ(e){let t=e.el;t[oX]&&t[oX](),t[oJ]&&t[oJ]();}function o0(e){return e.moveClass||`${e.name||"v"}-move`}function o1(e){let t=oq.get(e),n=oG.get(e),l=t.left-n.left,r=t.top-n.top;if(l||r){let t=e.el,n=t.style,i=t.getBoundingClientRect(),o=1,s=1;return t.offsetWidth&&(o=i.width/t.offsetWidth),t.offsetHeight&&(s=i.height/t.offsetHeight),Number.isFinite(o)&&0!==o||(o=1),Number.isFinite(s)&&0!==s||(s=1),.01>Math.abs(o-1)&&(o=1),.01>Math.abs(s-1)&&(s=1),n.transform=n.webkitTransform=`translate(${l/o}px,${r/s}px)`,n.transitionDuration="0s",e}}function o2(e,t){let n=e.getBoundingClientRect();return {left:n.left-(t?t.left:0),top:n.top-(t?t.top:0)}}let o6=e=>{let t=e.props["onUpdate:modelValue"]||false;return k$1(t)?e=>$$1(t,e):t};function o8(e){e.target.composing=true;}function o4(e){let t=e.target;t.composing&&(t.composing=false,t.dispatchEvent(new Event("input")));}let o3=Symbol("_assign"),o5=Symbol("_initialValue");function o9(e,t,n){return t&&(e=e.trim()),n&&(e=W$1(e)),e}let o7={created(e,{modifiers:{lazy:t,trim:n,number:l}},r){e.parentNode&&("text"===e.type?e[o5]=e.defaultValue.replace(/[\r\n]/g,""):"textarea"===e.type&&(e[o5]=e.defaultValue.replace(/\r\n?/g,`
`))),e[o3]=o6(r);let i=l||r.props&&"number"===r.props.type;oN(e,t?"change":"input",t=>{t.target.composing||e[o3](o9(e.value,n,i));}),(n||i)&&oN(e,"change",()=>{e.value=o9(e.value,n,i);}),t||(oN(e,"compositionstart",o8),oN(e,"compositionend",o4),oN(e,"change",o4));},mounted(e,{value:t,modifiers:{trim:n,number:l}}){let r=e[o5];delete e[o5],void 0!==r&&("text"===e.type||"textarea"===e.type)&&e.value!==r?e[o3](o9(e.value,n,l)):e.value=null==t?"":t;},beforeUpdate(e,{value:t,oldValue:n,modifiers:{lazy:l,trim:r,number:i}},o){if(e[o3]=o6(o),e.composing)return;let s=(i||"number"===e.type)&&!/^0\d/.test(e.value)?W$1(e.value):e.value,a=null==t?"":t;if(s===a)return;let u=e.getRootNode();(u instanceof Document||u instanceof ShadowRoot)&&u.activeElement===e&&"range"!==e.type&&(l&&t===n||r&&e.value.trim()===a)||(e.value=a);}},se$1={deep:true,created(e,t,n){e[o3]=o6(n),oN(e,"change",()=>{let t=e._modelValue,n=si(e),l=e.checked,r=e[o3];if(k$1(t)){let e=eo(t,n),i=-1!==e;if(l&&!i)r(t.concat(n));else if(!l&&i){let n=[...t];n.splice(e,1),r(n);}}else {let i;if("[object Set]"===(i=t,N$1.call(i))){let e=new Set(t);l?e.add(n):e.delete(n),r(e);}else r(so(e,l));}});},mounted:st$1,beforeUpdate(e,t,n){e[o3]=o6(n),st$1(e,t,n);}};function st$1(e,{value:t,oldValue:n},l){let r;if(e._modelValue=t,k$1(t))r=eo(t,l.props.value)>-1;else {let i;if("[object Set]"===(i=t,N$1.call(i)))r=t.has(l.props.value);else {if(t===n)return;r=ei(t,so(e,true));}}e.checked!==r&&(e.checked=r);}let sn={created(e,{value:t},n){e.checked=ei(t,n.props.value),e[o3]=o6(n),oN(e,"change",()=>{e[o3](si(e));});},beforeUpdate(e,{value:t,oldValue:n},l){e[o3]=o6(l),t!==n&&(e.checked=ei(t,l.props.value));}},sl={deep:true,created(e,{value:t,modifiers:{number:n}},l){e._modelValue=t,oN(e,"change",()=>{let t,l=Array.prototype.filter.call(e.options,e=>e.selected).map(e=>n?W$1(si(e)):si(e)),r=e.multiple,i=r?"[object Set]"===(t=e._modelValue,N$1.call(t))?new Set(l):l:l[0],o=e._pendingValue=[r,r?k$1(i)?l.slice():l:i];try{e[o3](i);}finally{t8(()=>{e._pendingValue===o&&(e._pendingValue=void 0);});}}),e[o3]=o6(l);},mounted(e,{value:t,modifiers:{number:n}}){sr(e,t,n);},beforeUpdate(e,{value:t},n){e._modelValue=t,e[o3]=o6(n);},updated(e,{value:t,modifiers:{number:n}}){let l=e._pendingValue;e._pendingValue=void 0,l&&l[0]===e.multiple&&function(e,t,n){let l;if(!n||k$1(e))return ei(e,t);if("[object Set]"===(l=e,N$1.call(l))){if(e.size!==t.length)return  false;for(let n of t)if(!e.has(n))return  false;return  true}return  false}(t,l[1],l[0])||sr(e,t,n);}};function sr(e,t,n=false){let l,r=e.multiple,i=k$1(t);if(!r||i||"[object Set]"===(l=t,N$1.call(l))){for(let l=0,o=e.options.length;l<o;l++){let o=e.options[l],s=si(o);if(r)if(i){let e=typeof s;"string"===e||"number"===e?o.selected=t.some(e=>String(e)===String(s)):o.selected=eo(t,s)>-1;}else o.selected=t.has(s)||n&&"string"==typeof s&&t.has(W$1(s));else if(ei(si(o),t)){e.selectedIndex!==l&&(e.selectedIndex=l);return}}r||-1===e.selectedIndex||(e.selectedIndex=-1);}}function si(e){return "_value"in e?e._value:e.value}function so(e,t){let n=t?"_trueValue":"_falseValue";return n in e?e[n]:t}let ss={created(e,t,n){su(e,t,n,null,"created");},mounted(e,t,n){su(e,t,n,null,"mounted");},beforeUpdate(e,t,n,l){su(e,t,n,l,"beforeUpdate");},updated(e,t,n,l){su(e,t,n,l,"updated");}};function sa(e,t){switch(e){case "SELECT":return sl;case "TEXTAREA":return o7;default:switch(t){case "checkbox":return se$1;case "radio":return sn;default:return o7}}}function su(e,t,n,l,r){let i=sa(e.tagName,n.props&&n.props.type)[r];i&&i(e,t,n,l);}let sc=["ctrl","shift","alt","meta"],sf={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&0!==e.button,middle:e=>"button"in e&&1!==e.button,right:e=>"button"in e&&2!==e.button,exact:(e,t)=>sc.some(n=>e[`${n}Key`]&&!t.includes(n))},sd=(e,t)=>{if(!e)return e;let n=e._withMods||(e._withMods={}),l=t.join(".");return n[l]||(n[l]=(n,...l)=>{for(let e=0;e<t.length;e++){let l=sf[t[e]];if(l&&l(n,t))return}return e(n,...l)})},sg=S$1({patchProp:oV},i5);let sb=(...e)=>{let t=(f||(f=rF(sg))).createApp(...e),{mount:n}=t;return t.mount=e=>{let l=sx(e);if(!l)return;let r=t._component;T$1(r)||r.render||r.template||(r.template=l.innerHTML),1===l.nodeType&&(l.textContent="");let i=n(l,false,sC(l));return l instanceof Element&&(l.removeAttribute("v-cloak"),l.setAttribute("data-v-app","")),i},t};function sC(e){return e instanceof SVGElement?"svg":"function"==typeof MathMLElement&&e instanceof MathMLElement?"mathml":void 0}function sx(e){return E$1(e)?document.querySelector(e):e}

/*!
* vue-router v4.6.4
* (c) 2025 Eduardo San Martin Morote
* @license MIT
*/
const m=typeof document<`u`;function h(e){return typeof e==`object`||`displayName`in e||`props`in e||`__vccOpts`in e}function te(e){return e.__esModule||e[Symbol.toStringTag]===`Module`||e.default&&h(e.default)}const g=Object.assign;function ne(e,t){let n={};for(let r in t){let i=t[r];n[r]=v(i)?i.map(e):e(i);}return n}const _=()=>{},v=Array.isArray;function re(e,t){let n={};for(let r in e)n[r]=r in t?t[r]:e[r];return n}const ie=/#/g,ae=/&/g,oe=/\//g,y=/=/g,b=/\?/g,x=/\+/g,S=/%5B/g,se=/%5D/g,ce=/%5E/g,C=/%60/g,le=/%7B/g,w=/%7C/g,T=/%7D/g,ue=/%20/g;function E(e){return e==null?``:encodeURI(``+e).replace(w,`|`).replace(S,`[`).replace(se,`]`)}function de(e){return E(e).replace(le,`{`).replace(T,`}`).replace(ce,`^`)}function D(e){return E(e).replace(x,`%2B`).replace(ue,`+`).replace(ie,`%23`).replace(ae,`%26`).replace(C,"`").replace(le,`{`).replace(T,`}`).replace(ce,`^`)}function fe(e){return D(e).replace(y,`%3D`)}function O(e){return E(e).replace(ie,`%23`).replace(b,`%3F`)}function pe(e){return O(e).replace(oe,`%2F`)}function k(e){if(e==null)return null;try{return decodeURIComponent(``+e)}catch(e){}return ``+e}const me=/\/$/,A=e=>e.replace(me,``);function he(e,t,n=`/`){let r,i={},a=``,o=``,s=t.indexOf(`#`),c=t.indexOf(`?`);return c=s>=0&&c>s?-1:c,c>=0&&(r=t.slice(0,c),a=t.slice(c,s>0?s:t.length),i=e(a.slice(1))),s>=0&&(r=r||t.slice(0,s),o=t.slice(s,t.length)),r=F(r==null?t:r,n),{fullPath:r+a+o,path:r,query:i,hash:k(o)}}function ge(e,t){let n=t.query?e(t.query):``;return t.path+(n&&`?`)+n+(t.hash||``)}function j(e,t){return !t||!e.toLowerCase().startsWith(t.toLowerCase())?e:e.slice(t.length)||`/`}function _e(e,t,n){let r=t.matched.length-1,i=n.matched.length-1;return r>-1&&r===i&&M(t.matched[r],n.matched[i])&&N(t.params,n.params)&&e(t.query)===e(n.query)&&t.hash===n.hash}function M(e,t){return (e.aliasOf||e)===(t.aliasOf||t)}function N(e,t){if(Object.keys(e).length!==Object.keys(t).length)return  false;for(var n in e)if(!ve(e[n],t[n]))return  false;return  true}function ve(e,t){return v(e)?P(e,t):v(t)?P(t,e):(e==null?void 0:e.valueOf())===(t==null?void 0:t.valueOf())}function P(e,t){return v(t)?e.length===t.length&&e.every((e,n)=>e===t[n]):e.length===1&&e[0]===t}function F(e,t){if(e.startsWith(`/`))return e;if(!e)return t;let n=t.split(`/`),r=e.split(`/`),i=r[r.length-1];(i===`..`||i===`.`)&&r.push(``);let a=n.length-1,o,s;for(o=0;o<r.length;o++)if(s=r[o],s!==`.`)if(s===`..`)a>1&&a--;else break;return n.slice(0,a).join(`/`)+`/`+r.slice(o).join(`/`)}const I={path:`/`,name:void 0,params:{},query:{},hash:``,fullPath:`/`,matched:[],meta:{},redirectedFrom:void 0};let L=function(e){return e.pop=`pop`,e.push=`push`,e}({}),R=function(e){return e.back=`back`,e.forward=`forward`,e.unknown=``,e}({});function z(e){if(!e)if(m){let t=document.querySelector(`base`);e=t&&t.getAttribute(`href`)||`/`,e=e.replace(/^\w+:\/\/[^\/]+/,``);}else e=`/`;return e[0]!==`/`&&e[0]!==`#`&&(e=`/`+e),A(e)}const B=/^[^#]+#/;function ye(e,t){return e.replace(B,`#`)+t}function be(e,t){let n=document.documentElement.getBoundingClientRect(),r=e.getBoundingClientRect();return {behavior:t.behavior,left:r.left-n.left-(t.left||0),top:r.top-n.top-(t.top||0)}}const V=()=>({left:window.scrollX,top:window.scrollY});function xe(e){let t;if(`el`in e){let n=e.el,r=typeof n==`string`&&n.startsWith(`#`),i=typeof n==`string`?r?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!i)return;t=be(i,e);}else t=e;`scrollBehavior`in document.documentElement.style?window.scrollTo(t):window.scrollTo(t.left==null?window.scrollX:t.left,t.top==null?window.scrollY:t.top);}function Se(e,t){return (history.state?history.state.position-t:-1)+e}const Ce=new Map;function we(e,t){Ce.set(e,t);}function Te(e){let t=Ce.get(e);return Ce.delete(e),t}let Ee=()=>location.protocol+`//`+location.host;function De(e,t){let{pathname:n,search:r,hash:i}=t,a=e.indexOf(`#`);if(a>-1){let t=i.includes(e.slice(a))?e.slice(a).length:1,n=i.slice(t);return n[0]!==`/`&&(n=`/`+n),j(n,``)}return j(n,e)+r+i}function Oe(e,t,n,r){let i=[],a=[],o=null,s=({state:a})=>{let s=De(e,location),c=n.value,l=t.value,u=0;if(a){if(n.value=s,t.value=a,o&&o===c){o=null;return}u=l?a.position-l.position:0;}else r(s);i.forEach(e=>{e(n.value,c,{delta:u,type:L.pop,direction:u?u>0?R.forward:R.back:R.unknown});});};function c(){o=n.value;}function l(e){i.push(e);let t=()=>{let t=i.indexOf(e);t>-1&&i.splice(t,1);};return a.push(t),t}function u(){if(document.visibilityState===`hidden`){let{history:e}=window;if(!e.state)return;e.replaceState(g({},e.state,{scroll:V()}),``);}}function d(){for(let e of a)e();a=[],window.removeEventListener(`popstate`,s),window.removeEventListener(`pagehide`,u),document.removeEventListener(`visibilitychange`,u);}return window.addEventListener(`popstate`,s),window.addEventListener(`pagehide`,u),document.addEventListener(`visibilitychange`,u),{pauseListeners:c,listen:l,destroy:d}}function ke(e,t,n,r=false,i=false){return {back:e,current:t,forward:n,replaced:r,position:window.history.length,scroll:i?V():null}}function Ae(e){let{history:t,location:n}=window,r={value:De(e,n)},i={value:t.state};i.value||a(r.value,{back:null,current:r.value,forward:null,position:t.length-1,replaced:true,scroll:null},true);function a(r,a,o){let s=e.indexOf(`#`),c=s>-1?(n.host&&document.querySelector(`base`)?e:e.slice(s))+r:Ee()+e+r;try{t[o?`replaceState`:`pushState`](a,``,c),i.value=a;}catch(e){console.error(e),n[o?`replace`:`assign`](c);}}function o(e,n){a(e,g({},t.state,ke(i.value.back,e,i.value.forward,true),n,{position:i.value.position}),true),r.value=e;}function s(e,n){let o=g({},i.value,t.state,{forward:e,scroll:V()});a(o.current,o,true),a(e,g({},ke(r.value,e,null),{position:o.position+1},n),false),r.value=e;}return {location:r,state:i,push:s,replace:o}}function je(e){e=z(e);let t=Ae(e),n=Oe(e,t.state,t.location,t.replace);function r(e,t=true){t||n.pauseListeners(),history.go(e);}let i=g({location:``,base:e,go:r,createHref:ye.bind(null,e)},t,n);return Object.defineProperty(i,`location`,{enumerable:true,get:()=>t.location.value}),Object.defineProperty(i,`state`,{enumerable:true,get:()=>t.state.value}),i}function Pe(e){return typeof e==`string`||e&&typeof e==`object`}function Fe(e){return typeof e==`string`||typeof e==`symbol`}let H=function(e){return e[e.MATCHER_NOT_FOUND=1]=`MATCHER_NOT_FOUND`,e[e.NAVIGATION_GUARD_REDIRECT=2]=`NAVIGATION_GUARD_REDIRECT`,e[e.NAVIGATION_ABORTED=4]=`NAVIGATION_ABORTED`,e[e.NAVIGATION_CANCELLED=8]=`NAVIGATION_CANCELLED`,e[e.NAVIGATION_DUPLICATED=16]=`NAVIGATION_DUPLICATED`,e}({});const Ie=Symbol(``);(function(e){return e[e.aborted=4]=`aborted`,e[e.cancelled=8]=`cancelled`,e[e.duplicated=16]=`duplicated`,e})({});H.MATCHER_NOT_FOUND,H.NAVIGATION_GUARD_REDIRECT,H.NAVIGATION_ABORTED,H.NAVIGATION_CANCELLED,H.NAVIGATION_DUPLICATED;function U(e,t){return g(Error(),{type:e,[Ie]:true},t)}function W(e,t){return e instanceof Error&&Ie in e&&(t==null||!!(e.type&t))}let G=function(e){return e[e.Static=0]=`Static`,e[e.Param=1]=`Param`,e[e.Group=2]=`Group`,e}({});var K=function(e){return e[e.Static=0]=`Static`,e[e.Param=1]=`Param`,e[e.ParamRegExp=2]=`ParamRegExp`,e[e.ParamRegExpEnd=3]=`ParamRegExpEnd`,e[e.EscapeNext=4]=`EscapeNext`,e}(K||{});const Re={type:G.Static,value:``},ze=/[a-zA-Z0-9_]/;function Be(e){if(!e)return [[]];if(e===`/`)return [[Re]];if(!e.startsWith(`/`))throw Error(`Invalid path "${e}"`);function t(e){throw Error(`ERR (${n})/"${l}": ${e}`)}let n=K.Static,r=n,i=[],a;function o(){a&&i.push(a),a=[];}let s=0,c,l=``,u=``;function d(){l&&(n===K.Static?a.push({type:G.Static,value:l}):n===K.Param||n===K.ParamRegExp||n===K.ParamRegExpEnd?(a.length>1&&(c===`*`||c===`+`)&&t(`A repeatable param (${l}) must be alone in its segment. eg: '/:ids+.`),a.push({type:G.Param,value:l,regexp:u,repeatable:c===`*`||c===`+`,optional:c===`*`||c===`?`})):t(`Invalid state to consume buffer`),l=``);}function f(){l+=c;}for(;s<e.length;){if(c=e[s++],c===`\\`&&n!==K.ParamRegExp){r=n,n=K.EscapeNext;continue}switch(n){case K.Static:c===`/`?(l&&d(),o()):c===`:`?(d(),n=K.Param):f();break;case K.EscapeNext:f(),n=r;break;case K.Param:c===`(`?n=K.ParamRegExp:ze.test(c)?f():(d(),n=K.Static,c!==`*`&&c!==`?`&&c!==`+`&&s--);break;case K.ParamRegExp:c===`)`?u[u.length-1]==`\\`?u=u.slice(0,-1)+c:n=K.ParamRegExpEnd:u+=c;break;case K.ParamRegExpEnd:d(),n=K.Static,c!==`*`&&c!==`?`&&c!==`+`&&s--,u=``;break;default:t(`Unknown state`);break}}return n===K.ParamRegExp&&t(`Unfinished custom RegExp for param "${l}"`),d(),o(),i}const Ve=`[^/]+?`,He={sensitive:false,strict:false,start:true,end:true};var q=function(e){return e[e._multiplier=10]=`_multiplier`,e[e.Root=90]=`Root`,e[e.Segment=40]=`Segment`,e[e.SubSegment=30]=`SubSegment`,e[e.Static=40]=`Static`,e[e.Dynamic=20]=`Dynamic`,e[e.BonusCustomRegExp=10]=`BonusCustomRegExp`,e[e.BonusWildcard=-50]=`BonusWildcard`,e[e.BonusRepeatable=-20]=`BonusRepeatable`,e[e.BonusOptional=-8]=`BonusOptional`,e[e.BonusStrict=.7000000000000001]=`BonusStrict`,e[e.BonusCaseSensitive=.25]=`BonusCaseSensitive`,e}(q||{});const Ue=/[.+*?^${}()[\]/\\]/g;function We(e,t){let n=g({},He,t),r=[],i=n.start?`^`:``,a=[];for(let t of e){let e=t.length?[]:[q.Root];n.strict&&!t.length&&(i+=`/`);for(let r=0;r<t.length;r++){let o=t[r],s=q.Segment+(n.sensitive?q.BonusCaseSensitive:0);if(o.type===G.Static)r||(i+=`/`),i+=o.value.replace(Ue,`\\$&`),s+=q.Static;else if(o.type===G.Param){let{value:e,repeatable:n,optional:c,regexp:l}=o;a.push({name:e,repeatable:n,optional:c});let u=l||Ve;if(u!==Ve){s+=q.BonusCustomRegExp;try{`${u}`;}catch(t){throw Error(`Invalid custom RegExp for param "${e}" (${u}): `+t.message)}}let d=n?`((?:${u})(?:/(?:${u}))*)`:`(${u})`;r||(d=c&&t.length<2?`(?:/${d})`:`/`+d),c&&(d+=`?`),i+=d,s+=q.Dynamic,c&&(s+=q.BonusOptional),n&&(s+=q.BonusRepeatable),u===`.*`&&(s+=q.BonusWildcard);}e.push(s);}r.push(e);}if(n.strict&&n.end){let e=r.length-1;r[e][r[e].length-1]+=q.BonusStrict;}n.strict||(i+=`/?`),n.end?i+=`$`:n.strict&&!i.endsWith(`/`)&&(i+=`(?:/|$)`);let o=new RegExp(i,n.sensitive?``:`i`);function s(e){let t=e.match(o),n={};if(!t)return null;for(let e=1;e<t.length;e++){let r=t[e]||``,i=a[e-1];n[i.name]=r&&i.repeatable?r.split(`/`):r;}return n}function c(t){let n=``,r=false;for(let i of e){(!r||!n.endsWith(`/`))&&(n+=`/`),r=false;for(let e of i)if(e.type===G.Static)n+=e.value;else if(e.type===G.Param){let{value:a,repeatable:o,optional:s}=e,c=a in t?t[a]:``;if(v(c)&&!o)throw Error(`Provided param "${a}" is an array but it is not repeatable (* or + modifiers)`);let l=v(c)?c.join(`/`):c;if(!l)if(s)i.length<2&&(n.endsWith(`/`)?n=n.slice(0,-1):r=true);else throw Error(`Missing required param "${a}"`);n+=l;}}return n||`/`}return {re:o,score:r,keys:a,parse:s,stringify:c}}function Ge(e,t){let n=0;for(;n<e.length&&n<t.length;){let r=t[n]-e[n];if(r)return r;n++;}return e.length<t.length?e.length===1&&e[0]===q.Static+q.Segment?-1:1:e.length>t.length?t.length===1&&t[0]===q.Static+q.Segment?1:-1:0}function Ke(e,t){let n=0,r=e.score,i=t.score;for(;n<r.length&&n<i.length;){let e=Ge(r[n],i[n]);if(e)return e;n++;}if(Math.abs(i.length-r.length)===1){if(qe(r))return 1;if(qe(i))return  -1}return i.length-r.length}function qe(e){let t=e[e.length-1];return e.length>0&&t[t.length-1]<0}const Je={strict:false,end:true,sensitive:false};function Ye(e,t,n){let r=g(We(Be(e.path),n),{record:e,parent:t,children:[],alias:[]});return t&&!r.record.aliasOf==!t.record.aliasOf&&t.children.push(r),r}function Xe(e,t){let n=[],r=new Map;t=re(Je,t);function i(e){return r.get(e)}function a(e,n,r){let i=!r,s=Qe(e);s.aliasOf=r&&r.record;let l=re(t,e),u=[s];if(`alias`in e){let t=typeof e.alias==`string`?[e.alias]:e.alias;for(let e of t)u.push(Qe(g({},s,{components:r?r.record.components:s.components,path:e,aliasOf:r?r.record:s})));}let d,f;for(let t of u){let{path:u}=t;if(n&&u[0]!==`/`){let e=n.record.path,r=e[e.length-1]===`/`?``:`/`;t.path=n.record.path+(u&&r+u);}if(d=Ye(t,n,l),r?r.alias.push(d):(f=f||d,f!==d&&f.alias.push(d),i&&e.name&&!et(d)&&o(e.name)),it(d)&&c(d),s.children){let e=s.children;for(let t=0;t<e.length;t++)a(e[t],d,r&&r.children[t]);}r=r||d;}return f?()=>{o(f);}:_}function o(e){if(Fe(e)){let t=r.get(e);t&&(r.delete(e),n.splice(n.indexOf(t),1),t.children.forEach(o),t.alias.forEach(o));}else {let t=n.indexOf(e);t>-1&&(n.splice(t,1),e.record.name&&r.delete(e.record.name),e.children.forEach(o),e.alias.forEach(o));}}function s(){return n}function c(e){let t=nt(e,n);n.splice(t,0,e),e.record.name&&!et(e)&&r.set(e.record.name,e);}function l(e,t){let i,a={},o,s;if(`name`in e&&e.name){if(i=r.get(e.name),!i)throw U(H.MATCHER_NOT_FOUND,{location:e});s=i.record.name,a=g(Ze(t.params,i.keys.filter(e=>!e.optional).concat(i.parent?i.parent.keys.filter(e=>e.optional):[]).map(e=>e.name)),e.params&&Ze(e.params,i.keys.map(e=>e.name))),o=i.stringify(a);}else if(e.path!=null)o=e.path,i=n.find(e=>e.re.test(o)),i&&(a=i.parse(o),s=i.record.name);else {if(i=t.name?r.get(t.name):n.find(e=>e.re.test(t.path)),!i)throw U(H.MATCHER_NOT_FOUND,{location:e,currentLocation:t});s=i.record.name,a=g({},t.params,e.params),o=i.stringify(a);}let c=[],l=i;for(;l;)c.unshift(l.record),l=l.parent;return {name:s,path:o,params:a,matched:c,meta:tt(c)}}e.forEach(e=>a(e));function u(){n.length=0,r.clear();}return {addRoute:a,resolve:l,removeRoute:o,clearRoutes:u,getRoutes:s,getRecordMatcher:i}}function Ze(e,t){let n={};for(let r of t)r in e&&(n[r]=e[r]);return n}function Qe(e){let t={path:e.path,redirect:e.redirect,name:e.name,meta:e.meta||{},aliasOf:e.aliasOf,beforeEnter:e.beforeEnter,props:$e(e),children:e.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:`components`in e?e.components||null:e.component&&{default:e.component}};return Object.defineProperty(t,`mods`,{value:{}}),t}function $e(e){let t={},n=e.props||false;if(`component`in e)t.default=n;else for(let r in e.components)t[r]=typeof n==`object`?n[r]:n;return t}function et(e){for(;e;){if(e.record.aliasOf)return  true;e=e.parent;}return  false}function tt(e){return e.reduce((e,t)=>g(e,t.meta),{})}function nt(e,t){let n=0,r=t.length;for(;n!==r;){let i=n+r>>1;Ke(e,t[i])<0?r=i:n=i+1;}let i=rt(e);return i&&(r=t.lastIndexOf(i,r-1)),r}function rt(e){let t=e;for(;t=t.parent;)if(it(t)&&Ke(e,t)===0)return t}function it({record:e}){return !!(e.name||e.components&&Object.keys(e.components).length||e.redirect)}function at(e){let t={};if(e===``||e===`?`)return t;let n=(e[0]===`?`?e.slice(1):e).split(`&`);for(let e=0;e<n.length;++e){let r=n[e].replace(x,` `),i=r.indexOf(`=`),a=k(i<0?r:r.slice(0,i)),o=i<0?null:k(r.slice(i+1));if(a in t){let e=t[a];v(e)||(e=t[a]=[e]),e.push(o);}else t[a]=o;}return t}function ot(e){let t=``;for(let n in e){let r=e[n];if(n=fe(n),r==null){r!==void 0&&(t+=(t.length?`&`:``)+n);continue}(v(r)?r.map(e=>e&&D(e)):[r&&D(r)]).forEach(e=>{e!==void 0&&(t+=(t.length?`&`:``)+n,e!=null&&(t+=`=`+e));});}return t}function st(e){let t={};for(let n in e){let r=e[n];r!==void 0&&(t[n]=v(r)?r.map(e=>e==null?null:``+e):r==null?r:``+r);}return t}const J=Symbol(``),ct=Symbol(``),Y=Symbol(``),X=Symbol(``),Z=Symbol(``);function Q(){let e=[];function t(t){return e.push(t),()=>{let n=e.indexOf(t);n>-1&&e.splice(n,1);}}function n(){e=[];}return {add:t,list:()=>e.slice(),reset:n}}function lt(e,t,n){let r=()=>{e[t].delete(n);};lk(r),lh(r),lp(()=>{e[t].add(n);}),e[t].add(n);}function ut(e){let t=nd(J,{}).value;t&&lt(t,`leaveGuards`,e);}function $(e,t,n,r,i,a=e=>e()){let o=r&&(r.enterCallbacks[i]=r.enterCallbacks[i]||[]);return ()=>new Promise((s,c)=>{let l=e=>{e===false?c(U(H.NAVIGATION_ABORTED,{from:n,to:t})):e instanceof Error?c(e):Pe(e)?c(U(H.NAVIGATION_GUARD_REDIRECT,{from:t,to:e})):(o&&r.enterCallbacks[i]===o&&typeof e==`function`&&o.push(e),s());},u=a(()=>e.call(r&&r.instances[i],t,n,l)),d=Promise.resolve(u);e.length<3&&(d=d.then(l)),d.catch(e=>c(e));})}function ft(e,t,n,r,i=e=>e()){let a=[];for(let o of e)for(let e in o.components){let s=o.components[e];if(!(t!==`beforeRouteEnter`&&!o.instances[e]))if(h(s)){let c=(s.__vccOpts||s)[t];c&&a.push($(c,n,r,o,e,i));}else {let c=s();a.push(()=>c.then(a=>{if(!a)throw Error(`Couldn't resolve component "${e}" at "${o.path}"`);let s=te(a)?a.default:a;o.mods[e]=a,o.components[e]=s;let c=(s.__vccOpts||s)[t];return c&&$(c,n,r,o,e,i)()}));}}return a}function mt(e,t){let n=[],r=[],i=[],a=Math.max(t.matched.length,e.matched.length);for(let o=0;o<a;o++){let a=t.matched[o];a&&(e.matched.find(e=>M(e,a))?r.push(a):n.push(a));let s=e.matched[o];s&&(t.matched.find(e=>M(e,s))||i.push(s));}return [n,r,i]}function ht(t){let n=nd(Y),i=nd(X),a=iH(()=>{let e=tA(t.to);return n.resolve(e)}),o=iH(()=>{let{matched:e}=a.value,{length:t}=e,n=e[t-1],r=i.matched;if(!n||!r.length)return  -1;let o=r.findIndex(M.bind(null,n));if(o>-1)return o;let s=bt(e[t-2]);return t>1&&bt(n)===s&&r[r.length-1].path!==s?r.findIndex(M.bind(null,e[t-2])):o}),s=iH(()=>o.value>-1&&yt(i.params,a.value.params)),c=iH(()=>o.value>-1&&o.value===i.matched.length-1&&N(i.params,a.value.params));function l(e={}){if(vt(e)){let e=n[tA(t.replace)?`replace`:`push`](tA(t.to)).catch(_);return t.viewTransition&&typeof document<`u`&&`startViewTransition`in document&&document.startViewTransition(()=>e),e}return Promise.resolve()}return {route:a,href:iH(()=>a.value.href),isActive:s,isExactActive:c,navigate:l}}function gt(e){return e.length===1?e[0]:e}const _t=nq({name:`RouterLink`,compatConfig:{MODE:3},props:{to:{type:[String,Object],required:true},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:`page`},viewTransition:Boolean},useLink:ht,setup(t,{slots:i}){let a=tu(ht(t)),{options:o}=nd(Y),s=iH(()=>({[xt(t.activeClass,o.linkActiveClass,`router-link-active`)]:a.isActive,[xt(t.exactActiveClass,o.linkExactActiveClass,`router-link-exact-active`)]:a.isExactActive}));return ()=>{let e=i.default&&gt(i.default(a));return t.custom?e:iW(`a`,{"aria-current":a.isExactActive?t.ariaCurrentValue:null,href:a.href,onClick:a.navigate,class:s.value},e)}}});function vt(e){if(!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)&&!e.defaultPrevented&&!(e.button!==void 0&&e.button!==0)){if(e.currentTarget&&e.currentTarget.getAttribute){let t=e.currentTarget.getAttribute(`target`);if(/\b_blank\b/i.test(t))return}return e.preventDefault&&e.preventDefault(),true}}function yt(e,t){for(let n in t){let r=t[n],i=e[n];if(typeof r==`string`){if(r!==i)return  false}else if(!v(i)||i.length!==r.length||r.some((e,t)=>e.valueOf()!==i[t].valueOf()))return  false}return  true}function bt(e){return e?e.aliasOf?e.aliasOf.path:e.path:``}const xt=(e,t,n)=>e==null?t==null?n:t:e,St=nq({name:`RouterView`,inheritAttrs:false,props:{name:{type:String,default:`default`},route:Object},compatConfig:{MODE:3},setup(t,{attrs:i,slots:a}){let o=nd(Z),s=iH(()=>t.route||o.value),l=nd(ct,0),d=iH(()=>{let e=tA(l),{matched:t}=s.value,n;for(;(n=t[e])&&!n.components;)e++;return e}),f=iH(()=>s.value.matched[d.value]);nf(ct,iH(()=>d.value+1)),nf(J,f),nf(Z,s);let m=tx();return ny(()=>[m.value,f.value,t.name],([e,t,n],[r,i,a])=>{t&&(t.instances[n]=e,i&&i!==t&&e&&e===r&&(t.leaveGuards.size||(t.leaveGuards=i.leaveGuards),t.updateGuards.size||(t.updateGuards=i.updateGuards))),e&&t&&(!i||!M(t,i)||!r)&&(t.enterCallbacks[n]||[]).forEach(t=>t(e));},{flush:`post`}),()=>{let e=s.value,r=t.name,o=f.value,c=o&&o.components[r];if(!c)return Ct(a.default,{Component:c,route:e});let l=o.props[r],u=iW(c,g({},l?l===true?e.params:typeof l==`function`?l(e):l:null,i,{onVnodeUnmounted:e=>{e.component.isUnmounted&&(o.instances[r]=null);},ref:m}));return Ct(a.default,{Component:u,route:e})||u}}});function Ct(e,t){if(!e)return null;let n=e(t);return n.length===1?n[0]:n}const wt=St;function Tt(e){let t=Xe(e.routes,e),n=e.parseQuery||at,r=e.stringifyQuery||ot,a=e.history,o=Q(),s=Q(),c=Q(),l=tw(I),u=I;m&&e.scrollBehavior&&`scrollRestoration`in history&&(history.scrollRestoration=`manual`);let ee=ne.bind(null,e=>``+e),h=ne.bind(null,pe),te=ne.bind(null,k);function re(e,n){let r,i;return Fe(e)?(r=t.getRecordMatcher(e),i=n):i=e,t.addRoute(i,r)}function ie(e){let n=t.getRecordMatcher(e);n&&t.removeRoute(n);}function ae(){return t.getRoutes().map(e=>e.record)}function oe(e){return !!t.getRecordMatcher(e)}function y(e,i){if(i=g({},i||l.value),typeof e==`string`){let r=he(n,e,i.path),o=t.resolve({path:r.path},i),s=a.createHref(r.fullPath);return g(r,o,{params:te(o.params),hash:k(r.hash),redirectedFrom:void 0,href:s})}let o;if(e.path!=null)o=g({},e,{path:he(n,e.path,i.path).path});else {let t=g({},e.params);for(let e in t)t[e]==null&&delete t[e];o=g({},e,{params:h(t)}),i.params=h(i.params);}let s=t.resolve(o,i),c=e.hash||``;s.params=ee(te(s.params));let u=ge(r,g({},e,{hash:de(c),path:s.path})),d=a.createHref(u);return g({fullPath:u,hash:c,query:r===ot?st(e.query):e.query||{}},s,{redirectedFrom:void 0,href:d})}function b(e){return typeof e==`string`?he(n,e,l.value.path):g({},e)}function x(e,t){if(u!==e)return U(H.NAVIGATION_CANCELLED,{from:t,to:e})}function S(e){return C(e)}function se(e){return S(g(b(e),{replace:true}))}function ce(e,t){let n=e.matched[e.matched.length-1];if(n&&n.redirect){let{redirect:r}=n,i=typeof r==`function`?r(e,t):r;return typeof i==`string`&&(i=i.includes(`?`)||i.includes(`#`)?i=b(i):{path:i},i.params={}),g({query:e.query,hash:e.hash,params:i.path==null?e.params:{}},i)}}function C(e,t){let n=u=y(e),i=l.value,a=e.state,o=e.force,s=e.replace===true,c=ce(n,i);if(c)return C(g(b(c),{state:typeof c==`object`?g({},a,c.state):a,force:o,replace:s}),t||n);let d=n;d.redirectedFrom=t;let f;return !o&&_e(r,i,n)&&(f=U(H.NAVIGATION_DUPLICATED,{to:d,from:i}),ve(i,i,true,false)),(f?Promise.resolve(f):T(d,i)).catch(e=>W(e)?W(e,H.NAVIGATION_GUARD_REDIRECT)?e:N(e):j(e,d,i)).then(e=>{if(e){if(W(e,H.NAVIGATION_GUARD_REDIRECT))return C(g({replace:s},b(e.to),{state:typeof e.to==`object`?g({},a,e.to.state):a,force:o}),t||d)}else e=E(d,i,true,s,a);return ue(d,i,e),e})}function le(e,t){let n=x(e,t);return n?Promise.reject(n):Promise.resolve()}function w(e){let t=R.values().next().value;return t&&typeof t.runWithContext==`function`?t.runWithContext(e):e()}function T(e,t){let n,[r,i,a]=mt(e,t);n=ft(r.reverse(),`beforeRouteLeave`,e,t);for(let i of r)i.leaveGuards.forEach(r=>{n.push($(r,e,t));});let c=le.bind(null,e,t);return n.push(c),B(n).then(()=>{n=[];for(let r of o.list())n.push($(r,e,t));return n.push(c),B(n)}).then(()=>{n=ft(i,`beforeRouteUpdate`,e,t);for(let r of i)r.updateGuards.forEach(r=>{n.push($(r,e,t));});return n.push(c),B(n)}).then(()=>{n=[];for(let r of a)if(r.beforeEnter)if(v(r.beforeEnter))for(let i of r.beforeEnter)n.push($(i,e,t));else n.push($(r.beforeEnter,e,t));return n.push(c),B(n)}).then(()=>(e.matched.forEach(e=>e.enterCallbacks={}),n=ft(a,`beforeRouteEnter`,e,t,w),n.push(c),B(n))).then(()=>{n=[];for(let r of s.list())n.push($(r,e,t));return n.push(c),B(n)}).catch(e=>W(e,H.NAVIGATION_CANCELLED)?e:Promise.reject(e))}function ue(e,t,n){c.list().forEach(r=>w(()=>r(e,t,n)));}function E(e,t,n,r,i){let o=x(e,t);if(o)return o;let s=t===I,c=m?history.state:{};n&&(r||s?a.replace(e.fullPath,g({scroll:s&&c&&c.scroll},i)):a.push(e.fullPath,i)),l.value=e,ve(e,t,n,s),N();}let D;function fe(){D||(D=a.listen((e,t,n)=>{if(!z.listening)return;let r=y(e),i=ce(r,z.currentRoute.value);if(i){C(g(i,{replace:true,force:true}),r).catch(_);return}u=r;let o=l.value;m&&we(Se(o.fullPath,n.delta),V()),T(r,o).catch(e=>W(e,H.NAVIGATION_ABORTED|H.NAVIGATION_CANCELLED)?e:W(e,H.NAVIGATION_GUARD_REDIRECT)?(C(g(b(e.to),{force:true}),r).then(e=>{W(e,H.NAVIGATION_ABORTED|H.NAVIGATION_DUPLICATED)&&!n.delta&&n.type===L.pop&&a.go(-1,false);}).catch(_),Promise.reject()):(n.delta&&a.go(-n.delta,false),j(e,r,o))).then(e=>{e=e||E(r,o,false),e&&(n.delta&&!W(e,H.NAVIGATION_CANCELLED)?a.go(-n.delta,false):n.type===L.pop&&W(e,H.NAVIGATION_ABORTED|H.NAVIGATION_DUPLICATED)&&a.go(-1,false)),ue(r,o,e);}).catch(_);}));}let O=Q(),me=Q(),A;function j(e,t,n){N(e);let r=me.list();return r.length?r.forEach(r=>r(e,t,n)):console.error(e),Promise.reject(e)}function M(){return A&&l.value!==I?Promise.resolve():new Promise((e,t)=>{O.add([e,t]);})}function N(e){return A||(A=!e,fe(),O.list().forEach(([t,n])=>e?n(e):t()),O.reset()),e}function ve(t,n,r,a){let{scrollBehavior:o}=e;if(!m||!o)return Promise.resolve();let s=!r&&Te(Se(t.fullPath,0))||(a||!r)&&history.state&&history.state.scroll||null;return t8().then(()=>o(t,n,s)).then(e=>e&&xe(e)).catch(e=>j(e,t,n))}let P=e=>a.go(e),F,R=new Set,z={currentRoute:l,listening:true,addRoute:re,removeRoute:ie,clearRoutes:t.clearRoutes,hasRoute:oe,getRoutes:ae,resolve:y,options:e,push:S,replace:se,go:P,back:()=>P(-1),forward:()=>P(1),beforeEach:o.add,beforeResolve:s.add,afterEach:c.add,onError:me.add,isReady:M,install(e){e.component(`RouterLink`,_t),e.component(`RouterView`,wt),e.config.globalProperties.$router=z,Object.defineProperty(e.config.globalProperties,`$route`,{enumerable:true,get:()=>tA(l)}),m&&!F&&l.value===I&&(F=true,S(a.location).catch(e=>{}));let t={};for(let e in I)Object.defineProperty(t,e,{get:()=>l.value[e],enumerable:true});e.provide(Y,z),e.provide(X,tc(t)),e.provide(Z,l);let n=e.unmount;R.add(e),e.unmount=function(){R.delete(e),R.size<1&&(u=I,D&&D(),D=null,l.value=I,F=false,A=false),n();};}};function B(e){return e.reduce((e,t)=>e.then(()=>w(t)),Promise.resolve())}return z}function Et(){return nd(Y)}function Dt(e){return nd(X)}

const API_ROOT = '/api';
let csrfToken = null;

class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function setCsrfToken(token) {
  csrfToken = token || null;
}

async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    csrf = false,
    timeout = 20000,
    signal: externalSignal,
  } = options;

  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (csrf && csrfToken) headers['X-CSRF-Token'] = csrfToken;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeout);
  if (externalSignal) {
    externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  let response;
  try {
    response = await fetch(`${API_ROOT}${path}`, {
      method,
      headers,
      credentials: 'same-origin',
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError('请求超时，请检查网络后再试。', 0)
    }
    throw new ApiError('暂时连接不上服务器，请稍后再试。', 0)
  } finally {
    window.clearTimeout(timeoutId);
  }

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    let message = data?.detail || '请求未能完成，请稍后再试。';
    if (typeof message !== 'string') message = '提交的内容有误，请检查后再试。';
    if (response.status === 401 && path !== '/admin/login' && path !== '/admin/me') {
      window.dispatchEvent(new CustomEvent('markblog:auth-expired'));
    }
    throw new ApiError(message, response.status, data)
  }
  return data
}

const publicApi = {
  getSite() {
    return request('/public/site')
  },
  getPosts(params = {}) {
    const search = new URLSearchParams();
    if (params.tag) search.set('tag', params.tag);
    if (params.q) search.set('q', params.q);
    if (params.limit) search.set('limit', String(params.limit));
    const suffix = search.toString() ? `?${search.toString()}` : '';
    return request(`/public/posts${suffix}`)
  },
  getPost(slug) {
    return request(`/public/posts/${encodeURIComponent(slug)}`)
  },
};

const adminApi = {
  login(username, password) {
    return request('/admin/login', {
      method: 'POST',
      body: { username, password },
    })
  },
  me() {
    return request('/admin/me')
  },
  logout() {
    return request('/admin/logout', { method: 'POST', csrf: true })
  },
  listPosts() {
    return request('/admin/posts')
  },
  getPost(id) {
    return request(`/admin/posts/${id}`)
  },
  createPost(payload) {
    return request('/admin/posts', { method: 'POST', body: payload, csrf: true })
  },
  updatePost(id, payload) {
    return request(`/admin/posts/${id}`, { method: 'PUT', body: payload, csrf: true })
  },
  deletePost(id) {
    return request(`/admin/posts/${id}`, { method: 'DELETE', csrf: true })
  },
  preview(content_md) {
    return request('/admin/preview', {
      method: 'POST',
      body: { content_md },
      csrf: true,
    })
  },
  getSettings() {
    return request('/admin/settings')
  },
  saveSettings(payload) {
    return request('/admin/settings', { method: 'PUT', body: payload, csrf: true })
  },
  changePassword(payload) {
    return request('/admin/password', { method: 'POST', body: payload, csrf: true })
  },
};

const fallback = {
  site_title: 'Markblog',
  site_subtitle: '把电脑问题，写到纸上。',
  site_description: '电脑维修、Windows 使用技巧、快捷键与数据安全的个人笔记。',
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  author_name: '慕沄 (MuYun)',
  author_bio: '电脑维修爱好者，喜欢把故障排查写成可以照着做的步骤。',
  about_html: '',
  icp_number: '',
  icp_link: 'https://beian.miit.gov.cn/',
  police_number: '',
  police_link: 'https://beian.mps.gov.cn/',
  copyright: '© {year} Markblog. 保留所有权利。',
  footer_note: '维修有风险，重要数据请先备份；本站内容为个人经验记录。',
  site_since: '2026',
  site_url: window.location.origin,
};

const state$1 = tu({
  site: fallback,
  loaded: false,
  loading: false,
  error: '',
});

let inflight$1 = null;

async function loadSite(force = false) {
  if (state$1.loaded && !force) return state$1.site
  if (inflight$1) return inflight$1
  state$1.loading = true;
  state$1.error = '';
  inflight$1 = publicApi
    .getSite()
    .then((site) => {
      state$1.site = { ...fallback, ...site };
      state$1.loaded = true;
      return state$1.site
    })
    .catch((error) => {
      state$1.error = error.message || '站点信息加载失败。';
      return state$1.site
    })
    .finally(() => {
      state$1.loading = false;
      inflight$1 = null;
    });
  return inflight$1
}

function useSite() {
  return {
    state: tf(state$1),
    loadSite,
  }
}

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _hoisted_1$2 = { class: "site-header" };
const _hoisted_2$2 = { class: "container header-inner" };
const _hoisted_3$2 = { class: "brand-type" };
const _hoisted_4$2 = { class: "brand-name" };
const _hoisted_5$1 = ["aria-expanded"];
const _hoisted_6$1 = { class: "nav-toggle__label" };


const _sfc_main$2 = {
  __name: 'SiteHeader',
  setup(__props) {

const route = Dt();
const { state: siteState } = useSite();
const menuOpen = tx(false);

const isHome = iH(() => route.name === 'home');
const isPosts = iH(() => route.name === 'posts' || route.name === 'post');
const isAbout = iH(() => route.name === 'about');
const siteTitle = iH(() => siteState.site.site_title || 'Markblog');

ny(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
  },
);

function onKeydown(event) {
  if (event.key === 'Escape' && menuOpen.value) {
    menuOpen.value = false;
    document.getElementById('nav-toggle')?.focus();
  }
}

ny(menuOpen, (open) => {
  if (open) document.addEventListener('keydown', onKeydown);
  else document.removeEventListener('keydown', onKeydown);
});

lw(() => document.removeEventListener('keydown', onKeydown));

return (_ctx, _cache) => {
  const _component_RouterLink = lN("RouterLink");

  return (r9(), ir("header", _hoisted_1$2, [
    id("div", _hoisted_2$2, [
      ip(_component_RouterLink, {
        to: "/",
        class: "brand",
        "aria-label": "返回首页"
      }, {
        default: na(() => [
          _cache[3] || (_cache[3] = id("span", {
            class: "brand-mark",
            "aria-hidden": "true"
          }, [
            id("svg", {
              viewBox: "0 0 52 52",
              fill: "none"
            }, [
              id("path", {
                d: "M11 13.5c8-5 24-6.2 31.5.2 6 5.2 4.8 20-2.5 25.1-7.5 5.2-22.4 4.8-29-2.4C5.6 30.2 7.7 18 14.5 13.8c2.8-1.7 6.6-2.4 10.2-2.1",
                stroke: "currentColor",
                "stroke-width": "1.7",
                "stroke-linecap": "round"
              }),
              id("path", {
                d: "M18.5 34.5V20.2l7.6 9.3 8-9.5v15",
                stroke: "currentColor",
                "stroke-width": "2.1",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }),
              id("circle", {
                cx: "39.2",
                cy: "14.8",
                r: "2.1",
                fill: "var(--color-vermilion)"
              })
            ])
          ], -1)),
          id("span", _hoisted_3$2, [
            id("span", _hoisted_4$2, [
              iv(ea(siteTitle.value), 1),
              _cache[1] || (_cache[1] = id("span", { class: "brand-dot" }, ".", -1))
            ]),
            _cache[2] || (_cache[2] = id("span", { class: "brand-note" }, "PERSONAL NOTES", -1))
          ])
        ]),
        _: 1
      }),
      id("button", {
        id: "nav-toggle",
        type: "button",
        class: "nav-toggle",
        "aria-expanded": menuOpen.value,
        "aria-controls": "site-nav",
        onClick: _cache[0] || (_cache[0] = $event => (menuOpen.value = !menuOpen.value))
      }, [
        id("span", _hoisted_6$1, ea(menuOpen.value ? '收起' : '目录'), 1),
        _cache[4] || (_cache[4] = id("svg", {
          viewBox: "0 0 26 18",
          width: "26",
          height: "18",
          fill: "none",
          "aria-hidden": "true"
        }, [
          id("path", {
            d: "M1 2.2c8-.7 16-.5 24 .2",
            stroke: "currentColor",
            "stroke-width": "1.8",
            "stroke-linecap": "round"
          }),
          id("path", {
            d: "M1.5 9c7 .8 15 .6 22.5-.4",
            stroke: "currentColor",
            "stroke-width": "1.8",
            "stroke-linecap": "round"
          }),
          id("path", {
            d: "M1 15.7c8 .5 15.5.4 23.5-.8",
            stroke: "currentColor",
            "stroke-width": "1.8",
            "stroke-linecap": "round"
          })
        ], -1))
      ], 8, _hoisted_5$1),
      id("nav", {
        id: "site-nav",
        class: Y$1(["site-nav", { 'is-open': menuOpen.value }]),
        "aria-label": "主导航"
      }, [
        ip(_component_RouterLink, {
          to: "/",
          class: Y$1(["nav-link", { 'is-active': isHome.value }]),
          "aria-current": isHome.value ? 'page' : undefined
        }, {
          default: na(() => [...(_cache[5] || (_cache[5] = [
            iv(" 首页 ", -1)
          ]))]),
          _: 1
        }, 8, ["class", "aria-current"]),
        ip(_component_RouterLink, {
          to: "/posts",
          class: Y$1(["nav-link", { 'is-active': isPosts.value }]),
          "aria-current": isPosts.value ? 'page' : undefined
        }, {
          default: na(() => [...(_cache[6] || (_cache[6] = [
            iv(" 文章 ", -1)
          ]))]),
          _: 1
        }, 8, ["class", "aria-current"]),
        ip(_component_RouterLink, {
          to: "/about",
          class: Y$1(["nav-link", { 'is-active': isAbout.value }]),
          "aria-current": isAbout.value ? 'page' : undefined
        }, {
          default: na(() => [...(_cache[7] || (_cache[7] = [
            iv(" 关于 ", -1)
          ]))]),
          _: 1
        }, 8, ["class", "aria-current"]),
        _cache[8] || (_cache[8] = im("<a class=\"rss-link\" href=\"/feed.xml\" aria-label=\"RSS 订阅\" data-v-3d6fa24e><svg viewBox=\"0 0 18 18\" width=\"15\" height=\"15\" fill=\"none\" aria-hidden=\"true\" data-v-3d6fa24e><circle cx=\"3\" cy=\"15\" r=\"1.7\" fill=\"currentColor\" data-v-3d6fa24e></circle><path d=\"M2 8.2A7.8 7.8 0 0 1 9.8 16\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" data-v-3d6fa24e></path><path d=\"M2 2.2A13.8 13.8 0 0 1 15.8 16\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" data-v-3d6fa24e></path></svg> RSS </a>", 1))
      ], 2)
    ])
  ]))
}
}

};
const SiteHeader = /*#__PURE__*/_export_sfc(_sfc_main$2, [['__scopeId',"data-v-3d6fa24e"]]);

const longDate = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Shanghai',
});

const shortDate = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Shanghai',
});

function parseDate(value) {
  if (!value) return null
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date
}

function formatDate(value) {
  const date = parseDate(value);
  return date ? longDate.format(date) : ''
}

function formatShortDate(value) {
  const date = parseDate(value);
  if (!date) return ''
  return shortDate.format(date).replaceAll('/', '.')
}

function copyrightLine(value) {
  const year = String(new Date().getFullYear());
  const fallback = `© ${year} Markblog. 保留所有权利。`;
  return (value || fallback).replaceAll('{year}', year)
}

function readingLabel(minutes) {
  const count = Number(minutes) || 1;
  return `约 ${count} 分钟`
}

const _hoisted_1$1 = { class: "site-footer" };
const _hoisted_2$1 = { class: "container" };
const _hoisted_3$1 = { class: "footer-top" };
const _hoisted_4$1 = { class: "footer-brand" };
const _hoisted_5 = { class: "footer-brand__name" };
const _hoisted_6 = { class: "footer-brand__text" };
const _hoisted_7 = {
  key: 0,
  class: "footer-brand__since"
};
const _hoisted_8 = {
  class: "footer-nav",
  "aria-label": "页脚导航"
};
const _hoisted_9 = { class: "footer-bottom" };
const _hoisted_10 = { class: "copyright" };
const _hoisted_11 = { class: "copyright__line" };
const _hoisted_12 = {
  key: 0,
  class: "copyright__note"
};
const _hoisted_13 = {
  class: "filings",
  "aria-label": "网站备案信息"
};
const _hoisted_14 = { class: "filing-line" };
const _hoisted_15 = ["href"];
const _hoisted_16 = {
  key: 1,
  class: "filing-pending"
};
const _hoisted_17 = {
  key: 0,
  class: "filing-line"
};
const _hoisted_18 = ["href"];


const _sfc_main$1 = {
  __name: 'SiteFooter',
  setup(__props) {

const { state: siteState } = useSite();
const site = iH(() => siteState.site);
const copyright = iH(() => copyrightLine(site.value.copyright));
const hasIcp = iH(() => Boolean(site.value.icp_number?.trim()));
const hasPolice = iH(() => Boolean(site.value.police_number?.trim()));
const since = iH(() => site.value.site_since || '');
const icpHref = iH(
  () => site.value.icp_link?.trim() || 'https://beian.miit.gov.cn/',
);
const policeHref = iH(
  () => site.value.police_link?.trim() || 'https://beian.mps.gov.cn/',
);

return (_ctx, _cache) => {
  const _component_RouterLink = lN("RouterLink");

  return (r9(), ir("footer", _hoisted_1$1, [
    id("div", _hoisted_2$1, [
      _cache[10] || (_cache[10] = id("div", {
        class: "footer-line",
        "aria-hidden": "true"
      }, null, -1)),
      id("div", _hoisted_3$1, [
        id("div", _hoisted_4$1, [
          id("p", _hoisted_5, [
            iv(ea(site.value.site_title || 'Markblog'), 1),
            _cache[0] || (_cache[0] = id("span", null, ".", -1))
          ]),
          id("p", _hoisted_6, ea(site.value.site_subtitle || '把电脑问题，写到纸上。'), 1),
          (since.value)
            ? (r9(), ir("p", _hoisted_7, "SINCE " + ea(since.value) + " · 个人非经营性博客", 1))
            : i_("", true)
        ]),
        id("nav", _hoisted_8, [
          _cache[4] || (_cache[4] = id("p", { class: "footer-heading" }, "翻一翻", -1)),
          ip(_component_RouterLink, { to: "/" }, {
            default: na(() => [...(_cache[1] || (_cache[1] = [
              iv("首页", -1)
            ]))]),
            _: 1
          }),
          ip(_component_RouterLink, { to: "/posts" }, {
            default: na(() => [...(_cache[2] || (_cache[2] = [
              iv("文章", -1)
            ]))]),
            _: 1
          }),
          ip(_component_RouterLink, { to: "/about" }, {
            default: na(() => [...(_cache[3] || (_cache[3] = [
              iv("关于", -1)
            ]))]),
            _: 1
          }),
          _cache[5] || (_cache[5] = id("a", { href: "/feed.xml" }, "RSS 订阅", -1))
        ]),
        _cache[6] || (_cache[6] = id("div", {
          class: "footer-doodle",
          "aria-hidden": "true"
        }, [
          id("span", { class: "footer-doodle__circle" }, "M"),
          id("p", null, [
            iv("用 Markdown 写，"),
            id("br"),
            iv("用铅笔灰排版。")
          ])
        ], -1))
      ]),
      id("div", _hoisted_9, [
        id("div", _hoisted_10, [
          id("p", _hoisted_11, ea(copyright.value), 1),
          (site.value.footer_note)
            ? (r9(), ir("p", _hoisted_12, ea(site.value.footer_note), 1))
            : i_("", true)
        ]),
        id("div", _hoisted_13, [
          id("p", _hoisted_14, [
            _cache[7] || (_cache[7] = id("span", { class: "filing-label" }, "ICP 备案", -1)),
            (hasIcp.value)
              ? (r9(), ir("a", {
                  key: 0,
                  class: "filing-link",
                  href: icpHref.value,
                  target: "_blank",
                  rel: "noopener noreferrer"
                }, ea(site.value.icp_number), 9, _hoisted_15))
              : (r9(), ir("span", _hoisted_16, "ICP 备案号待补充"))
          ]),
          (hasPolice.value)
            ? (r9(), ir("p", _hoisted_17, [
                _cache[8] || (_cache[8] = id("span", { class: "filing-label" }, "公安备案", -1)),
                id("a", {
                  class: "filing-link",
                  href: policeHref.value,
                  target: "_blank",
                  rel: "noopener noreferrer"
                }, ea(site.value.police_number), 9, _hoisted_18)
              ]))
            : i_("", true),
          _cache[9] || (_cache[9] = id("p", { class: "filing-hint" }, "备案信息以工信部及公安备案系统公示为准。", -1))
        ])
      ])
    ])
  ]))
}
}

};
const SiteFooter = /*#__PURE__*/_export_sfc(_sfc_main$1, [['__scopeId',"data-v-acbe5a62"]]);

function upsertMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${CSS.escape(key)}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(href) {
  const existing = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    if (existing) existing.remove();
    return
  }
  const element = existing || document.createElement('link');
  element.setAttribute('rel', 'canonical');
  element.setAttribute('href', href);
  if (!existing) document.head.appendChild(element);
}

function setRobots(noindex = false) {
  upsertMeta('name', 'robots', noindex ? 'noindex, nofollow, noarchive' : 'index, follow');
}

function setKeywords(keywords) {
  const element = document.head.querySelector('meta[name="keywords"]');
  if (!keywords) {
    if (element) element.remove();
    return
  }
  upsertMeta('name', 'keywords', keywords);
}

function setPageMeta({
  title,
  description,
  canonicalPath = null,
  siteUrl = window.location.origin,
  noindex = false,
  type = 'website',
} = {}) {
  if (title) document.title = title;
  if (typeof description === 'string') {
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:description', description);
    upsertMeta('name', 'twitter:description', description);
  }
  if (title) {
    upsertMeta('property', 'og:title', title);
    upsertMeta('name', 'twitter:title', title);
  }
  setRobots(noindex);

  let absolute = null;
  if (!noindex && canonicalPath) {
    try {
      absolute = new URL(canonicalPath, `${siteUrl.replace(/\/$/, '')}/`).toString();
    } catch {
      absolute = null;
    }
  }
  setCanonical(absolute);
  if (absolute) {
    upsertMeta('property', 'og:url', absolute);
  }
  upsertMeta('property', 'og:type', type);
  const imageBase = siteUrl || window.location.origin;
  try {
    upsertMeta('property', 'og:image', new URL('/og-cover.png', imageBase).toString());
  } catch {
    upsertMeta('property', 'og:image', '/og-cover.png');
  }
}

const _hoisted_1 = { class: "app-shell" };
const _hoisted_2 = {
  key: 0,
  class: "site-alert",
  role: "status"
};
const _hoisted_3 = { class: "container site-alert__inner" };
const _hoisted_4 = {
  id: "main-content",
  class: "app-main",
  tabindex: "-1"
};


const _sfc_main = {
  __name: 'App',
  setup(__props) {

const route = Dt();
const { state: siteState, loadSite } = useSite();

const isAdmin = iH(
  () => route.path === '/admin' || route.path.startsWith('/admin/'),
);

lS(() => {
  loadSite();
});

ny(
  () => route.path,
  () => {
    if (!isAdmin.value) {
      setRobots(false);
      setKeywords(siteState.site.seo_keywords);
    }
  },
);

ny(
  () => siteState.site.seo_keywords,
  (keywords) => {
    if (!isAdmin.value) setKeywords(keywords);
  },
  { immediate: true },
);

function retrySite() {
  loadSite(true);
}

return (_ctx, _cache) => {
  const _component_RouterView = lN("RouterView");

  return (r9(), ir("div", _hoisted_1, [
    (!isAdmin.value)
      ? (r9(), ir(r2, { key: 0 }, [
          _cache[0] || (_cache[0] = id("a", {
            class: "skip-link",
            href: "#main-content"
          }, "跳到正文", -1)),
          ip(SiteHeader),
          (tA(siteState).error)
            ? (r9(), ir("div", _hoisted_2, [
                id("div", _hoisted_3, [
                  id("span", null, ea(tA(siteState).error) + " 页面会继续显示可用的内容。", 1),
                  id("button", {
                    type: "button",
                    class: "text-link bare-button",
                    onClick: retrySite
                  }, " 再试一次 ")
                ])
              ]))
            : i_("", true),
          id("main", _hoisted_4, [
            ip(_component_RouterView)
          ]),
          ip(SiteFooter)
        ], 64))
      : (r9(), ii(_component_RouterView, { key: 1 }))
  ]))
}
}

};
const App = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-2f357b1e"]]);

const scriptRel = 'modulepreload';const assetsURL = function(dep) { return "/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (true               && deps && deps.length > 0) {
    let allSettled2 = function(promises) {
      return Promise.all(
        promises.map(
          (p) => Promise.resolve(p).then(
            (value) => ({ status: "fulfilled", value }),
            (reason) => ({ status: "rejected", reason })
          )
        )
      );
    };
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled2(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};

const state = tu({
  user: null,
  checked: false,
  loading: false,
  error: '',
});

let inflight = null;

function applySession(data) {
  state.user = {
    username: data.username,
    expires_at: data.expires_at,
  };
  state.checked = true;
  state.loading = false;
  state.error = '';
  setCsrfToken(data.csrf_token);
}

function clearAdminSession() {
  state.user = null;
  state.checked = true;
  state.loading = false;
  state.error = '';
  setCsrfToken(null);
}

async function ensureAdminSession(force = false) {
  if (state.loading && inflight) return inflight
  if (state.checked && !force) return Boolean(state.user)

  state.loading = true;
  state.error = '';
  inflight = adminApi
    .me()
    .then((data) => {
      applySession(data);
      return true
    })
    .catch((error) => {
      if (error.status === 401) {
        clearAdminSession();
        return false
      }
      state.checked = false;
      state.error = error.message || '无法确认管理员状态。';
      return false
    })
    .finally(() => {
      state.loading = false;
      inflight = null;
    });
  return inflight
}

async function signIn(credentials) {
  const data = await adminApi.login(credentials.username, credentials.password);
  applySession(data);
  return state.user
}

async function signOut() {
  try {
    await adminApi.logout();
  } finally {
    clearAdminSession();
  }
}

function useAdminSession() {
  return {
    state: tf(state),
    signIn,
    signOut,
    ensure: ensureAdminSession,
    clear: clearAdminSession,
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => __vitePreload(() => import('./HomeView-p2vs1VZZ.js'),true              ?__vite__mapDeps([0,1,2,3]):void 0),
  },
  {
    path: '/posts',
    name: 'posts',
    component: () => __vitePreload(() => import('./PostsView-c_ogPb-R.js'),true              ?__vite__mapDeps([4,2,5]):void 0),
  },
  {
    path: '/posts/:slug',
    name: 'post',
    component: () => __vitePreload(() => import('./PostView-D2H0wV_Z.js'),true              ?__vite__mapDeps([6,2,1,7]):void 0),
  },
  {
    path: '/about',
    name: 'about',
    component: () => __vitePreload(() => import('./AboutView-C-OPXN8_.js'),true              ?__vite__mapDeps([8,2,9]):void 0),
  },
  {
    path: '/admin',
    name: 'admin-login',
    component: () => __vitePreload(() => import('./AdminLoginView-D_GmHV3J.js'),true              ?__vite__mapDeps([10,11]):void 0),
    meta: { admin: true, guestOnly: true, noindex: true },
  },
  {
    path: '/admin/posts',
    name: 'admin-posts',
    component: () => __vitePreload(() => import('./AdminPostsView-2XwC5FfJ.js'),true              ?__vite__mapDeps([12,13,14,2,15]):void 0),
    meta: { admin: true, requiresAdmin: true, noindex: true },
  },
  {
    path: '/admin/posts/new',
    name: 'admin-post-new',
    component: () => __vitePreload(() => import('./AdminEditorView-lKc05Zbq.js'),true              ?__vite__mapDeps([16,13,14,2,17]):void 0),
    meta: { admin: true, requiresAdmin: true, noindex: true },
  },
  {
    path: '/admin/posts/:id(\\d+)',
    name: 'admin-post-edit',
    component: () => __vitePreload(() => import('./AdminEditorView-lKc05Zbq.js'),true              ?__vite__mapDeps([16,13,14,2,17]):void 0),
    meta: { admin: true, requiresAdmin: true, noindex: true },
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: () => __vitePreload(() => import('./AdminSettingsView-CVyZZOcZ.js'),true              ?__vite__mapDeps([18,13,14,2,19]):void 0),
    meta: { admin: true, requiresAdmin: true, noindex: true },
  },
  {
    path: '/404',
    name: 'not-found',
    component: () => __vitePreload(() => import('./NotFoundView-ByGOleCG.js'),true              ?__vite__mapDeps([20,21]):void 0),
    meta: { noindex: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'catch-all',
    component: () => __vitePreload(() => import('./NotFoundView-ByGOleCG.js'),true              ?__vite__mapDeps([20,21]):void 0),
    meta: { noindex: true },
  },
];

const router = Tt({
  history: je(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 96, behavior: 'auto' }
    return { top: 0, behavior: 'auto' }
  },
});

router.beforeEach(async (to) => {
  if (to.meta.requiresAdmin) {
    const authenticated = await ensureAdminSession();
    if (!authenticated) {
      return {
        name: 'admin-login',
        query: { next: to.fullPath },
      }
    }
  }
  if (to.meta.guestOnly) {
    const authenticated = await ensureAdminSession();
    if (authenticated) {
      return { name: 'admin-posts' }
    }
  }
  return true
});

router.afterEach((to) => {
  if (to.meta.admin) {
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute('content', 'noindex, nofollow, noarchive');
  }
});

window.addEventListener('markblog:auth-expired', () => {
  clearAdminSession();
  if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin') {
    router.replace({
      name: 'admin-login',
      query: { next: window.location.pathname + window.location.search },
    });
  }
});

const app = sb(App);
app.config.errorHandler = (error) => {
  // Keep technical detail in the console; the interface stays calm.
  console.error('[markblog]', error);
};
app.use(router);
app.mount('#app');

export { tu as A, im as B, sd as C, Dt as D, Et as E, ss as F, copyrightLine as G, t8 as H, lw as I, lD as J, adminApi as K, ut as L, sn as M, setRobots as N, Y$1 as Y, _export_sfc as _, ir as a, id as b, readingLabel as c, ip as d, ea as e, formatShortDate as f, iv as g, _t as h, iH as i, i_ as j, tx as k, lS as l, ny as m, na as n, r2 as o, lj as p, ii as q, r9 as r, setPageMeta as s, tA as t, useSite as u, publicApi as v, nu as w, o7 as x, formatDate as y, useAdminSession as z };
