import{d as tt,a as m,g as w,u as f,s as st,b as Q,q as W,w as G,c as Z,e as Kt,f as Jt,i as Qt,h as Wt,j as Zt,G as Xt,o as te,k as ee,l as ae}from"./firebase-D1mdRFF2.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=a(s);fetch(s.href,o)}})();const mt="storyforge-state-v1",St="story-demo",ct="arc-demo",dt="chapter-demo",it="Chapters";function P(e){return String(e??"").trim().toLowerCase()}function ft(e,t){const a=P(t);return!a||e?.pendingTransferStatus!=="pending"?!1:[e.pendingTransferEmailLower,P(e.pendingTransfer?.targetEmail)].includes(a)}const ut={users:{"demo-user":{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",emailLower:"demo@storyforge.local",penName:""}},stories:{[St]:{id:St,title:"The Clockwork Harbor",tags:["fantasy","mystery","serial"],visibility:"public",creatorId:"demo-user",creatorName:"Demo Creator",pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",arcIds:[ct],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},arcs:{[ct]:{id:ct,storyId:St,title:"Tide One",chapterIds:[dt],soundtracks:[],phases:[{id:"phase-demo",title:it,chapterIds:[dt]}],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},chapters:{[dt]:{id:dt,arcId:ct,title:"Lanterns on the Pier",body:`# Opening scene

A storm hangs over the harbor while the first lanterns come alive.`,assets:[],soundtracks:[],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}}};function D(e){return`${e}-${crypto.randomUUID().slice(0,8)}`}function Ct(e){return JSON.parse(JSON.stringify(e))}function x(e){return e.flatMap(t=>t.chapterIds??[])}function ot(e=[]){return{id:D("phase"),title:it,chapterIds:[...e]}}function L(e){const t=[...e.chapterIds??[]],a=Array.isArray(e.phases)&&e.phases.length?e.phases.map(i=>({id:i.id??D("phase"),title:i.title?.trim()||it,chapterIds:[...i.chapterIds??[]]})):[ot(t)],r=new Set;for(const i of a)i.chapterIds=i.chapterIds.filter(c=>!c||r.has(c)?!1:(r.add(c),!0));const s=t.filter(i=>!r.has(i));s.length&&a[0].chapterIds.push(...s);const o=x(a);return{...e,chapterIds:o,soundtracks:e.soundtracks??[],phases:a}}function v(){const e=localStorage.getItem(mt);if(!e)return localStorage.setItem(mt,JSON.stringify(ut)),Ct(ut);try{return JSON.parse(e)}catch{return localStorage.setItem(mt,JSON.stringify(ut)),Ct(ut)}}function S(e){localStorage.setItem(mt,JSON.stringify(e))}function j(e,t){const a=(e.arcIds??[]).map(r=>t.arcs[r]).filter(Boolean).map(r=>ht(r,t));return{...e,pendingTransfer:e.pendingTransfer??null,pendingTransferEmailLower:e.pendingTransferEmailLower??"",pendingTransferStatus:e.pendingTransferStatus??"",arcIds:e.arcIds??[],arcs:a}}function ht(e,t){const a=L(e),r=a.chapterIds.map(s=>t.chapters[s]).filter(Boolean);return{...a,chapterIds:a.chapterIds??[],chapters:r,phases:a.phases.map(s=>({...s,chapters:s.chapterIds.map(o=>t.chapters[o]).filter(Boolean)}))}}function z(e,t){const a=e.arcs[t];if(!a)return!1;const r=L(a),s=JSON.stringify({chapterIds:a.chapterIds??[],phases:a.phases??[]})!==JSON.stringify({chapterIds:r.chapterIds,phases:r.phases});return s&&(e.arcs[t]={...e.arcs[t],chapterIds:r.chapterIds,phases:r.phases}),s}function re(){return{mode:"local",async getUserProfile(e){return e?v().users[e]??null:null},async updateUserProfile(e,t){const a=v(),r=a.users[e]??{id:e,name:t.name??"Creator",email:t.email??"",emailLower:P(t.email),penName:""};a.users[e]={...r,...t,emailLower:P(t.email??r.email)};const s=a.users[e].penName?.trim()||a.users[e].name||"Creator";for(const o of Object.values(a.stories))o.creatorId===e&&(o.creatorName=s);return S(a),a.users[e]},async listIncomingStoryTransfers(e){const t=v(),a=P(e);return a?Object.values(t.stories).filter(r=>r.pendingTransferStatus==="pending"&&r.pendingTransferEmailLower===a).sort((r,s)=>String(s.updatedAt).localeCompare(String(r.updatedAt))).map(r=>j(r,t)):[]},async listCreatorStories(e){if(!e)return[];const t=v();return Object.values(t.stories).filter(a=>a.creatorId===e).sort((a,r)=>r.updatedAt.localeCompare(a.updatedAt)).map(a=>({...a,arcs:(a.arcIds??[]).map(r=>({id:r}))}))},async listBrowserStories(){const e=v();return Object.values(e.stories).filter(t=>t.visibility==="public").sort((t,a)=>t.creatorName.localeCompare(a.creatorName)||t.title.localeCompare(a.title)).map(t=>({...t,arcs:(t.arcIds??[]).map(a=>({id:a}))}))},async getStory(e){const t=v();let a=!1;for(const s of t.stories[e]?.arcIds??[])a=z(t,s)||a;a&&S(t);const r=t.stories[e];return r?j(r,t):null},async getArc(e){const t=v();z(t,e)&&S(t);const r=t.arcs[e];return r?ht(r,t):null},async getChapter(e){return v().chapters[e]??null},async createStory({creatorId:e,creatorName:t,title:a,tags:r,visibility:s}){const o=v(),i=D("story"),c=new Date().toISOString();return o.stories[i]={id:i,title:a,tags:r,visibility:s,creatorId:e,creatorName:t,arcIds:[],createdAt:c,updatedAt:c},S(o),j(o.stories[i],o)},async updateStory(e,t){const a=v();if(!a.stories[e])throw new Error("Story not found.");return a.stories[e]={...a.stories[e],...t,updatedAt:new Date().toISOString()},S(a),j(a.stories[e],a)},async requestStoryTransfer(e,t,a){const r=v(),s=r.stories[e];if(!s)throw new Error("Story not found.");const o=P(t);if(!o)throw new Error("Enter a valid Gmail address.");return s.pendingTransfer={targetEmail:String(t).trim(),targetEmailLower:o,requestedBy:a?.id??s.creatorId,requestedByName:a?.name??s.creatorName,requestedAt:new Date().toISOString(),status:"pending"},s.pendingTransferEmailLower=o,s.pendingTransferStatus="pending",s.updatedAt=new Date().toISOString(),S(r),j(s,r)},async cancelStoryTransfer(e){const t=v(),a=t.stories[e];if(!a)throw new Error("Story not found.");return a.pendingTransfer=null,a.pendingTransferEmailLower="",a.pendingTransferStatus="",a.updatedAt=new Date().toISOString(),S(t),j(a,t)},async acceptStoryTransfer(e,t){const a=v(),r=a.stories[e];if(!r)throw new Error("Story not found.");if(!ft(r,t?.email))throw new Error("This transfer request is no longer available.");const s=P(t?.email),o=a.users[t.id]??{id:t.id,name:t.name??"Creator",email:t.email??"",emailLower:s,penName:t.penName??""};return a.users[t.id]=o,r.creatorId=t.id,r.creatorName=o.penName?.trim()||o.name||t.name||"Creator",r.pendingTransfer=null,r.pendingTransferEmailLower="",r.pendingTransferStatus="",r.updatedAt=new Date().toISOString(),S(a),j(r,a)},async declineStoryTransfer(e,t){const a=v(),r=a.stories[e];if(!r)throw new Error("Story not found.");if(!ft(r,t))throw new Error("This transfer request is no longer available.");return r.pendingTransfer=null,r.pendingTransferEmailLower="",r.pendingTransferStatus="",r.updatedAt=new Date().toISOString(),S(a),j(r,a)},async createArc(e,t){const a=v(),r=a.stories[e];if(!r)throw new Error("Story not found.");const s=D("arc"),o=new Date().toISOString();return a.arcs[s]={id:s,storyId:e,title:t,chapterIds:[],soundtracks:[],phases:[ot()],createdAt:o,updatedAt:o},r.arcIds.push(s),r.updatedAt=o,S(a),ht(a.arcs[s],a)},async updateArc(e,t){const a=v(),r=a.arcs[e];if(!r)throw new Error("Arc not found.");return r.title=t.title??r.title,r.phases=t.phases??r.phases,r.chapterIds=t.chapterIds??r.chapterIds,r.soundtracks=t.soundtracks??r.soundtracks??[],r.updatedAt=new Date().toISOString(),a.stories[r.storyId].updatedAt=r.updatedAt,S(a),ht(r,a)},async reorderArcs(e,t){const a=v();a.stories[e].arcIds=[...t],a.stories[e].updatedAt=new Date().toISOString(),S(a)},async createChapter(e,t){const a=v(),r=a.arcs[e];if(!r)throw new Error("Arc not found.");const s=D("chapter"),o=new Date().toISOString();return a.chapters[s]={id:s,arcId:e,title:t,body:"",assets:[],soundtracks:[],createdAt:o,updatedAt:o},r.chapterIds.push(s),r.phases?.length||(r.phases=[ot()]),r.phases[0].chapterIds.push(s),r.updatedAt=o,a.stories[r.storyId].updatedAt=o,S(a),a.chapters[s]},async updateChapter(e,t){const a=v();if(!a.chapters[e])throw new Error("Chapter not found.");a.chapters[e]={...a.chapters[e],...t,updatedAt:new Date().toISOString()};const r=a.arcs[a.chapters[e].arcId];return r&&(r.updatedAt=a.chapters[e].updatedAt,a.stories[r.storyId].updatedAt=r.updatedAt),S(a),a.chapters[e]},async updateChapterOrder(e,t){const a=v();a.arcs[e].chapterIds=[...t],a.arcs[e].updatedAt=new Date().toISOString(),a.stories[a.arcs[e].storyId].updatedAt=a.arcs[e].updatedAt,S(a)},async createPhase(e,t){const a=v();z(a,e);const r=a.arcs[e],s={id:D("phase"),title:t?.trim()||"New Phase",chapterIds:[]};return r.phases.push(s),r.updatedAt=new Date().toISOString(),a.stories[r.storyId].updatedAt=r.updatedAt,S(a),s},async renamePhase(e,t,a){const r=v();z(r,e);const s=r.arcs[e],o=s.phases.find(i=>i.id===t);if(!o)throw new Error("Phase not found.");return o.title=a?.trim()||it,s.updatedAt=new Date().toISOString(),r.stories[s.storyId].updatedAt=s.updatedAt,S(r),o},async moveChapterToPhase(e,t,a){const r=v();z(r,e);const s=r.arcs[e];for(const i of s.phases)i.chapterIds=i.chapterIds.filter(c=>c!==t);const o=s.phases.find(i=>i.id===a);if(!o)throw new Error("Phase not found.");o.chapterIds.push(t),s.chapterIds=x(s.phases),s.updatedAt=new Date().toISOString(),r.stories[s.storyId].updatedAt=s.updatedAt,S(r)},async transferChapter(e,t,a){const r=v(),s=r.chapters[e],o=r.arcs[t];if(!s)throw new Error("Chapter not found.");if(!o)throw new Error("Target arc not found.");z(r,s.arcId),z(r,t);const i=r.arcs[s.arcId],c=r.arcs[t];if(!(c.phases??[]).find(p=>p.id===a))throw new Error("Target phase not found.");const u=new Date().toISOString();return i&&(i.chapterIds=(i.chapterIds??[]).filter(p=>p!==e),i.phases=(i.phases??[]).map(p=>({...p,chapterIds:(p.chapterIds??[]).filter(y=>y!==e)})),i.updatedAt=u,r.stories[i.storyId]&&(r.stories[i.storyId].updatedAt=u)),c.phases=(c.phases??[]).map(p=>p.id===a?{...p,chapterIds:[...p.chapterIds??[],e]}:p),c.chapterIds=x(c.phases),c.updatedAt=u,r.stories[c.storyId]&&(r.stories[c.storyId].updatedAt=u),r.chapters[e]={...s,arcId:t,updatedAt:u},S(r),r.chapters[e]},async reorderPhaseChapters(e,t,a){const r=v();z(r,e);const s=r.arcs[e],o=s.phases.find(i=>i.id===t);if(!o)throw new Error("Phase not found.");o.chapterIds=[...a],s.chapterIds=x(s.phases),s.updatedAt=new Date().toISOString(),r.stories[s.storyId].updatedAt=s.updatedAt,S(r)},async deleteChapter(e){const t=v(),a=t.chapters[e];if(!a)return;const r=t.arcs[a.arcId];if(r){r.chapterIds=(r.chapterIds??[]).filter(o=>o!==e),r.phases=(r.phases??[]).map(o=>({...o,chapterIds:(o.chapterIds??[]).filter(i=>i!==e)})),r.updatedAt=new Date().toISOString();const s=t.stories[r.storyId];s&&(s.updatedAt=r.updatedAt)}delete t.chapters[e],S(t)},async deleteArc(e){const t=v(),a=t.arcs[e];if(!a)return;for(const s of a.chapterIds??[])delete t.chapters[s];const r=t.stories[a.storyId];r&&(r.arcIds=(r.arcIds??[]).filter(s=>s!==e),r.updatedAt=new Date().toISOString()),delete t.arcs[e],S(t)},async deleteStory(e){const t=v(),a=t.stories[e];if(a){for(const r of a.arcIds??[]){const s=t.arcs[r];for(const o of s?.chapterIds??[])delete t.chapters[o];delete t.arcs[r]}delete t.stories[e],S(t)}}}}function lt(e){return{...e,pendingTransfer:e.pendingTransfer??null,pendingTransferEmailLower:e.pendingTransferEmailLower??"",pendingTransferStatus:e.pendingTransferStatus??"",arcIds:e.arcIds??[],tags:e.tags??[],arcs:(e.arcIds??[]).map(t=>({id:t}))}}function b(e){return e.exists()?{id:e.id,...e.data()}:null}function yt(e,t){const a=new Map(t.map((r,s)=>[r,s]));return[...e].sort((r,s)=>(a.get(r.id)??0)-(a.get(s.id)??0))}async function U(e,t){const a=await w(m(e,"stories",t)),r=b(a);if(!r)return null;const s=await Q(W(Z(e,"arcs"),G("storyId","==",t))),o=[];for(const d of yt(s.docs.map(u=>({id:u.id,...u.data(),chapterIds:u.data().chapterIds??[]})),r.arcIds??[])){const u=L(d);o.push(u)}const i=await Promise.all(o.map(async d=>{const u=await Q(W(Z(e,"chapters"),G("arcId","==",d.id)));return[d.id,yt(u.docs.map(p=>({id:p.id,...p.data(),assets:p.data().assets??[],soundtracks:p.data().soundtracks??[]})),d.chapterIds??[])]})),c=Object.fromEntries(i);return{...r,tags:r.tags??[],arcIds:r.arcIds??[],arcs:o.map(d=>({...d,chapterIds:d.chapterIds??[],phases:d.phases.map(u=>({...u,chapters:(c[d.id]??[]).filter(p=>(u.chapterIds??[]).includes(p.id))})),chapters:c[d.id]??[]}))}}async function Pt(e,t){if(!t?.id)return;const a=m(e,"users",t.id),r=await w(a),s={id:t.id,name:t.name??"Creator",email:t.email??"",emailLower:P(t.email),penName:t.penName??(r.exists()?r.data().penName:"")??"",structureView:t.structureView??(r.exists()?r.data().structureView:"list")??"list",updatedAt:new Date().toISOString()};if(r.exists()){await f(a,s);return}await st(a,{...s,createdAt:new Date().toISOString()})}function se(e){const t=e.db;return{mode:"firebase",async getUserProfile(a){if(!a)return null;const r=await w(m(t,"users",a));return b(r)},async updateUserProfile(a,r){const s=m(t,"users",a),o=await w(s),i={id:a,updatedAt:new Date().toISOString(),...r,emailLower:P(r.email??(o.exists()?o.data().email:""))};o.exists()?await f(s,i):await st(s,{createdAt:new Date().toISOString(),...i});const c=await w(s),d=b(c),u=d?.penName?.trim()||d?.name||"Creator",p=await Q(W(Z(t,"stories"),G("creatorId","==",a)));return await Promise.all(p.docs.map(y=>f(m(t,"stories",y.id),{creatorName:u}))),d},async listIncomingStoryTransfers(a){const r=P(a);return r?(await Q(W(Z(t,"stories"),G("pendingTransferStatus","==","pending"),G("pendingTransferEmailLower","==",r)))).docs.map(o=>lt({id:o.id,...o.data()})).sort((o,i)=>String(i.updatedAt).localeCompare(String(o.updatedAt))):[]},async listCreatorStories(a){return a?(await Q(W(Z(t,"stories"),G("creatorId","==",a)))).docs.map(s=>lt({id:s.id,...s.data()})).sort((s,o)=>String(o.updatedAt).localeCompare(String(s.updatedAt))):[]},async listBrowserStories(){return(await Q(W(Z(t,"stories"),G("visibility","==","public")))).docs.map(r=>lt({id:r.id,...r.data()})).sort((r,s)=>r.creatorName.localeCompare(s.creatorName)||r.title.localeCompare(s.title))},async getStory(a){return U(t,a)},async getArc(a){const r=await w(m(t,"arcs",a)),s=b(r),o=s?L(s):null;if(!o)return null;const i=await Q(W(Z(t,"chapters"),G("arcId","==",a)));return{...o,chapterIds:o.chapterIds??[],phases:o.phases.map(c=>({...c,chapters:yt(i.docs.map(d=>({id:d.id,...d.data(),assets:d.data().assets??[],soundtracks:d.data().soundtracks??[]})).filter(d=>(c.chapterIds??[]).includes(d.id)),c.chapterIds??[])})),chapters:yt(i.docs.map(c=>({id:c.id,...c.data(),assets:c.data().assets??[],soundtracks:c.data().soundtracks??[]})),o.chapterIds??[])}},async getChapter(a){const r=await w(m(t,"chapters",a)),s=b(r);return s?{...s,assets:s.assets??[],soundtracks:s.soundtracks??[]}:null},async createStory({creatorId:a,creatorName:r,title:s,tags:o,visibility:i}){const c=D("story"),d=new Date().toISOString(),u={id:c,title:s,tags:o,visibility:i,creatorId:a,creatorName:r,arcIds:[],createdAt:d,updatedAt:d};return await st(m(t,"stories",c),u),await Pt(t,{id:a,name:r}),lt(u)},async updateStory(a,r){return await f(m(t,"stories",a),{...r,updatedAt:new Date().toISOString()}),U(t,a)},async requestStoryTransfer(a,r,s){const o=P(r);if(!o)throw new Error("Enter a valid Gmail address.");return await f(m(t,"stories",a),{pendingTransfer:{targetEmail:String(r).trim(),targetEmailLower:o,requestedBy:s?.id??"",requestedByName:s?.name??"Creator",requestedAt:new Date().toISOString(),status:"pending"},pendingTransferEmailLower:o,pendingTransferStatus:"pending",updatedAt:new Date().toISOString()}),U(t,a)},async cancelStoryTransfer(a){return await f(m(t,"stories",a),{pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:new Date().toISOString()}),U(t,a)},async acceptStoryTransfer(a,r){const s=await U(t,a);if(!s)throw new Error("Story not found.");if(!ft(s,r?.email))throw new Error("This transfer request is no longer available.");P(r?.email),await Pt(t,r);const o=await w(m(t,"users",r.id)),i=b(o)??r,c=i.penName?.trim()||i.name||r.name||"Creator",d=new Date().toISOString();return await f(m(t,"stories",a),{creatorId:r.id,creatorName:c,pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:d}),U(t,a)},async declineStoryTransfer(a,r){const s=await U(t,a);if(!s)throw new Error("Story not found.");if(!ft(s,r))throw new Error("This transfer request is no longer available.");return await f(m(t,"stories",a),{pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:new Date().toISOString()}),U(t,a)},async createArc(a,r){const s=m(t,"stories",a),o=await w(s),i=b(o);if(!i)throw new Error("Story not found.");const c=D("arc"),d=new Date().toISOString(),u={id:c,storyId:a,title:r,chapterIds:[],soundtracks:[],phases:[ot()],createdAt:d,updatedAt:d};return await st(m(t,"arcs",c),u),await f(s,{arcIds:[...i.arcIds??[],c],updatedAt:d}),u},async updateArc(a,r){const s=m(t,"arcs",a),o=new Date().toISOString();await f(s,{...r,updatedAt:o});const i=await w(s),c=b(i);return c?.storyId&&await f(m(t,"stories",c.storyId),{updatedAt:o}),this.getArc(a)},async reorderArcs(a,r){await f(m(t,"stories",a),{arcIds:r,updatedAt:new Date().toISOString()})},async createChapter(a,r){const s=m(t,"arcs",a),o=await w(s),i=b(o);if(!i)throw new Error("Arc not found.");const c=D("chapter"),d=new Date().toISOString(),u={id:c,arcId:a,title:r,body:"",assets:[],soundtracks:[],createdAt:d,updatedAt:d};await st(m(t,"chapters",c),u);const p=L(i);return p.phases.length||(p.phases=[ot()]),p.phases[0].chapterIds.push(c),await f(s,{chapterIds:[...i.chapterIds??[],c],phases:p.phases,updatedAt:d}),await f(m(t,"stories",i.storyId),{updatedAt:d}),u},async updateChapter(a,r){const s=m(t,"chapters",a),o=new Date().toISOString();await f(s,{...r,updatedAt:o});const i=await w(s),c=b(i);if(c?.arcId){const d=await w(m(t,"arcs",c.arcId)),u=b(d);u&&(await f(m(t,"arcs",u.id),{updatedAt:o}),await f(m(t,"stories",u.storyId),{updatedAt:o}))}return this.getChapter(a)},async updateChapterOrder(a,r){const s=m(t,"arcs",a),o=new Date().toISOString();await f(s,{chapterIds:r,updatedAt:o});const i=await w(s),c=b(i);c?.storyId&&await f(m(t,"stories",c.storyId),{updatedAt:o})},async createPhase(a,r){const s=m(t,"arcs",a),o=await w(s),i=b(o),c=i?L(i):null;if(!c)throw new Error("Arc not found.");const d={id:D("phase"),title:r?.trim()||"New Phase",chapterIds:[]},u=[...c.phases,d],p=new Date().toISOString();return await f(s,{phases:u,chapterIds:x(u),updatedAt:p}),await f(m(t,"stories",c.storyId),{updatedAt:p}),d},async renamePhase(a,r,s){const o=m(t,"arcs",a),i=await w(o),c=b(i),d=c?L(c):null;if(!d)throw new Error("Arc not found.");const u=d.phases.map(y=>y.id===r?{...y,title:s?.trim()||it}:y),p=new Date().toISOString();return await f(o,{phases:u,updatedAt:p}),await f(m(t,"stories",d.storyId),{updatedAt:p}),u.find(y=>y.id===r)},async moveChapterToPhase(a,r,s){const o=m(t,"arcs",a),i=await w(o),c=b(i),d=c?L(c):null;if(!d)throw new Error("Arc not found.");const u=d.phases.map(I=>({...I,chapterIds:(I.chapterIds??[]).filter(T=>T!==r)})),p=u.find(I=>I.id===s);if(!p)throw new Error("Phase not found.");p.chapterIds.push(r);const y=new Date().toISOString();await f(o,{phases:u,chapterIds:x(u),updatedAt:y}),await f(m(t,"stories",d.storyId),{updatedAt:y})},async transferChapter(a,r,s){const o=m(t,"chapters",a),i=await w(o),c=b(i);if(!c)throw new Error("Chapter not found.");const d=m(t,"arcs",c.arcId),u=m(t,"arcs",r),[p,y]=await Promise.all([w(d),w(u)]),I=b(p),T=b(y),q=I?L(I):null,O=T?L(T):null;if(!q)throw new Error("Source arc not found.");if(!O)throw new Error("Target arc not found.");if(!(O.phases??[]).find(C=>C.id===s))throw new Error("Target phase not found.");const R=q.phases.map(C=>({...C,chapterIds:(C.chapterIds??[]).filter(g=>g!==a)})),at=O.phases.map(C=>C.id===s?{...C,chapterIds:[...C.chapterIds??[],a]}:C),F=new Date().toISOString();return await Promise.all([f(d,{phases:R,chapterIds:x(R),updatedAt:F}),f(u,{phases:at,chapterIds:x(at),updatedAt:F}),f(o,{arcId:r,updatedAt:F})]),await Promise.all([f(m(t,"stories",q.storyId),{updatedAt:F}),f(m(t,"stories",O.storyId),{updatedAt:F})]),this.getChapter(a)},async reorderPhaseChapters(a,r,s){const o=m(t,"arcs",a),i=await w(o),c=b(i),d=c?L(c):null;if(!d)throw new Error("Arc not found.");const u=d.phases.map(y=>y.id===r?{...y,chapterIds:[...s]}:y),p=new Date().toISOString();await f(o,{phases:u,chapterIds:x(u),updatedAt:p}),await f(m(t,"stories",d.storyId),{updatedAt:p})},async deleteChapter(a){const r=await w(m(t,"chapters",a)),s=b(r);if(!s)return;const o=m(t,"arcs",s.arcId),i=await w(o),c=b(i),d=new Date().toISOString();c&&(await f(o,{chapterIds:(c.chapterIds??[]).filter(u=>u!==a),phases:(c.phases??[]).map(u=>({...u,chapterIds:(u.chapterIds??[]).filter(p=>p!==a)})),updatedAt:d}),await f(m(t,"stories",c.storyId),{updatedAt:d})),await tt(m(t,"chapters",a))},async deleteArc(a){const r=await w(m(t,"arcs",a)),s=b(r);if(!s)return;for(const d of s.chapterIds??[])await tt(m(t,"chapters",d));const o=m(t,"stories",s.storyId),i=await w(o),c=b(i);c&&await f(o,{arcIds:(c.arcIds??[]).filter(d=>d!==a),updatedAt:new Date().toISOString()}),await tt(m(t,"arcs",a))},async deleteStory(a){const r=await U(t,a);if(r){for(const s of r.arcs??[]){for(const o of s.chapters??[])await tt(m(t,"chapters",o.id));await tt(m(t,"arcs",s.id))}await tt(m(t,"stories",a))}}}}async function ne(e){return e?.mode==="firebase"&&e.db?se(e):re()}const oe={VITE_APP_MODE:"firebase",VITE_FIREBASE_API_KEY:"AIzaSyC8-b4_lzrCk2RhsqSEMkcxNKgMzVx_WJ4",VITE_FIREBASE_APP_ID:"1:309677315541:web:ef90a15da4ee29c03fd95c",VITE_FIREBASE_AUTH_DOMAIN:"ulunavir-tales.firebaseapp.com",VITE_FIREBASE_MESSAGING_SENDER_ID:"309677315541",VITE_FIREBASE_PROJECT_ID:"ulunavir-tales",VITE_FIREBASE_STORAGE_BUCKET:"ulunavir-tales.firebasestorage.app"},$t={mode:"local",firebase:{apiKey:"",authDomain:"",projectId:"",appId:"",storageBucket:"",messagingSenderId:""}};function ie(){const e=oe??{};return{mode:e.VITE_APP_MODE??$t.mode,firebase:{apiKey:e.VITE_FIREBASE_API_KEY??"",authDomain:e.VITE_FIREBASE_AUTH_DOMAIN??"",projectId:e.VITE_FIREBASE_PROJECT_ID??"",appId:e.VITE_FIREBASE_APP_ID??"",storageBucket:e.VITE_FIREBASE_STORAGE_BUCKET??"",messagingSenderId:e.VITE_FIREBASE_MESSAGING_SENDER_ID??""}}}function Ut(){const e=globalThis.STORYFORGE_CONFIG??{},t=ie();return{...$t,...t,...e,firebase:{...$t.firebase,...t.firebase,...e.firebase??{}}}}function ce(e){return e.mode==="firebase"&&!!(e.firebase.projectId&&e.firebase.apiKey&&e.firebase.appId)}function de(){const e=Ut();if(!ce(e))return{mode:"local",auth:null,db:null,signIn:async()=>null,signOut:async()=>null,watchAuth:o=>(o(null),()=>{})};const t=Kt().length?Jt():Qt(e.firebase),a=Wt(t),r=Zt(t),s=new Xt;return{mode:"firebase",auth:a,db:r,signIn:async()=>(await ae(a,s)).user,signOut:async()=>ee(a),watchAuth:o=>te(a,o)}}function ue(){return Ut()}const gt=document.querySelector("#app"),n={adapter:null,authClient:null,currentUser:JSON.parse(localStorage.getItem("storyforge-session")??"null"),route:{name:"home",params:{}},dragActive:!1,saveStatus:"",authError:"",loadError:"",soundtrack:{arcId:"",queue:[],currentIndex:0,paused:!0,volume:70,volumeOpen:!1,mode:"idle",ready:!1,autoplayAttempted:!1,activeKey:"",youtubePlayer:null,syncToken:0,manualPause:!1,recoveryTimer:null,recoveryAttempts:0}},xt="storyforge-soundtrack-state";function le(){try{const e=localStorage.getItem(xt);return e?JSON.parse(e):{}}catch{return{}}}function Bt(){const{arcId:e,currentIndex:t,paused:a,volume:r}=n.soundtrack;localStorage.setItem(xt,JSON.stringify({arcId:e,currentIndex:t,paused:a,volume:r}))}function It(e=$()){return e?e.penName?.trim()||e.name||"Creator":"Guest"}function _t(e=$()){return e?.structureView==="grid"?"grid":"list"}function _(e){n.currentUser=e,localStorage.setItem("storyforge-session",JSON.stringify(e))}function pe(){document.querySelectorAll(".modal-backdrop").forEach(e=>e.remove())}function A(e){const t=`#${e}`;if(window.location.hash===t){nt(),window.scrollTo({top:0,left:0,behavior:"auto"});return}window.location.hash=e}function me(){const e=window.location.hash.replace(/^#/,"")||"/",[t]=e.split("?"),a=t.split("/").filter(Boolean);return a.length===0?{name:"home",params:{}}:a[0]==="creator"?{name:"creator",params:{}}:a[0]==="browser"?{name:"browser",params:{}}:a[0]==="settings"?{name:"settings",params:{}}:a[0]==="stories"&&a[1]?a[2]==="arcs"&&a[3]&&a[4]==="chapters"&&a[5]?{name:"chapter",params:{storyId:a[1],arcId:a[3],chapterId:a[5]}}:a[2]==="arcs"&&a[3]?{name:"arc",params:{storyId:a[1],arcId:a[3]}}:{name:"story",params:{storyId:a[1]}}:{name:"not-found",params:{}}}function M(){return new URLSearchParams(window.location.hash.split("?")[1]??"")}function $(){return n.currentUser?n.currentUser:n.authClient?.mode==="firebase"?null:{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",mode:"demo",structureView:"list"}}function At(e){return!!(e?.creatorId&&$()?.id&&e.creatorId===$().id)}function l(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function Mt(e){return`${e}-${crypto.randomUUID().slice(0,8)}`}function he(e,t="Soundtrack"){return e?.trim()||t}function fe(e){try{const t=new URL(e);if(t.hostname==="youtu.be")return t.pathname.replace(/\//g,"")||null;if(t.hostname.includes("youtube.com")){if(t.pathname==="/watch")return t.searchParams.get("v");const a=t.pathname.split("/").filter(Boolean);if(["embed","shorts","live"].includes(a[0]))return a[1]??null}}catch{return null}return null}function Vt(e){const t=e?.url?.trim(),a=t&&!/^https?:\/\//i.test(t)?`https://${t}`:t;if(!a)return null;const r=fe(a);return r?{id:e.id??Mt("soundtrack"),label:he(e.label,"YouTube track"),url:a,source:"youtube",videoId:r}:null}function ye(e=[]){return e.map(Vt).filter(Boolean)}function ge(){let e=document.querySelector("#soundtrack-layer");return e||(e=document.createElement("div"),e.id="soundtrack-layer",e.innerHTML=`
    <div id="youtube-soundtrack-host"></div>
  `,document.body.append(e),e)}function ve(e,t){return t()?Promise.resolve():new Promise((a,r)=>{const s=[...document.querySelectorAll("script")].find(i=>i.src===e);if(s){s.addEventListener("load",()=>a(),{once:!0}),s.addEventListener("error",()=>r(new Error(`Failed to load ${e}`)),{once:!0});return}const o=document.createElement("script");o.src=e,o.async=!0,o.addEventListener("load",()=>a(),{once:!0}),o.addEventListener("error",()=>r(new Error(`Failed to load ${e}`)),{once:!0}),document.head.append(o)})}function N(){const e=n.soundtrack.queue??[];if(!e.length)return null;const t=Math.max(0,Math.min(n.soundtrack.currentIndex,e.length-1));return e[t]??null}function et(){const e=N(),t=document.querySelector("[data-action='toggle-soundtrack']");t&&(t.disabled=!e,t.classList.toggle("is-active",!!e&&!n.soundtrack.paused),t.setAttribute("aria-pressed",String(!!e&&!n.soundtrack.paused)),t.setAttribute("title",e?`${n.soundtrack.paused?"Resume":"Pause"} ${e.label}`:"No soundtrack available"));const a=document.querySelector("[data-action='toggle-volume-popout']");a&&(a.disabled=!e,a.classList.toggle("is-open",n.soundtrack.volumeOpen),a.style.setProperty("--volume-fill",`${B(n.soundtrack.volume)}%`),a.setAttribute("title",e?`Volume ${B(n.soundtrack.volume)}%`:"No soundtrack available"));const r=document.querySelector("#soundtrack-volume-slider");r&&(r.value=String(B(n.soundtrack.volume)));const s=document.querySelector("#soundtrack-volume-value");s&&(s.textContent=`${B(n.soundtrack.volume)}%`);const o=document.querySelector(".volume-popout");o&&(o.hidden=!n.soundtrack.volumeOpen)}function X(){Bt(),et()}function Ft(){const e=document.querySelector("#soundtrack-status");e&&(e.textContent="No soundtrack loaded."),et()}function V(e){const t=document.querySelector("#soundtrack-status");t&&(t.textContent=e)}function H(){n.soundtrack.recoveryTimer&&(clearTimeout(n.soundtrack.recoveryTimer),n.soundtrack.recoveryTimer=null)}function rt(e="Playback interrupted",t=2200){const a=N();if(!a||n.soundtrack.paused||n.soundtrack.manualPause)return;H();const r=a.id,s=n.soundtrack.syncToken;V(`${e}. Trying to resume...`),n.soundtrack.recoveryTimer=setTimeout(()=>{const o=N();if(!(!o||o.id!==r||s!==n.soundtrack.syncToken||n.soundtrack.paused||n.soundtrack.manualPause||!n.soundtrack.youtubePlayer)){n.soundtrack.recoveryAttempts+=1;try{n.soundtrack.recoveryAttempts%4===0&&o.videoId?n.soundtrack.youtubePlayer.loadVideoById(o.videoId):n.soundtrack.youtubePlayer.playVideo(),V(`Resuming: ${o.label}`)}catch(i){V(`Soundtrack recovery failed: ${String(i.message||i)}`)}}},t)}function jt(){const e=N();H(),n.soundtrack.manualPause=!0,n.soundtrack.mode==="youtube"&&n.soundtrack.youtubePlayer?.pauseVideo&&n.soundtrack.youtubePlayer.pauseVideo(),n.soundtrack.paused=!0,e&&V(`Paused: ${e.label}`),X()}function we(){const e=N();e&&(H(),n.soundtrack.manualPause=!1,n.soundtrack.recoveryAttempts=0,n.soundtrack.mode==="youtube"&&n.soundtrack.youtubePlayer?.playVideo&&n.soundtrack.youtubePlayer.playVideo(),n.soundtrack.paused=!1,V(`Now playing: ${e.label}`),X())}function Se(){n.soundtrack.queue.length&&(n.soundtrack.currentIndex=(n.soundtrack.currentIndex+1)%n.soundtrack.queue.length,n.soundtrack.activeKey="",n.soundtrack.ready=!1,n.soundtrack.autoplayAttempted=!1,n.soundtrack.manualPause=!1,n.soundtrack.recoveryAttempts=0,H(),X(),Gt())}function B(e){return Math.max(0,Math.min(100,Math.round(Number(e)||0)))}function zt(){const e=B(n.soundtrack.volume);n.soundtrack.volume=e,n.soundtrack.youtubePlayer?.setVolume&&n.soundtrack.youtubePlayer.setVolume(e),X()}function Yt(e){n.soundtrack.volume=B(e),zt()}function be(e){Yt(B(n.soundtrack.volume+e))}async function $e(e,t){await ve("https://www.youtube.com/iframe_api",()=>!!window.YT?.Player),t===n.soundtrack.syncToken&&(ge(),n.soundtrack.youtubePlayer?n.soundtrack.youtubePlayer.loadVideoById(e.videoId):await new Promise(a=>{const r=()=>{n.soundtrack.youtubePlayer=new window.YT.Player("youtube-soundtrack-host",{height:"200",width:"320",videoId:e.videoId,playerVars:{autoplay:1,controls:1,rel:0},events:{onReady:()=>a(),onStateChange:s=>{if(s.data===window.YT.PlayerState.ENDED){H(),n.soundtrack.recoveryAttempts=0,Se();return}if(s.data===window.YT.PlayerState.PLAYING){H(),n.soundtrack.paused=!1,n.soundtrack.manualPause=!1,n.soundtrack.recoveryAttempts=0;const o=N();o&&V(`Now playing: ${o.label}`),X()}if(s.data===window.YT.PlayerState.PAUSED){if(n.soundtrack.manualPause){n.soundtrack.paused=!0,X();return}rt("Playback paused by YouTube")}s.data===window.YT.PlayerState.BUFFERING&&rt("Playback is buffering",4500),(s.data===window.YT.PlayerState.CUED||s.data===window.YT.PlayerState.UNSTARTED)&&rt("Playback is waiting")},onError:s=>{const o=N();V(`YouTube player error${s?.data?` ${s.data}`:""}. Retrying...`),o&&rt("YouTube player error",1500)}}})};if(window.YT?.Player)r();else{const s=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{s?.(),r()}}}),t===n.soundtrack.syncToken&&(n.soundtrack.mode="youtube",n.soundtrack.ready=!0,n.soundtrack.activeKey=e.id,zt(),V(`Now playing: ${e.label}`),n.soundtrack.paused||(n.soundtrack.manualPause=!1,n.soundtrack.youtubePlayer.playVideo(),rt("Playback did not start",5e3)),et()))}async function Gt(){const e=++n.soundtrack.syncToken,t=N();if(!t){n.soundtrack.arcId="",n.soundtrack.queue=[],n.soundtrack.mode="idle",n.soundtrack.ready=!1,n.soundtrack.activeKey="",jt(),Ft();return}try{if(t.source==="youtube"){await $e(t,e);return}}catch(a){n.saveStatus=`Soundtrack error: ${String(a.message||a)}`,V("Soundtrack could not be loaded."),et()}}function Ie(e,t){const a=le(),r=e!==n.soundtrack.arcId||JSON.stringify(t.map(s=>s.id))!==JSON.stringify((n.soundtrack.queue??[]).map(s=>s.id));n.soundtrack.arcId=e,n.soundtrack.queue=t,r&&(n.soundtrack.currentIndex=a.arcId===e&&typeof a.currentIndex=="number"?Math.max(0,Math.min(a.currentIndex,t.length-1)):0,n.soundtrack.paused=a.arcId===e?!!a.paused:!1,n.soundtrack.manualPause=n.soundtrack.paused,n.soundtrack.volume=typeof a.volume=="number"?B(a.volume):n.soundtrack.volume,n.soundtrack.ready=!1,n.soundtrack.activeKey="",n.soundtrack.recoveryAttempts=0,H()),X(),Gt()}function Y(){H(),n.soundtrack.arcId="",n.soundtrack.queue=[],n.soundtrack.currentIndex=0,n.soundtrack.paused=!0,n.soundtrack.manualPause=!0,n.soundtrack.volumeOpen=!1,n.soundtrack.activeKey="",n.soundtrack.ready=!1,n.soundtrack.recoveryAttempts=0,n.soundtrack.youtubePlayer?.pauseVideo&&n.soundtrack.youtubePlayer.pauseVideo(),Ft(),Bt()}function kt(e){const t="ULUNAVIR_SAFE_LINE_BREAK",a=String(e??"").replace(/<br\s*\/?>/gi,t).replace(/&lt;br\s*\/?&gt;/gi,t).replace(/\n{3,}/g,y=>`

${`${t}
`.repeat(y.length-2)}
`);return l(a).replaceAll(t,"<br />").replace(/```([\s\S]*?)```/g,(y,I)=>`<pre><code>${I.trim()}</code></pre>`).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<p><img alt="$1" src="$2" /></p>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/(?:^|\n)- (.*(?:\n- .*)*)/g,y=>`
<ul>${y.trim().split(`
`).map(T=>T.replace(/^- /,"").trim()).map(T=>`<li>${T}</li>`).join("")}</ul>`).split(/\n{2,}/).map(y=>/^<(h\d|ul|pre|p)/.test(y.trim())?y:`<p>${y.replace(/\n/g,"<br />")}</p>`).join("")}function ke(e){return e?typeof e.toDate=="function"?e.toDate():typeof e.seconds=="number"?new Date(e.seconds*1e3):new Date(e):null}function vt(e){const t=ke(e);return!t||Number.isNaN(t.getTime())?"Unknown date":new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short"}).format(t)}function Ae(e,t,a){if(!t)return e;const r=t.toLowerCase();return e.filter(s=>a(s).toLowerCase().includes(r))}function Te(e){return[...new Set(e.flatMap(t=>t.tags))].sort((t,a)=>t.localeCompare(a))}function Ee(e=""){return`
    <aside class="quick-tools">
      <div class="quick-tools-frame">
        <div class="quick-tools-label">Quick Tools</div>
        <div class="quick-tools-body">
          ${e||'<div class="quick-tools-empty">No tools</div>'}
        </div>
      </div>
    </aside>
  `}function J(e,t,a=""){const r=$(),s=n.authError?`<div class="notice"><strong>Sign-in error</strong><div class="muted">${l(n.authError)}</div></div>`:"",o=n.loadError?`<div class="notice"><strong>Load error</strong><div class="muted">${l(n.loadError)}</div></div>`:"",i=n.saveStatus?`<div class="notice"><strong>Status</strong><div class="muted">${l(n.saveStatus)}</div></div>`:"";gt.innerHTML=`
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
            ${bt("/","Main Menu",t==="home")}
            ${bt("/creator","Creator",t==="creator")}
            ${bt("/browser","Browser",t==="browser")}
          </nav>
        </div>
        <div class="stack">
          <button class="notice account-card" data-action="open-settings" ${r?"":"disabled"}>
            <strong>${l(It(r))}</strong>
            <div class="muted">${l(r?.email??(n.authClient?.mode==="firebase"?"Sign in to create and manage stories":"Local demo mode"))}</div>
          </button>
          <button class="login-button" data-action="toggle-login">
            ${n.currentUser?"Log out":"Log in"}
          </button>
        </div>
      </aside>
      <main class="content">${e}</main>
      ${Ee(a)}
    </div>
  `,(s||o||i)&&gt.querySelector(".content").insertAdjacentHTML("afterbegin",`${i}${o}${s}`)}async function Ce(){const e=$();if(!e)return K("Sign in to manage account settings.");J(`
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
    `,"home")}function bt(e,t,a){return`<a class="nav-link ${a?"is-active":""}" href="#${e}"><span>${t}</span></a>`}function Pe(){return`
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
  `}function Ht(e){return e.length?`
    <section class="panel stack">
      <div class="section-header">
        <div>
          <h3>Ownership Requests</h3>
          <p class="muted">Stories shared with you stay with the current owner until you accept.</p>
        </div>
        <span class="pill">${e.length} pending</span>
      </div>
      <div class="story-list">
        ${e.map(t=>`
          <article class="list-card">
            <div class="stack">
              <div>
                <h3>${l(t.title)}</h3>
                <p class="muted">Requested by ${l(t.pendingTransfer?.requestedByName??t.creatorName)} on ${l(vt(t.pendingTransfer?.requestedAt??t.updatedAt))}</p>
              </div>
              <div class="card-actions">
                <button class="primary-button" data-action="accept-story-transfer" data-story-id="${t.id}">Accept</button>
                <button class="ghost-button" data-action="decline-story-transfer" data-story-id="${t.id}">Decline</button>
                <a class="ghost-button" href="#/stories/${t.id}?view=browser">Preview</a>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `:""}async function Ne(){const e=$();let t=[];if(e?.email)try{t=await n.adapter.listIncomingStoryTransfers?.(e.email)??[]}catch(a){console.error("Incoming transfer list failed:",a),n.loadError="Ownership requests could not be loaded right now."}J(`
      <div class="stack">
        ${Pe()}
        ${Ht(t)}
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
    `,"home")}async function Oe(){const e=$(),t=await n.adapter.listCreatorStories(e?.id);let a=[];if(e?.email)try{a=await n.adapter.listIncomingStoryTransfers?.(e.email)??[]}catch(u){console.error("Incoming transfer list failed:",u),n.loadError="Ownership requests could not be loaded right now."}const r=M(),s=r.get("q")??"",o=r.get("tag")??"",i=Ae(t,s,u=>`${u.title} ${u.tags.join(" ")}`).filter(u=>o?u.tags.includes(o):!0),c=Te(t),d=n.authClient?.mode==="firebase"&&!e?'<div class="notice">Sign in with Firebase to create, edit, and manage your own stories.</div>':"";J(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Creator</h2>
            <p class="muted">Manage your stories, search by title, and filter by tags.</p>
          </div>
          <button class="primary-button" data-action="create-story" ${e?"":"disabled"}>Create</button>
        </div>
        ${Ht(a)}
        ${d}
        <section class="panel stack">
          <div class="search-row">
            <input id="story-search" placeholder="Search by story title or tag" value="${l(s)}" />
            <select id="story-tag-filter">
              <option value="">All tags</option>
              ${c.map(u=>`<option value="${l(u)}" ${o===u?"selected":""}>${l(u)}</option>`).join("")}
            </select>
            <button class="ghost-button" data-action="apply-story-filters">Filter</button>
          </div>
          <div class="chip-row">
            ${c.map(u=>`<a class="pill" href="#/creator?tag=${encodeURIComponent(u)}">${l(u)}</a>`).join("")}
          </div>
        </section>
        <section class="story-list">
          ${i.length?i.map(Le).join(""):'<div class="empty-state">No stories match this filter yet.</div>'}
        </section>
      </div>
    `,"creator")}function Le(e){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${l(e.title)}</h3>
          <p class="muted">Updated ${vt(e.updatedAt)}</p>
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
  `}async function De(){const e=await n.adapter.listBrowserStories($()?.id),t=M(),a=t.get("group")!=="flat",r=t.get("creator")??"",s=r?e.filter(c=>c.creatorName===r):e,o=[...new Set(e.map(c=>c.creatorName))];let i="";s.length?a?i=o.filter(c=>!r||c===r).map(c=>{const d=s.filter(u=>u.creatorName===c);return d.length?`
          <section class="panel stack">
            <div class="section-header">
              <h3>${l(c)}</h3>
              <span class="pill">${d.length} public stories</span>
            </div>
            <div class="story-list">${d.map(Nt).join("")}</div>
          </section>
        `:""}).join(""):i=`<section class="story-list">${s.map(Nt).join("")}</section>`:i='<div class="empty-state">No public stories are available yet.</div>',J(`
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
    `,"browser")}function Nt(e){return`
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
  `}async function qe(e){const t=await n.adapter.getStory(e);if(!t)return K("Story not found.");const a=At(t),r=M().get("view")==="browser",s=_t(),o=M().get("transfer")==="1",i=t.pendingTransferStatus==="pending"?t.pendingTransfer:null;if(t.visibility==="private"&&!a)return K("This story is private.");J(`
      <div class="stack">
        ${Tt([[r?"#/browser":"#/creator",r?"Browser":"Creator"],["",t.title]])}
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
            ${a&&!r?'<button class="ghost-button" type="button" data-action="open-story-transfer" data-story-id="'+t.id+'">Transfer Ownership</button>':""}
            ${a&&!r?'<button class="primary-button" data-action="create-arc" data-story-id="'+t.id+'">New arc</button>':""}
          </div>
        </div>
        <section class="panel stack">
          <div class="inline-form">
            <input id="story-title-input" value="${l(t.title)}" ${a?"":"disabled"} />
            <input id="story-tags-input" value="${l(t.tags.join(", "))}" ${a?"":"disabled"} />
            <select id="story-visibility-input" ${a?"":"disabled"}>
              ${["public","unlisted","private"].map(c=>`<option value="${c}" ${t.visibility===c?"selected":""}>${c}</option>`).join("")}
            </select>
            ${a?'<button class="ghost-button" data-action="save-story-settings" data-story-id="'+t.id+'">Save</button>':""}
          </div>
          <div class="notice">
            <strong>${l(t.creatorName)}</strong>
            <div class="muted">Created ${vt(t.createdAt)}. Visibility is currently ${l(t.visibility)}.</div>
          </div>
          ${a&&i?`
            <div class="notice">
              <strong>Transfer pending</strong>
              <div class="muted">Waiting for ${l(i.targetEmail??"")} to accept. Ownership stays with you until they do.</div>
              <div class="card-actions">
                <button class="ghost-button" data-action="cancel-story-transfer" data-story-id="${t.id}">Cancel transfer</button>
              </div>
            </div>
          `:""}
          ${a&&!r&&o?`
            <div class="notice stack">
              <div>
                <strong>Transfer ownership</strong>
                <div class="muted">Enter the recipient Gmail and type TRANSFER. The story stays with you until they accept.</div>
              </div>
              <div class="inline-form">
                <input id="story-transfer-email-input" placeholder="friend@gmail.com" />
                <input id="story-transfer-confirm-input" placeholder="Type TRANSFER" />
              </div>
              <div class="card-actions">
                <button class="primary-button" data-action="submit-story-transfer" data-story-id="${t.id}">Send request</button>
                <button class="ghost-button" data-action="close-story-transfer" data-story-id="${t.id}">Close</button>
              </div>
              <div class="muted">Wrong email does not remove the story from you. It only creates a pending request that you can cancel.</div>
            </div>
          `:""}
        </section>
        <section class="nested-list ${s==="list"?"is-list-view":""}">
          ${t.arcs.length?t.arcs.map((c,d)=>Re(c,t,a,d,r)).join(""):'<div class="empty-state">No arcs yet. Create the first arc to start structuring this story.</div>'}
        </section>
      </div>
    `,r?"browser":a?"creator":"browser")}function Re(e,t,a,r,s=!1){return`
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
  `}function Ue(e,t,a=!1,r=""){return`
    <div class="phase-separator">
      <span class="phase-line"></span>
      ${t&&!a?`<button class="phase-title" data-action="rename-phase" data-arc-id="${r}" data-phase-id="${e.id}" data-phase-title="${l(e.title)}">${l(e.title)}</button>`:`<span class="phase-title">${l(e.title)}</span>`}
      <span class="phase-line"></span>
    </div>
  `}function xe(e){const t=e.soundtracks??[];return`
    <section class="panel stack soundtrack-panel">
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
  `}function Be(e){if(!e.length)return"";const t=N(),a=B(n.soundtrack.volume);return`
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
  `}async function _e(e,t){const[a,r]=await Promise.all([n.adapter.getStory(e),n.adapter.getArc(t)]);if(!a||!r)return K("Arc not found.");const s=At(a),o=M().get("view")==="browser",i=_t();if(a.visibility==="private"&&!s)return K("This story is private.");const c=(r.phases??[]).map(d=>`
    <section class="phase-block stack">
      ${Ue(d,s,o,r.id)}
      <div class="nested-list ${i==="list"?"is-list-view":""}">
        ${d.chapters.length?d.chapters.map((u,p)=>Me(u,a,r,s,p,o,d)).join(""):'<div class="empty-state">No chapters in this phase yet.</div>'}
      </div>
    </section>
  `).join("");if(J(`
      <div class="stack">
        ${Tt([[o?"#/browser":s?"#/creator":"#/browser",o?"Browser":s?"Creator":"Browser"],["#/stories/"+a.id+(o?"?view=browser":""),a.title],["",r.title]])}
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
    `,o?"browser":s?"creator":"browser"),s&&!o){const d=document.querySelector("#story-transfer-button");d&&d.addEventListener("click",u=>{u.preventDefault(),u.stopPropagation(),showStoryTransferModal(a.id)})}}function Me(e,t,a,r,s,o=!1,i=null){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${l(e.title||"Untitled chapter")}</h3>
          <p class="muted">Updated ${vt(e.updatedAt)}</p>
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
        ${r&&!o?`<button class="small-button" title="Move chapter" data-action="open-transfer-chapter" data-story-id="${t.id}" data-arc-id="${a.id}" data-phase-id="${i?.id??""}" data-chapter-id="${e.id}">↗</button>`:""}
        ${r&&!o?`<button class="danger-button" data-action="delete-chapter" data-story-id="${t.id}" data-arc-id="${a.id}" data-chapter-id="${e.id}">Delete</button>`:""}
      </div>
    </article>
  `}function Ot(e,t,a,r,s=!1){return!a&&!r?"":`
    <div class="chapter-pager">
      ${a?`<a class="ghost-button" href="#/stories/${e}/arcs/${t}/chapters/${a.id}${s?"?view=browser":""}">Previous Chapter</a>`:""}
      ${r?`<a class="ghost-button" href="#/stories/${e}/arcs/${t}/chapters/${r.id}${s?"?view=browser":""}">Next Chapter</a>`:""}
    </div>
  `}async function Ve(e,t,a){const[r,s,o]=await Promise.all([n.adapter.getStory(e),n.adapter.getArc(t),n.adapter.getChapter(a)]);if(!r||!s||!o)return K("Chapter not found.");const i=At(r),c=M().get("view")==="browser";if(r.visibility==="private"&&!i)return K("This story is private.");const d=o.assets??[],u=c?ye(o.soundtracks??[]):[],p=(s.chapters??[]).findIndex(E=>E.id===a),y=p>0?s.chapters[p-1]:null,I=p>=0&&p<s.chapters.length-1?s.chapters[p+1]:null,T=Ot(r.id,s.id,y,I,c),q=Ot(r.id,s.id,y,I,c),O=i&&!c?`
        <div class="editor-shell">
          <section class="editor-pane">
            <div class="editor-controls">
              <input id="chapter-title-input" value="${l(o.title)}" ${i?"":"disabled"} />
              <textarea id="chapter-body-input" class="markdown-area" ${i?"":"disabled"}>${l(o.body)}</textarea>
              ${q}
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
                    Upload the image to Imgur first, then paste the direct image URL here. This saves the asset for the chapter without changing your markdown body.
                  </div>
                  <div class="asset-list asset-tray">
                    ${d.length?d.map((E,R)=>Lt(E,R,{chapterId:o.id,editable:!0})).join(""):'<div class="empty-state">No assets in this chapter yet.</div>'}
                  </div>
                </div>
              `:""}
              ${xe(o)}
              <div class="notice mono">${l(n.saveStatus||"Tip: use `![alt](image-url)` to place pasted external images into the chapter body.")}</div>
            </div>
          </section>
          <section class="preview-pane">
            <h3>Preview</h3>
            <div class="markdown-preview">${kt(o.body||"*Start writing to preview your chapter here.*")}</div>
          </section>
        </div>
      `:`
        <section class="panel stack">
          <div class="section-header">
            <h3>Reading view</h3>
            <span class="pill">${d.length} asset(s)</span>
          </div>
          <div class="markdown-preview">${kt(o.body||"*This chapter is empty.*")}</div>
        </section>
        ${q}
        ${d.length?`<section class="panel stack"><h3>Referenced images</h3><div class="asset-list">${d.map((E,R)=>Lt(E,R)).join("")}</div></section>`:""}
      `;J(`
      <div class="stack">
        ${Tt([[c?"#/browser":i?"#/creator":"#/browser",c?"Browser":i?"Creator":"Browser"],["#/stories/"+r.id+(c?"?view=browser":""),r.title],["#/stories/"+r.id+"/arcs/"+s.id+(c?"?view=browser":""),s.title],["",o.title||"Untitled chapter"]])}
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
        ${T}
        ${O}
      </div>
    `,c?"browser":i?"creator":"browser",Be(u)),c&&u.length?Ie(o.id,u):Y()}function Lt(e,t=0,a={}){const r=e.url??e.dataUrl??"",s=!!r,o=`![${e.name}](${r})`;return`
    <article class="asset-item">
      ${a.editable?`
        <div class="asset-actions">
          <button class="small-button asset-action-button" type="button" title="Copy markdown" data-action="copy-asset-markdown" data-markdown="${l(o)}">⧉</button>
          <button class="small-button asset-action-button danger-icon" type="button" title="Remove image" data-action="delete-asset" data-chapter-id="${a.chapterId}" data-asset-index="${t}">🗑</button>
        </div>
      `:`
        <div class="asset-actions">
          <button class="small-button asset-action-button" type="button" title="Copy markdown" data-action="copy-asset-markdown" data-markdown="${l(o)}">⧉</button>
        </div>
      `}
      ${s?`<img src="${l(r)}" alt="${l(e.name)}" />`:""}
      <strong title="${l(e.name)}">${l(e.name)}</strong>
      <div class="muted mono asset-markdown" title="${l(o)}">${l(o)}</div>
    </article>
  `}function K(e){J(`
      <div class="stack">
        <section class="panel">
          <h2>Not found</h2>
          <p class="muted">${l(e)}</p>
        </section>
      </div>
    `,"home")}function Tt(e){return`<div class="breadcrumbs">${e.map(([t,a])=>t?`<a href="${t}">${l(a)}</a>`:`<span>${l(a)}</span>`).join("<span>/</span>")}</div>`}async function h(){switch(pe(),n.loadError="",n.route=me(),n.route.name){case"home":return Y(),Ne();case"creator":return Y(),Oe();case"browser":return Y(),De();case"settings":return Y(),Ce();case"story":return Y(),qe(n.route.params.storyId);case"arc":return Y(),_e(n.route.params.storyId,n.route.params.arcId);case"chapter":return Ve(n.route.params.storyId,n.route.params.arcId,n.route.params.chapterId);default:return Y(),K("This page does not exist.")}}async function nt(){try{await h()}catch(e){console.error("Render failed:",e),n.loadError=String(e?.message||e||"The page could not be rendered."),gt.innerHTML=`
      <main class="content">
        <section class="panel stack">
          <h2>Page failed to load</h2>
          <p class="muted">${l(n.loadError)}</p>
          <div class="card-actions">
            <a class="ghost-button" href="#/">Main Menu</a>
            <a class="ghost-button" href="#/creator">Creator</a>
          </div>
        </section>
      </main>
    `}}function Fe(){return{title:document.querySelector("#story-title-input")?.value.trim()??"",tags:(document.querySelector("#story-tags-input")?.value??"").split(",").map(e=>e.trim()).filter(Boolean),visibility:document.querySelector("#story-visibility-input")?.value??"private"}}function Dt(e,t,a){const r=[...e],[s]=r.splice(t,1);return r.splice(a,0,s),r}async function je({chapterId:e,currentStoryId:t,currentArcId:a,currentPhaseId:r}){const s=$();if(!s?.id)return n.saveStatus="Sign in first to move chapters between your stories.",h();const o=await n.adapter.listCreatorStories(s.id);if(!o.length)return n.saveStatus="You need at least one story before moving chapters.",h();const c=(await Promise.all(o.map(g=>n.adapter.getStory(g.id)))).filter(Boolean).filter(g=>(g.arcs??[]).length>0);if(!c.length)return n.saveStatus="Create an arc first, then you can move chapters into it.",h();const d=document.createElement("div");d.className="modal-backdrop",d.innerHTML=`
    <div class="modal-card stack transfer-modal">
      <div>
        <h3>Move chapter</h3>
        <p class="muted">Choose one of your stories, then pick the destination arc and phase.</p>
      </div>
      <select id="transfer-story-select"></select>
      <select id="transfer-arc-select"></select>
      <select id="transfer-phase-select"></select>
      <div class="notice" id="transfer-summary"></div>
      <div class="card-actions">
        <button class="primary-button" id="transfer-confirm">Move chapter</button>
        <button class="ghost-button" id="transfer-cancel">Cancel</button>
      </div>
    </div>
  `,document.body.append(d);const u=d.querySelector("#transfer-story-select"),p=d.querySelector("#transfer-arc-select"),y=d.querySelector("#transfer-phase-select"),I=d.querySelector("#transfer-summary"),T=d.querySelector("#transfer-confirm"),q=()=>d.remove();function O(){return c.find(g=>g.id===u.value)??c[0]}function E(){return O()?.arcs.find(g=>g.id===p.value)??O()?.arcs?.[0]??null}function R(){return E()?.phases.find(g=>g.id===y.value)??E()?.phases?.[0]??null}function at(){const g=O(),k=E(),wt=R(),Et=g?.id===t&&k?.id===a&&wt?.id===r;I.innerHTML=Et?"This chapter is already in that exact phase.":`Destination: <strong>${l(g?.title??"-")}</strong> / <strong>${l(k?.title??"-")}</strong> / <strong>${l(wt?.title??"-")}</strong>`,T.disabled=!g||!k||!wt||Et}function F(){const g=E();y.innerHTML=(g?.phases??[]).map(k=>`<option value="${k.id}" ${k.id===r&&g.id===a?"selected":""}>${l(k.title)}</option>`).join(""),at()}function C(){const g=O();p.innerHTML=(g?.arcs??[]).map(k=>`<option value="${k.id}" ${k.id===a&&g.id===t?"selected":""}>${l(k.title)}</option>`).join(""),F()}u.innerHTML=c.map(g=>`<option value="${g.id}" ${g.id===t?"selected":""}>${l(g.title)}</option>`).join(""),u.addEventListener("change",C),p.addEventListener("change",F),y.addEventListener("change",at),d.querySelector("#transfer-cancel").addEventListener("click",q),T.addEventListener("click",async()=>{const g=R(),k=E();if(!(!g||!k))return await n.adapter.transferChapter(e,k.id,g.id),q(),n.saveStatus="Chapter moved to a new story location.",h()}),C()}async function qt(){if(n.currentUser)return await n.authClient.signOut(),_(null),n.saveStatus="Signed out.",n.authError="",h();if(n.authClient.mode==="firebase")try{const t=await n.authClient.signIn();return _({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email,mode:"firebase",structureView:"list"}),n.authError="",n.saveStatus="Signed in with Firebase.",h()}catch(t){return console.error("Firebase sign-in failed:",t),n.saveStatus="",n.authError=ze(t),h()}const e=document.createElement("div");e.className="modal-backdrop",e.innerHTML=`
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
  `,document.body.append(e),e.querySelector("#modal-login-cancel").addEventListener("click",()=>e.remove()),e.querySelector("#modal-login-submit").addEventListener("click",()=>{const t=e.querySelector("#login-name").value.trim()||"Creator",a=e.querySelector("#login-email").value.trim()||"local@storyforge.local";_({id:`local-${t.toLowerCase().replaceAll(/\s+/g,"-")}`,name:t,email:a,mode:"local",structureView:"list"}),e.remove(),n.saveStatus="Signed in with a local demo profile.",n.authError="",h()})}function ze(e){const t=e?.code?String(e.code):"",a=e?.message?String(e.message):"Unknown sign-in error.";return t==="auth/unauthorized-domain"?"This site domain is not authorized in Firebase Auth. Add your local/dev domain and your GitHub Pages domain in Firebase Console > Authentication > Settings > Authorized domains.":t==="auth/popup-closed-by-user"?"The sign-in popup closed before Firebase completed the login. If it closes instantly every time, double-check Authorized domains and the Google sign-in provider setup.":t==="auth/operation-not-allowed"?"Google sign-in is not enabled for this Firebase project. Enable it in Firebase Console > Authentication > Sign-in method.":t==="auth/invalid-api-key"?"Your Firebase API key is invalid. Recheck the values in your `.env` file and restart the dev server.":t==="auth/network-request-failed"?"Firebase could not complete the sign-in request. Check your connection and any browser privacy extensions blocking popups or auth requests.":t?`${t}: ${a}`:a}async function Ye(e){const t=n.route.params.chapterId,a=await n.adapter.getChapter(t);if(!a)return;const r=[...a.assets??[]];for(const i of e){const c=await Qe(i);r.push({id:crypto.randomUUID(),name:i.name,type:i.type,size:i.size,dataUrl:c})}const s=document.querySelector("#chapter-body-input"),o=r.slice((a.assets??[]).length).map(i=>`
![${i.name}](${i.dataUrl})`).join("");await n.adapter.updateChapter(t,{assets:r,body:`${s.value}${o}`}),n.dragActive=!1,n.saveStatus="Assets added to the chapter. In production these should upload to object storage instead of local state.",await h()}function Ge(e){const t=e.trim();if(!t)throw new Error("Add an image URL first.");let a;try{a=new URL(t)}catch{throw new Error("That image URL is not valid.")}if(!["http:","https:"].includes(a.protocol))throw new Error("Use an http or https image URL.");const r=a.hostname==="imgur.com"||a.hostname==="www.imgur.com"||a.hostname==="i.imgur.com",s=a.pathname.split("/").filter(Boolean).pop()??"",o=/\.[a-z0-9]{2,5}$/i.test(s);return r&&s&&!o&&(a.pathname=`${a.pathname}.png`),a.toString()}async function He(e){const t=await n.adapter.getChapter(e);if(!t)throw new Error("Chapter not found.");const a=document.querySelector("#asset-name-input"),r=document.querySelector("#asset-url-input"),s=document.querySelector("#chapter-title-input"),o=document.querySelector("#chapter-body-input"),i=a?.value.trim()||"image",c=Ge(r?.value??""),d={id:crypto.randomUUID(),name:i,type:"image/external",url:c},u=[...t.assets??[],d];await n.adapter.updateChapter(e,{title:s?.value.trim()||t.title||"Untitled Chapter",body:o?.value??t.body??"",assets:u}),a&&(a.value=""),r&&(r.value=""),n.saveStatus="External image link added to the chapter assets.",await h()}async function Ke(e){if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(e);return}const t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.append(t),t.select(),document.execCommand("copy"),t.remove()}async function Je(e,t){const a=await n.adapter.getChapter(e);if(!a)throw new Error("Chapter not found.");const r=[...a.assets??[]];if(t<0||t>=r.length)throw new Error("Image could not be found.");r.splice(t,1);const s=document.querySelector("#chapter-title-input"),o=document.querySelector("#chapter-body-input");await n.adapter.updateChapter(e,{title:s?.value.trim()||a.title||"Untitled Chapter",body:o?.value??a.body??"",assets:r}),n.saveStatus="Image removed from chapter assets.",await h()}async function Rt(){const e=$();if(!e?.id)return;const t=await n.adapter.getUserProfile?.(e.id);t&&_({...e,name:t.name??e.name,email:t.email??e.email,penName:t.penName??"",structureView:t.structureView??e.structureView??"list"})}function pt(e){return window.confirm(`Are you sure you want to delete this ${e}? This cannot be undone.`)}function Qe(e){return new Promise((t,a)=>{const r=new FileReader;r.onload=()=>t(String(r.result)),r.onerror=()=>a(r.error),r.readAsDataURL(e)})}document.addEventListener("click",async e=>{const t=e.target.closest("[data-action]");if(!t)return;const a=t.dataset.action;if(a==="toggle-login")return qt();if(a==="open-settings")return A("/settings");if(a==="set-structure-view"){const r=$(),s=t.dataset.view==="list"?"list":"grid";if(!r?.id)return _({...r,structureView:s}),h();const o=await n.adapter.updateUserProfile(r.id,{name:r.name,email:r.email,penName:r.penName??"",structureView:s});return _({...r,structureView:o.structureView??s,penName:o.penName??r.penName??"",name:o.name??r.name,email:o.email??r.email}),h()}if(a==="apply-story-filters"){const r=document.querySelector("#story-search").value.trim(),s=document.querySelector("#story-tag-filter").value;return A(`/creator${r||s?`?${new URLSearchParams({q:r,tag:s}).toString()}`:""}`)}if(a==="apply-browser-filters"){const r=document.querySelector("#browser-creator-filter").value,s=document.querySelector("#browser-group-mode").value;return A(`/browser?${new URLSearchParams({creator:r,group:s}).toString()}`)}if(a==="create-story"){const r=$();if(!r)return n.saveStatus="Sign in first to create stories in Firebase mode.",qt();const s=await n.adapter.createStory({creatorId:r.id,creatorName:It(r),title:"Untitled Story",tags:["draft"],visibility:"private"});return A(`/stories/${s.id}`)}if(a==="save-story-settings"){const r=t.dataset.storyId,s=Fe();return await n.adapter.updateStory(r,s),n.saveStatus="Story details saved.",h()}if(a==="open-story-transfer"){const r=M();return r.set("transfer","1"),A(`/stories/${t.dataset.storyId}?${r.toString()}`)}if(a==="close-story-transfer"){const r=M();r.delete("transfer");const s=r.toString();return A(`/stories/${t.dataset.storyId}${s?`?${s}`:""}`)}if(a==="submit-story-transfer"){const r=$();if(!r?.email)return n.saveStatus="Sign in with an email address before transferring ownership.",h();const s=document.querySelector("#story-transfer-email-input")?.value.trim()??"",o=document.querySelector("#story-transfer-confirm-input")?.value.trim()??"";if(!s)return n.saveStatus="Enter the recipient Gmail address first.",h();if(s.toLowerCase()===String(r.email).trim().toLowerCase())return n.saveStatus="You cannot transfer a story to your own email.",h();if(o!=="TRANSFER")return n.saveStatus="Type TRANSFER exactly to confirm ownership transfer.",h();await n.adapter.requestStoryTransfer(t.dataset.storyId,s,{id:r.id,name:It(r),email:r.email}),n.saveStatus="Ownership transfer request sent. The story stays with you until the recipient accepts.";const i=M();i.delete("transfer");const c=i.toString();return A(`/stories/${t.dataset.storyId}${c?`?${c}`:""}`)}if(a==="cancel-story-transfer")return await n.adapter.cancelStoryTransfer(t.dataset.storyId),n.saveStatus="Ownership transfer cancelled.",h();if(a==="accept-story-transfer"){const r=$();try{return await n.adapter.acceptStoryTransfer(t.dataset.storyId,{id:r.id,name:r.name,email:r.email,penName:r.penName??""}),n.saveStatus="Story ownership transferred to you.",A("/creator")}catch(s){return n.saveStatus=`Transfer accept failed: ${String(s?.message||s)}`,h()}}if(a==="decline-story-transfer"){const r=$();try{return await n.adapter.declineStoryTransfer(t.dataset.storyId,r.email),n.saveStatus="Ownership transfer declined.",h()}catch(s){return n.saveStatus=`Transfer decline failed: ${String(s?.message||s)}`,h()}}if(a==="create-arc"){const r=t.dataset.storyId,s=await n.adapter.createArc(r,`Arc ${Math.floor(Math.random()*90+10)}`);return A(`/stories/${r}/arcs/${s.id}`)}if(a==="save-arc-title")return await n.adapter.updateArc(t.dataset.arcId,{title:document.querySelector("#arc-title-input").value.trim()||"Untitled Arc"}),n.saveStatus="Arc title saved.",h();if(a==="add-soundtrack"){const r=await n.adapter.getChapter(t.dataset.chapterId),s=document.querySelector("#soundtrack-label-input")?.value.trim()??"",o=document.querySelector("#soundtrack-url-input")?.value.trim()??"",i=Vt({id:Mt("soundtrack"),label:s,url:o});return i?(await n.adapter.updateChapter(r.id,{soundtracks:[...r.soundtracks??[],{id:i.id,label:i.label,url:i.url}]}),n.saveStatus="Soundtrack added.",h()):(n.saveStatus="Please enter a valid YouTube link.",h())}if(a==="delete-soundtrack"){const r=await n.adapter.getChapter(t.dataset.chapterId);return await n.adapter.updateChapter(r.id,{soundtracks:(r.soundtracks??[]).filter(s=>s.id!==t.dataset.soundtrackId)}),n.saveStatus="Soundtrack removed.",h()}if(a==="move-arc-up"||a==="move-arc-down"){const r=await n.adapter.getStory(t.dataset.storyId),s=Number(t.dataset.index),o=a==="move-arc-up"?-1:1;return await n.adapter.reorderArcs(r.id,Dt(r.arcIds,s,s+o)),h()}if(a==="create-chapter"){const r=await n.adapter.createChapter(t.dataset.arcId,"Untitled Chapter");return A(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}/chapters/${r.id}`)}if(a==="create-phase"){const r=window.prompt("Phase title","New Phase");return r===null?void 0:(await n.adapter.createPhase(t.dataset.arcId,r),n.saveStatus="Phase created.",h())}if(a==="rename-phase"){const r=window.prompt("Rename phase",t.dataset.phaseTitle||"Phase");return r===null?void 0:(await n.adapter.renamePhase(t.dataset.arcId,t.dataset.phaseId,r),n.saveStatus="Phase renamed.",h())}if(a==="open-transfer-chapter")return je({chapterId:t.dataset.chapterId,currentStoryId:t.dataset.storyId,currentArcId:t.dataset.arcId,currentPhaseId:t.dataset.phaseId});if(a==="move-chapter-up"||a==="move-chapter-down"){const r=await n.adapter.getArc(t.dataset.arcId),s=(r.phases??[]).find(c=>c.id===t.dataset.phaseId);if(!s)return;const o=Number(t.dataset.index),i=a==="move-chapter-up"?-1:1;return await n.adapter.reorderPhaseChapters(r.id,s.id,Dt(s.chapterIds,o,o+i)),h()}if(a==="save-chapter"){const r=t.dataset.chapterId;return await n.adapter.updateChapter(r,{title:document.querySelector("#chapter-title-input").value.trim()||"Untitled Chapter",body:document.querySelector("#chapter-body-input").value}),n.saveStatus="Chapter saved.",h()}if(a==="save-pen-name"){const r=$(),s=document.querySelector("#pen-name-input").value.trim(),o=await n.adapter.updateUserProfile(r.id,{name:r.name,email:r.email,penName:s});return _({...r,penName:o.penName??"",name:o.name??r.name,email:o.email??r.email}),n.saveStatus=s?"Pen name saved.":"Pen name cleared. Account name will be used.",h()}if(a==="delete-story")return pt("story")?(await n.adapter.deleteStory(t.dataset.storyId),n.saveStatus="Story deleted.",A("/creator")):void 0;if(a==="delete-arc")return pt("arc")?(await n.adapter.deleteArc(t.dataset.arcId),n.saveStatus="Arc deleted.",A(`/stories/${t.dataset.storyId}`)):void 0;if(a==="delete-chapter")return pt("chapter")?(await n.adapter.deleteChapter(t.dataset.chapterId),n.saveStatus="Chapter deleted.",A(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}`)):void 0;if(a==="add-external-asset")try{return await He(t.dataset.chapterId)}catch(r){return n.saveStatus=String(r.message||r),h()}if(a==="copy-asset-markdown"){try{await Ke(t.dataset.markdown??""),n.saveStatus="Image markdown copied to clipboard."}catch(s){n.saveStatus=`Copy failed: ${String(s.message||s)}`}const r=document.querySelector(".notice.mono");r&&(r.textContent=n.saveStatus);return}if(a==="delete-asset"){if(!pt("image"))return;try{return await Je(t.dataset.chapterId,Number(t.dataset.assetIndex))}catch(r){return n.saveStatus=String(r.message||r),h()}}if(a==="toggle-soundtrack"){if(!N())return;n.soundtrack.paused?we():jt();return}if(a==="toggle-volume-popout"){if(!N())return;n.soundtrack.volumeOpen=!n.soundtrack.volumeOpen,et();return}});document.addEventListener("change",async e=>{const t=e.target;if(t instanceof HTMLSelectElement&&t.dataset.action==="move-chapter-phase")return await n.adapter.moveChapterToPhase(t.dataset.arcId,t.dataset.chapterId,t.value),n.saveStatus="Chapter moved to another phase.",h()});document.addEventListener("input",e=>{if(e.target instanceof HTMLInputElement&&e.target.dataset.action==="set-volume"){Yt(e.target.value);return}if(e.target.id==="chapter-body-input"){const t=document.querySelector(".markdown-preview");t&&(t.innerHTML=kt(e.target.value||"*Start writing to preview your chapter here.*"))}if(e.target.id==="chapter-title-input"){const t=e.target.value.trim()||"Untitled chapter",a=document.querySelector(".page-title h2");a&&(a.textContent=t)}});document.addEventListener("click",e=>{const t=e.target;t instanceof Element&&(t.closest(".quick-tool-stack")||n.soundtrack.volumeOpen&&(n.soundtrack.volumeOpen=!1,et()))});document.addEventListener("wheel",e=>{const t=e.target;t instanceof Element&&t.closest("[data-wheel-volume='true']")&&N()&&(e.preventDefault(),be(e.deltaY<0?5:-5))},{passive:!1});document.addEventListener("dragover",e=>{if(n.route.name!=="chapter")return;e.preventDefault(),n.dragActive=!0;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.add("is-active")});document.addEventListener("dragleave",e=>{if(n.route.name!=="chapter"||e.relatedTarget)return;n.dragActive=!1;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active")});document.addEventListener("drop",async e=>{if(n.route.name!=="chapter")return;e.preventDefault();const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active");const a=[...e.dataTransfer.files].filter(r=>r.type.startsWith("image/"));a.length&&await Ye(a)});window.addEventListener("hashchange",()=>{n.saveStatus="",window.scrollTo({top:0,left:0,behavior:"auto"}),nt()});async function We(){const e=de();n.authClient=e,n.adapter=await ne(e),n.authClient.mode==="firebase"?n.authClient.watchAuth(t=>{t?(_({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email,mode:"firebase"}),Rt().finally(()=>nt())):(_(null),nt())}):n.currentUser?.id&&await Rt(),window.location.hash?nt():A("/")}We().catch(e=>{gt.innerHTML=`
    <main class="content">
      <section class="panel">
        <h2>App failed to start</h2>
        <p class="muted">${l(String(e.message||e))}</p>
        <p class="muted">Current mode: ${l(ue().mode)}</p>
      </section>
    </main>
  `});
