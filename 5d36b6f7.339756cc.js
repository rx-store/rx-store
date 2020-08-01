(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{159:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return a})),r.d(t,"metadata",(function(){return s})),r.d(t,"rightToc",(function(){return i})),r.d(t,"default",(function(){return l}));var n=r(2),o=r(11),c=(r(0),r(177)),a={id:"rxjs-concepts",title:"RxJS Concepts"},s={id:"introduction/rxjs-concepts",isDocsHomePage:!1,title:"RxJS Concepts",description:"Subjects",source:"@site/docs/introduction/rxjs-concepts.md",permalink:"/rx-store/docs/introduction/rxjs-concepts",editUrl:"https://github.com/rx-store/rx-store/edit/master/website/docs/introduction/rxjs-concepts.md",sidebar:"someSidebar",previous:{title:"Getting Started with Rx Store",permalink:"/rx-store/docs/introduction/getting-started"},next:{title:"Installation",permalink:"/rx-store/docs/introduction/installation"}},i=[{value:"Subjects",id:"subjects",children:[]},{value:"Observables",id:"observables",children:[]}],b={rightToc:i};function l(e){var t=e.components,r=Object(o.a)(e,["components"]);return Object(c.b)("wrapper",Object(n.a)({},b,r,{components:t,mdxType:"MDXLayout"}),Object(c.b)("h3",{id:"subjects"},"Subjects"),Object(c.b)("p",null,Object(c.b)("a",Object(n.a)({parentName:"p"},{href:"https://rxjs-dev.firebaseapp.com/guide/subject"}),"RxJS Subjects")," are simple event emitters. In ",Object(c.b)("inlineCode",{parentName:"p"},"Rx Store"),", these event emitters are the most primitive source of truth for your app."),Object(c.b)("p",null,"To see how you can model state with a stream, we'll create a counter app where we will use a subject acting as a stream of the latest state, in this case a ",Object(c.b)("inlineCode",{parentName:"p"},"count"),". We suffix the name ",Object(c.b)("inlineCode",{parentName:"p"},"count$")," with ",Object(c.b)("inlineCode",{parentName:"p"},"$")," to indicate it is a stream of ",Object(c.b)("inlineCode",{parentName:"p"},"count")," values that can be subscribed to."),Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-tsx"}),'import { Subject } from "rxjs";\n\nconst store = {\n  count$: new Subject(),\n};\n\nstore.count$.subscribe(console.log);\n\nstore.count$.next(123);\n')),Object(c.b)("p",null,Object(c.b)("a",Object(n.a)({parentName:"p"},{href:"/rx-store/docs/basics/subjects"}),"Read more about subjects in Rx Store"),"."),Object(c.b)("h3",{id:"observables"},"Observables"),Object(c.b)("p",null,"With observables, we will combine, process, and manipulate time declaratively. Observables can source data from subjects, as well as any external sources of data coming from outside of ",Object(c.b)("inlineCode",{parentName:"p"},"Rx Store")," including but not limited to callbacks, promises, other streams libraries, etc."),Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-tsx"}),"const myClicks$ = new Subject();\nconst yourClicks$ = new Subject();\n\n// observable derived from 2 subjects:\nconst bothClicks$ = merge(myClick$, yourClick$).pipe(delay(100));\n\nconst store = {\n  myClick$,\n  yourClick$,\n  bothClick$,\n  timerA$,\n  timerB$,\n};\n")),Object(c.b)("p",null,"Observables, just like subjects, can be subscribed to, ",Object(c.b)("a",Object(n.a)({parentName:"p"},{href:"/rx-store/docs/basics/observables"}),"read more about observables in Rx Store"),"."))}l.isMDXComponent=!0},177:function(e,t,r){"use strict";r.d(t,"a",(function(){return u})),r.d(t,"b",(function(){return d}));var n=r(0),o=r.n(n);function c(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){c(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},c=Object.keys(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var b=o.a.createContext({}),l=function(e){var t=o.a.useContext(b),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},u=function(e){var t=l(e.components);return o.a.createElement(b.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},m=o.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,c=e.originalType,a=e.parentName,b=i(e,["components","mdxType","originalType","parentName"]),u=l(r),m=n,d=u["".concat(a,".").concat(m)]||u[m]||p[m]||c;return r?o.a.createElement(d,s(s({ref:t},b),{},{components:r})):o.a.createElement(d,s({ref:t},b))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var c=r.length,a=new Array(c);a[0]=m;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,a[1]=s;for(var b=2;b<c;b++)a[b]=r[b];return o.a.createElement.apply(null,a)}return o.a.createElement.apply(null,r)}m.displayName="MDXCreateElement"}}]);