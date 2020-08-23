(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{75:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return c})),r.d(t,"metadata",(function(){return s})),r.d(t,"rightToc",(function(){return i})),r.d(t,"default",(function(){return l}));var n=r(2),o=r(6),a=(r(0),r(91)),c={id:"react",title:"Usage with React"},s={unversionedId:"react/react",id:"react/react",isDocsHomePage:!1,title:"Usage with React",description:"store() factory",source:"@site/docs/react/react.md",permalink:"/rx-store/docs/react/react",editUrl:"https://github.com/rx-store/rx-store/tree/master/apps/rx-store-website/docs/react/react.md",sidebar:"react",previous:{title:"Installation",permalink:"/rx-store/docs/react/react-installation"},next:{title:"Counter App",permalink:"/rx-store/docs/react/guides/counter"}},i=[{value:"store() factory",id:"store-factory",children:[]},{value:"Nesting Stores",id:"nesting-stores",children:[]},{value:"&lt;Manager /&gt; Component",id:"manager--component",children:[]},{value:"Subscribing",id:"subscribing",children:[{value:"useSubscription hook",id:"usesubscription-hook",children:[]},{value:"withSubscription HOC",id:"withsubscription-hoc",children:[]}]},{value:"React Example app",id:"react-example-app",children:[]}],p={rightToc:i};function l(e){var t=e.components,r=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(n.a)({},p,r,{components:t,mdxType:"MDXLayout"}),Object(a.b)("h2",{id:"store-factory"},"store() factory"),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-tsx"}),"import { store } from '@rx-store/react';\n\nconst storeValue = {};\nconst { Manager, context } = store(storeValue);\n")),Object(a.b)("p",null,"You may have one, or multiple stores. You can nest stores. Child stores can share references to parent store's streams, ",Object(a.b)("a",Object(n.a)({parentName:"p"},{href:"../react/api-reference/manager#example-2---dynamic--multiple-child-stores"}),"as shown in the Manager docs"),"."),Object(a.b)("h2",{id:"nesting-stores"},"Nesting Stores"),Object(a.b)("p",null,"Creating a child store essentially seals off the entire sub-tree mounted within the store's ",Object(a.b)("inlineCode",{parentName:"p"},"<Manager />")," component. Other components within the app that are mounted outside of or above where the ",Object(a.b)("inlineCode",{parentName:"p"},"<Manager />")," component are mounted in the tree cannot access the internal RxJS subjects for the child store, nor can they emit values onto them."),Object(a.b)("p",null,"Communication upward works much like a callback prop in React. You must explicitly pass subject(s) and observable(s) down from parent store(s) to child store(s), if you want to allow the child store to communicate up to, or consume streams provided by the parent store(s), respectfully."),Object(a.b)("p",null,'We recommend starting out with one root store, and nesting stores only tactfully after considering the tradeoffs, so as to avoid the pitfalls of unintenionally building a "spider web" of streams with uneccessary complexity. ',Object(a.b)("a",Object(n.a)({parentName:"p"},{href:"../react/api-reference/manager#example-2---dynamic--multiple-child-stores"}),'Read more about nesting stores, to "seal off" a sub-tree'),"."),Object(a.b)("h2",{id:"manager--component"},"<","Manager /",">"," Component"),Object(a.b)("p",null,"You create a store using the ",Object(a.b)("inlineCode",{parentName:"p"},"store()")," factory function, passing in the store value, which is plain javascript object containing RxJs Subjects & Observables. The ",Object(a.b)("inlineCode",{parentName:"p"},"store()")," factory also accepts an optional ",Object(a.b)("a",Object(n.a)({parentName:"p"},{href:"../core/basic-concepts/root-effect"}),"root effect")," as the second argument."),Object(a.b)("p",null,"You get back a ",Object(a.b)("inlineCode",{parentName:"p"},"Manager")," component, and a React context. Wrap your app at the top level, or wrap the part of your app where you want the store to run & be available. If the ",Object(a.b)("inlineCode",{parentName:"p"},"Manager")," unmounts, the store's effect's will all be unsubscribed (torn down). To start out, it's recommended to use the ",Object(a.b)("inlineCode",{parentName:"p"},"Manager")," as shown here, at the top level of your app and re-export the context:"),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-tsx"}),"export const rootContext = context;\n\nexport default = (\n  <Manager>\n    <App />\n  </Manager>;\n)\n")),Object(a.b)("p",null,"Read more about the ",Object(a.b)("a",Object(n.a)({parentName:"p"},{href:"../react/api-reference/manager"}),"<","Manager /",">"," component")," in the API reference."),Object(a.b)("h2",{id:"subscribing"},"Subscribing"),Object(a.b)("h3",{id:"usesubscription-hook"},"useSubscription hook"),Object(a.b)("p",null,"In your components, you can access the store, and subscribe to any observable or subject in your store, using the provided hooks:"),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-tsx"}),"import { useSubscription, useStore } from '@rx-store/react';\n\nfunction Component() {\n  const store = useStore(rootContext);\n\n  // render error / completion information\n  const [next, error, complete] = useSubscription(store.websocketMessage$);\n\n  return (\n    <>\n      Websockets value: {next}\n      Websockets error: {error}\n      Websockets complete: {complete}\n    </>\n  );\n}\n")),Object(a.b)("p",null,"Read more about the ",Object(a.b)("a",Object(n.a)({parentName:"p"},{href:"./api-reference/use-subscription"}),"useSubscription hook")," in the API reference."),Object(a.b)("h3",{id:"withsubscription-hoc"},"withSubscription HOC"),Object(a.b)("p",null,"There is also a ",Object(a.b)("a",Object(n.a)({parentName:"p"},{href:"./api-reference/with-subscription"}),"HOC provided")," if you want to use class based components or do not want to use hooks."),Object(a.b)("h2",{id:"react-example-app"},"React Example app"),Object(a.b)("p",null,"Check out the full ",Object(a.b)("a",Object(n.a)({parentName:"p"},{href:"https://github.com/rx-store/rx-store/tree/master/apps/react-example-counter"}),"example counter app")))}l.isMDXComponent=!0},91:function(e,t,r){"use strict";r.d(t,"a",(function(){return u})),r.d(t,"b",(function(){return d}));var n=r(0),o=r.n(n);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var p=o.a.createContext({}),l=function(e){var t=o.a.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},u=function(e){var t=l(e.components);return o.a.createElement(p.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},m=o.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,a=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=l(r),m=n,d=u["".concat(c,".").concat(m)]||u[m]||b[m]||a;return r?o.a.createElement(d,s(s({ref:t},p),{},{components:r})):o.a.createElement(d,s({ref:t},p))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=r.length,c=new Array(a);c[0]=m;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,c[1]=s;for(var p=2;p<a;p++)c[p]=r[p];return o.a.createElement.apply(null,c)}return o.a.createElement.apply(null,r)}m.displayName="MDXCreateElement"}}]);