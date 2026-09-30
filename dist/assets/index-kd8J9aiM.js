import{d as de,a as f,g as $,u as v,s as fe,b as te,q as ae,w as W,c as re,e as _t,f as Vt,i as zt,h as jt,j as Ht,G as Wt,o as Yt,k as Gt,l as Jt,m as Kt,n as Zt}from"./firebase-Bo9AT5dx.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function r(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=r(s);fetch(s.href,o)}})();const Qt="modulepreload",Xt=function(t){return"/ulunavir-tales/"+t},et={},ut=function(e,r,a){let s=Promise.resolve();if(r&&r.length>0){let l=function(d){return Promise.all(d.map(p=>Promise.resolve(p).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),c=i?.nonce||i?.getAttribute("nonce");s=l(r.map(d=>{if(d=Xt(d),d in et)return;et[d]=!0;const p=d.endsWith(".css"),m=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${m}`))return;const y=document.createElement("link");if(y.rel=p?"stylesheet":Qt,p||(y.as="script"),y.crossOrigin="",y.href=d,c&&y.setAttribute("nonce",c),document.head.appendChild(y),p)return new Promise((g,P)=>{y.addEventListener("load",g),y.addEventListener("error",()=>P(new Error(`Unable to preload CSS for ${d}`)))})}))}function o(i){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=i,window.dispatchEvent(c),!c.defaultPrevented)throw i}return s.then(i=>{for(const c of i||[])c.status==="rejected"&&o(c.reason);return e().catch(o)})},Pe="storyforge-state-v1",Fe="story-demo",Ee="arc-demo",Ae="chapter-demo",Se="Chapters";function T(t){return String(t??"").trim().toLowerCase()}function Me(t,e){const r=T(e);return!r||t?.pendingTransferStatus!=="pending"?!1:[t.pendingTransferEmailLower,T(t.pendingTransfer?.targetEmail)].includes(r)}const Ce={users:{"demo-user":{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",emailLower:"demo@storyforge.local",penName:""}},stories:{[Fe]:{id:Fe,title:"The Clockwork Harbor",coverImageUrl:"",coverImageMode:"fill",tags:["fantasy","mystery","serial"],visibility:"public",creatorId:"demo-user",creatorName:"Demo Creator",editorEmails:[],pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",arcIds:[Ee],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},arcs:{[Ee]:{id:Ee,storyId:Fe,title:"Tide One",coverImageUrl:"",coverImageMode:"fill",chapterIds:[Ae],soundtracks:[],phases:[{id:"phase-demo",title:Se,chapterIds:[Ae]}],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},chapters:{[Ae]:{id:Ae,arcId:Ee,title:"Lanterns on the Pier",body:`# Opening scene

A storm hangs over the harbor while the first lanterns come alive.`,published:!0,dmNotes:"",comments:[],reactions:{},renderMode:"markdown",htmlBackground:"",assets:[],soundtracks:[],videos:[],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}}};function V(t){return`${t}-${crypto.randomUUID().slice(0,8)}`}function tt(t){return JSON.parse(JSON.stringify(t))}function $e(t){return["fit","stretch"].includes(t)?t:"fill"}function D(t){return t.flatMap(e=>e.chapterIds??[])}function Ue(t,e,r){const a=[...t];return[a[e],a[r]]=[a[r],a[e]],a}function we(t=[]){return{id:V("phase"),title:Se,chapterIds:[...t]}}function K(t){const e=$e(t.coverImageMode),r=t.hasEverBeenPublished??t.published===!0;return{...t,body:t.body??"",coverImageUrl:t.coverImageUrl??"",coverImageMode:e,published:t.published??!0,hasEverBeenPublished:r,dmNotes:t.dmNotes??"",comments:t.comments??[],reactions:t.reactions??{},assets:t.assets??[],soundtracks:t.soundtracks??[],videos:t.videos??[],renderMode:t.renderMode??"markdown",htmlBackground:t.htmlBackground??""}}function B(t){const e=[...t.chapterIds??[]],r=Array.isArray(t.phases)&&t.phases.length?t.phases.map(i=>({id:i.id??V("phase"),title:i.title?.trim()||Se,chapterIds:[...i.chapterIds??[]]})):[we(e)],a=new Set;for(const i of r)i.chapterIds=i.chapterIds.filter(c=>!c||a.has(c)?!1:(a.add(c),!0));const s=e.filter(i=>!a.has(i));s.length&&r[0].chapterIds.push(...s);const o=D(r);return{...t,coverImageUrl:t.coverImageUrl??"",coverImageMode:$e(t.coverImageMode),chapterIds:o,soundtracks:t.soundtracks??[],phases:r}}function w(){const t=localStorage.getItem(Pe);if(!t)return localStorage.setItem(Pe,JSON.stringify(Ce)),tt(Ce);try{return JSON.parse(t)}catch{return localStorage.setItem(Pe,JSON.stringify(Ce)),tt(Ce)}}function S(t){localStorage.setItem(Pe,JSON.stringify(t))}function _(t,e){const r=(t.arcIds??[]).map(a=>e.arcs[a]).filter(Boolean).map(a=>xe(a,e));return{...t,coverImageUrl:t.coverImageUrl??"",coverImageMode:$e(t.coverImageMode),pendingTransfer:t.pendingTransfer??null,pendingTransferEmailLower:t.pendingTransferEmailLower??"",pendingTransferStatus:t.pendingTransferStatus??"",arcIds:t.arcIds??[],arcs:r}}function xe(t,e){const r=B(t),a=r.chapterIds.map(s=>e.chapters[s]).filter(Boolean).map(K);return{...r,chapterIds:r.chapterIds??[],chapters:a,phases:r.phases.map(s=>({...s,chapters:s.chapterIds.map(o=>e.chapters[o]).filter(Boolean).map(K)}))}}function H(t,e){const r=t.arcs[e];if(!r)return!1;const a=B(r),s=JSON.stringify({chapterIds:r.chapterIds??[],phases:r.phases??[]})!==JSON.stringify({chapterIds:a.chapterIds,phases:a.phases});return s&&(t.arcs[e]={...t.arcs[e],chapterIds:a.chapterIds,phases:a.phases}),s}function ea(){return{mode:"local",async getUserProfile(t){return t?w().users[t]??null:null},async updateUserProfile(t,e){const r=w(),a=r.users[t]??{id:t,name:e.name??"Creator",email:e.email??"",emailLower:T(e.email),penName:""};r.users[t]={...a,...e,emailLower:T(e.email??a.email)};const s=r.users[t].penName?.trim()||r.users[t].name||"Creator";for(const o of Object.values(r.stories))o.creatorId===t&&(o.creatorName=s);return S(r),r.users[t]},async listIncomingStoryTransfers(t){const e=w(),r=T(t);return r?Object.values(e.stories).filter(a=>a.pendingTransferStatus==="pending"&&a.pendingTransferEmailLower===r).sort((a,s)=>String(s.updatedAt).localeCompare(String(a.updatedAt))).map(a=>_(a,e)):[]},async listCreatorStories(t){if(!t)return[];const e=w();return Object.values(e.stories).filter(r=>r.creatorId===t).sort((r,a)=>a.updatedAt.localeCompare(r.updatedAt)).map(r=>({...G(r),arcs:(r.arcIds??[]).map(a=>({id:a}))}))},async listEditorStories(t){const e=T(t);if(!e)return[];const r=w();return Object.values(r.stories).filter(a=>(a.editorEmails??[]).includes(e)).sort((a,s)=>String(s.updatedAt).localeCompare(String(a.updatedAt))).map(a=>G(a))},async listBrowserStories(){const t=w();return Object.values(t.stories).filter(e=>e.visibility==="public").sort((e,r)=>e.creatorName.localeCompare(r.creatorName)||e.title.localeCompare(r.title)).map(e=>({...G(e),arcs:(e.arcIds??[]).map(r=>({id:r}))}))},async getStory(t){const e=w();let r=!1;for(const s of e.stories[t]?.arcIds??[])r=H(e,s)||r;r&&S(e);const a=e.stories[t];return a?_(a,e):null},async getArc(t){const e=w();H(e,t)&&S(e);const a=e.arcs[t];return a?xe(a,e):null},async getChapter(t){const r=w().chapters[t]??null;return r?K(r):null},async createStory({creatorId:t,creatorName:e,title:r,tags:a,visibility:s}){const o=w(),i=V("story"),c=new Date().toISOString();return o.stories[i]={id:i,title:r,coverImageUrl:"",coverImageMode:"fill",tags:a,visibility:s,creatorId:t,creatorName:e,editorEmails:[],arcIds:[],createdAt:c,updatedAt:c},S(o),_(o.stories[i],o)},async updateStory(t,e){const r=w();if(!r.stories[t])throw new Error("Story not found.");return r.stories[t]={...r.stories[t],...e,updatedAt:new Date().toISOString()},S(r),_(r.stories[t],r)},async addStoryEditor(t,e){const r=T(e);if(!r)throw new Error("Enter a valid editor email.");const a=w(),s=a.stories[t];if(!s)throw new Error("Story not found.");return s.editorEmails=[...new Set([...s.editorEmails??[],r])],s.updatedAt=new Date().toISOString(),S(a),_(s,a)},async removeStoryEditor(t,e){const r=T(e);if(!r)throw new Error("Choose an editor to remove.");const a=w(),s=a.stories[t];if(!s)throw new Error("Story not found.");return s.editorEmails=(s.editorEmails??[]).filter(o=>T(o)!==r),s.updatedAt=new Date().toISOString(),S(a),_(s,a)},async requestStoryTransfer(t,e,r){const a=w(),s=a.stories[t];if(!s)throw new Error("Story not found.");const o=T(e);if(!o)throw new Error("Enter a valid Gmail address.");return s.pendingTransfer={targetEmail:String(e).trim(),targetEmailLower:o,requestedBy:r?.id??s.creatorId,requestedByName:r?.name??s.creatorName,requestedAt:new Date().toISOString(),status:"pending"},s.pendingTransferEmailLower=o,s.pendingTransferStatus="pending",s.updatedAt=new Date().toISOString(),S(a),_(s,a)},async cancelStoryTransfer(t){const e=w(),r=e.stories[t];if(!r)throw new Error("Story not found.");return r.pendingTransfer=null,r.pendingTransferEmailLower="",r.pendingTransferStatus="",r.updatedAt=new Date().toISOString(),S(e),_(r,e)},async acceptStoryTransfer(t,e){const r=w(),a=r.stories[t];if(!a)throw new Error("Story not found.");if(!Me(a,e?.email))throw new Error("This transfer request is no longer available.");const s=T(e?.email),o=r.users[e.id]??{id:e.id,name:e.name??"Creator",email:e.email??"",emailLower:s,penName:e.penName??""};return r.users[e.id]=o,a.creatorId=e.id,a.creatorName=o.penName?.trim()||o.name||e.name||"Creator",a.pendingTransfer=null,a.pendingTransferEmailLower="",a.pendingTransferStatus="",a.updatedAt=new Date().toISOString(),S(r),_(a,r)},async declineStoryTransfer(t,e){const r=w(),a=r.stories[t];if(!a)throw new Error("Story not found.");if(!Me(a,e))throw new Error("This transfer request is no longer available.");return a.pendingTransfer=null,a.pendingTransferEmailLower="",a.pendingTransferStatus="",a.updatedAt=new Date().toISOString(),S(r),_(a,r)},async createArc(t,e){const r=w(),a=r.stories[t];if(!a)throw new Error("Story not found.");const s=V("arc"),o=new Date().toISOString();return r.arcs[s]={id:s,storyId:t,title:e,coverImageUrl:"",coverImageMode:"fill",chapterIds:[],soundtracks:[],phases:[we()],createdAt:o,updatedAt:o},a.arcIds.push(s),a.updatedAt=o,S(r),xe(r.arcs[s],r)},async updateArc(t,e){const r=w(),a=r.arcs[t];if(!a)throw new Error("Arc not found.");return a.title=e.title??a.title,a.coverImageUrl=e.coverImageUrl??a.coverImageUrl??"",a.coverImageMode=$e(e.coverImageMode??a.coverImageMode),a.phases=e.phases??a.phases,a.chapterIds=e.chapterIds??a.chapterIds,a.soundtracks=e.soundtracks??a.soundtracks??[],a.updatedAt=new Date().toISOString(),r.stories[a.storyId].updatedAt=a.updatedAt,S(r),xe(a,r)},async reorderArcs(t,e){const r=w();r.stories[t].arcIds=[...e],r.stories[t].updatedAt=new Date().toISOString(),S(r)},async createChapter(t,e){const r=w(),a=r.arcs[t];if(!a)throw new Error("Arc not found.");const s=V("chapter"),o=new Date().toISOString();return r.chapters[s]={id:s,arcId:t,title:e,body:"",coverImageUrl:"",coverImageMode:"fill",published:!1,hasEverBeenPublished:!1,dmNotes:"",comments:[],reactions:{},renderMode:"markdown",htmlBackground:"",assets:[],soundtracks:[],videos:[],createdAt:o,updatedAt:o},a.chapterIds.push(s),a.phases?.length||(a.phases=[we()]),a.phases[a.phases.length-1].chapterIds.push(s),a.updatedAt=o,r.stories[a.storyId].updatedAt=o,S(r),K(r.chapters[s])},async updateChapter(t,e){const r=w();if(!r.chapters[t])throw new Error("Chapter not found.");r.chapters[t]={...r.chapters[t],...e,updatedAt:new Date().toISOString()};const a=r.arcs[r.chapters[t].arcId];return a&&(a.updatedAt=r.chapters[t].updatedAt,r.stories[a.storyId].updatedAt=a.updatedAt),S(r),r.chapters[t]},async updateChapterEngagement(t,e){const r=w();if(!r.chapters[t])throw new Error("Chapter not found.");return r.chapters[t]={...r.chapters[t],...e,updatedAt:new Date().toISOString()},S(r),K(r.chapters[t])},async updateChapterOrder(t,e){const r=w();r.arcs[t].chapterIds=[...e],r.arcs[t].updatedAt=new Date().toISOString(),r.stories[r.arcs[t].storyId].updatedAt=r.arcs[t].updatedAt,S(r)},async createPhase(t,e){const r=w();H(r,t);const a=r.arcs[t],s={id:V("phase"),title:e?.trim()||"New Phase",chapterIds:[]};return a.phases.push(s),a.updatedAt=new Date().toISOString(),r.stories[a.storyId].updatedAt=a.updatedAt,S(r),s},async renamePhase(t,e,r){const a=w();H(a,t);const s=a.arcs[t],o=s.phases.find(c=>c.id===e);if(!o)throw new Error("Phase not found.");const i=r?.trim()??"";if(i)o.title=i;else if(s.phases.length<=1)o.title=Se;else{const c=s.phases.findIndex(p=>p.id===e),l=c<s.phases.length-1?c+1:c-1,d=s.phases[l];d.chapterIds=[...o.chapterIds??[],...d.chapterIds??[]],s.phases=s.phases.filter(p=>p.id!==e),s.chapterIds=D(s.phases)}return s.updatedAt=new Date().toISOString(),a.stories[s.storyId].updatedAt=s.updatedAt,S(a),s.phases.find(c=>c.id===e)??null},async moveChapterToPhase(t,e,r){const a=w();H(a,t);const s=a.arcs[t];for(const i of s.phases)i.chapterIds=i.chapterIds.filter(c=>c!==e);const o=s.phases.find(i=>i.id===r);if(!o)throw new Error("Phase not found.");o.chapterIds.push(e),s.chapterIds=D(s.phases),s.updatedAt=new Date().toISOString(),a.stories[s.storyId].updatedAt=s.updatedAt,S(a)},async moveChapter(t,e,r){const a=w();H(a,t);const s=a.arcs[t];if(!s)throw new Error("Arc not found.");const o=s.phases.map(d=>({...d,chapterIds:[...d.chapterIds??[]]})),i=o.findIndex(d=>d.chapterIds.includes(e));if(i<0)throw new Error("Chapter phase not found.");const c=o[i].chapterIds.indexOf(e);if(r==="up")if(c>0)o[i].chapterIds=Ue(o[i].chapterIds,c,c-1);else if(i>0)o[i].chapterIds.shift(),o[i-1].chapterIds.push(e);else return;else if(r==="down")if(c<o[i].chapterIds.length-1)o[i].chapterIds=Ue(o[i].chapterIds,c,c+1);else if(i<o.length-1)o[i].chapterIds.pop(),o[i+1].chapterIds.unshift(e);else return;else throw new Error("Unknown chapter move direction.");const l=new Date().toISOString();s.phases=o,s.chapterIds=D(o),s.updatedAt=l,a.stories[s.storyId].updatedAt=l,S(a)},async transferChapter(t,e,r){const a=w(),s=a.chapters[t],o=a.arcs[e];if(!s)throw new Error("Chapter not found.");if(!o)throw new Error("Target arc not found.");H(a,s.arcId),H(a,e);const i=a.arcs[s.arcId],c=a.arcs[e];if(!(c.phases??[]).find(p=>p.id===r))throw new Error("Target phase not found.");const d=new Date().toISOString();return i&&(i.chapterIds=(i.chapterIds??[]).filter(p=>p!==t),i.phases=(i.phases??[]).map(p=>({...p,chapterIds:(p.chapterIds??[]).filter(m=>m!==t)})),i.updatedAt=d,a.stories[i.storyId]&&(a.stories[i.storyId].updatedAt=d)),c.phases=(c.phases??[]).map(p=>p.id===r?{...p,chapterIds:[...p.chapterIds??[],t]}:p),c.chapterIds=D(c.phases),c.updatedAt=d,a.stories[c.storyId]&&(a.stories[c.storyId].updatedAt=d),a.chapters[t]={...s,arcId:e,updatedAt:d},S(a),a.chapters[t]},async reorderPhaseChapters(t,e,r){const a=w();H(a,t);const s=a.arcs[t],o=s.phases.find(i=>i.id===e);if(!o)throw new Error("Phase not found.");o.chapterIds=[...r],s.chapterIds=D(s.phases),s.updatedAt=new Date().toISOString(),a.stories[s.storyId].updatedAt=s.updatedAt,S(a)},async deleteChapter(t){const e=w(),r=e.chapters[t];if(!r)return;const a=e.arcs[r.arcId];if(a){a.chapterIds=(a.chapterIds??[]).filter(o=>o!==t),a.phases=(a.phases??[]).map(o=>({...o,chapterIds:(o.chapterIds??[]).filter(i=>i!==t)})),a.updatedAt=new Date().toISOString();const s=e.stories[a.storyId];s&&(s.updatedAt=a.updatedAt)}delete e.chapters[t],S(e)},async deleteArc(t){const e=w(),r=e.arcs[t];if(!r)return;for(const s of r.chapterIds??[])delete e.chapters[s];const a=e.stories[r.storyId];a&&(a.arcIds=(a.arcIds??[]).filter(s=>s!==t),a.updatedAt=new Date().toISOString()),delete e.arcs[t],S(e)},async deleteStory(t){const e=w(),r=e.stories[t];if(r){for(const a of r.arcIds??[]){const s=e.arcs[a];for(const o of s?.chapterIds??[])delete e.chapters[o];delete e.arcs[a]}delete e.stories[t],S(e)}}}}function G(t){return{...t,coverImageUrl:t.coverImageUrl??"",coverImageMode:$e(t.coverImageMode),pendingTransfer:t.pendingTransfer??null,pendingTransferEmailLower:t.pendingTransferEmailLower??"",pendingTransferStatus:t.pendingTransferStatus??"",arcIds:t.arcIds??[],tags:t.tags??[],editorEmails:t.editorEmails??[],arcs:(t.arcIds??[]).map(e=>({id:e}))}}function I(t){return t.exists()?{id:t.id,...t.data()}:null}function Le(t,e){const r=new Map(e.map((a,s)=>[a,s]));return[...t].sort((a,s)=>(r.get(a.id)??0)-(r.get(s.id)??0))}async function O(t,e){const r=await $(f(t,"stories",e)),a=I(r);if(!a)return null;const s=await te(ae(re(t,"arcs"),W("storyId","==",e))),o=[];for(const l of Le(s.docs.map(d=>({id:d.id,...d.data(),chapterIds:d.data().chapterIds??[]})),a.arcIds??[])){const d=B(l);o.push(d)}const i=await Promise.all(o.map(async l=>{const d=await te(ae(re(t,"chapters"),W("arcId","==",l.id)));return[l.id,Le(d.docs.map(p=>K({id:p.id,...p.data()})),l.chapterIds??[])]})),c=Object.fromEntries(i);return{...G(a),tags:a.tags??[],arcIds:a.arcIds??[],arcs:o.map(l=>({...l,chapterIds:l.chapterIds??[],phases:l.phases.map(d=>({...d,chapters:(c[l.id]??[]).filter(p=>(d.chapterIds??[]).includes(p.id))})),chapters:c[l.id]??[]}))}}async function at(t,e){if(!e?.id)return;const r=f(t,"users",e.id),a=await $(r),s=a.exists()?a.data():{},o=e.email??s.email??"",i={id:e.id,name:e.name??s.name??"Creator",email:o,emailLower:T(o),penName:e.penName??s.penName??"",structureView:e.structureView??s.structureView??"list",updatedAt:new Date().toISOString()};if(a.exists()){await v(r,i);return}await fe(r,{...i,createdAt:new Date().toISOString()})}function ta(t){const e=t.db;return{mode:"firebase",async getUserProfile(r){if(!r)return null;const a=await $(f(e,"users",r));return I(a)},async updateUserProfile(r,a){const s=f(e,"users",r),o=await $(s),i={id:r,updatedAt:new Date().toISOString(),...a,emailLower:T(a.email??(o.exists()?o.data().email:""))};o.exists()?await v(s,i):await fe(s,{createdAt:new Date().toISOString(),...i});const c=await $(s),l=I(c),d=l?.penName?.trim()||l?.name||"Creator",p=await te(ae(re(e,"stories"),W("creatorId","==",r)));return await Promise.all(p.docs.map(m=>v(f(e,"stories",m.id),{creatorName:d}))),l},async listIncomingStoryTransfers(r){const a=T(r);return a?(await te(ae(re(e,"stories"),W("pendingTransferStatus","==","pending"),W("pendingTransferEmailLower","==",a)))).docs.map(o=>G({id:o.id,...o.data()})).sort((o,i)=>String(i.updatedAt).localeCompare(String(o.updatedAt))):[]},async listCreatorStories(r){return r?(await te(ae(re(e,"stories"),W("creatorId","==",r)))).docs.map(s=>G({id:s.id,...s.data()})).sort((s,o)=>String(o.updatedAt).localeCompare(String(s.updatedAt))):[]},async listEditorStories(r){const a=T(r);return a?(await te(ae(re(e,"stories"),W("editorEmails","array-contains",a)))).docs.map(o=>G({id:o.id,...o.data()})).sort((o,i)=>String(i.updatedAt).localeCompare(String(o.updatedAt))):[]},async listBrowserStories(){return(await te(ae(re(e,"stories"),W("visibility","==","public")))).docs.map(a=>G({id:a.id,...a.data()})).sort((a,s)=>a.creatorName.localeCompare(s.creatorName)||a.title.localeCompare(s.title))},async getStory(r){return O(e,r)},async getArc(r){const a=await $(f(e,"arcs",r)),s=I(a),o=s?B(s):null;if(!o)return null;const i=await te(ae(re(e,"chapters"),W("arcId","==",r)));return{...o,chapterIds:o.chapterIds??[],phases:o.phases.map(c=>({...c,chapters:Le(i.docs.map(l=>K({id:l.id,...l.data()})).filter(l=>(c.chapterIds??[]).includes(l.id)),c.chapterIds??[])})),chapters:Le(i.docs.map(c=>K({id:c.id,...c.data()})),o.chapterIds??[])}},async getChapter(r){const a=await $(f(e,"chapters",r)),s=I(a);return s?K(s):null},async createStory({creatorId:r,creatorName:a,title:s,tags:o,visibility:i}){const c=V("story"),l=new Date().toISOString(),d={id:c,title:s,coverImageUrl:"",coverImageMode:"fill",tags:o,visibility:i,creatorId:r,creatorName:a,editorEmails:[],arcIds:[],createdAt:l,updatedAt:l};return await fe(f(e,"stories",c),d),await at(e,{id:r,name:a}),G(d)},async updateStory(r,a){return await v(f(e,"stories",r),{...a,updatedAt:new Date().toISOString()}),O(e,r)},async addStoryEditor(r,a){const s=T(a);if(!s)throw new Error("Enter a valid editor email.");const o=await O(e,r);if(!o)throw new Error("Story not found.");const i=[...new Set([...o.editorEmails??[],s])];return await v(f(e,"stories",r),{editorEmails:i,updatedAt:new Date().toISOString()}),O(e,r)},async removeStoryEditor(r,a){const s=T(a);if(!s)throw new Error("Choose an editor to remove.");const o=await O(e,r);if(!o)throw new Error("Story not found.");const i=(o.editorEmails??[]).filter(c=>T(c)!==s);return await v(f(e,"stories",r),{editorEmails:i,updatedAt:new Date().toISOString()}),O(e,r)},async requestStoryTransfer(r,a,s){const o=T(a);if(!o)throw new Error("Enter a valid Gmail address.");return await v(f(e,"stories",r),{pendingTransfer:{targetEmail:String(a).trim(),targetEmailLower:o,requestedBy:s?.id??"",requestedByName:s?.name??"Creator",requestedAt:new Date().toISOString(),status:"pending"},pendingTransferEmailLower:o,pendingTransferStatus:"pending",updatedAt:new Date().toISOString()}),O(e,r)},async cancelStoryTransfer(r){return await v(f(e,"stories",r),{pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:new Date().toISOString()}),O(e,r)},async acceptStoryTransfer(r,a){const s=await O(e,r);if(!s)throw new Error("Story not found.");if(!Me(s,a?.email))throw new Error("This transfer request is no longer available.");T(a?.email),await at(e,a);const o=await $(f(e,"users",a.id)),i=I(o)??a,c=i.penName?.trim()||i.name||a.name||"Creator",l=new Date().toISOString();return await v(f(e,"stories",r),{creatorId:a.id,creatorName:c,pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:l}),O(e,r)},async declineStoryTransfer(r,a){const s=await O(e,r);if(!s)throw new Error("Story not found.");if(!Me(s,a))throw new Error("This transfer request is no longer available.");return await v(f(e,"stories",r),{pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:new Date().toISOString()}),O(e,r)},async createArc(r,a){const s=f(e,"stories",r),o=await $(s),i=I(o);if(!i)throw new Error("Story not found.");const c=V("arc"),l=new Date().toISOString(),d={id:c,storyId:r,title:a,coverImageUrl:"",coverImageMode:"fill",chapterIds:[],soundtracks:[],phases:[we()],createdAt:l,updatedAt:l};return await fe(f(e,"arcs",c),d),await v(s,{arcIds:[...i.arcIds??[],c],updatedAt:l}),d},async updateArc(r,a){const s=f(e,"arcs",r),o=new Date().toISOString();await v(s,{...a,updatedAt:o});const i=await $(s),c=I(i);return c?.storyId&&await v(f(e,"stories",c.storyId),{updatedAt:o}),this.getArc(r)},async reorderArcs(r,a){await v(f(e,"stories",r),{arcIds:a,updatedAt:new Date().toISOString()})},async createChapter(r,a){const s=f(e,"arcs",r),o=await $(s),i=I(o);if(!i)throw new Error("Arc not found.");const c=V("chapter"),l=new Date().toISOString(),d={id:c,arcId:r,title:a,body:"",coverImageUrl:"",coverImageMode:"fill",published:!1,hasEverBeenPublished:!1,dmNotes:"",comments:[],reactions:{},renderMode:"markdown",htmlBackground:"",assets:[],soundtracks:[],videos:[],createdAt:l,updatedAt:l};await fe(f(e,"chapters",c),d);const p=B(i);return p.phases.length||(p.phases=[we()]),p.phases[p.phases.length-1].chapterIds.push(c),await v(s,{chapterIds:[...i.chapterIds??[],c],phases:p.phases,updatedAt:l}),await v(f(e,"stories",i.storyId),{updatedAt:l}),d},async updateChapter(r,a){const s=f(e,"chapters",r),o=new Date().toISOString();await v(s,{...a,updatedAt:o});const i=await $(s),c=I(i);if(c?.arcId){const l=await $(f(e,"arcs",c.arcId)),d=I(l);d&&(await v(f(e,"arcs",d.id),{updatedAt:o}),await v(f(e,"stories",d.storyId),{updatedAt:o}))}return this.getChapter(r)},async updateChapterEngagement(r,a){const s=f(e,"chapters",r);return await v(s,{...a,updatedAt:new Date().toISOString()}),this.getChapter(r)},async updateChapterOrder(r,a){const s=f(e,"arcs",r),o=new Date().toISOString();await v(s,{chapterIds:a,updatedAt:o});const i=await $(s),c=I(i);c?.storyId&&await v(f(e,"stories",c.storyId),{updatedAt:o})},async createPhase(r,a){const s=f(e,"arcs",r),o=await $(s),i=I(o),c=i?B(i):null;if(!c)throw new Error("Arc not found.");const l={id:V("phase"),title:a?.trim()||"New Phase",chapterIds:[]},d=[...c.phases,l],p=new Date().toISOString();return await v(s,{phases:d,chapterIds:D(d),updatedAt:p}),await v(f(e,"stories",c.storyId),{updatedAt:p}),l},async renamePhase(r,a,s){const o=f(e,"arcs",r),i=await $(o),c=I(i),l=c?B(c):null;if(!l)throw new Error("Arc not found.");const d=l.phases.find(g=>g.id===a);if(!d)throw new Error("Phase not found.");const p=s?.trim()??"";let m;if(p)m=l.phases.map(g=>g.id===a?{...g,title:p}:g);else if(l.phases.length<=1)m=l.phases.map(g=>g.id===a?{...g,title:Se}:g);else{const g=l.phases.findIndex(E=>E.id===a),P=g<l.phases.length-1?g+1:g-1;m=l.phases.map((E,F)=>F===P?{...E,chapterIds:[...d.chapterIds??[],...E.chapterIds??[]]}:E).filter(E=>E.id!==a)}const y=new Date().toISOString();return await v(o,{phases:m,chapterIds:D(m),updatedAt:y}),await v(f(e,"stories",l.storyId),{updatedAt:y}),m.find(g=>g.id===a)},async moveChapterToPhase(r,a,s){const o=f(e,"arcs",r),i=await $(o),c=I(i),l=c?B(c):null;if(!l)throw new Error("Arc not found.");const d=l.phases.map(y=>({...y,chapterIds:(y.chapterIds??[]).filter(g=>g!==a)})),p=d.find(y=>y.id===s);if(!p)throw new Error("Phase not found.");p.chapterIds.push(a);const m=new Date().toISOString();await v(o,{phases:d,chapterIds:D(d),updatedAt:m}),await v(f(e,"stories",l.storyId),{updatedAt:m})},async moveChapter(r,a,s){const o=f(e,"arcs",r),i=await $(o),c=I(i),l=c?B(c):null;if(!l)throw new Error("Arc not found.");const d=l.phases.map(g=>({...g,chapterIds:[...g.chapterIds??[]]})),p=d.findIndex(g=>g.chapterIds.includes(a));if(p<0)throw new Error("Chapter phase not found.");const m=d[p].chapterIds.indexOf(a);if(s==="up")if(m>0)d[p].chapterIds=Ue(d[p].chapterIds,m,m-1);else if(p>0)d[p].chapterIds.shift(),d[p-1].chapterIds.push(a);else return;else if(s==="down")if(m<d[p].chapterIds.length-1)d[p].chapterIds=Ue(d[p].chapterIds,m,m+1);else if(p<d.length-1)d[p].chapterIds.pop(),d[p+1].chapterIds.unshift(a);else return;else throw new Error("Unknown chapter move direction.");const y=new Date().toISOString();await v(o,{phases:d,chapterIds:D(d),updatedAt:y}),await v(f(e,"stories",l.storyId),{updatedAt:y})},async transferChapter(r,a,s){const o=f(e,"chapters",r),i=await $(o),c=I(i);if(!c)throw new Error("Chapter not found.");const l=f(e,"arcs",c.arcId),d=f(e,"arcs",a),[p,m]=await Promise.all([$(l),$(d)]),y=I(p),g=I(m),P=y?B(y):null,E=g?B(g):null;if(!P)throw new Error("Source arc not found.");if(!E)throw new Error("Target arc not found.");if(!(E.phases??[]).find(N=>N.id===s))throw new Error("Target phase not found.");const C=P.phases.map(N=>({...N,chapterIds:(N.chapterIds??[]).filter(b=>b!==r)})),x=E.phases.map(N=>N.id===s?{...N,chapterIds:[...N.chapterIds??[],r]}:N),A=new Date().toISOString();return await Promise.all([v(l,{phases:C,chapterIds:D(C),updatedAt:A}),v(d,{phases:x,chapterIds:D(x),updatedAt:A}),v(o,{arcId:a,updatedAt:A})]),await Promise.all([v(f(e,"stories",P.storyId),{updatedAt:A}),v(f(e,"stories",E.storyId),{updatedAt:A})]),this.getChapter(r)},async reorderPhaseChapters(r,a,s){const o=f(e,"arcs",r),i=await $(o),c=I(i),l=c?B(c):null;if(!l)throw new Error("Arc not found.");const d=l.phases.map(m=>m.id===a?{...m,chapterIds:[...s]}:m),p=new Date().toISOString();await v(o,{phases:d,chapterIds:D(d),updatedAt:p}),await v(f(e,"stories",l.storyId),{updatedAt:p})},async deleteChapter(r){const a=await $(f(e,"chapters",r)),s=I(a);if(!s)return;const o=f(e,"arcs",s.arcId),i=await $(o),c=I(i),l=new Date().toISOString();c&&(await v(o,{chapterIds:(c.chapterIds??[]).filter(d=>d!==r),phases:(c.phases??[]).map(d=>({...d,chapterIds:(d.chapterIds??[]).filter(p=>p!==r)})),updatedAt:l}),await v(f(e,"stories",c.storyId),{updatedAt:l})),await de(f(e,"chapters",r))},async deleteArc(r){const a=await $(f(e,"arcs",r)),s=I(a);if(!s)return;for(const l of s.chapterIds??[])await de(f(e,"chapters",l));const o=f(e,"stories",s.storyId),i=await $(o),c=I(i);c&&await v(o,{arcIds:(c.arcIds??[]).filter(l=>l!==r),updatedAt:new Date().toISOString()}),await de(f(e,"arcs",r))},async deleteStory(r){const a=await O(e,r);if(a){for(const s of a.arcs??[]){for(const o of s.chapters??[])await de(f(e,"chapters",o.id));await de(f(e,"arcs",s.id))}await de(f(e,"stories",r))}}}}async function aa(t){return t?.mode==="firebase"&&t.db?ta(t):ea()}const ra={VITE_APP_MODE:"firebase",VITE_FIREBASE_API_KEY:"AIzaSyC8-b4_lzrCk2RhsqSEMkcxNKgMzVx_WJ4",VITE_FIREBASE_APP_ID:"1:309677315541:web:ef90a15da4ee29c03fd95c",VITE_FIREBASE_AUTH_DOMAIN:"ulunavir-tales.firebaseapp.com",VITE_FIREBASE_MESSAGING_SENDER_ID:"309677315541",VITE_FIREBASE_PROJECT_ID:"ulunavir-tales",VITE_FIREBASE_STORAGE_BUCKET:"ulunavir-tales.firebasestorage.app"},je={mode:"local",announcementApiUrl:"",publicAppUrl:"",firebase:{apiKey:"",authDomain:"",projectId:"",appId:"",storageBucket:"",messagingSenderId:""}};function sa(){const t=ra??{};return{mode:t.VITE_APP_MODE??je.mode,announcementApiUrl:t.VITE_ANNOUNCEMENT_API_URL??"",publicAppUrl:t.VITE_PUBLIC_APP_URL??"",firebase:{apiKey:t.VITE_FIREBASE_API_KEY??"",authDomain:t.VITE_FIREBASE_AUTH_DOMAIN??"",projectId:t.VITE_FIREBASE_PROJECT_ID??"",appId:t.VITE_FIREBASE_APP_ID??"",storageBucket:t.VITE_FIREBASE_STORAGE_BUCKET??"",messagingSenderId:t.VITE_FIREBASE_MESSAGING_SENDER_ID??""}}}function pt(){const t=globalThis.STORYFORGE_CONFIG??{},e=sa();return{...je,...e,...t,firebase:{...je.firebase,...e.firebase,...t.firebase??{}}}}function na(t){return t.mode==="firebase"&&!!(t.firebase.projectId&&t.firebase.apiKey&&t.firebase.appId)}function oa(){const t=pt();if(!na(t))return{mode:"local",auth:null,db:null,signIn:async()=>null,signOut:async()=>null,watchAuth:o=>(o(null),()=>{})};const e=_t().length?Vt():zt(t.firebase),r=jt(e),a=Ht(e),s=new Wt;return s.addScope("email"),s.addScope("profile"),s.setCustomParameters({prompt:"select_account"}),{mode:"firebase",auth:r,db:a,signIn:async()=>(await Zt(r,s)).user,signInWithRedirect:async()=>{await Kt(r,s)},getRedirectUser:async()=>(await Jt(r))?.user??null,signOut:async()=>Gt(r),watchAuth:o=>Yt(r,o)}}function Re(){return pt()}const qe=document.querySelector("#app"),n={adapter:null,authClient:null,currentUser:JSON.parse(localStorage.getItem("storyforge-session")??"null"),route:{name:"home",params:{}},dragActive:!1,saveStatus:"",authError:"",authErrorCode:"",loadError:"",soundtrack:{arcId:"",queue:[],currentIndex:0,paused:!0,volume:70,volumeOpen:!1,mode:"idle",ready:!1,autoplayAttempted:!1,activeKey:"",youtubePlayer:null,syncToken:0,manualPause:!1,recoveryTimer:null,recoveryAttempts:0,cueObserver:null,cueMode:!1}},mt="storyforge-soundtrack-state";function ia(){try{const t=localStorage.getItem(mt);return t?JSON.parse(t):{}}catch{return{}}}function Ge(){const{arcId:t,currentIndex:e,paused:r,volume:a}=n.soundtrack;localStorage.setItem(mt,JSON.stringify({arcId:t,currentIndex:e,paused:r,volume:a}))}function Ne(t=k()){return t?t.penName?.trim()||t.name||"Creator":"Guest"}function ca(t,e,r){const a=Re().publicAppUrl?.trim(),s=`${window.location.origin}${window.location.pathname}`;return`${(a||s).replace(/#.*$/,"").replace(/\/?$/,"/")}#/stories/${encodeURIComponent(t)}/arcs/${encodeURIComponent(e)}/chapters/${encodeURIComponent(r)}?view=browser`}async function da({storyId:t,arcId:e,chapterId:r}){const a=Re().announcementApiUrl?.trim();if(!a)return{skipped:!0,reason:"Announcement API is not configured."};const s=n.authClient?.auth?.currentUser;if(!s?.getIdToken)throw new Error("A Firebase sign-in is required for Discord announcements.");const o=await s.getIdToken(),i=await fetch(a,{method:"POST",headers:{Authorization:`Bearer ${o}`,"Content-Type":"application/json"},body:JSON.stringify({storyId:t,arcId:e,chapterId:r,chapterUrl:ca(t,e,r)})}),c=await i.json().catch(()=>({}));if(!i.ok)throw new Error(c.error||`Announcement request failed (${i.status}).`);return c}function la(t){const e=Re().announcementApiUrl?.trim();if(!e)return"";const r=new URL(e,window.location.href);return r.pathname=`/api/${t}`,r.search="",r.hash="",r.toString()}async function _e(t,e){const r=la("chapter-engagement");if(!r)throw new Error("Chapter engagement API is not configured.");const a=n.authClient?.auth?.currentUser;if(!a?.getIdToken)throw new Error("A Firebase sign-in is required for comments and reactions.");const s=await a.getIdToken(),o=await fetch(r,{method:"POST",headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json"},body:JSON.stringify({action:t,storyId:n.route.params.storyId,arcId:n.route.params.arcId,...e})}),i=await o.json().catch(()=>({}));if(!o.ok)throw new Error(i.error||`Chapter engagement request failed (${o.status}).`);return i}function pe(t=k()){const e=t?.readerSettings??{};return{fontSize:Math.max(14,Math.min(24,Number(e.fontSize)||17)),lineHeight:Math.max(1.4,Math.min(2.4,Number(e.lineHeight)||1.85)),width:Math.max(620,Math.min(1200,Number(e.width)||920))}}function X(t){return t?.published!==!1}function He(t,e){return e||X(t)}function z(t){n.currentUser=t,localStorage.setItem("storyforge-session",JSON.stringify(t))}function ua(){document.querySelectorAll(".modal-backdrop").forEach(t=>t.remove())}function U(t){const e=`#${t}`;if(window.location.hash===e){ye(),window.scrollTo({top:0,left:0,behavior:"auto"});return}window.location.hash=t}function pa(){const t=window.location.hash.replace(/^#/,"")||"/",[e]=t.split("?"),r=e.split("/").filter(Boolean);return r.length===0?{name:"home",params:{}}:r[0]==="creator"?{name:"creator",params:{}}:r[0]==="browser"?{name:"browser",params:{}}:r[0]==="settings"?{name:"settings",params:{}}:r[0]==="stories"&&r[1]?r[2]==="arcs"&&r[3]&&r[4]==="chapters"&&r[5]?{name:"chapter",params:{storyId:r[1],arcId:r[3],chapterId:r[5]}}:r[2]==="arcs"&&r[3]?{name:"arc",params:{storyId:r[1],arcId:r[3]}}:{name:"story",params:{storyId:r[1]}}:{name:"not-found",params:{}}}function Z(){return new URLSearchParams(window.location.hash.split("?")[1]??"")}function k(){return n.currentUser?n.currentUser:n.authClient?.mode==="firebase"?null:{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",mode:"demo",structureView:"list"}}function ht(t){return!!(t?.creatorId&&k()?.id&&t.creatorId===k().id)}function ue(t){return String(t??"").trim().toLowerCase()}async function ma(){const t=k(),e=ue(t?.email);if(e)return e;if(!t?.id||!n.adapter?.getUserProfile)return"";const r=await n.adapter.getUserProfile(t.id),a=ue(r?.email);return a&&z({...t,email:r.email,name:r.name||t.name,penName:r.penName??t.penName??"",structureView:r.structureView??t.structureView??"list",readerSettings:r.readerSettings??t.readerSettings??pe(t)}),a}function ha(t){const e=ue(k()?.email);return!!(e&&(t?.editorEmails??[]).includes(e))}function Ie(t){return ht(t)||ha(t)}function Je(t){return t?.visibility!=="private"||Ie(t)}function u(t){return t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function ge(t){return`${t}-${crypto.randomUUID().slice(0,8)}`}function ft(t,e="Soundtrack"){return t?.trim()||e}function gt(t){try{const e=new URL(t);if(e.hostname==="youtu.be")return e.pathname.replace(/\//g,"")||null;if(e.hostname.includes("youtube.com")){if(e.pathname==="/watch")return e.searchParams.get("v");const r=e.pathname.split("/").filter(Boolean);if(["embed","shorts","live"].includes(r[0]))return r[1]??null}}catch{return null}return null}function vt(t){try{const e=new URL(t),r=e.searchParams.get("t")??e.searchParams.get("start")??e.searchParams.get("time_continue");if(!r)return 0;if(/^\d+$/.test(r))return Math.max(0,Number(r));const a=r.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/i);if(!a)return 0;const s=Number(a[1]??0),o=Number(a[2]??0),i=Number(a[3]??0);return s*3600+o*60+i}catch{return 0}}function yt(t){const e=t?.url?.trim(),r=e&&!/^https?:\/\//i.test(e)?`https://${e}`:e;if(!r)return null;const a=gt(r);return a?{id:t.id??ge("soundtrack"),label:ft(t.label,"YouTube track"),url:r,source:"youtube",videoId:a,startSeconds:vt(r)}:null}function wt(t){const e=t?.url?.trim(),r=e&&!/^https?:\/\//i.test(e)?`https://${e}`:e;if(!r)return null;const a=gt(r);return a?{id:t.id??ge("video"),label:ft(t.label,"YouTube video"),url:r,source:"youtube",videoId:a,startSeconds:vt(r)}:null}function bt(t=[]){return t.map(yt).filter(Boolean)}function fa(t=[]){return new Map(bt(t).map(e=>[e.id,e.label]))}function ga(t=[]){return new Map(t.map(wt).filter(Boolean).map(e=>[e.id,e]))}function va(t){return ce(t)==="markdown"&&/\[music:\s*[^\]]+\]/i.test(t?.body??"")}function St(){n.soundtrack.cueObserver&&(n.soundtrack.cueObserver.disconnect(),n.soundtrack.cueObserver=null)}function ya(){let t=document.querySelector("#soundtrack-layer");return t||(t=document.createElement("div"),t.id="soundtrack-layer",t.innerHTML=`
    <div id="youtube-soundtrack-host"></div>
  `,document.body.append(t),t)}function wa(t,e){return e()?Promise.resolve():new Promise((r,a)=>{const s=[...document.querySelectorAll("script")].find(i=>i.src===t);if(s){s.addEventListener("load",()=>r(),{once:!0}),s.addEventListener("error",()=>a(new Error(`Failed to load ${t}`)),{once:!0});return}const o=document.createElement("script");o.src=t,o.async=!0,o.addEventListener("load",()=>r(),{once:!0}),o.addEventListener("error",()=>a(new Error(`Failed to load ${t}`)),{once:!0}),document.head.append(o)})}function q(){const t=n.soundtrack.queue??[];if(!t.length)return null;const e=Math.max(0,Math.min(n.soundtrack.currentIndex,t.length-1));return t[e]??null}function ie(){const t=q(),e=document.querySelector("[data-action='toggle-soundtrack']");e&&(e.disabled=!t,e.classList.toggle("is-active",!!t&&!n.soundtrack.paused),e.setAttribute("aria-pressed",String(!!t&&!n.soundtrack.paused)),e.setAttribute("title",t?`${n.soundtrack.paused?"Resume":"Pause"} ${t.label}`:"No soundtrack available"));const r=document.querySelector("[data-action='toggle-volume-popout']");r&&(r.disabled=!t,r.classList.toggle("is-open",n.soundtrack.volumeOpen),r.style.setProperty("--volume-fill",`${J(n.soundtrack.volume)}%`),r.setAttribute("title",t?`Volume ${J(n.soundtrack.volume)}%`:"No soundtrack available"));const a=document.querySelector("#soundtrack-volume-slider");a&&(a.value=String(J(n.soundtrack.volume)));const s=document.querySelector("#soundtrack-volume-value");s&&(s.textContent=`${J(n.soundtrack.volume)}%`);const o=document.querySelector(".volume-popout");o&&(o.hidden=!n.soundtrack.volumeOpen)}function se(){Ge(),ie()}function $t(){const t=document.querySelector("#soundtrack-status");t&&(t.textContent="No soundtrack loaded."),ie()}function L(t){const e=document.querySelector("#soundtrack-status");e&&(e.textContent=t)}function j(){n.soundtrack.recoveryTimer&&(clearTimeout(n.soundtrack.recoveryTimer),n.soundtrack.recoveryTimer=null)}function le(t="Playback interrupted",e=2200){const r=q();if(!r||n.soundtrack.paused||n.soundtrack.manualPause)return;j();const a=r.id,s=n.soundtrack.syncToken;L(`${t}. Trying to resume...`),n.soundtrack.recoveryTimer=setTimeout(()=>{const o=q();if(!(!o||o.id!==a||s!==n.soundtrack.syncToken||n.soundtrack.paused||n.soundtrack.manualPause||!n.soundtrack.youtubePlayer)){n.soundtrack.recoveryAttempts+=1;try{n.soundtrack.recoveryAttempts%4===0&&o.videoId?Ke(o):n.soundtrack.youtubePlayer.playVideo(),L(`Resuming: ${o.label}`)}catch(i){L(`Soundtrack recovery failed: ${String(i.message||i)}`)}}},e)}function It(){const t=q();j(),n.soundtrack.manualPause=!0,n.soundtrack.mode==="youtube"&&n.soundtrack.youtubePlayer?.pauseVideo&&n.soundtrack.youtubePlayer.pauseVideo(),n.soundtrack.paused=!0,t&&L(`Paused: ${t.label}`),se()}function kt(){const t=q();t&&(j(),n.soundtrack.manualPause=!1,n.soundtrack.recoveryAttempts=0,n.soundtrack.mode==="youtube"&&n.soundtrack.youtubePlayer?.playVideo&&n.soundtrack.youtubePlayer.playVideo(),n.soundtrack.paused=!1,L(`Now playing: ${t.label}`),se())}function ba(){n.soundtrack.queue.length&&(n.soundtrack.currentIndex=(n.soundtrack.currentIndex+1)%n.soundtrack.queue.length,n.soundtrack.activeKey="",n.soundtrack.ready=!1,n.soundtrack.autoplayAttempted=!1,n.soundtrack.manualPause=!1,n.soundtrack.recoveryAttempts=0,j(),se(),Ze())}function Sa(){const t=q();if(!(!t||n.soundtrack.manualPause)){j(),n.soundtrack.paused=!1,n.soundtrack.recoveryAttempts=0;try{n.soundtrack.youtubePlayer?.seekTo?(n.soundtrack.youtubePlayer.seekTo(0,!0),n.soundtrack.youtubePlayer.playVideo()):n.soundtrack.youtubePlayer?.loadVideoById&&t.videoId&&Ke(t,0),L(`Looping cue: ${t.label}`),le("Cue loop did not restart",5e3)}catch(e){L(`Cue loop failed: ${String(e.message||e)}`)}}}function $a(t){return q()?.id===t&&n.soundtrack.activeKey===t}function Et(t,e={}){const r=n.soundtrack.queue.findIndex(a=>a.id===t);if(r<0){L("Music cue points to a missing soundtrack.");return}if($a(t)){n.soundtrack.paused&&kt();return}n.soundtrack.currentIndex=r,n.soundtrack.paused=!1,n.soundtrack.manualPause=!1,n.soundtrack.ready=!1,n.soundtrack.activeKey="",n.soundtrack.recoveryAttempts=0,j(),se(),Ze(),e.source==="button"&&L(`Cue selected: ${n.soundtrack.queue[r].label}`)}function J(t){return Math.max(0,Math.min(100,Math.round(Number(t)||0)))}function At(){const t=J(n.soundtrack.volume);n.soundtrack.volume=t,n.soundtrack.youtubePlayer?.setVolume&&n.soundtrack.youtubePlayer.setVolume(t),se()}function Ct(t){n.soundtrack.volume=J(t),At()}function Ia(t){Ct(J(n.soundtrack.volume+t))}function Ke(t,e=t.startSeconds??0){n.soundtrack.youtubePlayer?.loadVideoById&&n.soundtrack.youtubePlayer.loadVideoById({videoId:t.videoId,startSeconds:Math.max(0,Number(e)||0)})}async function ka(t,e){await wa("https://www.youtube.com/iframe_api",()=>!!window.YT?.Player),e===n.soundtrack.syncToken&&(ya(),n.soundtrack.youtubePlayer?Ke(t):await new Promise(r=>{const a=()=>{n.soundtrack.youtubePlayer=new window.YT.Player("youtube-soundtrack-host",{height:"200",width:"320",videoId:t.videoId,playerVars:{autoplay:1,controls:1,rel:0,start:t.startSeconds||0},events:{onReady:()=>r(),onStateChange:s=>{if(s.data===window.YT.PlayerState.ENDED){if(j(),n.soundtrack.recoveryAttempts=0,n.soundtrack.cueMode){Sa();return}ba();return}if(s.data===window.YT.PlayerState.PLAYING){j(),n.soundtrack.paused=!1,n.soundtrack.manualPause=!1,n.soundtrack.recoveryAttempts=0;const o=q();o&&L(`Now playing: ${o.label}`),se()}if(s.data===window.YT.PlayerState.PAUSED){if(n.soundtrack.manualPause){n.soundtrack.paused=!0,se();return}le("Playback paused by YouTube")}s.data===window.YT.PlayerState.BUFFERING&&le("Playback is buffering",4500),(s.data===window.YT.PlayerState.CUED||s.data===window.YT.PlayerState.UNSTARTED)&&le("Playback is waiting")},onError:s=>{const o=q();L(`YouTube player error${s?.data?` ${s.data}`:""}. Retrying...`),o&&le("YouTube player error",1500)}}})};if(window.YT?.Player)a();else{const s=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{s?.(),a()}}}),e===n.soundtrack.syncToken&&(n.soundtrack.mode="youtube",n.soundtrack.ready=!0,n.soundtrack.activeKey=t.id,At(),L(`Now playing: ${t.label}`),n.soundtrack.paused||(n.soundtrack.manualPause=!1,n.soundtrack.youtubePlayer.playVideo(),le("Playback did not start",5e3)),ie()))}async function Ze(){const t=++n.soundtrack.syncToken,e=q();if(!e){n.soundtrack.arcId="",n.soundtrack.queue=[],n.soundtrack.mode="idle",n.soundtrack.ready=!1,n.soundtrack.activeKey="",It(),$t();return}try{if(e.source==="youtube"){await ka(e,t);return}}catch(r){n.saveStatus=`Soundtrack error: ${String(r.message||r)}`,L("Soundtrack could not be loaded."),ie()}}function Ea(t,e,r={}){const a=ia(),s=t!==n.soundtrack.arcId||JSON.stringify(e.map(o=>o.id))!==JSON.stringify((n.soundtrack.queue??[]).map(o=>o.id));if(St(),n.soundtrack.arcId=t,n.soundtrack.queue=e,n.soundtrack.cueMode=!!r.waitForCue,s&&(n.soundtrack.currentIndex=a.arcId===t&&typeof a.currentIndex=="number"?Math.max(0,Math.min(a.currentIndex,e.length-1)):0,n.soundtrack.paused=a.arcId===t?!!a.paused:!1,n.soundtrack.manualPause=n.soundtrack.paused,n.soundtrack.volume=typeof a.volume=="number"?J(a.volume):n.soundtrack.volume,n.soundtrack.ready=!1,n.soundtrack.activeKey="",n.soundtrack.recoveryAttempts=0,j()),se(),n.soundtrack.cueMode){(s||!n.soundtrack.activeKey)&&(n.soundtrack.paused=!0,n.soundtrack.manualPause=!0,n.soundtrack.youtubePlayer?.pauseVideo&&n.soundtrack.youtubePlayer.pauseVideo(),Ge(),L("Waiting for music cue."),ie()),Aa();return}Ze()}function Aa(){const t=[...document.querySelectorAll(".music-cue[data-music-trigger]")];if(!t.length||!n.soundtrack.queue.length)return;const e=new Set(n.soundtrack.queue.map(r=>r.id));n.soundtrack.cueObserver=new IntersectionObserver(r=>{const s=r.filter(o=>o.isIntersecting).sort((o,i)=>i.intersectionRatio-o.intersectionRatio)[0]?.target?.dataset?.musicTrigger;!s||!e.has(s)||Et(s)},{root:null,rootMargin:"-20% 0px -55% 0px",threshold:[0,.35,.75]}),t.forEach(r=>n.soundtrack.cueObserver.observe(r))}function ee(){j(),St(),n.soundtrack.arcId="",n.soundtrack.queue=[],n.soundtrack.currentIndex=0,n.soundtrack.paused=!0,n.soundtrack.manualPause=!0,n.soundtrack.volumeOpen=!1,n.soundtrack.activeKey="",n.soundtrack.ready=!1,n.soundtrack.recoveryAttempts=0,n.soundtrack.cueMode=!1,n.soundtrack.youtubePlayer?.pauseVideo&&n.soundtrack.youtubePlayer.pauseVideo(),$t(),Ge()}function Ca(t,e,r){const a=String(t??"").trim();if(!a)return"";const s=e.get(a)??a;return r?`
    <span class="music-cue is-visible" data-music-trigger="${u(a)}">
      <button class="music-cue-play" type="button" data-action="play-music-cue" data-music-trigger="${u(a)}" title="Play ${u(s)}">▶</button>
      <span>Music cue: ${u(s)}</span>
    </span>
  `:`<span class="music-cue" data-music-trigger="${u(a)}"></span>`}function Ta(t,e){const r=String(t??"").trim(),a=e.get(r);if(!a)return`<div class="video-embed-missing">Missing video: ${u(r)}</div>`;const s=new URLSearchParams({rel:"0",modestbranding:"1"});return a.startSeconds&&s.set("start",String(a.startSeconds)),`
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
  `}function Tt(t){return`
    <figure class="chapter-image-frame is-fill" data-image-view="fill" data-auto-image-view="true">
      <button class="small-button image-view-toggle" type="button" data-action="toggle-image-view" title="Toggle image view">Desired</button>
      ${t}
    </figure>
  `}function Pa(t,e){return Tt(`<img alt="${t}" src="${u(ke(e))}" />`)}function xa(t,e={}){const r=String(t??""),a=e.soundtrackLabels??new Map,s=e.videos??new Map,o=!!e.showMusicCues,i="ULUNAVIR_SAFE_EXTRA_BREAK",c=r.replace(/\n{3,}/g,C=>`

${`${i}
`.repeat(C.length-2)}
`);let l=u(c);return l=l.replaceAll(i,"<br />"),l.replace(/```([\s\S]*?)```/g,(C,x)=>`<pre><code>${x.trim()}</code></pre>`).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(C,x,A)=>Pa(x,A)).replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/\[music:\s*([^\]]+)\]/gi,(C,x)=>Ca(x,a,o)).replace(/\[video:\s*([^\]]+)\]/gi,(C,x)=>Ta(x,s)).replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/(?:^|\n)- (.*(?:\n- .*)*)/g,C=>`
<ul>${C.trim().split(`
`).map(A=>A.replace(/^- /,"").trim()).map(A=>`<li>${A}</li>`).join("")}</ul>`).split(/\n{2,}/).map(C=>/^<(h\d|ul|ol|pre|p|blockquote|table|hr|br|figure|div)\b/.test(C.trim())?C:`<p>${C.replace(/\n/g,"<br />")}</p>`).join("")}function Na(t){return String(t??"").replace(/<script\b[\s\S]*?<\/script>/gi,"").replace(/\bsrc=(["'])(https?:\/\/t\d+\.pixhost\.(?:to|cc)\/thumbs\/[^"']+)\1/gi,(e,r,a)=>`src=${r}${u(ke(a))}${r}`).replace(/<img\b[^>]*>/gi,e=>Tt(e)).replace(/\n{3,}/g,e=>`

${`<br />
`.repeat(e.length-2)}
`)}function ce(t){return t?.renderMode==="html"?"html":"markdown"}function Pt(t){return t?.htmlBackground||""}function Ma(t){const e=String(t??"").replace("#","");if(!/^[0-9a-f]{6}$/i.test(e))return!1;const r=parseInt(e.slice(0,2),16),a=parseInt(e.slice(2,4),16),s=parseInt(e.slice(4,6),16);return(r*299+a*587+s*114)/1e3>170}function Oe(t,e,r={}){const a=ce(t),s=t?.body||e;if(a==="html"){const o=Pt(t),i=[];return o&&(i.push(`background-color: ${o}`),Ma(o)&&i.push("color: #1d1712")),`<div class="html-document-surface" ${i.length?`style="${u(i.join("; "))}"`:""}>${Na(s)}</div>`}return xa(s,{soundtrackLabels:fa(t?.soundtracks??[]),videos:ga(t?.videos??[]),showMusicCues:!!r.showMusicCues})}function xt(t="",e="markdown"){let r=String(t??"");if(e==="html"){const s=document.createElement("div");s.innerHTML=r,r=s.textContent??""}else r=r.replace(/```[\s\S]*?```/g," ").replace(/!\[[^\]]*]\([^)]+\)/g," ").replace(/\[music:\s*[^\]]+\]/gi," ").replace(/\[video:\s*[^\]]+\]/gi," ").replace(/\[([^\]]+)]\([^)]+\)/g,"$1").replace(/[#>*_`~\-]/g," ");const a=r.replace(/\s+/g," ").trim();return{words:a?a.split(" ").length:0,characters:r.replace(/\s+$/g,"").length}}function Ua(t){const e=xt(t?.body??"",ce(t));return`<div id="chapter-text-stats" class="chapter-text-stats">Words: ${e.words} · Characters: ${e.characters}</div>`}function La(t=""){const e=new Set,r=String(t??"");return[...r.matchAll(/data-word-image-placeholder=["'](\d+)["']/gi)].forEach(a=>e.add(Number(a[1]))),[...r.matchAll(/\[IMAGE\s+(\d+)\s+HERE\]/gi)].forEach(a=>e.add(Number(a[1]))),[...e].filter(a=>Number.isFinite(a)).sort((a,s)=>a-s)}function qa(t){const e=La(t.body);return ce(t)!=="html"||!e.length?"":`
    <section class="panel stack word-image-panel">
      <div class="section-header">
        <div>
          <h3>Word Images</h3>
          <p class="muted">Paste Imgur, Pixhost, or direct image URLs to replace the Word image placeholders in their original positions.</p>
        </div>
        <span class="pill">${e.length} placeholder(s)</span>
      </div>
      <div class="word-image-list">
        ${e.map(r=>`
          <div class="inline-form word-image-row">
            <label>IMAGE ${r}</label>
            <input data-word-image-url="${r}" placeholder="https://i.imgur.com/example.png or https://pixhost.to/show/..." />
            <button class="ghost-button" type="button" data-action="replace-word-image" data-chapter-id="${t.id}" data-image-index="${r}">Apply</button>
          </div>
        `).join("")}
      </div>
    </section>
  `}function Oa(t){return String(t??"").replace(/([.!?:;])\s*\d{1,4}(?=[A-ZÇĞİÖŞÜ])/g,"$1 ").replace(/(<(?:p|h[1-6]|li|blockquote)\b[^>]*>)\s*[o0]\s*(?=[A-ZÇĞİÖŞÜ])/gi,"$1").replace(/(<(?:p|h[1-6]|li|blockquote)\b[^>]*>)\s*\d{1,4}\s*(?=[A-ZÇĞİÖŞÜ])/gi,"$1").replace(/<p>\s*(?:\d{1,4}|[o0])\s*<\/p>/gi,"").replace(/(?:^|\n)\s*(?:\d{1,4}|[o0])\s*(?=\n|$)/gi,`
`).replace(/>\s+</g,"><").replace(/<\/(h[1-6]|p|blockquote|ul|ol|li|table|tr)>\s*/gi,`</$1>

`).replace(/\s*<(h[1-6]|p|blockquote|ul|ol|table)\b/gi,`
<$1`).replace(/\n{3,}/g,`

`).trim()}function ve(t,e){return[...t?.childNodes??[]].filter(r=>r.nodeType===1&&r.localName===e)}function R(t,e){return ve(t,e)[0]??null}function Y(t,e){return t?.getAttribute(`w:${e}`)??t?.getAttribute(e)??""}function Ra(t){const e=String(t??"").trim();return!e||e.toLowerCase()==="auto"?"":e.startsWith("#")?e:`#${e}`}function Da(t){return{black:"#000000",blue:"#2f65d9",cyan:"#00cfe8",green:"#37b24d",magenta:"#d63384",red:"#d9480f",yellow:"#ffe066",white:"#ffffff"}[String(t??"").toLowerCase()]??""}function Ba(t){const e=R(t,"rPr");if(!e)return[];const r=[],a=Ra(Y(R(e,"color"),"val")),s=Da(Y(R(e,"highlight"),"val")),o=Number(Y(R(e,"sz"),"val")),i=R(e,"rFonts"),c=Y(i,"ascii")||Y(i,"hAnsi"),l=R(e,"u"),d=Y(R(e,"vertAlign"),"val");return R(e,"b")&&r.push("font-weight: 700"),R(e,"i")&&r.push("font-style: italic"),l&&Y(l,"val")!=="none"&&r.push("text-decoration: underline"),R(e,"strike")&&r.push("text-decoration: line-through"),a&&r.push(`color: ${a}`),s&&r.push(`background-color: ${s}`),Number.isFinite(o)&&o>0&&r.push(`font-size: ${o/2}pt`),c&&r.push(`font-family: ${c.replace(/[<>"']/g,"")}`),d==="superscript"&&r.push("vertical-align: super","font-size: 0.72em"),d==="subscript"&&r.push("vertical-align: sub","font-size: 0.72em"),r}function Fa(t){return`<div class="word-image-placeholder" data-word-image-placeholder="${t}"><strong>[IMAGE ${t} HERE]</strong><br />Upload this Word image to Imgur or Pixhost, then replace this block with the Word Images panel.</div>`}function rt(t,e){const r=[];for(const o of[...t.childNodes])o.nodeType===1&&(o.localName==="t"||o.localName==="instrText"?r.push(u(o.textContent??"")):o.localName==="tab"?r.push("&nbsp;&nbsp;&nbsp;&nbsp;"):o.localName==="br"||o.localName==="cr"?r.push("<br />"):(o.localName==="drawing"||o.localName==="pict")&&(e.imageIndex+=1,r.push(Fa(e.imageIndex))));const a=r.join("");if(!a)return"";const s=Ba(t);return s.length?`<span style="${u(s.join("; "))}">${a}</span>`:a}function Nt(t,e){const r=R(t,"pPr"),a=Y(R(r,"pStyle"),"val").toLowerCase(),s=Y(R(r,"jc"),"val"),o=[];let i="p";const c=a.match(/heading([1-6])/);if(c?i=`h${c[1]}`:a==="title"?i="h1":a==="subtitle"&&(i="h2"),s){const d=s==="both"?"justify":s;o.push(`text-align: ${d}`)}const l=[...t.childNodes].map(d=>d.nodeType!==1?"":d.localName==="r"?rt(d,e):d.localName==="hyperlink"?ve(d,"r").map(p=>rt(p,e)).join(""):"").join("").trim();return l?`<${i}${o.length?` style="${u(o.join("; "))}"`:""}>${l}</${i}>`:""}function _a(t,e){const r=ve(t,"tr").map(a=>`<tr>${ve(a,"tc").map(o=>`<td>${ve(o,"p").map(c=>Nt(c,e)).filter(Boolean).join("")}</td>`).join("")}</tr>`).join("");return r?`<table><tbody>${r}</tbody></table>`:""}async function Va(t){const{default:e}=await ut(async()=>{const{default:d}=await import("./jszip.min-D7KnG0-e.js").then(p=>p.j);return{default:d}},[]),a=(await e.loadAsync(t)).file("word/document.xml");if(!a)throw new Error("This .docx file does not contain a readable Word document.");const s=await a.async("text"),i=new DOMParser().parseFromString(s,"application/xml").getElementsByTagNameNS("*","body")[0],c={imageIndex:0};return{html:[...i?.childNodes??[]].map(d=>d.nodeType!==1?"":d.localName==="p"?Nt(d,c):d.localName==="tbl"?_a(d,c):"").filter(Boolean).join(`

`),imageCount:c.imageIndex}}function be(){const t=document.querySelector("#chapter-render-mode-input")?.value==="html"?"html":"markdown",e=document.querySelector("#chapter-html-background-input")?.value??"";return{body:document.querySelector("#chapter-body-input")?.value??"",renderMode:t,htmlBackground:t==="html"?e:""}}async function st(t,e={}){const r=be(),a=document.querySelector("#chapter-cover-input"),s=document.querySelector("#chapter-cover-mode-input"),o=a instanceof HTMLInputElement?a.value.trim():t.coverImageUrl??"",i=o?await De(o):"",c=s instanceof HTMLSelectElement&&["fill","fit","stretch"].includes(s.value)?s.value:t.coverImageMode??"fill";return{title:document.querySelector("#chapter-title-input")?.value.trim()||t.title||"Untitled Chapter",body:r.body,coverImageUrl:i,coverImageMode:c,published:document.querySelector("#chapter-published-input")?.checked??X(t),hasEverBeenPublished:t.hasEverBeenPublished??X(t),dmNotes:document.querySelector("#chapter-dm-notes-input")?.value??t.dmNotes??"",renderMode:r.renderMode,htmlBackground:r.htmlBackground,...e}}function We(){const t=document.querySelector(".markdown-preview");if(!t)return;const e=be();t.dataset.previewMode=e.renderMode,t.innerHTML=Oe(e,e.renderMode==="html"?"":"*Start writing to preview your chapter here.*"),Ut(t);const r=document.querySelector("#chapter-text-stats");if(r){const a=xt(e.body,e.renderMode);r.textContent=`Words: ${a.words} · Characters: ${a.characters}`}}async function za(t){if(!t)return;if(!t.name.toLowerCase().endsWith(".docx"))throw new Error("Please choose a .docx Word file.");if(!(document.querySelector("#chapter-body-input")instanceof HTMLTextAreaElement))throw new Error("Chapter editor is not available.");const r=n.route.params.chapterId,a=document.querySelector("#chapter-title-input"),s=await Va(await t.arrayBuffer()),o=Oa(s.html);if(!o)throw new Error("No readable text was found in that Word file.");await n.adapter.updateChapter(r,{title:a?.value.trim()||"Untitled Chapter",body:o,renderMode:"html",htmlBackground:""});const i=s.imageCount?` ${s.imageCount} image placeholder(s) added.`:"";n.saveStatus=`Word file imported into the editor.${i}`;const c=document.querySelector(".notice.mono");c&&(c.textContent=n.saveStatus),await h()}function ja(t){return t?typeof t.toDate=="function"?t.toDate():typeof t.seconds=="number"?new Date(t.seconds*1e3):new Date(t):null}function me(t){const e=ja(t);return!e||Number.isNaN(e.getTime())?"Unknown date":new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short"}).format(e)}function he(t,e="Untitled"){return String(t??e).trim().replace(/[<>:"/\\|?*\x00-\x1f]/g,"-").replace(/\s+/g," ").slice(0,90)||e}function Ha(t,e){const r=URL.createObjectURL(t),a=document.createElement("a");a.href=r,a.download=e,document.body.append(a),a.click(),a.remove(),URL.revokeObjectURL(r)}function Wa(t,e,r){if(!e)return t;const a=e.toLowerCase();return t.filter(s=>r(s).toLowerCase().includes(a))}function Ya(t){return[...new Set(t.flatMap(e=>e.tags))].sort((e,r)=>e.localeCompare(r))}function Ga(t=""){return`
    <aside class="quick-tools">
      <div class="quick-tools-frame">
        <div class="quick-tools-label">Quick Tools</div>
        <div class="quick-tools-body">
          ${t||'<div class="quick-tools-empty">No tools</div>'}
        </div>
      </div>
    </aside>
  `}function ne(t,e,r=""){const a=k(),s=pe(a),o=`--reader-font-size:${s.fontSize}px;--reader-line-height:${s.lineHeight};--reader-width:${s.width}px;`,i=n.authError?`
        <div class="notice">
          <strong>Sign-in error</strong>
          <div class="muted">${u(n.authError)}</div>
          ${n.authErrorCode==="auth/invalid-credential"||n.authErrorCode==="auth/internal-error"?'<div class="card-actions"><button class="ghost-button" data-action="sign-in-redirect">Try redirect sign-in</button></div>':""}
        </div>
      `:"",c=n.loadError?`<div class="notice"><strong>Load error</strong><div class="muted">${u(n.loadError)}</div></div>`:"",l=n.saveStatus?`<div class="notice"><strong>Status</strong><div class="muted">${u(n.saveStatus)}</div></div>`:"";qe.innerHTML=`
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
            ${Ve("/","Main Menu",e==="home")}
            ${Ve("/creator","Creator",e==="creator")}
            ${Ve("/browser","Browser",e==="browser")}
          </nav>
        </div>
        <div class="stack">
          <button class="notice account-card" data-action="open-settings" ${a?"":"disabled"}>
            <strong>${u(Ne(a))}</strong>
            <div class="muted">${u(a?.email??(n.authClient?.mode==="firebase"?"Sign in to create and manage stories":"Local demo mode"))}</div>
          </button>
          <button class="login-button" data-action="toggle-login">
            ${n.currentUser?"Log out":"Log in"}
          </button>
        </div>
      </aside>
      <main class="content">${t}</main>
      ${Ga(r)}
    </div>
  `,(i||c||l)&&qe.querySelector(".content").insertAdjacentHTML("afterbegin",`${l}${c}${i}`),Ut()}function Mt(t,e,r=!0){const a=e==="desired"?"desired":"fill";t.dataset.imageView=a,r&&(t.dataset.autoImageView="false"),t.classList.toggle("is-desired",a==="desired"),t.classList.toggle("is-fill",a!=="desired");const s=t.querySelector("[data-action='toggle-image-view']");s&&(s.textContent=a==="desired"?"Fill":"Desired",s.title=a==="desired"?"Switch to fill view":"Switch to desired view")}function nt(t){if(t.dataset.autoImageView==="false")return;const e=t.querySelector("img");!e?.naturalWidth||!e?.naturalHeight||Mt(t,e.naturalHeight>e.naturalWidth?"desired":"fill",!1)}function Ut(t=document){t.querySelectorAll(".chapter-image-frame").forEach(e=>{const r=e.querySelector("img");if(r){if(r.complete){nt(e);return}r.addEventListener("load",()=>nt(e),{once:!0})}})}async function Ja(){const t=k();if(!t)return Q("Sign in to manage account settings.");const e=pe(t);ne(`
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
            <div class="muted">${u(t.name??"Creator")}</div>
          </div>
          <div class="inline-form settings-form">
            <input id="pen-name-input" placeholder="${u(t.name??"Creator")}" value="${u(t.penName??"")}" />
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
              <input id="reader-font-size-input" type="number" min="14" max="24" value="${e.fontSize}" />
            </label>
            <label>
              <span class="muted">Line height</span>
              <input id="reader-line-height-input" type="number" min="1.4" max="2.4" step="0.05" value="${e.lineHeight}" />
            </label>
            <label>
              <span class="muted">Page width</span>
              <input id="reader-width-input" type="number" min="620" max="1200" step="20" value="${e.width}" />
            </label>
            <button class="ghost-button" data-action="save-reader-settings">Save reader settings</button>
          </div>
          <article
            id="reader-settings-preview"
            class="reader-settings-preview markdown-preview"
            style="--reader-font-size:${e.fontSize}px;--reader-line-height:${e.lineHeight};--reader-width:${e.width}px;"
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
    `,"home")}function Ve(t,e,r){return`<a class="nav-link ${r?"is-active":""}" href="#${t}"><span>${e}</span></a>`}function Ka(){return`
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
  `}function Lt(t){return t.length?`
    <section class="panel stack">
      <div class="section-header">
        <div>
          <h3>Ownership Requests</h3>
          <p class="muted">Stories shared with you stay with the current owner until you accept.</p>
        </div>
        <span class="pill">${t.length} pending</span>
      </div>
      <div class="story-list">
        ${t.map(e=>`
          <article class="list-card">
            <div class="stack">
              <div>
                <h3>${u(e.title)}</h3>
                <p class="muted">Requested by ${u(e.pendingTransfer?.requestedByName??e.creatorName)} on ${u(me(e.pendingTransfer?.requestedAt??e.updatedAt))}</p>
              </div>
              <div class="card-actions">
                <button class="primary-button" data-action="accept-story-transfer" data-story-id="${e.id}">Accept</button>
                <button class="ghost-button" data-action="decline-story-transfer" data-story-id="${e.id}">Decline</button>
                <a class="ghost-button" href="#/stories/${e.id}?view=browser">Preview</a>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `:""}async function Za(){const t=k();let e=[];if(t?.email)try{e=await n.adapter.listIncomingStoryTransfers?.(t.email)??[]}catch(r){console.error("Incoming transfer list failed:",r),n.loadError="Ownership requests could not be loaded right now."}ne(`
      <div class="stack">
        ${Ka()}
        ${Lt(e)}
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
    `,"home")}async function Qa(){const t=k();let e=[],r=[],a=[],s="";try{e=await n.adapter.listCreatorStories(t?.id)}catch(m){console.error("Creator story list failed:",m),n.loadError="Your stories could not be loaded right now."}if(t)try{s=await ma()}catch(m){console.error("User email resolve failed:",m)}if(s){try{r=await n.adapter.listEditorStories?.(s)??[]}catch(m){console.error("Editor story list failed:",m),n.loadError="Editor permissions could not be loaded right now."}try{a=await n.adapter.listIncomingStoryTransfers?.(s)??[]}catch(m){console.error("Incoming transfer list failed:",m),n.loadError="Ownership requests could not be loaded right now."}}const o=Z(),i=o.get("q")??"",c=o.get("tag")??"",l=Wa(e,i,m=>`${m.title} ${m.tags.join(" ")}`).filter(m=>c?m.tags.includes(c):!0),d=Ya(e),p=n.authClient?.mode==="firebase"&&!t?'<div class="notice">Sign in with Firebase to create, edit, and manage your own stories.</div>':"";ne(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Creator</h2>
            <p class="muted">Manage your stories, search by title, and filter by tags.</p>
          </div>
          <button class="primary-button" data-action="create-story" ${t?"":"disabled"}>Create</button>
        </div>
        ${Lt(a)}
        ${p}
        <section class="panel stack">
          <div class="search-row">
            <input id="story-search" placeholder="Search by story title or tag" value="${u(i)}" />
            <select id="story-tag-filter">
              <option value="">All tags</option>
              ${d.map(m=>`<option value="${u(m)}" ${c===m?"selected":""}>${u(m)}</option>`).join("")}
            </select>
            <button class="ghost-button" data-action="apply-story-filters">Filter</button>
          </div>
          <div class="chip-row">
            ${d.map(m=>`<a class="pill" href="#/creator?tag=${encodeURIComponent(m)}">${u(m)}</a>`).join("")}
          </div>
        </section>
        <section class="panel stack">
          <div class="section-header">
            <div>
              <h3>Your Stories</h3>
              <p class="muted">Stories where you are the author.</p>
            </div>
            <span class="pill">${l.length} story(s)</span>
          </div>
          <div class="story-list">
            ${l.length?l.map(m=>Ye(m,{authorView:!0})).join(""):'<div class="empty-state">No stories match this filter yet.</div>'}
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
            ${r.length?r.map(m=>Ye(m,{editorView:!0})).join(""):'<div class="empty-state">No editor permissions yet.</div>'}
          </div>
        </section>
      </div>
    `,"creator")}function oe(t){return["fit","stretch"].includes(t?.coverImageMode)?t.coverImageMode:"fill"}function qt(t,e={}){const r=t?.coverImageUrl?ke(t.coverImageUrl):"",a=oe(t),s=t?.title||e.fallbackTitle||"Untitled";return`
    <div class="chapter-cover entity-cover cover-mode-${a} ${r?"has-cover":"no-cover"}">
      ${r?`<img src="${u(r)}" alt="Cover for ${u(s)}" />`:`<div class="chapter-cover-placeholder" aria-hidden="true"><span>${e.placeholder??"✦"}</span></div>`}
      ${e.badge??""}
    </div>
  `}function Ye(t,e={}){const r=!!e.browserView,a=`#/stories/${t.id}${r?"?view=browser":""}`;return`
    <article class="chapter-card entity-card story-cover-card">
      ${qt(t,{placeholder:"◆",badge:`<span class="status-pill cover-card-badge">${u(t.visibility)}</span>`})}
      <h3 class="chapter-card-title">${u(t.title||"Untitled story")}</h3>
      ${e.editorView||r?`<p class="muted entity-card-byline">by ${u(t.creatorName)}</p>`:""}
      <p class="muted chapter-card-date">Updated ${me(t.updatedAt)}</p>
      <div class="chip-row entity-card-tags">
        ${t.tags.map(s=>`<span class="pill">${u(s)}</span>`).join("")}
      </div>
      <div class="entity-card-meta">
        <span class="pill">${t.arcs.length} arc(s)</span>
      </div>
      ${e.authorView?`
        <div class="entity-card-actions" aria-label="Story actions">
          <button class="small-button chapter-icon-button danger-icon" title="Delete story" aria-label="Delete story" data-action="delete-story" data-story-id="${t.id}">🗑</button>
        </div>
      `:""}
      <a class="primary-button chapter-open-button" href="${a}"><span aria-hidden="true">&#128214;</span> ${r?"Read Story":"Open Story"}</a>
    </article>
  `}async function Xa(){const t=await n.adapter.listBrowserStories(k()?.id),e=Z(),r=e.get("group")!=="flat",a=e.get("creator")??"",s=a?t.filter(c=>c.creatorName===a):t,o=[...new Set(t.map(c=>c.creatorName))];let i="";s.length?r?i=o.filter(c=>!a||c===a).map(c=>{const l=s.filter(d=>d.creatorName===c);return l.length?`
          <section class="panel stack">
            <div class="section-header">
              <h3>${u(c)}</h3>
              <span class="pill">${l.length} public stories</span>
            </div>
            <div class="story-list">${l.map(ot).join("")}</div>
          </section>
        `:""}).join(""):i=`<section class="story-list">${s.map(ot).join("")}</section>`:i='<div class="empty-state">No public stories are available yet.</div>',ne(`
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
    `,"browser")}function ot(t){return Ye(t,{browserView:!0})}function er(t,e=!1){const r=t.editorEmails??[];return r.length?`
    <div class="editor-chip-list" aria-label="Story editors">
      ${r.map(a=>`
        <span class="editor-chip">
          <span>${u(a)}</span>
          ${e?`
            <button
              class="small-button editor-remove-button"
              type="button"
              title="Remove editor"
              data-action="remove-story-editor"
              data-story-id="${t.id}"
              data-editor-email="${u(a)}"
            >🗑</button>
          `:""}
        </span>
      `).join("")}
    </div>
  `:""}async function tr(t){const e=await n.adapter.getStory(t);if(!e)return Q("Story not found.");const r=ht(e),a=Ie(e),s=Z().get("view")==="browser",o=Z().get("transfer")==="1",i=e.pendingTransferStatus==="pending"?e.pendingTransfer:null;if(!Je(e))return Q("This story is private.");ne(`
      <div class="stack">
        ${Qe([[s?"#/browser":"#/creator",s?"Browser":"Creator"],["",e.title]])}
        <div class="page-title">
          <div>
            <h2>${u(e.title)}</h2>
            <p class="muted">Set visibility, manage arcs, and organize the reading order.</p>
          </div>
          <div class="card-actions">
            ${s&&a?'<a class="ghost-button" href="#/stories/'+e.id+'">Edit</a>':""}
            ${a&&!s?'<button class="ghost-button" data-action="export-story" data-story-id="'+e.id+'">Export</button>':""}
            ${r&&!s?'<button class="ghost-button" type="button" data-action="add-story-editor" data-story-id="'+e.id+'">Add an Editor</button>':""}
            ${r&&!s?'<button class="ghost-button" type="button" data-action="open-story-transfer" data-story-id="'+e.id+'">Transfer Ownership</button>':""}
            ${a&&!s?'<button class="primary-button" data-action="create-arc" data-story-id="'+e.id+'">New arc</button>':""}
          </div>
        </div>
        <section class="panel stack">
          <div class="inline-form">
            <input id="story-title-input" value="${u(e.title)}" ${a?"":"disabled"} />
            <input id="story-tags-input" value="${u(e.tags.join(", "))}" ${a?"":"disabled"} />
            <select id="story-visibility-input" ${a?"":"disabled"}>
              ${["public","unlisted","private"].map(c=>`<option value="${c}" ${e.visibility===c?"selected":""}>${c}</option>`).join("")}
            </select>
            ${a?'<button class="ghost-button" data-action="save-story-settings" data-story-id="'+e.id+'">Save</button>':""}
          </div>
          ${a&&!s?`
            <div class="chapter-cover-control entity-cover-control">
              <label for="story-cover-input">Story cover image</label>
              <input id="story-cover-input" value="${u(e.coverImageUrl??"")}" placeholder="Paste an Imgur, Pixhost, or direct image URL" />
              <label for="story-cover-mode-input">Cover placement</label>
              <select id="story-cover-mode-input">
                <option value="fill" ${oe(e)==="fill"?"selected":""}>Fill — cover the full area, crop if needed</option>
                <option value="fit" ${oe(e)==="fit"?"selected":""}>Fit — show the complete image without cropping</option>
                <option value="stretch" ${oe(e)==="stretch"?"selected":""}>Stretch — resize the image to the exact card shape</option>
              </select>
            </div>
          `:""}
          <div class="notice">
            <strong>${u(e.creatorName)}</strong>
            <div class="muted">Created ${me(e.createdAt)}. Visibility is currently ${u(e.visibility)}.</div>
            ${e.editorEmails?.length?`
              <div class="muted">Editors</div>
              ${er(e,r&&!s)}
            `:""}
          </div>
          ${r&&i?`
            <div class="notice">
              <strong>Transfer pending</strong>
              <div class="muted">Waiting for ${u(i.targetEmail??"")} to accept. Ownership stays with you until they do.</div>
              <div class="card-actions">
                <button class="ghost-button" data-action="cancel-story-transfer" data-story-id="${e.id}">Cancel transfer</button>
              </div>
            </div>
          `:""}
          ${r&&!s&&o?`
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
                <button class="primary-button" data-action="submit-story-transfer" data-story-id="${e.id}">Send request</button>
                <button class="ghost-button" data-action="close-story-transfer" data-story-id="${e.id}">Close</button>
              </div>
              <div class="muted">Wrong email does not remove the story from you. It only creates a pending request that you can cancel.</div>
            </div>
          `:""}
        </section>
        <section class="nested-list arc-card-grid">
          ${e.arcs.length?e.arcs.map((c,l)=>ar(c,e,a,l,s)).join(""):'<div class="empty-state">No arcs yet. Create the first arc to start structuring this story.</div>'}
        </section>
      </div>
    `,s?"browser":a?"creator":"browser")}function ar(t,e,r,a,s=!1){const o=`#/stories/${e.id}/arcs/${t.id}${s?"?view=browser":""}`;return`
    <article class="chapter-card entity-card arc-cover-card">
      ${qt(t,{placeholder:"◇"})}
      <h3 class="chapter-card-title">${u(t.title||"Untitled arc")}</h3>
      <p class="muted chapter-card-date">Updated ${me(t.updatedAt)}</p>
      <div class="entity-card-meta">
        <span class="pill">${t.chapters.length} chapter(s)</span>
      </div>
      ${r&&!s?`
        <div class="entity-card-actions" aria-label="Arc actions">
          <button class="small-button chapter-icon-button" title="Move arc up" aria-label="Move arc up" data-action="move-arc-up" data-story-id="${e.id}" data-index="${a}" ${a===0?"disabled":""}>↑</button>
          <button class="small-button chapter-icon-button" title="Move arc down" aria-label="Move arc down" data-action="move-arc-down" data-story-id="${e.id}" data-index="${a}" ${a===e.arcs.length-1?"disabled":""}>↓</button>
          <button class="small-button chapter-icon-button danger-icon" title="Delete arc" aria-label="Delete arc" data-action="delete-arc" data-story-id="${e.id}" data-arc-id="${t.id}">🗑</button>
        </div>
      `:""}
      <a class="primary-button chapter-open-button" href="${o}"><span aria-hidden="true">&#128214;</span> Open Arc</a>
    </article>
  `}function rr(t,e,r=!1,a=""){return`
    <div class="phase-separator">
      <span class="phase-line"></span>
      ${e&&!r?`<button class="phase-title" data-action="rename-phase" data-arc-id="${a}" data-phase-id="${t.id}" data-phase-title="${u(t.title)}">${u(t.title)}</button>`:`<span class="phase-title">${u(t.title)}</span>`}
      <span class="phase-line"></span>
    </div>
  `}function sr(t){const e=t.soundtracks??[],r=ce(t)==="markdown";return`
    <section class="panel stack soundtrack-panel">
      <div class="section-header">
        <div>
          <h3>Soundtracks</h3>
          <p class="muted">Add YouTube links that should play only for this chapter.</p>
        </div>
        <span class="pill">${e.length} track(s)</span>
      </div>
      <div class="inline-form soundtrack-form">
        <input id="soundtrack-label-input" placeholder="Optional label, for example Tavern Theme" />
        <input id="soundtrack-url-input" placeholder="https://youtube.com/... or https://youtu.be/..." />
        <button class="ghost-button" data-action="add-soundtrack" data-chapter-id="${t.id}">Add soundtrack</button>
      </div>
      <div class="soundtrack-list">
        ${e.length?e.map(a=>`
                <article class="soundtrack-item">
                  <div>
                    <strong>${u(a.label?.trim()||"Untitled soundtrack")}</strong>
                    ${r?`<div class="muted mono">[music: ${u(a.id)}]</div>`:""}
                    <div class="muted mono">${u(a.url??"")}</div>
                  </div>
                  <div class="card-actions">
                    ${r?`<button class="small-button" data-action="copy-soundtrack-marker" data-soundtrack-id="${a.id}">Copy cue</button>`:""}
                    <button class="danger-button" data-action="delete-soundtrack" data-chapter-id="${t.id}" data-soundtrack-id="${a.id}">Remove</button>
                  </div>
                </article>
              `).join(""):'<div class="empty-state">No soundtrack links yet.</div>'}
      </div>
    </section>
  `}function nr(t){const e=t.videos??[],r=ce(t)==="markdown";return`
    <section class="panel stack video-panel">
      <div class="section-header">
        <div>
          <h3>Videos</h3>
          <p class="muted">Add YouTube videos and place them inside this markdown chapter.</p>
        </div>
        <span class="pill">${e.length} video(s)</span>
      </div>
      ${r?`<div class="inline-form video-form">
              <input id="video-label-input" placeholder="Optional label, for example Prophecy Scene" />
              <input id="video-url-input" placeholder="https://youtube.com/watch?v=...&t=20s" />
              <button class="ghost-button" data-action="add-video" data-chapter-id="${t.id}">Add video</button>
            </div>`:'<div class="notice">Video embeds are available in Markdown Mode only.</div>'}
      <div class="video-list">
        ${e.length?e.map(a=>`
                <article class="video-item">
                  <div>
                    <strong>${u(a.label?.trim()||"Untitled video")}</strong>
                    ${r?`<div class="muted mono">[video: ${u(a.id)}]</div>`:""}
                    <div class="muted mono">${u(a.url??"")}</div>
                  </div>
                  <div class="card-actions">
                    ${r?`<button class="small-button" data-action="copy-video-marker" data-video-id="${a.id}">Copy embed</button>`:""}
                    <button class="danger-button" data-action="delete-video" data-chapter-id="${t.id}" data-video-id="${a.id}">Remove</button>
                  </div>
                </article>
              `).join(""):'<div class="empty-state">No video links yet.</div>'}
      </div>
    </section>
  `}function or(t,e=!1){const r=k(),a=t.reactions??{},s=["🔥","😮","💀","❤️"],o=t.comments??[];return`
    <section class="panel stack engagement-panel">
      <div class="section-header">
        <div>
          <h3>Comments / Reactions</h3>
          <p class="muted">Leave table chatter without changing the chapter text.</p>
        </div>
      </div>
      <div class="reaction-row">
        ${s.map(i=>{const c=a[i]??[];return`<button class="ghost-button ${r?.id&&c.includes(r.id)?"is-active":""}" data-action="toggle-reaction" data-chapter-id="${t.id}" data-emoji="${i}" ${r?"":"disabled"}>${i} ${c.length}</button>`}).join("")}
      </div>
      <div class="comment-list">
        ${o.length?o.map((i,c)=>{const l=!!(r?.id&&(e||i.userId===r.id));return`
            <article class="notice">
              <div class="comment-header">
                <div>
                  <strong>${u(i.userName??"Reader")}</strong>
                  <div class="muted">${me(i.createdAt)}</div>
                </div>
                ${l?`<button class="small-button danger-icon" type="button" title="Delete comment" aria-label="Delete comment" data-action="delete-comment" data-chapter-id="${t.id}" data-comment-id="${u(i.id??"")}" data-comment-index="${c}">🗑</button>`:""}
              </div>
              <p>${u(i.body??"")}</p>
            </article>
          `}).join(""):'<div class="empty-state">No comments yet.</div>'}
      </div>
      ${r?`
        <div class="inline-form">
          <input id="chapter-comment-input" placeholder="Write a comment..." />
          <button class="ghost-button" data-action="add-comment" data-chapter-id="${t.id}">Add comment</button>
        </div>
      `:'<div class="muted">Sign in to react or comment.</div>'}
    </section>
  `}function ir(t){if(!t.length)return"";const e=q(),r=J(n.soundtrack.volume);return`
    <div class="quick-tool-stack">
      <button
        class="quick-tool-button ${e&&!n.soundtrack.paused?"is-active":""}"
        data-action="toggle-soundtrack"
        aria-pressed="${String(!!e&&!n.soundtrack.paused)}"
        title="${u(e?`${n.soundtrack.paused?"Resume":"Pause"} ${e.label}`:"No soundtrack available")}"
      >
        <span class="quick-tool-icon">♪</span>
      </button>
      <button
        class="quick-tool-button volume-button ${n.soundtrack.volumeOpen?"is-open":""}"
        data-action="toggle-volume-popout"
        data-wheel-volume="true"
        style="--volume-fill: ${r}%;"
        title="${u(e?`Volume ${r}%`:"No soundtrack available")}"
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
      <div id="soundtrack-status" class="quick-tool-status">${u(e?`${n.soundtrack.paused?"Paused":"Now playing"}: ${e.label}`:"No soundtrack loaded.")}</div>
    </div>
  `}async function cr(t,e){const[r,a]=await Promise.all([n.adapter.getStory(t),n.adapter.getArc(e)]);if(!r||!a)return Q("Arc not found.");const s=Ie(r),o=Z().get("view")==="browser";if(!Je(r))return Q("This story is private.");const i=(a.phases??[]).map(c=>{const l=(c.chapters??[]).filter(d=>He(d,s));return o&&!l.length?"":`
      <section class="phase-block stack">
        ${rr(c,s,o,a.id)}
        <div class="nested-list chapter-card-grid">
          ${l.length?l.map((d,p)=>dr(d,r,a,s,p,o,c)).join(""):'<div class="empty-state">No chapters in this phase yet.</div>'}
        </div>
      </section>
    `}).join("");if(ne(`
      <div class="stack">
        ${Qe([[o?"#/browser":s?"#/creator":"#/browser",o?"Browser":s?"Creator":"Browser"],["#/stories/"+r.id+(o?"?view=browser":""),r.title],["",a.title]])}
        <div class="page-title">
          <div>
            <h2>${u(a.title)}</h2>
            <p class="muted">Manage the chapter list and reading order for this arc.</p>
          </div>
          <div class="card-actions">
            ${o&&s?'<a class="ghost-button" href="#/stories/'+r.id+"/arcs/"+a.id+'">Edit</a>':""}
            ${s&&!o?'<button class="ghost-button" data-action="create-phase" data-arc-id="'+a.id+'">New phase</button>':""}
            ${s&&!o?'<button class="primary-button" data-action="create-chapter" data-arc-id="'+a.id+'" data-story-id="'+r.id+'">New chapter</button>':""}
          </div>
        </div>
        ${s&&!o?`
          <section class="panel stack">
            <div class="inline-form">
              <input id="arc-title-input" value="${u(a.title)}" />
              <button class="ghost-button" data-action="save-arc-title" data-arc-id="${a.id}" data-story-id="${r.id}">Save arc</button>
            </div>
            <div class="chapter-cover-control entity-cover-control">
              <label for="arc-cover-input">Arc cover image</label>
              <input id="arc-cover-input" value="${u(a.coverImageUrl??"")}" placeholder="Paste an Imgur, Pixhost, or direct image URL" />
              <label for="arc-cover-mode-input">Cover placement</label>
              <select id="arc-cover-mode-input">
                <option value="fill" ${oe(a)==="fill"?"selected":""}>Fill — cover the full area, crop if needed</option>
                <option value="fit" ${oe(a)==="fit"?"selected":""}>Fit — show the complete image without cropping</option>
                <option value="stretch" ${oe(a)==="stretch"?"selected":""}>Stretch — resize the image to the exact card shape</option>
              </select>
            </div>
        </section>`:""}
        ${i||'<div class="empty-state">No chapters yet. Add one to begin writing.</div>'}
      </div>
    `,o?"browser":s?"creator":"browser"),s&&!o){const c=document.querySelector("#story-transfer-button");c&&c.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),showStoryTransferModal(r.id)})}}function dr(t,e,r,a,s,o=!1,i=null){const c=r.phases??[],l=c.findIndex(E=>E.id===i?.id),d=l<=0&&s===0,p=l===c.length-1&&s===(i?.chapters?.length??0)-1,m=t.coverImageUrl?ke(t.coverImageUrl):"",y=["fit","stretch"].includes(t.coverImageMode)?t.coverImageMode:"fill",g=X(t),P=`#/stories/${e.id}/arcs/${r.id}/chapters/${t.id}${o?"?view=browser":""}`;return`
    <article class="chapter-card">
      <div class="chapter-cover cover-mode-${y} ${m?"has-cover":"no-cover"}">
        ${m?`<img src="${u(m)}" alt="Cover for ${u(t.title||"Untitled chapter")}" />`:'<div class="chapter-cover-placeholder" aria-hidden="true"><span>✦</span></div>'}
        <span class="chapter-lock ${g?"is-published":"is-draft"}" title="${g?"Published":"Draft"}" aria-label="${g?"Published":"Draft"}">${g?"&#128275;":"&#128274;"}</span>
      </div>
      <h3 class="chapter-card-title">${u(t.title||"Untitled chapter")}</h3>
      <p class="muted chapter-card-date">Updated ${me(t.updatedAt)}</p>
      ${a&&!o?`
        <div class="chapter-card-actions" aria-label="Chapter actions">
          <button class="small-button chapter-icon-button" title="Move chapter up" aria-label="Move chapter up" data-action="move-chapter-up" data-arc-id="${r.id}" data-chapter-id="${t.id}" ${d?"disabled":""}>↑</button>
          <button class="small-button chapter-icon-button" title="Move chapter down" aria-label="Move chapter down" data-action="move-chapter-down" data-arc-id="${r.id}" data-chapter-id="${t.id}" ${p?"disabled":""}>↓</button>
          <button class="small-button chapter-icon-button" title="Transfer chapter" aria-label="Transfer chapter" data-action="open-transfer-chapter" data-story-id="${e.id}" data-arc-id="${r.id}" data-phase-id="${i?.id??""}" data-chapter-id="${t.id}">↗</button>
          <button class="small-button chapter-icon-button danger-icon" title="Delete chapter" aria-label="Delete chapter" data-action="delete-chapter" data-story-id="${e.id}" data-arc-id="${r.id}" data-chapter-id="${t.id}">🗑</button>
        </div>
      `:""}
      <a class="primary-button chapter-open-button" href="${P}"><span aria-hidden="true">&#128214;</span> Open Chapter</a>
    </article>
  `}function it(t,e,r,a,s=!1){return!r&&!a?"":`
    <div class="chapter-pager">
      ${r?`<a class="ghost-button" href="#/stories/${t}/arcs/${e}/chapters/${r.id}${s?"?view=browser":""}">Previous Chapter</a>`:""}
      ${a?`<a class="ghost-button" href="#/stories/${t}/arcs/${e}/chapters/${a.id}${s?"?view=browser":""}">Next Chapter</a>`:""}
    </div>
  `}async function lr(t,e,r){const[a,s,o]=await Promise.all([n.adapter.getStory(t),n.adapter.getArc(e),n.adapter.getChapter(r)]);if(!a||!s||!o)return Q("Chapter not found.");const i=Ie(a),c=Z().get("view")==="browser";if(!Je(a))return Q("This story is private.");if(!He(o,i))return Q("This chapter is still a draft.");const l=o.assets??[],d=ce(o),p=Pt(o),m=c?bt(o.soundtracks??[]):[],y=(s.chapters??[]).filter(A=>He(A,i)),g=y.findIndex(A=>A.id===r),P=g>0?y[g-1]:null,E=g>=0&&g<y.length-1?y[g+1]:null,F=it(a.id,s.id,P,E,c),C=it(a.id,s.id,P,E,c),x=i&&!c?`
        <div class="editor-shell">
          <section class="editor-pane">
            <div class="editor-controls">
              <div class="editor-import-bar">
                <div class="card-actions">
                  <button class="ghost-button" type="button" data-action="open-docx-import">Import .docx</button>
                  ${d==="html"?'<button class="ghost-button" type="button" data-action="switch-markdown-mode">Markdown Mode</button>':""}
                </div>
                <span class="muted">${d==="html"?"HTML mode: Word content is locked. Switch to Markdown Mode to clear it and write normally.":"Markdown mode: import a Word file to switch this chapter to locked HTML mode."}</span>
                ${d==="html"?`
                  <label class="html-background-control">
                    <span>Background</span>
                    <input id="chapter-html-background-input" type="color" value="${u(p||"#120f0d")}" data-action="set-html-background" />
                    <button class="small-button" type="button" data-action="clear-html-background" title="Use site background">×</button>
                  </label>
                `:""}
                <input id="chapter-render-mode-input" type="hidden" value="${d}" />
                <input id="docx-import-input" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden />
              </div>
              <input id="chapter-title-input" value="${u(o.title)}" ${i?"":"disabled"} />
              <div class="chapter-cover-control">
                <label for="chapter-cover-input">Chapter cover image</label>
                <div class="inline-form">
                  <input id="chapter-cover-input" value="${u(o.coverImageUrl??"")}" placeholder="Paste an Imgur, Pixhost, or direct image URL" />
                  <button class="ghost-button" type="button" data-action="clear-chapter-cover" data-chapter-id="${o.id}">Clear cover</button>
                </div>
                <label for="chapter-cover-mode-input">Cover placement</label>
                <select id="chapter-cover-mode-input">
                  <option value="fill" ${(o.coverImageMode??"fill")==="fill"?"selected":""}>Fill — cover the full area, crop if needed</option>
                  <option value="fit" ${o.coverImageMode==="fit"?"selected":""}>Fit — show the complete image without cropping</option>
                  <option value="stretch" ${o.coverImageMode==="stretch"?"selected":""}>Stretch — resize the image to the exact card shape</option>
                </select>
                <span class="muted">Paste a URL here, or use the cover button on one of the referenced images below.</span>
              </div>
              <div class="inline-form">
                <label class="toggle-row">
                  <input id="chapter-published-input" type="checkbox" ${X(o)?"checked":""} />
                  <span>Published for readers</span>
                </label>
                <span class="pill">${X(o)?"Published":"Draft"}</span>
              </div>
              <textarea id="chapter-body-input" class="markdown-area" ${i&&d!=="html"?"":"disabled"}>${u(o.body)}</textarea>
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
              ${qa(o)}
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
                    ${l.length?l.map((A,N)=>ct(A,N,{chapterId:o.id,editable:!0})).join(""):'<div class="empty-state">No assets in this chapter yet.</div>'}
                  </div>
                </div>
              `:""}
              ${nr(o)}
              ${sr(o)}
              <div class="notice mono">${u(n.saveStatus||"Tip: use `![alt](image-url)` to place pasted external images into the chapter body.")}</div>
            </div>
          </section>
          <section class="preview-pane">
            <h3>Preview</h3>
            ${Ua(o)}
            <div class="markdown-preview" data-preview-mode="${d}">${Oe(o,"*Start writing to preview your chapter here.*")}</div>
          </section>
        </div>
      `:`
        <section class="panel stack">
          <div class="section-header">
            <h3>Reading view</h3>
            <span class="pill">${l.length} asset(s)</span>
          </div>
          <div class="markdown-preview" data-preview-mode="${d}">${Oe(o,"*This chapter is empty.*",{showMusicCues:c})}</div>
        </section>
        ${C}
        ${l.length?`<section class="panel stack"><h3>Referenced images</h3><div class="asset-list">${l.map((A,N)=>ct(A,N)).join("")}</div></section>`:""}
        ${or(o,i)}
      `;ne(`
      <div class="stack">
        ${Qe([[c?"#/browser":i?"#/creator":"#/browser",c?"Browser":i?"Creator":"Browser"],["#/stories/"+a.id+(c?"?view=browser":""),a.title],["#/stories/"+a.id+"/arcs/"+s.id+(c?"?view=browser":""),s.title],["",o.title||"Untitled chapter"]])}
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
        ${F}
        ${x}
      </div>
    `,c?"browser":i?"creator":"browser",ir(m)),c&&m.length?Ea(o.id,m,{waitForCue:va(o)}):ee()}function ct(t,e=0,r={}){const a=t.url??t.dataUrl??"",s=a?ke(a):"",o=!!a,i=`![${t.name}](${s})`;return`
    <article class="asset-item">
      ${r.editable?`
        <div class="asset-actions">
          <button class="small-button asset-action-button" type="button" title="Use as chapter cover" aria-label="Use as chapter cover" data-action="set-chapter-cover" data-chapter-id="${r.chapterId}" data-cover-url="${u(s)}">▣</button>
          <button class="small-button asset-action-button" type="button" title="Copy markdown" data-action="copy-asset-markdown" data-markdown="${u(i)}">⧉</button>
          <button class="small-button asset-action-button danger-icon" type="button" title="Remove image" data-action="delete-asset" data-chapter-id="${r.chapterId}" data-asset-index="${e}">🗑</button>
        </div>
      `:`
        <div class="asset-actions">
          <button class="small-button asset-action-button" type="button" title="Copy markdown" data-action="copy-asset-markdown" data-markdown="${u(i)}">⧉</button>
        </div>
      `}
      ${o?`<img src="${u(s)}" alt="${u(t.name)}" />`:""}
      <strong title="${u(t.name)}">${u(t.name)}</strong>
      <div class="muted mono asset-markdown" title="${u(i)}">${u(i)}</div>
    </article>
  `}function Q(t){ne(`
      <div class="stack">
        <section class="panel">
          <h2>Not found</h2>
          <p class="muted">${u(t)}</p>
        </section>
      </div>
    `,"home")}function Qe(t){return`<div class="breadcrumbs">${t.map(([e,r])=>e?`<a href="${e}">${u(r)}</a>`:`<span>${u(r)}</span>`).join("<span>/</span>")}</div>`}async function h(){switch(ua(),n.loadError="",n.route=pa(),n.route.name){case"home":return ee(),Za();case"creator":return ee(),Qa();case"browser":return ee(),Xa();case"settings":return ee(),Ja();case"story":return ee(),tr(n.route.params.storyId);case"arc":return ee(),cr(n.route.params.storyId,n.route.params.arcId);case"chapter":return lr(n.route.params.storyId,n.route.params.arcId,n.route.params.chapterId);default:return ee(),Q("This page does not exist.")}}async function ye(){try{await h()}catch(t){console.error("Render failed:",t),n.loadError=String(t?.message||t||"The page could not be rendered."),qe.innerHTML=`
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
    `}}async function Ot(t,e,r={}){const a=document.querySelector(`#${t}`)?.value.trim()??r.coverImageUrl??"",s=document.querySelector(`#${e}`)?.value??r.coverImageMode??"fill";return{coverImageUrl:a?await De(a):"",coverImageMode:["fit","stretch"].includes(s)?s:"fill"}}async function ur(t){return{title:document.querySelector("#story-title-input")?.value.trim()??"",tags:(document.querySelector("#story-tags-input")?.value??"").split(",").map(e=>e.trim()).filter(Boolean),visibility:document.querySelector("#story-visibility-input")?.value??"private",...await Ot("story-cover-input","story-cover-mode-input",t)}}function pr(t,e,r){const a=[...t],[s]=a.splice(e,1);return a.splice(r,0,s),a}async function mr({chapterId:t,currentStoryId:e,currentArcId:r,currentPhaseId:a}){const s=k();if(!s?.id)return n.saveStatus="Sign in first to move chapters between your stories.",h();const o=await n.adapter.listCreatorStories(s.id);if(!o.length)return n.saveStatus="You need at least one story before moving chapters.",h();const c=(await Promise.all(o.map(b=>n.adapter.getStory(b.id)))).filter(Boolean).filter(b=>(b.arcs??[]).length>0);if(!c.length)return n.saveStatus="Create an arc first, then you can move chapters into it.",h();const l=document.createElement("div");l.className="modal-backdrop",l.innerHTML=`
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
  `,document.body.append(l);const d=l.querySelector("#transfer-story-select"),p=l.querySelector("#transfer-arc-select"),m=l.querySelector("#transfer-phase-select"),y=l.querySelector("#transfer-summary"),g=l.querySelector("#transfer-confirm"),P=()=>l.remove();function E(){return c.find(b=>b.id===d.value)??c[0]}function F(){return E()?.arcs.find(b=>b.id===p.value)??E()?.arcs?.[0]??null}function C(){return F()?.phases.find(b=>b.id===m.value)??F()?.phases?.[0]??null}function x(){const b=E(),M=F(),Be=C(),Xe=b?.id===e&&M?.id===r&&Be?.id===a;y.innerHTML=Xe?"This chapter is already in that exact phase.":`Destination: <strong>${u(b?.title??"-")}</strong> / <strong>${u(M?.title??"-")}</strong> / <strong>${u(Be?.title??"-")}</strong>`,g.disabled=!b||!M||!Be||Xe}function A(){const b=F();m.innerHTML=(b?.phases??[]).map(M=>`<option value="${M.id}" ${M.id===a&&b.id===r?"selected":""}>${u(M.title)}</option>`).join(""),x()}function N(){const b=E();p.innerHTML=(b?.arcs??[]).map(M=>`<option value="${M.id}" ${M.id===r&&b.id===e?"selected":""}>${u(M.title)}</option>`).join(""),A()}d.innerHTML=c.map(b=>`<option value="${b.id}" ${b.id===e?"selected":""}>${u(b.title)}</option>`).join(""),d.addEventListener("change",N),p.addEventListener("change",A),m.addEventListener("change",x),l.querySelector("#transfer-cancel").addEventListener("click",P),g.addEventListener("click",async()=>{const b=C(),M=F();if(!(!b||!M))return await n.adapter.transferChapter(t,M.id,b.id),P(),n.saveStatus="Chapter moved to a new story location.",h()}),N()}async function dt(){if(n.currentUser)return await n.authClient.signOut(),z(null),n.saveStatus="Signed out.",n.authError="",n.authErrorCode="",h();if(n.authClient.mode==="firebase")try{const e=await n.authClient.signIn();return z({id:e.uid,name:e.displayName||e.email||"Creator",email:e.email,mode:"firebase",structureView:"list"}),n.authError="",n.authErrorCode="",n.saveStatus="Signed in with Firebase.",h()}catch(e){return console.error("Firebase sign-in failed:",e),n.saveStatus="",n.authError=Rt(e),n.authErrorCode=e?.code?String(e.code):"",h()}const t=document.createElement("div");t.className="modal-backdrop",t.innerHTML=`
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
  `,document.body.append(t),t.querySelector("#modal-login-cancel").addEventListener("click",()=>t.remove()),t.querySelector("#modal-login-submit").addEventListener("click",()=>{const e=t.querySelector("#login-name").value.trim()||"Creator",r=t.querySelector("#login-email").value.trim()||"local@storyforge.local";z({id:`local-${e.toLowerCase().replaceAll(/\s+/g,"-")}`,name:e,email:r,mode:"local",structureView:"list"}),t.remove(),n.saveStatus="Signed in with a local demo profile.",n.authError="",n.authErrorCode="",h()})}function Rt(t){const e=t?.code?String(t.code):"",r=t?.message?String(t.message):"Unknown sign-in error.";return e==="auth/unauthorized-domain"?"This site domain is not authorized in Firebase Auth. Add your local/dev domain and your GitHub Pages domain in Firebase Console > Authentication > Settings > Authorized domains.":e==="auth/popup-closed-by-user"?"The sign-in popup closed before Firebase completed the login. If it closes instantly every time, double-check Authorized domains and the Google sign-in provider setup.":e==="auth/operation-not-allowed"?"Google sign-in is not enabled for this Firebase project. Enable it in Firebase Console > Authentication > Sign-in method.":e==="auth/invalid-api-key"?"Your Firebase API key is invalid. Recheck the values in your `.env` file and restart the dev server.":e==="auth/network-request-failed"?"Firebase could not complete the sign-in request. Check your connection and any browser privacy extensions blocking popups or auth requests.":e==="auth/invalid-credential"||e==="auth/internal-error"?"Google returned an invalid popup credential. This usually means the Firebase Auth Google link for this account needs repair, or the browser Google session is corrupted.":e?`${e}: ${r}`:r}async function hr(t){const e=n.route.params.chapterId,r=await n.adapter.getChapter(e);if(!r)return;const a=[...r.assets??[]];for(const i of t){const c=await Ar(i);a.push({id:crypto.randomUUID(),name:i.name,type:i.type,size:i.size,dataUrl:c})}const s=document.querySelector("#chapter-body-input"),o=a.slice((r.assets??[]).length).map(i=>`
![${i.name}](${i.dataUrl})`).join("");await n.adapter.updateChapter(e,{assets:a,body:`${s.value}${o}`}),n.dragActive=!1,n.saveStatus="Assets added to the chapter. In production these should upload to object storage instead of local state.",await h()}function fr(t){return t==="imgur.com"||t==="www.imgur.com"||t==="i.imgur.com"}function Dt(t){const e=t.replace(/^www\./i,"").toLowerCase();return e==="pixhost.to"||e==="pixhost.cc"||e==="pixho.st"||e.endsWith(".pixho.st")}function gr(t){return Dt(t.hostname)&&/^\/show\/\d+\/\d+_[^/]+$/i.test(t.pathname)}function Bt(t){const e=t.pathname.split("/").filter(Boolean).pop()??"";return/\.(avif|gif|jpe?g|png|webp)$/i.test(e)}function Ft(t){const r=t.hostname.replace(/^www\./i,"").toLowerCase().match(/^t(\d+)\.pixhost\.(?:to|cc)$/i);if(!r)return"";const a=t.pathname.match(/^\/thumbs\/(\d+)\/(\d+)_(.+)$/i);if(!a)return"";const[,s,o,i]=a;return`${t.protocol}//img${r[1]}.pixhost.to/images/${s}/${o}_${i}${t.search}`}function ke(t){try{const e=new URL(String(t??""),window.location.href);return Ft(e)||e.toString()}catch{return String(t??"")}}function vr(t){const e=String(t??"").trim(),r=[/\bsrc=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i,/\[img\]([^\[]+)\[\/img\]/i,/!\[[^\]]*\]\(([^)]+)\)/i];for(const s of r){const o=e.match(s),i=o?.[1]??o?.[2]??o?.[3]??"";if(i)return i.trim()}return(e.match(/https?:\/\/[^\s"'<>[\]()]+/gi)??[]).find(s=>{try{return Bt(new URL(s))}catch{return!1}})??e}function yr(t,e){const r=["img.image-img","img#image",".image-img",".image-show img","#show_image img",'meta[property="og:image"]','meta[name="twitter:image"]','img[src*="pixhost"]','img[src*="pixho.st"]'];for(const a of r){const s=t.querySelector(a),o=s?.getAttribute("src")??s?.getAttribute("content");if(!(!o||o.startsWith("data:")))try{const i=new URL(o,e);if(Bt(i)||Dt(i.hostname))return i.toString()}catch{}}return""}async function wr(t){let e;try{e=await fetch(t.toString(),{credentials:"include"})}catch{throw new Error("Pixhost page could not be opened by the browser. Paste Pixhost's Forum small image, HTML small image, or direct image link instead.")}if(!e.ok)throw new Error("Pixhost page could not be opened. Paste Pixhost's Forum small image, HTML small image, or direct image link instead.");const r=await e.text(),a=new DOMParser().parseFromString(r,"text/html"),s=yr(a,t.toString());if(!s)throw new Error("Pixhost page could not be converted to a direct image. Paste Pixhost's Forum small image, HTML small image, or direct image link instead.");return s}async function De(t){const e=vr(t);if(!e)throw new Error("Add an image URL first.");let r;try{r=new URL(e)}catch{throw new Error("That image URL is not valid.")}if(!["http:","https:"].includes(r.protocol))throw new Error("Use an http or https image URL.");const a=r.pathname.split("/").filter(Boolean).pop()??"",s=/\.[a-z0-9]{2,5}$/i.test(a);fr(r.hostname)&&a&&!s&&(r.pathname=`${r.pathname}.png`);const o=Ft(r);return o||(gr(r)?wr(r):r.toString())}async function br(t){const e=await n.adapter.getChapter(t);if(!e)throw new Error("Chapter not found.");const r=document.querySelector("#asset-name-input"),a=document.querySelector("#asset-url-input"),s=document.querySelector("#chapter-title-input"),o=document.querySelector("#chapter-body-input"),i=r?.value.trim()||"image",c=await De(a?.value??""),l={id:crypto.randomUUID(),name:i,type:"image/external",url:c},d=[...e.assets??[],l];await n.adapter.updateChapter(t,{title:s?.value.trim()||e.title||"Untitled Chapter",body:o?.value??e.body??"",assets:d}),r&&(r.value=""),a&&(a.value=""),n.saveStatus="External image link added to the chapter assets.",await h()}function Sr(t,e,r,a){return`<!doctype html>
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
    <div class="meta">${u(t.title)} / ${u(e.title)} / ${u(r.title)} ${X(a)?"":'<span class="draft">Draft</span>'}</div>
    <h1>${u(a.title||"Untitled Chapter")}</h1>
    ${Oe(a,"")}
  </main>
</body>
</html>`}async function $r(t){const e=await n.adapter.getStory(t);if(!e)throw new Error("Story not found.");const{default:r}=await ut(async()=>{const{default:i}=await import("./jszip.min-D7KnG0-e.js").then(c=>c.j);return{default:i}},[]),a=new r,s=a.folder(he(e.title,"Story"));e.arcs.forEach((i,c)=>{const l=s.folder(`${String(c+1).padStart(2,"0")} - ${he(i.title,"Arc")}`);(i.phases??[]).forEach((d,p)=>{const m=l.folder(`${String(p+1).padStart(2,"0")} - ${he(d.title,"Phase")}`);(d.chapters??[]).forEach((y,g)=>{const P=`${String(g+1).padStart(2,"0")} - ${he(y.title,"Chapter")}.html`;m.file(P,Sr(e,i,d,y))})})});const o=await a.generateAsync({type:"blob"});Ha(o,`${he(e.title,"story-export")}.zip`)}async function ze(t){if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(t);return}const e=document.createElement("textarea");e.value=t,e.setAttribute("readonly",""),e.style.position="fixed",e.style.opacity="0",document.body.append(e),e.select(),document.execCommand("copy"),e.remove()}async function Ir(t,e){const r=await n.adapter.getChapter(t);if(!r)throw new Error("Chapter not found.");const a=[...r.assets??[]];if(e<0||e>=a.length)throw new Error("Image could not be found.");a.splice(e,1);const s=document.querySelector("#chapter-title-input"),o=document.querySelector("#chapter-body-input");await n.adapter.updateChapter(t,{title:s?.value.trim()||r.title||"Untitled Chapter",body:o?.value??r.body??"",assets:a}),n.saveStatus="Image removed from chapter assets.",await h()}function kr(t,e,r){const a=`<img src="${u(r)}" alt="word-image-${e}" />`,s=String(t??""),o=new RegExp(`<div\\b(?=[^>]*data-word-image-placeholder=["']${e}["'])[^>]*>[\\s\\S]*?<\\/div>`,"i");if(o.test(s))return s.replace(o,a);const i=new RegExp(`<[^>]+>[^<]*\\[IMAGE\\s+${e}\\s+HERE\\][\\s\\S]*?<\\/[^>]+>`,"i");return i.test(s)?s.replace(i,a):s.replace(new RegExp(`\\[IMAGE\\s+${e}\\s+HERE\\]`,"i"),a)}async function Er(t,e){const r=await n.adapter.getChapter(t);if(!r)throw new Error("Chapter not found.");const a=document.querySelector(`[data-word-image-url="${e}"]`),s=await De(a?.value??""),o=kr(r.body??"",e,s);await n.adapter.updateChapter(t,{body:o,renderMode:"html",htmlBackground:be().htmlBackground}),n.saveStatus=`IMAGE ${e} replaced.`,await h()}async function lt(){const t=k();if(!t?.id)return;const e=await n.adapter.getUserProfile?.(t.id);e&&z({...t,name:e.name||t.name,email:e.email||t.email,penName:e.penName??"",structureView:e.structureView??t.structureView??"list",readerSettings:e.readerSettings??t.readerSettings??pe(t)})}function Te(t){return window.confirm(`Are you sure you want to delete this ${t}? This cannot be undone.`)}function Ar(t){return new Promise((e,r)=>{const a=new FileReader;a.onload=()=>e(String(a.result)),a.onerror=()=>r(a.error),a.readAsDataURL(t)})}document.addEventListener("click",async t=>{const e=t.target.closest("[data-action]");if(!e)return;const r=e.dataset.action;if(r==="toggle-image-view"){const a=e.closest(".chapter-image-frame");if(!a)return;const s=a.dataset.imageView==="desired"?"fill":"desired";Mt(a,s);return}if(r==="sign-in-redirect")return n.saveStatus="Opening full-page Google sign-in...",n.authError="",n.authErrorCode="",await n.authClient.signInWithRedirect?.(),h();if(r==="play-music-cue"){const a=e.dataset.musicTrigger;a&&Et(a,{source:"button"});return}if(r==="toggle-login")return dt();if(r==="open-settings")return U("/settings");if(r==="apply-story-filters"){const a=document.querySelector("#story-search").value.trim(),s=document.querySelector("#story-tag-filter").value;return U(`/creator${a||s?`?${new URLSearchParams({q:a,tag:s}).toString()}`:""}`)}if(r==="apply-browser-filters"){const a=document.querySelector("#browser-creator-filter").value,s=document.querySelector("#browser-group-mode").value;return U(`/browser?${new URLSearchParams({creator:a,group:s}).toString()}`)}if(r==="create-story"){const a=k();if(!a)return n.saveStatus="Sign in first to create stories in Firebase mode.",dt();const s=await n.adapter.createStory({creatorId:a.id,creatorName:Ne(a),title:"Untitled Story",tags:["draft"],visibility:"private"});return U(`/stories/${s.id}`)}if(r==="save-story-settings"){const a=e.dataset.storyId,s=await n.adapter.getStory(a),o=await ur(s);return await n.adapter.updateStory(a,o),n.saveStatus="Story details saved.",h()}if(r==="add-story-editor"){const a=window.prompt("Editor Gmail address");if(a===null)return;if(!a.trim())return n.saveStatus="Enter an editor email first.",h();const s=ue(k()?.email),o=ue(a);return s&&s===o?(n.saveStatus="You are already the author of this story.",h()):(await n.adapter.addStoryEditor(e.dataset.storyId,a),n.saveStatus=`Editor added: ${o}`,h())}if(r==="remove-story-editor"){const a=e.dataset.editorEmail??"";return a?(await n.adapter.removeStoryEditor(e.dataset.storyId,a),n.saveStatus=`Editor removed: ${ue(a)}`,h()):(n.saveStatus="Editor email could not be found.",h())}if(r==="export-story"){try{n.saveStatus="Preparing story export...";const a=document.querySelector(".notice .muted");a&&(a.textContent=n.saveStatus),await $r(e.dataset.storyId),n.saveStatus="Story export downloaded."}catch(a){n.saveStatus=`Export failed: ${String(a.message||a)}`}return h()}if(r==="open-story-transfer"){const a=Z();return a.set("transfer","1"),U(`/stories/${e.dataset.storyId}?${a.toString()}`)}if(r==="close-story-transfer"){const a=Z();a.delete("transfer");const s=a.toString();return U(`/stories/${e.dataset.storyId}${s?`?${s}`:""}`)}if(r==="submit-story-transfer"){const a=k();if(!a?.email)return n.saveStatus="Sign in with an email address before transferring ownership.",h();const s=document.querySelector("#story-transfer-email-input")?.value.trim()??"",o=document.querySelector("#story-transfer-confirm-input")?.value.trim()??"";if(!s)return n.saveStatus="Enter the recipient Gmail address first.",h();if(s.toLowerCase()===String(a.email).trim().toLowerCase())return n.saveStatus="You cannot transfer a story to your own email.",h();if(o!=="TRANSFER")return n.saveStatus="Type TRANSFER exactly to confirm ownership transfer.",h();await n.adapter.requestStoryTransfer(e.dataset.storyId,s,{id:a.id,name:Ne(a),email:a.email}),n.saveStatus="Ownership transfer request sent. The story stays with you until the recipient accepts.";const i=Z();i.delete("transfer");const c=i.toString();return U(`/stories/${e.dataset.storyId}${c?`?${c}`:""}`)}if(r==="cancel-story-transfer")return await n.adapter.cancelStoryTransfer(e.dataset.storyId),n.saveStatus="Ownership transfer cancelled.",h();if(r==="accept-story-transfer"){const a=k();try{return await n.adapter.acceptStoryTransfer(e.dataset.storyId,{id:a.id,name:a.name,email:a.email,penName:a.penName??""}),n.saveStatus="Story ownership transferred to you.",U("/creator")}catch(s){return n.saveStatus=`Transfer accept failed: ${String(s?.message||s)}`,h()}}if(r==="decline-story-transfer"){const a=k();try{return await n.adapter.declineStoryTransfer(e.dataset.storyId,a.email),n.saveStatus="Ownership transfer declined.",h()}catch(s){return n.saveStatus=`Transfer decline failed: ${String(s?.message||s)}`,h()}}if(r==="create-arc"){const a=e.dataset.storyId,s=await n.adapter.createArc(a,`Arc ${Math.floor(Math.random()*90+10)}`);return U(`/stories/${a}/arcs/${s.id}`)}if(r==="save-arc-title"){const a=await n.adapter.getArc(e.dataset.arcId);return await n.adapter.updateArc(e.dataset.arcId,{title:document.querySelector("#arc-title-input").value.trim()||"Untitled Arc",...await Ot("arc-cover-input","arc-cover-mode-input",a)}),n.saveStatus="Arc details saved.",h()}if(r==="add-soundtrack"){const a=await n.adapter.getChapter(e.dataset.chapterId),s=document.querySelector("#soundtrack-label-input")?.value.trim()??"",o=document.querySelector("#soundtrack-url-input")?.value.trim()??"",i=yt({id:ge("soundtrack"),label:s,url:o});if(!i)return n.saveStatus="Please enter a valid YouTube link.",h();const c=be();return await n.adapter.updateChapter(a.id,{title:document.querySelector("#chapter-title-input")?.value.trim()||a.title||"Untitled Chapter",body:c.body,published:document.querySelector("#chapter-published-input")?.checked??X(a),dmNotes:document.querySelector("#chapter-dm-notes-input")?.value??a.dmNotes??"",renderMode:c.renderMode,htmlBackground:c.htmlBackground,soundtracks:[...a.soundtracks??[],{id:i.id,label:i.label,url:i.url}]}),n.saveStatus="Soundtrack added.",h()}if(r==="copy-soundtrack-marker"){const a=`[music: ${e.dataset.soundtrackId}]`;try{await ze(a),n.saveStatus=`Copied music cue: ${a}`}catch{n.saveStatus=`Copy failed. Use this cue manually: ${a}`}const s=document.querySelector(".notice.mono");s&&(s.textContent=n.saveStatus);return}if(r==="delete-soundtrack"){const a=await n.adapter.getChapter(e.dataset.chapterId);return await n.adapter.updateChapter(a.id,{soundtracks:(a.soundtracks??[]).filter(s=>s.id!==e.dataset.soundtrackId)}),n.saveStatus="Soundtrack removed.",h()}if(r==="add-video"){const a=await n.adapter.getChapter(e.dataset.chapterId),s=document.querySelector("#video-label-input")?.value.trim()??"",o=document.querySelector("#video-url-input")?.value.trim()??"",i=wt({id:ge("video"),label:s,url:o});if(!i)return n.saveStatus="Please enter a valid YouTube video link.",h();const c=be();return await n.adapter.updateChapter(a.id,{title:document.querySelector("#chapter-title-input")?.value.trim()||a.title||"Untitled Chapter",body:c.body,published:document.querySelector("#chapter-published-input")?.checked??X(a),dmNotes:document.querySelector("#chapter-dm-notes-input")?.value??a.dmNotes??"",renderMode:c.renderMode,htmlBackground:c.htmlBackground,videos:[...a.videos??[],{id:i.id,label:i.label,url:i.url}]}),n.saveStatus="Video added. Copy its embed marker into the chapter.",h()}if(r==="copy-video-marker"){const a=`[video: ${e.dataset.videoId}]`;try{await ze(a),n.saveStatus=`Copied video embed: ${a}`}catch{n.saveStatus=`Copy failed. Use this marker manually: ${a}`}const s=document.querySelector(".notice.mono");s&&(s.textContent=n.saveStatus);return}if(r==="delete-video"){const a=await n.adapter.getChapter(e.dataset.chapterId);return await n.adapter.updateChapter(a.id,{videos:(a.videos??[]).filter(s=>s.id!==e.dataset.videoId)}),n.saveStatus="Video removed.",h()}if(r==="move-arc-up"||r==="move-arc-down"){const a=await n.adapter.getStory(e.dataset.storyId),s=Number(e.dataset.index),o=r==="move-arc-up"?-1:1;return await n.adapter.reorderArcs(a.id,pr(a.arcIds,s,s+o)),h()}if(r==="create-chapter"){const a=await n.adapter.createChapter(e.dataset.arcId,"Untitled Chapter");return U(`/stories/${e.dataset.storyId}/arcs/${e.dataset.arcId}/chapters/${a.id}`)}if(r==="create-phase"){const a=window.prompt("Phase title","New Phase");return a===null?void 0:(await n.adapter.createPhase(e.dataset.arcId,a),n.saveStatus="Phase created.",h())}if(r==="rename-phase"){const a=window.prompt("Rename phase",e.dataset.phaseTitle||"Phase");if(a===null)return;const s=await n.adapter.getArc(e.dataset.arcId);return await n.adapter.renamePhase(e.dataset.arcId,e.dataset.phaseId,a),a.trim()?n.saveStatus="Phase renamed.":n.saveStatus=(s?.phases?.length??0)<=1?"Only phase restored to Chapters.":"Phase deleted. Its chapters were moved into the next phase.",h()}if(r==="open-transfer-chapter")return mr({chapterId:e.dataset.chapterId,currentStoryId:e.dataset.storyId,currentArcId:e.dataset.arcId,currentPhaseId:e.dataset.phaseId});if(r==="move-chapter-up"||r==="move-chapter-down")return await n.adapter.moveChapter(e.dataset.arcId,e.dataset.chapterId,r==="move-chapter-up"?"up":"down"),h();if(r==="save-chapter"){const a=e.dataset.chapterId,s=await n.adapter.getChapter(a),o=await st(s);if(await n.adapter.updateChapter(a,o),n.saveStatus="Chapter saved.",o.published)try{const i=await da({storyId:n.route.params.storyId,arcId:n.route.params.arcId,chapterId:a});i.skipped?n.saveStatus=`Chapter saved. ${i.reason}`:n.saveStatus=i.type==="published"?"Chapter saved and its first publication was announced on Discord.":"Chapter saved and its update was announced on Discord."}catch(i){n.saveStatus=`Chapter saved, but Discord announcement failed: ${String(i.message||i)}`}return h()}if(r==="set-chapter-cover"||r==="clear-chapter-cover"){const a=e.dataset.chapterId,s=await n.adapter.getChapter(a),o=r==="set-chapter-cover"?e.dataset.coverUrl:"";return await n.adapter.updateChapter(a,await st(s,{coverImageUrl:o})),n.saveStatus=o?"Chapter cover updated.":"Chapter cover cleared.",h()}if(r==="open-docx-import"){document.querySelector("#docx-import-input")?.click();return}if(r==="switch-markdown-mode")return window.confirm("Switch to Markdown Mode? This will clear the imported Word HTML from this chapter.")?(await n.adapter.updateChapter(n.route.params.chapterId,{body:"",renderMode:"markdown",htmlBackground:""}),n.saveStatus="Switched to Markdown Mode. Imported Word HTML was cleared.",h()):void 0;if(r==="clear-html-background"){const a=document.querySelector("#chapter-html-background-input");a&&(a.value="#120f0d");const s=document.querySelector("#chapter-render-mode-input");s&&(s.value="html"),We(),n.saveStatus="HTML background reset to the site background. Click Save to keep this.";const o=document.querySelector(".notice.mono");o&&(o.textContent=n.saveStatus);return}if(r==="save-pen-name"){const a=k(),s=document.querySelector("#pen-name-input").value.trim(),o=await n.adapter.updateUserProfile(a.id,{name:a.name,email:a.email,penName:s,structureView:a.structureView??"list",readerSettings:a.readerSettings??pe(a)});return z({...a,penName:o.penName??"",name:o.name??a.name,email:o.email??a.email,structureView:o.structureView??a.structureView??"list",readerSettings:o.readerSettings??a.readerSettings??pe(a)}),n.saveStatus=s?"Pen name saved.":"Pen name cleared. Account name will be used.",h()}if(r==="save-reader-settings"){const a=k(),s={fontSize:Number(document.querySelector("#reader-font-size-input")?.value)||17,lineHeight:Number(document.querySelector("#reader-line-height-input")?.value)||1.85,width:Number(document.querySelector("#reader-width-input")?.value)||920},o=await n.adapter.updateUserProfile(a.id,{name:a.name,email:a.email,penName:a.penName??"",structureView:a.structureView??"list",readerSettings:s});return z({...a,...o,readerSettings:s}),n.saveStatus="Reader settings saved.",h()}if(r==="add-comment"){const a=k(),o=document.querySelector("#chapter-comment-input")?.value.trim()??"";if(!a||!o)return n.saveStatus="Sign in and write a comment first.",h();const i=await n.adapter.getChapter(e.dataset.chapterId);try{n.authClient?.mode==="firebase"?await _e("add-comment",{chapterId:i.id,commentBody:o}):await(n.adapter.updateChapterEngagement??n.adapter.updateChapter)(i.id,{comments:[...i.comments??[],{id:ge("comment"),userId:a.id,userName:Ne(a),body:o,createdAt:new Date().toISOString()}]})}catch(c){return n.saveStatus=`Comment failed: ${String(c.message||c)}`,h()}return n.saveStatus="Comment added.",h()}if(r==="toggle-reaction"){const a=k();if(!a)return n.saveStatus="Sign in to react.",h();const s=await n.adapter.getChapter(e.dataset.chapterId),o=e.dataset.emoji;try{if(n.authClient?.mode==="firebase")await _e("toggle-reaction",{chapterId:s.id,emoji:o});else{const i={...s.reactions??{}},c=new Set(i[o]??[]);c.has(a.id)?c.delete(a.id):c.add(a.id),i[o]=[...c],await(n.adapter.updateChapterEngagement??n.adapter.updateChapter)(s.id,{reactions:i})}}catch(i){return n.saveStatus=`Reaction failed: ${String(i.message||i)}`,h()}return n.saveStatus="Reaction updated.",h()}if(r==="delete-comment"){const a=k();if(!a)return n.saveStatus="Sign in to delete a comment.",h();const[s,o]=await Promise.all([n.adapter.getChapter(e.dataset.chapterId),n.adapter.getStory(n.route.params.storyId)]),i=[...s.comments??[]],c=e.dataset.commentId,l=Number(e.dataset.commentIndex),d=c?i.findIndex(m=>m.id===c):l,p=i[d];if(!p)return n.saveStatus="Comment not found.",h();if(p.userId!==a.id&&!Ie(o))return n.saveStatus="Only the commenter or a story editor can delete this comment.",h();try{n.authClient?.mode==="firebase"?await _e("delete-comment",{chapterId:s.id,commentId:c,commentIndex:d}):(i.splice(d,1),await(n.adapter.updateChapterEngagement??n.adapter.updateChapter)(s.id,{comments:i}))}catch(m){return n.saveStatus=`Comment deletion failed: ${String(m.message||m)}`,h()}return n.saveStatus="Comment deleted.",h()}if(r==="delete-story")return Te("story")?(await n.adapter.deleteStory(e.dataset.storyId),n.saveStatus="Story deleted.",U("/creator")):void 0;if(r==="delete-arc")return Te("arc")?(await n.adapter.deleteArc(e.dataset.arcId),n.saveStatus="Arc deleted.",U(`/stories/${e.dataset.storyId}`)):void 0;if(r==="delete-chapter")return Te("chapter")?(await n.adapter.deleteChapter(e.dataset.chapterId),n.saveStatus="Chapter deleted.",U(`/stories/${e.dataset.storyId}/arcs/${e.dataset.arcId}`)):void 0;if(r==="add-external-asset")try{return await br(e.dataset.chapterId)}catch(a){return n.saveStatus=String(a.message||a),h()}if(r==="copy-asset-markdown"){try{await ze(e.dataset.markdown??""),n.saveStatus="Image markdown copied to clipboard."}catch(s){n.saveStatus=`Copy failed: ${String(s.message||s)}`}const a=document.querySelector(".notice.mono");a&&(a.textContent=n.saveStatus);return}if(r==="delete-asset"){if(!Te("image"))return;try{return await Ir(e.dataset.chapterId,Number(e.dataset.assetIndex))}catch(a){return n.saveStatus=String(a.message||a),h()}}if(r==="replace-word-image")try{return await Er(e.dataset.chapterId,Number(e.dataset.imageIndex))}catch(a){n.saveStatus=String(a.message||a);const s=document.querySelector(".notice.mono");s&&(s.textContent=n.saveStatus);return}if(r==="toggle-soundtrack"){if(!q())return;n.soundtrack.paused?kt():It();return}if(r==="toggle-volume-popout"){if(!q())return;n.soundtrack.volumeOpen=!n.soundtrack.volumeOpen,ie();return}});document.addEventListener("change",async t=>{const e=t.target;if(e instanceof HTMLInputElement&&e.id==="docx-import-input"){const r=e.files?.[0];if(e.value="",!r)return;n.saveStatus="Importing Word file...";const a=document.querySelector(".notice.mono");a&&(a.textContent=n.saveStatus);try{await za(r)}catch(s){n.saveStatus=`Word import failed: ${String(s.message||s)}`,a&&(a.textContent=n.saveStatus)}return}});document.addEventListener("input",t=>{if(t.target instanceof HTMLInputElement&&(t.target.id==="reader-font-size-input"||t.target.id==="reader-line-height-input"||t.target.id==="reader-width-input")){const e=document.querySelector("#reader-settings-preview");if(e){const r=Number(document.querySelector("#reader-font-size-input")?.value)||17,a=Number(document.querySelector("#reader-line-height-input")?.value)||1.85,s=Number(document.querySelector("#reader-width-input")?.value)||920;e.style.setProperty("--reader-font-size",`${r}px`),e.style.setProperty("--reader-line-height",String(a)),e.style.setProperty("--reader-width",`${s}px`)}return}if(t.target instanceof HTMLInputElement&&t.target.dataset.action==="set-volume"){Ct(t.target.value);return}if(t.target instanceof HTMLInputElement&&t.target.dataset.action==="set-html-background"){We();return}if(t.target.id==="chapter-body-input"&&We(),t.target.id==="chapter-title-input"){const e=t.target.value.trim()||"Untitled chapter",r=document.querySelector(".page-title h2");r&&(r.textContent=e)}});document.addEventListener("click",t=>{const e=t.target;e instanceof Element&&(e.closest(".quick-tool-stack")||n.soundtrack.volumeOpen&&(n.soundtrack.volumeOpen=!1,ie()))});document.addEventListener("wheel",t=>{const e=t.target;e instanceof Element&&e.closest("[data-wheel-volume='true']")&&q()&&(t.preventDefault(),Ia(t.deltaY<0?5:-5))},{passive:!1});document.addEventListener("dragover",t=>{if(n.route.name!=="chapter")return;t.preventDefault(),n.dragActive=!0;const e=document.querySelector("[data-dropzone='assets']");e&&e.classList.add("is-active")});document.addEventListener("dragleave",t=>{if(n.route.name!=="chapter"||t.relatedTarget)return;n.dragActive=!1;const e=document.querySelector("[data-dropzone='assets']");e&&e.classList.remove("is-active")});document.addEventListener("drop",async t=>{if(n.route.name!=="chapter")return;t.preventDefault();const e=document.querySelector("[data-dropzone='assets']");e&&e.classList.remove("is-active");const r=[...t.dataTransfer.files].filter(a=>a.type.startsWith("image/"));r.length&&await hr(r)});window.addEventListener("hashchange",()=>{n.saveStatus="",window.scrollTo({top:0,left:0,behavior:"auto"}),ye()});async function Cr(){const t=oa();if(n.authClient=t,n.adapter=await aa(t),n.authClient.mode==="firebase"){try{const e=await n.authClient.getRedirectUser?.();e&&(z({id:e.uid,name:e.displayName||e.email||"Creator",email:e.email,mode:"firebase"}),n.authError="",n.authErrorCode="",n.saveStatus="Signed in with Firebase.")}catch(e){console.error("Firebase redirect sign-in failed:",e),n.authError=Rt(e),n.authErrorCode=e?.code?String(e.code):""}n.authClient.watchAuth(e=>{e?(z({id:e.uid,name:e.displayName||e.email||"Creator",email:e.email,mode:"firebase"}),lt().finally(()=>ye())):(z(null),ye())})}else n.currentUser?.id&&await lt();window.location.hash?ye():U("/")}Cr().catch(t=>{qe.innerHTML=`
    <main class="content">
      <section class="panel">
        <h2>App failed to start</h2>
        <p class="muted">${u(String(t.message||t))}</p>
        <p class="muted">Current mode: ${u(Re().mode)}</p>
      </section>
    </main>
  `});
