import{a1 as kt,a2 as bt,a3 as _e,w as ie,e as b,x as ae,t as k,a4 as wt,S as W,i as Z,s as V,A as vt,a5 as yt,B as O,E as jt,h as me,G as $,J as S,v as y,u as ge,j as $e,k as he,y as j,b as ee,a6 as fe,O as ue,c as L,m as A,f as E,Q as Ee,N as J,Z as G,a7 as it,T as P,K as R,Y as _,X as ce,_ as we,M as at,a as ve,d as ye,F as H,a8 as ct,R as De,a0 as Q,H as F,r as ut,I as x,a9 as ft,aa as pt,ab as ke,U as ne,l as Ne,ac as Ct,P as dt,V as St,$ as Lt}from"./Layout-d596de5b.js";function At(n,e){const l=e.token={};function t(r,s,o,c){if(e.token!==l)return;e.resolved=c;let i=e.ctx;o!==void 0&&(i=i.slice(),i[o]=c);const a=r&&(e.current=r)(i);let f=!1;e.block&&(e.blocks?e.blocks.forEach((u,p)=>{p!==s&&u&&(ie(),b(u,1,1,()=>{e.blocks[p]===u&&(e.blocks[p]=null)}),ae())}):e.block.d(1),a.c(),k(a,1),a.m(e.mount(),e.anchor),f=!0),e.block=a,e.blocks&&(e.blocks[s]=a),f&&wt()}if(kt(n)){const r=bt();if(n.then(s=>{_e(r),t(e.then,1,e.value,s),_e(null)},s=>{if(_e(r),t(e.catch,2,e.error,s),_e(null),!e.hasCatch)throw s}),e.current!==e.pending)return t(e.pending,0),!0}else{if(e.current!==e.then)return t(e.then,1,e.value,n),!0;e.resolved=n}}function Et(n,e,l){const t=e.slice(),{resolved:r}=n;n.current===n.then&&(t[n.value]=r),n.current===n.catch&&(t[n.error]=r),n.block.p(t,l)}function Dt(n,e,l){let t;const r=vt();let{layer:s=void 0}=e;const{map:o}=yt();O(n,o,f=>l(2,t=f));function c(f){r(f.type,{...f,map:o})}const i=["click","dblclick","mousedown","mouseup","mousemove","mouseenter","mouseleave","contextmenu","mouseover","mouseout"],a=["click","dblclick","contextmenu","mousemove","movestart","moveend","zoomstart","zoom","zoomend"];return jt(()=>{if(t)if(s)for(const f of i)t.off(f,s,c);else for(const f of a)t.off(f,c)}),n.$$set=f=>{"layer"in f&&l(1,s=f.layer)},n.$$.update=()=>{if(n.$$.dirty&6&&t)if(s)for(const f of i)t.on(f,s,c);else for(const f of a)t.on(f,c)},[o,s,t]}class Nt extends W{constructor(e){super(),Z(this,e,Dt,null,V,{layer:1})}}const Tt=n=>({}),qe=n=>({}),Bt=n=>({}),Ie=n=>({});function Jt(n){let e,l,t,r;const s=n[3].sidebar,o=me(s,n,n[2],Ie),c=n[3].map,i=me(c,n,n[2],qe);return{c(){e=$("div"),o&&o.c(),l=S(),t=$("div"),i&&i.c()},m(a,f){y(a,e,f),o&&o.m(e,null),n[4](e),y(a,l,f),y(a,t,f),i&&i.m(t,null),n[5](t),r=!0},p(a,[f]){o&&o.p&&(!r||f&4)&&ge(o,s,a,a[2],r?he(s,a[2],f,Bt):$e(a[2]),Ie),i&&i.p&&(!r||f&4)&&ge(i,c,a,a[2],r?he(c,a[2],f,Tt):$e(a[2]),qe)},i(a){r||(k(o,a),k(i,a),r=!0)},o(a){b(o,a),b(i,a),r=!1},d(a){a&&(j(e),j(l),j(t)),o&&o.d(a),n[4](null),i&&i.d(a),n[5](null)}}}function qt(n,e,l){let t,r;O(n,Se,a=>l(0,t=a)),O(n,Le,a=>l(1,r=a));let{$$slots:s={},$$scope:o}=e;function c(a){ee[a?"unshift":"push"](()=>{t=a,Se.set(t)})}function i(a){ee[a?"unshift":"push"](()=>{r=a,Le.set(r)})}return n.$$set=a=>{"$$scope"in a&&l(2,o=a.$$scope)},[t,r,o,s,c,i]}class je extends W{constructor(e){super(),Z(this,e,qt,Jt,V,{})}}let Se=fe(null),Le=fe(null),Ae=fe(void 0),K=fe(Ft());function X(n){return{type:"FeatureCollection",features:n}}let z=fe({kind:"neutral"});function Y(){return["","2","1","0","Critical"]}let U=[{name:"Street or path check",description:"Is this on-carriageway or a traffic-free path?",choices:["","Street check","Path check"]},{name:"SA03",description:"lane widths",choices:Y()},{name:"SA04",description:"trip hazards",choices:Y()},{name:"SA05",description:"kerbside activity",choices:Y()},{name:"SA08",description:"motor traffic speed",choices:Y()},{name:"SA09",description:"motor traffic volume",choices:Y()},{name:"SA11",description:"footway widths",choices:Y()},{name:"SA12",description:"effective width next to tram lines",choices:Y()},{name:"SA13",description:"crossing angle of tram/train rails",choices:Y()},{name:"SA14",description:"cycling surface and maintenance defects",choices:Y()},{name:"SA15",description:"WW surface and maintenance defects",choices:Y()},{name:"SA16",description:"guard railing",choices:Y()}],be=["#66C5CC","#F6CF71","#F89C74","#DCB0F2","#87C55F","#9EB9F3","#FE88B1","#C9DB74","#8BE0A4","#B497E7","#D3B484","#B3B3B3"];function It(n){return{type:"Feature",geometry:{type:"LineString",coordinates:[]},properties:{name:"Untitled link",color:be[n%be.length],answers:Array(U.length).fill("")}}}function Mt(n,e){return{type:"Feature",geometry:{type:"Point",coordinates:e},properties:{name:"Untitled JAT",color:be[n%be.length]}}}function Ft(){try{let n=JSON.parse(window.localStorage.getItem("tmp-rcv2")||"");if("links"in n&&"jats"in n)return n}catch{}return{links:[],jats:[]}}function Gt(n){let e,l;return e=new Ee({props:{paint:{"line-color":["get","color"],"line-width":6}}}),{c(){L(e.$$.fragment)},m(t,r){A(e,t,r),l=!0},p:J,i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){b(e.$$.fragment,t),l=!1},d(t){E(e,t)}}}function zt(n){let e,l;return e=new ue({props:{data:X(n[0].links),$$slots:{default:[Gt]},$$scope:{ctx:n}}}),{c(){L(e.$$.fragment)},m(t,r){A(e,t,r),l=!0},p(t,[r]){const s={};r&1&&(s.data=X(t[0].links)),r&2&&(s.$$scope={dirty:r,ctx:t}),e.$set(s)},i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){b(e.$$.fragment,t),l=!1},d(t){E(e,t)}}}function Ot(n,e,l){let t;return O(n,K,r=>l(0,t=r)),[t]}class _t extends W{constructor(e){super(),Z(this,e,Ot,zt,V,{})}}const{window:Kt}=it;function Pt(n){let e,l,t,r,s,o,c,i,a,f;return{c(){e=$("div"),l=$("button"),l.textContent="Done",t=S(),r=$("button"),r.textContent="Delete JAT",s=S(),o=$("label"),c=P(`Name:
      `),i=$("input"),R(i,"type","text"),R(e,"slot","sidebar")},m(u,p){y(u,e,p),_(e,l),_(e,t),_(e,r),_(e,s),_(e,o),_(o,c),_(o,i),ce(i,n[1].jats[n[0]].properties.name),a||(f=[G(l,"click",n[6]),G(r,"click",n[4]),G(i,"input",n[7])],a=!0)},p(u,p){p&3&&i.value!==u[1].jats[u[0]].properties.name&&ce(i,u[1].jats[u[0]].properties.name)},d(u){u&&j(e),a=!1,we(f)}}}function Rt(n){let e,l;return e=new De({props:{filter:["!=",["id"],n[0]],paint:{"circle-color":"black","circle-radius":20}}}),{c(){L(e.$$.fragment)},m(t,r){A(e,t,r),l=!0},p(t,r){const s={};r&1&&(s.filter=["!=",["id"],t[0]]),e.$set(s)},i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){b(e.$$.fragment,t),l=!1},d(t){E(e,t)}}}function Ht(n){let e;return{c(){e=$("span"),R(e,"class","dot svelte-2eh81m"),Q(e,"background-color",n[1].jats[n[0]].properties.color)},m(l,t){y(l,e,t)},p(l,t){t&3&&Q(e,"background-color",l[1].jats[l[0]].properties.color)},d(l){l&&j(e)}}}function Ut(n){let e,l,t,r,s,o,c,i;l=new _t({}),r=new ue({props:{data:X(n[1].jats),generateId:!0,$$slots:{default:[Rt]},$$scope:{ctx:n}}});function a(u){n[5](u)}let f={draggable:!0,$$slots:{default:[Ht]},$$scope:{ctx:n}};return n[1].jats[n[0]].geometry.coordinates!==void 0&&(f.lngLat=n[1].jats[n[0]].geometry.coordinates),o=new at({props:f}),ee.push(()=>ve(o,"lngLat",a)),{c(){e=$("div"),L(l.$$.fragment),t=S(),L(r.$$.fragment),s=S(),L(o.$$.fragment),R(e,"slot","map")},m(u,p){y(u,e,p),A(l,e,null),_(e,t),A(r,e,null),_(e,s),A(o,e,null),i=!0},p(u,p){const d={};p&2&&(d.data=X(u[1].jats)),p&257&&(d.$$scope={dirty:p,ctx:u}),r.$set(d);const g={};p&259&&(g.$$scope={dirty:p,ctx:u}),!c&&p&3&&(c=!0,g.lngLat=u[1].jats[u[0]].geometry.coordinates,ye(()=>c=!1)),o.$set(g)},i(u){i||(k(l.$$.fragment,u),k(r.$$.fragment,u),k(o.$$.fragment,u),i=!0)},o(u){b(l.$$.fragment,u),b(r.$$.fragment,u),b(o.$$.fragment,u),i=!1},d(u){u&&j(e),E(l),E(r),E(o)}}}function Qt(n){let e,l,t,r;return e=new je({props:{$$slots:{map:[Ut],sidebar:[Pt]},$$scope:{ctx:n}}}),{c(){L(e.$$.fragment)},m(s,o){A(e,s,o),l=!0,t||(r=G(Kt,"keydown",n[3]),t=!0)},p(s,[o]){const c={};o&263&&(c.$$scope={dirty:o,ctx:s}),e.$set(c)},i(s){l||(k(e.$$.fragment,s),l=!0)},o(s){b(e.$$.fragment,s),l=!1},d(s){E(e,s),t=!1,r()}}}function Wt(n,e,l){let t,r;O(n,K,u=>l(1,t=u)),O(n,z,u=>l(2,r=u));let{idx:s}=e;function o(u){u.key=="Escape"&&H(z,r={kind:"neutral"},r)}async function c(){window.confirm("Really delete this JAT?")&&(H(z,r={kind:"neutral"},r),await ct(),t.jats.splice(s,1),K.set(t))}function i(u){n.$$.not_equal(t.jats[s].geometry.coordinates,u)&&(t.jats[s].geometry.coordinates=u,K.set(t))}const a=()=>H(z,r={kind:"neutral"},r);function f(){t.jats[s].properties.name=this.value,K.set(t)}return n.$$set=u=>{"idx"in u&&l(0,s=u.idx)},[s,t,r,o,c,i,a,f]}class Zt extends W{constructor(e){super(),Z(this,e,Wt,Qt,V,{idx:0})}}function Me(n,e,l){const t=n.slice();return t[3]=e[l],t[4]=e,t[5]=l,t}function Vt(n){let e,l;return{c(){e=$("span"),l=S(),R(e,"class","dot svelte-jgyhla")},m(t,r){y(t,e,r),y(t,l,r)},p:J,d(t){t&&(j(e),j(l))}}}function Fe(n){let e,l,t;function r(o){n[2](o,n[3],n[4],n[5])}let s={draggable:!0,$$slots:{default:[Vt]},$$scope:{ctx:n}};return n[3]!==void 0&&(s.lngLat=n[3]),e=new at({props:s}),ee.push(()=>ve(e,"lngLat",r)),{c(){L(e.$$.fragment)},m(o,c){A(e,o,c),t=!0},p(o,c){n=o;const i={};c&64&&(i.$$scope={dirty:c,ctx:n}),!l&&c&1&&(l=!0,i.lngLat=n[3],ye(()=>l=!1)),e.$set(i)},i(o){t||(k(e.$$.fragment,o),t=!0)},o(o){b(e.$$.fragment,o),t=!1},d(o){E(e,o)}}}function Xt(n){let e,l,t,r;e=new Nt({}),e.$on("click",n[1]);let s=F(n[0].geometry.coordinates),o=[];for(let i=0;i<s.length;i+=1)o[i]=Fe(Me(n,s,i));const c=i=>b(o[i],1,1,()=>{o[i]=null});return{c(){L(e.$$.fragment),l=S();for(let i=0;i<o.length;i+=1)o[i].c();t=ut()},m(i,a){A(e,i,a),y(i,l,a);for(let f=0;f<o.length;f+=1)o[f]&&o[f].m(i,a);y(i,t,a),r=!0},p(i,[a]){if(a&1){s=F(i[0].geometry.coordinates);let f;for(f=0;f<s.length;f+=1){const u=Me(i,s,f);o[f]?(o[f].p(u,a),k(o[f],1)):(o[f]=Fe(u),o[f].c(),k(o[f],1),o[f].m(t.parentNode,t))}for(ie(),f=s.length;f<o.length;f+=1)c(f);ae()}},i(i){if(!r){k(e.$$.fragment,i);for(let a=0;a<s.length;a+=1)k(o[a]);r=!0}},o(i){b(e.$$.fragment,i),o=o.filter(Boolean);for(let a=0;a<o.length;a+=1)b(o[a]);r=!1},d(i){i&&(j(l),j(t)),E(e,i),x(o,i)}}}function Yt(n,e,l){let{f:t}=e;function r(o){t.geometry.coordinates.push(o.detail.lngLat.toArray()),l(0,t)}function s(o,c,i,a){i[a]=o,l(0,t)}return n.$$set=o=>{"f"in o&&l(0,t=o.f)},[t,r,s]}class xt extends W{constructor(e){super(),Z(this,e,Yt,Xt,V,{f:0})}}function en(n){let e,l;return e=new De({props:{paint:{"circle-color":["get","color"],"circle-radius":20}}}),{c(){L(e.$$.fragment)},m(t,r){A(e,t,r),l=!0},p:J,i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){b(e.$$.fragment,t),l=!1},d(t){E(e,t)}}}function tn(n){let e,l;return e=new ue({props:{data:X(n[0].jats),$$slots:{default:[en]},$$scope:{ctx:n}}}),{c(){L(e.$$.fragment)},m(t,r){A(e,t,r),l=!0},p(t,[r]){const s={};r&1&&(s.data=X(t[0].jats)),r&2&&(s.$$scope={dirty:r,ctx:t}),e.$set(s)},i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){b(e.$$.fragment,t),l=!1},d(t){E(e,t)}}}function nn(n,e,l){let t;return O(n,K,r=>l(0,t=r)),[t]}class mt extends W{constructor(e){super(),Z(this,e,nn,tn,V,{})}}const{window:ln}=it;function Ge(n,e,l){const t=n.slice();return t[10]=e[l],t[11]=e,t[12]=l,t}function rn(n,e,l){const t=n.slice();return t[13]=e[l],t}function ze(n){let e;return{c(){e=$("p"),e.textContent="A link needs at least two points"},m(l,t){y(l,e,t)},d(l){l&&j(e)}}}function on(n){let e;return{c(){e=$("option"),e.textContent=`${n[13]}`,e.__value=n[13],ce(e,e.__value)},m(l,t){y(l,e,t)},p:J,d(l){l&&j(e)}}}function Oe(n){let e,l=n[10].name+"",t,r,s=n[10].description+"",o,c,i,a,f,u,p=F(n[10].choices),d=[];for(let m=0;m<p.length;m+=1)d[m]=on(rn(n,p,m));function g(){n[9].call(i,n[12])}return{c(){e=$("label"),t=P(l),r=P(": "),o=P(s),c=S(),i=$("select");for(let m=0;m<d.length;m+=1)d[m].c();a=S(),n[1].links[n[0]].properties.answers[n[12]]===void 0&&pt(g)},m(m,C){y(m,e,C),_(e,t),_(e,r),_(e,o),_(e,c),_(e,i);for(let T=0;T<d.length;T+=1)d[T]&&d[T].m(i,null);ke(i,n[1].links[n[0]].properties.answers[n[12]],!0),_(e,a),f||(u=G(i,"change",g),f=!0)},p(m,C){n=m,C&3&&ke(i,n[1].links[n[0]].properties.answers[n[12]])},d(m){m&&j(e),x(d,m),f=!1,u()}}}function sn(n){let e,l,t,r,s,o,c,i,a,f,u,p,d,g,m=!n[2]&&ze(),C=F(U),T=[];for(let v=0;v<C.length;v+=1)T[v]=Oe(Ge(n,C,v));return{c(){e=$("div"),l=$("button"),t=P("Done"),s=S(),o=$("button"),o.textContent="Delete link",c=S(),m&&m.c(),i=S(),a=$("label"),f=P(`Name:
      `),u=$("input"),p=S();for(let v=0;v<T.length;v+=1)T[v].c();l.disabled=r=!n[2],R(u,"type","text"),R(e,"slot","sidebar")},m(v,D){y(v,e,D),_(e,l),_(l,t),_(e,s),_(e,o),_(e,c),m&&m.m(e,null),_(e,i),_(e,a),_(a,f),_(a,u),ce(u,n[1].links[n[0]].properties.name),_(e,p);for(let B=0;B<T.length;B+=1)T[B]&&T[B].m(e,null);d||(g=[G(l,"click",n[7]),G(o,"click",n[5]),G(u,"input",n[8])],d=!0)},p(v,D){if(D&4&&r!==(r=!v[2])&&(l.disabled=r),v[2]?m&&(m.d(1),m=null):m||(m=ze(),m.c(),m.m(e,i)),D&3&&u.value!==v[1].links[v[0]].properties.name&&ce(u,v[1].links[v[0]].properties.name),D&3){C=F(U);let B;for(B=0;B<C.length;B+=1){const le=Ge(v,C,B);T[B]?T[B].p(le,D):(T[B]=Oe(le),T[B].c(),T[B].m(e,null))}for(;B<T.length;B+=1)T[B].d(1);T.length=C.length}},d(v){v&&j(e),m&&m.d(),x(T,v),d=!1,we(g)}}}function an(n){let e,l;return e=new Ee({props:{paint:{"line-color":["case",["==",["id"],n[0]],["get","color"],"black"],"line-opacity":["case",["==",["id"],n[0]],1,.5],"line-width":6}}}),{c(){L(e.$$.fragment)},m(t,r){A(e,t,r),l=!0},p(t,r){const s={};r&1&&(s.paint={"line-color":["case",["==",["id"],t[0]],["get","color"],"black"],"line-opacity":["case",["==",["id"],t[0]],1,.5],"line-width":6}),e.$set(s)},i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){b(e.$$.fragment,t),l=!1},d(t){E(e,t)}}}function cn(n){let e,l,t,r,s,o,c,i;l=new ue({props:{data:X(n[1].links),generateId:!0,$$slots:{default:[an]},$$scope:{ctx:n}}}),r=new mt({});function a(u){n[6](u)}let f={};return n[1].links[n[0]]!==void 0&&(f.f=n[1].links[n[0]]),o=new xt({props:f}),ee.push(()=>ve(o,"f",a)),{c(){e=$("div"),L(l.$$.fragment),t=S(),L(r.$$.fragment),s=S(),L(o.$$.fragment),R(e,"slot","map")},m(u,p){y(u,e,p),A(l,e,null),_(e,t),A(r,e,null),_(e,s),A(o,e,null),i=!0},p(u,p){const d={};p&2&&(d.data=X(u[1].links)),p&65537&&(d.$$scope={dirty:p,ctx:u}),l.$set(d);const g={};!c&&p&3&&(c=!0,g.f=u[1].links[u[0]],ye(()=>c=!1)),o.$set(g)},i(u){i||(k(l.$$.fragment,u),k(r.$$.fragment,u),k(o.$$.fragment,u),i=!0)},o(u){b(l.$$.fragment,u),b(r.$$.fragment,u),b(o.$$.fragment,u),i=!1},d(u){u&&j(e),E(l),E(r),E(o)}}}function un(n){let e,l,t,r;return e=new je({props:{$$slots:{map:[cn],sidebar:[sn]},$$scope:{ctx:n}}}),{c(){L(e.$$.fragment)},m(s,o){A(e,s,o),l=!0,t||(r=G(ln,"keydown",n[4]),t=!0)},p(s,[o]){const c={};o&65551&&(c.$$scope={dirty:o,ctx:s}),e.$set(c)},i(s){l||(k(e.$$.fragment,s),l=!0)},o(s){b(e.$$.fragment,s),l=!1},d(s){E(e,s),t=!1,r()}}}function fn(n,e,l){let t,r,s;O(n,K,d=>l(1,r=d)),O(n,z,d=>l(3,s=d));let{idx:o}=e;function c(d){d.key=="Escape"&&t&&H(z,s={kind:"neutral"},s)}async function i(){window.confirm("Really delete this link?")&&(H(z,s={kind:"neutral"},s),await ct(),r.links.splice(o,1),K.set(r))}function a(d){n.$$.not_equal(r.links[o],d)&&(r.links[o]=d,K.set(r))}const f=()=>H(z,s={kind:"neutral"},s);function u(){r.links[o].properties.name=this.value,K.set(r)}function p(d){r.links[o].properties.answers[d]=ft(this),K.set(r)}return n.$$set=d=>{"idx"in d&&l(0,o=d.idx)},n.$$.update=()=>{n.$$.dirty&3&&l(2,t=r.links[o].geometry.coordinates.length>=2)},[o,r,t,s,c,i,a,f,u,p]}class pn extends W{constructor(e){super(),Z(this,e,fn,un,V,{idx:0})}}function Ke(n,e,l){const t=n.slice();return t[6]=e[l],t[7]=e,t[8]=l,t}function Pe(n,e,l){const t=n.slice();return t[9]=e[l],t}function Re(n){let e,l=n[9]+"",t,r;return{c(){e=$("option"),t=P(l),e.__value=r=n[9],ce(e,e.__value)},m(s,o){y(s,e,o),_(e,t)},p(s,o){o&1&&l!==(l=s[9]+"")&&ne(t,l),o&1&&r!==(r=s[9])&&(e.__value=r,ce(e,e.__value))},d(s){s&&j(e)}}}function He(n){let e,l,t=n[6].properties.name+"",r,s,o,c,i,a,f=F(U[n[0]].choices),u=[];for(let d=0;d<f.length;d+=1)u[d]=Re(Pe(n,f,d));function p(){n[5].call(o,n[7],n[8])}return{c(){e=$("li"),l=$("span"),r=P(t),s=S(),o=$("select");for(let d=0;d<u.length;d+=1)u[d].c();c=S(),Q(l,"color",n[6].properties.color),n[6].properties.answers[n[0]]===void 0&&pt(p)},m(d,g){y(d,e,g),_(e,l),_(l,r),_(e,s),_(e,o);for(let m=0;m<u.length;m+=1)u[m]&&u[m].m(o,null);ke(o,n[6].properties.answers[n[0]],!0),_(e,c),i||(a=G(o,"change",p),i=!0)},p(d,g){if(n=d,g&4&&t!==(t=n[6].properties.name+"")&&ne(r,t),g&4&&Q(l,"color",n[6].properties.color),g&1){f=F(U[n[0]].choices);let m;for(m=0;m<f.length;m+=1){const C=Pe(n,f,m);u[m]?u[m].p(C,g):(u[m]=Re(C),u[m].c(),u[m].m(o,null))}for(;m<u.length;m+=1)u[m].d(1);u.length=f.length}g&5&&ke(o,n[6].properties.answers[n[0]])},d(d){d&&j(e),x(u,d),i=!1,a()}}}function dn(n){let e,l,t,r,s=U[n[0]].name+"",o,c,i=U[n[0]].description+"",a,f,u,p,d,g=F(n[2].links),m=[];for(let C=0;C<g.length;C+=1)m[C]=He(Ke(n,g,C));return{c(){e=$("div"),l=$("button"),l.textContent="Done",t=S(),r=$("h2"),o=P(s),c=P(": "),a=P(i),f=S(),u=$("ol");for(let C=0;C<m.length;C+=1)m[C].c();R(e,"slot","sidebar")},m(C,T){y(C,e,T),_(e,l),_(e,t),_(e,r),_(r,o),_(r,c),_(r,a),_(e,f),_(e,u);for(let v=0;v<m.length;v+=1)m[v]&&m[v].m(u,null);p||(d=G(l,"click",n[4]),p=!0)},p(C,T){if(T&1&&s!==(s=U[C[0]].name+"")&&ne(o,s),T&1&&i!==(i=U[C[0]].description+"")&&ne(a,i),T&5){g=F(C[2].links);let v;for(v=0;v<g.length;v+=1){const D=Ke(C,g,v);m[v]?m[v].p(D,T):(m[v]=He(D),m[v].c(),m[v].m(u,null))}for(;v<m.length;v+=1)m[v].d(1);m.length=g.length}},d(C){C&&j(e),x(m,C),p=!1,d()}}}function _n(n){let e,l,t,r,s;return l=new _t({}),r=new mt({}),{c(){e=$("div"),L(l.$$.fragment),t=S(),L(r.$$.fragment),R(e,"slot","map")},m(o,c){y(o,e,c),A(l,e,null),_(e,t),A(r,e,null),s=!0},p:J,i(o){s||(k(l.$$.fragment,o),k(r.$$.fragment,o),s=!0)},o(o){b(l.$$.fragment,o),b(r.$$.fragment,o),s=!1},d(o){o&&j(e),E(l),E(r)}}}function mn(n){let e,l,t,r;return e=new je({props:{$$slots:{map:[_n],sidebar:[dn]},$$scope:{ctx:n}}}),{c(){L(e.$$.fragment)},m(s,o){A(e,s,o),l=!0,t||(r=G(window,"keydown",n[3]),t=!0)},p(s,[o]){const c={};o&4103&&(c.$$scope={dirty:o,ctx:s}),e.$set(c)},i(s){l||(k(e.$$.fragment,s),l=!0)},o(s){b(e.$$.fragment,s),l=!1},d(s){E(e,s),t=!1,r()}}}function gn(n,e,l){let t,r;O(n,z,a=>l(1,t=a)),O(n,K,a=>l(2,r=a));let{qIdx:s}=e;function o(a){a.key=="Escape"&&H(z,t={kind:"neutral"},t)}const c=()=>H(z,t={kind:"neutral"},t);function i(a,f){a[f].properties.answers[s]=ft(this),K.set(r),l(0,s)}return n.$$set=a=>{"qIdx"in a&&l(0,s=a.qIdx)},[s,t,r,o,c,i]}class $n extends W{constructor(e){super(),Z(this,e,gn,mn,V,{qIdx:0})}}let Ue="MZEJTanw3WpxRvt7qDfo";async function hn(n){return n?{version:8,sources:{"raster-tiles":{type:"raster",tiles:[`https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=${await kn(n)}&key=${n}`],tileSize:256,attribution:"Google (detailed attributions not wired up)"}},layers:[{id:"raster-basemap",type:"raster",source:"raster-tiles"}],glyphs:`https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${Ue}`}:`https://api.maptiler.com/maps/dataviz/style.json?key=${Ue}`}async function kn(n){try{let l=await(await fetch(`https://tile.googleapis.com/v1/createSession?key=${n}`,{method:"POST",body:JSON.stringify({mapType:"satellite",language:"en-GB",region:"GB"})})).json();return"session"in l?l.session:(console.error(`Couldn't get Google tile session key: ${JSON.stringify(l)}`),"")}catch(e){return console.error(`Couldn't get Google tile session key: ${e}`),""}}const bn=n=>({dialog:n&1}),Qe=n=>({dialog:n[0]});function wn(n){let e,l,t,r,s;const o=n[4].default,c=me(o,n,n[3],Qe);return{c(){e=$("dialog"),l=$("article"),c&&c.c(),e.open=!0},m(i,a){y(i,e,a),_(e,l),c&&c.m(l,null),n[6](e),t=!0,r||(s=[G(window,"click",n[1]),G(window,"keydown",n[2]),G(e,"close",n[5])],r=!0)},p(i,[a]){c&&c.p&&(!t||a&9)&&ge(c,o,i,i[3],t?he(o,i[3],a,bn):$e(i[3]),Qe)},i(i){t||(k(c,i),t=!0)},o(i){b(c,i),t=!1},d(i){i&&j(e),c&&c.d(i),n[6](null),r=!1,we(s)}}}function vn(n,e,l){let{$$slots:t={},$$scope:r}=e,s;function o(f){s.open&&f.target==s&&s.close()}function c(f){(f.key=="Escape"||f.key=="Enter")&&(f.stopPropagation(),s.close())}function i(f){Ne.call(this,n,f)}function a(f){ee[f?"unshift":"push"](()=>{s=f,l(0,s)})}return n.$$set=f=>{"$$scope"in f&&l(3,r=f.$$scope)},[s,o,c,r,t,i,a]}class yn extends W{constructor(e){super(),Z(this,e,vn,wn,V,{})}}function jn(n,e){let l=document.createElement("a");l.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(e)),l.setAttribute("download",n),document.body.appendChild(l),l.click(),document.body.removeChild(l)}function Cn(n){let e,l,t,r;const s=n[2].default,o=me(s,n,n[1],null);return{c(){e=$("a"),o&&o.c(),R(e,"href","#"),Q(e,"color",n[0])},m(c,i){y(c,e,i),o&&o.m(e,null),l=!0,t||(r=G(e,"click",Ct(n[3])),t=!0)},p(c,[i]){o&&o.p&&(!l||i&2)&&ge(o,s,c,c[1],l?he(s,c[1],i,null):$e(c[1]),null),i&1&&Q(e,"color",c[0])},i(c){l||(k(o,c),l=!0)},o(c){b(o,c),l=!1},d(c){c&&j(e),o&&o.d(c),t=!1,r()}}}function Sn(n,e,l){let{$$slots:t={},$$scope:r}=e,{color:s=void 0}=e;function o(c){Ne.call(this,n,c)}return n.$$set=c=>{"color"in c&&l(0,s=c.color),"$$scope"in c&&l(1,r=c.$$scope)},[s,r,t,o]}class Te extends W{constructor(e){super(),Z(this,e,Sn,Cn,V,{color:0})}}function We(n,e,l){const t=n.slice();return t[2]=e[l],t[4]=l,t}function Ze(n,e,l){const t=n.slice();t[5]=e[l];const r=t[5].properties.answers[t[4]];return t[6]=r,t}function Ve(n,e,l){const t=n.slice();return t[5]=e[l],t}function Xe(n){let e,l=n[5].properties.name+"",t;return{c(){e=$("th"),t=P(l),Q(e,"color",n[5].properties.color)},m(r,s){y(r,e,s),_(e,t)},p(r,s){s&1&&l!==(l=r[5].properties.name+"")&&ne(t,l),s&1&&Q(e,"color",r[5].properties.color)},d(r){r&&j(e)}}}function Ye(n){let e,l=n[6]+"",t;return{c(){e=$("td"),t=P(l),Q(e,"background",n[6]==""?"red":"green")},m(r,s){y(r,e,s),_(e,t)},p(r,s){s&1&&l!==(l=r[6]+"")&&ne(t,l),s&1&&Q(e,"background",r[6]==""?"red":"green")},d(r){r&&j(e)}}}function xe(n){let e,l,t,r,s=F(n[0].links),o=[];for(let c=0;c<s.length;c+=1)o[c]=Ye(Ze(n,s,c));return{c(){e=$("tr"),l=$("th"),l.textContent=`${n[2].name}`,t=S();for(let c=0;c<o.length;c+=1)o[c].c();r=S()},m(c,i){y(c,e,i),_(e,l),_(e,t);for(let a=0;a<o.length;a+=1)o[a]&&o[a].m(e,null);_(e,r)},p(c,i){if(i&1){s=F(c[0].links);let a;for(a=0;a<s.length;a+=1){const f=Ze(c,s,a);o[a]?o[a].p(f,i):(o[a]=Ye(f),o[a].c(),o[a].m(e,r))}for(;a<o.length;a+=1)o[a].d(1);o.length=s.length}},d(c){c&&j(e),x(o,c)}}}function Ln(n){let e,l,t,r,s,o,c,i=F(n[0].links),a=[];for(let p=0;p<i.length;p+=1)a[p]=Xe(Ve(n,i,p));let f=F(U),u=[];for(let p=0;p<f.length;p+=1)u[p]=xe(We(n,f,p));return{c(){e=$("table"),l=$("thead"),t=$("tr"),r=$("th"),s=S();for(let p=0;p<a.length;p+=1)a[p].c();o=S(),c=$("tbody");for(let p=0;p<u.length;p+=1)u[p].c()},m(p,d){y(p,e,d),_(e,l),_(l,t),_(t,r),_(t,s);for(let g=0;g<a.length;g+=1)a[g]&&a[g].m(t,null);_(e,o),_(e,c);for(let g=0;g<u.length;g+=1)u[g]&&u[g].m(c,null)},p(p,d){if(d&1){i=F(p[0].links);let g;for(g=0;g<i.length;g+=1){const m=Ve(p,i,g);a[g]?a[g].p(m,d):(a[g]=Xe(m),a[g].c(),a[g].m(t,null))}for(;g<a.length;g+=1)a[g].d(1);a.length=i.length}if(d&1){f=F(U);let g;for(g=0;g<f.length;g+=1){const m=We(p,f,g);u[g]?u[g].p(m,d):(u[g]=xe(m),u[g].c(),u[g].m(c,null))}for(;g<u.length;g+=1)u[g].d(1);u.length=f.length}},d(p){p&&j(e),x(a,p),x(u,p)}}}function An(n){let e,l;return e=new yn({props:{$$slots:{default:[Ln]},$$scope:{ctx:n}}}),e.$on("close",n[1]),{c(){L(e.$$.fragment)},m(t,r){A(e,t,r),l=!0},p(t,[r]){const s={};r&2049&&(s.$$scope={dirty:r,ctx:t}),e.$set(s)},i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){b(e.$$.fragment,t),l=!1},d(t){E(e,t)}}}function En(n,e,l){let t;O(n,K,s=>l(0,t=s));function r(s){Ne.call(this,n,s)}return[t,r]}class Dn extends W{constructor(e){super(),Z(this,e,En,An,V,{})}}function et(n,e,l){const t=n.slice();return t[16]=e[l],t[18]=l,t}function tt(n,e,l){const t=n.slice();return t[19]=e[l],t[18]=l,t}function nt(n,e,l){const t=n.slice();return t[21]=e[l],t[18]=l,t}function lt(n){let e,l;return e=new Dn({}),e.$on("close",n[6]),{c(){L(e.$$.fragment)},m(t,r){A(e,t,r),l=!0},p:J,i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){b(e.$$.fragment,t),l=!1},d(t){E(e,t)}}}function Nn(n){let e=n[21].properties.name+"",l;return{c(){l=P(e)},m(t,r){y(t,l,r)},p(t,r){r&2&&e!==(e=t[21].properties.name+"")&&ne(l,e)},d(t){t&&j(l)}}}function rt(n){let e,l,t,r;function s(){return n[11](n[18])}return l=new Te({props:{color:n[21].properties.color,$$slots:{default:[Nn]},$$scope:{ctx:n}}}),l.$on("click",s),{c(){e=$("li"),L(l.$$.fragment),t=S()},m(o,c){y(o,e,c),A(l,e,null),_(e,t),r=!0},p(o,c){n=o;const i={};c&2&&(i.color=n[21].properties.color),c&8388610&&(i.$$scope={dirty:c,ctx:n}),l.$set(i)},i(o){r||(k(l.$$.fragment,o),r=!0)},o(o){b(l.$$.fragment,o),r=!1},d(o){o&&j(e),E(l)}}}function Tn(n){let e=n[19].name+"",l,t;return{c(){l=P(e),t=S()},m(r,s){y(r,l,s),y(r,t,s)},p:J,d(r){r&&(j(l),j(t))}}}function ot(n){let e,l,t,r,s,o,c,i;function a(){return n[12](n[18])}l=new Te({props:{$$slots:{default:[Tn]},$$scope:{ctx:n}}}),l.$on("click",a);function f(...u){return n[13](n[18],...u)}return{c(){e=$("li"),L(l.$$.fragment),t=P(`:
          `),r=$("progress"),c=S(),r.value=s=n[1].links.filter(f).length,R(r,"max",o=n[1].links.length),R(r,"class","svelte-zadug4")},m(u,p){y(u,e,p),A(l,e,null),_(e,t),_(e,r),_(e,c),i=!0},p(u,p){n=u;const d={};p&8388608&&(d.$$scope={dirty:p,ctx:n}),l.$set(d),(!i||p&2&&s!==(s=n[1].links.filter(f).length))&&(r.value=s),(!i||p&2&&o!==(o=n[1].links.length))&&R(r,"max",o)},i(u){i||(k(l.$$.fragment,u),i=!0)},o(u){b(l.$$.fragment,u),i=!1},d(u){u&&j(e),E(l)}}}function Bn(n){let e=n[16].properties.name+"",l;return{c(){l=P(e)},m(t,r){y(t,l,r)},p(t,r){r&2&&e!==(e=t[16].properties.name+"")&&ne(l,e)},d(t){t&&j(l)}}}function st(n){let e,l,t,r;function s(){return n[14](n[18])}return l=new Te({props:{color:n[16].properties.color,$$slots:{default:[Bn]},$$scope:{ctx:n}}}),l.$on("click",s),{c(){e=$("li"),L(l.$$.fragment),t=S()},m(o,c){y(o,e,c),A(l,e,null),_(e,t),r=!0},p(o,c){n=o;const i={};c&2&&(i.color=n[16].properties.color),c&8388610&&(i.$$scope={dirty:c,ctx:n}),l.$set(i)},i(o){r||(k(l.$$.fragment,o),r=!0)},o(o){b(l.$$.fragment,o),r=!1},d(o){o&&j(e),E(l)}}}function Jn(n){let e,l,t,r,s,o,c,i,a,f,u,p,d,g,m,C,T,v,D,B,le,Be,pe,de,Ce,Je,re=F(n[1].links),q=[];for(let w=0;w<re.length;w+=1)q[w]=rt(nt(n,re,w));const gt=w=>b(q[w],1,1,()=>{q[w]=null});let oe=F(U),I=[];for(let w=0;w<oe.length;w+=1)I[w]=ot(tt(n,oe,w));const $t=w=>b(I[w],1,1,()=>{I[w]=null});let se=F(n[1].jats),M=[];for(let w=0;w<se.length;w+=1)M[w]=st(et(n,se,w));const ht=w=>b(M[w],1,1,()=>{M[w]=null});return{c(){e=$("div"),l=$("div"),t=$("button"),t.textContent="Download",r=S(),s=$("button"),s.textContent="Clear",o=S(),c=$("hr"),i=S(),a=$("div"),f=$("button"),f.textContent="New link",u=S(),p=$("button"),p.textContent="Table of questions",d=P(`

    Links:
    `),g=$("ol");for(let w=0;w<q.length;w+=1)q[w].c();m=P(`

    Questions:
    `),C=$("ol");for(let w=0;w<I.length;w+=1)I[w].c();T=S(),v=$("hr"),D=P(`

    JATs:

    `),B=$("div"),le=$("button"),le.textContent="New JAT",Be=S(),pe=$("ol");for(let w=0;w<M.length;w+=1)M[w].c();R(t,"class","secondary"),R(s,"class","secondary"),R(e,"slot","sidebar")},m(w,N){y(w,e,N),_(e,l),_(l,t),_(l,r),_(l,s),_(e,o),_(e,c),_(e,i),_(e,a),_(a,f),_(a,u),_(a,p),_(e,d),_(e,g);for(let h=0;h<q.length;h+=1)q[h]&&q[h].m(g,null);_(e,m),_(e,C);for(let h=0;h<I.length;h+=1)I[h]&&I[h].m(C,null);_(e,T),_(e,v),_(e,D),_(e,B),_(B,le),_(e,Be),_(e,pe);for(let h=0;h<M.length;h+=1)M[h]&&M[h].m(pe,null);de=!0,Ce||(Je=[G(t,"click",n[9]),G(s,"click",n[3]),G(f,"click",n[4]),G(p,"click",n[10]),G(le,"click",n[5])],Ce=!0)},p(w,N){if(N&6){re=F(w[1].links);let h;for(h=0;h<re.length;h+=1){const te=nt(w,re,h);q[h]?(q[h].p(te,N),k(q[h],1)):(q[h]=rt(te),q[h].c(),k(q[h],1),q[h].m(g,null))}for(ie(),h=re.length;h<q.length;h+=1)gt(h);ae()}if(N&6){oe=F(U);let h;for(h=0;h<oe.length;h+=1){const te=tt(w,oe,h);I[h]?(I[h].p(te,N),k(I[h],1)):(I[h]=ot(te),I[h].c(),k(I[h],1),I[h].m(C,null))}for(ie(),h=oe.length;h<I.length;h+=1)$t(h);ae()}if(N&6){se=F(w[1].jats);let h;for(h=0;h<se.length;h+=1){const te=et(w,se,h);M[h]?(M[h].p(te,N),k(M[h],1)):(M[h]=st(te),M[h].c(),k(M[h],1),M[h].m(pe,null))}for(ie(),h=se.length;h<M.length;h+=1)ht(h);ae()}},i(w){if(!de){for(let N=0;N<re.length;N+=1)k(q[N]);for(let N=0;N<oe.length;N+=1)k(I[N]);for(let N=0;N<se.length;N+=1)k(M[N]);de=!0}},o(w){q=q.filter(Boolean);for(let N=0;N<q.length;N+=1)b(q[N]);I=I.filter(Boolean);for(let N=0;N<I.length;N+=1)b(I[N]);M=M.filter(Boolean);for(let N=0;N<M.length;N+=1)b(M[N]);de=!1},d(w){w&&j(e),x(q,w),x(I,w),x(M,w),Ce=!1,we(Je)}}}function qn(n){let e,l;return e=new Ee({props:{manageHoverState:!0,paint:{"line-color":["get","color"],"line-width":dt(6,9)},hoverCursor:"pointer"}}),e.$on("click",n[7]),{c(){L(e.$$.fragment)},m(t,r){A(e,t,r),l=!0},p:J,i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){b(e.$$.fragment,t),l=!1},d(t){E(e,t)}}}function In(n){let e,l;return e=new De({props:{manageHoverState:!0,paint:{"circle-color":["get","color"],"circle-radius":dt(20,25)},hoverCursor:"pointer"}}),e.$on("click",n[8]),{c(){L(e.$$.fragment)},m(t,r){A(e,t,r),l=!0},p:J,i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){b(e.$$.fragment,t),l=!1},d(t){E(e,t)}}}function Mn(n){let e,l,t,r,s;return l=new ue({props:{data:X(n[1].links),generateId:!0,$$slots:{default:[qn]},$$scope:{ctx:n}}}),r=new ue({props:{data:X(n[1].jats),generateId:!0,$$slots:{default:[In]},$$scope:{ctx:n}}}),{c(){e=$("div"),L(l.$$.fragment),t=S(),L(r.$$.fragment),R(e,"slot","map")},m(o,c){y(o,e,c),A(l,e,null),_(e,t),A(r,e,null),s=!0},p(o,c){const i={};c&2&&(i.data=X(o[1].links)),c&8388612&&(i.$$scope={dirty:c,ctx:o}),l.$set(i);const a={};c&2&&(a.data=X(o[1].jats)),c&8388612&&(a.$$scope={dirty:c,ctx:o}),r.$set(a)},i(o){s||(k(l.$$.fragment,o),k(r.$$.fragment,o),s=!0)},o(o){b(l.$$.fragment,o),b(r.$$.fragment,o),s=!1},d(o){o&&j(e),E(l),E(r)}}}function Fn(n){let e,l,t,r=n[0]&&lt(n);return l=new je({props:{$$slots:{map:[Mn],sidebar:[Jn]},$$scope:{ctx:n}}}),{c(){r&&r.c(),e=S(),L(l.$$.fragment)},m(s,o){r&&r.m(s,o),y(s,e,o),A(l,s,o),t=!0},p(s,[o]){s[0]?r?(r.p(s,o),o&1&&k(r,1)):(r=lt(s),r.c(),k(r,1),r.m(e.parentNode,e)):r&&(ie(),b(r,1,1,()=>{r=null}),ae());const c={};o&8388615&&(c.$$scope={dirty:o,ctx:s}),l.$set(c)},i(s){t||(k(r),k(l.$$.fragment,s),t=!0)},o(s){b(r),b(l.$$.fragment,s),t=!1},d(s){s&&j(e),r&&r.d(s),E(l,s)}}}function Gn(n,e,l){let t,r,s;O(n,K,D=>l(1,t=D)),O(n,z,D=>l(2,r=D)),O(n,Ae,D=>l(15,s=D));let o=!1;function c(){H(K,t.links=[],t),H(K,t.jats=[],t)}function i(){let D=It(t.links.length);H(K,t.links=[...t.links,D],t),H(z,r={kind:"edit-link",idx:t.links.length-1},r)}function a(){if(!s)return;let D=Mt(t.jats.length,s.getCenter().toArray());H(K,t.jats=[...t.jats,D],t),H(z,r={kind:"edit-jat",idx:t.jats.length-1},r)}return[o,t,r,c,i,a,()=>l(0,o=!1),D=>H(z,r={kind:"edit-link",idx:D.detail.features[0].id},r),D=>H(z,r={kind:"edit-jat",idx:D.detail.features[0].id},r),()=>jn("rcv2.geojson",JSON.stringify(t)),()=>l(0,o=!0),D=>H(z,r={kind:"edit-link",idx:D},r),D=>H(z,r={kind:"edit-question",idx:D},r),(D,B)=>B.properties.answers[D]!="",D=>H(z,r={kind:"edit-jat",idx:D},r)]}class zn extends W{constructor(e){super(),Z(this,e,Gn,Fn,V,{})}}function On(n){let e,l;return{c(){e=$("div"),l=$("div"),R(e,"slot","left")},m(t,r){y(t,e,r),_(e,l),n[9](l)},p:J,d(t){t&&j(e),n[9](null)}}}function Kn(n){return{c:J,m:J,p:J,i:J,o:J,d:J}}function Pn(n){let e,l,t;function r(o){n[8](o)}let s={style:n[10],standardControls:!0,hash:!0,$$slots:{default:[Wn]},$$scope:{ctx:n}};return n[2]!==void 0&&(s.map=n[2]),e=new Lt({props:s}),ee.push(()=>ve(e,"map",r)),{c(){L(e.$$.fragment)},m(o,c){A(e,o,c),t=!0},p(o,c){const i={};c&2058&&(i.$$scope={dirty:c,ctx:o}),!l&&c&4&&(l=!0,i.map=o[2],ye(()=>l=!1)),e.$set(i)},i(o){t||(k(e.$$.fragment,o),t=!0)},o(o){b(e.$$.fragment,o),t=!1},d(o){E(e,o)}}}function Rn(n){let e,l;return e=new $n({props:{qIdx:n[3].idx}}),{c(){L(e.$$.fragment)},m(t,r){A(e,t,r),l=!0},p(t,r){const s={};r&8&&(s.qIdx=t[3].idx),e.$set(s)},i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){b(e.$$.fragment,t),l=!1},d(t){E(e,t)}}}function Hn(n){let e,l;return e=new Zt({props:{idx:n[3].idx}}),{c(){L(e.$$.fragment)},m(t,r){A(e,t,r),l=!0},p(t,r){const s={};r&8&&(s.idx=t[3].idx),e.$set(s)},i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){b(e.$$.fragment,t),l=!1},d(t){E(e,t)}}}function Un(n){let e,l;return e=new pn({props:{idx:n[3].idx}}),{c(){L(e.$$.fragment)},m(t,r){A(e,t,r),l=!0},p(t,r){const s={};r&8&&(s.idx=t[3].idx),e.$set(s)},i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){b(e.$$.fragment,t),l=!1},d(t){E(e,t)}}}function Qn(n){let e,l;return e=new zn({}),{c(){L(e.$$.fragment)},m(t,r){A(e,t,r),l=!0},p:J,i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){b(e.$$.fragment,t),l=!1},d(t){E(e,t)}}}function Wn(n){let e,l,t,r,s,o;const c=[Qn,Un,Hn,Rn],i=[];function a(f,u){return f[3].kind=="neutral"?0:f[3].kind=="edit-link"?1:f[3].kind=="edit-jat"?2:f[3].kind=="edit-question"?3:-1}return~(t=a(n))&&(r=i[t]=c[t](n)),{c(){e=$("div"),l=S(),r&&r.c(),s=ut()},m(f,u){y(f,e,u),n[7](e),y(f,l,u),~t&&i[t].m(f,u),y(f,s,u),o=!0},p(f,u){let p=t;t=a(f),t===p?~t&&i[t].p(f,u):(r&&(ie(),b(i[p],1,1,()=>{i[p]=null}),ae()),~t?(r=i[t],r?r.p(f,u):(r=i[t]=c[t](f),r.c()),k(r,1),r.m(s.parentNode,s)):r=null)},i(f){o||(k(r),o=!0)},o(f){b(r),o=!1},d(f){f&&(j(e),j(l),j(s)),n[7](null),~t&&i[t].d(f)}}}function Zn(n){return{c:J,m:J,p:J,i:J,o:J,d:J}}function Vn(n){let e,l,t={ctx:n,current:null,token:null,hasCatch:!1,pending:Zn,then:Pn,catch:Kn,value:10,blocks:[,,,]};return At(hn(new URLSearchParams(window.location.search).get("google")||""),t),{c(){e=$("div"),t.block.c(),R(e,"slot","main"),Q(e,"position","relative"),Q(e,"width","100%"),Q(e,"height","100vh")},m(r,s){y(r,e,s),t.block.m(e,t.anchor=null),t.mount=()=>e,t.anchor=null,l=!0},p(r,s){n=r,Et(t,n,s)},i(r){l||(k(t.block),l=!0)},o(r){for(let s=0;s<3;s+=1){const o=t.blocks[s];b(o)}l=!1},d(r){r&&j(e),t.block.d(),t.token=null,t=null}}}function Xn(n){let e,l;return e=new St({props:{$$slots:{main:[Vn],left:[On]},$$scope:{ctx:n}}}),{c(){L(e.$$.fragment)},m(t,r){A(e,t,r),l=!0},p(t,[r]){const s={};r&2063&&(s.$$scope={dirty:r,ctx:t}),e.$set(s)},i(t){l||(k(e.$$.fragment,t),l=!0)},o(t){b(e.$$.fragment,t),l=!1},d(t){E(e,t)}}}function Yn(n,e,l){let t,r,s,o,c;O(n,Le,d=>l(4,t=d)),O(n,Se,d=>l(5,r=d)),O(n,K,d=>l(6,s=d)),O(n,Ae,d=>l(2,o=d)),O(n,z,d=>l(3,c=d));let i,a;function f(d){ee[d?"unshift":"push"](()=>{a=d,l(1,a),l(4,t)})}function u(d){o=d,Ae.set(o)}function p(d){ee[d?"unshift":"push"](()=>{i=d,l(0,i),l(5,r)})}return n.$$.update=()=>{n.$$.dirty&64&&window.localStorage.setItem("tmp-rcv2",JSON.stringify(s)),n.$$.dirty&33&&i&&r&&(l(0,i.innerHTML="",i),i.appendChild(r)),n.$$.dirty&18&&a&&t&&(l(1,a.innerHTML="",a),a.appendChild(t))},[i,a,o,c,t,r,s,f,u,p]}class xn extends W{constructor(e){super(),Z(this,e,Yn,Xn,V,{})}}new xn({target:document.getElementById("app")});
