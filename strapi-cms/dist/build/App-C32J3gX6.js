import{r as d,j as t,ar as _,h7 as gt,h8 as ze,h9 as pt,f$ as ee,ha as mn,f6 as xn,hb as bn,hc as vn,hd as yn,he as jn,hf as wn,hg as Ne,a as T,hh as u,w as Se,fH as Cn,hi as ie,ch as Mn,eS as Dn,hj as ft,A as I,v as C,hk as In,hl as Sn,d as Q,hm as Ve,R as V,E as H,h as v,S as P,hn as Rn,k as ce,u as ht,ho as oe,bU as he,dq as mt,hp as $n,hq as Tn,hr as An,D as En,hs as Fn,ht as Oe,cz as He,N as xt,b2 as bt,bC as vt,b0 as kn,b1 as et,bk as z,bS as Pn,J as yt,cY as Ln,hu as Nn,dS as On,gd as ue,I as be,dY as Re,dz as _n,fN as jt,dw as Bn,dx as Gn,c as We,e$ as Un,f1 as zn,f3 as Vn,e_ as Hn,f0 as Wn,f2 as qn,cx as W,K as Kn,hv as Qn,fR as wt,bN as Yn,hw as Zn,hx as Xn,hy as Jn,hz as es,L as Ae,gr as ts,gs as ns,e1 as ss,hA as Ee,aL as rs,hB as os,P as tt,U as as,W as is}from"./strapi-BHf4CRrB.js";import{g as ls}from"./users-DLc-PG84.js";import{l as ds,m as cs,D as us,p as gs,k as ps,P as fs,u as hs,f as Ct,e as ms}from"./core.esm-Cu1qDgry.js";function qe(e,n=[]){let s=[];function r(a,i){const l=d.createContext(i),g=s.length;s=[...s,i];const f=p=>{const{scope:j,children:m,...h}=p,x=j?.[e]?.[g]||l,b=d.useMemo(()=>h,Object.values(h));return t.jsx(x.Provider,{value:b,children:m})};f.displayName=a+"Provider";function c(p,j){const m=j?.[e]?.[g]||l,h=d.useContext(m);if(h)return h;if(i!==void 0)return i;throw new Error(`\`${p}\` must be used within \`${a}\``)}return[f,c]}const o=()=>{const a=s.map(i=>d.createContext(i));return function(l){const g=l?.[e]||a;return d.useMemo(()=>({[`__scope${e}`]:{...l,[e]:g}}),[l,g])}};return o.scopeName=e,[r,xs(o,...n)]}function xs(...e){const n=e[0];if(e.length===1)return n;const s=()=>{const r=e.map(o=>({useScope:o(),scopeName:o.scopeName}));return function(a){const i=r.reduce((l,{useScope:g,scopeName:f})=>{const p=g(a)[`__scope${f}`];return{...l,...p}},{});return d.useMemo(()=>({[`__scope${n.scopeName}`]:i}),[i])}};return s.scopeName=n.scopeName,s}function nt(e,n){if(typeof e=="function")return e(n);e!=null&&(e.current=n)}function Mt(...e){return n=>{let s=!1;const r=e.map(o=>{const a=nt(o,n);return!s&&typeof a=="function"&&(s=!0),a});if(s)return()=>{for(let o=0;o<r.length;o++){const a=r[o];typeof a=="function"?a():nt(e[o],null)}}}}function _e(...e){return d.useCallback(Mt(...e),e)}function Be(e){const n=bs(e),s=d.forwardRef((r,o)=>{const{children:a,...i}=r,l=d.Children.toArray(a),g=l.find(ys);if(g){const f=g.props.children,c=l.map(p=>p===g?d.Children.count(f)>1?d.Children.only(null):d.isValidElement(f)?f.props.children:null:p);return t.jsx(n,{...i,ref:o,children:d.isValidElement(f)?d.cloneElement(f,void 0,c):null})}return t.jsx(n,{...i,ref:o,children:a})});return s.displayName=`${e}.Slot`,s}function bs(e){const n=d.forwardRef((s,r)=>{const{children:o,...a}=s;if(d.isValidElement(o)){const i=ws(o),l=js(a,o.props);return o.type!==d.Fragment&&(l.ref=r?Mt(r,i):i),d.cloneElement(o,l)}return d.Children.count(o)>1?d.Children.only(null):null});return n.displayName=`${e}.SlotClone`,n}var vs=Symbol("radix.slottable");function ys(e){return d.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===vs}function js(e,n){const s={...n};for(const r in n){const o=e[r],a=n[r];/^on[A-Z]/.test(r)?o&&a?s[r]=(...l)=>{const g=a(...l);return o(...l),g}:o&&(s[r]=o):r==="style"?s[r]={...o,...a}:r==="className"&&(s[r]=[o,a].filter(Boolean).join(" "))}return{...e,...s}}function ws(e){let n=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,s=n&&"isReactWarning"in n&&n.isReactWarning;return s?e.ref:(n=Object.getOwnPropertyDescriptor(e,"ref")?.get,s=n&&"isReactWarning"in n&&n.isReactWarning,s?e.props.ref:e.props.ref||e.ref)}var Cs=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],fe=Cs.reduce((e,n)=>{const s=Be(`Primitive.${n}`),r=d.forwardRef((o,a)=>{const{asChild:i,...l}=o,g=i?s:n;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),t.jsx(g,{...l,ref:a})});return r.displayName=`Primitive.${n}`,{...e,[n]:r}},{});function ae(e,n,{checkForDefaultPrevented:s=!0}={}){return function(o){if(e?.(o),s===!1||!o.defaultPrevented)return n?.(o)}}function Ms(e){const n=e+"CollectionProvider",[s,r]=qe(n),[o,a]=s(n,{collectionRef:{current:null},itemMap:new Map}),i=x=>{const{scope:b,children:y}=x,M=_.useRef(null),w=_.useRef(new Map).current;return t.jsx(o,{scope:b,itemMap:w,collectionRef:M,children:y})};i.displayName=n;const l=e+"CollectionSlot",g=Be(l),f=_.forwardRef((x,b)=>{const{scope:y,children:M}=x,w=a(l,y),D=_e(b,w.collectionRef);return t.jsx(g,{ref:D,children:M})});f.displayName=l;const c=e+"CollectionItemSlot",p="data-radix-collection-item",j=Be(c),m=_.forwardRef((x,b)=>{const{scope:y,children:M,...w}=x,D=_.useRef(null),R=_e(b,D),F=a(c,y);return _.useEffect(()=>(F.itemMap.set(D,{ref:D,...w}),()=>void F.itemMap.delete(D))),t.jsx(j,{[p]:"",ref:R,children:M})});m.displayName=c;function h(x){const b=a(e+"CollectionConsumer",x);return _.useCallback(()=>{const M=b.collectionRef.current;if(!M)return[];const w=Array.from(M.querySelectorAll(`[${p}]`));return Array.from(b.itemMap.values()).sort((F,B)=>w.indexOf(F.ref.current)-w.indexOf(B.ref.current))},[b.collectionRef,b.itemMap])}return[{Provider:i,Slot:f,ItemSlot:m},h,r]}var Dt=globalThis?.document?d.useLayoutEffect:()=>{},Ds=gt[" useId ".trim().toString()]||(()=>{}),Is=0;function Ss(e){const[n,s]=d.useState(Ds());return Dt(()=>{s(r=>r??String(Is++))},[e]),n?`radix-${n}`:""}function Rs(e){const n=d.useRef(e);return d.useEffect(()=>{n.current=e}),d.useMemo(()=>(...s)=>n.current?.(...s),[])}var $s=gt[" useInsertionEffect ".trim().toString()]||Dt;function $e({prop:e,defaultProp:n,onChange:s=()=>{},caller:r}){const[o,a,i]=Ts({defaultProp:n,onChange:s}),l=e!==void 0,g=l?e:o;{const c=d.useRef(e!==void 0);d.useEffect(()=>{const p=c.current;p!==l&&console.warn(`${r} is changing from ${p?"controlled":"uncontrolled"} to ${l?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),c.current=l},[l,r])}const f=d.useCallback(c=>{if(l){const p=As(c)?c(e):c;p!==e&&i.current?.(p)}else a(c)},[l,e,a,i]);return[g,f]}function Ts({defaultProp:e,onChange:n}){const[s,r]=d.useState(e),o=d.useRef(s),a=d.useRef(n);return $s(()=>{a.current=n},[n]),d.useEffect(()=>{o.current!==s&&(a.current?.(s),o.current=s)},[s,o]),[s,r,a]}function As(e){return typeof e=="function"}var Es=d.createContext(void 0);function It(e){const n=d.useContext(Es);return e||n||"ltr"}var Fe="rovingFocusGroup.onEntryFocus",Fs={bubbles:!1,cancelable:!0},me="RovingFocusGroup",[Ge,St,ks]=Ms(me),[Ps,Rt]=qe(me,[ks]),[Ls,Ns]=Ps(me),$t=d.forwardRef((e,n)=>t.jsx(Ge.Provider,{scope:e.__scopeRovingFocusGroup,children:t.jsx(Ge.Slot,{scope:e.__scopeRovingFocusGroup,children:t.jsx(Os,{...e,ref:n})})}));$t.displayName=me;var Os=d.forwardRef((e,n)=>{const{__scopeRovingFocusGroup:s,orientation:r,loop:o=!1,dir:a,currentTabStopId:i,defaultCurrentTabStopId:l,onCurrentTabStopIdChange:g,onEntryFocus:f,preventScrollOnEntryFocus:c=!1,...p}=e,j=d.useRef(null),m=_e(n,j),h=It(a),[x,b]=$e({prop:i,defaultProp:l??null,onChange:g,caller:me}),[y,M]=d.useState(!1),w=Rs(f),D=St(s),R=d.useRef(!1),[F,B]=d.useState(0);return d.useEffect(()=>{const A=j.current;if(A)return A.addEventListener(Fe,w),()=>A.removeEventListener(Fe,w)},[w]),t.jsx(Ls,{scope:s,orientation:r,dir:h,loop:o,currentTabStopId:x,onItemFocus:d.useCallback(A=>b(A),[b]),onItemShiftTab:d.useCallback(()=>M(!0),[]),onFocusableItemAdd:d.useCallback(()=>B(A=>A+1),[]),onFocusableItemRemove:d.useCallback(()=>B(A=>A-1),[]),children:t.jsx(fe.div,{tabIndex:y||F===0?-1:0,"data-orientation":r,...p,ref:m,style:{outline:"none",...e.style},onMouseDown:ae(e.onMouseDown,()=>{R.current=!0}),onFocus:ae(e.onFocus,A=>{const G=!R.current;if(A.target===A.currentTarget&&G&&!y){const k=new CustomEvent(Fe,Fs);if(A.currentTarget.dispatchEvent(k),!k.defaultPrevented){const O=D().filter(q=>q.focusable),$=O.find(q=>q.active),L=O.find(q=>q.id===x),Y=[$,L,...O].filter(Boolean).map(q=>q.ref.current);Et(Y,c)}}R.current=!1}),onBlur:ae(e.onBlur,()=>M(!1))})})}),Tt="RovingFocusGroupItem",At=d.forwardRef((e,n)=>{const{__scopeRovingFocusGroup:s,focusable:r=!0,active:o=!1,tabStopId:a,children:i,...l}=e,g=Ss(),f=a||g,c=Ns(Tt,s),p=c.currentTabStopId===f,j=St(s),{onFocusableItemAdd:m,onFocusableItemRemove:h,currentTabStopId:x}=c;return d.useEffect(()=>{if(r)return m(),()=>h()},[r,m,h]),t.jsx(Ge.ItemSlot,{scope:s,id:f,focusable:r,active:o,children:t.jsx(fe.span,{tabIndex:p?0:-1,"data-orientation":c.orientation,...l,ref:n,onMouseDown:ae(e.onMouseDown,b=>{r?c.onItemFocus(f):b.preventDefault()}),onFocus:ae(e.onFocus,()=>c.onItemFocus(f)),onKeyDown:ae(e.onKeyDown,b=>{if(b.key==="Tab"&&b.shiftKey){c.onItemShiftTab();return}if(b.target!==b.currentTarget)return;const y=Gs(b,c.orientation,c.dir);if(y!==void 0){if(b.metaKey||b.ctrlKey||b.altKey||b.shiftKey)return;b.preventDefault();let w=j().filter(D=>D.focusable).map(D=>D.ref.current);if(y==="last")w.reverse();else if(y==="prev"||y==="next"){y==="prev"&&w.reverse();const D=w.indexOf(b.currentTarget);w=c.loop?Us(w,D+1):w.slice(D+1)}setTimeout(()=>Et(w))}}),children:typeof i=="function"?i({isCurrentTabStop:p,hasTabStop:x!=null}):i})})});At.displayName=Tt;var _s={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function Bs(e,n){return n!=="rtl"?e:e==="ArrowLeft"?"ArrowRight":e==="ArrowRight"?"ArrowLeft":e}function Gs(e,n,s){const r=Bs(e.key,s);if(!(n==="vertical"&&["ArrowLeft","ArrowRight"].includes(r))&&!(n==="horizontal"&&["ArrowUp","ArrowDown"].includes(r)))return _s[r]}function Et(e,n=!1){const s=document.activeElement;for(const r of e)if(r===s||(r.focus({preventScroll:n}),document.activeElement!==s))return}function Us(e,n){return e.map((s,r)=>e[(n+r)%e.length])}var zs=$t,Vs=At,Ft="Toggle",kt=d.forwardRef((e,n)=>{const{pressed:s,defaultPressed:r,onPressedChange:o,...a}=e,[i,l]=$e({prop:s,onChange:o,defaultProp:r??!1,caller:Ft});return t.jsx(fe.button,{type:"button","aria-pressed":i,"data-state":i?"on":"off","data-disabled":e.disabled?"":void 0,...a,ref:n,onClick:ae(e.onClick,()=>{e.disabled||l(!i)})})});kt.displayName=Ft;var te="ToggleGroup",[Pt]=qe(te,[Rt]),Lt=Rt(),Ke=_.forwardRef((e,n)=>{const{type:s,...r}=e;if(s==="single"){const o=r;return t.jsx(Hs,{...o,ref:n})}if(s==="multiple"){const o=r;return t.jsx(Ws,{...o,ref:n})}throw new Error(`Missing prop \`type\` expected on \`${te}\``)});Ke.displayName=te;var[Nt,Ot]=Pt(te),Hs=_.forwardRef((e,n)=>{const{value:s,defaultValue:r,onValueChange:o=()=>{},...a}=e,[i,l]=$e({prop:s,defaultProp:r??"",onChange:o,caller:te});return t.jsx(Nt,{scope:e.__scopeToggleGroup,type:"single",value:_.useMemo(()=>i?[i]:[],[i]),onItemActivate:l,onItemDeactivate:_.useCallback(()=>l(""),[l]),children:t.jsx(_t,{...a,ref:n})})}),Ws=_.forwardRef((e,n)=>{const{value:s,defaultValue:r,onValueChange:o=()=>{},...a}=e,[i,l]=$e({prop:s,defaultProp:r??[],onChange:o,caller:te}),g=_.useCallback(c=>l((p=[])=>[...p,c]),[l]),f=_.useCallback(c=>l((p=[])=>p.filter(j=>j!==c)),[l]);return t.jsx(Nt,{scope:e.__scopeToggleGroup,type:"multiple",value:i,onItemActivate:g,onItemDeactivate:f,children:t.jsx(_t,{...a,ref:n})})});Ke.displayName=te;var[qs,Ks]=Pt(te),_t=_.forwardRef((e,n)=>{const{__scopeToggleGroup:s,disabled:r=!1,rovingFocus:o=!0,orientation:a,dir:i,loop:l=!0,...g}=e,f=Lt(s),c=It(i),p={role:"group",dir:c,...g};return t.jsx(qs,{scope:s,rovingFocus:o,disabled:r,children:o?t.jsx(zs,{asChild:!0,...f,orientation:a,dir:c,loop:l,children:t.jsx(fe.div,{...p,ref:n})}):t.jsx(fe.div,{...p,ref:n})})}),Ie="ToggleGroupItem",Bt=_.forwardRef((e,n)=>{const s=Ot(Ie,e.__scopeToggleGroup),r=Ks(Ie,e.__scopeToggleGroup),o=Lt(e.__scopeToggleGroup),a=s.value.includes(e.value),i=r.disabled||e.disabled,l={...e,pressed:a,disabled:i},g=_.useRef(null);return r.rovingFocus?t.jsx(Vs,{asChild:!0,...o,focusable:!i,active:a,ref:g,children:t.jsx(st,{...l,ref:n})}):t.jsx(st,{...l,ref:n})});Bt.displayName=Ie;var st=_.forwardRef((e,n)=>{const{__scopeToggleGroup:s,value:r,...o}=e,a=Ot(Ie,s),i={role:"radio","aria-checked":e.pressed,"aria-pressed":void 0},l=a.type==="single"?i:void 0;return t.jsx(kt,{...l,...o,ref:n,onPressedChange:g=>{g?a.onItemActivate(r):a.onItemDeactivate(r)}})}),Qs=Ke,Ys=Bt;const Zs=e=>typeof e=="object"&&e!==null&&"data"in e,rt=e=>Zs(e)?e.data:e,Xs=ze.injectEndpoints({endpoints:e=>({getFolders:e.query({query:(n={})=>{const{parentId:s}=n,r={sort:"name:ASC"};return s!=null?r.filters={$and:[{parent:{id:s}}]}:r.filters={$and:[{parent:{id:{$null:!0}}}]},{url:"/upload/folders",method:"GET",config:{params:r}}},transformResponse:n=>rt(n),providesTags:n=>n?[...n.map(({id:s})=>({type:"Folder",id:s})),{type:"Folder",id:"LIST"}]:[{type:"Folder",id:"LIST"}]}),createFolder:e.mutation({query:n=>({url:"/upload/folders",method:"POST",data:n}),transformResponse:n=>n.data,invalidatesTags:[{type:"Folder",id:"LIST"},{type:"Folder",id:"STRUCTURE"}]}),getFolderStructure:e.query({query:()=>({url:"/upload/folder-structure",method:"GET"}),transformResponse:n=>n?.data??n??[],providesTags:[{type:"Folder",id:"STRUCTURE"}]}),getAllFolders:e.query({query:()=>({url:"/upload/folders",method:"GET"}),transformResponse:n=>rt(n??[]),providesTags:n=>n?[...n.map(({id:s})=>({type:"Folder",id:s})),{type:"Folder",id:"LIST"}]:[{type:"Folder",id:"LIST"}]}),getFolder:e.query({query:({id:n})=>({url:`/upload/folders/${n}`,method:"GET",config:{params:{populate:{parent:{populate:{parent:"*"}},children:{count:!0},files:{count:!0}}}}}),transformResponse:n=>n.data,providesTags:(n,s,{id:r})=>[{type:"Folder",id:r}]}),bulkMove:e.mutation({query:({fileIds:n=[],folderIds:s=[],destinationFolderId:r})=>({url:"/upload/actions/bulk-move",method:"POST",data:{fileIds:n,folderIds:s,destinationFolderId:r}}),transformResponse:n=>n.data,invalidatesTags:[{type:"Asset",id:"LIST"},{type:"Folder",id:"LIST"},{type:"Folder",id:"STRUCTURE"}]})})}),{useCreateFolderMutation:Js,useGetFoldersQuery:er,useGetFolderQuery:Gt,useGetAllFoldersQuery:tr,useGetFolderStructureQuery:Qe,useBulkMoveMutation:nr}=Xs,sr=ze.injectEndpoints({endpoints:e=>({getAssets:e.query({query:(n={})=>{const{folder:s,...r}=n,o={...r};return s!=null?o.filters={$and:[{folder:{id:s}}]}:o.filters={$and:[{folder:{id:{$null:!0}}}]},{url:"/upload/files",method:"GET",config:{params:o}}},transformResponse:n=>n,providesTags:n=>n?[...n.results.map(({id:s})=>({type:"Asset",id:s})),{type:"Asset",id:"LIST"}]:[{type:"Asset",id:"LIST"}]}),getAsset:e.query({query:n=>({url:`/upload/files/${n}`,method:"GET"}),providesTags:(n,s,r)=>[{type:"Asset",id:r}]}),updateAsset:e.mutation({query:({id:n,fileInfo:s})=>{const r=new FormData;return r.append("fileInfo",JSON.stringify(s)),{url:"/upload",method:"POST",data:r,config:{params:{id:n}}}},invalidatesTags:(n,s,{id:r})=>[{type:"Asset",id:r},{type:"Asset",id:"LIST"}]}),replaceAsset:e.mutation({query:({id:n,file:s,fileInfo:r})=>{const o=new FormData;return o.append("files",s),r&&o.append("fileInfo",JSON.stringify(r)),{url:"/upload",method:"POST",data:o,config:{params:{id:n}}}},invalidatesTags:(n,s,{id:r})=>[{type:"Asset",id:r},{type:"Asset",id:"LIST"}]}),deleteAsset:e.mutation({query:n=>({url:`/upload/files/${n}`,method:"DELETE"}),invalidatesTags:(n,s,r)=>[{type:"Asset",id:r},{type:"Asset",id:"LIST"}]})})}),{useGetAssetsQuery:Ut,useGetAssetQuery:rr,useUpdateAssetMutation:or,useReplaceAssetMutation:ar,useDeleteAssetMutation:ir}=sr,lr=ze.injectEndpoints({endpoints:e=>({getSettings:e.query({query:()=>({url:"/upload/settings",method:"GET"})})})}),{useGetSettingsQuery:dr}=lr,cr=async(e,n)=>{const r=await(await fetch(e)).blob(),o=window.URL.createObjectURL(r),a=document.createElement("a");a.href=o,a.setAttribute("download",n),a.click(),window.URL.revokeObjectURL(o)},ur={pdf:wn,csv:jn,xls:yn,zip:vn},xe=(e,n)=>{const s=pt(n);return e?.includes(ee.Image)?mn:e?.includes(ee.Video)?xn:e?.includes(ee.Audio)?bn:s?ur[s]||Ne:Ne},zt=e=>{const{formatMessage:n}=T(),{data:s,isLoading:r}=Gt({id:e},{skip:e===null}),{data:o,isLoading:a}=Ut({folder:null,pageSize:1},{skip:e!==null}),i=n({id:u("plugin.home"),defaultMessage:"Home"});return e===null?a?{title:i,itemCount:0}:{title:i,itemCount:o?.pagination?.total??0}:r||!s?{title:"",itemCount:0}:{title:s.name,itemCount:s.files?.count??0}},gr=1,pr=({anchorX:e,anchorY:n,point:s,aspectRatio:r})=>{let o=Math.abs(s.x-e),a=Math.abs(s.y-n);r&&(o/r>=a?a=o/r:o=a*r);const i=s.x<e?e-o:e,l=s.y<n?n-a:n;return{x:i,y:l,width:o,height:a}},fr=()=>{const[e,n]=d.useState({width:0,height:0}),[s,r]=d.useState({x:0,y:0,width:0,height:0}),[o,a]=d.useState(null),i=d.useRef(null),l=d.useCallback(m=>{i.current=m;const h={width:m.naturalWidth,height:m.naturalHeight};n(h),r({x:0,y:0,width:h.width,height:h.height})},[]),g=(m,h,x)=>Math.min(x,Math.max(h,m)),f=d.useCallback(m=>{r(h=>{const x=e.width-h.x,b=e.height-h.y;let y=m.width!==void 0?g(m.width,1,x):h.width,M=m.height!==void 0?g(m.height,1,b):h.height;return o&&(m.width!==void 0?M=g(y/o,1,b):m.height!==void 0&&(y=g(M*o,1,x))),{...h,width:y,height:M}})},[e.width,e.height,o]),c=d.useCallback(m=>{r(h=>{const x=m.x!==void 0?g(m.x,0,e.width-h.width):h.x,b=m.y!==void 0?g(m.y,0,e.height-h.height):h.y;return{...h,x,y:b}})},[e.width,e.height]),p=d.useCallback(m=>{a(m),m&&r(h=>{const x=e.width-h.x,b=e.height-h.y;let y=h.width,M=y/m;return M>b&&(M=b,y=M*m),y>x&&(y=x,M=y/m),{...h,width:Math.round(y),height:Math.round(M)}})},[e.width,e.height]),j=d.useCallback((m,h,x)=>new Promise((b,y)=>{const M=i.current;if(!M){y(new Error("Image not ready: call init() before produceFile()."));return}const w=document.createElement("canvas");w.width=Math.max(1,Math.round(s.width)),w.height=Math.max(1,Math.round(s.height));const D=w.getContext("2d");if(!D){y(new Error("Could not get a 2D canvas context to crop the image."));return}D.drawImage(M,s.x,s.y,s.width,s.height,0,0,w.width,w.height),w.toBlob(R=>{if(!R){y(new Error("Could not export the cropped image to a blob."));return}b(new File([R],m,{type:h,lastModified:x?new Date(x).getTime():Date.now()}))},h,gr)}),[s.x,s.y,s.width,s.height]);return{init:l,crop:s,naturalSize:e,aspectRatio:o,setCropSize:f,setCropPosition:c,setAspectRatio:p,produceFile:j,width:Math.round(s.width),height:Math.round(s.height)}},ve=5.6,ke=12,hr=v(C)`
  position: fixed;
  z-index: 1200;
  flex-direction: column;
  top: ${({theme:e})=>e.spaces[1]};
  left: ${({theme:e})=>e.spaces[1]};
  right: ${({theme:e})=>e.spaces[1]};
  bottom: ${({theme:e})=>e.spaces[1]};
  border-radius: ${({theme:e})=>e.borderRadius};
  border: 1px solid ${({theme:e})=>e.colors.neutral150};
  background: ${({theme:e})=>e.colors.neutral0};
`,mr=v(C)`
  width: 100%;
  gap: ${({theme:e})=>e.spaces[2]};
  padding: ${({theme:e})=>`${e.spaces[3]} ${e.spaces[5]}`};
  border-bottom: 1px solid ${({theme:e})=>e.colors.neutral150};
  background: ${({theme:e})=>e.colors.neutral0};
`,xr=v(P)`
  width: 100%;
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: repeating-conic-gradient(
      ${({theme:e})=>e.colors.neutral100} 0% 25%,
      ${({theme:e})=>e.colors.neutral0} 0% 50%
    )
    50% / 20px 20px;
`,br=v.div`
  position: relative;
  max-width: 100%;
  max-height: 100%;
  ${({$aspect:e})=>e?`aspect-ratio: ${e};`:""}

  img {
    display: block;
    width: 100%;
    height: 100%;
    user-select: none;
    -webkit-user-drag: none;
  }
`,vr=v.div`
  position: absolute;
  border: 1px dashed ${({theme:e})=>e.colors.primary600};
  box-shadow: 0 0 0 9999px rgba(33, 33, 52, 0.5);
  cursor: move;
`,ye=v.button`
  position: absolute;
  width: ${ke}px;
  height: ${ke}px;
  margin: -${ke/2}px;
  padding: 0;
  border: 1px solid ${({theme:e})=>e.colors.primary600};
  border-radius: 2px;
  background: ${({theme:e})=>e.colors.neutral0};
  cursor: ${({$cursor:e})=>e};
`,yr=v.button`
  position: absolute;
  width: ${ve}rem;
  height: ${ve}rem;
  margin: ${-ve/2}rem 0 0 ${-ve/2}rem;
  border-radius: 50%;
  border: 1px solid ${({theme:e})=>e.colors.neutral800};
  background: transparent;
  cursor: grab;
  padding: 0;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.16);
    transform: translate(-50%, -50%);
  }
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({theme:e})=>e.colors.neutral800};
    transform: translate(-50%, -50%);
  }

  &:active {
    cursor: grabbing;
  }
`,jr=v(P)`
  position: absolute;
  right: ${({theme:e})=>e.spaces[1]};
  bottom: ${({theme:e})=>e.spaces[1]};
  width: 100%;
  max-width: 32rem;
  padding: ${({theme:e})=>e.spaces[3]};
  border-radius: ${({theme:e})=>e.borderRadius};
  background: ${({theme:e})=>e.colorScheme==="dark"?e.colors.neutral150:e.colors.neutral900};
  z-index: 20;
`,wr=v(C)`
  width: 100%;
  justify-content: space-between;
  padding: ${({theme:e})=>`${e.spaces[3]} ${e.spaces[5]}`};
  border-top: 1px solid ${({theme:e})=>e.colors.neutral150};
  background: ${({theme:e})=>e.colors.neutral0};
`,je=v(V.Root)`
  flex-direction: row;
  align-items: center;
`,we=v(Rn)`
  width: 8.4rem;
`,ot=v(V.Label)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
`,Cr=v(P)`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);

  svg {
    display: block;
  }
`,Mr=()=>t.jsx(Cr,{children:t.jsx("svg",{width:"17",height:"49",viewBox:"0 0 17 49",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:t.jsx("path",{d:"M0.5 0.5H8.5C12.9183 0.5 16.5 4.08172 16.5 8.5M0.5 48.5H8.5C12.9183 48.5 16.5 44.9183 16.5 40.5",stroke:"#666687",strokeLinecap:"round"})})}),Dr=({asset:e,isBusy:n=!1,onClose:s,onApply:r,onSaveAsCopy:o})=>{const{formatMessage:a}=T(),{toggleNotification:i}=Se(),g=Cn().colorScheme==="dark",f=g?"neutral1000":"neutral0",c=g?"neutral600":"neutral200",p=d.useRef(null),j=d.useRef(null),{init:m,crop:h,naturalSize:x,aspectRatio:b,setCropSize:y,setCropPosition:M,setAspectRatio:w,produceFile:D,width:R,height:F}=fr(),[B,A]=d.useState(!1),[G,k]=d.useState(e.focalPoint??{x:50,y:50}),O=ie(e.url),$=e.updatedAt?new Date(e.updatedAt).getTime():void 0,L=$!==void 0?`${O}${O.includes("?")?"&":"?"}v=${$}`:O,U=()=>{p.current&&m(p.current)},Y=S=>{const E=j.current?.getBoundingClientRect();if(!E||!x.width||!x.height)return null;const N=x.width/E.width,Z=x.height/E.height;return{x:(S.clientX-E.left)*N,y:(S.clientY-E.top)*Z}},q=S=>{S.preventDefault(),S.stopPropagation();const E=Y(S);if(!E)return;const N={...h},Z=de=>{const J=Y(de);J&&M({x:N.x+(J.x-E.x),y:N.y+(J.y-E.y)})},X=()=>{window.removeEventListener("pointermove",Z),window.removeEventListener("pointerup",X)};window.addEventListener("pointermove",Z),window.addEventListener("pointerup",X)},se=S=>E=>{E.preventDefault(),E.stopPropagation();const N={...h},Z=S==="tl"||S==="bl"?N.x+N.width:N.x,X=S==="tl"||S==="tr"?N.y+N.height:N.y,de=un=>{const Je=Y(un);if(!Je)return;const{x:gn,y:pn,width:fn,height:hn}=pr({anchorX:Z,anchorY:X,point:Je,aspectRatio:B?b:null});M({x:gn,y:pn}),y({width:fn,height:hn})},J=()=>{window.removeEventListener("pointermove",de),window.removeEventListener("pointerup",J)};window.addEventListener("pointermove",de),window.addEventListener("pointerup",J)},an=()=>{A(S=>{const E=!S;return w(E&&F?R/F:null),E})},ln=S=>{S.preventDefault(),S.stopPropagation();const E=Z=>{const X=Y(Z);if(!X)return;const de=(X.x-h.x)/h.width*100,J=(X.y-h.y)/h.height*100;k({x:Math.round(Math.min(100,Math.max(0,de))),y:Math.round(Math.min(100,Math.max(0,J)))})},N=()=>{window.removeEventListener("pointermove",E),window.removeEventListener("pointerup",N)};window.addEventListener("pointermove",E),window.addEventListener("pointerup",N)},dn=Math.round(G.x/100*R),cn=Math.round(G.y/100*F),Ze=(S,E)=>{const N=S==="x"?R:F;if(!N)return;const Z=Math.min(100,Math.max(0,E/N*100));k(X=>({...X,[S]:Math.round(Z)}))},le=x.width&&x.height?{left:h.x/x.width*100,top:h.y/x.height*100,width:h.width/x.width*100,height:h.height/x.height*100}:null,Te=le!==null,Xe=async S=>{if(!Te)return;let E;try{E=await D(e.name,e.mime??"image/png",e.updatedAt)}catch{i({type:"danger",message:a({id:u("asset-details.crop.export-error"),defaultMessage:"Could not process the cropped image."})});return}const N={x:Math.round(G.x),y:Math.round(G.y)};S==="apply"?r(E,N):o(E,N)};return t.jsx(Mn,{children:t.jsx(Dn,{onEscape:s,children:t.jsxs(hr,{children:[t.jsxs(mr,{alignItems:"center",children:[t.jsx(ft,{"aria-hidden":!0}),t.jsx(I,{variant:"omega",fontWeight:"bold",children:a({id:u("asset-details.crop.title"),defaultMessage:"Crop & Focus area"})})]}),t.jsxs(xr,{children:[t.jsxs(br,{ref:j,$aspect:x.width&&x.height?x.width/x.height:void 0,children:[t.jsx("img",{ref:p,src:L,alt:e.name,crossOrigin:"anonymous",onLoad:U,draggable:!1}),le?t.jsxs(vr,{style:{left:`${le.left}%`,top:`${le.top}%`,width:`${le.width}%`,height:`${le.height}%`},onPointerDown:q,children:[t.jsx(ye,{type:"button","aria-label":a({id:u("asset-details.crop.resize.top-left"),defaultMessage:"Resize top-left"}),$cursor:"nwse-resize",style:{left:0,top:0},onPointerDown:se("tl")}),t.jsx(ye,{type:"button","aria-label":a({id:u("asset-details.crop.resize.top-right"),defaultMessage:"Resize top-right"}),$cursor:"nesw-resize",style:{right:0,top:0},onPointerDown:se("tr")}),t.jsx(ye,{type:"button","aria-label":a({id:u("asset-details.crop.resize.bottom-left"),defaultMessage:"Resize bottom-left"}),$cursor:"nesw-resize",style:{left:0,bottom:0},onPointerDown:se("bl")}),t.jsx(ye,{type:"button","aria-label":a({id:u("asset-details.crop.resize.bottom-right"),defaultMessage:"Resize bottom-right"}),$cursor:"nwse-resize",style:{right:0,bottom:0},onPointerDown:se("br")}),t.jsx(yr,{type:"button","aria-label":a({id:u("asset-details.crop.focal-point"),defaultMessage:"Focal point"}),style:{left:`${G.x}%`,top:`${G.y}%`},onPointerDown:ln})]}):null]}),t.jsxs(jr,{children:[t.jsxs(C,{direction:"column",alignItems:"stretch",gap:1,paddingBottom:3,children:[t.jsx(I,{variant:"omega",fontWeight:"bold",textColor:f,children:a({id:u("asset-details.crop.title"),defaultMessage:"Crop & Focus area"})}),t.jsx(I,{variant:"pi",textColor:c,children:a({id:u("asset-details.crop.hint"),defaultMessage:"Set the crop area with the rectangle. Pin the always-visible area with the circle."})})]}),t.jsxs(C,{gap:6,alignItems:"center",children:[t.jsxs(C,{alignItems:"center",gap:2,children:[t.jsxs(C,{direction:"column",gap:2,children:[t.jsxs(je,{name:"crop-width",gap:2,children:[t.jsx(ot,{textColor:f,children:t.jsx(In,{})}),t.jsx(we,{"aria-label":a({id:u("asset-details.crop.width"),defaultMessage:"Width (px)"}),value:R,min:1,max:x.width||void 0,onValueChange:S=>{S!==void 0&&y({width:S})}})]}),t.jsxs(je,{name:"crop-height",gap:2,children:[t.jsx(ot,{textColor:f,children:t.jsx(Sn,{})}),t.jsx(we,{"aria-label":a({id:u("asset-details.crop.height"),defaultMessage:"Height (px)"}),value:F,min:1,max:x.height||void 0,onValueChange:S=>{S!==void 0&&y({height:S})}})]})]}),t.jsxs(C,{position:"relative",children:[t.jsx(Q,{label:a({id:u("asset-details.crop.aspect-lock"),defaultMessage:"Lock aspect ratio"}),variant:B?"secondary":"ghost",onClick:an,children:t.jsx(Ve,{})}),t.jsx(Mr,{})]})]}),t.jsxs(C,{direction:"column",gap:2,marginLeft:"auto",children:[t.jsxs(je,{name:"focal-x",gap:2,children:[t.jsx(V.Label,{textColor:f,children:a({id:u("asset-details.crop.focal-x-axis"),defaultMessage:"X"})}),t.jsx(we,{"aria-label":a({id:u("asset-details.crop.focal-x"),defaultMessage:"Focal point X (px)"}),value:dn,onValueChange:S=>{S!==void 0&&Ze("x",S)}})]}),t.jsxs(je,{name:"focal-y",gap:2,children:[t.jsx(V.Label,{textColor:f,children:a({id:u("asset-details.crop.focal-y-axis"),defaultMessage:"Y"})}),t.jsx(we,{"aria-label":a({id:u("asset-details.crop.focal-y"),defaultMessage:"Focal point Y (px)"}),value:cn,onValueChange:S=>{S!==void 0&&Ze("y",S)}})]})]})]})]})]}),t.jsxs(wr,{alignItems:"center",children:[t.jsx(H,{variant:"tertiary",onClick:s,disabled:n,children:a({id:"app.components.Button.cancel",defaultMessage:"Cancel"})}),t.jsxs(C,{gap:2,children:[t.jsx(H,{variant:"secondary",onClick:()=>Xe("copy"),loading:n,disabled:!Te,children:a({id:u("asset-details.crop.save-as-copy"),defaultMessage:"Save as copy"})}),t.jsx(H,{variant:"default",onClick:()=>Xe("apply"),loading:n,disabled:!Te,children:a({id:u("asset-details.crop.apply"),defaultMessage:"Apply"})})]})]})]})})})},ge=v(P)`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 24rem;
  overflow: hidden;
  border-radius: ${({theme:e})=>e.borderRadius};
  padding: ${({theme:e})=>e.spaces[3]};
  background: repeating-conic-gradient(
      ${({theme:e})=>e.colors.neutral100} 0% 25%,
      transparent 0% 50%
    )
    50% / 20px 20px;
`,Ce=v(C)`
  justify-content: center;
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
`,Ir=v.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`,Sr=v(C)`
  position: absolute;
  top: ${({theme:e})=>e.spaces[3]};
  right: ${({theme:e})=>e.spaces[3]};
  z-index: 3;
`,Rr=v.video`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`,$r=v.audio`
  width: 100%;
`,Tr=v.iframe`
  width: 100%;
  height: 100%;
  min-height: 200px;
  border: none;
`,Ar=v(C)`
  height: 100%;
  aspect-ratio: 1;
  width: auto;
  max-width: 100%;
  margin: 0 auto;
  color: ${({theme:e})=>e.colors.neutral500};
  background: ${({theme:e})=>e.colors.neutral150};
`,Er=v(C)`
  position: absolute;
  inset: 0;
  z-index: 1;
`,Me=()=>{const{formatMessage:e}=T();return t.jsx(Er,{justifyContent:"center",alignItems:"center",children:t.jsx(ce,{children:e({id:"app.loading",defaultMessage:"Loading..."})})})},Fr=({asset:e,actions:n,isLoading:s=!1})=>{const{formatMessage:r}=T(),{alternativeText:o,ext:a,mime:i,url:l,updatedAt:g,isUrlSigned:f,isLocal:c}=e,p=g&&!f?new Date(g).getTime():void 0,j=w=>!w||p===void 0?w:w.includes("?")?`${w}&v=${p}`:`${w}?v=${p}`,m=j(ie(l)),[h,x]=d.useState(!1);d.useEffect(()=>{x(!1)},[m]);const b=d.useRef(null);if(d.useEffect(()=>{const w=b.current;if(!w)return;const D=()=>{const F=w.parentElement;if(!F)return;const B=F.getBoundingClientRect(),A=w.offsetWidth,G=w.offsetHeight;!A||!G||!B.width||B.height};D();const R=new ResizeObserver(D);return R.observe(w),w.parentElement&&R.observe(w.parentElement),()=>R.disconnect()},[h]),i?.includes(ee.Image)){const w=j(ie(l));if(w)return t.jsxs(ge,{children:[(!h||s)&&t.jsx(Me,{}),n?t.jsx(Sr,{children:n}):null,t.jsx(Ce,{children:t.jsx(Ir,{ref:b,src:w,alt:o||e.name||"",crossOrigin:!c&&f?"anonymous":void 0,onLoad:()=>x(!0),onError:()=>x(!0)})})]})}if(i?.includes(ee.Video)&&m)return t.jsxs(ge,{children:[!h&&t.jsx(Me,{}),t.jsx(Ce,{children:t.jsx(Rr,{src:m,controls:!0,title:e.name,onLoadedData:()=>x(!0),onError:()=>x(!0),children:r({id:u("asset-details.videoNotSupported"),defaultMessage:"Your browser does not support the video tag."})})})]});if(i?.includes(ee.Audio)&&m)return t.jsxs(ge,{children:[!h&&t.jsx(Me,{}),t.jsx(Ce,{children:t.jsx(C,{width:"100%",padding:4,justifyContent:"center",alignItems:"center",height:"100%",minHeight:"12rem",children:t.jsx($r,{src:m,controls:!0,onLoadedData:()=>x(!0),onError:()=>x(!0)})})})]});if((a?.toLowerCase()==="pdf"||a?.toLowerCase()===".pdf"||i==="application/pdf")&&m)return t.jsxs(ge,{children:[!h&&t.jsx(Me,{}),t.jsx(Ce,{children:t.jsx(Tr,{src:`${m}#toolbar=0`,title:e.name,onLoad:()=>x(!0)})})]});const M=xe(i,a);return t.jsx(ge,{children:t.jsxs(Ar,{justifyContent:"center",alignItems:"center",gap:1,direction:"column",hasRadius:!0,children:[t.jsx(M,{width:24,height:24}),t.jsx(I,{variant:"pi",children:r({id:u("asset-details.noPreview"),defaultMessage:"No preview available"})})]})})},Pe="assetId",Vt=d.createContext(null),Ht=()=>{const e=d.useContext(Vt);if(!e)throw new Error("useDrawerNotify must be used within AssetDetails");return e},Wt=d.createContext(null),qt=()=>{const e=d.useContext(Wt);if(!e)throw new Error("useAssetOperation must be used within AssetDetails");return e},Kt=()=>{const[{query:e},n]=ht(),s=e?.[Pe],r=s?parseInt(s,10):null,o=r!==null&&!Number.isNaN(r),[a,i]=d.useState(o),l=d.useRef(null);d.useEffect(()=>{o&&(l.current=r,i(!0))},[o,r]);const g=d.useCallback(p=>{p.target===p.currentTarget&&!o&&i(!1)},[o]),f=d.useCallback(p=>{n({[Pe]:String(p)},"push",!0)},[n]),c=d.useCallback(()=>{n({[Pe]:void 0},"remove",!0)},[n]);return{assetId:o?r:l.current,isVisible:o,shouldRenderDrawer:a,onCloseAnimationEnd:g,openDetails:f,closeDetails:c}},kr=v(C)`
  flex: 0 0 calc(50% - ${({theme:e})=>e.spaces[2]});
`,re=({label:e,value:n})=>t.jsxs(kr,{direction:"column",justifyContent:"flex-start",alignItems:"flex-start",gap:1,children:[t.jsx(I,{variant:"sigma",textColor:"neutral600",fontWeight:"semiBold",textTransform:"uppercase",children:e}),t.jsx(I,{variant:"pi",textColor:"neutral700",children:n??"-"})]}),Pr=v(P)`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;

  > form {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    position: relative;
  }
`,Lr=v(P)`
  position: absolute;
  top: ${({theme:e})=>e.spaces[2]};
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: calc(100% - ${({theme:e})=>e.spaces[2]});
`,Nr=v(C)`
  position: absolute;
  inset: 0;
  z-index: 20;
  align-items: center;
  justify-content: center;
  background: ${({theme:e})=>e.colors.neutral0};
  opacity: 0.7;
`,Or=e=>e.isDeleting?{id:u("asset-details.delete.loading"),defaultMessage:"Deleting the file…"}:e.isCropCopying?{id:u("asset-details.crop.loading"),defaultMessage:"Saving the cropped copy…"}:e.isReplacing?{id:u("asset-details.replace.loading"),defaultMessage:"Replacing the file…"}:null,_r=v(yt)`
  width: 1.6rem;
  height: 1.6rem;

  path {
    fill: ${({theme:e})=>e.colors.warning500};
  }
`,Le=({name:e,label:n,required:s})=>{const{formatMessage:r}=T(),o=xt(e),a=He("DetailField",g=>g.isSubmitting),i=o.value??"",l=r({id:u("asset-details.field.empty"),defaultMessage:"{label} is currently empty."},{label:n});return t.jsxs(V.Root,{name:e,required:s,children:[t.jsx(V.Label,{children:n}),t.jsx(bt,{value:i,onChange:g=>o.onChange(e,g.target.value),endAction:i?void 0:t.jsx(vt,{label:l,children:t.jsx(_r,{"aria-label":l,role:"img"})}),type:"text",disabled:a})]})},Br=({label:e,rootLabel:n,folders:s})=>{const r=xt("folder"),o=He("LocationField",a=>a.isSubmitting);return t.jsxs(V.Root,{name:"folder",required:!0,children:[t.jsx(V.Label,{children:e}),t.jsxs(kn,{value:r.value==null?"":String(r.value),onChange:a=>{const i=a===""?null:Number(a);r.onChange("folder",i)},disabled:o,children:[t.jsx(et,{value:"",children:n}),s.map(a=>t.jsx(et,{value:String(a.id),children:a.name},a.id))]})]})},Gr=()=>{const{formatMessage:e}=T(),{deleteAsset:n,isDeleting:s}=qt(),[r,o]=d.useState(!1),a=async()=>{await n(),o(!1)},i=e({id:u("asset-details.delete.trigger"),defaultMessage:"Delete this file"});return t.jsxs(z.Root,{open:r,onOpenChange:o,children:[t.jsx(z.Trigger,{children:t.jsx(Q,{withTooltip:!1,label:i,variant:"danger-light",children:t.jsx(Pn,{})})}),t.jsxs(z.Content,{children:[t.jsx(z.Header,{children:e({id:u("asset-details.delete.title"),defaultMessage:"Delete this media file?"})}),t.jsx(z.Body,{icon:t.jsx(yt,{width:"24px",height:"24px",fill:"danger600"}),textAlign:"center",children:e({id:u("asset-details.delete.description"),defaultMessage:"This file cannot be recovered once deleted. If it is currently in use, linked content will break and image containers will be empty."})}),t.jsxs(z.Footer,{children:[t.jsx(z.Cancel,{children:t.jsx(H,{variant:"tertiary",disabled:s,fullWidth:!0,children:e({id:"app.components.Button.cancel",defaultMessage:"Cancel"})})}),t.jsx(z.Action,{children:t.jsx(H,{variant:"danger-light",loading:s,onClick:a,fullWidth:!0,children:e({id:"app.components.Button.confirm",defaultMessage:"Confirm"})})})]})]})]})},Ur=({asset:e})=>{const{formatMessage:n}=T(),{copy:s}=Ln(),r=Ht(),o=async()=>{const a=ie(e.url);if(!a)return;const i=await s(a);r({type:i?"success":"danger",message:n(i?{id:u("asset-details.copy-link.success"),defaultMessage:"Link copied."}:{id:u("asset-details.copy-link.error"),defaultMessage:"Failed to copy the link."})})};return t.jsx(Q,{withTooltip:!1,label:n({id:u("asset-details.copy-link.trigger"),defaultMessage:"Copy link"}),variant:"tertiary",onClick:o,children:t.jsx(Ve,{})})},zr=({asset:e})=>{const{formatMessage:n}=T(),s=Ht(),[r,o]=d.useState(!1),a=async()=>{const i=ie(e.url);if(i){o(!0);try{await cr(i,e.name)}catch{s({type:"danger",message:n({id:u("asset-details.download.error"),defaultMessage:"Failed to download the file."})})}finally{o(!1)}}};return t.jsx(Q,{withTooltip:!1,label:n({id:u("asset-details.download.trigger"),defaultMessage:"Download"}),variant:"tertiary",onClick:a,disabled:r,children:t.jsx(Nn,{})})},Vr=()=>{const{formatMessage:e}=T(),{replaceAsset:n,isReplacing:s}=qt(),r=d.useRef(null),[o,a]=d.useState(!1),{data:i}=dr(),l=i?.data?.aiMetadata??!1,g=()=>{a(!0)},f=()=>{a(!1),r.current?.click()},c=async p=>{const j=p.target.files?.[0];p.target.value="",j&&await n(j)};return t.jsxs(t.Fragment,{children:[t.jsx(he,{children:t.jsx("input",{ref:r,type:"file",multiple:!1,onChange:c,"aria-hidden":!0,tabIndex:-1})}),t.jsx(Q,{withTooltip:!1,label:e({id:u("asset-details.replace.trigger"),defaultMessage:"Replace this file"}),variant:"tertiary",onClick:g,disabled:s,children:t.jsx(On,{})}),t.jsx(z.Root,{open:o,onOpenChange:a,children:t.jsxs(z.Content,{children:[t.jsx(z.Header,{children:e({id:u("asset-details.replace.title"),defaultMessage:"Replace this media file?"})}),t.jsx(z.Body,{textAlign:"center",children:t.jsxs(C,{direction:"column",textAlign:"center",children:[t.jsx(I,{variant:"omega",children:e({id:u("asset-details.replace.description"),defaultMessage:"Current content will be permanently replaced."})}),l?t.jsx(I,{variant:"omega",children:e({id:u("asset-details.replace.description.ai"),defaultMessage:"AI will generate new metadata after upload."})}):null]})}),t.jsxs(z.Footer,{children:[t.jsx(z.Cancel,{children:t.jsx(H,{variant:"tertiary",fullWidth:!0,children:e({id:"app.components.Button.cancel",defaultMessage:"Cancel"})})}),t.jsx(z.Action,{children:t.jsx(H,{variant:"secondary",onClick:f,fullWidth:!0,children:e({id:u("asset-details.replace.continue"),defaultMessage:"Continue"})})})]})]})})]})},Hr=({onCrop:e})=>{const{formatMessage:n}=T(),s=He("AssetImageActions",r=>r.isSubmitting);return t.jsxs(C,{direction:"column",gap:2,children:[t.jsx(Q,{withTooltip:!1,label:n({id:u("asset-details.crop.trigger"),defaultMessage:"Crop"}),variant:"tertiary",onClick:e,disabled:s||!e,children:t.jsx(ft,{})}),t.jsx(Vr,{})]})},Wr=({asset:e,closeDetails:n})=>{const{formatMessage:s,formatDate:r}=T(),{data:o=[]}=tr(),{toggleNotification:a}=Se(),[i]=or(),[l,{isLoading:g}]=ar(),[f,{isLoading:c}]=ir(),[p,{isLoading:j}]=An(),[m,h]=d.useState(!1),[x,b]=d.useState(null);d.useEffect(()=>{if(!x)return;const $=window.setTimeout(()=>b(null),5e3);return()=>window.clearTimeout($)},[x]);const y=d.useCallback($=>b($),[]),M=e.mime?.includes(ee.Image),w={name:e.name??"",caption:e.caption??"",alternativeText:e.alternativeText??"",folder:typeof e.folder=="object"&&e.folder!==null?e.folder.id??null:e.folder??null},D=async $=>{const L={name:$.name,caption:$.caption,alternativeText:$.alternativeText,folder:$.folder};if("error"in await i({id:e.id,fileInfo:L})){y({type:"danger",message:s({id:u("asset-details.update.error"),defaultMessage:"Failed to update the file."})});return}y({type:"success",message:s({id:u("asset-details.update.success"),defaultMessage:"File updated"})})},{title:R}=zt(typeof e.folder=="object"&&e.folder!==null?e.folder.id??null:e.folder??null),F=async $=>{const L=await l({id:e.id,file:$});if("error"in L){const U=L.error,Y=U?.data?.error?.message??U?.data?.message??s({id:u("asset-details.replace.error"),defaultMessage:"Failed to replace the file."});y({type:"danger",message:Y});return}y({type:"success",message:s({id:u("asset-details.replace.success"),defaultMessage:"File replaced."})})},B=async()=>{const $=await f(e.id);if("error"in $){const L=$.error,U=L?.data?.error?.message??L?.data?.message??s({id:u("asset-details.delete.error"),defaultMessage:"Failed to delete the asset."});y({type:"danger",message:U});return}a({type:"success",message:s({id:u("asset-details.delete.success"),defaultMessage:"1 element have been deleted from {folderName}"},{folderName:R})}),n()},A=()=>{y({type:"danger",message:s({id:u("asset-details.crop.error"),defaultMessage:"Failed to crop the file."})})},G=async($,L)=>{if(h(!1),"error"in await l({id:e.id,file:$,fileInfo:{focalPoint:L}})){A();return}y({type:"success",message:s({id:u("asset-details.crop.success"),defaultMessage:"File cropped."})})},k=async($,L)=>{if(h(!1),"error"in await p({file:$,fileInfo:{name:e.name,caption:e.caption??"",alternativeText:e.alternativeText??"",folder:w.folder,focalPoint:L}})){A();return}y({type:"success",message:s({id:u("asset-details.crop.copy-success"),defaultMessage:"Copy created."})})},O=d.useMemo(()=>({replaceAsset:F,deleteAsset:B,isReplacing:g,isDeleting:c}),[g,c]);return t.jsx(Vt.Provider,{value:y,children:t.jsx(Wt.Provider,{value:O,children:t.jsx(Pr,{children:t.jsx(En,{method:"POST",initialValues:w,onSubmit:D,children:({modified:$,isSubmitting:L,values:U,resetForm:Y})=>{const q=(U.name??"").trim()==="",se=Or({isDeleting:c,isReplacing:g,isCropCopying:j});return t.jsxs(t.Fragment,{children:[t.jsx(Fn,{onProceed:Y}),m&&M?t.jsx(Dr,{asset:e,onClose:()=>h(!1),onApply:G,onSaveAsCopy:k}):null,se?t.jsx(Nr,{children:t.jsx(ce,{children:s(se)})}):null,x?t.jsx(Lr,{children:t.jsx(mt,{variant:x.type==="success"?"success":"danger",closeLabel:s({id:"global.close",defaultMessage:"Close"}),onClose:()=>b(null),children:x.message})}):null,t.jsxs(oe.ScrollableContent,{children:[t.jsx(Fr,{asset:e,actions:M?t.jsx(Hr,{onCrop:()=>h(!0)}):null}),t.jsxs(C,{direction:"column",alignItems:"stretch",gap:4,paddingTop:4,paddingBottom:4,paddingLeft:5,paddingRight:5,children:[t.jsx(I,{variant:"beta",fontWeight:"semiBold",tag:"h3",children:s({id:u("asset-details.fileInfo"),defaultMessage:"File info"})}),t.jsxs(C,{wrap:"wrap",gap:4,background:"neutral100",paddingTop:4,paddingBottom:4,paddingLeft:6,paddingRight:6,alignItems:"flex-start",children:[t.jsx(re,{label:s({id:u("asset-details.creationDate"),defaultMessage:"Creation date"}),value:e.createdAt?r(new Date(e.createdAt),{dateStyle:"long",timeStyle:"short"}):null}),t.jsx(re,{label:s({id:u("asset-details.lastUpdated"),defaultMessage:"Last updated"}),value:e.updatedAt?r(new Date(e.updatedAt),{dateStyle:"long",timeStyle:"short"}):null}),t.jsx(re,{label:s({id:u("asset-details.createdBy"),defaultMessage:"Created by"}),value:e.createdBy?ls({firstname:e.createdBy.firstname??void 0,lastname:e.createdBy.lastname??void 0,username:e.createdBy.username??void 0,email:e.createdBy.email??void 0})??"-":null}),t.jsx(re,{label:s({id:u("asset-details.size"),defaultMessage:"Size"}),value:e.size?Oe(e.size,1):null}),M&&(e.width!=null||e.height!=null)&&t.jsx(re,{label:s({id:u("asset-details.dimensions"),defaultMessage:"Dimensions"}),value:e.width!=null&&e.height!=null?`${e.width} × ${e.height}`:null}),t.jsx(re,{label:s({id:u("asset-details.extension"),defaultMessage:"Extension"}),value:pt(e.ext)}),t.jsx(re,{label:s({id:u("asset-details.assetId"),defaultMessage:"Asset ID"}),value:String(e.id)})]}),t.jsx(Le,{name:"name",label:s({id:u("asset-details.fileName"),defaultMessage:"File name"}),required:!0}),t.jsx(Br,{label:s({id:u("asset-details.location"),defaultMessage:"Location"}),rootLabel:s({id:u("plugin.home"),defaultMessage:"Home"}),folders:o}),M&&t.jsxs(t.Fragment,{children:[t.jsx(Le,{name:"caption",label:s({id:u("asset-details.caption"),defaultMessage:"Caption"})}),t.jsx(Le,{name:"alternativeText",label:s({id:u("asset-details.alternativeText"),defaultMessage:"Alternative text"})})]})]})]}),t.jsxs(C,{justifyContent:"space-between",alignItems:"center",gap:2,padding:3,borderColor:"neutral150",borderStyle:"solid",borderWidth:"1px 0 0 0",background:"neutral0",children:[t.jsxs(C,{gap:2,children:[t.jsx(Gr,{}),t.jsx(Ur,{asset:e}),t.jsx(zr,{asset:e})]}),t.jsx(H,{type:"submit",variant:"default",loading:L,disabled:!$||L||q,children:s({id:u("asset-details.save"),defaultMessage:"Save changes"})})]})]})}},e.id)})})})},qr=({asset:e,closeDetails:n})=>{const s=e?xe(e.mime,e.ext):$n;return t.jsxs(C,{gap:2,paddingLeft:5,paddingTop:3,paddingBottom:3,paddingRight:3,borderColor:"neutral150",borderStyle:"solid",borderWidth:"0 0 1px 0",children:[t.jsx(s,{width:20,height:20}),t.jsx(oe.Title,{asChild:!0,children:t.jsx(I,{variant:"omega",fontWeight:"semiBold",overflow:"hidden",ellipsis:!0,tag:"h2",children:e.name})}),t.jsx(P,{marginLeft:"auto",children:t.jsx(oe.CloseButton,{onClose:n,children:t.jsx(Tn,{})})})]})},Kr=({assetId:e,closeDetails:n})=>{const{formatMessage:s}=T(),{data:r,isLoading:o,error:a}=rr(e,{refetchOnMountOrArgChange:!1,refetchOnReconnect:!1,refetchOnFocus:!1});return o?t.jsx(C,{justifyContent:"center",padding:8,children:t.jsx(ce,{children:s({id:"app.loading",defaultMessage:"Loading..."})})}):a||!r?t.jsx(C,{direction:"column",alignItems:"stretch",gap:4,padding:4,children:t.jsx(mt,{variant:"danger",closeLabel:s({id:"global.close",defaultMessage:"Close"}),onClose:n,children:s({id:u("asset-details.error"),defaultMessage:"Failed to load file details."})})}):t.jsxs(t.Fragment,{children:[t.jsx(qr,{asset:r,closeDetails:n}),t.jsx(Wr,{asset:r,closeDetails:n})]})},Qr=()=>{const{formatMessage:e}=T(),{assetId:n,isVisible:s,shouldRenderDrawer:r,onCloseAnimationEnd:o,closeDetails:a}=Kt();return!r||n===null?null:t.jsxs(oe.Root,{isVisible:s,onClose:a,children:[t.jsx("div",{children:t.jsxs(he,{children:[t.jsx(oe.Title,{children:e({id:u("asset-details.title"),defaultMessage:"File details"})}),t.jsx(oe.Description,{children:e({id:u("asset-details.description"),defaultMessage:"Displays file information and metadata"})})]})}),t.jsx(oe.Body,{animationDirection:"left",width:"41.6rem",height:"100vh",onAnimationEnd:o,children:t.jsx(Kr,{assetId:n,closeDetails:a})})]})},Yr=e=>{if(!e)return null;const n=Number(e);return Number.isFinite(n)?n:null},Ye=()=>{const[{query:e},n]=ht(),s=Yr(e?.folder),r=i=>{n({folder:String(i.id)})},o=d.useCallback(()=>{n({folder:""},"remove")},[n]);return d.useEffect(()=>{e?.folder&&s===null&&o()},[e?.folder,s,o]),{currentFolderId:s,navigateToFolder:r,navigateToRoot:o,navigateToFolderId:i=>{i==null?o():n({folder:String(i)})}}},Zr=e=>{const n=[],s=[];for(const r of e)r.kind==="file"?n.push(r.id):s.push(r.id);return{fileIds:n,folderIds:s}},Qt=(e,n)=>{for(const s of e){if(s.id===n)return s;const r=Qt(s.children,n);if(r)return r}return null},Xr=e=>{const n=new Set,s=r=>{for(const o of r.children)o.id!=null&&n.add(o.id),s(o)};return s(e),n},Jr=(e,n,s)=>{if(n===s)return!0;const r=Qt(e,n);return r?Xr(r).has(s):!1},Ue=({items:e,targetFolderId:n,folderStructure:s})=>{if(e.length===0)return!1;const r=new Set(e.filter(o=>o.kind==="folder").map(o=>o.id));if(r.has(n))return!1;for(const o of r)if(Jr(s,o,n))return!1;for(const o of e)if(o.kind==="file"&&o.folderId===n||o.kind==="folder"&&o.parentId===n)return!1;return!0},eo=e=>typeof e=="string"&&e.length>0,to=(e,n)=>{if(!e||typeof e!="object")return n;const s=e,r=[s.data?.error?.message,s.data?.message,s.message];for(const o of r)if(eo(o))return o;return n},no=e=>`file:${e}`,so=e=>`folder:${e}`,ro=e=>`folder-target:${e}`,at=e=>{if(typeof e!="string")return null;const n=/^folder-target:(\d+)$/.exec(e);return n?Number(n[1]):null},oo=v(C)`
  align-items: center;
  gap: ${({theme:e})=>e.spaces[2]};
  padding: ${({theme:e})=>`${e.spaces[2]} ${e.spaces[3]}`};
  border-radius: ${({theme:e})=>e.borderRadius};
  background: ${({theme:e})=>e.colors.primary100};
  box-shadow: ${({theme:e})=>e.shadows.tableShadow};
  cursor: grabbing;
  max-width: 24rem;
`,ao=({item:e})=>{const n=e.kind==="folder"?ue:Ne;return t.jsxs(oo,{children:[t.jsx(n,{width:20,height:20}),t.jsx(I,{textColor:"neutral800",fontWeight:"semiBold",ellipsis:!0,children:e.name})]})},Yt=d.createContext(null),ne=()=>d.useContext(Yt),it=e=>e?[e]:[],io=({children:e})=>{const{formatMessage:n}=T(),{toggleNotification:s}=Se(),{data:r=[]}=Qe(),[o,{isLoading:a}]=nr(),[i,l]=d.useState(null),[g,f]=d.useState(""),c=d.useCallback(y=>{f(""),requestAnimationFrame(()=>f(y))},[]),p=ds(cs(fs,{activationConstraint:{distance:8}})),j=d.useMemo(()=>({isInternalDragActive:i!==null,isMovePending:a}),[i,a]),m=d.useCallback(y=>{const M=y.active.data.current;l(M??null)},[]),h=d.useCallback(async y=>{const{active:M,over:w}=y;if(l(null),a||!w)return;const D=at(w.id),R=M.data.current;if(D==null||!R)return;const F=it(R);if(!Ue({items:F,targetFolderId:D,folderStructure:r}))return;const B=Zr(F),A=n({id:u("modal.move.success-label"),defaultMessage:"Elements have been moved successfully."}),G=n({id:u("modal.move.error-label"),defaultMessage:"An error occurred while moving the elements."});try{await o({...B,destinationFolderId:D}).unwrap(),c(A),s({type:"success",message:A})}catch(k){const O=to(k,G);c(n({id:u("dnd.announce.move-failure"),defaultMessage:"Move failed. {message}"},{message:O})),s({type:"danger",message:O})}},[c,o,r,n,a,s]),x=d.useCallback(()=>{l(null)},[]),b=d.useMemo(()=>({onDragStart:({active:y})=>{const M=y.data.current;return M?n({id:u("dnd.announce.drag-start"),defaultMessage:"Picked up {name}. Drop on a folder to move."},{name:M.name}):""},onDragOver:()=>"",onDragEnd:({active:y,over:M})=>{if(!M)return n({id:u("dnd.announce.cancel"),defaultMessage:"Drag cancelled."});const w=at(M.id),D=y.data.current;if(w==null||!D)return"";const R=it(D);return Ue({items:R,targetFolderId:w,folderStructure:r})?"":n({id:u("dnd.announce.invalid-drop"),defaultMessage:"Cannot move item to this folder."})},onDragCancel:()=>n({id:u("dnd.announce.cancel"),defaultMessage:"Drag cancelled."})}),[r,n]);return t.jsx(Yt.Provider,{value:j,children:t.jsxs(us,{sensors:p,collisionDetection:gs,onDragStart:m,onDragEnd:h,onDragCancel:x,accessibility:{announcements:b},children:[t.jsx(he,{"aria-live":"polite","aria-atomic":"true",children:g}),t.jsx(P,{position:"relative",children:e}),t.jsx(ps,{dropAnimation:null,children:i?t.jsx(ao,{item:i}):null})]})})},Zt=e=>{const{isMovePending:n}=ne()??{isMovePending:!1},s=d.useMemo(()=>({kind:"file",id:e.id,name:e.name,folderId:e.folder==null?null:typeof e.folder=="number"?e.folder:Number(e.folder)||null}),[e.folder,e.id,e.name]);return Ct({id:no(e.id),data:s,disabled:n})},Xt=e=>{const{isMovePending:n}=ne()??{isMovePending:!1},{active:s}=hs(),{data:r=[]}=Qe(),o=typeof e.parent=="object"&&e.parent!=null?e.parent.id??null:e.parent??null,a=d.useMemo(()=>({kind:"folder",id:e.id,name:e.name,parentId:o}),[e.id,e.name,o]),i=d.useMemo(()=>({kind:"folder-target",id:e.id,name:e.name}),[e.id,e.name]),l=Ct({id:so(e.id),data:a,disabled:n}),g=ms({id:ro(e.id),data:i,disabled:n}),f=s?.data.current,c=d.useMemo(()=>!f||f.id===e.id&&f.kind==="folder"?!1:Ue({items:[f],targetFolderId:e.id,folderStructure:r}),[f,e.id,r]),p=g.isOver,j=p&&c,m=p&&!c&&s!=null;return{dragData:a,draggable:l,droppable:g,isDragging:l.isDragging,showValidDropHighlight:j,showInvalidDropCursor:m}},lo=v(Bn)`
  border: 1px solid ${({theme:e})=>e.colors.neutral200};
  border-radius: 8px;
  overflow: hidden;
  cursor: ${({$isMovePending:e})=>e?"wait":"pointer"};
  opacity: ${({$isDragging:e})=>e?.4:1};
  pointer-events: ${({$isMovePending:e})=>e?"none":"auto"};

  &:hover {
    background: ${({theme:e})=>e.colors.primary100};
  }

  &:focus-visible {
    outline: 2px solid ${({theme:e})=>e.colors.primary600};
    outline-offset: 2px;
  }
`,co=v(P)`
  grid-column: 1 / -1;
`,uo=v(C)`
  width: 100%;
  padding: ${({theme:e})=>`${e.spaces[2]} ${e.spaces[3]}`}; // 8px 12px
  align-items: center;
  gap: ${({theme:e})=>e.spaces[2]}; // 8px
  border: 1px solid ${({theme:e})=>e.colors.neutral200};
  border-radius: ${({theme:e})=>e.borderRadius};
  background: ${({theme:e})=>e.colors.neutral0};
  cursor: ${({$isMovePending:e,$isInvalidDropTarget:n})=>e?"wait":n?"not-allowed":"pointer"};
  opacity: ${({$isDragging:e})=>e?.4:1};
  pointer-events: ${({$isMovePending:e})=>e?"none":"auto"};
  transition: background 0.2s;

  ${({$isValidDropTarget:e,theme:n})=>e&&jt`
      background: ${n.colors.primary100};
      border: 1px dashed ${n.colors.primary600};
    `}

  &:hover {
    background: ${({theme:e})=>e.colors.primary100};
  }

  &:focus-visible {
    outline: 2px solid ${({theme:e})=>e.colors.primary600};
    outline-offset: 2px;
  }
`,go=v(C)`
  flex-shrink: 0;
  color: ${({theme:e})=>e.colors.neutral600};
`,po=v(I)`
  flex: 1;
  min-width: 0;
`,fo=({folder:e})=>{const{formatMessage:n}=T(),{navigateToFolder:s}=Ye(),{isMovePending:r}=ne()??{isMovePending:!1},{draggable:{attributes:o,listeners:a,setNodeRef:i,isDragging:l},droppable:{setNodeRef:g},showValidDropHighlight:f,showInvalidDropCursor:c}=Xt(e),p=m=>{i(m),g(m)},j=m=>{(m.key==="Enter"||m.key===" ")&&(m.preventDefault(),s(e))};return t.jsxs(uo,{ref:p,...o,...a,$isDragging:l,$isMovePending:r,$isValidDropTarget:f,$isInvalidDropTarget:c,onClick:()=>s(e),onKeyDown:j,role:"listitem",tabIndex:0,children:[t.jsx(go,{children:t.jsx(ue,{width:20,height:20})}),t.jsx(po,{textColor:"neutral800",ellipsis:!0,children:e.name}),t.jsx(Q,{label:n({id:u("control-card.more-actions"),defaultMessage:"More actions"}),variant:"ghost",onClick:m=>m.stopPropagation(),children:t.jsx(Re,{})})]})},lt=v(P)`
  position: relative;
  width: 100%;
  padding-bottom: 62.5%;
  height: 0;
  overflow: hidden;
  background: repeating-conic-gradient(
      ${({theme:e})=>e.colors.neutral100} 0% 25%,
      transparent 0% 50%
    )
    50% / 20px 20px;
`,ho=v.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`,mo=v(C)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: ${({theme:e})=>e.colors.neutral500};
  background: ${({theme:e})=>e.colors.neutral100};
`,xo=({asset:e})=>{const{alternativeText:n,ext:s,formats:r,mime:o,url:a,isLocal:i,isUrlSigned:l}=e;if(o?.includes(ee.Image)){const f=ie(r?.thumbnail?.url)??ie(a);if(f)return t.jsx(lt,{children:t.jsx(ho,{src:f,alt:n||"",crossOrigin:!i&&l?"anonymous":void 0,draggable:!1,onDragStart:c=>c.preventDefault()})})}const g=xe(o,s);return t.jsx(lt,{children:t.jsx(mo,{justifyContent:"center",alignItems:"center",children:t.jsx(g,{width:48,height:48})})})},bo=v(Gn)`
  border-bottom: 1px solid ${({theme:e})=>e.colors.neutral200};
`,vo=v(C)`
  min-width: 0;
  width: 100%;
`,yo=v(C)`
  color: ${({theme:e})=>e.colors.neutral600};
  flex-shrink: 0;
`,jo=v(I)`
  flex: 1;
  min-width: 0;
`,wo=({asset:e,onAssetItemClick:n})=>{const{formatMessage:s}=T(),r=xe(e.mime,e.ext),{isMovePending:o}=ne()??{isMovePending:!1},{attributes:a,listeners:i,setNodeRef:l,isDragging:g}=Zt(e),f=c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),n(e.id))};return t.jsxs(lo,{ref:l,...a,...i,$isDragging:g,$isMovePending:o,tabIndex:0,role:"listitem",onDragStart:c=>c.preventDefault(),onClick:()=>n(e.id),onKeyDown:f,children:[t.jsx(bo,{children:t.jsx(xo,{asset:e})}),t.jsx(_n,{children:t.jsxs(vo,{alignItems:"center",gap:2,children:[t.jsx(yo,{children:t.jsx(r,{width:20,height:20})}),t.jsx(jo,{textColor:"primary800",ellipsis:!0,children:e.name}),t.jsx(Q,{label:s({id:u("control-card.more-actions"),defaultMessage:"More actions"}),variant:"ghost",onClick:c=>c.stopPropagation(),children:t.jsx(Re,{})})]})})]})},Co=({assets:e,folders:n=[],onAssetItemClick:s})=>n.length+e.length===0?null:t.jsxs(be.Root,{gap:4,role:"list","data-testid":"assets-grid",children:[n.length>0&&t.jsx(co,{children:t.jsx(be.Root,{gap:4,children:n.map(o=>t.jsx(be.Item,{col:3,m:4,s:6,xs:12,children:t.jsx(fo,{folder:o})},`folder-${o.id}`))})}),e.map(o=>t.jsx(be.Item,{col:3,m:4,s:6,xs:12,direction:"column",alignItems:"stretch",children:t.jsx(wo,{asset:o,onAssetItemClick:s})},o.id))]}),Mo={view:"STRAPI_UPLOAD_LIBRARY_VIEW"},pe={GRID:0,TABLE:1},dt=[{name:"name",label:{id:u("list.table.header.name"),defaultMessage:"name"}},{name:"createdAt",label:{id:u("list.table.header.creationDate"),defaultMessage:"creation date"}},{name:"updatedAt",label:{id:u("list.table.header.lastModified"),defaultMessage:"last modified"}},{name:"size",label:{id:u("list.table.header.size"),defaultMessage:"size"}},{name:"actions",label:{id:u("list.table.header.actions"),defaultMessage:"actions"},isVisuallyHidden:!0}],Do=v(Vn)`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid ${({theme:e})=>e.colors.neutral150};
  border-radius: 4px;
  overflow: hidden;
`,Io=v(Hn)`
  background: ${({theme:e})=>e.colors.neutral100};

  tr {
    border-bottom: 1px solid ${({theme:e})=>e.colors.neutral150};
  }
`,ct=v(Wn)`
  height: 40px;
  padding: 0 ${({theme:e})=>e.spaces[4]};
  text-align: left;
`,K=v(qn)`
  padding: 0 ${({theme:e})=>e.spaces[4]};
  border-bottom: 1px solid ${({theme:e})=>e.colors.neutral150};
`,Jt=v.tr`
  height: 48px;
  background: ${({theme:e})=>e.colors.neutral0};
  cursor: ${({$isMovePending:e,$isInvalidDropTarget:n})=>e?"wait":n?"not-allowed":"pointer"};
  opacity: ${({$isDragging:e})=>e?.4:1};
  pointer-events: ${({$isMovePending:e})=>e?"none":"auto"};

  ${({$isValidDropTarget:e,theme:n})=>e&&jt`
      background: ${n.colors.primary100};
      outline: 1px dashed ${n.colors.primary600};
      outline-offset: -1px;
    `}

  &:hover {
    background: ${({theme:e})=>e.colors.primary100};
  }

  &:focus-visible {
    outline: 2px solid ${({theme:e})=>e.colors.primary600};
    outline-offset: -2px;
  }

  &:last-child {
    ${K} {
      border-bottom: 0;
    }
  }
`,So=({asset:e})=>{const{ext:n,mime:s}=e,r=xe(s,n);return t.jsx(C,{justifyContent:"center",alignItems:"center",borderRadius:"4px",color:"neutral500",width:"3.2rem",height:"3.2rem",shrink:0,children:t.jsx(r,{width:20,height:20})})},Ro=({asset:e,onAssetItemClick:n})=>{const s=We(),{formatDate:r,formatMessage:o}=T(),{isMovePending:a}=ne()??{isMovePending:!1},{attributes:i,listeners:l,setNodeRef:g,isDragging:f}=Zt(e),c=p=>{(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),n(e.id))};return t.jsxs(Jt,{ref:g,...i,...l,$isDragging:f,$isMovePending:a,tabIndex:0,role:"row",onDragStart:p=>p.preventDefault(),onClick:()=>n(e.id),onKeyDown:c,children:[t.jsx(K,{children:t.jsxs(C,{gap:3,alignItems:"center",children:[t.jsx(So,{asset:e}),t.jsxs(C,{direction:"column",alignItems:"flex-start",children:[t.jsx(I,{textColor:"neutral800",fontWeight:"semiBold",ellipsis:!0,children:e.name}),s&&t.jsx(I,{textColor:"neutral600",variant:"pi",children:e.size?Oe(e.size,1):"-"})]})]})}),!s&&t.jsxs(t.Fragment,{children:[t.jsx(K,{children:t.jsx(I,{textColor:"neutral600",children:e.createdAt?r(new Date(e.createdAt),{dateStyle:"long"}):"-"})}),t.jsx(K,{children:t.jsx(I,{textColor:"neutral600",children:e.updatedAt?r(new Date(e.updatedAt),{dateStyle:"long"}):"-"})}),t.jsx(K,{children:t.jsx(I,{textColor:"neutral600",children:e.size?Oe(e.size,1):"-"})})]}),t.jsx(K,{children:t.jsx(C,{justifyContent:"flex-end",children:t.jsx(Q,{label:o({id:u("control-card.more-actions"),defaultMessage:"More actions"}),variant:"ghost",onClick:p=>p.stopPropagation(),children:t.jsx(Re,{})})})})]})},$o=v(Jt)`
  &:hover {
    background: ${({theme:e})=>e.colors.primary100};
  }
`,To=({folder:e})=>{const n=We(),{formatDate:s,formatMessage:r}=T(),{navigateToFolder:o}=Ye(),{isMovePending:a}=ne()??{isMovePending:!1},{draggable:{attributes:i,listeners:l,setNodeRef:g,isDragging:f},droppable:{setNodeRef:c},showValidDropHighlight:p,showInvalidDropCursor:j}=Xt(e),m=h=>{(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),o(e))};return t.jsxs($o,{ref:h=>{g(h),c(h)},...i,...l,$isDragging:f,$isMovePending:a,$isValidDropTarget:p,$isInvalidDropTarget:j,tabIndex:0,role:"row",onDragStart:h=>h.preventDefault(),onClick:()=>o(e),onKeyDown:m,children:[t.jsx(K,{children:t.jsxs(C,{gap:3,alignItems:"center",children:[t.jsx(C,{justifyContent:"center",alignItems:"center",borderRadius:"4px",color:"neutral600",width:"3.2rem",height:"3.2rem",shrink:0,children:t.jsx(ue,{width:20,height:20})}),t.jsx(I,{textColor:"neutral800",fontWeight:"semiBold",ellipsis:!0,children:e.name})]})}),!n&&t.jsxs(t.Fragment,{children:[t.jsx(K,{children:t.jsx(I,{textColor:"neutral600",children:e.createdAt?s(new Date(e.createdAt),{dateStyle:"long"}):"-"})}),t.jsx(K,{children:t.jsx(I,{textColor:"neutral600",children:e.updatedAt?s(new Date(e.updatedAt),{dateStyle:"long"}):"-"})}),t.jsx(K,{children:t.jsx(I,{textColor:"neutral600",children:"-"})})]}),t.jsx(K,{children:t.jsx(C,{justifyContent:"flex-end",children:t.jsx(Q,{label:r({id:u("control-card.more-actions"),defaultMessage:"More actions"}),variant:"ghost",onClick:h=>h.stopPropagation(),children:t.jsx(Re,{})})})})]})},Ao=({assets:e,folders:n=[],onAssetItemClick:s})=>{const r=We(),{formatMessage:o}=T(),a=r?dt.filter(l=>l.name==="name"||l.name==="actions"):dt,i=n.length+e.length;return i===0?null:t.jsxs(Do,{colCount:a.length,rowCount:i+1,children:[t.jsx(Io,{children:t.jsx(Un,{children:a.map(l=>{const g=o(l.label);return"isVisuallyHidden"in l&&l.isVisuallyHidden?t.jsx(ct,{children:t.jsx(he,{children:o({id:u("table.header.actions"),defaultMessage:"actions"})})},l.name):t.jsx(ct,{children:t.jsx(I,{textColor:"neutral600",variant:"sigma",children:g})},l.name)})})}),t.jsxs(zn,{children:[n.map(l=>t.jsx(To,{folder:l},`folder-${l.id}`)),e.map(l=>t.jsx(Ro,{asset:l,onAssetItemClick:s},l.id))]})]})},Eo=v(W.Content)`
  max-width: 51.6rem;
`,Fo=({open:e,folderName:n,parentFolderId:s,onClose:r})=>{const{formatMessage:o}=T(),{toggleNotification:a}=Se(),[i,l]=d.useState(""),[g,f]=d.useState(),[c,{isLoading:p}]=Js();d.useEffect(()=>{e&&(l(""),f(void 0))},[e]);const j=async m=>{m.preventDefault();const h=i.trim();if(!h){f(o({id:u("folder.create.form.error.name-required"),defaultMessage:"Name is required"}));return}try{await c({name:h,parent:s}).unwrap(),a({type:"success",message:o({id:u("folder.create.success"),defaultMessage:"Folder has been created"})}),r()}catch(x){const b=x;b?.message?f(b.message):a({type:"danger",message:o({id:u("folder.create.form.error.unknown"),defaultMessage:"An error occurred while creating the folder"})})}};return t.jsx(W.Root,{open:e,onOpenChange:r,children:t.jsxs(Eo,{children:[t.jsx(W.Header,{children:t.jsx(W.Title,{children:o({id:u("folder.create.title-in"),defaultMessage:"New folder in {folderName}"},{folderName:n})})}),t.jsxs("form",{onSubmit:j,children:[t.jsx(W.Body,{children:t.jsxs(V.Root,{error:g,name:"name",required:!0,children:[t.jsx(V.Label,{children:o({id:u("folder.form.name.label"),defaultMessage:"Folder name"})}),t.jsx(bt,{value:i,onChange:m=>{l(m.target.value),f(void 0)},autoFocus:!0}),t.jsx(V.Error,{})]})}),t.jsx(W.Footer,{children:t.jsxs(C,{gap:2,justifyContent:"space-between",width:"100%",children:[t.jsx(H,{variant:"tertiary",onClick:r,type:"button",children:o({id:"app.components.Button.cancel",defaultMessage:"Cancel"})}),t.jsx(H,{type:"submit",loading:p,children:o({id:u("folder.create.submit"),defaultMessage:"Create folder"})})]})})]})]})})},en=d.createContext(null),ko=v(P)`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
`,Po=({children:e,onDrop:n})=>{const[s,r]=d.useState(!1),o=d.useRef(0),a={isDragging:s};d.useEffect(()=>{const c=()=>{r(!1),o.current=0},p=j=>{j.relatedTarget||(r(!1),o.current=0)};return document.addEventListener("dragend",c),document.addEventListener("dragleave",p),()=>{document.removeEventListener("dragend",c),document.removeEventListener("dragleave",p)}},[]);const i=d.useCallback(c=>{c.preventDefault(),c.stopPropagation(),c.dataTransfer.types.includes("Files")&&(o.current+=1,r(!0))},[]),l=d.useCallback(c=>{c.preventDefault(),c.stopPropagation(),o.current-=1,o.current<=0&&(r(!1),o.current=0)},[]),g=d.useCallback(c=>{c.preventDefault(),c.stopPropagation(),c.dataTransfer.dropEffect="copy"},[]),f=d.useCallback(c=>{c.preventDefault(),c.stopPropagation(),r(!1),o.current=0;const{files:p}=c.dataTransfer;p?.length&&n&&n(Array.from(p))},[n]);return t.jsx(en.Provider,{value:a,children:t.jsx(ko,{"data-testid":"assets-dropzone",onDragEnter:i,onDragLeave:l,onDragOver:g,onDrop:f,children:e})})},tn=()=>{const e=d.useContext(en);if(!e)throw new Error("useUploadDropZone must be used within UploadDropZone");return{isDragging:e.isDragging}},Lo=(e,n)=>`${e}${Math.floor(n*255).toString(16).padStart(2,"0")}`,No=v(P)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({theme:e})=>Lo(e.colors.primary200,.3)};
  border: 1px solid ${({theme:e})=>e.colors.primary700};
  border-radius: ${({theme:e})=>e.borderRadius};
  z-index: 1;
  pointer-events: none;
