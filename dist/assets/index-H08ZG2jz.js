import{g as q,q as U,l as Ut,w as R,c as L,s as E,d as p,a as _,b as g,u as m,e as Rt,f as Lt,i as xt,h as _t,j as Bt,G as Vt,o as Ft,k as Mt,m as jt}from"./firebase-DHuECNiC.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=a(r);fetch(r.href,o)}})();const K="storyforge-state-v1",X="story-demo",Y="arc-demo",G="chapter-demo",F="Chapters",J={users:{"demo-user":{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",penName:""}},stories:{[X]:{id:X,title:"The Clockwork Harbor",tags:["fantasy","mystery","serial"],visibility:"public",creatorId:"demo-user",creatorName:"Demo Creator",arcIds:[Y],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},arcs:{[Y]:{id:Y,storyId:X,title:"Tide One",chapterIds:[G],soundtracks:[],phases:[{id:"phase-demo",title:F,chapterIds:[G]}],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},chapters:{[G]:{id:G,arcId:Y,title:"Lanterns on the Pier",body:`# Opening scene

A storm hangs over the harbor while the first lanterns come alive.`,assets:[],soundtracks:[],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}}};function S(e){return`${e}-${crypto.randomUUID().slice(0,8)}`}function ht(e){return JSON.parse(JSON.stringify(e))}function V(e){return e.flatMap(t=>t.chapterIds??[])}function j(e=[]){return{id:S("phase"),title:F,chapterIds:[...e]}}function k(e){const t=[...e.chapterIds??[]],a=Array.isArray(e.phases)&&e.phases.length?e.phases.map(i=>({id:i.id??S("phase"),title:i.title?.trim()||F,chapterIds:[...i.chapterIds??[]]})):[j(t)],s=new Set;for(const i of a)i.chapterIds=i.chapterIds.filter(c=>!c||s.has(c)?!1:(s.add(c),!0));const r=t.filter(i=>!s.has(i));r.length&&a[0].chapterIds.push(...r);const o=V(a);return{...e,chapterIds:o,soundtracks:e.soundtracks??[],phases:a}}function v(){const e=localStorage.getItem(K);if(!e)return localStorage.setItem(K,JSON.stringify(J)),ht(J);try{return JSON.parse(e)}catch{return localStorage.setItem(K,JSON.stringify(J)),ht(J)}}function b(e){localStorage.setItem(K,JSON.stringify(e))}function tt(e,t){const a=(e.arcIds??[]).map(s=>t.arcs[s]).filter(Boolean).map(s=>H(s,t));return{...e,arcIds:e.arcIds??[],arcs:a}}function H(e,t){const a=k(e),s=a.chapterIds.map(r=>t.chapters[r]).filter(Boolean);return{...a,chapterIds:a.chapterIds??[],chapters:s,phases:a.phases.map(r=>({...r,chapters:r.chapterIds.map(o=>t.chapters[o]).filter(Boolean)}))}}function B(e,t){const a=e.arcs[t];if(!a)return!1;const s=k(a),r=JSON.stringify({chapterIds:a.chapterIds??[],phases:a.phases??[]})!==JSON.stringify({chapterIds:s.chapterIds,phases:s.phases});return r&&(e.arcs[t]={...e.arcs[t],chapterIds:s.chapterIds,phases:s.phases}),r}function zt(){return{mode:"local",async getUserProfile(e){return e?v().users[e]??null:null},async updateUserProfile(e,t){const a=v(),s=a.users[e]??{id:e,name:t.name??"Creator",email:t.email??"",penName:""};a.users[e]={...s,...t};const r=a.users[e].penName?.trim()||a.users[e].name||"Creator";for(const o of Object.values(a.stories))o.creatorId===e&&(o.creatorName=r);return b(a),a.users[e]},async listCreatorStories(e){if(!e)return[];const t=v();return Object.values(t.stories).filter(a=>a.creatorId===e).sort((a,s)=>s.updatedAt.localeCompare(a.updatedAt)).map(a=>({...a,arcs:(a.arcIds??[]).map(s=>({id:s}))}))},async listBrowserStories(){const e=v();return Object.values(e.stories).filter(t=>t.visibility==="public").sort((t,a)=>t.creatorName.localeCompare(a.creatorName)||t.title.localeCompare(a.title)).map(t=>({...t,arcs:(t.arcIds??[]).map(a=>({id:a}))}))},async getStory(e){const t=v();let a=!1;for(const r of t.stories[e]?.arcIds??[])a=B(t,r)||a;a&&b(t);const s=t.stories[e];return s?tt(s,t):null},async getArc(e){const t=v();B(t,e)&&b(t);const s=t.arcs[e];return s?H(s,t):null},async getChapter(e){return v().chapters[e]??null},async createStory({creatorId:e,creatorName:t,title:a,tags:s,visibility:r}){const o=v(),i=S("story"),c=new Date().toISOString();return o.stories[i]={id:i,title:a,tags:s,visibility:r,creatorId:e,creatorName:t,arcIds:[],createdAt:c,updatedAt:c},b(o),tt(o.stories[i],o)},async updateStory(e,t){const a=v();if(!a.stories[e])throw new Error("Story not found.");return a.stories[e]={...a.stories[e],...t,updatedAt:new Date().toISOString()},b(a),tt(a.stories[e],a)},async createArc(e,t){const a=v(),s=a.stories[e];if(!s)throw new Error("Story not found.");const r=S("arc"),o=new Date().toISOString();return a.arcs[r]={id:r,storyId:e,title:t,chapterIds:[],soundtracks:[],phases:[j()],createdAt:o,updatedAt:o},s.arcIds.push(r),s.updatedAt=o,b(a),H(a.arcs[r],a)},async updateArc(e,t){const a=v(),s=a.arcs[e];if(!s)throw new Error("Arc not found.");return s.title=t.title??s.title,s.phases=t.phases??s.phases,s.chapterIds=t.chapterIds??s.chapterIds,s.soundtracks=t.soundtracks??s.soundtracks??[],s.updatedAt=new Date().toISOString(),a.stories[s.storyId].updatedAt=s.updatedAt,b(a),H(s,a)},async reorderArcs(e,t){const a=v();a.stories[e].arcIds=[...t],a.stories[e].updatedAt=new Date().toISOString(),b(a)},async createChapter(e,t){const a=v(),s=a.arcs[e];if(!s)throw new Error("Arc not found.");const r=S("chapter"),o=new Date().toISOString();return a.chapters[r]={id:r,arcId:e,title:t,body:"",assets:[],soundtracks:[],createdAt:o,updatedAt:o},s.chapterIds.push(r),s.phases?.length||(s.phases=[j()]),s.phases[0].chapterIds.push(r),s.updatedAt=o,a.stories[s.storyId].updatedAt=o,b(a),a.chapters[r]},async updateChapter(e,t){const a=v();if(!a.chapters[e])throw new Error("Chapter not found.");a.chapters[e]={...a.chapters[e],...t,updatedAt:new Date().toISOString()};const s=a.arcs[a.chapters[e].arcId];return s&&(s.updatedAt=a.chapters[e].updatedAt,a.stories[s.storyId].updatedAt=s.updatedAt),b(a),a.chapters[e]},async updateChapterOrder(e,t){const a=v();a.arcs[e].chapterIds=[...t],a.arcs[e].updatedAt=new Date().toISOString(),a.stories[a.arcs[e].storyId].updatedAt=a.arcs[e].updatedAt,b(a)},async createPhase(e,t){const a=v();B(a,e);const s=a.arcs[e],r={id:S("phase"),title:t?.trim()||"New Phase",chapterIds:[]};return s.phases.push(r),s.updatedAt=new Date().toISOString(),a.stories[s.storyId].updatedAt=s.updatedAt,b(a),r},async renamePhase(e,t,a){const s=v();B(s,e);const r=s.arcs[e],o=r.phases.find(i=>i.id===t);if(!o)throw new Error("Phase not found.");return o.title=a?.trim()||F,r.updatedAt=new Date().toISOString(),s.stories[r.storyId].updatedAt=r.updatedAt,b(s),o},async moveChapterToPhase(e,t,a){const s=v();B(s,e);const r=s.arcs[e];for(const i of r.phases)i.chapterIds=i.chapterIds.filter(c=>c!==t);const o=r.phases.find(i=>i.id===a);if(!o)throw new Error("Phase not found.");o.chapterIds.push(t),r.chapterIds=V(r.phases),r.updatedAt=new Date().toISOString(),s.stories[r.storyId].updatedAt=r.updatedAt,b(s)},async reorderPhaseChapters(e,t,a){const s=v();B(s,e);const r=s.arcs[e],o=r.phases.find(i=>i.id===t);if(!o)throw new Error("Phase not found.");o.chapterIds=[...a],r.chapterIds=V(r.phases),r.updatedAt=new Date().toISOString(),s.stories[r.storyId].updatedAt=r.updatedAt,b(s)},async deleteChapter(e){const t=v(),a=t.chapters[e];if(!a)return;const s=t.arcs[a.arcId];if(s){s.chapterIds=(s.chapterIds??[]).filter(o=>o!==e),s.phases=(s.phases??[]).map(o=>({...o,chapterIds:(o.chapterIds??[]).filter(i=>i!==e)})),s.updatedAt=new Date().toISOString();const r=t.stories[s.storyId];r&&(r.updatedAt=s.updatedAt)}delete t.chapters[e],b(t)},async deleteArc(e){const t=v(),a=t.arcs[e];if(!a)return;for(const r of a.chapterIds??[])delete t.chapters[r];const s=t.stories[a.storyId];s&&(s.arcIds=(s.arcIds??[]).filter(r=>r!==e),s.updatedAt=new Date().toISOString()),delete t.arcs[e],b(t)},async deleteStory(e){const t=v(),a=t.stories[e];if(a){for(const s of a.arcIds??[]){const r=t.arcs[s];for(const o of r?.chapterIds??[])delete t.chapters[o];delete t.arcs[s]}delete t.stories[e],b(t)}}}}function et(e){return{...e,arcIds:e.arcIds??[],tags:e.tags??[],arcs:(e.arcIds??[]).map(t=>({id:t}))}}function w(e){return e.exists()?{id:e.id,...e.data()}:null}function Q(e,t){const a=new Map(t.map((s,r)=>[s,r]));return[...e].sort((s,r)=>(a.get(s.id)??0)-(a.get(r.id)??0))}async function at(e,t){const a=await g(p(e,"stories",t)),s=w(a);if(!s)return null;const r=await q(U(L(e,"arcs"),R("storyId","==",t))),o=[];for(const d of Q(r.docs.map(u=>({id:u.id,...u.data(),chapterIds:u.data().chapterIds??[]})),s.arcIds??[])){const u=k(d);JSON.stringify({chapterIds:d.chapterIds??[],phases:d.phases??[]})!==JSON.stringify({chapterIds:u.chapterIds,phases:u.phases})&&await m(p(e,"arcs",d.id),{chapterIds:u.chapterIds,phases:u.phases}),o.push(u)}const i=await Promise.all(o.map(async d=>{const u=await q(U(L(e,"chapters"),R("arcId","==",d.id)));return[d.id,Q(u.docs.map(h=>({id:h.id,...h.data(),assets:h.data().assets??[],soundtracks:h.data().soundtracks??[]})),d.chapterIds??[])]})),c=Object.fromEntries(i);return{...s,tags:s.tags??[],arcIds:s.arcIds??[],arcs:o.map(d=>({...d,chapterIds:d.chapterIds??[],phases:d.phases.map(u=>({...u,chapters:(c[d.id]??[]).filter(h=>(u.chapterIds??[]).includes(h.id))})),chapters:c[d.id]??[]}))}}async function st(e,t){if(!t?.id)return;const a=p(e,"users",t.id),s=await g(a),r={id:t.id,name:t.name??"Creator",email:t.email??"",penName:t.penName??(s.exists()?s.data().penName:"")??"",structureView:t.structureView??(s.exists()?s.data().structureView:"list")??"list",updatedAt:new Date().toISOString()};if(s.exists()){await m(a,r);return}await E(a,{...r,createdAt:new Date().toISOString()})}function Yt(e){const t=e.db;return{mode:"firebase",async getUserProfile(a){if(!a)return null;const s=await g(p(t,"users",a));return w(s)},async updateUserProfile(a,s){const r=p(t,"users",a),o=await g(r),i={id:a,updatedAt:new Date().toISOString(),...s};o.exists()?await m(r,i):await E(r,{createdAt:new Date().toISOString(),...i});const c=await g(r),d=w(c),u=d?.penName?.trim()||d?.name||"Creator",h=await q(U(L(t,"stories"),R("creatorId","==",a)));return await Promise.all(h.docs.map(y=>m(p(t,"stories",y.id),{creatorName:u}))),d},async listCreatorStories(a){return a?(await q(U(L(t,"stories"),R("creatorId","==",a)))).docs.map(r=>et({id:r.id,...r.data()})).sort((r,o)=>String(o.updatedAt).localeCompare(String(r.updatedAt))):[]},async listBrowserStories(){return(await q(U(L(t,"stories"),R("visibility","==","public")))).docs.map(s=>et({id:s.id,...s.data()})).sort((s,r)=>s.creatorName.localeCompare(r.creatorName)||s.title.localeCompare(r.title))},async getStory(a){return at(t,a)},async getArc(a){const s=await g(p(t,"arcs",a)),r=w(s),o=r?k(r):null;if(!o)return null;JSON.stringify({chapterIds:r.chapterIds??[],phases:r.phases??[]})!==JSON.stringify({chapterIds:o.chapterIds,phases:o.phases})&&await m(p(t,"arcs",a),{chapterIds:o.chapterIds,phases:o.phases});const i=await q(U(L(t,"chapters"),R("arcId","==",a)));return{...o,chapterIds:o.chapterIds??[],phases:o.phases.map(c=>({...c,chapters:Q(i.docs.map(d=>({id:d.id,...d.data(),assets:d.data().assets??[],soundtracks:d.data().soundtracks??[]})).filter(d=>(c.chapterIds??[]).includes(d.id)),c.chapterIds??[])})),chapters:Q(i.docs.map(c=>({id:c.id,...c.data(),assets:c.data().assets??[],soundtracks:c.data().soundtracks??[]})),o.chapterIds??[])}},async getChapter(a){const s=await g(p(t,"chapters",a)),r=w(s);return r?{...r,assets:r.assets??[],soundtracks:r.soundtracks??[]}:null},async createStory({creatorId:a,creatorName:s,title:r,tags:o,visibility:i}){const c=S("story"),d=new Date().toISOString(),u={id:c,title:r,tags:o,visibility:i,creatorId:a,creatorName:s,arcIds:[],createdAt:d,updatedAt:d};return await E(p(t,"stories",c),u),await st(t,{id:a,name:s}),et(u)},async updateStory(a,s){return await m(p(t,"stories",a),{...s,updatedAt:new Date().toISOString()}),at(t,a)},async createArc(a,s){const r=p(t,"stories",a),o=await g(r),i=w(o);if(!i)throw new Error("Story not found.");const c=S("arc"),d=new Date().toISOString(),u={id:c,storyId:a,title:s,chapterIds:[],soundtracks:[],phases:[j()],createdAt:d,updatedAt:d};return await E(p(t,"arcs",c),u),await m(r,{arcIds:[...i.arcIds??[],c],updatedAt:d}),u},async updateArc(a,s){const r=p(t,"arcs",a),o=new Date().toISOString();await m(r,{...s,updatedAt:o});const i=await g(r),c=w(i);return c?.storyId&&await m(p(t,"stories",c.storyId),{updatedAt:o}),this.getArc(a)},async reorderArcs(a,s){await m(p(t,"stories",a),{arcIds:s,updatedAt:new Date().toISOString()})},async createChapter(a,s){const r=p(t,"arcs",a),o=await g(r),i=w(o);if(!i)throw new Error("Arc not found.");const c=S("chapter"),d=new Date().toISOString(),u={id:c,arcId:a,title:s,body:"",assets:[],soundtracks:[],createdAt:d,updatedAt:d};await E(p(t,"chapters",c),u);const h=k(i);return h.phases.length||(h.phases=[j()]),h.phases[0].chapterIds.push(c),await m(r,{chapterIds:[...i.chapterIds??[],c],phases:h.phases,updatedAt:d}),await m(p(t,"stories",i.storyId),{updatedAt:d}),u},async updateChapter(a,s){const r=p(t,"chapters",a),o=new Date().toISOString();await m(r,{...s,updatedAt:o});const i=await g(r),c=w(i);if(c?.arcId){const d=await g(p(t,"arcs",c.arcId)),u=w(d);u&&(await m(p(t,"arcs",u.id),{updatedAt:o}),await m(p(t,"stories",u.storyId),{updatedAt:o}))}return this.getChapter(a)},async updateChapterOrder(a,s){const r=p(t,"arcs",a),o=new Date().toISOString();await m(r,{chapterIds:s,updatedAt:o});const i=await g(r),c=w(i);c?.storyId&&await m(p(t,"stories",c.storyId),{updatedAt:o})},async createPhase(a,s){const r=p(t,"arcs",a),o=await g(r),i=w(o),c=i?k(i):null;if(!c)throw new Error("Arc not found.");const d={id:S("phase"),title:s?.trim()||"New Phase",chapterIds:[]},u=[...c.phases,d],h=new Date().toISOString();return await m(r,{phases:u,chapterIds:V(u),updatedAt:h}),await m(p(t,"stories",c.storyId),{updatedAt:h}),d},async renamePhase(a,s,r){const o=p(t,"arcs",a),i=await g(o),c=w(i),d=c?k(c):null;if(!d)throw new Error("Arc not found.");const u=d.phases.map(y=>y.id===s?{...y,title:r?.trim()||F}:y),h=new Date().toISOString();return await m(o,{phases:u,updatedAt:h}),await m(p(t,"stories",d.storyId),{updatedAt:h}),u.find(y=>y.id===s)},async moveChapterToPhase(a,s,r){const o=p(t,"arcs",a),i=await g(o),c=w(i),d=c?k(c):null;if(!d)throw new Error("Arc not found.");const u=d.phases.map(D=>({...D,chapterIds:(D.chapterIds??[]).filter(W=>W!==s)})),h=u.find(D=>D.id===r);if(!h)throw new Error("Phase not found.");h.chapterIds.push(s);const y=new Date().toISOString();await m(o,{phases:u,chapterIds:V(u),updatedAt:y}),await m(p(t,"stories",d.storyId),{updatedAt:y})},async reorderPhaseChapters(a,s,r){const o=p(t,"arcs",a),i=await g(o),c=w(i),d=c?k(c):null;if(!d)throw new Error("Arc not found.");const u=d.phases.map(y=>y.id===s?{...y,chapterIds:[...r]}:y),h=new Date().toISOString();await m(o,{phases:u,chapterIds:V(u),updatedAt:h}),await m(p(t,"stories",d.storyId),{updatedAt:h})},async deleteChapter(a){const s=await g(p(t,"chapters",a)),r=w(s);if(!r)return;const o=p(t,"arcs",r.arcId),i=await g(o),c=w(i),d=new Date().toISOString();c&&(await m(o,{chapterIds:(c.chapterIds??[]).filter(u=>u!==a),phases:(c.phases??[]).map(u=>({...u,chapterIds:(u.chapterIds??[]).filter(h=>h!==a)})),updatedAt:d}),await m(p(t,"stories",c.storyId),{updatedAt:d})),await _(p(t,"chapters",a))},async deleteArc(a){const s=await g(p(t,"arcs",a)),r=w(s);if(!r)return;for(const d of r.chapterIds??[])await _(p(t,"chapters",d));const o=p(t,"stories",r.storyId),i=await g(o),c=w(i);c&&await m(o,{arcIds:(c.arcIds??[]).filter(d=>d!==a),updatedAt:new Date().toISOString()}),await _(p(t,"arcs",a))},async deleteStory(a){const s=await at(t,a);if(s){for(const r of s.arcs??[]){for(const o of r.chapters??[])await _(p(t,"chapters",o.id));await _(p(t,"arcs",r.id))}await _(p(t,"stories",a))}},async seedDemoStory(a){if(!a?.id)return;if(!(await q(U(L(t,"stories"),R("creatorId","==",a.id),Ut(1)))).empty){await st(t,a);return}const r=S("story"),o=S("arc"),i=S("chapter"),c=new Date().toISOString();await E(p(t,"stories",r),{id:r,title:"Your First Story",tags:["draft"],visibility:"private",creatorId:a.id,creatorName:a.name??"Creator",arcIds:[o],createdAt:c,updatedAt:c}),await E(p(t,"arcs",o),{id:o,storyId:r,title:"Opening Arc",chapterIds:[i],phases:[{id:S("phase"),title:F,chapterIds:[i]}],createdAt:c,updatedAt:c}),await E(p(t,"chapters",i),{id:i,arcId:o,title:"Chapter One",body:`# Welcome

This story is now stored in Firestore.`,assets:[],createdAt:c,updatedAt:c}),await st(t,a)}}}async function Gt(e){return e?.mode==="firebase"&&e.db?Yt(e):zt()}const Jt={VITE_APP_MODE:"firebase",VITE_FIREBASE_API_KEY:"AIzaSyC8-b4_lzrCk2RhsqSEMkcxNKgMzVx_WJ4",VITE_FIREBASE_APP_ID:"1:309677315541:web:ef90a15da4ee29c03fd95c",VITE_FIREBASE_AUTH_DOMAIN:"ulunavir-tales.firebaseapp.com",VITE_FIREBASE_MESSAGING_SENDER_ID:"309677315541",VITE_FIREBASE_PROJECT_ID:"ulunavir-tales",VITE_FIREBASE_STORAGE_BUCKET:"ulunavir-tales.firebasestorage.app"},nt={mode:"local",firebase:{apiKey:"",authDomain:"",projectId:"",appId:"",storageBucket:"",messagingSenderId:""}};function Kt(){const e=Jt??{};return{mode:e.VITE_APP_MODE??nt.mode,firebase:{apiKey:e.VITE_FIREBASE_API_KEY??"",authDomain:e.VITE_FIREBASE_AUTH_DOMAIN??"",projectId:e.VITE_FIREBASE_PROJECT_ID??"",appId:e.VITE_FIREBASE_APP_ID??"",storageBucket:e.VITE_FIREBASE_STORAGE_BUCKET??"",messagingSenderId:e.VITE_FIREBASE_MESSAGING_SENDER_ID??""}}}function bt(){const e=globalThis.STORYFORGE_CONFIG??{},t=Kt();return{...nt,...t,...e,firebase:{...nt.firebase,...t.firebase,...e.firebase??{}}}}function Ht(e){return e.mode==="firebase"&&!!(e.firebase.projectId&&e.firebase.apiKey&&e.firebase.appId)}function Qt(){const e=bt();if(!Ht(e))return{mode:"local",auth:null,db:null,signIn:async()=>null,signOut:async()=>null,watchAuth:o=>(o(null),()=>{})};const t=Rt().length?Lt():xt(e.firebase),a=_t(t),s=Bt(t),r=new Vt;return{mode:"firebase",auth:a,db:s,signIn:async()=>(await jt(a,r)).user,signOut:async()=>Mt(a),watchAuth:o=>Ft(a,o)}}function Zt(){return bt()}const it=document.querySelector("#app"),n={adapter:null,authClient:null,currentUser:JSON.parse(localStorage.getItem("storyforge-session")??"null"),route:{name:"home",params:{}},dragActive:!1,saveStatus:"",authError:"",soundtrack:{arcId:"",queue:[],currentIndex:0,paused:!0,volume:70,volumeOpen:!1,mode:"idle",ready:!1,autoplayAttempted:!1,activeKey:"",youtubePlayer:null,syncToken:0}},St="storyforge-soundtrack-state";function Wt(){try{const e=localStorage.getItem(St);return e?JSON.parse(e):{}}catch{return{}}}function It(){const{arcId:e,currentIndex:t,paused:a,volume:s}=n.soundtrack;localStorage.setItem(St,JSON.stringify({arcId:e,currentIndex:t,paused:a,volume:s}))}function $t(e=I()){return e?e.penName?.trim()||e.name||"Creator":"Guest"}function kt(e=I()){return e?.structureView==="grid"?"grid":"list"}function C(e){n.currentUser=e,localStorage.setItem("storyforge-session",JSON.stringify(e))}function $(e){const t=`#${e}`;if(window.location.hash===t){f(),window.scrollTo({top:0,left:0,behavior:"auto"});return}window.location.hash=e}function Xt(){const e=window.location.hash.replace(/^#/,"")||"/",[t]=e.split("?"),a=t.split("/").filter(Boolean);return a.length===0?{name:"home",params:{}}:a[0]==="creator"?{name:"creator",params:{}}:a[0]==="browser"?{name:"browser",params:{}}:a[0]==="settings"?{name:"settings",params:{}}:a[0]==="stories"&&a[1]?a[2]==="arcs"&&a[3]&&a[4]==="chapters"&&a[5]?{name:"chapter",params:{storyId:a[1],arcId:a[3],chapterId:a[5]}}:a[2]==="arcs"&&a[3]?{name:"arc",params:{storyId:a[1],arcId:a[3]}}:{name:"story",params:{storyId:a[1]}}:{name:"not-found",params:{}}}function z(){return new URLSearchParams(window.location.hash.split("?")[1]??"")}function I(){return n.currentUser?n.currentUser:n.authClient?.mode==="firebase"?null:{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",mode:"demo",structureView:"list"}}function dt(e){return!!(e?.creatorId&&I()?.id&&e.creatorId===I().id)}function l(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function At(e){return`${e}-${crypto.randomUUID().slice(0,8)}`}function te(e,t="Soundtrack"){return e?.trim()||t}function ee(e){try{const t=new URL(e);if(t.hostname==="youtu.be")return t.pathname.replace(/\//g,"")||null;if(t.hostname.includes("youtube.com")){if(t.pathname==="/watch")return t.searchParams.get("v");const a=t.pathname.split("/").filter(Boolean);if(["embed","shorts","live"].includes(a[0]))return a[1]??null}}catch{return null}return null}function Ct(e){const t=e?.url?.trim(),a=t&&!/^https?:\/\//i.test(t)?`https://${t}`:t;if(!a)return null;const s=ee(a);return s?{id:e.id??At("soundtrack"),label:te(e.label,"YouTube track"),url:a,source:"youtube",videoId:s}:null}function ae(e=[]){return e.map(Ct).filter(Boolean)}function se(){let e=document.querySelector("#soundtrack-layer");return e||(e=document.createElement("div"),e.id="soundtrack-layer",e.innerHTML=`
    <div id="youtube-soundtrack-host"></div>
  `,document.body.append(e),e)}function re(e,t){return t()?Promise.resolve():new Promise((a,s)=>{const r=[...document.querySelectorAll("script")].find(i=>i.src===e);if(r){r.addEventListener("load",()=>a(),{once:!0}),r.addEventListener("error",()=>s(new Error(`Failed to load ${e}`)),{once:!0});return}const o=document.createElement("script");o.src=e,o.async=!0,o.addEventListener("load",()=>a(),{once:!0}),o.addEventListener("error",()=>s(new Error(`Failed to load ${e}`)),{once:!0}),document.head.append(o)})}function O(){const e=n.soundtrack.queue??[];if(!e.length)return null;const t=Math.max(0,Math.min(n.soundtrack.currentIndex,e.length-1));return e[t]??null}function M(){const e=O(),t=document.querySelector("[data-action='toggle-soundtrack']");t&&(t.disabled=!e,t.classList.toggle("is-active",!!e&&!n.soundtrack.paused),t.setAttribute("aria-pressed",String(!!e&&!n.soundtrack.paused)),t.setAttribute("title",e?`${n.soundtrack.paused?"Resume":"Pause"} ${e.label}`:"No soundtrack available"));const a=document.querySelector("[data-action='toggle-volume-popout']");a&&(a.disabled=!e,a.classList.toggle("is-open",n.soundtrack.volumeOpen),a.style.setProperty("--volume-fill",`${A(n.soundtrack.volume)}%`),a.setAttribute("title",e?`Volume ${A(n.soundtrack.volume)}%`:"No soundtrack available"));const s=document.querySelector("#soundtrack-volume-slider");s&&(s.value=String(A(n.soundtrack.volume)));const r=document.querySelector("#soundtrack-volume-value");r&&(r.textContent=`${A(n.soundtrack.volume)}%`);const o=document.querySelector(".volume-popout");o&&(o.hidden=!n.soundtrack.volumeOpen)}function x(){It(),M()}function Et(){const e=document.querySelector("#soundtrack-status");e&&(e.textContent="No soundtrack loaded."),M()}function Z(e){const t=document.querySelector("#soundtrack-status");t&&(t.textContent=e)}function Pt(){const e=O();n.soundtrack.mode==="youtube"&&n.soundtrack.youtubePlayer?.pauseVideo&&n.soundtrack.youtubePlayer.pauseVideo(),n.soundtrack.paused=!0,e&&Z(`Paused: ${e.label}`),x()}function oe(){const e=O();e&&(n.soundtrack.mode==="youtube"&&n.soundtrack.youtubePlayer?.playVideo&&n.soundtrack.youtubePlayer.playVideo(),n.soundtrack.paused=!1,Z(`Now playing: ${e.label}`),x())}function ne(){n.soundtrack.queue.length&&(n.soundtrack.currentIndex=(n.soundtrack.currentIndex+1)%n.soundtrack.queue.length,n.soundtrack.activeKey="",n.soundtrack.ready=!1,n.soundtrack.autoplayAttempted=!1,x(),Tt())}function A(e){return Math.max(0,Math.min(100,Math.round(Number(e)||0)))}function Ot(){const e=A(n.soundtrack.volume);n.soundtrack.volume=e,n.soundtrack.youtubePlayer?.setVolume&&n.soundtrack.youtubePlayer.setVolume(e),x()}function Nt(e){n.soundtrack.volume=A(e),Ot()}function ie(e){Nt(A(n.soundtrack.volume+e))}async function ce(e,t){await re("https://www.youtube.com/iframe_api",()=>!!window.YT?.Player),t===n.soundtrack.syncToken&&(se(),n.soundtrack.youtubePlayer?n.soundtrack.youtubePlayer.loadVideoById(e.videoId):await new Promise(a=>{const s=()=>{n.soundtrack.youtubePlayer=new window.YT.Player("youtube-soundtrack-host",{height:"200",width:"320",videoId:e.videoId,playerVars:{autoplay:1,controls:1,rel:0},events:{onReady:()=>a(),onStateChange:r=>{if(r.data===window.YT.PlayerState.ENDED){ne();return}r.data===window.YT.PlayerState.PLAYING&&(n.soundtrack.paused=!1,x()),r.data===window.YT.PlayerState.PAUSED&&(n.soundtrack.paused=!0,x())}}})};if(window.YT?.Player)s();else{const r=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{r?.(),s()}}}),t===n.soundtrack.syncToken&&(n.soundtrack.mode="youtube",n.soundtrack.ready=!0,n.soundtrack.activeKey=e.id,Ot(),Z(`Now playing: ${e.label}`),n.soundtrack.paused||n.soundtrack.youtubePlayer.playVideo(),M()))}async function Tt(){const e=++n.soundtrack.syncToken,t=O();if(!t){n.soundtrack.arcId="",n.soundtrack.queue=[],n.soundtrack.mode="idle",n.soundtrack.ready=!1,n.soundtrack.activeKey="",Pt(),Et();return}try{if(t.source==="youtube"){await ce(t,e);return}}catch(a){n.saveStatus=`Soundtrack error: ${String(a.message||a)}`,Z("Soundtrack could not be loaded."),M()}}function de(e,t){const a=Wt(),s=e!==n.soundtrack.arcId||JSON.stringify(t.map(r=>r.id))!==JSON.stringify((n.soundtrack.queue??[]).map(r=>r.id));n.soundtrack.arcId=e,n.soundtrack.queue=t,s&&(n.soundtrack.currentIndex=a.arcId===e&&typeof a.currentIndex=="number"?Math.max(0,Math.min(a.currentIndex,t.length-1)):0,n.soundtrack.paused=a.arcId===e?!!a.paused:!1,n.soundtrack.volume=typeof a.volume=="number"?A(a.volume):n.soundtrack.volume,n.soundtrack.ready=!1,n.soundtrack.activeKey=""),x(),Tt()}function P(){n.soundtrack.arcId="",n.soundtrack.queue=[],n.soundtrack.currentIndex=0,n.soundtrack.paused=!0,n.soundtrack.volumeOpen=!1,n.soundtrack.activeKey="",n.soundtrack.ready=!1,n.soundtrack.youtubePlayer?.pauseVideo&&n.soundtrack.youtubePlayer.pauseVideo(),Et(),It()}function ct(e){return l(e).replace(/```([\s\S]*?)```/g,(u,h)=>`<pre><code>${h.trim()}</code></pre>`).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<p><img alt="$1" src="$2" /></p>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/(?:^|\n)- (.*(?:\n- .*)*)/g,u=>`
<ul>${u.trim().split(`
`).map(y=>y.replace(/^- /,"").trim()).map(y=>`<li>${y}</li>`).join("")}</ul>`).split(/\n{2,}/).map(u=>/^<(h\d|ul|pre|p)/.test(u.trim())?u:`<p>${u.replace(/\n/g,"<br />")}</p>`).join("")}function ut(e){return new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short"}).format(new Date(e))}function ue(e,t,a){if(!t)return e;const s=t.toLowerCase();return e.filter(r=>a(r).toLowerCase().includes(s))}function le(e){return[...new Set(e.flatMap(t=>t.tags))].sort((t,a)=>t.localeCompare(a))}function pe(e=""){return`
    <aside class="quick-tools">
      <div class="quick-tools-frame">
        <div class="quick-tools-label">Quick Tools</div>
        <div class="quick-tools-body">
          ${e||'<div class="quick-tools-empty">No tools</div>'}
        </div>
      </div>
    </aside>
  `}function T(e,t,a=""){const s=I(),r=n.authError?`<div class="notice"><strong>Sign-in error</strong><div class="muted">${l(n.authError)}</div></div>`:"";it.innerHTML=`
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
          <button class="notice account-card" data-action="open-settings" ${s?"":"disabled"}>
            <strong>${l($t(s))}</strong>
            <div class="muted">${l(s?.email??(n.authClient?.mode==="firebase"?"Sign in to create and manage stories":"Local demo mode"))}</div>
          </button>
          <button class="login-button" data-action="toggle-login">
            ${n.currentUser?"Log out":"Log in"}
          </button>
        </div>
      </aside>
      <main class="content">${e}</main>
      ${pe(a)}
    </div>
  `,r&&it.querySelector(".content").insertAdjacentHTML("afterbegin",r)}async function he(){const e=I();if(!e)return N("Sign in to manage account settings.");T(`
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
    `,"home")}function rt(e,t,a){return`<a class="nav-link ${a?"is-active":""}" href="#${e}"><span>${t}</span></a>`}function me(){return`
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
  `}async function fe(){T(`
      <div class="stack">
        ${me()}
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
    `,"home")}async function ve(){const e=I(),t=await n.adapter.listCreatorStories(e?.id),a=z(),s=a.get("q")??"",r=a.get("tag")??"",o=ue(t,s,d=>`${d.title} ${d.tags.join(" ")}`).filter(d=>r?d.tags.includes(r):!0),i=le(t),c=n.authClient?.mode==="firebase"&&!e?'<div class="notice">Sign in with Firebase to create, edit, and manage your own stories.</div>':"";T(`
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
            <input id="story-search" placeholder="Search by story title or tag" value="${l(s)}" />
            <select id="story-tag-filter">
              <option value="">All tags</option>
              ${i.map(d=>`<option value="${l(d)}" ${r===d?"selected":""}>${l(d)}</option>`).join("")}
            </select>
            <button class="ghost-button" data-action="apply-story-filters">Filter</button>
          </div>
          <div class="chip-row">
            ${i.map(d=>`<a class="pill" href="#/creator?tag=${encodeURIComponent(d)}">${l(d)}</a>`).join("")}
          </div>
        </section>
        <section class="story-list">
          ${o.length?o.map(ye).join(""):'<div class="empty-state">No stories match this filter yet.</div>'}
        </section>
      </div>
    `,"creator")}function ye(e){return`
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
  `}async function ge(){const e=await n.adapter.listBrowserStories(I()?.id),t=z(),a=t.get("group")!=="flat",s=t.get("creator")??"",r=s?e.filter(c=>c.creatorName===s):e,o=[...new Set(e.map(c=>c.creatorName))];let i="";r.length?a?i=o.filter(c=>!s||c===s).map(c=>{const d=r.filter(u=>u.creatorName===c);return d.length?`
          <section class="panel stack">
            <div class="section-header">
              <h3>${l(c)}</h3>
              <span class="pill">${d.length} public stories</span>
            </div>
            <div class="story-list">${d.map(mt).join("")}</div>
          </section>
        `:""}).join(""):i=`<section class="story-list">${r.map(mt).join("")}</section>`:i='<div class="empty-state">No public stories are available yet.</div>',T(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Browser</h2>
            <p class="muted">Explore public stories and browse them by creator.</p>
          </div>
          <div class="toolbar">
            <select id="browser-creator-filter">
              <option value="">All creators</option>
              ${o.map(c=>`<option value="${l(c)}" ${s===c?"selected":""}>${l(c)}</option>`).join("")}
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
  `}async function we(e){const t=await n.adapter.getStory(e);if(!t)return N("Story not found.");const a=dt(t),s=z().get("view")==="browser",r=kt();if(t.visibility==="private"&&!a)return N("This story is private.");T(`
      <div class="stack">
        ${lt([[s?"#/browser":"#/creator",s?"Browser":"Creator"],["",t.title]])}
        <div class="page-title">
          <div>
            <h2>${l(t.title)}</h2>
            <p class="muted">Set visibility, manage arcs, and organize the reading order.</p>
          </div>
          <div class="card-actions">
            <div class="view-toggle" role="group" aria-label="Structure view">
              <button class="ghost-button ${r==="grid"?"is-active":""}" data-action="set-structure-view" data-view="grid">Compact Grid</button>
              <button class="ghost-button ${r==="list"?"is-active":""}" data-action="set-structure-view" data-view="list">List</button>
            </div>
            ${s&&a?'<a class="ghost-button" href="#/stories/'+t.id+'">Edit</a>':""}
            ${a&&!s?'<button class="primary-button" data-action="create-arc" data-story-id="'+t.id+'">New arc</button>':""}
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
        <section class="nested-list ${r==="list"?"is-list-view":""}">
          ${t.arcs.length?t.arcs.map((o,i)=>be(o,t,a,i,s)).join(""):'<div class="empty-state">No arcs yet. Create the first arc to start structuring this story.</div>'}
        </section>
      </div>
    `,s?"browser":a?"creator":"browser")}function be(e,t,a,s,r=!1){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${l(e.title)}</h3>
          <p class="muted">${e.chapters.length} chapter(s)</p>
        </div>
        ${a?`
          <div class="order-buttons">
            <button class="small-button" data-action="move-arc-up" data-story-id="${t.id}" data-index="${s}" ${s===0?"disabled":""}>↑</button>
            <button class="small-button" data-action="move-arc-down" data-story-id="${t.id}" data-index="${s}" ${s===t.arcs.length-1?"disabled":""}>↓</button>
          </div>`:""}
      </div>
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${t.id}/arcs/${e.id}${r?"?view=browser":""}">Open arc</a>
        ${a&&!r?`<button class="danger-button" data-action="delete-arc" data-story-id="${t.id}" data-arc-id="${e.id}">Delete</button>`:""}
      </div>
    </article>
  `}function Se(e,t,a=!1,s=""){return`
    <div class="phase-separator">
      <span class="phase-line"></span>
      ${t&&!a?`<button class="phase-title" data-action="rename-phase" data-arc-id="${s}" data-phase-id="${e.id}" data-phase-title="${l(e.title)}">${l(e.title)}</button>`:`<span class="phase-title">${l(e.title)}</span>`}
      <span class="phase-line"></span>
    </div>
  `}function Ie(e){const t=e.soundtracks??[];return`
    <section class="panel stack">
      <div class="section-header">
        <div>
          <h3>Soundtracks</h3>
          <p class="muted">Add YouTube links that should play only for this chapter.</p>
        </div>
        <span class="pill">${t.length} track(s)</span>
      </div>
      <div class="inline-form soundtrack-form">
        <input id="soundtrack-label-input" placeholder="Optional label, for example Tavern Theme" />
        <input id="soundtrack-url-input" placeholder="https://youtube.com/... or https://youtu.be/..." />
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
  `}function $e(e){if(!e.length)return"";const t=O(),a=A(n.soundtrack.volume);return`
    <div class="quick-tool-stack">
      <button
        class="quick-tool-button ${t&&!n.soundtrack.paused?"is-active":""}"
        data-action="toggle-soundtrack"
        aria-pressed="${String(!!t&&!n.soundtrack.paused)}"
        title="${l(t?`${n.soundtrack.paused?"Resume":"Pause"} ${t.label}`:"No soundtrack available")}"
      >
        <span class="quick-tool-icon">♪</span>
      </button>
      <button
        class="quick-tool-button volume-button ${n.soundtrack.volumeOpen?"is-open":""}"
        data-action="toggle-volume-popout"
        data-wheel-volume="true"
        style="--volume-fill: ${a}%;"
        title="${l(t?`Volume ${a}%`:"No soundtrack available")}"
      >
        <span class="quick-tool-icon">◔</span>
      </button>
      <div class="volume-popout" ${n.soundtrack.volumeOpen?"":"hidden"}>
        <input
          id="soundtrack-volume-slider"
          class="volume-slider"
          type="range"
          min="0"
          max="100"
          step="1"
          value="${a}"
          data-action="set-volume"
        />
        <div id="soundtrack-volume-value" class="quick-tool-status">${a}%</div>
      </div>
      <div class="quick-tool-caption">Music</div>
      <div id="soundtrack-status" class="quick-tool-status">${l(t?`${n.soundtrack.paused?"Paused":"Now playing"}: ${t.label}`:"No soundtrack loaded.")}</div>
    </div>
  `}async function ke(e,t){const[a,s]=await Promise.all([n.adapter.getStory(e),n.adapter.getArc(t)]);if(!a||!s)return N("Arc not found.");const r=dt(a),o=z().get("view")==="browser",i=kt();if(a.visibility==="private"&&!r)return N("This story is private.");const c=(s.phases??[]).map(d=>`
    <section class="phase-block stack">
      ${Se(d,r,o,s.id)}
      <div class="nested-list ${i==="list"?"is-list-view":""}">
        ${d.chapters.length?d.chapters.map((u,h)=>Ae(u,a,s,r,h,o,d)).join(""):'<div class="empty-state">No chapters in this phase yet.</div>'}
      </div>
    </section>
  `).join("");T(`
      <div class="stack">
        ${lt([[o?"#/browser":r?"#/creator":"#/browser",o?"Browser":r?"Creator":"Browser"],["#/stories/"+a.id+(o?"?view=browser":""),a.title],["",s.title]])}
        <div class="page-title">
          <div>
            <h2>${l(s.title)}</h2>
            <p class="muted">Manage the chapter list and reading order for this arc.</p>
          </div>
          <div class="card-actions">
            <div class="view-toggle" role="group" aria-label="Structure view">
              <button class="ghost-button ${i==="grid"?"is-active":""}" data-action="set-structure-view" data-view="grid">Compact Grid</button>
              <button class="ghost-button ${i==="list"?"is-active":""}" data-action="set-structure-view" data-view="list">List</button>
            </div>
            ${o&&r?'<a class="ghost-button" href="#/stories/'+a.id+"/arcs/"+s.id+'">Edit</a>':""}
            ${r&&!o?'<button class="ghost-button" data-action="create-phase" data-arc-id="'+s.id+'">New phase</button>':""}
            ${r&&!o?'<button class="primary-button" data-action="create-chapter" data-arc-id="'+s.id+'" data-story-id="'+a.id+'">New chapter</button>':""}
          </div>
        </div>
        ${r&&!o?`
          <section class="panel">
            <div class="inline-form">
              <input id="arc-title-input" value="${l(s.title)}" />
              <button class="ghost-button" data-action="save-arc-title" data-arc-id="${s.id}" data-story-id="${a.id}">Rename arc</button>
            </div>
        </section>`:""}
        ${c||'<div class="empty-state">No chapters yet. Add one to begin writing.</div>'}
      </div>
    `,o?"browser":r?"creator":"browser")}function Ae(e,t,a,s,r,o=!1,i=null){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${l(e.title||"Untitled chapter")}</h3>
          <p class="muted">Updated ${ut(e.updatedAt)}</p>
        </div>
        ${s&&!o?`
          <div class="order-buttons">
            <button class="small-button" data-action="move-chapter-up" data-arc-id="${a.id}" data-phase-id="${i?.id??""}" data-index="${r}" ${r===0?"disabled":""}>↑</button>
            <button class="small-button" data-action="move-chapter-down" data-arc-id="${a.id}" data-phase-id="${i?.id??""}" data-index="${r}" ${i&&r===i.chapters.length-1?"disabled":""}>↓</button>
          </div>`:""}
      </div>
      ${s&&!o?`<select class="phase-select" data-action="move-chapter-phase" data-arc-id="${a.id}" data-chapter-id="${e.id}">
              ${(a.phases??[]).map(c=>`<option value="${c.id}" ${c.id===i?.id?"selected":""}>${l(c.title)}</option>`).join("")}
            </select>`:""}
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${t.id}/arcs/${a.id}/chapters/${e.id}${o?"?view=browser":""}">Open chapter</a>
        ${s&&!o?`<button class="danger-button" data-action="delete-chapter" data-story-id="${t.id}" data-arc-id="${a.id}" data-chapter-id="${e.id}">Delete</button>`:""}
      </div>
    </article>
  `}function ft(e,t,a,s,r=!1){return!a&&!s?"":`
    <div class="chapter-pager">
      ${a?`<a class="ghost-button" href="#/stories/${e}/arcs/${t}/chapters/${a.id}${r?"?view=browser":""}">Previous Chapter</a>`:""}
      ${s?`<a class="ghost-button" href="#/stories/${e}/arcs/${t}/chapters/${s.id}${r?"?view=browser":""}">Next Chapter</a>`:""}
    </div>
  `}async function Ce(e,t,a){const[s,r,o]=await Promise.all([n.adapter.getStory(e),n.adapter.getArc(t),n.adapter.getChapter(a)]);if(!s||!r||!o)return N("Chapter not found.");const i=dt(s),c=z().get("view")==="browser";if(s.visibility==="private"&&!i)return N("This story is private.");const d=o.assets??[],u=c?ae(o.soundtracks??[]):[],h=(r.chapters??[]).findIndex(qt=>qt.id===a),y=h>0?r.chapters[h-1]:null,D=h>=0&&h<r.chapters.length-1?r.chapters[h+1]:null,W=ft(s.id,r.id,y,D,c),pt=ft(s.id,r.id,y,D,c),Dt=i&&!c?`
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
              ${Ie(o)}
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
      `;T(`
      <div class="stack">
        ${lt([[c?"#/browser":i?"#/creator":"#/browser",c?"Browser":i?"Creator":"Browser"],["#/stories/"+s.id+(c?"?view=browser":""),s.title],["#/stories/"+s.id+"/arcs/"+r.id+(c?"?view=browser":""),r.title],["",o.title||"Untitled chapter"]])}
        <div class="page-title">
          <div>
            <h2>${l(o.title||"Untitled chapter")}</h2>
            <p class="muted">${i&&!c?"Write in markdown, add image links, and save your draft.":"Read this chapter in a clean, read-only view."}</p>
          </div>
          <div class="card-actions">
            ${c&&i?`<a class="ghost-button" href="#/stories/${s.id}/arcs/${r.id}/chapters/${o.id}">Edit</a>`:""}
            ${i&&!c?`<button class="primary-button" data-action="save-chapter" data-chapter-id="${o.id}">Save</button>`:""}
          </div>
        </div>
        ${W}
        ${Dt}
      </div>
    `,c?"browser":i?"creator":"browser",$e(u)),c&&u.length?de(o.id,u):P()}function vt(e){const t=e.url??e.dataUrl??"";return`
    <article class="asset-item">
      ${!!t?`<img src="${t}" alt="${l(e.name)}" />`:""}
      <strong>${l(e.name)}</strong>
      <div class="muted mono">![${l(e.name)}](${t})</div>
    </article>
  `}function N(e){T(`
      <div class="stack">
        <section class="panel">
          <h2>Not found</h2>
          <p class="muted">${l(e)}</p>
        </section>
      </div>
    `,"home")}function lt(e){return`<div class="breadcrumbs">${e.map(([t,a])=>t?`<a href="${t}">${l(a)}</a>`:`<span>${l(a)}</span>`).join("<span>/</span>")}</div>`}async function f(){switch(n.route=Xt(),n.route.name){case"home":return P(),fe();case"creator":return P(),ve();case"browser":return P(),ge();case"settings":return P(),he();case"story":return P(),we(n.route.params.storyId);case"arc":return P(),ke(n.route.params.storyId,n.route.params.arcId);case"chapter":return Ce(n.route.params.storyId,n.route.params.arcId,n.route.params.chapterId);default:return P(),N("This page does not exist.")}}function Ee(){return{title:document.querySelector("#story-title-input")?.value.trim()??"",tags:(document.querySelector("#story-tags-input")?.value??"").split(",").map(e=>e.trim()).filter(Boolean),visibility:document.querySelector("#story-visibility-input")?.value??"private"}}function yt(e,t,a){const s=[...e],[r]=s.splice(t,1);return s.splice(a,0,r),s}async function gt(){if(n.currentUser)return await n.authClient.signOut(),C(null),n.saveStatus="Signed out.",n.authError="",f();if(n.authClient.mode==="firebase")try{const t=await n.authClient.signIn();return await n.adapter.seedDemoStory?.({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email}),C({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email,mode:"firebase",structureView:"list"}),n.authError="",n.saveStatus="Signed in with Firebase.",f()}catch(t){return console.error("Firebase sign-in failed:",t),n.saveStatus="",n.authError=Pe(t),f()}const e=document.createElement("div");e.className="modal-backdrop",e.innerHTML=`
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
  `,document.body.append(e),e.querySelector("#modal-login-cancel").addEventListener("click",()=>e.remove()),e.querySelector("#modal-login-submit").addEventListener("click",()=>{const t=e.querySelector("#login-name").value.trim()||"Creator",a=e.querySelector("#login-email").value.trim()||"local@storyforge.local";C({id:`local-${t.toLowerCase().replaceAll(/\s+/g,"-")}`,name:t,email:a,mode:"local",structureView:"list"}),e.remove(),n.saveStatus="Signed in with a local demo profile.",n.authError="",f()})}function Pe(e){const t=e?.code?String(e.code):"",a=e?.message?String(e.message):"Unknown sign-in error.";return t==="auth/unauthorized-domain"?"This site domain is not authorized in Firebase Auth. Add your local/dev domain and your GitHub Pages domain in Firebase Console > Authentication > Settings > Authorized domains.":t==="auth/popup-closed-by-user"?"The sign-in popup closed before Firebase completed the login. If it closes instantly every time, double-check Authorized domains and the Google sign-in provider setup.":t==="auth/operation-not-allowed"?"Google sign-in is not enabled for this Firebase project. Enable it in Firebase Console > Authentication > Sign-in method.":t==="auth/invalid-api-key"?"Your Firebase API key is invalid. Recheck the values in your `.env` file and restart the dev server.":t==="auth/network-request-failed"?"Firebase could not complete the sign-in request. Check your connection and any browser privacy extensions blocking popups or auth requests.":t?`${t}: ${a}`:a}async function Oe(e){const t=n.route.params.chapterId,a=await n.adapter.getChapter(t);if(!a)return;const s=[...a.assets??[]];for(const i of e){const c=await De(i);s.push({id:crypto.randomUUID(),name:i.name,type:i.type,size:i.size,dataUrl:c})}const r=document.querySelector("#chapter-body-input"),o=s.slice((a.assets??[]).length).map(i=>`
![${i.name}](${i.dataUrl})`).join("");await n.adapter.updateChapter(t,{assets:s,body:`${r.value}${o}`}),n.dragActive=!1,n.saveStatus="Assets added to the chapter. In production these should upload to object storage instead of local state.",await f()}function Ne(e){const t=e.trim();if(!t)throw new Error("Add an image URL first.");let a;try{a=new URL(t)}catch{throw new Error("That image URL is not valid.")}if(!["http:","https:"].includes(a.protocol))throw new Error("Use an http or https image URL.");return a.toString()}async function Te(e){const t=await n.adapter.getChapter(e);if(!t)throw new Error("Chapter not found.");const a=document.querySelector("#asset-name-input"),s=document.querySelector("#asset-url-input"),r=document.querySelector("#chapter-body-input"),o=a?.value.trim()||"image",i=Ne(s?.value??""),c={id:crypto.randomUUID(),name:o,type:"image/external",url:i},d=[...t.assets??[],c],u=`${r?.value??t.body??""}
![${o}](${i})`;await n.adapter.updateChapter(e,{assets:d,body:u}),n.saveStatus="External image link added and markdown updated.",await f()}async function wt(){const e=I();if(!e?.id)return;const t=await n.adapter.getUserProfile?.(e.id);t&&C({...e,name:t.name??e.name,email:t.email??e.email,penName:t.penName??"",structureView:t.structureView??e.structureView??"list"})}function ot(e){return window.confirm(`Are you sure you want to delete this ${e}? This cannot be undone.`)}function De(e){return new Promise((t,a)=>{const s=new FileReader;s.onload=()=>t(String(s.result)),s.onerror=()=>a(s.error),s.readAsDataURL(e)})}document.addEventListener("click",async e=>{const t=e.target.closest("[data-action]");if(!t)return;const a=t.dataset.action;if(a==="toggle-login")return gt();if(a==="open-settings")return $("/settings");if(a==="set-structure-view"){const s=I(),r=t.dataset.view==="list"?"list":"grid";if(!s?.id)return C({...s,structureView:r}),f();const o=await n.adapter.updateUserProfile(s.id,{name:s.name,email:s.email,penName:s.penName??"",structureView:r});return C({...s,structureView:o.structureView??r,penName:o.penName??s.penName??"",name:o.name??s.name,email:o.email??s.email}),f()}if(a==="apply-story-filters"){const s=document.querySelector("#story-search").value.trim(),r=document.querySelector("#story-tag-filter").value;return $(`/creator${s||r?`?${new URLSearchParams({q:s,tag:r}).toString()}`:""}`)}if(a==="apply-browser-filters"){const s=document.querySelector("#browser-creator-filter").value,r=document.querySelector("#browser-group-mode").value;return $(`/browser?${new URLSearchParams({creator:s,group:r}).toString()}`)}if(a==="create-story"){const s=I();if(!s)return n.saveStatus="Sign in first to create stories in Firebase mode.",gt();const r=await n.adapter.createStory({creatorId:s.id,creatorName:$t(s),title:"Untitled Story",tags:["draft"],visibility:"private"});return $(`/stories/${r.id}`)}if(a==="save-story-settings"){const s=t.dataset.storyId,r=Ee();return await n.adapter.updateStory(s,r),n.saveStatus="Story details saved.",f()}if(a==="create-arc"){const s=t.dataset.storyId,r=await n.adapter.createArc(s,`Arc ${Math.floor(Math.random()*90+10)}`);return $(`/stories/${s}/arcs/${r.id}`)}if(a==="save-arc-title")return await n.adapter.updateArc(t.dataset.arcId,{title:document.querySelector("#arc-title-input").value.trim()||"Untitled Arc"}),n.saveStatus="Arc title saved.",f();if(a==="add-soundtrack"){const s=await n.adapter.getChapter(t.dataset.chapterId),r=document.querySelector("#soundtrack-label-input")?.value.trim()??"",o=document.querySelector("#soundtrack-url-input")?.value.trim()??"",i=Ct({id:At("soundtrack"),label:r,url:o});return i?(await n.adapter.updateChapter(s.id,{soundtracks:[...s.soundtracks??[],{id:i.id,label:i.label,url:i.url}]}),n.saveStatus="Soundtrack added.",f()):(n.saveStatus="Please enter a valid YouTube link.",f())}if(a==="delete-soundtrack"){const s=await n.adapter.getChapter(t.dataset.chapterId);return await n.adapter.updateChapter(s.id,{soundtracks:(s.soundtracks??[]).filter(r=>r.id!==t.dataset.soundtrackId)}),n.saveStatus="Soundtrack removed.",f()}if(a==="move-arc-up"||a==="move-arc-down"){const s=await n.adapter.getStory(t.dataset.storyId),r=Number(t.dataset.index),o=a==="move-arc-up"?-1:1;return await n.adapter.reorderArcs(s.id,yt(s.arcIds,r,r+o)),f()}if(a==="create-chapter"){const s=await n.adapter.createChapter(t.dataset.arcId,"Untitled Chapter");return $(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}/chapters/${s.id}`)}if(a==="create-phase"){const s=window.prompt("Phase title","New Phase");return s===null?void 0:(await n.adapter.createPhase(t.dataset.arcId,s),n.saveStatus="Phase created.",f())}if(a==="rename-phase"){const s=window.prompt("Rename phase",t.dataset.phaseTitle||"Phase");return s===null?void 0:(await n.adapter.renamePhase(t.dataset.arcId,t.dataset.phaseId,s),n.saveStatus="Phase renamed.",f())}if(a==="move-chapter-up"||a==="move-chapter-down"){const s=await n.adapter.getArc(t.dataset.arcId),r=(s.phases??[]).find(c=>c.id===t.dataset.phaseId);if(!r)return;const o=Number(t.dataset.index),i=a==="move-chapter-up"?-1:1;return await n.adapter.reorderPhaseChapters(s.id,r.id,yt(r.chapterIds,o,o+i)),f()}if(a==="save-chapter"){const s=t.dataset.chapterId;return await n.adapter.updateChapter(s,{title:document.querySelector("#chapter-title-input").value.trim()||"Untitled Chapter",body:document.querySelector("#chapter-body-input").value}),n.saveStatus="Chapter saved.",f()}if(a==="save-pen-name"){const s=I(),r=document.querySelector("#pen-name-input").value.trim(),o=await n.adapter.updateUserProfile(s.id,{name:s.name,email:s.email,penName:r});return C({...s,penName:o.penName??"",name:o.name??s.name,email:o.email??s.email}),n.saveStatus=r?"Pen name saved.":"Pen name cleared. Account name will be used.",f()}if(a==="delete-story")return ot("story")?(await n.adapter.deleteStory(t.dataset.storyId),n.saveStatus="Story deleted.",$("/creator")):void 0;if(a==="delete-arc")return ot("arc")?(await n.adapter.deleteArc(t.dataset.arcId),n.saveStatus="Arc deleted.",$(`/stories/${t.dataset.storyId}`)):void 0;if(a==="delete-chapter")return ot("chapter")?(await n.adapter.deleteChapter(t.dataset.chapterId),n.saveStatus="Chapter deleted.",$(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}`)):void 0;if(a==="add-external-asset")try{return await Te(t.dataset.chapterId)}catch(s){return n.saveStatus=String(s.message||s),f()}if(a==="toggle-soundtrack"){if(!O())return;n.soundtrack.paused?oe():Pt();return}if(a==="toggle-volume-popout"){if(!O())return;n.soundtrack.volumeOpen=!n.soundtrack.volumeOpen,M();return}});document.addEventListener("change",async e=>{const t=e.target;if(t instanceof HTMLSelectElement&&t.dataset.action==="move-chapter-phase")return await n.adapter.moveChapterToPhase(t.dataset.arcId,t.dataset.chapterId,t.value),n.saveStatus="Chapter moved to another phase.",f()});document.addEventListener("input",e=>{if(e.target instanceof HTMLInputElement&&e.target.dataset.action==="set-volume"){Nt(e.target.value);return}if(e.target.id==="chapter-body-input"){const t=document.querySelector(".markdown-preview");t&&(t.innerHTML=ct(e.target.value||"*Start writing to preview your chapter here.*"))}if(e.target.id==="chapter-title-input"){const t=e.target.value.trim()||"Untitled chapter",a=document.querySelector(".page-title h2");a&&(a.textContent=t)}});document.addEventListener("click",e=>{const t=e.target;t instanceof Element&&(t.closest(".quick-tool-stack")||n.soundtrack.volumeOpen&&(n.soundtrack.volumeOpen=!1,M()))});document.addEventListener("wheel",e=>{const t=e.target;t instanceof Element&&t.closest("[data-wheel-volume='true']")&&O()&&(e.preventDefault(),ie(e.deltaY<0?5:-5))},{passive:!1});document.addEventListener("dragover",e=>{if(n.route.name!=="chapter")return;e.preventDefault(),n.dragActive=!0;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.add("is-active")});document.addEventListener("dragleave",e=>{if(n.route.name!=="chapter"||e.relatedTarget)return;n.dragActive=!1;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active")});document.addEventListener("drop",async e=>{if(n.route.name!=="chapter")return;e.preventDefault();const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active");const a=[...e.dataTransfer.files].filter(s=>s.type.startsWith("image/"));a.length&&await Oe(a)});window.addEventListener("hashchange",()=>{n.saveStatus="",window.scrollTo({top:0,left:0,behavior:"auto"}),f()});async function qe(){const e=Qt();n.authClient=e,n.adapter=await Gt(e),n.authClient.mode==="firebase"?n.authClient.watchAuth(t=>{t?(C({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email,mode:"firebase"}),wt().finally(()=>f())):(C(null),f())}):n.currentUser?.id&&await wt(),window.location.hash?f():$("/")}qe().catch(e=>{it.innerHTML=`
    <main class="content">
      <section class="panel">
        <h2>App failed to start</h2>
        <p class="muted">${l(String(e.message||e))}</p>
        <p class="muted">Current mode: ${l(Zt().mode)}</p>
      </section>
    </main>
  `});
