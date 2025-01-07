import{a0 as Ze,a1 as Xe,a2 as le,w as V,e as w,x,t as b,a3 as Ye,S as U,i as W,s as Q,A as Ve,a4 as xe,B as M,E as et,h as oe,G as g,J as L,v as C,u as re,j as se,k as ie,y as S,b as Z,a5 as ce,H as I,c as j,r as Pe,m as A,Y as z,f as B,I as R,M as tt,a as _e,d as de,K as T,N as q,a6 as nt,R as F,X as h,W as te,Z as me,O as he,F as K,a7 as He,a8 as Re,a9 as ae,Q as ge,T as Y,$ as H,P as Ue,l as $e,aa as lt,U as ot,_ as rt}from"./Layout-580fcfef.js";function st(n,e){const l=e.token={};function t(o,r,s,u){if(e.token!==l)return;e.resolved=u;let i=e.ctx;s!==void 0&&(i=i.slice(),i[s]=u);const a=o&&(e.current=o)(i);let c=!1;e.block&&(e.blocks?e.blocks.forEach((f,p)=>{p!==r&&f&&(V(),w(f,1,1,()=>{e.blocks[p]===f&&(e.blocks[p]=null)}),x())}):e.block.d(1),a.c(),b(a,1),a.m(e.mount(),e.anchor),c=!0),e.block=a,e.blocks&&(e.blocks[r]=a),c&&Ye()}if(Ze(n)){const o=Xe();if(n.then(r=>{le(o),t(e.then,1,e.value,r),le(null)},r=>{if(le(o),t(e.catch,2,e.error,r),le(null),!e.hasCatch)throw r}),e.current!==e.pending)return t(e.pending,0),!0}else{if(e.current!==e.then)return t(e.then,1,e.value,n),!0;e.resolved=n}}function it(n,e,l){const t=e.slice(),{resolved:o}=n;n.current===n.then&&(t[n.value]=o),n.current===n.catch&&(t[n.error]=o),n.block.p(t,l)}function at(n,e,l){let t;const o=Ve();let{layer:r=void 0}=e;const{map:s}=xe();M(n,s,c=>l(2,t=c));function u(c){o(c.type,{...c,map:s})}const i=["click","dblclick","mousedown","mouseup","mousemove","mouseenter","mouseleave","contextmenu","mouseover","mouseout"],a=["click","dblclick","contextmenu","mousemove","movestart","moveend","zoomstart","zoom","zoomend"];return et(()=>{if(t)if(r)for(const c of i)t.off(c,r,u);else for(const c of a)t.off(c,u)}),n.$$set=c=>{"layer"in c&&l(1,r=c.layer)},n.$$.update=()=>{if(n.$$.dirty&6&&t)if(r)for(const c of i)t.on(c,r,u);else for(const c of a)t.on(c,u)},[s,r,t]}class ct extends U{constructor(e){super(),W(this,e,at,null,Q,{layer:1})}}const ut=n=>({}),be=n=>({}),ft=n=>({}),ve=n=>({});function pt(n){let e,l,t,o;const r=n[3].sidebar,s=oe(r,n,n[2],ve),u=n[3].map,i=oe(u,n,n[2],be);return{c(){e=g("div"),s&&s.c(),l=L(),t=g("div"),i&&i.c()},m(a,c){C(a,e,c),s&&s.m(e,null),n[4](e),C(a,l,c),C(a,t,c),i&&i.m(t,null),n[5](t),o=!0},p(a,[c]){s&&s.p&&(!o||c&4)&&re(s,r,a,a[2],o?ie(r,a[2],c,ft):se(a[2]),ve),i&&i.p&&(!o||c&4)&&re(i,u,a,a[2],o?ie(u,a[2],c,ut):se(a[2]),be)},i(a){o||(b(s,a),b(i,a),o=!0)},o(a){w(s,a),w(i,a),o=!1},d(a){a&&(S(e),S(l),S(t)),s&&s.d(a),n[4](null),i&&i.d(a),n[5](null)}}}function _t(n,e,l){let t,o;M(n,fe,a=>l(0,t=a)),M(n,pe,a=>l(1,o=a));let{$$slots:r={},$$scope:s}=e;function u(a){Z[a?"unshift":"push"](()=>{t=a,fe.set(t)})}function i(a){Z[a?"unshift":"push"](()=>{o=a,pe.set(o)})}return n.$$set=a=>{"$$scope"in a&&l(2,s=a.$$scope)},[t,o,s,r,u,i]}class ke extends U{constructor(e){super(),W(this,e,_t,pt,Q,{})}}let fe=ce(null),pe=ce(null);function we(n,e,l){const t=n.slice();return t[5]=e[l],t[6]=e,t[7]=l,t}function dt(n){let e,l;return{c(){e=g("span"),l=L(),T(e,"class","dot svelte-1lzmzqo")},m(t,o){C(t,e,o),C(t,l,o)},p:q,d(t){t&&(S(e),S(l))}}}function ye(n){let e,l,t;function o(s){n[4](s,n[5],n[6],n[7])}let r={draggable:!0,$$slots:{default:[dt]},$$scope:{ctx:n}};return n[5]!==void 0&&(r.lngLat=n[5]),e=new tt({props:r}),Z.push(()=>_e(e,"lngLat",o)),{c(){j(e.$$.fragment)},m(s,u){A(e,s,u),t=!0},p(s,u){n=s;const i={};u&256&&(i.$$scope={dirty:u,ctx:n}),!l&&u&1&&(l=!0,i.lngLat=n[5],de(()=>l=!1)),e.$set(i)},i(s){t||(b(e.$$.fragment,s),t=!0)},o(s){w(e.$$.fragment,s),t=!1},d(s){B(e,s)}}}function mt(n){let e,l,t,o,r,s;e=new ct({}),e.$on("click",n[1]);let u=I(n[0].geometry.coordinates),i=[];for(let c=0;c<u.length;c+=1)i[c]=ye(we(n,u,c));const a=c=>w(i[c],1,1,()=>{i[c]=null});return{c(){j(e.$$.fragment),l=L();for(let c=0;c<i.length;c+=1)i[c].c();t=Pe()},m(c,f){A(e,c,f),C(c,l,f);for(let p=0;p<i.length;p+=1)i[p]&&i[p].m(c,f);C(c,t,f),o=!0,r||(s=z(window,"keydown",n[2]),r=!0)},p(c,[f]){if(f&1){u=I(c[0].geometry.coordinates);let p;for(p=0;p<u.length;p+=1){const d=we(c,u,p);i[p]?(i[p].p(d,f),b(i[p],1)):(i[p]=ye(d),i[p].c(),b(i[p],1),i[p].m(t.parentNode,t))}for(V(),p=u.length;p<i.length;p+=1)a(p);x()}},i(c){if(!o){b(e.$$.fragment,c);for(let f=0;f<u.length;f+=1)b(i[f]);o=!0}},o(c){w(e.$$.fragment,c),i=i.filter(Boolean);for(let f=0;f<i.length;f+=1)w(i[f]);o=!1},d(c){c&&(S(l),S(t)),B(e,c),R(i,c),r=!1,s()}}}function ht(n,e,l){let{f:t}=e,{onDone:o}=e;function r(i){t.geometry.coordinates.push(i.detail.lngLat.toArray()),l(0,t)}function s(i){i.key=="Escape"&&o()}function u(i,a,c,f){c[f]=i,l(0,t)}return n.$$set=i=>{"f"in i&&l(0,t=i.f),"onDone"in i&&l(3,o=i.onDone)},[t,r,s,o,u]}class gt extends U{constructor(e){super(),W(this,e,ht,mt,Q,{f:0,onDone:3})}}let P=ce(kt()),ue=nt(P,n=>({type:"FeatureCollection",features:n})),G=ce({kind:"neutral"});function O(){return["","2","1","0","Critical"]}let J=[{name:"Street or path check",description:"Is this on-carriageway or a traffic-free path?",choices:["","Street check","Path check"]},{name:"SA03",description:"lane widths",choices:O()},{name:"SA04",description:"trip hazards",choices:O()},{name:"SA05",description:"kerbside activity",choices:O()},{name:"SA08",description:"motor traffic speed",choices:O()},{name:"SA09",description:"motor traffic volume",choices:O()},{name:"SA11",description:"footway widths",choices:O()},{name:"SA12",description:"effective width next to tram lines",choices:O()},{name:"SA13",description:"crossing angle of tram/train rails",choices:O()},{name:"SA14",description:"cycling surface and maintenance defects",choices:O()},{name:"SA15",description:"WW surface and maintenance defects",choices:O()},{name:"SA16",description:"guard railing",choices:O()}];function $t(n){let e=["#66C5CC","#F6CF71","#F89C74","#DCB0F2","#87C55F","#9EB9F3","#FE88B1","#C9DB74","#8BE0A4","#B497E7","#D3B484","#B3B3B3"];return{type:"Feature",geometry:{type:"LineString",coordinates:[]},properties:{name:"Untitled link",color:e[n%e.length],answers:Array(J.length).fill("")}}}function kt(){try{let n=JSON.parse(window.localStorage.getItem("tmp-rcv2")||"");if("features"in n&&"answers"in n.features[0].properties)return n.features}catch{}return[]}function Ce(n,e,l){const t=n.slice();return t[9]=e[l],t[10]=e,t[11]=l,t}function bt(n,e,l){const t=n.slice();return t[12]=e[l],t}function vt(n){let e;return{c(){e=g("option"),e.textContent=`${n[12]}`,e.__value=n[12],te(e,e.__value)},m(l,t){C(l,e,t)},p:q,d(l){l&&S(e)}}}function Se(n){let e,l=n[9].name+"",t,o,r=n[9].description+"",s,u,i,a,c,f,p=I(n[9].choices),d=[];for(let m=0;m<p.length;m+=1)d[m]=vt(bt(n,p,m));function _(){n[8].call(i,n[11])}return{c(){e=g("label"),t=F(l),o=F(": "),s=F(r),u=L(),i=g("select");for(let m=0;m<d.length;m+=1)d[m].c();a=L(),n[2][n[0]].properties.answers[n[11]]===void 0&&Re(_)},m(m,$){C(m,e,$),h(e,t),h(e,o),h(e,s),h(e,u),h(e,i);for(let N=0;N<d.length;N+=1)d[N]&&d[N].m(i,null);ae(i,n[2][n[0]].properties.answers[n[11]],!0),h(e,a),c||(f=z(i,"change",_),c=!0)},p(m,$){n=m,$&5&&ae(i,n[2][n[0]].properties.answers[n[11]])},d(m){m&&S(e),R(d,m),c=!1,f()}}}function wt(n){let e,l,t,o,r,s,u,i,a,c=I(J),f=[];for(let p=0;p<c.length;p+=1)f[p]=Se(Ce(n,c,p));return{c(){e=g("div"),l=g("button"),l.textContent="Done",t=L(),o=g("label"),r=F(`Name:
      `),s=g("input"),u=L();for(let p=0;p<f.length;p+=1)f[p].c();T(s,"type","text"),T(e,"slot","sidebar")},m(p,d){C(p,e,d),h(e,l),h(e,t),h(e,o),h(o,r),h(o,s),te(s,n[2][n[0]].properties.name),h(e,u);for(let _=0;_<f.length;_+=1)f[_]&&f[_].m(e,null);i||(a=[z(l,"click",n[6]),z(s,"input",n[7])],i=!0)},p(p,d){if(d&5&&s.value!==p[2][p[0]].properties.name&&te(s,p[2][p[0]].properties.name),d&5){c=I(J);let _;for(_=0;_<c.length;_+=1){const m=Ce(p,c,_);f[_]?f[_].p(m,d):(f[_]=Se(m),f[_].c(),f[_].m(e,null))}for(;_<f.length;_+=1)f[_].d(1);f.length=c.length}},d(p){p&&S(e),R(f,p),i=!1,me(a)}}}function yt(n){let e,l;return e=new ge({props:{paint:{"line-color":["case",["==",["id"],n[0]],["get","color"],"black"],"line-opacity":["case",["==",["id"],n[0]],1,.5],"line-width":6}}}),{c(){j(e.$$.fragment)},m(t,o){A(e,t,o),l=!0},p(t,o){const r={};o&1&&(r.paint={"line-color":["case",["==",["id"],t[0]],["get","color"],"black"],"line-opacity":["case",["==",["id"],t[0]],1,.5],"line-width":6}),e.$set(r)},i(t){l||(b(e.$$.fragment,t),l=!0)},o(t){w(e.$$.fragment,t),l=!1},d(t){B(e,t)}}}function Ct(n){let e,l,t,o,r,s;l=new he({props:{data:n[1],generateId:!0,$$slots:{default:[yt]},$$scope:{ctx:n}}});function u(a){n[5](a)}let i={onDone:n[4]};return n[2][n[0]]!==void 0&&(i.f=n[2][n[0]]),o=new gt({props:i}),Z.push(()=>_e(o,"f",u)),{c(){e=g("div"),j(l.$$.fragment),t=L(),j(o.$$.fragment),T(e,"slot","map")},m(a,c){C(a,e,c),A(l,e,null),h(e,t),A(o,e,null),s=!0},p(a,c){const f={};c&2&&(f.data=a[1]),c&32769&&(f.$$scope={dirty:c,ctx:a}),l.$set(f);const p={};c&8&&(p.onDone=a[4]),!r&&c&5&&(r=!0,p.f=a[2][a[0]],de(()=>r=!1)),o.$set(p)},i(a){s||(b(l.$$.fragment,a),b(o.$$.fragment,a),s=!0)},o(a){w(l.$$.fragment,a),w(o.$$.fragment,a),s=!1},d(a){a&&S(e),B(l),B(o)}}}function St(n){let e,l;return e=new ke({props:{$$slots:{map:[Ct],sidebar:[wt]},$$scope:{ctx:n}}}),{c(){j(e.$$.fragment)},m(t,o){A(e,t,o),l=!0},p(t,[o]){const r={};o&32783&&(r.$$scope={dirty:o,ctx:t}),e.$set(r)},i(t){l||(b(e.$$.fragment,t),l=!0)},o(t){w(e.$$.fragment,t),l=!1},d(t){B(e,t)}}}function Lt(n,e,l){let t,o,r;M(n,ue,p=>l(1,t=p)),M(n,P,p=>l(2,o=p)),M(n,G,p=>l(3,r=p));let{idx:s}=e;const u=()=>K(G,r={kind:"neutral"},r);function i(p){n.$$.not_equal(o[s],p)&&(o[s]=p,P.set(o))}const a=()=>K(G,r={kind:"neutral"},r);function c(){o[s].properties.name=this.value,P.set(o)}function f(p){o[s].properties.answers[p]=He(this),P.set(o)}return n.$$set=p=>{"idx"in p&&l(0,s=p.idx)},[s,t,o,r,u,i,a,c,f]}class Dt extends U{constructor(e){super(),W(this,e,Lt,St,Q,{idx:0})}}function Le(n,e,l){const t=n.slice();return t[8]=e[l],t[9]=e,t[10]=l,t}function De(n,e,l){const t=n.slice();return t[11]=e[l],t}function Ee(n){let e,l=n[11]+"",t,o;return{c(){e=g("option"),t=F(l),e.__value=o=n[11],te(e,e.__value)},m(r,s){C(r,e,s),h(e,t)},p(r,s){s&1&&l!==(l=r[11]+"")&&Y(t,l),s&1&&o!==(o=r[11])&&(e.__value=o,te(e,e.__value))},d(r){r&&S(e)}}}function Ne(n){let e,l,t=n[8].properties.name+"",o,r,s,u,i,a,c=I(J[n[0]].choices),f=[];for(let d=0;d<c.length;d+=1)f[d]=Ee(De(n,c,d));function p(){n[7].call(s,n[9],n[10])}return{c(){e=g("li"),l=g("span"),o=F(t),r=L(),s=g("select");for(let d=0;d<f.length;d+=1)f[d].c();u=L(),H(l,"color",n[8].properties.color),n[8].properties.answers[n[0]]===void 0&&Re(p)},m(d,_){C(d,e,_),h(e,l),h(l,o),h(e,r),h(e,s);for(let m=0;m<f.length;m+=1)f[m]&&f[m].m(s,null);ae(s,n[8].properties.answers[n[0]],!0),h(e,u),i||(a=z(s,"change",p),i=!0)},p(d,_){if(n=d,_&8&&t!==(t=n[8].properties.name+"")&&Y(o,t),_&8&&H(l,"color",n[8].properties.color),_&1){c=I(J[n[0]].choices);let m;for(m=0;m<c.length;m+=1){const $=De(n,c,m);f[m]?f[m].p($,_):(f[m]=Ee($),f[m].c(),f[m].m(s,null))}for(;m<f.length;m+=1)f[m].d(1);f.length=c.length}_&9&&ae(s,n[8].properties.answers[n[0]])},d(d){d&&S(e),R(f,d),i=!1,a()}}}function Et(n){let e,l,t,o,r=J[n[0]].name+"",s,u,i=J[n[0]].description+"",a,c,f,p,d,_=I(n[3]),m=[];for(let $=0;$<_.length;$+=1)m[$]=Ne(Le(n,_,$));return{c(){e=g("div"),l=g("button"),l.textContent="Done",t=L(),o=g("h2"),s=F(r),u=F(": "),a=F(i),c=L(),f=g("ol");for(let $=0;$<m.length;$+=1)m[$].c();T(e,"slot","sidebar")},m($,N){C($,e,N),h(e,l),h(e,t),h(e,o),h(o,s),h(o,u),h(o,a),h(e,c),h(e,f);for(let v=0;v<m.length;v+=1)m[v]&&m[v].m(f,null);p||(d=z(l,"click",n[6]),p=!0)},p($,N){if(N&1&&r!==(r=J[$[0]].name+"")&&Y(s,r),N&1&&i!==(i=J[$[0]].description+"")&&Y(a,i),N&9){_=I($[3]);let v;for(v=0;v<_.length;v+=1){const ne=Le($,_,v);m[v]?m[v].p(ne,N):(m[v]=Ne(ne),m[v].c(),m[v].m(f,null))}for(;v<m.length;v+=1)m[v].d(1);m.length=_.length}},d($){$&&S(e),R(m,$),p=!1,d()}}}function Nt(n){let e,l;return e=new ge({props:{manageHoverState:!0,paint:{"line-color":["get","color"],"line-width":Ue(6,9)},hoverCursor:"pointer"}}),e.$on("click",n[5]),{c(){j(e.$$.fragment)},m(t,o){A(e,t,o),l=!0},p:q,i(t){l||(b(e.$$.fragment,t),l=!0)},o(t){w(e.$$.fragment,t),l=!1},d(t){B(e,t)}}}function jt(n){let e,l,t;return l=new he({props:{data:n[2],generateId:!0,$$slots:{default:[Nt]},$$scope:{ctx:n}}}),{c(){e=g("div"),j(l.$$.fragment),T(e,"slot","map")},m(o,r){C(o,e,r),A(l,e,null),t=!0},p(o,r){const s={};r&4&&(s.data=o[2]),r&16386&&(s.$$scope={dirty:r,ctx:o}),l.$set(s)},i(o){t||(b(l.$$.fragment,o),t=!0)},o(o){w(l.$$.fragment,o),t=!1},d(o){o&&S(e),B(l)}}}function At(n){let e,l,t,o;return e=new ke({props:{$$slots:{map:[jt],sidebar:[Et]},$$scope:{ctx:n}}}),{c(){j(e.$$.fragment)},m(r,s){A(e,r,s),l=!0,t||(o=z(window,"keydown",n[4]),t=!0)},p(r,[s]){const u={};s&16399&&(u.$$scope={dirty:s,ctx:r}),e.$set(u)},i(r){l||(b(e.$$.fragment,r),l=!0)},o(r){w(e.$$.fragment,r),l=!1},d(r){B(e,r),t=!1,o()}}}function Bt(n,e,l){let t,o,r;M(n,G,f=>l(1,t=f)),M(n,ue,f=>l(2,o=f)),M(n,P,f=>l(3,r=f));let{qIdx:s}=e;function u(f){f.key=="Escape"&&K(G,t={kind:"neutral"},t)}const i=f=>K(G,t={kind:"edit-link",idx:f.detail.features[0].id},t),a=()=>K(G,t={kind:"neutral"},t);function c(f,p){f[p].properties.answers[s]=He(this),P.set(r),l(0,s)}return n.$$set=f=>{"qIdx"in f&&l(0,s=f.qIdx)},[s,t,o,r,u,i,a,c]}class qt extends U{constructor(e){super(),W(this,e,Bt,At,Q,{qIdx:0})}}let je="MZEJTanw3WpxRvt7qDfo";async function It(n){return n?{version:8,sources:{"raster-tiles":{type:"raster",tiles:[`https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=${await Mt(n)}&key=${n}`],tileSize:256,attribution:"Google (detailed attributions not wired up)"}},layers:[{id:"raster-basemap",type:"raster",source:"raster-tiles"}],glyphs:`https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${je}`}:`https://api.maptiler.com/maps/dataviz/style.json?key=${je}`}async function Mt(n){try{let l=await(await fetch(`https://tile.googleapis.com/v1/createSession?key=${n}`,{method:"POST",body:JSON.stringify({mapType:"satellite",language:"en-GB",region:"GB"})})).json();return"session"in l?l.session:(console.error(`Couldn't get Google tile session key: ${JSON.stringify(l)}`),"")}catch(e){return console.error(`Couldn't get Google tile session key: ${e}`),""}}const Ft=n=>({dialog:n&1}),Ae=n=>({dialog:n[0]});function zt(n){let e,l,t,o,r;const s=n[4].default,u=oe(s,n,n[3],Ae);return{c(){e=g("dialog"),l=g("article"),u&&u.c(),e.open=!0},m(i,a){C(i,e,a),h(e,l),u&&u.m(l,null),n[6](e),t=!0,o||(r=[z(window,"click",n[1]),z(window,"keydown",n[2]),z(e,"close",n[5])],o=!0)},p(i,[a]){u&&u.p&&(!t||a&9)&&re(u,s,i,i[3],t?ie(s,i[3],a,Ft):se(i[3]),Ae)},i(i){t||(b(u,i),t=!0)},o(i){w(u,i),t=!1},d(i){i&&S(e),u&&u.d(i),n[6](null),o=!1,me(r)}}}function Tt(n,e,l){let{$$slots:t={},$$scope:o}=e,r;function s(c){r.open&&c.target==r&&r.close()}function u(c){(c.key=="Escape"||c.key=="Enter")&&(c.stopPropagation(),r.close())}function i(c){$e.call(this,n,c)}function a(c){Z[c?"unshift":"push"](()=>{r=c,l(0,r)})}return n.$$set=c=>{"$$scope"in c&&l(3,o=c.$$scope)},[r,s,u,o,t,i,a]}class Gt extends U{constructor(e){super(),W(this,e,Tt,zt,Q,{})}}function Jt(n,e){let l=document.createElement("a");l.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(e)),l.setAttribute("download",n),document.body.appendChild(l),l.click(),document.body.removeChild(l)}function Ot(n){let e,l,t,o;const r=n[2].default,s=oe(r,n,n[1],null);return{c(){e=g("a"),s&&s.c(),T(e,"href","#"),H(e,"color",n[0])},m(u,i){C(u,e,i),s&&s.m(e,null),l=!0,t||(o=z(e,"click",lt(n[3])),t=!0)},p(u,[i]){s&&s.p&&(!l||i&2)&&re(s,r,u,u[1],l?ie(r,u[1],i,null):se(u[1]),null),i&1&&H(e,"color",u[0])},i(u){l||(b(s,u),l=!0)},o(u){w(s,u),l=!1},d(u){u&&S(e),s&&s.d(u),t=!1,o()}}}function Kt(n,e,l){let{$$slots:t={},$$scope:o}=e,{color:r}=e;function s(u){$e.call(this,n,u)}return n.$$set=u=>{"color"in u&&l(0,r=u.color),"$$scope"in u&&l(1,o=u.$$scope)},[r,o,t,s]}class We extends U{constructor(e){super(),W(this,e,Kt,Ot,Q,{color:0})}}function Be(n,e,l){const t=n.slice();return t[2]=e[l],t[4]=l,t}function qe(n,e,l){const t=n.slice();t[5]=e[l];const o=t[5].properties.answers[t[4]];return t[6]=o,t}function Ie(n,e,l){const t=n.slice();return t[5]=e[l],t}function Me(n){let e,l=n[5].properties.name+"",t;return{c(){e=g("th"),t=F(l),H(e,"color",n[5].properties.color)},m(o,r){C(o,e,r),h(e,t)},p(o,r){r&1&&l!==(l=o[5].properties.name+"")&&Y(t,l),r&1&&H(e,"color",o[5].properties.color)},d(o){o&&S(e)}}}function Fe(n){let e,l=n[6]+"",t;return{c(){e=g("td"),t=F(l),H(e,"background",n[6]==""?"red":"green")},m(o,r){C(o,e,r),h(e,t)},p(o,r){r&1&&l!==(l=o[6]+"")&&Y(t,l),r&1&&H(e,"background",o[6]==""?"red":"green")},d(o){o&&S(e)}}}function ze(n){let e,l,t,o,r=I(n[0]),s=[];for(let u=0;u<r.length;u+=1)s[u]=Fe(qe(n,r,u));return{c(){e=g("tr"),l=g("th"),l.textContent=`${n[2].name}`,t=L();for(let u=0;u<s.length;u+=1)s[u].c();o=L()},m(u,i){C(u,e,i),h(e,l),h(e,t);for(let a=0;a<s.length;a+=1)s[a]&&s[a].m(e,null);h(e,o)},p(u,i){if(i&1){r=I(u[0]);let a;for(a=0;a<r.length;a+=1){const c=qe(u,r,a);s[a]?s[a].p(c,i):(s[a]=Fe(c),s[a].c(),s[a].m(e,o))}for(;a<s.length;a+=1)s[a].d(1);s.length=r.length}},d(u){u&&S(e),R(s,u)}}}function Pt(n){let e,l,t,o,r,s,u,i=I(n[0]),a=[];for(let p=0;p<i.length;p+=1)a[p]=Me(Ie(n,i,p));let c=I(J),f=[];for(let p=0;p<c.length;p+=1)f[p]=ze(Be(n,c,p));return{c(){e=g("table"),l=g("thead"),t=g("tr"),o=g("th"),r=L();for(let p=0;p<a.length;p+=1)a[p].c();s=L(),u=g("tbody");for(let p=0;p<f.length;p+=1)f[p].c()},m(p,d){C(p,e,d),h(e,l),h(l,t),h(t,o),h(t,r);for(let _=0;_<a.length;_+=1)a[_]&&a[_].m(t,null);h(e,s),h(e,u);for(let _=0;_<f.length;_+=1)f[_]&&f[_].m(u,null)},p(p,d){if(d&1){i=I(p[0]);let _;for(_=0;_<i.length;_+=1){const m=Ie(p,i,_);a[_]?a[_].p(m,d):(a[_]=Me(m),a[_].c(),a[_].m(t,null))}for(;_<a.length;_+=1)a[_].d(1);a.length=i.length}if(d&1){c=I(J);let _;for(_=0;_<c.length;_+=1){const m=Be(p,c,_);f[_]?f[_].p(m,d):(f[_]=ze(m),f[_].c(),f[_].m(u,null))}for(;_<f.length;_+=1)f[_].d(1);f.length=c.length}},d(p){p&&S(e),R(a,p),R(f,p)}}}function Ht(n){let e,l;return e=new Gt({props:{$$slots:{default:[Pt]},$$scope:{ctx:n}}}),e.$on("close",n[1]),{c(){j(e.$$.fragment)},m(t,o){A(e,t,o),l=!0},p(t,[o]){const r={};o&2049&&(r.$$scope={dirty:o,ctx:t}),e.$set(r)},i(t){l||(b(e.$$.fragment,t),l=!0)},o(t){w(e.$$.fragment,t),l=!1},d(t){B(e,t)}}}function Rt(n,e,l){let t;M(n,P,r=>l(0,t=r));function o(r){$e.call(this,n,r)}return[t,o]}class Ut extends U{constructor(e){super(),W(this,e,Rt,Ht,Q,{})}}function Te(n,e,l){const t=n.slice();return t[13]=e[l],t[15]=l,t}function Ge(n,e,l){const t=n.slice();return t[16]=e[l],t[15]=l,t}function Je(n){let e,l;return e=new Ut({}),e.$on("close",n[6]),{c(){j(e.$$.fragment)},m(t,o){A(e,t,o),l=!0},p:q,i(t){l||(b(e.$$.fragment,t),l=!0)},o(t){w(e.$$.fragment,t),l=!1},d(t){B(e,t)}}}function Wt(n){let e=n[16].properties.name+"",l;return{c(){l=F(e)},m(t,o){C(t,l,o)},p(t,o){o&2&&e!==(e=t[16].properties.name+"")&&Y(l,e)},d(t){t&&S(l)}}}function Oe(n){let e,l,t,o;function r(){return n[10](n[15])}return l=new We({props:{color:n[16].properties.color,$$slots:{default:[Wt]},$$scope:{ctx:n}}}),l.$on("click",r),{c(){e=g("li"),j(l.$$.fragment),t=L()},m(s,u){C(s,e,u),A(l,e,null),h(e,t),o=!0},p(s,u){n=s;const i={};u&2&&(i.color=n[16].properties.color),u&262146&&(i.$$scope={dirty:u,ctx:n}),l.$set(i)},i(s){o||(b(l.$$.fragment,s),o=!0)},o(s){w(l.$$.fragment,s),o=!1},d(s){s&&S(e),B(l)}}}function Qt(n){let e=n[13].name+"",l,t;return{c(){l=F(e),t=L()},m(o,r){C(o,l,r),C(o,t,r)},p:q,d(o){o&&(S(l),S(t))}}}function Ke(n){let e,l,t,o,r,s,u,i;function a(){return n[11](n[15])}l=new We({props:{$$slots:{default:[Qt]},$$scope:{ctx:n}}}),l.$on("click",a);function c(...f){return n[12](n[15],...f)}return{c(){e=g("li"),j(l.$$.fragment),t=F(`:
          `),o=g("progress"),u=L(),o.value=r=n[1].filter(c).length,T(o,"max",s=n[1].length),T(o,"class","svelte-zadug4")},m(f,p){C(f,e,p),A(l,e,null),h(e,t),h(e,o),h(e,u),i=!0},p(f,p){n=f;const d={};p&262144&&(d.$$scope={dirty:p,ctx:n}),l.$set(d),(!i||p&2&&r!==(r=n[1].filter(c).length))&&(o.value=r),(!i||p&2&&s!==(s=n[1].length))&&T(o,"max",s)},i(f){i||(b(l.$$.fragment,f),i=!0)},o(f){w(l.$$.fragment,f),i=!1},d(f){f&&S(e),B(l)}}}function Zt(n){let e,l,t,o,r,s,u,i,a,c,f,p,d,_,m,$,N=I(n[1]),v=[];for(let y=0;y<N.length;y+=1)v[y]=Oe(Ge(n,N,y));const ne=y=>w(v[y],1,1,()=>{v[y]=null});let X=I(J),D=[];for(let y=0;y<X.length;y+=1)D[y]=Ke(Te(n,X,y));const Qe=y=>w(D[y],1,1,()=>{D[y]=null});return{c(){e=g("div"),l=g("div"),t=g("button"),t.textContent="New link",o=L(),r=g("button"),r.textContent="Clear",s=L(),u=g("button"),u.textContent="Table of questions",i=L(),a=g("button"),a.textContent="Download",c=F(`

    Links:
    `),f=g("ol");for(let y=0;y<v.length;y+=1)v[y].c();p=F(`

    Questions:
    `),d=g("ol");for(let y=0;y<D.length;y+=1)D[y].c();T(e,"slot","sidebar")},m(y,E){C(y,e,E),h(e,l),h(l,t),h(l,o),h(l,r),h(l,s),h(l,u),h(l,i),h(l,a),h(e,c),h(e,f);for(let k=0;k<v.length;k+=1)v[k]&&v[k].m(f,null);h(e,p),h(e,d);for(let k=0;k<D.length;k+=1)D[k]&&D[k].m(d,null);_=!0,m||($=[z(t,"click",n[5]),z(r,"click",n[4]),z(u,"click",n[8]),z(a,"click",n[9])],m=!0)},p(y,E){if(E&6){N=I(y[1]);let k;for(k=0;k<N.length;k+=1){const ee=Ge(y,N,k);v[k]?(v[k].p(ee,E),b(v[k],1)):(v[k]=Oe(ee),v[k].c(),b(v[k],1),v[k].m(f,null))}for(V(),k=N.length;k<v.length;k+=1)ne(k);x()}if(E&6){X=I(J);let k;for(k=0;k<X.length;k+=1){const ee=Te(y,X,k);D[k]?(D[k].p(ee,E),b(D[k],1)):(D[k]=Ke(ee),D[k].c(),b(D[k],1),D[k].m(d,null))}for(V(),k=X.length;k<D.length;k+=1)Qe(k);x()}},i(y){if(!_){for(let E=0;E<N.length;E+=1)b(v[E]);for(let E=0;E<X.length;E+=1)b(D[E]);_=!0}},o(y){v=v.filter(Boolean);for(let E=0;E<v.length;E+=1)w(v[E]);D=D.filter(Boolean);for(let E=0;E<D.length;E+=1)w(D[E]);_=!1},d(y){y&&S(e),R(v,y),R(D,y),m=!1,me($)}}}function Xt(n){let e,l;return e=new ge({props:{manageHoverState:!0,paint:{"line-color":["get","color"],"line-width":Ue(6,9)},hoverCursor:"pointer"}}),e.$on("click",n[7]),{c(){j(e.$$.fragment)},m(t,o){A(e,t,o),l=!0},p:q,i(t){l||(b(e.$$.fragment,t),l=!0)},o(t){w(e.$$.fragment,t),l=!1},d(t){B(e,t)}}}function Yt(n){let e,l,t;return l=new he({props:{data:n[3],generateId:!0,$$slots:{default:[Xt]},$$scope:{ctx:n}}}),{c(){e=g("div"),j(l.$$.fragment),T(e,"slot","map")},m(o,r){C(o,e,r),A(l,e,null),t=!0},p(o,r){const s={};r&8&&(s.data=o[3]),r&262148&&(s.$$scope={dirty:r,ctx:o}),l.$set(s)},i(o){t||(b(l.$$.fragment,o),t=!0)},o(o){w(l.$$.fragment,o),t=!1},d(o){o&&S(e),B(l)}}}function Vt(n){let e,l,t,o=n[0]&&Je(n);return l=new ke({props:{$$slots:{map:[Yt],sidebar:[Zt]},$$scope:{ctx:n}}}),{c(){o&&o.c(),e=L(),j(l.$$.fragment)},m(r,s){o&&o.m(r,s),C(r,e,s),A(l,r,s),t=!0},p(r,[s]){r[0]?o?(o.p(r,s),s&1&&b(o,1)):(o=Je(r),o.c(),b(o,1),o.m(e.parentNode,e)):o&&(V(),w(o,1,1,()=>{o=null}),x());const u={};s&262159&&(u.$$scope={dirty:s,ctx:r}),l.$set(u)},i(r){t||(b(o),b(l.$$.fragment,r),t=!0)},o(r){w(o),w(l.$$.fragment,r),t=!1},d(r){r&&S(e),o&&o.d(r),B(l,r)}}}function xt(n,e,l){let t,o,r;M(n,P,$=>l(1,t=$)),M(n,G,$=>l(2,o=$)),M(n,ue,$=>l(3,r=$));let s=!1;function u(){K(P,t=[],t)}function i(){let $=$t(t.length);K(P,t=[...t,$],t),K(G,o={kind:"edit-link",idx:t.length-1},o)}return[s,t,o,r,u,i,()=>l(0,s=!1),$=>K(G,o={kind:"edit-link",idx:$.detail.features[0].id},o),()=>l(0,s=!0),()=>Jt("rcv2.geojson",JSON.stringify(r)),$=>K(G,o={kind:"edit-link",idx:$},o),$=>K(G,o={kind:"edit-question",idx:$},o),($,N)=>N.properties.answers[$]!=""]}class en extends U{constructor(e){super(),W(this,e,xt,Vt,Q,{})}}function tn(n){let e,l;return{c(){e=g("div"),l=g("div"),T(e,"slot","left")},m(t,o){C(t,e,o),h(e,l),n[9](l)},p:q,d(t){t&&S(e),n[9](null)}}}function nn(n){return{c:q,m:q,p:q,i:q,o:q,d:q}}function ln(n){let e,l,t;function o(s){n[8](s)}let r={style:n[10],standardControls:!0,hash:!0,$$slots:{default:[an]},$$scope:{ctx:n}};return n[2]!==void 0&&(r.map=n[2]),e=new rt({props:r}),Z.push(()=>_e(e,"map",o)),{c(){j(e.$$.fragment)},m(s,u){A(e,s,u),t=!0},p(s,u){const i={};u&2058&&(i.$$scope={dirty:u,ctx:s}),!l&&u&4&&(l=!0,i.map=s[2],de(()=>l=!1)),e.$set(i)},i(s){t||(b(e.$$.fragment,s),t=!0)},o(s){w(e.$$.fragment,s),t=!1},d(s){B(e,s)}}}function on(n){let e,l;return e=new qt({props:{qIdx:n[3].idx}}),{c(){j(e.$$.fragment)},m(t,o){A(e,t,o),l=!0},p(t,o){const r={};o&8&&(r.qIdx=t[3].idx),e.$set(r)},i(t){l||(b(e.$$.fragment,t),l=!0)},o(t){w(e.$$.fragment,t),l=!1},d(t){B(e,t)}}}function rn(n){let e,l;return e=new Dt({props:{idx:n[3].idx}}),{c(){j(e.$$.fragment)},m(t,o){A(e,t,o),l=!0},p(t,o){const r={};o&8&&(r.idx=t[3].idx),e.$set(r)},i(t){l||(b(e.$$.fragment,t),l=!0)},o(t){w(e.$$.fragment,t),l=!1},d(t){B(e,t)}}}function sn(n){let e,l;return e=new en({}),{c(){j(e.$$.fragment)},m(t,o){A(e,t,o),l=!0},p:q,i(t){l||(b(e.$$.fragment,t),l=!0)},o(t){w(e.$$.fragment,t),l=!1},d(t){B(e,t)}}}function an(n){let e,l,t,o,r,s;const u=[sn,rn,on],i=[];function a(c,f){return c[3].kind=="neutral"?0:c[3].kind=="edit-link"?1:c[3].kind=="edit-question"?2:-1}return~(t=a(n))&&(o=i[t]=u[t](n)),{c(){e=g("div"),l=L(),o&&o.c(),r=Pe()},m(c,f){C(c,e,f),n[7](e),C(c,l,f),~t&&i[t].m(c,f),C(c,r,f),s=!0},p(c,f){let p=t;t=a(c),t===p?~t&&i[t].p(c,f):(o&&(V(),w(i[p],1,1,()=>{i[p]=null}),x()),~t?(o=i[t],o?o.p(c,f):(o=i[t]=u[t](c),o.c()),b(o,1),o.m(r.parentNode,r)):o=null)},i(c){s||(b(o),s=!0)},o(c){w(o),s=!1},d(c){c&&(S(e),S(l),S(r)),n[7](null),~t&&i[t].d(c)}}}function cn(n){return{c:q,m:q,p:q,i:q,o:q,d:q}}function un(n){let e,l,t={ctx:n,current:null,token:null,hasCatch:!1,pending:cn,then:ln,catch:nn,value:10,blocks:[,,,]};return st(It(new URLSearchParams(window.location.search).get("google")||""),t),{c(){e=g("div"),t.block.c(),T(e,"slot","main"),H(e,"position","relative"),H(e,"width","100%"),H(e,"height","100vh")},m(o,r){C(o,e,r),t.block.m(e,t.anchor=null),t.mount=()=>e,t.anchor=null,l=!0},p(o,r){n=o,it(t,n,r)},i(o){l||(b(t.block),l=!0)},o(o){for(let r=0;r<3;r+=1){const s=t.blocks[r];w(s)}l=!1},d(o){o&&S(e),t.block.d(),t.token=null,t=null}}}function fn(n){let e,l;return e=new ot({props:{$$slots:{main:[un],left:[tn]},$$scope:{ctx:n}}}),{c(){j(e.$$.fragment)},m(t,o){A(e,t,o),l=!0},p(t,[o]){const r={};o&2063&&(r.$$scope={dirty:o,ctx:t}),e.$set(r)},i(t){l||(b(e.$$.fragment,t),l=!0)},o(t){w(e.$$.fragment,t),l=!1},d(t){B(e,t)}}}function pn(n,e,l){let t,o,r,s;M(n,pe,d=>l(4,t=d)),M(n,fe,d=>l(5,o=d)),M(n,ue,d=>l(6,r=d)),M(n,G,d=>l(3,s=d));let u,i,a;function c(d){Z[d?"unshift":"push"](()=>{a=d,l(1,a),l(4,t)})}function f(d){u=d,l(2,u)}function p(d){Z[d?"unshift":"push"](()=>{i=d,l(0,i),l(5,o)})}return n.$$.update=()=>{n.$$.dirty&64&&window.localStorage.setItem("tmp-rcv2",JSON.stringify(r)),n.$$.dirty&33&&i&&o&&(l(0,i.innerHTML="",i),i.appendChild(o)),n.$$.dirty&18&&a&&t&&(l(1,a.innerHTML="",a),a.appendChild(t))},[i,a,u,s,t,o,r,c,f,p]}class _n extends U{constructor(e){super(),W(this,e,pn,fn,Q,{})}}new _n({target:document.getElementById("app")});
