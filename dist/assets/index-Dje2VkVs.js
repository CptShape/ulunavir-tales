import{d as W,a as h,g as w,u as m,s as et,b as Y,q as J,w as j,c as K,e as Gt,f as Ht,i as Yt,h as Jt,j as Kt,G as Qt,o as Wt,k as Zt,l as Xt}from"./firebase-D1mdRFF2.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();const dt="storyforge-state-v1",gt="story-demo",nt="arc-demo",ot="chapter-demo",st="Chapters";function E(e){return String(e??"").trim().toLowerCase()}const it={users:{"demo-user":{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",emailLower:"demo@storyforge.local",penName:""}},stories:{[gt]:{id:gt,title:"The Clockwork Harbor",tags:["fantasy","mystery","serial"],visibility:"public",creatorId:"demo-user",creatorName:"Demo Creator",pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",arcIds:[nt],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},arcs:{[nt]:{id:nt,storyId:gt,title:"Tide One",chapterIds:[ot],soundtracks:[],phases:[{id:"phase-demo",title:st,chapterIds:[ot]}],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},chapters:{[ot]:{id:ot,arcId:nt,title:"Lanterns on the Pier",body:`# Opening scene

A storm hangs over the harbor while the first lanterns come alive.`,assets:[],soundtracks:[],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}}};function O(e){return`${e}-${crypto.randomUUID().slice(0,8)}`}function At(e){return JSON.parse(JSON.stringify(e))}function D(e){return e.flatMap(t=>t.chapterIds??[])}function rt(e=[]){return{id:O("phase"),title:st,chapterIds:[...e]}}function P(e){const t=[...e.chapterIds??[]],a=Array.isArray(e.phases)&&e.phases.length?e.phases.map(i=>({id:i.id??O("phase"),title:i.title?.trim()||st,chapterIds:[...i.chapterIds??[]]})):[rt(t)],r=new Set;for(const i of a)i.chapterIds=i.chapterIds.filter(c=>!c||r.has(c)?!1:(r.add(c),!0));const s=t.filter(i=>!r.has(i));s.length&&a[0].chapterIds.push(...s);const n=D(a);return{...e,chapterIds:n,soundtracks:e.soundtracks??[],phases:a}}function y(){const e=localStorage.getItem(dt);if(!e)return localStorage.setItem(dt,JSON.stringify(it)),At(it);try{return JSON.parse(e)}catch{return localStorage.setItem(dt,JSON.stringify(it)),At(it)}}function S(e){localStorage.setItem(dt,JSON.stringify(e))}function M(e,t){const a=(e.arcIds??[]).map(r=>t.arcs[r]).filter(Boolean).map(r=>ut(r,t));return{...e,pendingTransfer:e.pendingTransfer??null,pendingTransferEmailLower:e.pendingTransferEmailLower??"",pendingTransferStatus:e.pendingTransferStatus??"",arcIds:e.arcIds??[],arcs:a}}function ut(e,t){const a=P(e),r=a.chapterIds.map(s=>t.chapters[s]).filter(Boolean);return{...a,chapterIds:a.chapterIds??[],chapters:r,phases:a.phases.map(s=>({...s,chapters:s.chapterIds.map(n=>t.chapters[n]).filter(Boolean)}))}}function F(e,t){const a=e.arcs[t];if(!a)return!1;const r=P(a),s=JSON.stringify({chapterIds:a.chapterIds??[],phases:a.phases??[]})!==JSON.stringify({chapterIds:r.chapterIds,phases:r.phases});return s&&(e.arcs[t]={...e.arcs[t],chapterIds:r.chapterIds,phases:r.phases}),s}function te(){return{mode:"local",async getUserProfile(e){return e?y().users[e]??null:null},async updateUserProfile(e,t){const a=y(),r=a.users[e]??{id:e,name:t.name??"Creator",email:t.email??"",emailLower:E(t.email),penName:""};a.users[e]={...r,...t,emailLower:E(t.email??r.email)};const s=a.users[e].penName?.trim()||a.users[e].name||"Creator";for(const n of Object.values(a.stories))n.creatorId===e&&(n.creatorName=s);return S(a),a.users[e]},async listIncomingStoryTransfers(e){const t=y(),a=E(e);return a?Object.values(t.stories).filter(r=>r.pendingTransferStatus==="pending"&&r.pendingTransferEmailLower===a).sort((r,s)=>String(s.updatedAt).localeCompare(String(r.updatedAt))).map(r=>M(r,t)):[]},async listCreatorStories(e){if(!e)return[];const t=y();return Object.values(t.stories).filter(a=>a.creatorId===e).sort((a,r)=>r.updatedAt.localeCompare(a.updatedAt)).map(a=>({...a,arcs:(a.arcIds??[]).map(r=>({id:r}))}))},async listBrowserStories(){const e=y();return Object.values(e.stories).filter(t=>t.visibility==="public").sort((t,a)=>t.creatorName.localeCompare(a.creatorName)||t.title.localeCompare(a.title)).map(t=>({...t,arcs:(t.arcIds??[]).map(a=>({id:a}))}))},async getStory(e){const t=y();let a=!1;for(const s of t.stories[e]?.arcIds??[])a=F(t,s)||a;a&&S(t);const r=t.stories[e];return r?M(r,t):null},async getArc(e){const t=y();F(t,e)&&S(t);const r=t.arcs[e];return r?ut(r,t):null},async getChapter(e){return y().chapters[e]??null},async createStory({creatorId:e,creatorName:t,title:a,tags:r,visibility:s}){const n=y(),i=O("story"),c=new Date().toISOString();return n.stories[i]={id:i,title:a,tags:r,visibility:s,creatorId:e,creatorName:t,arcIds:[],createdAt:c,updatedAt:c},S(n),M(n.stories[i],n)},async updateStory(e,t){const a=y();if(!a.stories[e])throw new Error("Story not found.");return a.stories[e]={...a.stories[e],...t,updatedAt:new Date().toISOString()},S(a),M(a.stories[e],a)},async requestStoryTransfer(e,t,a){const r=y(),s=r.stories[e];if(!s)throw new Error("Story not found.");const n=E(t);if(!n)throw new Error("Enter a valid Gmail address.");return s.pendingTransfer={targetEmail:String(t).trim(),targetEmailLower:n,requestedBy:a?.id??s.creatorId,requestedByName:a?.name??s.creatorName,requestedAt:new Date().toISOString(),status:"pending"},s.pendingTransferEmailLower=n,s.pendingTransferStatus="pending",s.updatedAt=new Date().toISOString(),S(r),M(s,r)},async cancelStoryTransfer(e){const t=y(),a=t.stories[e];if(!a)throw new Error("Story not found.");return a.pendingTransfer=null,a.pendingTransferEmailLower="",a.pendingTransferStatus="",a.updatedAt=new Date().toISOString(),S(t),M(a,t)},async acceptStoryTransfer(e,t){const a=y(),r=a.stories[e];if(!r)throw new Error("Story not found.");const s=E(t?.email);if(!s||r.pendingTransferStatus!=="pending"||r.pendingTransferEmailLower!==s)throw new Error("This transfer request is no longer available.");const n=a.users[t.id]??{id:t.id,name:t.name??"Creator",email:t.email??"",emailLower:s,penName:t.penName??""};return a.users[t.id]=n,r.creatorId=t.id,r.creatorName=n.penName?.trim()||n.name||t.name||"Creator",r.pendingTransfer=null,r.pendingTransferEmailLower="",r.pendingTransferStatus="",r.updatedAt=new Date().toISOString(),S(a),M(r,a)},async declineStoryTransfer(e,t){const a=y(),r=a.stories[e];if(!r)throw new Error("Story not found.");if(r.pendingTransferStatus!=="pending"||r.pendingTransferEmailLower!==E(t))throw new Error("This transfer request is no longer available.");return r.pendingTransfer=null,r.pendingTransferEmailLower="",r.pendingTransferStatus="",r.updatedAt=new Date().toISOString(),S(a),M(r,a)},async createArc(e,t){const a=y(),r=a.stories[e];if(!r)throw new Error("Story not found.");const s=O("arc"),n=new Date().toISOString();return a.arcs[s]={id:s,storyId:e,title:t,chapterIds:[],soundtracks:[],phases:[rt()],createdAt:n,updatedAt:n},r.arcIds.push(s),r.updatedAt=n,S(a),ut(a.arcs[s],a)},async updateArc(e,t){const a=y(),r=a.arcs[e];if(!r)throw new Error("Arc not found.");return r.title=t.title??r.title,r.phases=t.phases??r.phases,r.chapterIds=t.chapterIds??r.chapterIds,r.soundtracks=t.soundtracks??r.soundtracks??[],r.updatedAt=new Date().toISOString(),a.stories[r.storyId].updatedAt=r.updatedAt,S(a),ut(r,a)},async reorderArcs(e,t){const a=y();a.stories[e].arcIds=[...t],a.stories[e].updatedAt=new Date().toISOString(),S(a)},async createChapter(e,t){const a=y(),r=a.arcs[e];if(!r)throw new Error("Arc not found.");const s=O("chapter"),n=new Date().toISOString();return a.chapters[s]={id:s,arcId:e,title:t,body:"",assets:[],soundtracks:[],createdAt:n,updatedAt:n},r.chapterIds.push(s),r.phases?.length||(r.phases=[rt()]),r.phases[0].chapterIds.push(s),r.updatedAt=n,a.stories[r.storyId].updatedAt=n,S(a),a.chapters[s]},async updateChapter(e,t){const a=y();if(!a.chapters[e])throw new Error("Chapter not found.");a.chapters[e]={...a.chapters[e],...t,updatedAt:new Date().toISOString()};const r=a.arcs[a.chapters[e].arcId];return r&&(r.updatedAt=a.chapters[e].updatedAt,a.stories[r.storyId].updatedAt=r.updatedAt),S(a),a.chapters[e]},async updateChapterOrder(e,t){const a=y();a.arcs[e].chapterIds=[...t],a.arcs[e].updatedAt=new Date().toISOString(),a.stories[a.arcs[e].storyId].updatedAt=a.arcs[e].updatedAt,S(a)},async createPhase(e,t){const a=y();F(a,e);const r=a.arcs[e],s={id:O("phase"),title:t?.trim()||"New Phase",chapterIds:[]};return r.phases.push(s),r.updatedAt=new Date().toISOString(),a.stories[r.storyId].updatedAt=r.updatedAt,S(a),s},async renamePhase(e,t,a){const r=y();F(r,e);const s=r.arcs[e],n=s.phases.find(i=>i.id===t);if(!n)throw new Error("Phase not found.");return n.title=a?.trim()||st,s.updatedAt=new Date().toISOString(),r.stories[s.storyId].updatedAt=s.updatedAt,S(r),n},async moveChapterToPhase(e,t,a){const r=y();F(r,e);const s=r.arcs[e];for(const i of s.phases)i.chapterIds=i.chapterIds.filter(c=>c!==t);const n=s.phases.find(i=>i.id===a);if(!n)throw new Error("Phase not found.");n.chapterIds.push(t),s.chapterIds=D(s.phases),s.updatedAt=new Date().toISOString(),r.stories[s.storyId].updatedAt=s.updatedAt,S(r)},async transferChapter(e,t,a){const r=y(),s=r.chapters[e],n=r.arcs[t];if(!s)throw new Error("Chapter not found.");if(!n)throw new Error("Target arc not found.");F(r,s.arcId),F(r,t);const i=r.arcs[s.arcId],c=r.arcs[t];if(!(c.phases??[]).find(p=>p.id===a))throw new Error("Target phase not found.");const u=new Date().toISOString();return i&&(i.chapterIds=(i.chapterIds??[]).filter(p=>p!==e),i.phases=(i.phases??[]).map(p=>({...p,chapterIds:(p.chapterIds??[]).filter(g=>g!==e)})),i.updatedAt=u,r.stories[i.storyId]&&(r.stories[i.storyId].updatedAt=u)),c.phases=(c.phases??[]).map(p=>p.id===a?{...p,chapterIds:[...p.chapterIds??[],e]}:p),c.chapterIds=D(c.phases),c.updatedAt=u,r.stories[c.storyId]&&(r.stories[c.storyId].updatedAt=u),r.chapters[e]={...s,arcId:t,updatedAt:u},S(r),r.chapters[e]},async reorderPhaseChapters(e,t,a){const r=y();F(r,e);const s=r.arcs[e],n=s.phases.find(i=>i.id===t);if(!n)throw new Error("Phase not found.");n.chapterIds=[...a],s.chapterIds=D(s.phases),s.updatedAt=new Date().toISOString(),r.stories[s.storyId].updatedAt=s.updatedAt,S(r)},async deleteChapter(e){const t=y(),a=t.chapters[e];if(!a)return;const r=t.arcs[a.arcId];if(r){r.chapterIds=(r.chapterIds??[]).filter(n=>n!==e),r.phases=(r.phases??[]).map(n=>({...n,chapterIds:(n.chapterIds??[]).filter(i=>i!==e)})),r.updatedAt=new Date().toISOString();const s=t.stories[r.storyId];s&&(s.updatedAt=r.updatedAt)}delete t.chapters[e],S(t)},async deleteArc(e){const t=y(),a=t.arcs[e];if(!a)return;for(const s of a.chapterIds??[])delete t.chapters[s];const r=t.stories[a.storyId];r&&(r.arcIds=(r.arcIds??[]).filter(s=>s!==e),r.updatedAt=new Date().toISOString()),delete t.arcs[e],S(t)},async deleteStory(e){const t=y(),a=t.stories[e];if(a){for(const r of a.arcIds??[]){const s=t.arcs[r];for(const n of s?.chapterIds??[])delete t.chapters[n];delete t.arcs[r]}delete t.stories[e],S(t)}}}}function ct(e){return{...e,pendingTransfer:e.pendingTransfer??null,pendingTransferEmailLower:e.pendingTransferEmailLower??"",pendingTransferStatus:e.pendingTransferStatus??"",arcIds:e.arcIds??[],tags:e.tags??[],arcs:(e.arcIds??[]).map(t=>({id:t}))}}function b(e){return e.exists()?{id:e.id,...e.data()}:null}function lt(e,t){const a=new Map(t.map((r,s)=>[r,s]));return[...e].sort((r,s)=>(a.get(r.id)??0)-(a.get(s.id)??0))}async function q(e,t){const a=await w(h(e,"stories",t)),r=b(a);if(!r)return null;const s=await Y(J(K(e,"arcs"),j("storyId","==",t))),n=[];for(const d of lt(s.docs.map(u=>({id:u.id,...u.data(),chapterIds:u.data().chapterIds??[]})),r.arcIds??[])){const u=P(d);JSON.stringify({chapterIds:d.chapterIds??[],phases:d.phases??[]})!==JSON.stringify({chapterIds:u.chapterIds,phases:u.phases})&&await m(h(e,"arcs",d.id),{chapterIds:u.chapterIds,phases:u.phases}),n.push(u)}const i=await Promise.all(n.map(async d=>{const u=await Y(J(K(e,"chapters"),j("arcId","==",d.id)));return[d.id,lt(u.docs.map(p=>({id:p.id,...p.data(),assets:p.data().assets??[],soundtracks:p.data().soundtracks??[]})),d.chapterIds??[])]})),c=Object.fromEntries(i);return{...r,tags:r.tags??[],arcIds:r.arcIds??[],arcs:n.map(d=>({...d,chapterIds:d.chapterIds??[],phases:d.phases.map(u=>({...u,chapters:(c[d.id]??[]).filter(p=>(u.chapterIds??[]).includes(p.id))})),chapters:c[d.id]??[]}))}}async function Tt(e,t){if(!t?.id)return;const a=h(e,"users",t.id),r=await w(a),s={id:t.id,name:t.name??"Creator",email:t.email??"",emailLower:E(t.email),penName:t.penName??(r.exists()?r.data().penName:"")??"",structureView:t.structureView??(r.exists()?r.data().structureView:"list")??"list",updatedAt:new Date().toISOString()};if(r.exists()){await m(a,s);return}await et(a,{...s,createdAt:new Date().toISOString()})}function ee(e){const t=e.db;return{mode:"firebase",async getUserProfile(a){if(!a)return null;const r=await w(h(t,"users",a));return b(r)},async updateUserProfile(a,r){const s=h(t,"users",a),n=await w(s),i={id:a,updatedAt:new Date().toISOString(),...r,emailLower:E(r.email??(n.exists()?n.data().email:""))};n.exists()?await m(s,i):await et(s,{createdAt:new Date().toISOString(),...i});const c=await w(s),d=b(c),u=d?.penName?.trim()||d?.name||"Creator",p=await Y(J(K(t,"stories"),j("creatorId","==",a)));return await Promise.all(p.docs.map(g=>m(h(t,"stories",g.id),{creatorName:u}))),d},async listIncomingStoryTransfers(a){const r=E(a);return r?(await Y(J(K(t,"stories"),j("pendingTransferStatus","==","pending"),j("pendingTransferEmailLower","==",r)))).docs.map(n=>ct({id:n.id,...n.data()})).sort((n,i)=>String(i.updatedAt).localeCompare(String(n.updatedAt))):[]},async listCreatorStories(a){return a?(await Y(J(K(t,"stories"),j("creatorId","==",a)))).docs.map(s=>ct({id:s.id,...s.data()})).sort((s,n)=>String(n.updatedAt).localeCompare(String(s.updatedAt))):[]},async listBrowserStories(){return(await Y(J(K(t,"stories"),j("visibility","==","public")))).docs.map(r=>ct({id:r.id,...r.data()})).sort((r,s)=>r.creatorName.localeCompare(s.creatorName)||r.title.localeCompare(s.title))},async getStory(a){return q(t,a)},async getArc(a){const r=await w(h(t,"arcs",a)),s=b(r),n=s?P(s):null;if(!n)return null;JSON.stringify({chapterIds:s.chapterIds??[],phases:s.phases??[]})!==JSON.stringify({chapterIds:n.chapterIds,phases:n.phases})&&await m(h(t,"arcs",a),{chapterIds:n.chapterIds,phases:n.phases});const i=await Y(J(K(t,"chapters"),j("arcId","==",a)));return{...n,chapterIds:n.chapterIds??[],phases:n.phases.map(c=>({...c,chapters:lt(i.docs.map(d=>({id:d.id,...d.data(),assets:d.data().assets??[],soundtracks:d.data().soundtracks??[]})).filter(d=>(c.chapterIds??[]).includes(d.id)),c.chapterIds??[])})),chapters:lt(i.docs.map(c=>({id:c.id,...c.data(),assets:c.data().assets??[],soundtracks:c.data().soundtracks??[]})),n.chapterIds??[])}},async getChapter(a){const r=await w(h(t,"chapters",a)),s=b(r);return s?{...s,assets:s.assets??[],soundtracks:s.soundtracks??[]}:null},async createStory({creatorId:a,creatorName:r,title:s,tags:n,visibility:i}){const c=O("story"),d=new Date().toISOString(),u={id:c,title:s,tags:n,visibility:i,creatorId:a,creatorName:r,arcIds:[],createdAt:d,updatedAt:d};return await et(h(t,"stories",c),u),await Tt(t,{id:a,name:r}),ct(u)},async updateStory(a,r){return await m(h(t,"stories",a),{...r,updatedAt:new Date().toISOString()}),q(t,a)},async requestStoryTransfer(a,r,s){const n=E(r);if(!n)throw new Error("Enter a valid Gmail address.");return await m(h(t,"stories",a),{pendingTransfer:{targetEmail:String(r).trim(),targetEmailLower:n,requestedBy:s?.id??"",requestedByName:s?.name??"Creator",requestedAt:new Date().toISOString(),status:"pending"},pendingTransferEmailLower:n,pendingTransferStatus:"pending",updatedAt:new Date().toISOString()}),q(t,a)},async cancelStoryTransfer(a){return await m(h(t,"stories",a),{pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:new Date().toISOString()}),q(t,a)},async acceptStoryTransfer(a,r){const s=await q(t,a),n=E(r?.email);if(!s)throw new Error("Story not found.");if(!n||s.pendingTransferStatus!=="pending"||s.pendingTransferEmailLower!==n)throw new Error("This transfer request is no longer available.");await Tt(t,r);const i=await w(h(t,"users",r.id)),c=b(i)??r,d=c.penName?.trim()||c.name||r.name||"Creator",u=new Date().toISOString();return await m(h(t,"stories",a),{creatorId:r.id,creatorName:d,pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:u}),q(t,a)},async declineStoryTransfer(a,r){const s=await q(t,a);if(!s)throw new Error("Story not found.");if(s.pendingTransferStatus!=="pending"||s.pendingTransferEmailLower!==E(r))throw new Error("This transfer request is no longer available.");return await m(h(t,"stories",a),{pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:new Date().toISOString()}),q(t,a)},async createArc(a,r){const s=h(t,"stories",a),n=await w(s),i=b(n);if(!i)throw new Error("Story not found.");const c=O("arc"),d=new Date().toISOString(),u={id:c,storyId:a,title:r,chapterIds:[],soundtracks:[],phases:[rt()],createdAt:d,updatedAt:d};return await et(h(t,"arcs",c),u),await m(s,{arcIds:[...i.arcIds??[],c],updatedAt:d}),u},async updateArc(a,r){const s=h(t,"arcs",a),n=new Date().toISOString();await m(s,{...r,updatedAt:n});const i=await w(s),c=b(i);return c?.storyId&&await m(h(t,"stories",c.storyId),{updatedAt:n}),this.getArc(a)},async reorderArcs(a,r){await m(h(t,"stories",a),{arcIds:r,updatedAt:new Date().toISOString()})},async createChapter(a,r){const s=h(t,"arcs",a),n=await w(s),i=b(n);if(!i)throw new Error("Arc not found.");const c=O("chapter"),d=new Date().toISOString(),u={id:c,arcId:a,title:r,body:"",assets:[],soundtracks:[],createdAt:d,updatedAt:d};await et(h(t,"chapters",c),u);const p=P(i);return p.phases.length||(p.phases=[rt()]),p.phases[0].chapterIds.push(c),await m(s,{chapterIds:[...i.chapterIds??[],c],phases:p.phases,updatedAt:d}),await m(h(t,"stories",i.storyId),{updatedAt:d}),u},async updateChapter(a,r){const s=h(t,"chapters",a),n=new Date().toISOString();await m(s,{...r,updatedAt:n});const i=await w(s),c=b(i);if(c?.arcId){const d=await w(h(t,"arcs",c.arcId)),u=b(d);u&&(await m(h(t,"arcs",u.id),{updatedAt:n}),await m(h(t,"stories",u.storyId),{updatedAt:n}))}return this.getChapter(a)},async updateChapterOrder(a,r){const s=h(t,"arcs",a),n=new Date().toISOString();await m(s,{chapterIds:r,updatedAt:n});const i=await w(s),c=b(i);c?.storyId&&await m(h(t,"stories",c.storyId),{updatedAt:n})},async createPhase(a,r){const s=h(t,"arcs",a),n=await w(s),i=b(n),c=i?P(i):null;if(!c)throw new Error("Arc not found.");const d={id:O("phase"),title:r?.trim()||"New Phase",chapterIds:[]},u=[...c.phases,d],p=new Date().toISOString();return await m(s,{phases:u,chapterIds:D(u),updatedAt:p}),await m(h(t,"stories",c.storyId),{updatedAt:p}),d},async renamePhase(a,r,s){const n=h(t,"arcs",a),i=await w(n),c=b(i),d=c?P(c):null;if(!d)throw new Error("Arc not found.");const u=d.phases.map(g=>g.id===r?{...g,title:s?.trim()||st}:g),p=new Date().toISOString();return await m(n,{phases:u,updatedAt:p}),await m(h(t,"stories",d.storyId),{updatedAt:p}),u.find(g=>g.id===r)},async moveChapterToPhase(a,r,s){const n=h(t,"arcs",a),i=await w(n),c=b(i),d=c?P(c):null;if(!d)throw new Error("Arc not found.");const u=d.phases.map(A=>({...A,chapterIds:(A.chapterIds??[]).filter(N=>N!==r)})),p=u.find(A=>A.id===s);if(!p)throw new Error("Phase not found.");p.chapterIds.push(r);const g=new Date().toISOString();await m(n,{phases:u,chapterIds:D(u),updatedAt:g}),await m(h(t,"stories",d.storyId),{updatedAt:g})},async transferChapter(a,r,s){const n=h(t,"chapters",a),i=await w(n),c=b(i);if(!c)throw new Error("Chapter not found.");const d=h(t,"arcs",c.arcId),u=h(t,"arcs",r),[p,g]=await Promise.all([w(d),w(u)]),A=b(p),N=b(g),L=A?P(A):null,C=N?P(N):null;if(!L)throw new Error("Source arc not found.");if(!C)throw new Error("Target arc not found.");if(!(C.phases??[]).find(T=>T.id===s))throw new Error("Target phase not found.");const X=L.phases.map(T=>({...T,chapterIds:(T.chapterIds??[]).filter(v=>v!==a)})),tt=C.phases.map(T=>T.id===s?{...T,chapterIds:[...T.chapterIds??[],a]}:T),B=new Date().toISOString();return await Promise.all([m(d,{phases:X,chapterIds:D(X),updatedAt:B}),m(u,{phases:tt,chapterIds:D(tt),updatedAt:B}),m(n,{arcId:r,updatedAt:B})]),await Promise.all([m(h(t,"stories",L.storyId),{updatedAt:B}),m(h(t,"stories",C.storyId),{updatedAt:B})]),this.getChapter(a)},async reorderPhaseChapters(a,r,s){const n=h(t,"arcs",a),i=await w(n),c=b(i),d=c?P(c):null;if(!d)throw new Error("Arc not found.");const u=d.phases.map(g=>g.id===r?{...g,chapterIds:[...s]}:g),p=new Date().toISOString();await m(n,{phases:u,chapterIds:D(u),updatedAt:p}),await m(h(t,"stories",d.storyId),{updatedAt:p})},async deleteChapter(a){const r=await w(h(t,"chapters",a)),s=b(r);if(!s)return;const n=h(t,"arcs",s.arcId),i=await w(n),c=b(i),d=new Date().toISOString();c&&(await m(n,{chapterIds:(c.chapterIds??[]).filter(u=>u!==a),phases:(c.phases??[]).map(u=>({...u,chapterIds:(u.chapterIds??[]).filter(p=>p!==a)})),updatedAt:d}),await m(h(t,"stories",c.storyId),{updatedAt:d})),await W(h(t,"chapters",a))},async deleteArc(a){const r=await w(h(t,"arcs",a)),s=b(r);if(!s)return;for(const d of s.chapterIds??[])await W(h(t,"chapters",d));const n=h(t,"stories",s.storyId),i=await w(n),c=b(i);c&&await m(n,{arcIds:(c.arcIds??[]).filter(d=>d!==a),updatedAt:new Date().toISOString()}),await W(h(t,"arcs",a))},async deleteStory(a){const r=await q(t,a);if(r){for(const s of r.arcs??[]){for(const n of s.chapters??[])await W(h(t,"chapters",n.id));await W(h(t,"arcs",s.id))}await W(h(t,"stories",a))}}}}async function ae(e){return e?.mode==="firebase"&&e.db?ee(e):te()}const re={VITE_APP_MODE:"firebase",VITE_FIREBASE_API_KEY:"AIzaSyC8-b4_lzrCk2RhsqSEMkcxNKgMzVx_WJ4",VITE_FIREBASE_APP_ID:"1:309677315541:web:ef90a15da4ee29c03fd95c",VITE_FIREBASE_AUTH_DOMAIN:"ulunavir-tales.firebaseapp.com",VITE_FIREBASE_MESSAGING_SENDER_ID:"309677315541",VITE_FIREBASE_PROJECT_ID:"ulunavir-tales",VITE_FIREBASE_STORAGE_BUCKET:"ulunavir-tales.firebasestorage.app"},wt={mode:"local",firebase:{apiKey:"",authDomain:"",projectId:"",appId:"",storageBucket:"",messagingSenderId:""}};function se(){const e=re??{};return{mode:e.VITE_APP_MODE??wt.mode,firebase:{apiKey:e.VITE_FIREBASE_API_KEY??"",authDomain:e.VITE_FIREBASE_AUTH_DOMAIN??"",projectId:e.VITE_FIREBASE_PROJECT_ID??"",appId:e.VITE_FIREBASE_APP_ID??"",storageBucket:e.VITE_FIREBASE_STORAGE_BUCKET??"",messagingSenderId:e.VITE_FIREBASE_MESSAGING_SENDER_ID??""}}}function qt(){const e=globalThis.STORYFORGE_CONFIG??{},t=se();return{...wt,...t,...e,firebase:{...wt.firebase,...t.firebase,...e.firebase??{}}}}function ne(e){return e.mode==="firebase"&&!!(e.firebase.projectId&&e.firebase.apiKey&&e.firebase.appId)}function oe(){const e=qt();if(!ne(e))return{mode:"local",auth:null,db:null,signIn:async()=>null,signOut:async()=>null,watchAuth:n=>(n(null),()=>{})};const t=Gt().length?Ht():Yt(e.firebase),a=Jt(t),r=Kt(t),s=new Qt;return{mode:"firebase",auth:a,db:r,signIn:async()=>(await Xt(a,s)).user,signOut:async()=>Zt(a),watchAuth:n=>Wt(a,n)}}function ie(){return qt()}const pt=document.querySelector("#app"),o={adapter:null,authClient:null,currentUser:JSON.parse(localStorage.getItem("storyforge-session")??"null"),route:{name:"home",params:{}},dragActive:!1,saveStatus:"",authError:"",loadError:"",soundtrack:{arcId:"",queue:[],currentIndex:0,paused:!0,volume:70,volumeOpen:!1,mode:"idle",ready:!1,autoplayAttempted:!1,activeKey:"",youtubePlayer:null,syncToken:0}},Dt="storyforge-soundtrack-state";function ce(){try{const e=localStorage.getItem(Dt);return e?JSON.parse(e):{}}catch{return{}}}function Rt(){const{arcId:e,currentIndex:t,paused:a,volume:r}=o.soundtrack;localStorage.setItem(Dt,JSON.stringify({arcId:e,currentIndex:t,paused:a,volume:r}))}function St(e=I()){return e?e.penName?.trim()||e.name||"Creator":"Guest"}function Ut(e=I()){return e?.structureView==="grid"?"grid":"list"}function U(e){o.currentUser=e,localStorage.setItem("storyforge-session",JSON.stringify(e))}function de(){document.querySelectorAll(".modal-backdrop").forEach(e=>e.remove())}function k(e){const t=`#${e}`;if(window.location.hash===t){at(),window.scrollTo({top:0,left:0,behavior:"auto"});return}window.location.hash=e}function ue(){const e=window.location.hash.replace(/^#/,"")||"/",[t]=e.split("?"),a=t.split("/").filter(Boolean);return a.length===0?{name:"home",params:{}}:a[0]==="creator"?{name:"creator",params:{}}:a[0]==="browser"?{name:"browser",params:{}}:a[0]==="settings"?{name:"settings",params:{}}:a[0]==="stories"&&a[1]?a[2]==="arcs"&&a[3]&&a[4]==="chapters"&&a[5]?{name:"chapter",params:{storyId:a[1],arcId:a[3],chapterId:a[5]}}:a[2]==="arcs"&&a[3]?{name:"arc",params:{storyId:a[1],arcId:a[3]}}:{name:"story",params:{storyId:a[1]}}:{name:"not-found",params:{}}}function x(){return new URLSearchParams(window.location.hash.split("?")[1]??"")}function I(){return o.currentUser?o.currentUser:o.authClient?.mode==="firebase"?null:{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",mode:"demo",structureView:"list"}}function It(e){return!!(e?.creatorId&&I()?.id&&e.creatorId===I().id)}function l(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function xt(e){return`${e}-${crypto.randomUUID().slice(0,8)}`}function le(e,t="Soundtrack"){return e?.trim()||t}function pe(e){try{const t=new URL(e);if(t.hostname==="youtu.be")return t.pathname.replace(/\//g,"")||null;if(t.hostname.includes("youtube.com")){if(t.pathname==="/watch")return t.searchParams.get("v");const a=t.pathname.split("/").filter(Boolean);if(["embed","shorts","live"].includes(a[0]))return a[1]??null}}catch{return null}return null}function _t(e){const t=e?.url?.trim(),a=t&&!/^https?:\/\//i.test(t)?`https://${t}`:t;if(!a)return null;const r=pe(a);return r?{id:e.id??xt("soundtrack"),label:le(e.label,"YouTube track"),url:a,source:"youtube",videoId:r}:null}function he(e=[]){return e.map(_t).filter(Boolean)}function me(){let e=document.querySelector("#soundtrack-layer");return e||(e=document.createElement("div"),e.id="soundtrack-layer",e.innerHTML=`
    <div id="youtube-soundtrack-host"></div>
  `,document.body.append(e),e)}function fe(e,t){return t()?Promise.resolve():new Promise((a,r)=>{const s=[...document.querySelectorAll("script")].find(i=>i.src===e);if(s){s.addEventListener("load",()=>a(),{once:!0}),s.addEventListener("error",()=>r(new Error(`Failed to load ${e}`)),{once:!0});return}const n=document.createElement("script");n.src=e,n.async=!0,n.addEventListener("load",()=>a(),{once:!0}),n.addEventListener("error",()=>r(new Error(`Failed to load ${e}`)),{once:!0}),document.head.append(n)})}function z(){const e=o.soundtrack.queue??[];if(!e.length)return null;const t=Math.max(0,Math.min(o.soundtrack.currentIndex,e.length-1));return e[t]??null}function Z(){const e=z(),t=document.querySelector("[data-action='toggle-soundtrack']");t&&(t.disabled=!e,t.classList.toggle("is-active",!!e&&!o.soundtrack.paused),t.setAttribute("aria-pressed",String(!!e&&!o.soundtrack.paused)),t.setAttribute("title",e?`${o.soundtrack.paused?"Resume":"Pause"} ${e.label}`:"No soundtrack available"));const a=document.querySelector("[data-action='toggle-volume-popout']");a&&(a.disabled=!e,a.classList.toggle("is-open",o.soundtrack.volumeOpen),a.style.setProperty("--volume-fill",`${R(o.soundtrack.volume)}%`),a.setAttribute("title",e?`Volume ${R(o.soundtrack.volume)}%`:"No soundtrack available"));const r=document.querySelector("#soundtrack-volume-slider");r&&(r.value=String(R(o.soundtrack.volume)));const s=document.querySelector("#soundtrack-volume-value");s&&(s.textContent=`${R(o.soundtrack.volume)}%`);const n=document.querySelector(".volume-popout");n&&(n.hidden=!o.soundtrack.volumeOpen)}function Q(){Rt(),Z()}function Bt(){const e=document.querySelector("#soundtrack-status");e&&(e.textContent="No soundtrack loaded."),Z()}function ht(e){const t=document.querySelector("#soundtrack-status");t&&(t.textContent=e)}function Mt(){const e=z();o.soundtrack.mode==="youtube"&&o.soundtrack.youtubePlayer?.pauseVideo&&o.soundtrack.youtubePlayer.pauseVideo(),o.soundtrack.paused=!0,e&&ht(`Paused: ${e.label}`),Q()}function ge(){const e=z();e&&(o.soundtrack.mode==="youtube"&&o.soundtrack.youtubePlayer?.playVideo&&o.soundtrack.youtubePlayer.playVideo(),o.soundtrack.paused=!1,ht(`Now playing: ${e.label}`),Q())}function ve(){o.soundtrack.queue.length&&(o.soundtrack.currentIndex=(o.soundtrack.currentIndex+1)%o.soundtrack.queue.length,o.soundtrack.activeKey="",o.soundtrack.ready=!1,o.soundtrack.autoplayAttempted=!1,Q(),jt())}function R(e){return Math.max(0,Math.min(100,Math.round(Number(e)||0)))}function Ft(){const e=R(o.soundtrack.volume);o.soundtrack.volume=e,o.soundtrack.youtubePlayer?.setVolume&&o.soundtrack.youtubePlayer.setVolume(e),Q()}function Vt(e){o.soundtrack.volume=R(e),Ft()}function ye(e){Vt(R(o.soundtrack.volume+e))}async function we(e,t){await fe("https://www.youtube.com/iframe_api",()=>!!window.YT?.Player),t===o.soundtrack.syncToken&&(me(),o.soundtrack.youtubePlayer?o.soundtrack.youtubePlayer.loadVideoById(e.videoId):await new Promise(a=>{const r=()=>{o.soundtrack.youtubePlayer=new window.YT.Player("youtube-soundtrack-host",{height:"200",width:"320",videoId:e.videoId,playerVars:{autoplay:1,controls:1,rel:0},events:{onReady:()=>a(),onStateChange:s=>{if(s.data===window.YT.PlayerState.ENDED){ve();return}s.data===window.YT.PlayerState.PLAYING&&(o.soundtrack.paused=!1,Q()),s.data===window.YT.PlayerState.PAUSED&&(o.soundtrack.paused=!0,Q())}}})};if(window.YT?.Player)r();else{const s=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{s?.(),r()}}}),t===o.soundtrack.syncToken&&(o.soundtrack.mode="youtube",o.soundtrack.ready=!0,o.soundtrack.activeKey=e.id,Ft(),ht(`Now playing: ${e.label}`),o.soundtrack.paused||o.soundtrack.youtubePlayer.playVideo(),Z()))}async function jt(){const e=++o.soundtrack.syncToken,t=z();if(!t){o.soundtrack.arcId="",o.soundtrack.queue=[],o.soundtrack.mode="idle",o.soundtrack.ready=!1,o.soundtrack.activeKey="",Mt(),Bt();return}try{if(t.source==="youtube"){await we(t,e);return}}catch(a){o.saveStatus=`Soundtrack error: ${String(a.message||a)}`,ht("Soundtrack could not be loaded."),Z()}}function Se(e,t){const a=ce(),r=e!==o.soundtrack.arcId||JSON.stringify(t.map(s=>s.id))!==JSON.stringify((o.soundtrack.queue??[]).map(s=>s.id));o.soundtrack.arcId=e,o.soundtrack.queue=t,r&&(o.soundtrack.currentIndex=a.arcId===e&&typeof a.currentIndex=="number"?Math.max(0,Math.min(a.currentIndex,t.length-1)):0,o.soundtrack.paused=a.arcId===e?!!a.paused:!1,o.soundtrack.volume=typeof a.volume=="number"?R(a.volume):o.soundtrack.volume,o.soundtrack.ready=!1,o.soundtrack.activeKey=""),Q(),jt()}function V(){o.soundtrack.arcId="",o.soundtrack.queue=[],o.soundtrack.currentIndex=0,o.soundtrack.paused=!0,o.soundtrack.volumeOpen=!1,o.soundtrack.activeKey="",o.soundtrack.ready=!1,o.soundtrack.youtubePlayer?.pauseVideo&&o.soundtrack.youtubePlayer.pauseVideo(),Bt(),Rt()}function bt(e){return l(e).replace(/```([\s\S]*?)```/g,(u,p)=>`<pre><code>${p.trim()}</code></pre>`).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<p><img alt="$1" src="$2" /></p>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/(?:^|\n)- (.*(?:\n- .*)*)/g,u=>`
<ul>${u.trim().split(`
`).map(g=>g.replace(/^- /,"").trim()).map(g=>`<li>${g}</li>`).join("")}</ul>`).split(/\n{2,}/).map(u=>/^<(h\d|ul|pre|p)/.test(u.trim())?u:`<p>${u.replace(/\n/g,"<br />")}</p>`).join("")}function mt(e){return new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short"}).format(new Date(e))}function be(e,t,a){if(!t)return e;const r=t.toLowerCase();return e.filter(s=>a(s).toLowerCase().includes(r))}function Ie(e){return[...new Set(e.flatMap(t=>t.tags))].sort((t,a)=>t.localeCompare(a))}function $e(e=""){return`
    <aside class="quick-tools">
      <div class="quick-tools-frame">
        <div class="quick-tools-label">Quick Tools</div>
        <div class="quick-tools-body">
          ${e||'<div class="quick-tools-empty">No tools</div>'}
        </div>
      </div>
    </aside>
  `}function H(e,t,a=""){const r=I(),s=o.authError?`<div class="notice"><strong>Sign-in error</strong><div class="muted">${l(o.authError)}</div></div>`:"",n=o.loadError?`<div class="notice"><strong>Load error</strong><div class="muted">${l(o.loadError)}</div></div>`:"",i=o.saveStatus?`<div class="notice"><strong>Status</strong><div class="muted">${l(o.saveStatus)}</div></div>`:"";pt.innerHTML=`
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
            ${vt("/","Main Menu",t==="home")}
            ${vt("/creator","Creator",t==="creator")}
            ${vt("/browser","Browser",t==="browser")}
          </nav>
        </div>
        <div class="stack">
          <button class="notice account-card" data-action="open-settings" ${r?"":"disabled"}>
            <strong>${l(St(r))}</strong>
            <div class="muted">${l(r?.email??(o.authClient?.mode==="firebase"?"Sign in to create and manage stories":"Local demo mode"))}</div>
          </button>
          <button class="login-button" data-action="toggle-login">
            ${o.currentUser?"Log out":"Log in"}
          </button>
        </div>
      </aside>
      <main class="content">${e}</main>
      ${$e(a)}
    </div>
  `,(s||n||i)&&pt.querySelector(".content").insertAdjacentHTML("afterbegin",`${i}${n}${s}`)}async function ke(){const e=I();if(!e)return G("Sign in to manage account settings.");H(`
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
    `,"home")}function vt(e,t,a){return`<a class="nav-link ${a?"is-active":""}" href="#${e}"><span>${t}</span></a>`}function Ae(){return`
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
  `}function zt(e){return e.length?`
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
                <p class="muted">Requested by ${l(t.pendingTransfer?.requestedByName??t.creatorName)} on ${l(mt(t.pendingTransfer?.requestedAt??t.updatedAt))}</p>
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
  `:""}async function Te(){const e=I();let t=[];if(e?.email)try{t=await o.adapter.listIncomingStoryTransfers?.(e.email)??[]}catch(a){console.error("Incoming transfer list failed:",a),o.loadError="Ownership requests could not be loaded right now."}H(`
      <div class="stack">
        ${Ae()}
        ${zt(t)}
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
    `,"home")}async function Ee(){const e=I(),t=await o.adapter.listCreatorStories(e?.id);let a=[];if(e?.email)try{a=await o.adapter.listIncomingStoryTransfers?.(e.email)??[]}catch(u){console.error("Incoming transfer list failed:",u),o.loadError="Ownership requests could not be loaded right now."}const r=x(),s=r.get("q")??"",n=r.get("tag")??"",i=be(t,s,u=>`${u.title} ${u.tags.join(" ")}`).filter(u=>n?u.tags.includes(n):!0),c=Ie(t),d=o.authClient?.mode==="firebase"&&!e?'<div class="notice">Sign in with Firebase to create, edit, and manage your own stories.</div>':"";H(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Creator</h2>
            <p class="muted">Manage your stories, search by title, and filter by tags.</p>
          </div>
          <button class="primary-button" data-action="create-story" ${e?"":"disabled"}>Create</button>
        </div>
        ${zt(a)}
        ${d}
        <section class="panel stack">
          <div class="search-row">
            <input id="story-search" placeholder="Search by story title or tag" value="${l(s)}" />
            <select id="story-tag-filter">
              <option value="">All tags</option>
              ${c.map(u=>`<option value="${l(u)}" ${n===u?"selected":""}>${l(u)}</option>`).join("")}
            </select>
            <button class="ghost-button" data-action="apply-story-filters">Filter</button>
          </div>
          <div class="chip-row">
            ${c.map(u=>`<a class="pill" href="#/creator?tag=${encodeURIComponent(u)}">${l(u)}</a>`).join("")}
          </div>
        </section>
        <section class="story-list">
          ${i.length?i.map(Ce).join(""):'<div class="empty-state">No stories match this filter yet.</div>'}
        </section>
      </div>
    `,"creator")}function Ce(e){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${l(e.title)}</h3>
          <p class="muted">Updated ${mt(e.updatedAt)}</p>
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
  `}async function Pe(){const e=await o.adapter.listBrowserStories(I()?.id),t=x(),a=t.get("group")!=="flat",r=t.get("creator")??"",s=r?e.filter(c=>c.creatorName===r):e,n=[...new Set(e.map(c=>c.creatorName))];let i="";s.length?a?i=n.filter(c=>!r||c===r).map(c=>{const d=s.filter(u=>u.creatorName===c);return d.length?`
          <section class="panel stack">
            <div class="section-header">
              <h3>${l(c)}</h3>
              <span class="pill">${d.length} public stories</span>
            </div>
            <div class="story-list">${d.map(Et).join("")}</div>
          </section>
        `:""}).join(""):i=`<section class="story-list">${s.map(Et).join("")}</section>`:i='<div class="empty-state">No public stories are available yet.</div>',H(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Browser</h2>
            <p class="muted">Explore public stories and browse them by creator.</p>
          </div>
          <div class="toolbar">
            <select id="browser-creator-filter">
              <option value="">All creators</option>
              ${n.map(c=>`<option value="${l(c)}" ${r===c?"selected":""}>${l(c)}</option>`).join("")}
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
    `,"browser")}function Et(e){return`
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
  `}async function Oe(e){const t=await o.adapter.getStory(e);if(!t)return G("Story not found.");const a=It(t),r=x().get("view")==="browser",s=Ut(),n=x().get("transfer")==="1",i=t.pendingTransferStatus==="pending"?t.pendingTransfer:null;if(t.visibility==="private"&&!a)return G("This story is private.");H(`
      <div class="stack">
        ${$t([[r?"#/browser":"#/creator",r?"Browser":"Creator"],["",t.title]])}
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
            <div class="muted">Created ${mt(t.createdAt)}. Visibility is currently ${l(t.visibility)}.</div>
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
          ${a&&!r&&n?`
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
          ${t.arcs.length?t.arcs.map((c,d)=>Ne(c,t,a,d,r)).join(""):'<div class="empty-state">No arcs yet. Create the first arc to start structuring this story.</div>'}
        </section>
      </div>
    `,r?"browser":a?"creator":"browser")}function Ne(e,t,a,r,s=!1){return`
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
  `}function Le(e,t,a=!1,r=""){return`
    <div class="phase-separator">
      <span class="phase-line"></span>
      ${t&&!a?`<button class="phase-title" data-action="rename-phase" data-arc-id="${r}" data-phase-id="${e.id}" data-phase-title="${l(e.title)}">${l(e.title)}</button>`:`<span class="phase-title">${l(e.title)}</span>`}
      <span class="phase-line"></span>
    </div>
  `}function qe(e){const t=e.soundtracks??[];return`
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
  `}function De(e){if(!e.length)return"";const t=z(),a=R(o.soundtrack.volume);return`
    <div class="quick-tool-stack">
      <button
        class="quick-tool-button ${t&&!o.soundtrack.paused?"is-active":""}"
        data-action="toggle-soundtrack"
        aria-pressed="${String(!!t&&!o.soundtrack.paused)}"
        title="${l(t?`${o.soundtrack.paused?"Resume":"Pause"} ${t.label}`:"No soundtrack available")}"
      >
        <span class="quick-tool-icon">♪</span>
      </button>
      <button
        class="quick-tool-button volume-button ${o.soundtrack.volumeOpen?"is-open":""}"
        data-action="toggle-volume-popout"
        data-wheel-volume="true"
        style="--volume-fill: ${a}%;"
        title="${l(t?`Volume ${a}%`:"No soundtrack available")}"
      >
        <span class="quick-tool-icon">◔</span>
      </button>
      <div class="volume-popout" ${o.soundtrack.volumeOpen?"":"hidden"}>
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
      <div id="soundtrack-status" class="quick-tool-status">${l(t?`${o.soundtrack.paused?"Paused":"Now playing"}: ${t.label}`:"No soundtrack loaded.")}</div>
    </div>
  `}async function Re(e,t){const[a,r]=await Promise.all([o.adapter.getStory(e),o.adapter.getArc(t)]);if(!a||!r)return G("Arc not found.");const s=It(a),n=x().get("view")==="browser",i=Ut();if(a.visibility==="private"&&!s)return G("This story is private.");const c=(r.phases??[]).map(d=>`
    <section class="phase-block stack">
      ${Le(d,s,n,r.id)}
      <div class="nested-list ${i==="list"?"is-list-view":""}">
        ${d.chapters.length?d.chapters.map((u,p)=>Ue(u,a,r,s,p,n,d)).join(""):'<div class="empty-state">No chapters in this phase yet.</div>'}
      </div>
    </section>
  `).join("");if(H(`
      <div class="stack">
        ${$t([[n?"#/browser":s?"#/creator":"#/browser",n?"Browser":s?"Creator":"Browser"],["#/stories/"+a.id+(n?"?view=browser":""),a.title],["",r.title]])}
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
            ${n&&s?'<a class="ghost-button" href="#/stories/'+a.id+"/arcs/"+r.id+'">Edit</a>':""}
            ${s&&!n?'<button class="ghost-button" data-action="create-phase" data-arc-id="'+r.id+'">New phase</button>':""}
            ${s&&!n?'<button class="primary-button" data-action="create-chapter" data-arc-id="'+r.id+'" data-story-id="'+a.id+'">New chapter</button>':""}
          </div>
        </div>
        ${s&&!n?`
          <section class="panel">
            <div class="inline-form">
              <input id="arc-title-input" value="${l(r.title)}" />
              <button class="ghost-button" data-action="save-arc-title" data-arc-id="${r.id}" data-story-id="${a.id}">Rename arc</button>
            </div>
        </section>`:""}
        ${c||'<div class="empty-state">No chapters yet. Add one to begin writing.</div>'}
      </div>
    `,n?"browser":s?"creator":"browser"),s&&!n){const d=document.querySelector("#story-transfer-button");d&&d.addEventListener("click",u=>{u.preventDefault(),u.stopPropagation(),showStoryTransferModal(a.id)})}}function Ue(e,t,a,r,s,n=!1,i=null){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${l(e.title||"Untitled chapter")}</h3>
          <p class="muted">Updated ${mt(e.updatedAt)}</p>
        </div>
        ${r&&!n?`
          <div class="order-buttons">
            <button class="small-button" data-action="move-chapter-up" data-arc-id="${a.id}" data-phase-id="${i?.id??""}" data-index="${s}" ${s===0?"disabled":""}>↑</button>
            <button class="small-button" data-action="move-chapter-down" data-arc-id="${a.id}" data-phase-id="${i?.id??""}" data-index="${s}" ${i&&s===i.chapters.length-1?"disabled":""}>↓</button>
          </div>`:""}
      </div>
      ${r&&!n?`<select class="phase-select" data-action="move-chapter-phase" data-arc-id="${a.id}" data-chapter-id="${e.id}">
              ${(a.phases??[]).map(c=>`<option value="${c.id}" ${c.id===i?.id?"selected":""}>${l(c.title)}</option>`).join("")}
            </select>`:""}
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${t.id}/arcs/${a.id}/chapters/${e.id}${n?"?view=browser":""}">Open chapter</a>
        ${r&&!n?`<button class="small-button" title="Move chapter" data-action="open-transfer-chapter" data-story-id="${t.id}" data-arc-id="${a.id}" data-phase-id="${i?.id??""}" data-chapter-id="${e.id}">↗</button>`:""}
        ${r&&!n?`<button class="danger-button" data-action="delete-chapter" data-story-id="${t.id}" data-arc-id="${a.id}" data-chapter-id="${e.id}">Delete</button>`:""}
      </div>
    </article>
  `}function Ct(e,t,a,r,s=!1){return!a&&!r?"":`
    <div class="chapter-pager">
      ${a?`<a class="ghost-button" href="#/stories/${e}/arcs/${t}/chapters/${a.id}${s?"?view=browser":""}">Previous Chapter</a>`:""}
      ${r?`<a class="ghost-button" href="#/stories/${e}/arcs/${t}/chapters/${r.id}${s?"?view=browser":""}">Next Chapter</a>`:""}
    </div>
  `}async function xe(e,t,a){const[r,s,n]=await Promise.all([o.adapter.getStory(e),o.adapter.getArc(t),o.adapter.getChapter(a)]);if(!r||!s||!n)return G("Chapter not found.");const i=It(r),c=x().get("view")==="browser";if(r.visibility==="private"&&!i)return G("This story is private.");const d=n.assets??[],u=c?he(n.soundtracks??[]):[],p=(s.chapters??[]).findIndex(_=>_.id===a),g=p>0?s.chapters[p-1]:null,A=p>=0&&p<s.chapters.length-1?s.chapters[p+1]:null,N=Ct(r.id,s.id,g,A,c),L=Ct(r.id,s.id,g,A,c),C=i&&!c?`
        <div class="editor-shell">
          <section class="editor-pane">
            <div class="editor-controls">
              <input id="chapter-title-input" value="${l(n.title)}" ${i?"":"disabled"} />
              <textarea id="chapter-body-input" class="markdown-area" ${i?"":"disabled"}>${l(n.body)}</textarea>
              ${L}
              ${i?`
                <div class="panel asset-helper">
                  <div class="section-header">
                    <h3>Image link helper</h3>
                    <span class="pill">Manual Imgur or external URLs</span>
                  </div>
                  <div class="inline-form asset-form">
                    <input id="asset-name-input" placeholder="Image label, for example cover-art" />
                    <input id="asset-url-input" placeholder="https://i.imgur.com/your-image.jpg" />
                    <button class="ghost-button" data-action="add-external-asset" data-chapter-id="${n.id}">Add image</button>
                  </div>
                  <div class="notice">
                    Upload the image to Imgur first, then paste the direct image URL here. This saves the asset for the chapter without changing your markdown body.
                  </div>
                </div>
              `:""}
              <div class="asset-list">
                ${d.length?d.map(Pt).join(""):'<div class="empty-state">No assets in this chapter yet.</div>'}
              </div>
              ${qe(n)}
              <div class="notice mono">${l(o.saveStatus||"Tip: use `![alt](image-url)` to place pasted external images into the chapter body.")}</div>
            </div>
          </section>
          <section class="preview-pane">
            <h3>Preview</h3>
            <div class="markdown-preview">${bt(n.body||"*Start writing to preview your chapter here.*")}</div>
          </section>
        </div>
      `:`
        <section class="panel stack">
          <div class="section-header">
            <h3>Reading view</h3>
            <span class="pill">${d.length} asset(s)</span>
          </div>
          <div class="markdown-preview">${bt(n.body||"*This chapter is empty.*")}</div>
        </section>
        ${L}
        ${d.length?`<section class="panel stack"><h3>Referenced images</h3><div class="asset-list">${d.map(Pt).join("")}</div></section>`:""}
      `;H(`
      <div class="stack">
        ${$t([[c?"#/browser":i?"#/creator":"#/browser",c?"Browser":i?"Creator":"Browser"],["#/stories/"+r.id+(c?"?view=browser":""),r.title],["#/stories/"+r.id+"/arcs/"+s.id+(c?"?view=browser":""),s.title],["",n.title||"Untitled chapter"]])}
        <div class="page-title">
          <div>
            <h2>${l(n.title||"Untitled chapter")}</h2>
            <p class="muted">${i&&!c?"Write in markdown, add image links, and save your draft.":"Read this chapter in a clean, read-only view."}</p>
          </div>
          <div class="card-actions">
            ${c&&i?`<a class="ghost-button" href="#/stories/${r.id}/arcs/${s.id}/chapters/${n.id}">Edit</a>`:""}
            ${i&&!c?`<button class="primary-button" data-action="save-chapter" data-chapter-id="${n.id}">Save</button>`:""}
          </div>
        </div>
        ${N}
        ${C}
      </div>
    `,c?"browser":i?"creator":"browser",De(u)),c&&u.length?Se(n.id,u):V()}function Pt(e){const t=e.url??e.dataUrl??"";return`
    <article class="asset-item">
      ${!!t?`<img src="${t}" alt="${l(e.name)}" />`:""}
      <strong>${l(e.name)}</strong>
      <div class="muted mono">![${l(e.name)}](${t})</div>
    </article>
  `}function G(e){H(`
      <div class="stack">
        <section class="panel">
          <h2>Not found</h2>
          <p class="muted">${l(e)}</p>
        </section>
      </div>
    `,"home")}function $t(e){return`<div class="breadcrumbs">${e.map(([t,a])=>t?`<a href="${t}">${l(a)}</a>`:`<span>${l(a)}</span>`).join("<span>/</span>")}</div>`}async function f(){switch(de(),o.loadError="",o.route=ue(),o.route.name){case"home":return V(),Te();case"creator":return V(),Ee();case"browser":return V(),Pe();case"settings":return V(),ke();case"story":return V(),Oe(o.route.params.storyId);case"arc":return V(),Re(o.route.params.storyId,o.route.params.arcId);case"chapter":return xe(o.route.params.storyId,o.route.params.arcId,o.route.params.chapterId);default:return V(),G("This page does not exist.")}}async function at(){try{await f()}catch(e){console.error("Render failed:",e),o.loadError=String(e?.message||e||"The page could not be rendered."),pt.innerHTML=`
      <main class="content">
        <section class="panel stack">
          <h2>Page failed to load</h2>
          <p class="muted">${l(o.loadError)}</p>
          <div class="card-actions">
            <a class="ghost-button" href="#/">Main Menu</a>
            <a class="ghost-button" href="#/creator">Creator</a>
          </div>
        </section>
      </main>
    `}}function _e(){return{title:document.querySelector("#story-title-input")?.value.trim()??"",tags:(document.querySelector("#story-tags-input")?.value??"").split(",").map(e=>e.trim()).filter(Boolean),visibility:document.querySelector("#story-visibility-input")?.value??"private"}}function Ot(e,t,a){const r=[...e],[s]=r.splice(t,1);return r.splice(a,0,s),r}async function Be({chapterId:e,currentStoryId:t,currentArcId:a,currentPhaseId:r}){const s=I();if(!s?.id)return o.saveStatus="Sign in first to move chapters between your stories.",f();const n=await o.adapter.listCreatorStories(s.id);if(!n.length)return o.saveStatus="You need at least one story before moving chapters.",f();const c=(await Promise.all(n.map(v=>o.adapter.getStory(v.id)))).filter(Boolean).filter(v=>(v.arcs??[]).length>0);if(!c.length)return o.saveStatus="Create an arc first, then you can move chapters into it.",f();const d=document.createElement("div");d.className="modal-backdrop",d.innerHTML=`
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
  `,document.body.append(d);const u=d.querySelector("#transfer-story-select"),p=d.querySelector("#transfer-arc-select"),g=d.querySelector("#transfer-phase-select"),A=d.querySelector("#transfer-summary"),N=d.querySelector("#transfer-confirm"),L=()=>d.remove();function C(){return c.find(v=>v.id===u.value)??c[0]}function _(){return C()?.arcs.find(v=>v.id===p.value)??C()?.arcs?.[0]??null}function X(){return _()?.phases.find(v=>v.id===g.value)??_()?.phases?.[0]??null}function tt(){const v=C(),$=_(),ft=X(),kt=v?.id===t&&$?.id===a&&ft?.id===r;A.innerHTML=kt?"This chapter is already in that exact phase.":`Destination: <strong>${l(v?.title??"-")}</strong> / <strong>${l($?.title??"-")}</strong> / <strong>${l(ft?.title??"-")}</strong>`,N.disabled=!v||!$||!ft||kt}function B(){const v=_();g.innerHTML=(v?.phases??[]).map($=>`<option value="${$.id}" ${$.id===r&&v.id===a?"selected":""}>${l($.title)}</option>`).join(""),tt()}function T(){const v=C();p.innerHTML=(v?.arcs??[]).map($=>`<option value="${$.id}" ${$.id===a&&v.id===t?"selected":""}>${l($.title)}</option>`).join(""),B()}u.innerHTML=c.map(v=>`<option value="${v.id}" ${v.id===t?"selected":""}>${l(v.title)}</option>`).join(""),u.addEventListener("change",T),p.addEventListener("change",B),g.addEventListener("change",tt),d.querySelector("#transfer-cancel").addEventListener("click",L),N.addEventListener("click",async()=>{const v=X(),$=_();if(!(!v||!$))return await o.adapter.transferChapter(e,$.id,v.id),L(),o.saveStatus="Chapter moved to a new story location.",f()}),T()}async function Nt(){if(o.currentUser)return await o.authClient.signOut(),U(null),o.saveStatus="Signed out.",o.authError="",f();if(o.authClient.mode==="firebase")try{const t=await o.authClient.signIn();return U({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email,mode:"firebase",structureView:"list"}),o.authError="",o.saveStatus="Signed in with Firebase.",f()}catch(t){return console.error("Firebase sign-in failed:",t),o.saveStatus="",o.authError=Me(t),f()}const e=document.createElement("div");e.className="modal-backdrop",e.innerHTML=`
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
  `,document.body.append(e),e.querySelector("#modal-login-cancel").addEventListener("click",()=>e.remove()),e.querySelector("#modal-login-submit").addEventListener("click",()=>{const t=e.querySelector("#login-name").value.trim()||"Creator",a=e.querySelector("#login-email").value.trim()||"local@storyforge.local";U({id:`local-${t.toLowerCase().replaceAll(/\s+/g,"-")}`,name:t,email:a,mode:"local",structureView:"list"}),e.remove(),o.saveStatus="Signed in with a local demo profile.",o.authError="",f()})}function Me(e){const t=e?.code?String(e.code):"",a=e?.message?String(e.message):"Unknown sign-in error.";return t==="auth/unauthorized-domain"?"This site domain is not authorized in Firebase Auth. Add your local/dev domain and your GitHub Pages domain in Firebase Console > Authentication > Settings > Authorized domains.":t==="auth/popup-closed-by-user"?"The sign-in popup closed before Firebase completed the login. If it closes instantly every time, double-check Authorized domains and the Google sign-in provider setup.":t==="auth/operation-not-allowed"?"Google sign-in is not enabled for this Firebase project. Enable it in Firebase Console > Authentication > Sign-in method.":t==="auth/invalid-api-key"?"Your Firebase API key is invalid. Recheck the values in your `.env` file and restart the dev server.":t==="auth/network-request-failed"?"Firebase could not complete the sign-in request. Check your connection and any browser privacy extensions blocking popups or auth requests.":t?`${t}: ${a}`:a}async function Fe(e){const t=o.route.params.chapterId,a=await o.adapter.getChapter(t);if(!a)return;const r=[...a.assets??[]];for(const i of e){const c=await ze(i);r.push({id:crypto.randomUUID(),name:i.name,type:i.type,size:i.size,dataUrl:c})}const s=document.querySelector("#chapter-body-input"),n=r.slice((a.assets??[]).length).map(i=>`
![${i.name}](${i.dataUrl})`).join("");await o.adapter.updateChapter(t,{assets:r,body:`${s.value}${n}`}),o.dragActive=!1,o.saveStatus="Assets added to the chapter. In production these should upload to object storage instead of local state.",await f()}function Ve(e){const t=e.trim();if(!t)throw new Error("Add an image URL first.");let a;try{a=new URL(t)}catch{throw new Error("That image URL is not valid.")}if(!["http:","https:"].includes(a.protocol))throw new Error("Use an http or https image URL.");const r=a.hostname==="imgur.com"||a.hostname==="www.imgur.com"||a.hostname==="i.imgur.com",s=a.pathname.split("/").filter(Boolean).pop()??"",n=/\.[a-z0-9]{2,5}$/i.test(s);return r&&s&&!n&&(a.pathname=`${a.pathname}.png`),a.toString()}async function je(e){const t=await o.adapter.getChapter(e);if(!t)throw new Error("Chapter not found.");const a=document.querySelector("#asset-name-input"),r=document.querySelector("#asset-url-input"),s=document.querySelector("#chapter-title-input"),n=document.querySelector("#chapter-body-input"),i=a?.value.trim()||"image",c=Ve(r?.value??""),d={id:crypto.randomUUID(),name:i,type:"image/external",url:c},u=[...t.assets??[],d];await o.adapter.updateChapter(e,{title:s?.value.trim()||t.title||"Untitled Chapter",body:n?.value??t.body??"",assets:u}),a&&(a.value=""),r&&(r.value=""),o.saveStatus="External image link added to the chapter assets.",await f()}async function Lt(){const e=I();if(!e?.id)return;const t=await o.adapter.getUserProfile?.(e.id);t&&U({...e,name:t.name??e.name,email:t.email??e.email,penName:t.penName??"",structureView:t.structureView??e.structureView??"list"})}function yt(e){return window.confirm(`Are you sure you want to delete this ${e}? This cannot be undone.`)}function ze(e){return new Promise((t,a)=>{const r=new FileReader;r.onload=()=>t(String(r.result)),r.onerror=()=>a(r.error),r.readAsDataURL(e)})}document.addEventListener("click",async e=>{const t=e.target.closest("[data-action]");if(!t)return;const a=t.dataset.action;if(a==="toggle-login")return Nt();if(a==="open-settings")return k("/settings");if(a==="set-structure-view"){const r=I(),s=t.dataset.view==="list"?"list":"grid";if(!r?.id)return U({...r,structureView:s}),f();const n=await o.adapter.updateUserProfile(r.id,{name:r.name,email:r.email,penName:r.penName??"",structureView:s});return U({...r,structureView:n.structureView??s,penName:n.penName??r.penName??"",name:n.name??r.name,email:n.email??r.email}),f()}if(a==="apply-story-filters"){const r=document.querySelector("#story-search").value.trim(),s=document.querySelector("#story-tag-filter").value;return k(`/creator${r||s?`?${new URLSearchParams({q:r,tag:s}).toString()}`:""}`)}if(a==="apply-browser-filters"){const r=document.querySelector("#browser-creator-filter").value,s=document.querySelector("#browser-group-mode").value;return k(`/browser?${new URLSearchParams({creator:r,group:s}).toString()}`)}if(a==="create-story"){const r=I();if(!r)return o.saveStatus="Sign in first to create stories in Firebase mode.",Nt();const s=await o.adapter.createStory({creatorId:r.id,creatorName:St(r),title:"Untitled Story",tags:["draft"],visibility:"private"});return k(`/stories/${s.id}`)}if(a==="save-story-settings"){const r=t.dataset.storyId,s=_e();return await o.adapter.updateStory(r,s),o.saveStatus="Story details saved.",f()}if(a==="open-story-transfer"){const r=x();return r.set("transfer","1"),k(`/stories/${t.dataset.storyId}?${r.toString()}`)}if(a==="close-story-transfer"){const r=x();r.delete("transfer");const s=r.toString();return k(`/stories/${t.dataset.storyId}${s?`?${s}`:""}`)}if(a==="submit-story-transfer"){const r=I();if(!r?.email)return o.saveStatus="Sign in with an email address before transferring ownership.",f();const s=document.querySelector("#story-transfer-email-input")?.value.trim()??"",n=document.querySelector("#story-transfer-confirm-input")?.value.trim()??"";if(!s)return o.saveStatus="Enter the recipient Gmail address first.",f();if(s.toLowerCase()===String(r.email).trim().toLowerCase())return o.saveStatus="You cannot transfer a story to your own email.",f();if(n!=="TRANSFER")return o.saveStatus="Type TRANSFER exactly to confirm ownership transfer.",f();await o.adapter.requestStoryTransfer(t.dataset.storyId,s,{id:r.id,name:St(r),email:r.email}),o.saveStatus="Ownership transfer request sent. The story stays with you until the recipient accepts.";const i=x();i.delete("transfer");const c=i.toString();return k(`/stories/${t.dataset.storyId}${c?`?${c}`:""}`)}if(a==="cancel-story-transfer")return await o.adapter.cancelStoryTransfer(t.dataset.storyId),o.saveStatus="Ownership transfer cancelled.",f();if(a==="accept-story-transfer"){const r=I();try{return await o.adapter.acceptStoryTransfer(t.dataset.storyId,{id:r.id,name:r.name,email:r.email,penName:r.penName??""}),o.saveStatus="Story ownership transferred to you.",k("/creator")}catch(s){return o.saveStatus=`Transfer accept failed: ${String(s?.message||s)}`,f()}}if(a==="decline-story-transfer"){const r=I();try{return await o.adapter.declineStoryTransfer(t.dataset.storyId,r.email),o.saveStatus="Ownership transfer declined.",f()}catch(s){return o.saveStatus=`Transfer decline failed: ${String(s?.message||s)}`,f()}}if(a==="create-arc"){const r=t.dataset.storyId,s=await o.adapter.createArc(r,`Arc ${Math.floor(Math.random()*90+10)}`);return k(`/stories/${r}/arcs/${s.id}`)}if(a==="save-arc-title")return await o.adapter.updateArc(t.dataset.arcId,{title:document.querySelector("#arc-title-input").value.trim()||"Untitled Arc"}),o.saveStatus="Arc title saved.",f();if(a==="add-soundtrack"){const r=await o.adapter.getChapter(t.dataset.chapterId),s=document.querySelector("#soundtrack-label-input")?.value.trim()??"",n=document.querySelector("#soundtrack-url-input")?.value.trim()??"",i=_t({id:xt("soundtrack"),label:s,url:n});return i?(await o.adapter.updateChapter(r.id,{soundtracks:[...r.soundtracks??[],{id:i.id,label:i.label,url:i.url}]}),o.saveStatus="Soundtrack added.",f()):(o.saveStatus="Please enter a valid YouTube link.",f())}if(a==="delete-soundtrack"){const r=await o.adapter.getChapter(t.dataset.chapterId);return await o.adapter.updateChapter(r.id,{soundtracks:(r.soundtracks??[]).filter(s=>s.id!==t.dataset.soundtrackId)}),o.saveStatus="Soundtrack removed.",f()}if(a==="move-arc-up"||a==="move-arc-down"){const r=await o.adapter.getStory(t.dataset.storyId),s=Number(t.dataset.index),n=a==="move-arc-up"?-1:1;return await o.adapter.reorderArcs(r.id,Ot(r.arcIds,s,s+n)),f()}if(a==="create-chapter"){const r=await o.adapter.createChapter(t.dataset.arcId,"Untitled Chapter");return k(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}/chapters/${r.id}`)}if(a==="create-phase"){const r=window.prompt("Phase title","New Phase");return r===null?void 0:(await o.adapter.createPhase(t.dataset.arcId,r),o.saveStatus="Phase created.",f())}if(a==="rename-phase"){const r=window.prompt("Rename phase",t.dataset.phaseTitle||"Phase");return r===null?void 0:(await o.adapter.renamePhase(t.dataset.arcId,t.dataset.phaseId,r),o.saveStatus="Phase renamed.",f())}if(a==="open-transfer-chapter")return Be({chapterId:t.dataset.chapterId,currentStoryId:t.dataset.storyId,currentArcId:t.dataset.arcId,currentPhaseId:t.dataset.phaseId});if(a==="move-chapter-up"||a==="move-chapter-down"){const r=await o.adapter.getArc(t.dataset.arcId),s=(r.phases??[]).find(c=>c.id===t.dataset.phaseId);if(!s)return;const n=Number(t.dataset.index),i=a==="move-chapter-up"?-1:1;return await o.adapter.reorderPhaseChapters(r.id,s.id,Ot(s.chapterIds,n,n+i)),f()}if(a==="save-chapter"){const r=t.dataset.chapterId;return await o.adapter.updateChapter(r,{title:document.querySelector("#chapter-title-input").value.trim()||"Untitled Chapter",body:document.querySelector("#chapter-body-input").value}),o.saveStatus="Chapter saved.",f()}if(a==="save-pen-name"){const r=I(),s=document.querySelector("#pen-name-input").value.trim(),n=await o.adapter.updateUserProfile(r.id,{name:r.name,email:r.email,penName:s});return U({...r,penName:n.penName??"",name:n.name??r.name,email:n.email??r.email}),o.saveStatus=s?"Pen name saved.":"Pen name cleared. Account name will be used.",f()}if(a==="delete-story")return yt("story")?(await o.adapter.deleteStory(t.dataset.storyId),o.saveStatus="Story deleted.",k("/creator")):void 0;if(a==="delete-arc")return yt("arc")?(await o.adapter.deleteArc(t.dataset.arcId),o.saveStatus="Arc deleted.",k(`/stories/${t.dataset.storyId}`)):void 0;if(a==="delete-chapter")return yt("chapter")?(await o.adapter.deleteChapter(t.dataset.chapterId),o.saveStatus="Chapter deleted.",k(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}`)):void 0;if(a==="add-external-asset")try{return await je(t.dataset.chapterId)}catch(r){return o.saveStatus=String(r.message||r),f()}if(a==="toggle-soundtrack"){if(!z())return;o.soundtrack.paused?ge():Mt();return}if(a==="toggle-volume-popout"){if(!z())return;o.soundtrack.volumeOpen=!o.soundtrack.volumeOpen,Z();return}});document.addEventListener("change",async e=>{const t=e.target;if(t instanceof HTMLSelectElement&&t.dataset.action==="move-chapter-phase")return await o.adapter.moveChapterToPhase(t.dataset.arcId,t.dataset.chapterId,t.value),o.saveStatus="Chapter moved to another phase.",f()});document.addEventListener("input",e=>{if(e.target instanceof HTMLInputElement&&e.target.dataset.action==="set-volume"){Vt(e.target.value);return}if(e.target.id==="chapter-body-input"){const t=document.querySelector(".markdown-preview");t&&(t.innerHTML=bt(e.target.value||"*Start writing to preview your chapter here.*"))}if(e.target.id==="chapter-title-input"){const t=e.target.value.trim()||"Untitled chapter",a=document.querySelector(".page-title h2");a&&(a.textContent=t)}});document.addEventListener("click",e=>{const t=e.target;t instanceof Element&&(t.closest(".quick-tool-stack")||o.soundtrack.volumeOpen&&(o.soundtrack.volumeOpen=!1,Z()))});document.addEventListener("wheel",e=>{const t=e.target;t instanceof Element&&t.closest("[data-wheel-volume='true']")&&z()&&(e.preventDefault(),ye(e.deltaY<0?5:-5))},{passive:!1});document.addEventListener("dragover",e=>{if(o.route.name!=="chapter")return;e.preventDefault(),o.dragActive=!0;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.add("is-active")});document.addEventListener("dragleave",e=>{if(o.route.name!=="chapter"||e.relatedTarget)return;o.dragActive=!1;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active")});document.addEventListener("drop",async e=>{if(o.route.name!=="chapter")return;e.preventDefault();const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active");const a=[...e.dataTransfer.files].filter(r=>r.type.startsWith("image/"));a.length&&await Fe(a)});window.addEventListener("hashchange",()=>{o.saveStatus="",window.scrollTo({top:0,left:0,behavior:"auto"}),at()});async function Ge(){const e=oe();o.authClient=e,o.adapter=await ae(e),o.authClient.mode==="firebase"?o.authClient.watchAuth(t=>{t?(U({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email,mode:"firebase"}),Lt().finally(()=>at())):(U(null),at())}):o.currentUser?.id&&await Lt(),window.location.hash?at():k("/")}Ge().catch(e=>{pt.innerHTML=`
    <main class="content">
      <section class="panel">
        <h2>App failed to start</h2>
        <p class="muted">${l(String(e.message||e))}</p>
        <p class="muted">Current mode: ${l(ie().mode)}</p>
      </section>
    </main>
  `});