`,Oo=({children:e})=>{const{isDragging:n}=tn(),r=ne()?.isInternalDragActive??!1,o=n&&!r;return t.jsxs(P,{position:"relative",children:[o&&t.jsx(No,{}),e]})},_o=v(P)`
  position: fixed;
  bottom: ${({theme:e})=>e.spaces[8]};
  left: 50%;
  transform: translateX(calc(-50% + ${({$leftContentWidth:e})=>e/2}px));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({theme:e})=>e.spaces[2]};
  background: ${({theme:e})=>e.colors.primary600};
  padding: ${({theme:e})=>e.spaces[4]} ${({theme:e})=>e.spaces[6]};
  border-radius: ${({theme:e})=>e.borderRadius};
  z-index: 2;
`,Bo=({uploadDropZoneRef:e,folderName:n})=>{const{formatMessage:s}=T(),{isDragging:r}=tn(),a=ne()?.isInternalDragActive??!1,i=r&&!a,[l,g]=d.useState(0);return d.useEffect(()=>{if(!e?.current)return;const f=()=>{const p=e.current?.getBoundingClientRect();p&&g(j=>j!==p.left?p.left:j)};f();const c=new ResizeObserver(f);return c.observe(e.current),()=>c.disconnect()},[e]),i?t.jsxs(_o,{$leftContentWidth:l,children:[t.jsx(I,{textColor:"neutral0",children:s({id:u("dropzone.upload.message"),defaultMessage:"Drop here to upload to"})}),t.jsxs(C,{gap:2,alignItems:"center",children:[t.jsx(ue,{width:20,height:20,fill:"neutral0"}),t.jsx(I,{textColor:"neutral0",fontWeight:"semiBold",children:n})]})]}):null},Go=({onAddAssets:e})=>{const{formatMessage:n}=T();return t.jsxs(C,{direction:"column",alignItems:"center",gap:6,padding:11,children:[t.jsx(Kn,{width:"16rem",height:"8.8rem"}),t.jsxs(C,{direction:"column",alignItems:"center",gap:2,textAlign:"center",children:[t.jsx(I,{variant:"delta",tag:"p",fontWeight:"bold",textColor:"neutral800",children:n({id:u("list.empty.title"),defaultMessage:"No assets yet"})}),t.jsx(I,{textColor:"neutral600",children:n({id:u("list.empty.description"),defaultMessage:"Get started by uploading assets or creating a folder."})})]}),t.jsx(H,{onClick:e,children:n({id:u("list.empty.add-assets"),defaultMessage:"Add assets"})})]})},nn=v.button`
  display: flex;
  align-items: center;
  gap: ${({theme:e})=>e.spaces[2]};
  width: 100%;
  min-height: 3.2rem;
  padding: ${({theme:e})=>`${e.spaces[1]} ${e.spaces[2]}`};
  border: 0;
  background: ${({$isActive:e,theme:n})=>e?n.colors.primary100:"transparent"};
  color: ${({$isActive:e,theme:n})=>e?n.colors.primary700:n.colors.neutral800};
  border-radius: ${({theme:e})=>e.borderRadius};
  cursor: pointer;
  text-align: left;
  font: inherit;

  &:hover {
    background: ${({$isActive:e,theme:n})=>e?n.colors.primary100:n.colors.neutral100};
  }

  &:focus-visible {
    outline: 2px solid ${({theme:e})=>e.colors.primary600};
    outline-offset: -2px;
  }
