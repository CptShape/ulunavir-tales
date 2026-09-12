import{d as ct,a as m,g as $,u as g,s as pt,b as X,q as tt,w as H,c as et,e as Oe,f as Re,i as De,h as Ue,j as Be,G as _e,o as Ve,k as Fe,l as je,m as ze,n as He}from"./firebase-Bnt3OmW5.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function r(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=r(s);fetch(s.href,o)}})();const We="modulepreload",Ye=function(e){return"/ulunavir-tales/"+e},Yt={},ne=function(t,r,a){let s=Promise.resolve();if(r&&r.length>0){let d=function(l){return Promise.all(l.map(p=>Promise.resolve(p).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),c=i?.nonce||i?.getAttribute("nonce");s=d(r.map(l=>{if(l=Ye(l),l in Yt)return;Yt[l]=!0;const p=l.endsWith(".css"),f=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${f}`))return;const w=document.createElement("link");if(w.rel=p?"stylesheet":We,p||(w.as="script"),w.crossOrigin="",w.href=l,c&&w.setAttribute("nonce",c),document.head.appendChild(w),p)return new Promise((v,T)=>{w.addEventListener("load",v),w.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(i){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=i,window.dispatchEvent(c),!c.defaultPrevented)throw i}return s.then(i=>{for(const c of i||[])c.status==="rejected"&&o(c.reason);return t().catch(o)})},It="storyforge-state-v1",qt="story-demo",bt="arc-demo",St="chapter-demo",yt="Chapters";function N(e){return String(e??"").trim().toLowerCase()}function Ct(e,t){const r=N(t);return!r||e?.pendingTransferStatus!=="pending"?!1:[e.pendingTransferEmailLower,N(e.pendingTransfer?.targetEmail)].includes(r)}const $t={users:{"demo-user":{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",emailLower:"demo@storyforge.local",penName:""}},stories:{[qt]:{id:qt,title:"The Clockwork Harbor",tags:["fantasy","mystery","serial"],visibility:"public",creatorId:"demo-user",creatorName:"Demo Creator",editorEmails:[],pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",arcIds:[bt],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},arcs:{[bt]:{id:bt,storyId:qt,title:"Tide One",chapterIds:[St],soundtracks:[],phases:[{id:"phase-demo",title:yt,chapterIds:[St]}],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},chapters:{[St]:{id:St,arcId:bt,title:"Lanterns on the Pier",body:`# Opening scene

A storm hangs over the harbor while the first lanterns come alive.`,published:!0,dmNotes:"",comments:[],reactions:{},renderMode:"markdown",htmlBackground:"",assets:[],soundtracks:[],videos:[],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}}};function F(e){return`${e}-${crypto.randomUUID().slice(0,8)}`}function Gt(e){return JSON.parse(JSON.stringify(e))}function _(e){return e.flatMap(t=>t.chapterIds??[])}function vt(e=[]){return{id:F("phase"),title:yt,chapterIds:[...e]}}function G(e){return{...e,body:e.body??"",published:e.published??!0,dmNotes:e.dmNotes??"",comments:e.comments??[],reactions:e.reactions??{},assets:e.assets??[],soundtracks:e.soundtracks??[],videos:e.videos??[],renderMode:e.renderMode??"markdown",htmlBackground:e.htmlBackground??""}}function B(e){const t=[...e.chapterIds??[]],r=Array.isArray(e.phases)&&e.phases.length?e.phases.map(i=>({id:i.id??F("phase"),title:i.title?.trim()||yt,chapterIds:[...i.chapterIds??[]]})):[vt(t)],a=new Set;for(const i of r)i.chapterIds=i.chapterIds.filter(c=>!c||a.has(c)?!1:(a.add(c),!0));const s=t.filter(i=>!a.has(i));s.length&&r[0].chapterIds.push(...s);const o=_(r);return{...e,chapterIds:o,soundtracks:e.soundtracks??[],phases:r}}function y(){const e=localStorage.getItem(It);if(!e)return localStorage.setItem(It,JSON.stringify($t)),Gt($t);try{return JSON.parse(e)}catch{return localStorage.setItem(It,JSON.stringify($t)),Gt($t)}}function S(e){localStorage.setItem(It,JSON.stringify(e))}function z(e,t){const r=(e.arcIds??[]).map(a=>t.arcs[a]).filter(Boolean).map(a=>At(a,t));return{...e,pendingTransfer:e.pendingTransfer??null,pendingTransferEmailLower:e.pendingTransferEmailLower??"",pendingTransferStatus:e.pendingTransferStatus??"",arcIds:e.arcIds??[],arcs:r}}function At(e,t){const r=B(e),a=r.chapterIds.map(s=>t.chapters[s]).filter(Boolean).map(G);return{...r,chapterIds:r.chapterIds??[],chapters:a,phases:r.phases.map(s=>({...s,chapters:s.chapterIds.map(o=>t.chapters[o]).filter(Boolean).map(G)}))}}function Z(e,t){const r=e.arcs[t];if(!r)return!1;const a=B(r),s=JSON.stringify({chapterIds:r.chapterIds??[],phases:r.phases??[]})!==JSON.stringify({chapterIds:a.chapterIds,phases:a.phases});return s&&(e.arcs[t]={...e.arcs[t],chapterIds:a.chapterIds,phases:a.phases}),s}function Ge(){return{mode:"local",async getUserProfile(e){return e?y().users[e]??null:null},async updateUserProfile(e,t){const r=y(),a=r.users[e]??{id:e,name:t.name??"Creator",email:t.email??"",emailLower:N(t.email),penName:""};r.users[e]={...a,...t,emailLower:N(t.email??a.email)};const s=r.users[e].penName?.trim()||r.users[e].name||"Creator";for(const o of Object.values(r.stories))o.creatorId===e&&(o.creatorName=s);return S(r),r.users[e]},async listIncomingStoryTransfers(e){const t=y(),r=N(e);return r?Object.values(t.stories).filter(a=>a.pendingTransferStatus==="pending"&&a.pendingTransferEmailLower===r).sort((a,s)=>String(s.updatedAt).localeCompare(String(a.updatedAt))).map(a=>z(a,t)):[]},async listCreatorStories(e){if(!e)return[];const t=y();return Object.values(t.stories).filter(r=>r.creatorId===e).sort((r,a)=>a.updatedAt.localeCompare(r.updatedAt)).map(r=>({...r,arcs:(r.arcIds??[]).map(a=>({id:a}))}))},async listEditorStories(e){const t=N(e);if(!t)return[];const r=y();return Object.values(r.stories).filter(a=>(a.editorEmails??[]).includes(t)).sort((a,s)=>String(s.updatedAt).localeCompare(String(a.updatedAt))).map(a=>dt(a))},async listBrowserStories(){const e=y();return Object.values(e.stories).filter(t=>t.visibility==="public").sort((t,r)=>t.creatorName.localeCompare(r.creatorName)||t.title.localeCompare(r.title)).map(t=>({...t,arcs:(t.arcIds??[]).map(r=>({id:r}))}))},async getStory(e){const t=y();let r=!1;for(const s of t.stories[e]?.arcIds??[])r=Z(t,s)||r;r&&S(t);const a=t.stories[e];return a?z(a,t):null},async getArc(e){const t=y();Z(t,e)&&S(t);const a=t.arcs[e];return a?At(a,t):null},async getChapter(e){const r=y().chapters[e]??null;return r?G(r):null},async createStory({creatorId:e,creatorName:t,title:r,tags:a,visibility:s}){const o=y(),i=F("story"),c=new Date().toISOString();return o.stories[i]={id:i,title:r,tags:a,visibility:s,creatorId:e,creatorName:t,editorEmails:[],arcIds:[],createdAt:c,updatedAt:c},S(o),z(o.stories[i],o)},async updateStory(e,t){const r=y();if(!r.stories[e])throw new Error("Story not found.");return r.stories[e]={...r.stories[e],...t,updatedAt:new Date().toISOString()},S(r),z(r.stories[e],r)},async addStoryEditor(e,t){const r=N(t);if(!r)throw new Error("Enter a valid editor email.");const a=y(),s=a.stories[e];if(!s)throw new Error("Story not found.");return s.editorEmails=[...new Set([...s.editorEmails??[],r])],s.updatedAt=new Date().toISOString(),S(a),z(s,a)},async requestStoryTransfer(e,t,r){const a=y(),s=a.stories[e];if(!s)throw new Error("Story not found.");const o=N(t);if(!o)throw new Error("Enter a valid Gmail address.");return s.pendingTransfer={targetEmail:String(t).trim(),targetEmailLower:o,requestedBy:r?.id??s.creatorId,requestedByName:r?.name??s.creatorName,requestedAt:new Date().toISOString(),status:"pending"},s.pendingTransferEmailLower=o,s.pendingTransferStatus="pending",s.updatedAt=new Date().toISOString(),S(a),z(s,a)},async cancelStoryTransfer(e){const t=y(),r=t.stories[e];if(!r)throw new Error("Story not found.");return r.pendingTransfer=null,r.pendingTransferEmailLower="",r.pendingTransferStatus="",r.updatedAt=new Date().toISOString(),S(t),z(r,t)},async acceptStoryTransfer(e,t){const r=y(),a=r.stories[e];if(!a)throw new Error("Story not found.");if(!Ct(a,t?.email))throw new Error("This transfer request is no longer available.");const s=N(t?.email),o=r.users[t.id]??{id:t.id,name:t.name??"Creator",email:t.email??"",emailLower:s,penName:t.penName??""};return r.users[t.id]=o,a.creatorId=t.id,a.creatorName=o.penName?.trim()||o.name||t.name||"Creator",a.pendingTransfer=null,a.pendingTransferEmailLower="",a.pendingTransferStatus="",a.updatedAt=new Date().toISOString(),S(r),z(a,r)},async declineStoryTransfer(e,t){const r=y(),a=r.stories[e];if(!a)throw new Error("Story not found.");if(!Ct(a,t))throw new Error("This transfer request is no longer available.");return a.pendingTransfer=null,a.pendingTransferEmailLower="",a.pendingTransferStatus="",a.updatedAt=new Date().toISOString(),S(r),z(a,r)},async createArc(e,t){const r=y(),a=r.stories[e];if(!a)throw new Error("Story not found.");const s=F("arc"),o=new Date().toISOString();return r.arcs[s]={id:s,storyId:e,title:t,chapterIds:[],soundtracks:[],phases:[vt()],createdAt:o,updatedAt:o},a.arcIds.push(s),a.updatedAt=o,S(r),At(r.arcs[s],r)},async updateArc(e,t){const r=y(),a=r.arcs[e];if(!a)throw new Error("Arc not found.");return a.title=t.title??a.title,a.phases=t.phases??a.phases,a.chapterIds=t.chapterIds??a.chapterIds,a.soundtracks=t.soundtracks??a.soundtracks??[],a.updatedAt=new Date().toISOString(),r.stories[a.storyId].updatedAt=a.updatedAt,S(r),At(a,r)},async reorderArcs(e,t){const r=y();r.stories[e].arcIds=[...t],r.stories[e].updatedAt=new Date().toISOString(),S(r)},async createChapter(e,t){const r=y(),a=r.arcs[e];if(!a)throw new Error("Arc not found.");const s=F("chapter"),o=new Date().toISOString();return r.chapters[s]={id:s,arcId:e,title:t,body:"",published:!1,dmNotes:"",comments:[],reactions:{},renderMode:"markdown",htmlBackground:"",assets:[],soundtracks:[],videos:[],createdAt:o,updatedAt:o},a.chapterIds.push(s),a.phases?.length||(a.phases=[vt()]),a.phases[a.phases.length-1].chapterIds.push(s),a.updatedAt=o,r.stories[a.storyId].updatedAt=o,S(r),G(r.chapters[s])},async updateChapter(e,t){const r=y();if(!r.chapters[e])throw new Error("Chapter not found.");r.chapters[e]={...r.chapters[e],...t,updatedAt:new Date().toISOString()};const a=r.arcs[r.chapters[e].arcId];return a&&(a.updatedAt=r.chapters[e].updatedAt,r.stories[a.storyId].updatedAt=a.updatedAt),S(r),r.chapters[e]},async updateChapterEngagement(e,t){const r=y();if(!r.chapters[e])throw new Error("Chapter not found.");return r.chapters[e]={...r.chapters[e],...t,updatedAt:new Date().toISOString()},S(r),G(r.chapters[e])},async updateChapterOrder(e,t){const r=y();r.arcs[e].chapterIds=[...t],r.arcs[e].updatedAt=new Date().toISOString(),r.stories[r.arcs[e].storyId].updatedAt=r.arcs[e].updatedAt,S(r)},async createPhase(e,t){const r=y();Z(r,e);const a=r.arcs[e],s={id:F("phase"),title:t?.trim()||"New Phase",chapterIds:[]};return a.phases.push(s),a.updatedAt=new Date().toISOString(),r.stories[a.storyId].updatedAt=a.updatedAt,S(r),s},async renamePhase(e,t,r){const a=y();Z(a,e);const s=a.arcs[e],o=s.phases.find(c=>c.id===t);if(!o)throw new Error("Phase not found.");const i=r?.trim()??"";if(i)o.title=i;else if(s.phases.length<=1)o.title=yt;else{const c=s.phases.findIndex(p=>p.id===t),d=c<s.phases.length-1?c+1:c-1,l=s.phases[d];l.chapterIds=[...o.chapterIds??[],...l.chapterIds??[]],s.phases=s.phases.filter(p=>p.id!==t),s.chapterIds=_(s.phases)}return s.updatedAt=new Date().toISOString(),a.stories[s.storyId].updatedAt=s.updatedAt,S(a),s.phases.find(c=>c.id===t)??null},async moveChapterToPhase(e,t,r){const a=y();Z(a,e);const s=a.arcs[e];for(const i of s.phases)i.chapterIds=i.chapterIds.filter(c=>c!==t);const o=s.phases.find(i=>i.id===r);if(!o)throw new Error("Phase not found.");o.chapterIds.push(t),s.chapterIds=_(s.phases),s.updatedAt=new Date().toISOString(),a.stories[s.storyId].updatedAt=s.updatedAt,S(a)},async transferChapter(e,t,r){const a=y(),s=a.chapters[e],o=a.arcs[t];if(!s)throw new Error("Chapter not found.");if(!o)throw new Error("Target arc not found.");Z(a,s.arcId),Z(a,t);const i=a.arcs[s.arcId],c=a.arcs[t];if(!(c.phases??[]).find(p=>p.id===r))throw new Error("Target phase not found.");const l=new Date().toISOString();return i&&(i.chapterIds=(i.chapterIds??[]).filter(p=>p!==e),i.phases=(i.phases??[]).map(p=>({...p,chapterIds:(p.chapterIds??[]).filter(f=>f!==e)})),i.updatedAt=l,a.stories[i.storyId]&&(a.stories[i.storyId].updatedAt=l)),c.phases=(c.phases??[]).map(p=>p.id===r?{...p,chapterIds:[...p.chapterIds??[],e]}:p),c.chapterIds=_(c.phases),c.updatedAt=l,a.stories[c.storyId]&&(a.stories[c.storyId].updatedAt=l),a.chapters[e]={...s,arcId:t,updatedAt:l},S(a),a.chapters[e]},async reorderPhaseChapters(e,t,r){const a=y();Z(a,e);const s=a.arcs[e],o=s.phases.find(i=>i.id===t);if(!o)throw new Error("Phase not found.");o.chapterIds=[...r],s.chapterIds=_(s.phases),s.updatedAt=new Date().toISOString(),a.stories[s.storyId].updatedAt=s.updatedAt,S(a)},async deleteChapter(e){const t=y(),r=t.chapters[e];if(!r)return;const a=t.arcs[r.arcId];if(a){a.chapterIds=(a.chapterIds??[]).filter(o=>o!==e),a.phases=(a.phases??[]).map(o=>({...o,chapterIds:(o.chapterIds??[]).filter(i=>i!==e)})),a.updatedAt=new Date().toISOString();const s=t.stories[a.storyId];s&&(s.updatedAt=a.updatedAt)}delete t.chapters[e],S(t)},async deleteArc(e){const t=y(),r=t.arcs[e];if(!r)return;for(const s of r.chapterIds??[])delete t.chapters[s];const a=t.stories[r.storyId];a&&(a.arcIds=(a.arcIds??[]).filter(s=>s!==e),a.updatedAt=new Date().toISOString()),delete t.arcs[e],S(t)},async deleteStory(e){const t=y(),r=t.stories[e];if(r){for(const a of r.arcIds??[]){const s=t.arcs[a];for(const o of s?.chapterIds??[])delete t.chapters[o];delete t.arcs[a]}delete t.stories[e],S(t)}}}}function dt(e){return{...e,pendingTransfer:e.pendingTransfer??null,pendingTransferEmailLower:e.pendingTransferEmailLower??"",pendingTransferStatus:e.pendingTransferStatus??"",arcIds:e.arcIds??[],tags:e.tags??[],editorEmails:e.editorEmails??[],arcs:(e.arcIds??[]).map(t=>({id:t}))}}function I(e){return e.exists()?{id:e.id,...e.data()}:null}function Tt(e,t){const r=new Map(t.map((a,s)=>[a,s]));return[...e].sort((a,s)=>(r.get(a.id)??0)-(r.get(s.id)??0))}async function U(e,t){const r=await $(m(e,"stories",t)),a=I(r);if(!a)return null;const s=await X(tt(et(e,"arcs"),H("storyId","==",t))),o=[];for(const d of Tt(s.docs.map(l=>({id:l.id,...l.data(),chapterIds:l.data().chapterIds??[]})),a.arcIds??[])){const l=B(d);o.push(l)}const i=await Promise.all(o.map(async d=>{const l=await X(tt(et(e,"chapters"),H("arcId","==",d.id)));return[d.id,Tt(l.docs.map(p=>G({id:p.id,...p.data()})),d.chapterIds??[])]})),c=Object.fromEntries(i);return{...a,tags:a.tags??[],arcIds:a.arcIds??[],arcs:o.map(d=>({...d,chapterIds:d.chapterIds??[],phases:d.phases.map(l=>({...l,chapters:(c[d.id]??[]).filter(p=>(l.chapterIds??[]).includes(p.id))})),chapters:c[d.id]??[]}))}}async function Kt(e,t){if(!t?.id)return;const r=m(e,"users",t.id),a=await $(r),s=a.exists()?a.data():{},o=t.email??s.email??"",i={id:t.id,name:t.name??s.name??"Creator",email:o,emailLower:N(o),penName:t.penName??s.penName??"",structureView:t.structureView??s.structureView??"list",updatedAt:new Date().toISOString()};if(a.exists()){await g(r,i);return}await pt(r,{...i,createdAt:new Date().toISOString()})}function Ke(e){const t=e.db;return{mode:"firebase",async getUserProfile(r){if(!r)return null;const a=await $(m(t,"users",r));return I(a)},async updateUserProfile(r,a){const s=m(t,"users",r),o=await $(s),i={id:r,updatedAt:new Date().toISOString(),...a,emailLower:N(a.email??(o.exists()?o.data().email:""))};o.exists()?await g(s,i):await pt(s,{createdAt:new Date().toISOString(),...i});const c=await $(s),d=I(c),l=d?.penName?.trim()||d?.name||"Creator",p=await X(tt(et(t,"stories"),H("creatorId","==",r)));return await Promise.all(p.docs.map(f=>g(m(t,"stories",f.id),{creatorName:l}))),d},async listIncomingStoryTransfers(r){const a=N(r);return a?(await X(tt(et(t,"stories"),H("pendingTransferStatus","==","pending"),H("pendingTransferEmailLower","==",a)))).docs.map(o=>dt({id:o.id,...o.data()})).sort((o,i)=>String(i.updatedAt).localeCompare(String(o.updatedAt))):[]},async listCreatorStories(r){return r?(await X(tt(et(t,"stories"),H("creatorId","==",r)))).docs.map(s=>dt({id:s.id,...s.data()})).sort((s,o)=>String(o.updatedAt).localeCompare(String(s.updatedAt))):[]},async listEditorStories(r){const a=N(r);return a?(await X(tt(et(t,"stories"),H("editorEmails","array-contains",a)))).docs.map(o=>dt({id:o.id,...o.data()})).sort((o,i)=>String(i.updatedAt).localeCompare(String(o.updatedAt))):[]},async listBrowserStories(){return(await X(tt(et(t,"stories"),H("visibility","==","public")))).docs.map(a=>dt({id:a.id,...a.data()})).sort((a,s)=>a.creatorName.localeCompare(s.creatorName)||a.title.localeCompare(s.title))},async getStory(r){return U(t,r)},async getArc(r){const a=await $(m(t,"arcs",r)),s=I(a),o=s?B(s):null;if(!o)return null;const i=await X(tt(et(t,"chapters"),H("arcId","==",r)));return{...o,chapterIds:o.chapterIds??[],phases:o.phases.map(c=>({...c,chapters:Tt(i.docs.map(d=>G({id:d.id,...d.data()})).filter(d=>(c.chapterIds??[]).includes(d.id)),c.chapterIds??[])})),chapters:Tt(i.docs.map(c=>G({id:c.id,...c.data()})),o.chapterIds??[])}},async getChapter(r){const a=await $(m(t,"chapters",r)),s=I(a);return s?G(s):null},async createStory({creatorId:r,creatorName:a,title:s,tags:o,visibility:i}){const c=F("story"),d=new Date().toISOString(),l={id:c,title:s,tags:o,visibility:i,creatorId:r,creatorName:a,editorEmails:[],arcIds:[],createdAt:d,updatedAt:d};return await pt(m(t,"stories",c),l),await Kt(t,{id:r,name:a}),dt(l)},async updateStory(r,a){return await g(m(t,"stories",r),{...a,updatedAt:new Date().toISOString()}),U(t,r)},async addStoryEditor(r,a){const s=N(a);if(!s)throw new Error("Enter a valid editor email.");const o=await U(t,r);if(!o)throw new Error("Story not found.");const i=[...new Set([...o.editorEmails??[],s])];return await g(m(t,"stories",r),{editorEmails:i,updatedAt:new Date().toISOString()}),U(t,r)},async requestStoryTransfer(r,a,s){const o=N(a);if(!o)throw new Error("Enter a valid Gmail address.");return await g(m(t,"stories",r),{pendingTransfer:{targetEmail:String(a).trim(),targetEmailLower:o,requestedBy:s?.id??"",requestedByName:s?.name??"Creator",requestedAt:new Date().toISOString(),status:"pending"},pendingTransferEmailLower:o,pendingTransferStatus:"pending",updatedAt:new Date().toISOString()}),U(t,r)},async cancelStoryTransfer(r){return await g(m(t,"stories",r),{pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:new Date().toISOString()}),U(t,r)},async acceptStoryTransfer(r,a){const s=await U(t,r);if(!s)throw new Error("Story not found.");if(!Ct(s,a?.email))throw new Error("This transfer request is no longer available.");N(a?.email),await Kt(t,a);const o=await $(m(t,"users",a.id)),i=I(o)??a,c=i.penName?.trim()||i.name||a.name||"Creator",d=new Date().toISOString();return await g(m(t,"stories",r),{creatorId:a.id,creatorName:c,pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:d}),U(t,r)},async declineStoryTransfer(r,a){const s=await U(t,r);if(!s)throw new Error("Story not found.");if(!Ct(s,a))throw new Error("This transfer request is no longer available.");return await g(m(t,"stories",r),{pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:new Date().toISOString()}),U(t,r)},async createArc(r,a){const s=m(t,"stories",r),o=await $(s),i=I(o);if(!i)throw new Error("Story not found.");const c=F("arc"),d=new Date().toISOString(),l={id:c,storyId:r,title:a,chapterIds:[],soundtracks:[],phases:[vt()],createdAt:d,updatedAt:d};return await pt(m(t,"arcs",c),l),await g(s,{arcIds:[...i.arcIds??[],c],updatedAt:d}),l},async updateArc(r,a){const s=m(t,"arcs",r),o=new Date().toISOString();await g(s,{...a,updatedAt:o});const i=await $(s),c=I(i);return c?.storyId&&await g(m(t,"stories",c.storyId),{updatedAt:o}),this.getArc(r)},async reorderArcs(r,a){await g(m(t,"stories",r),{arcIds:a,updatedAt:new Date().toISOString()})},async createChapter(r,a){const s=m(t,"arcs",r),o=await $(s),i=I(o);if(!i)throw new Error("Arc not found.");const c=F("chapter"),d=new Date().toISOString(),l={id:c,arcId:r,title:a,body:"",published:!1,dmNotes:"",comments:[],reactions:{},renderMode:"markdown",htmlBackground:"",assets:[],soundtracks:[],videos:[],createdAt:d,updatedAt:d};await pt(m(t,"chapters",c),l);const p=B(i);return p.phases.length||(p.phases=[vt()]),p.phases[p.phases.length-1].chapterIds.push(c),await g(s,{chapterIds:[...i.chapterIds??[],c],phases:p.phases,updatedAt:d}),await g(m(t,"stories",i.storyId),{updatedAt:d}),l},async updateChapter(r,a){const s=m(t,"chapters",r),o=new Date().toISOString();await g(s,{...a,updatedAt:o});const i=await $(s),c=I(i);if(c?.arcId){const d=await $(m(t,"arcs",c.arcId)),l=I(d);l&&(await g(m(t,"arcs",l.id),{updatedAt:o}),await g(m(t,"stories",l.storyId),{updatedAt:o}))}return this.getChapter(r)},async updateChapterEngagement(r,a){const s=m(t,"chapters",r);return await g(s,{...a,updatedAt:new Date().toISOString()}),this.getChapter(r)},async updateChapterOrder(r,a){const s=m(t,"arcs",r),o=new Date().toISOString();await g(s,{chapterIds:a,updatedAt:o});const i=await $(s),c=I(i);c?.storyId&&await g(m(t,"stories",c.storyId),{updatedAt:o})},async createPhase(r,a){const s=m(t,"arcs",r),o=await $(s),i=I(o),c=i?B(i):null;if(!c)throw new Error("Arc not found.");const d={id:F("phase"),title:a?.trim()||"New Phase",chapterIds:[]},l=[...c.phases,d],p=new Date().toISOString();return await g(s,{phases:l,chapterIds:_(l),updatedAt:p}),await g(m(t,"stories",c.storyId),{updatedAt:p}),d},async renamePhase(r,a,s){const o=m(t,"arcs",r),i=await $(o),c=I(i),d=c?B(c):null;if(!d)throw new Error("Arc not found.");const l=d.phases.find(v=>v.id===a);if(!l)throw new Error("Phase not found.");const p=s?.trim()??"";let f;if(p)f=d.phases.map(v=>v.id===a?{...v,title:p}:v);else if(d.phases.length<=1)f=d.phases.map(v=>v.id===a?{...v,title:yt}:v);else{const v=d.phases.findIndex(E=>E.id===a),T=v<d.phases.length-1?v+1:v-1;f=d.phases.map((E,D)=>D===T?{...E,chapterIds:[...l.chapterIds??[],...E.chapterIds??[]]}:E).filter(E=>E.id!==a)}const w=new Date().toISOString();return await g(o,{phases:f,chapterIds:_(f),updatedAt:w}),await g(m(t,"stories",d.storyId),{updatedAt:w}),f.find(v=>v.id===a)},async moveChapterToPhase(r,a,s){const o=m(t,"arcs",r),i=await $(o),c=I(i),d=c?B(c):null;if(!d)throw new Error("Arc not found.");const l=d.phases.map(w=>({...w,chapterIds:(w.chapterIds??[]).filter(v=>v!==a)})),p=l.find(w=>w.id===s);if(!p)throw new Error("Phase not found.");p.chapterIds.push(a);const f=new Date().toISOString();await g(o,{phases:l,chapterIds:_(l),updatedAt:f}),await g(m(t,"stories",d.storyId),{updatedAt:f})},async transferChapter(r,a,s){const o=m(t,"chapters",r),i=await $(o),c=I(i);if(!c)throw new Error("Chapter not found.");const d=m(t,"arcs",c.arcId),l=m(t,"arcs",a),[p,f]=await Promise.all([$(d),$(l)]),w=I(p),v=I(f),T=w?B(w):null,E=v?B(v):null;if(!T)throw new Error("Source arc not found.");if(!E)throw new Error("Target arc not found.");if(!(E.phases??[]).find(x=>x.id===s))throw new Error("Target phase not found.");const C=T.phases.map(x=>({...x,chapterIds:(x.chapterIds??[]).filter(b=>b!==r)})),P=E.phases.map(x=>x.id===s?{...x,chapterIds:[...x.chapterIds??[],r]}:x),A=new Date().toISOString();return await Promise.all([g(d,{phases:C,chapterIds:_(C),updatedAt:A}),g(l,{phases:P,chapterIds:_(P),updatedAt:A}),g(o,{arcId:a,updatedAt:A})]),await Promise.all([g(m(t,"stories",T.storyId),{updatedAt:A}),g(m(t,"stories",E.storyId),{updatedAt:A})]),this.getChapter(r)},async reorderPhaseChapters(r,a,s){const o=m(t,"arcs",r),i=await $(o),c=I(i),d=c?B(c):null;if(!d)throw new Error("Arc not found.");const l=d.phases.map(f=>f.id===a?{...f,chapterIds:[...s]}:f),p=new Date().toISOString();await g(o,{phases:l,chapterIds:_(l),updatedAt:p}),await g(m(t,"stories",d.storyId),{updatedAt:p})},async deleteChapter(r){const a=await $(m(t,"chapters",r)),s=I(a);if(!s)return;const o=m(t,"arcs",s.arcId),i=await $(o),c=I(i),d=new Date().toISOString();c&&(await g(o,{chapterIds:(c.chapterIds??[]).filter(l=>l!==r),phases:(c.phases??[]).map(l=>({...l,chapterIds:(l.chapterIds??[]).filter(p=>p!==r)})),updatedAt:d}),await g(m(t,"stories",c.storyId),{updatedAt:d})),await ct(m(t,"chapters",r))},async deleteArc(r){const a=await $(m(t,"arcs",r)),s=I(a);if(!s)return;for(const d of s.chapterIds??[])await ct(m(t,"chapters",d));const o=m(t,"stories",s.storyId),i=await $(o),c=I(i);c&&await g(o,{arcIds:(c.arcIds??[]).filter(d=>d!==r),updatedAt:new Date().toISOString()}),await ct(m(t,"arcs",r))},async deleteStory(r){const a=await U(t,r);if(a){for(const s of a.arcs??[]){for(const o of s.chapters??[])await ct(m(t,"chapters",o.id));await ct(m(t,"arcs",s.id))}await ct(m(t,"stories",r))}}}}async function Je(e){return e?.mode==="firebase"&&e.db?Ke(e):Ge()}const Ze={VITE_APP_MODE:"firebase",VITE_FIREBASE_API_KEY:"AIzaSyC8-b4_lzrCk2RhsqSEMkcxNKgMzVx_WJ4",VITE_FIREBASE_APP_ID:"1:309677315541:web:ef90a15da4ee29c03fd95c",VITE_FIREBASE_AUTH_DOMAIN:"ulunavir-tales.firebaseapp.com",VITE_FIREBASE_MESSAGING_SENDER_ID:"309677315541",VITE_FIREBASE_PROJECT_ID:"ulunavir-tales",VITE_FIREBASE_STORAGE_BUCKET:"ulunavir-tales.firebasestorage.app"},Rt={mode:"local",firebase:{apiKey:"",authDomain:"",projectId:"",appId:"",storageBucket:"",messagingSenderId:""}};function Qe(){const e=Ze??{};return{mode:e.VITE_APP_MODE??Rt.mode,firebase:{apiKey:e.VITE_FIREBASE_API_KEY??"",authDomain:e.VITE_FIREBASE_AUTH_DOMAIN??"",projectId:e.VITE_FIREBASE_PROJECT_ID??"",appId:e.VITE_FIREBASE_APP_ID??"",storageBucket:e.VITE_FIREBASE_STORAGE_BUCKET??"",messagingSenderId:e.VITE_FIREBASE_MESSAGING_SENDER_ID??""}}}function oe(){const e=globalThis.STORYFORGE_CONFIG??{},t=Qe();return{...Rt,...t,...e,firebase:{...Rt.firebase,...t.firebase,...e.firebase??{}}}}function Xe(e){return e.mode==="firebase"&&!!(e.firebase.projectId&&e.firebase.apiKey&&e.firebase.appId)}function ta(){const e=oe();if(!Xe(e))return{mode:"local",auth:null,db:null,signIn:async()=>null,signOut:async()=>null,watchAuth:o=>(o(null),()=>{})};const t=Oe().length?Re():De(e.firebase),r=Ue(t),a=Be(t),s=new _e;return s.addScope("email"),s.addScope("profile"),s.setCustomParameters({prompt:"select_account"}),{mode:"firebase",auth:r,db:a,getRedirectUser:async()=>(await He(r))?.user??null,signIn:async()=>{try{return(await je(r,s)).user}catch(o){if(o?.code==="auth/invalid-credential"||o?.code==="auth/internal-error")return await ze(r,s),null;throw o}},signOut:async()=>Fe(r),watchAuth:o=>Ve(r,o)}}function ea(){return oe()}const Pt=document.querySelector("#app"),n={adapter:null,authClient:null,currentUser:JSON.parse(localStorage.getItem("storyforge-session")??"null"),route:{name:"home",params:{}},dragActive:!1,saveStatus:"",authError:"",loadError:"",soundtrack:{arcId:"",queue:[],currentIndex:0,paused:!0,volume:70,volumeOpen:!1,mode:"idle",ready:!1,autoplayAttempted:!1,activeKey:"",youtubePlayer:null,syncToken:0,manualPause:!1,recoveryTimer:null,recoveryAttempts:0,cueObserver:null,cueMode:!1}},ie="storyforge-soundtrack-state";function aa(){try{const e=localStorage.getItem(ie);return e?JSON.parse(e):{}}catch{return{}}}function _t(){const{arcId:e,currentIndex:t,paused:r,volume:a}=n.soundtrack;localStorage.setItem(ie,JSON.stringify({arcId:e,currentIndex:t,paused:r,volume:a}))}function Et(e=k()){return e?e.penName?.trim()||e.name||"Creator":"Guest"}function ce(e=k()){return e?.structureView==="grid"?"grid":"list"}function st(e=k()){const t=e?.readerSettings??{};return{fontSize:Math.max(14,Math.min(24,Number(t.fontSize)||17)),lineHeight:Math.max(1.4,Math.min(2.4,Number(t.lineHeight)||1.85)),width:Math.max(620,Math.min(1200,Number(t.width)||920))}}function nt(e){return e?.published!==!1}function Dt(e,t){return t||nt(e)}function V(e){n.currentUser=e,localStorage.setItem("storyforge-session",JSON.stringify(e))}function ra(){document.querySelectorAll(".modal-backdrop").forEach(e=>e.remove())}function q(e){const t=`#${e}`;if(window.location.hash===t){gt(),window.scrollTo({top:0,left:0,behavior:"auto"});return}window.location.hash=e}function sa(){const e=window.location.hash.replace(/^#/,"")||"/",[t]=e.split("?"),r=t.split("/").filter(Boolean);return r.length===0?{name:"home",params:{}}:r[0]==="creator"?{name:"creator",params:{}}:r[0]==="browser"?{name:"browser",params:{}}:r[0]==="settings"?{name:"settings",params:{}}:r[0]==="stories"&&r[1]?r[2]==="arcs"&&r[3]&&r[4]==="chapters"&&r[5]?{name:"chapter",params:{storyId:r[1],arcId:r[3],chapterId:r[5]}}:r[2]==="arcs"&&r[3]?{name:"arc",params:{storyId:r[1],arcId:r[3]}}:{name:"story",params:{storyId:r[1]}}:{name:"not-found",params:{}}}function K(){return new URLSearchParams(window.location.hash.split("?")[1]??"")}function k(){return n.currentUser?n.currentUser:n.authClient?.mode==="firebase"?null:{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",mode:"demo",structureView:"list"}}function de(e){return!!(e?.creatorId&&k()?.id&&e.creatorId===k().id)}function Ut(e){return String(e??"").trim().toLowerCase()}function na(e){const t=Ut(k()?.email);return!!(t&&(e?.editorEmails??[]).includes(t))}function Nt(e){return de(e)||na(e)}function Vt(e){return e?.visibility!=="private"||Nt(e)}function u(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function mt(e){return`${e}-${crypto.randomUUID().slice(0,8)}`}function le(e,t="Soundtrack"){return e?.trim()||t}function ue(e){try{const t=new URL(e);if(t.hostname==="youtu.be")return t.pathname.replace(/\//g,"")||null;if(t.hostname.includes("youtube.com")){if(t.pathname==="/watch")return t.searchParams.get("v");const r=t.pathname.split("/").filter(Boolean);if(["embed","shorts","live"].includes(r[0]))return r[1]??null}}catch{return null}return null}function pe(e){try{const t=new URL(e),r=t.searchParams.get("t")??t.searchParams.get("start")??t.searchParams.get("time_continue");if(!r)return 0;if(/^\d+$/.test(r))return Math.max(0,Number(r));const a=r.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/i);if(!a)return 0;const s=Number(a[1]??0),o=Number(a[2]??0),i=Number(a[3]??0);return s*3600+o*60+i}catch{return 0}}function me(e){const t=e?.url?.trim(),r=t&&!/^https?:\/\//i.test(t)?`https://${t}`:t;if(!r)return null;const a=ue(r);return a?{id:e.id??mt("soundtrack"),label:le(e.label,"YouTube track"),url:r,source:"youtube",videoId:a,startSeconds:pe(r)}:null}function he(e){const t=e?.url?.trim(),r=t&&!/^https?:\/\//i.test(t)?`https://${t}`:t;if(!r)return null;const a=ue(r);return a?{id:e.id??mt("video"),label:le(e.label,"YouTube video"),url:r,source:"youtube",videoId:a,startSeconds:pe(r)}:null}function fe(e=[]){return e.map(me).filter(Boolean)}function oa(e=[]){return new Map(fe(e).map(t=>[t.id,t.label]))}function ia(e=[]){return new Map(e.map(he).filter(Boolean).map(t=>[t.id,t]))}function ca(e){return it(e)==="markdown"&&/\[music:\s*[^\]]+\]/i.test(e?.body??"")}function ge(){n.soundtrack.cueObserver&&(n.soundtrack.cueObserver.disconnect(),n.soundtrack.cueObserver=null)}function da(){let e=document.querySelector("#soundtrack-layer");return e||(e=document.createElement("div"),e.id="soundtrack-layer",e.innerHTML=`
    <div id="youtube-soundtrack-host"></div>
  `,document.body.append(e),e)}function la(e,t){return t()?Promise.resolve():new Promise((r,a)=>{const s=[...document.querySelectorAll("script")].find(i=>i.src===e);if(s){s.addEventListener("load",()=>r(),{once:!0}),s.addEventListener("error",()=>a(new Error(`Failed to load ${e}`)),{once:!0});return}const o=document.createElement("script");o.src=e,o.async=!0,o.addEventListener("load",()=>r(),{once:!0}),o.addEventListener("error",()=>a(new Error(`Failed to load ${e}`)),{once:!0}),document.head.append(o)})}function O(){const e=n.soundtrack.queue??[];if(!e.length)return null;const t=Math.max(0,Math.min(n.soundtrack.currentIndex,e.length-1));return e[t]??null}function ot(){const e=O(),t=document.querySelector("[data-action='toggle-soundtrack']");t&&(t.disabled=!e,t.classList.toggle("is-active",!!e&&!n.soundtrack.paused),t.setAttribute("aria-pressed",String(!!e&&!n.soundtrack.paused)),t.setAttribute("title",e?`${n.soundtrack.paused?"Resume":"Pause"} ${e.label}`:"No soundtrack available"));const r=document.querySelector("[data-action='toggle-volume-popout']");r&&(r.disabled=!e,r.classList.toggle("is-open",n.soundtrack.volumeOpen),r.style.setProperty("--volume-fill",`${Y(n.soundtrack.volume)}%`),r.setAttribute("title",e?`Volume ${Y(n.soundtrack.volume)}%`:"No soundtrack available"));const a=document.querySelector("#soundtrack-volume-slider");a&&(a.value=String(Y(n.soundtrack.volume)));const s=document.querySelector("#soundtrack-volume-value");s&&(s.textContent=`${Y(n.soundtrack.volume)}%`);const o=document.querySelector(".volume-popout");o&&(o.hidden=!n.soundtrack.volumeOpen)}function at(){_t(),ot()}function ve(){const e=document.querySelector("#soundtrack-status");e&&(e.textContent="No soundtrack loaded."),ot()}function M(e){const t=document.querySelector("#soundtrack-status");t&&(t.textContent=e)}function j(){n.soundtrack.recoveryTimer&&(clearTimeout(n.soundtrack.recoveryTimer),n.soundtrack.recoveryTimer=null)}function lt(e="Playback interrupted",t=2200){const r=O();if(!r||n.soundtrack.paused||n.soundtrack.manualPause)return;j();const a=r.id,s=n.soundtrack.syncToken;M(`${e}. Trying to resume...`),n.soundtrack.recoveryTimer=setTimeout(()=>{const o=O();if(!(!o||o.id!==a||s!==n.soundtrack.syncToken||n.soundtrack.paused||n.soundtrack.manualPause||!n.soundtrack.youtubePlayer)){n.soundtrack.recoveryAttempts+=1;try{n.soundtrack.recoveryAttempts%4===0&&o.videoId?Ft(o):n.soundtrack.youtubePlayer.playVideo(),M(`Resuming: ${o.label}`)}catch(i){M(`Soundtrack recovery failed: ${String(i.message||i)}`)}}},t)}function ye(){const e=O();j(),n.soundtrack.manualPause=!0,n.soundtrack.mode==="youtube"&&n.soundtrack.youtubePlayer?.pauseVideo&&n.soundtrack.youtubePlayer.pauseVideo(),n.soundtrack.paused=!0,e&&M(`Paused: ${e.label}`),at()}function we(){const e=O();e&&(j(),n.soundtrack.manualPause=!1,n.soundtrack.recoveryAttempts=0,n.soundtrack.mode==="youtube"&&n.soundtrack.youtubePlayer?.playVideo&&n.soundtrack.youtubePlayer.playVideo(),n.soundtrack.paused=!1,M(`Now playing: ${e.label}`),at())}function ua(){n.soundtrack.queue.length&&(n.soundtrack.currentIndex=(n.soundtrack.currentIndex+1)%n.soundtrack.queue.length,n.soundtrack.activeKey="",n.soundtrack.ready=!1,n.soundtrack.autoplayAttempted=!1,n.soundtrack.manualPause=!1,n.soundtrack.recoveryAttempts=0,j(),at(),jt())}function pa(){const e=O();if(!(!e||n.soundtrack.manualPause)){j(),n.soundtrack.paused=!1,n.soundtrack.recoveryAttempts=0;try{n.soundtrack.youtubePlayer?.seekTo?(n.soundtrack.youtubePlayer.seekTo(0,!0),n.soundtrack.youtubePlayer.playVideo()):n.soundtrack.youtubePlayer?.loadVideoById&&e.videoId&&Ft(e,0),M(`Looping cue: ${e.label}`),lt("Cue loop did not restart",5e3)}catch(t){M(`Cue loop failed: ${String(t.message||t)}`)}}}function ma(e){return O()?.id===e&&n.soundtrack.activeKey===e}function be(e,t={}){const r=n.soundtrack.queue.findIndex(a=>a.id===e);if(r<0){M("Music cue points to a missing soundtrack.");return}if(ma(e)){n.soundtrack.paused&&we();return}n.soundtrack.currentIndex=r,n.soundtrack.paused=!1,n.soundtrack.manualPause=!1,n.soundtrack.ready=!1,n.soundtrack.activeKey="",n.soundtrack.recoveryAttempts=0,j(),at(),jt(),t.source==="button"&&M(`Cue selected: ${n.soundtrack.queue[r].label}`)}function Y(e){return Math.max(0,Math.min(100,Math.round(Number(e)||0)))}function Se(){const e=Y(n.soundtrack.volume);n.soundtrack.volume=e,n.soundtrack.youtubePlayer?.setVolume&&n.soundtrack.youtubePlayer.setVolume(e),at()}function $e(e){n.soundtrack.volume=Y(e),Se()}function ha(e){$e(Y(n.soundtrack.volume+e))}function Ft(e,t=e.startSeconds??0){n.soundtrack.youtubePlayer?.loadVideoById&&n.soundtrack.youtubePlayer.loadVideoById({videoId:e.videoId,startSeconds:Math.max(0,Number(t)||0)})}async function fa(e,t){await la("https://www.youtube.com/iframe_api",()=>!!window.YT?.Player),t===n.soundtrack.syncToken&&(da(),n.soundtrack.youtubePlayer?Ft(e):await new Promise(r=>{const a=()=>{n.soundtrack.youtubePlayer=new window.YT.Player("youtube-soundtrack-host",{height:"200",width:"320",videoId:e.videoId,playerVars:{autoplay:1,controls:1,rel:0,start:e.startSeconds||0},events:{onReady:()=>r(),onStateChange:s=>{if(s.data===window.YT.PlayerState.ENDED){if(j(),n.soundtrack.recoveryAttempts=0,n.soundtrack.cueMode){pa();return}ua();return}if(s.data===window.YT.PlayerState.PLAYING){j(),n.soundtrack.paused=!1,n.soundtrack.manualPause=!1,n.soundtrack.recoveryAttempts=0;const o=O();o&&M(`Now playing: ${o.label}`),at()}if(s.data===window.YT.PlayerState.PAUSED){if(n.soundtrack.manualPause){n.soundtrack.paused=!0,at();return}lt("Playback paused by YouTube")}s.data===window.YT.PlayerState.BUFFERING&&lt("Playback is buffering",4500),(s.data===window.YT.PlayerState.CUED||s.data===window.YT.PlayerState.UNSTARTED)&&lt("Playback is waiting")},onError:s=>{const o=O();M(`YouTube player error${s?.data?` ${s.data}`:""}. Retrying...`),o&&lt("YouTube player error",1500)}}})};if(window.YT?.Player)a();else{const s=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{s?.(),a()}}}),t===n.soundtrack.syncToken&&(n.soundtrack.mode="youtube",n.soundtrack.ready=!0,n.soundtrack.activeKey=e.id,Se(),M(`Now playing: ${e.label}`),n.soundtrack.paused||(n.soundtrack.manualPause=!1,n.soundtrack.youtubePlayer.playVideo(),lt("Playback did not start",5e3)),ot()))}async function jt(){const e=++n.soundtrack.syncToken,t=O();if(!t){n.soundtrack.arcId="",n.soundtrack.queue=[],n.soundtrack.mode="idle",n.soundtrack.ready=!1,n.soundtrack.activeKey="",ye(),ve();return}try{if(t.source==="youtube"){await fa(t,e);return}}catch(r){n.saveStatus=`Soundtrack error: ${String(r.message||r)}`,M("Soundtrack could not be loaded."),ot()}}function ga(e,t,r={}){const a=aa(),s=e!==n.soundtrack.arcId||JSON.stringify(t.map(o=>o.id))!==JSON.stringify((n.soundtrack.queue??[]).map(o=>o.id));if(ge(),n.soundtrack.arcId=e,n.soundtrack.queue=t,n.soundtrack.cueMode=!!r.waitForCue,s&&(n.soundtrack.currentIndex=a.arcId===e&&typeof a.currentIndex=="number"?Math.max(0,Math.min(a.currentIndex,t.length-1)):0,n.soundtrack.paused=a.arcId===e?!!a.paused:!1,n.soundtrack.manualPause=n.soundtrack.paused,n.soundtrack.volume=typeof a.volume=="number"?Y(a.volume):n.soundtrack.volume,n.soundtrack.ready=!1,n.soundtrack.activeKey="",n.soundtrack.recoveryAttempts=0,j()),at(),n.soundtrack.cueMode){(s||!n.soundtrack.activeKey)&&(n.soundtrack.paused=!0,n.soundtrack.manualPause=!0,n.soundtrack.youtubePlayer?.pauseVideo&&n.soundtrack.youtubePlayer.pauseVideo(),_t(),M("Waiting for music cue."),ot()),va();return}jt()}function va(){const e=[...document.querySelectorAll(".music-cue[data-music-trigger]")];if(!e.length||!n.soundtrack.queue.length)return;const t=new Set(n.soundtrack.queue.map(r=>r.id));n.soundtrack.cueObserver=new IntersectionObserver(r=>{const s=r.filter(o=>o.isIntersecting).sort((o,i)=>i.intersectionRatio-o.intersectionRatio)[0]?.target?.dataset?.musicTrigger;!s||!t.has(s)||be(s)},{root:null,rootMargin:"-20% 0px -55% 0px",threshold:[0,.35,.75]}),e.forEach(r=>n.soundtrack.cueObserver.observe(r))}function Q(){j(),ge(),n.soundtrack.arcId="",n.soundtrack.queue=[],n.soundtrack.currentIndex=0,n.soundtrack.paused=!0,n.soundtrack.manualPause=!0,n.soundtrack.volumeOpen=!1,n.soundtrack.activeKey="",n.soundtrack.ready=!1,n.soundtrack.recoveryAttempts=0,n.soundtrack.cueMode=!1,n.soundtrack.youtubePlayer?.pauseVideo&&n.soundtrack.youtubePlayer.pauseVideo(),ve(),_t()}function ya(e,t,r){const a=String(e??"").trim();if(!a)return"";const s=t.get(a)??a;return r?`
    <span class="music-cue is-visible" data-music-trigger="${u(a)}">
      <button class="music-cue-play" type="button" data-action="play-music-cue" data-music-trigger="${u(a)}" title="Play ${u(s)}">▶</button>
      <span>Music cue: ${u(s)}</span>
    </span>
  `:`<span class="music-cue" data-music-trigger="${u(a)}"></span>`}function wa(e,t){const r=String(e??"").trim(),a=t.get(r);if(!a)return`<div class="video-embed-missing">Missing video: ${u(r)}</div>`;const s=new URLSearchParams({rel:"0",modestbranding:"1"});return a.startSeconds&&s.set("start",String(a.startSeconds)),`
    <figure class="chapter-video">
      <iframe
        src="https://www.youtube.com/embed/${u(a.videoId)}?${s.toString()}"
        title="${u(a.label)}"
        width="100%"
        height="506"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
      ></iframe>
      <figcaption>${u(a.label)}</figcaption>
    </figure>
  `}function ke(e){return`
    <figure class="chapter-image-frame is-fill" data-image-view="fill" data-auto-image-view="true">
      <button class="small-button image-view-toggle" type="button" data-action="toggle-image-view" title="Toggle image view">Desired</button>
      ${e}
    </figure>
  `}function ba(e,t){return ke(`<img alt="${e}" src="${u(Ht(t))}" />`)}function Sa(e,t={}){const r=String(e??""),a=t.soundtrackLabels??new Map,s=t.videos??new Map,o=!!t.showMusicCues,i="ULUNAVIR_SAFE_EXTRA_BREAK",c=r.replace(/\n{3,}/g,C=>`

${`${i}
`.repeat(C.length-2)}
`);let d=u(c);return d=d.replaceAll(i,"<br />"),d.replace(/```([\s\S]*?)```/g,(C,P)=>`<pre><code>${P.trim()}</code></pre>`).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(C,P,A)=>ba(P,A)).replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/\[music:\s*([^\]]+)\]/gi,(C,P)=>ya(P,a,o)).replace(/\[video:\s*([^\]]+)\]/gi,(C,P)=>wa(P,s)).replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/(?:^|\n)- (.*(?:\n- .*)*)/g,C=>`
<ul>${C.trim().split(`
`).map(A=>A.replace(/^- /,"").trim()).map(A=>`<li>${A}</li>`).join("")}</ul>`).split(/\n{2,}/).map(C=>/^<(h\d|ul|ol|pre|p|blockquote|table|hr|br|figure|div)\b/.test(C.trim())?C:`<p>${C.replace(/\n/g,"<br />")}</p>`).join("")}function $a(e){return String(e??"").replace(/<script\b[\s\S]*?<\/script>/gi,"").replace(/\bsrc=(["'])(https?:\/\/t\d+\.pixhost\.(?:to|cc)\/thumbs\/[^"']+)\1/gi,(t,r,a)=>`src=${r}${u(Ht(a))}${r}`).replace(/<img\b[^>]*>/gi,t=>ke(t)).replace(/\n{3,}/g,t=>`

${`<br />
`.repeat(t.length-2)}
`)}function it(e){return e?.renderMode==="html"?"html":"markdown"}function Ie(e){return e?.htmlBackground||""}function ka(e){const t=String(e??"").replace("#","");if(!/^[0-9a-f]{6}$/i.test(t))return!1;const r=parseInt(t.slice(0,2),16),a=parseInt(t.slice(2,4),16),s=parseInt(t.slice(4,6),16);return(r*299+a*587+s*114)/1e3>170}function xt(e,t,r={}){const a=it(e),s=e?.body||t;if(a==="html"){const o=Ie(e),i=[];return o&&(i.push(`background-color: ${o}`),ka(o)&&i.push("color: #1d1712")),`<div class="html-document-surface" ${i.length?`style="${u(i.join("; "))}"`:""}>${$a(s)}</div>`}return Sa(s,{soundtrackLabels:oa(e?.soundtracks??[]),videos:ia(e?.videos??[]),showMusicCues:!!r.showMusicCues})}function Ae(e="",t="markdown"){let r=String(e??"");if(t==="html"){const s=document.createElement("div");s.innerHTML=r,r=s.textContent??""}else r=r.replace(/```[\s\S]*?```/g," ").replace(/!\[[^\]]*]\([^)]+\)/g," ").replace(/\[music:\s*[^\]]+\]/gi," ").replace(/\[video:\s*[^\]]+\]/gi," ").replace(/\[([^\]]+)]\([^)]+\)/g,"$1").replace(/[#>*_`~\-]/g," ");const a=r.replace(/\s+/g," ").trim();return{words:a?a.split(" ").length:0,characters:r.replace(/\s+$/g,"").length}}function Ia(e){const t=Ae(e?.body??"",it(e));return`<div id="chapter-text-stats" class="chapter-text-stats">Words: ${t.words} · Characters: ${t.characters}</div>`}function Aa(e=""){const t=new Set,r=String(e??"");return[...r.matchAll(/data-word-image-placeholder=["'](\d+)["']/gi)].forEach(a=>t.add(Number(a[1]))),[...r.matchAll(/\[IMAGE\s+(\d+)\s+HERE\]/gi)].forEach(a=>t.add(Number(a[1]))),[...t].filter(a=>Number.isFinite(a)).sort((a,s)=>a-s)}function Ea(e){const t=Aa(e.body);return it(e)!=="html"||!t.length?"":`
    <section class="panel stack word-image-panel">
      <div class="section-header">
        <div>
          <h3>Word Images</h3>
          <p class="muted">Paste Imgur, Pixhost, or direct image URLs to replace the Word image placeholders in their original positions.</p>
        </div>
        <span class="pill">${t.length} placeholder(s)</span>
      </div>
      <div class="word-image-list">
        ${t.map(r=>`
          <div class="inline-form word-image-row">
            <label>IMAGE ${r}</label>
            <input data-word-image-url="${r}" placeholder="https://i.imgur.com/example.png or https://pixhost.to/show/..." />
            <button class="ghost-button" type="button" data-action="replace-word-image" data-chapter-id="${e.id}" data-image-index="${r}">Apply</button>
          </div>
        `).join("")}
      </div>
    </section>
  `}function Ca(e){return String(e??"").replace(/([.!?:;])\s*\d{1,4}(?=[A-ZÇĞİÖŞÜ])/g,"$1 ").replace(/(<(?:p|h[1-6]|li|blockquote)\b[^>]*>)\s*[o0]\s*(?=[A-ZÇĞİÖŞÜ])/gi,"$1").replace(/(<(?:p|h[1-6]|li|blockquote)\b[^>]*>)\s*\d{1,4}\s*(?=[A-ZÇĞİÖŞÜ])/gi,"$1").replace(/<p>\s*(?:\d{1,4}|[o0])\s*<\/p>/gi,"").replace(/(?:^|\n)\s*(?:\d{1,4}|[o0])\s*(?=\n|$)/gi,`
`).replace(/>\s+</g,"><").replace(/<\/(h[1-6]|p|blockquote|ul|ol|li|table|tr)>\s*/gi,`</$1>

`).replace(/\s*<(h[1-6]|p|blockquote|ul|ol|table)\b/gi,`
<$1`).replace(/\n{3,}/g,`

`).trim()}function ht(e,t){return[...e?.childNodes??[]].filter(r=>r.nodeType===1&&r.localName===t)}function R(e,t){return ht(e,t)[0]??null}function W(e,t){return e?.getAttribute(`w:${t}`)??e?.getAttribute(t)??""}function Ta(e){const t=String(e??"").trim();return!t||t.toLowerCase()==="auto"?"":t.startsWith("#")?t:`#${t}`}function Pa(e){return{black:"#000000",blue:"#2f65d9",cyan:"#00cfe8",green:"#37b24d",magenta:"#d63384",red:"#d9480f",yellow:"#ffe066",white:"#ffffff"}[String(e??"").toLowerCase()]??""}function xa(e){const t=R(e,"rPr");if(!t)return[];const r=[],a=Ta(W(R(t,"color"),"val")),s=Pa(W(R(t,"highlight"),"val")),o=Number(W(R(t,"sz"),"val")),i=R(t,"rFonts"),c=W(i,"ascii")||W(i,"hAnsi"),d=R(t,"u"),l=W(R(t,"vertAlign"),"val");return R(t,"b")&&r.push("font-weight: 700"),R(t,"i")&&r.push("font-style: italic"),d&&W(d,"val")!=="none"&&r.push("text-decoration: underline"),R(t,"strike")&&r.push("text-decoration: line-through"),a&&r.push(`color: ${a}`),s&&r.push(`background-color: ${s}`),Number.isFinite(o)&&o>0&&r.push(`font-size: ${o/2}pt`),c&&r.push(`font-family: ${c.replace(/[<>"']/g,"")}`),l==="superscript"&&r.push("vertical-align: super","font-size: 0.72em"),l==="subscript"&&r.push("vertical-align: sub","font-size: 0.72em"),r}function Na(e){return`<div class="word-image-placeholder" data-word-image-placeholder="${e}"><strong>[IMAGE ${e} HERE]</strong><br />Upload this Word image to Imgur or Pixhost, then replace this block with the Word Images panel.</div>`}function Jt(e,t){const r=[];for(const o of[...e.childNodes])o.nodeType===1&&(o.localName==="t"||o.localName==="instrText"?r.push(u(o.textContent??"")):o.localName==="tab"?r.push("&nbsp;&nbsp;&nbsp;&nbsp;"):o.localName==="br"||o.localName==="cr"?r.push("<br />"):(o.localName==="drawing"||o.localName==="pict")&&(t.imageIndex+=1,r.push(Na(t.imageIndex))));const a=r.join("");if(!a)return"";const s=xa(e);return s.length?`<span style="${u(s.join("; "))}">${a}</span>`:a}function Ee(e,t){const r=R(e,"pPr"),a=W(R(r,"pStyle"),"val").toLowerCase(),s=W(R(r,"jc"),"val"),o=[];let i="p";const c=a.match(/heading([1-6])/);if(c?i=`h${c[1]}`:a==="title"?i="h1":a==="subtitle"&&(i="h2"),s){const l=s==="both"?"justify":s;o.push(`text-align: ${l}`)}const d=[...e.childNodes].map(l=>l.nodeType!==1?"":l.localName==="r"?Jt(l,t):l.localName==="hyperlink"?ht(l,"r").map(p=>Jt(p,t)).join(""):"").join("").trim();return d?`<${i}${o.length?` style="${u(o.join("; "))}"`:""}>${d}</${i}>`:""}function La(e,t){const r=ht(e,"tr").map(a=>`<tr>${ht(a,"tc").map(o=>`<td>${ht(o,"p").map(c=>Ee(c,t)).filter(Boolean).join("")}</td>`).join("")}</tr>`).join("");return r?`<table><tbody>${r}</tbody></table>`:""}async function qa(e){const{default:t}=await ne(async()=>{const{default:l}=await import("./jszip.min-D7KnG0-e.js").then(p=>p.j);return{default:l}},[]),a=(await t.loadAsync(e)).file("word/document.xml");if(!a)throw new Error("This .docx file does not contain a readable Word document.");const s=await a.async("text"),i=new DOMParser().parseFromString(s,"application/xml").getElementsByTagNameNS("*","body")[0],c={imageIndex:0};return{html:[...i?.childNodes??[]].map(l=>l.nodeType!==1?"":l.localName==="p"?Ee(l,c):l.localName==="tbl"?La(l,c):"").filter(Boolean).join(`

`),imageCount:c.imageIndex}}function ft(){const e=document.querySelector("#chapter-render-mode-input")?.value==="html"?"html":"markdown",t=document.querySelector("#chapter-html-background-input")?.value??"";return{body:document.querySelector("#chapter-body-input")?.value??"",renderMode:e,htmlBackground:e==="html"?t:""}}function Bt(){const e=document.querySelector(".markdown-preview");if(!e)return;const t=ft();e.dataset.previewMode=t.renderMode,e.innerHTML=xt(t,t.renderMode==="html"?"":"*Start writing to preview your chapter here.*"),Te(e);const r=document.querySelector("#chapter-text-stats");if(r){const a=Ae(t.body,t.renderMode);r.textContent=`Words: ${a.words} · Characters: ${a.characters}`}}async function Ma(e){if(!e)return;if(!e.name.toLowerCase().endsWith(".docx"))throw new Error("Please choose a .docx Word file.");if(!(document.querySelector("#chapter-body-input")instanceof HTMLTextAreaElement))throw new Error("Chapter editor is not available.");const r=n.route.params.chapterId,a=document.querySelector("#chapter-title-input"),s=await qa(await e.arrayBuffer()),o=Ca(s.html);if(!o)throw new Error("No readable text was found in that Word file.");await n.adapter.updateChapter(r,{title:a?.value.trim()||"Untitled Chapter",body:o,renderMode:"html",htmlBackground:""});const i=s.imageCount?` ${s.imageCount} image placeholder(s) added.`:"";n.saveStatus=`Word file imported into the editor.${i}`;const c=document.querySelector(".notice.mono");c&&(c.textContent=n.saveStatus),await h()}function Oa(e){return e?typeof e.toDate=="function"?e.toDate():typeof e.seconds=="number"?new Date(e.seconds*1e3):new Date(e):null}function wt(e){const t=Oa(e);return!t||Number.isNaN(t.getTime())?"Unknown date":new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short"}).format(t)}function ut(e,t="Untitled"){return String(e??t).trim().replace(/[<>:"/\\|?*\x00-\x1f]/g,"-").replace(/\s+/g," ").slice(0,90)||t}function Ra(e,t){const r=URL.createObjectURL(e),a=document.createElement("a");a.href=r,a.download=t,document.body.append(a),a.click(),a.remove(),URL.revokeObjectURL(r)}function Da(e,t,r){if(!t)return e;const a=t.toLowerCase();return e.filter(s=>r(s).toLowerCase().includes(a))}function Ua(e){return[...new Set(e.flatMap(t=>t.tags))].sort((t,r)=>t.localeCompare(r))}function Ba(e=""){return`
    <aside class="quick-tools">
      <div class="quick-tools-frame">
        <div class="quick-tools-label">Quick Tools</div>
        <div class="quick-tools-body">
          ${e||'<div class="quick-tools-empty">No tools</div>'}
        </div>
      </div>
    </aside>
  `}function rt(e,t,r=""){const a=k(),s=st(a),o=`--reader-font-size:${s.fontSize}px;--reader-line-height:${s.lineHeight};--reader-width:${s.width}px;`,i=n.authError?`<div class="notice"><strong>Sign-in error</strong><div class="muted">${u(n.authError)}</div></div>`:"",c=n.loadError?`<div class="notice"><strong>Load error</strong><div class="muted">${u(n.loadError)}</div></div>`:"",d=n.saveStatus?`<div class="notice"><strong>Status</strong><div class="muted">${u(n.saveStatus)}</div></div>`:"";Pt.innerHTML=`
    <div class="app-shell" style="${o}">
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
            ${Mt("/","Main Menu",t==="home")}
            ${Mt("/creator","Creator",t==="creator")}
            ${Mt("/browser","Browser",t==="browser")}
          </nav>
        </div>
        <div class="stack">
          <button class="notice account-card" data-action="open-settings" ${a?"":"disabled"}>
            <strong>${u(Et(a))}</strong>
            <div class="muted">${u(a?.email??(n.authClient?.mode==="firebase"?"Sign in to create and manage stories":"Local demo mode"))}</div>
          </button>
          <button class="login-button" data-action="toggle-login">
            ${n.currentUser?"Log out":"Log in"}
          </button>
        </div>
      </aside>
      <main class="content">${e}</main>
      ${Ba(r)}
    </div>
  `,(i||c||d)&&Pt.querySelector(".content").insertAdjacentHTML("afterbegin",`${d}${c}${i}`),Te()}function Ce(e,t,r=!0){const a=t==="desired"?"desired":"fill";e.dataset.imageView=a,r&&(e.dataset.autoImageView="false"),e.classList.toggle("is-desired",a==="desired"),e.classList.toggle("is-fill",a!=="desired");const s=e.querySelector("[data-action='toggle-image-view']");s&&(s.textContent=a==="desired"?"Fill":"Desired",s.title=a==="desired"?"Switch to fill view":"Switch to desired view")}function Zt(e){if(e.dataset.autoImageView==="false")return;const t=e.querySelector("img");!t?.naturalWidth||!t?.naturalHeight||Ce(e,t.naturalHeight>t.naturalWidth?"desired":"fill",!1)}function Te(e=document){e.querySelectorAll(".chapter-image-frame").forEach(t=>{const r=t.querySelector("img");if(r){if(r.complete){Zt(t);return}r.addEventListener("load",()=>Zt(t),{once:!0})}})}async function _a(){const e=k();if(!e)return J("Sign in to manage account settings.");const t=st(e);rt(`
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
            <div class="muted">${u(e.name??"Creator")}</div>
          </div>
          <div class="inline-form settings-form">
            <input id="pen-name-input" placeholder="${u(e.name??"Creator")}" value="${u(e.penName??"")}" />
            <button class="ghost-button" data-action="save-pen-name">Save pen name</button>
          </div>
          <div class="muted">
            Leave it empty to fall back to your account name.
          </div>
        </section>
        <section class="panel stack">
          <div class="section-header">
            <div>
              <h3>Reader Settings</h3>
              <p class="muted">Tune the reading view for long chapters.</p>
            </div>
          </div>
          <div class="inline-form settings-form">
            <label>
              <span class="muted">Font size</span>
              <input id="reader-font-size-input" type="number" min="14" max="24" value="${t.fontSize}" />
            </label>
            <label>
              <span class="muted">Line height</span>
              <input id="reader-line-height-input" type="number" min="1.4" max="2.4" step="0.05" value="${t.lineHeight}" />
            </label>
            <label>
              <span class="muted">Page width</span>
              <input id="reader-width-input" type="number" min="620" max="1200" step="20" value="${t.width}" />
            </label>
            <button class="ghost-button" data-action="save-reader-settings">Save reader settings</button>
          </div>
          <article
            id="reader-settings-preview"
            class="reader-settings-preview markdown-preview"
            style="--reader-font-size:${t.fontSize}px;--reader-line-height:${t.lineHeight};--reader-width:${t.width}px;"
          >
            <h3>The Candlelit Archive</h3>
            <p>
              Rain tapped against the stained glass while the old librarian unfolded a map
              that smelled of dust, sea salt, and dragon smoke.
            </p>
            <p>
              This sample updates live so you can feel the font size, line height, and page
              width before saving your reader settings.
            </p>
          </article>
        </section>
      </div>
    `,"home")}function Mt(e,t,r){return`<a class="nav-link ${r?"is-active":""}" href="#${e}"><span>${t}</span></a>`}function Va(){return`
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
  `}function Pe(e){return e.length?`
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
                <h3>${u(t.title)}</h3>
                <p class="muted">Requested by ${u(t.pendingTransfer?.requestedByName??t.creatorName)} on ${u(wt(t.pendingTransfer?.requestedAt??t.updatedAt))}</p>
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
  `:""}async function Fa(){const e=k();let t=[];if(e?.email)try{t=await n.adapter.listIncomingStoryTransfers?.(e.email)??[]}catch(r){console.error("Incoming transfer list failed:",r),n.loadError="Ownership requests could not be loaded right now."}rt(`
      <div class="stack">
        ${Va()}
        ${Pe(t)}
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
    `,"home")}async function ja(){const e=k();let t=[],r=[],a=[];try{t=await n.adapter.listCreatorStories(e?.id)}catch(p){console.error("Creator story list failed:",p),n.loadError="Your stories could not be loaded right now."}try{r=await n.adapter.listEditorStories?.(e?.email)??[]}catch(p){console.error("Editor story list failed:",p),n.loadError="Editor permissions could not be loaded right now."}if(e?.email)try{a=await n.adapter.listIncomingStoryTransfers?.(e.email)??[]}catch(p){console.error("Incoming transfer list failed:",p),n.loadError="Ownership requests could not be loaded right now."}const s=K(),o=s.get("q")??"",i=s.get("tag")??"",c=Da(t,o,p=>`${p.title} ${p.tags.join(" ")}`).filter(p=>i?p.tags.includes(i):!0),d=Ua(t),l=n.authClient?.mode==="firebase"&&!e?'<div class="notice">Sign in with Firebase to create, edit, and manage your own stories.</div>':"";rt(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Creator</h2>
            <p class="muted">Manage your stories, search by title, and filter by tags.</p>
          </div>
          <button class="primary-button" data-action="create-story" ${e?"":"disabled"}>Create</button>
        </div>
        ${Pe(a)}
        ${l}
        <section class="panel stack">
          <div class="search-row">
            <input id="story-search" placeholder="Search by story title or tag" value="${u(o)}" />
            <select id="story-tag-filter">
              <option value="">All tags</option>
              ${d.map(p=>`<option value="${u(p)}" ${i===p?"selected":""}>${u(p)}</option>`).join("")}
            </select>
            <button class="ghost-button" data-action="apply-story-filters">Filter</button>
          </div>
          <div class="chip-row">
            ${d.map(p=>`<a class="pill" href="#/creator?tag=${encodeURIComponent(p)}">${u(p)}</a>`).join("")}
          </div>
        </section>
        <section class="panel stack">
          <div class="section-header">
            <div>
              <h3>Your Stories</h3>
              <p class="muted">Stories where you are the author.</p>
            </div>
            <span class="pill">${c.length} story(s)</span>
          </div>
          <div class="story-list">
            ${c.length?c.map(p=>Qt(p,{authorView:!0})).join(""):'<div class="empty-state">No stories match this filter yet.</div>'}
          </div>
        </section>
        <section class="panel stack">
          <div class="section-header">
            <div>
              <h3>Editor Permission</h3>
              <p class="muted">Stories where the author has added you as an editor.</p>
            </div>
            <span class="pill">${r.length} story(s)</span>
          </div>
          <div class="story-list">
            ${r.length?r.map(p=>Qt(p,{editorView:!0})).join(""):'<div class="empty-state">No editor permissions yet.</div>'}
          </div>
        </section>
      </div>
    `,"creator")}function Qt(e,t={}){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${u(e.title)}</h3>
          ${t.editorView?`<p class="muted">by ${u(e.creatorName)}</p>`:""}
          <p class="muted">Updated ${wt(e.updatedAt)}</p>
        </div>
        <span class="status-pill">${u(e.visibility)}</span>
      </div>
      <div class="chip-row">
        ${e.tags.map(r=>`<span class="pill">${u(r)}</span>`).join("")}
      </div>
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${e.id}">Open story</a>
        <span class="pill">${e.arcs.length} arc(s)</span>
        ${t.authorView?`<button class="danger-button" data-action="delete-story" data-story-id="${e.id}">Delete</button>`:""}
      </div>
    </article>
  `}async function za(){const e=await n.adapter.listBrowserStories(k()?.id),t=K(),r=t.get("group")!=="flat",a=t.get("creator")??"",s=a?e.filter(c=>c.creatorName===a):e,o=[...new Set(e.map(c=>c.creatorName))];let i="";s.length?r?i=o.filter(c=>!a||c===a).map(c=>{const d=s.filter(l=>l.creatorName===c);return d.length?`
          <section class="panel stack">
            <div class="section-header">
              <h3>${u(c)}</h3>
              <span class="pill">${d.length} public stories</span>
            </div>
            <div class="story-list">${d.map(Xt).join("")}</div>
          </section>
        `:""}).join(""):i=`<section class="story-list">${s.map(Xt).join("")}</section>`:i='<div class="empty-state">No public stories are available yet.</div>',rt(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Browser</h2>
            <p class="muted">Explore public stories and browse them by creator.</p>
          </div>
          <div class="toolbar">
            <select id="browser-creator-filter">
              <option value="">All creators</option>
              ${o.map(c=>`<option value="${u(c)}" ${a===c?"selected":""}>${u(c)}</option>`).join("")}
            </select>
            <select id="browser-group-mode">
              <option value="grouped" ${r?"selected":""}>Grouped by creator</option>
              <option value="flat" ${r?"":"selected"}>Flat list</option>
            </select>
            <button class="ghost-button" data-action="apply-browser-filters">Apply</button>
          </div>
        </div>
        ${i}
      </div>
    `,"browser")}function Xt(e){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${u(e.title)}</h3>
          <p class="muted">by ${u(e.creatorName)}</p>
        </div>
        <span class="pill">${e.arcs.length} arc(s)</span>
      </div>
      <div class="chip-row">
        ${e.tags.map(t=>`<span class="pill">${u(t)}</span>`).join("")}
      </div>
      <a class="primary-button" href="#/stories/${e.id}?view=browser">Read structure</a>
    </article>
  `}async function Ha(e){const t=await n.adapter.getStory(e);if(!t)return J("Story not found.");const r=de(t),a=Nt(t),s=K().get("view")==="browser",o=ce(),i=K().get("transfer")==="1",c=t.pendingTransferStatus==="pending"?t.pendingTransfer:null;if(!Vt(t))return J("This story is private.");rt(`
      <div class="stack">
        ${zt([[s?"#/browser":"#/creator",s?"Browser":"Creator"],["",t.title]])}
        <div class="page-title">
          <div>
            <h2>${u(t.title)}</h2>
            <p class="muted">Set visibility, manage arcs, and organize the reading order.</p>
          </div>
          <div class="card-actions">
            <div class="view-toggle" role="group" aria-label="Structure view">
              <button class="ghost-button ${o==="grid"?"is-active":""}" data-action="set-structure-view" data-view="grid">Compact Grid</button>
              <button class="ghost-button ${o==="list"?"is-active":""}" data-action="set-structure-view" data-view="list">List</button>
            </div>
            ${s&&a?'<a class="ghost-button" href="#/stories/'+t.id+'">Edit</a>':""}
            ${a&&!s?'<button class="ghost-button" data-action="export-story" data-story-id="'+t.id+'">Export</button>':""}
            ${r&&!s?'<button class="ghost-button" type="button" data-action="add-story-editor" data-story-id="'+t.id+'">Add an Editor</button>':""}
            ${r&&!s?'<button class="ghost-button" type="button" data-action="open-story-transfer" data-story-id="'+t.id+'">Transfer Ownership</button>':""}
            ${a&&!s?'<button class="primary-button" data-action="create-arc" data-story-id="'+t.id+'">New arc</button>':""}
          </div>
        </div>
        <section class="panel stack">
          <div class="inline-form">
            <input id="story-title-input" value="${u(t.title)}" ${a?"":"disabled"} />
            <input id="story-tags-input" value="${u(t.tags.join(", "))}" ${a?"":"disabled"} />
            <select id="story-visibility-input" ${a?"":"disabled"}>
              ${["public","unlisted","private"].map(d=>`<option value="${d}" ${t.visibility===d?"selected":""}>${d}</option>`).join("")}
            </select>
            ${a?'<button class="ghost-button" data-action="save-story-settings" data-story-id="'+t.id+'">Save</button>':""}
          </div>
          <div class="notice">
            <strong>${u(t.creatorName)}</strong>
            <div class="muted">Created ${wt(t.createdAt)}. Visibility is currently ${u(t.visibility)}.</div>
            ${t.editorEmails?.length?`<div class="muted">Editors: ${u(t.editorEmails.join(", "))}</div>`:""}
          </div>
          ${r&&c?`
            <div class="notice">
              <strong>Transfer pending</strong>
              <div class="muted">Waiting for ${u(c.targetEmail??"")} to accept. Ownership stays with you until they do.</div>
              <div class="card-actions">
                <button class="ghost-button" data-action="cancel-story-transfer" data-story-id="${t.id}">Cancel transfer</button>
              </div>
            </div>
          `:""}
          ${r&&!s&&i?`
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
        <section class="nested-list ${o==="list"?"is-list-view":""}">
          ${t.arcs.length?t.arcs.map((d,l)=>Wa(d,t,a,l,s)).join(""):'<div class="empty-state">No arcs yet. Create the first arc to start structuring this story.</div>'}
        </section>
      </div>
    `,s?"browser":a?"creator":"browser")}function Wa(e,t,r,a,s=!1){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${u(e.title)}</h3>
          <p class="muted">${e.chapters.length} chapter(s)</p>
        </div>
        ${r?`
          <div class="order-buttons">
            <button class="small-button" data-action="move-arc-up" data-story-id="${t.id}" data-index="${a}" ${a===0?"disabled":""}>↑</button>
            <button class="small-button" data-action="move-arc-down" data-story-id="${t.id}" data-index="${a}" ${a===t.arcs.length-1?"disabled":""}>↓</button>
          </div>`:""}
      </div>
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${t.id}/arcs/${e.id}${s?"?view=browser":""}">Open arc</a>
        ${r&&!s?`<button class="danger-button" data-action="delete-arc" data-story-id="${t.id}" data-arc-id="${e.id}">Delete</button>`:""}
      </div>
    </article>
  `}function Ya(e,t,r=!1,a=""){return`
    <div class="phase-separator">
      <span class="phase-line"></span>
      ${t&&!r?`<button class="phase-title" data-action="rename-phase" data-arc-id="${a}" data-phase-id="${e.id}" data-phase-title="${u(e.title)}">${u(e.title)}</button>`:`<span class="phase-title">${u(e.title)}</span>`}
      <span class="phase-line"></span>
    </div>
  `}function Ga(e){const t=e.soundtracks??[],r=it(e)==="markdown";return`
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
                    <strong>${u(a.label?.trim()||"Untitled soundtrack")}</strong>
                    ${r?`<div class="muted mono">[music: ${u(a.id)}]</div>`:""}
                    <div class="muted mono">${u(a.url??"")}</div>
                  </div>
                  <div class="card-actions">
                    ${r?`<button class="small-button" data-action="copy-soundtrack-marker" data-soundtrack-id="${a.id}">Copy cue</button>`:""}
                    <button class="danger-button" data-action="delete-soundtrack" data-chapter-id="${e.id}" data-soundtrack-id="${a.id}">Remove</button>
                  </div>
                </article>
              `).join(""):'<div class="empty-state">No soundtrack links yet.</div>'}
      </div>
    </section>
  `}function Ka(e){const t=e.videos??[],r=it(e)==="markdown";return`
    <section class="panel stack video-panel">
      <div class="section-header">
        <div>
          <h3>Videos</h3>
          <p class="muted">Add YouTube videos and place them inside this markdown chapter.</p>
        </div>
        <span class="pill">${t.length} video(s)</span>
      </div>
      ${r?`<div class="inline-form video-form">
              <input id="video-label-input" placeholder="Optional label, for example Prophecy Scene" />
              <input id="video-url-input" placeholder="https://youtube.com/watch?v=...&t=20s" />
              <button class="ghost-button" data-action="add-video" data-chapter-id="${e.id}">Add video</button>
            </div>`:'<div class="notice">Video embeds are available in Markdown Mode only.</div>'}
      <div class="video-list">
        ${t.length?t.map(a=>`
                <article class="video-item">
                  <div>
                    <strong>${u(a.label?.trim()||"Untitled video")}</strong>
                    ${r?`<div class="muted mono">[video: ${u(a.id)}]</div>`:""}
                    <div class="muted mono">${u(a.url??"")}</div>
                  </div>
                  <div class="card-actions">
                    ${r?`<button class="small-button" data-action="copy-video-marker" data-video-id="${a.id}">Copy embed</button>`:""}
                    <button class="danger-button" data-action="delete-video" data-chapter-id="${e.id}" data-video-id="${a.id}">Remove</button>
                  </div>
                </article>
              `).join(""):'<div class="empty-state">No video links yet.</div>'}
      </div>
    </section>
  `}function Ja(e,t=!1){const r=k(),a=e.reactions??{},s=["🔥","😮","💀","❤️"],o=e.comments??[];return`
    <section class="panel stack engagement-panel">
      <div class="section-header">
        <div>
          <h3>Comments / Reactions</h3>
          <p class="muted">Leave table chatter without changing the chapter text.</p>
        </div>
      </div>
      <div class="reaction-row">
        ${s.map(i=>{const c=a[i]??[];return`<button class="ghost-button ${r?.id&&c.includes(r.id)?"is-active":""}" data-action="toggle-reaction" data-chapter-id="${e.id}" data-emoji="${i}" ${r?"":"disabled"}>${i} ${c.length}</button>`}).join("")}
      </div>
      <div class="comment-list">
        ${o.length?o.map(i=>`
          <article class="notice">
            <strong>${u(i.userName??"Reader")}</strong>
            <div class="muted">${wt(i.createdAt)}</div>
            <p>${u(i.body??"")}</p>
          </article>
        `).join(""):'<div class="empty-state">No comments yet.</div>'}
      </div>
      ${r?`
        <div class="inline-form">
          <input id="chapter-comment-input" placeholder="Write a comment..." />
          <button class="ghost-button" data-action="add-comment" data-chapter-id="${e.id}">Add comment</button>
        </div>
      `:'<div class="muted">Sign in to react or comment.</div>'}
    </section>
  `}function Za(e){if(!e.length)return"";const t=O(),r=Y(n.soundtrack.volume);return`
    <div class="quick-tool-stack">
      <button
        class="quick-tool-button ${t&&!n.soundtrack.paused?"is-active":""}"
        data-action="toggle-soundtrack"
        aria-pressed="${String(!!t&&!n.soundtrack.paused)}"
        title="${u(t?`${n.soundtrack.paused?"Resume":"Pause"} ${t.label}`:"No soundtrack available")}"
      >
        <span class="quick-tool-icon">♪</span>
      </button>
      <button
        class="quick-tool-button volume-button ${n.soundtrack.volumeOpen?"is-open":""}"
        data-action="toggle-volume-popout"
        data-wheel-volume="true"
        style="--volume-fill: ${r}%;"
        title="${u(t?`Volume ${r}%`:"No soundtrack available")}"
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
          value="${r}"
          data-action="set-volume"
        />
        <div id="soundtrack-volume-value" class="quick-tool-status">${r}%</div>
      </div>
      <div class="quick-tool-caption">Music</div>
      <div id="soundtrack-status" class="quick-tool-status">${u(t?`${n.soundtrack.paused?"Paused":"Now playing"}: ${t.label}`:"No soundtrack loaded.")}</div>
    </div>
  `}async function Qa(e,t){const[r,a]=await Promise.all([n.adapter.getStory(e),n.adapter.getArc(t)]);if(!r||!a)return J("Arc not found.");const s=Nt(r),o=K().get("view")==="browser",i=ce();if(!Vt(r))return J("This story is private.");const c=(a.phases??[]).map(d=>{const l=(d.chapters??[]).filter(p=>Dt(p,s));return o&&!l.length?"":`
      <section class="phase-block stack">
        ${Ya(d,s,o,a.id)}
        <div class="nested-list ${i==="list"?"is-list-view":""}">
          ${l.length?l.map((p,f)=>Xa(p,r,a,s,f,o,d)).join(""):'<div class="empty-state">No chapters in this phase yet.</div>'}
        </div>
      </section>
    `}).join("");if(rt(`
      <div class="stack">
        ${zt([[o?"#/browser":s?"#/creator":"#/browser",o?"Browser":s?"Creator":"Browser"],["#/stories/"+r.id+(o?"?view=browser":""),r.title],["",a.title]])}
        <div class="page-title">
          <div>
            <h2>${u(a.title)}</h2>
            <p class="muted">Manage the chapter list and reading order for this arc.</p>
          </div>
          <div class="card-actions">
            <div class="view-toggle" role="group" aria-label="Structure view">
              <button class="ghost-button ${i==="grid"?"is-active":""}" data-action="set-structure-view" data-view="grid">Compact Grid</button>
              <button class="ghost-button ${i==="list"?"is-active":""}" data-action="set-structure-view" data-view="list">List</button>
            </div>
            ${o&&s?'<a class="ghost-button" href="#/stories/'+r.id+"/arcs/"+a.id+'">Edit</a>':""}
            ${s&&!o?'<button class="ghost-button" data-action="create-phase" data-arc-id="'+a.id+'">New phase</button>':""}
            ${s&&!o?'<button class="primary-button" data-action="create-chapter" data-arc-id="'+a.id+'" data-story-id="'+r.id+'">New chapter</button>':""}
          </div>
        </div>
        ${s&&!o?`
          <section class="panel">
            <div class="inline-form">
              <input id="arc-title-input" value="${u(a.title)}" />
              <button class="ghost-button" data-action="save-arc-title" data-arc-id="${a.id}" data-story-id="${r.id}">Rename arc</button>
            </div>
        </section>`:""}
        ${c||'<div class="empty-state">No chapters yet. Add one to begin writing.</div>'}
      </div>
    `,o?"browser":s?"creator":"browser"),s&&!o){const d=document.querySelector("#story-transfer-button");d&&d.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),showStoryTransferModal(r.id)})}}function Xa(e,t,r,a,s,o=!1,i=null){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${u(e.title||"Untitled chapter")}</h3>
          <p class="muted">Updated ${wt(e.updatedAt)}${nt(e)?"":" · Draft"}</p>
        </div>
        ${a&&!o?`
          <div class="order-buttons">
            <button class="small-button" data-action="move-chapter-up" data-arc-id="${r.id}" data-phase-id="${i?.id??""}" data-index="${s}" ${s===0?"disabled":""}>↑</button>
            <button class="small-button" data-action="move-chapter-down" data-arc-id="${r.id}" data-phase-id="${i?.id??""}" data-index="${s}" ${i&&s===i.chapters.length-1?"disabled":""}>↓</button>
          </div>`:""}
      </div>
      ${a&&!o?`<select class="phase-select" data-action="move-chapter-phase" data-arc-id="${r.id}" data-chapter-id="${e.id}">
              ${(r.phases??[]).map(c=>`<option value="${c.id}" ${c.id===i?.id?"selected":""}>${u(c.title)}</option>`).join("")}
            </select>`:""}
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${t.id}/arcs/${r.id}/chapters/${e.id}${o?"?view=browser":""}">Open chapter</a>
        ${a&&!o?`<button class="small-button" title="Move chapter" data-action="open-transfer-chapter" data-story-id="${t.id}" data-arc-id="${r.id}" data-phase-id="${i?.id??""}" data-chapter-id="${e.id}">↗</button>`:""}
        ${a&&!o?`<button class="danger-button" data-action="delete-chapter" data-story-id="${t.id}" data-arc-id="${r.id}" data-chapter-id="${e.id}">Delete</button>`:""}
      </div>
    </article>
  `}function te(e,t,r,a,s=!1){return!r&&!a?"":`
    <div class="chapter-pager">
      ${r?`<a class="ghost-button" href="#/stories/${e}/arcs/${t}/chapters/${r.id}${s?"?view=browser":""}">Previous Chapter</a>`:""}
      ${a?`<a class="ghost-button" href="#/stories/${e}/arcs/${t}/chapters/${a.id}${s?"?view=browser":""}">Next Chapter</a>`:""}
    </div>
  `}async function tr(e,t,r){const[a,s,o]=await Promise.all([n.adapter.getStory(e),n.adapter.getArc(t),n.adapter.getChapter(r)]);if(!a||!s||!o)return J("Chapter not found.");const i=Nt(a),c=K().get("view")==="browser";if(!Vt(a))return J("This story is private.");if(!Dt(o,i))return J("This chapter is still a draft.");const d=o.assets??[],l=it(o),p=Ie(o),f=c?fe(o.soundtracks??[]):[],w=(s.chapters??[]).filter(A=>Dt(A,i)),v=w.findIndex(A=>A.id===r),T=v>0?w[v-1]:null,E=v>=0&&v<w.length-1?w[v+1]:null,D=te(a.id,s.id,T,E,c),C=te(a.id,s.id,T,E,c),P=i&&!c?`
        <div class="editor-shell">
          <section class="editor-pane">
            <div class="editor-controls">
              <div class="editor-import-bar">
                <div class="card-actions">
                  <button class="ghost-button" type="button" data-action="open-docx-import">Import .docx</button>
                  ${l==="html"?'<button class="ghost-button" type="button" data-action="switch-markdown-mode">Markdown Mode</button>':""}
                </div>
                <span class="muted">${l==="html"?"HTML mode: Word content is locked. Switch to Markdown Mode to clear it and write normally.":"Markdown mode: import a Word file to switch this chapter to locked HTML mode."}</span>
                ${l==="html"?`
                  <label class="html-background-control">
                    <span>Background</span>
                    <input id="chapter-html-background-input" type="color" value="${u(p||"#120f0d")}" data-action="set-html-background" />
                    <button class="small-button" type="button" data-action="clear-html-background" title="Use site background">×</button>
                  </label>
                `:""}
                <input id="chapter-render-mode-input" type="hidden" value="${l}" />
                <input id="docx-import-input" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden />
              </div>
              <input id="chapter-title-input" value="${u(o.title)}" ${i?"":"disabled"} />
              <div class="inline-form">
                <label class="toggle-row">
                  <input id="chapter-published-input" type="checkbox" ${nt(o)?"checked":""} />
                  <span>Published for readers</span>
                </label>
                <span class="pill">${nt(o)?"Published":"Draft"}</span>
              </div>
              <textarea id="chapter-body-input" class="markdown-area" ${i&&l!=="html"?"":"disabled"}>${u(o.body)}</textarea>
              <section class="panel stack dm-notes-panel">
                <div class="section-header">
                  <div>
                    <h3>Chapter / DM Notes</h3>
                    <p class="muted">Private notes for authors and editors. Readers never see this.</p>
                  </div>
                </div>
                <textarea id="chapter-dm-notes-input" class="markdown-area notes-area" placeholder="Secret prep, reminders, NPC motives...">${u(o.dmNotes??"")}</textarea>
              </section>
              ${C}
              ${Ea(o)}
              ${i?`
                <div class="panel asset-helper">
                  <div class="section-header">
                    <h3>Image link helper</h3>
                    <span class="pill">Manual Imgur, Pixhost, or external URLs</span>
                  </div>
                  <div class="inline-form asset-form">
                    <input id="asset-name-input" placeholder="Image label, for example cover-art" />
                    <input id="asset-url-input" placeholder="https://i.imgur.com/your-image.jpg or https://pixhost.to/show/..." />
                    <button class="ghost-button" data-action="add-external-asset" data-chapter-id="${o.id}">Add image</button>
                  </div>
                  <div class="notice">
                    Upload the image to Imgur or Pixhost first. You can paste a direct image URL, Pixhost Forum small image code, Pixhost HTML small image code, or a Pixhost show page when the browser allows it.
                  </div>
                  <div class="asset-list asset-tray">
                    ${d.length?d.map((A,x)=>ee(A,x,{chapterId:o.id,editable:!0})).join(""):'<div class="empty-state">No assets in this chapter yet.</div>'}
                  </div>
                </div>
              `:""}
              ${Ka(o)}
              ${Ga(o)}
              <div class="notice mono">${u(n.saveStatus||"Tip: use `![alt](image-url)` to place pasted external images into the chapter body.")}</div>
            </div>
          </section>
          <section class="preview-pane">
            <h3>Preview</h3>
            ${Ia(o)}
            <div class="markdown-preview" data-preview-mode="${l}">${xt(o,"*Start writing to preview your chapter here.*")}</div>
          </section>
        </div>
      `:`
        <section class="panel stack">
          <div class="section-header">
            <h3>Reading view</h3>
            <span class="pill">${d.length} asset(s)</span>
          </div>
          <div class="markdown-preview" data-preview-mode="${l}">${xt(o,"*This chapter is empty.*",{showMusicCues:c})}</div>
        </section>
        ${C}
        ${d.length?`<section class="panel stack"><h3>Referenced images</h3><div class="asset-list">${d.map((A,x)=>ee(A,x)).join("")}</div></section>`:""}
        ${Ja(o,i)}
      `;rt(`
      <div class="stack">
        ${zt([[c?"#/browser":i?"#/creator":"#/browser",c?"Browser":i?"Creator":"Browser"],["#/stories/"+a.id+(c?"?view=browser":""),a.title],["#/stories/"+a.id+"/arcs/"+s.id+(c?"?view=browser":""),s.title],["",o.title||"Untitled chapter"]])}
        <div class="page-title">
          <div>
            <h2>${u(o.title||"Untitled chapter")}</h2>
            <p class="muted">${i&&!c?"Write in markdown, add image links, and save your draft.":"Read this chapter in a clean, read-only view."}</p>
          </div>
          <div class="card-actions">
            ${c&&i?`<a class="ghost-button" href="#/stories/${a.id}/arcs/${s.id}/chapters/${o.id}">Edit</a>`:""}
            ${i&&!c?`<a class="ghost-button" href="#/stories/${a.id}/arcs/${s.id}/chapters/${o.id}?view=browser">Full Preview</a>`:""}
            ${i&&!c?`<button class="primary-button" data-action="save-chapter" data-chapter-id="${o.id}">Save</button>`:""}
          </div>
        </div>
        ${D}
        ${P}
      </div>
    `,c?"browser":i?"creator":"browser",Za(f)),c&&f.length?ga(o.id,f,{waitForCue:ca(o)}):Q()}function ee(e,t=0,r={}){const a=e.url??e.dataUrl??"",s=a?Ht(a):"",o=!!a,i=`![${e.name}](${s})`;return`
    <article class="asset-item">
      ${r.editable?`
        <div class="asset-actions">
          <button class="small-button asset-action-button" type="button" title="Copy markdown" data-action="copy-asset-markdown" data-markdown="${u(i)}">⧉</button>
          <button class="small-button asset-action-button danger-icon" type="button" title="Remove image" data-action="delete-asset" data-chapter-id="${r.chapterId}" data-asset-index="${t}">🗑</button>
        </div>
      `:`
        <div class="asset-actions">
          <button class="small-button asset-action-button" type="button" title="Copy markdown" data-action="copy-asset-markdown" data-markdown="${u(i)}">⧉</button>
        </div>
      `}
      ${o?`<img src="${u(s)}" alt="${u(e.name)}" />`:""}
      <strong title="${u(e.name)}">${u(e.name)}</strong>
      <div class="muted mono asset-markdown" title="${u(i)}">${u(i)}</div>
    </article>
  `}function J(e){rt(`
      <div class="stack">
        <section class="panel">
          <h2>Not found</h2>
          <p class="muted">${u(e)}</p>
        </section>
      </div>
    `,"home")}function zt(e){return`<div class="breadcrumbs">${e.map(([t,r])=>t?`<a href="${t}">${u(r)}</a>`:`<span>${u(r)}</span>`).join("<span>/</span>")}</div>`}async function h(){switch(ra(),n.loadError="",n.route=sa(),n.route.name){case"home":return Q(),Fa();case"creator":return Q(),ja();case"browser":return Q(),za();case"settings":return Q(),_a();case"story":return Q(),Ha(n.route.params.storyId);case"arc":return Q(),Qa(n.route.params.storyId,n.route.params.arcId);case"chapter":return tr(n.route.params.storyId,n.route.params.arcId,n.route.params.chapterId);default:return Q(),J("This page does not exist.")}}async function gt(){try{await h()}catch(e){console.error("Render failed:",e),n.loadError=String(e?.message||e||"The page could not be rendered."),Pt.innerHTML=`
      <main class="content">
        <section class="panel stack">
          <h2>Page failed to load</h2>
          <p class="muted">${u(n.loadError)}</p>
          <div class="card-actions">
            <a class="ghost-button" href="#/">Main Menu</a>
            <a class="ghost-button" href="#/creator">Creator</a>
          </div>
        </section>
      </main>
    `}}function er(){return{title:document.querySelector("#story-title-input")?.value.trim()??"",tags:(document.querySelector("#story-tags-input")?.value??"").split(",").map(e=>e.trim()).filter(Boolean),visibility:document.querySelector("#story-visibility-input")?.value??"private"}}function ae(e,t,r){const a=[...e],[s]=a.splice(t,1);return a.splice(r,0,s),a}async function ar({chapterId:e,currentStoryId:t,currentArcId:r,currentPhaseId:a}){const s=k();if(!s?.id)return n.saveStatus="Sign in first to move chapters between your stories.",h();const o=await n.adapter.listCreatorStories(s.id);if(!o.length)return n.saveStatus="You need at least one story before moving chapters.",h();const c=(await Promise.all(o.map(b=>n.adapter.getStory(b.id)))).filter(Boolean).filter(b=>(b.arcs??[]).length>0);if(!c.length)return n.saveStatus="Create an arc first, then you can move chapters into it.",h();const d=document.createElement("div");d.className="modal-backdrop",d.innerHTML=`
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
  `,document.body.append(d);const l=d.querySelector("#transfer-story-select"),p=d.querySelector("#transfer-arc-select"),f=d.querySelector("#transfer-phase-select"),w=d.querySelector("#transfer-summary"),v=d.querySelector("#transfer-confirm"),T=()=>d.remove();function E(){return c.find(b=>b.id===l.value)??c[0]}function D(){return E()?.arcs.find(b=>b.id===p.value)??E()?.arcs?.[0]??null}function C(){return D()?.phases.find(b=>b.id===f.value)??D()?.phases?.[0]??null}function P(){const b=E(),L=D(),Lt=C(),Wt=b?.id===t&&L?.id===r&&Lt?.id===a;w.innerHTML=Wt?"This chapter is already in that exact phase.":`Destination: <strong>${u(b?.title??"-")}</strong> / <strong>${u(L?.title??"-")}</strong> / <strong>${u(Lt?.title??"-")}</strong>`,v.disabled=!b||!L||!Lt||Wt}function A(){const b=D();f.innerHTML=(b?.phases??[]).map(L=>`<option value="${L.id}" ${L.id===a&&b.id===r?"selected":""}>${u(L.title)}</option>`).join(""),P()}function x(){const b=E();p.innerHTML=(b?.arcs??[]).map(L=>`<option value="${L.id}" ${L.id===r&&b.id===t?"selected":""}>${u(L.title)}</option>`).join(""),A()}l.innerHTML=c.map(b=>`<option value="${b.id}" ${b.id===t?"selected":""}>${u(b.title)}</option>`).join(""),l.addEventListener("change",x),p.addEventListener("change",A),f.addEventListener("change",P),d.querySelector("#transfer-cancel").addEventListener("click",T),v.addEventListener("click",async()=>{const b=C(),L=D();if(!(!b||!L))return await n.adapter.transferChapter(e,L.id,b.id),T(),n.saveStatus="Chapter moved to a new story location.",h()}),x()}async function re(){if(n.currentUser)return await n.authClient.signOut(),V(null),n.saveStatus="Signed out.",n.authError="",h();if(n.authClient.mode==="firebase")try{const t=await n.authClient.signIn();return t?(V({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email,mode:"firebase",structureView:"list"}),n.authError="",n.saveStatus="Signed in with Firebase.",h()):(n.authError="",n.saveStatus="Continuing sign-in with Google redirect...",h())}catch(t){return console.error("Firebase sign-in failed:",t),n.saveStatus="",n.authError=xe(t),h()}const e=document.createElement("div");e.className="modal-backdrop",e.innerHTML=`
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
  `,document.body.append(e),e.querySelector("#modal-login-cancel").addEventListener("click",()=>e.remove()),e.querySelector("#modal-login-submit").addEventListener("click",()=>{const t=e.querySelector("#login-name").value.trim()||"Creator",r=e.querySelector("#login-email").value.trim()||"local@storyforge.local";V({id:`local-${t.toLowerCase().replaceAll(/\s+/g,"-")}`,name:t,email:r,mode:"local",structureView:"list"}),e.remove(),n.saveStatus="Signed in with a local demo profile.",n.authError="",h()})}function xe(e){const t=e?.code?String(e.code):"",r=e?.message?String(e.message):"Unknown sign-in error.";return t==="auth/unauthorized-domain"?"This site domain is not authorized in Firebase Auth. Add your local/dev domain and your GitHub Pages domain in Firebase Console > Authentication > Settings > Authorized domains.":t==="auth/popup-closed-by-user"?"The sign-in popup closed before Firebase completed the login. If it closes instantly every time, double-check Authorized domains and the Google sign-in provider setup.":t==="auth/operation-not-allowed"?"Google sign-in is not enabled for this Firebase project. Enable it in Firebase Console > Authentication > Sign-in method.":t==="auth/invalid-api-key"?"Your Firebase API key is invalid. Recheck the values in your `.env` file and restart the dev server.":t==="auth/network-request-failed"?"Firebase could not complete the sign-in request. Check your connection and any browser privacy extensions blocking popups or auth requests.":t==="auth/invalid-credential"||t==="auth/internal-error"?"Google returned an invalid popup credential. Try again; the app will fall back to a full-page Google redirect if the popup flow is blocked.":t?`${t}: ${r}`:r}async function rr(e){const t=n.route.params.chapterId,r=await n.adapter.getChapter(t);if(!r)return;const a=[...r.assets??[]];for(const i of e){const c=await fr(i);a.push({id:crypto.randomUUID(),name:i.name,type:i.type,size:i.size,dataUrl:c})}const s=document.querySelector("#chapter-body-input"),o=a.slice((r.assets??[]).length).map(i=>`
![${i.name}](${i.dataUrl})`).join("");await n.adapter.updateChapter(t,{assets:a,body:`${s.value}${o}`}),n.dragActive=!1,n.saveStatus="Assets added to the chapter. In production these should upload to object storage instead of local state.",await h()}function sr(e){return e==="imgur.com"||e==="www.imgur.com"||e==="i.imgur.com"}function Ne(e){const t=e.replace(/^www\./i,"").toLowerCase();return t==="pixhost.to"||t==="pixhost.cc"||t==="pixho.st"||t.endsWith(".pixho.st")}function nr(e){return Ne(e.hostname)&&/^\/show\/\d+\/\d+_[^/]+$/i.test(e.pathname)}function Le(e){const t=e.pathname.split("/").filter(Boolean).pop()??"";return/\.(avif|gif|jpe?g|png|webp)$/i.test(t)}function qe(e){const r=e.hostname.replace(/^www\./i,"").toLowerCase().match(/^t(\d+)\.pixhost\.(?:to|cc)$/i);if(!r)return"";const a=e.pathname.match(/^\/thumbs\/(\d+)\/(\d+)_(.+)$/i);if(!a)return"";const[,s,o,i]=a;return`${e.protocol}//img${r[1]}.pixhost.to/images/${s}/${o}_${i}${e.search}`}function Ht(e){try{const t=new URL(String(e??""),window.location.href);return qe(t)||t.toString()}catch{return String(e??"")}}function or(e){const t=String(e??"").trim(),r=[/\bsrc=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i,/\[img\]([^\[]+)\[\/img\]/i,/!\[[^\]]*\]\(([^)]+)\)/i];for(const s of r){const o=t.match(s),i=o?.[1]??o?.[2]??o?.[3]??"";if(i)return i.trim()}return(t.match(/https?:\/\/[^\s"'<>[\]()]+/gi)??[]).find(s=>{try{return Le(new URL(s))}catch{return!1}})??t}function ir(e,t){const r=["img.image-img","img#image",".image-img",".image-show img","#show_image img",'meta[property="og:image"]','meta[name="twitter:image"]','img[src*="pixhost"]','img[src*="pixho.st"]'];for(const a of r){const s=e.querySelector(a),o=s?.getAttribute("src")??s?.getAttribute("content");if(!(!o||o.startsWith("data:")))try{const i=new URL(o,t);if(Le(i)||Ne(i.hostname))return i.toString()}catch{}}return""}async function cr(e){let t;try{t=await fetch(e.toString(),{credentials:"include"})}catch{throw new Error("Pixhost page could not be opened by the browser. Paste Pixhost's Forum small image, HTML small image, or direct image link instead.")}if(!t.ok)throw new Error("Pixhost page could not be opened. Paste Pixhost's Forum small image, HTML small image, or direct image link instead.");const r=await t.text(),a=new DOMParser().parseFromString(r,"text/html"),s=ir(a,e.toString());if(!s)throw new Error("Pixhost page could not be converted to a direct image. Paste Pixhost's Forum small image, HTML small image, or direct image link instead.");return s}async function Me(e){const t=or(e);if(!t)throw new Error("Add an image URL first.");let r;try{r=new URL(t)}catch{throw new Error("That image URL is not valid.")}if(!["http:","https:"].includes(r.protocol))throw new Error("Use an http or https image URL.");const a=r.pathname.split("/").filter(Boolean).pop()??"",s=/\.[a-z0-9]{2,5}$/i.test(a);sr(r.hostname)&&a&&!s&&(r.pathname=`${r.pathname}.png`);const o=qe(r);return o||(nr(r)?cr(r):r.toString())}async function dr(e){const t=await n.adapter.getChapter(e);if(!t)throw new Error("Chapter not found.");const r=document.querySelector("#asset-name-input"),a=document.querySelector("#asset-url-input"),s=document.querySelector("#chapter-title-input"),o=document.querySelector("#chapter-body-input"),i=r?.value.trim()||"image",c=await Me(a?.value??""),d={id:crypto.randomUUID(),name:i,type:"image/external",url:c},l=[...t.assets??[],d];await n.adapter.updateChapter(e,{title:s?.value.trim()||t.title||"Untitled Chapter",body:o?.value??t.body??"",assets:l}),r&&(r.value=""),a&&(a.value=""),n.saveStatus="External image link added to the chapter assets.",await h()}function lr(e,t,r,a){return`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${u(a.title||"Untitled Chapter")}</title>
  <style>
    body { margin: 0; padding: 48px; background: #120f0d; color: #eadfc8; font-family: Georgia, serif; line-height: 1.85; }
    main { max-width: 900px; margin: 0 auto; }
    h1, h2, h3 { color: #d3a24d; }
    img { max-width: 100%; border-radius: 12px; }
    .meta { color: #b8a88e; margin-bottom: 28px; }
    .draft { display: inline-block; padding: 4px 9px; border: 1px solid #8f6230; border-radius: 999px; color: #e2bd7a; }
  </style>
</head>
<body>
  <main>
    <div class="meta">${u(e.title)} / ${u(t.title)} / ${u(r.title)} ${nt(a)?"":'<span class="draft">Draft</span>'}</div>
    <h1>${u(a.title||"Untitled Chapter")}</h1>
    ${xt(a,"")}
  </main>
</body>
</html>`}async function ur(e){const t=await n.adapter.getStory(e);if(!t)throw new Error("Story not found.");const{default:r}=await ne(async()=>{const{default:i}=await import("./jszip.min-D7KnG0-e.js").then(c=>c.j);return{default:i}},[]),a=new r,s=a.folder(ut(t.title,"Story"));t.arcs.forEach((i,c)=>{const d=s.folder(`${String(c+1).padStart(2,"0")} - ${ut(i.title,"Arc")}`);(i.phases??[]).forEach((l,p)=>{const f=d.folder(`${String(p+1).padStart(2,"0")} - ${ut(l.title,"Phase")}`);(l.chapters??[]).forEach((w,v)=>{const T=`${String(v+1).padStart(2,"0")} - ${ut(w.title,"Chapter")}.html`;f.file(T,lr(t,i,l,w))})})});const o=await a.generateAsync({type:"blob"});Ra(o,`${ut(t.title,"story-export")}.zip`)}async function Ot(e){if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(e);return}const t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.append(t),t.select(),document.execCommand("copy"),t.remove()}async function pr(e,t){const r=await n.adapter.getChapter(e);if(!r)throw new Error("Chapter not found.");const a=[...r.assets??[]];if(t<0||t>=a.length)throw new Error("Image could not be found.");a.splice(t,1);const s=document.querySelector("#chapter-title-input"),o=document.querySelector("#chapter-body-input");await n.adapter.updateChapter(e,{title:s?.value.trim()||r.title||"Untitled Chapter",body:o?.value??r.body??"",assets:a}),n.saveStatus="Image removed from chapter assets.",await h()}function mr(e,t,r){const a=`<img src="${u(r)}" alt="word-image-${t}" />`,s=String(e??""),o=new RegExp(`<div\\b(?=[^>]*data-word-image-placeholder=["']${t}["'])[^>]*>[\\s\\S]*?<\\/div>`,"i");if(o.test(s))return s.replace(o,a);const i=new RegExp(`<[^>]+>[^<]*\\[IMAGE\\s+${t}\\s+HERE\\][\\s\\S]*?<\\/[^>]+>`,"i");return i.test(s)?s.replace(i,a):s.replace(new RegExp(`\\[IMAGE\\s+${t}\\s+HERE\\]`,"i"),a)}async function hr(e,t){const r=await n.adapter.getChapter(e);if(!r)throw new Error("Chapter not found.");const a=document.querySelector(`[data-word-image-url="${t}"]`),s=await Me(a?.value??""),o=mr(r.body??"",t,s);await n.adapter.updateChapter(e,{body:o,renderMode:"html",htmlBackground:ft().htmlBackground}),n.saveStatus=`IMAGE ${t} replaced.`,await h()}async function se(){const e=k();if(!e?.id)return;const t=await n.adapter.getUserProfile?.(e.id);t&&V({...e,name:t.name||e.name,email:t.email||e.email,penName:t.penName??"",structureView:t.structureView??e.structureView??"list",readerSettings:t.readerSettings??e.readerSettings??st(e)})}function kt(e){return window.confirm(`Are you sure you want to delete this ${e}? This cannot be undone.`)}function fr(e){return new Promise((t,r)=>{const a=new FileReader;a.onload=()=>t(String(a.result)),a.onerror=()=>r(a.error),a.readAsDataURL(e)})}document.addEventListener("click",async e=>{const t=e.target.closest("[data-action]");if(!t)return;const r=t.dataset.action;if(r==="toggle-image-view"){const a=t.closest(".chapter-image-frame");if(!a)return;const s=a.dataset.imageView==="desired"?"fill":"desired";Ce(a,s);return}if(r==="play-music-cue"){const a=t.dataset.musicTrigger;a&&be(a,{source:"button"});return}if(r==="toggle-login")return re();if(r==="open-settings")return q("/settings");if(r==="set-structure-view"){const a=k(),s=t.dataset.view==="list"?"list":"grid";if(!a?.id)return V({...a,structureView:s}),h();const o=await n.adapter.updateUserProfile(a.id,{name:a.name,email:a.email,penName:a.penName??"",structureView:s,readerSettings:a.readerSettings??st(a)});return V({...a,structureView:o.structureView??s,penName:o.penName??a.penName??"",name:o.name??a.name,email:o.email??a.email,readerSettings:o.readerSettings??a.readerSettings??st(a)}),h()}if(r==="apply-story-filters"){const a=document.querySelector("#story-search").value.trim(),s=document.querySelector("#story-tag-filter").value;return q(`/creator${a||s?`?${new URLSearchParams({q:a,tag:s}).toString()}`:""}`)}if(r==="apply-browser-filters"){const a=document.querySelector("#browser-creator-filter").value,s=document.querySelector("#browser-group-mode").value;return q(`/browser?${new URLSearchParams({creator:a,group:s}).toString()}`)}if(r==="create-story"){const a=k();if(!a)return n.saveStatus="Sign in first to create stories in Firebase mode.",re();const s=await n.adapter.createStory({creatorId:a.id,creatorName:Et(a),title:"Untitled Story",tags:["draft"],visibility:"private"});return q(`/stories/${s.id}`)}if(r==="save-story-settings"){const a=t.dataset.storyId,s=er();return await n.adapter.updateStory(a,s),n.saveStatus="Story details saved.",h()}if(r==="add-story-editor"){const a=window.prompt("Editor Gmail address");if(a===null)return;if(!a.trim())return n.saveStatus="Enter an editor email first.",h();const s=Ut(k()?.email),o=Ut(a);return s&&s===o?(n.saveStatus="You are already the author of this story.",h()):(await n.adapter.addStoryEditor(t.dataset.storyId,a),n.saveStatus=`Editor added: ${o}`,h())}if(r==="export-story"){try{n.saveStatus="Preparing story export...";const a=document.querySelector(".notice .muted");a&&(a.textContent=n.saveStatus),await ur(t.dataset.storyId),n.saveStatus="Story export downloaded."}catch(a){n.saveStatus=`Export failed: ${String(a.message||a)}`}return h()}if(r==="open-story-transfer"){const a=K();return a.set("transfer","1"),q(`/stories/${t.dataset.storyId}?${a.toString()}`)}if(r==="close-story-transfer"){const a=K();a.delete("transfer");const s=a.toString();return q(`/stories/${t.dataset.storyId}${s?`?${s}`:""}`)}if(r==="submit-story-transfer"){const a=k();if(!a?.email)return n.saveStatus="Sign in with an email address before transferring ownership.",h();const s=document.querySelector("#story-transfer-email-input")?.value.trim()??"",o=document.querySelector("#story-transfer-confirm-input")?.value.trim()??"";if(!s)return n.saveStatus="Enter the recipient Gmail address first.",h();if(s.toLowerCase()===String(a.email).trim().toLowerCase())return n.saveStatus="You cannot transfer a story to your own email.",h();if(o!=="TRANSFER")return n.saveStatus="Type TRANSFER exactly to confirm ownership transfer.",h();await n.adapter.requestStoryTransfer(t.dataset.storyId,s,{id:a.id,name:Et(a),email:a.email}),n.saveStatus="Ownership transfer request sent. The story stays with you until the recipient accepts.";const i=K();i.delete("transfer");const c=i.toString();return q(`/stories/${t.dataset.storyId}${c?`?${c}`:""}`)}if(r==="cancel-story-transfer")return await n.adapter.cancelStoryTransfer(t.dataset.storyId),n.saveStatus="Ownership transfer cancelled.",h();if(r==="accept-story-transfer"){const a=k();try{return await n.adapter.acceptStoryTransfer(t.dataset.storyId,{id:a.id,name:a.name,email:a.email,penName:a.penName??""}),n.saveStatus="Story ownership transferred to you.",q("/creator")}catch(s){return n.saveStatus=`Transfer accept failed: ${String(s?.message||s)}`,h()}}if(r==="decline-story-transfer"){const a=k();try{return await n.adapter.declineStoryTransfer(t.dataset.storyId,a.email),n.saveStatus="Ownership transfer declined.",h()}catch(s){return n.saveStatus=`Transfer decline failed: ${String(s?.message||s)}`,h()}}if(r==="create-arc"){const a=t.dataset.storyId,s=await n.adapter.createArc(a,`Arc ${Math.floor(Math.random()*90+10)}`);return q(`/stories/${a}/arcs/${s.id}`)}if(r==="save-arc-title")return await n.adapter.updateArc(t.dataset.arcId,{title:document.querySelector("#arc-title-input").value.trim()||"Untitled Arc"}),n.saveStatus="Arc title saved.",h();if(r==="add-soundtrack"){const a=await n.adapter.getChapter(t.dataset.chapterId),s=document.querySelector("#soundtrack-label-input")?.value.trim()??"",o=document.querySelector("#soundtrack-url-input")?.value.trim()??"",i=me({id:mt("soundtrack"),label:s,url:o});if(!i)return n.saveStatus="Please enter a valid YouTube link.",h();const c=ft();return await n.adapter.updateChapter(a.id,{title:document.querySelector("#chapter-title-input")?.value.trim()||a.title||"Untitled Chapter",body:c.body,published:document.querySelector("#chapter-published-input")?.checked??nt(a),dmNotes:document.querySelector("#chapter-dm-notes-input")?.value??a.dmNotes??"",renderMode:c.renderMode,htmlBackground:c.htmlBackground,soundtracks:[...a.soundtracks??[],{id:i.id,label:i.label,url:i.url}]}),n.saveStatus="Soundtrack added.",h()}if(r==="copy-soundtrack-marker"){const a=`[music: ${t.dataset.soundtrackId}]`;try{await Ot(a),n.saveStatus=`Copied music cue: ${a}`}catch{n.saveStatus=`Copy failed. Use this cue manually: ${a}`}const s=document.querySelector(".notice.mono");s&&(s.textContent=n.saveStatus);return}if(r==="delete-soundtrack"){const a=await n.adapter.getChapter(t.dataset.chapterId);return await n.adapter.updateChapter(a.id,{soundtracks:(a.soundtracks??[]).filter(s=>s.id!==t.dataset.soundtrackId)}),n.saveStatus="Soundtrack removed.",h()}if(r==="add-video"){const a=await n.adapter.getChapter(t.dataset.chapterId),s=document.querySelector("#video-label-input")?.value.trim()??"",o=document.querySelector("#video-url-input")?.value.trim()??"",i=he({id:mt("video"),label:s,url:o});if(!i)return n.saveStatus="Please enter a valid YouTube video link.",h();const c=ft();return await n.adapter.updateChapter(a.id,{title:document.querySelector("#chapter-title-input")?.value.trim()||a.title||"Untitled Chapter",body:c.body,published:document.querySelector("#chapter-published-input")?.checked??nt(a),dmNotes:document.querySelector("#chapter-dm-notes-input")?.value??a.dmNotes??"",renderMode:c.renderMode,htmlBackground:c.htmlBackground,videos:[...a.videos??[],{id:i.id,label:i.label,url:i.url}]}),n.saveStatus="Video added. Copy its embed marker into the chapter.",h()}if(r==="copy-video-marker"){const a=`[video: ${t.dataset.videoId}]`;try{await Ot(a),n.saveStatus=`Copied video embed: ${a}`}catch{n.saveStatus=`Copy failed. Use this marker manually: ${a}`}const s=document.querySelector(".notice.mono");s&&(s.textContent=n.saveStatus);return}if(r==="delete-video"){const a=await n.adapter.getChapter(t.dataset.chapterId);return await n.adapter.updateChapter(a.id,{videos:(a.videos??[]).filter(s=>s.id!==t.dataset.videoId)}),n.saveStatus="Video removed.",h()}if(r==="move-arc-up"||r==="move-arc-down"){const a=await n.adapter.getStory(t.dataset.storyId),s=Number(t.dataset.index),o=r==="move-arc-up"?-1:1;return await n.adapter.reorderArcs(a.id,ae(a.arcIds,s,s+o)),h()}if(r==="create-chapter"){const a=await n.adapter.createChapter(t.dataset.arcId,"Untitled Chapter");return q(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}/chapters/${a.id}`)}if(r==="create-phase"){const a=window.prompt("Phase title","New Phase");return a===null?void 0:(await n.adapter.createPhase(t.dataset.arcId,a),n.saveStatus="Phase created.",h())}if(r==="rename-phase"){const a=window.prompt("Rename phase",t.dataset.phaseTitle||"Phase");if(a===null)return;const s=await n.adapter.getArc(t.dataset.arcId);return await n.adapter.renamePhase(t.dataset.arcId,t.dataset.phaseId,a),a.trim()?n.saveStatus="Phase renamed.":n.saveStatus=(s?.phases?.length??0)<=1?"Only phase restored to Chapters.":"Phase deleted. Its chapters were moved into the next phase.",h()}if(r==="open-transfer-chapter")return ar({chapterId:t.dataset.chapterId,currentStoryId:t.dataset.storyId,currentArcId:t.dataset.arcId,currentPhaseId:t.dataset.phaseId});if(r==="move-chapter-up"||r==="move-chapter-down"){const a=await n.adapter.getArc(t.dataset.arcId),s=(a.phases??[]).find(c=>c.id===t.dataset.phaseId);if(!s)return;const o=Number(t.dataset.index),i=r==="move-chapter-up"?-1:1;return await n.adapter.reorderPhaseChapters(a.id,s.id,ae(s.chapterIds,o,o+i)),h()}if(r==="save-chapter"){const a=t.dataset.chapterId,s=ft();return await n.adapter.updateChapter(a,{title:document.querySelector("#chapter-title-input").value.trim()||"Untitled Chapter",body:s.body,published:document.querySelector("#chapter-published-input")?.checked??!1,dmNotes:document.querySelector("#chapter-dm-notes-input")?.value??"",renderMode:s.renderMode,htmlBackground:s.htmlBackground}),n.saveStatus="Chapter saved.",h()}if(r==="open-docx-import"){document.querySelector("#docx-import-input")?.click();return}if(r==="switch-markdown-mode")return window.confirm("Switch to Markdown Mode? This will clear the imported Word HTML from this chapter.")?(await n.adapter.updateChapter(n.route.params.chapterId,{body:"",renderMode:"markdown",htmlBackground:""}),n.saveStatus="Switched to Markdown Mode. Imported Word HTML was cleared.",h()):void 0;if(r==="clear-html-background"){const a=document.querySelector("#chapter-html-background-input");a&&(a.value="#120f0d");const s=document.querySelector("#chapter-render-mode-input");s&&(s.value="html"),Bt(),n.saveStatus="HTML background reset to the site background. Click Save to keep this.";const o=document.querySelector(".notice.mono");o&&(o.textContent=n.saveStatus);return}if(r==="save-pen-name"){const a=k(),s=document.querySelector("#pen-name-input").value.trim(),o=await n.adapter.updateUserProfile(a.id,{name:a.name,email:a.email,penName:s,structureView:a.structureView??"list",readerSettings:a.readerSettings??st(a)});return V({...a,penName:o.penName??"",name:o.name??a.name,email:o.email??a.email,structureView:o.structureView??a.structureView??"list",readerSettings:o.readerSettings??a.readerSettings??st(a)}),n.saveStatus=s?"Pen name saved.":"Pen name cleared. Account name will be used.",h()}if(r==="save-reader-settings"){const a=k(),s={fontSize:Number(document.querySelector("#reader-font-size-input")?.value)||17,lineHeight:Number(document.querySelector("#reader-line-height-input")?.value)||1.85,width:Number(document.querySelector("#reader-width-input")?.value)||920},o=await n.adapter.updateUserProfile(a.id,{name:a.name,email:a.email,penName:a.penName??"",structureView:a.structureView??"list",readerSettings:s});return V({...a,...o,readerSettings:s}),n.saveStatus="Reader settings saved.",h()}if(r==="add-comment"){const a=k(),o=document.querySelector("#chapter-comment-input")?.value.trim()??"";if(!a||!o)return n.saveStatus="Sign in and write a comment first.",h();const i=await n.adapter.getChapter(t.dataset.chapterId);return await(n.adapter.updateChapterEngagement??n.adapter.updateChapter)(i.id,{comments:[...i.comments??[],{id:mt("comment"),userId:a.id,userName:Et(a),body:o,createdAt:new Date().toISOString()}]}),n.saveStatus="Comment added.",h()}if(r==="toggle-reaction"){const a=k();if(!a)return n.saveStatus="Sign in to react.",h();const s=await n.adapter.getChapter(t.dataset.chapterId),o=t.dataset.emoji,i={...s.reactions??{}},c=new Set(i[o]??[]);return c.has(a.id)?c.delete(a.id):c.add(a.id),i[o]=[...c],await(n.adapter.updateChapterEngagement??n.adapter.updateChapter)(s.id,{reactions:i}),n.saveStatus="Reaction updated.",h()}if(r==="delete-story")return kt("story")?(await n.adapter.deleteStory(t.dataset.storyId),n.saveStatus="Story deleted.",q("/creator")):void 0;if(r==="delete-arc")return kt("arc")?(await n.adapter.deleteArc(t.dataset.arcId),n.saveStatus="Arc deleted.",q(`/stories/${t.dataset.storyId}`)):void 0;if(r==="delete-chapter")return kt("chapter")?(await n.adapter.deleteChapter(t.dataset.chapterId),n.saveStatus="Chapter deleted.",q(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}`)):void 0;if(r==="add-external-asset")try{return await dr(t.dataset.chapterId)}catch(a){return n.saveStatus=String(a.message||a),h()}if(r==="copy-asset-markdown"){try{await Ot(t.dataset.markdown??""),n.saveStatus="Image markdown copied to clipboard."}catch(s){n.saveStatus=`Copy failed: ${String(s.message||s)}`}const a=document.querySelector(".notice.mono");a&&(a.textContent=n.saveStatus);return}if(r==="delete-asset"){if(!kt("image"))return;try{return await pr(t.dataset.chapterId,Number(t.dataset.assetIndex))}catch(a){return n.saveStatus=String(a.message||a),h()}}if(r==="replace-word-image")try{return await hr(t.dataset.chapterId,Number(t.dataset.imageIndex))}catch(a){n.saveStatus=String(a.message||a);const s=document.querySelector(".notice.mono");s&&(s.textContent=n.saveStatus);return}if(r==="toggle-soundtrack"){if(!O())return;n.soundtrack.paused?we():ye();return}if(r==="toggle-volume-popout"){if(!O())return;n.soundtrack.volumeOpen=!n.soundtrack.volumeOpen,ot();return}});document.addEventListener("change",async e=>{const t=e.target;if(t instanceof HTMLInputElement&&t.id==="docx-import-input"){const r=t.files?.[0];if(t.value="",!r)return;n.saveStatus="Importing Word file...";const a=document.querySelector(".notice.mono");a&&(a.textContent=n.saveStatus);try{await Ma(r)}catch(s){n.saveStatus=`Word import failed: ${String(s.message||s)}`,a&&(a.textContent=n.saveStatus)}return}if(t instanceof HTMLSelectElement&&t.dataset.action==="move-chapter-phase")return await n.adapter.moveChapterToPhase(t.dataset.arcId,t.dataset.chapterId,t.value),n.saveStatus="Chapter moved to another phase.",h()});document.addEventListener("input",e=>{if(e.target instanceof HTMLInputElement&&(e.target.id==="reader-font-size-input"||e.target.id==="reader-line-height-input"||e.target.id==="reader-width-input")){const t=document.querySelector("#reader-settings-preview");if(t){const r=Number(document.querySelector("#reader-font-size-input")?.value)||17,a=Number(document.querySelector("#reader-line-height-input")?.value)||1.85,s=Number(document.querySelector("#reader-width-input")?.value)||920;t.style.setProperty("--reader-font-size",`${r}px`),t.style.setProperty("--reader-line-height",String(a)),t.style.setProperty("--reader-width",`${s}px`)}return}if(e.target instanceof HTMLInputElement&&e.target.dataset.action==="set-volume"){$e(e.target.value);return}if(e.target instanceof HTMLInputElement&&e.target.dataset.action==="set-html-background"){Bt();return}if(e.target.id==="chapter-body-input"&&Bt(),e.target.id==="chapter-title-input"){const t=e.target.value.trim()||"Untitled chapter",r=document.querySelector(".page-title h2");r&&(r.textContent=t)}});document.addEventListener("click",e=>{const t=e.target;t instanceof Element&&(t.closest(".quick-tool-stack")||n.soundtrack.volumeOpen&&(n.soundtrack.volumeOpen=!1,ot()))});document.addEventListener("wheel",e=>{const t=e.target;t instanceof Element&&t.closest("[data-wheel-volume='true']")&&O()&&(e.preventDefault(),ha(e.deltaY<0?5:-5))},{passive:!1});document.addEventListener("dragover",e=>{if(n.route.name!=="chapter")return;e.preventDefault(),n.dragActive=!0;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.add("is-active")});document.addEventListener("dragleave",e=>{if(n.route.name!=="chapter"||e.relatedTarget)return;n.dragActive=!1;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active")});document.addEventListener("drop",async e=>{if(n.route.name!=="chapter")return;e.preventDefault();const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active");const r=[...e.dataTransfer.files].filter(a=>a.type.startsWith("image/"));r.length&&await rr(r)});window.addEventListener("hashchange",()=>{n.saveStatus="",window.scrollTo({top:0,left:0,behavior:"auto"}),gt()});async function gr(){const e=ta();if(n.authClient=e,n.adapter=await Je(e),n.authClient.mode==="firebase"){let t=!1;try{const r=await n.authClient.getRedirectUser?.();r&&(t=!0,V({id:r.uid,name:r.displayName||r.email||"Creator",email:r.email,mode:"firebase"}),n.authError="",n.saveStatus="Signed in with Firebase.")}catch(r){console.error("Firebase redirect sign-in failed:",r),n.authError=xe(r)}n.authClient.watchAuth(r=>{if(r)t=!1,V({id:r.uid,name:r.displayName||r.email||"Creator",email:r.email,mode:"firebase"}),se().finally(()=>gt());else{if(t&&n.currentUser?.id)return;V(null),gt()}})}else n.currentUser?.id&&await se();window.location.hash?gt():q("/")}gr().catch(e=>{Pt.innerHTML=`
    <main class="content">
      <section class="panel">
        <h2>App failed to start</h2>
        <p class="muted">${u(String(e.message||e))}</p>
        <p class="muted">Current mode: ${u(ea().mode)}</p>
      </section>
    </main>
  `});
