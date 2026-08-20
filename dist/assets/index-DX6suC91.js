import{g as P,q as T,l as gt,w as U,c as R,s as E,d as p,a as k,b as w,u as m,e as wt,f as vt,i as yt,h as St,j as bt,G as It,o as $t,k as At,m as Ct}from"./firebase-DHuECNiC.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=e(r);fetch(r.href,i)}})();const V="storyforge-state-v1",H="story-demo",q="arc-demo",j="chapter-demo",F="Chapters",M={users:{"demo-user":{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",penName:""}},stories:{[H]:{id:H,title:"The Clockwork Harbor",tags:["fantasy","mystery","serial"],visibility:"public",creatorId:"demo-user",creatorName:"Demo Creator",arcIds:[q],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},arcs:{[q]:{id:q,storyId:H,title:"Tide One",chapterIds:[j],phases:[{id:"phase-demo",title:F,chapterIds:[j]}],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},chapters:{[j]:{id:j,arcId:q,title:"Lanterns on the Pier",body:`# Opening scene

A storm hangs over the harbor while the first lanterns come alive.`,assets:[],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}}};function b(a){return`${a}-${crypto.randomUUID().slice(0,8)}`}function nt(a){return JSON.parse(JSON.stringify(a))}function L(a){return a.flatMap(t=>t.chapterIds??[])}function x(a=[]){return{id:b("phase"),title:F,chapterIds:[...a]}}function A(a){const t=[...a.chapterIds??[]],e=Array.isArray(a.phases)&&a.phases.length?a.phases.map(n=>({id:n.id??b("phase"),title:n.title?.trim()||F,chapterIds:[...n.chapterIds??[]]})):[x(t)],s=new Set;for(const n of e)n.chapterIds=n.chapterIds.filter(o=>!o||s.has(o)?!1:(s.add(o),!0));const r=t.filter(n=>!s.has(n));r.length&&e[0].chapterIds.push(...r);const i=L(e);return{...a,chapterIds:i,phases:e}}function g(){const a=localStorage.getItem(V);if(!a)return localStorage.setItem(V,JSON.stringify(M)),nt(M);try{return JSON.parse(a)}catch{return localStorage.setItem(V,JSON.stringify(M)),nt(M)}}function S(a){localStorage.setItem(V,JSON.stringify(a))}function K(a,t){const e=(a.arcIds??[]).map(s=>t.arcs[s]).filter(Boolean).map(s=>z(s,t));return{...a,arcIds:a.arcIds??[],arcs:e}}function z(a,t){const e=A(a),s=e.chapterIds.map(r=>t.chapters[r]).filter(Boolean);return{...e,chapterIds:e.chapterIds??[],chapters:s,phases:e.phases.map(r=>({...r,chapters:r.chapterIds.map(i=>t.chapters[i]).filter(Boolean)}))}}function _(a,t){const e=a.arcs[t];if(!e)return!1;const s=A(e),r=JSON.stringify({chapterIds:e.chapterIds??[],phases:e.phases??[]})!==JSON.stringify({chapterIds:s.chapterIds,phases:s.phases});return r&&(a.arcs[t]={...a.arcs[t],chapterIds:s.chapterIds,phases:s.phases}),r}function Et(){return{mode:"local",async getUserProfile(a){return a?g().users[a]??null:null},async updateUserProfile(a,t){const e=g(),s=e.users[a]??{id:a,name:t.name??"Creator",email:t.email??"",penName:""};e.users[a]={...s,...t};const r=e.users[a].penName?.trim()||e.users[a].name||"Creator";for(const i of Object.values(e.stories))i.creatorId===a&&(i.creatorName=r);return S(e),e.users[a]},async listCreatorStories(a){if(!a)return[];const t=g();return Object.values(t.stories).filter(e=>e.creatorId===a).sort((e,s)=>s.updatedAt.localeCompare(e.updatedAt)).map(e=>({...e,arcs:(e.arcIds??[]).map(s=>({id:s}))}))},async listBrowserStories(){const a=g();return Object.values(a.stories).filter(t=>t.visibility==="public").sort((t,e)=>t.creatorName.localeCompare(e.creatorName)||t.title.localeCompare(e.title)).map(t=>({...t,arcs:(t.arcIds??[]).map(e=>({id:e}))}))},async getStory(a){const t=g();let e=!1;for(const r of t.stories[a]?.arcIds??[])e=_(t,r)||e;e&&S(t);const s=t.stories[a];return s?K(s,t):null},async getArc(a){const t=g();_(t,a)&&S(t);const s=t.arcs[a];return s?z(s,t):null},async getChapter(a){return g().chapters[a]??null},async createStory({creatorId:a,creatorName:t,title:e,tags:s,visibility:r}){const i=g(),n=b("story"),o=new Date().toISOString();return i.stories[n]={id:n,title:e,tags:s,visibility:r,creatorId:a,creatorName:t,arcIds:[],createdAt:o,updatedAt:o},S(i),K(i.stories[n],i)},async updateStory(a,t){const e=g();if(!e.stories[a])throw new Error("Story not found.");return e.stories[a]={...e.stories[a],...t,updatedAt:new Date().toISOString()},S(e),K(e.stories[a],e)},async createArc(a,t){const e=g(),s=e.stories[a];if(!s)throw new Error("Story not found.");const r=b("arc"),i=new Date().toISOString();return e.arcs[r]={id:r,storyId:a,title:t,chapterIds:[],phases:[x()],createdAt:i,updatedAt:i},s.arcIds.push(r),s.updatedAt=i,S(e),z(e.arcs[r],e)},async updateArc(a,t){const e=g(),s=e.arcs[a];if(!s)throw new Error("Arc not found.");return s.title=t.title??s.title,s.phases=t.phases??s.phases,s.chapterIds=t.chapterIds??s.chapterIds,s.updatedAt=new Date().toISOString(),e.stories[s.storyId].updatedAt=s.updatedAt,S(e),z(s,e)},async reorderArcs(a,t){const e=g();e.stories[a].arcIds=[...t],e.stories[a].updatedAt=new Date().toISOString(),S(e)},async createChapter(a,t){const e=g(),s=e.arcs[a];if(!s)throw new Error("Arc not found.");const r=b("chapter"),i=new Date().toISOString();return e.chapters[r]={id:r,arcId:a,title:t,body:"",assets:[],createdAt:i,updatedAt:i},s.chapterIds.push(r),s.phases?.length||(s.phases=[x()]),s.phases[0].chapterIds.push(r),s.updatedAt=i,e.stories[s.storyId].updatedAt=i,S(e),e.chapters[r]},async updateChapter(a,t){const e=g();if(!e.chapters[a])throw new Error("Chapter not found.");e.chapters[a]={...e.chapters[a],...t,updatedAt:new Date().toISOString()};const s=e.arcs[e.chapters[a].arcId];return s&&(s.updatedAt=e.chapters[a].updatedAt,e.stories[s.storyId].updatedAt=s.updatedAt),S(e),e.chapters[a]},async updateChapterOrder(a,t){const e=g();e.arcs[a].chapterIds=[...t],e.arcs[a].updatedAt=new Date().toISOString(),e.stories[e.arcs[a].storyId].updatedAt=e.arcs[a].updatedAt,S(e)},async createPhase(a,t){const e=g();_(e,a);const s=e.arcs[a],r={id:b("phase"),title:t?.trim()||"New Phase",chapterIds:[]};return s.phases.push(r),s.updatedAt=new Date().toISOString(),e.stories[s.storyId].updatedAt=s.updatedAt,S(e),r},async renamePhase(a,t,e){const s=g();_(s,a);const r=s.arcs[a],i=r.phases.find(n=>n.id===t);if(!i)throw new Error("Phase not found.");return i.title=e?.trim()||F,r.updatedAt=new Date().toISOString(),s.stories[r.storyId].updatedAt=r.updatedAt,S(s),i},async moveChapterToPhase(a,t,e){const s=g();_(s,a);const r=s.arcs[a];for(const n of r.phases)n.chapterIds=n.chapterIds.filter(o=>o!==t);const i=r.phases.find(n=>n.id===e);if(!i)throw new Error("Phase not found.");i.chapterIds.push(t),r.chapterIds=L(r.phases),r.updatedAt=new Date().toISOString(),s.stories[r.storyId].updatedAt=r.updatedAt,S(s)},async reorderPhaseChapters(a,t,e){const s=g();_(s,a);const r=s.arcs[a],i=r.phases.find(n=>n.id===t);if(!i)throw new Error("Phase not found.");i.chapterIds=[...e],r.chapterIds=L(r.phases),r.updatedAt=new Date().toISOString(),s.stories[r.storyId].updatedAt=r.updatedAt,S(s)},async deleteChapter(a){const t=g(),e=t.chapters[a];if(!e)return;const s=t.arcs[e.arcId];if(s){s.chapterIds=(s.chapterIds??[]).filter(i=>i!==a),s.phases=(s.phases??[]).map(i=>({...i,chapterIds:(i.chapterIds??[]).filter(n=>n!==a)})),s.updatedAt=new Date().toISOString();const r=t.stories[s.storyId];r&&(r.updatedAt=s.updatedAt)}delete t.chapters[a],S(t)},async deleteArc(a){const t=g(),e=t.arcs[a];if(!e)return;for(const r of e.chapterIds??[])delete t.chapters[r];const s=t.stories[e.storyId];s&&(s.arcIds=(s.arcIds??[]).filter(r=>r!==a),s.updatedAt=new Date().toISOString()),delete t.arcs[a],S(t)},async deleteStory(a){const t=g(),e=t.stories[a];if(e){for(const s of e.arcIds??[]){const r=t.arcs[s];for(const i of r?.chapterIds??[])delete t.chapters[i];delete t.arcs[s]}delete t.stories[a],S(t)}}}}function Y(a){return{...a,arcIds:a.arcIds??[],tags:a.tags??[],arcs:(a.arcIds??[]).map(t=>({id:t}))}}function y(a){return a.exists()?{id:a.id,...a.data()}:null}function G(a,t){const e=new Map(t.map((s,r)=>[s,r]));return[...a].sort((s,r)=>(e.get(s.id)??0)-(e.get(r.id)??0))}async function Z(a,t){const e=await w(p(a,"stories",t)),s=y(e);if(!s)return null;const r=await P(T(R(a,"arcs"),U("storyId","==",t))),i=[];for(const d of G(r.docs.map(l=>({id:l.id,...l.data(),chapterIds:l.data().chapterIds??[]})),s.arcIds??[])){const l=A(d);JSON.stringify({chapterIds:d.chapterIds??[],phases:d.phases??[]})!==JSON.stringify({chapterIds:l.chapterIds,phases:l.phases})&&await m(p(a,"arcs",d.id),{chapterIds:l.chapterIds,phases:l.phases}),i.push(l)}const n=await Promise.all(i.map(async d=>{const l=await P(T(R(a,"chapters"),U("arcId","==",d.id)));return[d.id,G(l.docs.map(h=>({id:h.id,...h.data(),assets:h.data().assets??[]})),d.chapterIds??[])]})),o=Object.fromEntries(n);return{...s,tags:s.tags??[],arcIds:s.arcIds??[],arcs:i.map(d=>({...d,chapterIds:d.chapterIds??[],phases:d.phases.map(l=>({...l,chapters:(o[d.id]??[]).filter(h=>(l.chapterIds??[]).includes(h.id))})),chapters:o[d.id]??[]}))}}async function W(a,t){if(!t?.id)return;const e=p(a,"users",t.id),s=await w(e),r={id:t.id,name:t.name??"Creator",email:t.email??"",penName:t.penName??(s.exists()?s.data().penName:"")??"",structureView:t.structureView??(s.exists()?s.data().structureView:"list")??"list",updatedAt:new Date().toISOString()};if(s.exists()){await m(e,r);return}await E(e,{...r,createdAt:new Date().toISOString()})}function Ot(a){const t=a.db;return{mode:"firebase",async getUserProfile(e){if(!e)return null;const s=await w(p(t,"users",e));return y(s)},async updateUserProfile(e,s){const r=p(t,"users",e),i=await w(r),n={id:e,updatedAt:new Date().toISOString(),...s};i.exists()?await m(r,n):await E(r,{createdAt:new Date().toISOString(),...n});const o=await w(r),d=y(o),l=d?.penName?.trim()||d?.name||"Creator",h=await P(T(R(t,"stories"),U("creatorId","==",e)));return await Promise.all(h.docs.map(v=>m(p(t,"stories",v.id),{creatorName:l}))),d},async listCreatorStories(e){return e?(await P(T(R(t,"stories"),U("creatorId","==",e)))).docs.map(r=>Y({id:r.id,...r.data()})).sort((r,i)=>String(i.updatedAt).localeCompare(String(r.updatedAt))):[]},async listBrowserStories(){return(await P(T(R(t,"stories"),U("visibility","==","public")))).docs.map(s=>Y({id:s.id,...s.data()})).sort((s,r)=>s.creatorName.localeCompare(r.creatorName)||s.title.localeCompare(r.title))},async getStory(e){return Z(t,e)},async getArc(e){const s=await w(p(t,"arcs",e)),r=y(s),i=r?A(r):null;if(!i)return null;JSON.stringify({chapterIds:r.chapterIds??[],phases:r.phases??[]})!==JSON.stringify({chapterIds:i.chapterIds,phases:i.phases})&&await m(p(t,"arcs",e),{chapterIds:i.chapterIds,phases:i.phases});const n=await P(T(R(t,"chapters"),U("arcId","==",e)));return{...i,chapterIds:i.chapterIds??[],phases:i.phases.map(o=>({...o,chapters:G(n.docs.map(d=>({id:d.id,...d.data(),assets:d.data().assets??[]})),o.chapterIds??[])})),chapters:G(n.docs.map(o=>({id:o.id,...o.data(),assets:o.data().assets??[]})),i.chapterIds??[])}},async getChapter(e){const s=await w(p(t,"chapters",e)),r=y(s);return r?{...r,assets:r.assets??[]}:null},async createStory({creatorId:e,creatorName:s,title:r,tags:i,visibility:n}){const o=b("story"),d=new Date().toISOString(),l={id:o,title:r,tags:i,visibility:n,creatorId:e,creatorName:s,arcIds:[],createdAt:d,updatedAt:d};return await E(p(t,"stories",o),l),await W(t,{id:e,name:s}),Y(l)},async updateStory(e,s){return await m(p(t,"stories",e),{...s,updatedAt:new Date().toISOString()}),Z(t,e)},async createArc(e,s){const r=p(t,"stories",e),i=await w(r),n=y(i);if(!n)throw new Error("Story not found.");const o=b("arc"),d=new Date().toISOString(),l={id:o,storyId:e,title:s,chapterIds:[],phases:[x()],createdAt:d,updatedAt:d};return await E(p(t,"arcs",o),l),await m(r,{arcIds:[...n.arcIds??[],o],updatedAt:d}),l},async updateArc(e,s){const r=p(t,"arcs",e),i=new Date().toISOString();await m(r,{...s,updatedAt:i});const n=await w(r),o=y(n);return o?.storyId&&await m(p(t,"stories",o.storyId),{updatedAt:i}),this.getArc(e)},async reorderArcs(e,s){await m(p(t,"stories",e),{arcIds:s,updatedAt:new Date().toISOString()})},async createChapter(e,s){const r=p(t,"arcs",e),i=await w(r),n=y(i);if(!n)throw new Error("Arc not found.");const o=b("chapter"),d=new Date().toISOString(),l={id:o,arcId:e,title:s,body:"",assets:[],createdAt:d,updatedAt:d};await E(p(t,"chapters",o),l);const h=A(n);return h.phases.length||(h.phases=[x()]),h.phases[0].chapterIds.push(o),await m(r,{chapterIds:[...n.chapterIds??[],o],phases:h.phases,updatedAt:d}),await m(p(t,"stories",n.storyId),{updatedAt:d}),l},async updateChapter(e,s){const r=p(t,"chapters",e),i=new Date().toISOString();await m(r,{...s,updatedAt:i});const n=await w(r),o=y(n);if(o?.arcId){const d=await w(p(t,"arcs",o.arcId)),l=y(d);l&&(await m(p(t,"arcs",l.id),{updatedAt:i}),await m(p(t,"stories",l.storyId),{updatedAt:i}))}return this.getChapter(e)},async updateChapterOrder(e,s){const r=p(t,"arcs",e),i=new Date().toISOString();await m(r,{chapterIds:s,updatedAt:i});const n=await w(r),o=y(n);o?.storyId&&await m(p(t,"stories",o.storyId),{updatedAt:i})},async createPhase(e,s){const r=p(t,"arcs",e),i=await w(r),n=y(i),o=n?A(n):null;if(!o)throw new Error("Arc not found.");const d={id:b("phase"),title:s?.trim()||"New Phase",chapterIds:[]},l=[...o.phases,d],h=new Date().toISOString();return await m(r,{phases:l,chapterIds:L(l),updatedAt:h}),await m(p(t,"stories",o.storyId),{updatedAt:h}),d},async renamePhase(e,s,r){const i=p(t,"arcs",e),n=await w(i),o=y(n),d=o?A(o):null;if(!d)throw new Error("Arc not found.");const l=d.phases.map(v=>v.id===s?{...v,title:r?.trim()||F}:v),h=new Date().toISOString();return await m(i,{phases:l,updatedAt:h}),await m(p(t,"stories",d.storyId),{updatedAt:h}),l.find(v=>v.id===s)},async moveChapterToPhase(e,s,r){const i=p(t,"arcs",e),n=await w(i),o=y(n),d=o?A(o):null;if(!d)throw new Error("Arc not found.");const l=d.phases.map(N=>({...N,chapterIds:(N.chapterIds??[]).filter(J=>J!==s)})),h=l.find(N=>N.id===r);if(!h)throw new Error("Phase not found.");h.chapterIds.push(s);const v=new Date().toISOString();await m(i,{phases:l,chapterIds:L(l),updatedAt:v}),await m(p(t,"stories",d.storyId),{updatedAt:v})},async reorderPhaseChapters(e,s,r){const i=p(t,"arcs",e),n=await w(i),o=y(n),d=o?A(o):null;if(!d)throw new Error("Arc not found.");const l=d.phases.map(v=>v.id===s?{...v,chapterIds:[...r]}:v),h=new Date().toISOString();await m(i,{phases:l,chapterIds:L(l),updatedAt:h}),await m(p(t,"stories",d.storyId),{updatedAt:h})},async deleteChapter(e){const s=await w(p(t,"chapters",e)),r=y(s);if(!r)return;const i=p(t,"arcs",r.arcId),n=await w(i),o=y(n),d=new Date().toISOString();o&&(await m(i,{chapterIds:(o.chapterIds??[]).filter(l=>l!==e),phases:(o.phases??[]).map(l=>({...l,chapterIds:(l.chapterIds??[]).filter(h=>h!==e)})),updatedAt:d}),await m(p(t,"stories",o.storyId),{updatedAt:d})),await k(p(t,"chapters",e))},async deleteArc(e){const s=await w(p(t,"arcs",e)),r=y(s);if(!r)return;for(const d of r.chapterIds??[])await k(p(t,"chapters",d));const i=p(t,"stories",r.storyId),n=await w(i),o=y(n);o&&await m(i,{arcIds:(o.arcIds??[]).filter(d=>d!==e),updatedAt:new Date().toISOString()}),await k(p(t,"arcs",e))},async deleteStory(e){const s=await Z(t,e);if(s){for(const r of s.arcs??[]){for(const i of r.chapters??[])await k(p(t,"chapters",i.id));await k(p(t,"arcs",r.id))}await k(p(t,"stories",e))}},async seedDemoStory(e){if(!e?.id)return;if(!(await P(T(R(t,"stories"),U("creatorId","==",e.id),gt(1)))).empty){await W(t,e);return}const r=b("story"),i=b("arc"),n=b("chapter"),o=new Date().toISOString();await E(p(t,"stories",r),{id:r,title:"Your First Story",tags:["draft"],visibility:"private",creatorId:e.id,creatorName:e.name??"Creator",arcIds:[i],createdAt:o,updatedAt:o}),await E(p(t,"arcs",i),{id:i,storyId:r,title:"Opening Arc",chapterIds:[n],phases:[{id:b("phase"),title:F,chapterIds:[n]}],createdAt:o,updatedAt:o}),await E(p(t,"chapters",n),{id:n,arcId:i,title:"Chapter One",body:`# Welcome

This story is now stored in Firestore.`,assets:[],createdAt:o,updatedAt:o}),await W(t,e)}}}async function Dt(a){return a?.mode==="firebase"&&a.db?Ot(a):Et()}const Nt={VITE_APP_MODE:"firebase",VITE_FIREBASE_API_KEY:"AIzaSyC8-b4_lzrCk2RhsqSEMkcxNKgMzVx_WJ4",VITE_FIREBASE_APP_ID:"1:309677315541:web:ef90a15da4ee29c03fd95c",VITE_FIREBASE_AUTH_DOMAIN:"ulunavir-tales.firebaseapp.com",VITE_FIREBASE_MESSAGING_SENDER_ID:"309677315541",VITE_FIREBASE_PROJECT_ID:"ulunavir-tales",VITE_FIREBASE_STORAGE_BUCKET:"ulunavir-tales.firebasestorage.app"},tt={mode:"local",firebase:{apiKey:"",authDomain:"",projectId:"",appId:"",storageBucket:"",messagingSenderId:""}};function Pt(){const a=Nt??{};return{mode:a.VITE_APP_MODE??tt.mode,firebase:{apiKey:a.VITE_FIREBASE_API_KEY??"",authDomain:a.VITE_FIREBASE_AUTH_DOMAIN??"",projectId:a.VITE_FIREBASE_PROJECT_ID??"",appId:a.VITE_FIREBASE_APP_ID??"",storageBucket:a.VITE_FIREBASE_STORAGE_BUCKET??"",messagingSenderId:a.VITE_FIREBASE_MESSAGING_SENDER_ID??""}}}function ut(){const a=globalThis.STORYFORGE_CONFIG??{},t=Pt();return{...tt,...t,...a,firebase:{...tt.firebase,...t.firebase,...a.firebase??{}}}}function Tt(a){return a.mode==="firebase"&&!!(a.firebase.projectId&&a.firebase.apiKey&&a.firebase.appId)}function Ut(){const a=ut();if(!Tt(a))return{mode:"local",auth:null,db:null,signIn:async()=>null,signOut:async()=>null,watchAuth:i=>(i(null),()=>{})};const t=wt().length?vt():yt(a.firebase),e=St(t),s=bt(t),r=new It;return{mode:"firebase",auth:e,db:s,signIn:async()=>(await Ct(e,r)).user,signOut:async()=>At(e),watchAuth:i=>$t(e,i)}}function Rt(){return ut()}const et=document.querySelector("#app"),c={adapter:null,authClient:null,currentUser:JSON.parse(localStorage.getItem("storyforge-session")??"null"),route:{name:"home",params:{}},dragActive:!1,saveStatus:"",authError:""};function ht(a=I()){return a?a.penName?.trim()||a.name||"Creator":"Guest"}function mt(a=I()){return a?.structureView==="grid"?"grid":"list"}function C(a){c.currentUser=a,localStorage.setItem("storyforge-session",JSON.stringify(a))}function $(a){const t=`#${a}`;if(window.location.hash===t){f();return}window.location.hash=a}function kt(){const a=window.location.hash.replace(/^#/,"")||"/",[t]=a.split("?"),e=t.split("/").filter(Boolean);return e.length===0?{name:"home",params:{}}:e[0]==="creator"?{name:"creator",params:{}}:e[0]==="browser"?{name:"browser",params:{}}:e[0]==="settings"?{name:"settings",params:{}}:e[0]==="stories"&&e[1]?e[2]==="arcs"&&e[3]&&e[4]==="chapters"&&e[5]?{name:"chapter",params:{storyId:e[1],arcId:e[3],chapterId:e[5]}}:e[2]==="arcs"&&e[3]?{name:"arc",params:{storyId:e[1],arcId:e[3]}}:{name:"story",params:{storyId:e[1]}}:{name:"not-found",params:{}}}function B(){return new URLSearchParams(window.location.hash.split("?")[1]??"")}function I(){return c.currentUser?c.currentUser:c.authClient?.mode==="firebase"?null:{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",mode:"demo",structureView:"list"}}function st(a){return!!(a?.creatorId&&I()?.id&&a.creatorId===I().id)}function u(a){return a.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function at(a){return u(a).replace(/```([\s\S]*?)```/g,(l,h)=>`<pre><code>${h.trim()}</code></pre>`).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<p><img alt="$1" src="$2" /></p>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/(?:^|\n)- (.*(?:\n- .*)*)/g,l=>`
<ul>${l.trim().split(`
`).map(v=>v.replace(/^- /,"").trim()).map(v=>`<li>${v}</li>`).join("")}</ul>`).split(/\n{2,}/).map(l=>/^<(h\d|ul|pre|p)/.test(l.trim())?l:`<p>${l.replace(/\n/g,"<br />")}</p>`).join("")}function rt(a){return new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short"}).format(new Date(a))}function _t(a,t,e){if(!t)return a;const s=t.toLowerCase();return a.filter(r=>e(r).toLowerCase().includes(s))}function Lt(a){return[...new Set(a.flatMap(t=>t.tags))].sort((t,e)=>t.localeCompare(e))}function D(a,t){const e=I(),s=c.authError?`<div class="notice"><strong>Sign-in error</strong><div class="muted">${u(c.authError)}</div></div>`:"";et.innerHTML=`
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
            ${Q("/","Main Menu",t==="home")}
            ${Q("/creator","Creator",t==="creator")}
            ${Q("/browser","Browser",t==="browser")}
          </nav>
        </div>
        <div class="stack">
          <button class="notice account-card" data-action="open-settings" ${e?"":"disabled"}>
            <strong>${u(ht(e))}</strong>
            <div class="muted">${u(e?.email??(c.authClient?.mode==="firebase"?"Sign in to create and manage stories":"Local demo mode"))}</div>
          </button>
          <button class="login-button" data-action="toggle-login">
            ${c.currentUser?"Log out":"Log in"}
          </button>
        </div>
      </aside>
      <main class="content">${a}</main>
    </div>
  `,s&&et.querySelector(".content").insertAdjacentHTML("afterbegin",s)}async function Ft(){const a=I();if(!a)return O("Sign in to manage account settings.");D(`
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
            <div class="muted">${u(a.name??"Creator")}</div>
          </div>
          <div class="inline-form settings-form">
            <input id="pen-name-input" placeholder="${u(a.name??"Creator")}" value="${u(a.penName??"")}" />
            <button class="ghost-button" data-action="save-pen-name">Save pen name</button>
          </div>
          <div class="muted">
            Leave it empty to fall back to your account name.
          </div>
        </section>
      </div>
    `,"home")}function Q(a,t,e){return`<a class="nav-link ${e?"is-active":""}" href="#${a}"><span>${t}</span></a>`}function xt(){return`
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
  `}async function Bt(){D(`
      <div class="stack">
        ${xt()}
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
    `,"home")}async function qt(){const a=I(),t=await c.adapter.listCreatorStories(a?.id),e=B(),s=e.get("q")??"",r=e.get("tag")??"",i=_t(t,s,d=>`${d.title} ${d.tags.join(" ")}`).filter(d=>r?d.tags.includes(r):!0),n=Lt(t),o=c.authClient?.mode==="firebase"&&!a?'<div class="notice">Sign in with Firebase to create, edit, and manage your own stories.</div>':"";D(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Creator</h2>
            <p class="muted">Manage your stories, search by title, and filter by tags.</p>
          </div>
          <button class="primary-button" data-action="create-story" ${a?"":"disabled"}>Create</button>
        </div>
        ${o}
        <section class="panel stack">
          <div class="search-row">
            <input id="story-search" placeholder="Search by story title or tag" value="${u(s)}" />
            <select id="story-tag-filter">
              <option value="">All tags</option>
              ${n.map(d=>`<option value="${u(d)}" ${r===d?"selected":""}>${u(d)}</option>`).join("")}
            </select>
            <button class="ghost-button" data-action="apply-story-filters">Filter</button>
          </div>
          <div class="chip-row">
            ${n.map(d=>`<a class="pill" href="#/creator?tag=${encodeURIComponent(d)}">${u(d)}</a>`).join("")}
          </div>
        </section>
        <section class="story-list">
          ${i.length?i.map(jt).join(""):'<div class="empty-state">No stories match this filter yet.</div>'}
        </section>
      </div>
    `,"creator")}function jt(a){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${u(a.title)}</h3>
          <p class="muted">Updated ${rt(a.updatedAt)}</p>
        </div>
        <span class="status-pill">${u(a.visibility)}</span>
      </div>
      <div class="chip-row">
        ${a.tags.map(t=>`<span class="pill">${u(t)}</span>`).join("")}
      </div>
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${a.id}">Open story</a>
        <span class="pill">${a.arcs.length} arc(s)</span>
        <button class="danger-button" data-action="delete-story" data-story-id="${a.id}">Delete</button>
      </div>
    </article>
  `}async function Mt(){const a=await c.adapter.listBrowserStories(I()?.id),t=B(),e=t.get("group")!=="flat",s=t.get("creator")??"",r=s?a.filter(o=>o.creatorName===s):a,i=[...new Set(a.map(o=>o.creatorName))];let n="";r.length?e?n=i.filter(o=>!s||o===s).map(o=>{const d=r.filter(l=>l.creatorName===o);return d.length?`
          <section class="panel stack">
            <div class="section-header">
              <h3>${u(o)}</h3>
              <span class="pill">${d.length} public stories</span>
            </div>
            <div class="story-list">${d.map(ot).join("")}</div>
          </section>
        `:""}).join(""):n=`<section class="story-list">${r.map(ot).join("")}</section>`:n='<div class="empty-state">No public stories are available yet.</div>',D(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Browser</h2>
            <p class="muted">Explore public stories and browse them by creator.</p>
          </div>
          <div class="toolbar">
            <select id="browser-creator-filter">
              <option value="">All creators</option>
              ${i.map(o=>`<option value="${u(o)}" ${s===o?"selected":""}>${u(o)}</option>`).join("")}
            </select>
            <select id="browser-group-mode">
              <option value="grouped" ${e?"selected":""}>Grouped by creator</option>
              <option value="flat" ${e?"":"selected"}>Flat list</option>
            </select>
            <button class="ghost-button" data-action="apply-browser-filters">Apply</button>
          </div>
        </div>
        ${n}
      </div>
    `,"browser")}function ot(a){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${u(a.title)}</h3>
          <p class="muted">by ${u(a.creatorName)}</p>
        </div>
        <span class="pill">${a.arcs.length} arc(s)</span>
      </div>
      <div class="chip-row">
        ${a.tags.map(t=>`<span class="pill">${u(t)}</span>`).join("")}
      </div>
      <a class="primary-button" href="#/stories/${a.id}?view=browser">Read structure</a>
    </article>
  `}async function Vt(a){const t=await c.adapter.getStory(a);if(!t)return O("Story not found.");const e=st(t),s=B().get("view")==="browser",r=mt();if(t.visibility==="private"&&!e)return O("This story is private.");D(`
      <div class="stack">
        ${it([[s?"#/browser":"#/creator",s?"Browser":"Creator"],["",t.title]])}
        <div class="page-title">
          <div>
            <h2>${u(t.title)}</h2>
            <p class="muted">Set visibility, manage arcs, and organize the reading order.</p>
          </div>
          <div class="card-actions">
            <div class="view-toggle" role="group" aria-label="Structure view">
              <button class="ghost-button ${r==="grid"?"is-active":""}" data-action="set-structure-view" data-view="grid">Compact Grid</button>
              <button class="ghost-button ${r==="list"?"is-active":""}" data-action="set-structure-view" data-view="list">List</button>
            </div>
            ${s&&e?'<a class="ghost-button" href="#/stories/'+t.id+'">Edit</a>':""}
            ${e&&!s?'<button class="primary-button" data-action="create-arc" data-story-id="'+t.id+'">New arc</button>':""}
          </div>
        </div>
        <section class="panel stack">
          <div class="inline-form">
            <input id="story-title-input" value="${u(t.title)}" ${e?"":"disabled"} />
            <input id="story-tags-input" value="${u(t.tags.join(", "))}" ${e?"":"disabled"} />
            <select id="story-visibility-input" ${e?"":"disabled"}>
              ${["public","unlisted","private"].map(i=>`<option value="${i}" ${t.visibility===i?"selected":""}>${i}</option>`).join("")}
            </select>
            ${e?'<button class="ghost-button" data-action="save-story-settings" data-story-id="'+t.id+'">Save</button>':""}
          </div>
          <div class="notice">
            <strong>${u(t.creatorName)}</strong>
            <div class="muted">Created ${rt(t.createdAt)}. Visibility is currently ${u(t.visibility)}.</div>
          </div>
        </section>
        <section class="nested-list ${r==="list"?"is-list-view":""}">
          ${t.arcs.length?t.arcs.map((i,n)=>zt(i,t,e,n,s)).join(""):'<div class="empty-state">No arcs yet. Create the first arc to start structuring this story.</div>'}
        </section>
      </div>
    `,s?"browser":e?"creator":"browser")}function zt(a,t,e,s,r=!1){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${u(a.title)}</h3>
          <p class="muted">${a.chapters.length} chapter(s)</p>
        </div>
        ${e?`
          <div class="order-buttons">
            <button class="small-button" data-action="move-arc-up" data-story-id="${t.id}" data-index="${s}" ${s===0?"disabled":""}>↑</button>
            <button class="small-button" data-action="move-arc-down" data-story-id="${t.id}" data-index="${s}" ${s===t.arcs.length-1?"disabled":""}>↓</button>
          </div>`:""}
      </div>
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${t.id}/arcs/${a.id}${r?"?view=browser":""}">Open arc</a>
        ${e&&!r?`<button class="danger-button" data-action="delete-arc" data-story-id="${t.id}" data-arc-id="${a.id}">Delete</button>`:""}
      </div>
    </article>
  `}function Gt(a,t,e=!1,s=""){return`
    <div class="phase-separator">
      <span class="phase-line"></span>
      ${t&&!e?`<button class="phase-title" data-action="rename-phase" data-arc-id="${s}" data-phase-id="${a.id}" data-phase-title="${u(a.title)}">${u(a.title)}</button>`:`<span class="phase-title">${u(a.title)}</span>`}
      <span class="phase-line"></span>
    </div>
  `}async function Jt(a,t){const[e,s]=await Promise.all([c.adapter.getStory(a),c.adapter.getArc(t)]);if(!e||!s)return O("Arc not found.");const r=st(e),i=B().get("view")==="browser",n=mt();if(e.visibility==="private"&&!r)return O("This story is private.");const o=(s.phases??[]).map(d=>`
    <section class="phase-block stack">
      ${Gt(d,r,i,s.id)}
      <div class="nested-list ${n==="list"?"is-list-view":""}">
        ${d.chapters.length?d.chapters.map((l,h)=>Ht(l,e,s,r,h,i,d)).join(""):'<div class="empty-state">No chapters in this phase yet.</div>'}
      </div>
    </section>
  `).join("");D(`
      <div class="stack">
        ${it([[i?"#/browser":r?"#/creator":"#/browser",i?"Browser":r?"Creator":"Browser"],["#/stories/"+e.id+(i?"?view=browser":""),e.title],["",s.title]])}
        <div class="page-title">
          <div>
            <h2>${u(s.title)}</h2>
            <p class="muted">Manage the chapter list and reading order for this arc.</p>
          </div>
          <div class="card-actions">
            <div class="view-toggle" role="group" aria-label="Structure view">
              <button class="ghost-button ${n==="grid"?"is-active":""}" data-action="set-structure-view" data-view="grid">Compact Grid</button>
              <button class="ghost-button ${n==="list"?"is-active":""}" data-action="set-structure-view" data-view="list">List</button>
            </div>
            ${i&&r?'<a class="ghost-button" href="#/stories/'+e.id+"/arcs/"+s.id+'">Edit</a>':""}
            ${r&&!i?'<button class="ghost-button" data-action="create-phase" data-arc-id="'+s.id+'">New phase</button>':""}
            ${r&&!i?'<button class="primary-button" data-action="create-chapter" data-arc-id="'+s.id+'" data-story-id="'+e.id+'">New chapter</button>':""}
          </div>
        </div>
        ${r&&!i?`
          <section class="panel">
            <div class="inline-form">
              <input id="arc-title-input" value="${u(s.title)}" />
              <button class="ghost-button" data-action="save-arc-title" data-arc-id="${s.id}" data-story-id="${e.id}">Rename arc</button>
            </div>
        </section>`:""}
        ${o||'<div class="empty-state">No chapters yet. Add one to begin writing.</div>'}
      </div>
    `,i?"browser":r?"creator":"browser")}function Ht(a,t,e,s,r,i=!1,n=null){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${u(a.title||"Untitled chapter")}</h3>
          <p class="muted">Updated ${rt(a.updatedAt)}</p>
        </div>
        ${s&&!i?`
          <div class="order-buttons">
            <button class="small-button" data-action="move-chapter-up" data-arc-id="${e.id}" data-phase-id="${n?.id??""}" data-index="${r}" ${r===0?"disabled":""}>↑</button>
            <button class="small-button" data-action="move-chapter-down" data-arc-id="${e.id}" data-phase-id="${n?.id??""}" data-index="${r}" ${n&&r===n.chapters.length-1?"disabled":""}>↓</button>
          </div>`:""}
      </div>
      ${s&&!i?`<select class="phase-select" data-action="move-chapter-phase" data-arc-id="${e.id}" data-chapter-id="${a.id}">
              ${(e.phases??[]).map(o=>`<option value="${o.id}" ${o.id===n?.id?"selected":""}>${u(o.title)}</option>`).join("")}
            </select>`:""}
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${t.id}/arcs/${e.id}/chapters/${a.id}${i?"?view=browser":""}">Open chapter</a>
        ${s&&!i?`<button class="danger-button" data-action="delete-chapter" data-story-id="${t.id}" data-arc-id="${e.id}" data-chapter-id="${a.id}">Delete</button>`:""}
      </div>
    </article>
  `}function Kt(a,t,e,s,r=!1){return!e&&!s?"":`
    <div class="chapter-pager">
      ${e?`<a class="ghost-button" href="#/stories/${a}/arcs/${t}/chapters/${e.id}${r?"?view=browser":""}">Previous Chapter</a>`:""}
      ${s?`<a class="ghost-button" href="#/stories/${a}/arcs/${t}/chapters/${s.id}${r?"?view=browser":""}">Next Chapter</a>`:""}
    </div>
  `}async function Yt(a,t,e){const[s,r,i]=await Promise.all([c.adapter.getStory(a),c.adapter.getArc(t),c.adapter.getChapter(e)]);if(!s||!r||!i)return O("Chapter not found.");const n=st(s),o=B().get("view")==="browser";if(s.visibility==="private"&&!n)return O("This story is private.");const d=i.assets??[],l=(r.chapters??[]).findIndex(ft=>ft.id===e),h=l>0?r.chapters[l-1]:null,v=l>=0&&l<r.chapters.length-1?r.chapters[l+1]:null,N=Kt(s.id,r.id,h,v,o),J=n&&!o?`
        <div class="editor-shell">
          <section class="editor-pane">
            <div class="editor-controls">
              <input id="chapter-title-input" value="${u(i.title)}" ${n?"":"disabled"} />
              <textarea id="chapter-body-input" class="markdown-area" ${n?"":"disabled"}>${u(i.body)}</textarea>
              ${n?`
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
                ${d.length?d.map(ct).join(""):'<div class="empty-state">No assets in this chapter yet.</div>'}
              </div>
              <div class="notice mono">${u(c.saveStatus||"Tip: use `![alt](image-url)` to place pasted external images into the chapter body.")}</div>
            </div>
          </section>
          <section class="preview-pane">
            <h3>Preview</h3>
            <div class="markdown-preview">${at(i.body||"*Start writing to preview your chapter here.*")}</div>
          </section>
        </div>
      `:`
        <section class="panel stack">
          <div class="section-header">
            <h3>Reading view</h3>
            <span class="pill">${d.length} asset(s)</span>
          </div>
          <div class="markdown-preview">${at(i.body||"*This chapter is empty.*")}</div>
        </section>
        ${d.length?`<section class="panel stack"><h3>Referenced images</h3><div class="asset-list">${d.map(ct).join("")}</div></section>`:""}
      `;D(`
      <div class="stack">
        ${it([[o?"#/browser":n?"#/creator":"#/browser",o?"Browser":n?"Creator":"Browser"],["#/stories/"+s.id+(o?"?view=browser":""),s.title],["#/stories/"+s.id+"/arcs/"+r.id+(o?"?view=browser":""),r.title],["",i.title||"Untitled chapter"]])}
        <div class="page-title">
          <div>
            <h2>${u(i.title||"Untitled chapter")}</h2>
            <p class="muted">${n&&!o?"Write in markdown, add image links, and save your draft.":"Read this chapter in a clean, read-only view."}</p>
          </div>
          <div class="card-actions">
            ${o&&n?`<a class="ghost-button" href="#/stories/${s.id}/arcs/${r.id}/chapters/${i.id}">Edit</a>`:""}
            ${n&&!o?`<button class="primary-button" data-action="save-chapter" data-chapter-id="${i.id}">Save</button>`:""}
          </div>
        </div>
        ${N}
        ${J}
        ${N}
      </div>
    `,o?"browser":n?"creator":"browser")}function ct(a){const t=a.url??a.dataUrl??"";return`
    <article class="asset-item">
      ${!!t?`<img src="${t}" alt="${u(a.name)}" />`:""}
      <strong>${u(a.name)}</strong>
      <div class="muted mono">![${u(a.name)}](${t})</div>
    </article>
  `}function O(a){D(`
      <div class="stack">
        <section class="panel">
          <h2>Not found</h2>
          <p class="muted">${u(a)}</p>
        </section>
      </div>
    `,"home")}function it(a){return`<div class="breadcrumbs">${a.map(([t,e])=>t?`<a href="${t}">${u(e)}</a>`:`<span>${u(e)}</span>`).join("<span>/</span>")}</div>`}async function f(){switch(c.route=kt(),c.route.name){case"home":return Bt();case"creator":return qt();case"browser":return Mt();case"settings":return Ft();case"story":return Vt(c.route.params.storyId);case"arc":return Jt(c.route.params.storyId,c.route.params.arcId);case"chapter":return Yt(c.route.params.storyId,c.route.params.arcId,c.route.params.chapterId);default:return O("This page does not exist.")}}function Zt(){return{title:document.querySelector("#story-title-input")?.value.trim()??"",tags:(document.querySelector("#story-tags-input")?.value??"").split(",").map(a=>a.trim()).filter(Boolean),visibility:document.querySelector("#story-visibility-input")?.value??"private"}}function dt(a,t,e){const s=[...a],[r]=s.splice(t,1);return s.splice(e,0,r),s}async function lt(){if(c.currentUser)return await c.authClient.signOut(),C(null),c.saveStatus="Signed out.",c.authError="",f();if(c.authClient.mode==="firebase")try{const t=await c.authClient.signIn();return await c.adapter.seedDemoStory?.({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email}),C({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email,mode:"firebase",structureView:"list"}),c.authError="",c.saveStatus="Signed in with Firebase.",f()}catch(t){return console.error("Firebase sign-in failed:",t),c.saveStatus="",c.authError=Wt(t),f()}const a=document.createElement("div");a.className="modal-backdrop",a.innerHTML=`
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
  `,document.body.append(a),a.querySelector("#modal-login-cancel").addEventListener("click",()=>a.remove()),a.querySelector("#modal-login-submit").addEventListener("click",()=>{const t=a.querySelector("#login-name").value.trim()||"Creator",e=a.querySelector("#login-email").value.trim()||"local@storyforge.local";C({id:`local-${t.toLowerCase().replaceAll(/\s+/g,"-")}`,name:t,email:e,mode:"local",structureView:"list"}),a.remove(),c.saveStatus="Signed in with a local demo profile.",c.authError="",f()})}function Wt(a){const t=a?.code?String(a.code):"",e=a?.message?String(a.message):"Unknown sign-in error.";return t==="auth/unauthorized-domain"?"This site domain is not authorized in Firebase Auth. Add your local/dev domain and your GitHub Pages domain in Firebase Console > Authentication > Settings > Authorized domains.":t==="auth/popup-closed-by-user"?"The sign-in popup closed before Firebase completed the login. If it closes instantly every time, double-check Authorized domains and the Google sign-in provider setup.":t==="auth/operation-not-allowed"?"Google sign-in is not enabled for this Firebase project. Enable it in Firebase Console > Authentication > Sign-in method.":t==="auth/invalid-api-key"?"Your Firebase API key is invalid. Recheck the values in your `.env` file and restart the dev server.":t==="auth/network-request-failed"?"Firebase could not complete the sign-in request. Check your connection and any browser privacy extensions blocking popups or auth requests.":t?`${t}: ${e}`:e}async function Qt(a){const t=c.route.params.chapterId,e=await c.adapter.getChapter(t);if(!e)return;const s=[...e.assets??[]];for(const n of a){const o=await ee(n);s.push({id:crypto.randomUUID(),name:n.name,type:n.type,size:n.size,dataUrl:o})}const r=document.querySelector("#chapter-body-input"),i=s.slice((e.assets??[]).length).map(n=>`
![${n.name}](${n.dataUrl})`).join("");await c.adapter.updateChapter(t,{assets:s,body:`${r.value}${i}`}),c.dragActive=!1,c.saveStatus="Assets added to the chapter. In production these should upload to object storage instead of local state.",await f()}function Xt(a){const t=a.trim();if(!t)throw new Error("Add an image URL first.");let e;try{e=new URL(t)}catch{throw new Error("That image URL is not valid.")}if(!["http:","https:"].includes(e.protocol))throw new Error("Use an http or https image URL.");return e.toString()}async function te(a){const t=await c.adapter.getChapter(a);if(!t)throw new Error("Chapter not found.");const e=document.querySelector("#asset-name-input"),s=document.querySelector("#asset-url-input"),r=document.querySelector("#chapter-body-input"),i=e?.value.trim()||"image",n=Xt(s?.value??""),o={id:crypto.randomUUID(),name:i,type:"image/external",url:n},d=[...t.assets??[],o],l=`${r?.value??t.body??""}
![${i}](${n})`;await c.adapter.updateChapter(a,{assets:d,body:l}),c.saveStatus="External image link added and markdown updated.",await f()}async function pt(){const a=I();if(!a?.id)return;const t=await c.adapter.getUserProfile?.(a.id);t&&C({...a,name:t.name??a.name,email:t.email??a.email,penName:t.penName??"",structureView:t.structureView??a.structureView??"list"})}function X(a){return window.confirm(`Are you sure you want to delete this ${a}? This cannot be undone.`)}function ee(a){return new Promise((t,e)=>{const s=new FileReader;s.onload=()=>t(String(s.result)),s.onerror=()=>e(s.error),s.readAsDataURL(a)})}document.addEventListener("click",async a=>{const t=a.target.closest("[data-action]");if(!t)return;const e=t.dataset.action;if(e==="toggle-login")return lt();if(e==="open-settings")return $("/settings");if(e==="set-structure-view"){const s=I(),r=t.dataset.view==="list"?"list":"grid";if(!s?.id)return C({...s,structureView:r}),f();const i=await c.adapter.updateUserProfile(s.id,{name:s.name,email:s.email,penName:s.penName??"",structureView:r});return C({...s,structureView:i.structureView??r,penName:i.penName??s.penName??"",name:i.name??s.name,email:i.email??s.email}),f()}if(e==="apply-story-filters"){const s=document.querySelector("#story-search").value.trim(),r=document.querySelector("#story-tag-filter").value;return $(`/creator${s||r?`?${new URLSearchParams({q:s,tag:r}).toString()}`:""}`)}if(e==="apply-browser-filters"){const s=document.querySelector("#browser-creator-filter").value,r=document.querySelector("#browser-group-mode").value;return $(`/browser?${new URLSearchParams({creator:s,group:r}).toString()}`)}if(e==="create-story"){const s=I();if(!s)return c.saveStatus="Sign in first to create stories in Firebase mode.",lt();const r=await c.adapter.createStory({creatorId:s.id,creatorName:ht(s),title:"Untitled Story",tags:["draft"],visibility:"private"});return $(`/stories/${r.id}`)}if(e==="save-story-settings"){const s=t.dataset.storyId,r=Zt();return await c.adapter.updateStory(s,r),c.saveStatus="Story details saved.",f()}if(e==="create-arc"){const s=t.dataset.storyId,r=await c.adapter.createArc(s,`Arc ${Math.floor(Math.random()*90+10)}`);return $(`/stories/${s}/arcs/${r.id}`)}if(e==="save-arc-title")return await c.adapter.updateArc(t.dataset.arcId,{title:document.querySelector("#arc-title-input").value.trim()||"Untitled Arc"}),c.saveStatus="Arc title saved.",f();if(e==="move-arc-up"||e==="move-arc-down"){const s=await c.adapter.getStory(t.dataset.storyId),r=Number(t.dataset.index),i=e==="move-arc-up"?-1:1;return await c.adapter.reorderArcs(s.id,dt(s.arcIds,r,r+i)),f()}if(e==="create-chapter"){const s=await c.adapter.createChapter(t.dataset.arcId,"Untitled Chapter");return $(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}/chapters/${s.id}`)}if(e==="create-phase"){const s=window.prompt("Phase title","New Phase");return s===null?void 0:(await c.adapter.createPhase(t.dataset.arcId,s),c.saveStatus="Phase created.",f())}if(e==="rename-phase"){const s=window.prompt("Rename phase",t.dataset.phaseTitle||"Phase");return s===null?void 0:(await c.adapter.renamePhase(t.dataset.arcId,t.dataset.phaseId,s),c.saveStatus="Phase renamed.",f())}if(e==="move-chapter-up"||e==="move-chapter-down"){const s=await c.adapter.getArc(t.dataset.arcId),r=(s.phases??[]).find(o=>o.id===t.dataset.phaseId);if(!r)return;const i=Number(t.dataset.index),n=e==="move-chapter-up"?-1:1;return await c.adapter.reorderPhaseChapters(s.id,r.id,dt(r.chapterIds,i,i+n)),f()}if(e==="save-chapter"){const s=t.dataset.chapterId;return await c.adapter.updateChapter(s,{title:document.querySelector("#chapter-title-input").value.trim()||"Untitled Chapter",body:document.querySelector("#chapter-body-input").value}),c.saveStatus="Chapter saved.",f()}if(e==="save-pen-name"){const s=I(),r=document.querySelector("#pen-name-input").value.trim(),i=await c.adapter.updateUserProfile(s.id,{name:s.name,email:s.email,penName:r});return C({...s,penName:i.penName??"",name:i.name??s.name,email:i.email??s.email}),c.saveStatus=r?"Pen name saved.":"Pen name cleared. Account name will be used.",f()}if(e==="delete-story")return X("story")?(await c.adapter.deleteStory(t.dataset.storyId),c.saveStatus="Story deleted.",$("/creator")):void 0;if(e==="delete-arc")return X("arc")?(await c.adapter.deleteArc(t.dataset.arcId),c.saveStatus="Arc deleted.",$(`/stories/${t.dataset.storyId}`)):void 0;if(e==="delete-chapter")return X("chapter")?(await c.adapter.deleteChapter(t.dataset.chapterId),c.saveStatus="Chapter deleted.",$(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}`)):void 0;if(e==="add-external-asset")try{return await te(t.dataset.chapterId)}catch(s){return c.saveStatus=String(s.message||s),f()}});document.addEventListener("change",async a=>{const t=a.target;if(t instanceof HTMLSelectElement&&t.dataset.action==="move-chapter-phase")return await c.adapter.moveChapterToPhase(t.dataset.arcId,t.dataset.chapterId,t.value),c.saveStatus="Chapter moved to another phase.",f()});document.addEventListener("input",a=>{if(a.target.id==="chapter-body-input"){const t=document.querySelector(".markdown-preview");t&&(t.innerHTML=at(a.target.value||"*Start writing to preview your chapter here.*"))}if(a.target.id==="chapter-title-input"){const t=a.target.value.trim()||"Untitled chapter",e=document.querySelector(".page-title h2");e&&(e.textContent=t)}});document.addEventListener("dragover",a=>{if(c.route.name!=="chapter")return;a.preventDefault(),c.dragActive=!0;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.add("is-active")});document.addEventListener("dragleave",a=>{if(c.route.name!=="chapter"||a.relatedTarget)return;c.dragActive=!1;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active")});document.addEventListener("drop",async a=>{if(c.route.name!=="chapter")return;a.preventDefault();const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active");const e=[...a.dataTransfer.files].filter(s=>s.type.startsWith("image/"));e.length&&await Qt(e)});window.addEventListener("hashchange",()=>{c.saveStatus="",f()});async function ae(){const a=Ut();c.authClient=a,c.adapter=await Dt(a),c.authClient.mode==="firebase"?c.authClient.watchAuth(t=>{t?(C({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email,mode:"firebase"}),pt().finally(()=>f())):(C(null),f())}):c.currentUser?.id&&await pt(),window.location.hash?f():$("/")}ae().catch(a=>{et.innerHTML=`
    <main class="content">
      <section class="panel">
        <h2>App failed to start</h2>
        <p class="muted">${u(String(a.message||a))}</p>
        <p class="muted">Current mode: ${u(Rt().mode)}</p>
      </section>
    </main>
  `});
