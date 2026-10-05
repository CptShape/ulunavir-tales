import{d as ve,a as f,g as A,u as b,s as Ce,b as Z,q as ce,w as X,c as ee,e as la,f as ua,i as pa,h as ma,j as ha,G as fa,o as ga,k as va,l as ya,m as ba,n as wa}from"./firebase-Bo9AT5dx.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function r(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(n){if(n.ep)return;n.ep=!0;const s=r(n);fetch(n.href,s)}})();const Sa="modulepreload",$a=function(t){return"/ulunavir-tales/"+t},bt={},Pt=function(e,r,a){let n=Promise.resolve();if(r&&r.length>0){let d=function(l){return Promise.all(l.map(u=>Promise.resolve(u).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=o?.nonce||o?.getAttribute("nonce");n=d(r.map(l=>{if(l=$a(l),l in bt)return;bt[l]=!0;const u=l.endsWith(".css"),m=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${m}`))return;const y=document.createElement("link");if(y.rel=u?"stylesheet":Sa,u||(y.as="script"),y.crossOrigin="",y.href=l,c&&y.setAttribute("nonce",c),document.head.appendChild(y),u)return new Promise((g,w)=>{y.addEventListener("load",g),y.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${l}`)))})}))}function s(o){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o}return n.then(o=>{for(const c of o||[])c.status==="rejected"&&s(c.reason);return e().catch(s)})},Fe="storyforge-state-v1",rt="story-demo",De="arc-demo",Ve="chapter-demo",Ne="Chapters";function M(t){return String(t??"").trim().toLowerCase()}function ze(t,e){const r=M(e);return!r||t?.pendingTransferStatus!=="pending"?!1:[t.pendingTransferEmailLower,M(t.pendingTransfer?.targetEmail)].includes(r)}const Be={users:{"demo-user":{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",emailLower:"demo@storyforge.local",penName:""}},stories:{[rt]:{id:rt,title:"The Clockwork Harbor",coverImageUrl:"",coverImageMode:"fill",tags:["fantasy","mystery","serial"],visibility:"public",creatorId:"demo-user",creatorName:"Demo Creator",editorEmails:[],pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",arcIds:[De],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},arcs:{[De]:{id:De,storyId:rt,title:"Tide One",coverImageUrl:"",coverImageMode:"fill",chapterIds:[Ve],soundtracks:[],phases:[{id:"phase-demo",title:Ne,chapterIds:[Ve]}],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}},chapters:{[Ve]:{id:Ve,arcId:De,title:"Lanterns on the Pier",body:`# Opening scene

A storm hangs over the harbor while the first lanterns come alive.`,published:!0,dmNotes:"",comments:[],reactions:{},renderMode:"markdown",htmlBackground:"",assets:[],soundtracks:[],videos:[],createdAt:new Date("2026-08-18T10:00:00Z").toISOString(),updatedAt:new Date("2026-08-18T10:00:00Z").toISOString()}}};function z(t){return`${t}-${crypto.randomUUID().slice(0,8)}`}function wt(t){return JSON.parse(JSON.stringify(t))}function Le(t){return["fit","stretch"].includes(t)?t:"fill"}function _(t){return t.flatMap(e=>e.chapterIds??[])}function We(t,e,r){const a=[...t];return[a[e],a[r]]=[a[r],a[e]],a}function Pe(t=[]){return{id:z("phase"),title:Ne,chapterIds:[...t]}}function ae(t){const e=Le(t.coverImageMode),r=t.hasEverBeenPublished??t.published===!0,a=t.audioSettings??{},n=(o,c)=>{const d=Number(o);return Number.isFinite(d)?Math.max(0,Math.min(100,d)):c},s=o=>{if(o==null||o==="")return 100;const c=Number(o);return Number.isFinite(c)?Math.max(0,Math.min(200,c)):100};return{...t,body:t.body??"",coverImageUrl:t.coverImageUrl??"",coverImageMode:e,published:t.published??!0,hasEverBeenPublished:r,dmNotes:t.dmNotes??"",comments:t.comments??[],reactions:t.reactions??{},assets:t.assets??[],characters:(t.characters??[]).map(o=>{const c=o.name?.trim()||"character";return{id:o.id??z("character"),dialogId:o.dialogId?.trim()||c,displayName:o.displayName?.trim()||c,mainColor:/^#[0-9a-f]{6}$/i.test(o.mainColor??"")?o.mainColor:"#8f5f35",secondaryColor:/^#[0-9a-f]{6}$/i.test(o.secondaryColor??"")?o.secondaryColor:"#d7b56d"}}),soundtracks:(t.soundtracks??[]).map(o=>({...o,trackType:["soundtrack","ambience","sound-effect"].includes(o.trackType)?o.trackType:"soundtrack",volumeMultiplier:s(o.volumeMultiplier)})),audioSettings:{masterVolume:n(a.masterVolume,100),soundtrackVolume:n(a.soundtrackVolume,70),ambienceVolume:n(a.ambienceVolume,70),soundEffectVolume:n(a.soundEffectVolume,85)},videos:t.videos??[],renderMode:t.renderMode??"markdown",htmlBackground:t.htmlBackground??""}}function F(t){const e=[...t.chapterIds??[]],r=Array.isArray(t.phases)&&t.phases.length?t.phases.map(o=>({id:o.id??z("phase"),title:o.title?.trim()||Ne,chapterIds:[...o.chapterIds??[]]})):[Pe(e)],a=new Set;for(const o of r)o.chapterIds=o.chapterIds.filter(c=>!c||a.has(c)?!1:(a.add(c),!0));const n=e.filter(o=>!a.has(o));n.length&&r[0].chapterIds.push(...n);const s=_(r);return{...t,coverImageUrl:t.coverImageUrl??"",coverImageMode:Le(t.coverImageMode),chapterIds:s,soundtracks:t.soundtracks??[],phases:r}}function $(){const t=localStorage.getItem(Fe);if(!t)return localStorage.setItem(Fe,JSON.stringify(Be)),wt(Be);try{return JSON.parse(t)}catch{return localStorage.setItem(Fe,JSON.stringify(Be)),wt(Be)}}function C(t){localStorage.setItem(Fe,JSON.stringify(t))}function W(t,e){const r=(t.arcIds??[]).map(a=>e.arcs[a]).filter(Boolean).map(a=>je(a,e));return{...t,coverImageUrl:t.coverImageUrl??"",coverImageMode:Le(t.coverImageMode),pendingTransfer:t.pendingTransfer??null,pendingTransferEmailLower:t.pendingTransferEmailLower??"",pendingTransferStatus:t.pendingTransferStatus??"",arcIds:t.arcIds??[],arcs:r}}function je(t,e){const r=F(t),a=r.chapterIds.map(n=>e.chapters[n]).filter(Boolean).map(ae);return{...r,chapterIds:r.chapterIds??[],chapters:a,phases:r.phases.map(n=>({...n,chapters:n.chapterIds.map(s=>e.chapters[s]).filter(Boolean).map(ae)}))}}function Q(t,e){const r=t.arcs[e];if(!r)return!1;const a=F(r),n=JSON.stringify({chapterIds:r.chapterIds??[],phases:r.phases??[]})!==JSON.stringify({chapterIds:a.chapterIds,phases:a.phases});return n&&(t.arcs[e]={...t.arcs[e],chapterIds:a.chapterIds,phases:a.phases}),n}function Ia(){return{mode:"local",async getUserProfile(t){return t?$().users[t]??null:null},async updateUserProfile(t,e){const r=$(),a=r.users[t]??{id:t,name:e.name??"Creator",email:e.email??"",emailLower:M(e.email),penName:""};r.users[t]={...a,...e,emailLower:M(e.email??a.email)};const n=r.users[t].penName?.trim()||r.users[t].name||"Creator";for(const s of Object.values(r.stories))s.creatorId===t&&(s.creatorName=n);return C(r),r.users[t]},async listIncomingStoryTransfers(t){const e=$(),r=M(t);return r?Object.values(e.stories).filter(a=>a.pendingTransferStatus==="pending"&&a.pendingTransferEmailLower===r).sort((a,n)=>String(n.updatedAt).localeCompare(String(a.updatedAt))).map(a=>W(a,e)):[]},async listCreatorStories(t){if(!t)return[];const e=$();return Object.values(e.stories).filter(r=>r.creatorId===t).sort((r,a)=>a.updatedAt.localeCompare(r.updatedAt)).map(r=>({...H(r),arcs:(r.arcIds??[]).map(a=>({id:a}))}))},async listEditorStories(t){const e=M(t);if(!e)return[];const r=$();return Object.values(r.stories).filter(a=>(a.editorEmails??[]).includes(e)).sort((a,n)=>String(n.updatedAt).localeCompare(String(a.updatedAt))).map(a=>H(a))},async listAllStories(){const t=$();return Object.values(t.stories).map(e=>H(e)).sort((e,r)=>String(r.updatedAt).localeCompare(String(e.updatedAt)))},async listBrowserStories(){const t=$();return Object.values(t.stories).filter(e=>e.visibility==="public").sort((e,r)=>e.creatorName.localeCompare(r.creatorName)||e.title.localeCompare(r.title)).map(e=>({...H(e),arcs:(e.arcIds??[]).map(r=>({id:r}))}))},async getStory(t){const e=$();let r=!1;for(const n of e.stories[t]?.arcIds??[])r=Q(e,n)||r;r&&C(e);const a=e.stories[t];return a?W(a,e):null},async getArc(t){const e=$();Q(e,t)&&C(e);const a=e.arcs[t];return a?je(a,e):null},async getChapter(t){const r=$().chapters[t]??null;return r?ae(r):null},async createStory({creatorId:t,creatorName:e,title:r,tags:a,visibility:n}){const s=$(),o=z("story"),c=new Date().toISOString();return s.stories[o]={id:o,title:r,coverImageUrl:"",coverImageMode:"fill",tags:a,visibility:n,creatorId:t,creatorName:e,editorEmails:[],arcIds:[],createdAt:c,updatedAt:c},C(s),W(s.stories[o],s)},async updateStory(t,e){const r=$();if(!r.stories[t])throw new Error("Story not found.");return r.stories[t]={...r.stories[t],...e,updatedAt:new Date().toISOString()},C(r),W(r.stories[t],r)},async addStoryEditor(t,e){const r=M(e);if(!r)throw new Error("Enter a valid editor email.");const a=$(),n=a.stories[t];if(!n)throw new Error("Story not found.");return n.editorEmails=[...new Set([...n.editorEmails??[],r])],n.updatedAt=new Date().toISOString(),C(a),W(n,a)},async removeStoryEditor(t,e){const r=M(e);if(!r)throw new Error("Choose an editor to remove.");const a=$(),n=a.stories[t];if(!n)throw new Error("Story not found.");return n.editorEmails=(n.editorEmails??[]).filter(s=>M(s)!==r),n.updatedAt=new Date().toISOString(),C(a),W(n,a)},async requestStoryTransfer(t,e,r){const a=$(),n=a.stories[t];if(!n)throw new Error("Story not found.");const s=M(e);if(!s)throw new Error("Enter a valid Gmail address.");return n.pendingTransfer={targetEmail:String(e).trim(),targetEmailLower:s,requestedBy:r?.id??n.creatorId,requestedByName:r?.name??n.creatorName,requestedAt:new Date().toISOString(),status:"pending"},n.pendingTransferEmailLower=s,n.pendingTransferStatus="pending",n.updatedAt=new Date().toISOString(),C(a),W(n,a)},async cancelStoryTransfer(t){const e=$(),r=e.stories[t];if(!r)throw new Error("Story not found.");return r.pendingTransfer=null,r.pendingTransferEmailLower="",r.pendingTransferStatus="",r.updatedAt=new Date().toISOString(),C(e),W(r,e)},async acceptStoryTransfer(t,e){const r=$(),a=r.stories[t];if(!a)throw new Error("Story not found.");if(!ze(a,e?.email))throw new Error("This transfer request is no longer available.");const n=M(e?.email),s=r.users[e.id]??{id:e.id,name:e.name??"Creator",email:e.email??"",emailLower:n,penName:e.penName??""};return r.users[e.id]=s,a.creatorId=e.id,a.creatorName=s.penName?.trim()||s.name||e.name||"Creator",a.pendingTransfer=null,a.pendingTransferEmailLower="",a.pendingTransferStatus="",a.updatedAt=new Date().toISOString(),C(r),W(a,r)},async declineStoryTransfer(t,e){const r=$(),a=r.stories[t];if(!a)throw new Error("Story not found.");if(!ze(a,e))throw new Error("This transfer request is no longer available.");return a.pendingTransfer=null,a.pendingTransferEmailLower="",a.pendingTransferStatus="",a.updatedAt=new Date().toISOString(),C(r),W(a,r)},async createArc(t,e){const r=$(),a=r.stories[t];if(!a)throw new Error("Story not found.");const n=z("arc"),s=new Date().toISOString();return r.arcs[n]={id:n,storyId:t,title:e,coverImageUrl:"",coverImageMode:"fill",chapterIds:[],soundtracks:[],phases:[Pe()],createdAt:s,updatedAt:s},a.arcIds.push(n),a.updatedAt=s,C(r),je(r.arcs[n],r)},async updateArc(t,e){const r=$(),a=r.arcs[t];if(!a)throw new Error("Arc not found.");return a.title=e.title??a.title,a.coverImageUrl=e.coverImageUrl??a.coverImageUrl??"",a.coverImageMode=Le(e.coverImageMode??a.coverImageMode),a.phases=e.phases??a.phases,a.chapterIds=e.chapterIds??a.chapterIds,a.soundtracks=e.soundtracks??a.soundtracks??[],a.updatedAt=new Date().toISOString(),r.stories[a.storyId].updatedAt=a.updatedAt,C(r),je(a,r)},async reorderArcs(t,e){const r=$();r.stories[t].arcIds=[...e],r.stories[t].updatedAt=new Date().toISOString(),C(r)},async createChapter(t,e){const r=$(),a=r.arcs[t];if(!a)throw new Error("Arc not found.");const n=z("chapter"),s=new Date().toISOString();return r.chapters[n]={id:n,arcId:t,title:e,body:"",coverImageUrl:"",coverImageMode:"fill",published:!1,hasEverBeenPublished:!1,dmNotes:"",comments:[],reactions:{},renderMode:"markdown",htmlBackground:"",assets:[],characters:[],soundtracks:[],audioSettings:{masterVolume:100,soundtrackVolume:70,ambienceVolume:70,soundEffectVolume:85},videos:[],createdAt:s,updatedAt:s},a.chapterIds.push(n),a.phases?.length||(a.phases=[Pe()]),a.phases[a.phases.length-1].chapterIds.push(n),a.updatedAt=s,r.stories[a.storyId].updatedAt=s,C(r),ae(r.chapters[n])},async updateChapter(t,e){const r=$();if(!r.chapters[t])throw new Error("Chapter not found.");r.chapters[t]={...r.chapters[t],...e,updatedAt:new Date().toISOString()};const a=r.arcs[r.chapters[t].arcId];return a&&(a.updatedAt=r.chapters[t].updatedAt,r.stories[a.storyId].updatedAt=a.updatedAt),C(r),r.chapters[t]},async updateChapterEngagement(t,e){const r=$();if(!r.chapters[t])throw new Error("Chapter not found.");return r.chapters[t]={...r.chapters[t],...e,updatedAt:new Date().toISOString()},C(r),ae(r.chapters[t])},async updateChapterOrder(t,e){const r=$();r.arcs[t].chapterIds=[...e],r.arcs[t].updatedAt=new Date().toISOString(),r.stories[r.arcs[t].storyId].updatedAt=r.arcs[t].updatedAt,C(r)},async createPhase(t,e){const r=$();Q(r,t);const a=r.arcs[t],n={id:z("phase"),title:e?.trim()||"New Phase",chapterIds:[]};return a.phases.push(n),a.updatedAt=new Date().toISOString(),r.stories[a.storyId].updatedAt=a.updatedAt,C(r),n},async renamePhase(t,e,r){const a=$();Q(a,t);const n=a.arcs[t],s=n.phases.find(c=>c.id===e);if(!s)throw new Error("Phase not found.");const o=r?.trim()??"";if(o)s.title=o;else if(n.phases.length<=1)s.title=Ne;else{const c=n.phases.findIndex(u=>u.id===e),d=c<n.phases.length-1?c+1:c-1,l=n.phases[d];l.chapterIds=[...s.chapterIds??[],...l.chapterIds??[]],n.phases=n.phases.filter(u=>u.id!==e),n.chapterIds=_(n.phases)}return n.updatedAt=new Date().toISOString(),a.stories[n.storyId].updatedAt=n.updatedAt,C(a),n.phases.find(c=>c.id===e)??null},async moveChapterToPhase(t,e,r){const a=$();Q(a,t);const n=a.arcs[t];for(const o of n.phases)o.chapterIds=o.chapterIds.filter(c=>c!==e);const s=n.phases.find(o=>o.id===r);if(!s)throw new Error("Phase not found.");s.chapterIds.push(e),n.chapterIds=_(n.phases),n.updatedAt=new Date().toISOString(),a.stories[n.storyId].updatedAt=n.updatedAt,C(a)},async moveChapter(t,e,r){const a=$();Q(a,t);const n=a.arcs[t];if(!n)throw new Error("Arc not found.");const s=n.phases.map(l=>({...l,chapterIds:[...l.chapterIds??[]]})),o=s.findIndex(l=>l.chapterIds.includes(e));if(o<0)throw new Error("Chapter phase not found.");const c=s[o].chapterIds.indexOf(e);if(r==="up")if(c>0)s[o].chapterIds=We(s[o].chapterIds,c,c-1);else if(o>0)s[o].chapterIds.shift(),s[o-1].chapterIds.push(e);else return;else if(r==="down")if(c<s[o].chapterIds.length-1)s[o].chapterIds=We(s[o].chapterIds,c,c+1);else if(o<s.length-1)s[o].chapterIds.pop(),s[o+1].chapterIds.unshift(e);else return;else throw new Error("Unknown chapter move direction.");const d=new Date().toISOString();n.phases=s,n.chapterIds=_(s),n.updatedAt=d,a.stories[n.storyId].updatedAt=d,C(a)},async transferChapter(t,e,r){const a=$(),n=a.chapters[t],s=a.arcs[e];if(!n)throw new Error("Chapter not found.");if(!s)throw new Error("Target arc not found.");Q(a,n.arcId),Q(a,e);const o=a.arcs[n.arcId],c=a.arcs[e];if(!(c.phases??[]).find(u=>u.id===r))throw new Error("Target phase not found.");const l=new Date().toISOString();return o&&(o.chapterIds=(o.chapterIds??[]).filter(u=>u!==t),o.phases=(o.phases??[]).map(u=>({...u,chapterIds:(u.chapterIds??[]).filter(m=>m!==t)})),o.updatedAt=l,a.stories[o.storyId]&&(a.stories[o.storyId].updatedAt=l)),c.phases=(c.phases??[]).map(u=>u.id===r?{...u,chapterIds:[...u.chapterIds??[],t]}:u),c.chapterIds=_(c.phases),c.updatedAt=l,a.stories[c.storyId]&&(a.stories[c.storyId].updatedAt=l),a.chapters[t]={...n,arcId:e,updatedAt:l},C(a),a.chapters[t]},async reorderPhaseChapters(t,e,r){const a=$();Q(a,t);const n=a.arcs[t],s=n.phases.find(o=>o.id===e);if(!s)throw new Error("Phase not found.");s.chapterIds=[...r],n.chapterIds=_(n.phases),n.updatedAt=new Date().toISOString(),a.stories[n.storyId].updatedAt=n.updatedAt,C(a)},async deleteChapter(t){const e=$(),r=e.chapters[t];if(!r)return;const a=e.arcs[r.arcId];if(a){a.chapterIds=(a.chapterIds??[]).filter(s=>s!==t),a.phases=(a.phases??[]).map(s=>({...s,chapterIds:(s.chapterIds??[]).filter(o=>o!==t)})),a.updatedAt=new Date().toISOString();const n=e.stories[a.storyId];n&&(n.updatedAt=a.updatedAt)}delete e.chapters[t],C(e)},async deleteArc(t){const e=$(),r=e.arcs[t];if(!r)return;for(const n of r.chapterIds??[])delete e.chapters[n];const a=e.stories[r.storyId];a&&(a.arcIds=(a.arcIds??[]).filter(n=>n!==t),a.updatedAt=new Date().toISOString()),delete e.arcs[t],C(e)},async deleteStory(t){const e=$(),r=e.stories[t];if(r){for(const a of r.arcIds??[]){const n=e.arcs[a];for(const s of n?.chapterIds??[])delete e.chapters[s];delete e.arcs[a]}delete e.stories[t],C(e)}}}}function H(t){return{...t,coverImageUrl:t.coverImageUrl??"",coverImageMode:Le(t.coverImageMode),pendingTransfer:t.pendingTransfer??null,pendingTransferEmailLower:t.pendingTransferEmailLower??"",pendingTransferStatus:t.pendingTransferStatus??"",arcIds:t.arcIds??[],tags:t.tags??[],editorEmails:t.editorEmails??[],arcs:(t.arcIds??[]).map(e=>({id:e}))}}function P(t){return t.exists()?{id:t.id,...t.data()}:null}function Ye(t,e){const r=new Map(e.map((a,n)=>[a,n]));return[...t].sort((a,n)=>(r.get(a.id)??0)-(r.get(n.id)??0))}async function V(t,e){const r=await A(f(t,"stories",e)),a=P(r);if(!a)return null;const n=await Z(ce(ee(t,"arcs"),X("storyId","==",e))),s=[];for(const d of Ye(n.docs.map(l=>({id:l.id,...l.data(),chapterIds:l.data().chapterIds??[]})),a.arcIds??[])){const l=F(d);s.push(l)}const o=await Promise.all(s.map(async d=>{const l=await Z(ce(ee(t,"chapters"),X("arcId","==",d.id)));return[d.id,Ye(l.docs.map(u=>ae({id:u.id,...u.data()})),d.chapterIds??[])]})),c=Object.fromEntries(o);return{...H(a),tags:a.tags??[],arcIds:a.arcIds??[],arcs:s.map(d=>({...d,chapterIds:d.chapterIds??[],phases:d.phases.map(l=>({...l,chapters:(c[d.id]??[]).filter(u=>(l.chapterIds??[]).includes(u.id))})),chapters:c[d.id]??[]}))}}async function St(t,e){if(!e?.id)return;const r=f(t,"users",e.id),a=await A(r),n=a.exists()?a.data():{},s=e.email??n.email??"",o={id:e.id,name:e.name??n.name??"Creator",email:s,emailLower:M(s),penName:e.penName??n.penName??"",structureView:e.structureView??n.structureView??"list",updatedAt:new Date().toISOString()};if(a.exists()){await b(r,o);return}await Ce(r,{...o,createdAt:new Date().toISOString()})}function ka(t){const e=t.db;return{mode:"firebase",async getUserProfile(r){if(!r)return null;const a=await A(f(e,"users",r));return P(a)},async updateUserProfile(r,a){const n=f(e,"users",r),s=await A(n),o={id:r,updatedAt:new Date().toISOString(),...a,emailLower:M(a.email??(s.exists()?s.data().email:""))};s.exists()?await b(n,o):await Ce(n,{createdAt:new Date().toISOString(),...o});const c=await A(n),d=P(c),l=d?.penName?.trim()||d?.name||"Creator",u=await Z(ce(ee(e,"stories"),X("creatorId","==",r)));return await Promise.all(u.docs.map(m=>b(f(e,"stories",m.id),{creatorName:l}))),d},async listIncomingStoryTransfers(r){const a=M(r);return a?(await Z(ce(ee(e,"stories"),X("pendingTransferStatus","==","pending"),X("pendingTransferEmailLower","==",a)))).docs.map(s=>H({id:s.id,...s.data()})).sort((s,o)=>String(o.updatedAt).localeCompare(String(s.updatedAt))):[]},async listCreatorStories(r){return r?(await Z(ce(ee(e,"stories"),X("creatorId","==",r)))).docs.map(n=>H({id:n.id,...n.data()})).sort((n,s)=>String(s.updatedAt).localeCompare(String(n.updatedAt))):[]},async listEditorStories(r){const a=M(r);return a?(await Z(ce(ee(e,"stories"),X("editorEmails","array-contains",a)))).docs.map(s=>H({id:s.id,...s.data()})).sort((s,o)=>String(o.updatedAt).localeCompare(String(s.updatedAt))):[]},async listBrowserStories(){return(await Z(ce(ee(e,"stories"),X("visibility","==","public")))).docs.map(a=>H({id:a.id,...a.data()})).sort((a,n)=>a.creatorName.localeCompare(n.creatorName)||a.title.localeCompare(n.title))},async listAllStories(){return(await Z(ee(e,"stories"))).docs.map(a=>H({id:a.id,...a.data()})).sort((a,n)=>String(n.updatedAt).localeCompare(String(a.updatedAt)))},async getStory(r){return V(e,r)},async getArc(r){const a=await A(f(e,"arcs",r)),n=P(a),s=n?F(n):null;if(!s)return null;const o=await Z(ce(ee(e,"chapters"),X("arcId","==",r)));return{...s,chapterIds:s.chapterIds??[],phases:s.phases.map(c=>({...c,chapters:Ye(o.docs.map(d=>ae({id:d.id,...d.data()})).filter(d=>(c.chapterIds??[]).includes(d.id)),c.chapterIds??[])})),chapters:Ye(o.docs.map(c=>ae({id:c.id,...c.data()})),s.chapterIds??[])}},async getChapter(r){const a=await A(f(e,"chapters",r)),n=P(a);return n?ae(n):null},async createStory({creatorId:r,creatorName:a,title:n,tags:s,visibility:o}){const c=z("story"),d=new Date().toISOString(),l={id:c,title:n,coverImageUrl:"",coverImageMode:"fill",tags:s,visibility:o,creatorId:r,creatorName:a,editorEmails:[],arcIds:[],createdAt:d,updatedAt:d};return await Ce(f(e,"stories",c),l),await St(e,{id:r,name:a}),H(l)},async updateStory(r,a){return await b(f(e,"stories",r),{...a,updatedAt:new Date().toISOString()}),V(e,r)},async addStoryEditor(r,a){const n=M(a);if(!n)throw new Error("Enter a valid editor email.");const s=await V(e,r);if(!s)throw new Error("Story not found.");const o=[...new Set([...s.editorEmails??[],n])];return await b(f(e,"stories",r),{editorEmails:o,updatedAt:new Date().toISOString()}),V(e,r)},async removeStoryEditor(r,a){const n=M(a);if(!n)throw new Error("Choose an editor to remove.");const s=await V(e,r);if(!s)throw new Error("Story not found.");const o=(s.editorEmails??[]).filter(c=>M(c)!==n);return await b(f(e,"stories",r),{editorEmails:o,updatedAt:new Date().toISOString()}),V(e,r)},async requestStoryTransfer(r,a,n){const s=M(a);if(!s)throw new Error("Enter a valid Gmail address.");return await b(f(e,"stories",r),{pendingTransfer:{targetEmail:String(a).trim(),targetEmailLower:s,requestedBy:n?.id??"",requestedByName:n?.name??"Creator",requestedAt:new Date().toISOString(),status:"pending"},pendingTransferEmailLower:s,pendingTransferStatus:"pending",updatedAt:new Date().toISOString()}),V(e,r)},async cancelStoryTransfer(r){return await b(f(e,"stories",r),{pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:new Date().toISOString()}),V(e,r)},async acceptStoryTransfer(r,a){const n=await V(e,r);if(!n)throw new Error("Story not found.");if(!ze(n,a?.email))throw new Error("This transfer request is no longer available.");M(a?.email),await St(e,a);const s=await A(f(e,"users",a.id)),o=P(s)??a,c=o.penName?.trim()||o.name||a.name||"Creator",d=new Date().toISOString();return await b(f(e,"stories",r),{creatorId:a.id,creatorName:c,pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:d}),V(e,r)},async declineStoryTransfer(r,a){const n=await V(e,r);if(!n)throw new Error("Story not found.");if(!ze(n,a))throw new Error("This transfer request is no longer available.");return await b(f(e,"stories",r),{pendingTransfer:null,pendingTransferEmailLower:"",pendingTransferStatus:"",updatedAt:new Date().toISOString()}),V(e,r)},async createArc(r,a){const n=f(e,"stories",r),s=await A(n),o=P(s);if(!o)throw new Error("Story not found.");const c=z("arc"),d=new Date().toISOString(),l={id:c,storyId:r,title:a,coverImageUrl:"",coverImageMode:"fill",chapterIds:[],soundtracks:[],phases:[Pe()],createdAt:d,updatedAt:d};return await Ce(f(e,"arcs",c),l),await b(n,{arcIds:[...o.arcIds??[],c],updatedAt:d}),l},async updateArc(r,a){const n=f(e,"arcs",r),s=new Date().toISOString();await b(n,{...a,updatedAt:s});const o=await A(n),c=P(o);return c?.storyId&&await b(f(e,"stories",c.storyId),{updatedAt:s}),this.getArc(r)},async reorderArcs(r,a){await b(f(e,"stories",r),{arcIds:a,updatedAt:new Date().toISOString()})},async createChapter(r,a){const n=f(e,"arcs",r),s=await A(n),o=P(s);if(!o)throw new Error("Arc not found.");const c=z("chapter"),d=new Date().toISOString(),l={id:c,arcId:r,title:a,body:"",coverImageUrl:"",coverImageMode:"fill",published:!1,hasEverBeenPublished:!1,dmNotes:"",comments:[],reactions:{},renderMode:"markdown",htmlBackground:"",assets:[],characters:[],soundtracks:[],audioSettings:{masterVolume:100,soundtrackVolume:70,ambienceVolume:70,soundEffectVolume:85},videos:[],createdAt:d,updatedAt:d};await Ce(f(e,"chapters",c),l);const u=F(o);return u.phases.length||(u.phases=[Pe()]),u.phases[u.phases.length-1].chapterIds.push(c),await b(n,{chapterIds:[...o.chapterIds??[],c],phases:u.phases,updatedAt:d}),await b(f(e,"stories",o.storyId),{updatedAt:d}),l},async updateChapter(r,a){const n=f(e,"chapters",r),s=new Date().toISOString();await b(n,{...a,updatedAt:s});const o=await A(n),c=P(o);if(c?.arcId){const d=await A(f(e,"arcs",c.arcId)),l=P(d);l&&(await b(f(e,"arcs",l.id),{updatedAt:s}),await b(f(e,"stories",l.storyId),{updatedAt:s}))}return this.getChapter(r)},async updateChapterEngagement(r,a){const n=f(e,"chapters",r);return await b(n,{...a,updatedAt:new Date().toISOString()}),this.getChapter(r)},async updateChapterOrder(r,a){const n=f(e,"arcs",r),s=new Date().toISOString();await b(n,{chapterIds:a,updatedAt:s});const o=await A(n),c=P(o);c?.storyId&&await b(f(e,"stories",c.storyId),{updatedAt:s})},async createPhase(r,a){const n=f(e,"arcs",r),s=await A(n),o=P(s),c=o?F(o):null;if(!c)throw new Error("Arc not found.");const d={id:z("phase"),title:a?.trim()||"New Phase",chapterIds:[]},l=[...c.phases,d],u=new Date().toISOString();return await b(n,{phases:l,chapterIds:_(l),updatedAt:u}),await b(f(e,"stories",c.storyId),{updatedAt:u}),d},async renamePhase(r,a,n){const s=f(e,"arcs",r),o=await A(s),c=P(o),d=c?F(c):null;if(!d)throw new Error("Arc not found.");const l=d.phases.find(g=>g.id===a);if(!l)throw new Error("Phase not found.");const u=n?.trim()??"";let m;if(u)m=d.phases.map(g=>g.id===a?{...g,title:u}:g);else if(d.phases.length<=1)m=d.phases.map(g=>g.id===a?{...g,title:Ne}:g);else{const g=d.phases.findIndex(T=>T.id===a),w=g<d.phases.length-1?g+1:g-1;m=d.phases.map((T,N)=>N===w?{...T,chapterIds:[...l.chapterIds??[],...T.chapterIds??[]]}:T).filter(T=>T.id!==a)}const y=new Date().toISOString();return await b(s,{phases:m,chapterIds:_(m),updatedAt:y}),await b(f(e,"stories",d.storyId),{updatedAt:y}),m.find(g=>g.id===a)},async moveChapterToPhase(r,a,n){const s=f(e,"arcs",r),o=await A(s),c=P(o),d=c?F(c):null;if(!d)throw new Error("Arc not found.");const l=d.phases.map(y=>({...y,chapterIds:(y.chapterIds??[]).filter(g=>g!==a)})),u=l.find(y=>y.id===n);if(!u)throw new Error("Phase not found.");u.chapterIds.push(a);const m=new Date().toISOString();await b(s,{phases:l,chapterIds:_(l),updatedAt:m}),await b(f(e,"stories",d.storyId),{updatedAt:m})},async moveChapter(r,a,n){const s=f(e,"arcs",r),o=await A(s),c=P(o),d=c?F(c):null;if(!d)throw new Error("Arc not found.");const l=d.phases.map(g=>({...g,chapterIds:[...g.chapterIds??[]]})),u=l.findIndex(g=>g.chapterIds.includes(a));if(u<0)throw new Error("Chapter phase not found.");const m=l[u].chapterIds.indexOf(a);if(n==="up")if(m>0)l[u].chapterIds=We(l[u].chapterIds,m,m-1);else if(u>0)l[u].chapterIds.shift(),l[u-1].chapterIds.push(a);else return;else if(n==="down")if(m<l[u].chapterIds.length-1)l[u].chapterIds=We(l[u].chapterIds,m,m+1);else if(u<l.length-1)l[u].chapterIds.pop(),l[u+1].chapterIds.unshift(a);else return;else throw new Error("Unknown chapter move direction.");const y=new Date().toISOString();await b(s,{phases:l,chapterIds:_(l),updatedAt:y}),await b(f(e,"stories",d.storyId),{updatedAt:y})},async transferChapter(r,a,n){const s=f(e,"chapters",r),o=await A(s),c=P(o);if(!c)throw new Error("Chapter not found.");const d=f(e,"arcs",c.arcId),l=f(e,"arcs",a),[u,m]=await Promise.all([A(d),A(l)]),y=P(u),g=P(m),w=y?F(y):null,T=g?F(g):null;if(!w)throw new Error("Source arc not found.");if(!T)throw new Error("Target arc not found.");if(!(T.phases??[]).find(U=>U.id===n))throw new Error("Target phase not found.");const D=w.phases.map(U=>({...U,chapterIds:(U.chapterIds??[]).filter(v=>v!==r)})),oe=T.phases.map(U=>U.id===n?{...U,chapterIds:[...U.chapterIds??[],r]}:U),L=new Date().toISOString();return await Promise.all([b(d,{phases:D,chapterIds:_(D),updatedAt:L}),b(l,{phases:oe,chapterIds:_(oe),updatedAt:L}),b(s,{arcId:a,updatedAt:L})]),await Promise.all([b(f(e,"stories",w.storyId),{updatedAt:L}),b(f(e,"stories",T.storyId),{updatedAt:L})]),this.getChapter(r)},async reorderPhaseChapters(r,a,n){const s=f(e,"arcs",r),o=await A(s),c=P(o),d=c?F(c):null;if(!d)throw new Error("Arc not found.");const l=d.phases.map(m=>m.id===a?{...m,chapterIds:[...n]}:m),u=new Date().toISOString();await b(s,{phases:l,chapterIds:_(l),updatedAt:u}),await b(f(e,"stories",d.storyId),{updatedAt:u})},async deleteChapter(r){const a=await A(f(e,"chapters",r)),n=P(a);if(!n)return;const s=f(e,"arcs",n.arcId),o=await A(s),c=P(o),d=new Date().toISOString();c&&(await b(s,{chapterIds:(c.chapterIds??[]).filter(l=>l!==r),phases:(c.phases??[]).map(l=>({...l,chapterIds:(l.chapterIds??[]).filter(u=>u!==r)})),updatedAt:d}),await b(f(e,"stories",c.storyId),{updatedAt:d})),await ve(f(e,"chapters",r))},async deleteArc(r){const a=await A(f(e,"arcs",r)),n=P(a);if(!n)return;for(const d of n.chapterIds??[])await ve(f(e,"chapters",d));const s=f(e,"stories",n.storyId),o=await A(s),c=P(o);c&&await b(s,{arcIds:(c.arcIds??[]).filter(d=>d!==r),updatedAt:new Date().toISOString()}),await ve(f(e,"arcs",r))},async deleteStory(r){const a=await V(e,r);if(a){for(const n of a.arcs??[]){for(const s of n.chapters??[])await ve(f(e,"chapters",s.id));await ve(f(e,"arcs",n.id))}await ve(f(e,"stories",r))}}}}async function Ca(t){return t?.mode==="firebase"&&t.db?ka(t):Ia()}const Aa={VITE_APP_MODE:"firebase",VITE_FIREBASE_API_KEY:"AIzaSyC8-b4_lzrCk2RhsqSEMkcxNKgMzVx_WJ4",VITE_FIREBASE_APP_ID:"1:309677315541:web:ef90a15da4ee29c03fd95c",VITE_FIREBASE_AUTH_DOMAIN:"ulunavir-tales.firebaseapp.com",VITE_FIREBASE_MESSAGING_SENDER_ID:"309677315541",VITE_FIREBASE_PROJECT_ID:"ulunavir-tales",VITE_FIREBASE_STORAGE_BUCKET:"ulunavir-tales.firebasestorage.app"},it={mode:"local",announcementApiUrl:"",publicAppUrl:"",firebase:{apiKey:"",authDomain:"",projectId:"",appId:"",storageBucket:"",messagingSenderId:""}};function Ea(){const t=Aa??{};return{mode:t.VITE_APP_MODE??it.mode,announcementApiUrl:t.VITE_ANNOUNCEMENT_API_URL??"",publicAppUrl:t.VITE_PUBLIC_APP_URL??"",firebase:{apiKey:t.VITE_FIREBASE_API_KEY??"",authDomain:t.VITE_FIREBASE_AUTH_DOMAIN??"",projectId:t.VITE_FIREBASE_PROJECT_ID??"",appId:t.VITE_FIREBASE_APP_ID??"",storageBucket:t.VITE_FIREBASE_STORAGE_BUCKET??"",messagingSenderId:t.VITE_FIREBASE_MESSAGING_SENDER_ID??""}}}function xt(){const t=globalThis.STORYFORGE_CONFIG??{},e=Ea();return{...it,...e,...t,firebase:{...it.firebase,...e.firebase,...t.firebase??{}}}}function Ta(t){return t.mode==="firebase"&&!!(t.firebase.projectId&&t.firebase.apiKey&&t.firebase.appId)}function Pa(){const t=xt();if(!Ta(t))return{mode:"local",auth:null,db:null,signIn:async()=>null,signOut:async()=>null,watchAuth:s=>(s(null),()=>{})};const e=la().length?ua():pa(t.firebase),r=ma(e),a=ha(e),n=new fa;return n.addScope("email"),n.addScope("profile"),n.setCustomParameters({prompt:"select_account"}),{mode:"firebase",auth:r,db:a,signIn:async()=>(await wa(r,n)).user,signInWithRedirect:async()=>{await ba(r,n)},getRedirectUser:async()=>(await ya(r))?.user??null,signOut:async()=>va(r),watchAuth:s=>ga(r,s)}}function Je(){return xt()}const xa="yaslantr123@gmail.com";function Ma(t){return String(t??"").trim().toLowerCase()===xa}const Ge=document.querySelector("#app"),S={soundtrack:{label:"Soundtrack",shortLabel:"Music",loop:!0,autoCue:!0},ambience:{label:"Ambience",shortLabel:"Ambience",loop:!0,autoCue:!0},"sound-effect":{label:"Sound Effect",shortLabel:"Effect",loop:!1,autoCue:!1}};function nt(t){return{type:t,currentIndex:0,paused:!0,volume:t==="sound-effect"?85:70,mode:"idle",ready:!1,activeKey:"",youtubePlayer:null,youtubePlayerHost:"",standbyPlayer:null,standbyPlayerHost:"",standbyTrackId:"",standbyStartSeconds:0,standbyReady:!1,standbyWarming:!1,standbyToken:0,standbyPauseTimer:null,currentCueIndex:-1,syncToken:0,manualPause:!1,recoveryTimer:null,recoveryAttempts:0,cueMode:!1}}const i={adapter:null,authClient:null,currentUser:JSON.parse(localStorage.getItem("storyforge-session")??"null"),route:{name:"home",params:{}},dragActive:!1,saveStatus:"",authError:"",authErrorCode:"",loadError:"",editorCharacters:[],soundtrack:{chapterId:"",queues:{soundtrack:[],ambience:[],"sound-effect":[]},cueTimelines:{soundtrack:[],ambience:[]},channels:{soundtrack:nt("soundtrack"),ambience:nt("ambience"),"sound-effect":nt("sound-effect")},masterVolume:100,volumeOpen:"",cueObserver:null,editorMode:!1}},Na="storyforge-soundtrack-state";function Mt(){const t=Object.fromEntries(Object.entries(i.soundtrack.channels).map(([e,r])=>[e,{currentIndex:r.currentIndex,paused:r.paused,volume:r.volume}]));localStorage.setItem(Na,JSON.stringify({chapterId:i.soundtrack.chapterId,masterVolume:i.soundtrack.masterVolume,channels:t}))}function He(t=x()){return t?t.penName?.trim()||t.name||"Creator":"Guest"}function La(t,e,r){const a=Je().publicAppUrl?.trim(),n=`${window.location.origin}${window.location.pathname}`;return`${(a||n).replace(/#.*$/,"").replace(/\/?$/,"/")}#/stories/${encodeURIComponent(t)}/arcs/${encodeURIComponent(e)}/chapters/${encodeURIComponent(r)}?view=browser`}async function Ua({storyId:t,arcId:e,chapterId:r}){const a=Je().announcementApiUrl?.trim();if(!a)return{skipped:!0,reason:"Announcement API is not configured."};const n=i.authClient?.auth?.currentUser;if(!n?.getIdToken)throw new Error("A Firebase sign-in is required for Discord announcements.");const s=await n.getIdToken(),o=await fetch(a,{method:"POST",headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json"},body:JSON.stringify({storyId:t,arcId:e,chapterId:r,chapterUrl:La(t,e,r)})}),c=await o.json().catch(()=>({}));if(!o.ok)throw new Error(c.error||`Announcement request failed (${o.status}).`);return c}function qa(t){const e=Je().announcementApiUrl?.trim();if(!e)return"";const r=new URL(e,window.location.href);return r.pathname=`/api/${t}`,r.search="",r.hash="",r.toString()}async function st(t,e){const r=qa("chapter-engagement");if(!r)throw new Error("Chapter engagement API is not configured.");const a=i.authClient?.auth?.currentUser;if(!a?.getIdToken)throw new Error("A Firebase sign-in is required for comments and reactions.");const n=await a.getIdToken(),s=await fetch(r,{method:"POST",headers:{Authorization:`Bearer ${n}`,"Content-Type":"application/json"},body:JSON.stringify({action:t,storyId:i.route.params.storyId,arcId:i.route.params.arcId,...e})}),o=await s.json().catch(()=>({}));if(!s.ok)throw new Error(o.error||`Chapter engagement request failed (${s.status}).`);return o}function we(t=x()){const e=t?.readerSettings??{};return{fontSize:Math.max(14,Math.min(24,Number(e.fontSize)||17)),lineHeight:Math.max(1.4,Math.min(2.4,Number(e.lineHeight)||1.85)),width:Math.max(620,Math.min(1200,Number(e.width)||920))}}function de(t){return t?.published!==!1}function ct(t,e){return e||de(t)}function G(t){i.currentUser=t,localStorage.setItem("storyforge-session",JSON.stringify(t))}function Oa(){document.querySelectorAll(".modal-backdrop").forEach(t=>t.remove())}function R(t){const e=`#${t}`;if(window.location.hash===e){Te(),window.scrollTo({top:0,left:0,behavior:"auto"});return}window.location.hash=t}function Ra(){const t=window.location.hash.replace(/^#/,"")||"/",[e]=t.split("?"),r=e.split("/").filter(Boolean);return r.length===0?{name:"home",params:{}}:r[0]==="creator"?{name:"creator",params:{}}:r[0]==="browser"?{name:"browser",params:{}}:r[0]==="settings"?{name:"settings",params:{}}:r[0]==="stories"&&r[1]?r[2]==="arcs"&&r[3]&&r[4]==="chapters"&&r[5]?{name:"chapter",params:{storyId:r[1],arcId:r[3],chapterId:r[5]}}:r[2]==="arcs"&&r[3]?{name:"arc",params:{storyId:r[1],arcId:r[3]}}:{name:"story",params:{storyId:r[1]}}:{name:"not-found",params:{}}}function re(){return new URLSearchParams(window.location.hash.split("?")[1]??"")}function x(){return i.currentUser?i.currentUser:i.authClient?.mode==="firebase"?null:{id:"demo-user",name:"Demo Creator",email:"demo@storyforge.local",mode:"demo",structureView:"list"}}function Da(t){return!!(t?.creatorId&&x()?.id&&t.creatorId===x().id)}function xe(){const t=i.authClient?.auth?.currentUser;return!!(t?.emailVerified&&Ma(t.email))}function Nt(t){return Da(t)||xe()}function be(t){return String(t??"").trim().toLowerCase()}async function Va(){const t=x(),e=be(t?.email);if(e)return e;if(!t?.id||!i.adapter?.getUserProfile)return"";const r=await i.adapter.getUserProfile(t.id),a=be(r?.email);return a&&G({...t,email:r.email,name:r.name||t.name,penName:r.penName??t.penName??"",structureView:r.structureView??t.structureView??"list",readerSettings:r.readerSettings??t.readerSettings??we(t)}),a}function Ba(t){const e=be(x()?.email);return!!(e&&(t?.editorEmails??[]).includes(e))}function Ue(t){return Nt(t)||Ba(t)}function mt(t){return t?.visibility!=="private"||Ue(t)}function p(t){return t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function ye(t){return`${t}-${crypto.randomUUID().slice(0,8)}`}function Lt(t,e="Soundtrack"){return t?.trim()||e}function Ut(t){try{const e=new URL(t);if(e.hostname==="youtu.be")return e.pathname.replace(/\//g,"")||null;if(e.hostname.includes("youtube.com")){if(e.pathname==="/watch")return e.searchParams.get("v");const r=e.pathname.split("/").filter(Boolean);if(["embed","shorts","live"].includes(r[0]))return r[1]??null}}catch{return null}return null}function qt(t){try{const e=new URL(t),r=e.searchParams.get("t")??e.searchParams.get("start")??e.searchParams.get("time_continue");if(!r)return 0;if(/^\d+$/.test(r))return Math.max(0,Number(r));const a=r.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/i);if(!a)return 0;const n=Number(a[1]??0),s=Number(a[2]??0),o=Number(a[3]??0);return n*3600+s*60+o}catch{return 0}}function Ot(t){const e=t?.url?.trim(),r=e&&!/^https?:\/\//i.test(e)?`https://${e}`:e;if(!r)return null;const a=Ut(r);return a?{id:t.id??ye("soundtrack"),label:Lt(t.label,"YouTube track"),url:r,source:"youtube",videoId:a,startSeconds:qt(r),trackType:K(t.trackType),volumeMultiplier:qe(t.volumeMultiplier)}:null}function Rt(t){const e=t?.url?.trim(),r=e&&!/^https?:\/\//i.test(e)?`https://${e}`:e;if(!r)return null;const a=Ut(r);return a?{id:t.id??ye("video"),label:Lt(t.label,"YouTube video"),url:r,source:"youtube",videoId:a,startSeconds:qt(r)}:null}function Dt(t=[]){return t.map(Ot).filter(Boolean)}function _a(t=[]){return new Map(Dt(t).map(e=>[e.id,{label:e.label,trackType:e.trackType}]))}function Fa(t=[]){return new Map(t.map(Rt).filter(Boolean).map(e=>[e.id,e]))}function ja(t,e){const r=new Map(e.map(s=>[s.id,s])),a={soundtrack:[],ambience:[]},n=/\[(music|music-end):\s*([^\]]+)\]/gi;for(const s of String(t??"").matchAll(n)){const o=s[1].toLowerCase(),c=s[2].trim(),d=s.index??-1;if(o==="music-end"){const u=c.toLowerCase();(u==="soundtrack"||u==="ambience")&&a[u].push({kind:"end",trackType:u,offset:d});continue}const l=r.get(c);l&&S[l.trackType]?.autoCue&&a[l.trackType].push({kind:"track",trackType:l.trackType,trackId:l.id,offset:d})}return a}function Ha(t,e=-1){const r=(i.soundtrack.cueTimelines[t]??[])[e+1];return!r||r.kind==="end"?null:Se(t).find(a=>a.id===r.trackId)?{...r,track:Se(t).find(a=>a.id===r.trackId)}:null}function K(t){return Object.hasOwn(S,t)?t:"soundtrack"}function j(t){return Math.max(0,Math.min(100,Math.round(Number(t)||0)))}function qe(t){const e=Number(t);return Math.max(0,Math.min(200,Number.isFinite(e)?Math.round(e):100))}function ht(t={}){return{masterVolume:t.masterVolume===void 0?100:j(t.masterVolume),soundtrackVolume:t.soundtrackVolume===void 0?70:j(t.soundtrackVolume),ambienceVolume:t.ambienceVolume===void 0?70:j(t.ambienceVolume),soundEffectVolume:t.soundEffectVolume===void 0?85:j(t.soundEffectVolume)}}function Vt(t={}){return i.soundtrack.chapterId!==t.id?ht(t.audioSettings):{masterVolume:j(i.soundtrack.masterVolume),soundtrackVolume:j(i.soundtrack.channels.soundtrack.volume),ambienceVolume:j(i.soundtrack.channels.ambience.volume),soundEffectVolume:j(i.soundtrack.channels["sound-effect"].volume)}}function ft(){i.soundtrack.cueObserver&&(i.soundtrack.cueObserver.disconnect(),i.soundtrack.cueObserver=null)}function Bt(){let t=document.querySelector("#soundtrack-layer");return t||(t=document.createElement("div"),t.id="soundtrack-layer",t.innerHTML=Object.keys(S).flatMap(e=>[`<div id="youtube-audio-${e}-host"></div>`,...S[e].loop?[`<div id="youtube-audio-${e}-standby-host"></div>`]:[]]).join(""),document.body.append(t),t)}function _t(t,e){return e()?Promise.resolve():new Promise((r,a)=>{const n=[...document.querySelectorAll("script")].find(o=>o.src===t);if(n){n.addEventListener("load",()=>r(),{once:!0}),n.addEventListener("error",()=>a(new Error(`Failed to load ${t}`)),{once:!0});return}const s=document.createElement("script");s.src=t,s.async=!0,s.addEventListener("load",()=>r(),{once:!0}),s.addEventListener("error",()=>a(new Error(`Failed to load ${t}`)),{once:!0}),document.head.append(s)})}function I(t){return i.soundtrack.channels[K(t)]}function Se(t){return i.soundtrack.queues[K(t)]??[]}function q(t="soundtrack"){const e=I(t),r=Se(t);if(!r.length)return null;const a=Math.max(0,Math.min(e.currentIndex,r.length-1));return r[a]??null}function le(){Object.keys(S).forEach(a=>{const n=I(a),s=q(a),o=document.querySelector(`[data-action='toggle-audio-channel'][data-audio-channel='${a}']`);o&&(o.disabled=!s,o.classList.toggle("is-active",!!s&&!n.paused),o.setAttribute("aria-pressed",String(!!s&&!n.paused)),o.setAttribute("title",s?`${n.paused?"Resume":"Pause"} ${S[a].label}`:`No ${S[a].label.toLowerCase()} available`));const c=document.querySelector(`[data-action='toggle-audio-volume'][data-audio-volume='${a}']`);c&&(c.disabled=!Se(a).length,c.classList.toggle("is-open",i.soundtrack.volumeOpen===a),c.style.setProperty("--volume-fill",`${n.volume}%`),c.setAttribute("title",`${S[a].label} volume ${n.volume}%`));const d=document.querySelector(`[data-action='set-audio-volume'][data-audio-volume='${a}']`);d&&(d.value=String(n.volume));const l=document.querySelector(`[data-audio-volume-value='${a}']`);l&&(l.textContent=`${n.volume}%`)});const t=document.querySelector("[data-action='toggle-audio-volume'][data-audio-volume='master']");t&&(t.classList.toggle("is-open",i.soundtrack.volumeOpen==="master"),t.style.setProperty("--volume-fill",`${i.soundtrack.masterVolume}%`),t.setAttribute("title",`Master volume ${i.soundtrack.masterVolume}%`));const e=document.querySelector("[data-action='set-audio-volume'][data-audio-volume='master']");e&&(e.value=String(i.soundtrack.masterVolume));const r=document.querySelector("[data-audio-volume-value='master']");r&&(r.textContent=`${i.soundtrack.masterVolume}%`),document.querySelectorAll("[data-volume-popout]").forEach(a=>{a.hidden=a.dataset.volumePopout!==i.soundtrack.volumeOpen}),document.querySelectorAll("[data-action='preview-soundtrack']").forEach(a=>{const n=Object.values(i.soundtrack.queues).flat().find(c=>c.id===a.dataset.soundtrackId),s=n?I(n.trackType):null,o=!!(n&&s&&s.activeKey===n.id&&!s.paused);a.classList.toggle("is-active",o),a.textContent=o?"Stop preview":"Preview",a.setAttribute("aria-pressed",String(o))})}function ne(){Mt(),le()}function za(){Object.keys(S).forEach(t=>E(t,`No ${S[t].label.toLowerCase()} loaded.`)),le()}function E(t,e){const r=document.querySelector(`[data-audio-status='${t}']`);r&&(r.textContent=e)}function J(t){const e=I(t);e.recoveryTimer&&(clearTimeout(e.recoveryTimer),e.recoveryTimer=null)}function he(t,e="Playback interrupted",r=2200){const a=I(t),n=q(t);if(!n||a.paused||a.manualPause)return;J(t);const s=n.id,o=a.syncToken;E(t,`${e}. Trying to resume...`),a.recoveryTimer=setTimeout(()=>{const c=q(t);if(!(!c||c.id!==s||o!==a.syncToken||a.paused||a.manualPause||!a.youtubePlayer)){a.recoveryAttempts+=1;try{a.recoveryAttempts%4===0&&c.videoId?Xe(t,c):a.youtubePlayer.playVideo(),E(t,`Resuming: ${c.label}`)}catch(d){E(t,`Playback recovery failed: ${String(d.message||d)}`)}}},r)}function dt(t){const e=I(t),r=q(t);J(t),e.manualPause=!0,e.mode==="youtube"&&e.youtubePlayer?.pauseVideo&&e.youtubePlayer.pauseVideo(),e.paused=!0,r&&E(t,`Paused: ${r.label}`),ne()}function Ft(t,e=-1){const r=I(t);r.currentCueIndex=e,Qe(t),!(!q(t)||r.paused)&&(dt(t),E(t,`${S[t].label} ended by chapter cue.`))}function jt(t){const e=I(t),r=q(t);r&&(J(t),e.manualPause=!1,e.recoveryAttempts=0,e.mode==="youtube"&&e.youtubePlayer?.playVideo?e.youtubePlayer.playVideo():gt(t),e.paused=!1,E(t,`Now playing: ${r.label}`),ne())}function Wa(t){const e=I(t),r=q(t);if(!(!r||e.manualPause||!S[t].loop)){J(t),e.paused=!1,e.recoveryAttempts=0;try{e.youtubePlayer?.seekTo?(e.youtubePlayer.seekTo(0,!0),e.youtubePlayer.playVideo()):e.youtubePlayer?.loadVideoById&&r.videoId&&Xe(t,r,0),E(t,`Looping: ${r.label}`),he(t,"Loop did not restart",5e3)}catch(a){E(t,`Loop failed: ${String(a.message||a)}`)}}}function Ya(t,e){const r=I(t);return q(t)?.id===e&&r.activeKey===e}function lt(t,e={}){const a=Object.values(i.soundtrack.queues).flat().find(l=>l.id===t);if(!a){E("soundtrack","Music cue points to a missing track.");return}const n=a.trackType,s=S[n];if(e.source!=="button"&&!s.autoCue)return;const o=I(n),c=Se(n),d=c.findIndex(l=>l.id===t);if(d<0){E(n,"Music cue points to a missing track.");return}if(Number.isFinite(Number(e.cueIndex))&&(o.currentCueIndex=Number(e.cueIndex)),Ya(n,t)){if(!s.loop&&e.source==="button"){o.paused=!1,o.manualPause=!1,Xe(n,a),E(n,`Playing: ${a.label}`),ne();return}o.paused&&s.loop&&jt(n),s.loop&&!i.soundtrack.editorMode&&Ze(n,o.currentCueIndex);return}o.currentIndex=d,o.paused=!1,o.manualPause=!1,o.ready=!1,o.activeKey="",o.recoveryAttempts=0,J(n),ne(),gt(n),e.source==="button"&&E(n,`Cue selected: ${c[d].label}`)}function Me(t){const e=I(t),r=q(t);e.volume=j(e.volume);const a=qe(r?.volumeMultiplier),n=j(i.soundtrack.masterVolume*e.volume*a/1e4);e.youtubePlayer?.setVolume&&e.youtubePlayer.setVolume(n),ne()}function Ht(t,e){if(t==="master"){i.soundtrack.masterVolume=j(e),Object.keys(S).forEach(Me);return}const r=K(t);I(r).volume=j(e),Me(r)}function Ga(t,e){const r=t==="master"?i.soundtrack.masterVolume:I(t).volume;Ht(t,r+e)}function zt(t,e){const r=I(t),a=e.target;if(a===r.standbyPlayer){if(e.data===window.YT.PlayerState.PLAYING&&r.standbyWarming){const n=r.standbyToken;r.standbyPauseTimer&&clearTimeout(r.standbyPauseTimer),r.standbyPauseTimer=setTimeout(()=>{n!==r.standbyToken||a!==r.standbyPlayer||(a.pauseVideo?.(),a.seekTo?.(r.standbyStartSeconds,!0))},450)}e.data===window.YT.PlayerState.PAUSED&&r.standbyWarming&&(r.standbyWarming=!1,r.standbyReady=!0,a.seekTo?.(r.standbyStartSeconds,!0));return}if(a===r.youtubePlayer){if(e.data===window.YT.PlayerState.ENDED){if(J(t),r.recoveryAttempts=0,S[t].loop){Wa(t);return}r.paused=!0,r.manualPause=!0,E(t,`Finished: ${q(t)?.label??S[t].label}`),ne();return}if(e.data===window.YT.PlayerState.PLAYING){J(t),r.paused=!1,r.manualPause=!1,r.recoveryAttempts=0;const n=q(t);n&&E(t,`Now playing: ${n.label}`),ne()}if(e.data===window.YT.PlayerState.PAUSED){if(r.manualPause){r.paused=!0,ne();return}he(t,"Playback paused by YouTube")}e.data===window.YT.PlayerState.BUFFERING&&he(t,"Playback is buffering",4500),(e.data===window.YT.PlayerState.CUED||e.data===window.YT.PlayerState.UNSTARTED)&&he(t,"Playback is waiting")}}function Wt(t,e){const r=I(t);if(e.target===r.standbyPlayer){r.standbyWarming=!1,r.standbyReady=!1;return}if(e.target!==r.youtubePlayer)return;const a=q(t);E(t,`YouTube player error${e?.data?` ${e.data}`:""}. Retrying...`),a&&he(t,"YouTube player error",1500)}function Qe(t){const e=I(t);e.standbyToken+=1,e.standbyPauseTimer&&(clearTimeout(e.standbyPauseTimer),e.standbyPauseTimer=null),e.standbyWarming=!1,e.standbyReady=!1,e.standbyTrackId="",e.standbyStartSeconds=0,e.standbyPlayer?.pauseVideo?.()}async function Ka(t){const e=I(t);if(e.standbyPlayer)return e.standbyPlayer;await _t("https://www.youtube.com/iframe_api",()=>!!window.YT?.Player),Bt();const r=`youtube-audio-${t}-host`,a=`youtube-audio-${t}-standby-host`,n=e.youtubePlayerHost===r?a:r;let s;const o=new Promise(c=>{s=c});return e.standbyPlayerHost=n,e.standbyPlayer=new window.YT.Player(n,{height:"200",width:"320",playerVars:{autoplay:0,controls:0,rel:0},events:{onReady:()=>s(),onStateChange:c=>zt(t,c),onError:c=>Wt(t,c)}}),await o,e.standbyPlayer}async function Ja(t,e){if(!e||i.soundtrack.editorMode||!S[t].loop)return;const r=I(t);if(r.standbyTrackId===e.id&&(r.standbyReady||r.standbyWarming))return;const a=i.soundtrack.chapterId,n=++r.standbyToken,s=await Ka(t);n!==r.standbyToken||a!==i.soundtrack.chapterId||s!==r.standbyPlayer||(r.standbyPauseTimer&&clearTimeout(r.standbyPauseTimer),r.standbyTrackId=e.id,r.standbyStartSeconds=Math.max(0,Number(e.startSeconds)||0),r.standbyReady=!1,r.standbyWarming=!0,s.mute?.(),s.loadVideoById?.({videoId:e.videoId,startSeconds:r.standbyStartSeconds}))}function Ze(t,e=-1){const r=Ha(t,e);if(!r){Qe(t);return}Ja(t,r.track)}function Qa(t,e){const r=I(t);if(!r.standbyPlayer||!r.standbyReady||r.standbyTrackId!==e.id)return!1;J(t),r.standbyToken+=1,r.standbyPauseTimer&&(clearTimeout(r.standbyPauseTimer),r.standbyPauseTimer=null);const a=r.youtubePlayer,n=r.youtubePlayerHost;return r.youtubePlayer=r.standbyPlayer,r.youtubePlayerHost=r.standbyPlayerHost,r.standbyPlayer=a,r.standbyPlayerHost=n,r.standbyTrackId="",r.standbyStartSeconds=0,r.standbyReady=!1,r.standbyWarming=!1,r.standbyPlayer?.pauseVideo?.(),r.standbyPlayer?.mute?.(),r.youtubePlayer.unMute?.(),r.mode="youtube",r.ready=!0,r.activeKey=e.id,r.paused=!1,r.manualPause=!1,r.recoveryAttempts=0,Me(t),r.youtubePlayer.playVideo?.(),E(t,`Now playing: ${e.label}`),he(t,"Preloaded track did not start",3500),le(),Ze(t,r.currentCueIndex),!0}function Xe(t,e,r=e.startSeconds??0){const a=I(t).youtubePlayer;a?.loadVideoById&&a.loadVideoById({videoId:e.videoId,startSeconds:Math.max(0,Number(r)||0)})}async function Za(t,e,r){const a=I(t);await _t("https://www.youtube.com/iframe_api",()=>!!window.YT?.Player),r===a.syncToken&&(Bt(),a.youtubePlayer?Xe(t,e):await new Promise(n=>{const s=()=>{const o=`youtube-audio-${t}-host`,c=`youtube-audio-${t}-standby-host`,d=a.standbyPlayerHost===o?c:o;a.youtubePlayerHost=d,a.youtubePlayer=new window.YT.Player(d,{height:"200",width:"320",videoId:e.videoId,playerVars:{autoplay:1,controls:1,rel:0,start:e.startSeconds||0},events:{onReady:()=>n(),onStateChange:l=>zt(t,l),onError:l=>Wt(t,l)}})};if(window.YT?.Player)s();else{const o=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{o?.(),s()}}}),r===a.syncToken&&(a.mode="youtube",a.ready=!0,a.activeKey=e.id,Me(t),E(t,`Now playing: ${e.label}`),a.paused||(a.manualPause=!1,a.youtubePlayer.playVideo(),he(t,"Playback did not start",5e3)),a.cueMode&&Ze(t,a.currentCueIndex),le()))}async function gt(t){const e=I(t),r=++e.syncToken,a=q(t);if(!a){e.mode="idle",e.ready=!1,e.activeKey="",e.paused=!0,e.manualPause=!0,e.youtubePlayer?.pauseVideo?.(),E(t,`No ${S[t].label.toLowerCase()} loaded.`),le();return}try{if(a.source==="youtube"){if(Qa(t,a))return;await Za(t,a,r);return}}catch(n){i.saveStatus=`${S[t].label} error: ${String(n.message||n)}`,E(t,`${S[t].label} could not be loaded.`),le()}}function Xa(t,e,r={}){const a=t!==i.soundtrack.chapterId,n=!!r.editorMode,s=n!==i.soundtrack.editorMode,o=ht(r.audioSettings),c=Object.fromEntries(Object.keys(S).map(u=>[u,e.filter(m=>m.trackType===u)])),d=ja(r.body,e),l=new Set([...String(r.body??"").matchAll(/\[music:\s*([^\]]+)\]/gi)].map(u=>u[1].trim()));ft(),i.soundtrack.chapterId=t,i.soundtrack.editorMode=n,a&&(i.soundtrack.masterVolume=o.masterVolume,i.soundtrack.channels.soundtrack.volume=o.soundtrackVolume,i.soundtrack.channels.ambience.volume=o.ambienceVolume,i.soundtrack.channels["sound-effect"].volume=o.soundEffectVolume),Object.keys(S).forEach(u=>{const m=I(u),y=Se(u).map(N=>N.id).join("|"),g=c[u].map(N=>N.id).join("|"),w=y!==g,T=u!=="sound-effect"&&JSON.stringify(i.soundtrack.cueTimelines[u]??[])!==JSON.stringify(d[u]??[]);if(i.soundtrack.queues[u]=c[u],u!=="sound-effect"&&(i.soundtrack.cueTimelines[u]=d[u]),m.cueMode=S[u].autoCue&&c[u].some(N=>l.has(N.id)),(a||w||s||T)&&(J(u),Qe(u),m.syncToken+=1,m.currentIndex=0,m.currentCueIndex=-1,m.paused=n||m.cueMode||!S[u].autoCue,m.manualPause=m.paused,m.ready=!1,m.activeKey="",m.recoveryAttempts=0,m.youtubePlayer?.pauseVideo?.()),!c[u].length){m.paused=!0,m.manualPause=!0,E(u,`No ${S[u].label.toLowerCase()} loaded.`);return}if(Me(u),n){E(u,`Use Preview to play ${S[u].label.toLowerCase()} in the editor.`);return}if(m.cueMode){E(u,`Waiting for ${S[u].label.toLowerCase()} cue.`),Ze(u,m.currentCueIndex);return}S[u].autoCue&&(a||w||!m.activeKey)?(m.paused=!1,m.manualPause=!1,gt(u)):S[u].autoCue||E(u,"Sound effects play only from their cue buttons.")}),ne(),Yt()}function Yt(){if(i.soundtrack.editorMode)return;const t=[...document.querySelectorAll("[data-music-trigger], [data-music-end]")],e=Object.values(i.soundtrack.queues).flat();if(!t.length||!e.length)return;const r=new Map(e.map(a=>[a.id,a]));i.soundtrack.cueObserver=new IntersectionObserver(a=>{const n=a.filter(o=>o.isIntersecting).sort((o,c)=>c.intersectionRatio-o.intersectionRatio),s=new Set;n.forEach(o=>{const c=o.target?.dataset?.musicEnd,d=Number(o.target?.dataset?.musicCueIndex??-1);if(c&&["soundtrack","ambience"].includes(c)){s.has(c)||(s.add(c),Ft(c,d));return}const l=o.target?.dataset?.musicTrigger,u=r.get(l);!u||!S[u.trackType].autoCue||s.has(u.trackType)||(s.add(u.trackType),lt(l,{source:"scroll",cueIndex:d}))})},{root:null,rootMargin:"-20% 0px -55% 0px",threshold:[0,.35,.75]}),t.forEach(a=>i.soundtrack.cueObserver.observe(a))}function ie(){ft(),i.soundtrack.chapterId="",i.soundtrack.volumeOpen="",Object.keys(S).forEach(t=>{const e=I(t);J(t),Qe(t),i.soundtrack.queues[t]=[],e.syncToken+=1,e.currentIndex=0,e.paused=!0,e.manualPause=!0,e.activeKey="",e.ready=!1,e.recoveryAttempts=0,e.cueMode=!1,e.youtubePlayer?.pauseVideo?.()}),za(),Mt()}function er(t,e,r,a=-1){const n=String(t??"").trim();if(!n)return"";const s=e.get(n)??{label:n,trackType:"soundtrack"},o=s.label??n,c=K(s.trackType);return r?`
    <span class="music-cue is-visible track-${c}" data-music-trigger="${p(n)}" data-music-cue-index="${a}">
      <button class="music-cue-play" type="button" data-action="play-music-cue" data-music-trigger="${p(n)}" data-music-cue-index="${a}" title="Play ${p(o)}">▶</button>
      <span>${p(S[c].label)}: ${p(o)}</span>
    </span>
  `:`<span class="music-cue track-${c}" data-music-trigger="${p(n)}" data-music-cue-index="${a}"></span>`}function tr(t,e,r=-1){const a=String(t??"").trim().toLowerCase();return["soundtrack","ambience"].includes(a)?e?`
    <span class="music-end-cue is-visible track-${a}" data-music-end="${a}" data-music-cue-index="${r}">
      <button class="music-cue-stop" type="button" data-action="stop-music-cue" data-music-end="${a}" data-music-cue-index="${r}" title="Stop ${p(S[a].label)}">■</button>
      <span>End ${p(S[a].label)}</span>
    </span>
  `:`<span class="music-end-cue track-${a}" data-music-end="${a}" data-music-cue-index="${r}"></span>`:`<span class="music-end-cue is-invalid">Unknown music track: ${p(a)}</span>`}function ar(t,e){const r=String(t??"").trim(),a=e.get(r);if(!a)return`<div class="video-embed-missing">Missing video: ${p(r)}</div>`;const n=new URLSearchParams({rel:"0",modestbranding:"1"});return a.startSeconds&&n.set("start",String(a.startSeconds)),`
    <figure class="chapter-video">
      <iframe
        src="https://www.youtube.com/embed/${p(a.videoId)}?${n.toString()}"
        title="${p(a.label)}"
        width="100%"
        height="506"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
      ></iframe>
      <figcaption>${p(a.label)}</figcaption>
    </figure>
  `}function Gt(t){return`
    <figure class="chapter-image-frame is-fill" data-image-view="fill" data-auto-image-view="true">
      <button class="small-button image-view-toggle" type="button" data-action="toggle-image-view" title="Toggle image view">Desired</button>
      ${t}
    </figure>
  `}function rr(t,e){return Gt(`<img alt="${t}" src="${p(Oe(e))}" />`)}function Ae(t){return String(t??"").trim().replace(/\s+/g," ").toLowerCase()}function nr(t){return String(t??"").replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Y(t,e){const r=String(t??"").trim();return/^#[0-9a-f]{6}$/i.test(r)?r:e}function sr(t=[]){return new Map(t.map(e=>[Ae(e.dialogId??e.name),{...e,mainColor:Y(e.mainColor,"#8f5f35"),secondaryColor:Y(e.secondaryColor,"#d7b56d")}]))}function or(t){return p(String(t??"")).replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>")}function ir(t,e){const r=e.get(Ae(t.characterName)),a=Y(r?.mainColor,"#705846"),n=Y(r?.secondaryColor,"#c3a77a"),s=t.displayName?.trim()||r?.displayName||r?.name||t.characterName;return`
    <blockquote class="dialog-block ${r?"":"is-missing"}" style="--dialog-main: ${a}; --dialog-secondary: ${n};">
      <div class="dialog-speaker">${p(s)}</div>
      <div class="dialog-message">${or(t.message)}</div>
    </blockquote>
  `}function cr(t,e={}){const r=String(t??""),a=e.soundtrackLabels??new Map,n=e.videos??new Map,s=e.characters??new Map,o=!!e.showMusicCues,c=[],d=r.replace(/^\s*\[dialog:\s*([^:\]\r\n]+?)(?:\s*:\s*([^\]\r\n]+?))?\]\s*(.*?)\s*$/gim,(v,k,O,pe)=>{const Re=`ULUNAVIR_DIALOG_BLOCK_${c.length}`;return c.push({characterName:k.trim(),displayName:O?.trim()??"",message:pe}),`

${Re}

`}),l="ULUNAVIR_SAFE_EXTRA_BREAK",u=d.replace(/\n{3,}/g,v=>`

${`${l}
`.repeat(v.length-2)}
`);let m=p(u);m=m.replaceAll(l,"<br />");const N=m.replace(/```([\s\S]*?)```/g,(v,k)=>`<pre><code>${k.trim()}</code></pre>`).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(v,k,O)=>rr(k,O)).replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>"),D={soundtrack:0,ambience:0};return N.replace(/\[(music|music-end):\s*([^\]]+)\]/gi,(v,k,O)=>{if(k.toLowerCase()==="music-end"){const at=String(O).trim().toLowerCase(),da=Object.hasOwn(D,at)?D[at]++:-1;return tr(at,o,da)}const pe=String(O).trim(),Re=a.get(pe),yt=K(Re?.trackType),ca=Re&&Object.hasOwn(D,yt)?D[yt]++:-1;return er(pe,a,o,ca)}).replace(/\[video:\s*([^\]]+)\]/gi,(v,k)=>ar(k,n)).replace(/ULUNAVIR_DIALOG_BLOCK_(\d+)/g,(v,k)=>ir(c[Number(k)],s)).replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/(?:^|\n)- (.*(?:\n- .*)*)/g,v=>`
<ul>${v.trim().split(`
`).map(O=>O.replace(/^- /,"").trim()).map(O=>`<li>${O}</li>`).join("")}</ul>`).split(/\n{2,}/).map(v=>/^<(h\d|ul|ol|pre|p|blockquote|table|hr|br|figure|div)\b/.test(v.trim())?v:`<p>${v.replace(/\n/g,"<br />")}</p>`).join("")}function dr(t){return String(t??"").replace(/<script\b[\s\S]*?<\/script>/gi,"").replace(/\bsrc=(["'])(https?:\/\/t\d+\.pixhost\.(?:to|cc)\/thumbs\/[^"']+)\1/gi,(e,r,a)=>`src=${r}${p(Oe(a))}${r}`).replace(/<img\b[^>]*>/gi,e=>Gt(e)).replace(/\n{3,}/g,e=>`

${`<br />
`.repeat(e.length-2)}
`)}function ge(t){return t?.renderMode==="html"?"html":"markdown"}function Kt(t){return t?.htmlBackground||""}function lr(t){const e=String(t??"").replace("#","");if(!/^[0-9a-f]{6}$/i.test(e))return!1;const r=parseInt(e.slice(0,2),16),a=parseInt(e.slice(2,4),16),n=parseInt(e.slice(4,6),16);return(r*299+a*587+n*114)/1e3>170}function Ke(t,e,r={}){const a=ge(t),n=t?.body||e;if(a==="html"){const s=Kt(t),o=[];return s&&(o.push(`background-color: ${s}`),lr(s)&&o.push("color: #1d1712")),`<div class="html-document-surface" ${o.length?`style="${p(o.join("; "))}"`:""}>${dr(n)}</div>`}return cr(n,{soundtrackLabels:_a(t?.soundtracks??[]),videos:Fa(t?.videos??[]),characters:sr(t?.characters??[]),showMusicCues:!!r.showMusicCues})}function Jt(t="",e="markdown"){let r=String(t??"");if(e==="html"){const n=document.createElement("div");n.innerHTML=r,r=n.textContent??""}else r=r.replace(/```[\s\S]*?```/g," ").replace(/!\[[^\]]*]\([^)]+\)/g," ").replace(/\[music-end:\s*[^\]]+\]/gi," ").replace(/\[music:\s*[^\]]+\]/gi," ").replace(/\[video:\s*[^\]]+\]/gi," ").replace(/^\s*\[dialog:\s*[^\]]+\]\s*/gim,"").replace(/\[([^\]]+)]\([^)]+\)/g,"$1").replace(/[#>*_`~\-]/g," ");const a=r.replace(/\s+/g," ").trim();return{words:a?a.split(" ").length:0,characters:r.replace(/\s+$/g,"").length}}function ur(t){const e=Jt(t?.body??"",ge(t));return`<div id="chapter-text-stats" class="chapter-text-stats">Words: ${e.words} · Characters: ${e.characters}</div>`}function pr(t=""){const e=new Set,r=String(t??"");return[...r.matchAll(/data-word-image-placeholder=["'](\d+)["']/gi)].forEach(a=>e.add(Number(a[1]))),[...r.matchAll(/\[IMAGE\s+(\d+)\s+HERE\]/gi)].forEach(a=>e.add(Number(a[1]))),[...e].filter(a=>Number.isFinite(a)).sort((a,n)=>a-n)}function mr(t){const e=pr(t.body);return ge(t)!=="html"||!e.length?"":`
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
  `}function hr(t){return String(t??"").replace(/([.!?:;])\s*\d{1,4}(?=[A-ZÇĞİÖŞÜ])/g,"$1 ").replace(/(<(?:p|h[1-6]|li|blockquote)\b[^>]*>)\s*[o0]\s*(?=[A-ZÇĞİÖŞÜ])/gi,"$1").replace(/(<(?:p|h[1-6]|li|blockquote)\b[^>]*>)\s*\d{1,4}\s*(?=[A-ZÇĞİÖŞÜ])/gi,"$1").replace(/<p>\s*(?:\d{1,4}|[o0])\s*<\/p>/gi,"").replace(/(?:^|\n)\s*(?:\d{1,4}|[o0])\s*(?=\n|$)/gi,`
`).replace(/>\s+</g,"><").replace(/<\/(h[1-6]|p|blockquote|ul|ol|li|table|tr)>\s*/gi,`</$1>

`).replace(/\s*<(h[1-6]|p|blockquote|ul|ol|table)\b/gi,`
<$1`).replace(/\n{3,}/g,`

`).trim()}function Ee(t,e){return[...t?.childNodes??[]].filter(r=>r.nodeType===1&&r.localName===e)}function B(t,e){return Ee(t,e)[0]??null}function te(t,e){return t?.getAttribute(`w:${e}`)??t?.getAttribute(e)??""}function fr(t){const e=String(t??"").trim();return!e||e.toLowerCase()==="auto"?"":e.startsWith("#")?e:`#${e}`}function gr(t){return{black:"#000000",blue:"#2f65d9",cyan:"#00cfe8",green:"#37b24d",magenta:"#d63384",red:"#d9480f",yellow:"#ffe066",white:"#ffffff"}[String(t??"").toLowerCase()]??""}function vr(t){const e=B(t,"rPr");if(!e)return[];const r=[],a=fr(te(B(e,"color"),"val")),n=gr(te(B(e,"highlight"),"val")),s=Number(te(B(e,"sz"),"val")),o=B(e,"rFonts"),c=te(o,"ascii")||te(o,"hAnsi"),d=B(e,"u"),l=te(B(e,"vertAlign"),"val");return B(e,"b")&&r.push("font-weight: 700"),B(e,"i")&&r.push("font-style: italic"),d&&te(d,"val")!=="none"&&r.push("text-decoration: underline"),B(e,"strike")&&r.push("text-decoration: line-through"),a&&r.push(`color: ${a}`),n&&r.push(`background-color: ${n}`),Number.isFinite(s)&&s>0&&r.push(`font-size: ${s/2}pt`),c&&r.push(`font-family: ${c.replace(/[<>"']/g,"")}`),l==="superscript"&&r.push("vertical-align: super","font-size: 0.72em"),l==="subscript"&&r.push("vertical-align: sub","font-size: 0.72em"),r}function yr(t){return`<div class="word-image-placeholder" data-word-image-placeholder="${t}"><strong>[IMAGE ${t} HERE]</strong><br />Upload this Word image to Imgur or Pixhost, then replace this block with the Word Images panel.</div>`}function $t(t,e){const r=[];for(const s of[...t.childNodes])s.nodeType===1&&(s.localName==="t"||s.localName==="instrText"?r.push(p(s.textContent??"")):s.localName==="tab"?r.push("&nbsp;&nbsp;&nbsp;&nbsp;"):s.localName==="br"||s.localName==="cr"?r.push("<br />"):(s.localName==="drawing"||s.localName==="pict")&&(e.imageIndex+=1,r.push(yr(e.imageIndex))));const a=r.join("");if(!a)return"";const n=vr(t);return n.length?`<span style="${p(n.join("; "))}">${a}</span>`:a}function Qt(t,e){const r=B(t,"pPr"),a=te(B(r,"pStyle"),"val").toLowerCase(),n=te(B(r,"jc"),"val"),s=[];let o="p";const c=a.match(/heading([1-6])/);if(c?o=`h${c[1]}`:a==="title"?o="h1":a==="subtitle"&&(o="h2"),n){const l=n==="both"?"justify":n;s.push(`text-align: ${l}`)}const d=[...t.childNodes].map(l=>l.nodeType!==1?"":l.localName==="r"?$t(l,e):l.localName==="hyperlink"?Ee(l,"r").map(u=>$t(u,e)).join(""):"").join("").trim();return d?`<${o}${s.length?` style="${p(s.join("; "))}"`:""}>${d}</${o}>`:""}function br(t,e){const r=Ee(t,"tr").map(a=>`<tr>${Ee(a,"tc").map(s=>`<td>${Ee(s,"p").map(c=>Qt(c,e)).filter(Boolean).join("")}</td>`).join("")}</tr>`).join("");return r?`<table><tbody>${r}</tbody></table>`:""}async function wr(t){const{default:e}=await Pt(async()=>{const{default:l}=await import("./jszip.min-D7KnG0-e.js").then(u=>u.j);return{default:l}},[]),a=(await e.loadAsync(t)).file("word/document.xml");if(!a)throw new Error("This .docx file does not contain a readable Word document.");const n=await a.async("text"),o=new DOMParser().parseFromString(n,"application/xml").getElementsByTagNameNS("*","body")[0],c={imageIndex:0};return{html:[...o?.childNodes??[]].map(l=>l.nodeType!==1?"":l.localName==="p"?Qt(l,c):l.localName==="tbl"?br(l,c):"").filter(Boolean).join(`

`),imageCount:c.imageIndex}}function Sr(t,e){const r=t.selectionStart??t.value.length,a=t.selectionEnd??t.value.length,n=t.value.slice(0,r),s=t.value.slice(a),o=n&&!n.endsWith(`
`)?`

`:"",c=s&&!e.endsWith(`
`)?`

`:"";t.value=`${n}${o}${e}${c}${s}`;const d=n.length+o.length+e.length;t.focus(),t.setSelectionRange(d,d),t.dispatchEvent(new Event("input",{bubbles:!0}))}function et(){const t=document.querySelector("#chapter-render-mode-input")?.value==="html"?"html":"markdown",e=document.querySelector("#chapter-html-background-input")?.value??"";return{body:document.querySelector("#chapter-body-input")?.value??"",renderMode:t,htmlBackground:t==="html"?e:""}}async function me(t,e={}){const r=et(),a=document.querySelector("#chapter-cover-input"),n=document.querySelector("#chapter-cover-mode-input"),s=a instanceof HTMLInputElement?a.value.trim():t.coverImageUrl??"",o=s?await tt(s):"",c=n instanceof HTMLSelectElement&&["fill","fit","stretch"].includes(n.value)?n.value:t.coverImageMode??"fill";return{title:document.querySelector("#chapter-title-input")?.value.trim()||t.title||"Untitled Chapter",body:r.body,coverImageUrl:o,coverImageMode:c,published:document.querySelector("#chapter-published-input")?.checked??de(t),hasEverBeenPublished:t.hasEverBeenPublished??de(t),dmNotes:document.querySelector("#chapter-dm-notes-input")?.value??t.dmNotes??"",renderMode:r.renderMode,htmlBackground:r.htmlBackground,audioSettings:Vt(t),characters:i.editorCharacters,...e}}function ut(){const t=document.querySelector(".markdown-preview");if(!t)return;const e=et();e.soundtracks=Object.values(i.soundtrack.queues).flat(),e.characters=i.editorCharacters,t.dataset.previewMode=e.renderMode,t.innerHTML=Ke(e,e.renderMode==="html"?"":"*Start writing to preview your chapter here.*",{showMusicCues:!0}),Xt(t),ft(),Yt();const r=document.querySelector("#chapter-text-stats");if(r){const a=Jt(e.body,e.renderMode);r.textContent=`Words: ${a.words} · Characters: ${a.characters}`}}async function $r(t){if(!t)return;if(!t.name.toLowerCase().endsWith(".docx"))throw new Error("Please choose a .docx Word file.");if(!(document.querySelector("#chapter-body-input")instanceof HTMLTextAreaElement))throw new Error("Chapter editor is not available.");const r=i.route.params.chapterId,a=document.querySelector("#chapter-title-input"),n=await wr(await t.arrayBuffer()),s=hr(n.html);if(!s)throw new Error("No readable text was found in that Word file.");await i.adapter.updateChapter(r,{title:a?.value.trim()||"Untitled Chapter",body:s,renderMode:"html",htmlBackground:""});const o=n.imageCount?` ${n.imageCount} image placeholder(s) added.`:"";i.saveStatus=`Word file imported into the editor.${o}`;const c=document.querySelector(".notice.mono");c&&(c.textContent=i.saveStatus),await h()}function Ir(t){return t?typeof t.toDate=="function"?t.toDate():typeof t.seconds=="number"?new Date(t.seconds*1e3):new Date(t):null}function $e(t){const e=Ir(t);return!e||Number.isNaN(e.getTime())?"Unknown date":new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short"}).format(e)}function Ie(t,e="Untitled"){return String(t??e).trim().replace(/[<>:"/\\|?*\x00-\x1f]/g,"-").replace(/\s+/g," ").slice(0,90)||e}function kr(t,e){const r=URL.createObjectURL(t),a=document.createElement("a");a.href=r,a.download=e,document.body.append(a),a.click(),a.remove(),URL.revokeObjectURL(r)}function Cr(t,e,r){if(!e)return t;const a=e.toLowerCase();return t.filter(n=>r(n).toLowerCase().includes(a))}function Ar(t){return[...new Set(t.flatMap(e=>e.tags))].sort((e,r)=>e.localeCompare(r))}function Er(t=""){return`
    <aside class="quick-tools">
      <div class="quick-tools-frame">
        <div class="quick-tools-label">Quick Tools</div>
        <div class="quick-tools-body">
          ${t||'<div class="quick-tools-empty">No tools</div>'}
        </div>
      </div>
    </aside>
  `}function ue(t,e,r=""){const a=x(),n=we(a),s=`--reader-font-size:${n.fontSize}px;--reader-line-height:${n.lineHeight};--reader-width:${n.width}px;`,o=i.authError?`
        <div class="notice">
          <strong>Sign-in error</strong>
          <div class="muted">${p(i.authError)}</div>
          ${i.authErrorCode==="auth/invalid-credential"||i.authErrorCode==="auth/internal-error"?'<div class="card-actions"><button class="ghost-button" data-action="sign-in-redirect">Try redirect sign-in</button></div>':""}
        </div>
      `:"",c=i.loadError?`<div class="notice"><strong>Load error</strong><div class="muted">${p(i.loadError)}</div></div>`:"",d=i.saveStatus?`<div class="notice"><strong>Status</strong><div class="muted">${p(i.saveStatus)}</div></div>`:"";Ge.innerHTML=`
    <div class="app-shell" style="${s}">
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
            ${ot("/","Main Menu",e==="home")}
            ${ot("/creator","Creator",e==="creator")}
            ${ot("/browser","Browser",e==="browser")}
          </nav>
        </div>
        <div class="stack">
          <button class="notice account-card" data-action="open-settings" ${a?"":"disabled"}>
            <strong>${p(He(a))}</strong>
            <div class="muted">${p(a?.email??(i.authClient?.mode==="firebase"?"Sign in to create and manage stories":"Local demo mode"))}</div>
          </button>
          <button class="login-button" data-action="toggle-login">
            ${i.currentUser?"Log out":"Log in"}
          </button>
        </div>
      </aside>
      <main class="content">${t}</main>
      ${Er(r)}
    </div>
  `,(o||c||d)&&Ge.querySelector(".content").insertAdjacentHTML("afterbegin",`${d}${c}${o}`),Xt(),xr()}function Zt(t,e,r=!0){const a=e==="desired"?"desired":"fill";t.dataset.imageView=a,r&&(t.dataset.autoImageView="false"),t.classList.toggle("is-desired",a==="desired"),t.classList.toggle("is-fill",a!=="desired");const n=t.querySelector("[data-action='toggle-image-view']");n&&(n.textContent=a==="desired"?"Fill":"Desired",n.title=a==="desired"?"Switch to fill view":"Switch to desired view")}function It(t){if(t.dataset.autoImageView==="false")return;const e=t.querySelector("img");!e?.naturalWidth||!e?.naturalHeight||Zt(t,e.naturalHeight>e.naturalWidth?"desired":"fill",!1)}function Xt(t=document){t.querySelectorAll(".chapter-image-frame").forEach(e=>{const r=e.querySelector("img");if(r){if(r.complete){It(e);return}r.addEventListener("load",()=>It(e),{once:!0})}})}const ea="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";function Tr(t){return/\.(gif|webp)(?:$|[?#])/i.test(String(t??""))}async function Pr(t){const e=t.dataset.animatedSrc,r=t.querySelector("canvas");if(!e||!(r instanceof HTMLCanvasElement)||typeof createImageBitmap!="function"){t.classList.add("has-no-still");return}try{const a=await fetch(e,{mode:"cors",cache:"force-cache"});if(!a.ok)throw new Error(`Image preview returned ${a.status}.`);const n=await createImageBitmap(await a.blob()),s=320,o=Math.max(s/n.width,s/n.height),c=n.width*o,d=n.height*o,l=r.getContext("2d");r.width=s,r.height=s,l.drawImage(n,(s-c)/2,(s-d)/2,c,d),n.close?.(),t.classList.add("has-still")}catch{t.classList.add("has-no-still")}}function xr(t=document){t.querySelectorAll("[data-animated-asset-preview]").forEach(e=>{if(e.dataset.previewInitialized==="true")return;e.dataset.previewInitialized="true";const r=e.querySelector(".asset-animated-live"),a=e.dataset.animatedSrc;!(r instanceof HTMLImageElement)||!a||(Pr(e),e.addEventListener("pointerenter",()=>{e.classList.remove("is-live-ready"),r.onload=()=>e.classList.add("is-live-ready"),r.src=a,e.classList.add("is-playing")}),e.addEventListener("pointerleave",()=>{e.classList.remove("is-playing","is-live-ready"),r.onload=null,r.src=ea}))})}async function Mr(){const t=x();if(!t)return se("Sign in to manage account settings.");const e=we(t);ue(`
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
            <div class="muted">${p(t.name??"Creator")}</div>
          </div>
          <div class="inline-form settings-form">
            <input id="pen-name-input" placeholder="${p(t.name??"Creator")}" value="${p(t.penName??"")}" />
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
    `,"home")}function ot(t,e,r){return`<a class="nav-link ${r?"is-active":""}" href="#${t}"><span>${e}</span></a>`}function Nr(){return`
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
  `}function ta(t){return t.length?`
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
                <h3>${p(e.title)}</h3>
                <p class="muted">Requested by ${p(e.pendingTransfer?.requestedByName??e.creatorName)} on ${p($e(e.pendingTransfer?.requestedAt??e.updatedAt))}</p>
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
  `:""}async function Lr(){const t=x();let e=[];if(t?.email)try{e=await i.adapter.listIncomingStoryTransfers?.(t.email)??[]}catch(r){console.error("Incoming transfer list failed:",r),i.loadError="Ownership requests could not be loaded right now."}ue(`
      <div class="stack">
        ${Nr()}
        ${ta(e)}
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
    `,"home")}async function Ur(){const t=x();let e=[],r=[],a=[],n="";try{e=await i.adapter.listCreatorStories(t?.id)}catch(m){console.error("Creator story list failed:",m),i.loadError="Your stories could not be loaded right now."}if(t)try{n=await Va()}catch(m){console.error("User email resolve failed:",m)}if(n){try{r=xe()?await i.adapter.listAllStories():await i.adapter.listEditorStories?.(n)??[]}catch(m){console.error("Editor story list failed:",m),i.loadError="Editor permissions could not be loaded right now."}try{a=await i.adapter.listIncomingStoryTransfers?.(n)??[]}catch(m){console.error("Incoming transfer list failed:",m),i.loadError="Ownership requests could not be loaded right now."}}const s=re(),o=s.get("q")??"",c=s.get("tag")??"",d=Cr(e,o,m=>`${m.title} ${m.tags.join(" ")}`).filter(m=>c?m.tags.includes(c):!0),l=Ar(e),u=i.authClient?.mode==="firebase"&&!t?'<div class="notice">Sign in with Firebase to create, edit, and manage your own stories.</div>':"";ue(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Creator</h2>
            <p class="muted">Manage your stories, search by title, and filter by tags.</p>
          </div>
          <button class="primary-button" data-action="create-story" ${t?"":"disabled"}>Create</button>
        </div>
        ${ta(a)}
        ${u}
        <section class="panel stack">
          <div class="search-row">
            <input id="story-search" placeholder="Search by story title or tag" value="${p(o)}" />
            <select id="story-tag-filter">
              <option value="">All tags</option>
              ${l.map(m=>`<option value="${p(m)}" ${c===m?"selected":""}>${p(m)}</option>`).join("")}
            </select>
            <button class="ghost-button" data-action="apply-story-filters">Filter</button>
          </div>
          <div class="chip-row">
            ${l.map(m=>`<a class="pill" href="#/creator?tag=${encodeURIComponent(m)}">${p(m)}</a>`).join("")}
          </div>
        </section>
        <section class="panel stack">
          <div class="section-header">
            <div>
              <h3>Your Stories</h3>
              <p class="muted">Stories where you are the author.</p>
            </div>
            <span class="pill">${d.length} story(s)</span>
          </div>
          <div class="story-list">
            ${d.length?d.map(m=>pt(m,{authorView:!0})).join(""):'<div class="empty-state">No stories match this filter yet.</div>'}
          </div>
        </section>
        <section class="panel stack">
          <div class="section-header">
            <div>
              <h3>Editor Permission</h3>
              <p class="muted">${xe()?"All stories available through your administrator access.":"Stories where the author has added you as an editor."}</p>
            </div>
            <span class="pill">${r.length} story(s)</span>
          </div>
          <div class="story-list">
            ${r.length?r.map(m=>pt(m,{editorView:!0})).join(""):'<div class="empty-state">No editor permissions yet.</div>'}
          </div>
        </section>
      </div>
    `,"creator")}function fe(t){return["fit","stretch"].includes(t?.coverImageMode)?t.coverImageMode:"fill"}function aa(t,e={}){const r=t?.coverImageUrl?Oe(t.coverImageUrl):"",a=fe(t),n=t?.title||e.fallbackTitle||"Untitled";return`
    <div class="chapter-cover entity-cover cover-mode-${a} ${r?"has-cover":"no-cover"}">
      ${r?`<img src="${p(r)}" alt="Cover for ${p(n)}" />`:`<div class="chapter-cover-placeholder" aria-hidden="true"><span>${e.placeholder??"✦"}</span></div>`}
      ${e.badge??""}
    </div>
  `}function pt(t,e={}){const r=!!e.browserView,a=`#/stories/${t.id}${r?"?view=browser":""}`;return`
    <article class="chapter-card entity-card story-cover-card">
      ${aa(t,{placeholder:"◆",badge:`<span class="status-pill cover-card-badge">${p(t.visibility)}</span>`})}
      <h3 class="chapter-card-title">${p(t.title||"Untitled story")}</h3>
      ${e.editorView||r?`<p class="muted entity-card-byline">by ${p(t.creatorName)}</p>`:""}
      <p class="muted chapter-card-date">Updated ${$e(t.updatedAt)}</p>
      <div class="chip-row entity-card-tags">
        ${t.tags.map(n=>`<span class="pill">${p(n)}</span>`).join("")}
      </div>
      <div class="entity-card-meta">
        <span class="pill">${t.arcs.length} arc(s)</span>
      </div>
      ${e.authorView||e.editorView&&xe()?`
        <div class="entity-card-actions" aria-label="Story actions">
          <button class="small-button chapter-icon-button danger-icon" title="Delete story" aria-label="Delete story" data-action="delete-story" data-story-id="${t.id}">🗑</button>
        </div>
      `:""}
      <a class="primary-button chapter-open-button" href="${a}"><span aria-hidden="true">&#128214;</span> ${r?"Read Story":"Open Story"}</a>
    </article>
  `}async function qr(){const t=await i.adapter.listBrowserStories(x()?.id),e=re(),r=e.get("group")!=="flat",a=e.get("creator")??"",n=a?t.filter(c=>c.creatorName===a):t,s=[...new Set(t.map(c=>c.creatorName))];let o="";n.length?r?o=s.filter(c=>!a||c===a).map(c=>{const d=n.filter(l=>l.creatorName===c);return d.length?`
          <section class="panel stack">
            <div class="section-header">
              <h3>${p(c)}</h3>
              <span class="pill">${d.length} public stories</span>
            </div>
            <div class="story-list">${d.map(kt).join("")}</div>
          </section>
        `:""}).join(""):o=`<section class="story-list">${n.map(kt).join("")}</section>`:o='<div class="empty-state">No public stories are available yet.</div>',ue(`
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Browser</h2>
            <p class="muted">Explore public stories and browse them by creator.</p>
          </div>
          <div class="toolbar">
            <select id="browser-creator-filter">
              <option value="">All creators</option>
              ${s.map(c=>`<option value="${p(c)}" ${a===c?"selected":""}>${p(c)}</option>`).join("")}
            </select>
            <select id="browser-group-mode">
              <option value="grouped" ${r?"selected":""}>Grouped by creator</option>
              <option value="flat" ${r?"":"selected"}>Flat list</option>
            </select>
            <button class="ghost-button" data-action="apply-browser-filters">Apply</button>
          </div>
        </div>
        ${o}
      </div>
    `,"browser")}function kt(t){return pt(t,{browserView:!0})}function Or(t,e=!1){const r=t.editorEmails??[];return r.length?`
    <div class="editor-chip-list" aria-label="Story editors">
      ${r.map(a=>`
        <span class="editor-chip">
          <span>${p(a)}</span>
          ${e?`
            <button
              class="small-button editor-remove-button"
              type="button"
              title="Remove editor"
              data-action="remove-story-editor"
              data-story-id="${t.id}"
              data-editor-email="${p(a)}"
            >🗑</button>
          `:""}
        </span>
      `).join("")}
    </div>
  `:""}async function Rr(t){const e=await i.adapter.getStory(t);if(!e)return se("Story not found.");const r=Nt(e),a=Ue(e),n=re().get("view")==="browser",s=re().get("transfer")==="1",o=e.pendingTransferStatus==="pending"?e.pendingTransfer:null;if(!mt(e))return se("This story is private.");ue(`
      <div class="stack">
        ${vt([[n?"#/browser":"#/creator",n?"Browser":"Creator"],["",e.title]])}
        <div class="page-title">
          <div>
            <h2>${p(e.title)}</h2>
            <p class="muted">Set visibility, manage arcs, and organize the reading order.</p>
          </div>
          <div class="card-actions">
            ${n&&a?'<a class="ghost-button" href="#/stories/'+e.id+'">Edit</a>':""}
            ${a&&!n?'<button class="ghost-button" data-action="export-story" data-story-id="'+e.id+'">Export</button>':""}
            ${r&&!n?'<button class="ghost-button" type="button" data-action="add-story-editor" data-story-id="'+e.id+'">Add an Editor</button>':""}
            ${r&&!n?'<button class="ghost-button" type="button" data-action="open-story-transfer" data-story-id="'+e.id+'">Transfer Ownership</button>':""}
            ${a&&!n?'<button class="primary-button" data-action="create-arc" data-story-id="'+e.id+'">New arc</button>':""}
          </div>
        </div>
        <section class="panel stack">
          <div class="inline-form">
            <input id="story-title-input" value="${p(e.title)}" ${a?"":"disabled"} />
            <input id="story-tags-input" value="${p(e.tags.join(", "))}" ${a?"":"disabled"} />
            <select id="story-visibility-input" ${a?"":"disabled"}>
              ${["public","unlisted","private"].map(c=>`<option value="${c}" ${e.visibility===c?"selected":""}>${c}</option>`).join("")}
            </select>
            ${a?'<button class="ghost-button" data-action="save-story-settings" data-story-id="'+e.id+'">Save</button>':""}
          </div>
          ${a&&!n?`
            <div class="chapter-cover-control entity-cover-control">
              <label for="story-cover-input">Story cover image</label>
              <input id="story-cover-input" value="${p(e.coverImageUrl??"")}" placeholder="Paste an Imgur, Pixhost, or direct image URL" />
              <label for="story-cover-mode-input">Cover placement</label>
              <select id="story-cover-mode-input">
                <option value="fill" ${fe(e)==="fill"?"selected":""}>Fill — cover the full area, crop if needed</option>
                <option value="fit" ${fe(e)==="fit"?"selected":""}>Fit — show the complete image without cropping</option>
                <option value="stretch" ${fe(e)==="stretch"?"selected":""}>Stretch — resize the image to the exact card shape</option>
              </select>
            </div>
          `:""}
          <div class="notice">
            <strong>${p(e.creatorName)}</strong>
            <div class="muted">Created ${$e(e.createdAt)}. Visibility is currently ${p(e.visibility)}.</div>
            ${e.editorEmails?.length?`
              <div class="muted">Editors</div>
              ${Or(e,r&&!n)}
            `:""}
          </div>
          ${r&&o?`
            <div class="notice">
              <strong>Transfer pending</strong>
              <div class="muted">Waiting for ${p(o.targetEmail??"")} to accept. Ownership stays with you until they do.</div>
              <div class="card-actions">
                <button class="ghost-button" data-action="cancel-story-transfer" data-story-id="${e.id}">Cancel transfer</button>
              </div>
            </div>
          `:""}
          ${r&&!n&&s?`
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
          ${e.arcs.length?e.arcs.map((c,d)=>Dr(c,e,a,d,n)).join(""):'<div class="empty-state">No arcs yet. Create the first arc to start structuring this story.</div>'}
        </section>
      </div>
    `,n?"browser":a?"creator":"browser")}function Dr(t,e,r,a,n=!1){const s=`#/stories/${e.id}/arcs/${t.id}${n?"?view=browser":""}`;return`
    <article class="chapter-card entity-card arc-cover-card">
      ${aa(t,{placeholder:"◇"})}
      <h3 class="chapter-card-title">${p(t.title||"Untitled arc")}</h3>
      <p class="muted chapter-card-date">Updated ${$e(t.updatedAt)}</p>
      <div class="entity-card-meta">
        <span class="pill">${t.chapters.length} chapter(s)</span>
      </div>
      ${r&&!n?`
        <div class="entity-card-actions" aria-label="Arc actions">
          <button class="small-button chapter-icon-button" title="Move arc up" aria-label="Move arc up" data-action="move-arc-up" data-story-id="${e.id}" data-index="${a}" ${a===0?"disabled":""}>↑</button>
          <button class="small-button chapter-icon-button" title="Move arc down" aria-label="Move arc down" data-action="move-arc-down" data-story-id="${e.id}" data-index="${a}" ${a===e.arcs.length-1?"disabled":""}>↓</button>
          <button class="small-button chapter-icon-button danger-icon" title="Delete arc" aria-label="Delete arc" data-action="delete-arc" data-story-id="${e.id}" data-arc-id="${t.id}">🗑</button>
        </div>
      `:""}
      <a class="primary-button chapter-open-button" href="${s}"><span aria-hidden="true">&#128214;</span> Open Arc</a>
    </article>
  `}function Vr(t,e,r=!1,a=""){return`
    <div class="phase-separator">
      <span class="phase-line"></span>
      ${e&&!r?`<button class="phase-title" data-action="rename-phase" data-arc-id="${a}" data-phase-id="${t.id}" data-phase-title="${p(t.title)}">${p(t.title)}</button>`:`<span class="phase-title">${p(t.title)}</span>`}
      <span class="phase-line"></span>
    </div>
  `}function Br(t){const e=t.characters??[],r=ge(t)==="markdown";return`
    <section class="panel stack character-panel">
      <div class="section-header">
        <div>
          <h3>Characters</h3>
          <p class="muted">Create reusable speaker colors for dialogue in this chapter.</p>
        </div>
        <span class="pill">${e.length} character(s)</span>
      </div>
      ${r?`
        <div class="character-form">
          <input id="character-record-id-input" type="hidden" value="" />
          <input id="character-display-name-input" placeholder="Display name, for example Julius Vane" />
          <input id="character-dialog-id-input" placeholder="Dialogue ID, for example jv" />
          <label class="character-color-control">
            <span>Main color</span>
            <input id="character-main-color-input" type="color" value="#8f5f35" />
          </label>
          <label class="character-color-control">
            <span>Secondary color</span>
            <input id="character-secondary-color-input" type="color" value="#d7b56d" />
          </label>
          <div class="character-form-actions">
            <button id="save-character-button" class="ghost-button" data-action="add-character" data-chapter-id="${t.id}">Add character</button>
            <button id="cancel-character-edit-button" class="small-button" data-action="cancel-character-edit" type="button" hidden>Cancel</button>
          </div>
        </div>
        <div class="notice character-syntax"><span class="mono">Use [dialog: jv] Hello or [dialog: jv: ???] Hello.</span></div>
      `:'<div class="notice">Character dialogue blocks are available in Markdown Mode only.</div>'}
      <div class="character-list">
        ${e.length?e.map(a=>{const n=Y(a.mainColor,"#8f5f35"),s=Y(a.secondaryColor,"#d7b56d"),o=a.dialogId??a.name,c=a.displayName??a.name??o,d=`[dialog: ${o}] `;return`
            <article class="character-item" style="--character-main: ${n}; --character-secondary: ${s};">
              <div class="character-item-header">
                <div class="character-swatches" aria-label="Character colors">
                  <span class="character-swatch" style="background: ${n}"></span>
                  <span class="character-swatch" style="background: ${s}"></span>
                </div>
                <div>
                  <strong>${p(c)}</strong>
                  <div class="muted mono">ID: ${p(o)}</div>
                </div>
              </div>
              <div class="muted mono">${p(d)}Hello</div>
              ${r?`
                <div class="card-actions">
                  <button class="small-button" data-action="insert-dialog-marker" data-character-id="${p(o)}">Insert dialog</button>
                  <button class="small-button" data-action="copy-dialog-marker" data-character-id="${p(o)}">Copy</button>
                  <button class="small-button" data-action="edit-character" data-character-record-id="${a.id}" data-character-dialog-id="${p(o)}" data-character-display-name="${p(c)}" data-character-main-color="${n}" data-character-secondary-color="${s}">Edit</button>
                  <button class="small-button danger-icon" title="Delete character" aria-label="Delete character" data-action="delete-character" data-chapter-id="${t.id}" data-character-id="${a.id}">🗑</button>
                </div>
              `:""}
            </article>
          `}).join(""):'<div class="empty-state">No characters in this chapter yet.</div>'}
      </div>
    </section>
  `}function _r(t){const e=t.soundtracks??[],r=ge(t)==="markdown";return`
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
        <select id="soundtrack-track-type-input" aria-label="Audio track">
          <option value="soundtrack" selected>Soundtrack</option>
          <option value="ambience">Ambience</option>
          <option value="sound-effect">Sound Effect</option>
        </select>
        <button class="ghost-button" data-action="add-soundtrack" data-chapter-id="${t.id}">Add soundtrack</button>
      </div>
      <div class="soundtrack-list">
        ${e.length?e.map(a=>{const n=K(a.trackType),s=qe(a.volumeMultiplier);return`
                <article class="soundtrack-item track-${n}">
                  <div>
                    <strong>${p(a.label?.trim()||"Untitled soundtrack")}</strong>
                    <span class="audio-track-pill">${p(S[n].label)}</span>
                    ${r?`<div class="muted mono">[music: ${p(a.id)}]</div>`:""}
                    <div class="muted mono">${p(a.url??"")}</div>
                  </div>
                  <div class="soundtrack-settings">
                    <label>
                      <span>Track</span>
                      <select data-action="update-soundtrack-setting" data-setting="trackType" data-chapter-id="${t.id}" data-soundtrack-id="${a.id}">
                        <option value="soundtrack" ${n==="soundtrack"?"selected":""}>Soundtrack</option>
                        <option value="ambience" ${n==="ambience"?"selected":""}>Ambience</option>
                        <option value="sound-effect" ${n==="sound-effect"?"selected":""}>Sound Effect</option>
                      </select>
                    </label>
                    <label>
                      <span>Track volume <output data-track-volume-output="${a.id}">${s}%</output></span>
                      <input type="range" min="0" max="200" step="5" value="${s}" data-action="update-soundtrack-setting" data-setting="volumeMultiplier" data-chapter-id="${t.id}" data-soundtrack-id="${a.id}" />
                    </label>
                  </div>
                  <div class="card-actions">
                    <button class="small-button" data-action="preview-soundtrack" data-soundtrack-id="${a.id}" aria-pressed="false">Preview</button>
                    ${r?`<button class="small-button" data-action="copy-soundtrack-marker" data-soundtrack-id="${a.id}">Copy cue</button>`:""}
                    <button class="danger-button" data-action="delete-soundtrack" data-chapter-id="${t.id}" data-soundtrack-id="${a.id}">Remove</button>
                  </div>
                </article>
              `}).join(""):'<div class="empty-state">No soundtrack links yet.</div>'}
      </div>
    </section>
  `}function Fr(t){const e=t.videos??[],r=ge(t)==="markdown";return`
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
                    <strong>${p(a.label?.trim()||"Untitled video")}</strong>
                    ${r?`<div class="muted mono">[video: ${p(a.id)}]</div>`:""}
                    <div class="muted mono">${p(a.url??"")}</div>
                  </div>
                  <div class="card-actions">
                    ${r?`<button class="small-button" data-action="copy-video-marker" data-video-id="${a.id}">Copy embed</button>`:""}
                    <button class="danger-button" data-action="delete-video" data-chapter-id="${t.id}" data-video-id="${a.id}">Remove</button>
                  </div>
                </article>
              `).join(""):'<div class="empty-state">No video links yet.</div>'}
      </div>
    </section>
  `}function jr(t,e=!1){const r=x(),a=t.reactions??{},n=["🔥","😮","💀","❤️"],s=t.comments??[];return`
    <section class="panel stack engagement-panel">
      <div class="section-header">
        <div>
          <h3>Comments / Reactions</h3>
          <p class="muted">Leave table chatter without changing the chapter text.</p>
        </div>
      </div>
      <div class="reaction-row">
        ${n.map(o=>{const c=a[o]??[];return`<button class="ghost-button ${r?.id&&c.includes(r.id)?"is-active":""}" data-action="toggle-reaction" data-chapter-id="${t.id}" data-emoji="${o}" ${r?"":"disabled"}>${o} ${c.length}</button>`}).join("")}
      </div>
      <div class="comment-list">
        ${s.length?s.map((o,c)=>{const d=!!(r?.id&&(e||o.userId===r.id));return`
            <article class="notice">
              <div class="comment-header">
                <div>
                  <strong>${p(o.userName??"Reader")}</strong>
                  <div class="muted">${$e(o.createdAt)}</div>
                </div>
                ${d?`<button class="small-button danger-icon" type="button" title="Delete comment" aria-label="Delete comment" data-action="delete-comment" data-chapter-id="${t.id}" data-comment-id="${p(o.id??"")}" data-comment-index="${c}">🗑</button>`:""}
              </div>
              <p>${p(o.body??"")}</p>
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
  `}function Hr(t,e){if(!t.length)return"";const r=i.soundtrack.chapterId===e.id?Vt(e):ht(e.audioSettings),a={master:r.masterVolume,soundtrack:r.soundtrackVolume,ambience:r.ambienceVolume,"sound-effect":r.soundEffectVolume},n=new Set(t.map(c=>c.trackType)),s=(c,d,l)=>`
    <button
      class="quick-tool-button volume-button track-${c} ${i.soundtrack.volumeOpen===c?"is-open":""}"
      data-action="toggle-audio-volume"
      data-audio-volume="${c}"
      data-wheel-volume="true"
      style="--volume-fill: ${a[c]}%;"
      title="${p(d)} volume ${a[c]}%"
      ${c!=="master"&&!n.has(c)?"disabled":""}
    ><span class="quick-tool-icon">${l}</span></button>
    <div class="volume-popout" data-volume-popout="${c}" ${i.soundtrack.volumeOpen===c?"":"hidden"}>
      <strong>${p(d)}</strong>
      <input class="volume-slider" type="range" min="0" max="100" step="1" value="${a[c]}" data-action="set-audio-volume" data-audio-volume="${c}" />
      <div class="quick-tool-status" data-audio-volume-value="${c}">${a[c]}%</div>
    </div>
  `,o=(c,d)=>{const l=I(c),u=i.soundtrack.chapterId===e.id?q(c):null;return`
      <button
        class="quick-tool-button audio-play-button track-${c} ${u&&!l.paused?"is-active":""}"
        data-action="toggle-audio-channel"
        data-audio-channel="${c}"
        aria-pressed="${String(!!u&&!l.paused)}"
        title="${p(`${l.paused?"Play":"Pause"} ${S[c].label}`)}"
        ${n.has(c)?"":"disabled"}
      ><span class="quick-tool-icon">${d}</span></button>
    `};return`
    <div class="quick-tool-stack">
      ${s("master","Master","M")}
      ${o("soundtrack","♪")}
      ${s("soundtrack","Soundtrack","S")}
      ${o("ambience","≈")}
      ${s("ambience","Ambience","A")}
      ${s("sound-effect","Sound Effect","FX")}
      <div class="audio-channel-status" data-audio-status="soundtrack"></div>
      <div class="audio-channel-status" data-audio-status="ambience"></div>
      <div class="audio-channel-status" data-audio-status="sound-effect"></div>
    </div>
  `}async function zr(t,e){const[r,a]=await Promise.all([i.adapter.getStory(t),i.adapter.getArc(e)]);if(!r||!a)return se("Arc not found.");const n=Ue(r),s=re().get("view")==="browser";if(!mt(r))return se("This story is private.");const o=(a.phases??[]).map(c=>{const d=(c.chapters??[]).filter(l=>ct(l,n));return s&&!d.length?"":`
      <section class="phase-block stack">
        ${Vr(c,n,s,a.id)}
        <div class="nested-list chapter-card-grid">
          ${d.length?d.map((l,u)=>Wr(l,r,a,n,u,s,c)).join(""):'<div class="empty-state">No chapters in this phase yet.</div>'}
        </div>
      </section>
    `}).join("");if(ue(`
      <div class="stack">
        ${vt([[s?"#/browser":n?"#/creator":"#/browser",s?"Browser":n?"Creator":"Browser"],["#/stories/"+r.id+(s?"?view=browser":""),r.title],["",a.title]])}
        <div class="page-title">
          <div>
            <h2>${p(a.title)}</h2>
            <p class="muted">Manage the chapter list and reading order for this arc.</p>
          </div>
          <div class="card-actions">
            ${s&&n?'<a class="ghost-button" href="#/stories/'+r.id+"/arcs/"+a.id+'">Edit</a>':""}
            ${n&&!s?'<button class="ghost-button" data-action="create-phase" data-arc-id="'+a.id+'">New phase</button>':""}
            ${n&&!s?'<button class="primary-button" data-action="create-chapter" data-arc-id="'+a.id+'" data-story-id="'+r.id+'">New chapter</button>':""}
          </div>
        </div>
        ${n&&!s?`
          <section class="panel stack">
            <div class="inline-form">
              <input id="arc-title-input" value="${p(a.title)}" />
              <button class="ghost-button" data-action="save-arc-title" data-arc-id="${a.id}" data-story-id="${r.id}">Save arc</button>
            </div>
            <div class="chapter-cover-control entity-cover-control">
              <label for="arc-cover-input">Arc cover image</label>
              <input id="arc-cover-input" value="${p(a.coverImageUrl??"")}" placeholder="Paste an Imgur, Pixhost, or direct image URL" />
              <label for="arc-cover-mode-input">Cover placement</label>
              <select id="arc-cover-mode-input">
                <option value="fill" ${fe(a)==="fill"?"selected":""}>Fill — cover the full area, crop if needed</option>
                <option value="fit" ${fe(a)==="fit"?"selected":""}>Fit — show the complete image without cropping</option>
                <option value="stretch" ${fe(a)==="stretch"?"selected":""}>Stretch — resize the image to the exact card shape</option>
              </select>
            </div>
        </section>`:""}
        ${o||'<div class="empty-state">No chapters yet. Add one to begin writing.</div>'}
      </div>
    `,s?"browser":n?"creator":"browser"),n&&!s){const c=document.querySelector("#story-transfer-button");c&&c.addEventListener("click",d=>{d.preventDefault(),d.stopPropagation(),showStoryTransferModal(r.id)})}}function Wr(t,e,r,a,n,s=!1,o=null){const c=r.phases??[],d=c.findIndex(T=>T.id===o?.id),l=d<=0&&n===0,u=d===c.length-1&&n===(o?.chapters?.length??0)-1,m=t.coverImageUrl?Oe(t.coverImageUrl):"",y=["fit","stretch"].includes(t.coverImageMode)?t.coverImageMode:"fill",g=de(t),w=`#/stories/${e.id}/arcs/${r.id}/chapters/${t.id}${s?"?view=browser":""}`;return`
    <article class="chapter-card">
      <div class="chapter-cover cover-mode-${y} ${m?"has-cover":"no-cover"}">
        ${m?`<img src="${p(m)}" alt="Cover for ${p(t.title||"Untitled chapter")}" />`:'<div class="chapter-cover-placeholder" aria-hidden="true"><span>✦</span></div>'}
        <span class="chapter-lock ${g?"is-published":"is-draft"}" title="${g?"Published":"Draft"}" aria-label="${g?"Published":"Draft"}">${g?"&#128275;":"&#128274;"}</span>
      </div>
      <h3 class="chapter-card-title">${p(t.title||"Untitled chapter")}</h3>
      <p class="muted chapter-card-date">Updated ${$e(t.updatedAt)}</p>
      ${a&&!s?`
        <div class="chapter-card-actions" aria-label="Chapter actions">
          <button class="small-button chapter-icon-button" title="Move chapter up" aria-label="Move chapter up" data-action="move-chapter-up" data-arc-id="${r.id}" data-chapter-id="${t.id}" ${l?"disabled":""}>↑</button>
          <button class="small-button chapter-icon-button" title="Move chapter down" aria-label="Move chapter down" data-action="move-chapter-down" data-arc-id="${r.id}" data-chapter-id="${t.id}" ${u?"disabled":""}>↓</button>
          <button class="small-button chapter-icon-button" title="Transfer chapter" aria-label="Transfer chapter" data-action="open-transfer-chapter" data-story-id="${e.id}" data-arc-id="${r.id}" data-phase-id="${o?.id??""}" data-chapter-id="${t.id}">↗</button>
          <button class="small-button chapter-icon-button danger-icon" title="Delete chapter" aria-label="Delete chapter" data-action="delete-chapter" data-story-id="${e.id}" data-arc-id="${r.id}" data-chapter-id="${t.id}">🗑</button>
        </div>
      `:""}
      <a class="primary-button chapter-open-button" href="${w}"><span aria-hidden="true">&#128214;</span> Open Chapter</a>
    </article>
  `}function Ct(t,e,r,a,n=!1){return!r&&!a?"":`
    <div class="chapter-pager">
      ${r?`<a class="ghost-button" href="#/stories/${t}/arcs/${e}/chapters/${r.id}${n?"?view=browser":""}">Previous Chapter</a>`:""}
      ${a?`<a class="ghost-button" href="#/stories/${t}/arcs/${e}/chapters/${a.id}${n?"?view=browser":""}">Next Chapter</a>`:""}
    </div>
  `}async function Yr(t,e,r){const[a,n,s]=await Promise.all([i.adapter.getStory(t),i.adapter.getArc(e),i.adapter.getChapter(r)]);if(!a||!n||!s)return se("Chapter not found.");const o=Ue(a),c=re().get("view")==="browser";if(!mt(a))return se("This story is private.");if(!ct(s,o))return se("This chapter is still a draft.");const d=s.assets??[];i.editorCharacters=[...s.characters??[]];const l=ge(s),u=Kt(s),m=Dt(s.soundtracks??[]),y=(n.chapters??[]).filter(L=>ct(L,o)),g=y.findIndex(L=>L.id===r),w=g>0?y[g-1]:null,T=g>=0&&g<y.length-1?y[g+1]:null,N=Ct(a.id,n.id,w,T,c),D=Ct(a.id,n.id,w,T,c),oe=o&&!c?`
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
              <input id="chapter-title-input" value="${p(s.title)}" ${o?"":"disabled"} />
              <div class="chapter-cover-control">
                <label for="chapter-cover-input">Chapter cover image</label>
                <div class="inline-form">
                  <input id="chapter-cover-input" value="${p(s.coverImageUrl??"")}" placeholder="Paste an Imgur, Pixhost, or direct image URL" />
                  <button class="ghost-button" type="button" data-action="clear-chapter-cover" data-chapter-id="${s.id}">Clear cover</button>
                </div>
                <label for="chapter-cover-mode-input">Cover placement</label>
                <select id="chapter-cover-mode-input">
                  <option value="fill" ${(s.coverImageMode??"fill")==="fill"?"selected":""}>Fill — cover the full area, crop if needed</option>
                  <option value="fit" ${s.coverImageMode==="fit"?"selected":""}>Fit — show the complete image without cropping</option>
                  <option value="stretch" ${s.coverImageMode==="stretch"?"selected":""}>Stretch — resize the image to the exact card shape</option>
                </select>
                <span class="muted">Paste a URL here, or use the cover button on one of the referenced images below.</span>
              </div>
              <div class="inline-form">
                <label class="toggle-row">
                  <input id="chapter-published-input" type="checkbox" ${de(s)?"checked":""} />
                  <span>Published for readers</span>
                </label>
                <span class="pill">${de(s)?"Published":"Draft"}</span>
              </div>
              <textarea id="chapter-body-input" class="markdown-area" ${o&&l!=="html"?"":"disabled"}>${p(s.body)}</textarea>
              <section class="panel stack dm-notes-panel">
                <div class="section-header">
                  <div>
                    <h3>Chapter / DM Notes</h3>
                    <p class="muted">Private notes for authors and editors. Readers never see this.</p>
                  </div>
                </div>
                <textarea id="chapter-dm-notes-input" class="markdown-area notes-area" placeholder="Secret prep, reminders, NPC motives...">${p(s.dmNotes??"")}</textarea>
              </section>
              ${D}
              ${mr(s)}
              ${o?`
                <div class="panel asset-helper">
                  <div class="section-header">
                    <h3>Image link helper</h3>
                    <span class="pill">Manual Imgur, Pixhost, or external URLs</span>
                  </div>
                  <div class="inline-form asset-form">
                    <input id="asset-name-input" placeholder="Image label, for example cover-art" />
                    <input id="asset-url-input" placeholder="https://i.imgur.com/your-image.jpg or https://pixhost.to/show/..." />
                    <button class="ghost-button" data-action="add-external-asset" data-chapter-id="${s.id}">Add image</button>
                  </div>
                  <div class="notice">
                    Upload the image to Imgur or Pixhost first. You can paste a direct image URL, Pixhost Forum small image code, Pixhost HTML small image code, or a Pixhost show page when the browser allows it.
                  </div>
                  <div class="asset-list asset-tray">
                    ${d.length?d.map((L,U)=>At(L,U,{chapterId:s.id,editable:!0})).join(""):'<div class="empty-state">No assets in this chapter yet.</div>'}
                  </div>
                </div>
              `:""}
              ${o&&!c?Br(s):""}
              ${Fr(s)}
              ${_r(s)}
              <div class="notice mono">${p(i.saveStatus||"Tip: use `![alt](image-url)` to place pasted external images into the chapter body.")}</div>
            </div>
          </section>
          <section class="preview-pane">
            <h3>Preview</h3>
            ${ur(s)}
            <div class="markdown-preview" data-preview-mode="${l}">${Ke(s,"*Start writing to preview your chapter here.*",{showMusicCues:!0})}</div>
          </section>
        </div>
      `:`
        <section class="panel stack">
          <div class="section-header">
            <h3>Reading view</h3>
            <span class="pill">${d.length} asset(s)</span>
          </div>
          <div class="markdown-preview" data-preview-mode="${l}">${Ke(s,"*This chapter is empty.*",{showMusicCues:c})}</div>
        </section>
        ${D}
        ${d.length?`<section class="panel stack"><h3>Referenced images</h3><div class="asset-list">${d.map((L,U)=>At(L,U)).join("")}</div></section>`:""}
        ${jr(s,o)}
      `;ue(`
      <div class="stack">
        ${vt([[c?"#/browser":o?"#/creator":"#/browser",c?"Browser":o?"Creator":"Browser"],["#/stories/"+a.id+(c?"?view=browser":""),a.title],["#/stories/"+a.id+"/arcs/"+n.id+(c?"?view=browser":""),n.title],["",s.title||"Untitled chapter"]])}
        <div class="page-title">
          <div>
            <h2>${p(s.title||"Untitled chapter")}</h2>
            <p class="muted">${o&&!c?"Write in markdown, add image links, and save your draft.":"Read this chapter in a clean, read-only view."}</p>
          </div>
          <div class="card-actions">
            ${c&&o?`<a class="ghost-button" href="#/stories/${a.id}/arcs/${n.id}/chapters/${s.id}">Edit</a>`:""}
            ${o&&!c?`<a class="ghost-button" href="#/stories/${a.id}/arcs/${n.id}/chapters/${s.id}?view=browser">Full Preview</a>`:""}
            ${o&&!c?`<button class="primary-button" data-action="save-chapter" data-chapter-id="${s.id}">Save</button>`:""}
          </div>
        </div>
        ${N}
        ${oe}
      </div>
    `,c?"browser":o?"creator":"browser",Hr(m,s)),m.length?Xa(s.id,m,{body:s.body,audioSettings:s.audioSettings,editorMode:o&&!c}):ie()}function At(t,e=0,r={}){const a=t.url??t.dataUrl??"",n=a?Oe(a):"",s=!!a,o=r.editable&&Tr(n),c=`![${t.name}](${n})`,d=s?o?`
          <div class="asset-animated-media" data-animated-asset-preview data-animated-src="${p(n)}">
            <canvas aria-hidden="true"></canvas>
            <img class="asset-animated-live" src="${ea}" alt="${p(t.name)}" />
            <span class="asset-animation-badge">Hover to animate</span>
          </div>
        `:`<img src="${p(n)}" alt="${p(t.name)}" />`:"";return`
    <article class="asset-item">
      ${r.editable?`
        <div class="asset-actions">
          <button class="small-button asset-action-button" type="button" title="Use as chapter cover" aria-label="Use as chapter cover" data-action="set-chapter-cover" data-chapter-id="${r.chapterId}" data-cover-url="${p(n)}">▣</button>
          <button class="small-button asset-action-button" type="button" title="Copy markdown" data-action="copy-asset-markdown" data-markdown="${p(c)}">⧉</button>
          <button class="small-button asset-action-button danger-icon" type="button" title="Remove image" data-action="delete-asset" data-chapter-id="${r.chapterId}" data-asset-index="${e}">🗑</button>
        </div>
      `:`
        <div class="asset-actions">
          <button class="small-button asset-action-button" type="button" title="Copy markdown" data-action="copy-asset-markdown" data-markdown="${p(c)}">⧉</button>
        </div>
      `}
      ${d}
      <strong title="${p(t.name)}">${p(t.name)}</strong>
      <div class="muted mono asset-markdown" title="${p(c)}">${p(c)}</div>
    </article>
  `}function se(t){ue(`
      <div class="stack">
        <section class="panel">
          <h2>Not found</h2>
          <p class="muted">${p(t)}</p>
        </section>
      </div>
    `,"home")}function vt(t){return`<div class="breadcrumbs">${t.map(([e,r])=>e?`<a href="${e}">${p(r)}</a>`:`<span>${p(r)}</span>`).join("<span>/</span>")}</div>`}async function h(){switch(Oa(),i.loadError="",i.route=Ra(),i.route.name){case"home":return ie(),Lr();case"creator":return ie(),Ur();case"browser":return ie(),qr();case"settings":return ie(),Mr();case"story":return ie(),Rr(i.route.params.storyId);case"arc":return ie(),zr(i.route.params.storyId,i.route.params.arcId);case"chapter":return Yr(i.route.params.storyId,i.route.params.arcId,i.route.params.chapterId);default:return ie(),se("This page does not exist.")}}async function Te(){try{await h()}catch(t){console.error("Render failed:",t),i.loadError=String(t?.message||t||"The page could not be rendered."),Ge.innerHTML=`
      <main class="content">
        <section class="panel stack">
          <h2>Page failed to load</h2>
          <p class="muted">${p(i.loadError)}</p>
          <div class="card-actions">
            <a class="ghost-button" href="#/">Main Menu</a>
            <a class="ghost-button" href="#/creator">Creator</a>
          </div>
        </section>
      </main>
    `}}async function ra(t,e,r={}){const a=document.querySelector(`#${t}`)?.value.trim()??r.coverImageUrl??"",n=document.querySelector(`#${e}`)?.value??r.coverImageMode??"fill";return{coverImageUrl:a?await tt(a):"",coverImageMode:["fit","stretch"].includes(n)?n:"fill"}}async function Gr(t){return{title:document.querySelector("#story-title-input")?.value.trim()??"",tags:(document.querySelector("#story-tags-input")?.value??"").split(",").map(e=>e.trim()).filter(Boolean),visibility:document.querySelector("#story-visibility-input")?.value??"private",...await ra("story-cover-input","story-cover-mode-input",t)}}function Kr(t,e,r){const a=[...t],[n]=a.splice(e,1);return a.splice(r,0,n),a}async function Jr({chapterId:t,currentStoryId:e,currentArcId:r,currentPhaseId:a}){const n=x();if(!n?.id)return i.saveStatus="Sign in first to move chapters between your stories.",h();const s=xe()?await i.adapter.listAllStories():await i.adapter.listCreatorStories(n.id);if(!s.length)return i.saveStatus="You need at least one story before moving chapters.",h();const c=(await Promise.all(s.map(v=>i.adapter.getStory(v.id)))).filter(Boolean).filter(v=>(v.arcs??[]).length>0);if(!c.length)return i.saveStatus="Create an arc first, then you can move chapters into it.",h();const d=document.createElement("div");d.className="modal-backdrop",d.innerHTML=`
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
  `,document.body.append(d);const l=d.querySelector("#transfer-story-select"),u=d.querySelector("#transfer-arc-select"),m=d.querySelector("#transfer-phase-select"),y=d.querySelector("#transfer-summary"),g=d.querySelector("#transfer-confirm"),w=()=>d.remove();function T(){return c.find(v=>v.id===l.value)??c[0]}function N(){return T()?.arcs.find(v=>v.id===u.value)??T()?.arcs?.[0]??null}function D(){return N()?.phases.find(v=>v.id===m.value)??N()?.phases?.[0]??null}function oe(){const v=T(),k=N(),O=D(),pe=v?.id===e&&k?.id===r&&O?.id===a;y.innerHTML=pe?"This chapter is already in that exact phase.":`Destination: <strong>${p(v?.title??"-")}</strong> / <strong>${p(k?.title??"-")}</strong> / <strong>${p(O?.title??"-")}</strong>`,g.disabled=!v||!k||!O||pe}function L(){const v=N();m.innerHTML=(v?.phases??[]).map(k=>`<option value="${k.id}" ${k.id===a&&v.id===r?"selected":""}>${p(k.title)}</option>`).join(""),oe()}function U(){const v=T();u.innerHTML=(v?.arcs??[]).map(k=>`<option value="${k.id}" ${k.id===r&&v.id===e?"selected":""}>${p(k.title)}</option>`).join(""),L()}l.innerHTML=c.map(v=>`<option value="${v.id}" ${v.id===e?"selected":""}>${p(v.title)}</option>`).join(""),l.addEventListener("change",U),u.addEventListener("change",L),m.addEventListener("change",oe),d.querySelector("#transfer-cancel").addEventListener("click",w),g.addEventListener("click",async()=>{const v=D(),k=N();if(!(!v||!k))return await i.adapter.transferChapter(t,k.id,v.id),w(),i.saveStatus="Chapter moved to a new story location.",h()}),U()}async function Et(){if(i.currentUser)return await i.authClient.signOut(),G(null),i.saveStatus="Signed out.",i.authError="",i.authErrorCode="",h();if(i.authClient.mode==="firebase")try{const e=await i.authClient.signIn();return G({id:e.uid,name:e.displayName||e.email||"Creator",email:e.email,mode:"firebase",structureView:"list"}),i.authError="",i.authErrorCode="",i.saveStatus="Signed in with Firebase.",h()}catch(e){return console.error("Firebase sign-in failed:",e),i.saveStatus="",i.authError=na(e),i.authErrorCode=e?.code?String(e.code):"",h()}const t=document.createElement("div");t.className="modal-backdrop",t.innerHTML=`
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
  `,document.body.append(t),t.querySelector("#modal-login-cancel").addEventListener("click",()=>t.remove()),t.querySelector("#modal-login-submit").addEventListener("click",()=>{const e=t.querySelector("#login-name").value.trim()||"Creator",r=t.querySelector("#login-email").value.trim()||"local@storyforge.local";G({id:`local-${e.toLowerCase().replaceAll(/\s+/g,"-")}`,name:e,email:r,mode:"local",structureView:"list"}),t.remove(),i.saveStatus="Signed in with a local demo profile.",i.authError="",i.authErrorCode="",h()})}function na(t){const e=t?.code?String(t.code):"",r=t?.message?String(t.message):"Unknown sign-in error.";return e==="auth/unauthorized-domain"?"This site domain is not authorized in Firebase Auth. Add your local/dev domain and your GitHub Pages domain in Firebase Console > Authentication > Settings > Authorized domains.":e==="auth/popup-closed-by-user"?"The sign-in popup closed before Firebase completed the login. If it closes instantly every time, double-check Authorized domains and the Google sign-in provider setup.":e==="auth/operation-not-allowed"?"Google sign-in is not enabled for this Firebase project. Enable it in Firebase Console > Authentication > Sign-in method.":e==="auth/invalid-api-key"?"Your Firebase API key is invalid. Recheck the values in your `.env` file and restart the dev server.":e==="auth/network-request-failed"?"Firebase could not complete the sign-in request. Check your connection and any browser privacy extensions blocking popups or auth requests.":e==="auth/invalid-credential"||e==="auth/internal-error"?"Google returned an invalid popup credential. This usually means the Firebase Auth Google link for this account needs repair, or the browser Google session is corrupted.":e?`${e}: ${r}`:r}async function Qr(t){const e=i.route.params.chapterId,r=await i.adapter.getChapter(e);if(!r)return;const a=[...r.assets??[]];for(const o of t){const c=await ln(o);a.push({id:crypto.randomUUID(),name:o.name,type:o.type,size:o.size,dataUrl:c})}const n=document.querySelector("#chapter-body-input"),s=a.slice((r.assets??[]).length).map(o=>`
![${o.name}](${o.dataUrl})`).join("");await i.adapter.updateChapter(e,{assets:a,body:`${n.value}${s}`}),i.dragActive=!1,i.saveStatus="Assets added to the chapter. In production these should upload to object storage instead of local state.",await h()}function Zr(t){return t==="imgur.com"||t==="www.imgur.com"||t==="i.imgur.com"}function sa(t){const e=t.replace(/^www\./i,"").toLowerCase();return e==="pixhost.to"||e==="pixhost.cc"||e==="pixho.st"||e.endsWith(".pixho.st")}function Xr(t){return sa(t.hostname)&&/^\/show\/\d+\/\d+_[^/]+$/i.test(t.pathname)}function oa(t){const e=t.pathname.split("/").filter(Boolean).pop()??"";return/\.(avif|gif|jpe?g|png|webp)$/i.test(e)}function ia(t){const r=t.hostname.replace(/^www\./i,"").toLowerCase().match(/^t(\d+)\.pixhost\.(?:to|cc)$/i);if(!r)return"";const a=t.pathname.match(/^\/thumbs\/(\d+)\/(\d+)_(.+)$/i);if(!a)return"";const[,n,s,o]=a;return`${t.protocol}//img${r[1]}.pixhost.to/images/${n}/${s}_${o}${t.search}`}function Oe(t){try{const e=new URL(String(t??""),window.location.href);return ia(e)||e.toString()}catch{return String(t??"")}}function en(t){const e=String(t??"").trim(),r=[/\bsrc=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i,/\[img\]([^\[]+)\[\/img\]/i,/!\[[^\]]*\]\(([^)]+)\)/i];for(const n of r){const s=e.match(n),o=s?.[1]??s?.[2]??s?.[3]??"";if(o)return o.trim()}return(e.match(/https?:\/\/[^\s"'<>[\]()]+/gi)??[]).find(n=>{try{return oa(new URL(n))}catch{return!1}})??e}function tn(t,e){const r=["img.image-img","img#image",".image-img",".image-show img","#show_image img",'meta[property="og:image"]','meta[name="twitter:image"]','img[src*="pixhost"]','img[src*="pixho.st"]'];for(const a of r){const n=t.querySelector(a),s=n?.getAttribute("src")??n?.getAttribute("content");if(!(!s||s.startsWith("data:")))try{const o=new URL(s,e);if(oa(o)||sa(o.hostname))return o.toString()}catch{}}return""}async function an(t){let e;try{e=await fetch(t.toString(),{credentials:"include"})}catch{throw new Error("Pixhost page could not be opened by the browser. Paste Pixhost's Forum small image, HTML small image, or direct image link instead.")}if(!e.ok)throw new Error("Pixhost page could not be opened. Paste Pixhost's Forum small image, HTML small image, or direct image link instead.");const r=await e.text(),a=new DOMParser().parseFromString(r,"text/html"),n=tn(a,t.toString());if(!n)throw new Error("Pixhost page could not be converted to a direct image. Paste Pixhost's Forum small image, HTML small image, or direct image link instead.");return n}async function tt(t){const e=en(t);if(!e)throw new Error("Add an image URL first.");let r;try{r=new URL(e)}catch{throw new Error("That image URL is not valid.")}if(!["http:","https:"].includes(r.protocol))throw new Error("Use an http or https image URL.");const a=r.pathname.split("/").filter(Boolean).pop()??"",n=/\.[a-z0-9]{2,5}$/i.test(a);Zr(r.hostname)&&a&&!n&&(r.pathname=`${r.pathname}.png`);const s=ia(r);return s||(Xr(r)?an(r):r.toString())}async function rn(t){const e=await i.adapter.getChapter(t);if(!e)throw new Error("Chapter not found.");const r=document.querySelector("#asset-name-input"),a=document.querySelector("#asset-url-input"),n=document.querySelector("#chapter-title-input"),s=document.querySelector("#chapter-body-input"),o=r?.value.trim()||"image",c=await tt(a?.value??""),d={id:crypto.randomUUID(),name:o,type:"image/external",url:c},l=[...e.assets??[],d];await i.adapter.updateChapter(t,{title:n?.value.trim()||e.title||"Untitled Chapter",body:s?.value??e.body??"",assets:l}),r&&(r.value=""),a&&(a.value=""),i.saveStatus="External image link added to the chapter assets.",await h()}function nn(t,e,r,a){return`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${p(a.title||"Untitled Chapter")}</title>
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
    <div class="meta">${p(t.title)} / ${p(e.title)} / ${p(r.title)} ${de(a)?"":'<span class="draft">Draft</span>'}</div>
    <h1>${p(a.title||"Untitled Chapter")}</h1>
    ${Ke(a,"")}
  </main>
</body>
</html>`}async function sn(t){const e=await i.adapter.getStory(t);if(!e)throw new Error("Story not found.");const{default:r}=await Pt(async()=>{const{default:o}=await import("./jszip.min-D7KnG0-e.js").then(c=>c.j);return{default:o}},[]),a=new r,n=a.folder(Ie(e.title,"Story"));e.arcs.forEach((o,c)=>{const d=n.folder(`${String(c+1).padStart(2,"0")} - ${Ie(o.title,"Arc")}`);(o.phases??[]).forEach((l,u)=>{const m=d.folder(`${String(u+1).padStart(2,"0")} - ${Ie(l.title,"Phase")}`);(l.chapters??[]).forEach((y,g)=>{const w=`${String(g+1).padStart(2,"0")} - ${Ie(y.title,"Chapter")}.html`;m.file(w,nn(e,o,l,y))})})});const s=await a.generateAsync({type:"blob"});kr(s,`${Ie(e.title,"story-export")}.zip`)}async function _e(t){if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(t);return}const e=document.createElement("textarea");e.value=t,e.setAttribute("readonly",""),e.style.position="fixed",e.style.opacity="0",document.body.append(e),e.select(),document.execCommand("copy"),e.remove()}async function on(t,e){const r=await i.adapter.getChapter(t);if(!r)throw new Error("Chapter not found.");const a=[...r.assets??[]];if(e<0||e>=a.length)throw new Error("Image could not be found.");a.splice(e,1);const n=document.querySelector("#chapter-title-input"),s=document.querySelector("#chapter-body-input");await i.adapter.updateChapter(t,{title:n?.value.trim()||r.title||"Untitled Chapter",body:s?.value??r.body??"",assets:a}),i.saveStatus="Image removed from chapter assets.",await h()}function cn(t,e,r){const a=`<img src="${p(r)}" alt="word-image-${e}" />`,n=String(t??""),s=new RegExp(`<div\\b(?=[^>]*data-word-image-placeholder=["']${e}["'])[^>]*>[\\s\\S]*?<\\/div>`,"i");if(s.test(n))return n.replace(s,a);const o=new RegExp(`<[^>]+>[^<]*\\[IMAGE\\s+${e}\\s+HERE\\][\\s\\S]*?<\\/[^>]+>`,"i");return o.test(n)?n.replace(o,a):n.replace(new RegExp(`\\[IMAGE\\s+${e}\\s+HERE\\]`,"i"),a)}async function dn(t,e){const r=await i.adapter.getChapter(t);if(!r)throw new Error("Chapter not found.");const a=document.querySelector(`[data-word-image-url="${e}"]`),n=await tt(a?.value??""),s=cn(r.body??"",e,n);await i.adapter.updateChapter(t,{body:s,renderMode:"html",htmlBackground:et().htmlBackground}),i.saveStatus=`IMAGE ${e} replaced.`,await h()}async function Tt(){const t=x();if(!t?.id)return;const e=await i.adapter.getUserProfile?.(t.id);e&&G({...t,name:e.name||t.name,email:e.email||t.email,penName:e.penName??"",structureView:e.structureView??t.structureView??"list",readerSettings:e.readerSettings??t.readerSettings??we(t)})}function ke(t){return window.confirm(`Are you sure you want to delete this ${t}? This cannot be undone.`)}function ln(t){return new Promise((e,r)=>{const a=new FileReader;a.onload=()=>e(String(a.result)),a.onerror=()=>r(a.error),a.readAsDataURL(t)})}document.addEventListener("click",async t=>{const e=t.target.closest("[data-action]");if(!e)return;const r=e.dataset.action;if(r==="toggle-image-view"){const a=e.closest(".chapter-image-frame");if(!a)return;const n=a.dataset.imageView==="desired"?"fill":"desired";Zt(a,n);return}if(r==="sign-in-redirect")return i.saveStatus="Opening full-page Google sign-in...",i.authError="",i.authErrorCode="",await i.authClient.signInWithRedirect?.(),h();if(r==="play-music-cue"){const a=e.dataset.musicTrigger;a&&lt(a,{source:"button",cueIndex:Number(e.dataset.musicCueIndex??-1)});return}if(r==="stop-music-cue"){const a=String(e.dataset.musicEnd??"").trim().toLowerCase();["soundtrack","ambience"].includes(a)&&Ft(a,Number(e.dataset.musicCueIndex??-1));return}if(r==="toggle-login")return Et();if(r==="open-settings")return R("/settings");if(r==="apply-story-filters"){const a=document.querySelector("#story-search").value.trim(),n=document.querySelector("#story-tag-filter").value;return R(`/creator${a||n?`?${new URLSearchParams({q:a,tag:n}).toString()}`:""}`)}if(r==="apply-browser-filters"){const a=document.querySelector("#browser-creator-filter").value,n=document.querySelector("#browser-group-mode").value;return R(`/browser?${new URLSearchParams({creator:a,group:n}).toString()}`)}if(r==="create-story"){const a=x();if(!a)return i.saveStatus="Sign in first to create stories in Firebase mode.",Et();const n=await i.adapter.createStory({creatorId:a.id,creatorName:He(a),title:"Untitled Story",tags:["draft"],visibility:"private"});return R(`/stories/${n.id}`)}if(r==="save-story-settings"){const a=e.dataset.storyId,n=await i.adapter.getStory(a),s=await Gr(n);return await i.adapter.updateStory(a,s),i.saveStatus="Story details saved.",h()}if(r==="add-story-editor"){const a=window.prompt("Editor Gmail address");if(a===null)return;if(!a.trim())return i.saveStatus="Enter an editor email first.",h();const n=be(x()?.email),s=be(a);return n&&n===s?(i.saveStatus="You are already the author of this story.",h()):(await i.adapter.addStoryEditor(e.dataset.storyId,a),i.saveStatus=`Editor added: ${s}`,h())}if(r==="remove-story-editor"){const a=e.dataset.editorEmail??"";return a?(await i.adapter.removeStoryEditor(e.dataset.storyId,a),i.saveStatus=`Editor removed: ${be(a)}`,h()):(i.saveStatus="Editor email could not be found.",h())}if(r==="export-story"){try{i.saveStatus="Preparing story export...";const a=document.querySelector(".notice .muted");a&&(a.textContent=i.saveStatus),await sn(e.dataset.storyId),i.saveStatus="Story export downloaded."}catch(a){i.saveStatus=`Export failed: ${String(a.message||a)}`}return h()}if(r==="open-story-transfer"){const a=re();return a.set("transfer","1"),R(`/stories/${e.dataset.storyId}?${a.toString()}`)}if(r==="close-story-transfer"){const a=re();a.delete("transfer");const n=a.toString();return R(`/stories/${e.dataset.storyId}${n?`?${n}`:""}`)}if(r==="submit-story-transfer"){const a=x();if(!a?.email)return i.saveStatus="Sign in with an email address before transferring ownership.",h();const n=document.querySelector("#story-transfer-email-input")?.value.trim()??"",s=document.querySelector("#story-transfer-confirm-input")?.value.trim()??"";if(!n)return i.saveStatus="Enter the recipient Gmail address first.",h();if(n.toLowerCase()===String(a.email).trim().toLowerCase())return i.saveStatus="You cannot transfer a story to your own email.",h();if(s!=="TRANSFER")return i.saveStatus="Type TRANSFER exactly to confirm ownership transfer.",h();await i.adapter.requestStoryTransfer(e.dataset.storyId,n,{id:a.id,name:He(a),email:a.email}),i.saveStatus="Ownership transfer request sent. The story stays with you until the recipient accepts.";const o=re();o.delete("transfer");const c=o.toString();return R(`/stories/${e.dataset.storyId}${c?`?${c}`:""}`)}if(r==="cancel-story-transfer")return await i.adapter.cancelStoryTransfer(e.dataset.storyId),i.saveStatus="Ownership transfer cancelled.",h();if(r==="accept-story-transfer"){const a=x();try{return await i.adapter.acceptStoryTransfer(e.dataset.storyId,{id:a.id,name:a.name,email:a.email,penName:a.penName??""}),i.saveStatus="Story ownership transferred to you.",R("/creator")}catch(n){return i.saveStatus=`Transfer accept failed: ${String(n?.message||n)}`,h()}}if(r==="decline-story-transfer"){const a=x();try{return await i.adapter.declineStoryTransfer(e.dataset.storyId,a.email),i.saveStatus="Ownership transfer declined.",h()}catch(n){return i.saveStatus=`Transfer decline failed: ${String(n?.message||n)}`,h()}}if(r==="create-arc"){const a=e.dataset.storyId,n=await i.adapter.createArc(a,`Arc ${Math.floor(Math.random()*90+10)}`);return R(`/stories/${a}/arcs/${n.id}`)}if(r==="save-arc-title"){const a=await i.adapter.getArc(e.dataset.arcId);return await i.adapter.updateArc(e.dataset.arcId,{title:document.querySelector("#arc-title-input").value.trim()||"Untitled Arc",...await ra("arc-cover-input","arc-cover-mode-input",a)}),i.saveStatus="Arc details saved.",h()}if(r==="edit-character"){const a=document.querySelector("#character-record-id-input"),n=document.querySelector("#character-display-name-input"),s=document.querySelector("#character-dialog-id-input"),o=document.querySelector("#character-main-color-input"),c=document.querySelector("#character-secondary-color-input"),d=document.querySelector("#save-character-button"),l=document.querySelector("#cancel-character-edit-button");if(!a||!n||!s||!o||!c)return;a.value=e.dataset.characterRecordId??"",n.value=e.dataset.characterDisplayName??"",s.value=e.dataset.characterDialogId??"",o.value=Y(e.dataset.characterMainColor,"#8f5f35"),c.value=Y(e.dataset.characterSecondaryColor,"#d7b56d"),d&&(d.textContent="Save character"),l&&(l.hidden=!1),n.focus(),document.querySelector(".character-panel")?.scrollIntoView({behavior:"smooth",block:"center"});return}if(r==="cancel-character-edit"){const a=document.querySelector("#character-record-id-input"),n=document.querySelector("#character-display-name-input"),s=document.querySelector("#character-dialog-id-input"),o=document.querySelector("#character-main-color-input"),c=document.querySelector("#character-secondary-color-input"),d=document.querySelector("#save-character-button");a&&(a.value=""),n&&(n.value=""),s&&(s.value=""),o&&(o.value="#8f5f35"),c&&(c.value="#d7b56d"),d&&(d.textContent="Add character"),e.hidden=!0;return}if(r==="add-character"){const a=await i.adapter.getChapter(e.dataset.chapterId),n=document.querySelector("#character-record-id-input")?.value??"",s=document.querySelector("#character-display-name-input")?.value.trim()??"",o=document.querySelector("#character-dialog-id-input")?.value.trim()??"";if(!s||!o)return i.saveStatus="Enter both a display name and a dialogue ID.",h();if(!/^[a-z0-9_-]+$/i.test(o))return i.saveStatus="Dialogue IDs can only contain letters, numbers, hyphens, and underscores.",h();const c=Y(document.querySelector("#character-main-color-input")?.value,"#8f5f35"),d=Y(document.querySelector("#character-secondary-color-input")?.value,"#d7b56d"),l=Ae(o);if((a.characters??[]).find(w=>w.id!==n&&Ae(w.dialogId??w.name)===l))return i.saveStatus=`The dialogue ID ${o} is already used by another character.`,h();const m=n?(a.characters??[]).find(w=>w.id===n):null;if(n&&!m)return i.saveStatus="That character is no longer available. Reload and try again.",h();const y=m?.dialogId??m?.name??"";if(m&&Ae(y)!==l){const w=document.querySelector("#chapter-body-input");w instanceof HTMLTextAreaElement&&(w.value=w.value.replace(new RegExp(`(\\[dialog:\\s*)${nr(y)}(?=\\s*(?::|\\]))`,"gi"),`$1${o}`),w.dispatchEvent(new Event("input",{bubbles:!0})))}const g=m?(a.characters??[]).map(w=>w.id===m.id?{...w,dialogId:o,displayName:s,mainColor:c,secondaryColor:d}:w):[...a.characters??[],{id:ye("character"),dialogId:o,displayName:s,mainColor:c,secondaryColor:d}];return i.editorCharacters=g,await i.adapter.updateChapter(a.id,await me(a,{characters:g})),i.saveStatus=m?`${s}'s character settings and dialogue references were updated.`:`${s} was added with the dialogue ID ${o}.`,h()}if(r==="insert-dialog-marker"){const a=document.querySelector("#chapter-body-input");if(!(a instanceof HTMLTextAreaElement)||a.disabled)return i.saveStatus="Dialogue markers can only be inserted in Markdown Mode.",h();const n=e.dataset.characterId??"character";Sr(a,`[dialog: ${n}] `),i.saveStatus=`Inserted a dialogue block for ${n}.`;const s=document.querySelector(".notice.mono");s&&(s.textContent=i.saveStatus);return}if(r==="copy-dialog-marker"){const a=e.dataset.characterId??"character",n=`[dialog: ${a}] `;try{await _e(n),i.saveStatus=`Copied dialogue marker for ${a}.`}catch{i.saveStatus=`Copy failed. Use this marker manually: ${n}`}const s=document.querySelector(".notice.mono");s&&(s.textContent=i.saveStatus);return}if(r==="delete-character"){if(!ke("character"))return;const a=await i.adapter.getChapter(e.dataset.chapterId),n=(a.characters??[]).filter(s=>s.id!==e.dataset.characterId);return i.editorCharacters=n,await i.adapter.updateChapter(a.id,await me(a,{characters:n})),i.saveStatus="Character removed. Existing dialogue text was kept and will use neutral colors.",h()}if(r==="add-soundtrack"){const a=await i.adapter.getChapter(e.dataset.chapterId),n=document.querySelector("#soundtrack-label-input")?.value.trim()??"",s=document.querySelector("#soundtrack-url-input")?.value.trim()??"",o=K(document.querySelector("#soundtrack-track-type-input")?.value),c=Ot({id:ye("soundtrack"),label:n,url:s,trackType:o,volumeMultiplier:100});if(!c)return i.saveStatus="Please enter a valid YouTube link.",h();const d=[...a.soundtracks??[],{id:c.id,label:c.label,url:c.url,trackType:c.trackType,volumeMultiplier:c.volumeMultiplier}];return await i.adapter.updateChapter(a.id,await me(a,{soundtracks:d})),i.saveStatus="Soundtrack added.",h()}if(r==="copy-soundtrack-marker"){const a=`[music: ${e.dataset.soundtrackId}]`;try{await _e(a),i.saveStatus=`Copied music cue: ${a}`}catch{i.saveStatus=`Copy failed. Use this cue manually: ${a}`}const n=document.querySelector(".notice.mono");n&&(n.textContent=i.saveStatus);return}if(r==="preview-soundtrack"){const a=e.dataset.soundtrackId,n=Object.values(i.soundtrack.queues).flat().find(o=>o.id===a);if(!n)return i.saveStatus="This audio track is not available for preview.",h();const s=I(n.trackType);if(s.activeKey===n.id&&!s.paused){dt(n.trackType),E(n.trackType,`Preview stopped: ${n.label}`);return}lt(n.id,{source:"button"}),E(n.trackType,`Previewing: ${n.label}`);return}if(r==="delete-soundtrack"){const a=await i.adapter.getChapter(e.dataset.chapterId);return await i.adapter.updateChapter(a.id,await me(a,{soundtracks:(a.soundtracks??[]).filter(n=>n.id!==e.dataset.soundtrackId)})),i.saveStatus="Soundtrack removed.",h()}if(r==="add-video"){const a=await i.adapter.getChapter(e.dataset.chapterId),n=document.querySelector("#video-label-input")?.value.trim()??"",s=document.querySelector("#video-url-input")?.value.trim()??"",o=Rt({id:ye("video"),label:n,url:s});if(!o)return i.saveStatus="Please enter a valid YouTube video link.",h();const c=et();return await i.adapter.updateChapter(a.id,{title:document.querySelector("#chapter-title-input")?.value.trim()||a.title||"Untitled Chapter",body:c.body,published:document.querySelector("#chapter-published-input")?.checked??de(a),dmNotes:document.querySelector("#chapter-dm-notes-input")?.value??a.dmNotes??"",renderMode:c.renderMode,htmlBackground:c.htmlBackground,videos:[...a.videos??[],{id:o.id,label:o.label,url:o.url}]}),i.saveStatus="Video added. Copy its embed marker into the chapter.",h()}if(r==="copy-video-marker"){const a=`[video: ${e.dataset.videoId}]`;try{await _e(a),i.saveStatus=`Copied video embed: ${a}`}catch{i.saveStatus=`Copy failed. Use this marker manually: ${a}`}const n=document.querySelector(".notice.mono");n&&(n.textContent=i.saveStatus);return}if(r==="delete-video"){const a=await i.adapter.getChapter(e.dataset.chapterId);return await i.adapter.updateChapter(a.id,{videos:(a.videos??[]).filter(n=>n.id!==e.dataset.videoId)}),i.saveStatus="Video removed.",h()}if(r==="move-arc-up"||r==="move-arc-down"){const a=await i.adapter.getStory(e.dataset.storyId),n=Number(e.dataset.index),s=r==="move-arc-up"?-1:1;return await i.adapter.reorderArcs(a.id,Kr(a.arcIds,n,n+s)),h()}if(r==="create-chapter"){const a=await i.adapter.createChapter(e.dataset.arcId,"Untitled Chapter");return R(`/stories/${e.dataset.storyId}/arcs/${e.dataset.arcId}/chapters/${a.id}`)}if(r==="create-phase"){const a=window.prompt("Phase title","New Phase");return a===null?void 0:(await i.adapter.createPhase(e.dataset.arcId,a),i.saveStatus="Phase created.",h())}if(r==="rename-phase"){const a=window.prompt("Rename phase",e.dataset.phaseTitle||"Phase");if(a===null)return;const n=await i.adapter.getArc(e.dataset.arcId);return await i.adapter.renamePhase(e.dataset.arcId,e.dataset.phaseId,a),a.trim()?i.saveStatus="Phase renamed.":i.saveStatus=(n?.phases?.length??0)<=1?"Only phase restored to Chapters.":"Phase deleted. Its chapters were moved into the next phase.",h()}if(r==="open-transfer-chapter")return Jr({chapterId:e.dataset.chapterId,currentStoryId:e.dataset.storyId,currentArcId:e.dataset.arcId,currentPhaseId:e.dataset.phaseId});if(r==="move-chapter-up"||r==="move-chapter-down")return await i.adapter.moveChapter(e.dataset.arcId,e.dataset.chapterId,r==="move-chapter-up"?"up":"down"),h();if(r==="save-chapter"){const a=e.dataset.chapterId,n=await i.adapter.getChapter(a),s=await me(n);if(await i.adapter.updateChapter(a,s),i.saveStatus="Chapter saved.",s.published)try{const o=await Ua({storyId:i.route.params.storyId,arcId:i.route.params.arcId,chapterId:a});o.skipped?i.saveStatus=`Chapter saved. ${o.reason}`:i.saveStatus=o.type==="published"?"Chapter saved and its first publication was announced on Discord.":"Chapter saved and its update was announced on Discord."}catch(o){i.saveStatus=`Chapter saved, but Discord announcement failed: ${String(o.message||o)}`}return h()}if(r==="set-chapter-cover"||r==="clear-chapter-cover"){const a=e.dataset.chapterId,n=await i.adapter.getChapter(a),s=r==="set-chapter-cover"?e.dataset.coverUrl:"";return await i.adapter.updateChapter(a,await me(n,{coverImageUrl:s})),i.saveStatus=s?"Chapter cover updated.":"Chapter cover cleared.",h()}if(r==="open-docx-import"){document.querySelector("#docx-import-input")?.click();return}if(r==="switch-markdown-mode")return window.confirm("Switch to Markdown Mode? This will clear the imported Word HTML from this chapter.")?(await i.adapter.updateChapter(i.route.params.chapterId,{body:"",renderMode:"markdown",htmlBackground:""}),i.saveStatus="Switched to Markdown Mode. Imported Word HTML was cleared.",h()):void 0;if(r==="clear-html-background"){const a=document.querySelector("#chapter-html-background-input");a&&(a.value="#120f0d");const n=document.querySelector("#chapter-render-mode-input");n&&(n.value="html"),ut(),i.saveStatus="HTML background reset to the site background. Click Save to keep this.";const s=document.querySelector(".notice.mono");s&&(s.textContent=i.saveStatus);return}if(r==="save-pen-name"){const a=x(),n=document.querySelector("#pen-name-input").value.trim(),s=await i.adapter.updateUserProfile(a.id,{name:a.name,email:a.email,penName:n,structureView:a.structureView??"list",readerSettings:a.readerSettings??we(a)});return G({...a,penName:s.penName??"",name:s.name??a.name,email:s.email??a.email,structureView:s.structureView??a.structureView??"list",readerSettings:s.readerSettings??a.readerSettings??we(a)}),i.saveStatus=n?"Pen name saved.":"Pen name cleared. Account name will be used.",h()}if(r==="save-reader-settings"){const a=x(),n={fontSize:Number(document.querySelector("#reader-font-size-input")?.value)||17,lineHeight:Number(document.querySelector("#reader-line-height-input")?.value)||1.85,width:Number(document.querySelector("#reader-width-input")?.value)||920},s=await i.adapter.updateUserProfile(a.id,{name:a.name,email:a.email,penName:a.penName??"",structureView:a.structureView??"list",readerSettings:n});return G({...a,...s,readerSettings:n}),i.saveStatus="Reader settings saved.",h()}if(r==="add-comment"){const a=x(),s=document.querySelector("#chapter-comment-input")?.value.trim()??"";if(!a||!s)return i.saveStatus="Sign in and write a comment first.",h();const o=await i.adapter.getChapter(e.dataset.chapterId);try{i.authClient?.mode==="firebase"?await st("add-comment",{chapterId:o.id,commentBody:s}):await(i.adapter.updateChapterEngagement??i.adapter.updateChapter)(o.id,{comments:[...o.comments??[],{id:ye("comment"),userId:a.id,userName:He(a),body:s,createdAt:new Date().toISOString()}]})}catch(c){return i.saveStatus=`Comment failed: ${String(c.message||c)}`,h()}return i.saveStatus="Comment added.",h()}if(r==="toggle-reaction"){const a=x();if(!a)return i.saveStatus="Sign in to react.",h();const n=await i.adapter.getChapter(e.dataset.chapterId),s=e.dataset.emoji;try{if(i.authClient?.mode==="firebase")await st("toggle-reaction",{chapterId:n.id,emoji:s});else{const o={...n.reactions??{}},c=new Set(o[s]??[]);c.has(a.id)?c.delete(a.id):c.add(a.id),o[s]=[...c],await(i.adapter.updateChapterEngagement??i.adapter.updateChapter)(n.id,{reactions:o})}}catch(o){return i.saveStatus=`Reaction failed: ${String(o.message||o)}`,h()}return i.saveStatus="Reaction updated.",h()}if(r==="delete-comment"){const a=x();if(!a)return i.saveStatus="Sign in to delete a comment.",h();const[n,s]=await Promise.all([i.adapter.getChapter(e.dataset.chapterId),i.adapter.getStory(i.route.params.storyId)]),o=[...n.comments??[]],c=e.dataset.commentId,d=Number(e.dataset.commentIndex),l=c?o.findIndex(m=>m.id===c):d,u=o[l];if(!u)return i.saveStatus="Comment not found.",h();if(u.userId!==a.id&&!Ue(s))return i.saveStatus="Only the commenter or a story editor can delete this comment.",h();try{i.authClient?.mode==="firebase"?await st("delete-comment",{chapterId:n.id,commentId:c,commentIndex:l}):(o.splice(l,1),await(i.adapter.updateChapterEngagement??i.adapter.updateChapter)(n.id,{comments:o}))}catch(m){return i.saveStatus=`Comment deletion failed: ${String(m.message||m)}`,h()}return i.saveStatus="Comment deleted.",h()}if(r==="delete-story")return ke("story")?(await i.adapter.deleteStory(e.dataset.storyId),i.saveStatus="Story deleted.",R("/creator")):void 0;if(r==="delete-arc")return ke("arc")?(await i.adapter.deleteArc(e.dataset.arcId),i.saveStatus="Arc deleted.",R(`/stories/${e.dataset.storyId}`)):void 0;if(r==="delete-chapter")return ke("chapter")?(await i.adapter.deleteChapter(e.dataset.chapterId),i.saveStatus="Chapter deleted.",R(`/stories/${e.dataset.storyId}/arcs/${e.dataset.arcId}`)):void 0;if(r==="add-external-asset")try{return await rn(e.dataset.chapterId)}catch(a){return i.saveStatus=String(a.message||a),h()}if(r==="copy-asset-markdown"){try{await _e(e.dataset.markdown??""),i.saveStatus="Image markdown copied to clipboard."}catch(n){i.saveStatus=`Copy failed: ${String(n.message||n)}`}const a=document.querySelector(".notice.mono");a&&(a.textContent=i.saveStatus);return}if(r==="delete-asset"){if(!ke("image"))return;try{return await on(e.dataset.chapterId,Number(e.dataset.assetIndex))}catch(a){return i.saveStatus=String(a.message||a),h()}}if(r==="replace-word-image")try{return await dn(e.dataset.chapterId,Number(e.dataset.imageIndex))}catch(a){i.saveStatus=String(a.message||a);const n=document.querySelector(".notice.mono");n&&(n.textContent=i.saveStatus);return}if(r==="toggle-audio-channel"){const a=K(e.dataset.audioChannel);if(!q(a))return;I(a).paused?jt(a):dt(a);return}if(r==="toggle-audio-volume"){const a=e.dataset.audioVolume;i.soundtrack.volumeOpen=i.soundtrack.volumeOpen===a?"":a,le();return}});document.addEventListener("change",async t=>{const e=t.target;if((e instanceof HTMLInputElement||e instanceof HTMLSelectElement)&&e.dataset.action==="update-soundtrack-setting"){const r=await i.adapter.getChapter(e.dataset.chapterId),a=(r.soundtracks??[]).map(n=>n.id!==e.dataset.soundtrackId?n:e.dataset.setting==="trackType"?{...n,trackType:K(e.value)}:{...n,volumeMultiplier:qe(e.value)});return await i.adapter.updateChapter(r.id,await me(r,{soundtracks:a})),i.saveStatus="Audio track settings saved.",h()}if(e instanceof HTMLInputElement&&e.id==="docx-import-input"){const r=e.files?.[0];if(e.value="",!r)return;i.saveStatus="Importing Word file...";const a=document.querySelector(".notice.mono");a&&(a.textContent=i.saveStatus);try{await $r(r)}catch(n){i.saveStatus=`Word import failed: ${String(n.message||n)}`,a&&(a.textContent=i.saveStatus)}return}});document.addEventListener("input",t=>{if(t.target instanceof HTMLInputElement&&(t.target.id==="reader-font-size-input"||t.target.id==="reader-line-height-input"||t.target.id==="reader-width-input")){const e=document.querySelector("#reader-settings-preview");if(e){const r=Number(document.querySelector("#reader-font-size-input")?.value)||17,a=Number(document.querySelector("#reader-line-height-input")?.value)||1.85,n=Number(document.querySelector("#reader-width-input")?.value)||920;e.style.setProperty("--reader-font-size",`${r}px`),e.style.setProperty("--reader-line-height",String(a)),e.style.setProperty("--reader-width",`${n}px`)}return}if(t.target instanceof HTMLInputElement&&t.target.dataset.action==="set-audio-volume"){Ht(t.target.dataset.audioVolume,t.target.value);return}if(t.target instanceof HTMLInputElement&&t.target.dataset.action==="update-soundtrack-setting"){const e=document.querySelector(`[data-track-volume-output='${t.target.dataset.soundtrackId}']`);e&&(e.textContent=`${qe(t.target.value)}%`);return}if(t.target instanceof HTMLInputElement&&t.target.dataset.action==="set-html-background"){ut();return}if(t.target.id==="chapter-body-input"&&ut(),t.target.id==="chapter-title-input"){const e=t.target.value.trim()||"Untitled chapter",r=document.querySelector(".page-title h2");r&&(r.textContent=e)}});document.addEventListener("click",t=>{const e=t.target;e instanceof Element&&(e.closest(".quick-tool-stack")||i.soundtrack.volumeOpen&&(i.soundtrack.volumeOpen="",le()))});document.addEventListener("wheel",t=>{const e=t.target;if(!(e instanceof Element)||!e.closest("[data-wheel-volume='true']"))return;t.preventDefault();const r=e.closest("[data-wheel-volume='true']");Ga(r.dataset.audioVolume,t.deltaY<0?5:-5)},{passive:!1});document.addEventListener("dragover",t=>{if(i.route.name!=="chapter")return;t.preventDefault(),i.dragActive=!0;const e=document.querySelector("[data-dropzone='assets']");e&&e.classList.add("is-active")});document.addEventListener("dragleave",t=>{if(i.route.name!=="chapter"||t.relatedTarget)return;i.dragActive=!1;const e=document.querySelector("[data-dropzone='assets']");e&&e.classList.remove("is-active")});document.addEventListener("drop",async t=>{if(i.route.name!=="chapter")return;t.preventDefault();const e=document.querySelector("[data-dropzone='assets']");e&&e.classList.remove("is-active");const r=[...t.dataTransfer.files].filter(a=>a.type.startsWith("image/"));r.length&&await Qr(r)});window.addEventListener("hashchange",()=>{i.saveStatus="",window.scrollTo({top:0,left:0,behavior:"auto"}),Te()});async function un(){const t=Pa();if(i.authClient=t,i.adapter=await Ca(t),i.authClient.mode==="firebase"){try{const e=await i.authClient.getRedirectUser?.();e&&(G({id:e.uid,name:e.displayName||e.email||"Creator",email:e.email,mode:"firebase"}),i.authError="",i.authErrorCode="",i.saveStatus="Signed in with Firebase.")}catch(e){console.error("Firebase redirect sign-in failed:",e),i.authError=na(e),i.authErrorCode=e?.code?String(e.code):""}i.authClient.watchAuth(e=>{e?(G({id:e.uid,name:e.displayName||e.email||"Creator",email:e.email,mode:"firebase"}),Tt().finally(()=>Te())):(G(null),Te())})}else i.currentUser?.id&&await Tt();window.location.hash?Te():R("/")}un().catch(t=>{Ge.innerHTML=`
    <main class="content">
      <section class="panel">
        <h2>App failed to start</h2>
        <p class="muted">${p(String(t.message||t))}</p>
        <p class="muted">Current mode: ${p(Je().mode)}</p>
      </section>
    </main>
  `});
