(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{78:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return s})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return i})),n.d(t,"default",(function(){return u}));var r=n(2),o=n(6),a=(n(0),n(99)),s={id:"getting-started",title:"Getting Started with Rx Store"},c={unversionedId:"introduction/getting-started",id:"introduction/getting-started",isDocsHomePage:!0,title:"Getting Started with Rx Store",description:"Rx Store is a reactive store for frontend UI libraries (such as React), making it easy for you to build your application's logic using RxJs streams. If you are not yet familiar with RxJs, this video is a great introduction!",source:"@site/docs/introduction/core-concepts.md",permalink:"/rx-store/docs/next/",editUrl:"https://github.com/rx-store/rx-store/tree/master/apps/rx-store-website/docs/introduction/core-concepts.md",version:"next",sidebar:"someSidebar",next:{title:"RxJS Concepts",permalink:"/rx-store/docs/next/introduction/rxjs-concepts"}},i=[{value:"Concepts",id:"concepts",children:[{value:"Store",id:"store",children:[]},{value:"Manager",id:"manager",children:[]},{value:"Effects",id:"effects",children:[]},{value:"Components",id:"components",children:[]}]}],p={rightToc:i};function u(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"Rx Store")," is a reactive store for frontend UI libraries (such as React), making it easy for you to build your application's logic using ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"https://rxjs.dev/"}),"RxJs")," streams. If you are not yet familiar with RxJs, ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"https://www.youtube.com/watch?v=ewcoEYS85Co"}),"this video")," is a great introduction!"),Object(a.b)("p",null,"Unlike a state management library, ",Object(a.b)("inlineCode",{parentName:"p"},"Rx Store")," is a stream management library. It is better suited to managing data that changes frequently or in complex ways over time, such as in real-time applications."),Object(a.b)("h2",{id:"concepts"},"Concepts"),Object(a.b)("p",null,"Let's walk through the ",Object(a.b)("inlineCode",{parentName:"p"},"Rx Store")," concepts using some examples:"),Object(a.b)("h3",{id:"store"},"Store"),Object(a.b)("p",null,"In ",Object(a.b)("inlineCode",{parentName:"p"},"Rx Store")," you can have one or many stores. Each store contains a ",Object(a.b)("inlineCode",{parentName:"p"},"value")," object, where you define various ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"/rx-store/docs/next/introduction/rxjs-concepts"}),"subjects"),":"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{}),"{\n  // This stream will emit the latest chat messages!\n  chatMessage$: new Subject(),\n\n  // This stream will emit the latest viewer count!\n  viewerCount$: new Subject(),\n}\n")),Object(a.b)("h3",{id:"manager"},"Manager"),Object(a.b)("p",null,"Each store has a ",Object(a.b)("inlineCode",{parentName:"p"},"Manager")," component. The ",Object(a.b)("inlineCode",{parentName:"p"},"Manager")," component is responsible for providing the store's ",Object(a.b)("inlineCode",{parentName:"p"},"value")," object to its descendant components."),Object(a.b)("p",null,"You may choose to wrap your entire app in a single global store, or you may choose to have multiple stores scoped to specific sub-trees of your app, for example to give each team or feature its own store."),Object(a.b)("p",null,"When the ",Object(a.b)("inlineCode",{parentName:"p"},"Manager")," component is mounted, it runs or ",Object(a.b)("em",{parentName:"p"},"subscribe"),"s to the ",Object(a.b)("inlineCode",{parentName:"p"},"effects")," attached to it's store. When it is unmounted, it stops or ",Object(a.b)("em",{parentName:"p"},"unsubscribe"),"s from the ",Object(a.b)("inlineCode",{parentName:"p"},"effects"),"."),Object(a.b)("h3",{id:"effects"},"Effects"),Object(a.b)("p",null,"Effects are functions that return observables, which RxStore subscribes to. Effects react to events emitted by their ",Object(a.b)("inlineCode",{parentName:"p"},"sources"),", they can react by running any side effects, such as an http request. Effects can trigger events of their own by emitting on the ",Object(a.b)("inlineCode",{parentName:"p"},"sinks"),". To emit onto the ",Object(a.b)("inlineCode",{parentName:"p"},"sinks"),", just include the operator, such as ",Object(a.b)("inlineCode",{parentName:"p"},"sinks.chatMessage$()")," anywhere in your pipeline."),Object(a.b)("p",null,"Here is an example of an effect that echos the messages emitted on the ",Object(a.b)("inlineCode",{parentName:"p"},"chatMessage$")," source back onto the ",Object(a.b)("inlineCode",{parentName:"p"},"chatMessage$")," sink with 1 second delay:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-tsx"}),"export const effect = ({sources, sinks}) =>\n  sources.chatMessage$()\n    .pipe(\n      filter(message => message === 'ping')\n      mapTo('pong')\n      delay(1000),\n      sinks.chatMessage$()\n    )\n")),Object(a.b)("p",null,"The store's subjects are accessed via sources and sinks, which are read only and write only interfaces for the subjects. This allows Rx Store to track your data flow."),Object(a.b)("h3",{id:"components"},"Components"),Object(a.b)("p",null,"You can subscribe directly from your components. This allows you to re-render a component whenever a subject emits a value, or synchronize your component's state with your subject(s)."),Object(a.b)("p",null,"React Example:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-js"}),"function Component() {\n  const store = useStore(rootContext);\n\n  // render error / completion information\n  const [next, error, complete] = useSubscription(store.viewerCount$);\n\n  return (\n    <>\n      Latest viewer count: {next}\n      Stream had an error?: {error}\n      Stream is ended?: {complete}\n    </>\n  );\n}\n")),Object(a.b)("p",null,"Read more about the ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"/rx-store/docs/next/react/api-reference/use-subscription"}),"useSubscription hook")," in the API reference."))}u.isMDXComponent=!0},99:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return d}));var r=n(0),o=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=o.a.createContext({}),u=function(e){var t=o.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},b=function(e){var t=u(e.components);return o.a.createElement(p.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},m=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),b=u(n),m=r,d=b["".concat(s,".").concat(m)]||b[m]||l[m]||a;return n?o.a.createElement(d,c(c({ref:t},p),{},{components:n})):o.a.createElement(d,c({ref:t},p))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,s=new Array(a);s[0]=m;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c.mdxType="string"==typeof e?e:r,s[1]=c;for(var p=2;p<a;p++)s[p]=n[p];return o.a.createElement.apply(null,s)}return o.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);