(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{64:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return c})),r.d(t,"metadata",(function(){return i})),r.d(t,"rightToc",(function(){return s})),r.d(t,"default",(function(){return p}));var n=r(2),o=r(6),a=(r(0),r(92)),c={id:"manipulate-time",title:"Manipulating Time"},i={unversionedId:"core/guides/manipulate-time",id:"core/guides/manipulate-time",isDocsHomePage:!1,title:"Manipulating Time",description:"Here is an effect that subscribes to the count$ source, it delays each value by one second, and logs them to console as a side effect.",source:"@site/docs/core/guides/manipulate-time.md",permalink:"/rx-store/docs/core/guides/manipulate-time",editUrl:"https://github.com/rx-store/rx-store/tree/master/apps/rx-store-website/docs/core/guides/manipulate-time.md",sidebar:"core",previous:{title:"State vs Events",permalink:"/rx-store/docs/core/guides/state-vs-events"},next:{title:"Recursive effects",permalink:"/rx-store/docs/core/guides/recursive-effects"}},s=[],u={rightToc:s};function p(e){var t=e.components,r=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(n.a)({},u,r,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,"Here is an effect that subscribes to the ",Object(a.b)("inlineCode",{parentName:"p"},"count$")," source, it delays each value by one second, and logs them to console as a side effect."),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-tsx"}),"export const effect = ({ sources }) =>\n  sources.count$().pipe(delay(1000), tap(console.log));\n")),Object(a.b)("p",null,"Here is an effect that emits a monotonically increasing value onto ",Object(a.b)("inlineCode",{parentName:"p"},"count$"),", every second:"),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"export const effect = ({ sinks }) => timer(1000).pipe(sinks.count$());\n")),Object(a.b)("p",null,"You can also use any of the plethora of ",Object(a.b)("a",Object(n.a)({parentName:"p"},{href:"https://rxjs-dev.firebaseapp.com/guide/operators"}),"RxJS operators")," or make your own operators that wrap some imperative async logic."))}p.isMDXComponent=!0},92:function(e,t,r){"use strict";r.d(t,"a",(function(){return l})),r.d(t,"b",(function(){return b}));var n=r(0),o=r.n(n);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=o.a.createContext({}),p=function(e){var t=o.a.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},l=function(e){var t=p(e.components);return o.a.createElement(u.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},m=o.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,a=e.originalType,c=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),l=p(r),m=n,b=l["".concat(c,".").concat(m)]||l[m]||f[m]||a;return r?o.a.createElement(b,i(i({ref:t},u),{},{components:r})):o.a.createElement(b,i({ref:t},u))}));function b(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=r.length,c=new Array(a);c[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:n,c[1]=i;for(var u=2;u<a;u++)c[u]=r[u];return o.a.createElement.apply(null,c)}return o.a.createElement.apply(null,r)}m.displayName="MDXCreateElement"}}]);