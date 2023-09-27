import{g as e,f as t}from"./p-8411601b.js";import{S as n,o as r,c as o,i,e as f,a as u,b as l,f as c,p as a,d,n as _,O as h,g as v,h as w}from"./p-0cd0b2da.js";export{j as propertyObservable,s as setProperty}from"./p-0cd0b2da.js";const p={now(){return(p.delegate||Date).now()},delegate:undefined};class m extends n{constructor(e=Infinity,t=Infinity,n=p){super();this._bufferSize=e;this._windowTime=t;this._timestampProvider=n;this._buffer=[];this._infiniteTimeWindow=true;this._infiniteTimeWindow=t===Infinity;this._bufferSize=Math.max(1,e);this._windowTime=Math.max(1,t)}next(e){const{isStopped:t,_buffer:n,_infiniteTimeWindow:r,_timestampProvider:o,_windowTime:i}=this;if(!t){n.push(e);!r&&n.push(o.now()+i)}this._trimBuffer();super.next(e)}_subscribe(e){this._throwIfClosed();this._trimBuffer();const t=this._innerSubscribe(e);const{_infiniteTimeWindow:n,_buffer:r}=this;const o=r.slice();for(let t=0;t<o.length&&!e.closed;t+=n?1:2){e.next(o[t])}this._checkFinalizedStatuses(e);return t}_trimBuffer(){const{_bufferSize:e,_timestampProvider:t,_buffer:n,_infiniteTimeWindow:r}=this;const o=(r?1:2)*e;e<Infinity&&o<n.length&&n.splice(0,n.length-o);if(!r){const e=t.now();let r=0;for(let t=1;t<n.length&&n[t]<=e;t+=2){r=t}r&&n.splice(0,r+1)}}}function b(e,t){return r(((n,r)=>{let i=0;n.subscribe(o(r,(n=>{r.next(e.call(t,n,i++))})))}))}function y(e,t,n,r,s,u,l,c){const a=[];let d=0;let _=0;let h=false;const v=()=>{if(h&&!a.length&&!d){t.complete()}};const w=e=>d<r?p(e):a.push(e);const p=e=>{u&&t.next(e);d++;let c=false;i(n(e,_++)).subscribe(o(t,(e=>{s===null||s===void 0?void 0:s(e);if(u){w(e)}else{t.next(e)}}),(()=>{c=true}),undefined,(()=>{if(c){try{d--;while(a.length&&d<r){const e=a.shift();if(l){f(t,l,(()=>p(e)))}else{p(e)}}v()}catch(e){t.error(e)}}})))};e.subscribe(o(t,w,(()=>{h=true;v()})));return()=>{c===null||c===void 0?void 0:c()}}function O(e,t,n=Infinity){if(u(t)){return O(((n,r)=>b(((e,o)=>t(n,e,r,o)))(i(e(n,r)))),n)}else if(typeof t==="number"){n=t}return r(((t,r)=>y(t,r,e,n)))}function C(e=Infinity){return O(l,e)}function x(){return C(1)}function I(...e){return x()(c(e,a(e)))}function $(e={}){const{connector:t=(()=>new n),resetOnError:o=true,resetOnComplete:s=true,resetOnRefCountZero:f=true}=e;return e=>{let n;let u;let l;let c=0;let a=false;let _=false;const h=()=>{u===null||u===void 0?void 0:u.unsubscribe();u=undefined};const v=()=>{h();n=l=undefined;a=_=false};const w=()=>{const e=n;v();e===null||e===void 0?void 0:e.unsubscribe()};return r(((e,r)=>{c++;if(!_&&!a){h()}const p=l=l!==null&&l!==void 0?l:t();r.add((()=>{c--;if(c===0&&!_&&!a){u=E(w,f)}}));p.subscribe(r);if(!n&&c>0){n=new d({next:e=>p.next(e),error:e=>{_=true;h();u=E(v,o,e);p.error(e)},complete:()=>{a=true;h();u=E(v,s);p.complete()}});i(e).subscribe(n)}}))(e)}}function E(e,t,...n){if(t===true){e();return}if(t===false){return}const r=new d({next:()=>{r.unsubscribe();e()}});return i(t(...n)).subscribe(r)}function P(e,t,n){let r;let o=false;if(e&&typeof e==="object"){({bufferSize:r=Infinity,windowTime:t=Infinity,refCount:o=false,scheduler:n}=e)}else{r=e!==null&&e!==void 0?e:Infinity}return $({connector:()=>new m(r,t,n),resetOnError:true,resetOnComplete:false,resetOnRefCountZero:o})}function g(...e){const t=a(e);return r(((n,r)=>{(t?I(e,n,t):I(e,n)).subscribe(r)}))}function M(e){return r(((t,n)=>{i(e).subscribe(o(n,(()=>n.complete()),_));!n.closed&&t.subscribe(n)}))}function T(e,t,n){const i=u(e)||t||n?{next:e,error:t,complete:n}:e;return i?r(((e,t)=>{var n;(n=i.subscribe)===null||n===void 0?void 0:n.call(i);let r=true;e.subscribe(o(t,(e=>{var n;(n=i.next)===null||n===void 0?void 0:n.call(i,e);t.next(e)}),(()=>{var e;r=false;(e=i.complete)===null||e===void 0?void 0:e.call(i);t.complete()}),(e=>{var n;r=false;(n=i.error)===null||n===void 0?void 0:n.call(i,e);t.error(e)}),(()=>{var e,t;if(r){(e=i.unsubscribe)===null||e===void 0?void 0:e.call(i)}(t=i.finalize)===null||t===void 0?void 0:t.call(i)})))})):l}function S(e){if("function"!==typeof e.render){throw new Error("Component does not have a render function.")}return new h((t=>{let n=e.render;e.render=function(){Promise.resolve().then((()=>{t.next()}));return n.call(this)};return()=>{e.render=n}}))}function W(t,n=false){return(r,o)=>{let i={set:function(){throw new Error(`Property "${o}" is read-only.`)},get:function(){let r=`__rx__query_selector__observable__shadow_root__${n?"yes":"no"}__selector__${t}__`;if(!this[r]){let o=e(this);if(n){o=o.shadowRoot}this[r]=S(this).pipe(g(),b((()=>o.querySelector(t))),v(),P(1))}return this[r]}};Object.defineProperty(r,o,i)}}function k(t,n=false){return(r,o)=>{let i={set:function(){throw new Error(`Property "${o}" is read-only.`)},get:function(){let r=`__rx__query_selector_all__observable__shadow_root__${n?"yes":"no"}__selector__${t}__`;if(!this[r]){let o=e(this);if(n){o=o.shadowRoot}this[r]=S(this).pipe(g(),b((()=>Array.from(o.querySelectorAll(t)))),v(((e,t)=>{if(e.length!==t.length){return false}for(let n=0;n<e.length;n++){if(e[n]!==t[n]){return false}}return true})),P(1))}return this[r]}};Object.defineProperty(r,o,i)}}function q(e,n=true){return r=>r.pipe(T((()=>{if(!n){t(e);return}Promise.resolve().then((()=>t(e)))})))}function z(e,t){w(e,t);return n=>n.pipe(T((n=>{e[t]=n})))}let A=new WeakMap;let D=function(e){let t=e.disconnectedCallback;if(!t){throw new Error(`Component "${e.constructor.name}" does not have a "disconnectedCallback()" method defined.`)}let r=new n;e.disconnectedCallback=function(){if(t){t.call(e)}r.next()};return r.asObservable()};let R=function(t){let n=e(t);if(null===n.parentNode){throw new Error(`Component "${t.constructor.name}" is not within DOM.`)}return new h((e=>{let r=new MutationObserver((t=>{t.forEach((t=>{for(let r of Array.from(t.removedNodes)){if(r!==n){continue}e.next();e.complete()}}))}));r.observe(n.parentNode,{childList:true,subtree:true});return()=>{r.disconnect();A.delete(t)}}))};function Z(e){let t=[D,R];for(let n of t){try{A.set(e,n(e));return}catch(e){}}throw new Error(`Could not create disconnect observable for component "${e.constructor.name}".`)}function B(e){return t=>{if(!A.has(e)){Z(e)}let n=A.get(e);return t.pipe(M(n))}}export{W as QuerySelector,k as QuerySelectorAll,S as renderObservable,q as scheduleRender,z as toProperty,B as untilDisconnected};
//# sourceMappingURL=index.esm.js.map