import{a as d,j as e,I as n,bC as a,a6 as h,A as m,h as c,v as x}from"./strapi-BHf4CRrB.js";const g=({providers:t,displayAllProviders:r})=>{const{formatMessage:o}=d();return r?e.jsx(n.Root,{gap:4,children:t.map(i=>e.jsx(n.Item,{col:4,xs:12,direction:"column",alignItems:"stretch",children:e.jsx(s,{provider:i})},i.uid))}):t.length>2&&!r?e.jsxs(n.Root,{gap:4,children:[t.slice(0,2).map(i=>e.jsx(n.Item,{col:4,xs:12,direction:"column",alignItems:"stretch",children:e.jsx(s,{provider:i})},i.uid)),e.jsx(n.Item,{col:4,xs:12,direction:"column",alignItems:"stretch",children:e.jsx(a,{label:o({id:"global.see-more"}),children:e.jsx(l,{as:h,to:"/auth/providers",children:e.jsx("span",{"aria-hidden":!0,children:"•••"})})})})]}):e.jsx(u,{justifyContent:"center",children:t.map(i=>e.jsx(s,{provider:i},i.uid))})},u=c(x)`
  & a:not(:first-child):not(:last-child) {
    margin: 0 ${({theme:t})=>t.spaces[2]};
  }
  & a:first-child {
    margin-right: ${({theme:t})=>t.spaces[2]};
  }
  & a:last-child {
    margin-left: ${({theme:t})=>t.spaces[2]};
  }
`,s=({provider:t})=>e.jsx(a,{label:t.displayName,children:e.jsx(l,{href:`${window.strapi.backendURL}/admin/connect/${t.uid}`,children:t.icon?e.jsx("img",{src:t.icon,"aria-hidden":!0,alt:"",height:"32px"}):e.jsx(m,{children:t.displayName})})}),l=c.a`
  width: 13.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4.8rem;
  border: 1px solid ${({theme:t})=>t.colors.neutral150};
  border-radius: ${({theme:t})=>t.borderRadius};
  text-decoration: inherit;
  &:link {
    text-decoration: none;
  }
  color: ${({theme:t})=>t.colors.neutral600};

  ${({theme:t})=>t.breakpoints.initial} {
    width: 100%;
  }
`;export{g as S};
