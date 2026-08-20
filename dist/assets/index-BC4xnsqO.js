import{g as D,q as U,l as Lt,w as R,c as L,s as C,d as p,a as q,b as g,u as f,e as qt,f as _t,i as xt,h as Bt,j as Ft,G as Vt,o as Mt,k as jt,m as zt}from"./firebase-DHuECNiC.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=a(s);fetch(s.href,o)}})();const K="storyforge-state-v1",W="story-demo",G="arc-demo",J="chapter-demo",B="Chapters",Y={users:{"demo-user":{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",penName:""}},stories:{[W]:{id:W,title:"The Clockwork Harbor",tags:["fantasy","mystery","serial"],visibility:"public",creatorId:"demo-user",creatorName:"Demo Creator",arcIds:[G],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},arcs:{[G]:{id:G,storyId:W,title:"Tide One",chapterIds:[J],soundtracks:[],phases:[{id:"phase-demo",title:B,chapterIds:[J]}],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},chapters:{[J]:{id:J,arcId:G,title:"Lanterns on the Pier",body:`# Opening scene

A storm hangs over the harbor while the first lanterns come alive.`,assets:[],soundtracks:[],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}}};function S(e){return`${e}-${crypto.randomUUID().slice(0,8)}`}function ht(e){return JSON.parse(JSON.stringify(e))}function x(e){return e.flatMap(t=>t.chapterIds??[])}function V(e=[]){return{id:S("phase"),title:B,chapterIds:[...e]}}function $(e){const t=[...e.chapterIds??[]],a=Array.isArray(e.phases)&&e.phases.length?e.phases.map(i=>({id:i.id??S("phase"),title:i.title?.trim()||B,chapterIds:[...i.chapterIds??[]]})):[V(t)],r=new Set;for(const i of a)i.chapterIds=i.chapterIds.filter(c=>!c||r.has(c)?!1:(r.add(c),!0));const s=t.filter(i=>!r.has(i));s.length&&a[0].chapterIds.push(...s);const o=x(a);return{...e,chapterIds:o,soundtracks:e.soundtracks??[],phases:a}}function y(){const e=localStorage.getItem(K);if(!e)return localStorage.setItem(K,JSON.stringify(Y)),ht(Y);try{return JSON.parse(e)}catch{return localStorage.setItem(K,JSON.stringify(Y)),ht(Y)}}function b(e){localStorage.setItem(K,JSON.stringify(e))}function X(e,t){const a=(e.arcIds??[]).map(r=>t.arcs[r]).filter(Boolean).map(r=>H(r,t));return{...e,arcIds:e.arcIds??[],arcs:a}}function H(e,t){const a=$(e),r=a.chapterIds.map(s=>t.chapters[s]).filter(Boolean);return{...a,chapterIds:a.chapterIds??[],chapters:r,phases:a.phases.map(s=>({...s,chapters:s.chapterIds.map(o=>t.chapters[o]).filter(Boolean)}))}}function _(e,t){const a=e.arcs[t];if(!a)return!1;const r=$(a),s=JSON.stringify({chapterIds:a.chapterIds??[],phases:a.phases??[]})!==JSON.stringify({chapterIds:r.chapterIds,phases:r.phases});return s&&(e.arcs[t]={...e.arcs[t],chapterIds:r.chapterIds,phases:r.phases}),s}function Gt(){return{mode:"local",async getUserProfile(e){return e?y().users[e]??null:null},async updateUserProfile(e,t){const a=y(),r=a.users[e]??{id:e,name:t.name??"Creator",email:t.email??"",penName:""};a.users[e]={...r,...t};const s=a.users[e].penName?.trim()||a.users[e].name||"Creator";for(const o of Object.values(a.stories))o.creatorId===e&&(o.creatorName=s);return b(a),a.users[e]},async listCreatorStories(e){if(!e)return[];const t=y();return Object.values(t.stories).filter(a=>a.creatorId===e).sort((a,r)=>r.updatedAt.localeCompare(a.updatedAt)).map(a=>({...a,arcs:(a.arcIds??[]).map(r=>({id:r}))}))},async listBrowserStories(){const e=y();return Object.values(e.stories).filter(t=>t.visibility==="public").sort((t,a)=>t.creatorName.localeCompare(a.creatorName)||t.title.localeCompare(a.title)).map(t=>({...t,arcs:(t.arcIds??[]).map(a=>({id:a}))}))},async getStory(e){const t=y();let a=!1;for(const s of t.stories[e]?.arcIds??[])a=_(t,s)||a;a&&b(t);const r=t.stories[e];return r?X(r,t):null},async getArc(e){const t=y();_(t,e)&&b(t);const r=t.arcs[e];return r?H(r,t):null},async getChapter(e){return y().chapters[e]??null},async createStory({creatorId:e,creatorName:t,title:a,tags:r,visibility:s}){const o=y(),i=S("story"),c=new Date().toISOString();return o.stories[i]={id:i,title:a,tags:r,visibility:s,creatorId:e,creatorName:t,arcIds:[],createdAt:c,updatedAt:c},b(o),X(o.stories[i],o)},async updateStory(e,t){const a=y();if(!a.stories[e])throw new Error("Story not found.");return a.stories[e]={...a.stories[e],...t,updatedAt:new Date().toISOString()},b(a),X(a.stories[e],a)},async createArc(e,t){const a=y(),r=a.stories[e];if(!r)throw new Error("Story not found.");const s=S("arc"),o=new Date().toISOString();return a.arcs[s]={id:s,storyId:e,title:t,chapterIds:[],soundtracks:[],phases:[V()],createdAt:o,updatedAt:o},r.arcIds.push(s),r.updatedAt=o,b(a),H(a.arcs[s],a)},async updateArc(e,t){const a=y(),r=a.arcs[e];if(!r)throw new Error("Arc not found.");return r.title=t.title??r.title,r.phases=t.phases??r.phases,r.chapterIds=t.chapterIds??r.chapterIds,r.soundtracks=t.soundtracks??r.soundtracks??[],r.updatedAt=new Date().toISOString(),a.stories[r.storyId].updatedAt=r.updatedAt,b(a),H(r,a)},async reorderArcs(e,t){const a=y();a.stories[e].arcIds=[...t],a.stories[e].updatedAt=new Date().toISOString(),b(a)},async createChapter(e,t){const a=y(),r=a.arcs[e];if(!r)throw new Error("Arc not found.");const s=S("chapter"),o=new Date().toISOString();return a.chapters[s]={id:s,arcId:e,title:t,body:"",assets:[],soundtracks:[],createdAt:o,updatedAt:o},r.chapterIds.push(s),r.phases?.length||(r.phases=[V()]),r.phases[0].chapterIds.push(s),r.updatedAt=o,a.stories[r.storyId].updatedAt=o,b(a),a.chapters[s]},async updateChapter(e,t){const a=y();if(!a.chapters[e])throw new Error("Chapter not found.");a.chapters[e]={...a.chapters[e],...t,updatedAt:new Date().toISOString()};const r=a.arcs[a.chapters[e].arcId];return r&&(r.updatedAt=a.chapters[e].updatedAt,a.stories[r.storyId].updatedAt=r.updatedAt),b(a),a.chapters[e]},async updateChapterOrder(e,t){const a=y();a.arcs[e].chapterIds=[...t],a.arcs[e].updatedAt=new Date().toISOString(),a.stories[a.arcs[e].storyId].updatedAt=a.arcs[e].updatedAt,b(a)},async createPhase(e,t){const a=y();_(a,e);const r=a.arcs[e],s={id:S("phase"),title:t?.trim()||"New Phase",chapterIds:[]};return r.phases.push(s),r.updatedAt=new Date().toISOString(),a.stories[r.storyId].updatedAt=r.updatedAt,b(a),s},async renamePhase(e,t,a){const r=y();_(r,e);const s=r.arcs[e],o=s.phases.find(i=>i.id===t);if(!o)throw new Error("Phase not found.");return o.title=a?.trim()||B,s.updatedAt=new Date().toISOString(),r.stories[s.storyId].updatedAt=s.updatedAt,b(r),o},async moveChapterToPhase(e,t,a){const r=y();_(r,e);const s=r.arcs[e];for(const i of s.phases)i.chapterIds=i.chapterIds.filter(c=>c!==t);const o=s.phases.find(i=>i.id===a);if(!o)throw new Error("Phase not found.");o.chapterIds.push(t),s.chapterIds=x(s.phases),s.updatedAt=new Date().toISOString(),r.stories[s.storyId].updatedAt=s.updatedAt,b(r)},async reorderPhaseChapters(e,t,a){const r=y();_(r,e);const s=r.arcs[e],o=s.phases.find(i=>i.id===t);if(!o)throw new Error("Phase not found.");o.chapterIds=[...a],s.chapterIds=x(s.phases),s.updatedAt=new Date().toISOString(),r.stories[s.storyId].updatedAt=s.updatedAt,b(r)},async deleteChapter(e){const t=y(),a=t.chapters[e];if(!a)return;const r=t.arcs[a.arcId];if(r){r.chapterIds=(r.chapterIds??[]).filter(o=>o!==e),r.phases=(r.phases??[]).map(o=>({...o,chapterIds:(o.chapterIds??[]).filter(i=>i!==e)})),r.updatedAt=new Date().toISOString();const s=t.stories[r.storyId];s&&(s.updatedAt=r.updatedAt)}delete t.chapters[e],b(t)},async deleteArc(e){const t=y(),a=t.arcs[e];if(!a)return;for(const s of a.chapterIds??[])delete t.chapters[s];const r=t.stories[a.storyId];r&&(r.arcIds=(r.arcIds??[]).filter(s=>s!==e),r.updatedAt=new Date().toISOString()),delete t.arcs[e],b(t)},async deleteStory(e){const t=y(),a=t.stories[e];if(a){for(const r of a.arcIds??[]){const s=t.arcs[r];for(const o of s?.chapterIds??[])delete t.chapters[o];delete t.arcs[r]}delete t.stories[e],b(t)}}}}function tt(e){return{...e,arcIds:e.arcIds??[],tags:e.tags??[],arcs:(e.arcIds??[]).map(t=>({id:t}))}}function w(e){return e.exists()?{id:e.id,...e.data()}:null}function Q(e,t){const a=new Map(t.map((r,s)=>[r,s]));return[...e].sort((r,s)=>(a.get(r.id)??0)-(a.get(s.id)??0))}async function et(e,t){const a=await g(p(e,"stories",t)),r=w(a);if(!r)return null;const s=await D(U(L(e,"arcs"),R("storyId","==",t))),o=[];for(const d of Q(s.docs.map(u=>({id:u.id,...u.data(),chapterIds:u.data().chapterIds??[]})),r.arcIds??[])){const u=$(d);JSON.stringify({chapterIds:d.chapterIds??[],phases:d.phases??[]})!==JSON.stringify({chapterIds:u.chapterIds,phases:u.phases})&&await f(p(e,"arcs",d.id),{chapterIds:u.chapterIds,phases:u.phases}),o.push(u)}const i=await Promise.all(o.map(async d=>{const u=await D(U(L(e,"chapters"),R("arcId","==",d.id)));return[d.id,Q(u.docs.map(h=>({id:h.id,...h.data(),assets:h.data().assets??[],soundtracks:h.data().soundtracks??[]})),d.chapterIds??[])]})),c=Object.fromEntries(i);return{...r,tags:r.tags??[],arcIds:r.arcIds??[],arcs:o.map(d=>({...d,chapterIds:d.chapterIds??[],phases:d.phases.map(u=>({...u,chapters:(c[d.id]??[]).filter(h=>(u.chapterIds??[]).includes(h.id))})),chapters:c[d.id]??[]}))}}async function at(e,t){if(!t?.id)return;const a=p(e,"users",t.id),r=await g(a),s={id:t.id,name:t.name??"Creator",email:t.email??"",penName:t.penName??(r.exists()?r.data().penName:"")??"",structureView:t.structureView??(r.exists()?r.data().structureView:"list")??"list",updatedAt:new Date().toISOString()};if(r.exists()){await f(a,s);return}await C(a,{...s,createdAt:new Date().toISOString()})}function Jt(e){const t=e.db;return{mode:"firebase",async getUserProfile(a){if(!a)return null;const r=await g(p(t,"users",a));return w(r)},async updateUserProfile(a,r){const s=p(t,"users",a),o=await g(s),i={id:a,updatedAt:new Date().toISOString(),...r};o.exists()?await f(s,i):await C(s,{createdAt:new Date().toISOString(),...i});const c=await g(s),d=w(c),u=d?.penName?.trim()||d?.name||"Creator",h=await D(U(L(t,"stories"),R("creatorId","==",a)));return await Promise.all(h.docs.map(v=>f(p(t,"stories",v.id),{creatorName:u}))),d},async listCreatorStories(a){return a?(await D(U(L(t,"stories"),R("creatorId","==",a)))).docs.map(s=>tt({id:s.id,...s.data()})).sort((s,o)=>String(o.updatedAt).localeCompare(String(s.updatedAt))):[]},async listBrowserStories(){return(await D(U(L(t,"stories"),R("visibility","==","public")))).docs.map(r=>tt({id:r.id,...r.data()})).sort((r,s)=>r.creatorName.localeCompare(s.creatorName)||r.title.localeCompare(s.title))},async getStory(a){return et(t,a)},async getArc(a){const r=await g(p(t,"arcs",a)),s=w(r),o=s?$(s):null;if(!o)return null;JSON.stringify({chapterIds:s.chapterIds??[],phases:s.phases??[]})!==JSON.stringify({chapterIds:o.chapterIds,phases:o.phases})&&await f(p(t,"arcs",a),{chapterIds:o.chapterIds,phases:o.phases});const i=await D(U(L(t,"chapters"),R("arcId","==",a)));return{...o,chapterIds:o.chapterIds??[],phases:o.phases.map(c=>({...c,chapters:Q(i.docs.map(d=>({id:d.id,...d.data(),assets:d.data().assets??[],soundtracks:d.data().soundtracks??[]})).filter(d=>(c.chapterIds??[]).includes(d.id)),c.chapterIds??[])})),chapters:Q(i.docs.map(c=>({id:c.id,...c.data(),assets:c.data().assets??[],soundtracks:c.data().soundtracks??[]})),o.chapterIds??[])}},async getChapter(a){const r=await g(p(t,"chapters",a)),s=w(r);return s?{...s,assets:s.assets??[],soundtracks:s.soundtracks??[]}:null},async createStory({creatorId:a,creatorName:r,title:s,tags:o,visibility:i}){const c=S("story"),d=new Date().toISOString(),u={id:c,title:s,tags:o,visibility:i,creatorId:a,creatorName:r,arcIds:[],createdAt:d,updatedAt:d};return await C(p(t,"stories",c),u),await at(t,{id:a,name:r}),tt(u)},async updateStory(a,r){return await f(p(t,"stories",a),{...r,updatedAt:new Date().toISOString()}),et(t,a)},async createArc(a,r){const s=p(t,"stories",a),o=await g(s),i=w(o);if(!i)throw new Error("Story not found.");const c=S("arc"),d=new Date().toISOString(),u={id:c,storyId:a,title:r,chapterIds:[],soundtracks:[],phases:[V()],createdAt:d,updatedAt:d};return await C(p(t,"arcs",c),u),await f(s,{arcIds:[...i.arcIds??[],c],updatedAt:d}),u},async updateArc(a,r){const s=p(t,"arcs",a),o=new Date().toISOString();await f(s,{...r,updatedAt:o});const i=await g(s),c=w(i);return c?.storyId&&await f(p(t,"stories",c.storyId),{updatedAt:o}),this.getArc(a)},async reorderArcs(a,r){await f(p(t,"stories",a),{arcIds:r,updatedAt:new Date().toISOString()})},async createChapter(a,r){const s=p(t,"arcs",a),o=await g(s),i=w(o);if(!i)throw new Error("Arc not found.");const c=S("chapter"),d=new Date().toISOString(),u={id:c,arcId:a,title:r,body:"",assets:[],soundtracks:[],createdAt:d,updatedAt:d};await C(p(t,"chapters",c),u);const h=$(i);return h.phases.length||(h.phases=[V()]),h.phases[0].chapterIds.push(c),await f(s,{chapterIds:[...i.chapterIds??[],c],phases:h.phases,updatedAt:d}),await f(p(t,"stories",i.storyId),{updatedAt:d}),u},async updateChapter(a,r){const s=p(t,"chapters",a),o=new Date().toISOString();await f(s,{...r,updatedAt:o});const i=await g(s),c=w(i);if(c?.arcId){const d=await g(p(t,"arcs",c.arcId)),u=w(d);u&&(await f(p(t,"arcs",u.id),{updatedAt:o}),await f(p(t,"stories",u.storyId),{updatedAt:o}))}return this.getChapter(a)},async updateChapterOrder(a,r){const s=p(t,"arcs",a),o=new Date().toISOString();await f(s,{chapterIds:r,updatedAt:o});const i=await g(s),c=w(i);c?.storyId&&await f(p(t,"stories",c.storyId),{updatedAt:o})},async createPhase(a,r){const s=p(t,"arcs",a),o=await g(s),i=w(o),c=i?$(i):null;if(!c)throw new Error("Arc not found.");const d={id:S("phase"),title:r?.trim()||"New Phase",chapterIds:[]},u=[...c.phases,d],h=new Date().toISOString();return await f(s,{phases:u,chapterIds:x(u),updatedAt:h}),await f(p(t,"stories",c.storyId),{updatedAt:h}),d},async renamePhase(a,r,s){const o=p(t,"arcs",a),i=await g(o),c=w(i),d=c?$(c):null;if(!d)throw new Error("Arc not found.");const u=d.phases.map(v=>v.id===r?{...v,title:s?.trim()||B}:v),h=new Date().toISOString();return await f(o,{phases:u,updatedAt:h}),await f(p(t,"stories",d.storyId),{updatedAt:h}),u.find(v=>v.id===r)},async moveChapterToPhase(a,r,s){const o=p(t,"arcs",a),i=await g(o),c=w(i),d=c?$(c):null;if(!d)throw new Error("Arc not found.");const u=d.phases.map(O=>({...O,chapterIds:(O.chapterIds??[]).filter(Z=>Z!==r)})),h=u.find(O=>O.id===s);if(!h)throw new Error("Phase not found.");h.chapterIds.push(r);const v=new Date().toISOString();await f(o,{phases:u,chapterIds:x(u),updatedAt:v}),await f(p(t,"stories",d.storyId),{updatedAt:v})},async reorderPhaseChapters(a,r,s){const o=p(t,"arcs",a),i=await g(o),c=w(i),d=c?$(c):null;if(!d)throw new Error("Arc not found.");const u=d.phases.map(v=>v.id===r?{...v,chapterIds:[...s]}:v),h=new Date().toISOString();await f(o,{phases:u,chapterIds:x(u),updatedAt:h}),await f(p(t,"stories",d.storyId),{updatedAt:h})},async deleteChapter(a){const r=await g(p(t,"chapters",a)),s=w(r);if(!s)return;const o=p(t,"arcs",s.arcId),i=await g(o),c=w(i),d=new Date().toISOString();c&&(await f(o,{chapterIds:(c.chapterIds??[]).filter(u=>u!==a),phases:(c.phases??[]).map(u=>({...u,chapterIds:(u.chapterIds??[]).filter(h=>h!==a)})),updatedAt:d}),await f(p(t,"stories",c.storyId),{updatedAt:d})),await q(p(t,"chapters",a))},async deleteArc(a){const r=await g(p(t,"arcs",a)),s=w(r);if(!s)return;for(const d of s.chapterIds??[])await q(p(t,"chapters",d));const o=p(t,"stories",s.storyId),i=await g(o),c=w(i);c&&await f(o,{arcIds:(c.arcIds??[]).filter(d=>d!==a),updatedAt:new Date().toISOString()}),await q(p(t,"arcs",a))},async deleteStory(a){const r=await et(t,a);if(r){for(const s of r.arcs??[]){for(const o of s.chapters??[])await q(p(t,"chapters",o.id));await q(p(t,"arcs",s.id))}await q(p(t,"stories",a))}},async seedDemoStory(a){if(!a?.id)return;if(!(await D(U(L(t,"stories"),R("creatorId","==",a.id),Lt(1)))).empty){await at(t,a);return}const s=S("story"),o=S("arc"),i=S("chapter"),c=new Date().toISOString();await C(p(t,"stories",s),{id:s,title:"Your First Story",tags:["draft"],visibility:"private",creatorId:a.id,creatorName:a.name??"Creator",arcIds:[o],createdAt:c,updatedAt:c}),await C(p(t,"arcs",o),{id:o,storyId:s,title:"Opening Arc",chapterIds:[i],phases:[{id:S("phase"),title:B,chapterIds:[i]}],createdAt:c,updatedAt:c}),await C(p(t,"chapters",i),{id:i,arcId:o,title:"Chapter One",body:`# Welcome

This story is now stored in Firestore.`,assets:[],createdAt:c,updatedAt:c}),await at(t,a)}}}async function Yt(e){return e?.mode==="firebase"&&e.db?Jt(e):Gt()}const Kt={VITE_APP_MODE:"firebase",VITE_FIREBASE_API_KEY:"AIzaSyC8-b4_lzrCk2RhsqSEMkcxNKgMzVx_WJ4",VITE_FIREBASE_APP_ID:"1:309677315541:web:ef90a15da4ee29c03fd95c",VITE_FIREBASE_AUTH_DOMAIN:"ulunavir-tales.firebaseapp.com",VITE_FIREBASE_MESSAGING_SENDER_ID:"309677315541",VITE_FIREBASE_PROJECT_ID:"ulunavir-tales",VITE_FIREBASE_STORAGE_BUCKET:"ulunavir-tales.firebasestorage.app"},ot={mode:"local",firebase:{apiKey:"",authDomain:"",projectId:"",appId:"",storageBucket:"",messagingSenderId:""}};function Ht(){const e=Kt??{};return{mode:e.VITE_APP_MODE??ot.mode,firebase:{apiKey:e.VITE_FIREBASE_API_KEY??"",authDomain:e.VITE_FIREBASE_AUTH_DOMAIN??"",projectId:e.VITE_FIREBASE_PROJECT_ID??"",appId:e.VITE_FIREBASE_APP_ID??"",storageBucket:e.VITE_FIREBASE_STORAGE_BUCKET??"",messagingSenderId:e.VITE_FIREBASE_MESSAGING_SENDER_ID??""}}}function St(){const e=globalThis.STORYFORGE_CONFIG??{},t=Ht();return{...ot,...t,...e,firebase:{...ot.firebase,...t.firebase,...e.firebase??{}}}}function Qt(e){return e.mode==="firebase"&&!!(e.firebase.projectId&&e.firebase.apiKey&&e.firebase.appId)}function Zt(){const e=St();if(!Qt(e))return{mode:"local",auth:null,db:null,signIn:async()=>null,signOut:async()=>null,watchAuth:o=>(o(null),()=>{})};const t=qt().length?_t():xt(e.firebase),a=Bt(t),r=Ft(t),s=new Vt;return{mode:"firebase",auth:a,db:r,signIn:async()=>(await zt(a,s)).user,signOut:async()=>jt(a),watchAuth:o=>Mt(a,o)}}function Wt(){return St()}const nt=document.querySelector("#app"),n={adapter:null,authClient:null,currentUser:JSON.parse(localStorage.getItem("storyforge-session")??"null"),route:{name:"home",params:{}},dragActive:!1,saveStatus:"",authError:"",soundtrack:{arcId:"",queue:[],currentIndex:0,paused:!0,mode:"idle",ready:!1,autoplayAttempted:!1,activeKey:"",spotifyFinishedTrack:"",youtubePlayer:null,spotifyController:null,syncToken:0}},It="storyforge-soundtrack-state";function Xt(){try{const e=localStorage.getItem(It);return e?JSON.parse(e):{}}catch{return{}}}function kt(){const{arcId:e,currentIndex:t,paused:a}=n.soundtrack;localStorage.setItem(It,JSON.stringify({arcId:e,currentIndex:t,paused:a}))}function $t(e=I()){return e?e.penName?.trim()||e.name||"Creator":"Guest"}function At(e=I()){return e?.structureView==="grid"?"grid":"list"}function A(e){n.currentUser=e,localStorage.setItem("storyforge-session",JSON.stringify(e))}function k(e){const t=`#${e}`;if(window.location.hash===t){m(),window.scrollTo({top:0,left:0,behavior:"auto"});return}window.location.hash=e}function te(){const e=window.location.hash.replace(/^#/,"")||"/",[t]=e.split("?"),a=t.split("/").filter(Boolean);return a.length===0?{name:"home",params:{}}:a[0]==="creator"?{name:"creator",params:{}}:a[0]==="browser"?{name:"browser",params:{}}:a[0]==="settings"?{name:"settings",params:{}}:a[0]==="stories"&&a[1]?a[2]==="arcs"&&a[3]&&a[4]==="chapters"&&a[5]?{name:"chapter",params:{storyId:a[1],arcId:a[3],chapterId:a[5]}}:a[2]==="arcs"&&a[3]?{name:"arc",params:{storyId:a[1],arcId:a[3]}}:{name:"story",params:{storyId:a[1]}}:{name:"not-found",params:{}}}function M(){return new URLSearchParams(window.location.hash.split("?")[1]??"")}function I(){return n.currentUser?n.currentUser:n.authClient?.mode==="firebase"?null:{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",mode:"demo",structureView:"list"}}function dt(e){return!!(e?.creatorId&&I()?.id&&e.creatorId===I().id)}function l(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function it(e){return`${e}-${crypto.randomUUID().slice(0,8)}`}function ft(e,t="Soundtrack"){return e?.trim()||t}function ee(e){try{const t=new URL(e);if(t.hostname==="youtu.be")return t.pathname.replace(/\//g,"")||null;if(t.hostname.includes("youtube.com")){if(t.pathname==="/watch")return t.searchParams.get("v");const a=t.pathname.split("/").filter(Boolean);if(["embed","shorts","live"].includes(a[0]))return a[1]??null}}catch{return null}return null}function ae(e){try{const t=new URL(e);if(!t.hostname.includes("spotify.com"))return null;const a=t.pathname.split("/").filter(Boolean);if(a[0]!=="track"&&a[0]!=="album"&&a[0]!=="playlist"&&a[0]!=="episode")return null;const r=a[1]?.split("?")[0];return r?{kind:a[0],uri:`spotify:${a[0]}:${r}`}:null}catch{return null}}function Ct(e){const t=e?.url?.trim(),a=t&&!/^https?:\/\//i.test(t)?`https://${t}`:t;if(!a)return null;const r=ee(a);if(r)return{id:e.id??it("soundtrack"),label:ft(e.label,"YouTube track"),url:a,source:"youtube",videoId:r};const s=ae(a);return s?{id:e.id??it("soundtrack"),label:ft(e.label,`Spotify ${s.kind}`),url:a,source:"spotify",uri:s.uri,spotifyKind:s.kind}:null}function re(e=[]){return e.map(Ct).filter(Boolean)}function Et(){let e=document.querySelector("#soundtrack-layer");return e||(e=document.createElement("div"),e.id="soundtrack-layer",e.innerHTML=`
    <div id="youtube-soundtrack-host"></div>
    <div id="spotify-soundtrack-host"></div>
  `,document.body.append(e),e)}function Pt(e,t){return t()?Promise.resolve():new Promise((a,r)=>{const s=[...document.querySelectorAll("script")].find(i=>i.src===e);if(s){s.addEventListener("load",()=>a(),{once:!0}),s.addEventListener("error",()=>r(new Error(`Failed to load ${e}`)),{once:!0});return}const o=document.createElement("script");o.src=e,o.async=!0,o.addEventListener("load",()=>a(),{once:!0}),o.addEventListener("error",()=>r(new Error(`Failed to load ${e}`)),{once:!0}),document.head.append(o)})}function F(){const e=n.soundtrack.queue??[];if(!e.length)return null;const t=Math.max(0,Math.min(n.soundtrack.currentIndex,e.length-1));return e[t]??null}function j(){const e=document.querySelector("[data-action='toggle-soundtrack']");if(!e)return;const t=F();e.disabled=!t,e.classList.toggle("is-active",!!t&&!n.soundtrack.paused),e.setAttribute("aria-pressed",String(!!t&&!n.soundtrack.paused)),e.setAttribute("title",t?`${n.soundtrack.paused?"Resume":"Pause"} ${t.label}`:"No soundtrack available")}function P(){kt(),j()}function Tt(){const e=document.querySelector("#soundtrack-status");e&&(e.textContent="No soundtrack loaded."),j()}function z(e){const t=document.querySelector("#soundtrack-status");t&&(t.textContent=e)}function Nt(){const e=F();n.soundtrack.mode==="youtube"&&n.soundtrack.youtubePlayer?.pauseVideo&&n.soundtrack.youtubePlayer.pauseVideo(),n.soundtrack.mode==="spotify"&&n.soundtrack.spotifyController?.pause&&n.soundtrack.spotifyController.pause(),n.soundtrack.paused=!0,e&&z(`Paused: ${e.label}`),P()}function se(){const e=F();e&&(n.soundtrack.mode==="youtube"&&n.soundtrack.youtubePlayer?.playVideo&&n.soundtrack.youtubePlayer.playVideo(),n.soundtrack.mode==="spotify"&&n.soundtrack.spotifyController?.play&&n.soundtrack.spotifyController.play(),n.soundtrack.paused=!1,z(`Now playing: ${e.label}`),P())}function Ot(){n.soundtrack.queue.length&&(n.soundtrack.currentIndex=(n.soundtrack.currentIndex+1)%n.soundtrack.queue.length,n.soundtrack.spotifyFinishedTrack="",n.soundtrack.activeKey="",n.soundtrack.ready=!1,n.soundtrack.autoplayAttempted=!1,P(),Dt())}async function oe(e,t){await Pt("https://www.youtube.com/iframe_api",()=>!!window.YT?.Player),t===n.soundtrack.syncToken&&(Et(),n.soundtrack.youtubePlayer?n.soundtrack.youtubePlayer.loadVideoById(e.videoId):await new Promise(a=>{const r=()=>{n.soundtrack.youtubePlayer=new window.YT.Player("youtube-soundtrack-host",{height:"200",width:"320",videoId:e.videoId,playerVars:{autoplay:1,controls:1,rel:0},events:{onReady:()=>a(),onStateChange:s=>{if(s.data===window.YT.PlayerState.ENDED){Ot();return}s.data===window.YT.PlayerState.PLAYING&&(n.soundtrack.paused=!1,P()),s.data===window.YT.PlayerState.PAUSED&&(n.soundtrack.paused=!0,P())}}})};if(window.YT?.Player)r();else{const s=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{s?.(),r()}}}),t===n.soundtrack.syncToken&&(n.soundtrack.mode="youtube",n.soundtrack.ready=!0,n.soundtrack.activeKey=e.id,z(`Now playing: ${e.label}`),n.soundtrack.paused||n.soundtrack.youtubePlayer.playVideo(),j()))}async function ne(e,t){await Pt("https://open.spotify.com/embed/iframe-api/v1",()=>!!(window.SpotifyIframeApi||window.onSpotifyIframeApiReady)),t===n.soundtrack.syncToken&&(Et(),n.soundtrack.spotifyController?n.soundtrack.spotifyController.loadUri&&n.soundtrack.spotifyController.loadUri(e.uri):await new Promise(a=>{const r=s=>{s.createController(document.querySelector("#spotify-soundtrack-host"),{uri:e.uri,width:320,height:160},o=>{n.soundtrack.spotifyController=o,o.addListener("ready",()=>a()),o.addListener("playback_started",()=>{n.soundtrack.paused=!1,P()}),o.addListener("playback_update",i=>{const c=i.data??{};n.soundtrack.paused=!!c.isPaused,P(),!c.isPaused&&c.duration>0&&c.position>=c.duration-1e3&&n.soundtrack.spotifyFinishedTrack!==e.id&&(n.soundtrack.spotifyFinishedTrack=e.id,Ot())})})};window.SpotifyIframeApi?.createController?r(window.SpotifyIframeApi):window.onSpotifyIframeApiReady=s=>{window.SpotifyIframeApi=s,r(s)}}),t===n.soundtrack.syncToken&&(n.soundtrack.mode="spotify",n.soundtrack.ready=!0,n.soundtrack.activeKey=e.id,n.soundtrack.spotifyFinishedTrack="",z(`Now playing: ${e.label}`),!n.soundtrack.paused&&n.soundtrack.spotifyController?.play&&n.soundtrack.spotifyController.play(),j()))}async function Dt(){const e=++n.soundtrack.syncToken,t=F();if(!t){n.soundtrack.arcId="",n.soundtrack.queue=[],n.soundtrack.mode="idle",n.soundtrack.ready=!1,n.soundtrack.activeKey="",Nt(),Tt();return}try{if(t.source==="youtube"){await oe(t,e);return}if(t.source==="spotify"){await ne(t,e);return}}catch(a){n.saveStatus=`Soundtrack error: ${String(a.message||a)}`,z("Soundtrack could not be loaded."),j()}}function ie(e,t){const a=Xt(),r=e!==n.soundtrack.arcId||JSON.stringify(t.map(s=>s.id))!==JSON.stringify((n.soundtrack.queue??[]).map(s=>s.id));n.soundtrack.arcId=e,n.soundtrack.queue=t,r&&(n.soundtrack.currentIndex=a.arcId===e&&typeof a.currentIndex=="number"?Math.max(0,Math.min(a.currentIndex,t.length-1)):0,n.soundtrack.paused=a.arcId===e?!!a.paused:!1,n.soundtrack.ready=!1,n.soundtrack.activeKey="",n.soundtrack.spotifyFinishedTrack=""),P(),Dt()}function E(){n.soundtrack.arcId="",n.soundtrack.queue=[],n.soundtrack.currentIndex=0,n.soundtrack.paused=!0,n.soundtrack.activeKey="",n.soundtrack.ready=!1,n.soundtrack.spotifyFinishedTrack="",n.soundtrack.youtubePlayer?.pauseVideo&&n.soundtrack.youtubePlayer.pauseVideo(),n.soundtrack.spotifyController?.pause&&n.soundtrack.spotifyController.pause(),Tt(),kt()}function ct(e){return l(e).replace(/```([\s\S]*?)```/g,(u,h)=>`<pre><code>${h.trim()}</code></pre>`).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<p><img alt="$1" src="$2" /></p>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/(?:^|\n)- (.*(?:\n- .*)*)/g,u=>`
<ul>${u.trim().split(`
`).map(v=>v.replace(/^- /,"").trim()).map(v=>`<li>${v}</li>`).join("")}</ul>`).split(/\n{2,}/).map(u=>/^<(h\d|ul|pre|p)/.test(u.trim())?u:`<p>${u.replace(/\n/g,"<br />")}</p>`).join("")}function ut(e){return new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short"}).format(new Date(e))}function ce(e,t,a){if(!t)return e;const r=t.toLowerCase();return e.filter(s=>a(s).toLowerCase().includes(r))}function de(e){return[...new Set(e.flatMap(t=>t.tags))].sort((t,a)=>t.localeCompare(a))}function ue(e=""){return`
    <aside class="quick-tools">
      <div class="quick-tools-frame">
        <div class="quick-tools-label">Quick Tools</div>
        <div class="quick-tools-body">
          ${e||'<div class="quick-tools-empty">No tools</div>'}
        </div>
      </div>
    </aside>
  `}function N(e,t,a=""){const r=I(),s=n.authError?`<div class="notice"><strong>Sign-in error</strong><div class="muted">${l(n.authError)}</div></div>`:"";nt.innerHTML=`
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
            ${rt("/","Main Menu",t==="home")}
            ${rt("/creator","Creator",t==="creator")}
            ${rt("/browser","Browser",t==="browser")}
          </nav>
        </div>
        <div class="stack">
          <button class="notice account-card" data-action="open-settings" ${r?"":"disabled"}>
            <strong>${l($t(r))}</strong>
            <div class="muted">${l(r?.email??(n.authClient?.mode==="firebase"?"Sign in to create and manage stories":"Local demo mode"))}</div>
          </button>
          <button class="login-button" data-action="toggle-login">
            ${n.currentUser?"Log out":"Log in"}
          </button>
        </div>
      </aside>
      <main class="content">${e}</main>
      ${ue(a)}
    </div>
  `,s&&nt.querySelector(".content").insertAdjacentHTML("afterbegin",s)}async function le(){const e=I();if(!e)return T("Sign in to manage account settings.");N(`
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
            <div class="muted">${l(e.name??"Creator")}</div>
          </div>
          <div class="inline-form settings-form">
            <input id="pen-name-input" placeholder="${l(e.name??"Creator")}" value="${l(e.penName??"")}" />
            <button class="ghost-button" data-action="save-pen-name">Save pen name</button>
          </div>
          <div class="muted">
            Leave it empty to fall back to your account name.
          </div>
        </section>
      </div>
    `,"home")}function rt(e,t,a){return`<a class="nav-link ${a?"is-active":""}" href="#${e}"><span>${t}</span></a>`}function pe(){return`
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
  `}async function he(){N(`
      <div class="stack">
        ${pe()}
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
    `,"home")}async function fe(){const e=I(),t=await n.adapter.listCreatorStories(e?.id),a=M(),r=a.get("q")??"",s=a.get("tag")??"",o=ce(t,r,d=>`${d.title} ${d.tags.join(" ")}`).filter(d=>s?d.tags.includes(s):!0),i=de(t),c=n.authClient?.mode==="firebase"&&!e?'<div class="notice">Sign in with Firebase to create, edit, and manage your own stories.</div>':"";N(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Creator</h2>
            <p class="muted">Manage your stories, search by title, and filter by tags.</p>
          </div>
          <button class="primary-button" data-action="create-story" ${e?"":"disabled"}>Create</button>
        </div>
        ${c}
        <section class="panel stack">
          <div class="search-row">
            <input id="story-search" placeholder="Search by story title or tag" value="${l(r)}" />
            <select id="story-tag-filter">
              <option value="">All tags</option>
              ${i.map(d=>`<option value="${l(d)}" ${s===d?"selected":""}>${l(d)}</option>`).join("")}
            </select>
            <button class="ghost-button" data-action="apply-story-filters">Filter</button>
          </div>
          <div class="chip-row">
            ${i.map(d=>`<a class="pill" href="#/creator?tag=${encodeURIComponent(d)}">${l(d)}</a>`).join("")}
          </div>
        </section>
        <section class="story-list">
          ${o.length?o.map(me).join(""):'<div class="empty-state">No stories match this filter yet.</div>'}
        </section>
      </div>
    `,"creator")}function me(e){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${l(e.title)}</h3>
          <p class="muted">Updated ${ut(e.updatedAt)}</p>
        </div>
        <span class="status-pill">${l(e.visibility)}</span>
      </div>
      <div class="chip-row">
        ${e.tags.map(t=>`<span class="pill">${l(t)}</span>`).join("")}
      </div>
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${e.id}">Open story</a>
        <span class="pill">${e.arcs.length} arc(s)</span>
        <button class="danger-button" data-action="delete-story" data-story-id="${e.id}">Delete</button>
      </div>
    </article>
  `}async function ye(){const e=await n.adapter.listBrowserStories(I()?.id),t=M(),a=t.get("group")!=="flat",r=t.get("creator")??"",s=r?e.filter(c=>c.creatorName===r):e,o=[...new Set(e.map(c=>c.creatorName))];let i="";s.length?a?i=o.filter(c=>!r||c===r).map(c=>{const d=s.filter(u=>u.creatorName===c);return d.length?`
          <section class="panel stack">
            <div class="section-header">
              <h3>${l(c)}</h3>
              <span class="pill">${d.length} public stories</span>
            </div>
            <div class="story-list">${d.map(mt).join("")}</div>
          </section>
        `:""}).join(""):i=`<section class="story-list">${s.map(mt).join("")}</section>`:i='<div class="empty-state">No public stories are available yet.</div>',N(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Browser</h2>
            <p class="muted">Explore public stories and browse them by creator.</p>
          </div>
          <div class="toolbar">
            <select id="browser-creator-filter">
              <option value="">All creators</option>
              ${o.map(c=>`<option value="${l(c)}" ${r===c?"selected":""}>${l(c)}</option>`).join("")}
            </select>
            <select id="browser-group-mode">
              <option value="grouped" ${a?"selected":""}>Grouped by creator</option>
              <option value="flat" ${a?"":"selected"}>Flat list</option>
            </select>
            <button class="ghost-button" data-action="apply-browser-filters">Apply</button>
          </div>
        </div>
        ${i}
      </div>
    `,"browser")}function mt(e){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${l(e.title)}</h3>
          <p class="muted">by ${l(e.creatorName)}</p>
        </div>
        <span class="pill">${e.arcs.length} arc(s)</span>
      </div>
      <div class="chip-row">
        ${e.tags.map(t=>`<span class="pill">${l(t)}</span>`).join("")}
      </div>
      <a class="primary-button" href="#/stories/${e.id}?view=browser">Read structure</a>
    </article>
  `}async function ve(e){const t=await n.adapter.getStory(e);if(!t)return T("Story not found.");const a=dt(t),r=M().get("view")==="browser",s=At();if(t.visibility==="private"&&!a)return T("This story is private.");N(`
      <div class="stack">
        ${lt([[r?"#/browser":"#/creator",r?"Browser":"Creator"],["",t.title]])}
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
            ${r&&a?'<a class="ghost-button" href="#/stories/'+t.id+'">Edit</a>':""}
            ${a&&!r?'<button class="primary-button" data-action="create-arc" data-story-id="'+t.id+'">New arc</button>':""}
          </div>
        </div>
        <section class="panel stack">
          <div class="inline-form">
            <input id="story-title-input" value="${l(t.title)}" ${a?"":"disabled"} />
            <input id="story-tags-input" value="${l(t.tags.join(", "))}" ${a?"":"disabled"} />
            <select id="story-visibility-input" ${a?"":"disabled"}>
              ${["public","unlisted","private"].map(o=>`<option value="${o}" ${t.visibility===o?"selected":""}>${o}</option>`).join("")}
            </select>
            ${a?'<button class="ghost-button" data-action="save-story-settings" data-story-id="'+t.id+'">Save</button>':""}
          </div>
          <div class="notice">
            <strong>${l(t.creatorName)}</strong>
            <div class="muted">Created ${ut(t.createdAt)}. Visibility is currently ${l(t.visibility)}.</div>
          </div>
        </section>
        <section class="nested-list ${s==="list"?"is-list-view":""}">
          ${t.arcs.length?t.arcs.map((o,i)=>ge(o,t,a,i,r)).join(""):'<div class="empty-state">No arcs yet. Create the first arc to start structuring this story.</div>'}
        </section>
      </div>
    `,r?"browser":a?"creator":"browser")}function ge(e,t,a,r,s=!1){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${l(e.title)}</h3>
          <p class="muted">${e.chapters.length} chapter(s)</p>
        </div>
        ${a?`
          <div class="order-buttons">
            <button class="small-button" data-action="move-arc-up" data-story-id="${t.id}" data-index="${r}" ${r===0?"disabled":""}>↑</button>
            <button class="small-button" data-action="move-arc-down" data-story-id="${t.id}" data-index="${r}" ${r===t.arcs.length-1?"disabled":""}>↓</button>
          </div>`:""}
      </div>
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${t.id}/arcs/${e.id}${s?"?view=browser":""}">Open arc</a>
        ${a&&!s?`<button class="danger-button" data-action="delete-arc" data-story-id="${t.id}" data-arc-id="${e.id}">Delete</button>`:""}
      </div>
    </article>
  `}function we(e,t,a=!1,r=""){return`
    <div class="phase-separator">
      <span class="phase-line"></span>
      ${t&&!a?`<button class="phase-title" data-action="rename-phase" data-arc-id="${r}" data-phase-id="${e.id}" data-phase-title="${l(e.title)}">${l(e.title)}</button>`:`<span class="phase-title">${l(e.title)}</span>`}
      <span class="phase-line"></span>
    </div>
  `}function be(e){const t=e.soundtracks??[];return`
    <section class="panel stack">
      <div class="section-header">
        <div>
          <h3>Soundtracks</h3>
          <p class="muted">Add YouTube or Spotify links that should play only for this chapter.</p>
        </div>
        <span class="pill">${t.length} track(s)</span>
      </div>
      <div class="inline-form soundtrack-form">
        <input id="soundtrack-label-input" placeholder="Optional label, for example Tavern Theme" />
        <input id="soundtrack-url-input" placeholder="https://youtube.com/... or https://open.spotify.com/..." />
        <button class="ghost-button" data-action="add-soundtrack" data-chapter-id="${e.id}">Add soundtrack</button>
      </div>
      <div class="soundtrack-list">
        ${t.length?t.map(a=>`
                <article class="soundtrack-item">
                  <div>
                    <strong>${l(a.label?.trim()||"Untitled soundtrack")}</strong>
                    <div class="muted mono">${l(a.url??"")}</div>
                  </div>
                  <button class="danger-button" data-action="delete-soundtrack" data-chapter-id="${e.id}" data-soundtrack-id="${a.id}">Remove</button>
                </article>
              `).join(""):'<div class="empty-state">No soundtrack links yet.</div>'}
      </div>
    </section>
  `}function Se(e){if(!e.length)return"";const t=F();return`
    <div class="quick-tool-stack">
      <button
        class="quick-tool-button ${t&&!n.soundtrack.paused?"is-active":""}"
        data-action="toggle-soundtrack"
        aria-pressed="${String(!!t&&!n.soundtrack.paused)}"
        title="${l(t?`${n.soundtrack.paused?"Resume":"Pause"} ${t.label}`:"No soundtrack available")}"
      >
        <span class="quick-tool-icon">♪</span>
      </button>
      <div class="quick-tool-caption">Music</div>
      <div id="soundtrack-status" class="quick-tool-status">${l(t?`${n.soundtrack.paused?"Paused":"Now playing"}: ${t.label}`:"No soundtrack loaded.")}</div>
    </div>
  `}async function Ie(e,t){const[a,r]=await Promise.all([n.adapter.getStory(e),n.adapter.getArc(t)]);if(!a||!r)return T("Arc not found.");const s=dt(a),o=M().get("view")==="browser",i=At();if(a.visibility==="private"&&!s)return T("This story is private.");const c=(r.phases??[]).map(d=>`
    <section class="phase-block stack">
      ${we(d,s,o,r.id)}
      <div class="nested-list ${i==="list"?"is-list-view":""}">
        ${d.chapters.length?d.chapters.map((u,h)=>ke(u,a,r,s,h,o,d)).join(""):'<div class="empty-state">No chapters in this phase yet.</div>'}
      </div>
    </section>
  `).join("");N(`
      <div class="stack">
        ${lt([[o?"#/browser":s?"#/creator":"#/browser",o?"Browser":s?"Creator":"Browser"],["#/stories/"+a.id+(o?"?view=browser":""),a.title],["",r.title]])}
        <div class="page-title">
          <div>
            <h2>${l(r.title)}</h2>
            <p class="muted">Manage the chapter list and reading order for this arc.</p>
          </div>
          <div class="card-actions">
            <div class="view-toggle" role="group" aria-label="Structure view">
              <button class="ghost-button ${i==="grid"?"is-active":""}" data-action="set-structure-view" data-view="grid">Compact Grid</button>
              <button class="ghost-button ${i==="list"?"is-active":""}" data-action="set-structure-view" data-view="list">List</button>
            </div>
            ${o&&s?'<a class="ghost-button" href="#/stories/'+a.id+"/arcs/"+r.id+'">Edit</a>':""}
            ${s&&!o?'<button class="ghost-button" data-action="create-phase" data-arc-id="'+r.id+'">New phase</button>':""}
            ${s&&!o?'<button class="primary-button" data-action="create-chapter" data-arc-id="'+r.id+'" data-story-id="'+a.id+'">New chapter</button>':""}
          </div>
        </div>
        ${s&&!o?`
          <section class="panel">
            <div class="inline-form">
              <input id="arc-title-input" value="${l(r.title)}" />
              <button class="ghost-button" data-action="save-arc-title" data-arc-id="${r.id}" data-story-id="${a.id}">Rename arc</button>
            </div>
        </section>`:""}
        ${c||'<div class="empty-state">No chapters yet. Add one to begin writing.</div>'}
      </div>
    `,o?"browser":s?"creator":"browser")}function ke(e,t,a,r,s,o=!1,i=null){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${l(e.title||"Untitled chapter")}</h3>
          <p class="muted">Updated ${ut(e.updatedAt)}</p>
        </div>
        ${r&&!o?`
          <div class="order-buttons">
            <button class="small-button" data-action="move-chapter-up" data-arc-id="${a.id}" data-phase-id="${i?.id??""}" data-index="${s}" ${s===0?"disabled":""}>↑</button>
            <button class="small-button" data-action="move-chapter-down" data-arc-id="${a.id}" data-phase-id="${i?.id??""}" data-index="${s}" ${i&&s===i.chapters.length-1?"disabled":""}>↓</button>
          </div>`:""}
      </div>
      ${r&&!o?`<select class="phase-select" data-action="move-chapter-phase" data-arc-id="${a.id}" data-chapter-id="${e.id}">
              ${(a.phases??[]).map(c=>`<option value="${c.id}" ${c.id===i?.id?"selected":""}>${l(c.title)}</option>`).join("")}
            </select>`:""}
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${t.id}/arcs/${a.id}/chapters/${e.id}${o?"?view=browser":""}">Open chapter</a>
        ${r&&!o?`<button class="danger-button" data-action="delete-chapter" data-story-id="${t.id}" data-arc-id="${a.id}" data-chapter-id="${e.id}">Delete</button>`:""}
      </div>
    </article>
  `}function yt(e,t,a,r,s=!1){return!a&&!r?"":`
    <div class="chapter-pager">
      ${a?`<a class="ghost-button" href="#/stories/${e}/arcs/${t}/chapters/${a.id}${s?"?view=browser":""}">Previous Chapter</a>`:""}
      ${r?`<a class="ghost-button" href="#/stories/${e}/arcs/${t}/chapters/${r.id}${s?"?view=browser":""}">Next Chapter</a>`:""}
    </div>
  `}async function $e(e,t,a){const[r,s,o]=await Promise.all([n.adapter.getStory(e),n.adapter.getArc(t),n.adapter.getChapter(a)]);if(!r||!s||!o)return T("Chapter not found.");const i=dt(r),c=M().get("view")==="browser";if(r.visibility==="private"&&!i)return T("This story is private.");const d=o.assets??[],u=c?re(o.soundtracks??[]):[],h=(s.chapters??[]).findIndex(Rt=>Rt.id===a),v=h>0?s.chapters[h-1]:null,O=h>=0&&h<s.chapters.length-1?s.chapters[h+1]:null,Z=yt(r.id,s.id,v,O,c),pt=yt(r.id,s.id,v,O,c),Ut=i&&!c?`
        <div class="editor-shell">
          <section class="editor-pane">
            <div class="editor-controls">
              <input id="chapter-title-input" value="${l(o.title)}" ${i?"":"disabled"} />
              <textarea id="chapter-body-input" class="markdown-area" ${i?"":"disabled"}>${l(o.body)}</textarea>
              ${pt}
              ${i?`
                <div class="panel asset-helper">
                  <div class="section-header">
                    <h3>Image link helper</h3>
                    <span class="pill">Manual Imgur or external URLs</span>
                  </div>
                  <div class="inline-form asset-form">
                    <input id="asset-name-input" placeholder="Image label, for example cover-art" />
                    <input id="asset-url-input" placeholder="https://i.imgur.com/your-image.jpg" />
                    <button class="ghost-button" data-action="add-external-asset" data-chapter-id="${o.id}">Add image</button>
                  </div>
                  <div class="notice">
                    Upload the image to Imgur first, then paste the direct image URL here. This will save the link on the chapter and append the markdown automatically.
                  </div>
                </div>
              `:""}
              <div class="asset-list">
                ${d.length?d.map(vt).join(""):'<div class="empty-state">No assets in this chapter yet.</div>'}
              </div>
              ${be(o)}
              <div class="notice mono">${l(n.saveStatus||"Tip: use `![alt](image-url)` to place pasted external images into the chapter body.")}</div>
            </div>
          </section>
          <section class="preview-pane">
            <h3>Preview</h3>
            <div class="markdown-preview">${ct(o.body||"*Start writing to preview your chapter here.*")}</div>
          </section>
        </div>
      `:`
        <section class="panel stack">
          <div class="section-header">
            <h3>Reading view</h3>
            <span class="pill">${d.length} asset(s)</span>
          </div>
          <div class="markdown-preview">${ct(o.body||"*This chapter is empty.*")}</div>
        </section>
        ${pt}
        ${d.length?`<section class="panel stack"><h3>Referenced images</h3><div class="asset-list">${d.map(vt).join("")}</div></section>`:""}
      `;N(`
      <div class="stack">
        ${lt([[c?"#/browser":i?"#/creator":"#/browser",c?"Browser":i?"Creator":"Browser"],["#/stories/"+r.id+(c?"?view=browser":""),r.title],["#/stories/"+r.id+"/arcs/"+s.id+(c?"?view=browser":""),s.title],["",o.title||"Untitled chapter"]])}
        <div class="page-title">
          <div>
            <h2>${l(o.title||"Untitled chapter")}</h2>
            <p class="muted">${i&&!c?"Write in markdown, add image links, and save your draft.":"Read this chapter in a clean, read-only view."}</p>
          </div>
          <div class="card-actions">
            ${c&&i?`<a class="ghost-button" href="#/stories/${r.id}/arcs/${s.id}/chapters/${o.id}">Edit</a>`:""}
            ${i&&!c?`<button class="primary-button" data-action="save-chapter" data-chapter-id="${o.id}">Save</button>`:""}
          </div>
        </div>
        ${Z}
        ${Ut}
      </div>
    `,c?"browser":i?"creator":"browser",Se(u)),c&&u.length?ie(s.id,u):E()}function vt(e){const t=e.url??e.dataUrl??"";return`
    <article class="asset-item">
      ${!!t?`<img src="${t}" alt="${l(e.name)}" />`:""}
      <strong>${l(e.name)}</strong>
      <div class="muted mono">![${l(e.name)}](${t})</div>
    </article>
  `}function T(e){N(`
      <div class="stack">
        <section class="panel">
          <h2>Not found</h2>
          <p class="muted">${l(e)}</p>
        </section>
      </div>
    `,"home")}function lt(e){return`<div class="breadcrumbs">${e.map(([t,a])=>t?`<a href="${t}">${l(a)}</a>`:`<span>${l(a)}</span>`).join("<span>/</span>")}</div>`}async function m(){switch(n.route=te(),n.route.name){case"home":return E(),he();case"creator":return E(),fe();case"browser":return E(),ye();case"settings":return E(),le();case"story":return E(),ve(n.route.params.storyId);case"arc":return E(),Ie(n.route.params.storyId,n.route.params.arcId);case"chapter":return $e(n.route.params.storyId,n.route.params.arcId,n.route.params.chapterId);default:return E(),T("This page does not exist.")}}function Ae(){return{title:document.querySelector("#story-title-input")?.value.trim()??"",tags:(document.querySelector("#story-tags-input")?.value??"").split(",").map(e=>e.trim()).filter(Boolean),visibility:document.querySelector("#story-visibility-input")?.value??"private"}}function gt(e,t,a){const r=[...e],[s]=r.splice(t,1);return r.splice(a,0,s),r}async function wt(){if(n.currentUser)return await n.authClient.signOut(),A(null),n.saveStatus="Signed out.",n.authError="",m();if(n.authClient.mode==="firebase")try{const t=await n.authClient.signIn();return await n.adapter.seedDemoStory?.({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email}),A({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email,mode:"firebase",structureView:"list"}),n.authError="",n.saveStatus="Signed in with Firebase.",m()}catch(t){return console.error("Firebase sign-in failed:",t),n.saveStatus="",n.authError=Ce(t),m()}const e=document.createElement("div");e.className="modal-backdrop",e.innerHTML=`
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
  `,document.body.append(e),e.querySelector("#modal-login-cancel").addEventListener("click",()=>e.remove()),e.querySelector("#modal-login-submit").addEventListener("click",()=>{const t=e.querySelector("#login-name").value.trim()||"Creator",a=e.querySelector("#login-email").value.trim()||"local@storyforge.local";A({id:`local-${t.toLowerCase().replaceAll(/\s+/g,"-")}`,name:t,email:a,mode:"local",structureView:"list"}),e.remove(),n.saveStatus="Signed in with a local demo profile.",n.authError="",m()})}function Ce(e){const t=e?.code?String(e.code):"",a=e?.message?String(e.message):"Unknown sign-in error.";return t==="auth/unauthorized-domain"?"This site domain is not authorized in Firebase Auth. Add your local/dev domain and your GitHub Pages domain in Firebase Console > Authentication > Settings > Authorized domains.":t==="auth/popup-closed-by-user"?"The sign-in popup closed before Firebase completed the login. If it closes instantly every time, double-check Authorized domains and the Google sign-in provider setup.":t==="auth/operation-not-allowed"?"Google sign-in is not enabled for this Firebase project. Enable it in Firebase Console > Authentication > Sign-in method.":t==="auth/invalid-api-key"?"Your Firebase API key is invalid. Recheck the values in your `.env` file and restart the dev server.":t==="auth/network-request-failed"?"Firebase could not complete the sign-in request. Check your connection and any browser privacy extensions blocking popups or auth requests.":t?`${t}: ${a}`:a}async function Ee(e){const t=n.route.params.chapterId,a=await n.adapter.getChapter(t);if(!a)return;const r=[...a.assets??[]];for(const i of e){const c=await Ne(i);r.push({id:crypto.randomUUID(),name:i.name,type:i.type,size:i.size,dataUrl:c})}const s=document.querySelector("#chapter-body-input"),o=r.slice((a.assets??[]).length).map(i=>`
![${i.name}](${i.dataUrl})`).join("");await n.adapter.updateChapter(t,{assets:r,body:`${s.value}${o}`}),n.dragActive=!1,n.saveStatus="Assets added to the chapter. In production these should upload to object storage instead of local state.",await m()}function Pe(e){const t=e.trim();if(!t)throw new Error("Add an image URL first.");let a;try{a=new URL(t)}catch{throw new Error("That image URL is not valid.")}if(!["http:","https:"].includes(a.protocol))throw new Error("Use an http or https image URL.");return a.toString()}async function Te(e){const t=await n.adapter.getChapter(e);if(!t)throw new Error("Chapter not found.");const a=document.querySelector("#asset-name-input"),r=document.querySelector("#asset-url-input"),s=document.querySelector("#chapter-body-input"),o=a?.value.trim()||"image",i=Pe(r?.value??""),c={id:crypto.randomUUID(),name:o,type:"image/external",url:i},d=[...t.assets??[],c],u=`${s?.value??t.body??""}
![${o}](${i})`;await n.adapter.updateChapter(e,{assets:d,body:u}),n.saveStatus="External image link added and markdown updated.",await m()}async function bt(){const e=I();if(!e?.id)return;const t=await n.adapter.getUserProfile?.(e.id);t&&A({...e,name:t.name??e.name,email:t.email??e.email,penName:t.penName??"",structureView:t.structureView??e.structureView??"list"})}function st(e){return window.confirm(`Are you sure you want to delete this ${e}? This cannot be undone.`)}function Ne(e){return new Promise((t,a)=>{const r=new FileReader;r.onload=()=>t(String(r.result)),r.onerror=()=>a(r.error),r.readAsDataURL(e)})}document.addEventListener("click",async e=>{const t=e.target.closest("[data-action]");if(!t)return;const a=t.dataset.action;if(a==="toggle-login")return wt();if(a==="open-settings")return k("/settings");if(a==="set-structure-view"){const r=I(),s=t.dataset.view==="list"?"list":"grid";if(!r?.id)return A({...r,structureView:s}),m();const o=await n.adapter.updateUserProfile(r.id,{name:r.name,email:r.email,penName:r.penName??"",structureView:s});return A({...r,structureView:o.structureView??s,penName:o.penName??r.penName??"",name:o.name??r.name,email:o.email??r.email}),m()}if(a==="apply-story-filters"){const r=document.querySelector("#story-search").value.trim(),s=document.querySelector("#story-tag-filter").value;return k(`/creator${r||s?`?${new URLSearchParams({q:r,tag:s}).toString()}`:""}`)}if(a==="apply-browser-filters"){const r=document.querySelector("#browser-creator-filter").value,s=document.querySelector("#browser-group-mode").value;return k(`/browser?${new URLSearchParams({creator:r,group:s}).toString()}`)}if(a==="create-story"){const r=I();if(!r)return n.saveStatus="Sign in first to create stories in Firebase mode.",wt();const s=await n.adapter.createStory({creatorId:r.id,creatorName:$t(r),title:"Untitled Story",tags:["draft"],visibility:"private"});return k(`/stories/${s.id}`)}if(a==="save-story-settings"){const r=t.dataset.storyId,s=Ae();return await n.adapter.updateStory(r,s),n.saveStatus="Story details saved.",m()}if(a==="create-arc"){const r=t.dataset.storyId,s=await n.adapter.createArc(r,`Arc ${Math.floor(Math.random()*90+10)}`);return k(`/stories/${r}/arcs/${s.id}`)}if(a==="save-arc-title")return await n.adapter.updateArc(t.dataset.arcId,{title:document.querySelector("#arc-title-input").value.trim()||"Untitled Arc"}),n.saveStatus="Arc title saved.",m();if(a==="add-soundtrack"){const r=await n.adapter.getChapter(t.dataset.chapterId),s=document.querySelector("#soundtrack-label-input")?.value.trim()??"",o=document.querySelector("#soundtrack-url-input")?.value.trim()??"",i=Ct({id:it("soundtrack"),label:s,url:o});return i?(await n.adapter.updateChapter(r.id,{soundtracks:[...r.soundtracks??[],{id:i.id,label:i.label,url:i.url}]}),n.saveStatus="Soundtrack added.",m()):(n.saveStatus="Please enter a valid YouTube or Spotify link.",m())}if(a==="delete-soundtrack"){const r=await n.adapter.getChapter(t.dataset.chapterId);return await n.adapter.updateChapter(r.id,{soundtracks:(r.soundtracks??[]).filter(s=>s.id!==t.dataset.soundtrackId)}),n.saveStatus="Soundtrack removed.",m()}if(a==="move-arc-up"||a==="move-arc-down"){const r=await n.adapter.getStory(t.dataset.storyId),s=Number(t.dataset.index),o=a==="move-arc-up"?-1:1;return await n.adapter.reorderArcs(r.id,gt(r.arcIds,s,s+o)),m()}if(a==="create-chapter"){const r=await n.adapter.createChapter(t.dataset.arcId,"Untitled Chapter");return k(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}/chapters/${r.id}`)}if(a==="create-phase"){const r=window.prompt("Phase title","New Phase");return r===null?void 0:(await n.adapter.createPhase(t.dataset.arcId,r),n.saveStatus="Phase created.",m())}if(a==="rename-phase"){const r=window.prompt("Rename phase",t.dataset.phaseTitle||"Phase");return r===null?void 0:(await n.adapter.renamePhase(t.dataset.arcId,t.dataset.phaseId,r),n.saveStatus="Phase renamed.",m())}if(a==="move-chapter-up"||a==="move-chapter-down"){const r=await n.adapter.getArc(t.dataset.arcId),s=(r.phases??[]).find(c=>c.id===t.dataset.phaseId);if(!s)return;const o=Number(t.dataset.index),i=a==="move-chapter-up"?-1:1;return await n.adapter.reorderPhaseChapters(r.id,s.id,gt(s.chapterIds,o,o+i)),m()}if(a==="save-chapter"){const r=t.dataset.chapterId;return await n.adapter.updateChapter(r,{title:document.querySelector("#chapter-title-input").value.trim()||"Untitled Chapter",body:document.querySelector("#chapter-body-input").value}),n.saveStatus="Chapter saved.",m()}if(a==="save-pen-name"){const r=I(),s=document.querySelector("#pen-name-input").value.trim(),o=await n.adapter.updateUserProfile(r.id,{name:r.name,email:r.email,penName:s});return A({...r,penName:o.penName??"",name:o.name??r.name,email:o.email??r.email}),n.saveStatus=s?"Pen name saved.":"Pen name cleared. Account name will be used.",m()}if(a==="delete-story")return st("story")?(await n.adapter.deleteStory(t.dataset.storyId),n.saveStatus="Story deleted.",k("/creator")):void 0;if(a==="delete-arc")return st("arc")?(await n.adapter.deleteArc(t.dataset.arcId),n.saveStatus="Arc deleted.",k(`/stories/${t.dataset.storyId}`)):void 0;if(a==="delete-chapter")return st("chapter")?(await n.adapter.deleteChapter(t.dataset.chapterId),n.saveStatus="Chapter deleted.",k(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}`)):void 0;if(a==="add-external-asset")try{return await Te(t.dataset.chapterId)}catch(r){return n.saveStatus=String(r.message||r),m()}if(a==="toggle-soundtrack"){if(!F())return;n.soundtrack.paused?se():Nt();return}});document.addEventListener("change",async e=>{const t=e.target;if(t instanceof HTMLSelectElement&&t.dataset.action==="move-chapter-phase")return await n.adapter.moveChapterToPhase(t.dataset.arcId,t.dataset.chapterId,t.value),n.saveStatus="Chapter moved to another phase.",m()});document.addEventListener("input",e=>{if(e.target.id==="chapter-body-input"){const t=document.querySelector(".markdown-preview");t&&(t.innerHTML=ct(e.target.value||"*Start writing to preview your chapter here.*"))}if(e.target.id==="chapter-title-input"){const t=e.target.value.trim()||"Untitled chapter",a=document.querySelector(".page-title h2");a&&(a.textContent=t)}});document.addEventListener("dragover",e=>{if(n.route.name!=="chapter")return;e.preventDefault(),n.dragActive=!0;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.add("is-active")});document.addEventListener("dragleave",e=>{if(n.route.name!=="chapter"||e.relatedTarget)return;n.dragActive=!1;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active")});document.addEventListener("drop",async e=>{if(n.route.name!=="chapter")return;e.preventDefault();const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active");const a=[...e.dataTransfer.files].filter(r=>r.type.startsWith("image/"));a.length&&await Ee(a)});window.addEventListener("hashchange",()=>{n.saveStatus="",window.scrollTo({top:0,left:0,behavior:"auto"}),m()});async function Oe(){const e=Zt();n.authClient=e,n.adapter=await Yt(e),n.authClient.mode==="firebase"?n.authClient.watchAuth(t=>{t?(A({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email,mode:"firebase"}),bt().finally(()=>m())):(A(null),m())}):n.currentUser?.id&&await bt(),window.location.hash?m():k("/")}Oe().catch(e=>{nt.innerHTML=`
    <main class="content">
      <section class="panel">
        <h2>App failed to start</h2>
        <p class="muted">${l(String(e.message||e))}</p>
        <p class="muted">Current mode: ${l(Wt().mode)}</p>
      </section>
    </main>
  `});