`,sn=(e,n,s=[])=>{for(const r of e){if(r.id===n)return s;if(r.children?.length){const o=r.id!=null?[...s,r.id]:s,a=sn(r.children,n,o);if(a!==null)return a}}return null},Uo=(e,n)=>{const[s,r]=d.useState(()=>new Set);d.useEffect(()=>{if(n==null)return;const i=sn(e,n);!i||i.length===0||r(l=>{const g=new Set(l);let f=!1;for(const c of i)g.has(c)||(g.add(c),f=!0);return f?g:l})},[e,n]);const o=d.useCallback(i=>{r(l=>{const g=new Set(l);return g.has(i)?g.delete(i):g.add(i),g})},[]);return{isExpanded:d.useCallback(i=>s.has(i),[s]),toggleExpanded:o}},zo=({name:e,isActive:n})=>{const s=d.useRef(null),[r,o]=d.useState(!1);d.useLayoutEffect(()=>{const i=s.current;if(!i)return;const l=()=>{o(i.scrollWidth>i.clientWidth)};l();const g=new ResizeObserver(l);return g.observe(i),()=>g.disconnect()},[e]);const a=t.jsx(I,{ref:s,variant:"omega",fontWeight:n?"semiBold":"regular",ellipsis:!0,children:e});return r?t.jsx(vt,{label:e,children:a}):a},rn=v.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`,Vo=1.6,Ho=v(wt)`
  transform: rotate(${({$expanded:e})=>e?"0deg":"-90deg"});
  transition: transform 0.2s ease;
`,on=({node:e,level:n,currentFolderId:s,isExpanded:r,onToggle:o,onSelect:a})=>{const{formatMessage:i}=T();if(e.id==null)return null;const l=e.id,g=e.name??"",f=(e.children?.length??0)>0,c=r(l),p=s===l;return t.jsxs("li",{children:[t.jsxs(C,{alignItems:"center",paddingLeft:`${n*Vo}rem`,gap:1,children:[t.jsx(Q,{label:i({id:u(c?"sidebar.tree.collapse":"sidebar.tree.expand"),defaultMessage:c?"Collapse {name}":"Expand {name}"},{name:g}),onClick:j=>{j.stopPropagation(),o(l)},variant:"ghost",withTooltip:!1,"aria-expanded":c,children:t.jsx(Ho,{$expanded:c,fill:"neutral500"})}),t.jsx(P,{flex:"1",minWidth:0,children:t.jsx(nn,{type:"button",$isActive:p,"aria-current":p?"page":void 0,onClick:()=>a(l),"data-testid":`folder-tree-node-${l}`,"data-folder-id":l,children:t.jsx(zo,{name:g,isActive:p})})})]}),f&&c&&t.jsx(rn,{children:e.children.map(j=>t.jsx(on,{node:j,level:n+1,currentFolderId:s,isExpanded:r,onToggle:o,onSelect:a},j.id??j.name))})]})},Wo=v(C)`
  /* TODO: reconcile 25.6rem (Figma) with admin WIDTH_SIDE_NAVIGATION (23.2rem) */
  width: 25.6rem;
  height: 100%;
  min-height: 100%;
  background: ${({theme:e})=>e.colors.neutral0};
  flex-shrink: 0;
  flex-direction: column;
  border-right: 1px solid ${({theme:e})=>e.colors.neutral150};
`,qo=v(P)`
  flex-shrink: 0;
  border-bottom: 1px solid ${({theme:e})=>e.colors.neutral150};
`,Ko=v(C)`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`,Qo=({currentFolderId:e,onSelectFolder:n})=>{const{formatMessage:s}=T(),{data:r=[],isLoading:o,isError:a}=Qe(),{isExpanded:i,toggleExpanded:l}=Uo(r,e),g=e==null;return t.jsxs(Wo,{direction:"column",alignItems:"stretch",tag:"nav","aria-label":s({id:u("sidebar.tree.aria-label"),defaultMessage:"Media library folders"}),children:[t.jsx(qo,{paddingTop:4,paddingBottom:4,paddingLeft:5,paddingRight:5,children:t.jsx(I,{variant:"beta",tag:"h2",children:s({id:u("sidebar.title"),defaultMessage:"Media library"})})}),t.jsxs(Ko,{direction:"column",alignItems:"stretch",gap:1,padding:3,children:[t.jsxs(nn,{type:"button",$isActive:g,"aria-current":g?"page":void 0,onClick:()=>n(null),"data-testid":"folder-tree-home",children:[t.jsx(Qn,{"aria-hidden":!0,width:"1.6rem",height:"1.6rem"}),t.jsx(I,{variant:"omega",fontWeight:g?"semiBold":"regular",children:s({id:u("sidebar.home"),defaultMessage:"Home"})})]}),t.jsxs(P,{children:[t.jsxs(C,{alignItems:"center",gap:1,padding:1,children:[t.jsx(ue,{"aria-hidden":!0,width:"1.6rem",height:"1.6rem",fill:"neutral500"}),t.jsx(I,{variant:"sigma",textColor:"neutral600",style:{textTransform:"uppercase"},children:s({id:u("sidebar.folders"),defaultMessage:"Folders"})})]}),o?t.jsx(C,{justifyContent:"center",padding:1,paddingTop:2,children:t.jsx(ce,{children:s({id:u("sidebar.tree.loading"),defaultMessage:"Loading folders..."})})}):a?t.jsx(P,{padding:1,paddingTop:2,children:t.jsx(I,{variant:"pi",textColor:"danger600",children:s({id:u("sidebar.tree.error"),defaultMessage:"Could not load folders."})})}):r.length===0?t.jsx(P,{padding:1,paddingTop:2,children:t.jsx(I,{variant:"pi",textColor:"neutral500",children:s({id:u("sidebar.tree.empty"),defaultMessage:"No folders yet"})})}):t.jsx(rn,{children:r.map(f=>t.jsx(on,{node:f,level:0,currentFolderId:e,isExpanded:i,onToggle:l,onSelect:n},f.id??f.name))})]})]})]})},Yo=({open:e,onClose:n,onUpload:s})=>{const{formatMessage:r}=T(),[o,a]=d.useState(""),[i,l]=d.useState(null),g=()=>{a(""),l(null),n()},f=async c=>{c.preventDefault();const{urls:p,error:j}=Zn(o);if(j){l(j);return}l(null),g(),await s(p)};return t.jsx(W.Root,{open:e,onOpenChange:c=>!c&&g(),children:t.jsx(W.Content,{children:t.jsxs("form",{onSubmit:f,children:[t.jsx(W.Header,{children:t.jsx(W.Title,{children:r({id:u("modal.url.title"),defaultMessage:"Import from URL"})})}),t.jsx(W.Body,{children:t.jsxs(V.Root,{error:i||void 0,hint:r({id:u("input.url.description"),defaultMessage:"Separate your URL links by a carriage return."}),children:[t.jsx(V.Label,{children:r({id:u("input.url.label"),defaultMessage:"URL(s)"})}),t.jsx(Yn,{name:"urls",minHeight:"unset",rows:Math.min(o.split(`
`).length,7),maxHeight:"10.5rem",placeholder:r({id:u("input.url.placeholder"),defaultMessage:"Empty"}),value:o,onChange:c=>{a(c.target.value),l(null)}}),t.jsx(V.Hint,{}),t.jsx(V.Error,{})]})}),t.jsxs(W.Footer,{children:[t.jsx(H,{variant:"tertiary",onClick:g,children:r({id:"app.components.Button.cancel",defaultMessage:"Cancel"})}),t.jsx(H,{type:"submit",children:r({id:u("modal.url.upload"),defaultMessage:"Upload"})})]})]})})})},De=20,Zo=({folder:e=null,sort:n}={})=>{const[s,r]=d.useState(1),o=d.useRef([]),a=d.useRef(!0),{currentData:i,isLoading:l,isFetching:g,error:f}=Ut({folder:e,page:s,pageSize:De,sort:n}),c=i?.pagination,p=d.useMemo(()=>{if(!i)return o.current;const x=i.results;if(s===1)o.current=x;else{const b=(s-1)*De;if(o.current.length<b-De)return o.current;o.current.length<s*De&&(o.current=[...o.current,...x])}return o.current},[i,s]);d.useEffect(()=>{if(a.current){a.current=!1;return}r(1),o.current=[]},[e,n]);const j=c?s<c.pageCount:!1,m=g&&s>1,h=d.useCallback(()=>{r(x=>x+1)},[]);return{assets:p,pagination:c,isLoading:l,isFetchingMore:m,hasNextPage:j,fetchNextPage:h,error:f}},Xo={threshold:.1},Jo=({view:e,folderId:n,onAssetItemClick:s,onAddAssets:r})=>{const{formatMessage:o}=T(),{assets:a,isLoading:i,isFetchingMore:l,hasNextPage:g,fetchNextPage:f,error:c}=Zo({folder:n}),{data:p=[],isLoading:j}=er({parentId:n}),m=e===pe.GRID,h=i||j,x=os(d.useCallback(b=>{b&&g&&!l&&f()},[g,l,f]),Xo);return h?t.jsx(C,{justifyContent:"center",padding:8,children:t.jsx(ce,{children:o({id:"app.loading",defaultMessage:"Loading..."})})}):c?t.jsx(P,{padding:8,children:t.jsx(I,{textColor:"danger600",children:o({id:u("list.assets.error"),defaultMessage:"An error occurred while fetching assets."})})}):p.length===0&&a.length===0?t.jsx(Go,{onAddAssets:r}):t.jsxs(t.Fragment,{children:[m?t.jsx(Co,{folders:p,assets:a,onAssetItemClick:s}):t.jsx(Ao,{assets:a,folders:p,onAssetItemClick:s}),t.jsx("div",{ref:x,style:{height:1}}),l&&t.jsx(C,{justifyContent:"center",padding:4,children:t.jsx(ce,{children:o({id:u("list.assets.loading-more"),defaultMessage:"Loading more assets..."})})})]})},ea=v(Qs)`
  display: flex;
  border: 1px solid ${({theme:e})=>e.colors.neutral200};
  border-radius: ${({theme:e})=>e.borderRadius};
  overflow: hidden;
`,ut=v(Ys)`
  display: flex;
  align-items: center;
  gap: ${({theme:e})=>e.spaces[2]};
  padding: ${({theme:e})=>`${e.spaces[2]} ${e.spaces[4]}`};
  border: none;
  background: ${({theme:e})=>e.colors.neutral0};
  color: ${({theme:e})=>e.colors.neutral800};
  cursor: pointer;
  font-size: ${({theme:e})=>e.fontSizes[1]};
  font-weight: ${({theme:e})=>e.fontWeights.semiBold};

  &:hover {
    background: ${({theme:e})=>e.colors.primary100};
  }

  &[data-state='on'] {
    background: ${({theme:e})=>e.colors.neutral150};
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`,ta=v(P)`
  [data-strapi-header] {
    background: ${({theme:e})=>e.colors.neutral0};

    h1 {
      font-size: 1.8rem;
    }
  }
`,na=()=>{const{formatMessage:e}=T(),{openDetails:n}=Kt(),{currentFolderId:s,navigateToFolderId:r,navigateToRoot:o}=Ye(),{error:a}=Gt({id:s},{skip:s===null});d.useEffect(()=>{a?.name==="NotFoundError"&&o()},[a,o]);const{title:i,itemCount:l}=zt(s),g=e({id:u("header.content.item-count"),defaultMessage:"{count, plural, =1 {# item} other {# items}}"},{count:l}),f=i?`${i} (${g})`:e({id:"app.loading",defaultMessage:"Loading..."}),[c,p]=d.useState(!1),[j,m]=Xn(Mo.view,pe.GRID),h=j===pe.GRID,[x,b]=d.useState(!1),y=d.useRef(null),M=d.useRef(null),[w]=Jn(),[D]=es(),R=async(k,O)=>{if(k.length===0)return;const $=new FormData,L=[];k.forEach(U=>{$.append("files",U),L.push({name:U.name,caption:null,alternativeText:null,folder:O})}),$.append("fileInfo",JSON.stringify(L));try{await w({formData:$,totalFiles:k.length}).unwrap()}catch{}},F=()=>{y.current?.click()},B=async k=>{const O=k.target.files;O&&O.length>0&&await R(Array.from(O),s),k.target.value=""},A=async k=>{await R(k,s)},G=async k=>{try{await D({urls:k,folderId:s}).unwrap()}catch{}};return t.jsxs(t.Fragment,{children:[t.jsx(Po,{onDrop:A,children:t.jsx(io,{children:t.jsx(P,{ref:M,children:t.jsxs(Ae.Root,{minHeight:"100vh",background:"neutral0",sideNav:t.jsx(Qo,{currentFolderId:s,onSelectFolder:r}),children:[t.jsx(he,{children:t.jsx("input",{type:"file",ref:y,onChange:B,multiple:!0})}),t.jsx(ta,{children:t.jsx(Ae.Header,{title:f,primaryAction:t.jsxs(ss,{popoverPlacement:"bottom-end",variant:"default",endIcon:t.jsx(wt,{}),label:e({id:u("new"),defaultMessage:"New"}),children:[t.jsx(Ee,{onSelect:()=>p(!0),startIcon:t.jsx(ue,{}),children:e({id:u("folder.create.title"),defaultMessage:"New folder"})}),t.jsx(Ee,{onSelect:F,startIcon:t.jsx(rs,{}),children:e({id:u("import-files"),defaultMessage:"Import files"})}),t.jsx(Ee,{onSelect:()=>b(!0),startIcon:t.jsx(Ve,{}),children:e({id:u("import-from-url"),defaultMessage:"Import from URL"})})]}),subtitle:t.jsxs(C,{justifyContent:"space-between",alignItems:"center",gap:4,width:"100%",children:[t.jsx(C,{gap:4,alignItems:"center",children:"TODO: Filters and search"}),t.jsxs(C,{gap:4,alignItems:"center",children:[t.jsx(P,{children:"TODO: Sort"}),t.jsxs(ea,{type:"single",value:h?"grid":"table",onValueChange:k=>k&&m(k==="grid"?pe.GRID:pe.TABLE),"aria-label":e({id:u("view.switch.label"),defaultMessage:"View options"}),children:[t.jsxs(ut,{value:"table","aria-label":e({id:u("view.table"),defaultMessage:"Table view"}),children:[t.jsx(ts,{}),e({id:u("view.table"),defaultMessage:"Table view"})]}),t.jsxs(ut,{value:"grid","aria-label":e({id:u("view.grid"),defaultMessage:"Grid view"}),children:[t.jsx(ns,{}),e({id:u("view.grid"),defaultMessage:"Grid view"})]})]})]})]})})}),t.jsx(Ae.Content,{children:t.jsxs(Oo,{children:[t.jsx(Bo,{uploadDropZoneRef:M,folderName:i}),t.jsx(Jo,{view:j,folderId:s,onAssetItemClick:n,onAddAssets:F})]})})]})})})}),t.jsx(Fo,{open:c,folderName:i,parentFolderId:s,onClose:()=>p(!1)}),t.jsx(Yo,{open:x,onClose:()=>b(!1),onUpload:G}),t.jsx(Qr,{})]})},aa=()=>{const{formatMessage:e}=T(),n=e({id:u("plugin.name"),defaultMessage:"Media Library"});return t.jsxs(tt.Main,{children:[t.jsx(tt.Title,{children:n}),t.jsx(as,{children:t.jsx(is,{index:!0,element:t.jsx(na,{})})})]})};export{aa as UnstableMediaLibrary};
