import{g as D,q as N,l as ut,w as U,c as T,s as A,d as u,a as k,b as g,u as f,e as pt,f as mt,i as ht,h as ft,j as gt,G as vt,o as yt,k as wt,m as bt}from"./firebase-DHuECNiC.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=e(s);fetch(s.href,i)}})();const P="storyforge-state-v1",B="story-demo",R="arc-demo",q="chapter-demo",L={users:{"demo-user":{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",penName:""}},stories:{[B]:{id:B,title:"The Clockwork Harbor",tags:["fantasy","mystery","serial"],visibility:"public",creatorId:"demo-user",creatorName:"Demo Creator",arcIds:[R],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},arcs:{[R]:{id:R,storyId:B,title:"Tide One",chapterIds:[q],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},chapters:{[q]:{id:q,arcId:R,title:"Lanterns on the Pier",body:`# Opening scene

A storm hangs over the harbor while the first lanterns come alive.`,assets:[],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}}};function $(a){return`${a}-${crypto.randomUUID().slice(0,8)}`}function tt(a){return JSON.parse(JSON.stringify(a))}function h(){const a=localStorage.getItem(P);if(!a)return localStorage.setItem(P,JSON.stringify(L)),tt(L);try{return JSON.parse(a)}catch{return localStorage.setItem(P,JSON.stringify(L)),tt(L)}}function y(a){localStorage.setItem(P,JSON.stringify(a))}function x(a,t){const e=(a.arcIds??[]).map(r=>t.arcs[r]).filter(Boolean).map(r=>F(r,t));return{...a,arcIds:a.arcIds??[],arcs:e}}function F(a,t){const e=(a.chapterIds??[]).map(r=>t.chapters[r]).filter(Boolean);return{...a,chapterIds:a.chapterIds??[],chapters:e}}function St(){return{mode:"local",async getUserProfile(a){return a?h().users[a]??null:null},async updateUserProfile(a,t){const e=h(),r=e.users[a]??{id:a,name:t.name??"Creator",email:t.email??"",penName:""};e.users[a]={...r,...t};const s=e.users[a].penName?.trim()||e.users[a].name||"Creator";for(const i of Object.values(e.stories))i.creatorId===a&&(i.creatorName=s);return y(e),e.users[a]},async listCreatorStories(a){if(!a)return[];const t=h();return Object.values(t.stories).filter(e=>e.creatorId===a).sort((e,r)=>r.updatedAt.localeCompare(e.updatedAt)).map(e=>({...e,arcs:(e.arcIds??[]).map(r=>({id:r}))}))},async listBrowserStories(){const a=h();return Object.values(a.stories).filter(t=>t.visibility==="public").sort((t,e)=>t.creatorName.localeCompare(e.creatorName)||t.title.localeCompare(e.title)).map(t=>({...t,arcs:(t.arcIds??[]).map(e=>({id:e}))}))},async getStory(a){const t=h(),e=t.stories[a];return e?x(e,t):null},async getArc(a){const t=h(),e=t.arcs[a];return e?F(e,t):null},async getChapter(a){return h().chapters[a]??null},async createStory({creatorId:a,creatorName:t,title:e,tags:r,visibility:s}){const i=h(),o=$("story"),c=new Date().toISOString();return i.stories[o]={id:o,title:e,tags:r,visibility:s,creatorId:a,creatorName:t,arcIds:[],createdAt:c,updatedAt:c},y(i),x(i.stories[o],i)},async updateStory(a,t){const e=h();if(!e.stories[a])throw new Error("Story not found.");return e.stories[a]={...e.stories[a],...t,updatedAt:new Date().toISOString()},y(e),x(e.stories[a],e)},async createArc(a,t){const e=h(),r=e.stories[a];if(!r)throw new Error("Story not found.");const s=$("arc"),i=new Date().toISOString();return e.arcs[s]={id:s,storyId:a,title:t,chapterIds:[],createdAt:i,updatedAt:i},r.arcIds.push(s),r.updatedAt=i,y(e),F(e.arcs[s],e)},async updateArc(a,t){const e=h(),r=e.arcs[a];if(!r)throw new Error("Arc not found.");return r.title=t.title??r.title,r.updatedAt=new Date().toISOString(),e.stories[r.storyId].updatedAt=r.updatedAt,y(e),F(r,e)},async reorderArcs(a,t){const e=h();e.stories[a].arcIds=[...t],e.stories[a].updatedAt=new Date().toISOString(),y(e)},async createChapter(a,t){const e=h(),r=e.arcs[a];if(!r)throw new Error("Arc not found.");const s=$("chapter"),i=new Date().toISOString();return e.chapters[s]={id:s,arcId:a,title:t,body:"",assets:[],createdAt:i,updatedAt:i},r.chapterIds.push(s),r.updatedAt=i,e.stories[r.storyId].updatedAt=i,y(e),e.chapters[s]},async updateChapter(a,t){const e=h();if(!e.chapters[a])throw new Error("Chapter not found.");e.chapters[a]={...e.chapters[a],...t,updatedAt:new Date().toISOString()};const r=e.arcs[e.chapters[a].arcId];return r&&(r.updatedAt=e.chapters[a].updatedAt,e.stories[r.storyId].updatedAt=r.updatedAt),y(e),e.chapters[a]},async updateChapterOrder(a,t){const e=h();e.arcs[a].chapterIds=[...t],e.arcs[a].updatedAt=new Date().toISOString(),e.stories[e.arcs[a].storyId].updatedAt=e.arcs[a].updatedAt,y(e)},async deleteChapter(a){const t=h(),e=t.chapters[a];if(!e)return;const r=t.arcs[e.arcId];if(r){r.chapterIds=(r.chapterIds??[]).filter(i=>i!==a),r.updatedAt=new Date().toISOString();const s=t.stories[r.storyId];s&&(s.updatedAt=r.updatedAt)}delete t.chapters[a],y(t)},async deleteArc(a){const t=h(),e=t.arcs[a];if(!e)return;for(const s of e.chapterIds??[])delete t.chapters[s];const r=t.stories[e.storyId];r&&(r.arcIds=(r.arcIds??[]).filter(s=>s!==a),r.updatedAt=new Date().toISOString()),delete t.arcs[a],y(t)},async deleteStory(a){const t=h(),e=t.stories[a];if(e){for(const r of e.arcIds??[]){const s=t.arcs[r];for(const i of s?.chapterIds??[])delete t.chapters[i];delete t.arcs[r]}delete t.stories[a],y(t)}}}}function j(a){return{...a,arcIds:a.arcIds??[],tags:a.tags??[],arcs:(a.arcIds??[]).map(t=>({id:t}))}}function v(a){return a.exists()?{id:a.id,...a.data()}:null}function H(a,t){const e=new Map(t.map((r,s)=>[r,s]));return[...a].sort((r,s)=>(e.get(r.id)??0)-(e.get(s.id)??0))}async function M(a,t){const e=await g(u(a,"stories",t)),r=v(e);if(!r)return null;const s=await D(N(T(a,"arcs"),U("storyId","==",t))),i=H(s.docs.map(d=>({id:d.id,...d.data(),chapterIds:d.data().chapterIds??[]})),r.arcIds??[]),o=await Promise.all(i.map(async d=>{const p=await D(N(T(a,"chapters"),U("arcId","==",d.id)));return[d.id,H(p.docs.map(b=>({id:b.id,...b.data(),assets:b.data().assets??[]})),d.chapterIds??[])]})),c=Object.fromEntries(o);return{...r,tags:r.tags??[],arcIds:r.arcIds??[],arcs:i.map(d=>({...d,chapterIds:d.chapterIds??[],chapters:c[d.id]??[]}))}}async function V(a,t){if(!t?.id)return;const e=u(a,"users",t.id),r=await g(e),s={id:t.id,name:t.name??"Creator",email:t.email??"",penName:t.penName??r.data?.penName??"",updatedAt:new Date().toISOString()};if(r.exists()){await f(e,s);return}await A(e,{...s,createdAt:new Date().toISOString()})}function $t(a){const t=a.db;return{mode:"firebase",async getUserProfile(e){if(!e)return null;const r=await g(u(t,"users",e));return v(r)},async updateUserProfile(e,r){const s=u(t,"users",e),i=await g(s),o={id:e,updatedAt:new Date().toISOString(),...r};i.exists()?await f(s,o):await A(s,{createdAt:new Date().toISOString(),...o});const c=await g(s),d=v(c),p=d?.penName?.trim()||d?.name||"Creator",b=await D(N(T(t,"stories"),U("creatorId","==",e)));return await Promise.all(b.docs.map(O=>f(u(t,"stories",O.id),{creatorName:p}))),d},async listCreatorStories(e){return e?(await D(N(T(t,"stories"),U("creatorId","==",e)))).docs.map(s=>j({id:s.id,...s.data()})).sort((s,i)=>String(i.updatedAt).localeCompare(String(s.updatedAt))):[]},async listBrowserStories(){return(await D(N(T(t,"stories"),U("visibility","==","public")))).docs.map(r=>j({id:r.id,...r.data()})).sort((r,s)=>r.creatorName.localeCompare(s.creatorName)||r.title.localeCompare(s.title))},async getStory(e){return M(t,e)},async getArc(e){const r=await g(u(t,"arcs",e)),s=v(r);if(!s)return null;const i=await D(N(T(t,"chapters"),U("arcId","==",e)));return{...s,chapterIds:s.chapterIds??[],chapters:H(i.docs.map(o=>({id:o.id,...o.data(),assets:o.data().assets??[]})),s.chapterIds??[])}},async getChapter(e){const r=await g(u(t,"chapters",e)),s=v(r);return s?{...s,assets:s.assets??[]}:null},async createStory({creatorId:e,creatorName:r,title:s,tags:i,visibility:o}){const c=$("story"),d=new Date().toISOString(),p={id:c,title:s,tags:i,visibility:o,creatorId:e,creatorName:r,arcIds:[],createdAt:d,updatedAt:d};return await A(u(t,"stories",c),p),await V(t,{id:e,name:r}),j(p)},async updateStory(e,r){return await f(u(t,"stories",e),{...r,updatedAt:new Date().toISOString()}),M(t,e)},async createArc(e,r){const s=u(t,"stories",e),i=await g(s),o=v(i);if(!o)throw new Error("Story not found.");const c=$("arc"),d=new Date().toISOString(),p={id:c,storyId:e,title:r,chapterIds:[],createdAt:d,updatedAt:d};return await A(u(t,"arcs",c),p),await f(s,{arcIds:[...o.arcIds??[],c],updatedAt:d}),p},async updateArc(e,r){const s=u(t,"arcs",e),i=new Date().toISOString();await f(s,{...r,updatedAt:i});const o=await g(s),c=v(o);return c?.storyId&&await f(u(t,"stories",c.storyId),{updatedAt:i}),this.getArc(e)},async reorderArcs(e,r){await f(u(t,"stories",e),{arcIds:r,updatedAt:new Date().toISOString()})},async createChapter(e,r){const s=u(t,"arcs",e),i=await g(s),o=v(i);if(!o)throw new Error("Arc not found.");const c=$("chapter"),d=new Date().toISOString(),p={id:c,arcId:e,title:r,body:"",assets:[],createdAt:d,updatedAt:d};return await A(u(t,"chapters",c),p),await f(s,{chapterIds:[...o.chapterIds??[],c],updatedAt:d}),await f(u(t,"stories",o.storyId),{updatedAt:d}),p},async updateChapter(e,r){const s=u(t,"chapters",e),i=new Date().toISOString();await f(s,{...r,updatedAt:i});const o=await g(s),c=v(o);if(c?.arcId){const d=await g(u(t,"arcs",c.arcId)),p=v(d);p&&(await f(u(t,"arcs",p.id),{updatedAt:i}),await f(u(t,"stories",p.storyId),{updatedAt:i}))}return this.getChapter(e)},async updateChapterOrder(e,r){const s=u(t,"arcs",e),i=new Date().toISOString();await f(s,{chapterIds:r,updatedAt:i});const o=await g(s),c=v(o);c?.storyId&&await f(u(t,"stories",c.storyId),{updatedAt:i})},async deleteChapter(e){const r=await g(u(t,"chapters",e)),s=v(r);if(!s)return;const i=u(t,"arcs",s.arcId),o=await g(i),c=v(o),d=new Date().toISOString();c&&(await f(i,{chapterIds:(c.chapterIds??[]).filter(p=>p!==e),updatedAt:d}),await f(u(t,"stories",c.storyId),{updatedAt:d})),await k(u(t,"chapters",e))},async deleteArc(e){const r=await g(u(t,"arcs",e)),s=v(r);if(!s)return;for(const d of s.chapterIds??[])await k(u(t,"chapters",d));const i=u(t,"stories",s.storyId),o=await g(i),c=v(o);c&&await f(i,{arcIds:(c.arcIds??[]).filter(d=>d!==e),updatedAt:new Date().toISOString()}),await k(u(t,"arcs",e))},async deleteStory(e){const r=await M(t,e);if(r){for(const s of r.arcs??[]){for(const i of s.chapters??[])await k(u(t,"chapters",i.id));await k(u(t,"arcs",s.id))}await k(u(t,"stories",e))}},async seedDemoStory(e){if(!e?.id)return;if(!(await D(N(T(t,"stories"),U("creatorId","==",e.id),ut(1)))).empty){await V(t,e);return}const s=$("story"),i=$("arc"),o=$("chapter"),c=new Date().toISOString();await A(u(t,"stories",s),{id:s,title:"Your First Story",tags:["draft"],visibility:"private",creatorId:e.id,creatorName:e.name??"Creator",arcIds:[i],createdAt:c,updatedAt:c}),await A(u(t,"arcs",i),{id:i,storyId:s,title:"Opening Arc",chapterIds:[o],createdAt:c,updatedAt:c}),await A(u(t,"chapters",o),{id:o,arcId:i,title:"Chapter One",body:`# Welcome

This story is now stored in Firestore.`,assets:[],createdAt:c,updatedAt:c}),await V(t,e)}}}async function It(a){return a?.mode==="firebase"&&a.db?$t(a):St()}const At={VITE_APP_MODE:"firebase",VITE_FIREBASE_API_KEY:"AIzaSyC8-b4_lzrCk2RhsqSEMkcxNKgMzVx_WJ4",VITE_FIREBASE_APP_ID:"1:309677315541:web:ef90a15da4ee29c03fd95c",VITE_FIREBASE_AUTH_DOMAIN:"ulunavir-tales.firebaseapp.com",VITE_FIREBASE_MESSAGING_SENDER_ID:"309677315541",VITE_FIREBASE_PROJECT_ID:"ulunavir-tales",VITE_FIREBASE_STORAGE_BUCKET:"ulunavir-tales.firebasestorage.app"},J={mode:"local",firebase:{apiKey:"",authDomain:"",projectId:"",appId:"",storageBucket:"",messagingSenderId:""}};function Ct(){const a=At??{};return{mode:a.VITE_APP_MODE??J.mode,firebase:{apiKey:a.VITE_FIREBASE_API_KEY??"",authDomain:a.VITE_FIREBASE_AUTH_DOMAIN??"",projectId:a.VITE_FIREBASE_PROJECT_ID??"",appId:a.VITE_FIREBASE_APP_ID??"",storageBucket:a.VITE_FIREBASE_STORAGE_BUCKET??"",messagingSenderId:a.VITE_FIREBASE_MESSAGING_SENDER_ID??""}}}function nt(){const a=globalThis.STORYFORGE_CONFIG??{},t=Ct();return{...J,...t,...a,firebase:{...J.firebase,...t.firebase,...a.firebase??{}}}}function Et(a){return a.mode==="firebase"&&!!(a.firebase.projectId&&a.firebase.apiKey&&a.firebase.appId)}function Ot(){const a=nt();if(!Et(a))return{mode:"local",auth:null,db:null,signIn:async()=>null,signOut:async()=>null,watchAuth:i=>(i(null),()=>{})};const t=pt().length?mt():ht(a.firebase),e=ft(t),r=gt(t),s=new vt;return{mode:"firebase",auth:e,db:r,signIn:async()=>(await bt(e,s)).user,signOut:async()=>wt(e),watchAuth:i=>yt(e,i)}}function Dt(){return nt()}const K=document.querySelector("#app"),n={adapter:null,authClient:null,currentUser:JSON.parse(localStorage.getItem("storyforge-session")??"null"),route:{name:"home",params:{}},dragActive:!1,saveStatus:"",authError:""};function ot(a=w()){return a?a.penName?.trim()||a.name||"Creator":"Guest"}function ct(a=w()){return a?.structureView==="grid"?"grid":"list"}function I(a){n.currentUser=a,localStorage.setItem("storyforge-session",JSON.stringify(a))}function S(a){const t=`#${a}`;if(window.location.hash===t){m();return}window.location.hash=a}function Nt(){const a=window.location.hash.replace(/^#/,"")||"/",[t]=a.split("?"),e=t.split("/").filter(Boolean);return e.length===0?{name:"home",params:{}}:e[0]==="creator"?{name:"creator",params:{}}:e[0]==="browser"?{name:"browser",params:{}}:e[0]==="settings"?{name:"settings",params:{}}:e[0]==="stories"&&e[1]?e[2]==="arcs"&&e[3]&&e[4]==="chapters"&&e[5]?{name:"chapter",params:{storyId:e[1],arcId:e[3],chapterId:e[5]}}:e[2]==="arcs"&&e[3]?{name:"arc",params:{storyId:e[1],arcId:e[3]}}:{name:"story",params:{storyId:e[1]}}:{name:"not-found",params:{}}}function _(){return new URLSearchParams(window.location.hash.split("?")[1]??"")}function w(){return n.currentUser?n.currentUser:n.authClient?.mode==="firebase"?null:{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",mode:"demo",structureView:"list"}}function Z(a){return!!(a?.creatorId&&w()?.id&&a.creatorId===w().id)}function l(a){return a.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function Y(a){return l(a).replace(/```([\s\S]*?)```/g,(p,b)=>`<pre><code>${b.trim()}</code></pre>`).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<p><img alt="$1" src="$2" /></p>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/(?:^|\n)- (.*(?:\n- .*)*)/g,p=>`
<ul>${p.trim().split(`
`).map(O=>O.replace(/^- /,"").trim()).map(O=>`<li>${O}</li>`).join("")}</ul>`).split(/\n{2,}/).map(p=>/^<(h\d|ul|pre|p)/.test(p.trim())?p:`<p>${p.replace(/\n/g,"<br />")}</p>`).join("")}function W(a){return new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short"}).format(new Date(a))}function Ut(a,t,e){if(!t)return a;const r=t.toLowerCase();return a.filter(s=>e(s).toLowerCase().includes(r))}function Tt(a){return[...new Set(a.flatMap(t=>t.tags))].sort((t,e)=>t.localeCompare(e))}function E(a,t){const e=w(),r=n.authError?`<div class="notice"><strong>Sign-in error</strong><div class="muted">${l(n.authError)}</div></div>`:"";K.innerHTML=`
    <div class="app-shell">
      <aside class="sidebar">
        <div>
          <div class="brand">
            <div class="brand-mark">SF</div>
            <div class="brand-text">
              <h1>Ulunavir Tales</h1>
              <p>Creator workspace</p>
            </div>
          </div>
          <nav class="nav-list">
            ${z("/","Main Menu",t==="home")}
            ${z("/creator","Creator",t==="creator")}
            ${z("/browser","Browser",t==="browser")}
          </nav>
        </div>
        <div class="stack">
          <button class="notice account-card" data-action="open-settings" ${e?"":"disabled"}>
            <strong>${l(ot(e))}</strong>
            <div class="muted">${l(e?.email??(n.authClient?.mode==="firebase"?"Sign in to create and manage stories":"Local demo mode"))}</div>
          </button>
          <button class="login-button" data-action="toggle-login">
            ${n.currentUser?"Log out":"Log in"}
          </button>
        </div>
      </aside>
      <main class="content">${a}</main>
    </div>
  `,r&&K.querySelector(".content").insertAdjacentHTML("afterbegin",r)}async function kt(){const a=w();if(!a)return C("Sign in to manage account settings.");E(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Settings</h2>
            <p class="muted">Manage how your author profile appears inside Ulunavir Tales.</p>
          </div>
        </div>
        <section class="panel stack">
          <div class="notice">
            <strong>Account name</strong>
            <div class="muted">${l(a.name??"Creator")}</div>
          </div>
          <div class="inline-form settings-form">
            <input id="pen-name-input" placeholder="${l(a.name??"Creator")}" value="${l(a.penName??"")}" />
            <button class="ghost-button" data-action="save-pen-name">Save pen name</button>
          </div>
          <div class="muted">
            Leave it empty to fall back to your account name.
          </div>
        </section>
      </div>
    `,"home")}function z(a,t,e){return`<a class="nav-link ${e?"is-active":""}" href="#${a}"><span>${t}</span></a>`}function _t(){return`
    <section class="hero">
      <div class="stack">
        <div class="status-pill">Static frontend, Firestore-ready data model</div>
        <div>
          <h2>Build stories, arcs, and chapters from one focused workspace.</h2>
          <p class="muted">
            This first version already supports creator and browser flows, story visibility,
            chapter editing in markdown, and drag-and-drop assets in local mode.
          </p>
        </div>
      </div>
    </section>
  `}async function Rt(){E(`
      <div class="stack">
        ${_t()}
        <section class="grid cols-2">
          <article class="panel">
            <h3>Main Menu</h3>
            <p class="muted">
              Start from the creator workspace to make stories, organize arcs, and draft
              chapters. Use the browser to explore public stories grouped by creator.
            </p>
          </article>
          <article class="panel">
            <h3>Storage Plan</h3>
            <p class="muted">
              Markdown chapter text fits cleanly in Firestore documents. Image uploads should
              move to object storage behind a Vercel endpoint in the next step.
            </p>
          </article>
        </section>
      </div>
    `,"home")}async function Lt(){const a=w(),t=await n.adapter.listCreatorStories(a?.id),e=_(),r=e.get("q")??"",s=e.get("tag")??"",i=Ut(t,r,d=>`${d.title} ${d.tags.join(" ")}`).filter(d=>s?d.tags.includes(s):!0),o=Tt(t),c=n.authClient?.mode==="firebase"&&!a?'<div class="notice">Sign in with Firebase to create, edit, and manage your own stories.</div>':"";E(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Creator</h2>
            <p class="muted">Manage your stories, search by title, and filter by tags.</p>
          </div>
          <button class="primary-button" data-action="create-story" ${a?"":"disabled"}>Create</button>
        </div>
        ${c}
        <section class="panel stack">
          <div class="search-row">
            <input id="story-search" placeholder="Search by story title or tag" value="${l(r)}" />
            <select id="story-tag-filter">
              <option value="">All tags</option>
              ${o.map(d=>`<option value="${l(d)}" ${s===d?"selected":""}>${l(d)}</option>`).join("")}
            </select>
            <button class="ghost-button" data-action="apply-story-filters">Filter</button>
          </div>
          <div class="chip-row">
            ${o.map(d=>`<a class="pill" href="#/creator?tag=${encodeURIComponent(d)}">${l(d)}</a>`).join("")}
          </div>
        </section>
        <section class="story-list">
          ${i.length?i.map(Pt).join(""):'<div class="empty-state">No stories match this filter yet.</div>'}
        </section>
      </div>
    `,"creator")}function Pt(a){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${l(a.title)}</h3>
          <p class="muted">Updated ${W(a.updatedAt)}</p>
        </div>
        <span class="status-pill">${l(a.visibility)}</span>
      </div>
      <div class="chip-row">
        ${a.tags.map(t=>`<span class="pill">${l(t)}</span>`).join("")}
      </div>
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${a.id}">Open story</a>
        <span class="pill">${a.arcs.length} arc(s)</span>
        <button class="danger-button" data-action="delete-story" data-story-id="${a.id}">Delete</button>
      </div>
    </article>
  `}async function Ft(){const a=await n.adapter.listBrowserStories(w()?.id),t=_(),e=t.get("group")!=="flat",r=t.get("creator")??"",s=r?a.filter(c=>c.creatorName===r):a,i=[...new Set(a.map(c=>c.creatorName))];let o="";s.length?e?o=i.filter(c=>!r||c===r).map(c=>{const d=s.filter(p=>p.creatorName===c);return d.length?`
          <section class="panel stack">
            <div class="section-header">
              <h3>${l(c)}</h3>
              <span class="pill">${d.length} public stories</span>
            </div>
            <div class="story-list">${d.map(et).join("")}</div>
          </section>
        `:""}).join(""):o=`<section class="story-list">${s.map(et).join("")}</section>`:o='<div class="empty-state">No public stories are available yet.</div>',E(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Browser</h2>
            <p class="muted">Explore public stories and browse them by creator.</p>
          </div>
          <div class="toolbar">
            <select id="browser-creator-filter">
              <option value="">All creators</option>
              ${i.map(c=>`<option value="${l(c)}" ${r===c?"selected":""}>${l(c)}</option>`).join("")}
            </select>
            <select id="browser-group-mode">
              <option value="grouped" ${e?"selected":""}>Grouped by creator</option>
              <option value="flat" ${e?"":"selected"}>Flat list</option>
            </select>
            <button class="ghost-button" data-action="apply-browser-filters">Apply</button>
          </div>
        </div>
        ${o}
      </div>
    `,"browser")}function et(a){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${l(a.title)}</h3>
          <p class="muted">by ${l(a.creatorName)}</p>
        </div>
        <span class="pill">${a.arcs.length} arc(s)</span>
      </div>
      <div class="chip-row">
        ${a.tags.map(t=>`<span class="pill">${l(t)}</span>`).join("")}
      </div>
      <a class="primary-button" href="#/stories/${a.id}?view=browser">Read structure</a>
    </article>
  `}async function Bt(a){const t=await n.adapter.getStory(a);if(!t)return C("Story not found.");const e=Z(t),r=_().get("view")==="browser",s=ct();if(t.visibility==="private"&&!e)return C("This story is private.");E(`
      <div class="stack">
        ${Q([[r?"#/browser":"#/creator",r?"Browser":"Creator"],["",t.title]])}
        <div class="page-title">
          <div>
            <h2>${l(t.title)}</h2>
            <p class="muted">Set visibility, manage arcs, and organize the reading order.</p>
          </div>
          <div class="card-actions">
            <div class="view-toggle" role="group" aria-label="Structure view">
              <button class="ghost-button ${s==="grid"?"is-active":""}" data-action="set-structure-view" data-view="grid">Compact Grid</button>
              <button class="ghost-button ${s==="list"?"is-active":""}" data-action="set-structure-view" data-view="list">List</button>
            </div>
            ${r&&e?'<a class="ghost-button" href="#/stories/'+t.id+'">Edit</a>':""}
            ${e&&!r?'<button class="primary-button" data-action="create-arc" data-story-id="'+t.id+'">New arc</button>':""}
          </div>
        </div>
        <section class="panel stack">
          <div class="inline-form">
            <input id="story-title-input" value="${l(t.title)}" ${e?"":"disabled"} />
            <input id="story-tags-input" value="${l(t.tags.join(", "))}" ${e?"":"disabled"} />
            <select id="story-visibility-input" ${e?"":"disabled"}>
              ${["public","unlisted","private"].map(i=>`<option value="${i}" ${t.visibility===i?"selected":""}>${i}</option>`).join("")}
            </select>
            ${e?'<button class="ghost-button" data-action="save-story-settings" data-story-id="'+t.id+'">Save</button>':""}
          </div>
          <div class="notice">
            <strong>${l(t.creatorName)}</strong>
            <div class="muted">Created ${W(t.createdAt)}. Visibility is currently ${l(t.visibility)}.</div>
          </div>
        </section>
        <section class="nested-list ${s==="list"?"is-list-view":""}">
          ${t.arcs.length?t.arcs.map((i,o)=>qt(i,t,e,o,r)).join(""):'<div class="empty-state">No arcs yet. Create the first arc to start structuring this story.</div>'}
        </section>
      </div>
    `,r?"browser":e?"creator":"browser")}function qt(a,t,e,r,s=!1){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${l(a.title)}</h3>
          <p class="muted">${a.chapters.length} chapter(s)</p>
        </div>
        ${e?`
          <div class="order-buttons">
            <button class="small-button" data-action="move-arc-up" data-story-id="${t.id}" data-index="${r}" ${r===0?"disabled":""}>↑</button>
            <button class="small-button" data-action="move-arc-down" data-story-id="${t.id}" data-index="${r}" ${r===t.arcs.length-1?"disabled":""}>↓</button>
          </div>`:""}
      </div>
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${t.id}/arcs/${a.id}${s?"?view=browser":""}">Open arc</a>
        ${e&&!s?`<button class="danger-button" data-action="delete-arc" data-story-id="${t.id}" data-arc-id="${a.id}">Delete</button>`:""}
      </div>
    </article>
  `}async function xt(a,t){const[e,r]=await Promise.all([n.adapter.getStory(a),n.adapter.getArc(t)]);if(!e||!r)return C("Arc not found.");const s=Z(e),i=_().get("view")==="browser",o=ct();if(e.visibility==="private"&&!s)return C("This story is private.");E(`
      <div class="stack">
        ${Q([[i?"#/browser":s?"#/creator":"#/browser",i?"Browser":s?"Creator":"Browser"],["#/stories/"+e.id+(i?"?view=browser":""),e.title],["",r.title]])}
        <div class="page-title">
          <div>
            <h2>${l(r.title)}</h2>
            <p class="muted">Manage the chapter list and reading order for this arc.</p>
          </div>
          <div class="card-actions">
            <div class="view-toggle" role="group" aria-label="Structure view">
              <button class="ghost-button ${o==="grid"?"is-active":""}" data-action="set-structure-view" data-view="grid">Compact Grid</button>
              <button class="ghost-button ${o==="list"?"is-active":""}" data-action="set-structure-view" data-view="list">List</button>
            </div>
            ${i&&s?'<a class="ghost-button" href="#/stories/'+e.id+"/arcs/"+r.id+'">Edit</a>':""}
            ${s&&!i?'<button class="primary-button" data-action="create-chapter" data-arc-id="'+r.id+'" data-story-id="'+e.id+'">New chapter</button>':""}
          </div>
        </div>
        ${s&&!i?`
          <section class="panel">
            <div class="inline-form">
              <input id="arc-title-input" value="${l(r.title)}" />
              <button class="ghost-button" data-action="save-arc-title" data-arc-id="${r.id}" data-story-id="${e.id}">Rename arc</button>
            </div>
        </section>`:""}
        <section class="nested-list ${o==="list"?"is-list-view":""}">
          ${r.chapters.length?r.chapters.map((c,d)=>jt(c,e,r,s,d,i)).join(""):'<div class="empty-state">No chapters yet. Add one to begin writing.</div>'}
        </section>
      </div>
    `,i?"browser":s?"creator":"browser")}function jt(a,t,e,r,s,i=!1){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${l(a.title||"Untitled chapter")}</h3>
          <p class="muted">Updated ${W(a.updatedAt)}</p>
        </div>
        ${r?`
          <div class="order-buttons">
            <button class="small-button" data-action="move-chapter-up" data-arc-id="${e.id}" data-index="${s}" ${s===0?"disabled":""}>↑</button>
            <button class="small-button" data-action="move-chapter-down" data-arc-id="${e.id}" data-index="${s}" ${s===e.chapters.length-1?"disabled":""}>↓</button>
          </div>`:""}
      </div>
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${t.id}/arcs/${e.id}/chapters/${a.id}${i?"?view=browser":""}">Open chapter</a>
        ${r&&!i?`<button class="danger-button" data-action="delete-chapter" data-story-id="${t.id}" data-arc-id="${e.id}" data-chapter-id="${a.id}">Delete</button>`:""}
      </div>
    </article>
  `}function Mt(a,t,e,r){return!e&&!r?"":`
    <div class="chapter-pager">
      ${e?`<a class="ghost-button" href="#/stories/${a}/arcs/${t}/chapters/${e.id}">Previous Chapter</a>`:""}
      ${r?`<a class="ghost-button" href="#/stories/${a}/arcs/${t}/chapters/${r.id}">Next Chapter</a>`:""}
    </div>
  `}async function Vt(a,t,e){const[r,s,i]=await Promise.all([n.adapter.getStory(a),n.adapter.getArc(t),n.adapter.getChapter(e)]);if(!r||!s||!i)return C("Chapter not found.");const o=Z(r),c=_().get("view")==="browser";if(r.visibility==="private"&&!o)return C("This story is private.");const d=i.assets??[],p=(s.chapters??[]).findIndex(lt=>lt.id===e),b=p>0?s.chapters[p-1]:null,O=p>=0&&p<s.chapters.length-1?s.chapters[p+1]:null,X=Mt(r.id,s.id,b,O),dt=o&&!c?`
        <div class="editor-shell">
          <section class="editor-pane">
            <div class="editor-controls">
              <input id="chapter-title-input" value="${l(i.title)}" ${o?"":"disabled"} />
              <textarea id="chapter-body-input" class="markdown-area" ${o?"":"disabled"}>${l(i.body)}</textarea>
              ${o?`
                <div class="panel asset-helper">
                  <div class="section-header">
                    <h3>Image link helper</h3>
                    <span class="pill">Manual Imgur or external URLs</span>
                  </div>
                  <div class="inline-form asset-form">
                    <input id="asset-name-input" placeholder="Image label, for example cover-art" />
                    <input id="asset-url-input" placeholder="https://i.imgur.com/your-image.jpg" />
                    <button class="ghost-button" data-action="add-external-asset" data-chapter-id="${i.id}">Add image</button>
                  </div>
                  <div class="notice">
                    Upload the image to Imgur first, then paste the direct image URL here. This will save the link on the chapter and append the markdown automatically.
                  </div>
                </div>
              `:""}
              <div class="asset-list">
                ${d.length?d.map(at).join(""):'<div class="empty-state">No assets in this chapter yet.</div>'}
              </div>
              <div class="notice mono">${l(n.saveStatus||"Tip: use `![alt](image-url)` to place pasted external images into the chapter body.")}</div>
            </div>
          </section>
          <section class="preview-pane">
            <h3>Preview</h3>
            <div class="markdown-preview">${Y(i.body||"*Start writing to preview your chapter here.*")}</div>
          </section>
        </div>
      `:`
        <section class="panel stack">
          <div class="section-header">
            <h3>Reading view</h3>
            <span class="pill">${d.length} asset(s)</span>
          </div>
          <div class="markdown-preview">${Y(i.body||"*This chapter is empty.*")}</div>
        </section>
        ${d.length?`<section class="panel stack"><h3>Referenced images</h3><div class="asset-list">${d.map(at).join("")}</div></section>`:""}
      `;E(`
      <div class="stack">
        ${Q([[c?"#/browser":o?"#/creator":"#/browser",c?"Browser":o?"Creator":"Browser"],["#/stories/"+r.id+(c?"?view=browser":""),r.title],["#/stories/"+r.id+"/arcs/"+s.id+(c?"?view=browser":""),s.title],["",i.title||"Untitled chapter"]])}
        <div class="page-title">
          <div>
            <h2>${l(i.title||"Untitled chapter")}</h2>
            <p class="muted">${o&&!c?"Write in markdown, add image links, and save your draft.":"Read this chapter in a clean, read-only view."}</p>
          </div>
          <div class="card-actions">
            ${c&&o?`<a class="ghost-button" href="#/stories/${r.id}/arcs/${s.id}/chapters/${i.id}">Edit</a>`:""}
            ${o&&!c?`<button class="primary-button" data-action="save-chapter" data-chapter-id="${i.id}">Save</button>`:""}
          </div>
        </div>
        ${X}
        ${dt}
        ${X}
      </div>
    `,c?"browser":o?"creator":"browser")}function at(a){const t=a.url??a.dataUrl??"";return`
    <article class="asset-item">
      ${!!t?`<img src="${t}" alt="${l(a.name)}" />`:""}
      <strong>${l(a.name)}</strong>
      <div class="muted mono">![${l(a.name)}](${t})</div>
    </article>
  `}function C(a){E(`
      <div class="stack">
        <section class="panel">
          <h2>Not found</h2>
          <p class="muted">${l(a)}</p>
        </section>
      </div>
    `,"home")}function Q(a){return`<div class="breadcrumbs">${a.map(([t,e])=>t?`<a href="${t}">${l(e)}</a>`:`<span>${l(e)}</span>`).join("<span>/</span>")}</div>`}async function m(){switch(n.route=Nt(),n.route.name){case"home":return Rt();case"creator":return Lt();case"browser":return Ft();case"settings":return kt();case"story":return Bt(n.route.params.storyId);case"arc":return xt(n.route.params.storyId,n.route.params.arcId);case"chapter":return Vt(n.route.params.storyId,n.route.params.arcId,n.route.params.chapterId);default:return C("This page does not exist.")}}function zt(){return{title:document.querySelector("#story-title-input")?.value.trim()??"",tags:(document.querySelector("#story-tags-input")?.value??"").split(",").map(a=>a.trim()).filter(Boolean),visibility:document.querySelector("#story-visibility-input")?.value??"private"}}function rt(a,t,e){const r=[...a],[s]=r.splice(t,1);return r.splice(e,0,s),r}async function st(){if(n.currentUser)return await n.authClient.signOut(),I(null),n.saveStatus="Signed out.",n.authError="",m();if(n.authClient.mode==="firebase")try{const t=await n.authClient.signIn();return await n.adapter.seedDemoStory?.({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email}),I({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email,mode:"firebase",structureView:"list"}),n.authError="",n.saveStatus="Signed in with Firebase.",m()}catch(t){return console.error("Firebase sign-in failed:",t),n.saveStatus="",n.authError=Gt(t),m()}const a=document.createElement("div");a.className="modal-backdrop",a.innerHTML=`
    <div class="modal-card stack">
      <div>
        <h3>Log in</h3>
        <p class="muted">Local demo mode uses a simple profile so you can keep building right away.</p>
      </div>
      <input id="login-name" placeholder="Display name" value="Demo Creator" />
      <input id="login-email" placeholder="Email" value="demo@storyforge.local" />
      <div class="card-actions">
        <button class="primary-button" id="modal-login-submit">Continue</button>
        <button class="ghost-button" id="modal-login-cancel">Cancel</button>
      </div>
    </div>
  `,document.body.append(a),a.querySelector("#modal-login-cancel").addEventListener("click",()=>a.remove()),a.querySelector("#modal-login-submit").addEventListener("click",()=>{const t=a.querySelector("#login-name").value.trim()||"Creator",e=a.querySelector("#login-email").value.trim()||"local@storyforge.local";I({id:`local-${t.toLowerCase().replaceAll(/\s+/g,"-")}`,name:t,email:e,mode:"local",structureView:"list"}),a.remove(),n.saveStatus="Signed in with a local demo profile.",n.authError="",m()})}function Gt(a){const t=a?.code?String(a.code):"",e=a?.message?String(a.message):"Unknown sign-in error.";return t==="auth/unauthorized-domain"?"This site domain is not authorized in Firebase Auth. Add your local/dev domain and your GitHub Pages domain in Firebase Console > Authentication > Settings > Authorized domains.":t==="auth/popup-closed-by-user"?"The sign-in popup closed before Firebase completed the login. If it closes instantly every time, double-check Authorized domains and the Google sign-in provider setup.":t==="auth/operation-not-allowed"?"Google sign-in is not enabled for this Firebase project. Enable it in Firebase Console > Authentication > Sign-in method.":t==="auth/invalid-api-key"?"Your Firebase API key is invalid. Recheck the values in your `.env` file and restart the dev server.":t==="auth/network-request-failed"?"Firebase could not complete the sign-in request. Check your connection and any browser privacy extensions blocking popups or auth requests.":t?`${t}: ${e}`:e}async function Ht(a){const t=n.route.params.chapterId,e=await n.adapter.getChapter(t);if(!e)return;const r=[...e.assets??[]];for(const o of a){const c=await Yt(o);r.push({id:crypto.randomUUID(),name:o.name,type:o.type,size:o.size,dataUrl:c})}const s=document.querySelector("#chapter-body-input"),i=r.slice((e.assets??[]).length).map(o=>`
![${o.name}](${o.dataUrl})`).join("");await n.adapter.updateChapter(t,{assets:r,body:`${s.value}${i}`}),n.dragActive=!1,n.saveStatus="Assets added to the chapter. In production these should upload to object storage instead of local state.",await m()}function Jt(a){const t=a.trim();if(!t)throw new Error("Add an image URL first.");let e;try{e=new URL(t)}catch{throw new Error("That image URL is not valid.")}if(!["http:","https:"].includes(e.protocol))throw new Error("Use an http or https image URL.");return e.toString()}async function Kt(a){const t=await n.adapter.getChapter(a);if(!t)throw new Error("Chapter not found.");const e=document.querySelector("#asset-name-input"),r=document.querySelector("#asset-url-input"),s=document.querySelector("#chapter-body-input"),i=e?.value.trim()||"image",o=Jt(r?.value??""),c={id:crypto.randomUUID(),name:i,type:"image/external",url:o},d=[...t.assets??[],c],p=`${s?.value??t.body??""}
![${i}](${o})`;await n.adapter.updateChapter(a,{assets:d,body:p}),n.saveStatus="External image link added and markdown updated.",await m()}async function it(){const a=w();if(!a?.id)return;const t=await n.adapter.getUserProfile?.(a.id);t&&I({...a,name:t.name??a.name,email:t.email??a.email,penName:t.penName??"",structureView:t.structureView??a.structureView??"list"})}function G(a){return window.confirm(`Are you sure you want to delete this ${a}? This cannot be undone.`)}function Yt(a){return new Promise((t,e)=>{const r=new FileReader;r.onload=()=>t(String(r.result)),r.onerror=()=>e(r.error),r.readAsDataURL(a)})}document.addEventListener("click",async a=>{const t=a.target.closest("[data-action]");if(!t)return;const e=t.dataset.action;if(e==="toggle-login")return st();if(e==="open-settings")return S("/settings");if(e==="set-structure-view"){const r=w(),s=t.dataset.view==="list"?"list":"grid";if(!r?.id)return I({...r,structureView:s}),m();const i=await n.adapter.updateUserProfile(r.id,{name:r.name,email:r.email,penName:r.penName??"",structureView:s});return I({...r,structureView:i.structureView??s,penName:i.penName??r.penName??"",name:i.name??r.name,email:i.email??r.email}),m()}if(e==="apply-story-filters"){const r=document.querySelector("#story-search").value.trim(),s=document.querySelector("#story-tag-filter").value;return S(`/creator${r||s?`?${new URLSearchParams({q:r,tag:s}).toString()}`:""}`)}if(e==="apply-browser-filters"){const r=document.querySelector("#browser-creator-filter").value,s=document.querySelector("#browser-group-mode").value;return S(`/browser?${new URLSearchParams({creator:r,group:s}).toString()}`)}if(e==="create-story"){const r=w();if(!r)return n.saveStatus="Sign in first to create stories in Firebase mode.",st();const s=await n.adapter.createStory({creatorId:r.id,creatorName:ot(r),title:"Untitled Story",tags:["draft"],visibility:"private"});return S(`/stories/${s.id}`)}if(e==="save-story-settings"){const r=t.dataset.storyId,s=zt();return await n.adapter.updateStory(r,s),n.saveStatus="Story details saved.",m()}if(e==="create-arc"){const r=t.dataset.storyId,s=await n.adapter.createArc(r,`Arc ${Math.floor(Math.random()*90+10)}`);return S(`/stories/${r}/arcs/${s.id}`)}if(e==="save-arc-title")return await n.adapter.updateArc(t.dataset.arcId,{title:document.querySelector("#arc-title-input").value.trim()||"Untitled Arc"}),n.saveStatus="Arc title saved.",m();if(e==="move-arc-up"||e==="move-arc-down"){const r=await n.adapter.getStory(t.dataset.storyId),s=Number(t.dataset.index),i=e==="move-arc-up"?-1:1;return await n.adapter.reorderArcs(r.id,rt(r.arcIds,s,s+i)),m()}if(e==="create-chapter"){const r=await n.adapter.createChapter(t.dataset.arcId,"Untitled Chapter");return S(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}/chapters/${r.id}`)}if(e==="move-chapter-up"||e==="move-chapter-down"){const r=await n.adapter.getArc(t.dataset.arcId),s=Number(t.dataset.index),i=e==="move-chapter-up"?-1:1;return await n.adapter.updateChapterOrder(r.id,rt(r.chapterIds,s,s+i)),m()}if(e==="save-chapter"){const r=t.dataset.chapterId;return await n.adapter.updateChapter(r,{title:document.querySelector("#chapter-title-input").value.trim()||"Untitled Chapter",body:document.querySelector("#chapter-body-input").value}),n.saveStatus="Chapter saved.",m()}if(e==="save-pen-name"){const r=w(),s=document.querySelector("#pen-name-input").value.trim(),i=await n.adapter.updateUserProfile(r.id,{name:r.name,email:r.email,penName:s});return I({...r,penName:i.penName??"",name:i.name??r.name,email:i.email??r.email}),n.saveStatus=s?"Pen name saved.":"Pen name cleared. Account name will be used.",m()}if(e==="delete-story")return G("story")?(await n.adapter.deleteStory(t.dataset.storyId),n.saveStatus="Story deleted.",S("/creator")):void 0;if(e==="delete-arc")return G("arc")?(await n.adapter.deleteArc(t.dataset.arcId),n.saveStatus="Arc deleted.",S(`/stories/${t.dataset.storyId}`)):void 0;if(e==="delete-chapter")return G("chapter")?(await n.adapter.deleteChapter(t.dataset.chapterId),n.saveStatus="Chapter deleted.",S(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}`)):void 0;if(e==="add-external-asset")try{return await Kt(t.dataset.chapterId)}catch(r){return n.saveStatus=String(r.message||r),m()}});document.addEventListener("input",a=>{if(a.target.id==="chapter-body-input"){const t=document.querySelector(".markdown-preview");t&&(t.innerHTML=Y(a.target.value||"*Start writing to preview your chapter here.*"))}if(a.target.id==="chapter-title-input"){const t=a.target.value.trim()||"Untitled chapter",e=document.querySelector(".page-title h2");e&&(e.textContent=t)}});document.addEventListener("dragover",a=>{if(n.route.name!=="chapter")return;a.preventDefault(),n.dragActive=!0;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.add("is-active")});document.addEventListener("dragleave",a=>{if(n.route.name!=="chapter"||a.relatedTarget)return;n.dragActive=!1;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active")});document.addEventListener("drop",async a=>{if(n.route.name!=="chapter")return;a.preventDefault();const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active");const e=[...a.dataTransfer.files].filter(r=>r.type.startsWith("image/"));e.length&&await Ht(e)});window.addEventListener("hashchange",()=>{n.saveStatus="",m()});async function Zt(){const a=Ot();n.authClient=a,n.adapter=await It(a),n.authClient.mode==="firebase"?n.authClient.watchAuth(t=>{t?(I({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email,mode:"firebase"}),it().finally(()=>m())):(I(null),m())}):n.currentUser?.id&&await it(),window.location.hash?m():S("/")}Zt().catch(a=>{K.innerHTML=`
    <main class="content">
      <section class="panel">
        <h2>App failed to start</h2>
        <p class="muted">${l(String(a.message||a))}</p>
        <p class="muted">Current mode: ${l(Dt().mode)}</p>
      </section>
    </main>
  `});
