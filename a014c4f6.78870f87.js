(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{80:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return s})),n.d(t,"rightToc",(function(){return i})),n.d(t,"default",(function(){return p}));var r=n(2),a=n(6),o=(n(0),n(93)),c={id:"command-streams",title:"Command Subjects"},s={unversionedId:"core/guides/command-streams",id:"core/guides/command-streams",isDocsHomePage:!1,title:"Command Subjects",description:"Commands can be represented in your store value by having a subject used for emitting an event which triggers something to happen in other part(s) of the app.",source:"@site/docs/core/guides/command-streams.md",permalink:"/rx-store/docs/core/guides/command-streams",editUrl:"https://github.com/rx-store/rx-store/tree/master/apps/rx-store-website/docs/core/guides/command-streams.md",sidebar:"core",previous:{title:"Store State In A Stream",permalink:"/rx-store/docs/core/guides/store-state-in-a-stream"},next:{title:"Manipulating Time",permalink:"/rx-store/docs/core/guides/manipulate-time"}},i=[{value:"Example",id:"example",children:[]},{value:"Advantages",id:"advantages",children:[]}],u={rightToc:i};function p(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},u,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"Commands can be represented in your ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://rxjs-dev.firebaseapp.com/guide/subject"}),"store value")," by having a subject used for emitting an event which triggers something to happen in other part(s) of the app."),Object(o.b)("h2",{id:"example"},"Example"),Object(o.b)("p",null,'In a social network app you may have "refetch news feed" effect which emits "commands" (represented by any value) onto a ',Object(o.b)("inlineCode",{parentName:"p"},"refetchNewsFeed$")," subject."),Object(o.b)("p",null,"In this hypothetical social network app, a second effect will responed to the commands emitted on the ",Object(o.b)("inlineCode",{parentName:"p"},"refetchNewsFeed$")," subject by fetching the latest news feed data, and emitting onto a ",Object(o.b)("inlineCode",{parentName:"p"},"newsFeedPost$")," subject with the results of the command."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"const refetchNewsFeed$ = new Subject();\nrefetchNewsFeed$.next(true); // actual value isn't used / doesn't matter\n")),Object(o.b)("h2",{id:"advantages"},"Advantages"),Object(o.b)("p",null,'The advantage of this decoupling is that your effects do not need to be aware of all the places they can be triggered. Your "refetch news feed" logic can live in a simple effect that only knows about the trigger subject, and the subject where it emits the results. Later on, if the logic to trigger refetching the news feed becomes quite complex, it will stay naturally decoupled from the logic to actually perform the refetching.'),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"export const effect = ({ sources, sinks }) =>\n  sources.refetchNewsFeed$().pipe(\n    mergeMap((request) => makeRequest),\n    sinks.newsFeed$()\n  );\n")))}p.isMDXComponent=!0},93:function(e,t,n){"use strict";n.d(t,"a",(function(){return l})),n.d(t,"b",(function(){return b}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=a.a.createContext({}),p=function(e){var t=a.a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},l=function(e){var t=p(e.components);return a.a.createElement(u.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,c=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),l=p(n),m=r,b=l["".concat(c,".").concat(m)]||l[m]||d[m]||o;return n?a.a.createElement(b,s(s({ref:t},u),{},{components:n})):a.a.createElement(b,s({ref:t},u))}));function b(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,c=new Array(o);c[0]=m;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,c[1]=s;for(var u=2;u<o;u++)c[u]=n[u];return a.a.createElement.apply(null,c)}return a.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);