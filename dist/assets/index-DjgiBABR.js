import{d as rt,a as m,g as b,u as g,s as it,b as J,q as K,w as j,c as Q,e as de,f as le,i as ue,h as pe,j as me,G as he,o as fe,k as ge,l as ye}from"./firebase-D1mdRFF2.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();const ve="modulepreload",we=function(e){return"/ulunavir-tales/"+e},Rt={},Se=function(t,a,r){let s=Promise.resolve();if(a&&a.length>0){let d=function(l){return Promise.all(l.map(u=>Promise.resolve(u).then(y=>({status:"fulfilled",value:y}),y=>({status:"rejected",reason:y}))))};document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),c=i?.nonce||i?.getAttribute("nonce");s=d(a.map(l=>{if(l=we(l),l in Rt)return;Rt[l]=!0;const u=l.endsWith(".css"),y=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${y}`))return;const f=document.createElement("link");if(f.rel=u?"stylesheet":ve,u||(f.as="script"),f.crossOrigin="",f.href=l,c&&f.setAttribute("nonce",c),document.head.appendChild(f),u)return new Promise((v,E)=>{f.addEventListener("load",v),f.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${l}`)))})}))}function n(i){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=i,window.dispatchEvent(c),!c.defaultPrevented)throw i}return s.then(i=>{for(const c of i||[])c.status==="rejected"&&n(c.reason);return t().catch(n)})},gt="storyforge-state-v1",It="story-demo",pt="arc-demo",mt="chapter-demo",ut="Chapters";function T(e){return String(e??"").trim().toLowerCase()}function vt(e,t){const a=T(t);return!a||e?.pendingTransferStatus!=="pending"?!1:[e.pendingTransferEmailLower,T(e.pendingTransfer?.targetEmail)].includes(a)}const ht={users:{"demo-user":{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",emailLower:"demo@storyforge.local",penName:""}},stories:{[It]:{id:It,title:"The Clockwork Harbor",tags:["fantasy","mystery","serial"],visibility:"public",creatorId:"demo-user",creatorName:"Demo Creator",editorEmails:[],pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",arcIds:[pt],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},arcs:{[pt]:{id:pt,storyId:It,title:"Tide One",chapterIds:[mt],soundtracks:[],phases:[{id:"phase-demo",title:ut,chapterIds:[mt]}],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},chapters:{[mt]:{id:mt,arcId:pt,title:"Lanterns on the Pier",body:`# Opening scene

A storm hangs over the harbor while the first lanterns come alive.`,renderMode:"markdown",htmlBackground:"",assets:[],soundtracks:[],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}}};function U(e){return`${e}-${crypto.randomUUID().slice(0,8)}`}function Mt(e){return JSON.parse(JSON.stringify(e))}function B(e){return e.flatMap(t=>t.chapterIds??[])}function lt(e=[]){return{id:U("phase"),title:ut,chapterIds:[...e]}}function M(e){const t=[...e.chapterIds??[]],a=Array.isArray(e.phases)&&e.phases.length?e.phases.map(i=>({id:i.id??U("phase"),title:i.title?.trim()||ut,chapterIds:[...i.chapterIds??[]]})):[lt(t)],r=new Set;for(const i of a)i.chapterIds=i.chapterIds.filter(c=>!c||r.has(c)?!1:(r.add(c),!0));const s=t.filter(i=>!r.has(i));s.length&&a[0].chapterIds.push(...s);const n=B(a);return{...e,chapterIds:n,soundtracks:e.soundtracks??[],phases:a}}function w(){const e=localStorage.getItem(gt);if(!e)return localStorage.setItem(gt,JSON.stringify(ht)),Mt(ht);try{return JSON.parse(e)}catch{return localStorage.setItem(gt,JSON.stringify(ht)),Mt(ht)}}function k(e){localStorage.setItem(gt,JSON.stringify(e))}function _(e,t){const a=(e.arcIds??[]).map(r=>t.arcs[r]).filter(Boolean).map(r=>yt(r,t));return{...e,pendingTransfer:e.pendingTransfer??null,pendingTransferEmailLower:e.pendingTransferEmailLower??"",pendingTransferStatus:e.pendingTransferStatus??"",arcIds:e.arcIds??[],arcs:a}}function yt(e,t){const a=M(e),r=a.chapterIds.map(s=>t.chapters[s]).filter(Boolean);return{...a,chapterIds:a.chapterIds??[],chapters:r,phases:a.phases.map(s=>({...s,chapters:s.chapterIds.map(n=>t.chapters[n]).filter(Boolean)}))}}function W(e,t){const a=e.arcs[t];if(!a)return!1;const r=M(a),s=JSON.stringify({chapterIds:a.chapterIds??[],phases:a.phases??[]})!==JSON.stringify({chapterIds:r.chapterIds,phases:r.phases});return s&&(e.arcs[t]={...e.arcs[t],chapterIds:r.chapterIds,phases:r.phases}),s}function be(){return{mode:"local",async getUserProfile(e){return e?w().users[e]??null:null},async updateUserProfile(e,t){const a=w(),r=a.users[e]??{id:e,name:t.name??"Creator",email:t.email??"",emailLower:T(t.email),penName:""};a.users[e]={...r,...t,emailLower:T(t.email??r.email)};const s=a.users[e].penName?.trim()||a.users[e].name||"Creator";for(const n of Object.values(a.stories))n.creatorId===e&&(n.creatorName=s);return k(a),a.users[e]},async listIncomingStoryTransfers(e){const t=w(),a=T(e);return a?Object.values(t.stories).filter(r=>r.pendingTransferStatus==="pending"&&r.pendingTransferEmailLower===a).sort((r,s)=>String(s.updatedAt).localeCompare(String(r.updatedAt))).map(r=>_(r,t)):[]},async listCreatorStories(e){if(!e)return[];const t=w();return Object.values(t.stories).filter(a=>a.creatorId===e).sort((a,r)=>r.updatedAt.localeCompare(a.updatedAt)).map(a=>({...a,arcs:(a.arcIds??[]).map(r=>({id:r}))}))},async listEditorStories(e){const t=T(e);if(!t)return[];const a=w();return Object.values(a.stories).filter(r=>(r.editorEmails??[]).includes(t)).sort((r,s)=>String(s.updatedAt).localeCompare(String(r.updatedAt))).map(r=>st(r))},async listBrowserStories(){const e=w();return Object.values(e.stories).filter(t=>t.visibility==="public").sort((t,a)=>t.creatorName.localeCompare(a.creatorName)||t.title.localeCompare(a.title)).map(t=>({...t,arcs:(t.arcIds??[]).map(a=>({id:a}))}))},async getStory(e){const t=w();let a=!1;for(const s of t.stories[e]?.arcIds??[])a=W(t,s)||a;a&&k(t);const r=t.stories[e];return r?_(r,t):null},async getArc(e){const t=w();W(t,e)&&k(t);const r=t.arcs[e];return r?yt(r,t):null},async getChapter(e){const a=w().chapters[e]??null;return a?{...a,renderMode:a.renderMode??"markdown",htmlBackground:a.htmlBackground??"",assets:a.assets??[],soundtracks:a.soundtracks??[]}:null},async createStory({creatorId:e,creatorName:t,title:a,tags:r,visibility:s}){const n=w(),i=U("story"),c=new Date().toISOString();return n.stories[i]={id:i,title:a,tags:r,visibility:s,creatorId:e,creatorName:t,editorEmails:[],arcIds:[],createdAt:c,updatedAt:c},k(n),_(n.stories[i],n)},async updateStory(e,t){const a=w();if(!a.stories[e])throw new Error("Story not found.");return a.stories[e]={...a.stories[e],...t,updatedAt:new Date().toISOString()},k(a),_(a.stories[e],a)},async addStoryEditor(e,t){const a=T(t);if(!a)throw new Error("Enter a valid editor email.");const r=w(),s=r.stories[e];if(!s)throw new Error("Story not found.");return s.editorEmails=[...new Set([...s.editorEmails??[],a])],s.updatedAt=new Date().toISOString(),k(r),_(s,r)},async requestStoryTransfer(e,t,a){const r=w(),s=r.stories[e];if(!s)throw new Error("Story not found.");const n=T(t);if(!n)throw new Error("Enter a valid Gmail address.");return s.pendingTransfer={targetEmail:String(t).trim(),targetEmailLower:n,requestedBy:a?.id??s.creatorId,requestedByName:a?.name??s.creatorName,requestedAt:new Date().toISOString(),status:"pending"},s.pendingTransferEmailLower=n,s.pendingTransferStatus="pending",s.updatedAt=new Date().toISOString(),k(r),_(s,r)},async cancelStoryTransfer(e){const t=w(),a=t.stories[e];if(!a)throw new Error("Story not found.");return a.pendingTransfer=null,a.pendingTransferEmailLower="",a.pendingTransferStatus="",a.updatedAt=new Date().toISOString(),k(t),_(a,t)},async acceptStoryTransfer(e,t){const a=w(),r=a.stories[e];if(!r)throw new Error("Story not found.");if(!vt(r,t?.email))throw new Error("This transfer request is no longer available.");const s=T(t?.email),n=a.users[t.id]??{id:t.id,name:t.name??"Creator",email:t.email??"",emailLower:s,penName:t.penName??""};return a.users[t.id]=n,r.creatorId=t.id,r.creatorName=n.penName?.trim()||n.name||t.name||"Creator",r.pendingTransfer=null,r.pendingTransferEmailLower="",r.pendingTransferStatus="",r.updatedAt=new Date().toISOString(),k(a),_(r,a)},async declineStoryTransfer(e,t){const a=w(),r=a.stories[e];if(!r)throw new Error("Story not found.");if(!vt(r,t))throw new Error("This transfer request is no longer available.");return r.pendingTransfer=null,r.pendingTransferEmailLower="",r.pendingTransferStatus="",r.updatedAt=new Date().toISOString(),k(a),_(r,a)},async createArc(e,t){const a=w(),r=a.stories[e];if(!r)throw new Error("Story not found.");const s=U("arc"),n=new Date().toISOString();return a.arcs[s]={id:s,storyId:e,title:t,chapterIds:[],soundtracks:[],phases:[lt()],createdAt:n,updatedAt:n},r.arcIds.push(s),r.updatedAt=n,k(a),yt(a.arcs[s],a)},async updateArc(e,t){const a=w(),r=a.arcs[e];if(!r)throw new Error("Arc not found.");return r.title=t.title??r.title,r.phases=t.phases??r.phases,r.chapterIds=t.chapterIds??r.chapterIds,r.soundtracks=t.soundtracks??r.soundtracks??[],r.updatedAt=new Date().toISOString(),a.stories[r.storyId].updatedAt=r.updatedAt,k(a),yt(r,a)},async reorderArcs(e,t){const a=w();a.stories[e].arcIds=[...t],a.stories[e].updatedAt=new Date().toISOString(),k(a)},async createChapter(e,t){const a=w(),r=a.arcs[e];if(!r)throw new Error("Arc not found.");const s=U("chapter"),n=new Date().toISOString();return a.chapters[s]={id:s,arcId:e,title:t,body:"",renderMode:"markdown",htmlBackground:"",assets:[],soundtracks:[],createdAt:n,updatedAt:n},r.chapterIds.push(s),r.phases?.length||(r.phases=[lt()]),r.phases[0].chapterIds.push(s),r.updatedAt=n,a.stories[r.storyId].updatedAt=n,k(a),a.chapters[s]},async updateChapter(e,t){const a=w();if(!a.chapters[e])throw new Error("Chapter not found.");a.chapters[e]={...a.chapters[e],...t,updatedAt:new Date().toISOString()};const r=a.arcs[a.chapters[e].arcId];return r&&(r.updatedAt=a.chapters[e].updatedAt,a.stories[r.storyId].updatedAt=r.updatedAt),k(a),a.chapters[e]},async updateChapterOrder(e,t){const a=w();a.arcs[e].chapterIds=[...t],a.arcs[e].updatedAt=new Date().toISOString(),a.stories[a.arcs[e].storyId].updatedAt=a.arcs[e].updatedAt,k(a)},async createPhase(e,t){const a=w();W(a,e);const r=a.arcs[e],s={id:U("phase"),title:t?.trim()||"New Phase",chapterIds:[]};return r.phases.push(s),r.updatedAt=new Date().toISOString(),a.stories[r.storyId].updatedAt=r.updatedAt,k(a),s},async renamePhase(e,t,a){const r=w();W(r,e);const s=r.arcs[e],n=s.phases.find(c=>c.id===t);if(!n)throw new Error("Phase not found.");const i=a?.trim()??"";if(i)n.title=i;else if(s.phases.length<=1)n.title=ut;else{const c=s.phases.findIndex(u=>u.id===t),d=c<s.phases.length-1?c+1:c-1,l=s.phases[d];l.chapterIds=[...n.chapterIds??[],...l.chapterIds??[]],s.phases=s.phases.filter(u=>u.id!==t),s.chapterIds=B(s.phases)}return s.updatedAt=new Date().toISOString(),r.stories[s.storyId].updatedAt=s.updatedAt,k(r),s.phases.find(c=>c.id===t)??null},async moveChapterToPhase(e,t,a){const r=w();W(r,e);const s=r.arcs[e];for(const i of s.phases)i.chapterIds=i.chapterIds.filter(c=>c!==t);const n=s.phases.find(i=>i.id===a);if(!n)throw new Error("Phase not found.");n.chapterIds.push(t),s.chapterIds=B(s.phases),s.updatedAt=new Date().toISOString(),r.stories[s.storyId].updatedAt=s.updatedAt,k(r)},async transferChapter(e,t,a){const r=w(),s=r.chapters[e],n=r.arcs[t];if(!s)throw new Error("Chapter not found.");if(!n)throw new Error("Target arc not found.");W(r,s.arcId),W(r,t);const i=r.arcs[s.arcId],c=r.arcs[t];if(!(c.phases??[]).find(u=>u.id===a))throw new Error("Target phase not found.");const l=new Date().toISOString();return i&&(i.chapterIds=(i.chapterIds??[]).filter(u=>u!==e),i.phases=(i.phases??[]).map(u=>({...u,chapterIds:(u.chapterIds??[]).filter(y=>y!==e)})),i.updatedAt=l,r.stories[i.storyId]&&(r.stories[i.storyId].updatedAt=l)),c.phases=(c.phases??[]).map(u=>u.id===a?{...u,chapterIds:[...u.chapterIds??[],e]}:u),c.chapterIds=B(c.phases),c.updatedAt=l,r.stories[c.storyId]&&(r.stories[c.storyId].updatedAt=l),r.chapters[e]={...s,arcId:t,updatedAt:l},k(r),r.chapters[e]},async reorderPhaseChapters(e,t,a){const r=w();W(r,e);const s=r.arcs[e],n=s.phases.find(i=>i.id===t);if(!n)throw new Error("Phase not found.");n.chapterIds=[...a],s.chapterIds=B(s.phases),s.updatedAt=new Date().toISOString(),r.stories[s.storyId].updatedAt=s.updatedAt,k(r)},async deleteChapter(e){const t=w(),a=t.chapters[e];if(!a)return;const r=t.arcs[a.arcId];if(r){r.chapterIds=(r.chapterIds??[]).filter(n=>n!==e),r.phases=(r.phases??[]).map(n=>({...n,chapterIds:(n.chapterIds??[]).filter(i=>i!==e)})),r.updatedAt=new Date().toISOString();const s=t.stories[r.storyId];s&&(s.updatedAt=r.updatedAt)}delete t.chapters[e],k(t)},async deleteArc(e){const t=w(),a=t.arcs[e];if(!a)return;for(const s of a.chapterIds??[])delete t.chapters[s];const r=t.stories[a.storyId];r&&(r.arcIds=(r.arcIds??[]).filter(s=>s!==e),r.updatedAt=new Date().toISOString()),delete t.arcs[e],k(t)},async deleteStory(e){const t=w(),a=t.stories[e];if(a){for(const r of a.arcIds??[]){const s=t.arcs[r];for(const n of s?.chapterIds??[])delete t.chapters[n];delete t.arcs[r]}delete t.stories[e],k(t)}}}}function st(e){return{...e,pendingTransfer:e.pendingTransfer??null,pendingTransferEmailLower:e.pendingTransferEmailLower??"",pendingTransferStatus:e.pendingTransferStatus??"",arcIds:e.arcIds??[],tags:e.tags??[],editorEmails:e.editorEmails??[],arcs:(e.arcIds??[]).map(t=>({id:t}))}}function $(e){return e.exists()?{id:e.id,...e.data()}:null}function wt(e,t){const a=new Map(t.map((r,s)=>[r,s]));return[...e].sort((r,s)=>(a.get(r.id)??0)-(a.get(s.id)??0))}async function R(e,t){const a=await b(m(e,"stories",t)),r=$(a);if(!r)return null;const s=await J(K(Q(e,"arcs"),j("storyId","==",t))),n=[];for(const d of wt(s.docs.map(l=>({id:l.id,...l.data(),chapterIds:l.data().chapterIds??[]})),r.arcIds??[])){const l=M(d);n.push(l)}const i=await Promise.all(n.map(async d=>{const l=await J(K(Q(e,"chapters"),j("arcId","==",d.id)));return[d.id,wt(l.docs.map(u=>({id:u.id,...u.data(),assets:u.data().assets??[],soundtracks:u.data().soundtracks??[],renderMode:u.data().renderMode??"markdown",htmlBackground:u.data().htmlBackground??""})),d.chapterIds??[])]})),c=Object.fromEntries(i);return{...r,tags:r.tags??[],arcIds:r.arcIds??[],arcs:n.map(d=>({...d,chapterIds:d.chapterIds??[],phases:d.phases.map(l=>({...l,chapters:(c[d.id]??[]).filter(u=>(l.chapterIds??[]).includes(u.id))})),chapters:c[d.id]??[]}))}}async function Bt(e,t){if(!t?.id)return;const a=m(e,"users",t.id),r=await b(a),s={id:t.id,name:t.name??"Creator",email:t.email??"",emailLower:T(t.email),penName:t.penName??(r.exists()?r.data().penName:"")??"",structureView:t.structureView??(r.exists()?r.data().structureView:"list")??"list",updatedAt:new Date().toISOString()};if(r.exists()){await g(a,s);return}await it(a,{...s,createdAt:new Date().toISOString()})}function ke(e){const t=e.db;return{mode:"firebase",async getUserProfile(a){if(!a)return null;const r=await b(m(t,"users",a));return $(r)},async updateUserProfile(a,r){const s=m(t,"users",a),n=await b(s),i={id:a,updatedAt:new Date().toISOString(),...r,emailLower:T(r.email??(n.exists()?n.data().email:""))};n.exists()?await g(s,i):await it(s,{createdAt:new Date().toISOString(),...i});const c=await b(s),d=$(c),l=d?.penName?.trim()||d?.name||"Creator",u=await J(K(Q(t,"stories"),j("creatorId","==",a)));return await Promise.all(u.docs.map(y=>g(m(t,"stories",y.id),{creatorName:l}))),d},async listIncomingStoryTransfers(a){const r=T(a);return r?(await J(K(Q(t,"stories"),j("pendingTransferStatus","==","pending"),j("pendingTransferEmailLower","==",r)))).docs.map(n=>st({id:n.id,...n.data()})).sort((n,i)=>String(i.updatedAt).localeCompare(String(n.updatedAt))):[]},async listCreatorStories(a){return a?(await J(K(Q(t,"stories"),j("creatorId","==",a)))).docs.map(s=>st({id:s.id,...s.data()})).sort((s,n)=>String(n.updatedAt).localeCompare(String(s.updatedAt))):[]},async listEditorStories(a){const r=T(a);return r?(await J(K(Q(t,"stories"),j("editorEmails","array-contains",r)))).docs.map(n=>st({id:n.id,...n.data()})).sort((n,i)=>String(i.updatedAt).localeCompare(String(n.updatedAt))):[]},async listBrowserStories(){return(await J(K(Q(t,"stories"),j("visibility","==","public")))).docs.map(r=>st({id:r.id,...r.data()})).sort((r,s)=>r.creatorName.localeCompare(s.creatorName)||r.title.localeCompare(s.title))},async getStory(a){return R(t,a)},async getArc(a){const r=await b(m(t,"arcs",a)),s=$(r),n=s?M(s):null;if(!n)return null;const i=await J(K(Q(t,"chapters"),j("arcId","==",a)));return{...n,chapterIds:n.chapterIds??[],phases:n.phases.map(c=>({...c,chapters:wt(i.docs.map(d=>({id:d.id,...d.data(),assets:d.data().assets??[],soundtracks:d.data().soundtracks??[],renderMode:d.data().renderMode??"markdown",htmlBackground:d.data().htmlBackground??""})).filter(d=>(c.chapterIds??[]).includes(d.id)),c.chapterIds??[])})),chapters:wt(i.docs.map(c=>({id:c.id,...c.data(),assets:c.data().assets??[],soundtracks:c.data().soundtracks??[],renderMode:c.data().renderMode??"markdown",htmlBackground:c.data().htmlBackground??""})),n.chapterIds??[])}},async getChapter(a){const r=await b(m(t,"chapters",a)),s=$(r);return s?{...s,assets:s.assets??[],soundtracks:s.soundtracks??[],renderMode:s.renderMode??"markdown",htmlBackground:s.htmlBackground??""}:null},async createStory({creatorId:a,creatorName:r,title:s,tags:n,visibility:i}){const c=U("story"),d=new Date().toISOString(),l={id:c,title:s,tags:n,visibility:i,creatorId:a,creatorName:r,editorEmails:[],arcIds:[],createdAt:d,updatedAt:d};return await it(m(t,"stories",c),l),await Bt(t,{id:a,name:r}),st(l)},async updateStory(a,r){return await g(m(t,"stories",a),{...r,updatedAt:new Date().toISOString()}),R(t,a)},async addStoryEditor(a,r){const s=T(r);if(!s)throw new Error("Enter a valid editor email.");const n=await R(t,a);if(!n)throw new Error("Story not found.");const i=[...new Set([...n.editorEmails??[],s])];return await g(m(t,"stories",a),{editorEmails:i,updatedAt:new Date().toISOString()}),R(t,a)},async requestStoryTransfer(a,r,s){const n=T(r);if(!n)throw new Error("Enter a valid Gmail address.");return await g(m(t,"stories",a),{pendingTransfer:{targetEmail:String(r).trim(),targetEmailLower:n,requestedBy:s?.id??"",requestedByName:s?.name??"Creator",requestedAt:new Date().toISOString(),status:"pending"},pendingTransferEmailLower:n,pendingTransferStatus:"pending",updatedAt:new Date().toISOString()}),R(t,a)},async cancelStoryTransfer(a){return await g(m(t,"stories",a),{pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:new Date().toISOString()}),R(t,a)},async acceptStoryTransfer(a,r){const s=await R(t,a);if(!s)throw new Error("Story not found.");if(!vt(s,r?.email))throw new Error("This transfer request is no longer available.");T(r?.email),await Bt(t,r);const n=await b(m(t,"users",r.id)),i=$(n)??r,c=i.penName?.trim()||i.name||r.name||"Creator",d=new Date().toISOString();return await g(m(t,"stories",a),{creatorId:r.id,creatorName:c,pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:d}),R(t,a)},async declineStoryTransfer(a,r){const s=await R(t,a);if(!s)throw new Error("Story not found.");if(!vt(s,r))throw new Error("This transfer request is no longer available.");return await g(m(t,"stories",a),{pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:new Date().toISOString()}),R(t,a)},async createArc(a,r){const s=m(t,"stories",a),n=await b(s),i=$(n);if(!i)throw new Error("Story not found.");const c=U("arc"),d=new Date().toISOString(),l={id:c,storyId:a,title:r,chapterIds:[],soundtracks:[],phases:[lt()],createdAt:d,updatedAt:d};return await it(m(t,"arcs",c),l),await g(s,{arcIds:[...i.arcIds??[],c],updatedAt:d}),l},async updateArc(a,r){const s=m(t,"arcs",a),n=new Date().toISOString();await g(s,{...r,updatedAt:n});const i=await b(s),c=$(i);return c?.storyId&&await g(m(t,"stories",c.storyId),{updatedAt:n}),this.getArc(a)},async reorderArcs(a,r){await g(m(t,"stories",a),{arcIds:r,updatedAt:new Date().toISOString()})},async createChapter(a,r){const s=m(t,"arcs",a),n=await b(s),i=$(n);if(!i)throw new Error("Arc not found.");const c=U("chapter"),d=new Date().toISOString(),l={id:c,arcId:a,title:r,body:"",renderMode:"markdown",htmlBackground:"",assets:[],soundtracks:[],createdAt:d,updatedAt:d};await it(m(t,"chapters",c),l);const u=M(i);return u.phases.length||(u.phases=[lt()]),u.phases[0].chapterIds.push(c),await g(s,{chapterIds:[...i.chapterIds??[],c],phases:u.phases,updatedAt:d}),await g(m(t,"stories",i.storyId),{updatedAt:d}),l},async updateChapter(a,r){const s=m(t,"chapters",a),n=new Date().toISOString();await g(s,{...r,updatedAt:n});const i=await b(s),c=$(i);if(c?.arcId){const d=await b(m(t,"arcs",c.arcId)),l=$(d);l&&(await g(m(t,"arcs",l.id),{updatedAt:n}),await g(m(t,"stories",l.storyId),{updatedAt:n}))}return this.getChapter(a)},async updateChapterOrder(a,r){const s=m(t,"arcs",a),n=new Date().toISOString();await g(s,{chapterIds:r,updatedAt:n});const i=await b(s),c=$(i);c?.storyId&&await g(m(t,"stories",c.storyId),{updatedAt:n})},async createPhase(a,r){const s=m(t,"arcs",a),n=await b(s),i=$(n),c=i?M(i):null;if(!c)throw new Error("Arc not found.");const d={id:U("phase"),title:r?.trim()||"New Phase",chapterIds:[]},l=[...c.phases,d],u=new Date().toISOString();return await g(s,{phases:l,chapterIds:B(l),updatedAt:u}),await g(m(t,"stories",c.storyId),{updatedAt:u}),d},async renamePhase(a,r,s){const n=m(t,"arcs",a),i=await b(n),c=$(i),d=c?M(c):null;if(!d)throw new Error("Arc not found.");const l=d.phases.find(v=>v.id===r);if(!l)throw new Error("Phase not found.");const u=s?.trim()??"";let y;if(u)y=d.phases.map(v=>v.id===r?{...v,title:u}:v);else if(d.phases.length<=1)y=d.phases.map(v=>v.id===r?{...v,title:ut}:v);else{const v=d.phases.findIndex(I=>I.id===r),E=v<d.phases.length-1?v+1:v-1;y=d.phases.map((I,x)=>x===E?{...I,chapterIds:[...l.chapterIds??[],...I.chapterIds??[]]}:I).filter(I=>I.id!==r)}const f=new Date().toISOString();return await g(n,{phases:y,chapterIds:B(y),updatedAt:f}),await g(m(t,"stories",d.storyId),{updatedAt:f}),y.find(v=>v.id===r)},async moveChapterToPhase(a,r,s){const n=m(t,"arcs",a),i=await b(n),c=$(i),d=c?M(c):null;if(!d)throw new Error("Arc not found.");const l=d.phases.map(f=>({...f,chapterIds:(f.chapterIds??[]).filter(v=>v!==r)})),u=l.find(f=>f.id===s);if(!u)throw new Error("Phase not found.");u.chapterIds.push(r);const y=new Date().toISOString();await g(n,{phases:l,chapterIds:B(l),updatedAt:y}),await g(m(t,"stories",d.storyId),{updatedAt:y})},async transferChapter(a,r,s){const n=m(t,"chapters",a),i=await b(n),c=$(i);if(!c)throw new Error("Chapter not found.");const d=m(t,"arcs",c.arcId),l=m(t,"arcs",r),[u,y]=await Promise.all([b(d),b(l)]),f=$(u),v=$(y),E=f?M(f):null,I=v?M(v):null;if(!E)throw new Error("Source arc not found.");if(!I)throw new Error("Target arc not found.");if(!(I.phases??[]).find(O=>O.id===s))throw new Error("Target phase not found.");const et=E.phases.map(O=>({...O,chapterIds:(O.chapterIds??[]).filter(S=>S!==a)})),D=I.phases.map(O=>O.id===s?{...O,chapterIds:[...O.chapterIds??[],a]}:O),L=new Date().toISOString();return await Promise.all([g(d,{phases:et,chapterIds:B(et),updatedAt:L}),g(l,{phases:D,chapterIds:B(D),updatedAt:L}),g(n,{arcId:r,updatedAt:L})]),await Promise.all([g(m(t,"stories",E.storyId),{updatedAt:L}),g(m(t,"stories",I.storyId),{updatedAt:L})]),this.getChapter(a)},async reorderPhaseChapters(a,r,s){const n=m(t,"arcs",a),i=await b(n),c=$(i),d=c?M(c):null;if(!d)throw new Error("Arc not found.");const l=d.phases.map(y=>y.id===r?{...y,chapterIds:[...s]}:y),u=new Date().toISOString();await g(n,{phases:l,chapterIds:B(l),updatedAt:u}),await g(m(t,"stories",d.storyId),{updatedAt:u})},async deleteChapter(a){const r=await b(m(t,"chapters",a)),s=$(r);if(!s)return;const n=m(t,"arcs",s.arcId),i=await b(n),c=$(i),d=new Date().toISOString();c&&(await g(n,{chapterIds:(c.chapterIds??[]).filter(l=>l!==a),phases:(c.phases??[]).map(l=>({...l,chapterIds:(l.chapterIds??[]).filter(u=>u!==a)})),updatedAt:d}),await g(m(t,"stories",c.storyId),{updatedAt:d})),await rt(m(t,"chapters",a))},async deleteArc(a){const r=await b(m(t,"arcs",a)),s=$(r);if(!s)return;for(const d of s.chapterIds??[])await rt(m(t,"chapters",d));const n=m(t,"stories",s.storyId),i=await b(n),c=$(i);c&&await g(n,{arcIds:(c.arcIds??[]).filter(d=>d!==a),updatedAt:new Date().toISOString()}),await rt(m(t,"arcs",a))},async deleteStory(a){const r=await R(t,a);if(r){for(const s of r.arcs??[]){for(const n of s.chapters??[])await rt(m(t,"chapters",n.id));await rt(m(t,"arcs",s.id))}await rt(m(t,"stories",a))}}}}async function $e(e){return e?.mode==="firebase"&&e.db?ke(e):be()}const Ie={VITE_APP_MODE:"firebase",VITE_FIREBASE_API_KEY:"AIzaSyC8-b4_lzrCk2RhsqSEMkcxNKgMzVx_WJ4",VITE_FIREBASE_APP_ID:"1:309677315541:web:ef90a15da4ee29c03fd95c",VITE_FIREBASE_AUTH_DOMAIN:"ulunavir-tales.firebaseapp.com",VITE_FIREBASE_MESSAGING_SENDER_ID:"309677315541",VITE_FIREBASE_PROJECT_ID:"ulunavir-tales",VITE_FIREBASE_STORAGE_BUCKET:"ulunavir-tales.firebasestorage.app"},Et={mode:"local",firebase:{apiKey:"",authDomain:"",projectId:"",appId:"",storageBucket:"",messagingSenderId:""}};function Ae(){const e=Ie??{};return{mode:e.VITE_APP_MODE??Et.mode,firebase:{apiKey:e.VITE_FIREBASE_API_KEY??"",authDomain:e.VITE_FIREBASE_AUTH_DOMAIN??"",projectId:e.VITE_FIREBASE_PROJECT_ID??"",appId:e.VITE_FIREBASE_APP_ID??"",storageBucket:e.VITE_FIREBASE_STORAGE_BUCKET??"",messagingSenderId:e.VITE_FIREBASE_MESSAGING_SENDER_ID??""}}}function Wt(){const e=globalThis.STORYFORGE_CONFIG??{},t=Ae();return{...Et,...t,...e,firebase:{...Et.firebase,...t.firebase,...e.firebase??{}}}}function Ee(e){return e.mode==="firebase"&&!!(e.firebase.projectId&&e.firebase.apiKey&&e.firebase.appId)}function Te(){const e=Wt();if(!Ee(e))return{mode:"local",auth:null,db:null,signIn:async()=>null,signOut:async()=>null,watchAuth:n=>(n(null),()=>{})};const t=de().length?le():ue(e.firebase),a=pe(t),r=me(t),s=new he;return{mode:"firebase",auth:a,db:r,signIn:async()=>(await ye(a,s)).user,signOut:async()=>ge(a),watchAuth:n=>fe(a,n)}}function Ce(){return Wt()}const St=document.querySelector("#app"),o={adapter:null,authClient:null,currentUser:JSON.parse(localStorage.getItem("storyforge-session")??"null"),route:{name:"home",params:{}},dragActive:!1,saveStatus:"",authError:"",loadError:"",soundtrack:{arcId:"",queue:[],currentIndex:0,paused:!0,volume:70,volumeOpen:!1,mode:"idle",ready:!1,autoplayAttempted:!1,activeKey:"",youtubePlayer:null,syncToken:0,manualPause:!1,recoveryTimer:null,recoveryAttempts:0}},Yt="storyforge-soundtrack-state";function Pe(){try{const e=localStorage.getItem(Yt);return e?JSON.parse(e):{}}catch{return{}}}function Jt(){const{arcId:e,currentIndex:t,paused:a,volume:r}=o.soundtrack;localStorage.setItem(Yt,JSON.stringify({arcId:e,currentIndex:t,paused:a,volume:r}))}function Tt(e=A()){return e?e.penName?.trim()||e.name||"Creator":"Guest"}function Kt(e=A()){return e?.structureView==="grid"?"grid":"list"}function z(e){o.currentUser=e,localStorage.setItem("storyforge-session",JSON.stringify(e))}function Ne(){document.querySelectorAll(".modal-backdrop").forEach(e=>e.remove())}function P(e){const t=`#${e}`;if(window.location.hash===t){dt(),window.scrollTo({top:0,left:0,behavior:"auto"});return}window.location.hash=e}function Le(){const e=window.location.hash.replace(/^#/,"")||"/",[t]=e.split("?"),a=t.split("/").filter(Boolean);return a.length===0?{name:"home",params:{}}:a[0]==="creator"?{name:"creator",params:{}}:a[0]==="browser"?{name:"browser",params:{}}:a[0]==="settings"?{name:"settings",params:{}}:a[0]==="stories"&&a[1]?a[2]==="arcs"&&a[3]&&a[4]==="chapters"&&a[5]?{name:"chapter",params:{storyId:a[1],arcId:a[3],chapterId:a[5]}}:a[2]==="arcs"&&a[3]?{name:"arc",params:{storyId:a[1],arcId:a[3]}}:{name:"story",params:{storyId:a[1]}}:{name:"not-found",params:{}}}function H(){return new URLSearchParams(window.location.hash.split("?")[1]??"")}function A(){return o.currentUser?o.currentUser:o.authClient?.mode==="firebase"?null:{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",mode:"demo",structureView:"list"}}function Qt(e){return!!(e?.creatorId&&A()?.id&&e.creatorId===A().id)}function Ct(e){return String(e??"").trim().toLowerCase()}function Oe(e){const t=Ct(A()?.email);return!!(t&&(e?.editorEmails??[]).includes(t))}function bt(e){return Qt(e)||Oe(e)}function Lt(e){return e?.visibility!=="private"||bt(e)}function p(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function Zt(e){return`${e}-${crypto.randomUUID().slice(0,8)}`}function qe(e,t="Soundtrack"){return e?.trim()||t}function xe(e){try{const t=new URL(e);if(t.hostname==="youtu.be")return t.pathname.replace(/\//g,"")||null;if(t.hostname.includes("youtube.com")){if(t.pathname==="/watch")return t.searchParams.get("v");const a=t.pathname.split("/").filter(Boolean);if(["embed","shorts","live"].includes(a[0]))return a[1]??null}}catch{return null}return null}function Xt(e){const t=e?.url?.trim(),a=t&&!/^https?:\/\//i.test(t)?`https://${t}`:t;if(!a)return null;const r=xe(a);return r?{id:e.id??Zt("soundtrack"),label:qe(e.label,"YouTube track"),url:a,source:"youtube",videoId:r}:null}function De(e=[]){return e.map(Xt).filter(Boolean)}function Re(){let e=document.querySelector("#soundtrack-layer");return e||(e=document.createElement("div"),e.id="soundtrack-layer",e.innerHTML=`
    <div id="youtube-soundtrack-host"></div>
  `,document.body.append(e),e)}function Me(e,t){return t()?Promise.resolve():new Promise((a,r)=>{const s=[...document.querySelectorAll("script")].find(i=>i.src===e);if(s){s.addEventListener("load",()=>a(),{once:!0}),s.addEventListener("error",()=>r(new Error(`Failed to load ${e}`)),{once:!0});return}const n=document.createElement("script");n.src=e,n.async=!0,n.addEventListener("load",()=>a(),{once:!0}),n.addEventListener("error",()=>r(new Error(`Failed to load ${e}`)),{once:!0}),document.head.append(n)})}function q(){const e=o.soundtrack.queue??[];if(!e.length)return null;const t=Math.max(0,Math.min(o.soundtrack.currentIndex,e.length-1));return e[t]??null}function nt(){const e=q(),t=document.querySelector("[data-action='toggle-soundtrack']");t&&(t.disabled=!e,t.classList.toggle("is-active",!!e&&!o.soundtrack.paused),t.setAttribute("aria-pressed",String(!!e&&!o.soundtrack.paused)),t.setAttribute("title",e?`${o.soundtrack.paused?"Resume":"Pause"} ${e.label}`:"No soundtrack available"));const a=document.querySelector("[data-action='toggle-volume-popout']");a&&(a.disabled=!e,a.classList.toggle("is-open",o.soundtrack.volumeOpen),a.style.setProperty("--volume-fill",`${V(o.soundtrack.volume)}%`),a.setAttribute("title",e?`Volume ${V(o.soundtrack.volume)}%`:"No soundtrack available"));const r=document.querySelector("#soundtrack-volume-slider");r&&(r.value=String(V(o.soundtrack.volume)));const s=document.querySelector("#soundtrack-volume-value");s&&(s.textContent=`${V(o.soundtrack.volume)}%`);const n=document.querySelector(".volume-popout");n&&(n.hidden=!o.soundtrack.volumeOpen)}function at(){Jt(),nt()}function te(){const e=document.querySelector("#soundtrack-status");e&&(e.textContent="No soundtrack loaded."),nt()}function G(e){const t=document.querySelector("#soundtrack-status");t&&(t.textContent=e)}function Z(){o.soundtrack.recoveryTimer&&(clearTimeout(o.soundtrack.recoveryTimer),o.soundtrack.recoveryTimer=null)}function ot(e="Playback interrupted",t=2200){const a=q();if(!a||o.soundtrack.paused||o.soundtrack.manualPause)return;Z();const r=a.id,s=o.soundtrack.syncToken;G(`${e}. Trying to resume...`),o.soundtrack.recoveryTimer=setTimeout(()=>{const n=q();if(!(!n||n.id!==r||s!==o.soundtrack.syncToken||o.soundtrack.paused||o.soundtrack.manualPause||!o.soundtrack.youtubePlayer)){o.soundtrack.recoveryAttempts+=1;try{o.soundtrack.recoveryAttempts%4===0&&n.videoId?o.soundtrack.youtubePlayer.loadVideoById(n.videoId):o.soundtrack.youtubePlayer.playVideo(),G(`Resuming: ${n.label}`)}catch(i){G(`Soundtrack recovery failed: ${String(i.message||i)}`)}}},t)}function ee(){const e=q();Z(),o.soundtrack.manualPause=!0,o.soundtrack.mode==="youtube"&&o.soundtrack.youtubePlayer?.pauseVideo&&o.soundtrack.youtubePlayer.pauseVideo(),o.soundtrack.paused=!0,e&&G(`Paused: ${e.label}`),at()}function Be(){const e=q();e&&(Z(),o.soundtrack.manualPause=!1,o.soundtrack.recoveryAttempts=0,o.soundtrack.mode==="youtube"&&o.soundtrack.youtubePlayer?.playVideo&&o.soundtrack.youtubePlayer.playVideo(),o.soundtrack.paused=!1,G(`Now playing: ${e.label}`),at())}function Ue(){o.soundtrack.queue.length&&(o.soundtrack.currentIndex=(o.soundtrack.currentIndex+1)%o.soundtrack.queue.length,o.soundtrack.activeKey="",o.soundtrack.ready=!1,o.soundtrack.autoplayAttempted=!1,o.soundtrack.manualPause=!1,o.soundtrack.recoveryAttempts=0,Z(),at(),se())}function V(e){return Math.max(0,Math.min(100,Math.round(Number(e)||0)))}function ae(){const e=V(o.soundtrack.volume);o.soundtrack.volume=e,o.soundtrack.youtubePlayer?.setVolume&&o.soundtrack.youtubePlayer.setVolume(e),at()}function re(e){o.soundtrack.volume=V(e),ae()}function _e(e){re(V(o.soundtrack.volume+e))}async function je(e,t){await Me("https://www.youtube.com/iframe_api",()=>!!window.YT?.Player),t===o.soundtrack.syncToken&&(Re(),o.soundtrack.youtubePlayer?o.soundtrack.youtubePlayer.loadVideoById(e.videoId):await new Promise(a=>{const r=()=>{o.soundtrack.youtubePlayer=new window.YT.Player("youtube-soundtrack-host",{height:"200",width:"320",videoId:e.videoId,playerVars:{autoplay:1,controls:1,rel:0},events:{onReady:()=>a(),onStateChange:s=>{if(s.data===window.YT.PlayerState.ENDED){Z(),o.soundtrack.recoveryAttempts=0,Ue();return}if(s.data===window.YT.PlayerState.PLAYING){Z(),o.soundtrack.paused=!1,o.soundtrack.manualPause=!1,o.soundtrack.recoveryAttempts=0;const n=q();n&&G(`Now playing: ${n.label}`),at()}if(s.data===window.YT.PlayerState.PAUSED){if(o.soundtrack.manualPause){o.soundtrack.paused=!0,at();return}ot("Playback paused by YouTube")}s.data===window.YT.PlayerState.BUFFERING&&ot("Playback is buffering",4500),(s.data===window.YT.PlayerState.CUED||s.data===window.YT.PlayerState.UNSTARTED)&&ot("Playback is waiting")},onError:s=>{const n=q();G(`YouTube player error${s?.data?` ${s.data}`:""}. Retrying...`),n&&ot("YouTube player error",1500)}}})};if(window.YT?.Player)r();else{const s=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{s?.(),r()}}}),t===o.soundtrack.syncToken&&(o.soundtrack.mode="youtube",o.soundtrack.ready=!0,o.soundtrack.activeKey=e.id,ae(),G(`Now playing: ${e.label}`),o.soundtrack.paused||(o.soundtrack.manualPause=!1,o.soundtrack.youtubePlayer.playVideo(),ot("Playback did not start",5e3)),nt()))}async function se(){const e=++o.soundtrack.syncToken,t=q();if(!t){o.soundtrack.arcId="",o.soundtrack.queue=[],o.soundtrack.mode="idle",o.soundtrack.ready=!1,o.soundtrack.activeKey="",ee(),te();return}try{if(t.source==="youtube"){await je(t,e);return}}catch(a){o.saveStatus=`Soundtrack error: ${String(a.message||a)}`,G("Soundtrack could not be loaded."),nt()}}function Fe(e,t){const a=Pe(),r=e!==o.soundtrack.arcId||JSON.stringify(t.map(s=>s.id))!==JSON.stringify((o.soundtrack.queue??[]).map(s=>s.id));o.soundtrack.arcId=e,o.soundtrack.queue=t,r&&(o.soundtrack.currentIndex=a.arcId===e&&typeof a.currentIndex=="number"?Math.max(0,Math.min(a.currentIndex,t.length-1)):0,o.soundtrack.paused=a.arcId===e?!!a.paused:!1,o.soundtrack.manualPause=o.soundtrack.paused,o.soundtrack.volume=typeof a.volume=="number"?V(a.volume):o.soundtrack.volume,o.soundtrack.ready=!1,o.soundtrack.activeKey="",o.soundtrack.recoveryAttempts=0,Z()),at(),se()}function Y(){Z(),o.soundtrack.arcId="",o.soundtrack.queue=[],o.soundtrack.currentIndex=0,o.soundtrack.paused=!0,o.soundtrack.manualPause=!0,o.soundtrack.volumeOpen=!1,o.soundtrack.activeKey="",o.soundtrack.ready=!1,o.soundtrack.recoveryAttempts=0,o.soundtrack.youtubePlayer?.pauseVideo&&o.soundtrack.youtubePlayer.pauseVideo(),te(),Jt()}function Ve(e){const t=String(e??""),a="ULUNAVIR_SAFE_EXTRA_BREAK",r=t.replace(/\n{3,}/g,f=>`

${`${a}
`.repeat(f.length-2)}
`);let s=p(r);return s=s.replaceAll(a,"<br />"),s.replace(/```([\s\S]*?)```/g,(f,v)=>`<pre><code>${v.trim()}</code></pre>`).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<p><img alt="$1" src="$2" /></p>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/(?:^|\n)- (.*(?:\n- .*)*)/g,f=>`
<ul>${f.trim().split(`
`).map(E=>E.replace(/^- /,"").trim()).map(E=>`<li>${E}</li>`).join("")}</ul>`).split(/\n{2,}/).map(f=>/^<(h\d|ul|ol|pre|p|blockquote|table|hr|br)/.test(f.trim())?f:`<p>${f.replace(/\n/g,"<br />")}</p>`).join("")}function ze(e){return String(e??"").replace(/<script\b[\s\S]*?<\/script>/gi,"").replace(/\n{3,}/g,t=>`

${`<br />
`.repeat(t.length-2)}
`)}function Ot(e){return e?.renderMode==="html"?"html":"markdown"}function ne(e){return e?.htmlBackground||""}function He(e){const t=String(e??"").replace("#","");if(!/^[0-9a-f]{6}$/i.test(t))return!1;const a=parseInt(t.slice(0,2),16),r=parseInt(t.slice(2,4),16),s=parseInt(t.slice(4,6),16);return(a*299+r*587+s*114)/1e3>170}function Pt(e,t){const a=Ot(e),r=e?.body||t;if(a==="html"){const s=ne(e),n=[];return s&&(n.push(`background-color: ${s}`),He(s)&&n.push("color: #1d1712")),`<div class="html-document-surface" ${n.length?`style="${p(n.join("; "))}"`:""}>${ze(r)}</div>`}return Ve(r)}function Ge(e=""){const t=new Set,a=String(e??"");return[...a.matchAll(/data-word-image-placeholder=["'](\d+)["']/gi)].forEach(r=>t.add(Number(r[1]))),[...a.matchAll(/\[IMAGE\s+(\d+)\s+HERE\]/gi)].forEach(r=>t.add(Number(r[1]))),[...t].filter(r=>Number.isFinite(r)).sort((r,s)=>r-s)}function We(e){const t=Ge(e.body);return Ot(e)!=="html"||!t.length?"":`
    <section class="panel stack word-image-panel">
      <div class="section-header">
        <div>
          <h3>Word Images</h3>
          <p class="muted">Paste Imgur or direct image URLs to replace the Word image placeholders in their original positions.</p>
        </div>
        <span class="pill">${t.length} placeholder(s)</span>
      </div>
      <div class="word-image-list">
        ${t.map(a=>`
          <div class="inline-form word-image-row">
            <label>IMAGE ${a}</label>
            <input data-word-image-url="${a}" placeholder="https://i.imgur.com/example.png" />
            <button class="ghost-button" type="button" data-action="replace-word-image" data-chapter-id="${e.id}" data-image-index="${a}">Apply</button>
          </div>
        `).join("")}
      </div>
    </section>
  `}function Ye(e){return String(e??"").replace(/([.!?:;])\s*\d{1,4}(?=[A-ZÇĞİÖŞÜ])/g,"$1 ").replace(/(<(?:p|h[1-6]|li|blockquote)\b[^>]*>)\s*[o0]\s*(?=[A-ZÇĞİÖŞÜ])/gi,"$1").replace(/(<(?:p|h[1-6]|li|blockquote)\b[^>]*>)\s*\d{1,4}\s*(?=[A-ZÇĞİÖŞÜ])/gi,"$1").replace(/<p>\s*(?:\d{1,4}|[o0])\s*<\/p>/gi,"").replace(/(?:^|\n)\s*(?:\d{1,4}|[o0])\s*(?=\n|$)/gi,`
`).replace(/>\s+</g,"><").replace(/<\/(h[1-6]|p|blockquote|ul|ol|li|table|tr)>\s*/gi,`</$1>

`).replace(/\s*<(h[1-6]|p|blockquote|ul|ol|table)\b/gi,`
<$1`).replace(/\n{3,}/g,`

`).trim()}function ct(e,t){return[...e?.childNodes??[]].filter(a=>a.nodeType===1&&a.localName===t)}function N(e,t){return ct(e,t)[0]??null}function F(e,t){return e?.getAttribute(`w:${t}`)??e?.getAttribute(t)??""}function Je(e){const t=String(e??"").trim();return!t||t.toLowerCase()==="auto"?"":t.startsWith("#")?t:`#${t}`}function Ke(e){return{black:"#000000",blue:"#2f65d9",cyan:"#00cfe8",green:"#37b24d",magenta:"#d63384",red:"#d9480f",yellow:"#ffe066",white:"#ffffff"}[String(e??"").toLowerCase()]??""}function Qe(e){const t=N(e,"rPr");if(!t)return[];const a=[],r=Je(F(N(t,"color"),"val")),s=Ke(F(N(t,"highlight"),"val")),n=Number(F(N(t,"sz"),"val")),i=N(t,"rFonts"),c=F(i,"ascii")||F(i,"hAnsi"),d=N(t,"u"),l=F(N(t,"vertAlign"),"val");return N(t,"b")&&a.push("font-weight: 700"),N(t,"i")&&a.push("font-style: italic"),d&&F(d,"val")!=="none"&&a.push("text-decoration: underline"),N(t,"strike")&&a.push("text-decoration: line-through"),r&&a.push(`color: ${r}`),s&&a.push(`background-color: ${s}`),Number.isFinite(n)&&n>0&&a.push(`font-size: ${n/2}pt`),c&&a.push(`font-family: ${c.replace(/[<>"']/g,"")}`),l==="superscript"&&a.push("vertical-align: super","font-size: 0.72em"),l==="subscript"&&a.push("vertical-align: sub","font-size: 0.72em"),a}function Ze(e){return`<div class="word-image-placeholder" data-word-image-placeholder="${e}"><strong>[IMAGE ${e} HERE]</strong><br />Upload this Word image to Imgur, then replace this block with the Word Images panel.</div>`}function Ut(e,t){const a=[];for(const n of[...e.childNodes])n.nodeType===1&&(n.localName==="t"||n.localName==="instrText"?a.push(p(n.textContent??"")):n.localName==="tab"?a.push("&nbsp;&nbsp;&nbsp;&nbsp;"):n.localName==="br"||n.localName==="cr"?a.push("<br />"):(n.localName==="drawing"||n.localName==="pict")&&(t.imageIndex+=1,a.push(Ze(t.imageIndex))));const r=a.join("");if(!r)return"";const s=Qe(e);return s.length?`<span style="${p(s.join("; "))}">${r}</span>`:r}function oe(e,t){const a=N(e,"pPr"),r=F(N(a,"pStyle"),"val").toLowerCase(),s=F(N(a,"jc"),"val"),n=[];let i="p";const c=r.match(/heading([1-6])/);if(c?i=`h${c[1]}`:r==="title"?i="h1":r==="subtitle"&&(i="h2"),s){const l=s==="both"?"justify":s;n.push(`text-align: ${l}`)}const d=[...e.childNodes].map(l=>l.nodeType!==1?"":l.localName==="r"?Ut(l,t):l.localName==="hyperlink"?ct(l,"r").map(u=>Ut(u,t)).join(""):"").join("").trim();return d?`<${i}${n.length?` style="${p(n.join("; "))}"`:""}>${d}</${i}>`:""}function Xe(e,t){const a=ct(e,"tr").map(r=>`<tr>${ct(r,"tc").map(n=>`<td>${ct(n,"p").map(c=>oe(c,t)).filter(Boolean).join("")}</td>`).join("")}</tr>`).join("");return a?`<table><tbody>${a}</tbody></table>`:""}async function ta(e){const{default:t}=await Se(async()=>{const{default:l}=await import("./jszip.min-D7KnG0-e.js").then(u=>u.j);return{default:l}},[]),r=(await t.loadAsync(e)).file("word/document.xml");if(!r)throw new Error("This .docx file does not contain a readable Word document.");const s=await r.async("text"),i=new DOMParser().parseFromString(s,"application/xml").getElementsByTagNameNS("*","body")[0],c={imageIndex:0};return{html:[...i?.childNodes??[]].map(l=>l.nodeType!==1?"":l.localName==="p"?oe(l,c):l.localName==="tbl"?Xe(l,c):"").filter(Boolean).join(`

`),imageCount:c.imageIndex}}function qt(){const e=document.querySelector("#chapter-render-mode-input")?.value==="html"?"html":"markdown",t=document.querySelector("#chapter-html-background-input")?.value??"";return{body:document.querySelector("#chapter-body-input")?.value??"",renderMode:e,htmlBackground:e==="html"?t:""}}function Nt(){const e=document.querySelector(".markdown-preview");if(!e)return;const t=qt();e.dataset.previewMode=t.renderMode,e.innerHTML=Pt(t,t.renderMode==="html"?"":"*Start writing to preview your chapter here.*")}async function ea(e){if(!e)return;if(!e.name.toLowerCase().endsWith(".docx"))throw new Error("Please choose a .docx Word file.");if(!(document.querySelector("#chapter-body-input")instanceof HTMLTextAreaElement))throw new Error("Chapter editor is not available.");const a=o.route.params.chapterId,r=document.querySelector("#chapter-title-input"),s=await ta(await e.arrayBuffer()),n=Ye(s.html);if(!n)throw new Error("No readable text was found in that Word file.");await o.adapter.updateChapter(a,{title:r?.value.trim()||"Untitled Chapter",body:n,renderMode:"html",htmlBackground:""});const i=s.imageCount?` ${s.imageCount} image placeholder(s) added.`:"";o.saveStatus=`Word file imported into the editor.${i}`;const c=document.querySelector(".notice.mono");c&&(c.textContent=o.saveStatus),await h()}function aa(e){return e?typeof e.toDate=="function"?e.toDate():typeof e.seconds=="number"?new Date(e.seconds*1e3):new Date(e):null}function kt(e){const t=aa(e);return!t||Number.isNaN(t.getTime())?"Unknown date":new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short"}).format(t)}function ra(e,t,a){if(!t)return e;const r=t.toLowerCase();return e.filter(s=>a(s).toLowerCase().includes(r))}function sa(e){return[...new Set(e.flatMap(t=>t.tags))].sort((t,a)=>t.localeCompare(a))}function na(e=""){return`
    <aside class="quick-tools">
      <div class="quick-tools-frame">
        <div class="quick-tools-label">Quick Tools</div>
        <div class="quick-tools-body">
          ${e||'<div class="quick-tools-empty">No tools</div>'}
        </div>
      </div>
    </aside>
  `}function tt(e,t,a=""){const r=A(),s=o.authError?`<div class="notice"><strong>Sign-in error</strong><div class="muted">${p(o.authError)}</div></div>`:"",n=o.loadError?`<div class="notice"><strong>Load error</strong><div class="muted">${p(o.loadError)}</div></div>`:"",i=o.saveStatus?`<div class="notice"><strong>Status</strong><div class="muted">${p(o.saveStatus)}</div></div>`:"";St.innerHTML=`
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
            ${At("/","Main Menu",t==="home")}
            ${At("/creator","Creator",t==="creator")}
            ${At("/browser","Browser",t==="browser")}
          </nav>
        </div>
        <div class="stack">
          <button class="notice account-card" data-action="open-settings" ${r?"":"disabled"}>
            <strong>${p(Tt(r))}</strong>
            <div class="muted">${p(r?.email??(o.authClient?.mode==="firebase"?"Sign in to create and manage stories":"Local demo mode"))}</div>
          </button>
          <button class="login-button" data-action="toggle-login">
            ${o.currentUser?"Log out":"Log in"}
          </button>
        </div>
      </aside>
      <main class="content">${e}</main>
      ${na(a)}
    </div>
  `,(s||n||i)&&St.querySelector(".content").insertAdjacentHTML("afterbegin",`${i}${n}${s}`)}async function oa(){const e=A();if(!e)return X("Sign in to manage account settings.");tt(`
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
            <div class="muted">${p(e.name??"Creator")}</div>
          </div>
          <div class="inline-form settings-form">
            <input id="pen-name-input" placeholder="${p(e.name??"Creator")}" value="${p(e.penName??"")}" />
            <button class="ghost-button" data-action="save-pen-name">Save pen name</button>
          </div>
          <div class="muted">
            Leave it empty to fall back to your account name.
          </div>
        </section>
      </div>
    `,"home")}function At(e,t,a){return`<a class="nav-link ${a?"is-active":""}" href="#${e}"><span>${t}</span></a>`}function ia(){return`
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
  `}function ie(e){return e.length?`
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
                <h3>${p(t.title)}</h3>
                <p class="muted">Requested by ${p(t.pendingTransfer?.requestedByName??t.creatorName)} on ${p(kt(t.pendingTransfer?.requestedAt??t.updatedAt))}</p>
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
  `:""}async function ca(){const e=A();let t=[];if(e?.email)try{t=await o.adapter.listIncomingStoryTransfers?.(e.email)??[]}catch(a){console.error("Incoming transfer list failed:",a),o.loadError="Ownership requests could not be loaded right now."}tt(`
      <div class="stack">
        ${ia()}
        ${ie(t)}
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
    `,"home")}async function da(){const e=A();let t=[],a=[],r=[];try{t=await o.adapter.listCreatorStories(e?.id)}catch(u){console.error("Creator story list failed:",u),o.loadError="Your stories could not be loaded right now."}try{a=await o.adapter.listEditorStories?.(e?.email)??[]}catch(u){console.error("Editor story list failed:",u),o.loadError="Editor permissions could not be loaded right now."}if(e?.email)try{r=await o.adapter.listIncomingStoryTransfers?.(e.email)??[]}catch(u){console.error("Incoming transfer list failed:",u),o.loadError="Ownership requests could not be loaded right now."}const s=H(),n=s.get("q")??"",i=s.get("tag")??"",c=ra(t,n,u=>`${u.title} ${u.tags.join(" ")}`).filter(u=>i?u.tags.includes(i):!0),d=sa(t),l=o.authClient?.mode==="firebase"&&!e?'<div class="notice">Sign in with Firebase to create, edit, and manage your own stories.</div>':"";tt(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Creator</h2>
            <p class="muted">Manage your stories, search by title, and filter by tags.</p>
          </div>
          <button class="primary-button" data-action="create-story" ${e?"":"disabled"}>Create</button>
        </div>
        ${ie(r)}
        ${l}
        <section class="panel stack">
          <div class="search-row">
            <input id="story-search" placeholder="Search by story title or tag" value="${p(n)}" />
            <select id="story-tag-filter">
              <option value="">All tags</option>
              ${d.map(u=>`<option value="${p(u)}" ${i===u?"selected":""}>${p(u)}</option>`).join("")}
            </select>
            <button class="ghost-button" data-action="apply-story-filters">Filter</button>
          </div>
          <div class="chip-row">
            ${d.map(u=>`<a class="pill" href="#/creator?tag=${encodeURIComponent(u)}">${p(u)}</a>`).join("")}
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
            ${c.length?c.map(u=>_t(u,{authorView:!0})).join(""):'<div class="empty-state">No stories match this filter yet.</div>'}
          </div>
        </section>
        <section class="panel stack">
          <div class="section-header">
            <div>
              <h3>Editor Permission</h3>
              <p class="muted">Stories where the author has added you as an editor.</p>
            </div>
            <span class="pill">${a.length} story(s)</span>
          </div>
          <div class="story-list">
            ${a.length?a.map(u=>_t(u,{editorView:!0})).join(""):'<div class="empty-state">No editor permissions yet.</div>'}
          </div>
        </section>
      </div>
    `,"creator")}function _t(e,t={}){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${p(e.title)}</h3>
          ${t.editorView?`<p class="muted">by ${p(e.creatorName)}</p>`:""}
          <p class="muted">Updated ${kt(e.updatedAt)}</p>
        </div>
        <span class="status-pill">${p(e.visibility)}</span>
      </div>
      <div class="chip-row">
        ${e.tags.map(a=>`<span class="pill">${p(a)}</span>`).join("")}
      </div>
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${e.id}">Open story</a>
        <span class="pill">${e.arcs.length} arc(s)</span>
        ${t.authorView?`<button class="danger-button" data-action="delete-story" data-story-id="${e.id}">Delete</button>`:""}
      </div>
    </article>
  `}async function la(){const e=await o.adapter.listBrowserStories(A()?.id),t=H(),a=t.get("group")!=="flat",r=t.get("creator")??"",s=r?e.filter(c=>c.creatorName===r):e,n=[...new Set(e.map(c=>c.creatorName))];let i="";s.length?a?i=n.filter(c=>!r||c===r).map(c=>{const d=s.filter(l=>l.creatorName===c);return d.length?`
          <section class="panel stack">
            <div class="section-header">
              <h3>${p(c)}</h3>
              <span class="pill">${d.length} public stories</span>
            </div>
            <div class="story-list">${d.map(jt).join("")}</div>
          </section>
        `:""}).join(""):i=`<section class="story-list">${s.map(jt).join("")}</section>`:i='<div class="empty-state">No public stories are available yet.</div>',tt(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Browser</h2>
            <p class="muted">Explore public stories and browse them by creator.</p>
          </div>
          <div class="toolbar">
            <select id="browser-creator-filter">
              <option value="">All creators</option>
              ${n.map(c=>`<option value="${p(c)}" ${r===c?"selected":""}>${p(c)}</option>`).join("")}
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
    `,"browser")}function jt(e){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${p(e.title)}</h3>
          <p class="muted">by ${p(e.creatorName)}</p>
        </div>
        <span class="pill">${e.arcs.length} arc(s)</span>
      </div>
      <div class="chip-row">
        ${e.tags.map(t=>`<span class="pill">${p(t)}</span>`).join("")}
      </div>
      <a class="primary-button" href="#/stories/${e.id}?view=browser">Read structure</a>
    </article>
  `}async function ua(e){const t=await o.adapter.getStory(e);if(!t)return X("Story not found.");const a=Qt(t),r=bt(t),s=H().get("view")==="browser",n=Kt(),i=H().get("transfer")==="1",c=t.pendingTransferStatus==="pending"?t.pendingTransfer:null;if(!Lt(t))return X("This story is private.");tt(`
      <div class="stack">
        ${xt([[s?"#/browser":"#/creator",s?"Browser":"Creator"],["",t.title]])}
        <div class="page-title">
          <div>
            <h2>${p(t.title)}</h2>
            <p class="muted">Set visibility, manage arcs, and organize the reading order.</p>
          </div>
          <div class="card-actions">
            <div class="view-toggle" role="group" aria-label="Structure view">
              <button class="ghost-button ${n==="grid"?"is-active":""}" data-action="set-structure-view" data-view="grid">Compact Grid</button>
              <button class="ghost-button ${n==="list"?"is-active":""}" data-action="set-structure-view" data-view="list">List</button>
            </div>
            ${s&&r?'<a class="ghost-button" href="#/stories/'+t.id+'">Edit</a>':""}
            ${a&&!s?'<button class="ghost-button" type="button" data-action="add-story-editor" data-story-id="'+t.id+'">Add an Editor</button>':""}
            ${a&&!s?'<button class="ghost-button" type="button" data-action="open-story-transfer" data-story-id="'+t.id+'">Transfer Ownership</button>':""}
            ${r&&!s?'<button class="primary-button" data-action="create-arc" data-story-id="'+t.id+'">New arc</button>':""}
          </div>
        </div>
        <section class="panel stack">
          <div class="inline-form">
            <input id="story-title-input" value="${p(t.title)}" ${r?"":"disabled"} />
            <input id="story-tags-input" value="${p(t.tags.join(", "))}" ${r?"":"disabled"} />
            <select id="story-visibility-input" ${r?"":"disabled"}>
              ${["public","unlisted","private"].map(d=>`<option value="${d}" ${t.visibility===d?"selected":""}>${d}</option>`).join("")}
            </select>
            ${r?'<button class="ghost-button" data-action="save-story-settings" data-story-id="'+t.id+'">Save</button>':""}
          </div>
          <div class="notice">
            <strong>${p(t.creatorName)}</strong>
            <div class="muted">Created ${kt(t.createdAt)}. Visibility is currently ${p(t.visibility)}.</div>
            ${t.editorEmails?.length?`<div class="muted">Editors: ${p(t.editorEmails.join(", "))}</div>`:""}
          </div>
          ${a&&c?`
            <div class="notice">
              <strong>Transfer pending</strong>
              <div class="muted">Waiting for ${p(c.targetEmail??"")} to accept. Ownership stays with you until they do.</div>
              <div class="card-actions">
                <button class="ghost-button" data-action="cancel-story-transfer" data-story-id="${t.id}">Cancel transfer</button>
              </div>
            </div>
          `:""}
          ${a&&!s&&i?`
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
        <section class="nested-list ${n==="list"?"is-list-view":""}">
          ${t.arcs.length?t.arcs.map((d,l)=>pa(d,t,r,l,s)).join(""):'<div class="empty-state">No arcs yet. Create the first arc to start structuring this story.</div>'}
        </section>
      </div>
    `,s?"browser":r?"creator":"browser")}function pa(e,t,a,r,s=!1){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${p(e.title)}</h3>
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
  `}function ma(e,t,a=!1,r=""){return`
    <div class="phase-separator">
      <span class="phase-line"></span>
      ${t&&!a?`<button class="phase-title" data-action="rename-phase" data-arc-id="${r}" data-phase-id="${e.id}" data-phase-title="${p(e.title)}">${p(e.title)}</button>`:`<span class="phase-title">${p(e.title)}</span>`}
      <span class="phase-line"></span>
    </div>
  `}function ha(e){const t=e.soundtracks??[];return`
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
                    <strong>${p(a.label?.trim()||"Untitled soundtrack")}</strong>
                    <div class="muted mono">${p(a.url??"")}</div>
                  </div>
                  <button class="danger-button" data-action="delete-soundtrack" data-chapter-id="${e.id}" data-soundtrack-id="${a.id}">Remove</button>
                </article>
              `).join(""):'<div class="empty-state">No soundtrack links yet.</div>'}
      </div>
    </section>
  `}function fa(e){if(!e.length)return"";const t=q(),a=V(o.soundtrack.volume);return`
    <div class="quick-tool-stack">
      <button
        class="quick-tool-button ${t&&!o.soundtrack.paused?"is-active":""}"
        data-action="toggle-soundtrack"
        aria-pressed="${String(!!t&&!o.soundtrack.paused)}"
        title="${p(t?`${o.soundtrack.paused?"Resume":"Pause"} ${t.label}`:"No soundtrack available")}"
      >
        <span class="quick-tool-icon">♪</span>
      </button>
      <button
        class="quick-tool-button volume-button ${o.soundtrack.volumeOpen?"is-open":""}"
        data-action="toggle-volume-popout"
        data-wheel-volume="true"
        style="--volume-fill: ${a}%;"
        title="${p(t?`Volume ${a}%`:"No soundtrack available")}"
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
      <div id="soundtrack-status" class="quick-tool-status">${p(t?`${o.soundtrack.paused?"Paused":"Now playing"}: ${t.label}`:"No soundtrack loaded.")}</div>
    </div>
  `}async function ga(e,t){const[a,r]=await Promise.all([o.adapter.getStory(e),o.adapter.getArc(t)]);if(!a||!r)return X("Arc not found.");const s=bt(a),n=H().get("view")==="browser",i=Kt();if(!Lt(a))return X("This story is private.");const c=(r.phases??[]).map(d=>`
    <section class="phase-block stack">
      ${ma(d,s,n,r.id)}
      <div class="nested-list ${i==="list"?"is-list-view":""}">
        ${d.chapters.length?d.chapters.map((l,u)=>ya(l,a,r,s,u,n,d)).join(""):'<div class="empty-state">No chapters in this phase yet.</div>'}
      </div>
    </section>
  `).join("");if(tt(`
      <div class="stack">
        ${xt([[n?"#/browser":s?"#/creator":"#/browser",n?"Browser":s?"Creator":"Browser"],["#/stories/"+a.id+(n?"?view=browser":""),a.title],["",r.title]])}
        <div class="page-title">
          <div>
            <h2>${p(r.title)}</h2>
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
              <input id="arc-title-input" value="${p(r.title)}" />
              <button class="ghost-button" data-action="save-arc-title" data-arc-id="${r.id}" data-story-id="${a.id}">Rename arc</button>
            </div>
        </section>`:""}
        ${c||'<div class="empty-state">No chapters yet. Add one to begin writing.</div>'}
      </div>
    `,n?"browser":s?"creator":"browser"),s&&!n){const d=document.querySelector("#story-transfer-button");d&&d.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),showStoryTransferModal(a.id)})}}function ya(e,t,a,r,s,n=!1,i=null){return`
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${p(e.title||"Untitled chapter")}</h3>
          <p class="muted">Updated ${kt(e.updatedAt)}</p>
        </div>
        ${r&&!n?`
          <div class="order-buttons">
            <button class="small-button" data-action="move-chapter-up" data-arc-id="${a.id}" data-phase-id="${i?.id??""}" data-index="${s}" ${s===0?"disabled":""}>↑</button>
            <button class="small-button" data-action="move-chapter-down" data-arc-id="${a.id}" data-phase-id="${i?.id??""}" data-index="${s}" ${i&&s===i.chapters.length-1?"disabled":""}>↓</button>
          </div>`:""}
      </div>
      ${r&&!n?`<select class="phase-select" data-action="move-chapter-phase" data-arc-id="${a.id}" data-chapter-id="${e.id}">
              ${(a.phases??[]).map(c=>`<option value="${c.id}" ${c.id===i?.id?"selected":""}>${p(c.title)}</option>`).join("")}
            </select>`:""}
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${t.id}/arcs/${a.id}/chapters/${e.id}${n?"?view=browser":""}">Open chapter</a>
        ${r&&!n?`<button class="small-button" title="Move chapter" data-action="open-transfer-chapter" data-story-id="${t.id}" data-arc-id="${a.id}" data-phase-id="${i?.id??""}" data-chapter-id="${e.id}">↗</button>`:""}
        ${r&&!n?`<button class="danger-button" data-action="delete-chapter" data-story-id="${t.id}" data-arc-id="${a.id}" data-chapter-id="${e.id}">Delete</button>`:""}
      </div>
    </article>
  `}function Ft(e,t,a,r,s=!1){return!a&&!r?"":`
    <div class="chapter-pager">
      ${a?`<a class="ghost-button" href="#/stories/${e}/arcs/${t}/chapters/${a.id}${s?"?view=browser":""}">Previous Chapter</a>`:""}
      ${r?`<a class="ghost-button" href="#/stories/${e}/arcs/${t}/chapters/${r.id}${s?"?view=browser":""}">Next Chapter</a>`:""}
    </div>
  `}async function va(e,t,a){const[r,s,n]=await Promise.all([o.adapter.getStory(e),o.adapter.getArc(t),o.adapter.getChapter(a)]);if(!r||!s||!n)return X("Chapter not found.");const i=bt(r),c=H().get("view")==="browser";if(!Lt(r))return X("This story is private.");const d=n.assets??[],l=Ot(n),u=ne(n),y=c?De(n.soundtracks??[]):[],f=(s.chapters??[]).findIndex(D=>D.id===a),v=f>0?s.chapters[f-1]:null,E=f>=0&&f<s.chapters.length-1?s.chapters[f+1]:null,I=Ft(r.id,s.id,v,E,c),x=Ft(r.id,s.id,v,E,c),et=i&&!c?`
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
                    <input id="chapter-html-background-input" type="color" value="${p(u||"#120f0d")}" data-action="set-html-background" />
                    <button class="small-button" type="button" data-action="clear-html-background" title="Use site background">×</button>
                  </label>
                `:""}
                <input id="chapter-render-mode-input" type="hidden" value="${l}" />
                <input id="docx-import-input" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden />
              </div>
              <input id="chapter-title-input" value="${p(n.title)}" ${i?"":"disabled"} />
              <textarea id="chapter-body-input" class="markdown-area" ${i&&l!=="html"?"":"disabled"}>${p(n.body)}</textarea>
              ${x}
              ${We(n)}
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
                  <div class="asset-list asset-tray">
                    ${d.length?d.map((D,L)=>Vt(D,L,{chapterId:n.id,editable:!0})).join(""):'<div class="empty-state">No assets in this chapter yet.</div>'}
                  </div>
                </div>
              `:""}
              ${ha(n)}
              <div class="notice mono">${p(o.saveStatus||"Tip: use `![alt](image-url)` to place pasted external images into the chapter body.")}</div>
            </div>
          </section>
          <section class="preview-pane">
            <h3>Preview</h3>
            <div class="markdown-preview" data-preview-mode="${l}">${Pt(n,"*Start writing to preview your chapter here.*")}</div>
          </section>
        </div>
      `:`
        <section class="panel stack">
          <div class="section-header">
            <h3>Reading view</h3>
            <span class="pill">${d.length} asset(s)</span>
          </div>
          <div class="markdown-preview" data-preview-mode="${l}">${Pt(n,"*This chapter is empty.*")}</div>
        </section>
        ${x}
        ${d.length?`<section class="panel stack"><h3>Referenced images</h3><div class="asset-list">${d.map((D,L)=>Vt(D,L)).join("")}</div></section>`:""}
      `;tt(`
      <div class="stack">
        ${xt([[c?"#/browser":i?"#/creator":"#/browser",c?"Browser":i?"Creator":"Browser"],["#/stories/"+r.id+(c?"?view=browser":""),r.title],["#/stories/"+r.id+"/arcs/"+s.id+(c?"?view=browser":""),s.title],["",n.title||"Untitled chapter"]])}
        <div class="page-title">
          <div>
            <h2>${p(n.title||"Untitled chapter")}</h2>
            <p class="muted">${i&&!c?"Write in markdown, add image links, and save your draft.":"Read this chapter in a clean, read-only view."}</p>
          </div>
          <div class="card-actions">
            ${c&&i?`<a class="ghost-button" href="#/stories/${r.id}/arcs/${s.id}/chapters/${n.id}">Edit</a>`:""}
            ${i&&!c?`<button class="primary-button" data-action="save-chapter" data-chapter-id="${n.id}">Save</button>`:""}
          </div>
        </div>
        ${I}
        ${et}
      </div>
    `,c?"browser":i?"creator":"browser",fa(y)),c&&y.length?Fe(n.id,y):Y()}function Vt(e,t=0,a={}){const r=e.url??e.dataUrl??"",s=!!r,n=`![${e.name}](${r})`;return`
    <article class="asset-item">
      ${a.editable?`
        <div class="asset-actions">
          <button class="small-button asset-action-button" type="button" title="Copy markdown" data-action="copy-asset-markdown" data-markdown="${p(n)}">⧉</button>
          <button class="small-button asset-action-button danger-icon" type="button" title="Remove image" data-action="delete-asset" data-chapter-id="${a.chapterId}" data-asset-index="${t}">🗑</button>
        </div>
      `:`
        <div class="asset-actions">
          <button class="small-button asset-action-button" type="button" title="Copy markdown" data-action="copy-asset-markdown" data-markdown="${p(n)}">⧉</button>
        </div>
      `}
      ${s?`<img src="${p(r)}" alt="${p(e.name)}" />`:""}
      <strong title="${p(e.name)}">${p(e.name)}</strong>
      <div class="muted mono asset-markdown" title="${p(n)}">${p(n)}</div>
    </article>
  `}function X(e){tt(`
      <div class="stack">
        <section class="panel">
          <h2>Not found</h2>
          <p class="muted">${p(e)}</p>
        </section>
      </div>
    `,"home")}function xt(e){return`<div class="breadcrumbs">${e.map(([t,a])=>t?`<a href="${t}">${p(a)}</a>`:`<span>${p(a)}</span>`).join("<span>/</span>")}</div>`}async function h(){switch(Ne(),o.loadError="",o.route=Le(),o.route.name){case"home":return Y(),ca();case"creator":return Y(),da();case"browser":return Y(),la();case"settings":return Y(),oa();case"story":return Y(),ua(o.route.params.storyId);case"arc":return Y(),ga(o.route.params.storyId,o.route.params.arcId);case"chapter":return va(o.route.params.storyId,o.route.params.arcId,o.route.params.chapterId);default:return Y(),X("This page does not exist.")}}async function dt(){try{await h()}catch(e){console.error("Render failed:",e),o.loadError=String(e?.message||e||"The page could not be rendered."),St.innerHTML=`
      <main class="content">
        <section class="panel stack">
          <h2>Page failed to load</h2>
          <p class="muted">${p(o.loadError)}</p>
          <div class="card-actions">
            <a class="ghost-button" href="#/">Main Menu</a>
            <a class="ghost-button" href="#/creator">Creator</a>
          </div>
        </section>
      </main>
    `}}function wa(){return{title:document.querySelector("#story-title-input")?.value.trim()??"",tags:(document.querySelector("#story-tags-input")?.value??"").split(",").map(e=>e.trim()).filter(Boolean),visibility:document.querySelector("#story-visibility-input")?.value??"private"}}function zt(e,t,a){const r=[...e],[s]=r.splice(t,1);return r.splice(a,0,s),r}async function Sa({chapterId:e,currentStoryId:t,currentArcId:a,currentPhaseId:r}){const s=A();if(!s?.id)return o.saveStatus="Sign in first to move chapters between your stories.",h();const n=await o.adapter.listCreatorStories(s.id);if(!n.length)return o.saveStatus="You need at least one story before moving chapters.",h();const c=(await Promise.all(n.map(S=>o.adapter.getStory(S.id)))).filter(Boolean).filter(S=>(S.arcs??[]).length>0);if(!c.length)return o.saveStatus="Create an arc first, then you can move chapters into it.",h();const d=document.createElement("div");d.className="modal-backdrop",d.innerHTML=`
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
  `,document.body.append(d);const l=d.querySelector("#transfer-story-select"),u=d.querySelector("#transfer-arc-select"),y=d.querySelector("#transfer-phase-select"),f=d.querySelector("#transfer-summary"),v=d.querySelector("#transfer-confirm"),E=()=>d.remove();function I(){return c.find(S=>S.id===l.value)??c[0]}function x(){return I()?.arcs.find(S=>S.id===u.value)??I()?.arcs?.[0]??null}function et(){return x()?.phases.find(S=>S.id===y.value)??x()?.phases?.[0]??null}function D(){const S=I(),C=x(),$t=et(),Dt=S?.id===t&&C?.id===a&&$t?.id===r;f.innerHTML=Dt?"This chapter is already in that exact phase.":`Destination: <strong>${p(S?.title??"-")}</strong> / <strong>${p(C?.title??"-")}</strong> / <strong>${p($t?.title??"-")}</strong>`,v.disabled=!S||!C||!$t||Dt}function L(){const S=x();y.innerHTML=(S?.phases??[]).map(C=>`<option value="${C.id}" ${C.id===r&&S.id===a?"selected":""}>${p(C.title)}</option>`).join(""),D()}function O(){const S=I();u.innerHTML=(S?.arcs??[]).map(C=>`<option value="${C.id}" ${C.id===a&&S.id===t?"selected":""}>${p(C.title)}</option>`).join(""),L()}l.innerHTML=c.map(S=>`<option value="${S.id}" ${S.id===t?"selected":""}>${p(S.title)}</option>`).join(""),l.addEventListener("change",O),u.addEventListener("change",L),y.addEventListener("change",D),d.querySelector("#transfer-cancel").addEventListener("click",E),v.addEventListener("click",async()=>{const S=et(),C=x();if(!(!S||!C))return await o.adapter.transferChapter(e,C.id,S.id),E(),o.saveStatus="Chapter moved to a new story location.",h()}),O()}async function Ht(){if(o.currentUser)return await o.authClient.signOut(),z(null),o.saveStatus="Signed out.",o.authError="",h();if(o.authClient.mode==="firebase")try{const t=await o.authClient.signIn();return z({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email,mode:"firebase",structureView:"list"}),o.authError="",o.saveStatus="Signed in with Firebase.",h()}catch(t){return console.error("Firebase sign-in failed:",t),o.saveStatus="",o.authError=ba(t),h()}const e=document.createElement("div");e.className="modal-backdrop",e.innerHTML=`
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
  `,document.body.append(e),e.querySelector("#modal-login-cancel").addEventListener("click",()=>e.remove()),e.querySelector("#modal-login-submit").addEventListener("click",()=>{const t=e.querySelector("#login-name").value.trim()||"Creator",a=e.querySelector("#login-email").value.trim()||"local@storyforge.local";z({id:`local-${t.toLowerCase().replaceAll(/\s+/g,"-")}`,name:t,email:a,mode:"local",structureView:"list"}),e.remove(),o.saveStatus="Signed in with a local demo profile.",o.authError="",h()})}function ba(e){const t=e?.code?String(e.code):"",a=e?.message?String(e.message):"Unknown sign-in error.";return t==="auth/unauthorized-domain"?"This site domain is not authorized in Firebase Auth. Add your local/dev domain and your GitHub Pages domain in Firebase Console > Authentication > Settings > Authorized domains.":t==="auth/popup-closed-by-user"?"The sign-in popup closed before Firebase completed the login. If it closes instantly every time, double-check Authorized domains and the Google sign-in provider setup.":t==="auth/operation-not-allowed"?"Google sign-in is not enabled for this Firebase project. Enable it in Firebase Console > Authentication > Sign-in method.":t==="auth/invalid-api-key"?"Your Firebase API key is invalid. Recheck the values in your `.env` file and restart the dev server.":t==="auth/network-request-failed"?"Firebase could not complete the sign-in request. Check your connection and any browser privacy extensions blocking popups or auth requests.":t?`${t}: ${a}`:a}async function ka(e){const t=o.route.params.chapterId,a=await o.adapter.getChapter(t);if(!a)return;const r=[...a.assets??[]];for(const i of e){const c=await Ca(i);r.push({id:crypto.randomUUID(),name:i.name,type:i.type,size:i.size,dataUrl:c})}const s=document.querySelector("#chapter-body-input"),n=r.slice((a.assets??[]).length).map(i=>`
![${i.name}](${i.dataUrl})`).join("");await o.adapter.updateChapter(t,{assets:r,body:`${s.value}${n}`}),o.dragActive=!1,o.saveStatus="Assets added to the chapter. In production these should upload to object storage instead of local state.",await h()}function ce(e){const t=e.trim();if(!t)throw new Error("Add an image URL first.");let a;try{a=new URL(t)}catch{throw new Error("That image URL is not valid.")}if(!["http:","https:"].includes(a.protocol))throw new Error("Use an http or https image URL.");const r=a.hostname==="imgur.com"||a.hostname==="www.imgur.com"||a.hostname==="i.imgur.com",s=a.pathname.split("/").filter(Boolean).pop()??"",n=/\.[a-z0-9]{2,5}$/i.test(s);return r&&s&&!n&&(a.pathname=`${a.pathname}.png`),a.toString()}async function $a(e){const t=await o.adapter.getChapter(e);if(!t)throw new Error("Chapter not found.");const a=document.querySelector("#asset-name-input"),r=document.querySelector("#asset-url-input"),s=document.querySelector("#chapter-title-input"),n=document.querySelector("#chapter-body-input"),i=a?.value.trim()||"image",c=ce(r?.value??""),d={id:crypto.randomUUID(),name:i,type:"image/external",url:c},l=[...t.assets??[],d];await o.adapter.updateChapter(e,{title:s?.value.trim()||t.title||"Untitled Chapter",body:n?.value??t.body??"",assets:l}),a&&(a.value=""),r&&(r.value=""),o.saveStatus="External image link added to the chapter assets.",await h()}async function Ia(e){if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(e);return}const t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.append(t),t.select(),document.execCommand("copy"),t.remove()}async function Aa(e,t){const a=await o.adapter.getChapter(e);if(!a)throw new Error("Chapter not found.");const r=[...a.assets??[]];if(t<0||t>=r.length)throw new Error("Image could not be found.");r.splice(t,1);const s=document.querySelector("#chapter-title-input"),n=document.querySelector("#chapter-body-input");await o.adapter.updateChapter(e,{title:s?.value.trim()||a.title||"Untitled Chapter",body:n?.value??a.body??"",assets:r}),o.saveStatus="Image removed from chapter assets.",await h()}function Ea(e,t,a){const r=`<img src="${p(a)}" alt="word-image-${t}" />`,s=String(e??""),n=new RegExp(`<div\\b(?=[^>]*data-word-image-placeholder=["']${t}["'])[^>]*>[\\s\\S]*?<\\/div>`,"i");if(n.test(s))return s.replace(n,r);const i=new RegExp(`<[^>]+>[^<]*\\[IMAGE\\s+${t}\\s+HERE\\][\\s\\S]*?<\\/[^>]+>`,"i");return i.test(s)?s.replace(i,r):s.replace(new RegExp(`\\[IMAGE\\s+${t}\\s+HERE\\]`,"i"),r)}async function Ta(e,t){const a=await o.adapter.getChapter(e);if(!a)throw new Error("Chapter not found.");const r=document.querySelector(`[data-word-image-url="${t}"]`),s=ce(r?.value??""),n=Ea(a.body??"",t,s);await o.adapter.updateChapter(e,{body:n,renderMode:"html",htmlBackground:qt().htmlBackground}),o.saveStatus=`IMAGE ${t} replaced.`,await h()}async function Gt(){const e=A();if(!e?.id)return;const t=await o.adapter.getUserProfile?.(e.id);t&&z({...e,name:t.name??e.name,email:t.email??e.email,penName:t.penName??"",structureView:t.structureView??e.structureView??"list"})}function ft(e){return window.confirm(`Are you sure you want to delete this ${e}? This cannot be undone.`)}function Ca(e){return new Promise((t,a)=>{const r=new FileReader;r.onload=()=>t(String(r.result)),r.onerror=()=>a(r.error),r.readAsDataURL(e)})}document.addEventListener("click",async e=>{const t=e.target.closest("[data-action]");if(!t)return;const a=t.dataset.action;if(a==="toggle-login")return Ht();if(a==="open-settings")return P("/settings");if(a==="set-structure-view"){const r=A(),s=t.dataset.view==="list"?"list":"grid";if(!r?.id)return z({...r,structureView:s}),h();const n=await o.adapter.updateUserProfile(r.id,{name:r.name,email:r.email,penName:r.penName??"",structureView:s});return z({...r,structureView:n.structureView??s,penName:n.penName??r.penName??"",name:n.name??r.name,email:n.email??r.email}),h()}if(a==="apply-story-filters"){const r=document.querySelector("#story-search").value.trim(),s=document.querySelector("#story-tag-filter").value;return P(`/creator${r||s?`?${new URLSearchParams({q:r,tag:s}).toString()}`:""}`)}if(a==="apply-browser-filters"){const r=document.querySelector("#browser-creator-filter").value,s=document.querySelector("#browser-group-mode").value;return P(`/browser?${new URLSearchParams({creator:r,group:s}).toString()}`)}if(a==="create-story"){const r=A();if(!r)return o.saveStatus="Sign in first to create stories in Firebase mode.",Ht();const s=await o.adapter.createStory({creatorId:r.id,creatorName:Tt(r),title:"Untitled Story",tags:["draft"],visibility:"private"});return P(`/stories/${s.id}`)}if(a==="save-story-settings"){const r=t.dataset.storyId,s=wa();return await o.adapter.updateStory(r,s),o.saveStatus="Story details saved.",h()}if(a==="add-story-editor"){const r=window.prompt("Editor Gmail address");if(r===null)return;if(!r.trim())return o.saveStatus="Enter an editor email first.",h();const s=Ct(A()?.email),n=Ct(r);return s&&s===n?(o.saveStatus="You are already the author of this story.",h()):(await o.adapter.addStoryEditor(t.dataset.storyId,r),o.saveStatus=`Editor added: ${n}`,h())}if(a==="open-story-transfer"){const r=H();return r.set("transfer","1"),P(`/stories/${t.dataset.storyId}?${r.toString()}`)}if(a==="close-story-transfer"){const r=H();r.delete("transfer");const s=r.toString();return P(`/stories/${t.dataset.storyId}${s?`?${s}`:""}`)}if(a==="submit-story-transfer"){const r=A();if(!r?.email)return o.saveStatus="Sign in with an email address before transferring ownership.",h();const s=document.querySelector("#story-transfer-email-input")?.value.trim()??"",n=document.querySelector("#story-transfer-confirm-input")?.value.trim()??"";if(!s)return o.saveStatus="Enter the recipient Gmail address first.",h();if(s.toLowerCase()===String(r.email).trim().toLowerCase())return o.saveStatus="You cannot transfer a story to your own email.",h();if(n!=="TRANSFER")return o.saveStatus="Type TRANSFER exactly to confirm ownership transfer.",h();await o.adapter.requestStoryTransfer(t.dataset.storyId,s,{id:r.id,name:Tt(r),email:r.email}),o.saveStatus="Ownership transfer request sent. The story stays with you until the recipient accepts.";const i=H();i.delete("transfer");const c=i.toString();return P(`/stories/${t.dataset.storyId}${c?`?${c}`:""}`)}if(a==="cancel-story-transfer")return await o.adapter.cancelStoryTransfer(t.dataset.storyId),o.saveStatus="Ownership transfer cancelled.",h();if(a==="accept-story-transfer"){const r=A();try{return await o.adapter.acceptStoryTransfer(t.dataset.storyId,{id:r.id,name:r.name,email:r.email,penName:r.penName??""}),o.saveStatus="Story ownership transferred to you.",P("/creator")}catch(s){return o.saveStatus=`Transfer accept failed: ${String(s?.message||s)}`,h()}}if(a==="decline-story-transfer"){const r=A();try{return await o.adapter.declineStoryTransfer(t.dataset.storyId,r.email),o.saveStatus="Ownership transfer declined.",h()}catch(s){return o.saveStatus=`Transfer decline failed: ${String(s?.message||s)}`,h()}}if(a==="create-arc"){const r=t.dataset.storyId,s=await o.adapter.createArc(r,`Arc ${Math.floor(Math.random()*90+10)}`);return P(`/stories/${r}/arcs/${s.id}`)}if(a==="save-arc-title")return await o.adapter.updateArc(t.dataset.arcId,{title:document.querySelector("#arc-title-input").value.trim()||"Untitled Arc"}),o.saveStatus="Arc title saved.",h();if(a==="add-soundtrack"){const r=await o.adapter.getChapter(t.dataset.chapterId),s=document.querySelector("#soundtrack-label-input")?.value.trim()??"",n=document.querySelector("#soundtrack-url-input")?.value.trim()??"",i=Xt({id:Zt("soundtrack"),label:s,url:n});return i?(await o.adapter.updateChapter(r.id,{soundtracks:[...r.soundtracks??[],{id:i.id,label:i.label,url:i.url}]}),o.saveStatus="Soundtrack added.",h()):(o.saveStatus="Please enter a valid YouTube link.",h())}if(a==="delete-soundtrack"){const r=await o.adapter.getChapter(t.dataset.chapterId);return await o.adapter.updateChapter(r.id,{soundtracks:(r.soundtracks??[]).filter(s=>s.id!==t.dataset.soundtrackId)}),o.saveStatus="Soundtrack removed.",h()}if(a==="move-arc-up"||a==="move-arc-down"){const r=await o.adapter.getStory(t.dataset.storyId),s=Number(t.dataset.index),n=a==="move-arc-up"?-1:1;return await o.adapter.reorderArcs(r.id,zt(r.arcIds,s,s+n)),h()}if(a==="create-chapter"){const r=await o.adapter.createChapter(t.dataset.arcId,"Untitled Chapter");return P(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}/chapters/${r.id}`)}if(a==="create-phase"){const r=window.prompt("Phase title","New Phase");return r===null?void 0:(await o.adapter.createPhase(t.dataset.arcId,r),o.saveStatus="Phase created.",h())}if(a==="rename-phase"){const r=window.prompt("Rename phase",t.dataset.phaseTitle||"Phase");if(r===null)return;const s=await o.adapter.getArc(t.dataset.arcId);return await o.adapter.renamePhase(t.dataset.arcId,t.dataset.phaseId,r),r.trim()?o.saveStatus="Phase renamed.":o.saveStatus=(s?.phases?.length??0)<=1?"Only phase restored to Chapters.":"Phase deleted. Its chapters were moved into the next phase.",h()}if(a==="open-transfer-chapter")return Sa({chapterId:t.dataset.chapterId,currentStoryId:t.dataset.storyId,currentArcId:t.dataset.arcId,currentPhaseId:t.dataset.phaseId});if(a==="move-chapter-up"||a==="move-chapter-down"){const r=await o.adapter.getArc(t.dataset.arcId),s=(r.phases??[]).find(c=>c.id===t.dataset.phaseId);if(!s)return;const n=Number(t.dataset.index),i=a==="move-chapter-up"?-1:1;return await o.adapter.reorderPhaseChapters(r.id,s.id,zt(s.chapterIds,n,n+i)),h()}if(a==="save-chapter"){const r=t.dataset.chapterId,s=qt();return await o.adapter.updateChapter(r,{title:document.querySelector("#chapter-title-input").value.trim()||"Untitled Chapter",body:s.body,renderMode:s.renderMode,htmlBackground:s.htmlBackground}),o.saveStatus="Chapter saved.",h()}if(a==="open-docx-import"){document.querySelector("#docx-import-input")?.click();return}if(a==="switch-markdown-mode")return window.confirm("Switch to Markdown Mode? This will clear the imported Word HTML from this chapter.")?(await o.adapter.updateChapter(o.route.params.chapterId,{body:"",renderMode:"markdown",htmlBackground:""}),o.saveStatus="Switched to Markdown Mode. Imported Word HTML was cleared.",h()):void 0;if(a==="clear-html-background"){const r=document.querySelector("#chapter-html-background-input");r&&(r.value="#120f0d");const s=document.querySelector("#chapter-render-mode-input");s&&(s.value="html"),Nt(),o.saveStatus="HTML background reset to the site background. Click Save to keep this.";const n=document.querySelector(".notice.mono");n&&(n.textContent=o.saveStatus);return}if(a==="save-pen-name"){const r=A(),s=document.querySelector("#pen-name-input").value.trim(),n=await o.adapter.updateUserProfile(r.id,{name:r.name,email:r.email,penName:s});return z({...r,penName:n.penName??"",name:n.name??r.name,email:n.email??r.email}),o.saveStatus=s?"Pen name saved.":"Pen name cleared. Account name will be used.",h()}if(a==="delete-story")return ft("story")?(await o.adapter.deleteStory(t.dataset.storyId),o.saveStatus="Story deleted.",P("/creator")):void 0;if(a==="delete-arc")return ft("arc")?(await o.adapter.deleteArc(t.dataset.arcId),o.saveStatus="Arc deleted.",P(`/stories/${t.dataset.storyId}`)):void 0;if(a==="delete-chapter")return ft("chapter")?(await o.adapter.deleteChapter(t.dataset.chapterId),o.saveStatus="Chapter deleted.",P(`/stories/${t.dataset.storyId}/arcs/${t.dataset.arcId}`)):void 0;if(a==="add-external-asset")try{return await $a(t.dataset.chapterId)}catch(r){return o.saveStatus=String(r.message||r),h()}if(a==="copy-asset-markdown"){try{await Ia(t.dataset.markdown??""),o.saveStatus="Image markdown copied to clipboard."}catch(s){o.saveStatus=`Copy failed: ${String(s.message||s)}`}const r=document.querySelector(".notice.mono");r&&(r.textContent=o.saveStatus);return}if(a==="delete-asset"){if(!ft("image"))return;try{return await Aa(t.dataset.chapterId,Number(t.dataset.assetIndex))}catch(r){return o.saveStatus=String(r.message||r),h()}}if(a==="replace-word-image")try{return await Ta(t.dataset.chapterId,Number(t.dataset.imageIndex))}catch(r){o.saveStatus=String(r.message||r);const s=document.querySelector(".notice.mono");s&&(s.textContent=o.saveStatus);return}if(a==="toggle-soundtrack"){if(!q())return;o.soundtrack.paused?Be():ee();return}if(a==="toggle-volume-popout"){if(!q())return;o.soundtrack.volumeOpen=!o.soundtrack.volumeOpen,nt();return}});document.addEventListener("change",async e=>{const t=e.target;if(t instanceof HTMLInputElement&&t.id==="docx-import-input"){const a=t.files?.[0];if(t.value="",!a)return;o.saveStatus="Importing Word file...";const r=document.querySelector(".notice.mono");r&&(r.textContent=o.saveStatus);try{await ea(a)}catch(s){o.saveStatus=`Word import failed: ${String(s.message||s)}`,r&&(r.textContent=o.saveStatus)}return}if(t instanceof HTMLSelectElement&&t.dataset.action==="move-chapter-phase")return await o.adapter.moveChapterToPhase(t.dataset.arcId,t.dataset.chapterId,t.value),o.saveStatus="Chapter moved to another phase.",h()});document.addEventListener("input",e=>{if(e.target instanceof HTMLInputElement&&e.target.dataset.action==="set-volume"){re(e.target.value);return}if(e.target instanceof HTMLInputElement&&e.target.dataset.action==="set-html-background"){Nt();return}if(e.target.id==="chapter-body-input"&&Nt(),e.target.id==="chapter-title-input"){const t=e.target.value.trim()||"Untitled chapter",a=document.querySelector(".page-title h2");a&&(a.textContent=t)}});document.addEventListener("click",e=>{const t=e.target;t instanceof Element&&(t.closest(".quick-tool-stack")||o.soundtrack.volumeOpen&&(o.soundtrack.volumeOpen=!1,nt()))});document.addEventListener("wheel",e=>{const t=e.target;t instanceof Element&&t.closest("[data-wheel-volume='true']")&&q()&&(e.preventDefault(),_e(e.deltaY<0?5:-5))},{passive:!1});document.addEventListener("dragover",e=>{if(o.route.name!=="chapter")return;e.preventDefault(),o.dragActive=!0;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.add("is-active")});document.addEventListener("dragleave",e=>{if(o.route.name!=="chapter"||e.relatedTarget)return;o.dragActive=!1;const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active")});document.addEventListener("drop",async e=>{if(o.route.name!=="chapter")return;e.preventDefault();const t=document.querySelector("[data-dropzone='assets']");t&&t.classList.remove("is-active");const a=[...e.dataTransfer.files].filter(r=>r.type.startsWith("image/"));a.length&&await ka(a)});window.addEventListener("hashchange",()=>{o.saveStatus="",window.scrollTo({top:0,left:0,behavior:"auto"}),dt()});async function Pa(){const e=Te();o.authClient=e,o.adapter=await $e(e),o.authClient.mode==="firebase"?o.authClient.watchAuth(t=>{t?(z({id:t.uid,name:t.displayName||t.email||"Creator",email:t.email,mode:"firebase"}),Gt().finally(()=>dt())):(z(null),dt())}):o.currentUser?.id&&await Gt(),window.location.hash?dt():P("/")}Pa().catch(e=>{St.innerHTML=`
    <main class="content">
      <section class="panel">
        <h2>App failed to start</h2>
        <p class="muted">${p(String(e.message||e))}</p>
        <p class="muted">Current mode: ${p(Ce().mode)}</p>
      </section>
    </main>
  `});
